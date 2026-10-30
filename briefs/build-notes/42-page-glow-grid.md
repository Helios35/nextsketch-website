# Build Note 42: The page glow as a dotted grid (adhoc)

**Date:** 2026-10-30 · **Branch:** `adhoc/page-glow-grid` · **Base:** `main` @ `c931fdf`
**Status:** COMPLETE. On `/pricing` and the two service routes the glow's coral wash is now a dot grid, with the same fade and the same colour. Nothing else on any page changed. All four gates green. No PR: Nate checks the result first.
**Decision:** **#68** (#67 and build-note 41 are held by the unmerged `adhoc/level-colors`). Next free row **#69**, next build note **43**.
**Brief:** owner call in session, 2026-10-30: "change the background glow to a dotted grid with the same fade off gradient and color.. this only effects the pages with the glow.. we are not adding the grid to places that do not have the background....NOTHING ELSE should change outside of what i just specified. DO not create pr until I have checked results."

---

## Why a branch of its own

`adhoc/level-colors` (#67) is pushed and waiting on Nate's review. This is a separate change to a separate surface, so it is cut from `main` rather than added to that branch, the way the 12% glow (#52) was its own unit. The two branches don't touch the same code. Their docs do overlap: both edit the UX spec's and Taxonomy's version lines and the log's preamble and footer, so whichever merges second needs those few lines reconciled. That's why this branch numbers its doc versions 4.7.1 and 3.3.1, not 4.8 and 3.4.

## What changed

| File | Change |
|---|---|
| `src/app/globals.css` | `bg-page-glow`: the radial wash becomes a dot grid (`radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--brand) 12%, transparent) 1px, transparent 0)` at `16px 16px`) under `mask-image: radial-gradient(circle 560px at 50% 200px, rgb(0 0 0), transparent)`. The comment records why and that 12% is still the ceiling |
| `src/components/page-glow.tsx` | Comment only |
| `docs/04-ux-spec.md` → **v4.7.1** | §Surfaces' glow note, §Measured contrast, §`/pricing`, §`/services/*`, the retired-gold table's successor cell |
| `docs/06-taxonomy.md` → **v3.3.1** | §5's `bg-page-glow` row |
| `docs/decision-log.md` | Row **#68**, the preamble (#67 held by level-colors; next #69), an open item |

**What did not change:** the `PageGlow` component and its `fixed inset-0 -z-10` mounting, the utility's name, the three routes that mount it, and everything on `/`, the 404 and every surface without the glow. No grid was added anywhere that had no glow.

## How "same fade, same colour" is built

- **Colour:** each dot is `brand` at 12%, exactly the colour at the glow's centre.
- **Fade:** a mask with the glow's exact geometry (`circle 560px at 50% 200px`, opaque at the centre, transparent at 560px) multiplies the dots down the same linear ramp the wash had. So a dot at any distance is the colour the wash was at that spot, and nothing between the dots is tinted.
- **Measured** on `/pricing` at 1920 against `main`: the wash and the dot at the same pixel agree within 1/255 at every distance from the centre out to 480px. For example, (45,29,26) before and (46,29,26) after at the centre, and (32,24,22) for both at 288px. Between dots the page is plain `background` (20,20,20).
- **The dot grid is the site's own:** the diagram canvas's `bg-diagram-grid` geometry (a 1px dot every 16px), so the site keeps one dot-grid language. It is fixed to the viewport, as the glow was, so content scrolls over it. That's a builder call; the pitch and dot size are one line each.

## Measured

**Only the backdrop changed.** 20 full-page screenshots, five routes at 360, 768, 1280 and 1920, headless Chrome at 1x with reduced motion. `main` was built from `git archive` and served on :3101, the branch on :3100.

- With the glow layer hidden on both builds, all 20 are **byte-identical**.
- With it shown, `/` and the 404 are **byte-identical** at all four widths.
- On the three glow routes, **every changed pixel is one the old wash or the new dots paints**. Each changed pixel was tested against the same build with the layer hidden, and 0 were unexplained across all 12 shots.
- Card text antialiasing is unchanged (mean fringing on the pricing tier name 10.9 before and after).

**Text over the grid** (WCAG, against the brightest dot, at the centre):

| Text | On the brightest dot | On the old wash, same spot | Between dots |
|---|---|---|---|
| `muted-foreground` | 4.68 | 4.69 | 5.36 |
| `brand` (coral) | 5.31 | 5.33 | 6.09 |
| `foreground` | 12.57 | 12.62 | 14.41 |
| `ring` (focus) | 10.25 | 10.29 | 11.75 |

A glyph that crosses a dot meets the colour it met under the wash. Everywhere else it meets plain `background`. So the floor holds exactly where it held under #52, and 12% is still the ceiling.

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ · `npm run banned-terms` ✓.

**Not checked:** Safari, Firefox, iOS and Android (Chromium only); a 2x screen, where each dot is 2 device pixels across and reads a little crisper.

## For Nate

1. **The dots are faint.** At the glow's own colour they are about as quiet as the diagram canvas's grid, and they fade out within 560px of the centre (2x crops are in the session scratchpad). Brighter dots are a one-number change, but above about 13% a line of muted text that crosses a dot at the centre falls under 4.5:1. A stronger grid is a trade against the contrast floor, not a free tweak. Tell me if you want it stronger, larger or more widely spaced.
2. **Merge order** with `adhoc/level-colors` doesn't matter for code. The second to merge needs the doc version lines and the log's preamble reconciled.
