# Brief 02 — Page Shell (Nav · Footer · 404 · Page Frame)

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Sprint 01 — Full Site Build (`briefs/sprint-01-plan.md`) — unit 02 (layout; first unit of the sprint)

---

## Project Standards

Read `docs/00-project-setup.md` in full and follow its conventions. Then read `briefs/build-notes/01-foundation.md` — it is canonical for every identifier, content constant, and primitive the foundation shipped. Trust it over memory.

## Component Rules — non-negotiable

1. Check before creating. Search `src/components/` first.
2. Library first. The foundation primitives and their APIs are the starting point.
3. Never rebuild what exists.
4. Extend with props, not forks.

## Pre-flight

Confirm a clean working tree. Discard line-ending / formatting noise. STOP if there are real uncommitted changes.
Map the surfaces this unit touches (`layout.tsx`, the page route, global nav/footer), find their existing consumers, and surface the gap list in your plan BEFORE touching code.

## Branch

`feature/page-shell` — feature-grouped branch per the sprint plan's documented override. Reviewed and merged before unit 03 starts.

---

## The Problem

The foundation shipped tokens, type contracts, canonical copy, and primitives — but a visitor still sees a bare shell. There is no navigation, no footer, no 404, and no page frame for the eleven content sections to slot into. Units 03–05 each deliver sections; without this unit they would each invent their own page composition and diverge. This unit builds the frame once.

## The Outcome We Want

1. The single page exists with every section anchor from Taxonomy §6 present in canonical order (`docs/03-site-architecture.md` §Page structure) as clearly-marked empty slots — units 03–05 fill them without touching the frame.
2. A sticky top nav that shrinks on scroll, matching `docs/03-site-architecture.md` §Navigation and the UX spec: placeholder logo scrolling to top, the five anchor links, and the primary CTA button.
3. A footer with the same anchors, the visible mailto escape hatch, the legal line (casing per Taxonomy §8), and the three social links per Decision Log #4 — placeholder hrefs, real URLs are owner-owed.
4. A custom 404 per the sitemap that routes visitors back to the page.
5. Anchor navigation works end-to-end: every nav and footer link scrolls to its (empty) section.
6. All copy imported from `@/content/*`. Strings that don't exist there yet (404 copy, any nav/footer microcopy beyond what shipped) get drafted in brand voice per Brand Philosophy §8, added to the content constants, and flagged for owner approval in build-notes — the Decision Log #3 pattern.

## Scope Guardrails

- **CTA interim behavior (locked):** the qualification modal is unit 06 and does not exist. Until it lands, every "Start a Conversation" button anchors to `#start`. Build the CTA so unit 06 can swap the action without restructuring. Do not stub a modal.
- **Animation entry points hold:** `<Reveal>`/`<SketchAccent>` only (lint enforces); plain CSS is fine for the nav shrink. If the shrink genuinely needs a new animation primitive, that's a judgment call — come back with a recommendation.
- Language rules are binding on every visible string — Business Rules §3, enforced by the banned-terms gate on built output.
- Reuse `Button` and `Container`; no new button or section-wrapper variants without need.

## Spec Updates (if any)

None expected. If building reveals a mismatch with `docs/03-site-architecture.md` or the UX spec, flag it for the reviewer — don't silently patch either the doc or the build.

## Verification — builder (before handing back)

- Nav, footer, 404 render correctly; anchors scroll; nav shrink behaves, including with reduced motion.
- `npm run lint` · typecheck · `npm run build` · `npm run banned-terms` green locally and in CI.
- No console errors; no-JS page still fully readable (Business Rules E3 — the foundation's SSR pattern holds).

## Out of Scope (do not bundle)

- Section content of any kind — units 03–05.
- The qualification modal and its mount — unit 06.
- `/api/qualify`, Resend, Vercel — Sprint 02 (Decision Log #6).
- Old-Webflow-route redirects — launch (`docs/08-runbook.md`).

## What Done Looks Like

A visitor can load the page, see a working nav and footer wrapped around an empty but fully-anchored frame, hit a branded 404, and reach hello@nextsketch.com from the footer. All gates green. Reviewed and merged before unit 03 starts.

## References

- `briefs/sprint-01-plan.md` — sub-task table + sprint decisions
- `docs/decision-log.md` — #3 (copy approval pattern), #4 (socials), #6 (lead API deferral)
- `briefs/build-notes/01-foundation.md` — canonical naming; what downstream units inherit
- `docs/03-site-architecture.md` · `docs/04-ux-spec.md` · `docs/05-business-rules.md` §3 · `docs/06-taxonomy.md` §6 §8

## Build Notes

After this lands, write `briefs/build-notes/02-page-shell.md`: what was built, what was named what, and anything that deviated from this brief. The unit isn't done without them.

---

## Verification — reviewer (human, at the merge gate)

- [ ] Walk the page: nav, anchors, footer, 404 all behave as specced.
- [ ] No regression on the foundation primitives or gates.
- [ ] Reuse rule held — nothing forked.
- [ ] No scope creep; independently mergeable.
