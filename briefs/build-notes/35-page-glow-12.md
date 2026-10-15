# Build Note 35: The page glow at 12% (adhoc)

**Date:** 2026-10-15 · **Branch:** `adhoc/page-glow-12` · **Base:** `adhoc/design-system-audit` @ `4a7aafa` (stacked: merge the audit first)
**Status:** COMPLETE. The glow on `/pricing` and the service routes is 12% coral; every page-ground text crossing its centre now clears 4.5:1 at all four widths. All four gates green.
**Follows:** build-note 34 (the design-system audit), finding F1. **Decision:** **#52**. Next free row **#53**, next build note **36**.
**Brief:** owner call in session, 2026-10-15: "drop the page glow from 16% to 12% coral on its own branch, re-measure the muted text at the glow centre, and record it as decision #52."

---

## Why the base is the audit branch

Decision #52 cites build-note 34's measurements, and that note, the UX spec's glow exception and the decision log's footer item exist only on `adhoc/design-system-audit`, which is pushed but not merged. Cut from `main`, this branch would record a decision against a note that is not there and leave the audit's docs claiming an open miss after the fix landed. So it stacks: merge the audit, then this. Its own diff against the audit is five files.

## What changed

| File | Change |
|---|---|
| `src/app/globals.css` | `bg-page-glow`: `color-mix(in srgb, var(--brand) 16%, transparent)` → `12%`. The comment records why and where the ceiling is |
| `src/components/page-glow.tsx` | Comment only: the "intensity knob" note said "raise it for more glow"; it now says 12% (#52) and that contrast caps it at about 13% |
| `docs/decision-log.md` | Row **#52**; a supersession note on **#35** (its intensity, not its geometry or scope); the preamble (#45–#52, next #53); the footer's audit item drops F1, and a new "Resolved (2026-10-15, #52)" line records it |
| `docs/04-ux-spec.md` → **v4.2** | §Measured contrast: the exception becomes the record of the fix, with the 12% numbers and the ceiling; the ring row notes its 16% reading; §`/pricing`, §`/services/*` and §Retired say 12% |
| `docs/06-taxonomy.md` → **v2.8** | §5's `bg-page-glow` row: at 12% since #52 |

The geometry (`circle 560px at 50% 200px`), the colour token (`brand`), the three routes that mount it and the home page's exclusion are untouched (#35).

## Why 12%

The glow is viewport-fixed with its centre 200px down the screen, so every `muted-foreground` text on these pages' ground passes through it. At the centre the ground is `brand` mixed over `background`:

| Glow | Ground at the centre | `muted-foreground` there (computed) |
|---|---|---|
| 16% (#47) | `#38221D` | 4.34:1 (fails) |
| 14% | `#33201C` | 4.48:1 (fails) |
| 13% | `#311F1B` | 4.55:1 (passes, no margin) |
| **12%** | `#2F1E1B` | **4.62:1** (measured: 4.64:1) |

12% is the highest whole step with margin. Coral text has more headroom (it is brighter than the muted step) and passes at either setting.

## Measured

Same method as build-note 34: headless Chrome over the DevTools protocol against `next start`, reduced motion, each text on the page ground (`muted-foreground` or `brand`, no opaque ancestor) of `/pricing`, `/services/product` and `/services/agentic-system` scrolled so its centre sits on the glow's centre row, its glyphs made transparent, and the ratio taken against the worse of the 5th and 95th-percentile background pixel behind them.

| | 16% (build-note 34) | **12% (this unit)** |
|---|---|---|
| Widths | 360, 1280 | 360, 768, 1280, 1920 |
| Texts measured | 32 (muted only) | 88 (64 muted, 24 coral) |
| Muted text, minimum | **4.36:1**; 8 under 4.5 | **4.64:1**; none under 4.5 (the same at every width) |
| Coral text, minimum | (not separated) | **5.21:1** ("upfront", `/pricing`, 360) |

The agentic route's hero eyebrow, which sat at the centre on load on a phone at 4.41:1, is among the 4.64s.

## Where the change shows

Screenshots against the audit build (the same 143-capture set as build-note 34: every route at 360, 768, 1280 and 1920 as scrolled tiles, plus 12 modal states per width):

| Route | Result |
|---|---|
| `/`, the 404, every modal state | **Byte-identical** (the glow is not mounted there) |
| `/pricing`, `/services/product`, `/services/agentic-system` | Every tile differs (the glow is fixed, so it sits behind every viewport); every page height is unchanged |

The glow still reads as a warm spotlight behind the heading, a little quieter.

## Checks

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ · `npm run banned-terms` ✓ (56 files).

**Not re-measured:** focus rings over the glow (10.02:1 at 16% in build-note 34; a fainter glow only raises it), and real Safari, Firefox, iOS and Android (Chromium only here).
