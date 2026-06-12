# Brief 08 — Design Followup (premium elevation pass)

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Interim unit between Sprint 01 and Sprint 02 — design elevation pass before Sprint 02 (`lead-api`) is planned.

---

## Project Standards

Read `docs/00-project-setup.md` in full and follow its conventions. Read ALL build-notes in `briefs/build-notes/` (01–07) first — 01–06 are canonical for naming; **07 is the regression contract for this unit** (see Guardrails). Read `docs/04-ux-spec.md` and the Taxonomy accent pairs before forming a direction.

## Component Rules — non-negotiable

1. Check before creating. Search `src/components/` first.
2. Library first. Foundation primitives (`Button`, `Container`, `SectionHeading`, `Placeholder`, `Reveal`, `SketchAccent`) and their APIs are the starting point.
3. Never rebuild what exists.
4. Extend with props and variants, not forks. Design variation is a variant, not a "v2" component.

## Pre-flight

- Confirm a clean working tree. STOP on real uncommitted changes.
- Confirm `feature/smoke-pass` (unit 07) is merged to `main` — Sprint 01 must be closed before this unit starts.
- All four gates green on `main` before starting.
- **One deliberate scope exception, flagged in advance:** bump `actions/checkout` and `actions/setup-node` from `@v4` to `@v5` in `.github/workflows/ci.yml` as the first commit (build-notes 07, Finding 1; GitHub forces Node 24 runners 2026-06-16). Every gate below depends on green CI.

## Branch

`feature/design-followup` — per the locked one-branch-per-unit convention. Reviewed and merged as one unit before Sprint 02 planning starts.

---

## The Problem

Sprint 01 shipped a site that is structurally complete and rule-correct — and visually flat. The owner's read, in his words: the design is bad — flat, not engaging, no animations, no background, something is missing he doesn't have the vocabulary to name. The page reads as a competent template, not as the work of a firm selling craft. That's a positioning failure, not just an aesthetic one: NextSketch sells "from idea to production — and we stay"; the site itself is the first proof of build quality, and right now it doesn't carry that weight.

The owner is not a web designer and is deliberately not specifying the fix. **Diagnosing what's missing is part of this unit's work.**

## The Outcome We Want

1. **A written design assessment comes first.** Before changing anything, walk the live build and produce `briefs/build-notes/08-design-assessment.md`: what specifically makes the current page read as flat or generic (section by section where useful), and the direction chosen to fix it — with reasoning grounded in the brand (paper/ink/sketch identity, the accent pairs, the "sketch" name itself). This document is how the owner learns the vocabulary for what was wrong; write it for him, not for another designer.
2. **The site feels premium, crafted, and expensive.** A visitor who knows nothing about NextSketch should sense within seconds that this firm sweats details. Which levers achieve that is the diagnosis — what matters is that every choice serves one deliberate direction, applied with restraint and coherence, not a checklist of effects.
3. **The direction is unmistakably NextSketch.** The existing brand palette and the paper/ink/sketch identity are the foundation to build *up* from, not around. Tonal extensions of existing tokens (tints, shades, washes, translucency) are the builder's call; any genuinely new hue is a judgment call that comes back. If design-reference resources are available, use them as diagnostic checklists and quality bars — never as a style source; a borrowed aesthetic that could belong to any agency site is the failure mode this unit exists to fix.
4. **Motion makes the page feel alive, not decorated.** What moves, when, and how much is the direction's call — every bit of it `motion-safe:` gated, through the established animation entry points (extend the primitives; lint blocks raw `motion/react` imports for a reason). Reduced-motion users get a fully composed, static-confident page.
5. **Placeholder imagery conveys the final feel.** Where the direction needs imagery (backgrounds, work tiles, about portrait, atmosphere), use clearly-placeholder visual stand-ins rich enough that the owner can judge the intended end state before supplying real assets. Every image slot stays swappable by taxonomy asset name and is logged in build-notes as owner-owed. Honest-content discipline is unchanged: no invented project names, outcomes, stats, or quotes (Rules 4.2–4.3) — atmosphere may be placeholder; *proof* may not.
6. The smoke-pass invariants (build-notes 07) hold at exit — the regression contract:
   - all ten section anchors land 80px below viewport top; logo → effective page top
   - zero horizontal overflow at 360 / 768 / 1024 / 1440
   - no-JS degrade intact: full copy in raw HTML, 4 mailto CTAs, zero dialog markup, `<details>` readable JS-free
   - reduced-motion: zero ungated transitions/animations; nothing hidden at rest
   - keyboard path through nav, accordions, and modal unbroken; contrast stays WCAG AA
   - zero app console errors
