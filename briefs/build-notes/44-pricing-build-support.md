# Build Note 44: Pricing, build and support (adhoc)

**Date:** 2026-11-04 · **Branch:** `adhoc/pricing-three-parts` · **Base:** `main` @ `58ff66b`
**Status:** COMPLETE, waiting on Nate's review. `/pricing` sells AI Product Development as setup, build and support, and Agentic System Integration at its current prices with a two-month minimum. All four gates green. No PR: Nate opens it.
**Decision:** **#75**. Next free row **#76**, next build note **45**.
**Brief:** "Adhoc Unit: Pricing, build and support" (Nate, 2026-11-04, rev. 2, replacing the 2026-11-03 draft).

---

## What shipped

**The product card** (`custom` tier) shows three prices, one under the other, each under a hairline:

| Label | Figure | Caption |
|---|---|---|
| Setup | $11,998 | One time. Includes process mapping and discovery. On a project someone else started, it also covers assessing what's already built. |
| Build | $9,998 per month | While we build. Two months minimum, which lines up with the 6 to 8 week build. |
| Support | $4,998 per month | Starts after launch, and staying on is your call. Covers tuning and keeping things running, but no new features. New features later go back to the build rate for those months, then back to support. |

Its second list is now "What support covers", four lines led by tuning.

**The agentic card** (`workflow` tier) changes one word: "Required the first **two** months, optional after." Rendered-text diff against `main` confirms it.

**Projects someone else started** use the same card and prices. Setup says it covers the assessment, and the route's "A written assessment of what was built and what to keep" now ends "covered by setup", so "The same published price as a new build" stays true.

**The product route** carries the fuller support list with no figure, under a block renamed "Support after launch" (see the calls below).

**Lines brought in line:** the page intro, term line and search description on `/pricing`; the product route's search description, intro and blocks; `docs/`. No figure outside `/pricing` (#73).

## How the card was extended

Same card, same seven-row subgrid. No fork, no dependency, no new CSS class: the compiled CSS is byte-identical to `main`'s.

- **Support sits inside the ongoing row**, directly under the build rate, so both cards still span seven rows.
- **`TierMonthly`** is a small helper in `pricing-tiers.tsx` that draws one monthly band. Ongoing and support both use it, so they cannot drift.
- **Labels moved from page-level to per-tier**, because the agentic card had to keep "Upfront" and "Ongoing".

## Fields and types added or renamed

Nothing was renamed. Added:

| Where | Field | Value |
|---|---|---|
| `PRICES.product` (`services.ts`) | `support` | "$4,998". `upfront` holds setup and `monthly` holds the build rate |
| `PricingTier` (`types.ts`) | `upfrontLabel` | "Upfront" or "Setup" |
| `PricingTier` | `ongoingLabel` | "Ongoing" or "Build" |
| `PricingTier` | `support?` | `{ label, figure, note }`, product tier only |
| `PricingTier` | `coversLabel` | "What the monthly covers" or "What support covers" |
| `PRICING` (`pricing.ts`) | `setupLabel`, `buildLabel`, `supportLabel`, `supportCoversLabel` | The four new strings |

