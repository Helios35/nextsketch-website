# Build Note 41: Level and offer colours (adhoc)

**Date:** 2026-10-30 · **Branch:** `adhoc/level-colors` · **Base:** `main` @ `c931fdf`
**Status:** COMPLETE. Seven identifying colours are site tokens. Each offering's colour shows as the **offer tab** on every surface that holds that offering, and no level colour renders yet, because no level is on the site. Coral is unchanged: no coral pixel moved. All four gates green.
**Follows:** build-note 40. **Decision:** **#67**. Next free row **#68**, next build note **42**.
**Brief:** "Adhoc Unit: Level and offer colors" (Nate, 2026-10-29 and 2026-10-30), Brief 1 of 2. Brief 2, the Five Levels messaging, uses these colours. Source: "NextSketch Messaging: The 5 Levels of AI" (2026-10-29), Visual style section.

---

## The source

The 5 Levels doc was not attached to the brief. The copy read is `OneDrive - Next Sketch LLC/__WORK/_SKETCH_MARKETING/NextSketch Messaging The 5 Levels of AI.pdf` (dated Oct 29, 2026). Its Visual style section matches the brief's table value for value. If a newer version exists, the values below are the ones to check against it.

## The colours, confirmed against fin

Fin's `styles/zen-linen-fin.css` (`C:\Users\nteiv\OneDrive\Documents\Projects\Fin`) was read directly.

| Job | Doc (light) | Fin light | Site token (dark) | Value |
|---|---|---|---|---|
| Level 1 | `#5579c6` | `chart-2` | `level-1` → `chart-2` | `#698EDD` |
| Level 2 | `#ab6b0c` | `chart-3` | `level-2` → `chart-3` | `#C2802D` |
| Level 3 | `#b95d45` | `chart-1` | `level-3` → `chart-1` | `#D17359` |
| Level 4 | `#9a62ab` | `chart-4` | `level-4` → `chart-4` | `#B077C2` |
| Level 5 | `#66892f` | `chart-5` | `level-5` → `chart-5` | `#7A9F46` |
| Agentic System Integration | `#4f7a3a` | `status-good` | `offer-agentic-system` | `#7FA85E` |
| AI Product Development | `#9a6b10` | `status-warning` | `offer-product` | `#C99A2E` |

- **The five levels are confirmed:** the doc's values are exactly fin's light chart set, and the dark values the brief guessed are fin's `.dark` chart set, already in `globals.css`. Fin orders its series ("assign in sequence"); the levels take the steps out of that order (2, 3, 1, 4, 5). That is the doc's call, and nothing on the site is a chart series.
- **The two offer colours are not new to fin.** The brief says "none yet", but `#7FA85E` and `#C99A2E` are fin's dark `status-good` and `status-warning`, and the doc's light values are fin's light ones. Fin marks those as **reserved for status, "never reused as a series"**, always with a label. The site carries no status colours, so there is no clash today. They are declared under offer names, and the reservation is recorded in `globals.css` and the spec.

## Token names (builder call, under the brief's "your call")

`level-1` to `level-5`, `offer-agentic-system`, `offer-product`.

- Each name says its job.
- An offer token carries the offering's slug exactly (`ServiceSlug`, Taxonomy §1), so code keys colour by the slug it already has.
- Each `level-*` points at its `chart-*` step, so a value lives once and fin's name stays the source. A component writes `level-*`, never `chart-*`.

All seven are `:root` properties bridged through `@theme inline` like every other colour, and no component writes a hex.

## Pre-flight inventory: every offer and step in a visual, card or tier

