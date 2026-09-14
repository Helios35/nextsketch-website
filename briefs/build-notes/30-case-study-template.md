# Build Note 30 — The Case Study Template (adhoc "Unit 25")

**Date:** 2026-09-14 · **Branch:** `adhoc/case-study-template` · **Base:** `adhoc/case-study-grid` @ `3e023fe` (stacked; the owner merges both)
**Status:** Committed and pushed; **no PR** (owner policy — Nate opens it). Adhoc, outside the brief set. The brief called this Unit 25; the notes folder had reached 29, so this is **30**.
**Follows:** build-note 29 (the grid and the empty route this fills). **Decisions:** #42–#43 (this unit's rows).
**Reference:** an owner-supplied Framer portfolio case study page (2026-09-14), the "Courto" project on a designer's template site. It contributed **composition only**.

---

## The gap this closes

Unit 29 built the room: `/work/<slug>` existed for every study, chromed and empty, saying the detail was coming. The owner then supplied the reference and lifted the hold with one instruction: clone its layout and animations, adapt every element to this design system and these standards, keep "Visit website" for live projects only (none are), recreate nothing that already exists, fill the content as a starter, and use placeholders for the imagery until the composition is approved.

This unit is the template — one component every case study route renders from its module — plus the block vocabulary the modules declare, DRAFT starter copy for all four studies, and the rule for the live-project link.

## Why a second branch

The brief left it to the builder. The template sits on the grid's types, routes and content list, so it is stacked on `adhoc/case-study-grid` rather than on `main`: each unit keeps its own diff, its own build note and its own decision rows, the owner can merge the grid alone if the template needs another round, or both together, and neither review has to read the other's work. Nothing about the grid branch was amended.

## The reference, measured

Read in the browser at 1440 and 390, with the DOM and computed styles probed rather than eyeballed:

| Reference | What it is |
|---|---|
| Hero | A title row (date, a 120px Manrope title, a product logo) then a two-column row: a "visit website" text link with an up-right arrow **left**; a 20px one-line intro and **three hairline label/value rows** (Industry · Scope of work · Duration) **right** |
| Imagery | One full-width frame under the hero (about 4:3, 1020px tall at 1365 wide), then two-up frames (about 1.09:1) and full-width frames between the text blocks; rounded, borderless; each image **scaled about 1.2× into its clipped frame** |
| Text blocks | A rounded pill label with a sparkle glyph **left** (CHALLENGE · GOAL · SOLUTION); a 32px statement sentence and a 20px `white/70` paragraph **right**, on roughly a 1:2 split |
| Motion | **Ten `data-framer-appear-id` elements**, all in the hero and the project cards: fade-up on load. **Nothing on scroll** — the image frames report no transform at any scroll position (measured at 0, 600 and 2400px). The link's hover is a stacked-label swap inside an `overflow: hidden` box |
| Colour | `rgb(10, 10, 12)` ground — the site's own `surface` value — with three **violet radial glows**, one top-right and two mid-page |
| Close | An "Other projects" pair with a "see all works" link, then site chrome: a FAQ, a contact card, "book a call", a footer |
| Mobile | Title → intro → detail rows → the link, then the frames edge to edge |

## What shipped

| Path | What |
|---|---|
| `src/components/case-study-page.tsx` | **New.** The template: hero, the blocks in declared order, "Other projects", the close |
| `src/components/case-study-image.tsx` | **New.** One framed image: the hairline ink frame at a fixed ratio, the shared `Parallax` inside it, the `Placeholder` fallback |
| `src/components/case-study-link.tsx` | **New.** The off-site text link ("Visit website", "View on Behance") |
| `src/components/close-band.tsx` | **New file, not new code.** The service routes' close, extracted verbatim from `service-page.tsx` |
| `src/components/placeholder.tsx` | `fill` and `alt` props added; nothing else changed |
| `src/components/service-page.tsx` | The inline close replaced by `<CloseBand>`; built HTML of both routes **byte-identical** before and after |
| `src/app/work/[slug]/page.tsx` | The placeholder body replaced by `<CaseStudyPage>`; the route is now as thin as `pricing/page.tsx` |
| `src/lib/types.ts` | `CaseStudy` grows `intro`, `liveHref`, `need`, `meta`, `hero`, `blocks`; new `CaseStudyBlock`, `CaseStudyImage`, `CaseStudyImageRatio`, `CaseStudyMeta` |
| `src/content/case-studies/*.ts` | Every module carries its intro, three detail rows, a hero slot and seven blocks; `index.ts` gains `otherCaseStudies`, `toWorkItem` and `WORK_ITEMS` (moved here from `work.ts`, see the review) |
| `src/content/work.ts` | `CASE_STUDY_PAGE` reshaped: the "coming" line is gone; `visit`, `metaHeading`, `imagePending`, `othersEyebrow`, `othersHeading` added; no longer imports the studies |
| `src/components/work-section.tsx` | One import line: `WORK_ITEMS` now comes from `@/content/case-studies`. Rendered markup unchanged |
| `src/app/work/page.tsx` | The grid is handed `WORK_ITEMS`, the card projection, rather than the studies |
| `docs/decision-log.md` | Rows **#42–#43**, the preamble, four new open items |
| `docs/03`, `04`, `06`, `07` | The sitemap, the template's spec, the block vocabulary, the project tree |

