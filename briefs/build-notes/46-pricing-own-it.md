# Build Note 46: Pricing you own, and the Work band comes off (adhoc)

**Date:** 2026-11-13 · **Branch:** `adhoc/pricing-own-it` · **Base:** `main` @ `5993bc1`
**Status:** COMPLETE, waiting on Nate's review. `/pricing` sells both offers as one monthly rate while we work, two months minimum, nothing upfront; the product card says you own what we built; both cards say "Ongoing work is priced separately." with no figure. The Work band is off the home page and nothing points at it. All four gates green. No PR: Nate opens it.
**Decisions:** **#77** (pricing) and **#78** (the Work band). Next free row **#79**, next build note **47**.
**Brief:** "Adhoc Unit: Pricing you own, and the Work band comes off" (Nate, 2026-11-13).

---

## Pre-flight

- Clean tree on `main` @ `5993bc1` (PR #53 merged: row #76, build note 45). Branch cut from it. `NSOS-Transfer/` not touched.
- Traced pricing from `src/content/pricing.ts` (into `services.ts` `PRICES`, `service-pages.ts`, `types.ts` `PricingTier`, `pricing-tiers.tsx`, `pricing/page.tsx`, `service-page.tsx`) and the Work band from `src/app/page.tsx` (into `work-section.tsx`, `work-rail.tsx`, `src/content/work.ts`, `copy.ts` `NAV`, `site-footer.tsx`, `public/work/`).
- Read `AGENTS.md`, `CLAUDE.md`, `docs/00-project-setup.md`, `docs/05-business-rules.md` §3.2, §3.3, §4.1, `docs/decision-log.md` to its tail and its "Still open" footer, build notes 44 and 45, and build note 39 (the most recent to touch a Work file, in comments only; build note 36 is the last to describe the band: "Work: unchanged").
- Two empty, untracked directories, `src/app/work/[slug]/` and `src/content/case-studies/`, are left over from the case-study branches. Git does not track them and nothing reads them; left alone.

### List 1: every line that states a price or the term, says what the monthly or support covers, or says new features go back to the build rate

Line numbers are `main`'s.

**Rendered, `/pricing` (`src/content/pricing.ts`, `src/content/services.ts`)**

| Line | Says |
|---|---|
| `services.ts:69` | `PRICES["agentic-system"]`: `$3,998` upfront, `$2,998` monthly |
| `services.ts:70` | `PRICES.product`: `$9,998` build, `$4,998` support |
| `pricing.ts:51` | Search description: "Published prices... You know every number before you commit..." |
| `pricing.ts:54` | Headline "NextSketch puts the price upfront." (guardrail: left) |
| `pricing.ts:68` | Intro: agentic "has a scoped upfront price, then a monthly rate"; product "a monthly rate from the start while we build, then a lower rate for ongoing product support after launch. You know every number before you commit." |
| `pricing.ts:75` | Term: "The monthly is required for the first two months on both offers. After that, staying on is your call." |
| `pricing.ts:83-94` | Labels: "Upfront", "Ongoing", "Build", "Ongoing product support", "per month", "What the monthly covers", "What support covers" |
| `pricing.ts:167` | Agentic description (replaced by the owner line) |
| `pricing.ts:168-173` | Agentic: Upfront `$3,998`, "Scoped upfront. Process mapping, build and validation.", Ongoing `$2,998 per month`, "Required the first two months, optional after." |
| `pricing.ts:174-178` | Agentic "Included" (map, agents built in, validated) |
| `pricing.ts:179-185` | Agentic "What the monthly covers": watching what's running, fixes when tools change, tuning, mapping the next step |
| `pricing.ts:191` | Product description "Two starting points, one price" (#75 call 3) |
| `pricing.ts:192-196` | Product: Build `$9,998 per month`, "From the start, while we build, with no upfront cost. Two months minimum..." |
| `pricing.ts:197-200` | Product: Ongoing product support `$4,998 per month`, "Starts after launch, and staying on is your call... New features later go back to the build rate for those months, then back to support." |
| `pricing.ts:201-205` | Product "Included" (scope, product in 6 to 8 weeks, everything handed over) |
| `pricing.ts:206-212` | Product "What support covers" (four lines) |
| `pricing.ts:101` | Footnote (no price, no term: left) |
| `levels.ts:146-150` | `PRICING_LEVELS` (guardrail: left) |

**Rendered, the service routes (`src/content/service-pages.ts`)**

| Line | Says |
|---|---|
| `service-pages.ts:63` | `SERVICE_PAGE_LABELS.monthlyCovers`, "What the monthly covers", the agentic route's second list |
| `service-pages.ts:224` | That list is the agentic tier's `monthlyCovers`, word for word |
| `service-pages.ts:197` | Agentic route search description: "...Kept running and improving every month." |
| `service-pages.ts:145` | Build from scratch: "A team still there the week after launch" |
| `service-pages.ts:158` | Finish what someone started: "The same published price as a new build" (open under #73: left) |
| `service-pages.ts:159` | Finish what someone started: "Two months minimum, then staying on is your call" |
| `service-pages.ts:171-173` | Ongoing product support: "...Support covers both, with no new features. When you want new features, we go back to the build rate for those months, then back to support." |
| `service-pages.ts:175-183` | Its list, ending "One monthly rate, never billed by the hour" |
| `service-pages.ts:232` | Product route search description: "...Then we stay on after launch." |
| `service-pages.ts:241` | Product route intro: "...or keep a live product running... and stay on after launch." |
| `diagrams.ts:251-268` | `ONGOING_TEAM`: uptime, users, releases "Security patches", "Agent tuning", "Bug fixes", "Next: v1.7, tool upkeep" (no figure, no rate) |

**Rendered, the home page (out of the brief's named surfaces, read for disagreement)**

| Line | Says |
|---|---|
| `services.ts:119` | Agentic card: "...and keep them running and improving every month." |
| `services.ts:132` | Product card: "...and we stay on as your product team." (Nate's call under #75: "Leave it") |
| `copy.ts:244` | Why: "...and keep tuning them every month." |
| `copy.ts:307` | Process, Optimize: "We stay. Every month we watch what's running, fix what breaks when your tools change, and tune the agents..." |
| `copy.ts:319-321` | Proof band: "Prices on the page", "We stay after launch" (guardrail: left) |

**Not rendered:** `faq.ts:21-33` (dormant: "retainer-based", "scoped upfront"), `modal.ts:43` (the form's "Ongoing help with a live product", out of scope).

**Doc blocks in `src/`:** `pricing.ts:5-45, 49, 61-67, 69-73, 85-94, 141-161`; `services.ts:58-74, 82`; `service-pages.ts:14-33, 54-57, 154, 164-170, 223, 229, 239`; `types.ts:317-370, 419-420, 446-451`; `pricing-tiers.tsx:15-111, 166-170, 198-246, 257-259`; `service-page.tsx:62-67, 194, 645-647`; `pricing/page.tsx:133-141`; `services/agentic-system/page.tsx:21-22`; `services/product/page.tsx:18`; `product-team-diagram.tsx:17-18`; `product-diagrams.tsx:20-21`; `offer-tab.tsx:15`; `diagrams.ts:244-248`.

**Docs**

| File | Lines |
|---|---|
| `decision-log.md` | preamble counters; #45, #56, #75 (records, append only); "Still open" (#75's five calls, #73's two lines) |
| `01-vision.md` | 41 ("`/pricing` publishes the four tiers", stale since #56) |
| `03-site-architecture.md` | 3, 15, 17, 69, 70 |
| `04-ux-spec.md` | 3, 104, 176, 365, 371, 373, 377, 397 |
| `05-business-rules.md` | 3, 80 (Rule 4.1's `/pricing` trace) |
| `06-taxonomy.md` | 3, 234, 316-317 (§9 fossils) |
| `five-levels-messaging.md` | header, 52-57 (offer table, term), 69 (`$2,998 a month` stays right) |
| `02-prd.md`, `07-technical-spec.md`, `08-runbook.md`, `README.md`, `scope-lock-mvp.md` | no figure, term or support line |

### List 2: every link, anchor, section number and doc line that points at the Work band

**Code that renders or links it**

| Line | What |
|---|---|
| `src/app/page.tsx:10, 39` | imports and renders `<WorkSection />` between `<ProofBand />` and `<ManifestoSection />` |
| `src/app/page.tsx:12-30` | doc block: "the same one Work and the footer use", "Work was reactivated by #16", "the proof band between the hero and Work" |
| `copy.ts:93` | `NAV.items[0]`: `{ href: sectionHref("work"), label: "Work" }`, the only `/#work` link; the footer maps the same `NAV.items` (`site-footer.tsx:92`), so it carries it too |
| `copy.ts:73-78` | the `NAV.items` doc block on Work leading (#16, #21) |
| `work-section.tsx:60, 67` | `id="work"`, index `"01"` |
| `manifesto-section.tsx:41`, `services-section.tsx:62`, `process-section.tsx:48`, `about-section.tsx:58`, `final-cta-section.tsx:43` | indices `02`, `03`, `04`, `05`, `06` |
| `manifesto-section.tsx:20`, `process-section.tsx:20`, `about-section.tsx:22` | doc blocks naming "(02)", "(04)", "(05)" |
| `service-process.tsx:46` | doc block: "index `(04)` in the page's section" |

**Comments that point at it**

`proof-band.tsx:6` ("above Work"), `hero.tsx:25` ("the first scroll moves straight into Work"), `copy.ts:315` (PROOF "above Work"), `copy.ts:325-331` (the work-copy pointer), `site-nav.tsx:37` and `:94`, `service-page.tsx:260`, `types.ts:292-295` (the `/#work` example for root-relative anchors), `pricing-tiers.tsx:65` ("the Work band's precedent").

**Kept by rule**

- `copy.ts:120` and `work.ts:105`: the Behance URL. The footer's Behance social link stays (outcome 5).
- `types.ts:13`: `"work"` in `SECTION_IDS`, the precedent for dormant sections (`voices`, `fit`, `faq` keep theirs). Taxonomy §6 marks it dormant.

**The Work files (to go dormant):** `src/components/work-section.tsx`, `src/components/work-rail.tsx`, `src/content/work.ts`, `WorkItem` in `src/lib/types.ts`, `public/work/work-01.webp` to `work-04.webp`.

**Docs**

| File | Lines |
|---|---|
| `decision-log.md` | #16, #21, #24 (records, append only); "Still open": #73's flagged Work line, the audit's "Work rail's arrow boxes", the em-dash item's `work-rail.tsx` name |
| `01-vision.md` | 39 |
| `02-prd.md` | 18 ("hero + six sections") |
| `03-site-architecture.md` | 3, 30, 42, 52, 56 |
| `04-ux-spec.md` | 3, 48, 194, 269, 299, 345 (and the "(01)" renumbering), 410 (About "(05)"), 449 |
| `05-business-rules.md` | 84 (Rule 4.3's `#work` content) |
| `06-taxonomy.md` | 3, 243, 251, 260, 264, 270 |
| `07-technical-spec.md` | 153, 163, 183 (file tree) |

---

## Owner change before merge (Nate, 2026-11-13)

Nate looked at the cards in the dev server and cut both price captions to the term alone. "Nothing upfront" there could read as no first payment, and the rest over-explained: "its just the cost." He said to touch nothing else.

| | Was (first cut) | Now |
|---|---|---|
| Agentic caption | Nothing upfront, two months minimum. Covers the strategy, the process mapping, the build and validation. | Two months minimum. |
| Product caption | Nothing upfront, two months minimum, which lines up with the 6 to 8 week build. Includes process mapping and discovery, and on a project someone else started, assessing what's already built. | Two months minimum. |

**Then, the same day (Nate: "Yes, drop them"):** "nothing upfront" came off the three lines that still said it, for the same first-payment reading. No rendered line on the site says it now.

| Line | Was | Now |
|---|---|---|
| `/pricing` intro | "...with two months minimum and nothing upfront." | "...with two months minimum." |
| `/pricing` search description | "...two months minimum, nothing upfront." | "...two months minimum." |
| Finish what someone started | "Nothing upfront, two months minimum, and the finished product is yours" | "Two months minimum, and the finished product is yours" |

The rest of each line is unchanged. The headline's "upfront" now has only its own meaning (the price is out in the open).

**What the cut drops:** the product card no longer says the monthly covers assessing a project someone else started. The product route's "The same published price as a new build" still holds, because it's the same $9,998, but the card no longer explains why.

Both cards still line up row for row: at 1280 in the dev server, both read 627, 725, 861, 974, 1115, 1320.

## What shipped

### Part A: pricing

**The two cards** (same card, same grid, no fork, no dependency):

| | Agentic System Integration (`workflow`) | AI Product Development (`custom`) |
|---|---|---|
| Description | Owner line, word for word: "We start with your AI strategy. We map your systems, your processes and how work actually moves through your business, then build agents into the places they save the most time." | Unchanged ("Two starting points, one price..."), which is now literally true: one figure |
| Price label | While we work | While we build |
| Price | **$2,998** per month | **$9,998** per month |
| Caption | Two months minimum. | Two months minimum. |
| After the build | Ongoing work is priced separately. | You own what we built. / Ongoing work is priced separately. |
| Included | Your AI strategy, and where agents save the most time · A map of how the work runs today · Agents built into the tools you already use · Validated on your real work | Unchanged (scope, product in 6 to 8 weeks, everything handed over) |
| CTA, preselect | Qualify Your Project, `agentic` (unchanged) | Let's See if We're a Fit, `new_product` (unchanged) |

- **Gone everywhere:** $3,998, $4,998, "Upfront", "Ongoing", "Ongoing product support" as a price band, "What the monthly covers" and "What support covers" on the cards, "optional after", "staying on is your call", and every line saying new features go back to the build rate.
- **Page lines:** the intro, the term and the search description (DRAFT, below). The headline and its coral "upfront" are left (guardrail).
- **The card is a six-row subgrid** (seven before): name, description, price, after the build, included, CTA. The "After the build" band sits under the hairline the coral ongoing figure used to sit under, in plain `foreground`: there is no figure to set in coral. The ownership line is `font-medium`.

**`/services/agentic-system`:** the second list card was "What the monthly covers" (the tier's four lines, read from the tier). It is now **"After the build"**, holding the same four lines itself, and closes on "Ongoing work is priced separately." (`OfferList` gained a `note`). Nothing else on the route changed.

**`/services/product`:**
- Finish what someone started, last line: "Two months minimum, and the finished product is yours" (was "Two months minimum, then staying on is your call").
- **Ongoing product support stays a way in** (name, anchor, diagram unchanged). Its description is new and ends on the owner line; its list keeps six lines and loses "One monthly rate, never billed by the hour". No figure, no rate.

### Part B: the Work band

- `page.tsx` renders hero → proof band → Manifesto → Services → Process → About → Final CTA.
- `NAV.items` loses Work, so the nav overlay and the footer (which maps the same array) both read Why, Services, Process, About, Pricing. No `/#work` link exists anywhere.
- **Indices run with no gap:** Manifesto (01), Services (02), Process (03), About (04), Final CTA (05).
- The footer's Behance link stays.
- Comments that pointed at Work were brought in line, and the root-relative-anchor examples now use `#services`.

### Dormant Work files

On disk, unchanged except a two-line DORMANT note in the first two:

| File | What it is |
|---|---|
| `src/components/work-section.tsx` | The band (`id="work"`, index "01", which is Manifesto's now) |
| `src/components/work-rail.tsx` | The scroll-snap rail and its cards |
| `src/content/work.ts` | Eyebrow, headline, intro, rail labels, the four items |
| `src/lib/types.ts` `WorkItem` | The item type |
| `public/work/work-01.webp` to `work-04.webp` | The four screenshots |

`work` stays in `SECTION_IDS`, as `voices`, `fit` and `faq` do. Tailwind still scans the dormant files, so the compiled CSS keeps their classes.

## Every DRAFT line, for Nate's yes or a change

Owner copy, not DRAFT: the agentic description and "Ongoing work is priced separately."

**`/pricing`**
1. Search description: "Published prices for AI automation and AI product development. One monthly rate while we work, two months minimum. No hourly billing, no surprise invoices."
2. Intro: "Both offers are one monthly rate while we work, with two months minimum. When the work is done, you own what we built, and anything after that is priced when it comes up. No hourly billing, no meter running during meetings, no surprise invoices."
3. Term: "Both offers bill monthly while we work, two months minimum. When the work is done, the monthly stops."
4. Labels: "While we work", "While we build", "After the build".
5. Agentic caption: owner direction, not DRAFT (see Owner change below): "Two months minimum."
6. Agentic "Included", first line: "Your AI strategy, and where agents save the most time".
7. Product caption: owner direction, not DRAFT: "Two months minimum."
8. Product ownership: "You own what we built."

**`/services/agentic-system`**

9. The second card's title: "After the build" (and the owner line under its list).

**`/services/product`**

10. Finish what someone started: "Two months minimum, and the finished product is yours".
11. Ongoing product support: "The product is live, and you own it. If you want us to keep it tuned and running, we scope that work with you. Ongoing work is priced separately."

**Removed lines**
- `/pricing`: the old intro, term and agentic description; "Upfront", "$3,998", "Scoped upfront. Process mapping, build and validation.", "Ongoing", "Required the first two months, optional after.", "What the monthly covers" and its four lines; "Build", the old build caption (including #75's "which lines up with the 6 to 8 week build" and "Includes process mapping and discovery, and on a project someone else started, assessing what's already built."), "Ongoing product support", "$4,998 per month", the support caption, "What support covers" and its four lines.
- `/services/agentic-system`: "What the monthly covers".
- `/services/product`: "Two months minimum, then staying on is your call", the old support description, "One monthly rate, never billed by the hour".

## Fields and types added, renamed or removed

| Where | Change | Why |
|---|---|---|
| `PRICES` (`services.ts`) | `{ upfront, monthly }` and `{ build, support }` became `{ monthly }` on both | One figure per offering |
| `PricingTier` (`types.ts`) | removed `ongoing`, `ongoingLabel`, `ongoingNote`, `coversLabel`, `monthlyCovers` | No ongoing figure, one list |
| `PricingTier` | added `ownership?` | The product card's ownership line |
| `PricingTier` | kept `headlinePrice`, `headlinePriceLabel`, `headlinePriceUnit?`, `headlinePriceNote?` (#75's names) | Less churn; "headline" now means the one price |
| `ServicePageContent.offer` | `monthlyCovers` renamed `afterBuild` | It no longer lists what the monthly covers |
| `PRICING` (`pricing.ts`) | removed `upfrontLabel`, `ongoingLabel`, `supportLabel`, `monthlyCoversLabel`, `supportCoversLabel`; added `workLabel`, `afterLabel`, `ongoingWork`; `buildLabel` now reads "While we build" | The new strings |
| `SERVICE_PAGE_LABELS` (`service-pages.ts`) | `monthlyCovers` replaced by `afterBuild` and `afterBuildNote` | The agentic route's second card |
| `OfferList` (`service-page.tsx`) | added `note?` prop | The owner line under "After the build" |
| `AGENTIC_TIER` (`service-pages.ts`) | removed | The route no longer reads the tier's list |

Recorded in Taxonomy §9.

## Calls that come back to Nate

None was resolved silently. Each is built the way recommended unless it says "left".

1. **The agentic card's second list came off too, not only the product's.** The brief named only "What support covers". But the agentic "What the monthly covers" lines (watching what's running, fixes when tools change, tuning, mapping the next step) are all work after the build, which is now priced separately. Rewritten to describe the paid months, they would have repeated "Included". So each card has one list, and the four agentic lines moved to the agentic route as "After the build". **Recommend** keeping it.
2. **Ownership is on the product card only** (outcome 5). The intro says it for both offers, following the brief's short version ("After that the client owns what we built"). **Recommend** adding "You own what we built." to the agentic card too, if that's true of agents built into a client's own tools. It is one string (`ownership`).
3. **The two price labels differ:** "While we work" (agentic, the short version's words) and "While we build" (product, outcome 3's words). **Recommend** keeping both. One shared label is a one-line change if you'd rather.
4. **"While we work" means the monthly runs as long as the work does.** "Two months minimum" is the floor. If a build runs past two months, the monthly keeps running until the work is done, then stops. The term line says exactly that. **Recommend** confirming that's the intent.
5. **"Never billed by the hour" left the support way in** along with "One monthly rate". The brief doesn't say how ongoing work is priced, so I didn't restate it. If it's true, "Scoped with you, never billed by the hour" can come back as a seventh line.
6. **Four owner lines still say "every month", left as they were:**
   - the home agentic card: "...and keep them running and improving every month."
   - the agentic route's search description: "...Kept running and improving every month."
   - Why: "...and keep tuning them every month."
   - Optimize: "We stay. Every month we watch what's running..."

   None states a figure, a plan or a rate, and ongoing work still exists (priced separately). But next to a monthly price they can read as a monthly plan that never ends, which is the problem this unit solves. **Recommend** changing the two that describe the offer: the home card to "...and keep them running and improving." and the route description to "...Kept running and improving after launch." Leave Why and Optimize, which describe how we work.
7. **The owner line appears in two places beyond the cards:** under the agentic route's "After the build" list, and at the end of the product route's support description. Without it, both places would list ongoing work with nothing saying how it's priced. **Recommend** keeping both.
8. **Left: the `/pricing` headline**, "NextSketch puts the price upfront.", with "upfront" in coral (still open since #75, call 4). Since "nothing upfront" came off every line (Owner change above), nothing beside it competes with that meaning.
9. **Left: the home product card's "we stay on as your product team"** (your call under #75, "Leave it"). It states no rate, so it still reads true with ongoing work priced separately.
10. **Left: the agentic route's "What you get" list** (owner copy, #57). It doesn't lead with strategy the way the card's description now does. **Recommend** leaving it. A strategy line can lead it if you want the route to match.
11. **The commitment, for the record:** the least an agentic client pays falls from $9,994 ($3,998 + 2 × $2,998) to $5,996. The product stays at $19,996. No copy states a total.

**Closed by this unit**, from build-note 44:
- **Call 3:** "one price" now sits above one figure.
- **Call 5:** support is no longer a set-rate plan, so whether it's optional is moot.
- **Call 9:** no line ties new features to the build rate any more.

Calls 4, 7 and 8 stay open: the headline, the "Ongoing product support" name, and its diagram.

## Deviations from the brief

- **The pre-flight lists went into this note**, written before any source edit, not the session's task list, which is too small to hold them.
- **The decision log is append only.** It got rows #77 and #78. I also updated the preamble counters (next row #79) and the "Still open" footer: new items for this unit, #75's item rewritten for the calls #77 closes, and three Work items marked dormant. Neither is a row. #16, #21, #24, #45, #56 and #75 themselves are not annotated, as with #75 before.
- **Two touched comment lines lost an em dash** (`types.ts`, the `sectionHref` and `offer` doc lines), so every touched line is dash-free. Comments were exempt under #19 anyway.
- **Docs I read and left:**
  - `README.md` still says "Two pages". Stale since #30, unrelated to this unit.
  - Taxonomy §7 says Work screenshots land at `{id}.jpg`, but they are `.webp`. The DORMANT note names the real files.
- **Outside the repo:**
  - `docs/five-levels-messaging.md` now differs from its PDF on both offer rows and the term (its header says so).
  - Anything quoting $3,998, $4,998, "Upfront" or "then optional" (posts, decks, the Messaging Kit, SOW templates) is now out of date. I only checked `src/`, `docs/`, `scripts/` and the README.

## Verification

Headless Chrome over CDP against a production build of the branch (port 3100), with `main` built from `git archive` and served beside it (port 3102), under reduced motion, with LCD text off. Screenshots are in `.claude/pricing-own-it-shots/` (gitignored).

**`/pricing` at 360, 768, 1280 and 1920**
- Both cards read as Part A (text above).
- Each card spans six subgrid rows. From 768 the row tops match across both cards; at 1280 both read 628, 725, 861, 1018, 1160, 1365.
- The price holds one line at every width.
- No horizontal overflow.
- Screenshots read at 360 and 1280.

**CTAs:** a real pointer click on each tier CTA at each width. "Qualify Your Project" opens the form with `agentic` ticked, "Let's See if We're a Fit" with `new_product` ticked. 8 of 8.

**`/` at the same four widths**
- No `#work` element.
- No `a[href*="#work"]`, with the nav overlay closed or open.
- Indices read (01), (02), (03), (04), (05).
- `main` runs hero, proof band, `#why`, `#services`.
- The overlay and the footer list Why, Services, Process, About, Pricing.
- Behance is present.
- No overflow.
- In the browser pane, Manifesto's "(01) Process mapping" follows the proof band.

**Service routes at the same four widths:** no overflow. The agentic "After the build" card and the product support block render as above.

**Rendered text against `main`** (multiset of lines, 1280):
- `/` lost only the Work band's lines, the "Work" nav/footer label and "(06)". Nothing was added.
- `/pricing` changed only the lines listed above.
- `/services/agentic-system` changed only "What the monthly covers", which became "After the build" plus the owner line, and the nav label.
- `/services/product` changed only the three lines above and the nav label.
- 404: zero changes.

**Built HTML (final build)**
- No "$3,998", "$4,998", "$7,998", "three months", "three-month", "first three", "#work", "What support covers", "What the monthly covers", "build rate", "staying on is your call" or "optional after" in any page.
- `$2,998` and `$9,998` appear in `pricing.html` only.
- The agentic route's dollar amounts ($1,240, $18,420, $3,160, $3,400 and smaller) are diagram sample data (#60, #61), unchanged by this unit.
- "Ongoing work is priced separately." appears on `/pricing` (both cards) and both service routes, never with a figure.

**Contrast:** not re-measured. No new colour pairing: the new lines are `foreground` on `card`, and the labels are `muted-foreground` on `card` (4.96:1, build-note 43). The coral ongoing figure is gone.

**Gates (final tree):** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ · `npm run banned-terms` ✓ (59 files). **Dashes:** no em or en dash in any added line under `src/`.

**Not checked:** Safari, Firefox, iOS and Android (Chromium only); a real screen reader (text and names read from the DOM); a 2x screen; CI, which runs when the PR opens.
