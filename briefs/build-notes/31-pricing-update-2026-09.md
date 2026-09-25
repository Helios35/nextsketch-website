# Build Note 31 — Pricing reset: $2,998/mo agentic tiers, $12,000 + $10,000/mo product tiers (adhoc)

**Date:** 2026-09-25 · **Branch:** `adhoc/pricing-update-2026-09` · **Base:** `main` @ `24676cf`
**Status:** COMPLETE, with four items back to Nate (see "Judgment calls"). All four gates green; `/pricing` verified in the browser.
**Follows:** PR #36 / build-note 28. **Decision:** #45 (this unit's row).
**Brief:** `brief-pricing-update-2026-09` rev. 2 (owner call 2026-09-25). It supersedes `claude/brief-pricing-retainer-2098.md`.

---

## Had the $2,098 unit shipped?

**Yes.** `adhoc/pricing-retainer-update` merged to `main` as PR #36 (`24676cf`), recorded as decision #38 and build-note 28. So `main` was at $2,098, not $298. This branch was cut from `main`. That branch was not built on or merged again.

## What changed

| Tier | Slug | Upfront (was → now) | Ongoing (was → now) | Term (was → now) |
|---|---|---|---|---|
| AI Workflow Integration | `workflow` | `$3,998` (struck `$5,000`), unchanged | `$2,098 per month` → **`$2,998 per month`** | 3 months, unchanged |
| Internal Tool | `tool` | `$7,998` (struck `$10,000`), unchanged | `$2,098 per month` → **`$2,998 per month`** | 3 months, unchanged |
| Product Completion | `rescue` | `Quoted` → **`$12,000`** | `$2,098 per month` → **`$10,000 per month`** | two month trial, no obligation → **3 months required** |
| New Product | `custom` | `Quoted` → **`$12,000`** | `Quoted monthly` → **`$10,000 per month`** | 3 months, unchanged |

Captions:

| Tier | `upfrontNote` (was → now) | `ongoingNote` (was → now) |
|---|---|---|
| Product Completion | "The partnership starts on day one instead." → **"$12,000 upfront. Includes discovery."** | "Two month trial. No contractual obligation." → **"$10,000/mo covers the build. First three months required. After that, it covers support and continued development of the platform."** |
| New Product | "Priced once the scope is defined with you." → **(none)** | "Scoped to what the product needs." → **"Required the first three months, optional after."** (the caption the agentic tiers already carry) |

Page-level strings:

- `PRICING.term`: "The $2,098 monthly partnership is required for the first three months. After that it is optional, and staying on is your call. Product Completion is the exception: it starts as a two month trial with no contractual obligation." → **"The monthly partnership is required for the first three months. After that it is optional, and staying on is your call."**
- `PRICING.description` (meta): "…and a $2,098 monthly product partnership…" → "…and a monthly product partnership…"

### Files

| File | What moved |
|---|---|
| `src/content/pricing.ts` | Figures and captions on all four tiers; `term`; `description`; the header, CTA and tier doc blocks that cited $2,098, the trial or "quoted" |
| `src/lib/types.ts` | `PricingTier.upfrontNote` made optional (the `upfrontWas` precedent); JSDoc examples and the display-string rationale no longer cite "Quoted" / "No upfront" / $2,098 |
| `src/components/pricing-tiers.tsx` | `upfrontNote` renders only when present (the `upfrontWas` pattern); doc block no longer cites $2,098 |
| `docs/decision-log.md` | Row **#45**; supersession notes on **#25** and **#38**; numbering preamble; the open-items list |
| `briefs/build-notes/31-pricing-update-2026-09.md` | This note |

## Every place a price or term was found

Traced from `src/content/pricing.ts`, then `grep` across `src/` and `docs/` for `298|2,098|2098|quoted|no upfront|trial|no obligation|contractual|per month|/mo|$` figures, `retainer`, `monthly`, `upfront`.

