# Build Note 33: Rebrand to fin's Zen Linen, dark only (adhoc)

**Date:** 2026-10-14 · **Branch:** `adhoc/rebrand-zen-linen` · **Base:** `main` @ `f59be58`
**Status:** COMPLETE, with five items back to Nate (see "Judgment calls"). All four gates green. Verified in headless Chrome against production builds of `main` and of this branch.
**Follows:** build-note 32 (the hero loop). **Decisions:** #47 (the rebrand), #48 (corners), #49 (the logo), #50 (the hero footage). #47 supersedes #14; #50 supersedes the footage portion of #46.
**Brief:** `brief-rebrand-zen-linen` (owner call 2026-10-14). Assets supplied with it: `fin-main.zip` (the rulebook, not committed), `hero-loop-sketch.mp4`, `hero-loop-sketch-poster.jpg`. Owner direction in session, on top of the brief: "make sure the hero fade out in all directions NO hard stops… everything dark mode according to the new design system… project design system and components and tokens all should be updated and reflected in the code… also align documentation."

---

## Pre-flight gap list

The brief was written without the repo. Where it and the code differ, the code won.

1. **The footage was never hosted externally.** The current loop is committed in `public/` (build-note 32 found the same). The brief says "host it the way the current one is hosted" and "do not commit video into `public/`", which contradict each other on this repo. The new loop is installed the way the current one is: in `public/`, **at the existing filenames** (`hero-loop.mp4`, `hero-loop-poster.jpg`). Keeping the filenames is also what keeps `src/content` untouched, because `LANDING.backgroundVideo` and `backgroundPoster` name those paths. 11.9 MB is far inside GitHub's limits.
2. **`/work` and `/work/<slug>` do not exist on `main`.** They live on the unmerged case-study branches. On `main` both render the 404, which is what was checked (it is dark now).
3. **The nav carries no modal trigger.** Decision #26: the bar has the Pricing button and the burger, and no conversion CTA. The modal was run from every trigger that exists: the hero CTA, the four Services card CTAs, the Final CTA, the three `/pricing` tier CTAs, and the hero, block and close CTAs on both service routes (18 in all).
4. **The footer has no gold mailto.** It was dropped on 2026-08-04.
5. **The favicon has no yellow lead.** At 16, 32, 48 and 64px it is a cream tile, a dark disc and the cream mark. No pixel is yellow, so its recolour puts no coral in it.
6. **Fin's own comment overstates coral on the dark card** (6.6:1). Measured: 5.6:1. The brief already says so.
7. **Numbering.** The log tail on `main` is #46 and the build-note tail is 32 (#39–#44 and notes 29–30 sit on the unmerged case-study branches). This unit is **#47–#50** and **note 33**.

## The assets

| | Delivered | Installed |
|---|---|---|
| Video | `hero-loop-sketch.mp4`, 11,890,341 bytes | `public/hero-loop.mp4`, SHA-256 `2f53e994…e947e55c`, identical |
| Poster | `hero-loop-sketch-poster.jpg`, 60,197 bytes | `public/hero-loop-poster.jpg`, SHA-256 `cd5a5ad6…4c707bf0`, identical |

Probed in Chrome: 29.208s, 1920×1080. No re-encode, trim, resize or temporal fade.

## The token layer

`src/app/globals.css` is rebuilt the way fin builds its own: raw custom properties on `:root`, then an `@theme inline` bridge into Tailwind's namespaces. Tailwind's stock colour, radius, shadow, text-shadow and drop-shadow namespaces are cleared first, so a component cannot reach a value that is not declared here. **No component holds a hex, `rgb()` or named colour.** The only literals in the file are transparencies of black (shadows, the hero mask) and the dialog backdrop, each commented.

