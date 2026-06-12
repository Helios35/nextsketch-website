# Brief 06 — Qualification Modal

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Sprint 01 — Full Site Build (`briefs/sprint-01-plan.md`) — unit 06 (flow; largest unit of the sprint)

---

## Project Standards

Read `docs/00-project-setup.md` in full and follow its conventions. Read ALL build-notes in `briefs/build-notes/` (01–05) first — canonical for naming, CTA interim wiring you are about to replace, and the page frame.

## Component Rules — non-negotiable

1. Check before creating. Search `src/components/` first.
2. Library first. Foundation primitives and their APIs are the starting point.
3. Never rebuild what exists.
4. Extend with props, not forks.

## Pre-flight

Confirm a clean working tree. STOP on real uncommitted changes. Confirm unit 05 is merged to `main`. Map every CTA carrying interim behavior (Briefs 02 and 05 locked them); surface the full list in your plan BEFORE touching code.

## Branch

`feature/qualification-modal` — per the sprint plan's branch override. Reviewed and merged before unit 07 starts.

---

## The Problem

The site's entire lead strategy is a branching qualification flow instead of a contact page — it filters explorers out gracefully and lets serious projects through. Every CTA on the page currently points at interim stand-ins. This unit builds the modal itself: the four questions, the branch, the off-ramp, the contact step, and honest behavior when there's no API behind it yet.

## The Outcome We Want

1. The full flow per Business Rules **§1 and §2**, including edge cases **E1–E3**. The rules doc is the contract — cite it, don't reinterpret it. Canonical question/answer/payload values per Taxonomy §3; all modal copy from the `MODAL_*` constants (approved canonical, Decision Log #3).
2. Off-ramp per Rules 2.1–2.2: a success state, not an error state — explorers exit affirmed, with the escape hatch visible.
3. Client-side validation against `qualificationPayloadSchema` (foundation build-notes naming is canonical). The `exploring` values stay UI-only — they never form a submitted payload, by construction.
4. **Interim submit (locked, Decision Log #6 + Rule 2.7):** `/api/qualify` is Sprint 02. A qualified-path submit resolves to the failure-fallback — composed answers preserved on screen, escape hatch presented, nothing lost, no fake success. Build the submit seam so Sprint 02 drops the real route in without restructuring.
5. Client-side spam measures per Rule 2.8 that live in the payload (honeypot, minimum-time) are wired; rate limiting is API-side, Sprint 02.
6. Every CTA site-wide now opens the modal (replacing Brief 02/05 interim behavior); no-JS still degrades to mailto per E3.
7. Overlay vs. `/start` shallow route: **builder's call**, recorded in build-notes (`docs/03-site-architecture.md` delegates this).
8. Keyboard, focus-trap, and escape behavior appropriate to a modal; reduced-motion safe.

## Scope Guardrails

- Do not touch section content or the page frame beyond CTA wiring and the modal mount.
- Do not edit `MODAL_*` copy — it's approved canonical. A flow state with no canonical copy is a judgment call: draft, flag in build-notes.
- No database, no persistence, no analytics events beyond what the project already tracks.

## Spec Updates (if any)

None expected. If implementing reveals a contradiction inside Business Rules §1–2, STOP and flag — that doc is the source of truth and only the owner amends it.

## Verification — builder (before handing back)

- Walk every branch: qualified path end-to-end, both off-ramp triggers, E1 back-navigation re-evaluation, failure-fallback with answers preserved.
- Every step shows escape hatch + back control (Rule 1.6).
- All gates green locally and in CI; no console errors; keyboard-only pass.

## Out of Scope (do not bundle)

- `/api/qualify`, Resend, email formatting per Rule 2.5 — Sprint 02.
- Any section or copy change outside the modal and CTA wiring.

## What Done Looks Like

Every CTA opens a modal that qualifies honestly: explorers off-ramp affirmed, serious leads reach a contact step that never loses their answers even with no API behind it. All gates green. Reviewed and merged before unit 07 starts.

## References

- `briefs/sprint-01-plan.md` (Decisions 1–2) · `docs/decision-log.md` #3, #6
- `briefs/build-notes/` 01–05 — naming + CTA interim wiring map
- `docs/05-business-rules.md` §1–2, E1–E3 · `docs/06-taxonomy.md` §3 · `docs/04-ux-spec.md` · `docs/07-technical-spec.md` (schema contract)

## Build Notes

After this lands, write `briefs/build-notes/06-qualification-modal.md` — including the overlay-vs-route call and the submit-seam shape Sprint 02 will build against. The unit isn't done without them.

---

## Verification — reviewer (human, at the merge gate)

- [ ] Walk all branches personally, including both off-ramp triggers and E1.
- [ ] Failure-fallback preserves answers; escape hatch everywhere; no fake success.
- [ ] CTA language within Rule 3.1; no-JS degrade works.
- [ ] No scope creep; independently mergeable.
