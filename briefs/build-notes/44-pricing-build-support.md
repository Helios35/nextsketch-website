# Build Note 44: Pricing, build and support (adhoc)

**Date:** 2026-11-04 · **Branch:** `adhoc/pricing-three-parts` · **Base:** `main` @ `58ff66b`
**Status:** COMPLETE, waiting on Nate's review. `/pricing` sells AI Product Development with no upfront price: $9,998 a month from the start, then $4,998 a month ongoing product support. Agentic System Integration keeps its prices with a two-month minimum. All four gates green. No PR: Nate opens it.
**Decision:** **#75**. Next free row **#76**, next build note **45**.
**Brief:** "Adhoc Unit: Pricing, build and support" (Nate, 2026-11-04, rev. 2, replacing the 2026-11-03 draft), **amended by Nate in session the same day** (below). The branch name keeps the brief's three parts.

---

## Owner change before merge (Nate, 2026-11-04)

The brief asked for three prices on the product card, and the first cut (`d1cbacd`) built them: Setup $11,998, Build $9,998 a month, Support $4,998 a month. Nate reviewed it and changed it: "remove the 11,998 upfront cost just make it 9,998 from the start with the 4,998 ongoing product support. This only effects the product pricing..not automation pricing."

**This supersedes the brief's outcomes 1 and 5** where they name setup. What that changed:
- **The setup price is gone**, with its label and caption.
- **The product card has two prices, like the agentic card**, so the third-price extension came out (`support?` on the tier, the `TierMonthly` helper).
- **Build took the first price band and support the second**, so the two cards' prices line up band for band. The empty space the first cut left on the agentic card (about 210px at 1280) closed with it.
- **Discovery and the assessment moved into the build rate** (call 2, confirmed by Nate).
- **The block's name became Nate's own words**, "Ongoing product support" (call 7).

The agentic card is exactly as in the first cut. Against `main`, its one change is still "first two months".

## What shipped

**The product card** (`custom` tier):

| Label | Figure | Caption |
|---|---|---|
| Build | $9,998 per month | From the start, while we build, with no upfront cost. Two months minimum, which lines up with the 6 to 8 week build. Includes process mapping and discovery, and on a project someone else started, assessing what's already built. |
| Ongoing product support | $4,998 per month | Starts after launch, and staying on is your call. Covers tuning and keeping things running, but no new features. New features later go back to the build rate for those months, then back to support. |

Its second list is now "What support covers", four lines led by tuning.

**The agentic card** (`workflow` tier) changes one word: "Required the first **two** months, optional after." A line-by-line diff of the card against `main` confirms it.

**Projects someone else started** use the same card and prices. The build caption says it covers the assessment, so "The same published price as a new build" stays true.

**The product route** carries the fuller support list with no figure, under a block renamed "Ongoing product support".

**Lines brought in line:** the page intro, term line and search description on `/pricing`; the product route's search description, intro and blocks; `docs/`. No figure outside `/pricing` (#73).

## How the card was extended

Same card, same seven-row subgrid, no fork, no dependency.
- **Each tier names its own two bands.** The agentic card reads Upfront and Ongoing; the product card reads Build and Ongoing product support.
- **"per month" sits beside the build figure, set quieter.** The whole string at display size came close to wrapping at 360, and a bare "$9,998" would read as a one-off beside the agentic card's "$3,998". The figure holds one line at all four widths.
- **The compiled CSS differs from `main`'s by one utility,** `tracking-normal`, which that unit uses.

## Fields and types added or renamed

| Where | Change | Why |
|---|---|---|
| `PRICES.product` (`services.ts`) | `{ upfront, monthly }` became `{ build, support }` | The product has no upfront figure |
| `PricingTier` (`types.ts`) | `upfront` renamed `headlinePrice` | It would have held a monthly on the product tier |
| `PricingTier` | `upfrontNote` renamed `headlinePriceNote` | Same |
| `PricingTier` | added `headlinePriceLabel` | "Upfront" or "Build" |
| `PricingTier` | added `headlinePriceUnit?` | "per month", product tier only |
| `PricingTier` | added `ongoingLabel` | "Ongoing" or "Ongoing product support" |
| `PricingTier` | added `coversLabel` | "What the monthly covers" or "What support covers" |
| `PRICING` (`pricing.ts`) | added `buildLabel`, `supportLabel`, `supportCoversLabel`, `perMonth` | The new strings |

