import { after } from "next/server";

import { deliverLead, updateLead } from "@/lib/lead-delivery";
import { notifyFollowup, notifyLead } from "@/lib/lead-notify";
import { leadPayloadSchema } from "@/lib/schema";

/**
 * POST /api/qualify — the site's only server-side surface
 * (docs/07-technical-spec.md §API; no database, no auth — owner
 * decision). Receives the email-first modal's two steps (decision-log
 * #65: step 1's email and offerings, which is the lead, and step 2's
 * optional answers, which attach to it) or a waitlist email from the
 * Services band (#58), re-validates it with the shared
 * `leadPayloadSchema`, and hands it to the durable delivery seam. Still
 * the only server-side surface (#8).
 *
 * Server-side re-validation is the security boundary: the discriminated
 * union enforces the right shape per `kind`, and every kind requires an
 * empty honeypot and `_t >= 3000`, so honeypot and sub-3s submissions
 * are rejected here even on a direct POST that bypasses the client
 * (Business Rules 2.8 — exactly what the schema's own comment promises).
 *
 * Step 1 answers `{ ok: true, lead_id }`: the random ID minted here and
 * written on the Sheet row. The browser sends it back with step 2, which
 * updates that row (no second row) and alerts Nate once more; a step 2
 * that doesn't match a row reports not-ok.
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

  const parsed = leadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    // An unknown `kind`, off-ramp values on the qualifier, a tripped
    // honeypot, a sub-threshold completion time, or any malformed field
    // reject here. Generic body on purpose: never tell a probe which
    // guard tripped.
    return Response.json({ ok: false }, { status: 400 });
  }

  const payload = parsed.data;

  if (payload.kind === "followup") {
    // Step 2 (#65): attach to the step 1 row. Same honesty: ok only once
    // the row is updated; the follow-up alert goes after the response.
    const updated = await updateLead(payload);
    if (updated) after(() => notifyFollowup(payload));
    return Response.json({ ok: updated }, { status: updated ? 200 : 503 });
  }

  // Step 1 is the lead step 2 can attach to, so it gets an ID; a
  // waitlist entry is never followed up and gets none.
  const leadId = payload.kind === "quick" ? crypto.randomUUID() : "";

  try {
    const delivered = await deliverLead(payload, leadId);
    if (delivered) {
      // Notify only once the lead is durably recorded (Unit 03): fire
      // the auto-reply + Nate's alert via `after()` so they run after
      // the response is sent. Best-effort by construction — an email
      // failure can never block or reverse a capture that already
      // succeeded (brief Outcome 4); we never acknowledge a lead that
      // wasn't stored (Scope Guardrail).
      after(() => notifyLead(payload, leadId));
    }
    // No fake success: ok:true only once the lead is durably recorded.
    // 503 when it isn't (destination unreachable or not yet
    // configured) so the client treats it as not-ok (Rule 2.7).
    return delivered
      ? Response.json(leadId ? { ok: true, lead_id: leadId } : { ok: true })
      : Response.json({ ok: false }, { status: 503 });
  } catch (error) {
    // Structured failure, no stack trace to the client; logged for
    // Vercel (docs/07-technical-spec.md §Error handling).
    console.error("qualify: lead delivery failed", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
