# Brief 25 — Service Name Alignment & CTA Preselect Fix

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Adhoc — unit 25 (naming; ships after unit 24, before unit 26)

---

## Project Standards

Read `docs/00-project-setup.md` in full and follow its conventions. Read `briefs/build-notes/23-pricing-page.md` (written in unit 24) and `briefs/build-notes/22-hamburger-nav.md` first — 23 is canonical for how the tiers are named and wired.

## Component Rules — non-negotiable

1. Check before creating. Search `src/components/` first.
2. Library first. Existing primitives and their APIs are the starting point.
3. Never rebuild what exists.
4. Extend with props, not forks.

## Pre-flight

Confirm a clean working tree. Confirm unit 24 is merged, so the decision log runs to #26 and the next row is **#27**. Map every surface that renders a service or tier name — there are more than the obvious two — and surface that list in your plan BEFORE touching code.

## Branch

`adhoc/service-name-alignment`. Reviewed and merged before unit 26 starts.

---

## The Problem

**The site calls the same four things by different names in different places, and two buttons send visitors to the wrong answer.**

The qualification modal's quick door already uses the names the business actually uses: *New product*, *Product completion*, *Product support*, *Agentic system*. Nothing else on the site matches. The services cards say "Rescue & Completion", "Ongoing Partnership" and "Agentic Systems". The hero capability strip says four longer forms again. Taxonomy §1 records a third set. Two pricing tiers carry names the modal does not use at all. A visitor picks "Ongoing Partnership" on a card, lands in the modal, and is asked to choose "Product support" instead — the same thing under a name they have not seen.

Worse: **two of the four pricing tier buttons preselect the wrong project type.** "Internal Tool" opens the modal on *New product* when it should open on *Agentic system*, and "Custom Product" opens on *Product support* when it should open on *New product*. The doc block above the mapping actively defends the second one as deliberate and warns the reader not to correct it. It was a mistake, and that paragraph currently protects the bug from the next person who spots it.

## The Outcome We Want

1. **One vocabulary, everywhere a visitor can read it.** The four services render as **New Product**, **Product Completion**, **Product Support** and **Agentic System** on every surface — the services cards, the hero capability strip, and anywhere else the sweep in pre-flight turns up. The modal's quick-door labels are the reference; nothing about the modal changes.
2. **Service slugs match the names they carry.** The slug union is renamed alongside the display names so a slug is never a fossil of a retired name. This is a total map, so the compiler finds every consumer — trust it rather than grepping and hoping. The `SERVICE_NEED` mapping is preserved in meaning, not re-derived: the four project types it points at do not change.
3. **Two pricing tiers are renamed, and nothing else about pricing moves.** `rescue` becomes **Product Completion**, `custom` becomes **New Product**. Prices, struck former prices, descriptions, notes, the term sentence, the order of the cards and the empty `features` arrays are all untouched. The first two tier names — AI Workflow Integration and Internal Tool — are unchanged.
4. **All four tier buttons preselect the right thing.** The mapping ends as: AI Workflow Integration and Internal Tool both open on *Agentic system*; Product Completion opens on *Product completion*; New Product opens on *New product*. Two of those are corrections.
5. **The doc block above that mapping is rewritten, not just its values.** It currently argues the wrong mapping was deliberate and cites decision #25 for it. Replace the reasoning with what is now true — including why the top two tiers share one project type, which is the point in item 6 — and cite the real row. Leaving that paragraph in place would defend the bug against the next reader.
6. **The two agentic tiers are documented as one project type on purpose.** They are a difference of depth, not of category: *AI Workflow Integration* is agents and custom tools dropped into processes the business already runs — workflow level, no product wrapped around it. *Internal Tool* is a full product with a real interface and agents behind it, something the client owns and their team logs into. The modal asks what a visitor needs, not how deep they want to go; the depth is what the two price points express. This is positioning language and unit 26 depends on it, so it belongs in the taxonomy, not only in a code comment.
7. **Decision rows are written for all of it** — the naming alignment, the slug rename and the preselect correction — starting at **#27**. The preselect fix is recorded as a correction of a shipped bug, not as a change of mind, and it names the doc block that defended it.

