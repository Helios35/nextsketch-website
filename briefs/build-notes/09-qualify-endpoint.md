# Build Note 09 — Qualify Endpoint (Sprint 02 · Unit 01)

**Date:** 2026-06-18 · **Branch:** `feature/qualify-endpoint` · **Sprint 02 (Lead Capture) Unit 01.**
**Status:** Committed locally, **not pushed / no PR** (per owner policy — Nate opens the PR after he verifies).

## What changed

Replaced the dead submit seam (`submitQualification` hardcoded to `{ ok: false }`) with a real server endpoint. A completed qualification now travels to `POST /api/qualify`, is **re-validated server-side**, and is handed to a clean internal delivery seam. The `{ ok }` contract the modal builds against is untouched, so its success / failure / preserve-answers behavior (Rule 2.7) needed no change.

This is the **receive + validate + hand-off** slice only. It does **not** close the leak by itself — there is no durable destination yet, so a valid lead honestly resolves not-ok and the modal shows the failure-fallback. Units 01 + 02 together close the leak (Unit 02 fills the seam; that is what flips success on — Unit 02 Outcome 2).

## Files

- **New:** `src/app/api/qualify/route.ts` — the `POST` Route Handler (Next.js 16, native `Request`/`Response`). Parses JSON, re-validates with the existing `qualificationPayloadSchema`, hands the lead to `deliverLead`, maps the result to `{ ok }`.
- **New:** `src/lib/lead-delivery.ts` — `deliverLead(payload): Promise<boolean>`, the durable hand-off seam. Intentionally returns `false` in Unit 01 (no destination wired). **This is the seam Unit 02 fills** and Unit 03 fires emails off of — a discrete, named boundary so neither has to fork the endpoint.
- **Modified:** `src/lib/qualify.ts` — `submitQualification` now `fetch`-POSTs the validated payload to `/api/qualify` and maps the response to `{ ok }`. Non-2xx → `{ ok: false }` (the server's honest verdict); a genuine network error throws and the modal's catch runs the same Rule 2.7 fallback. Doc comment updated.

## Decisions / judgment calls

- **No fake success (governing).** The endpoint reports `ok: true` only once a lead is durably handed off. With the destination unwired, `deliverLead` returns `false` → the route returns `503 { ok: false }` → the modal shows the honest failure-fallback with answers preserved. This is the designed Unit-01 behavior, not a regression. ⚠️ **For Nate:** the Unit-01 builder-verification bullet "a completed valid submission no longer forces the failure screen" is in tension with sprint Outcome 4 / Unit 02 Outcome 2 ("the honest failure-fallback still stands until Unit 02 wires the destination"). I resolved it in favor of *no fake success*: the failure is no longer **forced by a client-side hardcode** — it is now the real endpoint's honest verdict — but a valid submit still shows the failure screen until Unit 02 lands. Flagging rather than resolving silently.
- **Hand-off seam as its own module.** `src/lib/lead-delivery.ts` rather than an inline function in the route, so Unit 02 ("reuse the Unit 01 hand-off seam; do not fork the endpoint") has a clean target and Unit 03 has a home. One extra small file; judged the right "clean internal seam" the brief calls for.
- **Server-side validation is the whole guard.** `qualificationPayloadSchema.safeParse` on the server rejects off-ramp values (enums exclude `exploring`, Rule 2.1), a tripped honeypot (`_hp` must be empty, Rule 2.8) and sub-3s timing (`_t ≥ 3000`, Rule 2.8) — so a direct POST cannot bypass the off-ramp. The response body is a generic `{ ok: false }` on every rejection: a probe is never told which guard tripped.
- **Status codes:** `200 {ok:true}` delivered · `400 {ok:false}` validation/malformed-JSON · `503 {ok:false}` valid-but-not-yet-deliverable (the Unit-01 state) · `405` for non-POST (Next default). The modal only reads `ok` + HTTP-ok, so the exact codes don't affect UX.

## Deviations from the stale spec (flagged for Sprint 03 doc audit — not fixed now)

The brief says deviations from `docs/07-technical-spec.md` §API get flagged for the Sprint 03 audit, not rewritten. Noted:

1. **§API "Does" is pre-pivot.** It describes the endpoint *building and sending the lead email via Resend* as the single action. Sprint 02 re-architected this into Unit 01 (endpoint + validate + seam) → Unit 02 (Google Sheet + Asana destination) → Unit 03 (Resend notify). The email is no longer the durable record.
2. **Status set differs.** Spec lists `200 / 400 {ok:false,error} / 429 / 500`. Implemented set adds `503` (honest Unit-01 not-yet-deliverable) and returns a bodyless-`error` generic `{ ok: false }` (deliberate, to avoid telling probes which guard failed). The client ignores `error`.
3. **Rate limit (429 / "5/hour in-memory per IP") not implemented.** It is **not** in Unit 01's stated Outcomes or verification (which enumerate exactly: off-ramp, honeypot, too-fast). In-memory per-IP limiting is also unreliable on Vercel serverless (no shared state across lambda instances). **Recommendation:** treat as its own small unit with a real shared store (or Vercel's rate-limit primitives) if wanted; it is not a leak-stopper. Deferred, flagged — not silently dropped.
4. **No application-level request-body size cap.** `request.json()` buffers the body before the schema's length caps apply; there's no `Content-Length` guard or `maxDuration`. Low severity — Vercel's platform body limit (~4.5 MB) bounds it, and the schema caps every field. Same abuse-hardening bucket as the rate limit (§3); noted here so it travels with that decision rather than getting fixed ad-hoc in this unit. *(Surfaced by an adversarial review pass; verified out of Unit-01 scope.)*

## Verification

- **Gates (local):** `lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (route registered as `ƒ /api/qualify`, dynamic) · `banned-terms` ✓ (26 files — no new copy surface).
- **Endpoint probes (dev server, same-origin `fetch`):** valid qualified → `503 {ok:false}` (no fake success) · off-ramp `project_type:"exploring"` → `400` · tripped honeypot → `400` · `_t:500` too-fast → `400` · malformed JSON → `400` (graceful, no 500) · missing required → `400` · `GET` → `405`. Server logged the exact sequence; **no server errors / no leaked stack traces**.
- **End-to-end modal (desktop):** opened the modal from the hero CTA, completed the qualified path (new_product / now / full / validated, name + email), submitted. The real submit hit `POST /api/qualify → 503`; the modal showed the **failure-fallback** ("That didn't go through — your answers are safe.") with **all answers preserved** and the escape hatch present (Rule 2.7). No browser console errors.

## Open for Nate

1. **The judgment call above** — confirm the "no fake success / valid submit still shows failure until Unit 02" reading is what you want for the Unit-01 review gate.
2. **Rate limiting** — deferred (see deviations §3). Confirm it should be its own unit, not bolted into this endpoint.
3. **No push / no PR** — committed to `feature/qualify-endpoint` only; open the PR when you've verified.
