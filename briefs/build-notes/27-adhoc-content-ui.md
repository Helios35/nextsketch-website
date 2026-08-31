# Build Note 27 — Content & UI Updates + the Stagger Fix (adhoc Unit 27)

**Date:** 2026-08-31 · **Branch:** `adhoc/content-ui` · **Base:** `main` @ `e404a9c`
**Status:** IN PROGRESS. The specified stagger fix is done and verified; the content and UI updates are Nate's in session and are not started.
**Follows:** PR #34 / build-note 26 (where the stagger bug was diagnosed).

---

## The entrance stagger on `/` and `/pricing` — fixed

The one pre-specified item. Build-note 26 diagnosed the site-wide bug: `motion-safe:animate-rise-in` compiles to the CSS `animation` shorthand, which resets `animation-delay` to `0s`, and the `motion-safe:` variant sorts after the plain `[animation-delay:…]` utility in the stylesheet — so the utility always loses and every element pairing the two computes `0s`. The documented 0 / 120 / 200ms hero stagger had never staggered on either page.

The fix is the unit-26 pattern, copied exactly: the delay moves from the class utility to an inline `style={{ animationDelay }}`, which the shorthand cannot reset. `motion-safe:animate-rise-in` stays as the class, so the reduced-motion gate is untouched. Four elements, two files, nothing else:

| File | Element | Before (computed) | After (computed) |
|---|---|---|---|
| `src/components/hero.tsx` | CTA wrapper (`Start a Conversation`) | `0s` | **`0.12s`** |
| `src/components/hero.tsx` | Gold-italic supporting line | `0s` | **`0.2s`** |
| `src/app/pricing/page.tsx` | Intro paragraph | `0s` | **`0.12s`** |
| `src/app/pricing/page.tsx` | Term paragraph (gold diamond) | `0s` | **`0.2s`** |

All measured in the browser with `getComputedStyle`, before and after. The 0ms elements (the hero capability strip, the pricing heading) carry no delay utility, were always correct, and are untouched. After the fix the Web Animations API confirms the engine itself carries the delays (`effect.getComputedTiming().delay` = 0 / 120 / 200ms) and every element settles at opacity 1, identity transform.

### Reduced motion, measured rather than reasoned

The Browser pane cannot emulate `prefers-reduced-motion`, so this was verified in headless Chrome launched with `--force-prefers-reduced-motion`, driven over CDP by a dependency-free Node script (Node ≥ 22 ships `fetch` + `WebSocket`; nothing was installed). On both pages with `matchMedia("(prefers-reduced-motion: reduce)")` matching:

- `animation-name: none` on all entrance elements — the `motion-safe:` gate survived the fix;
- zero running animations (`el.getAnimations()` empty);
- opacity `1` and `transform: none` immediately at load and again 400ms later — content visible at rest, no entrance, and no delay artifact: the inline `animation-delay` longhand computes but is inert with no animation to delay.

### Verification-tooling caveat, for the next agent

Build-note 26 recorded that the Browser pane does not advance CSS *transitions* while it is not painting. The same holds for CSS *animations*: while the pane tab is hidden, `document.timeline.currentTime` stays frozen at `0`, so every `rise-in` element reads opacity `0` forever and looks like a bug. It is not — front the tab (or take a screenshot, which forces frames) and the timeline advances and everything settles at opacity 1. Delay values themselves read correctly either way.

### Checks

| Check | Result |
|---|---|
| Computed delays on `/` and `/pricing` | 0 / 0.12s / 0.2s on both (tables above) |
| Reduced motion | No entrance, no artifact, content at rest — measured under a forced `reduce` |
| Wordmark handoff, both pages, scrollY 0 / 78 / 82 / 300 | Identical to each other and to the documented pattern: page lockup only below 80px (top 24), nav (top 20) + page (top 24) from 82px up |
| Console errors | None from the site; the Apollo tracker 400 on localhost is pre-existing (unit 19) |
| Horizontal overflow at 375 / 1080 / 1800 | None on either page (`scrollWidth === innerWidth`) |
| `npm run typecheck` / `lint` / `build` / `banned-terms` | All green; every route still ○ (Static); banned-terms clean, 56 files |

### Scope notes

- `globals.css` untouched; no new keyframe; `ScrollReveal` and the service routes untouched.
- No other animation-shorthand collisions were fixed. Per the brief's own grep-and-confirm step, `animation-delay` in source turns up exactly these four elements outside the service-page components — there is nothing else carrying the broken pairing to name.

---

## Everything else in this unit

Nate's, in session. Recorded below as it happens.

---

## 1. The rows become cards, and the surface value becomes a token (owner direction, 2026-08-31)

Recorded as **decision-log #33**. The direction had two halves and a scope rule: containers around the service-page rows so text and image read as one unit desktop to mobile; the card background from one consistent token "changed in one location", never case-by-case; and visually, nothing else moves — not §How it works, not any other part of the site.

### The token — `surface`

