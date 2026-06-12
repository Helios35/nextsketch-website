# Brief 04 — Sections: Proof (Selected Work · Services · About · Testimonials)

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Sprint 01 — Full Site Build (`briefs/sprint-01-plan.md`) — unit 04 (feature)

---

## Project Standards

Read `docs/00-project-setup.md` in full and follow its conventions. Read the build-notes for units 01–03 in `briefs/build-notes/` first — canonical for naming and the page frame.

## Component Rules — non-negotiable

1. Check before creating. Search `src/components/` first.
2. Library first. Foundation primitives and their APIs are the starting point.
3. Never rebuild what exists.
4. Extend with props, not forks.

## Pre-flight

Confirm a clean working tree. STOP on real uncommitted changes. Confirm unit 03 is merged to `main`. Map the slots this unit fills; surface the gap list in your plan BEFORE touching code.

## Branch

`feature/sections-proof` — per the sprint plan's branch override. Reviewed and merged before unit 05 starts.

---

## The Problem

The story sections make a promise; nothing on the page yet backs it up. This unit adds the credibility layer: what's been built (Selected work), what's on offer (Services), who's behind it (About), and what clients say (Testimonials). Three of the four lean on placeholders by locked decision — the sections must look finished while honestly carrying unfinished content.

## The Outcome We Want

1. Selected work (`#work`), Services (`#services`), About (`#about`), Testimonials (`#voices`) fill their slots per the UX spec.
2. Selected work uses placeholder tiles per Taxonomy §7 naming — **no invented project names or outcomes** (Rule 4.3).
3. Services renders the four engagements from the canonical `SERVICES` constants with their assigned accent pairs — accent-pairing rule holds.
4. About is the solo "about me" (locked decision; see memory of concept lock). Its copy does not exist in the Messaging Kit: draft in brand voice per Brand Philosophy §8, add to content constants, **flag for owner approval in build-notes** (Decision Log #3 pattern).
5. Testimonials render placeholder quote blocks per Rule 4.2 — unapproved or fabricated quotes never ship. Secondary reassurance, never the lead (architecture row 8).
6. Motion via foundation entry points only; reduced-motion and no-JS readable.

## Scope Guardrails

- Do not touch other sections, nav, footer.
- Do not invent stats, quotes, project names, or client names anywhere — placeholder honesty is a hard rule.
- Service copy is canonical (Rule 4.1); don't edit it.

## Spec Updates (if any)

None expected. Flag mismatches; don't patch silently.

## Verification — builder (before handing back)

- Four sections render per spec, desktop and mobile; anchors land.
- All gates green locally and in CI (`lint` · typecheck · `build` · `banned-terms`).
- Grep your own output for Rule 3.4 retired-brand terms before handing back; no console errors.

## Out of Scope (do not bundle)

- Story sections (unit 03), convert sections (unit 05), modal (unit 06), API (Sprint 02).
- Real work imagery, approved testimonial quotes, About photography — owner-supplied, launch-readiness items.

## What Done Looks Like

The page now demonstrates instead of just claiming: work tiles, four named services with their accents, a personal About, and honest placeholder testimonials. All gates green. Reviewed and merged before unit 05 starts.

## References

- `briefs/sprint-01-plan.md` · `docs/decision-log.md` #3
- `briefs/build-notes/` 01–03
- `docs/03-site-architecture.md` rows 5–8 · `docs/04-ux-spec.md` · `docs/05-business-rules.md` §3, §4 · `docs/06-taxonomy.md` §1 §7

## Build Notes

After this lands, write `briefs/build-notes/04-sections-proof.md` — including the drafted About copy flagged for approval. The unit isn't done without them.

---

## Verification — reviewer (human, at the merge gate)

- [ ] Walk the four sections; approve or revise the drafted About copy.
- [ ] Placeholders honest — no invented names, outcomes, or quotes.
- [ ] Accent pairs correct per taxonomy; reuse rule held.
- [ ] No scope creep; independently mergeable.
