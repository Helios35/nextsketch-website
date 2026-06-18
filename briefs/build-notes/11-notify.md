# Build Note 11 — Notify (Sprint 02 · Unit 03)

**Date:** 2026-06-18 · **Branch:** `feature/notify` · **Sprint 02 (Lead Capture) Unit 03.**
**Status:** Committed and pushed to `origin/feature/notify`; **no PR** (per owner policy — Nate opens the PR after he verifies). Feature-branch push = Vercel **preview** deploy only; production is `main`. Per Decision 6 this merges before Unit 04 starts.
**Blocked-but-shipped:** the owner-provided Resend credentials don't exist yet (sprint plan setup checklist is unchecked), so this is built fully against the seam and verified against a local Resend mock — flagged back in *Open for Nate*. No credentials were invented; with no key, notification is skipped and the lead is still captured.

## What changed

Every **durably captured** lead now gets two emails via Resend (Decision 3): an **instant auto-reply to the lead** and a **real-time alert to Nate**. Both fire from the route's hand-off point through Next.js's `after()`, so they run *after* the response is sent and are best-effort by construction — an email failure can never block or reverse a capture that already succeeded (brief Outcome 4). Notification is gated on `delivered === true`, so a lead that wasn't stored (a 503) is never acknowledged (Scope Guardrail).

The auto-reply honors the exact promise the modal's success screen makes (`MODAL_SUCCESS`: "you'll hear from Nathan within two business days"). The alert reuses the Unit 02 formatter — `leadSignal` for the Rule 2.5 subject flag and the canonical `labelFor` for the answer labels — so the inbox can't drift from what the visitor saw or from the Sheet/Asana record.

## Files

