# Build Note 17 — Multi-Section Redesign (Unit 02: motion, sections, assembly)

**Date:** 2026-07-06 · **Branch:** `feature/multi-section-redesign` · **Brief:** workspace `briefs/redesign/02-sections-motion-assembly.md` (owner-directed single combined brief)
**Status:** Pushed for owner review — **no PR opened** (owner policy: Nate opens the PR after he verifies).

## What shipped

The single scrolling page: **hero → Manifesto (`#why`) → Services (`#services`) → Process (`#process`) → About (`#about`) → Final CTA (`#start`) → footer**, every section rebuilt **in place** (no `*-v2` forks) from its dormant paper-era component to the hero-derived design system (`docs/04-ux-spec.md` v3.0), over a **scroll-synced full-page video backdrop**, with a shared motion foundation. Hero, qualification modal, and lead pipeline untouched (diff confirms — zero hunks in `hero.tsx`, `hero-cta.tsx`, `qualification-modal*.tsx`, `src/lib/lead-*`, `src/app/api/qualify`). Held sections (Fit, Work, FAQ, Testimonials, old light hero-section) stay dormant and unmounted; they still compile against the re-skinned primitives.

## ★ Motion architecture (the Phase-A decision checkpoint + same-day owner revision)

Brought back to Nate mid-unit as the brief required. Initial checkpoint answers (2026-07-06): native JS + CSS keyframes · ambient play + parallax · video on the Services band. **Later the same day, after seeing the build, the owner revised the video direction:** the footage is the **background for the whole site**, and it must **play only with the scrolling action — stopping when scrolling stops**. Final architecture:

1. **Native browser JS triggering CSS keyframes** — no motion library; the `no-restricted-imports` ban on `motion/react` stands. JS only triggers and positions; every visible animation remains a `motion-safe:`-gated CSS keyframe.
2. **Scroll-synced video backdrop** — the video is a fixed `-z-10` layer behind the entire page; each animation frame eases `currentTime` toward the page's scroll progress. Footage advances only while scrolling, freezes on stop, reverses on scroll-up, and **never `play()`s** (no autoplay at all — which also satisfies the no-autoplay-video sustainability/a11y guidance more strictly than the ambient design did).

### The shared primitives (Phase A — new files)

- **`src/lib/use-reduced-motion.ts`** — `usePrefersReducedMotion()`, `useSyncExternalStore` over the media query; false on the server so SSR always renders the static branch.
- **`src/components/scroll-reveal.tsx`** — `<ScrollReveal delay as>`: IntersectionObserver flips the existing hero `rise-in` keyframe class. Server/no-JS HTML is fully visible (zero `opacity:0` server-side). Hero stagger rhythm: 0 / 120 / 200ms; lists 120 + i·80ms.
- **`src/components/parallax.tsx`** — `<Parallax speed maxShift>`: passive scroll listener + rAF writes a transform-only drift straight to the element (never through React state — byte-stable SSR). Feedback-loop-safe. Default speed 0.06; used on the Manifesto body and About portrait only.
- **`src/components/scroll-video.tsx`** — `<ScrollVideo src>`: the fixed site backdrop (`fixed inset-0 -z-10`), `preload="auto"`, muted/playsInline, **scroll-scrub engine** (rAF lerp of `currentTime` toward scroll progress, loop stops on convergence), hero image-band overlays (`ink/40` + bottom scrim) built in, `aria-hidden`. Reduced-motion and no-JS degrade to the same static first frame; the element never plays.
- **Painting note:** the page surface moved from `<body>` to `<html>` (`layout.tsx`) so the `-z-10` backdrop paints above the ink canvas but below all in-flow content.

**Video asset:** `Consulting Video 1.mp4` copied from the workspace redesign folder into **`public/consulting-video.mp4`** (2.2 MB, self-hosted — never remote).

## What each section became (Phase B — reworked in place, existing copy reused)

All five are transparent full-width bands over the backdrop: top hairline `white/10`, binding gutters (`px-6 sm:px-8 lg:px-16`), mono `(0n)` eyebrow via `SectionHeading`, one gold payoff phrase per headline (presentation-marker pattern — degrades if canonical copy changes), display headings carrying the licensed over-imagery text shadow.

