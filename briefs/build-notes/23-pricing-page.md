# Build Note 23 — The Pricing Page (adhoc Unit 23)

**Dates:** 2026-08-25 (PR #30) · 2026-08-26 (PR #31) · **Branches:** `adhoc/pricing-page`, `pricing-page-updates` · **Base:** `main` @ `0340544`
**Status:** Both merged (PR #30 → `19bf161`, PR #31 → `ff9e875`). Adhoc, outside the brief set. Follows PR #29 / build-note 22.
**Reconstructed, not contemporaneous.** Written in unit 24 (2026-08-28) from the merged diffs, the eight commit messages and the two PR bodies, because the unit shipped without one. Same posture as note 20.

## The gap this closes

Unit 22 shipped `/pricing` as a room with no furniture: nav, footer, metadata, ink surface, and a heading saying the detail was coming. Decision #23 said so out loud and named Unit 23 as the one that fills it. This is that unit — and it turned out to be more than content, because filling the page needed a new component, two new types, a new `Button` size and one change to how the fixed nav bar handles clicks.

Two owner decisions came out of it and are recorded as **#25** (the tier structure, the term, the tier names) and **#26** (the `NAV.featured` button in the bar). Both were written after the fact in unit 24, at the numbers the code was already citing.

## What shipped

| | PR #30 | PR #31 |
|---|---|---|
| Merged | 2026-08-25 | 2026-08-26 |
| Files | 8 | 1 |
| Lines | +705 / −95 | +2 / −2 |

- **New:** `src/components/pricing-tiers.tsx` (the four-card grid, 217 lines).
- **Changed:** `src/content/pricing.ts` (the content module rewritten around the tiers), `src/app/pricing/page.tsx`, `src/lib/types.ts`, `src/components/button.tsx`, `src/components/modal-trigger.tsx`, `src/components/site-nav.tsx`, `src/content/copy.ts`.

**Identifiers introduced** — this is the list unit 26 needs, since it builds four more routes against this pattern:

| Where | New |
|---|---|
| `src/lib/types.ts` | `PricingTierSlug` (`workflow` · `tool` · `rescue` · `custom`), `PricingTier` (interface) |
| `src/content/pricing.ts` | `PRICING_TIERS`, `PRICING_NEED`, `PRICING_CTA`, `PRICING_CTA_CUSTOM`; on `PRICING`: `intro` (replacing `body`), `term`, `tiersHeading`, `upfrontLabel`, `upfrontWasLabel`, `ongoingLabel`, `featuresLabel`, `footnote` |
| `src/components/pricing-tiers.tsx` | `PricingTiers` (server component) |
| `src/components/button.tsx` | `ButtonSize`, the `size` prop, `HIT_AREA`, `SIZES` |
| `src/components/modal-trigger.tsx` | optional `need` prop |
| `src/content/copy.ts` | `NAV.featured`, backed by a module-private `PRICING_ITEM` |

`PRICING.body` is the one identifier removed — the empty page's "the detail is coming" line, replaced by `intro` plus `term`. `ACCENT_PHRASE` on the route moved from `"publish"` to `"upfront"` with the headline.

## The tiers

Four, in owner-settled order, every figure a **display string** rather than a number — two tiers have no numeric upfront at all, so a `number` would have forced a sentinel and made every consumer re-derive the label from it.

| Tier | Slug | Upfront | Was | Ongoing | Preselects |
|---|---|---|---|---|---|
| AI Workflow Integration | `workflow` | $3,998 | $5,000 | $298 / month | `agentic` |
| Internal Tool | `tool` | $7,998 | $10,000 | $298 / month | `new_product` |
| Save Your Project | `rescue` | Quoted | — | $298 / month | `rescue` |
| Custom Product | `custom` | Quoted | — | Quoted monthly | `partnership` |

**The term is said on every card and once above the grid**, at full-strength white behind the system's gold diamond — not a muted footnote and not the hero's gold-italic aside. A price that hides a commitment is the "surprise invoice" Brand Philosophy §6 rejects, so hiding it was never an option.

**`features` is empty on all four tiers, deliberately.** The bullets were drafted and posted for approval and never landed, so each card renders no list rather than an invented one (Rule 4.3). The component already lays the list out, so approved bullets drop into content and nowhere else. This is the single largest thing the unit left behind.

## The owner revisions made mid-build

The tiers were not right first time, and four rounds of owner direction landed on top of the first build. Recording them because the *final* copy alone does not explain why the structure looks the way it does:

1. **Term cut from twelve months to three** (`96a4f34`), across the scoped tiers. **Save Your Project came out of the term entirely** — a two month trial with no contractual obligation, because that tier's visitor has already been burned once. The direction said "no contractual obligation" for that tier and "3 month required for all of them" in the same breath, which collide on exactly that card; the page-level sentence resolves it by **naming the exception** rather than stating a blanket commitment its own card contradicts. Flagged in PR #30 as a judgment call.
2. **Tiers 1–2 rescoped and renamed** (same commit). "AI Workflow Integration" is strictly agents integrated into existing business processes, not the customer-facing half of Brand Philosophy §4's Agentic Systems Integration; "AI Tool" became **"Internal Tool"**, a platform the client owns and runs internally rather than a product from scratch. Slugs and modal preselects unchanged. §4 is the authority on voice here, not on scope.
3. **Struck former prices** on the first two tiers (`f7420fa`) — $5,000 and $10,000, both keeping their dollar signs.
4. **The headline** (`37425bd`) — "We publish what we charge." became "**NextSketch puts the price upfront.**", the gold payoff word moving from "publish" to "upfront" with it, because `ACCENT_PHRASE` is matched against the headline string and leaving it would have dropped the heading to no gold word at all.

Then, a day later in PR #31: the rescue tier's upfront went from "No upfront" to **"Quoted"** (matching Custom Product and the example already documented on `PricingTier.upfront`), and Custom Product's description gained a **flat rate and a 6–8 week delivery window** — the old sentence said only *how* the work is priced, the new one says what the client buys.

## The naming that could not be written down

The first tier's working name ended in the word Rule 3.2 bans and Brand Philosophy §8 calls out by name, so the working name **would have failed the build on sight**. It ships as "AI Workflow Integration", and the copy uses Rule 3.3's sanctioned vocabulary ("embedded agents", "agentic systems") throughout.

The gate caught this during the build — on a **code comment** that named the retired term while explaining that it is banned. `check-banned-terms.mjs` scans `src/content/*.ts` raw, comments included. Fixed the way `copy.ts` handles the identical problem: the comment now refuses to spell the word, and says why. The rule demonstrating itself.

## Every band starts on the same line — CSS subgrid

The four descriptions run three to five lines, so a plain flex column staggered `Upfront` and `Ongoing` down the row and only the `mt-auto` CTA lined up (owner feedback, mid-build). Each card is now a **six-row subgrid** — name, description, upfront, ongoing, included, CTA — sharing its neighbours' row tracks, so each band's track is the tallest across the row and every card's bands start together. Content-driven, so it survives a copy edit, a font swap and every breakpoint; a `min-h` in pixels or `lh` survives none of those, and clamping would truncate a price description.

Two things were measured in-browser rather than assumed, because both decide the markup:

1. **A subgrid cannot reliably override the row gap it inherits.** `row-gap: 0` on the subgrid produced inconsistent gaps (20px then 40px against a 40px parent), not zero. So the **parent** carries `gap-x-4 gap-y-0` and the row separation is a uniform `mb-4` on the cards — uniform because a `last:mb-0` would inflate the final row's track for its siblings and leave that one card taller than the rest.
2. **Identical padding preserves alignment.** A subgrid positions its tracks inside its own content box, so padding shifts them; all four cards carry the same `p-6 md:p-8` and shift identically.

The consequence worth knowing: **the `Included` row renders even when a tier has no bullets.** Every card must span the same six rows or the subgrids stop lining up. Empty, its track collapses to nothing.

`mt-auto` is gone — the CTA no longer needs pinning, because its row is shared.

## The reference contributed composition only

Same posture PR #27 took with the gallery reference. Kept: a titled block above a 4-up card grid, each card running name → description → price → included → CTA. Refused wholesale:

- **All four npm dependencies** (`lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `react-aria-components`) plus shadcn `Card`/`Button`/`Switch` and a `cn()` helper this repo does not have. **Zero new dependencies shipped.** The list marker is the §Interaction-vocabulary gold diamond, not a lucide `Check`; the button is the shared `<Button>`; class composition is the repo's array join.
- **The monthly/annual billing toggle** — the reference's centrepiece. There is no such choice here, and a toggle would invent an annual plan that does not exist while implying the commitment is optional from day one.
- **The `recommended` tier**, its badge, ring and scale. There is no recommended tier, and marking one needs a second accent that decision #14 forbids.
- **`included: false` features with a strikethrough X** — comparison-table gimmickry, and the exclusions would be invented (Rule 4.3).
- Seat counts, `rounded-*`, `hover:shadow-md`, and the shadcn token palette.

**Surface:** cards are the elevated glass of §Surfaces at **solid `#0a0a0c`**, not the spec's `#0a0a0c/95 + backdrop-blur-xl`. That recipe exists so a card reads over the moving backdrop, and `/pricing` mounts no video. Work-band precedent (note 20), same reasoning, and the surface colour is unchanged so these read as one family with the Services cards.

**The CTA sits last**, where the reference puts it above the feature list. The one place the reference's ordering was overridden.

## `ModalTrigger` gained a `need`

Every tier button opens the qualification modal with that tier's need preselected. `ServiceCta` was the pattern but not the component: it is the §Interaction-vocabulary **gold underlined text link**, and a pricing card needs a **squared block button**. Neither existing component covered "a Button that preselects a need", so `ModalTrigger` was extended with an optional prop rather than `ServiceCta` forked into a second component. The provider's `openModal(need?)` signature already supported it — nothing was invented, the argument simply was not reachable from a Button until now. No behaviour change where `need` is omitted.

`PRICING_NEED` is a **total map over `PricingTierSlug`**, so a new tier without a need fails typecheck rather than shipping a button that preselects nothing. It is spelled out rather than derived, because the tier names are the owner's commercial framing and do not match the service slugs one-for-one.

**The doc block above the mapping defends `custom` → `partnership` as deliberate rather than mistaken, and that defence is the builder's, not an owner call on record.** Row #25 therefore records the mapping as as-built without ratifying its reasoning. Worth a second look by anyone who owns the tier vocabulary: a comment that pre-emptively tells the next reader not to correct something is exactly what stops a wrong mapping being caught.

Both CTA labels come from Rule 3.1's exhaustive set: **"Qualify Your Project"** on the three scoped tiers, **"Let's See if We're a Fit"** on Custom Product. They were the set's two previously unused members, so neither dilutes the hero's primary ("Start a Conversation") or the services cards' ("Build With Us"). **No §3.1 carve-out was needed** — verified against `05-business-rules.md` §3.1, which already lists both.

## The nav button, and `Button`'s new `size`

The bar gained one button beside the burger: `NAV.featured`, the shared `<Button>` at the **`ghost`** variant — §Interaction vocabulary's de-emphasized action on ink, deliberately not the white divided-arrow advance the hero CTA owns. Bar and menu read the **same object** (`PRICING_ITEM`), so the two strings cannot drift; the menu keeps its Pricing row, so the button is a shortcut rather than the only way there.

Three things were measured, and each one changed the markup:

- **The first visibility gate did nothing.** `<Button>`'s base class sets `inline-flex`, and `hidden` on the same element loses to it — equal specificity, resolved by stylesheet order, not class order. The gate moved to a **wrapper**.
- **The threshold is 375px, not `sm`.** Scrolled, the bar needs ~320px inside its gutters for the lockup (128px), the button (112px) and the burger (44px) plus gaps. At 375 the burger lands exactly on its 24px gutter; at 360 it creeps 7px inside it, which the binding gutter rhythm does not allow; at 320 it is pushed 23px off-screen.
- **Compact is 38px painted, exactly 44px tapped**, 3px per side, with a probe just outside correctly missing.

`size` is a prop on the shared `Button` rather than a `className` override, for the same specificity reason the visibility gate lost to: `px-4` and `px-7` are the same specificity, so Tailwind's stylesheet order would decide. Selecting one string per size removes the tie entirely, and `text-base` moved out of `BASE` into the size table for the same reason. The `arrow` treatment carries its segment paddings per size, so the divided arrow scales as one piece rather than shrinking its text but not its box.

**The load-bearing detail for anyone adding a size:** `min-h-11` now lives in the size table, **not** in `BASE`, because `compact` is deliberately shorter than the binding 44px touch target and a blanket minimum would have silently cancelled the whole change. `compact` earns its way back with a transparent `::after` that extends the hit region to 44px (`inset-x-0`, so it never reaches sideways over the burger 12px away). **Every size that is not hit-extended must carry `min-h-11` itself**, or the control silently drops under §Layout's minimum. The component says so out loud.

`compact` shipped twice: first as a responsive step (81×44 below `sm`, 112×50 above), then thinned to a flat **38px** at every width on owner direction. The responsive step existed only to stop the full-size button crowding a phone bar, and a control that is the right height everywhere does not need one. The nav row returned to the 68px it was before the button existed.

Each `Button` change was verified by **diffing every rendered button class string across all three pages** against the previous build: **7 of 9 byte-identical**, and the only two that changed are the nav buttons on `/` and `/pricing`. `hero-cta.tsx` is a separate component and was never involved.

## The bar stopped swallowing clicks

`<header>` is fixed, full-width and `z-40`, so its box sat over the page's own above-the-fold lockup and ate every click on it — which is why that lockup shipped **un-linked** in Unit 22, and why note 22 recorded it as unavoidable. The bar is now **`pointer-events-none`** with `pointer-events-auto` restored on the wordmark link, the button, the burger and the overlay.

That is what let `/pricing` link its lockup to `NAV.home` (`/#top`). The gutter padding moved onto the anchor rather than the `<header>`, for two reasons at once: the lockup still paints at the hero's exact 24px offset, and the hit area becomes 76px tall, clearing the 44px minimum that wrapping the bare 28px mark would have missed. Past 80px the bar's own wordmark answers the same click. **The home hero's lockup is untouched and still not a link.**

Nothing about the bar's appearance or the 80px handoff changes. Measured: no scroll position without a wordmark on screen, and the handoff jump actually **improved from 4px to 1px**.

## The intro band lost its bottom anchor

Empty, the page was a bottom-anchored `min-h-dvh` band repeating the hero's posture. With the tiers under it that becomes a full screen of air before the first price, so the band is now top-padded (`pt-32 / sm:pt-40 / lg:pt-48`) and sized by its content. The sticky lockup wrapper **must stay the section's first child with no top padding above it**, or the lockup starts 128px low.

## Deviations — flagged, not silently resolved

1. **Save Your Project has no required term**, against three months everywhere else. The owner's direction contained both instructions in one breath; this is the reading that does not make a card contradict the sentence above it. Recorded in #25.
2. **Brand casing.** The headline uses **NextSketch** (one word) per Taxonomy §8, though the owner's direction used the spaced form. The identical unresolved owner call is already on record from note 20 (`WORK_INTRO` renders "Next Sketch"), and ratifying it in the largest text on the page was not this unit's to do.
3. **Headline phrasing** is first-person-adjacent and plain rather than the supplied "provides an upfront pricing structure", which is third person and reads corporate against Brand Philosophy §8's peer-level voice. It also avoids claiming *every* engagement is priced upfront, which the quoted Custom Product tier would contradict.
4. **The struck former prices are a discount claim.** Fine if $5,000 and $10,000 are genuine prior or list prices, but a discount that never expires stops reading as one against the brand's no-hype posture. Open owner call.
5. **`PRICING.title` uses a pipe, not an em dash** — carried over from Unit 22 and unchanged. `SITE.title` separates with an em dash, but that is canonical copy approved under #3 and predates #19, and a new string does not inherit the exception.
6. **The unit shipped without a build note or its decision rows**, which PR #30's own "Outstanding" list said out loud. Both were written in unit 24, three days later. This note is the repair, not the practice.

## Found in the sweep, not fixed

- **`src/components/pricing-tiers.tsx:33` still says the retainer is "required for the first year (#25)".** The term was cut to three months in `96a4f34`, and the content module, the rendered copy and row #25 all say three. **The comment is the only thing left saying twelve**, and it cites #25 while contradicting it. Unit 24 may not touch `src/`, so it stands — this is the highest-value line in this section.
- **`src/lib/types.ts:141` cites `docs/06-taxonomy.md` for the tier slugs, and that document has no tier table.** Taxonomy §1 carries the four *service* slugs (`new-product` · `rescue` · `agentic` · `partnership`), which the tier slugs (`workflow` · `tool` · `rescue` · `custom`) do not map onto one-for-one: `rescue` is shared but scoped differently, and the other three have no §1 counterpart. Recorded in the decision-log footer, deliberately not resolved.
- **A line saying what the $298 actually buys.** The page states the price and the term but never the deliverable. Brand Philosophy §6 has the language. Carried in PR #30's outstanding list and never closed.
- **`01-vision.md` still says "Not a multi-page site — one page plus the modal. CURRENT".** Falsified by #23 in Unit 22, not by this work. Pre-existing drift, flagged not fixed.
- **Decision #19 remains broadly unenforced.** Measured 2026-08-28 with doc blocks and comments stripped: **35 rendered strings** across `src/content/` carry an em dash, one each — `modal.ts` 13 · `email.ts` 11 · `copy.ts` 8 · `faq.ts` 3, and **zero** in `pricing.ts`, `services.ts` and `work.ts`. **The pricing work added none.** Full breakdown in the decision-log footer.

## Verification (as recorded in PRs #30 and #31)

- `lint`, `typecheck`, `build`, `banned-terms` all green on both PRs. The gate scanned 37 files including `pricing.html` and `pricing.rsc`.
- `/pricing` prerenders static; `/api/qualify` remains the only server surface, so **decision #8 is untouched**.
- All four tier CTAs verified in-browser to open the modal with the right need selected: `agentic` → "Agentic system", `new_product` → "New product", `rescue` → "Product completion", `partnership` → "Product support".
- Subgrid alignment: at 1440 all six bands have **exactly one distinct top** across four cards with equal heights; at 900 each 2×2 row aligns internally with 16px separation; at 375 gaps are uniform, the price pair stays on one line, and nothing overflows.
- Compact button: 38px painted, exactly 44px tapped. Rendered button class strings across all three pages — 7 of 9 byte-identical to the previous build.
- No scroll position on `/pricing` without a wordmark on screen; handoff jump 4px to 1px.
- No em dashes in any rendered pricing string, checked with doc blocks stripped.
- `NSOS-Transfer/` untouched and still untracked.
