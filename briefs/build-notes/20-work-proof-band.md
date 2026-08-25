# Build Note 20 — Work Proof Band (adhoc conversion sections)

**Date:** 2026-08-24 · **Branch:** `adhoc/conversion-sections` · **PR:** #27 (merged `0bdd400`, diffed from `e8bba5d`)
**Status:** Merged to `main`. Reconstructed as-built from the merged diff during the doc-reconciliation unit (build-note 21) — the unit itself shipped without its note, which is the gap 21 closes.

## The gap this closes

Visitors were reaching the site and leaving. The owner's read: nothing on the page demonstrated **proof of work or authority**. The site argued its case — manifesto, services, process — but never showed a product. This adds the evidence, first, before the argument.

Adhoc, outside the brief set. Pricing is the next section in the same effort and is **not** in this PR.

## What shipped

- **New:** `src/components/work-rail.tsx` (client) — the card rail, its controls and the per-card grading mask. `src/content/work.ts` — copy and the item inventory. `public/work/work-0{1..4}.{webp,png}` — four owner-supplied screenshots.
- **Rewritten:** `src/components/work-section.tsx` — the paper-era placeholder grid replaced wholesale by the dark band.
- **Changed:** `src/components/scroll-video.tsx` (backdrop re-anchor), `src/lib/types.ts` (`WorkItem`), `src/app/page.tsx` (mount), `src/content/copy.ts` + `services.ts` (copy edits), `scripts/check-banned-terms.mjs` (§3.4 exemption), and a one-line index bump in the four other section components.
- **Decisions:** `docs/decision-log.md` #16–#17 landed in the PR; #18–#21 were owed and land in build-note 21's unit.

22 files, +1090 / −123.

## The section

`#work` sits **directly below the hero** and takes index **(01)**, renumbering Manifesto→(02), Services→(03), Process→(04), About→(05), Final CTA→(06). It leads `NAV.items`.

It is the **one opaque section on the page** — flat `bg-ink` matching the footer, owner-directed. Every other section is a transparent band over the scroll-synced footage (Unit 02 rule); this one is not, because the screenshots are its whole job and moving footage competed with them. Two consequences were handled rather than inherited:

1. **No text shadow on its heading.** The other sections carry the licensed over-imagery shadow because they sit on footage. This one sits on plain `ink`, where §Typography bans it.
2. **The backdrop keeps its cadence** — see below.

## The rail

Composition is adapted from an owner-supplied shadcn "gallery4" reference. The reference contributed **layout only**: heading row with advance controls pinned right, a card rail bleeding off the right gutter, pagination beneath. Its own vocabulary was refused wholesale:

- **Zero new dependencies.** The reference needs `embla-carousel-react`, `lucide-react`, `@radix-ui/react-slot` and `class-variance-authority`. This project ships **no** UI libraries. The rail is native CSS scroll-snap — which also gives the reference's mobile `dragFree` momentum for free — and the icon is the shared `ArrowIcon` (§Interaction vocabulary: *"Icons are inline SVG, never `lucide-react`"*). JS only *enhances*; it never drives the scroll.
- **Squared, not `rounded-xl`.** `rounded-none` is the shape of the brand.
- **A segmented gold meter, not dots.** §Interaction vocabulary specifies the pagination affordance literally — `h-[3px] w-7` bars, `gap-1.5`, filled `bg-gold`, rest `bg-white/15` — and ends *"No dots."* Each bar is wrapped in a 44px target.
- **Cards are glass panels, not image-overlay tiles.** The reference overlays title and body on the image behind a gradient. These are screenshots of real products and the screenshot *is* the proof, so it keeps its own 16/9 frame and the copy sits below it on the Services-card surface — so the two card grids on the page read as one family.

**Trailing card.** A fifth slide closes the rail with a single **View all** control instead of a screenshot. Ghost, not the white divided-arrow advance: that surface is the page's conversion affordance (hero CTA, `#start`), and browsing an archive is the de-emphasized action. It is a real snap position, so the meter derives from a `slides` list built from the same items the track renders — a bar count short of the card count would leave the final position with nothing lit, since `sync` pins `active` to the last target at the scroll end.