- **Manifesto (`#why`)** — display statement, gold payoff "actually need" (replaces the retired rose sketch underline), body offset right in the two-column editorial rhythm, whisper parallax on the body block.
- **Services (`#services`)** — `(02)` eyebrow + headline (gold payoff "actually works") and the four canonical engagements as **elevated-glass cards** (`border-white/15 bg-[#0a0a0c]/95 backdrop-blur-xl` — the spec's exact elevated-surface stop, review-corrected from an invented `/80 + blur-md` stop), hover border → `white/30` at 150ms, in a 1/2/4-column grid with gold diamond + mono index. Replaces the retired four-color accent cards; `accent` fields orphaned, deliberately unread.
- **Process (`#process`)** — the native `<details name="process-phase">` exclusive accordion **reused, not rebuilt** (canonical since build-note 03; JS-free, keyboard-native, Strategy open by default). Hairline `white/10` rows (closing hairline on the container — `last:` on the rows would double the dividers, review-caught), mono numbers `white/55 → gold` on open, display-weight names, `PlusIcon` at `white/40`. `PROCESS.annotation` reinterpreted from the retired handwritten note to the **gold-italic aside**.
- **About (`#about`)** — flat band, `(04)` eyebrow, gold payoff "On purpose", three paragraphs, portrait as `Placeholder surface="ink"` under the section's single parallax. Real photography still owner-owed.
- **Final CTA (`#start`)** — flat bottom-weighted closing band, `(05)` eyebrow, gold payoff "right fit", body, **divided-arrow `ModalTrigger`** (`variant="inverse" arrow`) — same seam, E3 mailto degrade intact; modal logic untouched.

## Nav, footer & assembly (Phase C)

- **`site-nav.tsx`** — **fixed** (was sticky), transparent at top → **elevated glass** (`bg-[#0a0a0c]/95 backdrop-blur-xl`, `white/10` hairline, py-5→py-3 shrink) past 80px — the surface lives on an **inner div, not the header**, because a backdrop-filter on the header would become the containing block for the fixed mobile overlay and clip it to the bar (high-severity review catch, fixed and browser-verified). Nav wordmark renders only when scrolled (the hero owns it at top). Links are mono micro-labels (`white/60 → white`) with the over-imagery text shadow; both CTAs are divided-arrow `ModalTrigger`s. Mobile overlay: full-screen elevated glass, **`role="dialog"` + `aria-modal` + Tab focus trap** (review catch), Escape closes, body scroll locked, focus returns to the toggle.
- **`site-footer.tsx`** — full-width ink band on the hero gutter rhythm, mono micro-label anchors/socials (`white/60 → white`), the Rule-2.6 mailto centerpiece as the gold display-scale underlined link, mono legal line at `white/55` (review-corrected from `/40`, which failed WCAG AA on ink).
- **`src/app/page.tsx`** — `ScrollVideo` backdrop + `SiteNav` + `<main id="top">` (hero + five sections) + `SiteFooter`. Mounted in the **page**, not the layout, so the 404 keeps its own light surface.

## Primitive re-skins (Phase A, shared substrate)

- **`SectionHeading`** — display face to the system (`font-medium tracking-tight leading-[1.05]`), eyebrow → mono micro-label riding currentColor (404-safe), new `index` prop for the gold `(0n)` marker rhythm.
- **`Button`** — pill retired: `rounded-none`; new `arrow` prop renders the divided-arrow advance (label + hairline-divided arrow segment, hover scale + nudge — matching the hero CTA); ghost variant brought to the spec's exact treatment (`white/30 → hover white/60 + white/[0.06]`, review catch). The 404's button goes squared with the system.
- **`ModalTrigger`** — presentation-only `arrow` pass-through; open/degrade behavior byte-identical.
- **`Placeholder`** — new `surface="ink"` treatment (hairline `white/15`, `white/[0.03]` fill, mono asset name); paper default unchanged for dormant sections.
- **`PlusIcon`** — hardcoded `text-ink/40` removed; color rides currentColor.
- **`globals.css`** — `color-scheme: dark` on `html` (native scrollbars/controls render dark), with a `[color-scheme:light]` override on the 404's light surface (review catch); page surface `bg-ink` moved to `<html>` in `layout.tsx` for the backdrop painting order. **No new keyframes, no new tokens.**

## Copy changes (`src/content/` — all flagged DRAFT for owner approval)

- `NAV.items` rewired to the live anchors: **Why / Services / Process / About** ("Why" label is new draft copy; `#start` reached via CTA + footer).
- New section **eyebrows** (draft): "The problem" · "What we build" (`SERVICES_EYEBROW`) · "How we work" · "Who you work with" · "The next step".
- `PROCESS.annotation` text unchanged — only its *treatment* changed (handwritten → gold-italic aside).
- No other copy edited; dormant constants and orphaned `accent` fields left per the no-drive-by rule.

## Adversarial review (four lenses, verified findings) & fixes

Fourteen findings survived adversarial verification; all addressed or dispositioned:

- **HIGH — mobile overlay clipped by the blurred header** (backdrop-filter containing block): surface moved to an inner div. Browser-verified full-screen in the scrolled state.
- **HIGH — overlay lacked dialog semantics/focus containment**: `role="dialog"`, `aria-modal`, Tab trap added; verified.
- **MEDIUM — invented glass stop on service cards** (`/80+blur-md`) → spec's `#0a0a0c/95 + blur-xl + white/15`.
- **MEDIUM — nav `bg-ink/80` non-ladder / pure-#000 elevated surface** → elevated-glass recipe.
- **MEDIUM — overlay pure `#000`** → elevated glass (matches the modal's full-screen mobile pattern).
- **MEDIUM — footer legal `white/40` failed AA** → `white/55`.
- **MEDIUM — video autoplay lacked a pause control (WCAG 2.2.2)** → moot by owner revision: the scrub backdrop never auto-plays; motion occurs only during user scroll.
- **LOW — doubled Process hairlines** (`last:` inside reveal wrappers) → closing hairline moved to the container.
- **LOW — `color-scheme: dark` leaked to the light 404** → `[color-scheme:light]` on the 404 main.
- **LOW — ghost Button off-ladder, no hover** → spec treatment.
- **LOW — transparent-state nav links lacked the over-imagery shadow** → added.
- **LOW — reduced-motion fallback had no first frame** (`preload="metadata"`) → moot: scrub version uses `preload="auto"`.
- **LOW — no-JS mobile header nav is inert** (burger needs JS; anchor list hidden below `md`) — **accepted, pre-existing pattern**: the page is a single scroll, all content is reachable by scrolling, and the footer carries the full anchor set + mailto (the E3 posture). Flagged here rather than restructured.

## Other deviations & judgment calls

1. **Nav/footer mount in `page.tsx`, not `layout.tsx`** — keeps the dark shell off the light 404.
2. **Gold payoff choices** (presentation markers): "actually need" · "actually works" · "Stay." (period gold with the word) · "On purpose" · "right fit".
3. **No parallax in Process and Final CTA** — the interaction and the lone advance are those sections' moments (Brand Philosophy §9).
4. **Footer stays opaque ink** over the backdrop — a grounded close and guaranteed legibility for the legal/mailto block.
5. **Section body copy left unshadowed** — the backdrop's `ink/40` + scrim keep `white/70` body legible (browser-checked); only display headings carry the licensed shadow.

## Verification

- **Gates (local, re-run after every fix round):** `lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (Next 16.2.9) · `banned-terms` ✓ (27 files).
- **Scroll-sync (browser, desktop):** scrolling in steps advances `currentTime` (0.24 → 1.59s); stopping at 50% scroll settles at **5.001s of the 10s clip** and stays frozen while idle; scrolling back up reverses to 1.0s at 10%; `video.paused === true` throughout (never plays).
- **Browser walkthrough (1280×800 + 375×812):** page order + all six anchors in DOM; nav transparent→glass at 80px with wordmark appearing; accordion exclusivity (opening Validate closes Strategy) with the open number computing to `#E4B976`; gold-italic aside renders with Validate only; single 1px hairlines between Process rows (doubling fixed); final CTA opens the qualification modal (quick door) with `mailto:` fallback present; **mobile overlay opened in the scrolled/blurred state is full-screen 375×812** with working Tab trap; no horizontal overflow; no console errors/warnings.
- **Reduced-motion / no-JS by construction:** server HTML fully visible, all animation `motion-safe:`-gated, primitives check `prefers-reduced-motion` before observing/scrubbing, video static without JS or under reduced motion.

## Open for Nate

1. Approve/edit the **draft copy**: nav "Why" label, five section eyebrows, the annotation's survival as a gold-italic aside.
2. **Hero background asset** and **About photography** remain owner-owed (tracked separately).
3. Footer social URLs still placeholders (decision-log #4).
4. Review the section-level layout calls: Services card grid (1/2/4), About flat band, nav CTA over the hero, opaque footer over the backdrop.
5. The backdrop scrubs the **10s clip across the full page height** — if you want a slower/faster feel, the mapping is one constant in `scroll-video.tsx`.
6. **Open the PR when verified** — branch pushed, no PR per policy.