- **New:** `src/content/email.ts` — the auto-reply + alert copy (DRAFT, brand voice). Lives on the `src/content/*` surface the banned-terms gate scans. `LEAD_AUTOREPLY` (subject, first-name greeting fn, heading, body, signoff) and `LEAD_ALERT` (intro, reply hint, answers heading, captured label).
- **New:** `src/lib/lead-notify.ts` — `notifyLead(payload)`. Resolves the sender (branded vs interim), then sends the auto-reply and alert concurrently via `Promise.allSettled` (one failing can't stop the other). Builds `text` + `html` for both; HTML user fields are escaped (injection-safe). Resend send errors are checked on the `{ error }` return and logged sanitized (typed code + status + message, never a raw object — secrets rule). All identifiers/secrets from `process.env`. Server-only.
- **Modified:** `src/app/api/qualify/route.ts` — after a durable capture, `after(() => notifyLead(parsed.data))` (import from `next/server`). Only when `delivered` is true; the `{ ok }` mapping and status codes are unchanged.
- **Modified:** `src/lib/lead-format.ts` — exported `labelFor` (was private) so notify resolves answer labels from the **same** resolver the Sheet/Asana records use. One-word change; no logic touched.
- **Modified:** `docs/07-technical-spec.md` (§API + env) and `docs/08-runbook.md` (Monitoring) — ⚠️ flag notes for the **Sprint 03 doc audit** per the brief. Not a rewrite of the stale docs.

## Decisions / judgment calls

- **Fire via `after()`, not inline before the response.** Next.js 16's `after()` (stable since 15.1; on Vercel it extends the invocation via `waitUntil`) runs the callback after the response is flushed. This is the cleanest realization of the brief's two hard constraints at once: notification adds **zero latency** to the capture response, and a slow/failing Resend **cannot** block or reverse the capture (best-effort, Outcome 4). It also keeps the route's existing `{ ok }` contract and status codes untouched. *Alternative — await the sends inside `deliverLead`/the route before responding:* rejected; it couples notification latency and failure modes to the capture response for no benefit (the lead is already durably stored).
- **Notify gated on `delivered === true`.** The `after()` call sits inside `if (delivered)`, so a not-ok capture (validation reject → 400, or durable store unreachable → 503) never sends an acknowledgment. Directly enforces "do not acknowledge a lead that wasn't stored." Verified both branches below.
- **Reuse `leadSignal` + export `labelFor` rather than re-derive labels or couple to the Asana formatter.** The lead-format doc comment already anticipated Unit 03 reusing `leadSignal` for the subject and "the same labels for the body." Exporting the one canonical resolver (a one-word diff) is the literal realization — labels can't drift across destinations because there is one resolver, one source (`MODAL_QUESTIONS`, Taxonomy §3). *Alternative — reuse `toAsanaTask().notes` wholesale as the alert body:* rejected; it would couple the email's presentation to the Asana task's shape. *Alternative — a local label resolver in notify:* rejected; two resolvers is the exact drift risk the module was built to prevent.
- **Sender: `LEAD_FROM_EMAIL` if set, else Resend's interim `onboarding@resend.dev` (Decision 3).** Email works on launch day with no hard DNS dependency; swap to the branded sender by setting one env var once the domain verifies. The interim fallback is logged (`console.warn`) on every send so the interim state is never silent. **Known interim caveat (flagged):** while sending from the shared onboarding domain, Resend may restrict the **lead auto-reply** to the account's own verified address; **Nate's alert** (to `NOTIFY_EMAIL`, presumably the account address) is unaffected. Full arbitrary-recipient auto-reply delivery follows domain verification — owner-owned.
- **Reply-to is set intentionally per email.** Auto-reply → `hello@nextsketch.com` (a lead's reply reaches the brand inbox). Alert → the lead's address (Nate hits reply and reaches the lead directly — "respond without digging").
- **Best-effort sends are independent.** `Promise.allSettled` + per-send `{ error }` checks + aggregate "NOT sent" logging: a failed auto-reply doesn't suppress the alert and vice-versa. `NOTIFY_EMAIL` unset skips only the alert; `RESEND_API_KEY` unset skips both — neither throws, the lead stays captured.

## Deviations from the stale spec (flagged for Sprint 03 doc audit — not fixed now)

1. **§API "Does" / Rule 2.4 are pre-pivot.** They frame the endpoint as *building and sending the single lead email* and "no data stored." Sprint 02: the durable record is the Sheet + Asana (Unit 02); Unit 03 emails are **post-capture notification**, not the record. Flagged in the tech-spec §API note.
2. **Two emails, not one; new auto-reply.** Rule 2.4 describes one email to `hello@nextsketch.com`. Unit 03 sends a lead auto-reply **and** an alert to `NOTIFY_EMAIL`. The auto-reply is new copy (no canonical email copy in Messaging Kit §05) — DRAFT pending owner approval.
3. **Env clarification + new optional var.** `NOTIFY_EMAIL` is the alert recipient (Nate), distinct from the `hello@nextsketch.com` escape hatch; new optional `LEAD_FROM_EMAIL` (branded sender). Flagged in the tech-spec env note.

## Verification

- **Gates (local):** `lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (route still `ƒ /api/qualify`, dynamic) · `banned-terms` ✓ (27 files — now includes the new `src/content/email.ts`; auto-reply + alert copy carry no banned terms).
- **End-to-end against a local mock** (real route → real `after()` → real `notifyLead` → Resend SDK pointed at a mock via `RESEND_BASE_URL`; Sheet webhook mocked to gate capture; `LEAD_FROM_EMAIL` left unset to exercise the interim path). Test scaffolding (a temp mock + gitignored `.env.local`) was removed after the run.
  - **Real capture (Sheet 200, flagged lead):** endpoint `200 {ok:true}`; the mock then received **exactly two** sends. **Auto-reply:** to the lead, from `NextSketch <onboarding@resend.dev>` (interim), reply-to `hello@nextsketch.com`, subject "We've got your project details — NextSketch", body greets by first name and states "two business days." **Alert:** to `NOTIFY_EMAIL`, reply-to the lead, subject `[Lead — review answers] Dana Lee — Agentic systems for my product or operations` (Rule 2.5 needs-buy-in + build-first), body carrying all four answers as **display labels** + contact + ISO timestamp. HTML user fields with `& < >` rendered escaped (`&amp;`, `&lt;`, `&gt;`) — injection-safe. The interim-sender notice logged.
  - **Forced email failure (mock returns 500):** endpoint still `200 {ok:true}` (**capture intact, not reversed**); both sends logged sanitized — `lead-notify: auto-reply send error — application_error (500): mock forced failure` and the matching alert + "NOT sent" lines. No throw, no 500, no unhandled rejection.
  - **Never acknowledge an unstored lead:** off-ramp value (`project_type:"exploring"`) → `400`, **0 emails**. Valid lead but the Sheet (durable record) returns 404 → endpoint `503 {ok:false}`, **0 emails** (`after()` not scheduled because `delivered` is false). Both confirm notification fires only after a durable capture.
- **What could NOT be verified here:** real delivered mail in a real inbox — requires the owner's `RESEND_API_KEY` (and, for the branded sender, a verified domain), which don't exist yet. The send shapes, sender resolution, gating, and failure behavior are all proven against the mock; the live end-to-end is Unit 05 (deploy-smoke) once the keys are set.

## Open for Nate

1. **Credentials (owner setup checklist).** Set in Vercel (prod + preview) and local `.env.local`:
   - `RESEND_API_KEY` — create the Resend account, drop the key. Without it, notification is skipped (the lead is still captured); with it, email works immediately via the interim sender.
   - `NOTIFY_EMAIL` — your alert inbox (the recipient of the `[Lead …]` alert).
   - `LEAD_FROM_EMAIL` *(optional, recommended once DNS verifies)* — the branded sender (`hello@nextsketch.com` or `"NextSketch <hello@nextsketch.com>"`). Until set, email sends from Resend's onboarding domain (Decision 3); see the interim caveat above.
2. **Verify the `nextsketch.com` sending domain in Resend** (SPF/DKIM) so the lead auto-reply reaches arbitrary recipients and lands out of spam, then set `LEAD_FROM_EMAIL`.
3. **Auto-reply + alert copy is DRAFT** (`src/content/email.ts`) — approve or edit; it's a spec change flagged for the Sprint 03 audit.
4. **Branch pushed, no PR** — `feature/notify` is on origin (preview deploy only; production is `main`). Open the PR when you've verified.
