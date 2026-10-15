# Build Note 34: Design system audit (adhoc)

**Date:** 2026-10-15 · **Branch:** `adhoc/design-system-audit` · **Base:** `main` @ `ac8c039`
**Status:** COMPLETE. All 14 checks answered: 3 pass as they stood (1, 12, 14), 4 pass after a fix made here (3, 6, 9, 11), 3 are fixed in part with findings left (2, 4, 7), and 4 return findings only (5, 8, 10, 13). Thirteen findings come back to Nate, each with a recommendation; the weightiest is a contrast-floor miss under the page glow (F1). Every fix is invisible: the 143 after-screenshots are byte-identical to the 143 before-screenshots, and forced hover and focus states match to within the capture's own 1/255 gradient dither. All four gates green.
**Follows:** build-note 33 (the Zen Linen rebrand). **Decisions:** no new row. The log tail stays #51 and the next row is still **#52**; the footer's "Still open (owner)" list gains one item for this audit.
**Brief:** `Adhoc Unit: Design system audit (website)` (owner call, Nate, 2026-10-15).

---

## Pre-flight gap list

The brief was written from a read-only look at `main` @ `ac8c039`. Where it and the code differ, the code won.

1. **"About 117 arbitrary Tailwind values."** Counted with a scanner that reads only string and template literals in `src/` (so a TypeScript index type is not counted): **126**, of which 10 sit in dormant files. After this unit: **106** (96 live, 10 dormant).
2. **"There is one suppression today."** Confirmed: one, in `apollo-tracker.tsx`, with a reason.
3. **"Some components appear to have no importers."** Confirmed, and more than components: the full dormant set is under F10. Nothing was deleted, because decision-log #13 keeps the dormant code on disk and makes delete-vs-keep an owner call.
4. **"Build note 33 already names hand-rolled copies of the button (hero CTA, modal Next/Submit)."** Confirmed, and the modal's Back and the Work rail's arrow boxes are copies too (check 7). The hero CTA was the one copy that could fold into `<Button>` without a pixel moving, so it did.
5. **The baseline was the branch's own start point.** The branch was cut from a clean `main` @ `ac8c039` and built before any edit. For the hover and focus comparison, `main` was built again from `git archive` inside the repo (removed before the gates ran).
6. `NSOS-Transfer/` was not touched. The unmerged case-study branches were not touched (see "Out of scope").

## Method

Everything ran against `next start` production builds in headless Chrome over the DevTools protocol, from scratch scripts kept outside the repo (no dependency added).

- **Screenshots.** Reduced motion on (the hero shows its poster, every reveal is static, the marquee stands still), viewport tiles scrolled top to bottom at **360×780, 768×1024, 1280×800 and 1920×1080** on `/`, `/pricing`, `/services/product`, `/services/agentic-system` and the 404, plus **12 modal states per width**, opened from the hero CTA: the quick door; the quick door filled, with "New product" selected and "Product completion" greyed out by the conflict rule; Q1 empty; Q1 selected; readiness; authority; validation; the contact step; success (the `/api/qualify` call stubbed to 200, so nothing was sent anywhere); the failure fallback (stubbed 500); the off-ramp; the off-ramp's success. **143 screenshots** and 20 page heights. Two baseline runs on the same build matched byte for byte, so the capture is deterministic and any after-difference would be real.
- **Contrast.** For every visible text run, the text was made transparent, the page captured, and the pixels behind each glyph box read back; the ratio is taken against the worse of the 5th and 95th-percentile background luminance (stricter than build-note 33's 5th percentile, so some numbers below are lower than note 33's and still pass). Marks (diamonds, meter bars, check boxes, icon glyphs) are measured against a band of pixels around them. Hover: every link, button, summary and option label forced to `:hover` through the protocol at 360 and 1280. Focus: every Tab stop on every route and in the modal at 360 and 1280, the ring measured against the pixels under it. Glow: every `muted-foreground` text on the page ground of `/pricing` and both service routes scrolled to the glow's centre row (viewport y 200px). Hero: motion on, the loop paused and seeked every 0.5s through all 59 frames at all four widths.
- **Compiled output.** The built CSS and the prerendered HTML of every route were saved before and after and diffed.

## The audit table