| Where | What's there | Colour added | Why |
|---|---|---|---|
| `/` hero capability strip | Both offer names, coral diamonds | **None** | The hero is locked (#50, #51). Brought back |
| `/` Services cards (2) | Offer name, index, price, examples, CTA | **Offer tab** | An offer named on a card |
| `/` Services waitlist band | The installable product ("Coming soon") | None | Not one of the two offers |
| `/` Why: process map | Six steps of one request; hand steps coral | None | Steps have no colour job; reads fine |
| `/` Process accordion | Map, Build, Validate, Optimize | None | No colour's job covers a phase |
| `/pricing` tiers (2) | Offer name, figures, lists, CTA | **Offer tab** | An offer named on a tier |
| `/services/*` ribbon | The route's examples or ways in | **Offer tab** | The first mark of the page's offering, above the eyebrow that names it |
| `/services/*` hero eyebrow | The offer name | None of its own | Covered by the ribbon's tab directly above |
| `/services/agentic-system` rows (4) | Example jobs, each with a before-and-after diagram | **Offer tab** | Marks the row and its diagram without redrawing it |
| `/services/product` rows (3) | Ways in, each with a product diagram | **Offer tab** | The same |
| Agentic route lists (2) | What you get, What the monthly covers | **Offer tab** | The offering's own lists, as on its tier |
| `/services/*` How it works (4 each) | The four phases | None | Shared by both offerings; no phase colour |
| Build-from-scratch diagram | Map, Build, Validate, Live timeline | None | Phases; drawn as before |
| Weekly reporting diagram | Four tools that look alike | None | No colour's job covers a tool. Brought back |
| Modal step 1 | Two offering boxes | None | Selection controls whose state is coral. Brought back |
| Modal step 2, Q1 | Four answers, three of them product | None | Selection controls |
| Levels | Nowhere on the site | None | Brief 2 |

## What changed

| File | Change |
|---|---|
| `src/app/globals.css` | Seven tokens on `:root` and in the `@theme inline` bridge. The `chart-*` comment no longer says "never per service"; it names them as the levels' source values. A new comment records the jobs, fin's status reservation, the close pairs and the contrast |
| `src/components/offer-tab.tsx` | **New.** `OfferTab`: a 2px by 40px `rounded-full` line, absolutely positioned on its host's top hairline (`-top-px`), placed by `className`, coloured by `ServiceSlug`. `aria-hidden` |
| `src/components/services-section.tsx` | Card `relative`; `OfferTab` last in the card at `left-6 md:left-8` |
| `src/components/pricing-tiers.tsx` | Card `relative`; `OfferTab` last, through `PRICING_OFFER`. Absolute, so it takes no subgrid row |
| `src/components/service-page.tsx` | Ribbon wrapper `relative` with `OfferTab` at `left-0`; every row `relative` with `OfferTab`; `OfferList` takes `offer` and renders the tab |
| `src/content/pricing.ts` | `PRICING_OFFER`: tier slug to offering (`workflow` to `agentic-system`, `custom` to `product`), beside `PRICING_NEED` |
| `docs/04-ux-spec.md` → **v4.8** | §Color: the palette rows, the new-tokens paragraph, two contrast rows, a coral bullet in §Accent rules, the #31 paragraph narrowed, and a new **§Identifying colours** (jobs, where each may and may not go, close pairs). Step 3 of "How to build a section", the `brand` row, and the home cards, tier grid and service rows in §Live components |
| `docs/06-taxonomy.md` → **v3.4** | §1 each offering's colour; §5 three rows (chart, level, offer), 33 names, the accent and chart paragraphs; §8 the naming rule and `OfferTab`; §9 a row |
| `docs/02-prd.md` → **v2.7** | The look paragraph names the seven colours beside coral |
| `docs/decision-log.md` | Row **#67**; the preamble (#45 to #67, next #68); the open items |

`capability-strip.tsx` is untouched. An `edge` prop was added and then removed when the tab moved to the route's wrapper, so the home hero's strip is the same file as on `main`.

## The offer tab, and the two forms that lost

1. **The 1px top hairline recoloured.** No layout change, but at 1x the green and yellow lines were too faint to tell the two cards apart at a glance.
2. **A 2px edge across the top, between the paddings.** Clear, but on the wide service rows it was a 1,000px green line, the first thing the eye found: the new colour leading coral.
3. **The tab (shipped).** 2px by 40px, at the content's left edge, directly above the coral index, like a tab on a folder. It reads at a glance on both widths and is smaller than any coral element on the same card. It is a line, never a shape, so it can never be read as a level's mark.

On the service rows the tab sits at the card's left padding edge on every row, including the alternating rows whose diagram is on the left at `lg:`, so the tabs line up down the page.

## Measured

**Tokens (WCAG, flat fills):**

| | `background` | `card` | `secondary` | `muted` | `accent` |
|---|---|---|---|---|---|
| `level-1` | 5.71 | 5.29 | 4.94 | 4.45 | 3.75 |
| `level-2` | 5.63 | 5.21 | 4.86 | 4.39 | 3.69 |
| `level-3` | 5.53 | 5.12 | 4.78 | 4.31 | 3.63 |
| `level-4` | 5.49 | 5.08 | 4.75 | 4.28 | 3.60 |
| `level-5` | 6.03 | 5.58 | 5.21 | 4.70 | 3.96 |
| `offer-agentic-system` | 6.72 | 6.22 | 5.81 | 5.24 | 4.41 |
| `offer-product` | 7.15 | 6.61 | 6.17 | 5.57 | 4.69 |
| `brand` (for reference) | 6.09 | 5.63 | 5.26 | 4.74 | 3.99 |

All seven are legal as text on `background`, `card` and `secondary`, and as marks (3:1) everywhere. Levels 1 to 4 must never be text on `muted` or `accent`.

**Every tab as rendered:** 60 tabs (15 per width across `/`, `/pricing` and both routes, at 360, 768, 1280 and 1920), each sampled against the pixel directly above and below it in the screenshot. Green 6.16 to 6.72:1, dark yellow 6.55 to 7.15:1. The low ends are tabs over the page glow.

**Close pairs (CIEDE2000; simulation Machado 2009, severity 1):**

| Pair | Normal | Protan | Deutan | Tritan |
|---|---|---|---|---|
| agentic green vs product yellow | 25.1 | 7.4 | 9.6 | 39.1 |
| agentic green vs `level-5` olive | **4.3** | 4.3 | 4.0 | 3.5 |
| product yellow vs `level-2` amber | 10.3 | 7.7 | 5.8 | 7.2 |
| agentic green vs coral | 50.9 | 9.9 | 5.8 | 48.2 |
| product yellow vs coral | 29.3 | 12.5 | 4.0 | 13.3 |
| `level-3` vs coral | **6.3** | 3.9 | 5.8 | 5.0 |
| `level-2` vs coral | 20.5 | 6.7 | 4.0 | 8.6 |

Olive and green read as one colour, as the brief warned. That is why an offering is only ever a line beside its name and a level only ever its own shape. Today the pair never meets, because no level renders.

## Verification

- **Before and after, every route at every width.** Headless Chrome, 1x, reduced motion (every reveal shown and every diagram still), 5 routes × 4 widths, full page: `main` built from `git archive` and served on :3101, the branch on :3100.
  - **With LCD text off** (`--disable-lcd-text` on both runs), **every changed pixel is inside a tab**, 80 per tab: `/` 160, `/pricing` 160, `/services/agentic-system` 560, `/services/product` 320, and the 404 identical, at all four widths. Nothing moved by a pixel.
  - **With LCD text on**, there is one more difference: deviation 1 below.
- **Coral is unchanged:** follows from the above (no coral pixel changed), and no class that paints coral was edited.
- **Hover:** each card's hairline still lifts to `muted-foreground/50` on hover, and the tab holds its colour (computed and captured on `/`, `/pricing` and the agentic route).
- **No hex in any component.** The only hex under `src/` outside `globals.css` is the email template's inline colour in `lead-notify.ts`, which this unit does not touch.
- **Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ · `npm run banned-terms` ✓ (57 files).
- **Not checked:** Safari, Firefox, iOS and Android (Chromium only), a 2x screen, and a GPU-composited Chrome. Headless ran with `--disable-gpu`, which is where deviation 1 was measured.

## Deviations from the brief

1. **Text antialiasing on the `/pricing` and service-route cards.** To hold the tab, each card is `position: relative`. On the routes with the page glow (#35), a positioned card paints on its own opaque layer above the glow's layer. Its text then renders with subpixel (LCD) antialiasing from 768px up, where on `main` it was grayscale: mean colour fringing on the AI Product Development tier name went from 10.9 to 52.4, against 65.3 on the home cards before and after. So those cards' text now renders the way the home cards' text already did. It is a font-smoothing change, not a colour, size or position change, and phones (360) show none. No clean way to place the tab without a positioned card was found: a background or border image cannot sit over the hairline on a rounded card, and an in-flow element would take a subgrid row. Recommended: keep. Brought back.
2. **Outcome 4, visuals read easier: no diagram changed.** Of the eight diagrams, seven read fine. The eighth, weekly reporting, has four tool panels that look alike, but none of the seven colours has "tool" as its job, and using a level colour there would tell a visitor that Spreadsheet is Level 1. The colour reaches the service routes' visuals through the tab on the row that holds each diagram, and each diagram is drawn exactly as before.
3. **"Append only" against "bring each in line".** The greps for "the one accent", "interface chrome" and "never per service" hit decision-log rows #14, #31 and #47. The log is append-only, so they are untouched, and #67 says what it narrows. The preamble's numbering and the open-items footer were updated, as every unit does. The other hits were brought in line: the spec's how-to step and `brand` row, its #31 paragraph, the taxonomy's §1, §5 and the chart paragraph, and the PRD's look paragraph. Dated supersession notes and the retired-token tables still say what was true when written, and were left.
4. **Docs beyond the brief's list:** `02-prd.md` and Taxonomy §1, §8 and §9, because the greps and the naming rules reached them.

## Builder calls (a yes or a change)

1. The token names (`level-n`, `offer-{slug}`).
2. The tab: 2px by 40px, round ends, at the content's left edge, over a full-width edge or a recoloured hairline.
3. The tab on the route's ribbon and on the agentic route's two list cards, besides the cards, tiers and rows.
4. On alternating rows the tab stays at the card's left, above the diagram when the diagram is on the left.
5. No colour on the home hero's capability strip (locked) or the modal's offering boxes (coral selection).
6. `PRICING_OFFER` in `src/content/pricing.ts`, beside `PRICING_NEED`.

## For Nate, and for Brief 2

1. **The offer colours cross the levels-to-offers mapping.** In the doc, Levels 2 and 3 are the agentic offer and Levels 4 and 5 the product offer. But the agentic green nearly matches Level 5's olive (4.3), a product level, and the product yellow sits near Level 2's amber (10.3), an agentic level. In a "levels to offers" picture, each offering's colour would sit beside a near twin from the other offering. **Swapping the two offer colours** (product green, agentic yellow) would make both near-matches point the right way. Recommended before Brief 2. It is a two-line change in `globals.css` plus the docs, and the doc and posts would follow. The alternative is to keep the doc's assignment and let labels and shapes carry it.
2. **Fin reserves the two offer values for status.** No conflict while the site has none. If status colours ever come to the site, one of the two moves.
3. **Under red-green colour blindness the two offerings are closer** (7.4 protan, 9.6 deutan). The name on every surface carries it.
4. **Level 3 is 6.3 from coral**, the same hue family. A Level 3 mark must not read as coral's emphasis.
5. **The site's list marker is a coral diamond**, while Level 4's shape is a diamond and Level 2's a square (the diamond is a rotated square). Brief 2 will need its level shapes to read apart from the coral marker beside them.
6. **Weekly reporting's four tools** look alike. Leave them, or give a colour that job in its own decision.

## Screenshots

Before and after, all 20 per side, plus the edge variants and crops, are in this session's scratchpad (not the repo). They can be sent on request.
