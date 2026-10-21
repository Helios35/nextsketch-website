import type { LeadPayload } from "@/lib/schema";

export interface QualifyResult {
  ok: boolean;
  /**
   * The ID the server minted for a step 1 lead (decision-log #65), which
   * step 2 sends back to attach its answers. Absent on every other kind.
   */
  leadId?: string;
}

/**
 * Submit seam for the modal and the waitlist band — posts a validated
 * entry to `POST /api/qualify` (docs/07-technical-spec.md §API) and maps
 * the response. Carries every kind, discriminated by `LeadPayload["kind"]`:
 * the modal's step 1 and its step 2 follow-up (decision-log #65), and
 * the waitlist band's email (decision-log #58). The contract
 * every caller builds against is unchanged: resolve `{ ok }` or throw,
 * and the caller runs the Rule 2.7 preserve-and-fallback on anything
 * but `ok: true`.
 *
 * A non-2xx response resolves `{ ok: false }` (the server's honest
 * verdict — validation, an unwired/unreachable destination, or a
 * provider failure); a genuine network error throws and the modal's
 * catch runs the same fallback. The endpoint only reports `ok: true`
 * once a lead is durably handed off, so there is no fake success.
 */
export async function submitQualification(
  payload: LeadPayload,
): Promise<QualifyResult> {
  const response = await fetch("/api/qualify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    return { ok: false };
  }
  const data: unknown = await response.json();
  if (typeof data !== "object" || data === null) return { ok: false };
  const { ok, lead_id } = data as { ok?: unknown; lead_id?: unknown };
  return typeof lead_id === "string"
    ? { ok: ok === true, leadId: lead_id }
    : { ok: ok === true };
}
