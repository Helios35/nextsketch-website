# Build Notes — 06 Qualification Modal

**Branch:** `feature/qualification-modal` · **Date:** 2026-06-12 · **Brief:** `briefs/06-qualification-modal.md`

---

## What was created

### Components — `src/components/`
- **`QualificationModal`** (`qualification-modal.tsx`, client): the full Business Rules §1–2 flow as a client-side state machine on a native `<dialog>` opened with `showModal()` — focus trap, Esc-to-close, and top-layer rendering are the platform's, not hand-rolled. Screens: Q1–Q4 (Rules 1.1–1.4, options verbatim from `MODAL_QUESTIONS` with Taxonomy §3 payload values), contact step (Rule 1.5: name/email required, company optional, details optional with 1000-char max), off-ramp (Rules 2.1–2.2: no form, affirming copy, mailto visible), success, and failure-fallback (Rule 2.7: composed answers preserved on screen). Branch evaluation runs on every Next press against current answers — E1 holds by construction: back from contact, change Q1 to "I'm still exploring", Next → off-ramp. Back from the off-ramp returns to whichever question triggered Rule 2.1. Progress dots (4 questions + contact) with sr-only "Step n of 5"; escape hatch in the modal footer on every screen (Rule 2.6); back control on every step (Rule 1.6). Desktop: centered 560px paper card; mobile: full-screen overlay (UX spec §Qualification modal).
- **`QualificationModalProvider`** + **`useQualificationModal`** (`qualification-modal-provider.tsx`, client): mounts the modal at the layout level and exposes `openModal` to every CTA. The modal mounts only while open, so every open is a fresh flow (E2: no cooldown) and the no-JS page carries zero dialog markup.
- **`ModalTrigger`** (`modal-trigger.tsx`, client): the one conversion-CTA seam — renders `Button` as a real `mailto:hello@nextsketch.com` anchor and intercepts the click to open the modal. No-JS visitors get the mailto escape hatch (E3) with no extra wiring.
- **`CloseIcon`** (`close-icon.tsx`): extracted verbatim from `site-nav.tsx` so the modal reuses the × affordance instead of forking it (the PlusIcon precedent, build-notes 05 deviation 2). Site-nav's only change there is the import.

### Submit seam — `src/lib/qualify.ts`
**`submitQualification(payload): Promise<{ ok }>`** — the seam Sprint 02 builds against: replace the body with `POST /api/qualify` (tech spec §API design) and map the response; the modal's contract (resolve `{ok}` or throw → Rule 2.7 fallback) stays unchanged. Interim body resolves `{ ok: false }` per Decision Log #6 — no fake success, no restructuring later.

### CTA wiring (the Brief 02/05 interim map, fully replaced)
1. Nav desktop CTA (`site-nav.tsx`) — was `href="#start"` → `ModalTrigger`
2. Nav mobile-overlay CTA (`site-nav.tsx`) — was `href="#start"` → `ModalTrigger` with `onBeforeOpen={closeMenu}`
3. Hero CTA (`hero-section.tsx`) — was `href="#start"` → `ModalTrigger`
4. Final-CTA section (`final-cta-section.tsx`) — was interim mailto → `ModalTrigger variant="inverse"`

Footer mailto untouched (Rule 2.6 escape hatch, not a conversion CTA). `layout.tsx` wraps nav/page/footer in the provider.

### Content — `src/content/modal.ts` (additive only)
`MODAL_CONTACT_HEADING` ("Last step — where do we reach you?"), `MODAL_PROGRESS.step` (sr-only step announcement), `MODAL_FAILURE_SUBJECT` (subject of the failure-fallback mailto). All three are **DRAFT pending owner approval** (no canonical copy exists for these flow states). The approved `MODAL_*` constants are byte-identical — additions are separate consts, not edits.

### Styles — `src/app/globals.css`
`--animate-modal-in` (scale 0.97→1 + fade, 250ms) and `--animate-step-in` (200ms slide/fade) keyframes per the UX spec motion inventory, applied `motion-safe:` only. `dialog::backdrop` rule (see deviation 9).

## Verification performed
- `npm run lint` · typecheck · `npm run build` · `npm run banned-terms` green locally after the final code state (26 files scanned, clean).
- Browser walkthrough (desktop + 375×812):
  - **Qualified path end-to-end:** Q1→Q4→contact→submit. Interim submit lands on the failure-fallback with all seven answer/contact pairs preserved on screen and the mailto prefilled (subject + composed answers in the body). Back from failure returns to contact with field values intact.
  - **Both off-ramp triggers:** Q1 = "I'm still exploring" and Q2 = "Just exploring" each route straight to the off-ramp — no form, dots hidden, mailto visible, back control present. Back returns to the triggering question in both cases.
  - **E1:** back-navigated contact→Q4→Q3→Q2→Q1, changed Q1 to exploring → off-ramp.
  - **E2:** close + reopen → fresh flow at Q1, nothing selected, "Step 1 of 5".
  - **E3 / no-JS:** raw server HTML contains 4 `mailto:` CTAs, zero `#start` CTA hrefs, zero dialog markup.