## Scope Guardrails

- **Do not touch pricing beyond the two names, the four-entry mapping and its doc block.** No price changes, no copy changes, no reordering, no feature bullets. The bullets stay owner-owed and empty.
- The service **descriptions** are Messaging Kit §05 canonical copy under Rule 4.1. Renaming a service is not permission to reword its description. If a description reads oddly against its new name, flag it — do not fix it.
- The hero capability strip carries §05 copy too. Aligning it **is** a Rule 4.1 edit to canonical copy and gets its own decision row; it is authorized by this brief, but record it as the edit it is.
- The services card heading is `whitespace-nowrap` and deliberately sized down at `xl` to hold one line in the four-column layout. All four new names are shorter than what they replace, but verify at every breakpoint rather than assuming.
- Do not read or revive the per-service `accent` field. Decision #14 orphaned every color but gold; those values are dead data.
- No em dashes in any string that renders (decision #19). Doc blocks are exempt.
- Rule 3.2's banned-term list and Rule 3.1's exhaustive CTA set both still bind. No new CTA strings.
- Do not touch the modal, `PROJECT_TYPE_VALUES`, or the `/api/qualify` payload shape. The stored values do not change — only what the site calls them.

## Spec Updates (if any)

`docs/06-taxonomy.md` §1 — the canonical name and slug table, plus the two-kinds-of-agentic-system distinction from outcome 6. `docs/decision-log.md` — the new rows. Grep the docs for every other place the old service names appear and reconcile consistently; §1's divergence from the cards has been flagged and unreconciled since 2026-08-04 and this unit closes it.

## Verification — builder (before handing back)

- Grep the built output for every retired name. Zero hits in rendered copy.
- Open the modal from all four service cards and all four pricing tiers. Each lands on the correct preselected option. Check all eight, not a sample.
- Service card headings hold one line at every breakpoint, including `xl` where the cards are narrowest.
- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run banned-terms` all green. No console errors.
- The doc block above the tier mapping no longer defends the old behavior anywhere in the file.

## Out of Scope (do not bundle)

- The four service routes (unit 26).
- The `custom` tier slug, which after this no longer matches its display name. Renaming it is a separate call; document the mismatch and leave it.
- Any change to prices, tier descriptions, or feature bullets.
- Fixing or narrowing decision #19.
- Adding a pricing tier for Product Support. There isn't one, and inventing it is Rule 4.3.

## What Done Looks Like

A visitor reads the same four words on the cards, in the hero strip, on the pricing page and in the modal, and every button drops them on the option they just clicked. The taxonomy says so too, and the log records it from #27. Reviewed and merged before unit 26 starts.

## Judgment Calls

Anything ambiguous comes back to Nate with a recommendation. Do not silently resolve it. In particular: if the sweep turns up a surface carrying a fifth variant of a service name that this brief does not mention, flag it before changing it.

## References

- `docs/decision-log.md` #14 (gold only), #19 (em dashes), #25 (tier structure, written in unit 24)
- `docs/05-business-rules.md` §3.1, §3.2, §3.3, §4.1, §4.3
- `docs/06-taxonomy.md` §1
- `src/content/modal.ts` — the quick-door labels, which are the naming reference
- `briefs/build-notes/23-pricing-page.md`
- Owner decisions, 2026-08-28 (tier naming and preselects) and this brief's outcome 6

## Build Notes

After this lands, write `briefs/build-notes/25-service-name-alignment.md`: every identifier renamed, every surface swept, the eight preselect paths you verified, and anything that deviated.

---

## Verification — reviewer (human, at the merge gate)

- [ ] Cards, hero strip, pricing cards and modal all say the same four names.
- [ ] All eight CTAs land on the right preselected option.
- [ ] Prices, tier descriptions and bullets are untouched in the diff.
- [ ] The old mapping's defense paragraph is gone.
- [ ] Taxonomy §1 matches what the site renders.