**Identifiers introduced** (canonical here): `CaseStudyPage` · `OtherCaseStudy` · `CaseStudyImage` (component and type) · `CaseStudyLink` · `CloseBand` · `CaseStudyBlock` · `CaseStudyImageRatio` · `CaseStudyMeta` · `CaseStudy.intro` / `liveHref` / `need` / `meta` / `hero` / `blocks` · `otherCaseStudies` · `toWorkItem` · `WORK_ITEMS` (relocated) · `Placeholder` `fill` / `alt` · `CASE_STUDY_PAGE.visit` / `metaHeading` / `imagePending` / `othersEyebrow` / `othersHeading`.

Untouched: the home page's sections apart from the one import line above (the band's rendered markup is unchanged), `scroll-video.tsx`, `video-scrub.ts`, the modal, `site-nav.tsx`, `site-footer.tsx`, `brand-wordmark.tsx`, `work-grid.tsx`, `globals.css` (no keyframe added), `check-banned-terms.mjs`. **No dependency added.**

## The template, block by block, and what was refused

The rule for every element was the one PR #27 and unit 26 set: **the reference decides where things go, this system decides what they are.**

**Hero.** The same chrome as every route without the footage (glow, the zero-height sticky lockup, no `ScrollVideo`, no text shadow). A mono "All work" route back, the `Case study` eyebrow, then the study's name at **`SectionHeading`'s `hero` scale** — 96px at `lg`, the top-of-page scale the spec reserves for a top-of-page promise, used here because the name *is* the page (the reference's 120px title is the same call; the product logo beneath it is not reproduced — nothing owner-supplied to show, Rule 4.3). Below, the reference's two-column row on `lg:grid-cols-[2fr_3fr]`: the off-site links left, the intro and a `<dl>` of three hairline rows right, on the strip's `white/10` ladder with the mono micro-label as the term and full-white as the value. On a phone the columns swap by `order-*` so the links come last (the reference's own mobile order) while the DOM keeps the desktop reading order. Entrance: load-time `rise-in` at 0 / 120 / 200 / 280ms with inline delays. The hero image is the first frame and enters on scroll, since it is below the fold on arrival.

**The links.** `<CaseStudyLink>` is the §Interaction-vocabulary gold underlined text link with the shared `ArrowIcon` turned `-rotate-45` to point out (the rail turns the same icon `rotate-180` for "previous"); hover is the colour shift to white and the arrow nudge at 150ms. The reference's stacked-label swap is refused: it is a Framer-ism, and the system already has a hover for a text link. **"Visit website" renders only when a study declares `liveHref`** (#43). None does. The component carries no notion of "live"; the page gates on the field, so the rule lives in one place. "View on Behance" (`sourceHref`) is the same component in the same column, and stays where #39 put it.

