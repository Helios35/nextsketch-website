# UX / Design Spec — NextSketch Website Rebuild

**Version:** 1.1 · **Date:** 2026-06-12 · **Status:** Active · **1.1:** as-built update for unit 08 (design followup — the working-drawing direction; see `briefs/build-notes/08-design-assessment.md` for the diagnosis and rationale)
**Answers:** How does it look and behave?
**References:** `03-site-architecture.md` (structure) · `02-prd.md` (requirements) · reference layout image (PIXOR-style, in project uploads)

> **REVIEW NOTES**
> 1. **Typeface pairing (recommendation, owner approves):** Primary sans — `Inter` (or `General Sans` via Fontshare) for UI/body; display headlines in the same family at heavy weight to keep the "builders" feel. Handwritten accent — `Caveat` (Google Fonts; natural, not childish) or `Shantell Sans` as runner-up. Old site fonts (Exo/Merriweather) are NOT carried over — only colors carry over per concept decision.
> 2. **Logo** — placeholder wordmark "NextSketch" set in primary sans until asset handoff.

---

## Design feeling (binding, from Brand Philosophy §9)

Builders not talkers · confident restraint · generous whitespace · feels like a product, not a brochure · grounded confidence. Nothing decorative for its own sake — every animation must communicate something.

## Color system (extracted from live nextsketch.com 2026-06-11)

Carried over per concept decision. Token names are canonical — see `06-taxonomy.md` §Color tokens.

| Token | Hex | Role |
|-------|-----|------|
| `paper` | `#E5E6E1` | Page background (light sections) |
| `paper-bright` | `#F3F3F3` | Cards on paper, subtle alternation |
| `ink` | `#000000` | Dark sections, primary buttons, headline text |
| `white` | `#FFFFFF` | Text on ink |
| `gold` / `gold-ink` | `#E4B976` / `#65451D` | Accent pair 1 |
| `lavender` / `lavender-ink` | `#BBB2CE` / `#453B60` | Accent pair 2 |
| `rose` / `rose-ink` | `#CB9DA2` / `#5C2529` | Accent pair 3 |
| `sage` / `sage-ink` | `#AEBBBA` / `#3A4444` | Accent pair 4 |

Rules: an accent background always takes its paired ink for text — never black. Accents map 1:1 to the four services and four process phases (assignment in `06-taxonomy.md`). Accents are seasoning: ≥80% of any viewport stays paper/ink neutral.

**Tonal extensions (unit 08, no new hues):** translucent tints of existing tokens are licensed wherever a token itself is licensed — gold radial washes on the hero (`wash-gold`) and the closing ink band (`wash-gold-ink`), accent tints at /30 on work tiles, hairlines at ink/white opacities. A static fractal-noise grain (5%, full-page overlay) makes `paper` read as stock rather than a flat hex.

## Surface & depth (the working-drawing system, unit 08)

- **Tonal bands:** full-bleed section bands assigned in `src/app/page.tsx` via the `Container band` variant: hero on a drafting grid (`grid-paper`, ink hairlines at 4–5%, 32px cells, fading downward) with a gold wash; Process on a `paper-bright` sheet band with hairline borders; About and Final CTA as true full-bleed ink bands carrying a white-line grid (`grid-ink`); Final CTA flows directly into the ink footer (the dark closing run), articulated by a white/10 hairline.
- **Sheet shadows:** one scale for every raised surface — `--shadow-sheet` (cards, tiles, stat block), `--shadow-sheet-lg` (hover states, the pinned About portrait), `--shadow-sheet-xl` (modal card), `--shadow-pill` (button hover). Soft and low: paper resting on a desk, not app elevation.
- **Pinned sheets:** work tiles and the About portrait sit at slight alternating rotations (±0.6–0.8°, static composition) with sheet shadows; tiles straighten and lift on hover (motion-gated).

## Typography

- Display: 64–96px desktop / 40–48px mobile, tight leading, weight 600–700. Three scales as built (`SectionHeading size`): `display` (sections), `statement` (editorial spreads that carry a section on type alone — manifesto, final CTA), `hero` (the top-of-page promise).
- Body: 16–18px, line-height 1.6.
- Stat strip values: tabular numerals; labels small uppercase, tracked +0.18em (the title-block treatment, unit 08).
- Handwritten accent (see Review Note 1): used ONLY as annotation — never full headlines, never body. Max one handwritten element visible per viewport.

## Sketch accent system (the "hand" of the brand)

Hand-drawn SVG elements, stroke-animated on scroll into view (draw-on, 400–600ms, once):
- Underline strokes beneath 1–2 key headline words (e.g., under "stay" in the hero)
- Margin arrows pointing to CTAs or key copy
- Circled words/numbers (e.g., circled phase numbers in Process)
- Small annotations in the handwritten font (e.g., "this is the part most firms skip →" near Validate)

These are the only decoration license. Each placement must annotate real meaning.

## Component specs