**Fin's dark set, values copied as values:** `background` #141414 · `foreground` #E8E3DA · `card` / `popover` #1C1C1C (+ their `-foreground`) · `primary` #D1CFC0 / `primary-foreground` #363636 · `secondary` #222222 / #D1CFC0 · `muted` #2A2A2A · `muted-foreground` #8E8A83 · `accent` #363636 / #D1CFC0 · `destructive` #EF4444 · `border` and `input` #2C2C2C · `ring` #D1CFC0 · `sidebar` #101010 · `brand` #F26A4B · `chart-1`…`chart-5` (#D17359, #698EDD, #C2802D, #B077C2, #7A9F46). Radius: one `--radius` (0.5rem) and every step derived from it as fin does (`sm` 0.6×, `md` 0.8×, `lg` 1×, `xl` 1.4×, `2xl` 1.8×). Shadows: fin's soft scale, `shadow-xs`…`shadow-2xl`.

**Tokens added beyond fin** (recorded here as the brief asks):

| Token | Value | Why |
|---|---|---|
| `brand-foreground` | #141414 | Fin has no text colour for a coral fill. The site needs one for the selected option rows. #141414 on coral is 6.1:1; linen on coral is 2.4:1 and is never used |
| `text-shadow-over-video` | `0 1px 24px rgb(0 0 0 / 0.6)` | Hero text over moving footage. Replaces three near-identical literals (0.5/30px, 0.7/20px). Hero only |
| `drop-shadow-over-video` | `0 1px 16px rgb(0 0 0 / 0.6)` | The same for the SVG logo over the footage. Was a literal `[filter:drop-shadow(…)]` |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | The one shared easing (was `--ease-premium`, same curve) |
| `hero-fade` (utility) | see "The hero" | The all-edge dissolve |
| `bg-hero-scrim` (utility) | see "The hero" | The retuned bottom scrim |
| `bg-page-glow` (utility) | coral at 16%, `circle 560px at 50% 200px` | #35's glow, recoloured, moved out of an arbitrary class |
| `bg-visual-fade` (utility) | radial, `transparent 25%` → `var(--card)` | The wireframe fade, moved out of an arbitrary class |

**Removed:** `ink`, `white`, `surface`, `gold`, `gold-ink`, `paper`, `paper-bright`, `lavender`, `rose`, `sage` and the three `-ink` pairs; `--shadow-modal`; `--ease-premium`; Space Grotesk. The dead `accent` data in `src/content` (`SERVICES`, `PROCESS`) still names gold, lavender, rose and sage, and `ACCENT_NAMES` in `src/lib/types.ts` types it. It is data, never rendered, and the brief bars both files.

## Visual calls

Every call below is the builder's, made from fin, with the reason.

### Colour and surfaces