| Location | What it said | Action |
|---|---|---|
| `src/content/pricing.ts`: four tiers, `term`, `description`, doc blocks | Every figure, the trial, "Quoted", "Quoted monthly" | Updated (above) |
| `src/lib/types.ts` `PricingTier` JSDoc | "$2,098 per month", "No upfront", "Quoted", "one is quoted" | Updated |
| `src/components/pricing-tiers.tsx` doc block | "$2,098 retainer" | Updated |
| `docs/decision-log.md` #25, #38, footer | $298, $2,098, trial, "Quoted" | #25 and #38 left as records with supersession notes; footer item re-scoped |
| `src/content/service-pages.ts` | Reads tier *descriptions* from `PRICING_TIERS`, no figures; "A retainer that covers evolution…", "Monthly work agreed with you, never billed by the hour" (DRAFT bullets) | No figure, trial or "quoted" claim. Untouched |
| `src/content/faq.ts` lines 23, 33 | Ongoing partnership "Scoped case-by-case based on what the product needs" / "scoped to what the product needs" | No figure. **Flagged**, not edited (see below) |
| `src/content/copy.ts:261`, `src/content/services.ts:147` | "Retainer-based" / "We stay on retainer" | No figure or term. Untouched |
| `docs/04-ux-spec.md` §`/pricing` | Tier grid layout; no figures. Line 233's "trial caption" is about a reference image, not Product Completion | Untouched |
| `docs/05-business-rules.md`, `docs/06-taxonomy.md` | No figure, no "quoted", no trial | Untouched, per the brief |

After the change, `grep -rnE "298|2,098|2098|quoted" src/ docs/` hits only: decision-log rows #25 and #38 (historical records, now marked superseded) and row #45 (which names the figures it supersedes); two doc comments that explain the history (`pricing.ts` "stop being quoted", `types.ts` "one quoted"); `apollo-tracker.tsx` ("the quoted, escaped JS string literal"); and an SVG path in `brand-wordmark.tsx`. `grep -rniE "no upfront|trial|no obligation" src/ docs/` hits only rows #25 (historical) and #45 (records the withdrawal), the `pricing.ts` doc comment "no longer runs as a trial", the UX-spec reference-image line, and "indus**trial** design" in several files. Neither grep finds a live claim.

## Where the three owner lines sit

On the Product Completion card, in order and word for word, using slots the card already has (no layout change):

1. `upfrontNote`: "$12,000 upfront. Includes discovery."
2. and 3. `ongoingNote`: "$10,000/mo covers the build. First three months required. After that, it covers support and continued development of the platform."

Lines 2 and 3 share one caption because the card is a six-row subgrid and a second caption under the ongoing figure would need a new row or a component change. Each line keeps its own sentence, so the text reads exactly as supplied. Checked against #19 (no em dash) and Rule 3.2 (no banned term): clean.

## Checks

| Gate | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean (after clearing stale `.next/dev/types`, see below) |
| `npm run build` | clean; `/pricing` prerenders static |
| `npm run banned-terms` | clean (56 files scanned) |

Browser, 1440px, `next dev`:

- Four cards read $3,998 + $2,998 per month · $7,998 + $2,998 per month · $12,000 + $10,000 per month · $12,000 + $10,000 per month, same order and names.
- Product Completion shows the three owner lines word for word.
- The term sentence above the grid reads as quoted above, with no exception.
- Every card's bands still line up across the row (subgrid intact with New Product's empty caption).
- Each tier CTA opens the modal with the right option checked: `agentic`, `agentic`, `rescue`, `new_product`.
- Struck prices appear only on the first two upfront figures.

