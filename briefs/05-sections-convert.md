# Brief 05 — Sections: Convert (Who It's For · FAQ · Final CTA)

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Sprint 01 — Full Site Build (`briefs/sprint-01-plan.md`) — unit 05 (feature)

---

## Project Standards

Read `docs/00-project-setup.md` in full and follow its conventions. Read the build-notes for units 01–04 in `briefs/build-notes/` first — canonical for naming and the page frame.

## Component Rules — non-negotiable

1. Check before creating. Search `src/components/` first.
2. Library first. Foundation primitives and their APIs are the starting point.
3. Never rebuild what exists.
4. Extend with props, not forks.

## Pre-flight

Confirm a clean working tree. STOP on real uncommitted changes. Confirm unit 04 is merged to `main`. Map the slots this unit fills; surface the gap list in your plan BEFORE touching code.

## Branch

`feature/sections-convert` — per the sprint plan's branch override. Reviewed and merged before unit 06 starts.

---

## The Problem

The page tells the story and shows the proof, but doesn't yet qualify or convert. The closing run does the filtering the whole site is designed around: Who it's for self-selects the right visitor, FAQ clears objections, and the Final CTA hands them to the qualification flow. These are the last sections a visitor sees before the modal — they must close, not trail off.

## The Outcome We Want

1. Who it's for (`#fit`), FAQ (`#faq`), Final CTA (`#start`) fill their slots per the UX spec.
2. All copy from canonical constants (`FIT`, `FAQ_ITEMS`, `FINAL_CTA` — Rule 4.1). The six FAQ Q&As render verbatim.
3. **Final CTA interim behavior (locked):** the modal is unit 06. Until it lands, the `#start` button is the mailto escape hatch (hello@nextsketch.com) — anchoring to itself is meaningless, and mailto matches the E3 degrade path. Build it so unit 06 swaps the action without restructuring. Do not stub a modal.
4. FAQ interaction pattern (accordion vs. open list) follows the UX spec; if the spec is ambiguous, judgment call — come back with a recommendation.
5. Motion via foundation entry points only; reduced-motion and no-JS readable (no-JS FAQ content must be fully accessible).

## Scope Guardrails

- Do not touch other sections, nav, footer, or the unit-02 nav CTA interim wiring.
- CTA language: Rule 3.1's exhaustive set only; primary is "Start a Conversation".

## Spec Updates (if any)

None expected. Flag mismatches; don't patch silently.

## Verification — builder (before handing back)

- Three sections render per spec, desktop and mobile; anchors land; `#start` mailto works.
- All gates green locally and in CI (`lint` · typecheck · `build` · `banned-terms`).
- No console errors.

## Out of Scope (do not bundle)

- The qualification modal and swapping CTA actions — unit 06.
- `/api/qualify`, Resend — Sprint 02 (Decision Log #6).

## What Done Looks Like

A visitor can read who this is for, get objections answered, and reach a working contact path from `#start`. Every visible section of the site now exists. All gates green. Reviewed and merged before unit 06 starts.

## References

- `briefs/sprint-01-plan.md` · `docs/decision-log.md` #6
- `briefs/build-notes/` 01–04
- `docs/03-site-architecture.md` rows 9–11 · `docs/04-ux-spec.md` · `docs/05-business-rules.md` §3, 4.1, E3 · `docs/06-taxonomy.md` §6

## Build Notes

After this lands, write `briefs/build-notes/05-sections-convert.md`. The unit isn't done without them.

---

## Verification — reviewer (human, at the merge gate)

- [ ] Walk the closing run; FAQ verbatim; CTA language within Rule 3.1.
- [ ] `#start` mailto interim works; nothing pretends to be a modal.
- [ ] Reuse rule held; no regression upstream.
- [ ] No scope creep; independently mergeable.
