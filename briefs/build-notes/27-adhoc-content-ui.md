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

Nate's, in session. To be recorded here as it happens.
