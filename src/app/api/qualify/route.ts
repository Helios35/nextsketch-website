import { after } from "next/server";

import { deliverLead } from "@/lib/lead-delivery";
import { notifyLead } from "@/lib/lead-notify";
import { qualificationPayloadSchema } from "@/lib/schema";

/**
 * POST /api/qualify — the site's only server-side surface
 * (docs/07-technical-spec.md §API; no database, no auth — owner
 * decision). Receives a completed qualification, re-validates it with
 * the shared `qualificationPayloadSchema`, and hands the lead to the
 * durable delivery seam.
 *
 * Server-side re-validation is the security boundary: the schema's
 * enums exclude the "exploring" answers, require an empty honeypot,
 * and require `_t >= 3000`, so off-ramp, honeypot, and sub-3s
 * submissions are rejected here even on a direct POST that bypasses
 * the client (Business Rules 2.1, 2.8 — exactly what the schema's own
 * comment promises).
 *
 * Reports `{ ok }` honestly: success only once `deliverLead` durably
 * records the lead in the Google Sheet (Unit 02 wired the Sheet +
 * Asana destinations). If the durable record is unreachable — or not
 * yet configured — it resolves not-ok, the modal runs its Rule 2.7
 * preserve-and-fallback, and no fake success is ever shown.
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    // Malformed or absent JSON — treat as a rejected submission.
    return Response.json({ ok: false }, { status: 400 });
  }

  const parsed = qualificationPayloadSchema.safeParse(body);
  if (!parsed.success) {
    // Off-ramp values, a tripped honeypot, a sub-threshold completion
    // time, or any malformed field reject here. Generic body on
    // purpose: never tell a probe which guard tripped.
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    const delivered = await deliverLead(parsed.data);
    if (delivered) {
      // Notify only once the lead is durably recorded (Unit 03): fire
      // the auto-reply + Nate's alert via `after()` so they run after
      // the response is sent. Best-effort by construction — an email
      // failure can never block or reverse a capture that already
      // succeeded (brief Outcome 4); we never acknowledge a lead that
      // wasn't stored (Scope Guardrail).
      after(() => notifyLead(parsed.data));
    }
    // No fake success: ok:true only once the lead is durably recorded.
    // 503 when it isn't (destination unreachable or not yet
    // configured) so the client treats it as not-ok (Rule 2.7).
    return Response.json({ ok: delivered }, { status: delivered ? 200 : 503 });
  } catch (error) {
    // Structured failure, no stack trace to the client; logged for
    // Vercel (docs/07-technical-spec.md §Error handling).
    console.error("qualify: lead delivery failed", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
