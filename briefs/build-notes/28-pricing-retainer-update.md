# Build Note 28 — Ongoing Retainer $298 → $2,098 (adhoc Unit 28)

**Date:** 2026-09-09 · **Branch:** `adhoc/pricing-retainer-update` · **Base:** `main` @ `b6c4913`
**Status:** COMPLETE. All four gates green; `/pricing` verified against the built output.
**Follows:** PR #35 / build-note 27. **Decision:** #38 (this unit's row).

---

## What changed

One number, everywhere it appears. Owner call, 2026-09-09: the ongoing monthly partnership is **$2,098**, replacing **$298**.

| Tier | Slug | Upfront | Ongoing — was | Ongoing — now |
|---|---|---|---|---|
| AI Workflow Integration | `workflow` | `$3,998` (struck from `$5,000`) | `$298 per month` | **`$2,098 per month`** |
| Internal Tool | `tool` | `$7,998` (struck from `$10,000`) | `$298 per month` | **`$2,098 per month`** |
| Product Completion | `rescue` | `Quoted` | `$298 per month` | **`$2,098 per month`** |
| New Product | `custom` | `Quoted` | `Quoted monthly` | `Quoted monthly` (unchanged) |

Upfront figures, struck former prices, tier names, tier order, descriptions, `ongoingNote` captions and the empty `features` arrays are all untouched.

### Files

| File | What moved |
|---|---|
| `src/content/pricing.ts` | Three `ongoing` values; `PRICING.description` (the route's meta description); `PRICING.term`; the two doc blocks that cite the figure |
| `src/lib/types.ts` | The `PricingTier.ongoing` JSDoc example, `"$298 per month"` → `"$2,098 per month"` |
| `src/components/pricing-tiers.tsx` | Doc-block only — the paragraph explaining why the reference's billing toggle was refused |
| `docs/decision-log.md` | New row **#38**; a one-field supersession note on **#25**; the numbering preamble; the open-items list |

Nothing else. `git diff --stat` is four files, and no component, layout, route, type or tier-shape change is in it.

## The term did not move, and neither did its wording

Required for the first three months on `workflow`, `tool` and `custom`, optional after. **Product Completion still carries no required term** — a two month trial with no contractual obligation — and the page-level sentence still names that exception rather than stating a blanket commitment its own card contradicts.

At $2,098 the required term now reads as **$6,294 committed**, so the brief's instruction was to check whether any copy had been soft because $298 was small, and to make it plain rather than softer if so. It had not been. `PRICING.term` already states the commitment before the cards, and each card's `ongoingNote` repeats it. Re-read against Brand Philosophy §6 ("no surprise invoices"), all five strings were already plain, so **not one word of copy changed** — only the numeral inside it. That is recorded in the `pricing.ts` doc block so the next agent does not read the unchanged wording as an oversight.

## What was deliberately not done

- **No strikethrough on the old monthly.** The struck figures on the first two cards are `upfrontWas`, framed as a discount off a prior upfront price. Striking `$298` beside `$2,098` would advertise a price increase. Brief-level refusal, restated in #38 so it does not get "fixed" later.
- **No new value bullets.** Rule 4.3 holds: `features` is `[]` on all four tiers, still owner-owed. A bigger number is not a licence to invent justification for it.
- **No new accent.** Gold stays the only one (#14) — nothing was added to draw the eye to the new figure.
- **No tier added, reordered or redesigned**, and **#8 untouched**: the page still sells nothing and takes no payment; `/api/qualify` remains the entire server-side footprint.

## Two things fixed in passing, both inside lines already being edited

1. **`pricing-tiers.tsx` said "required for the first year".** The term has been three months since #25 reduced it from twelve on 2026-08-25; the comment was never updated. It was the sentence carrying the `$298`, so it now reads "required for the first three months (#25, #38)". Comment only, no behaviour.
2. **The decision log's numbering preamble said "#1–#29 with no gaps, so the next new row is #30."** The log's actual tail was #37. Verified unbroken 1–37 before writing, so this row is **#38** and the preamble now says #39 is next. The brief guessed "#27 or later" and told the builder to verify the tail first, which is what caught this.

## `$298` that is still in the repo, on purpose

The brief's check is `grep -rn "298" src/ docs/` returning no *stale* monthly price. Five hits remain, and every one is a dated record or an explicit supersession pointer, not a live price:

- `src/content/pricing.ts` ×3 — the doc block naming the old figure, the date it changed, and #38.
- `docs/decision-log.md` #25 — the row records the call made on 2026-08-25. Rows are never reworded (the log's own numbering rule); it carries a one-field supersession note instead.
- `docs/decision-log.md` #38 — this unit's row, which has to name the figure it replaced.

`briefs/build-notes/23-*.md` and `24-*.md` also still say `$298`. They are as-built records of what shipped on their dates and are outside the brief's grep scope, so they were left alone.

## Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean |
| `npm run lint` | Clean |
| `npm run build` | Compiled; all six routes still ○ (Static) except `ƒ /api/qualify` |
| `npm run banned-terms` | Clean, 56 files scanned |
| Rendered `/pricing` (built HTML) | `$2,098 per month` on three cards, `Quoted monthly` on New Product; zero bare `$298` in output |
| Term statement on page | Present above the grid, three months named, Product Completion exception named |
| Meta description | `"...a $2,098 monthly product partnership..."` |
| Strikethrough | `Down from $5,000` / `Down from $10,000` only — no struck monthly anywhere |
| Modal preselects (built RSC payload, card order) | `agentic` · `agentic` · `rescue` · `new_product` — matches #29, `PRICING_NEED` untouched |
| `git diff --stat` | Four files, no surprises |

## Still open, unchanged by this unit

- **A line saying what the monthly partnership actually buys.** The page states the price and the term but never the deliverable (#25, carried since PR #30). Open at $298, still open at $2,098.
- **Tier feature bullets** — empty on all four cards, owner-owed (#25, Rule 4.3).
- **The struck former prices** ($5,000 / $10,000) as a standing discount claim (#25).
- **The `custom` slug carrying the name "New Product"** and `rescue` carrying "Product Completion" — fossils of retired names (#27), a separate owner call.
- **The em-dash enforcement gate** for `check-banned-terms.mjs` (#19), recommended and not built.