**Buttons:** pill shape. Primary: ink bg / white text; hover: slight scale (1.02) + soft pill shadow; active scale 0.99. Secondary: 1px ink border, transparent; hover fills ink with white text. Inverse (on ink surfaces): white bg / ink text. All hover-state transitions motion-gated; the state changes themselves apply instantly under reduced motion. All button copy per Business Rules §3.

**Nav:** transparent over hero → glass paper (paper at 85% + backdrop blur) with hairline border after 80px scroll, height shrinks. A 2px gold progress stroke draws along the nav's bottom edge as the page scrolls (CSS scroll-driven animation; motion-gated, hidden where unsupported). Mobile: hamburger → full-screen overlay, anchors + CTA.

**Process section (the interactive centerpiece):** four rows (01 Strategy / 02 Build / 03 Validate / 04 Partner). Desktop: row expands on click — number circled in sketch-stroke in that phase's accent, copy from Messaging Kit. One open at a time; Strategy open by default. Mobile: accordion.

**Work tiles:** 2×2 asymmetric grid (per reference), pinned-sheet treatment (unit 08): accent-tinted sheet at slight rotation with sheet shadow, carrying hand-drawn placeholder sketch art (`/public/placeholders/placeholder-work-01…04.svg` — product wireframes in the tile's accent ink; owner-authorized placeholder imagery, swapped by taxonomy name) under a paper label chip ("Case study — coming in build"). Hover: sheet lifts and straightens, sketch arrow draws in corner. No fake project names.

**Service cards:** 4 cards, each on its accent with paired ink text, sheet shadow. Hover: subtle lift, shadow blooms, annotation arrow.

**Testimonial blocks:** keep sans, oversized quote mark in accent (text-7xl/8xl) on white sheet cards with a 3px accent top rule and sheet shadow. Placeholder state: quote block with "Client quote — pending approval" label, layout-final.

**Stat strip (hero):** a drafting title block — hairline-boxed cell grid (2×2 mobile / 1×4 desktop), opaque paper cells over the band grid, tabular numerals at 4xl–5xl, tracked uppercase labels.

**About / Final CTA:** full-bleed ink bands (Container `band` variant; revisits the contained panels of units 04–05 as anticipated in build-notes 04 deviation 3). About's portrait is a pinned paper sheet holding the layout-final placeholder (`placeholder-about-01` — interim contour-sketch art, real photography swaps by name).

**FAQ accordion:** hairline dividers, plus→minus rotation, one open at a time.

**Qualification modal:** full-screen overlay on mobile, centered 560px card on desktop with sheet shadow over a dimmed, lightly blurred backdrop. Multi-step, one question per step, progress dots (active step elongates to a pill; fill tracks progress), back button. Option rows: white cards that fill ink when checked. Step transitions: 200ms slide/fade. Soft off-ramp screen: warm, unapologetic copy + visible hello@nextsketch.com. Success screen: confirmation + what happens next ("You'll hear from Nathan within two business days"). Escape hatch: "Prefer email? hello@nextsketch.com" persistent in modal footer. Focus-trapped, Esc closes, scroll locked behind.

## Motion inventory (as built, 1.1)

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero headline | Staggered rise+fade (80ms/word) | Load |
| Sketch accents | SVG stroke draw-on | Scroll into view, once |
| Sections | 16px rise + fade, 600ms, settle ease `cubic-bezier(0.22,1,0.36,1)` | Scroll into view |
| Nav progress stroke | 2px gold hairline draws left→right under the nav | Page scroll (CSS scroll-driven; hidden where unsupported) |
| Nav | Glass-paper blend + height shrink, 300ms | 80px scroll |
| Accordions (process, FAQ) | Content eases open, 300ms (`::details-content`; progressive — instant where unsupported) | Open/close |
| Work tiles / cards | Lift + shadow bloom + straighten + arrow draw, 300ms | Hover |
| Buttons | Scale 1.02 + shadow/color, 200ms; active 0.99 | Hover/press |
| Modal | Scale 0.97→1 + fade, 250ms; steps 200ms slide/fade; progress dot elongates 300ms | Open / step change |

All motion gated behind `prefers-reduced-motion: no-preference`. Reduced mode: instant visibility, no transforms, sketch accents render pre-drawn, accordion toggles instantly, progress stroke hidden; static composition (tile rotations, bands, textures, shadows) renders identically. The capability-strip marquee from 1.0 was never built (no canonical copy exists for it) — removed from the inventory.

## Responsive behavior

Breakpoints: 360 / 768 / 1024 / 1440. Work grid 2×2 → 1-col. Process expansion → accordion. Nav → overlay. Display type scales per Typography. Touch targets ≥44px.

## Empty states / placeholders

Placeholder naming + inventory in `06-taxonomy.md` §Placeholders. Every placeholder is layout-final: swapping the asset must not shift layout (fixed aspect-ratio boxes). As of unit 08 (owner decision 2026-06-12), placeholder slots carry interim hand-drawn sketch art as real files in `/public/placeholders/` under their taxonomy names — atmosphere only, never proof (no project names, outcomes, or likenesses). Real assets replace the files by name; an asset arriving with a different extension than `.svg` is a one-line component change at handoff (flagged in build-notes 08).