**Parity.** The rail is a plain `overflow-x` scroller, so it scrolls natively with **no JS at all** and every card is reachable. Controls mount only once hydrated (their row keeps a reserved height, so nothing shifts) — which also means no dead buttons in the no-JS HTML. Programmatic scrolling drops to `behavior: "auto"` under reduced motion, matching the `globals.css` gate on smooth anchor scrolling.

## ScrollVideo re-anchor — the load-bearing change

An opaque band would otherwise spend its own height of footage behind itself, unseen. `ScrollVideo` now maps from the bottom of the **hero-plus-contiguous-opaque region** (`[data-backdrop-hidden]`) rather than the hero alone.

`range` becomes `scrollHeight − opaqueBottom`, so inserting a band of height H grows **both** by H and the frames-per-pixel cadence is unchanged **to the pixel**.

**Measured, not asserted** — in-browser after every change that altered page height:

| Check | Result |
|---|---|
| `range` with the Work band | 5143px |
| `range` without it (computed) | 5143px |
| Clip 1 at the moment the backdrop becomes visible | `t = 0` |
| Clip 3 at page bottom | `8.040 / 8.042` |

A first attempt froze progress *across* the band instead. That is wrong, and the review caught it: the hero's sticky stage already conceals the backdrop for a full viewport before the band's own top arrives, so a band-only skip advances the sequence by `innerHeight` of unseen footage. The region-based anchor is what makes the boundary frames exact.

`heroRelease` is kept as a separate variable because the **preload gate** anchors to it. Moving that gate to the new `start` would spend its whole viewport of lead inside the opaque band — the fastest-scrolled stretch of the page — instead of in the runway, where the orbit is scrubbing and visitors move slowly.

Measurement uses **offset geometry, not `getBoundingClientRect()`**: the page writes scroll-driven transforms (`Parallax`, `rise-in`) and a rect read folds them in.

**Contract for any future marked section:** directly below the hero, padding-spaced (a vertical margin counts toward `scrollHeight` but not `offsetHeight` and would drift the range by exactly that margin), and no transform on its root. **A non-contiguous opaque section needs a new approach, not this attribute.**

## The grading mask

The four screenshots arrive in unrelated palettes and read as loose stickers on the ink band. A single overlay cannot fix that — it *multiplies*, so it drags every image down together and leaves their ratio intact.

Tone is therefore per-image and set from **measured** luminance over the unscrimmed top of each frame, not eyeballed. The instructive case: the CAD tool *looks* dark but is **bimodal** — a near-black app inside a light grey canvas — so treating it as "dark" (a lift) blew the canvas out and made it the second-brightest card in the rail. It takes the base grade like everything else, and only the near-white dashboard needs the stronger hold-back.

| Tone | Treatment |
|---|---|
| `light` (base) | `saturate .85 · contrast .95 · brightness .95` + `bg-ink/45` |
| `bright` | `saturate .85 · contrast .92 · brightness .86` + `bg-ink/50` |

Result: all four inside a **0.09 luminance band against 0.52 raw**, no blown highlights. The bottom scrim is confined to the lower two thirds so each image dissolves into the card instead of ending on a hard line above the copy; a full-height scrim compounded with the flat layer into a muddy middle. **Hover clears the mask entirely** — full colour, no grade — so the work itself is the reward for engaging.

A deliberate deviation: the elevated fill is solid `#0a0a0c` rather than the spec's `#0a0a0c/95 backdrop-blur-xl`. That recipe exists so a card reads over the moving video; this section is the one opaque band, so there is nothing behind the card to blur. Surface colour is unchanged, so it still matches the Services cards optically.

`focal` and `tone` are per-item because a single global setting was measurably wrong for at least one image in each case.

## Banned-terms exemption (§3.4)

The owner-authored About copy contains **"I started in industrial design"**, which §3.4's retired-brand sweep bans by name. The copy **failed the build as supplied**. The ban exists to stop the retired *service line* reappearing as a current offer; biography is the opposite use.