- Keyboard/focus: dialog is `:modal` (`matches(':modal')` true); programmatic focus of a background nav link is blocked (inert background); radios keyboard-focusable; focus moves to the step heading on every screen change; body scroll locked while open (`overflow: hidden`) and restored on close; dialog unmounts on close.
- Contact step: native required/`type=email`/maxLength mirror the schema; honeypot input is `aria-hidden` + `tabIndex={-1}` + visually offscreen; Next disabled until an answer is selected.
- Mobile: full-screen (viewport-sized rect), no horizontal scroll, submit reachable. Desktop: 560px centered card over a dimmed backdrop (screenshot-verified after deviation 9).
- Reduced motion: both new animation utilities compile **only** inside `@media (prefers-reduced-motion: no-preference)` (verified by walking the live CSSOM); keyframes are from-only, so the resting state is fully visible with no animation.
- No app console/runtime errors; no Next error overlay; production build static-renders both routes.

## Decisions & deviations (flagged, not silently resolved)
1. **Overlay, no `/start` route** — the builder's call `docs/03-site-architecture.md` delegates. Deep-linking wasn't a requirement anywhere in the PRD; `#start` (final CTA section) already provides a linkable conversion point; a shallow route would add router coupling for no requirement. Revisit only if deep-linking the modal becomes a real ask.
2. **Native `<dialog>` + `showModal()`** as the modal foundation — platform focus trap, Esc handling, and top layer for free; the same "use the platform" reasoning as the `<details name>` accordions (build-notes 03). Esc fires the native close path; the provider unmounts on close.
3. **Drafted copy (3 strings)** — `MODAL_CONTACT_HEADING`, `MODAL_PROGRESS.step`, `MODAL_FAILURE_SUBJECT`. **Need owner approval** (the established pattern). Approved `MODAL_*` objects untouched.
4. **Back on Q1 closes the modal; success screen shows Close only** — Rule 1.6 says every step shows a back control: on Q1 the page itself is what's "back", so the control closes; on the success terminal screen the flow is complete and Close is the honest control (escape hatch still visible per Rule 2.6).
5. **Explicit Next instead of auto-advance on selection** — branch evaluation happens on Next press (which is what re-evaluates Rule 2.1 for E1); selection-then-confirm is the predictable keyboard/screen-reader pattern, and `MODAL_NAV.next` existed for exactly this.
6. **Failure-fallback mailto is prefilled** (subject + composed answers in the body) — Rule 2.7's strongest honest form: until Sprint 02, *every* completed lead lands on this screen, so recovery is one click instead of manual copying. The persistent footer hatch stays a plain mailto (Rule 2.6).
7. **Schema parse is the submit gate** — native HTML validation handles field UX; `qualificationPayloadSchema.safeParse` runs before the seam. Any parse failure (honeypot filled, sub-3s completion, or an email the schema rejects but the browser allowed) routes to the failure-fallback — a lead is never silently dropped, and no payload that violates the contract is ever submitted. `exploring` answers can't reach the gate (Rule 2.1 routed them) and can't pass it (absent from the enums).
8. **Modal motion is motion-safe CSS keyframes, not Motion** — same call as the nav shrink (build-notes 02): no new animation entry point, server/client contract unchanged, reduced-motion divergence impossible. Step transition is enter-only (200ms slide/fade per spec); exit choreography would require Motion's presence-tracking for no spec'd gain.
9. **`dialog::backdrop` is a literal `rgb(0 0 0 / 0.65)` in globals.css**, not `backdrop:bg-ink/*` — the oklab()/color-mix() forms Tailwind compiles tokens to computed correctly but failed to *paint* on `::backdrop` in the verification browser (literal rgb paints; verified by A/B injection). Value is the ink token at 65%. Revisit when the toolchain/browser moves.
10. **`openedAt` captured in the mount effect, not render** — the react-hooks purity rule (correctly) rejects `Date.now()` during render; the layout effect that calls `showModal()` stamps it.
11. **Brief 06 copied into `briefs/`** — docs-in-repo pattern (unit 02, deviation 8).

## Naming reference
`QualificationModal` (`qualification-modal.tsx`) · `QualificationModalProvider` / `useQualificationModal` (`qualification-modal-provider.tsx`) · `ModalTrigger` (`modal-trigger.tsx`) · `CloseIcon` (`close-icon.tsx`) · `submitQualification` / `QualifyResult` (`src/lib/qualify.ts`). Content exports added: `MODAL_CONTACT_HEADING`, `MODAL_PROGRESS`, `MODAL_FAILURE_SUBJECT`. Theme additions: `--animate-modal-in`, `--animate-step-in`.

## What downstream units inherit
- **Sprint 02 (`lead-api`) drops into the seam:** replace the body of `submitQualification` with `POST /api/qualify` and map the response (`200 → {ok:true}`, else `{ok:false}`/throw). Nothing else moves: the payload is already schema-validated client-side, the failure path already implements Rule 2.7, and the success screen already renders when the seam resolves ok. Server must re-validate with the same schema (off-ramp bypass protection, tech spec §Business logic) and implement Rule 2.5 subject flags + rate limiting.
- **`ModalTrigger` is the conversion CTA** for any future surface — mailto degrade and modal open in one seam.
- Unit 07's smoke pass walks the complete page **plus** the modal branches; the brief's reviewer checklist maps 1:1 onto the verification list above.
- Drafted copy awaiting owner approval now additionally includes: `MODAL_CONTACT_HEADING`, `MODAL_PROGRESS.step` wording, `MODAL_FAILURE_SUBJECT`.
