import type { QualificationPayload } from "@/lib/schema";

/**
 * Durable hand-off seam for a validated lead — the clean internal
 * boundary the `POST /api/qualify` route hands off to once a payload
 * passes server-side validation. Resolves `true` only once the lead
 * is *durably* recorded, which is what lets the endpoint report
 * success and the modal's success screen light up honestly.
 *
 * Interim behavior, locked (Sprint 02 Unit 01): no destination is
 * wired yet — the Google Sheet + Asana "Inbound Leads" project are
 * Unit 02 (`feature/lead-destination`), the notification emails are
 * Unit 03. With nowhere durable to put a lead, this resolves `false`,
 * so the endpoint reports not-ok and the modal's honest failure-
 * fallback stands (Business Rules 2.7). **No fake success** — Units
 * 01 + 02 together are what close the leak (sprint plan; Unit 02
 * Outcome 2 fills this seam to flip success on).
 */
export async function deliverLead(
  payload: QualificationPayload,
): Promise<boolean> {
  void payload; // delivered to the Sheet + Asana once Unit 02 wires the destination
  return false;
}
