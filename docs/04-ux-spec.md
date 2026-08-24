# UX / Design Spec — NextSketch Website Rebuild

**Version:** 3.1 · **Date:** 2026-07-07 · **Status:** Active — hero-derived design system (Redesign Unit 01; scroll-video as-built reconciled to the Unit 03 cinematic sequence)
**Answers:** How does it look and behave?
**References:** `03-site-architecture.md` (structure) · `02-prd.md` (requirements) · `06-taxonomy.md` (token names) · `briefs/build-notes/08-landing-rebuild.md` (canonical as-built record of the hero)

> **What this document is (Redesign Unit 01).** The live hero is the website's design source of truth. This spec generalizes its as-built language — plus the qualification modal and capability strip that already share it — into a **reusable design system**: the rules a section-builder follows to make a new section feel native to the hero **without opening the hero code**. Every rule below traces to shipped code (`src/components/hero.tsx`, `hero-cta.tsx`, `qualification-modal.tsx`, `src/app/globals.css`); nothing is invented. Where this doc and the code disagree, **code wins** — fix the doc.
>
> **Tags:** **CURRENT** — true of the live build · **CHANGED** — rewritten this unit to match the as-built or an owner decision · **RETIRED** — no longer the direction; recorded so it can't be mistaken for current · **PLANNED** — recorded intent, not designed or built.
>
> **Scope of the redesign (decision-log #13, owner):** five sections — **Manifesto, Services, Process, About, Final CTA** — will be added to the single-page site, each designed **against this system**, per-section, with the owner. This doc does not design them.

> **REVIEW NOTES**
> 1. **Logo — CURRENT.** Placeholder wordmark "NextSketch" set in the display sans (Space Grotesk) until asset handoff. The live hero renders a wordmark only.
> 2. *(closed)* **Decision-log gap** — resolved same unit at the owner's direction: the redesign reactivation and the gold-only accent directive are now logged as decision-log **#13** and **#14**, and `02-prd.md` / `03-site-architecture.md` / `06-taxonomy.md` were aligned to them (v2.1 each).

---

## Design feeling (binding, from Brand Philosophy §9) — **CURRENT**

Builders not talkers · confident restraint · feels like a product, not a brochure · grounded confidence. Nothing decorative for its own sake — every animation must communicate something. The dark cinematic language expresses this north star: a fast, product-like screen, not a marketing scroll.

## How to build a new section from this doc

1. Surface: the page is `ink`; a section sits directly on it or on a **glass panel** (§Surfaces). Squared corners everywhere — `rounded-none` is the shape of the brand.
2. Type: one **display heading** (Space Grotesk, heavy, tight), **mono micro-labels** (JetBrains Mono, uppercase, tracked) for structure/meta, **body** in white-alpha (§Typography).
3. Color: `white` on `ink`; **`gold` is the only accent** and is spent sparingly — payoff words, selection, markers, links (§Color).
4. Layout: full-width band, shared gutters, generous bottom-weighted vertical padding (§Layout).
5. Motion: CSS keyframes only, `motion-safe`-gated, reduced-motion parity (§Motion).
6. Controls: the divided-arrow button advances, the hairline ghost steps back, selection fills flat gold (§Interaction vocabulary).

If a rule here doesn't cover your case, generalize from the hero/modal code and flag the judgment call — don't invent a new pattern silently.

---

## Color & theme

Token **names** are canonical per `06-taxonomy.md` §5 and defined in `src/app/globals.css` (the source of truth). The default Tailwind palette is cleared (`--color-*: initial`), so only brand tokens compile.

### Live palette — **CURRENT**

| Token | Hex | Role |
|-------|-----|------|
| `ink` | `#000000` | Page surface; also the alpha base for overlays and scrims |
| `white` | `#FFFFFF` | Text and the advance-button surface; the alpha base for hairlines, panel fills, and text hierarchy |
| `gold` | `#E4B976` | **The accent — the only one.** Payoff words, strip markers, selection fill, progress, focus, links |
| `gold-ink` | `#65451D` | The paired text color on a `gold` fill (pairing rule below) |

One deliberate literal sits outside the token set: **`#0a0a0c`**, the modal's elevated-surface color — an elevated surface is never pure `#000` (it reads flat). Use it (with translucency + blur, §Surfaces) for elevated panels; the page itself stays `ink`.

### The alpha ladders — **CURRENT (binding)**

The system's real texture is white-on-black at low alpha. Use these shipped stops; don't invent new ones:

- **Hairline borders:** `white/10` (strip edges, dividers) · `white/12` (option rows, panels) · `white/15` (inputs, the modal card). Hover raises a border to `white/30`; a ghost button's border is `white/30` → `white/60` on hover.
- **Panel fills:** `white/[0.02]` (option rows, panels) · `white/[0.03]` (inputs) · `white/[0.05]`–`white/[0.06]` (hover fills).
- **Text hierarchy:** `white` (headings, emphasized values) · `white/90` (option labels) · `white/70` (body, strip labels) · `white/55` (mono captions) · `white/40` (placeholders) · `white/60` (muted interactive, hover → `white`).
- **Ink alphas (image treatment & backdrops):** `ink/40` (flat overlay) · `ink/85 → ink/20 → transparent` (bottom scrim gradient) · `ink/30` (translucent strip fill) · `ink/15` (divider on a white surface) · ink at 72% + 8px blur (modal backdrop, a literal in `globals.css`).

### Accent rules — **CURRENT (binding)**

- **Gold is scarce.** On the live screen it appears only as: two payoff headline words, the strip's diamond markers, the supporting line, selection fills, the progress meter, focus rings, and underlined links. A section that uses gold everywhere is off-brand; restraint *is* the system.
- **Accent-pairing rule:** an accent background always takes its paired `-ink` text — a `gold` fill carries `gold-ink` text, never black or white.

### Orphaned colors — **CHANGED (owner directive, 2026-07-06)**

Gold is the **only** accent. The remaining brand tokens are **orphaned**: they keep their canonical names in `globals.css` (removing them is a code change, out of scope this unit) but have **no role in the design system** — do not use them in any new section.

| Token(s) | Status |
|---|---|
| `lavender`/`lavender-ink` · `rose`/`rose-ink` · `sage`/`sage-ink` | **Orphaned.** The old per-service / per-phase accent mapping is retired (`06-taxonomy.md` §1–2, aligned; decision-log #14) |
| `paper-bright` | **Orphaned.** |
| `paper` | **Orphaned from the system**, with one live exception: the 404 page's light surface (**CURRENT** — code wins). Not available to sections |

**No new tokens.** (Decision-log #14.) The 2026-07-06 inspiration reference (owner-supplied editorial screenshot) contributes *fidelity only* — its rust/orange accent is explicitly **not** adopted; where it shows a warm accent, this system uses `gold`.

## Typography

**Fonts — CURRENT.** Display/UI: **Space Grotesk** (`font-sans`); labels/meta: **JetBrains Mono** (`font-mono`) — both via `next/font/google` variable fonts, self-hosted at build (zero runtime requests, zero layout shift). Font tokens live in `globals.css` `@theme inline`. Inter + Caveat are **RETIRED** (decision-log #1, superseded).

The system has exactly **three type roles**; their cadence (display → mono label → body) is the rhythm every surface repeats:

| Role | Face | Shipped treatment | Trace |
|---|---|---|---|
| **Display heading** | Space Grotesk | `font-medium`, `tracking-tight`, tight leading (`leading-[1.05]` at hero scale); hero scale `text-4xl → sm:5xl → md:6xl → lg:7xl`; panel scale `text-2xl → md:text-3xl` (+ `text-balance`) | hero `<h1>`, modal `HEADING_CLASS` |
| **Mono micro-label** | JetBrains Mono | uppercase, tracked, small, muted: `text-[0.7rem] uppercase tracking-[0.14em] text-white/55` (captions/field labels) or `text-xs sm:text-sm tracking-[0.12em] text-white/70` (strip labels, no uppercase transform — strip copy is already cased) | modal `CAPTION_CLASS`, capability strip |
| **Body** | Space Grotesk | `text-base leading-relaxed text-white/70`; emphasized values `font-medium text-white` | modal body copy, failure list |

Two shipped display accents, available to sections:

- **Gold payoff words** — accent words inside a white display heading take `text-gold` (the hero's "production" / "stay"). At most a couple of words; the heading stays white.
- **Gold-italic aside** — a supporting line may be `text-gold italic` (hero's right column). This is the *only* italic in the system.

Over imagery, text carries a soft shadow for legibility (shipped values: headline `[text-shadow:0_2px_30px_rgba(0,0,0,0.5)]`, wordmark `0 1px 16px rgba(0,0,0,0.6)`, supporting line `0 1px 20px rgba(0,0,0,0.7)`). On plain `ink` or a panel, no text shadow.

**RETIRED:** the handwritten accent face (Caveat) and the "annotation, max one per viewport" rule — gone with the sketch system (§Retired).

## Surfaces

Three surface levels, all **squared** (`rounded-none`) and **hairline-bordered** — the glass-panel language shipped in the modal and capability strip:

1. **The page** — flat `ink`. Sections sit directly on it.
2. **Image band** — a full-bleed background image under the two-layer treatment: a flat `ink/40` overlay **plus** a bottom scrim `bg-gradient-to-t from-ink/85 via-ink/20 to-transparent`, so the image reads while white text stays legible (the hero's recipe).
3. **Glass panel** — the reusable card/panel surface, generalized from the modal card and the strip:
   - **Fill:** translucent near-black — `bg-[#0a0a0c]/95 backdrop-blur-xl` for an elevated card (modal), or lighter glass `bg-ink/30 backdrop-blur-sm` for an in-flow strip. Never pure opaque `#000` for an elevated surface.
   - **Border:** hairline — `border border-white/15` (card) or `border-y border-white/10` (full-width strip).
   - **Depth:** an elevated card may carry the shared deep shadow token `--shadow-modal` (`0 40px 100px -24px rgb(0 0 0 / 0.85), 0 12px 32px -16px rgb(0 0 0 / 0.6)`). No glows — depth comes from shadow and blur, never from colored light.
   - **Sub-panels** inside a panel (option rows, data lists): `border-white/12 bg-white/[0.02]`, padded `p-5`.

## Spacing, layout & responsive rhythm

Generalized from the hero's composition and the modal's density:

- **Gutter rhythm (binding):** horizontal padding steps `px-6 → sm:px-8 → lg:px-16`. Every full-width band uses these gutters; panel interiors use `px-6 → md:px-10`.
- **Full-bleed, bottom-weighted:** the hero is `min-h-dvh`, `flex-col items-start justify-end` — content anchors to the **bottom-left**, with heavy bottom padding stepping `pb-16 → sm:pb-24 → lg:pb-28`. New full-height bands repeat this anchor; standard sections take generous vertical padding in the same spirit (weight low, air above).
- **Two-column row:** content splits `flex-col gap-6 → sm:flex-row sm:items-end`, each column `w-full sm:w-1/2` — headline/action left, supporting matter right (right-aligned from `sm:` up). Collapse to a single column below `sm`.
- **Measure:** a secondary strip/band caps at `max-w-4xl`; an elevated card caps at `md:max-w-[560px]` and centers.
- **Vertical cadence inside a block:** `space-y-6` between heading / body / action at hero scale; the modal's denser form cadence is `gap-5` fields, `mt-6` body-to-form, `mt-8` to the action row.
- **Touch targets — CURRENT (binding):** every interactive element ≥ 44px (`min-h-11`/`min-h-12` shipped).
- **Anchors:** `section[id]` carries `scroll-margin-top: 5rem`; smooth anchor scrolling is motion-gated (`globals.css`).
- **Responsive posture:** mobile-first; an elevated panel goes **full-screen on mobile** (`h-dvh`) and becomes a centered card at `md:` (the modal's pattern).

## Motion

**The contract — CURRENT (binding).** All motion is **CSS keyframes** declared in `globals.css` `@theme`, applied **`motion-safe:` only**, with full reduced-motion parity (static strip, instant visibility, no transforms). **No `motion/react` import** — the project's `no-restricted-imports` ESLint rule enforces it. Every animation must communicate something (Brand Philosophy §9).

**Scroll-motion architecture — CHANGED (owner-approved at the Unit 02 checkpoint, 2026-07-06; extended Unit 03, 2026-07-07).** Scroll-driven motion is **native browser JS triggering CSS** — no motion library, the `motion/react` ban stands. The shared primitives are the only scroll entry points: `ScrollReveal` (IntersectionObserver flips the `rise-in` class — JS triggers, the CSS keyframe animates), `Parallax` (passive scroll listener + rAF writes a transform-only whisper drift, default speed 0.06, used at most once per section), `ScrollVideo` (the fixed site backdrop — a **three-clip cinematic sequence** whose timelines are **driven by scroll**, see below), and `HeroOrbit` (the hero's scroll-scrubbed orbit footage on a pinned runway, see §Live components). Video scrubbing shares one engine (`src/lib/video-scrub.ts` — rAF lerp of `currentTime`, seek-gated per build-note 17). Each primitive carries its own reduced-motion and no-JS parity: server HTML is always fully visible, reduced-motion never sees a transform or a moving video.

Shipped vocabulary — reuse these, at these tempos:

| Pattern | Spec | Use |
|---|---|---|
| `rise-in` | 16px rise + fade, 700ms `cubic-bezier(0.22, 1, 0.36, 1)`, `both` | Content entrance; stagger siblings ~80–200ms via `[animation-delay:…]` (hero: 0 / 120ms / 200ms) |
| `marquee` | continuous X-translate, `var(--duration)` linear infinite (strip: 38s), pauses on hover | The capability strip; slow enough to read |
| `modal-in` | scale 0.97→1 + fade, 280ms `--ease-premium` | Panel/dialog open |
| `step-in` | 12px slide-from-right + fade, 220ms `--ease-premium` | In-panel step change |
| Micro-transitions | 150ms; hover `scale-[1.02]` on advance buttons, arrow nudge `translate-x-0.5`, border/fill color shifts | All interactive hover/focus feedback |

**Easing tokens:** `--ease-premium: cubic-bezier(0.16, 1, 0.3, 1)` (expo-out — panels share one easing for motion consistency); rise-in's `cubic-bezier(0.22, 1, 0.36, 1)`. Tailwind-v4 note (shipped fix): transition the standalone `scale`/`translate` properties, not `transform`, or the hover won't animate.

### Motion inventory — status

| Element | Animation | Trigger | Status |
|---------|-----------|---------|--------|
| Capability strip | Slow marquee, pauses on hover | Always | **CURRENT** |
| Hero content | `rise-in`, staggered | Load | **CURRENT** |
| Modal open | `modal-in` | Open | **CURRENT** |
| Modal step | `step-in` | Step change | **CURRENT** |
| Section entrances (all five redesign sections) | `rise-in` via `ScrollReveal`, hero stagger (0 / 120 / 200ms; lists 120 + i·80ms) | Scroll into view | **CURRENT** (Unit 02) |
| Section depth | `Parallax` whisper drift (speed 0.06, max one per section — Manifesto body, About portrait) | Scroll | **CURRENT** (Unit 02) |
| Site video backdrop | `ScrollVideo` — fixed `-z-10` backdrop; a **three-clip sequence** (Strategist → Builder → Partner) segmented across the below-hero scroll range, each clip's `currentTime` eased toward its segment progress, crossfading at the seams; footage advances only while scrolling and freezes when idle; never `play()`s | Scroll | **CURRENT** (Unit 03, owner-directed) |
| Hero orbit | `HeroOrbit` — the hero section is a 260vh runway with a sticky one-viewport stage; the orbit clip's timeline is eased toward runway progress, so scrolling rotates the camera around the subject; never `play()`s; no-JS / reduced-motion keep the one-viewport hero on the static poster | Scroll | **CURRENT** (Unit 03, owner-directed) |
| Process open state | Phase number `white/55 → gold` at 150ms (replaces the retired circle draw-on) | Row open | **CURRENT** (Unit 02) |
| Sketch-accent SVG stroke draw-on · staggered per-word headline · tile lift + arrow draw | — | — | **RETIRED** (sketch system, §Retired) |

### Scroll-synced background video — **CHANGED → CURRENT (Unit 03, owner-directed cinematic sequence)**

The Unit 02 single-clip backdrop (`consulting-video.mp4`, retired 2026-07-07) became a **three-clip cinematic sequence** at the owner's direction: the self-hosted persona footage — **Strategist → Builder → Partner** (`public/backdrop-*.mp4`) — is the **site's fixed backdrop** (`fixed inset-0 -z-10`, above the `html` ink canvas, below all content). The below-hero scroll range divides evenly, one segment per clip; each clip's timeline is **scroll-synced** within its segment — each animation frame eases `currentTime` toward segment progress (shared engine, `src/lib/video-scrub.ts`), so the footage advances only while the visitor scrolls and **freezes the moment scrolling stops** — and clips **crossfade at the seams** (direct style writes, no React state). Sequence progress starts where the hero band starts revealing the backdrop, so no footage is spent unseen. No element ever `play()`s (no autoplay, ever). The stack sits under the hero's image-band treatment (`ink/40` overlay + bottom viewport scrim) so foreground text stays legible. Reduced-motion and no-JS both degrade to the same static first frame of the first clip under the same overlays.

**Opaque bands — CHANGED (decision-log #17, 2026-08-24).** A section that hides the backdrop behind an opaque surface marks itself `data-backdrop-hidden`, and the sequence's zero point moves to the bottom of the **hero-plus-contiguous-opaque region** rather than the hero alone. `range` becomes `scrollHeight − opaqueBottom`, so inserting a band of height H grows both by H and the **frames-per-pixel cadence is unchanged to the pixel** (measured: 4440px with and without the Work band); the sequence still opens on clip one's first frame the instant the backdrop becomes visible and lands on clip three's last at page bottom, with no footage spent behind the band. The preload gate stays anchored to the **hero release**, not the moved zero point, so its viewport of lead isn't spent inside the opaque wall — the fastest-scrolled stretch of the page. Contract for a marked section: **directly below the hero, padding-spaced (a vertical margin counts toward `scrollHeight` but not `offsetHeight` and would drift the range), and no transform on its root** (the measurement is offset geometry precisely so `Parallax`/`rise-in` transforms elsewhere can't fold in). A **non-contiguous** opaque section is out of scope for this attribute and needs a fresh approach.

The **hero orbit** (`public/hero-orbit.mp4` + first-frame poster) is the same contract inside the hero: the section is a **260vh runway**, the content sits on a sticky one-viewport stage, and runway progress drives the orbit clip's timeline — **scroll position is the camera angle**. The runway is reserved in CSS **before first paint** (`globals.css` `[data-hero-runway]`, gated on `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`) so hash deep-links and scroll restoration measure the final layout with zero hydration shift; no-JS and reduced-motion visitors get today's one-viewport hero over the static poster. All clips ship `preload="metadata"` + first-frame posters — the effect upgrades to auto only where it actually scrubs, so reduced-motion visitors never fetch footage that will never move, and the backdrops wait until the hero clip owns the initial bandwidth.

## Interaction vocabulary

The control language: **squared, hairline, flat gold**. No pills, no rounded corners, no glows. Icons are **inline SVG, never `lucide-react`** (project convention).

- **Advance (primary) — the divided-arrow button.** Two segments on one white bar: a label segment (`px-6 py-3`) and a hairline-divided arrow box (`border-l border-ink/15`, inline SVG arrow). Surface `bg-white text-ink font-medium`, squared, `min-h-11`. Hover (motion-safe): whole button `scale-[1.02]`, arrow nudges `translate-x-0.5`, 150ms. Focus: `outline-2 outline-offset-2 outline-white`. Disabled: `opacity-40`, pointer-events off. Used for **every forward action** (hero CTA, modal Next/submit); terminal actions may drop the arrow segment.
- **Ghost (secondary).** Squared transparent button, hairline `border-white/30`, white text, `px-6 py-3 min-h-11`; hover `border-white/60 bg-white/[0.06]`; white focus outline. Used for Back and any de-emphasized action.
- **Selection (radios, tabs, checkboxes).** Squared hairline rows/tabs: `border-white/12 bg-white/[0.02] text-white/90`; hover `border-white/30 bg-white/[0.05]`; **selected = flat gold fill** — `border-gold bg-gold text-gold-ink` (pairing rule), no glow. Native input `sr-only`; the row styles via `has-checked:`; focus via `has-focus-visible:` gold outline. Disabled: `opacity-40`, inert. Multi-select tabs carry a small squared check box (`size-4 rounded-[2px]`, hairline → `gold-ink` mark when checked).
- **Text controls & links.** Inline links: `text-gold underline underline-offset-4 font-medium`. Muted text buttons: `text-white/60 → hover:text-white`, optionally with the arrow-nudge. Icon buttons keep a `min-h-11 min-w-11` hit area (`text-white/60 → hover:text-white`).
- **Inputs.** Squared: `border-white/15 bg-white/[0.03] px-4 py-3 text-white`, placeholder `white/40`, mono micro-label caption above; focus `border-gold` + gold outline. Color shifts at 150ms.
- **Focus (binding).** Always visible: `outline-2 outline-offset-2`, **gold** on/near gold-accented controls and inputs, **white** on white-surfaced/ghost controls. Never remove the ring.
- **Progress.** A thin segmented meter: `h-[3px] w-7` bars, `gap-1.5`; filled `bg-gold`, rest `bg-white/15`; with an `sr-only` "Step n of m". No dots.
- **Markers.** The list/label marker is a small gold diamond: `h-1.5 w-1.5 rotate-45 bg-gold` (the strip's separator).

## Live components (as-built reference)

The shipped screens the system is derived from. Details: build-note 08 and the source files.

- **Hero — CURRENT (Unit 03).** Full-bleed image band (§Surfaces level 2), bottom-anchored; wordmark-only header (no nav, no second CTA); the `max-w-4xl` capability strip; then the two-column row — `w-1/2` white display headline with two gold payoff words + divided-arrow CTA (left), gold-italic supporting line (right, right-aligned). The band is the **scroll-scrubbed orbit footage** (`HeroOrbit`, §Motion): the section is a 260vh runway, the content stage is sticky for one viewport, and scrolling rotates the camera around the subject. The interim Unsplash still is **retired** — the background is the self-hosted brand asset (`public/hero-orbit.mp4` + poster), closing the owner-owed swap (build-note 18).
- **Hero CTA — CURRENT.** "Start a Conversation" (Rule 3.1) as the divided-arrow button; opens the qualification modal; no-JS degrades to `mailto` (Business Rules E3).
- **Capability strip — CURRENT.** Glass strip (level 3, light variant) marquee of the **four canonical services** (Taxonomy §1, exact casing) in mono labels with gold diamond separators. No invented numbers, no social proof (Brand Philosophy §10, Rule 4.3). Reads once to assistive tech (duplicate copies `aria-hidden`).
- **Qualification modal — CURRENT.** The system's elevated glass card: full-screen mobile / centered `560px` card desktop; squared, hairline, `#0a0a0c/95 + backdrop-blur-xl`, deep shadow; mono captions, segmented gold progress, flat-gold selection, divided-arrow advance + ghost Back; ink-72% + 8px-blur backdrop; focus-trapped native `<dialog>`, Esc closes, scroll locked. **Flow / validation / a11y logic per `05-business-rules.md`** — two-door entry (quick door → optional four-question qualifier), off-ramp with "Stay in Touch" capture, success / off-ramp-success / failure-fallback (Rule 2.7, answers preserved). Skin and flow are as-built and untouched by the redesign.
- **404 — CURRENT.** Light `paper` surface (the one `paper` exception, §Color), kept legible on the dark layout.
- **Redesign sections (Unit 02) — CURRENT.** The scroll-synced **video backdrop** behind the whole page (§Motion), then Manifesto (`#why`), Services (`#services` — elevated-glass service cards over the backdrop), Process (`#process` — native `<details>` exclusive accordion, gold-on-open numbers), About (`#about` — ink-surface portrait placeholder), Final CTA (`#start` — divided-arrow `ModalTrigger`), plus the re-skinned **fixed nav** (transparent over the hero → elevated glass `#0a0a0c/95 + blur` past 80px, carried on an inner div so the backdrop-filter never clips the mobile overlay; wordmark appears only once scrolled, the hero owns it at top; **anchor tabs only, right-justified — no nav CTA**, owner call: the hero CTA and `#start` carry conversion) and **footer** (mono micro-label links, gold display-scale mailto). All five sections are transparent bands over the backdrop — **no divider hairlines between sections** (owner call, 2026-07-06; the footage flows uninterrupted; hairlines remain component vocabulary: accordion rows, cards, panels) — with binding gutters, mono `(0n)` eyebrow via `SectionHeading`, one gold payoff phrase per headline, display headings carrying the licensed over-imagery text shadow. As-built record: build-note 17.

- **Selected Work (`#work`) — CURRENT (decision-log #16, 2026-08-24).** The proof band, first section under the hero, taking index **(01)** (the five above renumber to (02)–(06)). The **one opaque section on the page**: flat `bg-ink` matching the footer, owner-directed — the screenshots are its whole job and moving footage competed with them. Two consequences follow from that and are binding for any future opaque band: its display heading takes **no text shadow** (it sits on plain `ink`, where §Typography bans it — the licensed shadow is for sections over footage), and it must carry **`data-backdrop-hidden`** so `ScrollVideo` maps from the bottom of the hero-plus-opaque region and the backdrop keeps its exact first/last frames and per-pixel cadence (§Scroll-synced background video). Composition is adapted from an owner-supplied shadcn "gallery4" reference, which contributed **layout only** — heading row with advance controls pinned right, a card rail bleeding off the right gutter, pagination beneath. Everything else is this system: **no new dependencies** (native CSS scroll-snap, the shared `ArrowIcon` — the reference's embla/lucide/radix/cva are all refused), squared not `rounded-xl`, cards on the Services-card glass surface so the two grids read as one family, and the **segmented gold meter** of §Interaction vocabulary in place of the reference's dots ("No dots."). Screenshots lock to a fixed **16/9** frame regardless of source size (owner requirement). As-built record: build-note 20.

## Retired: the paper / editorial / sketch-accent system — **RETIRED**

The pre-pivot design language — light `paper` page, editorial multi-section scroll, pill buttons, sticky nav, hand-drawn SVG sketch accents (stroke-animated underlines, margin arrows, circled numbers, handwritten Caveat annotations), per-service accent colors — is **retired as a design direction** (2026-06-14 pivot; reconfirmed by decision-log #13 and the 2026-07-06 owner directive orphaning the non-gold accents). It must not be used as a reference for new sections; the five redesign sections are designed against the dark system above.

For the record: the dormant component files (`sketch-accent.tsx`, `site-nav.tsx`, section components, the pill `<Button>` usage) and the multi-section copy in `src/content/copy.ts` still exist on disk — retiring them from *code* is a separate owner call (build-note 08, Open item 3). The one idea that survived the pivot is accenting key headline words — now the gold color treatment, not a drawn stroke. The old section-ID / placeholder taxonomies belonged to this retired build and are reconciled in `06-taxonomy.md` §6–7 (aligned this unit).
