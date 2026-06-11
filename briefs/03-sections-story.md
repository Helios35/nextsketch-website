# Brief 03 — Sections: Story (Hero · Manifesto · Process)

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Sprint 01 — Full Site Build (`briefs/sprint-01-plan.md`) — unit 03 (feature)

---

## Project Standards

Read `docs/00-project-setup.md` in full and follow its conventions. Read `briefs/build-notes/01-foundation.md` and `briefs/build-notes/02-page-shell.md` first — they are canonical for naming and the page frame this unit slots into.

## Component Rules — non-negotiable

1. Check before creating. Search `src/components/` first.
2. Library first. Foundation primitives and their APIs are the starting point.
3. Never rebuild what exists.
4. Extend with props, not forks.

## Pre-flight

Confirm a clean working tree. STOP on real uncommitted changes. Confirm unit 02 is merged to `main`. Map the slots this unit fills and surface the gap list in your plan BEFORE touching code.

## Branch

`feature/sections-story` — per the sprint plan's branch override. Reviewed and merged before unit 04 starts.

---

## The Problem

The page frame exists but tells no story. The first three sections carry the entire pitch: the promise (Hero), the reframe (Manifesto), and the differentiator (Process — "Strategy. Build. Validate. Stay."). A visitor who scrolls no further than these must already understand what NextSketch is and why it's different.

## The Outcome We Want

1. Hero (`#top`), Manifesto (`#why`), and Process (`#process`) fill their slots in the unit-02 frame, matching `docs/04-ux-spec.md` per section.
2. Every visible string comes from the canonical content constants (`HERO`, `MANIFESTO`, `PROCESS` — Rule 4.1; copy edits are owner decisions, not builder decisions).
3. The Hero includes the stat strip with clearly-placeholder numbers per Decision Log #5 — visually real, numerically obviously unfinal.
4. Motion only through the foundation entry points; sketch accents follow the UX spec's one-per-viewport rule and the accent-pairing rule.
5. Reduced-motion and no-JS visitors get fully readable sections (the foundation SSR pattern, Business Rules E3).

## Scope Guardrails

- Do not touch the nav, footer, or other section slots — owned by units 02/04/05.
- Hero CTA uses the interim behavior locked in Brief 02; unit 06 swaps it.
- Do not edit canonical copy. A mismatch between Messaging Kit copy and what a section needs is a judgment call — come back with a recommendation.

## Spec Updates (if any)

None expected. Flag doc/build mismatches for the reviewer instead of patching either side.

## Verification — builder (before handing back)

- Three sections render per spec at desktop and mobile breakpoints; anchors land correctly.
- `npm run lint` · typecheck · `npm run build` · `npm run banned-terms` green locally and in CI.
- Reduced-motion pass per the foundation's method; no console errors.

## Out of Scope (do not bundle)

- Selected work, Services, About, Testimonials — unit 04.
- Who it's for, FAQ, Final CTA — unit 05.
- Modal, API — unit 06 / Sprint 02.

## What Done Looks Like

A visitor lands, reads the promise in 3 seconds, scrolls through the reframe and the four-phase process, and the page feels like the brand. All gates green. Reviewed and merged before unit 04 starts.

## References

- `briefs/sprint-01-plan.md` · `docs/decision-log.md` #5
- `briefs/build-notes/01-foundation.md` · `briefs/build-notes/02-page-shell.md`
- `docs/03-site-architecture.md` §Page structure rows 2–4 · `docs/04-ux-spec.md` · `docs/05-business-rules.md` §3, 4.1 · `docs/06-taxonomy.md`

## Build Notes

After this lands, write `briefs/build-notes/03-sections-story.md`: what was built, what was named what, anything that deviated. The unit isn't done without them.

---

## Verification — reviewer (human, at the merge gate)

- [ ] Walk the three sections — copy canonical, stat strip obviously placeholder.
- [ ] No regression on nav/footer/frame.
- [ ] Reuse rule held; accents within spec limits.
- [ ] No scope creep; independently mergeable.