| # | Check | How it was run | Result | Fix or finding |
|---|---|---|---|---|
| 1 | Tokens, not literals | Grep for hex, `rgb()`, `hsl()`, `oklch()`, `color-mix()` and named colour classes across `src/app`, `src/components`, `src/lib`, `src/content`; SVG paint attributes; inline styles | **Pass** | The one literal outside `globals.css` is the transactional email's inline `color:#1a1a1a` (`lead-notify.ts`), the documented exception. SVG paints use `currentColor` or `var(--color-brand)`. Inline styles carry only entrance delays, the strip's `--duration`/`--gap`, and wireframe coordinates. The black transparencies in `globals.css` (shadows, hero mask, dialog backdrop) are all commented |
| 2 | Arbitrary values justified | Literal scanner (above), each value checked against the scale and the compiled CSS | **Fixed + findings** | 20 replaced by the scale step they already equal (Fix 3). The other 96 live values are listed with their reason below. Two groups have no step today and want an owner call: the type values (F7) and the px values that equal a step only at a 16px root (F8) |
| 3 | Token names agree | `globals.css` against Taxonomy §5 and UX spec §Color, §Radius, §Surfaces, §Motion, name by name and value by value; live-use counts against every "in use" / "unused" claim | **Pass, docs fixed** | 26 colour names, the radius token and 5 steps, 6 shadows, 2 over-video shadows, 1 easing, 4 animations and 4 utilities agree everywhere, values included. Fixed: the shadow description (comment and spec said "blur two to three times the offset, 3–9%"; the values are 2.7 to 5 times, 4–9%) and five UX spec claims (Fix 6) |
| 4 | Nothing retired survives | Grep for every retired name (gold, ink, paper, surface, white alphas, lavender, rose, sage, Space Grotesk, `--ease-premium`, `--shadow-modal`, `rounded-none` as brand) in code, comments and live docs | **Pass, comments fixed + finding** | No retired token, class or font compiles or is referenced in a class. `rounded-none` appears once, on the full-screen phone modal, which §Radius documents. Three comments in `src/lib/types.ts` still described ink and gold as current: fixed (Fix 4). Four in `src/content` do too, and the brief bars editing them: F12. The word "gold" survives as the dead `accent` data the docs already record |
| 5 | Accent discipline | Every `brand` use listed and checked against UX spec §Accent rules | **Pass, one finding** | Inventory below. One coral use outside the rules: a second coral mark in the Product Support wireframe (F9) |
| 6 | Type, surfaces, radius | Every `font-serif` use; every text size against the documented ladders; `tabular-nums` on figures; every radius class; every `bg-card` surface for its `border` | **Pass, docs fixed** | Playfair carries only display headings and the two coral italics; Inter carries body, titles and figures (all figures `tabular-nums`); JetBrains Mono carries labels. Every size is on the documented ladder; three uses were missing from the spec (Fix 6). Every lifted surface carries a `border`. Every corner is a named step; no bare `rounded` in any class. The missing type tokens are F7 |
| 7 | One component, one job | Read every component; grep for repeated recipes | **Fixed + findings** | The hero CTA is now `<Button>` (Fix 1). Still hand-rolled: the modal's advance and Back (F5) and the Work rail's arrow boxes, plus seven repeated recipes (F6). Naming follows Taxonomy §8 throughout (PascalCase components, kebab-case files, token names exactly as §5) |
| 8 | Every state | Every interactive element listed with its hover, focus-visible, active and disabled states; Tab through every route and the modal | **Findings** | Every element is a native control and keyboard reachable, and every one shows the `ring` on focus; focus is never removed (the one `outline-none` is on the modal's programmatic-focus headings, `tabIndex=-1`). But no control has a pressed state (F2), seven have no hover state (F3), and `<Button>`'s disabled state keeps pointer events, against the spec (F4) |
| 9 | Motion | Every `animate-*` is `motion-safe:`; every duration ≤200ms; `motion/react` imports; JS-driven motion; the reduced-motion base block | **Pass, lint message fixed** | All live keyframes are `motion-safe:` and run 200ms or less (the marquee and footage are the documented ambient exemptions); un-suffixed `transition-colors` uses Tailwind's 150ms default. JS motion (`Parallax`, the rail's smooth `scrollTo`, `HeroLoop`) is reduced-motion gated. `motion/react` is imported only by the three dormant files the ESLint rule ignores, but the rule's message still told developers to animate through those dormant components (Fix 5). 300ms motion survives only in dormant `sketch-accent.tsx` (note 33 kept it) |
| 10 | Contrast | The sweep described under Method | **Finding** | Everything clears the floor except `muted-foreground` text passing through the coral page glow on `/pricing` and the service routes: 4.36 to 4.48:1 (F1). Full numbers below |
| 11 | Copy is code | Grep for string constants, JSX text nodes and literal `aria-*`, `alt`, `title` values in components | **Fixed** | Nine components rendered their headline's coral phrase from a literal of their own. All nine now read it from `src/content`, verbatim (Fix 2). No JSX text literals and no literal accessible names remain. (The About portrait's `src` is a path literal in the component; it is an asset path, not copy, noted under F13) |
| 12 | Quality bar | `tsconfig.json`; grep for `any`; grep for `eslint-disable` and `@ts-*` | **Pass** | `strict: true`; zero `any`. The one suppression (`apollo-tracker.tsx`, `no-before-interactive-script-outside-document`) carries its reason, and the reason is right: the Next 16 docs (`01-app/03-api-reference/02-components/script.md`) require `beforeInteractive` scripts in the root layout, which is the only place this component mounts |
| 13 | Nothing dead | An import graph of every module in `src/`; every `public/` asset's references; live-use counts of every token; prop and export usage | **Findings (nothing removed)** | Every `public/` asset is referenced. Dead: the dormant sketch-era set and its `motion` dependency, two dead props, a dead content field, and eight colour tokens, a radius step and five shadow steps with no live use (F10, F11). The one zero-consumer component this unit created, `hero-cta.tsx`, was removed with Fix 1 |
| 14 | Gates match the setup doc | `.github/workflows/ci.yml` against `00-project-setup.md` §Scaffold step 5 | **Pass** | CI runs on every `pull_request` and on push to `main`: `npm run lint`, `npm run typecheck` (`tsc --noEmit`), `npm run build`, `npm run banned-terms` (which scans the built HTML/RSC and the `src/content` source, as the doc says) |

