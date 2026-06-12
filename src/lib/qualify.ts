import type { QualificationPayload } from "@/lib/schema";

export interface QualifyResult {
  ok: boolean;
}

/**
 * Submit seam for the qualification modal. Sprint 02 replaces the
 * body with `POST /api/qualify` (docs/07-technical-spec.md §API
 * design) and maps the response; the contract the modal builds
 * against — resolve `{ ok }` or throw, caller runs the Rule 2.7
 * preserve-and-fallback on anything but `ok: true` — stays unchanged.
 *
 * Interim behavior, locked: no API exists yet (sprint plan Decision 2,
 * docs/decision-log.md #6), so every completed submit resolves not-ok
 * and the modal shows the failure-fallback with the composed answers
 * preserved. No fake success.
 */
export async function submitQualification(
  payload: QualificationPayload,
): Promise<QualifyResult> {
  void payload; // consumed when Sprint 02 posts it to /api/qualify
  return { ok: false };
}
