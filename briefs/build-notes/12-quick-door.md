# Build Note 12 — Quick Door (Sprint 02 · Unit 04)

**Date:** 2026-06-18 · **Branch:** `feature/quick-door` · **Sprint 02 (Lead Capture) Unit 04.**
**Status:** Committed and pushed to `origin/feature/quick-door`; **no PR** (per owner policy — Nate opens the PR after he verifies). Feature-branch push = Vercel **preview** deploy only; production is `main`. Per Decision 6 this merges before Unit 05 starts.

## What changed

Added the **two-door** model (sprint plan Decision 4). The qualification modal now opens to a **low-friction quick path** (name + email + an optional one-line message, no questions) as the primary entry; the existing four-question qualifier stays intact as the optional **"tell us more"** path, reachable from the quick door. The **"still exploring" off-ramp** keeps its honest "not yet" message and the escape hatch and **adds an optional email capture** ("Stay in Touch") — it no longer turns exploring visitors away empty-handed.

Both new doors feed the **same** capture pipeline as the qualifier (Units 01–03): `submitQualification` → `POST /api/qualify` → `deliverLead` (Sheet gates success, Asana best-effort) → `notifyLead` (auto-reply + Nate's alert via `after()`). No parallel system, no "modal v2", no re-skin — the dark template visual language (build-note 08) is reused verbatim.

A lead is now a **discriminated union on `kind`**: `"qualified"` (the four answers + contact) or `"quick"` (name + email + optional message), with a `source` of `"quick_door"` or `"off_ramp"` on the quick kind. Everything downstream branches on `kind`; the quick door simply leaves the qualifier fields empty in the **same** Sheet columns / Asana shape, so the owner's Apps Script column mapping is unchanged.

## Files

- **Modified:** `src/lib/schema.ts` — `qualificationPayloadSchema` gained a `kind: "qualified"` discriminator; **new** `quickLeadPayloadSchema` (`kind:"quick"`, `source`, name/email/optional `details`); **new** `leadPayloadSchema = z.discriminatedUnion("kind", …)` — the contract the endpoint and seam now validate. Shared `name/email/_hp/_t` guards extracted to a `leadContact` shape so **both** doors carry the honeypot + min-time anti-bot guards (Rule 2.8). New exported types `LeadPayload`, `QuickLeadPayload`, `LeadSource`.
- **Modified:** `src/components/qualification-modal.tsx` — added the `"quick"` entry screen and an off-ramp capture form; initial screen is now `"quick"`; `goBack` gains the quick case (closes) and routes `project_type → quick`; a `returnScreen` state routes the failure-fallback Back **and** the success-screen variant to the originating door; the single `handleContactSubmit` became a shared `runSubmit` core + three thin builders (`handleQualifiedSubmit` / `handleQuickSubmit` / `handleOffRampSubmit`). Extracted a shared `<HoneypotField>` (used by all three forms). Success screen shows the gentler off-ramp confirmation when the lead was an "exploring" one.
- **Modified:** `src/content/modal.ts` — **new** `MODAL_QUICK` (heading/body/message label+placeholder/submit/`toQualifier` link), `MODAL_OFF_RAMP.capture` (prompt + "Stay in Touch" submit), `MODAL_OFF_RAMP_SUCCESS` (the gentle confirmation). All DRAFT, brand voice.
- **Modified:** `src/content/email.ts` — **new** `LEAD_AUTOREPLY_QUICK` (answer-neutral wording, keeps the two-business-day promise) and `LEAD_AUTOREPLY_EXPLORING` (gentle, no promise). DRAFT.
- **Modified:** `src/lib/lead-format.ts` — `leadSignal` / `toSheetRecord` / `toAsanaTask` now take `LeadPayload` and branch on `kind`. New signal labels `[Lead — quick]` / `[Lead — exploring]`; new `LeadType` members `"quick"` / `"exploring"`.
- **Modified:** `src/lib/lead-notify.ts` — `notifyLead` / `sendAutoReply` / `sendAlert` take `LeadPayload`; the alert drops the company line + answers section for quick leads (the subject's signal label already states the door); auto-reply copy is chosen per door (qualified / quick / exploring).
- **Modified:** `src/lib/lead-delivery.ts` — type widened to `LeadPayload` (no logic change; passes through to the formatter).
- **Modified:** `src/lib/qualify.ts` — `submitQualification` param widened to `LeadPayload`; the seam now carries either door. Doc comment updated.
- **Modified:** `src/app/api/qualify/route.ts` — validates against `leadPayloadSchema` (the union); comment updated. No logic/status-code change.
- **Modified:** `docs/05-business-rules.md` — a ⚠️ **flag callout** for the Sprint 03 audit (not a rewrite); see below.
- **New:** `briefs/build-notes/12-quick-door.md` — this note.

## Decisions / judgment calls

- **Discriminated union, not optional fields or a parallel system (governing: reuse, smallest correct diff).** The sprint plan anticipated "a lighter schema variant." A `kind` discriminator keeps the qualified validation guarantees exactly as Unit 01 set them (enums still exclude `exploring`; honeypot + `_t≥3000` still required) while letting a quick lead through the **same** endpoint, seam, delivery, and notify. Inventing sentinel enum values for "no answer" was rejected — it would violate Taxonomy §3 ("never invent alternates") and pollute the qualifier enums. Branching downstream on `kind` is the type-honest cost of feeding a new shape through; it is **not** a rebuild of the Unit 02/03 destinations/emails (those systems are untouched in architecture).
- **Quick path is the entry; qualifier is one click away (no second hero CTA, no chooser screen).** Per the plan ("quick path = primary CTA, qualifier = optional"). Opening straight to the quick form is the most faithful low-friction realization; a chooser step would add friction. Reaching the qualifier via an in-modal link avoids a hero re-design (out of scope). The hero CTA and its no-JS `mailto` fallback (E3) are untouched.
- **Off-ramp capture collects name + email (both required); no message field.** Judgment call — outcome 3 emphasizes "an email." I require name too, for an actionable lead and a uniform `quickLeadPayloadSchema`; the zero-friction path (mailto escape hatch) is still right there for anyone unwilling to give a name. **Recommendation:** keep as-is; if you'd rather the off-ramp be email-only, say so and I'll make name optional for that source.
- **Honest acknowledgments per door (this is the one place copy had to fork).** A quick/qualified lead sees "you'll hear from Nathan within two business days"; an off-ramp "exploring" lead sees the gentler "we'll be here… we'll reach out if the timing lines up" (no two-day promise — that would be dishonest for someone who said they're still exploring). The emails mirror the screens: three auto-reply variants (qualified / quick / exploring) so the email never claims content the lead didn't give. (The quick variant was added in response to the adversarial review — see below.)
- **Contact state reused across all three forms.** Name/email/message live in one `contact` state, so switching quick → qualifier pre-fills the contact step (less re-typing) and the off-ramp capture pre-fills from the quick screen. Verified no stale-state or controlled-input issues.
- **Resiliency model unchanged.** Quick/off-ramp leads ride the Unit 02 model exactly: the Sheet write gates `ok:true`; Asana is best-effort; a failure resolves not-ok and the modal preserves answers (Rule 2.7). No fake success.

## Business Rules changes (flagged for the Sprint 03 audit — not rewritten)

Per the brief, these are **implemented and noted**, not rules-doc rewrites. A ⚠️ callout was added to `docs/05-business-rules.md` (after §2.8) enumerating:
1. **New entry** — the quick door is the primary path; §1.1–1.4 are no longer the only way in (both doors carry §2.8 guards and the E3 no-JS degrade).
2. **Rules 2.1–2.2** — the off-ramp now captures an email (still an honest "not yet," not a hard sell).
3. **Rule 2.4** — already superseded by Units 01–03 (durable Sheet+Asana, not "one email, no data stored"); quick/off-ramp leads use that same pipeline.
4. **Rule 2.5** — new signal labels `[Lead — quick]` / `[Lead — exploring]` for answer-less leads; exploring leads get the gentler auto-reply.
5. **Rule 3.1** — the off-ramp's "Stay in Touch" is intentionally outside the §3.1 conversion-CTA set (a §3.1 CTA would violate the Rule 2.2 "not a hard sell" intent). Quick-door submit uses "Talk to Us", which **is** in the §3.1 set.

## Verification

- **Gates (local):** `lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (route still `ƒ /api/qualify`, dynamic) · `banned-terms` ✓ (27 files; the new copy in `modal.ts` / `email.ts` carries no banned terms).
- **Browser (dev server, desktop + mobile 375×812):**
  - Modal opens to the **quick door**; the qualifier is reachable via "Rather walk us through it?"; the qualifier still runs unchanged (Step 1 of 5 → off-ramp on "exploring").
  - **Captured + acknowledged identically.** With the Sheet destination unconfigured, a quick submit → `503` → the **failure-fallback** with all answers preserved + escape hatch (Rule 2.7). With a local Sheet **mock returning 200**, a quick submit → `200` → the **success screen**, and the mock received the exact row: `lead_type:"quick"`, `signal:"[Lead — quick]"`, name/email + the message in `details`, qualifier columns empty. The off-ramp capture → `200` → the **gentle** success ("Got it — we'll be here.") and the mock row `lead_type:"exploring"`, `signal:"[Lead — exploring]"`.
  - **Failure Back** returns to the originating door (quick → quick, off-ramp → off-ramp), values preserved.
  - No console warnings/errors. Mobile renders full-height in the dark template language (squared, hairline inputs, mono labels, divided-arrow advance button, gold escape hatch). All new motion is `motion-safe`-gated — reduced-motion intact by construction. Test scaffolding (a temp Sheet mock + a gitignored `.env.local`) was removed after the run.
- **Adversarial review pass:** ran a multi-agent review of the diff across five lenses (capture-honesty/Rule 2.7, schema/discriminated-union + security, scope/reuse/business-rules, React/Next.js 16/a11y, copy/brand/drift), each finding independently verified by a skeptic. **2 confirmed, both low:** (1) the missing build-note + its dangling `docs/05-business-rules.md` reference → **this note** resolves it; (2) the quick-door auto-reply reused the qualifier's "your answers / project details" wording for a lead that submitted neither → **fixed** by adding `LEAD_AUTOREPLY_QUICK` (answer-neutral, keeps the two-business-day promise) and routing quick-door leads to it. No security/correctness findings survived verification (the off-ramp stays un-bypassable: the union enforces per-kind shapes and both kinds require the honeypot + `_t≥3000` guards).
- **What could NOT be verified here:** real delivered mail + a real Sheet row / Asana task — those need the owner's credentials (still unset; same as Units 02/03). The shapes, gating, success/failure behavior, and per-door copy selection are proven against the mock; the live end-to-end is Unit 05 (deploy-smoke).

## Open for Nate

1. **Copy is DRAFT** (`MODAL_QUICK`, `MODAL_OFF_RAMP.capture`, `MODAL_OFF_RAMP_SUCCESS`, `LEAD_AUTOREPLY_QUICK`, `LEAD_AUTOREPLY_EXPLORING`) — approve or edit; flagged for the Sprint 03 audit.
2. **Off-ramp capture asks for name + email** (not email-only) — confirm, or say the word to make name optional there.
3. **"Stay in Touch" sits outside the Rule 3.1 CTA set** by design (Rule 2.2 intent) — to be reconciled in the Sprint 03 audit; confirm the intent.
4. **Business Rules §1–2 changes** are flagged in `docs/05-business-rules.md` for ratification in Sprint 03 — no rules were rewritten this unit.
5. **Branch pushed, no PR** — `feature/quick-door` is on origin (preview deploy only; production is `main`). Open the PR when you've verified. Per Decision 6 this merges before Unit 05 starts.