- **Two text steps, not an alpha ladder.** The old white-alpha ladder (white, /90, /70, /60, /55, /40) collapses to fin's two validated text colours: `foreground` for everything that was white down to white/70, `muted-foreground` for white/65 and below. Fin validates discrete steps, and a blend is a colour it never validated. Consequence: body copy is brighter than before (linen at 14.4:1, where white/70 was about 10:1); headings stay distinct by face (Playfair) rather than by brightness.
- **Former decorative numerals now meet the text floor.** The big phase numerals on the service routes were white/20 (about 1.7:1). Text must hold 4.5:1, so they are `muted-foreground` (5.4:1) and read much stronger. This is the floor, not a taste call.
- **Surfaces map onto fin's steps:** page `background`; every card, panel, modal and mock frame `card` with a `border` hairline (fin's rule: in dark, the border separates, not the shadow); sub-panels, option rows and inputs `secondary`; decorative fills `muted`; hover fills on buttons `accent`.
- **Section separation is unchanged.** The 2026-07-06 owner call (no divider hairlines between sections) stands. The page-to-card step is #141414 → #1C1C1C plus a #2C2C2C hairline, against #000 → #0A0A0C plus a white/15 hairline before: the same separation, measured 1.08:1 now against 1.06:1 then for the fills alone.
- **The home Services cards are solid `card`.** They kept the glass recipe after #46 removed the footage behind them. The rebrand is a colour change, so the #46 leftover is closed. So are the over-imagery text shadows on the Why, Services, Process, About and Start headings: removed.
- **The Work cards' screenshot scrim fades to `card`**, the fill below it, not to `background`: the translation table's literal `from-background/90` left a darker band where each image meets its card.
- **The 404 goes dark.** Outcome 1 requires it, and "dark only" leaves no light set to use. `[color-scheme:light]` is gone.
- **The page glow on `/pricing` and the service routes is coral at 16%** (gold was at 30%). Coral is hotter and darker than gold at the same alpha, and the accent is meant to stay scarce.
- **Focus is one colour everywhere: `ring` (stone, #D1CFC0).** It was gold beside gold controls and white elsewhere. Fin's own components use `ring`; coral focus would have spent the accent on every keyboard stop.
- **The wireframes' interface chrome (#31) moves onto fin's dark chart steps:** rose → `chart-1` terracotta, sage → `chart-5` sage, lavender → `chart-4` plum, and two old gold file-type tints → `chart-2` indigo (they were chrome, not emphasis). Alphas re-judged lower because fin's steps are more saturated than the old pastels: glyphs 75%, strokes and marks 60–70%, code tokens 50–60%, avatars 40%, area fills 15–20%, and terracotta about ten points under the others because it shares coral's hue family. The coral area fill in New Product drops from 0.32 to 0.24 for the same reason. Checked in the browser after the build.

### Type

- **Display headings are Playfair Display 700** (`font-serif font-bold tracking-tight`), leading 1.05 → 1.08 for its descenders. Every size step is unchanged. That covers SectionHeading (both sizes), the hero `<h1>`, the modal's panel headings, the 404 and the pricing intro.
- **Card and row titles are Inter 600** (`font-sans font-semibold tracking-tight`): service names, tier names, Process rows, work card names, and the service routes' block headings at panel scale. Playfair is kept for display, which is fin's split.
- **Figures are Inter with tabular numerals** (fin §1: Playfair ships no tabular figures). Prices on `/pricing` and the phase numerals.
- **The two italics are Playfair italic in coral:** the hero's supporting line and the Process annotation (both were gold italic).
- **Mono labels stay JetBrains Mono**, now `muted-foreground` (was white/55) or `foreground` (strip labels, was white/70).

### Controls

- **The advance button is fin's primary:** stone fill, charcoal text (7.7:1), `rounded-md`, colour change on hover. The hand-rolled copies (hero CTA, modal Next/Submit) match `button.tsx`. **The whole-button hover scale is retired** (fin shows state by colour, never by transform); **the arrow nudge stays**, because it says "advance".
- **Secondary and ghost converge** on fin's secondary: hairline, `secondary` fill, `accent` on hover. Dark only means `primary`/`inverse` and `secondary`/`ghost` look the same; the four variant names stay so no caller changed.
- **The nav's Pricing button is now a filled secondary control**, including over the hero (it was a transparent white-hairline outline). It follows from the variant convergence; it reads clearly over the footage.
- **Selection:** squared rows become `rounded-md`, hover moves the border only (so no text ever sits on a `muted` or `accent` fill, where muted text fails), selected is a flat coral fill with `brand-foreground` text and mark.
- **Inputs:** `rounded-md`, `secondary` fill, `input` border, `ring` on focus.
- **Links stay coral and underlined**, hover to linen. The modal's two coral email links gained the hover and focus states they never had.
- **The progress meters** keep their segments, now `rounded-full`: coral filled, and the rest segments `muted-foreground` at 70% (3.25:1 on `background`, 3.1:1 on `card`). They were white/15 on `main` (about 1.4:1). The Work rail's rest bars are the only visible part of real buttons, so fin's 3:1 floor for marks binds them; the modal's meter takes the same recipe so the two read as one control.
- **Box-less icon buttons** (the nav burger, the overlay close, the footer's social links, the modal close) share `rounded-md`, so every focus ring has the same corner.

### Corners (#48)

Buttons, inputs, rows, tabs and chips `md`; cards, panels and mock frames `xl`; sub-panels `lg`; the modal `xl` from `md:` up and square full-screen on a phone; meters, dots and avatars `full`; check boxes and 8–12px glyph squares `sm`; full-width bars, overlays, the capability strip's rule and full-bleed strip chrome inside the mocks, none. The diamond marker stays a diamond.

### Motion

Fin §8 binds the site now. **Entrance `rise-in` 700ms → 200ms** (travel 16px → 12px), **`modal-in` 280 → 200ms**, **`step-in` 220 → 180ms**, micro-transitions stay 150ms. Stagger delays are unchanged. **Two older transitions ran at 300ms and are now 150ms**, the micro-transition tempo: the nav bar's colour, hairline and padding shift at the 80px handoff, and the Work card's screenshot hover (grade, overlay and the `scale-105` lift). Review caught both; they predate the rebrand. **The marquee is exempt**: it is continuous ambient motion like the hero footage, not a transition, and it is still motion-safe gated. **Reduced motion now removes every transition** (a base-layer block from fin sets transitions to 0s and animations to 0.01ms), so hover colour changes no longer animate for those visitors either.

## The hero

### The all-edge fade (owner direction)

`hero-fade` is a mask on the footage wrapper: two linear-gradient masks, one per axis, intersected, so a corner fades on both. Each ramp is a **smoothstep curve over nine stops**, not a two-stop line: a linear ramp has a visible crease where it starts (Mach banding), which reads as a hard stop. The edge length is `clamp(4rem, 22vmin, 14rem)`, so the fade reads the same on a phone (79px at 360×780) and a wide screen (224px at 1920×1080). The mask takes the footage and both overlays to transparent, so the page's own `background` shows through and the hero runs into the Work band with no seam. **It is spatial only**: the loop's seam in time is the file's, as the brief requires.

### Judgment call 1: the headline over the new footage

**The current overlay no longer kept it readable, so it was retuned.** Measured frame by frame over the whole loop (paused and seeked every 0.5s, the hero's text hidden, the 5th-percentile background pixel behind each text box, text shadow ignored, which only helps):

| Text | Old overlay (`background`/40 + short scrim), worst | New overlay, worst across 8 sizes |
|---|---|---|
| Headline (linen) | 6.2:1 | **12.2:1** |
| Coral payoff words | **2.2:1** (2.2 to 3.8 by size) | **5.18:1** |
| Coral supporting line | **4.1:1** (4.1 to 5.1 by size) | **5.66:1** |
| Capability strip (linen) | 7.6:1 | **10.2:1** |

**Why coral failed where gold did not:** coral is a much darker colour (relative luminance 0.30 against gold's 0.52), so it holds 4.5:1 only over a background no lighter than about #2D2D2D, and this footage passes bright linen line-work and, from 17s to 24s, a coral bar chart right behind the payoff words.

**What changed:** the flat overlay drops from 40% to 25% (the footage is brighter above the text than before), and the short scrim becomes `bg-hero-scrim`: sized in rem from the bottom because the text block is bottom-anchored and about the same height at every width, near-solid through the band where the headline and supporting line sit (95% at the bottom, 86% at 26rem), then a smoothstep release to nothing at 48rem. Three variants were measured before choosing; this one keeps the most footage visible while passing everywhere. Sizes measured: 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 414×896, 375×667, 360×780.

**Recommendation:** accept. The trade is that the footage reads as a ghost behind the text band and vivid above it; at 1024×768 (where the text block is 75% of the screen) most of the frame sits under the scrim. Screenshots at t=0, 18 and 26s are with the hand-off.

## The logo (#49)

The inline lockup's two fills become token classes: cream → `fill-foreground` (linen), yellow lead → `fill-brand` (coral). Paths, viewBox and drawing order are the file's. The favicon is recoloured on its delivered pixels with a barycentric remap of its three colours (cream → linen, dark disc → `background`), which keeps every anti-aliased edge; the ICO keeps its four RGBA PNG entries (16/32/48/64). The header block, the lockup's size and offset, and the nav's 80px handoff are unchanged.

## Judgment calls back to Nate

1. **The headline over the new video:** retuned, measured and passing (above). Recommend accepting the new overlay.
2. **The 404:** it goes dark. Outcome 1 requires it and the site has no light set; a light fin surface would be the only light page on a dark-only site and would need fin's light tokens, which the brief rules out. Recommend dark.
3. **Sections losing separation:** none did. No section relied on gold to separate, and fin's steps keep the page-to-card step where it was (1.08:1 against 1.06:1, plus the hairline). The one loss of emphasis found is typographic, not sectional: on `/pricing` the commitment term (was white) and the intro (was white/70) collapsed onto the same linen, so the term was given `font-medium` to keep it the emphasized line (the old spec's "emphasized values `font-medium`"). Recommend accepting.
4. **Every place gold carried meaning, and what coral does there now** (nowhere new):
   - payoff words in every display heading (hero, Work, Why, Services, Process, About, Start, `/pricing`, both service heroes and closes) → coral;
   - the capability strip's diamonds, the list and label diamonds on cards, rows and the `/pricing` term → coral;
   - the section index `(0n)` → coral;
   - the hero supporting line and the Process annotation (the two italics) → Playfair italic coral;
   - selection fills and the check mark in the modal → coral fill, `brand-foreground` text;
   - the progress meter and the Work rail's meter → coral filled segment;
   - text links (Build With Us, the modal's email links, the Work cards' link) → coral;
   - the Process open-row number and the service rows' `:target` index → coral;
   - the `/pricing` monthly figures → coral, Inter tabular;
   - the one emphasis per wireframe (New Product's area line, Product Completion's active tab and caret, Product Support's "today" line, Internal Tool's read-out point, the Anthropic hub mark and its `:target` border) → coral;
   - the page glow → coral at 16%;
   - the logo lead → coral;
   - **focus rings near gold controls → not coral: `ring`.** The one deliberate change of role.
5. **What the brief got wrong about the codebase:** the gap list above (hosting, `/work`, the nav trigger, the footer mailto, the favicon lead).

## Deviations from the brief

1. **The video is in `public/`**, at the existing filenames (gap 1). The alternative breaks either "the way the current one is hosted" or "no file under `src/content/` changes".
2. **Decision log: beyond "append plus footer", two one-line supersession notes** on #14 and #46, and the numbering preamble now says #45–#50 and "next is #51". The log's own rule is that a superseded row "stays in place and says so" (the #46 unit did the same for #15 and #17). Nothing was renumbered or reworded.
3. **The marquee keeps running** under fin's 200ms ceiling, as ambient motion (Motion, above). Recorded in #47 so it is not mistaken for a miss.
4. **Over-footage styling on the lower home sections was removed** (two #46 open items). The brief did not name them, but they are type and colour, and leaving an invisible black text shadow on a dark page is not the new look.

## Review

Two rounds of adversarial review ran on top of the build.

**Per group, during the restyle** (six reviewers, one per file group, then a fix pass): the modal's empty check box now shows its rest border (`muted-foreground`, 4.6:1, where the guide's `border` hairline was 1.1:1); the dormant files' accent maps stopped sending lavender, rose and sage to chart hues (chart colours are wireframe chrome only) and the dormant placeholder dropped a sub-floor opacity dim; the wireframes' two lifted surfaces (the old `#101013`) became `secondary`, a lift off `card` as they were a lift off the old surface. Shell, routes and home came back clean or with nits.

**Across the whole diff, after it** (four lenses):

| Lens | Result |
|---|---|
| Content and logic invariance | **Clean.** Every changed `.ts`/`.tsx` file compared to `main` as a token stream with comments stripped: only class strings, SVG paint values, the logo's `fill` → `className`, and the font loader changed. `src/content`, `src/app/api` and `src/lib` untouched (one doc comment in `src/lib/types.ts` aside, below) |
| Consistency across components | The modal's panel heading lacked the display leading (fixed: `leading-[1.08]`); box-less icon buttons had two corner treatments (fixed); the meters and the 300ms transitions (fixed, above) |
| Leftovers and stale comments | No retired class, hex or `rgba()` in any component. One comment still cited #14 as in force (fixed); three comments badly wrapped by the restyle (fixed) |
| Accessibility and motion | The two 300ms transitions and the meter rest marks (fixed, above) |

**Kept, with reasons:**

- **The New Product mock keeps a faint coral area fill** under its coral line (0.24 at the top stop). Fin §1 says coral is never a chart fill, but that rule protects data charts in fin's light mode, where coral fails 3:1; this is a decorative, `aria-hidden` wireframe on dark, and gold sat exactly here. One line to neutralise if you prefer.
- **The modal's advance button keeps its own scale** (arrow box `px-3.5`, 18px arrow; Back `px-6`). Colour, corner, states and focus match `button.tsx`; the size is as shipped on `main`, and size is not part of the rebrand.
- **Dormant motion stays as it is.** `sketch-accent.tsx`, `src/lib/motion.ts` and `reveal.tsx` still carry 300–600ms motion, reached only through the dormant sections no route imports (#13). Their colours were swapped so nothing retired is referenced; their timing is for whoever revives them.
- **One comment in `src/lib/types.ts`** above `ACCENT_NAMES` called the names "accent color pairs per Taxonomy §5" with a pairing rule. Taxonomy §5 now lists them as retired data, so the comment says that. Comment only; the type is unchanged.

## Checks

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ (the same six routes as `main`) · `npm run banned-terms` ✓ (56 files).

**Method.** A headless-Chrome driver over the DevTools protocol (a scratch script outside the repo; no dependency added) against `next start` production builds of `main` (built from `git archive`) and this branch.

| Check | Result |
|---|---|
| Rendered text | `document.body.innerText` **identical to `main`** on `/`, `/pricing`, `/services/product`, `/services/agentic-system`, `/work` and an unknown path |
| Section order | unchanged (#13) |
| Screenshots | every route at 360, 768, 1280 and 1920, before and after (reduced motion, so every block is revealed); no horizontal overflow at any width |
| Modal, every trigger | 18 triggers across four routes: each opens, preselects exactly as `main` (e.g. `/pricing` tiers → agentic, agentic, new_product), closes on Escape and returns focus to its trigger |
| Modal, every state | quick-door validation, success (API stubbed 200), real failure fallback (no Sheet webhook locally), the four-question qualifier, the contact step, the off-ramp, at 1280 and 360: **behaviour trace identical to `main`**, and the `/api/qualify` payload shapes identical. Nothing was sent anywhere: no lead endpoint is configured locally |
| Text contrast | every text element on every route at 1280 and 360, computed against its composited background: **zero below 4.5:1**, minimum 4.96:1 (muted text on a card) |
| Hero text contrast | the table under judgment call 1 |
| Keyboard | Tab through every route: every stop shows a ring, minimum **10.87:1** against what is behind it |
| Marks | coral marks 5.6–6.1:1; meter rest segments 3.1–3.25:1 (fin's floor is 3:1) |
| Every class compiles | every class token in `src/**/*.tsx` found as a selector in the built CSS (a typo or a removed token compiles to nothing in Tailwind v4) |
| Loop | two full loops at 1280 and 360: restarts at 29.17s, **no dark frame** (luminance 24.8 on the last frame → 22.6 on the first, median 27.5), one `play()` call |
| Reduced motion | no `play()`, `currentTime` 0, poster showing, transitions computed `0s` |
| Autoplay refused | poster stays, no exception |
| Console | only the two pre-existing local entries, as on `main`: Vercel Analytics' 404 outside Vercel and the Apollo pixel's 400 |
| Grep | no gold token, hex or class anywhere in `src/`, and no hex in any component (only `globals.css` holds colour values). The word "gold" survives only as a **data name**: the dead `accent` values in `src/content` (`SERVICES`, `PROCESS` and `PROCESS_ACCENTS`), their type `ACCENT_NAMES`, and the dormant components that key class maps by those names (their classes are coral or neutral now). The brief bars `src/content`, and the data is never rendered |

**Not verified here:** real Safari, Firefox, iOS and Android. This environment has Chromium only. `mask-composite: intersect` and `color-mix()` are supported in every current engine; one look on an iPhone is worth doing before merge.

## Spec updates

Every doc that described the look was reconciled to the code, then checked claim by claim against the code by a second agent (which corrected 2 mismatches in 02/07, 7 in 06 and 11 in 04, all toward the code).

- `docs/decision-log.md`: **#47–#50** appended at the real tail, dated 2026-10-14, attributed to the owner. One-line supersession notes on **#14** and **#46**. The numbering preamble says #45–#50 and "next is #51". Footer: the #46 over-footage item moves to a new "Resolved (2026-10-14, #47)" line; the out-of-repo brand files become an open owner item.
- `docs/04-ux-spec.md` → **v4.0**. The design system rewritten to the as-built: the palette with values and roles, measured contrast, the two-step text ladder and surface steps, accent rules (coral, pairing with `brand-foreground`, focus not coral), retired tokens and the #31 chrome mapping, type roles plus figures, the coral italic, the over-video shadow tokens, surfaces and the radius table (#48), the motion contract (fin's 200ms ceiling, the marquee exemption, the reduced-motion base block) and inventory, the hero loop (footage, the retuned overlay with its measurements, the all-edge fade), the interaction vocabulary, and every live-component paragraph that named gold, ink, surface, white, squared, glass or paper. A new **§Retired** records the gold-on-ink, squared, Space Grotesk system with its old values.
- `docs/06-taxonomy.md` → **v2.6**. §5 becomes "Design tokens": every token name exactly as `globals.css` declares it, the radius, font, shadow and utility names, and a RETIRED list of the old names (noting the dead `accent` data still uses some as data). The preamble and the §1/§2 accent notes reconciled; §7 notes the #50 footage at the same filename.
- `docs/07-technical-spec.md` → **v2.3**: the Styling, Fonts and Animation rows; the project tree (layout, globals, the 404, the favicon, `public/`).
- `docs/02-prd.md` → **v2.2**: an Overview paragraph on the look, the non-goal "dark is the only theme", F6, F10 (motion), F12 (the 404 is dark), the first acceptance criterion.
- `docs/03-site-architecture.md` → **v2.5**: every route dark on one ground, the 404, the nav bar's glass, the live page structure.
- `docs/05-business-rules.md` → **v2.2**: Rule 4.3's placeholder surface.
- `docs/00-project-setup.md` → **v1.2**: fin's motion rule and accessibility floor added to §Conventions.
- `docs/scope-lock-mvp.md`: a second supersession banner (the look changed, the scope did not).
- Untouched: `01-vision.md` and `08-runbook.md` (nothing in them is now false), `README.md`, `concept-website-rebuild.md`, briefs and every earlier build note.

**Doc drift left for Nate, not guessed at** (flagged by the docs pass; none of it is false about the look):

- `01-vision.md`, `02-prd.md` and `03-site-architecture.md` call the system "hero-derived" and cite "04-ux-spec v3.0". It is fin-derived now and the spec is v4.0; whether to rename the framing is a wording call.
- `02-prd.md` F4/F6/F7 and a line in `01-vision.md` still tag shipped sections PLANNED (#13). Open question 4 names the retired footage of Nate as a closed record.
- `concept-website-rebuild.md` (the 2026-06-11 brainstorm) still talks about sketch accents and carrying over the old site's colours, with no supersession banner.
- `06-taxonomy.md` §7's Work-screenshot paragraph still says the crop is always `object-top` (the code picks by `focal`) and cites the retired backdrop.
- `README.md` still says "Two pages" (there are four routes) and omits `banned-terms` from its commands.
- The `/pricing` subsection heading in `04-ux-spec.md` still cites "the four tiers, #25" while the body says three cards (#45's amendment).
- Fin tokens defined but unused today: `card-foreground`, `popover`, `popover-foreground`, `secondary-foreground`, `accent-foreground`, `destructive`, `sidebar`, `chart-3`. Kept because fin defines them; prune or keep is your call.
- Three readings of "accent" now coexist: fin's `accent` token (a neutral hover fill), the site's one accent (`brand`), and the dead `accent` data field. The taxonomy documents the difference rather than renaming anything.

## Still open, unchanged by this unit

The 28px no-logo window on `/` (#46; the header block was again out of scope), `min-h-dvh` → `min-h-svh` on the hero (#46), and the brief's out-of-scope list: brand docs outside the repo (now an open item in the log), a light mode, and the paperwork debt.
