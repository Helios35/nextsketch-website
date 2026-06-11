# UX / Design Spec — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active
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

## Typography

- Display: 64–96px desktop / 40–48px mobile, tight leading, weight 600–700.
- Body: 16–18px, line-height 1.6.
- Handwritten accent (see Review Note 1): used ONLY as annotation — never full headlines, never body. Max one handwritten element visible per viewport.

## Sketch accent system (the "hand" of the brand)

Hand-drawn SVG elements, stroke-animated on scroll into view (draw-on, 400–600ms, once):
- Underline strokes beneath 1–2 key headline words (e.g., under "stay" in the hero)
- Margin arrows pointing to CTAs or key copy
- Circled words/numbers (e.g., circled phase numbers in Process)
- Small annotations in the handwritten font (e.g., "this is the part most firms skip →" near Validate)

These are the only decoration license. Each placement must annotate real meaning.

## Component specs

**Buttons:** pill shape. Primary: ink bg / white text; hover: slight scale (1.02) + accent underline-sketch draws under it. Secondary: 1px ink border, transparent. All button copy per Business Rules §3.

**Nav:** transparent over hero → solid paper with hairline border after 80px scroll, height shrinks. Mobile: hamburger → full-screen overlay, anchors + CTA.

**Process section (the interactive centerpiece):** four rows (01 Strategy / 02 Build / 03 Validate / 04 Partner). Desktop: row expands on click — number circled in sketch-stroke in that phase's accent, copy from Messaging Kit. One open at a time; Strategy open by default. Mobile: accordion.

**Work tiles:** 2×2 asymmetric grid (per reference). Placeholder treatment: accent-tinted block + diagonal sketch-hatch pattern + label ("Case study — coming in build"). Hover: tile lifts 4px, sketch arrow draws in corner. No fake project names.

**Service cards:** 4 cards, each on its accent with paired ink text. Hover: subtle translate, annotation arrow.

**Testimonial blocks:** large serif-feel pull quotes? No — keep sans, oversized quote mark in accent. Placeholder state: quote block with "Client quote — pending approval" label, layout-final.

**FAQ accordion:** hairline dividers, plus→minus rotation, one open at a time.

**Qualification modal:** full-screen overlay on mobile, centered 560px card on desktop. Multi-step, one question per step, progress dots, back button. Step transitions: 200ms slide/fade. Soft off-ramp screen: warm, unapologetic copy + visible hello@nextsketch.com. Success screen: confirmation + what happens next ("You'll hear from Nathan within two business days"). Escape hatch: "Prefer email? hello@nextsketch.com" persistent in modal footer. Focus-trapped, Esc closes, scroll locked behind.

## Motion inventory

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero headline | Staggered rise+fade (80ms/word) | Load |
| Sketch accents | SVG stroke draw-on | Scroll into view, once |
| Sections | 12px rise + fade, 500ms | Scroll into view |
| Capability strip (optional, ref-style marquee) | Slow continuous marquee, pauses on hover | Always |
| Work tiles / cards | Lift + arrow draw | Hover |
| Modal | Scale 0.97→1 + fade, 250ms | Open |

All motion gated behind `prefers-reduced-motion: no-preference`. Reduced mode: instant visibility, no transforms, sketch accents render pre-drawn.

## Responsive behavior

Breakpoints: 360 / 768 / 1024 / 1440. Work grid 2×2 → 1-col. Process expansion → accordion. Nav → overlay. Display type scales per Typography. Touch targets ≥44px.

## Empty states / placeholders

Placeholder naming + inventory in `06-taxonomy.md` §Placeholders. Every placeholder is layout-final: swapping the asset must not shift layout (fixed aspect-ratio boxes).
