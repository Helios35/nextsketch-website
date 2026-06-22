# UX / Design Spec — NextSketch Website Rebuild

**Version:** 2.0 · **Date:** 2026-06-22 · **Status:** Active — reconciled to the as-built dark MVP (Sprint 03 doc audit)
**Answers:** How does it look and behave?
**References:** `03-site-architecture.md` (structure) · `02-prd.md` (requirements) · `06-taxonomy.md` (color tokens) · `briefs/build-notes/08-landing-rebuild.md` (the design pivot — canonical for the live look)

> **Reconciliation tags (Sprint 03 audit, 2026-06-22).** Every claim below is tagged exactly one of:
> **CURRENT** — true of the live build as-built · **CHANGED** — rewritten to match the as-built · **DEFERRED** — still the plan for a later (multi-section) build, not shipped; preserved, not deleted.
> The 2026-06-14 owner-directed pivot (decision-log #1) replaced the multi-section light site with a **single dark cinematic landing hero** in **Space Grotesk + JetBrains Mono**. The multi-section design below is **deferred, not dead** — its component code is dormant on disk (build-note 08), and its copy still lives in `src/content/copy.ts`. Docs follow the build: the live look is canonical here; the pivot is recorded, not re-litigated.

> **REVIEW NOTES**
> 1. *(closed — superseded by the pivot)* Typeface pairing was recommended as `Inter` + `Caveat`; owner approved that as decision-log #1 on 2026-06-11. The 2026-06-14 pivot superseded it with **Space Grotesk + JetBrains Mono** (build-note 08). Decision #1 is formally closed/superseded in the decision log (Sprint 03 audit). No open question remains.
> 2. **Logo** — placeholder wordmark "NextSketch" set in the display sans (now Space Grotesk) until asset handoff. **CURRENT** (the live hero renders a wordmark only).

---

## Design feeling (binding, from Brand Philosophy §9) — **CURRENT**

Builders not talkers · confident restraint · feels like a product, not a brochure · grounded confidence. Nothing decorative for its own sake — every animation must communicate something. The pivot to a dark cinematic hero did not change this north star; it expresses it differently (a single, fast, product-like screen rather than a long scroll).

## Color system

Token **names** are canonical and defined in `src/app/globals.css` (the source of truth) — see `06-taxonomy.md` §Color tokens. Values:

| Token | Hex | Role |
|-------|-----|------|
| `paper` | `#E5E6E1` | Light surface — **DEFERRED** (multi-section build); also the 404 page surface (**CURRENT**, kept legible on the dark layout) |
| `paper-bright` | `#F3F3F3` | Cards on paper — **DEFERRED** (multi-section build) |
| `ink` | `#000000` | **Page surface of the live site** + modal backdrop base — **CHANGED** (was "dark sections only"; now the default background) |
| `white` | `#FFFFFF` | **Body/headline text on the live dark site** — **CHANGED** (was "text on ink" only; now the default text color) |
| `gold` / `gold-ink` | `#E4B976` / `#65451D` | **The one live accent** — payoff words in the hero, capability strip, modal selection — **CURRENT** |
| `lavender` / `lavender-ink` | `#BBB2CE` / `#453B60` | Accent pair 2 — **DEFERRED** (maps to a multi-section service/phase) |
| `rose` / `rose-ink` | `#CB9DA2` / `#5C2529` | Accent pair 3 — **DEFERRED** |
| `sage` / `sage-ink` | `#AEBBBA` / `#3A4444` | Accent pair 4 — **DEFERRED** |

**Theme — CHANGED.** The live site is **dark**: `ink` (#000) is the page surface, `white` is the body/headline text, and `gold` (#E4B976) is the single accent (the two payoff words "production"/"stay", the capability strip, and the modal's selected state). The pre-pivot model — `paper` as the light page background, `ink` only for dark sections, accents mapped 1:1 to four services and four process phases — is **DEFERRED** with the multi-section build. (`paper`/`paper-bright` and the lavender/rose/sage pairs are still defined in code for that future build; only `ink`/`white`/`gold` are exercised on the live screen, plus the light `paper` 404 surface.)

**Accent-pairing rule — CURRENT (binding).** An accent background always takes its paired `-ink` text — never black. This still governs the live gold selection in the modal (gold fill + `gold-ink` text), and governs the deferred accents when their sections ship.

## Typography

- **Fonts — CHANGED.** Display/UI: **Space Grotesk**; mono labels + capability strip: **JetBrains Mono** — both via `next/font/google` variable fonts, self-hosted at build (zero runtime requests, zero layout shift). `Inter` + `Caveat` are **retired** (decision-log #1, superseded). The handwritten accent face is gone from the live design.
- Display: large, tight leading, heavy weight — **CURRENT** (the hero headline). Body: **CURRENT**.
- **Handwritten accent — DEFERRED.** The "annotation only, max one per viewport" handwritten element belonged to the multi-section sketch system; the dark hero uses none.

## Sketch accent system (the "hand" of the brand) — **DEFERRED**

Hand-drawn SVG elements, stroke-animated on scroll (underlines, margin arrows, circled numbers, handwritten annotations) were the multi-section decoration license. The live single-screen hero does not use them; `sketch-accent.tsx` is dormant. Preserved for the multi-section build, not shipped. (The one carried-over idea — accenting key headline words — survives in the live hero as the **gold** color treatment on "production"/"stay", not as a drawn stroke.)

## Component specs

**Live (as-built):**

- **Hero (the live site) — CHANGED/CURRENT.** A dark cinematic, bottom-anchored (`items-start`) full-bleed background image under a single light overlay (`bg-ink/40`) + a soft bottom scrim so the image reads while the white headline stays legible. A `max-w-4xl` upper **capability strip**, then a two-column row: `w-1/2` headline + CTA (left) and a gold-italic, right-aligned supporting line (right). White headline with the **gold** accent on the two payoff words. Wordmark-only header — no nav, no second CTA. (Adapted from an owner-supplied template; build-note 08.) The background image is an **interim remote Unsplash placeholder** — owner-owed: replace with a self-hosted brand asset before launch.
- **Hero CTA — CURRENT.** "Start a Conversation" (Rule 3.1) rendered as the template's **divided-arrow** button (`<HeroCta>`/`<ModalTrigger>` seam, squared/segmented, distinct from the shared pill `<Button>`); opens the qualification modal; no-JS degrades to a `mailto` (Business Rules E3).
- **Capability strip — CURRENT.** A slow continuous **marquee** (sanctioned in §Motion inventory) showing the **four canonical services** (Taxonomy §1, exact casing), in JetBrains Mono. No invented numbers or social proof (Brand Philosophy §10, Rule 4.3). Reads once to assistive tech (duplicate copies `aria-hidden`).
- **Qualification modal — CHANGED.** Re-themed to the dark template's visual language (build-note 08): **squared corners** (`rounded-none`), **hairline borders** (`white/12–15`), a **glassy translucent near-black surface** (`bg-[#0a0a0c]/95 backdrop-blur-xl`), **JetBrains-Mono uppercase micro-labels** (field labels, escape hatch, failure list), a **thin segmented progress meter** (replacing round dots), **flat gold selection** (gold fill + paired `gold-ink` text, no glow), and the **divided-arrow advance button** matching the hero CTA for every forward action, with a squared hairline **`ghost`** Button variant for Back. Full-screen on mobile (renders full-height ≤375px); centered card on desktop. Focus-trapped, Esc closes, scroll locked; backdrop is `ink` at 72% + 8px blur. **Flow / validation / accessibility logic is unchanged from the pre-pivot modal — CURRENT** (only the skin and the two-door entry changed). Two-door behavior is detailed below and ratified in `05-business-rules.md`.
- **Two-door modal flow — CHANGED** (Sprint 02 Unit 04; build-note 12). The modal opens to a low-friction **quick door** (name + email + an optional multi-select "what do you need?" needs selector — `MODAL_QUICK`, a Sprint 03 adhoc change from the earlier free-text line); the full four-question **qualifier** is reachable from there via "Rather walk us through it?"; the **off-ramp** keeps its honest "not yet" message and the escape hatch and **adds** an optional "Stay in Touch" email capture. Step transitions 200ms slide/fade; modal open is scale 0.97→1 + fade (~280ms). Screens: off-ramp, success ("…within two business days"), gentler off-ramp success ("Got it — we'll be here."), and the Rule 2.7 failure-fallback (answers preserved + escape hatch).

**Deferred (multi-section build) — DEFERRED:**

- **Buttons (pill).** Pill shape, primary ink/white with hover scale + accent underline-sketch, secondary 1px ink border. The live site uses the divided-arrow hero CTA and the modal's own squared buttons instead; the shared `<Button>` was reverted to its pre-premium pill state and is otherwise unused on the live screen.
- **Nav.** Sticky top nav (transparent over hero → solid paper after 80px, shrinks; mobile hamburger → full-screen overlay). Not mounted on the live single screen (`SiteNav` dormant).
- **Process section** (four expandable rows, circled phase numbers in accent), **Work tiles** (2×2 asymmetric grid, accent-tinted placeholder + sketch-hatch), **Service cards** (4 cards each on its accent), **Testimonial blocks** (oversized accent quote mark, placeholder state), **FAQ accordion** (hairline dividers, plus→minus). All dormant; ship with the multi-section build.

## Motion inventory

| Element | Animation | Trigger | Status |
|---------|-----------|---------|--------|
| Capability strip | Slow continuous marquee, pauses on hover | Always | **CURRENT** (live hero) |
| Hero content | `rise-in` (16px rise + fade, ~700ms) | Load | **CURRENT** (live hero) |
| Modal open | Scale 0.97→1 + fade (~280ms) | Open | **CURRENT** |
| Modal step | Slide/fade (~220ms) | Step change | **CURRENT** |
| Hero headline | Staggered rise+fade (80ms/word) | Load | **DEFERRED** (multi-section variant) |
| Sketch accents | SVG stroke draw-on | Scroll into view, once | **DEFERRED** |
| Sections | 12px rise + fade, 500ms | Scroll into view | **DEFERRED** |
| Work tiles / cards | Lift + arrow draw | Hover | **DEFERRED** |

**CURRENT (binding).** All live motion is **CSS keyframes, `motion-safe`-gated** (no `motion/react` import on the hero — the project's `no-restricted-imports` rule). Reduced mode: static strip, instant visibility, no transforms; the modal animations honor the same contract. Smooth anchor scrolling is motion-gated too.

## Responsive behavior

- **Live — CURRENT.** The single hero is fully responsive; the modal renders full-height on mobile (≤375px) and as a centered card on desktop. Touch targets ≥44px.
- **DEFERRED.** The multi-section breakpoints (work grid 2×2 → 1-col, process expansion → accordion, nav → overlay) ship with the multi-section build.

## Empty states / placeholders — **DEFERRED** (multi-section)

Placeholder naming + inventory in `06-taxonomy.md` §Placeholders, layout-final fixed-aspect boxes. Belongs to the multi-section build. The live hero's one placeholder is the **interim background image** (config, not a `/public/placeholders/` asset) — replace before launch.
