# Brief 24 — Decision-Log Reconcile & Pricing As-Built

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Adhoc — unit 24 (paperwork; ships before units 25 and 26)

---

## Project Standards

Read `docs/00-project-setup.md` in full and follow its conventions. Read `briefs/build-notes/21-doc-reconcile.md` and `briefs/build-notes/22-hamburger-nav.md` first — 21 is the precedent for exactly this kind of unit, and 22 is the last as-built on record.

## Component Rules — non-negotiable

Not applicable. **This unit writes no code.** If you find yourself editing anything under `src/`, stop — you are in the wrong unit.

## Pre-flight

Confirm a clean working tree (`NSOS-Transfer/` is untracked by design; leave it alone). Confirm `main` is at or ahead of `ff9e875`. Read PRs #30 and #31 end to end before writing the as-built note — the record has to come from the diff, not from this brief.

## Branch

`adhoc/decision-reconcile`. Reviewed and merged before unit 25 starts.

---

## The Problem

The paperwork is behind the code for the second time in three weeks. Three separate holes:

**The decision log ends at #24, but five source files cite rows #25 and #26 that do not exist.** `src/content/pricing.ts`, `src/components/pricing-tiers.tsx`, `src/components/modal-trigger.tsx`, `src/components/site-nav.tsx` and `src/lib/types.ts` all reference them. The pricing tier structure and the `NAV.featured` bar button are therefore undocumented owner calls living only in code comments — the exact failure PR #27 created and PR #28 cleaned up. Until this is settled, **no new decision row can be written**, because nobody knows what number it gets. Units 25 and 26 both need rows.

**The pricing page has no build note.** Notes stop at `22-hamburger-nav.md`. PRs #30 and #31 shipped an entire route, a new content module, a new component, two new types and a new Button variant with no as-built record. Unit 26 is going to build four more routes against that pattern and has nothing to read.

**The log's "Still open (owner)" footer is stale.** It says `/pricing` ships layout-final and empty and that a later unit fills it. That unit shipped 2026-08-25.

## The Outcome We Want

1. **Rows #25 and #26 exist and say what the code already assumes they say.** Reconstruct them from the doc blocks that cite them plus the PR #30/#31 diffs — the citing comments are unusually detailed and are the primary source. #25 is the pricing tier structure, the term and the tier naming; #26 is the `NAV.featured` Pricing button in the bar. Neither is a new decision: both were made and shipped, and this records them at the number the code already points at. Both carry their real dates (2026-08-25), not today's.
2. **The log's numbering is trustworthy again.** After this unit the next new row is **#27**. State that explicitly wherever the log records its own conventions, so the next agent does not have to re-derive it.
3. **`briefs/build-notes/23-pricing-page.md` exists** and records what PRs #30 and #31 actually shipped: files added, identifiers introduced, the Button compact variant, the owner revisions made mid-build (the term reduced from twelve months to three; Save Your Project carrying no required term at all), and the still-open items the pricing work left behind. Written from the diff. Match the depth of notes 20–22 — they are the standard here, not an aspiration.
4. **The "Still open (owner)" footer reflects reality.** The pricing-content item is resolved. The tier feature bullets are still owner-owed and stay open. Sweep the rest of the footer while you are in it and move anything else that has quietly shipped.
5. **The em-dash finding is recorded as an open owner call, not fixed.** Decision #19 binds every rendered string in `src/content/` and is currently violated in roughly 35 places (`copy.ts`, `email.ts`, `faq.ts`, `modal.ts`, `SITE.title` among them). Count it precisely, record the count and the file breakdown in the footer as an open item, and **change none of it.** Whether #19 gets enforced or narrowed is Nate's call and it is not this unit's.

## Scope Guardrails

- **No `src/` changes of any kind.** Not a comment, not a typo, not a rename. This unit is docs and build-notes only.
- Do not renumber, reword or "improve" existing rows #1–#24. They are the record.
- Do not invent rationale. Where a doc block states the reasoning, quote its substance; where it does not, say the row is reconstructed from the as-built and name what is unknown.
- Do not resolve the em-dash question. Do not resolve the tier-slug question. Do not touch the tier feature bullets.

## Spec Updates (if any)

`docs/decision-log.md` is the whole surface. Grep the docs for anything else that describes `/pricing` as empty or layout-final and correct it consistently. Flag anything ambiguous rather than guessing.

## Verification — builder (before handing back)

- Every `#25` and `#26` citation in `src/` now resolves to a real row, and the row says what the citing comment claims it says. Grep for both, check each hit.
- No file under `src/` appears in the diff.
- `npm run typecheck`, `npm run lint`, `npm run build` and `npm run banned-terms` all pass — this unit should not move them, and a change here means something went wrong.
- The em-dash count in the footer matches an actual grep of rendered strings, comments excluded.

## Out of Scope (do not bundle)

- The service and tier renames (unit 25).
- The service routes (unit 26).
- Fixing or narrowing decision #19.
- Building the em-dash scan into `scripts/check-banned-terms.mjs`. It stays a recommendation.
- The `custom` tier slug mismatch. Recorded, not resolved.

## What Done Looks Like

The decision log runs #1–#26 with no gaps, every code citation resolves, build note 23 exists, and the footer is honest. The next unit can write row #27 without asking anyone. Reviewed and merged before unit 25 starts.

## Judgment Calls

Anything ambiguous comes back to Nate with a recommendation. Do not silently resolve it. In particular: if reconstructing #25 or #26 requires asserting a rationale the code does not state, stop and ask.

## References

- `docs/decision-log.md` rows #19–#24 and the "Still open (owner)" footer
- `briefs/build-notes/21-doc-reconcile.md` — the precedent unit
- `briefs/build-notes/22-hamburger-nav.md` — the last as-built
- PRs #30, #31; `main` @ `ff9e875`
- The doc blocks citing #25/#26 in `src/content/pricing.ts` and `src/lib/types.ts` — the most complete source

## Build Notes

After this lands, write `briefs/build-notes/24-decision-reconcile.md`: what rows were reconstructed and from what, what the footer sweep changed, and the exact em-dash count you recorded.

---

## Verification — reviewer (human, at the merge gate)

- [ ] Rows #25 and #26 read as the calls I actually made, at the right dates.
- [ ] Build note 23 matches what shipped in PRs #30/#31.
- [ ] Nothing under `src/` is in the diff.
- [ ] The em-dash finding is recorded and untouched.