7. Performance survives the elevation: production build static-renders; no layout shift from late-loading atmosphere; heavy effects justified or cut.

## Scope Guardrails

- **Copy is untouchable.** `src/content/*` is read-only. Any copy change is a spec change for the owner, not a design change — even one word. Drafted-pending-approval strings stay as they are.
- **Flow logic is untouchable.** Business Rules §1–2 behavior, the modal state machine, `qualificationPayloadSchema`, and the `submitQualification` seam are off-limits. Restyling modal surfaces is in scope; changing what they do is not.
- **Structure holds.** Ten sections, canonical order, existing anchors. Compositional change *within* sections is in scope; adding, removing, or reordering sections is not.
- No new dependencies without flagging in build-notes with justification; prefer none.
- **Owner decision recorded (2026-06-12):** placeholder *imagery* for look-and-feel preview is authorized for this unit — an amendment to the placeholder treatment shipped in Sprint 01. Placeholder *content* rules are unchanged.

## Spec Updates (if any)

`docs/04-ux-spec.md` must describe the as-built site when this unit merges — update it to match the implemented direction (motion inventory included) and flag every edit in build-notes.

## Verification — builder (before handing back)

- Assessment doc exists and the implemented direction matches it (or deviations are flagged).
- Full regression-contract pass (Outcome 6) across the whole page — desktop and mobile, screenshot-verified per section.
- Reduced-motion and no-JS walkthroughs repeated on the final state.
- All four gates green locally **and in CI**.

## Out of Scope (do not bundle)

- `/api/qualify`, Resend, Vercel setup — Sprint 02.
- Copy changes, content approvals, real stats/quotes/imagery/URLs — owner-owed (build-notes 07 §8 ledger).
- Section additions/removals, nav structure changes, new pages.

## What Done Looks Like

The owner opens the preview and the site reads as a premium, crafted, expensive build — recognizably NextSketch, alive with motion, atmospheric where it should be, with placeholder imagery good enough to judge the end state. The assessment doc explains what was wrong and what was done. Every gate green, regression contract verified, UX spec matching the as-built page. Reviewed and merged before Sprint 02 planning starts.

## Judgment Calls

Ambiguity comes back to the owner with a recommendation — including: any new hue beyond the brand palette, any new dependency, anything that would bend the regression contract, and any place where "premium" and the UX spec genuinely conflict. The builder does not silently resolve these. Taste *within* the guardrails is explicitly delegated — that's the unit.

## References

- `briefs/build-notes/07-smoke-pass.md` — regression contract + open-items ledger
- `briefs/build-notes/01-foundation.md` — primitive naming, canonical
- `docs/04-ux-spec.md` · `docs/05-business-rules.md` §3–4 · `docs/06-taxonomy.md` (accent pairs, asset naming)
- `docs/decision-log.md` #1 (fonts), #3 (copy canon) · sprint plan Decisions #5, #7 (honest placeholders)
- `docs/01-vision.md` · brand docs (`docs/brand/`, gitignored) — what "premium" means *for this brand*

## Build Notes

After this lands, write `briefs/build-notes/08-design-followup.md`: the direction implemented, every visual change grouped by surface, every token addition/extension, every placeholder image slot (owner-owed, by taxonomy name), every spec edit, every deviation from the assessment. The assessment doc plus these notes are the full record of this unit. The unit isn't done without them.

---

## Verification — reviewer (human, at the merge gate)

- [ ] The page feels premium and engaging — the flatness complaint is gone, at both widths.
- [ ] The direction reads as NextSketch, not as a borrowed aesthetic.
- [ ] Assessment doc read; it explains the diagnosis in plain language.
- [ ] Regression contract spot-checked (anchors, overflow, no-JS, reduced motion, keyboard).
- [ ] No copy drift — `src/content/*` diff is empty.
- [ ] Placeholder imagery is clearly placeholder; nothing reads as fabricated proof.
- [ ] UX spec matches the as-built page. No scope creep; independently mergeable.
