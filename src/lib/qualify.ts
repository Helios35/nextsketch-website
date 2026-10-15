import type { LeadPayload } from "@/lib/schema";

export interface QualifyResult {
  ok: boolean;
}

/**
 * Submit seam for the modal and the waitlist band — posts a validated
 * entry to `POST /api/qualify` (docs/07-technical-spec.md §API) and maps
 * the response. Carries every kind, discriminated by `LeadPayload["kind"]`:
 * the full qualifier, the quick path / off-ramp capture (Sprint 02 Unit
 * 04), and the waitlist band's email (decision-log #58). The contract
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
  const ok =
    typeof data === "object" &&
    data !== null &&
    (data as { ok?: unknown }).ok === true;
  return { ok };
}