**Kept, and now slightly fossil, recorded in Taxonomy §9:** `PricingTier.monthlyCovers` (holds support's list on the product tier), `ONGOING_TEAM` in `diagrams.ts`, and `ProductTeamDiagram` / `product-team-diagram.tsx`.

## Every DRAFT line, for Nate's yes or a change

**`/pricing`**
1. Search description: "Published prices for AI automation and AI product development. You know every number before you commit. No hourly billing, no surprise invoices."
2. Intro: "Agentic System Integration has a scoped upfront price, then a monthly rate. AI Product Development has no upfront price: a monthly rate from the start while we build, then a lower rate for ongoing product support after launch. You know every number before you commit. No hourly billing, no meter running during meetings, no surprise invoices."
3. Term: "The monthly is required for the first two months on both offers. After that, staying on is your call."
4. Agentic caption: "Required the first two months, optional after."
5. Labels: "Build", "What support covers". ("Ongoing product support" is Nate's words.)
6. Build caption and support caption (the table above).
7. What support covers: "Tuning the agents so they keep getting better" (the agentic list's line, verbatim), "Bug fixes and monitoring", "Security patches and updates", "Upkeep when outside tools change".

**`/services/product`**

8. Search description: "...or finished after someone else stalled. Then we stay on after launch."
9. Intro: "Three ways in, one way of working. Start from an idea, finish a product someone else got 70% of the way, or keep a live product running. We map the business first, build it correctly, and stay on after launch."
10. Finish what someone started: "Two months minimum, then staying on is your call".
11. The block's description: "The product is live. Now it needs tuning and upkeep. Support covers both, with no new features. When you want new features, we go back to the build rate for those months, then back to support."
12. The block's list: the four card lines, then "Watching what it costs to run, and keeping backups", "Small changes, help for your team, and documentation", "One monthly rate, never billed by the hour".
13. The block's diagram: "Next: v1.7, tool upkeep"; the slider's release notes "Security patches", "Agent tuning", "Bug fixes"; the accessible name "Ongoing product support: a live product being watched and tuned. It is live with 99.98% uptime. A chart of weekly active users across twelve weeks climbs from 820 users in week 1 to 1,240 in week 12, with updates 1.4, 1.5 and 1.6 shipped along the way, and update 1.7 next."

**Removed lines**
- From the card: "Includes process mapping and discovery." (now inside the build caption), "The build, for the first three months", "Then new features and AI improvements", "Upkeep, monitoring and fixes", "The same people who built it".
- From the route: "A team that covers growth, not just uptime", "Work agreed with you each month, never billed by the hour" (its second half survives in line 12), "The product maintained, monitored and kept current", "Whatever comes next, built by the people who built it".

## Calls that come back to Nate

None was resolved silently. Calls 3 and 4 are left as they were; the rest are built the way recommended here.

1. **Decided: the home card stays (Nate, 2026-11-04, "Leave it").** It still says "we stay on as your product team" (`services.ts:125`), the only "product team" in the built HTML. The brief says no line on the site may disagree, and also that the home page is out of scope; I recommended "and we stay on after launch", and Nate kept the line.
2. **Decided: discovery and the assessment sit in the build rate (Nate, 2026-11-04, "Yes, keep it").** Setup was what paid for them, and it is what kept "the same published price as a new build" true for a project someone else started. With no setup, the card says the build rate includes them, and that line stays true.
3. **The product tier's description still says "Two starting points, one price"**, above two figures. Descriptions are guarded, so it stands. It means both starting points cost the same. **Recommend** "one set of prices".
4. **The headline still says "NextSketch puts the price upfront"**, with "upfront" in coral, above a card that says "no upfront cost". It means the price is out in the open, which is still true. **Recommend** leaving it.
5. **Is support optional?** The brief sets a minimum on the build rate and none on support, and the old copy said "staying on is your call", so I kept that on the card and in the term line. **Recommend** keeping it. If support has a minimum, the card must say so (#25).
6. **The two-month minimum stays on the build rate.** It wasn't part of the change, so it stands, and it is now the only commitment on the product: $19,996, against $31,994 with setup. No copy states a total. **Recommend** keeping it.
7. **"Ongoing product team" is now "Ongoing product support".** A block called a product team with "no new features" under it reads as a contradiction. The first cut used my own "Support after launch"; this is your phrase, and it now matches the card. The anchor (`#product-support`) does not move, so old links still land. **Recommend** keeping it. It narrows #53's name, and #75 says so.
8. **The block's diagram had new features in it** ("AI search", "Faster checkout", "Smarter alerts", "Next: saved searches"). I swapped those strings for support work and left the drawing alone. The chart still shows users climbing, which is a growth picture under a support block. **Recommend** accepting this for now. A redraw would be its own unit.
9. **Where do "small changes" stop and "new features" start?** The Strata list includes small changes and the rule excludes new features. The site does not draw the line. **Recommend** leaving that to the SOW rather than a public page.
10. **"The same people who built it" left the card.** It is not in the Strata list. **Recommend** leaving it out. It can come back as a fifth line.

## Deviations from the brief

- **The brief's outcomes 1 and 5, on setup,** by Nate's own change above.
- **The source list.** The after-launch list comes from the brief itself. The Strata markdown files don't contain it (it is probably in the deck), so I searched them for the wording only and used nothing else from them.
- **`docs/five-levels-messaging.md` no longer matches its PDF on three lines.** It is a word-for-word transcription, but the brief says the docs must agree, so I updated the product row, the term and the third path name, and said so in its header. The PDF is Nate's. That doc says every post, ad and pitch uses the site's prices, so **anything outside this repo quoting $12,000, $10,000 or three months is now out of date.** I only checked `src/`, `docs/`, `scripts/` and the README.
- **The decision log.** Row #75 names what it supersedes in #45 and #56. As the brief says append only, #45 and #56 themselves were not annotated, though the preamble says a superseded row "says so" (#73 did the same to #53 and #56). I did update the preamble's counters and the "Still open" list, neither of which is a row. Row #75 itself was rewritten before merge for Nate's change, and says so.

**Left as they were, flagged:**
- `copy.ts:320` "Prices on the page" (still open under #73, out of scope).
- `docs/01-vision.md:41` says "the four tiers" (stale since #56; states no figure or term).
- The doc block at `src/app/services/agentic-system/page.tsx:22` says "the price in the hero" (stale since #73, not rendered).

## Pre-flight list

Every line in `src/` and `docs/` stating a figure, the term or what the monthly buys, traced from `src/content/pricing.ts`, before any edit. Line numbers are `main`'s.

**Rendered, changed**

| Line | Said |
|---|---|
| `services.ts:66` | `$12,000`, `$10,000` |
| `pricing.ts:44` | "a scoped upfront build, then a monthly fee" |
| `pricing.ts:60` | "two parts... a monthly fee that keeps what we built running and getting better... both numbers" |
| `pricing.ts:67` | "required for the first three months" |
| `pricing.ts:146` | "Required the first three months, optional after." |
| `pricing.ts:164-168` | Figures, "Includes process mapping and discovery.", "After that it becomes your ongoing product team" |
| `pricing.ts:174-179` | "The build, for the first three months", "Then new features and AI improvements", and two more |
| `service-pages.ts:156` | "Three months together, then staying on is your call" |
| `service-pages.ts:161-170` | "Ongoing product team", "After the first three months, your monthly becomes your ongoing product team: new features...", and its four lines |
| `service-pages.ts:219` | "Then we stay on as your product team." |
| `service-pages.ts:227` | "keep a live product growing... stay on as your product team" |
| `diagrams.ts:247,255-257,261` | "Ongoing product team...", three feature releases, "Next: v1.7, saved searches" |

**Doc blocks, changed:** `pricing.ts:6-9,17-35,55-65,131-135`, `services.ts:59-62,75`, `service-pages.ts:19-26`, `types.ts:322-350`, `pricing-tiers.tsx:24,39,72-82`, `product-team-diagram.tsx:17-18`, `product-diagrams.tsx:20-21`, `service-block-visual.tsx:40`, `services/product/page.tsx:18`, `diagrams.ts:244`.

**Docs, changed:** `decision-log.md` (preamble, new row, "Still open"), `03-site-architecture.md:3,15,69`, `04-ux-spec.md:3,162,301,354,356,360`, `05-business-rules.md:3,76`, `06-taxonomy.md:3,229,§9`, `five-levels-messaging.md:52-55`.

**Read and left, because they stay true:**
- `services.ts:65` and `pricing.ts:143-145,152-157`: the agentic figures and list.
- `services.ts:112`, `service-pages.ts:184`, `copy.ts:244,307`: the agentic monthly and the Optimize phase. All are true of support too, and none promises new features.
- `pricing.ts:47` headline (call 4), `service-pages.ts:153,155` the assessment and the same published price, `copy.ts:321` "We stay after launch".
- `03-site-architecture.md:70`, `04-ux-spec.md:100,380`: the agentic route's lists, and coral on the ongoing monthly.

**Read and left, out of scope or a record:**
- `services.ts:125` home card and `pricing.ts:163` tier description (calls 1 and 3), `copy.ts:320` proof band.
- `faq.ts:21-33` and `copy.ts:145-147` (dormant), `modal.ts:43,51` (the form; "Within 1–3 months" is unrelated).
- `five-levels-messaging.md:67` ($2,998 stays right).
- Earlier decision-log rows and build notes (records), `06-taxonomy.md:308` (a record of #56).

## Verification

Run against the final code. Headless Chrome over CDP against a production build, with `main` built from `git archive` and served beside the branch.

**`/pricing` at 360, 768, 1280 and 1920** (screenshots read at 360, 768, 1280 and 1920 on the first cut, and at 1280 on this one; measured at all four on this one):
- Both cards read as the change asks: no $11,998 and no "Setup".
- From 768 every row starts on the same line across both cards (row tops measured equal).
- The build figure holds one line at every width (measured 32px tall).
- No horizontal overflow at any width.

**CTAs, a real pointer click at each width:** "Qualify Your Project" opens the form with `agentic` ticked, and "Let's See if We're a Fit" with `new_product` ticked. 8 of 8.

**Rendered text and accessible names against `main`:**
- `/`, `/services/agentic-system` and the 404: **zero lines changed.**
- `/pricing` and `/services/product`: only the lines listed above changed.
- On the agentic card, only the term caption changed.

**Support block on the route:** seven lines, no overflow and no truncated diagram label at any width.

**Built HTML:** see the gates run for this commit below.

**Contrast:** not re-measured. No new colour or surface: the quieter "per month" is `muted-foreground` on `card`, already measured at 4.96:1 (build-note 43), and the rest is unchanged.

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ · `npm run banned-terms` ✓ (58 files). **Built HTML (final build):** no "12,000", "11,998", "10,000", "three months", "three-month", "first three" or "Setup" on the tier in any page; $9,998, $4,998, $3,998 and $2,998 appear in `pricing.html` only, and the agentic route's other dollar amounts are diagram sample data (#60), unchanged; "product team" appears only in `index.html`, the home card (call 1); "new features" appears only in the lines saying support excludes them. **Dashes:** no em or en dash in any line added under `src/`.

**Not checked:** Safari, Firefox, iOS and Android (Chromium only), a real screen reader (names and roles checked in the DOM), a 2x screen, and CI (it runs when the PR opens).
