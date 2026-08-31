# UX / Design Spec — NextSketch Website Rebuild

**Version:** 3.4 · **Date:** 2026-08-28 · **Status:** Active — hero-derived design system; nav is a hamburger plus one featured button at every breakpoint, `/pricing` carries the four tiers, and **two service routes** ship under `/services/` (decision-log #22–#26, **#30**)
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
| `surface` | `#0A0A0C` | The elevated-surface fill — every card, panel, mock frame and glass surface. Solid where nothing is behind it; `/95 + backdrop-blur-xl` over footage (§Surfaces). Never pure `#000` for an elevated surface (it reads flat); the page itself stays `ink` |
| `white` | `#FFFFFF` | Text and the advance-button surface; the alpha base for hairlines, panel fills, and text hierarchy |
| `gold` | `#E4B976` | **The accent — the only one.** Payoff words, strip markers, selection fill, progress, focus, links |
| `gold-ink` | `#65451D` | The paired text color on a `gold` fill (pairing rule below) |

`surface` was "one deliberate literal outside the token set" until 2026-08-31 — repeated as `bg-[#0a0a0c]` per component — and is now a token defined once in `globals.css` (owner directive; decision-log #33). Its declaration is **`@theme inline`, load-bearing**: utilities inline the raw hex so `bg-surface/95` statically folds to the exact value the old literals compiled to. Do not move it into the plain `@theme` block — that compiles a runtime `color-mix()` over a `var()`, which lands one RGB step off the build-time fold. This is a *name* for a shipped value, not a new color; #14's "no new tokens" clause is narrowed, not reversed (#33).

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
| `lavender` · `rose` · `sage` | **Orphaned as accents — CHANGED, one narrow live use (decision-log #31, 2026-08-28).** The old per-service / per-phase accent mapping stays retired (`06-taxonomy.md` §1–2; #14). They are now readable in exactly one place: **interface chrome inside the service routes' decorative wireframes** (`service-block-visual.tsx`) — syntax highlighting, status dots, an avatar chip, tinted cluster marks. Never a brand accent, never per-service, never on a real control, never outside a mock. See #31 |
| `lavender-ink` · `rose-ink` · `sage-ink` | **Orphaned.** The paired -ink halves have no live use; the wireframe tints are alpha on `ink`, not accent-on-paired-text (#31) |
| `paper-bright` | **Orphaned.** |
| `paper` | **Orphaned from the system**, with one live exception: the 404 page's light surface (**CURRENT** — code wins). Not available to sections |

**Gold is still the only accent, and there are still no new tokens.** (Decision-log #14, narrowed by #31 only for the wireframe use above: gold carries every emphasis at full strength, the three chrome colours sit at 45–85% alpha beneath it, and #14's "no new tokens" clause is untouched.) The 2026-07-06 inspiration reference (owner-supplied editorial screenshot) contributes *fidelity only* — its rust/orange accent is explicitly **not** adopted; where it shows a warm accent, this system uses `gold`.

## Typography

**Fonts — CURRENT.** Display/UI: **Space Grotesk** (`font-sans`); labels/meta: **JetBrains Mono** (`font-mono`) — both via `next/font/google` variable fonts, self-hosted at build (zero runtime requests, zero layout shift). Font tokens live in `globals.css` `@theme inline`. Inter + Caveat are **RETIRED** (decision-log #1, superseded).

The system has exactly **three type roles**; their cadence (display → mono label → body) is the rhythm every surface repeats:

| Role | Face | Shipped treatment | Trace |
|---|---|---|---|
| **Display heading** | Space Grotesk | `font-medium`, `tracking-tight`, tight leading (`leading-[1.05]` at hero scale); hero scale `text-4xl → sm:5xl → md:6xl → lg:7xl`; panel scale `text-2xl → md:text-3xl` (+ `text-balance`) | hero `<h1>`, modal `HEADING_CLASS` |
| **Mono micro-label** | JetBrains Mono | uppercase, tracked, small, muted: `text-[0.7rem] uppercase tracking-[0.14em] text-white/55` (captions/field labels) or `text-xs sm:text-sm tracking-[0.12em] text-white/70` (strip labels, no uppercase transform — strip copy is already cased) | modal `CAPTION_CLASS`, capability strip |
| **Body** | Space Grotesk | `text-base leading-relaxed text-white/70`; emphasized values `font-medium text-white` | modal body copy, failure list |

Two shipped display accents, available to sections:

- **Gold payoff words** — accent words inside a white display heading take `text-gold` (the hero's **"production" / "partner"**, decision-log #18; the retired pair was "production" / "stay"). At most a couple of words; the heading stays white. The words are matched against the headline string, so a headline rewrite must move `accentWords` with it or the accent silently disappears.
- **Gold-italic aside** — a supporting line may be `text-gold italic` (hero's right column). This is the *only* italic in the system.

Over imagery, text carries a soft shadow for legibility (shipped values: headline `[text-shadow:0_2px_30px_rgba(0,0,0,0.5)]`, wordmark `0 1px 16px rgba(0,0,0,0.6)`, supporting line `0 1px 20px rgba(0,0,0,0.7)`). On plain `ink` or a panel, no text shadow.

**RETIRED:** the handwritten accent face (Caveat) and the "annotation, max one per viewport" rule — gone with the sketch system (§Retired).

## Surfaces

Three surface levels, all **squared** (`rounded-none`) and **hairline-bordered** — the glass-panel language shipped in the modal and capability strip:

1. **The page** — flat `ink`. Sections sit directly on it.
2. **Image band** — a full-bleed background image under the two-layer treatment: a flat `ink/40` overlay **plus** a bottom scrim `bg-gradient-to-t from-ink/85 via-ink/20 to-transparent`, so the image reads while white text stays legible (the hero's recipe).
3. **Glass panel** — the reusable card/panel surface, generalized from the modal card and the strip:
   - **Fill:** translucent near-black — `bg-surface/95 backdrop-blur-xl` for an elevated card (modal), or lighter glass `bg-ink/30 backdrop-blur-sm` for an in-flow strip; solid `bg-surface` where no footage is mounted behind it (the Work band, `/pricing`, the service routes). Never pure opaque `#000` for an elevated surface.
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

> **`[animation-delay:…]` as a class does not work on this site — measured, 2026-08-30.** `motion-safe:animate-rise-in` compiles to the `animation` **shorthand**, which resets `animation-delay` to `0s`, and the `motion-safe:` variant sorts *after* the plain delay utility, so it always wins. Every `[animation-delay:…]` element on `/`, `/pricing` and the service routes computes `0s`, which means the documented 0 / 120 / 200ms stagger has never actually staggered anywhere except `ScrollReveal` — which is correct precisely because it sets `animationDelay` **inline**, and an inline style beats any class. **Set entrance delays inline.** The service hero was fixed this way; `/` and `/pricing` still carry the broken class form and are an open owner call, since fixing them changes shipped timing on two pages this unit was not scoped to touch.
| Modal open | `modal-in` | Open | **CURRENT** |
| Modal step | `step-in` | Step change | **CURRENT** |
| Section entrances (all six sections below the hero) | `rise-in` via `ScrollReveal`, hero stagger (0 / 120 / 200ms; lists 120 + i·80ms) | Scroll into view | **CURRENT** (Unit 02) |
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
- **Qualification modal — CURRENT.** The system's elevated glass card: full-screen mobile / centered `560px` card desktop; squared, hairline, `surface/95 + backdrop-blur-xl`, deep shadow; mono captions, segmented gold progress, flat-gold selection, divided-arrow advance + ghost Back; ink-72% + 8px-blur backdrop; focus-trapped native `<dialog>`, Esc closes, scroll locked. **Flow / validation / a11y logic per `05-business-rules.md`** — two-door entry (quick door → optional four-question qualifier), off-ramp with "Stay in Touch" capture, success / off-ramp-success / failure-fallback (Rule 2.7, answers preserved). Skin and flow are as-built and untouched by the redesign.
- **404 — CURRENT.** Light `paper` surface (the one `paper` exception, §Color), kept legible on the dark layout.
- **Redesign sections (Unit 02) — CURRENT.** The scroll-synced **video backdrop** behind the whole page (§Motion), then Manifesto (`#why`), Services (`#services` — elevated-glass service cards over the backdrop), Process (`#process` — native `<details>` exclusive accordion, gold-on-open numbers), About (`#about` — ink-surface portrait placeholder), Final CTA (`#start` — divided-arrow `ModalTrigger`), plus the re-skinned **fixed nav** (transparent over the hero → elevated glass `surface/95 + blur` past 80px, carried on an inner div so the backdrop-filter never clips the overlay; wordmark appears only once scrolled, the page owns it at top; **one right-justified hamburger plus the featured `NAV.featured` button** — see §Nav below; the nav still carries no *conversion* CTA, and the hero CTA and `#start` still carry conversion (#26)) and **footer** (mono micro-label links, gold display-scale mailto). All five sections are transparent bands over the backdrop — **no divider hairlines between sections** (owner call, 2026-07-06; the footage flows uninterrupted; hairlines remain component vocabulary: accordion rows, cards, panels) — with binding gutters, mono `(0n)` eyebrow via `SectionHeading`, one gold payoff phrase per headline, display headings carrying the licensed over-imagery text shadow. As-built record: build-note 17.

- **Selected Work (`#work`) — CURRENT (decision-log #16, 2026-08-24).** The proof band, first section under the hero, taking index **(01)** (the five above renumber to (02)–(06)). The **one opaque section on the page**: flat `bg-ink` matching the footer, owner-directed — the screenshots are its whole job and moving footage competed with them. Two consequences follow from that and are binding for any future opaque band: its display heading takes **no text shadow** (it sits on plain `ink`, where §Typography bans it — the licensed shadow is for sections over footage), and it must carry **`data-backdrop-hidden`** so `ScrollVideo` maps from the bottom of the hero-plus-opaque region and the backdrop keeps its exact first/last frames and per-pixel cadence (§Scroll-synced background video). Composition is adapted from an owner-supplied shadcn "gallery4" reference, which contributed **layout only** — heading row with advance controls pinned right, a card rail bleeding off the right gutter, pagination beneath. Everything else is this system: **no new dependencies** (native CSS scroll-snap, the shared `ArrowIcon` — the reference's embla/lucide/radix/cva are all refused), squared not `rounded-xl`, cards on the Services-card glass surface so the two grids read as one family, and the **segmented gold meter** of §Interaction vocabulary in place of the reference's dots ("No dots."). Screenshots lock to a fixed **16/9** frame regardless of source size (owner requirement). As-built record: build-note 20.

### Nav — **CHANGED (decision-log #22 and #26, 2026-08-25)**

**One hamburger and one button, every breakpoint.** The bar carries the brand lockup slot on the left and, on the right, the `NAV.featured` button beside a right-justified burger, at **all** widths; the visible desktop anchor-tab row is **RETIRED**. Everything else about the bar is unchanged: fixed, transparent over the page's first screen, elevated glass (`surface/95 + backdrop-blur-xl`, `white/10` hairline) with `py-5 → py-3` shrink past 80px, surface on the inner div so the backdrop-filter never becomes the containing block for the overlay.

- **The bar carries one button — `NAV.featured`, which is Pricing (CHANGED, decision-log #26, 2026-08-25).** The shared `<Button>` at the de-emphasized **`ghost`** variant in the **`compact`** size, never the hero's white divided-arrow advance. It narrowly supersedes the 2026-07-06 "no CTA in the nav" call, which was about conversion: this is navigation to a page, so **the nav still has no conversion CTA**. It hides below 375px, where the bar measurably stops fitting; the menu carries Pricing at every width regardless, and bar and menu read the same object so the two cannot drift.
- **The bar does not intercept pointer events; only its controls do (#26).** `<header>` is `pointer-events-none` with `pointer-events-auto` restored on the wordmark link, the button, the burger and the overlay, so a page can put a real link under the transparent bar. Nothing about the bar's appearance or the 80px handoff changes.

- **The overlay is now the whole nav**, not a mobile fallback. Full-screen elevated glass, `role="dialog"` + `aria-modal`, Tab focus trap, Escape to close, body scroll locked while open, focus returned to the burger on close. It takes the bar's **gutter ladder** (`px-6 / sm:px-8 / lg:px-16`) so its lockup lands on the gutter the bar's does at every width — flat `px-6` drifted 8px from the bar between `sm` and `md`, and would have read as a sideways jump of up to 40px at `lg`.
- **Items are six**, in page order, Pricing last (§Taxonomy §6; #21/#24). Each carries a finished **root-relative** href, so every one resolves from any route (#23).
- **The lockup is the page's above the fold, the bar's below it.** The bar renders an empty slot until 80px of scroll so the two never double up; whichever page is mounted supplies its own at the same gutter and the same `h-7` size. A page with no hero must therefore render one itself — `/pricing` does, holding it through the handoff so there is no window with no logo on screen.
- **No-JS narrowing (accepted, #22).** The overlay is closed at server render, so the items are not in the no-JS HTML and the burger is inert without scripting. The footer maps the same `NAV.items` as plain anchors on every page, so no destination is lost. A `@media (scripting: none)` fallback row is the fix if the nav itself must carry them.

### `/pricing` — **CURRENT (decision-log #23, 2026-08-25; the four tiers, #25)**

The **first** standalone route, and the first page other than `/` since the 2026-06-14 pivot (the two service routes followed it, #30, and inherit everything solved here). Flat `ink`, nav and footer mounted by the page (never the layout, so the 404 keeps its paper surface), its own metadata, and an intro band with the `display`-scale `SectionHeading` and one gold payoff word, followed by the tier grid. The band was bottom-anchored and `min-h-dvh` while the page was empty; carrying the tiers, it is **top-padded** (`pt-32 / sm:pt-40 / lg:pt-48`) so the grid follows immediately rather than a screen later (#25). **No text shadow** — it sits on plain `ink`, where §Typography bans it, the same rule the Work band follows. **`ScrollVideo` is not mounted here**: the backdrop belongs to the home page and its range is measured from that page's hero-plus-opaque region (#17).

It renders its own above-the-fold lockup in a zero-height `sticky top-0` wrapper. That is a deliberate departure from `hero.tsx`'s `absolute`-inside-a-sticky-stage, and it is load-bearing: the hero's stage is sticky across 160vh of runway, so its lockup outlasts the 80px handoff, while a plain `absolute` copy scrolls out at 52px and leaves a 28px window with no logo anywhere on screen. `h-0` keeps the wrapper out of the flow so the lockup still paints at the hero's exact 24px offset, and it must stay the section's **first child with no top padding above it**. **It is a link** to `NAV.home` (`/#top`) — **CHANGED (#26, 2026-08-25)**: it shipped un-linked in Unit 22 because the fixed bar spans the top band at `z-40` and swallowed every click on it, and the bar's `pointer-events-none` change is what made the link underneath reachable. The gutter padding sits on the anchor rather than the `<header>`, so the lockup still paints at the hero's 24px offset while the hit area clears the binding 44px minimum. Past 80px the bar's own wordmark answers the same click.

**The tier grid — CURRENT (decision-log #25, 2026-08-25).** Four cards under an `sr-only` heading, each running name → description → upfront → ongoing → included → CTA. Composition is adapted from an owner-supplied pricing reference that contributed **layout only** (the PR #27 posture): **no new dependencies**, squared not `rounded-xl`, the §Interaction-vocabulary gold diamond instead of a lucide `Check`, the shared `<Button>` through `<ModalTrigger>`, and no billing toggle, no recommended tier, no strikethrough exclusions, no seat counts. Cards are the **solid `surface`** of the Work band rather than §Surfaces' translucent-plus-blur — that recipe exists so a card reads over the moving backdrop, and this page mounts no video. **Every band starts on the same line across a row: each card is a six-row CSS subgrid** sharing its neighbours' row tracks, so the `Included` row renders even when a tier has no bullets (every card must span the same six rows or the subgrids stop lining up); the parent carries `gap-x-4 gap-y-0` and the row separation is a uniform `mb-4`, because a subgrid cannot reliably override an inherited row gap and `last:mb-0` would inflate the final row's track. All four cards carry identical `p-6 md:p-8`, since a subgrid positions its tracks inside its own content box.

**Tier feature bullets are still owner-owed (Rule 4.3)** and every `features` array is empty — a card renders no list rather than an invented one. As-built record: build-note 23.

### `/services/*` — **CURRENT (decision-log #30, 2026-08-28)**

**Two grouped routes, not four.** `/services/product` (New Product · Product Completion · Product Support) and `/services/agentic-system` (the two depths of Taxonomy §1's "Two kinds of agentic system"). Both are the same component — `service-page.tsx` — plus their own metadata; the route files are thin for the reason `pricing/page.tsx` is thin. **No `/services` index route.**

**Everything `/pricing` solved is reproduced, not re-derived.** Flat `ink`; nav and footer mounted by the page, never the layout, so the 404 keeps its paper surface; its own metadata; **`ScrollVideo` not mounted** (#17); and the **zero-height `sticky top-0` wordmark wrapper**, which is load-bearing and must stay the section's first child with no padding above it. Two consequences of mounting no video are handled rather than inherited, the same pair the Work band and `/pricing` handle: cards are **solid `surface`** rather than §Surfaces' translucent-plus-blur (nothing behind them to blur), and headings carry **no text shadow** (plain ink, where §Typography bans it). Measured at build: the 80px handoff is identical to `/pricing`'s at every scroll position — page lockup only below 80px, both from 82px up.

**Four blocks, owner-specified:**

**Content is centred on a `max-w-6xl` measure — the service routes only (owner direction, 2026-08-30).** Every band still spans full width and still keeps the binding gutter ladder; an inner `mx-auto w-full max-w-6xl` wrapper centres the content inside it, so the hero, all the rows, §How it works and the close stop at the same two edges. Without it the two-column rows spread to the whole viewport on a wide screen: the text column hugged the left gutter while the mock centred itself in a very wide track, and no two rows lined up. The measure is `<Container>`'s existing value, so nothing new is invented, and it sits on an inner wrapper rather than the band because `box-sizing: border-box` would otherwise subtract the gutters and shrink the content by 128px at `lg:`. Mocks take `lg:max-w-none` so they **fill their column** and meet the measure edge as the text does on the other side. **The hero lockup stays outside the measure**, on the viewport gutter, because the nav bar's wordmark is there and the two must land in the same place across the 80px handoff — centring it would reintroduce the jump the zero-height sticky wrapper exists to prevent. `/` and `/pricing` are unchanged and remain full-bleed.

1. **Hero — CHANGED (owner direction, 2026-08-30, against a supplied reference).** Reproduces `/pricing`'s sticky lockup exactly, then three things the reference contributed:

   - **The ribbon.** The landing hero's marquee capability strip, **full-bleed**, in the slot directly under the nav band — where the reference puts its own bar, allowing for the fixed bar and the page's lockup occupying the page top here. It is **the same component**, not a copy: the strip was inline in `hero.tsx` and is now `capability-strip.tsx`, rendered by both surfaces. Extraction was verbatim, so `/`'s markup is byte-identical. Each route passes its own labels — the three service names on `/services/product`, the two depth names on `/services/agentic-system` — and more marquee copies, because shorter lists across a full-width frame run out of track and show the loop seam. The surface (`bg-ink/30 backdrop-blur-sm`) is **not** parameterised: it exists for the footage behind it on `/`, and over a solid `ink` page it resolves to the same black with the blur a no-op.
   - **A single column.** The hero briefly carried a tilted wireframe in a second column behind a `lg:border-l` rule; the owner removed both (2026-08-30), so the heading, description and actions run at the page measure with nothing beside them. `service-hero-visual.tsx` went with it. (The `hero` type scale was considered and **not** adopted: the one-line promise is still owner-owed and the canonical-name fallback would dominate at `lg:text-8xl`.)
   - **Two CTAs** — the divided-arrow `ModalTrigger` plus a **`ghost` `Button` to `/pricing`**, not filled, same default size so the two match in height. It reads `NAV.featured`, the same object the nav bar's Pricing button reads, so label and href cannot drift (#26).


   The reference's `[ 01 ]` cell is dropped (the eyebrow fills that role and a second index would collide with the `◆ 01/02/03` markers below), as is its trial caption (no approved equivalent).
2. **"What you get" — alternating split rows (owner direction, 2026-08-28, against a supplied reference).** One `<section id>` per topic — **each row a card on the site's card recipe, exactly (owner direction, 2026-08-31, #33):** `border-white/15`, solid `bg-surface`, `p-6 md:p-8`, the `white/30` hover lift — the same surface the pricing tiers and the §How-it-works cards carry, so a block's text and its mock read as one unit from desktop down to the stacked mobile column. **Both columns carry `min-w-0`**, the bento tiles' load-bearing device one level up: without it the mocks' fixed-pixel chrome forced the stacked mobile track to 448px and the routes really rendered 497px wide at a 375px viewport behind mobile auto-zoom (#33). Inside the card, a two-column row: the text on one side (mono index → panel-scale name → description → gold-diamond deliverables list → `<ServiceCta>`, **the same gold text link the home page's service cards carry**, so a service's CTA is identical on the card that sends a visitor here and the block they land on) and a **wireframe mock** on the other. **The sides alternate down the page**, which is what stops five rows reading as one table; the text is always first in the DOM and `lg:order-*` does the swapping, so the reading order and the single-column stack put substance before decoration. The visual is a **purpose-built wireframe per block**, not one motif reskinned five times (owner feedback, 2026-08-28): a product UI for New Product, a developer workspace for Product Completion, a live-product ops panel for Product Support, a dashboard UI for Internal Tool, and the reference's **tile cluster kept for AI Workflow Integration**, the one block it actually suits. Framed mocks are the hairline `white/15` over solid `surface` used everywhere else on these routes, with skeleton matter on the white alpha ladder. **Every graphic on these routes — the five block visuals (the hero illustrations were removed, #32/build-note 26) — renders the one shared `VisualFade`** (`src/components/visual-fade.tsx`), so each dissolves identically from every edge. Its far stop is **`surface`** — the card fill every consumer now sits on (#33; at `ink` it ringed each mock with a slightly darker vignette inside its card) — and it is an explicitly sized `ellipse 50% 50%` (the `farthest-corner` default puts the last stop at the corners and leaves the top and bottom mid-edges unfaded on a 4/3 box) over a long `25% → 100%` ramp (a short ramp reads as a cut-off, not a dissolve). **One definition, one file; do not add a local variant.** **`gold` appears once per mock**, on the element that is the point of it. **All five sit in the same `4/3` box and carry the same radial fade**, so the rows line up down the page and each dissolves into its card from every edge. Each mock carries real interface detail — window chrome, a nav row, tabs, a status bar, a sidebar, a **profile chip top-right** — and **interface-chrome colour** from `rose`/`sage`/`lavender` (**#31**, a narrow supersession of #14: chrome only, never a brand accent, never per-service; `gold` still carries every emphasis at full strength). **Not one mock contains a readable string, a numeral, a metric or a logo** — that is a Rule 4.3 requirement, not a style choice: a chart with an axis or a dashboard with figures would assert things nobody approved (decision #5's retired stat strip is the precedent), and skeleton bars assert nothing. Adopted from the reference: the split, the alternation, the tile cluster (kept for the one block it suits), and the idea of a visual that dissolves into the page rather than sitting on it as a hard rectangle. **Refused:** all of its dependencies (`Card`, `Button`, `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `cn()`, a `/components/ui` directory — **none installed**, per the standing zero-new-dependencies posture and "icons are inline SVG, never `lucide-react`"); its **third-party product logos**, which would assert integrations nobody approved (Rule 4.3) — the tiles carry **abstract geometric marks** built only from shapes the system already uses (the rotated square, the hairline, the squared frame) and every visual is `aria-hidden`; and its `rounded-xl` / `bg-muted` / `dark:` variants / shadcn tokens. Each block gets its own mock so the visual suits the service. The mocks are a **flagged judgment call**: §Interaction vocabulary settles the list marker and bans lucide, but does not cover a decorative wireframe, and the spec's instruction for that case is to generalize and flag. `globals.css`'s `section[id] { scroll-margin-top: 5rem }` clears the fixed bar on a deep link with no extra CSS. Component: `service-page.tsx` + `service-block-visual.tsx`.
3. **How it works** — the four canonical phases (Taxonomy §2) as a **numbered card grid**: `phase.order` at display scale on the `white/20` alpha step, outside and above each card, then the card. Layout adapted from an owner-supplied reference that contributed **layout only** (the PR #27 / build-note 23 posture) — its visual mocks, three-step count, rounded cards and pill eyebrow are all refused. Deliberately **not** `<ProcessSection>`: that component is `#process` on the home page and carries the page's section numbering. Content is shared, the component is not.
4. **Close** — `FINAL_CTA` heading with its gold payoff phrase and the divided-arrow `ModalTrigger` repeated. **No price and no pricing link:** the close briefly carried a gold text link to `/pricing`, removed by the owner (2026-08-28) so it carries one action. `/pricing` is still reached from the nav bar's featured button and the footer, on every page.

**Conversion goes through the existing seam** — `ModalTrigger` for the hero and close, `ServiceCta` for the per-block ones, both carrying the block's `need` into the modal already provided by the layout. Every CTA string is from the Rule 3.1 set; nothing new was added.

**Entry point.** The routes are **not** nav items (#22/#24/#26 are settled). Each `#services` card's **name** links to that service's block, resting as the white heading it already was under a `white/25` hairline underline and taking gold only on hover and focus — deliberately not the §Interaction-vocabulary gold text link, which would put a second gold element above the card's gold CTA and spend the one accent twice per card. The card's CTA is untouched.

**Motion is the shipped vocabulary and nothing else — no keyframe was added and `globals.css` is untouched.** The hero entrance is the load-time `rise-in`; in the "what you get" band each row's text reveals as one block, its deliverables land at `120 + j·70ms`, and each mock assembles row by row so the visual builds rather than appears — the §Motion-inventory list rhythm, tightened because these rows are shorter than a card. The **`target:` treatment is the one new interaction**: the rows are tall, so arriving from a service card has to say *which* one you arrived at. The block's **index goes gold** and the tile cluster's **emphasized tile takes a gold hairline**, both at the 150ms micro-transition tempo — the Process accordion's open-row treatment doing identical work, with gold on only those two elements so the accent stays scarce. Pure CSS, so it holds with no JS and adds no transform for reduced motion to suppress.

**Two copy slots are owner-owed and render nothing (Rule 4.3):** the one-line promise `<h1>` per page (the heading falls back to the canonical name, so nothing invented ships and the page is never headless) and the `/services/product` hero intro. The "what you get" bullets **ship as DRAFT** — the owner asked for this layout built, and a layout with nothing in it cannot be reviewed; they are the ones drafted in build-note 26 and are edited in `src/content/service-pages.ts` alone. As-built record: build-note 26.

## Retired: the paper / editorial / sketch-accent system — **RETIRED**

The pre-pivot design language — light `paper` page, editorial multi-section scroll, pill buttons, sticky nav, hand-drawn SVG sketch accents (stroke-animated underlines, margin arrows, circled numbers, handwritten Caveat annotations), per-service accent colors — is **retired as a design direction** (2026-06-14 pivot; reconfirmed by decision-log #13 and the 2026-07-06 owner directive orphaning the non-gold accents). It must not be used as a reference for new sections; the five redesign sections are designed against the dark system above.

For the record: the dormant component files (`sketch-accent.tsx`, `hero-section.tsx`, the held section components, the pill `<Button>` usage) and the multi-section copy in `src/content/copy.ts` still exist on disk — **`site-nav.tsx` and `site-footer.tsx` are no longer among them**: Redesign Unit 02 remounted both, and this list was left stale (corrected 2026-08-25) — retiring them from *code* is a separate owner call (build-note 08, Open item 3). The one idea that survived the pivot is accenting key headline words — now the gold color treatment, not a drawn stroke. The old section-ID / placeholder taxonomies belonged to this retired build and are reconciled in `06-taxonomy.md` §6–7 (aligned this unit).