**Environment note:** the first `typecheck` / `build` failed on `.next/dev/types/validator.ts`, generated by a dev server last run on a case-study branch (it referenced `/work` routes that don't exist on `main`). With no Next process running, `.next/dev/types` was deleted and everything passed. Nothing in `src/` was involved.

## Deviations from the brief

1. **Price format is "per month", not "/mo".** The brief says to match the existing strings and gives `$10,000/mo`. The shipped strings are `"$2,098 per month"`, and the code and production win over the brief, so the new figures read `$2,998 per month` and `$10,000 per month`. The owner's Product Completion lines keep his "/mo" as written, since they are his copy and must not be reworded. The card therefore shows "$10,000 per month" as the figure and "$10,000/mo covers the build" in the caption. Flagged, one-line change either way.
2. **The term sentence lost its figure as well as its exception.** The brief says to remove the exception and leave the rest alone. The rest named "$2,098", an old monthly the brief also says must not survive anywhere (Outcome 3), and one figure can't be right for tiers at $2,998 and $10,000. So "The $2,098 monthly partnership" became "The monthly partnership". No other word moved.
3. **The meta description lost its figure** for the same reason: "a $2,098 monthly product partnership" → "a monthly product partnership".
4. **Decision #45 and build-note 31, not #39 and 29.** `main` ends at #38 / note 28, but `adhoc/case-study-grid` (#39–#41, note 29) and `adhoc/case-study-template` (#42–#44, note 30) are pushed and awaiting PRs, and their source files already cite those numbers. Taking #39 would force a renumbering across those branches when they merge. The preamble records the gap and why.
5. **The brief says #25 and #26 "may not exist."** They do: both were reconstructed in unit 24 (2026-08-28). No action needed.
6. **New Product's `ongoingNote` was replaced, not just removed.** The old caption explained "Quoted monthly". Outcome 4 requires every tier to say three months required, and every other card says it in that caption. So New Product took the existing term caption ("Required the first three months, optional after."), which is the term statement, not new value copy.
7. **`PricingTier.upfrontNote` is now optional**, and the component renders it conditionally. This is the smallest way to show no caption on New Product without shipping an empty `<p>`, and it follows the `upfrontWas` pattern already in that file. No layout, class or row change.

## Judgment calls back to Nate

1. **New Product's upfront caption is empty.** Removing the "quoted" caption leaves a caption-height gap under `$12,000` where the other three cards have a line. The bands still align, so the card isn't broken, but it reads as a missing line. **Proposed (not shipped):** reuse the agentic tiers' already-approved caption, "Scoped upfront. Strategy, build and validation." That is reused copy, not new copy, but whether it describes New Product's upfront is your call.
2. **New Product's description still says "We define it with you first, then price it to the deliverable, so you get a flat rate that does not change."** Beside a published $12,000 that reads like a quote. It is Brand Philosophy §4 copy (Rule 4.1) and the brief gives New Product "its new prices and nothing more", so it is **flagged, not edited**. The same card also says "We deliver a working product in 6–8 weeks" against a three-month required term at $10,000/mo; worth a look at the same time.
3. **The New Product CTA is still "Let's See if We're a Fit."** It was picked because the tier was quoted and its scope undefined. The brief freezes CTA labels, so it stays; only the doc comment's rationale was updated. If you want the tier on "Qualify Your Project" like the other three, it's a one-line change.
4. **FAQ (`src/content/faq.ts`) says the ongoing partnership is "Scoped case-by-case based on what the product needs"** (line 23) and "scoped to what the product needs" (line 33). Neither names a figure or says "quoted", so both are outside the brief's list and untouched. Next to published monthly figures they read close to "quoted". **The FAQ is dormant today:** `faq-section.tsx` is not mounted by any route, so no visitor sees it. Recommend fixing it before it is ever brought back.

Also for your review: Product Completion's upfront reads "$12,000" as the figure and then "$12,000 upfront. Includes discovery." as the caption. The figure appears twice because the line is yours, word for word.

## Still open, unchanged by this unit

- Tier feature bullets: still `[]` on all four tiers (Rule 4.3, owner-owed).
- What the monthly buys on the other three tiers (Product Completion's is now answered).
- The struck former prices as a standing discount claim (#25).
- The `custom` / `rescue` slug fossils, the em-dash gate and the existing em-dash violations: out of scope per the brief.