`#0a0a0c` was documented in §Color as "one deliberate literal outside the token set" and was hand-written in **12 class occurrences across 7 components** (pricing tiers, process cards, home services cards, work-rail cards, the modal, the nav bar + overlay, the mock frames). It is now `--color-surface`, defined once in `globals.css`, consumed as `bg-surface` / `bg-surface/95` everywhere.

**The declaration is `@theme inline`, and that is load-bearing.** In the plain `@theme` block a `/95` utility compiles to a runtime `color-mix()` over a `var()`, which lands **one RGB step off** the build-time fold the old literals got (measured on canvas: green 10 vs 9 over black). `@theme inline` inlines the raw hex, the fold is static again, and the compiled value is exactly what shipped before. The custom property is still emitted, so `visual-fade.tsx`'s `var(--color-surface)` reference resolves.

**Proof the sweep is visually inert:** the complete computed-`backgroundColor` tally of every element on all four pages, captured before and after. `/` and `/pricing` are **byte-identical** (down to the `lab(2.77686 0.219099 -0.803772 / 0.95)` serialization of the five glass surfaces). The service routes differ by exactly +3 and +2 opaque `rgb(10, 10, 12)` entries — the new row cards. Modal opened and eyeballed; wordmark handoff re-probed at 0 / 78 / 82 / 300 — identical to `/pricing`.

### The row cards

Each "what you get" `<section id>` takes the site's card recipe **exactly** — `border border-white/15 bg-surface p-6 md:p-8` with the `white/30` hover lift — solid, not glass, for the reason the sibling process band gives (no `ScrollVideo`). The deep-link `:target` treatment, alternation, DOM order and `scroll-margin` are untouched. The hover lift is included because it is part of the recipe the non-interactive process cards on the same page already carry; one class to remove if unwanted.

**`VisualFade`'s far stop moved `ink` → `surface`** (its one file; consumers are exactly the five block mocks, all now inside cards). Dissolving to `ink` on a `surface` card would ring every mock with a slightly darker vignette.

### The pre-existing mobile fault this surfaced

**Both service routes really rendered 497px wide at a 375px viewport** — before the cards. The mocks' fixed-pixel chrome, capped by the shell's `max-w-md` (448px), set the stacked mobile grid track's automatic minimum to 448; mobile Chrome zoomed the page out to fit, which is why unit 26's `scrollWidth === innerWidth` check passed: **auto-zoom equalizes both sides of that comparison.** (Build-note 26 also records the pane refusing to render below 466px, so the narrow case was never truly measured.) The card padding widened the spill by ~25px; it did not cause it.

Fix: **`min-w-0` on the row's two column divs** — the bento tiles' own load-bearing device (see build-note 26), one level up. The track shrinks, the mocks' `overflow-hidden` stages clip, the shared fade dissolves the clip. Verified via headless-Chrome device metrics (the pane cannot emulate below its own width): both routes now lay out at **exactly 375 / 1080 / 1800** with `scrollWidth === innerWidth` and the description and visual measured inside the card box.

### Docs reconciled

- `04-ux-spec.md` §Color: `surface` joins the Live palette table; the "deliberate literal" carve-out is closed with the `@theme inline` warning. §Surfaces and every `#0a0a0c` mention now name the token. §`/services/*` records the row cards and the `min-w-0` device.
- `decision-log.md` **#33** (the token + the cards + the mobile fault); the stagger open-item moved to **Resolved (unit 27)**.
- Component doc blocks that pointed at the literal now name the token, so nobody re-introduces `bg-[#0a0a0c]` by copying a comment.

### Checks (this task)

| Check | Result |
|---|---|
| Computed-background fingerprint, all 4 pages | `/` + `/pricing` byte-identical; routes +3/+2 card surfaces only |
| Overflow at 375 / 1080 / 1800, both routes | None — real device metrics, headless Chrome (`innerWidth === scrollWidth === width`) |
| Wordmark handoff 0 / 78 / 82 / 300 | Identical to `/pricing` |
| Modal smoke test | Renders correctly on `bg-surface` |
| Console | Site-clean; the Apollo tracker 400 is pre-existing (unit 19) |
| `typecheck` / `lint` / `build` / `banned-terms` | All green; all routes still ○ (Static); banned-terms 56 files clean **after a fresh `next build`** — running it against a dev-server `.next` scans only 38 files and is not a valid pass |

### Named and left (adversarial review, 2026-08-31)

- **`bg-[#101013]`** (`service-block-visual.tsx`, the selected TaskCard state) is a second, different elevated one-off literal. The "one location" directive arguably covers it, but it is not `#0a0a0c` and was not swept. Owner call whether it should become a token or fold into `surface`.
- **A dead `.bg-[#0a0a0c]/95` rule (~110 bytes) persists in the compiled CSS**: `globals.css` has no `@source` restriction, so Tailwind v4's content scan extracts the class form from backticked prose in the markdown docs and build notes. Visually inert; goes away if a `@source` directive ever scopes the scan.