**The frames** (`case-study-image.tsx`). The About portrait's hairline ink frame, squared, at a fixed ratio so the real image crops to it and swaps in with zero shift: `16/9` full-width (the card's screenshot frame, so one asset serves the band, the grid and the page) and `4/3` in pairs (the service mocks' box), `1/1` available per slot. The reference's 4:3 full-width frame was measured and not adopted: at 1920 it would stand 1344px tall. No grade and no scrim — the cards grade because four unrelated palettes had to share a rail; these hold imagery chosen for this page, and the reference shows its images clean.

**The drift — a judgment call, flagged, and rebuilt once.** The reference's images do not move. This system's one treatment for a framed image on a scrolling page is the About portrait's whisper `<Parallax>`, and the frames take exactly that construction: **reveal, then one `<Parallax>` around the whole band, then the frame** — the hero frame, a full-width frame, or a pair's grid, so a pair drifts as one and every band carries one instance (§Motion's "at most one per section"). Reduced motion never sees the transform and no-JS renders the frame at rest, both the primitive's own parity. **It is one wrapper per band to delete** if the owner wants the reference's stillness.

The first cut got this wrong and the review caught it. The wrapper sat *inside* the frame, 96px taller than it, so the drift's ±48px cap could never expose the fill — and `next/image fill` with `object-cover` then scaled every real image to cover the wrapper, not the frame. The over-scale is `(h + 96) / h`, worst where frames are small: a 16/9 hero frame on a 375px phone is 184px tall, so the image would have been scaled 1.52× and lost a third of its width off the sides; a 4/3 pair frame at 768 would have lost 27%. Placeholders hid it (their text just drifted); the first real screenshot would not have. Moving the parallax outside the frame is the About portrait's own order, costs nothing, and the overhang maths disappears with it. Measured after the change on the hero band: the frame's parent carries the transform and the frame keeps its exact ratio at every width.

**The placeholders.** A slot with no `src` renders `<Placeholder surface="ink" fill alt>` inside the frame, so motion is signed off on boxes. `Placeholder` gained two props rather than a sibling: `fill` (fill a positioned parent that carries the ratio, the border and the fill — in this mode the placeholder paints no `white/[0.03]` of its own, or the two layers composite to the hover stop and a pending frame reads lighter than the same frame with its image in, which the review also caught) and `alt` (announce as `role="img"` with the real image's description, so the accessibility pass is not deferred to the day the file lands). Frames are named `placeholder-work-01` … `07` in page order, the hero being `01`; the numbering is threaded through the blocks so a pair takes two consecutive numbers. Verified: seven `role="img"` frames per study, each carrying its alt.

**The text blocks.** `lg:grid-cols-[1fr_2fr]`: the mono micro-label behind the gold diamond as the block's `<h2>` left (the reference's pill and sparkle glyph refused — the marker is settled vocabulary), the statement at the panel scale and the paragraphs at the reading step right, each on `ScrollReveal` at 0 / 120 / 200 + i·80ms. The label is the heading and the statement the lede: "The challenge" is what the block is about. Image blocks sit `gap-4` apart — the grid's gap — and a text block brings its own `py-20 lg:py-28`, so the page reads as the reference does: text, imagery close together, air, text.

**Other projects.** `otherCaseStudies(slug)` — the next two studies in display order, wrapping, never the study itself, computed content-side so the template knows nothing about the list (with one study the band hides; with two it shows one). Each is `<WorkCard variant="tile">`, numbered as it is on the band and the grid, under a `SectionHeading` with **the band's own `WORK_VIEW_ALL` control** beside it as a `ghost` divided-arrow `<Button>`, so label and destination cannot drift from the rail's trailing card. Nothing new was drawn.

**The close.** The reference ends on a FAQ, a contact card and "book a call". FAQ is retired (#13, #30), the phrase is a Rule 3.2 banned term, and this site has one conversion path. The page ends on `<CloseBand>` with the study's `need` preselected — the card-to-modal seam the brief required, `FINAL_CTA`'s heading and "Start a Conversation", no new phrase. The close was inline in `service-page.tsx`; it is now `close-band.tsx`, **extracted verbatim** (id, classes, reveal rhythm, accent), with `headingId`, `need`, `className` and `contentClassName` as its only knobs — the two things the service page already parameterised in place plus the padding the case study needs above it. The service routes' built HTML was diffed before and after with the chunk hashes excluded: **identical**.

**Colour.** The reference's three violet glows are not reproduced. Gold is the only accent (#14), the one page-background glow is #35's, and #35 permits no second light. The ground is already the same `#0a0a0c` the reference uses — `surface` — on the layout's `ink`.

**Layout.** The page's own gutters, full-bleed like `/pricing` and `/work`, not the service routes' `max-w-6xl` measure: the images are the point and the archive and the study share one width.

## The content shape (#42)

`CaseStudy` grows: `intro` (optional; falls back to `summary`), `liveHref` (optional; #43), `need` (the `ProjectType` the close preselects), `meta` (label/value rows), `hero` (the first frame) and `blocks`. `CaseStudyBlock` is a union of `text`, `image` and `pair`; a study that needs a block that does not exist is a reason to add a member and a branch in `Block`, never to fork the page. Block labels are content strings, not an enum, so a study may name its blocks differently without a type change. **Adding a case study is a module and its images** — verified by reading the route and the index: nothing in `src/app/` or `src/components/` names a study.

## The starter copy

Written at the owner's direction on the reference's shape: an intro, three detail rows, and "The challenge" · "The goal" · "What we built" — each a statement of 18–28 words and a paragraph of 25–45. Drafted by a four-writer fan-out, each draft judged by three skeptical lenses (rules, grounding, voice) and revised twice, then finished by hand where the judges were still unhappy: as-built claims reframed as intent, repetition across blocks cut, and the number-word objections overruled (the rules ban invented figures, not the word "two").

What binds it, and what it does not do:

- **Grounded in one screenshot and one summary per study.** Nothing else was known, so nothing else is asserted. No client, no product name from inside a screenshot (Genioo and Caddy stay out, the build-note 20 posture), no number, no result, no quote. "What we built" describes screens the screenshot shows; "The challenge" and "The goal" are written as intent.
- **The detail rows are three descriptive labels the builder chose** — Industry, Scope ("Design and build", the owner's own claim in `WORK_INTRO`), Platform. The reference's third row is a duration; **no duration, date or client was invented to fill one**, and the rows are content, so the owner adds or removes freely.
- **Every string is DRAFT**, marked so in each module, and lives in the module and nowhere else.
- **Every alt describes what the real image should show**, keyed to the study, so the owner supplies to a spec rather than a blank.

## Deviations — flag at review, not silently resolved

1. **The whisper drift is not in the reference.** Above; one wrapper to delete.
2. **The title is at `hero` scale.** §Typography reserves it for a top-of-page promise; the name is the page. `display` if it reads too large — a one-prop change.
3. **Full-width frames are `16/9`, not the reference's ~4:3**, so the card's asset serves the page and a 1920 frame stays a screen tall. `4/3` is one ratio value away, per slot or as the block default.
4. **The page is full-bleed on the gutters, not on the service routes' measure.** Reasoned above.
5. **`Placeholder` was extended, not wrapped.** Two props on a dormant-era component rather than a case-study-specific placeholder; the alternative was a second placeholder that looked like the first.
6. **The unit-29 "coming" line is gone** from `CASE_STUDY_PAGE`; the template has no use for it. Recoverable from git.
7. **"Other projects" carries "View all", so "All work" appears once**, at the top, rather than twice on one page.
8. **`work-section.tsx` changed by one import line.** The unit-25 brief said not to touch the home page's sections. The review found that this unit's own content change had put every study's page copy into the home page's payload and the client bundle (below), and the fix is where the list is exported from; the band's rendered markup is unchanged and the payload is smaller than it was after unit 29. Flagged rather than left.

## What the review found

A six-lens adversarial pass over the implementation (design system, accessibility and no-JS, motion, Next 16 and React, project standards and the brief, content rules), every finding then put to three independent skeptics told to refute it. Fifteen findings raised; five refuted, two contested, eight confirmed. The confirmed ones and what changed:

| Finding | Severity | Fix |
|---|---|---|
| The parallax wrapper inside the frame over-cropped every real image (`object-cover` covers the wrapper, not the frame): a third of a phone-width screenshot lost | **high** | The About portrait's construction — `<Parallax>` outside the frame, one per band; the frame is filled exactly. Described above |
| A pending frame painted `white/[0.03]` twice (the frame and the fill-mode placeholder), compositing to the hover stop | low | In `fill` mode the placeholder paints no fill; the frame is the surface |
| `CASE_STUDY_PAGE.metaHeading` was declared as the detail list's accessible name and never rendered — dead copy in `src/content` and an unnamed list (raised by four lenses) | medium | Rendered as the `sr-only` `<h2>` the `/work` grid and the pricing tiers use for a list with no visible heading |
| Every route shipped all four studies' long-form copy to the client twice: once in the RSC payload (the whole `CaseStudy` object passed to the client `<WorkCard>`), once in a client chunk (`work-rail.tsx` reads `work.ts`, which imported the studies; the index's slug-collision throw is a side effect, so the bundler could not drop them). This was true of the home page and the grid as well as the case study routes | medium | `toWorkItem` projects a study to the card's fields; `WORK_ITEMS` (that projection) moved beside the list in `case-studies/index.ts`; `work.ts` imports nothing from the studies; the band, the grid and "Other projects" all hand cards the projection. Verified after: the built home page and client chunks contain none of the block copy |

The two contested findings were the number of `Parallax` instances (seven per route against §Motion's "at most one per section") and the rem-versus-pixel overhang inside the frame; both dissolved into the first fix — one instance per band, no overhang. The five refuted findings were matters the docs already recorded as deliberate calls.

## Found in the sweep, not fixed

- **Running `next build` while the dev server is up briefly 404s dev chunks** in the pane's console. Tooling, not app code; a fresh load is clean apart from the pre-existing Apollo 400s (build-note 19).
- **`WORK_INTRO` still says "Next Sketch"** on `/work`; unchanged, open since build-note 20.

## Recommendations (not built)

- **A `year` or `date` row, owner-supplied.** The reference leads its hero with a date; the meta rows can carry one the moment the owner states it, with no code change.
- **Real imagery, then the ratios.** Pick `16/9` or `4/3` per slot against the actual assets; the type already allows it.

## Addendum — the Platform row becomes badges (owner direction, same day; #44)

The owner selected the Platform row on the rendered page and asked for its value as pills or badges from a fixed set — Web App, SaaS, Mobile App, Device, Agentic Platform, Internal Tool — one or more per study, on the design system, touching nothing else.

What shipped: a detail row may now declare `badges` instead of `value` (`CaseStudyMeta` is the union; `PlatformBadge` is the six keys, kebab-case; `PLATFORM_BADGES` in `src/content/work.ts` holds the six labels, total over the type). The template renders a badge row's `<dd>` as a right-aligned, wrapping list of tags; every other row is unchanged. **The badge is squared.** §Interaction vocabulary ends "no pills", so the owner's "pill" is this system's version: the hairline ink surface (`white/15` on `white/[0.03]`, the frame and input surface) at the mono micro-label's face with the selection tab's `white/90` text, `px-2.5 py-1`, no rounding, no fill colour, no icon. Inline in `case-study-page.tsx` as `BADGE_CLASS` rather than a component, since it has one call site; the day a tile or another route wants one is the day it becomes `badge.tsx`.

Assigned: Mascot — Device, Mobile App · SaaS Platform — Web App, SaaS · Agentic Platform — Agentic Platform · Parcell — Mobile App. The earlier plain values ("Device and mobile app", "Web", "Desktop", "Mobile") are gone. Verified in the browser at 1440 and 390: `border-radius: 0px`, 1px hairline, 27px tall, right-aligned, wrapping under the label at phone width with no overflow. Typecheck, lint, build and the banned-terms gate green.

## Verification

`lint`, `typecheck`, `build`, `banned-terms` green; the gate scanned 105 files with no change to the script. Build output unchanged in shape: `/work/[slug]` `●` SSG with the four slugs.

In-browser, dev server, Chromium:

- **`/work/mascot` at 1440 × 900** — the hero (96px name, links left, intro and three rows right), seven `role="img"` frames with their alts, the three text blocks, "Other projects" with tiles 02 and 03 and "View all", the close with "Start a Conversation". No horizontal overflow.
- **Drift** — the band wrapper's transform read `-19 / +11 / +41px` at scrollY 400 / 900 / 1400 on the hero band, never past the ±48 cap; the frame inside keeps its exact ratio and its image is never scaled past it.
- **Payload** — after the review fix, the built home page, `/work` and every case study page carry no block copy in their RSC payload beyond the page's own study, and no client chunk contains the studies' text.
- **`/work/parcell` at 390 × 844** — title, intro, rows, then the link; frames stacked; no overflow (`scrollWidth === innerWidth`).
- **Service routes** — built HTML byte-identical before and after the close extraction (tokenised diff, chunk hashes excluded, exit 0 on both).
- **Built case study HTML** — no em dash in any rendered string; only the layout's embedded 404 slot carries one (pre-existing, open item).
- **Console** — clean on a fresh load apart from the pre-existing Apollo 400s.
- `git diff adhoc/case-study-grid --stat` — the files in the table above and nothing else.

## Addendum — Mascot's imagery lands (owner direction, same day)

The owner supplied six renders for Mascot and set the order's one fixed point: the three handhelds floating is the top image. They arrived first as inline attachments (not writable from the session, and not among the Behance modules, which are the process and research pages), then as a folder on disk. **Two rules from the owner shaped the wiring:** the hero is the floating devices, and **the image adjusts to the container, never the container to the image** — so a first pass that had picked a frame ratio per render (a `4/3` hero, `1/1` pairs) was reverted before it shipped, and every slot sits in the template's default frame: `16/9` for the hero and the closing composite, `4/3` for the two pairs, `object-cover` centring each render.

The files: `public/work/mascot/mascot-01.png` through `mascot-06` in page order, renamed kebab-case from the owner's folder (Taxonomy §8) and otherwise **shipped as supplied** (the build-note 20 posture): five PNGs and one JPEG, 6.5 MB together, the largest 2.3 MB at 2216 × 2229. The order: 01 the three floating handhelds · 02 the handheld showing a parent's call beside the phone's map · 03 the handheld beside the phone's Templates and Learn cards · 04 the labelled front view · 05 the three app screens on purple · 06 the side and controls composite. The module declares six slots, one fewer image block than the template's default rhythm, each with alt text describing its render.

What the fixed frames crop, for the owner's eye: the `16/9` hero trims the top of the green handheld and the bottom of the blue one from the floating render (a 1.18:1 composition); the `4/3` pairs trim the top and bottom of the four near-square renders, whose subjects are centred, so nothing of consequence is lost; the closing composite (1.48:1) loses a little of the side view's lower edge. Verified in the browser at the pane's width and at 390: all six load through `next/image` (the two larger sources included), frames at 1.778 / 1.333 × 4 / 1.778, no overflow, no placeholder left on the route. `next/image` serves each at the width its slot needs, so the source sizes cost the repo, not the visitor.

## Addendum — Agentic Platform's imagery lands, and two rules with it (same day)

The owner pointed at an Engen folder for the Agentic Platform study (Engen is the product; the study keeps its published title, build-note 20) and set both ends: the laptop is the hero and "UI Intro" is the last image. **A first pass got two things wrong and was reverted before it stayed up:** the first folder path resolved to a single toolbar crop, so the builder substituted renders from another Engen folder, and dropped one of the template's image blocks to fit six files. The owner rejected both, and the rules are now on file: **the owner's folder is the whole set, nothing outside it is used; the template's block layout does not change per study; the image adjusts to the frame, never the frame to the image.**

What shipped, from the owner's `Next Sketch Branding/assets/Engen Case Study/` folder, six files in file order: `agentic-platform-01.png` `Hero.png`, the laptop (6144 × 3072, **4.7 MB**, the heaviest asset in the repo) · `02` `UI Collapsed` and `03` `UI Expanded 1` as the first pair · `04` `UI Expanded 2` and `05` `UI Expanded 6` as the second pair · `06` `UI Intro`, the closer (2400 × 1922). **The middle full-width slot is the placeholder**: the template's rhythm has seven frames and the folder holds six, and the layout does not move, so the seventh waits for a seventh file or the owner's word on which slot goes. Every frame keeps the template's ratio: the hero and the two workspace pairs are 2:1 shots, so the `16/9` hero loses a sliver of width and the `4/3` pairs lose the outer sixth on each side (the feature tree's left edge and the Work Bench's right edge); the closer is 1.25:1, so the `16/9` frame keeps its middle 70%, the workspace and the UI-kit title. 8.7 MB together, shipped as supplied, renamed kebab-case (Taxonomy §8).

**A layout bug the imagery surfaced, fixed the same day.** The owner reported the full-width frame overlapping the pair above it on every study but Mascot. Measured on Parcell: the full-width band rode up over the pair by 15px at rest. Cause: each image band had its own `<Parallax>`, each drift is measured from its own band's centre, so two bands `gap-4` apart moved by different amounts and 16px could not absorb the difference; Mascot escaped only because no image band there sits directly under another. Fix: consecutive image blocks are grouped into a run and the run rides one `<Parallax>` (`runs` in `case-study-page.tsx`), so neighbours move together; a text block, with 80px of its own padding, ends a run and is beyond the 48px cap. Measured after: the gap holds at 16px at rest at every scroll position on Parcell and Agentic Platform. Still one instance per band in §Motion's sense, since a run is one band of imagery.

**Still on placeholders:** SaaS Platform and Parcell in full, and the Agentic Platform's seventh frame. Mascot ships six renders in six slots, one image block fewer than the template's rhythm; under the layout rule that wants the seventh slot back as a placeholder too, which is the owner's call and was not changed here.
