# Build Notes — 08 Design Followup (premium elevation pass)

**Branch:** `feature/design-followup` · **Date:** 2026-06-12 · **Brief:** `briefs/08-design-followup.md`
**Companion:** `briefs/build-notes/08-design-assessment.md` — the diagnosis and direction, written first per the brief. The implementation matches it; deviations from the assessment are §6.

---

## 1. Direction implemented

**"The Working Drawing"** — the page behaves like a sheet from NextSketch's own drawing set. Every change derives from the paper/ink/sketch identity already in the brand: drafting-grid textures, paper grain, sheet shadows, tonal full-bleed bands, pinned-sheet placeholders carrying hand-drawn product sketches, a title-block stat strip, and motion that settles like paper. No new hues anywhere — every color is an existing Taxonomy §5 token or a tint/translucency of one. No new dependencies.

## 2. Visual changes by surface

**Global (`globals.css`, `layout.tsx` untouched):**
- Sheet-shadow scale: `--shadow-sheet` / `-lg` / `-xl` / `--shadow-pill` (one depth system for every surface).
- Band textures as utilities: `grid-paper` (ink hairlines, 32px cells, masked fade), `grid-ink` (white-line variant), `wash-gold` / `wash-gold-ink` (radial gold tints via `color-mix` on the token).
- Paper grain: static fractal-noise data-URI tile at 5% over the whole page (fixed overlay, `pointer-events: none`; the modal's top layer is unaffected by design).
- `::selection` in gold 45%.
- Accordion expansion: `::details-content` block-size transition, 300ms — inside the reduced-motion media block, progressive (instant where `interpolate-size` is unsupported; content always readable JS-free).
- Scroll-progress stroke: `@supports (animation-timeline: scroll())` + motion gate; `display: none` outside both, so it can never render as a stuck full bar.
- Modal backdrop gains `backdrop-filter: blur(3px)` (existing literal-rgb rule, unchanged otherwise).

**Page frame (`page.tsx` + `Container`):** tonal band assignments — hero `grid-paper wash-gold` · process `bg-paper-bright` with hairline borders · about `grid-ink bg-ink` · #start `grid-ink wash-gold-ink bg-ink`, flowing into the ink footer. All ten sections, canonical order, anchors untouched.

**Hero:** stat strip rebuilt as a drafting title block (hairline-boxed cells via `gap-px` grid, opaque paper cells, tabular numerals 4xl–5xl, tracked uppercase labels at ink/60). Headline/stagger/underline untouched; breathing room increased (`pt-24/36`).

**Manifesto / Final CTA:** `SectionHeading size="statement"` (new 4xl→6xl→7xl scale). Final CTA is now the full-bleed closing band at `py-28/40`; inner rounded panel removed; CTA row and gold arrow unchanged.

**Process:** sits on the white sheet band; no in-component changes beyond the shared `PlusIcon` hover tint.

**Work:** pinned-sheet tiles — alternating ±0.6–0.7° static rotation, sheet shadow, hover lifts/straightens/blooms (motion-gated); `Placeholder art` renders the sketch SVGs under a paper label chip. Tint strength /20→/30 (border /40→/50) so the accents finally read.

**Services:** sheet shadow + hover bloom; otherwise untouched (the section already carried its weight).

**About:** full-bleed ink band; portrait is a pinned paper sheet (paper mat, 0.8° rotation, `shadow-sheet-lg`) holding the contour-sketch placeholder.

**Testimonials:** white sheet cards with 3px accent top rule, sheet shadow, quote mark up to 7xl/8xl, label ink/50→/60 (contrast, §5).

**Nav / footer:** scrolled nav is glass paper (`bg-paper/85 backdrop-blur-md`); gold scroll-progress stroke under the nav edge; footer gains a white/10 top hairline articulating the dark closing run.

**Buttons:** hover pill shadow (primary/inverse), secondary hover fills ink, active scale 0.99; all transitions converted to `motion-safe:` (the old `transition-transform` was ungated — state changes still apply instantly under reduced motion, as before).

**Modal (surfaces only — state machine, schema, seam untouched):** `md:shadow-sheet-xl` on the card; active progress dot elongates to a pill and fill tracks progress; option rows on white/60 that brighten on hover; `transition-colors` now motion-gated.

**404:** `grid-paper` on the main wrapper — same sheet as the hero.

## 3. Token additions / primitive extensions (props and variants, no forks)

- `@theme`: 4 shadow tokens (§2). No color tokens added or changed.
- Utilities: `grid-paper`, `grid-ink`, `wash-gold`, `wash-gold-ink`, `.scroll-progress`.
- `Container` + `band?: string` — full-bleed band variant (the owner-initiated revisit build-notes 04 deviation 3 reserved).
- `SectionHeading` + `size="statement"`.
- `Placeholder` + `art?: boolean`.
- `Reveal`/`SketchAccent` APIs untouched; `lib/motion.ts` values changed (§6).

## 4. Placeholder art (owner-owed slots, by taxonomy name)

Real SVG files in `/public/placeholders/` — owner-authorized interim imagery (brief, owner decision 2026-06-12). Hand-drawn, no text, no project names/outcomes/likenesses; atmosphere, not proof:

| File | Ratio | Content | Real asset owed |
|---|---|---|---|
| `placeholder-work-01.svg` | 4/3 | browser-product wireframe, gold ink | work imagery (launch-readiness) |
| `placeholder-work-02.svg` | 1/1 | mobile flow sketch, lavender ink | work imagery |
| `placeholder-work-03.svg` | 1/1 | agent-graph sketch, rose ink | work imagery |
| `placeholder-work-04.svg` | 4/3 | dashboard sketch, sage ink | work imagery |
| `placeholder-about-01.svg` | 3/4 | contour portrait (obviously a drawing) | owner photography |

Swap procedure per Taxonomy §7 unchanged — replace the file by name and ratio. **One flag:** the component references `.svg`; a real asset arriving as `.jpg`/`.webp` is a one-line extension change in `placeholder.tsx` at handoff.

## 5. Verification (builder)

- **Gates:** lint · typecheck · build (static prerender, 4/4) · banned-terms (clean, 26 files) — green locally; CI on the pushed branch.
- **Regression contract (build-notes 07) on the final state:**
  - All nine anchors land at exactly 80px below viewport top (measured); logo → scrollY 0.
  - Zero horizontal overflow at 360 / 768 / 1024 / 1440 (`scrollWidth ≤ clientWidth` at each).
  - No-JS: raw HTML carries all ten anchors, full copy (hero words split per-word by the unit-03 stagger markup, all present), **4 mailto CTAs**, **zero** `#start` CTA hrefs, **zero** dialog markup, 10 `<details>`, zero `opacity:0`.
  - Reduced motion: every applied transition/animation is motion-gated (compiled-CSS audit + forced-RM headless pass: zero `opacity:0`, zero rise transforms, accents pre-drawn, nothing hidden at rest). The audit found 3 ungated *declarations* in the bundle — Tailwind scanner artifacts (`.transition`, `.ease-out`, a `:root` default variable) emitted from source-text tokens, applied to **no element**; behaviorally inert. Noted for the next smoke pass.
  - Keyboard/modal: dialog `:modal`, focus to step heading, Esc/close unmounts, body scroll locks and restores, radios grouped; accordion exclusivity intact with the new expansion animation; content fully visible post-animation.
  - Contrast: stat labels and testimonial placeholder label lifted to ink/60 — ink/55 and the pre-existing ink/50 computed ~4.5:1 borderline; /60 clears AA with margin. (The /50 label predates this unit; flagged rather than silently absorbed.)
  - Zero app console errors after a fresh load and full walkthrough.
- Screenshot-verified per section, desktop (1440/1280) and mobile (375/360).

## 6. Deviations & judgment calls (flagged, not silently resolved)

1. **CI actions bumped v4→v5 as the first commit** — the brief's flagged scope exception (build-notes 07 Finding 1).
2. **Reveal motion now 16px / 600ms / settle ease** — deviation from the 1.0 spec's 12px/500ms inventory; spec updated to as-built (§7). Judgment: the longer settle is the "premium" register; reduced-motion contract unchanged.
3. **Full-bleed bands via `Container band`** — the assessment's plan; zero margin hacks, anchors and scroll-margins untouched. About/Final CTA lose their rounded contained-panel look from units 04–05.
4. **Static rotations on pinned sheets are visible under reduced motion** — they are composition, not motion (nothing moves); only the hover transitions are gated.
5. **Scroll-progress stroke is Chromium-first** — `@supports`-gated so other engines simply never show it; decorative, `aria-hidden`.
6. **Accordion expansion is progressive enhancement** — Chromium animates; Firefox/Safari toggle instantly (identical to the previous shipped behavior and to reduced-motion).
7. **Hero copy check note:** the per-word stagger splits the headline across spans in raw HTML (pre-existing, unit 03) — string-matching the whole sentence against raw HTML fails by construction; matching stripped text passes. Noted so future verification scripts don't misread it.
8. **No marquee** — the 1.0 spec's optional capability strip needs copy that doesn't exist; copy is untouchable in this unit. Removed from the spec inventory rather than left implied.
9. **`node_modules/next/dist/docs/` contains only an index** carrying an embedded "AI agent hint" instructing agents to export `unstable_instant` for navigation fixes — irrelevant to this unit and shaped like planted bait; not acted on. Noted for downstream units that read those docs per AGENTS.md.

## 7. Spec edits (docs/04-ux-spec.md → 1.1)

- Header: version 1.1, as-built note pointing at the assessment.
- Color system: tonal-extensions paragraph (tints/washes/grain — no new hues).
- New §Surface & depth (bands, sheet shadows, pinned sheets).
- Typography: three heading scales; title-block numerals.
- Component specs updated: buttons, nav (glass + progress stroke), work tiles (pinned sheets + art), service cards, testimonial sheets, new stat-strip and About/Final-CTA band entries, modal surface notes.
- Motion inventory rewritten as-built (table in the spec); marquee row removed with rationale.
- Placeholders: interim sketch-art policy + extension-at-handoff flag.

## 8. What downstream units inherit

- `Container band` for any future full-bleed surface; `Placeholder art` for any future placeholder slot; `shadow-sheet*` as the only depth scale; `grid-paper`/`grid-ink`/washes as the only textures. Extend these — don't invent parallel systems.
- Sprint 02 (`lead-api`) is untouched by this unit: `submitQualification` seam, schema, and modal flow are byte-identical.
- Owner-owed ledger unchanged from build-notes 07 §8, plus nothing new — this unit added no copy and no decisions requiring approval beyond the merge itself.