**Kept, and now slightly fossil, recorded in Taxonomy §9:** `PricingTier.monthlyCovers` (holds support's list on the product tier), `ONGOING_TEAM` in `diagrams.ts`, and `ProductTeamDiagram` / `product-team-diagram.tsx`.

## Every DRAFT line, for Nate's yes or a change

**`/pricing`**
1. Search description: "Published prices for AI automation and AI product development: a scoped upfront price, then a monthly rate. No hourly billing, no surprise invoices."
2. Intro: "Every engagement starts with a scoped upfront price, then a monthly rate. AI Product Development has two: a build rate while we build and a lower support rate after launch. You know every number before you commit. No hourly billing, no meter running during meetings, no surprise invoices."
3. Term: "The monthly is required for the first two months on both offers. After that, staying on is your call."
4. Agentic caption: "Required the first two months, optional after."
5. Labels: "Setup", "Build", "Support", "What support covers".
6. Setup caption, build caption and support caption (the table above).
7. What support covers: "Tuning the agents so they keep getting better" (the agentic list's line, verbatim), "Bug fixes and monitoring", "Security patches and updates", "Upkeep when outside tools change".

**`/services/product`**

8. Search description: "...or finished after someone else stalled. Then we stay on after launch."
9. Intro: "Three ways in, one way of working. Start from an idea, finish a product someone else got 70% of the way, or keep a live product running. We map the business first, build it correctly, and stay on after launch."
10. Finish what someone started: "A written assessment of what was built and what to keep, covered by setup" and "Two months minimum, then staying on is your call".
11. The block's name: "Support after launch". It also reads into the route's ribbon and the CTA's accessible name ("Build With Us, Support after launch").
12. The block's description: "The product is live. Now it needs tuning and upkeep. Support covers both, with no new features. When you want new features, we go back to the build rate for those months, then back to support."
13. The block's list: the four card lines, then "Watching what it costs to run, and keeping backups", "Small changes, help for your team, and documentation", "One monthly rate, never billed by the hour".
14. The block's diagram: "Next: v1.7, tool upkeep"; the slider's release notes "Security patches", "Agent tuning", "Bug fixes"; the accessible name "Support after launch: a live product being watched and tuned. It is live with 99.98% uptime. A chart of weekly active users across twelve weeks climbs from 820 users in week 1 to 1,240 in week 12, with updates 1.4, 1.5 and 1.6 shipped along the way, and update 1.7 next."

**Removed lines**
- From the card: "The build, for the first three months", "Then new features and AI improvements", "Upkeep, monitoring and fixes", "The same people who built it".
- From the route: "A team that covers growth, not just uptime", "Work agreed with you each month, never billed by the hour" (its second half survives in line 13), "The product maintained, monitored and kept current", "Whatever comes next, built by the people who built it".

## Calls that come back to Nate

Each is built the way recommended here, except 1 and 2, which are left as they were. None was resolved silently.

1. **The home card still says "we stay on as your product team"** (`services.ts:125`). The brief says no line on the site may disagree, and also that the home page is out of scope. I held to the scope line. It is now the only "product team" in the built HTML. **Recommend** changing it to "and we stay on after launch", which matches the proof band. It is a one-line edit.
2. **The product tier's description still says "Two starting points, one price"**, above three figures. Descriptions are guarded, so it stands. It means both starting points cost the same, but it could read as a slip. **Recommend** "one set of prices".
3. **Is support optional?** The brief sets a minimum on the build rate and none on support, and the old copy said "staying on is your call", so I kept that on the card and in the term line. **Recommend** keeping it. If support has a minimum, the card must say so (#25).
4. **"Ongoing product team" is renamed "Support after launch."** The brief names offers as guarded, and this is a way in, not an offer. A block called a product team with "no new features" under it reads as a contradiction. The anchor (`#product-support`) does not move, so old links still land. **Recommend** keeping the rename. It narrows #53's name, and #75 says so.
5. **The block's diagram had new features in it** ("AI search", "Faster checkout", "Smarter alerts", "Next: saved searches"). I swapped those strings for support work and left the drawing alone. The chart still shows users climbing, which is a growth picture under a support block. **Recommend** accepting this for now. A redraw would be its own unit.
6. **Where do "small changes" stop and "new features" start?** The Strata list includes small changes and the rule excludes new features. The site does not draw the line. **Recommend** leaving that to the SOW rather than a public page.
7. **The agentic card has empty space under its monthly**, about 210px at 1280, because the product's Support band shares that row. I kept the alignment you asked for on 2026-08-25 (every band starts on the same line). The alternative lets the agentic lists rise and breaks that alignment. **Recommend** keeping it. Look at this one on the page.
8. **"The same people who built it" left the card.** It is not in the Strata list. **Recommend** leaving it out. It can come back as a fifth line.

## Deviations from the brief

- **The source list.** The after-launch list comes from the brief itself. The Strata markdown files don't contain it (it is probably in the deck), so I searched them for the wording only and used nothing else from them.
- **`docs/five-levels-messaging.md` no longer matches its PDF on three lines.** It is a word-for-word transcription, but the brief says the docs must agree, so I updated the product row, the term and the third path name, and said so in its header. The PDF is Nate's. That doc says every post, ad and pitch uses the site's prices, so **anything outside this repo quoting $12,000, $10,000 or three months is now out of date.** I only checked `src/`, `docs/`, `scripts/` and the README.
- **The decision log.** Row #75 names what it supersedes in #45 and #56. As the brief says append only, #45 and #56 themselves were not annotated, though the preamble says a superseded row "says so" (#73 did the same to #53 and #56). I did update the preamble's counters and the "Still open" list, neither of which is a row.

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
| `service-pages.ts:153,156` | The assessment line, "Three months together, then staying on is your call" |
| `service-pages.ts:161-170` | "Ongoing product team", "After the first three months, your monthly becomes your ongoing product team: new features...", and its four lines |
| `service-pages.ts:219` | "Then we stay on as your product team." |
| `service-pages.ts:227` | "keep a live product growing... stay on as your product team" |
| `diagrams.ts:247,255-257,261` | "Ongoing product team...", three feature releases, "Next: v1.7, saved searches" |

**Doc blocks, changed:** `pricing.ts:6-9,17-35,55-65,131-135`, `services.ts:59-62,75`, `service-pages.ts:19-26`, `types.ts:322-350`, `pricing-tiers.tsx:24,39,72-82`, `product-team-diagram.tsx:17-18`, `product-diagrams.tsx:20-21`, `service-block-visual.tsx:40`, `services/product/page.tsx:18`, `diagrams.ts:244`.

**Docs, changed:** `decision-log.md` (preamble, new row, "Still open"), `03-site-architecture.md:3,15,69`, `04-ux-spec.md:3,100,162,301,354,356,360`, `05-business-rules.md:3,76`, `06-taxonomy.md:3,229,§9`, `five-levels-messaging.md:52-55`.

**Read and left, because they stay true:**
- `services.ts:65` and `pricing.ts:143-145,152-157`: the agentic figures and list.
- `services.ts:112`, `service-pages.ts:184`, `copy.ts:244,307`: the agentic monthly and the Optimize phase. All are true of support too, and none promises new features.
- `pricing.ts:47` headline, `service-pages.ts:155` same published price, `copy.ts:321` "We stay after launch".
- `03-site-architecture.md:70` and `04-ux-spec.md:380`: the agentic route's lists.

**Read and left, out of scope or a record:**
- `services.ts:125` home card and `pricing.ts:163` tier description (calls 1 and 2), `copy.ts:320` proof band.
- `faq.ts:21-33` and `copy.ts:145-147` (dormant), `modal.ts:43,51` (the form; "Within 1–3 months" is unrelated).
- `five-levels-messaging.md:67` ($2,998 stays right).
- Earlier decision-log rows and build notes (records), `06-taxonomy.md:308` (a record of #56).

## Verification

Headless Chrome over CDP against a production build. `main` was built from `git archive` and served beside the branch.

**`/pricing` at 360, 768, 1280 and 1920** (screenshots read at each width):
- Both cards read as the outcomes. Support sits directly under the build rate at every width.
- From 768 every row starts on the same line across both cards (row tops measured equal).
- No horizontal overflow at any width.

**CTAs, a real pointer click at each width:** "Qualify Your Project" opens the form with `agentic` ticked, and "Let's See if We're a Fit" with `new_product` ticked. 8 of 8.

**Rendered text and accessible names against `main`:**
- `/`, `/services/agentic-system` and the 404: **zero lines changed.**
- `/pricing` and `/services/product`: only the lines listed above changed.
- On the agentic card, only the term caption changed.
- Compiled CSS: byte-identical to `main`.

**Support block on the route:** at 1280 it grows from 511px to 666px with seven lines. No overflow and no truncated diagram label at any width.

**Built HTML (final build):**
- No "$12,000" or "12,000", no "$10,000" or "10,000", no "three months", "three-month" or "first three" in any page.
- $11,998, $9,998, $4,998, $3,998 and $2,998 appear in `pricing.html` only. The agentic route's other dollar amounts are diagram sample data (#60), unchanged.
- "product team" appears only in `index.html`, the home card (call 1).
- "new features" appears only in the two lines saying support excludes them.

**Dashes:** no em or en dash in any line added under `src/`.

**Contrast:** not re-measured. No new colour or surface: the captions and coral figures use the same tokens on the same `card` as before.

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ · `npm run banned-terms` ✓ (58 files).

**Not checked:** Safari, Firefox, iOS and Android (Chromium only), a real screen reader (names and roles checked in the DOM), a 2x screen, and CI (it runs when the PR opens).
