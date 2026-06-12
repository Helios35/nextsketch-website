# Build Notes — 04 Sections: Proof

**Branch:** `feature/sections-proof` · **Date:** 2026-06-11 · **Brief:** `briefs/04-sections-proof.md`

---

## What was created

### Components — `src/components/`
- **`WorkSection`** (`work-section.tsx`, server): Selected work (#work) as the 2×2 asymmetric grid per the reference layout — two stacked columns, the right column offset down (`md:pt-16`), mixed 4/3 and 1/1 ratios, single column on mobile. Tiles are extended `<Placeholder>`s with the UX spec's placeholder treatment: translucent accent tint, diagonal sketch-hatch overlay, and the "Case study — coming in build" label. No project names, no outcomes (Rule 4.3). Hover: tile lifts (`motion-safe:hover:-translate-y-1`) and a sketch arrow draws in the corner via the new CSS hover-draw (below).
- **`ServicesSection`** (`services-section.tsx`, server): the four canonical engagements from `SERVICES` (Rule 4.1, copy untouched) under `SERVICES_HEADLINE`. Each card sits on its Taxonomy §1 accent with paired `-ink` text via a static class map — the pairing rule holds mechanically. Hover: subtle lift + corner annotation arrow in the paired ink (`tone="ink"`), per the UX spec's component spec.
- **`AboutSection`** (`about-section.tsx`, server): the solo "about me" (#about) as a rounded ink panel — headline, three drafted paragraphs, and `placeholder-about-01` (3/4 portrait) for owner photography. All copy is DRAFT (deviations 1–2).
- **`TestimonialsSection`** (`testimonials-section.tsx`, server): two quiet placeholder quote blocks (#voices) per Rule 4.2 — oversized sans quote mark in an accent (gold, sage), the UX spec's "Client quote — pending approval" placeholder-state text, hairline border on `paper-bright`. Layout-final: approved rewrites drop in as a copy change. Secondary reassurance — no carousel, no stars, never the lead (architecture row 8).

### Primitive extensions (props, not forks)
- **`Placeholder`** gains `accent?: AccentName` (translucent accent tint + diagonal hatch overlay + paired `-ink` text — the work-tile treatment) and `label?: string` (visible site copy from a content constant, rendered above the taxonomy asset name). Default rendering unchanged; the default branch now pins `text-ink` so the box stays readable inside dark contexts (the About panel).
- **`SketchAccent`** gains `tone?: "base" | "ink"` (paired `-ink` stroke for accent backgrounds, per the pairing rule) and `drawOn?: "view" | "hover"`. Hover mode is pure CSS — `pathLength={1}` normalizes the geometry so a one-unit dash hides/draws the stroke via `stroke-dashoffset`, gated `motion-safe:` and triggered by a parent `group`'s hover. No Motion involved: the hover branch is server-renderable, and reduced-motion users see the stroke pre-drawn (same contract as the view branch). The view branch is untouched.

### Content — `src/content/copy.ts`
- `WORK` — headline + tile label. **DRAFT pending owner approval** (deviation 1).
- `ABOUT` — headline + three body paragraphs. **DRAFT pending owner approval** (deviation 2) — the brief's explicit approval gate.
- `TESTIMONIALS` — headline + placeholder label. **DRAFT pending owner approval** (deviation 1).

### Routes — `src/app/page.tsx`
`#work`, `#services`, `#about`, `#voices` slots filled in place (min-heights dropped, frame untouched). Empty 05 slots unchanged.

## Verification performed
- `npm run lint` · typecheck · `npm run build` · `npm run banned-terms` green locally (26 files scanned, clean — includes the new copy). Rule 3.2/3.4 grep over `src/` by hand: no hits.
- Browser walkthrough (desktop + 375px mobile): all four sections render per spec; anchors land at section top − 80px scroll margin; asymmetric grid stacks to one column on mobile; About panel and cards reflow correctly.
- Hover-draw verified mechanically (computed styles: `stroke-dasharray: 1`, resting `stroke-dashoffset: 1`, 300ms transition, compiled `group-hover` rule) and visually (arrow renders drawn in the tile corner in the hover end-state). Service-card arrow computes to `#65451D` (gold-ink) — `tone="ink"` confirmed.
- No-JS (Business Rules E3): raw server HTML contains every visible string of all four sections with zero `opacity:0` styles.
- Reduced motion (headless Chrome, `--force-prefers-reduced-motion`): full page visible, no rise transforms, no `opacity:0`; hover-draw is `motion-safe:`-gated so arrows render pre-drawn.
- No console errors or warnings; no regression to nav, footer, or the story sections.

## Decisions & deviations (flagged, not silently resolved)
1. **Work/Testimonials strings drafted** — no canonical copy exists for these sections. `WORK.headline` ("Selected work") and `TESTIMONIALS.headline` ("In their words") are brand-voice drafts; `WORK.tileLabel` and `TESTIMONIALS.placeholderLabel` are the UX spec's own placeholder-treatment text (the `PROCESS.annotation` pattern). **All need owner approval.**
2. **About copy drafted in full** — architecture row 7 calls for new copy in Brand Philosophy §8 voice. Headline "NextSketch is one person. On purpose." + three paragraphs in first person (the one section where "we" resolves to Nathan). No invented biography: every claim restates documented brand positioning (no-handoff, agent-native operations / "eat my own cooking", the partner-who-stays close from Brand Philosophy §2). **Needs owner approval** — the brief's explicit reviewer gate.
3. **About is a contained ink panel, not a full-bleed dark band** — the reference layout's about band is full-bleed, but sections render inside the shared `Container` frame; breaking out needs viewport-width margin hacks that risk horizontal overflow. The rounded ink panel keeps the dark-band rhythm with zero frame changes. Revisit only if the owner wants true full-bleed.
4. **Service cards sit on full accents** — the UX spec's component spec ("4 cards, each on its accent") wins over its own "≥80% of any viewport stays neutral" seasoning rule; this is the page's one full-accent moment and the spec names it explicitly. Work-tile tints stay translucent (`/20`) for the same reason in the other direction.
5. **Placeholder labels render in sans, not the handwritten font** — four tiles are visible in one viewport; handwritten labels would break "max one handwritten element per viewport". The taxonomy asset name stays `font-hand` (a dev artifact that disappears at asset swap — foundation precedent).
6. **Hover-draw is CSS, not a new Motion entry point** — `pathLength` normalization + `stroke-dashoffset` transition under `motion-safe:`. Keeps proof sections fully server-rendered, honors the lint-enforced animation entry points, and degrades to pre-drawn for reduced motion. The "never set strokeDasharray" guard in foundation applies to the Motion-driven view branch; the hover branch owns its dasharray deliberately.
7. **Tile accents cycle all four Taxonomy §5 pairs** (gold/lavender/rose/sage) — presentational, no semantic mapping; real case studies may re-map at asset swap.
8. **Two testimonial blocks** — count is presentational and layout-final; more approved quotes are a copy + one-line change.
9. **Placeholder inventory:** `placeholder-work-01` (4/3) · `-02` (1/1) · `-03` (1/1) · `-04` (4/3) · `placeholder-about-01` (3/4). Rendered placeholders per foundation pattern; real assets swap by taxonomy name and ratio at handoff.
10. **Brief 04 copied into `briefs/`** — docs-in-repo pattern (unit 02, deviation 8).

## Naming reference
`WorkSection` (`work-section.tsx`) · `ServicesSection` (`services-section.tsx`) · `AboutSection` (`about-section.tsx`) · `TestimonialsSection` (`testimonials-section.tsx`). Content exports added: `WORK`, `ABOUT`, `TESTIMONIALS`. Primitive props added: `Placeholder accent`/`label` · `SketchAccent tone`/`drawOn`.

## What downstream units inherit
- Unit 05 fills `#fit`/`#faq`/`#start` the same way — section components own their `py-24 md:py-32` rhythm, slots stay bare.
- `SketchAccent drawOn="hover"` works under any `group` parent; pair with `tone="ink"` on accent backgrounds (the pairing rule extends to strokes).
- `Placeholder accent/label` is the canonical treatment for any future tinted placeholder.
- FAQ (unit 05): reuse the `<details name>` + rotating-plus pattern from unit 03, not a new control.
- Owner-owed at launch-readiness (unchanged): real work imagery, About photography, approved testimonial quotes — all swap in with no layout change.