Rather than reword owner copy or delete the term from the ban list, `scripts/check-banned-terms.mjs` gained an `ALLOWED` list. **The first version was wrong and adversarial review broke it:** it stripped the phrase globally, so a services card reading *"We sell what I started in industrial design"* passed clean — precisely the retired service claim the rule guards.

The shipped form is scoped and asserted:

- **Scoped strip** — on the source surface, an entry only applies to the one file it is ratified for. Built HTML/RSC is stripped unconditionally (rendered copy cannot be attributed back to a source file), which is safe *because* the source check above it is not.
- **Ratification pass** — the phrase must appear in its declared source exactly `count` times. Fewer means the copy moved and the entry is a stale bypass; more means an unratified second use. Both fail.
- **Markup-tolerant gaps** — an inline span or React's `<!-- -->` adjacent-text separator cannot make the exemption misfire on the raw surface.
- **Diagnostic on failure** — a hit on a sanctioned term prints why, so a misfire never reads as new banned copy and gets "fixed" by rewording the owner.

Verified against a four-case matrix: the About paragraph passes; the same clause in another content file fails; rewording the paragraph fails loudly; the bare term anywhere fails.

## Content that landed

Owner-supplied 2026-08-24: four projects with names, one-line summaries, live Behance links, and 16/9 screenshots; plus the View all destination.

- Card titles use each project's **published Behance title**, not the product name inside the screenshot (Genioo, Caddy) — the published title is what the owner released the work under, and asserting a client's product name would be a claim the source page doesn't make.
- The linked pages carry **no written descriptions at all** (tags and imagery only), so summaries describe what each product *is* and claim nothing about how it performed (Rule 4.3).
- Title and summary are clamped to one and two lines. The clamps are a guarantee, not the mechanism — copy is written to fit at the narrowest card width, verified at 375px, where one summary wanted a third line and was shortened until it didn't.
- Screenshots ship in the formats supplied (three `webp`, one `png` at the time; `png` later replaced) rather than re-encoded.

## Copy changes bundled in this PR

Recorded here because they shipped in the same branch; their decision rows are #18–#21.

- **Hero headline** → "From idea to production. Gain a real partner." `accentWords` moved "stay" → "partner" in the same edit; the words are matched against the headline, so leaving it would have silently dropped the hero to one gold word.
- **Services headline** → "Products and agentic systems, built for how your business actually works." Plus the em dash inside the Agentic Systems card description became a comma.
- **About body** → owner-authored biography, four paragraphs. A fifth closing paragraph was added and then removed at the owner's direction.
- **Work supporting line** → "Every screen is built and designed by Next Sketch", replacing a DRAFT line that asserted every screen was live software still running — a claim two of the four linked case studies would not support.

## Deviations — flag at review, not silently resolved

1. **Rule 3.4 is amended by this PR's gate change** but the rule text was not updated in the PR. Closed by build-note 21's unit (decision #20).
2. **`WORK_INTRO` renders the brand as "Next Sketch"** (two words) — the owner's exact wording, diverging from Taxonomy §8, where "NextSketch" is binding for copy and the spaced form is the legal name. Flagged in the constant; **still an open owner call.**
3. **Decision rows #18–#21 were owed and not written** in this PR. Closed by build-note 21's unit.
4. **`build-note 20` was cited by two decision rows before it existed.** This file closes that.

## Recommendations (not built)

- **An em-dash scan for `check-banned-terms.mjs`.** Decision #19 makes "no em dashes in rendered copy" a standing rule, but nothing enforces it — the next copy edit can reintroduce one silently. A scan over `src/content/*.ts` would catch it. It is a script change and a separate owner call, deliberately not bundled.
- **Per-item `tone` will not scale forever.** Two buckets cover four screenshots. A genuinely near-black screenshot would need a third variant; it was deliberately not added speculatively, since the one that looked like a candidate turned out to be bimodal.

## Verification

`lint`, `typecheck`, `build` and `banned-terms` green on every commit. In-browser: rail scroll, arrow enable/disable, meter tracking and end-pinning, keyboard reachability of the scroller, SSR output (controls absent without JS), reduced-motion parity, mobile at 375px, and the backdrop frame contract re-measured after every change that altered page height.