## Fixes (every one invisible)

**Fix 1: the hero CTA is the shared `<Button>` (check 7).** `HeroCta` was a hand copy of `<Button>`'s primary divided-arrow look at `text-lg`, plus `ModalTrigger`'s mailto seam. `<Button>` gained a third size, `large` (default's paddings at `text-lg`), `ModalTrigger` forwards `size`, the hero renders `<ModalTrigger arrow size="large">`, and `src/components/hero-cta.tsx` is deleted.
*Why it is invisible:* the same element (an anchor, the same `mailto:` href, the same intercepted click opening the modal with nothing preselected) with the same segments and the same colour, corner, focus, hover and arrow-nudge classes. The classes `<Button>` adds change nothing here: `min-h-11` sits under a 52px box; `items-center` and `justify-center` lose to `items-stretch`, which compiles later in the stylesheet (checked: byte 23572 against 23401); `disabled:opacity-50` cannot apply to an anchor. *Proof:* screenshots identical at every width, and the hero CTA forced into rest, hover, focus-visible and hover plus focus at 360 and 1280, with motion on and off, matches `main` to within 1/255 on the gradient behind it, the same dither `main` shows against itself.

**Fix 2: the coral payoff phrases live in content (check 11).** Each section matched its headline against a literal of its own and rendered that literal in coral. They move into `src/content`, verbatim, beside the headline they match: `MANIFESTO.accentPhrase`, `PROCESS.accentPhrase` (read by `/`'s Process and the service routes' §How it works), `ABOUT.accentPhrase`, `FINAL_CTA.accentPhrase` (read by `/`'s Final CTA and the service routes' close), `SERVICES_ACCENT_PHRASE`, `WORK_ACCENT_PHRASE`, `PRICING.accentPhrase`. The hero's `LANDING.accentWords` and the service pages' `accentPhrase` were already in content; this follows them. The components' doc blocks called the literals "presentation marker, not copy"; they render, and a copy edit to a headline now changes its accent in the same file. Content changed only by these additions (no existing string or comment edited).
*Why it is invisible:* the rendered strings are the same characters from a different file. *Proof:* the prerendered text of all five routes is identical to `main`'s, character for character; screenshots identical.

**Fix 3: twenty arbitrary values replaced by the step they already equal (check 2).** `aspect-[4/3]` → `aspect-4/3` (5, the wireframes), `aspect-[3/4]` → `aspect-3/4` (the About portrait), `sm:w-[24rem]` → `sm:w-96` and `lg:w-[26rem]` → `lg:w-104` (2 each, the Work rail), `saturate-[0.85]` → `saturate-85` (2), `contrast-[0.95]` → `contrast-95`, `brightness-[0.95]` → `brightness-95`, `contrast-[0.92]` → `contrast-92`, `brightness-[0.86]` → `brightness-86` (the Work screenshot grade, now in the same form as its `-100` hover classes), `has-[:disabled]:` → `has-disabled:` (2, the modal's need tabs), `lg:row-[1]` → `lg:row-1` (2, the footer).
*Why it is invisible:* each new class compiles to the same declaration. *Proof:* the compiled CSS diff shows exactly these rule swaps and nothing else: `aspect-ratio:4/3` for `4/3`; `width:calc(var(--spacing) * 96)` for `24rem`; `saturate(85%)` for `saturate(.85)`; the identical selector `:has(:disabled)`; `grid-row:1` for `grid-row:1`. (The bracket forms of the two aspect ratios still compile, because the dormant `placeholder.tsx` uses them.)

**Fix 4: comments that disagreed with the code (checks 3 and 4).** `src/lib/types.ts`: the Work placeholder was described as an "ink placeholder", a near-white screenshot as glaring "against the ink band", and `accentPhrase` as "the gold payoff word"; now `secondary`, `background` and coral. `globals.css`: the shadow scale's ratio (above). `button.tsx`, `hero.tsx`, `qualification-modal.tsx`: comments that described the hero CTA as a separate copy, or the modal's advance as matching `<Button>` exactly (it does not; F5). Comment-only.

**Fix 5: the motion lint rule points at the live entry points (check 9).** `eslint.config.mjs`'s `no-restricted-imports` message told a developer reaching for `motion/react` to "animate via `<Reveal>`/`<SketchAccent>` (or variants from `@/lib/motion`)": the dormant layer. It now points at the CSS keyframes behind `motion-safe`, triggered by `<ScrollReveal>` or `<Parallax>`, and a comment says why three files are ignored. The rule itself is unchanged.

**Fix 6: docs brought into line with the code (outcome 3).**
- `docs/04-ux-spec.md` → **v4.1**: the trace list no longer names `hero-cta.tsx`; §Interaction vocabulary says the hero CTA is `ModalTrigger` at `large`, that the modal's Next and submit are a hand-rolled copy at their own arrow scale, and that only the modal's advance turns pointer events off on disable; §Measured contrast records the glow exception (F1) instead of claiming nothing anywhere fell under 4.5:1; §Surfaces gives the shadow scale's real ratio and says only `shadow-2xl` is live; §Typography adds the How-it-works card titles and the Process row numbers and notes that `SectionHeading`'s `hero` size is used only by a dormant file; the Hero CTA bullet names `ModalTrigger`.
- `docs/06-taxonomy.md` → **v2.7**: §8's component example is `ModalTrigger` (was `HeroCta`). §5 needed nothing: every name, value and "in use" claim matched.
- `docs/07-technical-spec.md` → **v2.4**: `hero-cta.tsx` out of the tree; `button.tsx` notes the `large` size.
- `docs/00-project-setup.md`: unchanged; its conventions, quality bar, motion and contrast rules and CI description match the code (the contrast floor is the rule; F1 is where the code misses it).
- `docs/decision-log.md`: one "Still open (owner)" item for this audit. No row, no rewording.

## Findings

Each needs Nate. They are ordered by weight.

**F1. The coral page glow pushes muted text under 4.5:1 (check 10).** `/pricing` and both service routes carry the fixed glow (#35, coral at 16% since #47), centred 200px down the viewport. Every `muted-foreground` text on the page ground passes through it as the page scrolls, and at its centre measures **4.36 to 4.48:1** (8 of the 32 page-ground muted texts at 360 and 1280: the How-it-works numeral "03" on both service routes, the `/pricing` footnote, the "How we work" and "The next step" eyebrows, and the agentic route's hero eyebrow, which sits there on load at 360). The tile sweep caught the same at 768 ("04", 4.43). Build-note 33's sweep composited text against flat fills, so it could not see the gradient. Computed: 16% coral over `background` is `#38221D`, where `muted-foreground` makes 4.34:1. **Recommendation: drop the glow to 12%** (computed 4.61:1 at the centre; it is a one-number change in `bg-page-glow`), or accept the dip for these labels and record the exception. A visual change, and #35/#47 set the 16%, so it is yours.

**F2. No control has a pressed state (check 8).** There is no `active:` class on any control on the site. **Recommendation:** one pressed step per control family, by colour only (fin): `active:bg-primary/80` on the advance, `active:bg-muted` on the `secondary` fill, `active:text-muted-foreground` on text links. Visual.

**F3. Seven interactive elements have no hover state (check 8):** the nav bar's wordmark link, the overlay's wordmark link, the footer's wordmark link, the `/pricing` and service-route lockup links, the nav burger, the overlay's six menu items, and the Process `<summary>` rows. Each has a focus ring. **Recommendation:** the colour-only hover the rest of the site uses: the burger takes the icon-button treatment (`hover:bg-accent` on its box), the menu items and Process row names dim to `muted-foreground` on hover, the wordmark links stay as they are (a logo link without a hover is common, and coral would spend the accent). Visual.

**F4. `<Button>`'s disabled state keeps pointer events (check 8).** The spec says disabled is `opacity-50` with pointer events off; `<Button>` has only the opacity, so a disabled `<Button>` would still paint its hover fill. **No disabled `<Button>` renders today** (the Work rail's disabled "View all" branch is unreachable while `WORK_VIEW_ALL.href` is set), so adding `disabled:pointer-events-none` to `BASE` would change nothing visible. Left as a finding because it is a behaviour change to a shared component, and the spec now says what the code does. **Recommendation:** add it.

**F5. The modal's advance and Back are still hand-rolled (check 7).** `ADVANCE_CLASS`/`AdvanceInner` and `GHOST_CLASS` in `qualification-modal.tsx` copy `<Button>`, but not exactly: the advance's arrow box is `px-3.5` with an 18px arrow (Button: `px-4`, 20px), and Back is `px-6` (Button: `px-7`). Replacing them with `<Button>` would move those edges by 1 to 2px, so they stayed. **Recommendation:** accept the 1 to 2px and render `<Button>` (it already takes `type`, `disabled` and `onClick`), or give `<Button>` a `modal` size that keeps today's scale.

**F6. Other hand-copied recipes (check 7).** None can be shared without a new component or a new utility, both of which the brief rules out, so they are listed:
- The Work rail's two arrow buttons are `<Button>`'s `secondary` look as a 44px icon box (`work-rail.tsx` `control`). Recommend an `icon` size on `<Button>`.
- The segmented meter is drawn twice (`qualification-modal.tsx`, `work-rail.tsx`: `h-[3px] w-7 rounded-full`, coral and `muted-foreground/70`).
- The mono micro-label (`font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground`) in eight places; the diamond marker (`h-1.5 w-1.5 rotate-45 bg-brand`) in seven; the card surface (`rounded-xl border border-border bg-card p-6 md:p-8` plus the hover lift) in six; the focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`) on about thirty controls.
- The zero-height sticky lockup block is identical in `pricing/page.tsx` and `service-page.tsx`; the `max-w-6xl` measure constant is declared in `service-page.tsx`, `service-process.tsx` and inside `<Container>`.
- The split-the-headline-at-the-accent logic is repeated in nine components (Fix 2 moved only the literals).
- **Recommendation:** `@utility` classes in `globals.css` for the label, the marker, the meter segment and the focus ring (each can be byte-for-byte what the class lists compile to today), a `SectionHeading` `accent` prop for the split, and a `PageLockup` component for the sticky block. One unit, verified the way this one was.

**F7. The type scale has no step for four shipped values (checks 2 and 6):** the micro-label size `0.7rem` (8 uses), the label tracking `0.14em` (12) and the strip's `0.12em` (1), the display leading `1.08` (3) and the figure leading `1.05` (3). They are documented in the UX spec as arbitrary values. **Recommendation:** name them in `globals.css` (`--text-label`, `--tracking-label`, `--leading-display`, `--leading-figure`) and in Taxonomy §5. New tokens are a design-system call, so not made here.

**F8. Eleven px values equal a spacing step only at a 16px root (check 2):** `size-[18px]` ×2 (`size-4.5`), `h-[3px]` ×3 (`h-0.75`), `py-[3px]` (`py-0.75`), `size-[2px]` (`size-0.5`), `gap-[2px]` (`gap-0.5`), `gap-[7px]` (`gap-1.75`), `md:size-[74px]` (`md:size-18.5`), `md:max-w-[560px]` (`md:max-w-140`). At the default font size each step is identical; for a visitor who has raised their browser's base font size, the step would grow with it and the px value does not. That is an accessibility gain, but it is a change in how the page behaves, so not made. **Recommendation:** adopt the steps.

**F9. A second coral mark in the Product Support wireframe (check 5).** The timeline's date scale paints its eighth label `bg-brand/80` (`service-block-visual.tsx`, the date scale above the today line), next to a comment that calls the today line "the one coral (`brand`) element on the plane". §Accent rules say coral appears once per mock at full strength. **Recommendation:** either neutralise it to `bg-accent` like its eleven neighbours, or record the date label and the today line as one emphasis. Build-note 33's other wireframe item, the New Product mock's coral area fill, is still open too.

**F10. Dead code, kept on disk under #13 (check 13).** No route imports `hero-section.tsx`, `fit-section.tsx`, `faq-section.tsx`, `testimonials-section.tsx`, `placeholder.tsx`, `sketch-accent.tsx`, `reveal.tsx` or `src/lib/motion.ts`, and only they use `src/content/faq.ts`, the dormant `copy.ts` exports (`HERO`, `TESTIMONIALS`, `FAQ`, `FIT`, `PROCESS_ACCENTS`), `ACCENT_NAMES` and the dead `accent` data, the `motion` npm dependency, and `SectionHeading`'s `hero` size. Also dead: `<Container>`'s `id` prop (no caller passes one), `LANDING.wordmark` (nothing reads it), and the Work rail's disabled "View all" branch, whose extra `opacity-50` duplicates `<Button>`'s `disabled:opacity-50`. **Recommendation:** delete the dormant set and uninstall `motion` in one unit (the ESLint ignore list goes with it); git keeps it all.

**F11. Unused tokens (check 13):** `card-foreground`, `popover`, `popover-foreground`, `secondary-foreground`, `accent-foreground`, `destructive`, `sidebar`, `chart-3`, `rounded-2xl`, and `shadow-xs` to `shadow-xl` (only `shadow-2xl` is used). All are fin's and documented as defined-but-unused. **Recommendation:** keep them (they cost nothing and keep the set fin-complete), which is what build-note 33 left open; say so in the log to close it.

**F12. Stale comments in `src/content` (check 4), not edited because the brief bars it:** `copy.ts` calls the advance button "the hero's white advance" (the `NAV.featured` doc block) and the Process annotation a "gold-italic aside"; `work.ts` calls the placeholder an "ink placeholder" and says "Real Products" takes "the gold payoff treatment". **Recommendation:** fix them in the next unit allowed to touch content. Comment-only.

**F13. Small inconsistencies:** the arrow nudge transitions `translate` through `transition-[translate]` in four places and through `transition-transform` in `<Button>` (both correct in Tailwind v4; pick one); `bg-gradient-to-t` (two uses) is Tailwind v4's legacy name for `bg-linear-to-t`; the About portrait's path is a literal in `about-section.tsx` while the Work screenshots' paths live in content. **Recommendation:** fold these into the F6 unit.

**Seen in passing, outside the design system:** `scripts/check-banned-terms.mjs` still says "⚠ OWED: a decision-log entry and a §3.4 amendment"; both exist (#20). `docs/07-technical-spec.md`'s tree says only `SITE`, `NAV` and `LANDING` in `copy.ts` are live; `MANIFESTO`, `PROCESS`, `ABOUT`, `FINAL_CTA`, `FOOTER` and `NOT_FOUND` are too.

## The coral inventory (check 5)

Every live `brand` use, against UX spec §Accent rules. All are sanctioned except the one marked.

| Where | What | Rule |
|---|---|---|
| Hero headline | "work in production" (`hero.tsx`) | Payoff phrase, kept at the end (#51) |
| Hero supporting line | Playfair italic | The coral italic |
| Section headlines | Work "Real Products", Why "actually need", Services "actually works", Process "Stay.", About "On purpose", Start "right fit"; `/pricing` "upfront"; agentic hero "stay"; service close "right fit"; service How it works "Stay." | One payoff phrase per headline |
| `SectionHeading` | the `(0n)` index on `/`'s six sections | Section index |
| Capability strip | the diamond separators (`/` and both service ribbons) | Strip diamonds |
| List and label diamonds | Services card index, Work card index, `/pricing` term marker, `/pricing` feature bullets (none render: the arrays are empty), service block index, service deliverables | Every list diamond |
| Process | the open row's number (`group-open:text-brand`); the annotation italic, on `/` and the service routes | Open-row number; the coral italic |
| Links | `ServiceCta` "Build With Us" (home cards and service blocks), Work card "See More", the modal's two email links | Text and CTA links |
| Services card names | coral on hover and focus only | §Interaction vocabulary, card-name links |
| Selection | modal option rows and need tabs: coral fill, `brand-foreground` text and check | Selection fills |
| Progress | modal meter, filled segments; Work rail meter, active bar | Progress fill |
| `/pricing` | the monthly figures | Ongoing monthly figures |
| Service rows | the index on `:target` | `:target` treatment |
| Wireframes | New Product: area line and its gradient fill · Product Completion: active tab and caret · Product Support: the today line · Internal Tool: the read-out point · AI Workflow: the Anthropic hub mark and its `:target` border | One emphasis per wireframe |
| Wireframes | **Product Support: the date scale's eighth label at `bg-brand/80`** | **Outside the rule: a second mark, at alpha (F9)** |
| Page glow | `/pricing` and the service routes, 16% | #35 (see F1) |
| Logo | the lockup's lead (`fill-brand`) | #49 |

Focus rings are `ring`, never coral, everywhere.

## The arbitrary-value list (check 2)

**Replaced (20):** listed under Fix 3.

**Kept, 96 live, by reason:**

| Reason | Count | Values |
|---|---|---|
| No type step exists (F7) | 27 | `text-[0.7rem]` ×8, `tracking-[0.14em]` ×12, `tracking-[0.12em]` ×1, `leading-[1.08]` ×3, `leading-[1.05]` ×3 |
| px value equals a step only at a 16px root (F8) | 11 | `size-[18px]` ×2, `h-[3px]` ×3, `py-[3px]`, `size-[2px]`, `gap-[2px]`, `gap-[7px]`, `md:size-[74px]`, `md:max-w-[560px]` |
| Layout with no scale equivalent | 12 | `w-[82vw]` ×2 and `md:max-h-[85dvh]` (viewport units); `md:grid-cols-[3fr_2fr]` and four `fr` track lists in the wireframes; `lg:col-[4/11]`, `lg:col-[1/4]` (a start and end line in one class); `max-[374px]:hidden` (the documented 375px breakpoint where the bar stops fitting); `-left-[9999px]` (the honeypot, off-screen rather than `sr-only` so assistive tech never meets it) |
| Wireframe coordinates | 32 | `top-[n%]`, `left-[n%]`, `right-[n%]`, `w-[n%]`, `h-[n%]` inside `service-block-visual.tsx`: free placement on a 4/3 plane. The two `w-[50%]` stay with their siblings rather than becoming `w-1/2` in the middle of a percent list |
| No utility exists for the property or variant | 14 | `transition-[translate]` ×4, `transition-[scale,filter]`, `motion-safe:transition-[padding]`; `[gap:var(--gap)]` ×2 (the strip's component-local gap); `group-hover:[animation-play-state:paused]`; `[scrollbar-width:none]`, `[&::-webkit-scrollbar]:hidden`, `[&::-webkit-details-marker]:hidden`; `after:content-['']` (the compact button's hit area); the hatching `bg-[repeating-linear-gradient(…)]` in the Product Support mock |

**Dormant (10), not reviewed for change:** `placeholder.tsx` (`aspect-[4/3]`, `aspect-[3/4]`, the hatching, `tracking-[0.14em]`), `sketch-accent.tsx` (four stroke-dash values), `faq-section.tsx` (`lg:grid-cols-[1fr_2fr]`, the details marker).

## Contrast (check 10), measured

| What | Measured | Minimum | Floor |
|---|---|---|---|
| Text, default state, every route and the nav overlay at four widths | 773 runs on `/`, the 404, the overlay and the modal | 4.63:1 (a mono caption on `secondary` in the failure summary) | 4.5 |
| Text on `/pricing` and the service routes | 798 runs | **4.39 to 4.43:1 where a tile caught the glow (F1)**; otherwise 4.54:1 | 4.5 |
| Text through the glow's centre (targeted) | 32 texts at 360 and 1280 | **4.36:1 (8 under the floor, F1)** | 4.5 |
| Disabled text (the greyed need tab) | 4 | 4.24:1 | Exempt (WCAG 1.4.3, inactive control) |
| Text on hover, every control forced to `:hover` at 360 and 1280 | 152 | 4.96:1 | 4.5 |
| Focus rings, every Tab stop on five routes and the modal at 360 and 1280 | 95 | 10.02:1 (the page lockup link on `/pricing` and the service routes at 360, its ring over the glow) | 3 |
| The need tabs' label ring (re-measured on its own: the sweep read the visually hidden checkbox's clipped native ring at six stops, a measurement artifact) | 2 widths | 10.75:1 | 3 |
| Diamonds · icons · check boxes · meter segments | 154 · 266 · 28 · 21 | 5.13 · 4.96 · 4.63 · 5.63:1 | 3 |
| Hero over every frame (59 frames, four widths): linen headline · coral "work in production" · supporting line · strip labels · CTA | | 5.48 · 5.13 · 5.67 · 5.06 · 7.71:1 | 4.5 |

One sweep reading (1.16:1 on the failure screen's email button at 768) did not reproduce when the element was re-measured on its own: 7.71:1 over every pixel. Treated as a capture-timing artifact.

## The recommended enforcement gate (not built)

**`scripts/check-design-system.mjs`**, the `check-banned-terms.mjs` pattern: plain Node, no dependency, run in CI after `banned-terms` as `npm run design-system`. It reads every `.ts`/`.tsx` under `src/` (string and template literals only, so comments and types never trip it) and fails the build on:

1. **Literals (check 1):** any hex, `rgb(`, `rgba(`, `hsl(`, `oklch(` or `color-mix(` outside `src/app/globals.css`, with one allowlisted file, `src/lib/lead-notify.ts` (email HTML).
2. **Arbitrary values (check 2):** any `[…]` class token not in `scripts/design-system-allowlist.json`, a checked-in list of today's 106 values, each with its reason (the table above). A new arbitrary value fails until someone adds it with a reason; a scale step never needs listing.
3. **Retired names (check 4):** any class token whose colour, font or shadow segment is a retired name (`ink`, `white`, `black`, `gold`, `paper`, `surface`, `lavender`, `rose`, `sage`, `space-grotesk`, `shadow-modal`), any `--ease-premium`, and `rounded-none` outside the one allowlisted modal line. (Tailwind already compiles these to nothing; the gate turns a silent no-op into a failure.)
4. **Hand-rolled buttons (check 7):** any class string outside `button.tsx` that contains both `bg-primary` and `text-primary-foreground`, or all of `bg-secondary`, `border-border` and `hover:bg-accent`. Allowlist today's three copies (the modal's advance and Back, the rail's arrows) by file and constant name, so the list can only shrink.

About 120 lines. Building it is your call.

## Before/after evidence

| Evidence | Result |
|---|---|
| Screenshots: 5 routes × 4 widths as scrolled tiles, plus 12 modal states × 4 widths | **143 of 143 byte-identical**; all 20 page heights identical |
| Capture determinism: the baseline captured twice | 143 of 143 byte-identical |
| Forced states: the hero CTA, two Work cards, the Final CTA, a `/pricing` tier CTA and a service-route CTA, each at rest, hover, focus-visible and hover plus focus, at 360 and 1280, motion on and off (96 captures), `main` against this branch | 93 byte-identical; 3 differ by at most 1/255 on a few hundred gradient pixels behind the control. The same comparison of `main` against itself gives 3 such differences too, so this is the gradients' dither, not a change |
| Prerendered text of every route | Identical to `main`, character for character |
| Prerendered class tokens | Changed only as Fixes 1 and 3 say |
| Compiled CSS | Changed only as Fix 3 says: each swapped class has the same declaration |

Screenshots and the scripts that took them are in the session scratchpad, not the repo (decision-log #10); they can be regenerated from the two commits.

## Checks

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ (the same six routes as `main`) · `npm run banned-terms` ✓ (56 files).

**Not verified here:** real Safari, Firefox, iOS and Android (Chromium only in this environment). Nothing in this unit is engine-specific: the swaps compile to the same CSS in every engine.

## Out of scope, noted

- **The unmerged case-study branches** (`adhoc/case-study-grid`, `adhoc/case-study-template`) predate the rebrand and use the retired tokens (`ink`, `white` alphas, `gold`, squared corners). They will need build-note 33's token map applied before they merge, and this audit's checks run on the result. Not touched.
- The em-dash rule (#19), the held hero items (the 52 to 80px logo window, `min-h-svh`) and the digital card: untouched, as the brief says.
