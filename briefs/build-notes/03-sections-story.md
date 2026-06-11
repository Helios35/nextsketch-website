# Build Notes — 03 Sections: Story

**Branch:** `feature/sections-story` · **Date:** 2026-06-11 · **Brief:** `briefs/03-sections-story.md`

---

## What was created

### Components — `src/components/`
- **`HeroSection`** (`hero-section.tsx`, server): the promise in 3 seconds. Headline Option A at the new `hero` display scale, staggered in word by word (80ms/word per UX spec §Motion inventory) via per-word `<Reveal as="span">`; gold sketch underline under "stay"; subheadline; primary CTA anchored to `#start` (locked interim behavior, unit 06 swaps it); stat strip as a `<dl>` under a hairline — placeholder numbers (`00` / `00+` / `00%`) per `docs/decision-log.md` #5.
- **`ManifestoSection`** (`manifesto-section.tsx`, server): statement headline with rose underline under "actually need" (the reframe the section exists to land), body paragraphs offset right in two columns per the reference layout's editorial rhythm.
- **`ProcessSection`** (`process-section.tsx`, server): the interactive centerpiece as native `<details name="process-phase">` exclusive accordions — four rows, hairline-divided, one open at a time enforced by the browser, Strategy open by default via the `open` attribute. The open phase's number is circled by `<SketchAccent variant="circle">` in that phase's Taxonomy §2 accent; the circle is `hidden group-open:block`, so it mounts visible exactly when its row opens and the existing viewport trigger plays the draw-on. Handwritten annotation ("this is the part most firms skip" + rose arrow) renders inside Validate's expanded content. Plus icon rotates 45° on open, `motion-safe:`-gated.

### Primitive extensions (props, not forks)
- **`Reveal`** gains `as?: "div" | "span"` — inline reveals for the hero's per-word stagger; default unchanged.
- **`SectionHeading`** gains `size?: "display" | "hero"` — `hero` is 48→72→96px for the top-of-page promise; `display` (default, unchanged classes) for everything else.

### Content — `src/content/copy.ts`
- `HERO.stats` — four `{ value, label }` pairs. Values are obviously-unfinal placeholders; **labels are DRAFT copy pending owner approval** (see deviations).
- `PROCESS.annotation` — the UX spec's own example text for the Validate margin note. **DRAFT pending owner approval.**

### Routes — `src/app/page.tsx`
`#top`, `#why`, `#process` slots filled in place (min-height dropped, frame untouched). Empty 04/05 slots unchanged.

## Verification performed
- `npm run lint` · typecheck · `npm run build` · `npm run banned-terms` green locally (26 files scanned, clean).
- Browser walkthrough (desktop + 375px mobile): all three sections render per spec; accordion exclusivity confirmed (opening Validate closes Strategy, `open` states verified in DOM); circle draw-on plays on the newly opened row; plus→× affordance; annotation renders with Validate only.
- Anchors: `#why` and `#process` land at exactly section top − 80px scroll margin; `#top` at page top.
- No-JS (Business Rules E3): raw server HTML contains every visible string of all three sections with zero `opacity:0` styles; `<details>`/`<summary>` toggle without JS, so all four phases are readable *and openable* JS-free — only exclusivity and the draw-on need JS.
- Reduced motion (headless Chrome, `--force-prefers-reduced-motion`): full page visible, no transforms, no stroke-dasharray manipulation — accents pre-drawn.
- `<summary>` keyboard-focusable (native); no console errors or warnings.
- No regression: nav shrink/solid behavior, footer block, and the empty 04/05 slots intact.

## Decisions & deviations (flagged, not silently resolved)
1. **Process is a server component on native `<details name>`** — no client component, no new animation entry point, no modal of state code. The browser enforces one-open-at-a-time; native semantics give keyboard + screen-reader support free. Trade-off: a visitor can close the open row leaving none open (standard accordion behavior). Desktop "row expands on click" and the mobile accordion are the same control at different type scales — the judgment split the spec anticipated never materialized.
2. **No expansion transition on the accordion** — the UX spec's motion inventory lists no animation for process expansion; the circle draw-on is the open-state moment. Instant expand also equals the reduced-motion behavior, so the two modes never diverge structurally.
3. **`HERO.stats` labels drafted** ("Products in production" / "Ideas validated first" / "Partners who stayed" / "Handoffs after launch") — brand-voice draft, **needs owner approval**; numbers stay `00`-style until Nate supplies real stats (Decision Log #5, owed at launch-readiness).
4. **`PROCESS.annotation` drafted** — text lifted verbatim from the UX spec's example for this exact placement; still **needs owner approval** per the drafted-copy pattern.
5. **Underline targets are presentation markers, not copy** — `"stay"` (hero) and `"actually need"` (manifesto) are matched against the canonical strings at render; if owner edits the copy the accent degrades to nothing rather than mis-annotating. No copy is duplicated into components.
6. **Circle draw-on plays once per row per visit** (Motion `once`) — re-opening a previously opened row shows its circle pre-drawn. Matches the spec's "draw-on, once".
7. **Accent assignments:** circles use each phase's Taxonomy §2 accent; annotation is rose (Validate's pair, `rose-ink` text on paper); hero underline gold; manifesto underline rose. One-handwritten-element-per-viewport holds — the annotation only exists while Validate is open, adjacent to its own circle.
8. **Brief 03 copied into `briefs/`** — docs-in-repo pattern (unit 02, deviation 8).

## Naming reference
`HeroSection` (`hero-section.tsx`) · `ManifestoSection` (`manifesto-section.tsx`) · `ProcessSection` (`process-section.tsx`). Content exports extended: `HERO.stats`, `PROCESS.annotation`. Primitive props added: `Reveal as` · `SectionHeading size`.

## What downstream units inherit
- Section components own their vertical rhythm (`py-24 md:py-32`-ish) — `Container` slots stay bare; fill `#work`/`#services`/`#about`/`#voices` (04) and `#fit`/`#faq`/`#start` (05) the same way.
- `SectionHeading size="hero"` is reserved for `#top`; sections use the default.
- `Reveal as="span"` exists for any inline reveal.
- FAQ (unit 05) wants one-open-at-a-time + plus→minus — the `<details name>` pattern plus the rotating plus affordance built here gives both for free; reuse, don't fork.
- Unit 06 swaps the hero CTA action exactly like the nav CTA (`Button` href → onClick).
