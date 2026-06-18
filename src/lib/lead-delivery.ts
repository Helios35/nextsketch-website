import { toAsanaTask, toSheetRecord } from "@/lib/lead-format";
import type { QualificationPayload } from "@/lib/schema";

/**
 * Outbound timeouts (`AbortSignal.timeout`) so a hung destination can
 * never hold the serverless function open to its platform limit. The
 * Sheet gates success, so it gets the longer bound (Apps Script can be
 * slow to wake); Asana is best-effort, so it is bounded tighter to cap
 * the latency a slow Asana adds to the capture response.
 */
const SHEET_TIMEOUT_MS = 10_000;
const ASANA_TIMEOUT_MS = 8_000;

/**
 * Safe error text for logs: error name + message only, never the raw
 * thrown value (whose `cause` chain could carry sensitive detail).
 * Keeps the Vercel logs useful without risking a leak (secrets rule).
 */
function errMsg(reason: unknown): string {
  return reason instanceof Error
    ? `${reason.name}: ${reason.message}`
    : String(reason);
}

/**
 * Durable hand-off seam for a validated lead (Sprint 02 Unit 02) — the
 * boundary `POST /api/qualify` hands a validated payload to. Two
 * destinations, no more (sprint plan Decision 2 — no CRM/HubSpot/
 * Klaviyo path):
 *
 *   • Google Sheet "Inbound Leads" — the **durable system of record**,
 *     the row Nate scans. A capture succeeds only once this row is
 *     written; that is what finally lights the modal's success screen
 *     honestly and closes the Unit 01 seam (Unit 02 Outcome 2).
 *   • Asana "Inbound Leads" project — the **best-effort action item**,
 *     the task Nate works. Attempted on every capture; a failure is
 *     logged but never fails the capture, because the lead is already
 *     safe in the durable record.
 *
 * Resiliency choice (the brief asked us to pick the option that best
 * honors "never lose a lead" and surface it): the Sheet gates success;
 * Asana is best-effort. Every reported success is therefore genuinely,
 * durably recorded, and a flaky Asana can never manufacture a false
 * failure for a lead that *was* saved — which would needlessly push a
 * captured visitor to the escape hatch or a duplicate retry. (See
 * build-note 10 for the alternatives considered.)
 *
 * No fake success (governing, inherited from Unit 01): if the Sheet is
 * unreachable — or, in the interim, not yet configured — this resolves
 * `false`, the route reports not-ok, and the modal runs its Rule 2.7
 * preserve-and-fallback. All credentials and destination identifiers
 * come from environment variables; nothing sensitive is committed.
 *
 * Server-only: imported solely by the route handler and reads secret
 * env vars (no `NEXT_PUBLIC_` prefix) — it must never reach the client.
 */
export async function deliverLead(
  payload: QualificationPayload,
): Promise<boolean> {
  const capturedAt = new Date().toISOString();

  // Attempt both destinations concurrently; `allSettled` so one
  // throwing can never short-circuit the other — the lead should reach
  // as many destinations as possible regardless of partial failure.
  const [sheetResult, asanaResult] = await Promise.allSettled([
    writeLeadToSheet(payload, capturedAt),
    createAsanaTask(payload, capturedAt),
  ]);

  const sheetOk =
    sheetResult.status === "fulfilled" && sheetResult.value === true;
  const asanaOk =
    asanaResult.status === "fulfilled" && asanaResult.value === true;

  if (sheetResult.status === "rejected") {
    console.error("lead-delivery: Sheet write threw —", errMsg(sheetResult.reason));
  }
  if (asanaResult.status === "rejected") {
    console.error("lead-delivery: Asana task threw —", errMsg(asanaResult.reason));
  }

  // Surface partial outcomes to the Vercel logs (runbook Monitoring:
  // "silent pipeline failure is failure mode #1"). Never a silent drop.
  if (sheetOk && !asanaOk) {
    console.error(
      "lead-delivery: lead recorded in Sheet but Asana task NOT created — lead is safe, action item missing",
    );
  } else if (!sheetOk && asanaOk) {
    console.error(
      "lead-delivery: Asana task created but Sheet write FAILED — durable record missing; capture reported not-ok so the visitor keeps their answers (Rule 2.7)",
    );
  }

  return sheetOk;
}

/**
 * Append the lead as a row in the "Inbound Leads" Google Sheet via the
 * owner-provided Apps Script web-app webhook (sprint plan owner setup
 * checklist). A single POST of the formatted record; the bound script
 * appends the row and must answer 2xx on success. Chosen over a
 * service account + `googleapis` to keep the diff small and add no
 * dependency (governing "smallest diff" rule). A missing URL or any
 * non-2xx resolves `false` so the capture reports not-ok — no fake
 * success while the destination is unconfigured.
 */
async function writeLeadToSheet(
  payload: QualificationPayload,
  capturedAt: string,
): Promise<boolean> {
  const webhookUrl = process.env.LEADS_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error(
      "lead-delivery: LEADS_SHEET_WEBHOOK_URL not set — cannot durably record the lead, so the capture reports not-ok (no fake success). Set it in Vercel env (sprint plan owner setup checklist).",
    );
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toSheetRecord(payload, capturedAt)),
    cache: "no-store",
    signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
  });

  if (!response.ok) {
    console.error(`lead-delivery: Sheet webhook responded ${response.status}`);
    return false;
  }
  return true;
}

/**
 * Open a task in the Asana "Inbound Leads" project for the lead via the
 * Asana REST API, authenticated with the owner-provided personal
 * access token + project id (sprint plan owner setup checklist).
 * Best-effort: a missing config or any failure resolves `false` and is
 * logged, but never fails the capture — the Sheet is the durable
 * record.
 */
async function createAsanaTask(
  payload: QualificationPayload,
  capturedAt: string,
): Promise<boolean> {
  const token = process.env.ASANA_ACCESS_TOKEN;
  const projectId = process.env.ASANA_PROJECT_ID;
  if (!token || !projectId) {
    console.error(
      "lead-delivery: ASANA_ACCESS_TOKEN / ASANA_PROJECT_ID not set — skipping the Asana task (best-effort). Set both in Vercel env (sprint plan owner setup checklist).",
    );
    return false;
  }

  const task = toAsanaTask(payload, capturedAt);
  const response = await fetch("https://app.asana.com/api/1.0/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: { name: task.name, notes: task.notes, projects: [projectId] },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(ASANA_TIMEOUT_MS),
  });

  if (!response.ok) {
    console.error(`lead-delivery: Asana API responded ${response.status}`);
    return false;
  }
  return true;
}
