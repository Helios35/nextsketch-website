# Build Note 30 — The Case Study Template, Take Two: Mascot (adhoc "Unit 25")

**Date:** 2026-09-18 · **Branch:** `adhoc/case-study-template` (stacked on `adhoc/case-study-grid` @ `3e023fe`) · **Base:** `main` @ `24676cf`
**Status:** Committed and pushed; **no PR** (owner policy — Nate opens it, after the grid's). Adhoc, outside the brief set.
**Follows:** build-note 29 (the grid). **Decisions:** #42 (the first template rejected and archived, recorded before this note), **#43–#44** (this unit's rows).
**Supersedes:** the first template, seven commits of 2026-09-14 on `archive/case-study-template-v1`, rejected by the owner outright ("I absolutely dont like where the case study pages as landed"). Nothing of it was carried over by commit; two files and a vocabulary were pulled back by hand and are named below.

---

## What the owner asked for

Two direction images and a folder of renders, all on 2026-09-18:

- **The inspiration**, `case study_Mascot inspiration template.png`: a Volvo Cars App case study page (light theme). A header row, a huge centred headline with an inline UI chip, two phone mocks floating over the top edge of a raised white card, the card (phones left, a concept heading with a checklist and two big numerals right, then a day-by-day timeline), a numbered section node, and a dashboard section with leader-line annotations, callout cards and corner status labels.
- **His own adaptation**, `Case Study Mascot example.png`: the same bones on the site's ink with the gold glow. "Mascot" over "AI Application" with two chips and a gold "view on behance" link; the headline "Mascot Your Kid Friendly AI Driven Companion"; two handheld renders sinking behind a white card with the 3D mascot grown large and stepping out over the card's edge; the card holding the device-and-phone render and "What did we do?" with a note to fill in the context; then, back on ink, a heading and subline over the hardware render with eight baked-in labels; "We need some closing text here"; the device-beside-parent-app render; "Other projects tiles go below here".
- **The words:** "Use the inspiration example and the example I created as direction. Make adjustments as you see fit. Same rules apply: our design system should be used, our component tokens, systems and messaging. Create the mascot case study ONLY. NOTHING else should be touched for now."

The posture is the one PR #27, unit 26 and unit 24 took with every supplied reference: **his composition, the system's style.**

## What shipped

`/work/mascot` is a full page. `/work/saas-platform`, `/work/agentic-platform` and `/work/parcell` are exactly what they were: the #39 placeholder, byte for byte. `/`, `/work`, `/pricing`, the 404 and the two service routes render the same markup they did; their script tags differ because the client chunk graph changed (§Verification).

Top to bottom, on the `/pricing` chrome (glow, nav, the zero-height sticky wordmark wrapper, footer), with every band full-width on the gutter ladder and its content on the service routes' `max-w-6xl` measure:

1. **Header row.** The mono "All work" route back; the "Case study" eyebrow; the study's name at the panel scale over the ratified summary; a chip row (the service, then the platform badges, #44); the off-site links pinned right from `sm:`. His "Product Development" chip is New Product in Taxonomy §1's vocabulary; his "AI Application" chip is not in the badge set and is not rendered (§Judgment calls).
2. **The headline.** His line, every word kept, at the hero scale, centred, with one gold word: "Mascot. Your kid friendly, AI driven companion." The only `<h1>`. Two lines at 1280, three at 375; a first cut hyphenated the two compound modifiers and a phone stranded "AI-" at a line end, so the hyphens went.
3. **The hero pair and the panel.** The Home and Favorites renders side by side, the left one a fifth of its height lower (his stagger). The panel comes after them in the DOM, sits above them (`z-10`) and pulls up over their lower part with a negative margin, so its top hairline crosses the left device at 42% of its height and the right at 62%, measured in the browser at 375 and 1280; the joysticks and buttons are behind the card, as he drew. The mascot render sits over the left device with its head registered on the mascot drawn on the screen (the on-screen head is at 47.0% × 35.3% of the device's visible box; the render's own head is at 39.4% × 35.4% of its canvas; at 58% of the device's width that puts the render at left 24.1%, top 16.7%), spans down to 69% of the box, and so crosses the panel's edge by its lower orbs. It is `z-20`, a sibling of the device's clipped box rather than a child, and nothing on the row or the columns carries a transform or a z-index of its own, because a stacking context there traps it under the panel for the length of the entrance and then releases it, a visible pop. It rides the page's one `Parallax` at the shared whisper (0.06, capped at 20px) against a device that does not move.
4. **The panel** is the system's elevated card: the row recipe's `white/15` hairline and solid `surface`, squared, with the `--shadow-modal` depth token §Surfaces allows on an elevated card (its first use on a page-level card; the service block visuals already carry it on a selected chip and an emphasised surface), panel interior padding, and top padding that clears the mascot's overhang at every width (measured 43px at 1280, 16px at 375 before the last step, now 32px). Row one: the device-and-phone render beside the ratified summary as the panel-scale statement, a body line and three gold-diamond bullets. Row two: his "What did we do?" centred, answered with the proof band's own line (`WORK_INTRO`, read rather than redrafted) and the six on-device screens in a grid with mono captions, three across through `lg:` and six from `xl:`, the one place the 446px files are shown at or under their own width.
5. **The hardware band.** A centred eyebrow, heading and line; the Home render on a stage with his eight labels rebuilt as callouts: mono micro-labels on `white/15` hairline leaders ending in the gold marker at the measured feature, side labels from `lg:` (a 896px stage leaves 256px a side), and below `lg:` the same list under the render with small squared numbered tags at the features (a tag on its own hairline surface, not bare text over imagery). One `<ol>` in the DOM, positioned over the stage from `lg:`, in flow below it. Then the front-and-back render with a mono caption.
6. **The closing band.** A centred eyebrow, heading and line over the device-beside-parent-app render.
7. **Other projects.** The other three studies as the band's tiles through `WorkGrid`, numbered as they are on the band and the grid, with the ghost "View all" to `/work`.
8. **The close.** `CloseBand`, the service routes' close, with New Product carried into the modal.

Motion is the shipped vocabulary: the load-time `rise-in` at 0 / 120 / 200 / 280ms with inline delays on the header, headline and hero renders; `ScrollReveal` at the hero stagger on every band below, the panel's bullets at the service rows' `120 + j·70ms`, callouts and screens at `120 + i·80ms`; the one `Parallax`. No keyframe was added and `globals.css` is untouched. Reduced motion and no-JS render the static page; the panel surface is never inside a reveal, so the overlap is in the server HTML.

## The renders

The folder holds thirteen files. Ten are used, byte-identical, renamed kebab-case (Taxonomy §8) into `/public/work/mascot/` (2.5 MB):

| Slot | File (owner's name) | Canvas | Visible box (alpha > 8) |
|---|---|---|---|
| Hero left, screens grid, hardware stage | `Home Device.png` | 446×581 | x 68–391, y 49–533 |
| Hero right, screens grid | `Favorites Device.png` | 446×581 | same |
| Screens grid | `Loading Device.png`, `Mascot AI Device.png`, `Mascot Edit Device.png`, `PTT Device.png` | 446×581 | same |
| The pop-out | `Robot.png` | 135×183 | whole canvas |
| Panel | `Device and phone round 3.png` | 1318×1237 | x 337–999, y 253–991 |
| Hardware, front and back | `BCM front back 14.png` | 1318×1224 | x 181–1106, y 152–1071 |
| Closing | `front final shot.png` | 1515×1273 | x 305–1179, y 159–1107 |

**Three files are not used, reported rather than placed** (the owner's imagery rule): `Home Device-1.png` and `Home Device-2.png` are the home screen with the icons spaced slightly differently (measured: the three differ only inside the screen area); `Device Physical UX_words.png` is the front view with the labels baked in, and its labels are rebuilt as callouts on the plain render in the owner's words. Windowing its sharper device out of the baked labels would cut opaque pixels, which the rule forbids without his word (§Recommendations).

**Every render is laid out by its visible box** (`CaseStudyRenderImage`): the box carries the window's ratio and clips, the image inside is positioned at the canvas's own proportions and offset so the window lands on the box. Transparent margins (half the canvas on the composites) fall outside; no opaque pixel is cut; nothing is stretched. The `sizes` hint describes the box and the component scales it for the canvas. The hardware features were measured on the device's box (alpha > 8, percent of the box; x then y): Silence 31.8 / 0.7 (top edge), Power 1.0 / 28.7, Push to talk 98.2 / 28.5, Volume 1.0 / 66.1, Game pad joystick 24.8 / 80.1, SOS button 56.5 / 72.8, Game pad buttons 81.4 / 78.8 (the right button), Front speaker 65.8 / 94.5; the array in `mascot.ts` is the record. Because they are shares of the box, the callouts are portable across every render of the device.

**Resolution.** The image optimizer never enlarges a file (the srcset lists every candidate width, as it does for any `sizes` image; a candidate wider than the canvas is served at the canvas's width). Three slots are laid out wider than their files and paint them stretched: the hero pair (a 384px box paints the 446px canvas at 529 CSS px, 1.2x at 1x and 2.4x at 2x), the mascot (223 CSS px from a 135px file) and the hardware stage (a 376px box, 518 CSS px, 1.2x at 1x). Built to his proportions rather than shrunk to the files; **three sharper exports are owed** (§Recommendations), and the `Home Device` export covers the stage. Every other render sits at or under its file's width at 1x.

## The content shape (#43)

`CaseStudyPageContent` (`src/lib/types.ts`) is named slots: `headline`, `accentPhrase`, `service`, `badges`, `liveHref`, `hero` (the pair and the pop-out), `panel` (the render, eyebrow, an optional statement that falls back to the ratified summary, body, bullets, and the `question` with its screens), `hardware` (optional: the annotated render, its callouts, the second view), `closing`. A slot a study has no material for is omitted and renders nothing. Named slots rather than the archive's block vocabulary, deliberately: the owner set this page's order and the template is that order.

**The page is not a field on the card object.** `MASCOT_PAGE` is a second export of `mascot.ts`, registered by slug in `index.ts` (`CASE_STUDY_PAGES`, `findCaseStudyPage`). `CASE_STUDIES` is handed to the home rail and the `/work` grid, both client components, so everything on it is serialised into every page's payload; a page's copy and geometry belong to one route. Verified: the built `/` and `/work` HTML and RSC payloads contain none of the Mascot page's strings.

The route (`src/app/work/[slug]/page.tsx`) gained one branch: a study with a page renders `CaseStudyPage`; the placeholder markup below the branch is untouched.

## What was pulled back from the archive, by file

- `case-study-link.tsx`, verbatim: the gold text link with the outward arrow for "View on Behance" and, for a live project only, "Visit website" (#44).
- `close-band.tsx`, verbatim, with its doc block corrected for this branch: it is a copy of the close inline in `service-page.tsx`, which still carries its own; switching the service routes to it is a zero-render-change refactor for a unit that may touch them (the owner scoped this one to the Mascot page).
- The badge vocabulary and `PLATFORM_BADGES` (#44).

## Extended with props, never forked

- `SectionHeading` gained `align?: "start" | "center"`. The default renders exactly the markup it always did (no empty class attribute, no trailing space), checked against the pre-change build. Its `hero` size was **reconciled to the spec**: it read `text-5xl md:text-7xl lg:text-8xl`, a leftover of the retired paper hero (`hero-section.tsx`, dormant, its only caller), where §Typography and the live `hero.tsx` both say `text-4xl → sm:5xl → md:6xl → lg:7xl`. The case study page is the size's first live caller; at `lg:text-8xl` the owner's headline broke into three lines with "AI-" stranded at a line end, and at the spec's ladder it sets in two. No live route rendered the old value.
- `WorkGrid` gained `headingId`, `heading` (a visible heading in place of the `sr-only` one), `eager` (the first row's preload), `numbering` (a tile's number from its item), `children` (the trailing control), `className` (the band's own classes, defaulting to the literal `/work` always had), `contentClassName` (the measure) and `sizes` (an override of the ladder's hint, for a grid inside a measure). `/work` passes none of them and renders what it did.
- `CASE_STUDY_PAGE` gained `visit`, `chipsLabel`, `newTab` (the screen-reader suffix on the off-site links), `othersEyebrow`, `othersHeading`; `PLATFORM_BADGES` is new. `CaseStudyLink` gained `hint` for that suffix.

Nothing was installed. `scroll-video.tsx`, `video-scrub.ts`, `brand-wordmark.tsx`, the nav item set, `service-page.tsx` and the three other study modules are untouched.

## Copy

Every string on the page is in `src/content/case-studies/mascot.ts` (the study's) or `src/content/work.ts` (the page's), DRAFT pending the owner's word, no em dash anywhere in a rendered string, and claims nothing beyond the ratified summary, the proof band's line, his own strings and what the renders show: no client, no numbers, no results, no timeline, no "live" tracking a still render cannot show, and no authorship claim over the hardware (Rule 3.4's intent; the approved fact covers screens). The proof line itself carries the owner's two-word "Next Sketch", the open item build-note 20 records, now on a third surface. Drafted by a three-way panel and two judges against the brief; the winning set is the shortest and the one whose headings form one structure ("What the child holds", "What the parent runs" around his "What did we do?"), with two lines grafted from the others (the hardware line that names all eight controls, the push-to-talk bullet that shows the two halves connecting).

## Judgment calls — brought back, with recommendations

1. **The white card is the system's elevated card.** `paper` and `white` are orphaned as section surfaces (§Color), gold is the only accent, and every route without footage uses solid `surface` for cards; the depth token is what §Surfaces allows. A white version is one class swap (`bg-paper text-ink`) with the inner text ladder and the gold markers re-derived on a light ground. Recommend: keep.
2. **The headline is his line, recased.** Every word kept; sentence case, a full stop after the name, a comma, no hyphens, gold on "companion". His casing ("Mascot Your Kid Friendly AI Driven Companion") is a one-string revert. Recommend: keep the recasing; every heading on the site is sentence case.
3. **"AI Application" is not rendered.** It is outside the badge vocabulary he fixed on 2026-09-14, and the summary took the subtitle slot. Adding it is one string if he wants it as a badge (a seventh vocabulary value) or as the subtitle (a new slot). Recommend: leave it out; "Device" and "Mobile App" say what it is.
4. **The inspiration's numerals, timeline, headline chip, status labels and callout cards are not reproduced.** Each would assert a figure or a schedule nobody approved (Rule 4.3; decision #5 retired the invented stat strip). A stepped four-phase timeline was built and then removed on review: phase names stepping down-right are the grammar of a duration claim with no data behind it. `<ServiceProcess />` can be mounted between the closing band and Other projects unchanged if he wants the firm's process on a study. Recommend: leave it off.
5. **Band headings are centred** (`align="center"`). The system's hero anchors bottom-left; he centred every heading in his mock. Two exceptions, deliberate: the Other projects heading keeps `/work`'s left-anchored heading over its grid, because that band is the grid, and the close keeps the service routes' left-set close. His "What did we do?" takes the section scale inside the panel, above the panel-scale statement, because he drew it that size. Recommend: keep.
6. **Content sits on the service routes' measure.** Generalized from his 2026-08-30 direction because the panel's two-column row and the hero pair have exactly the failure the measure was introduced to stop on a wide viewport. Consequence: the Other projects tiles stop at the measure while `/work`'s grid runs to the gutters. One constant to reverse. Recommend: keep.
7. **Three tiles, not two, in Other projects.** The count ladder leaves one tile alone on its row from `md:` to `xl:`, the ladder's documented honest degradation; showing two would hide a study. Recommend: keep.
8. **The hardware labels are HTML, not the baked bitmap.** His words, in the mono face, crisp at any size, one list to assistive tech, repositionable per breakpoint. Below `lg:` the render carries small squared numbered tags at the features (`size-6`, a `white/15` hairline on `surface`, the mono micro-label size), a tag on its own surface rather than bare text over imagery; the tag is a generalization the spec does not cover, flagged here. Recommend: keep; the baked file is still in the folder.
9. **The panel's interior padding is the panel ladder** (`px-6 → md:px-10`, §Layout); a first cut added an `lg:px-16` step and the review took it out. The panel spans the content measure rather than the modal's 560px cap, which the spec now says a page panel may.
10. **Two controls reach `/work` under two names**, "All work" (the header's route back) and "View all" (the grid's archive control, `WORK_VIEW_ALL`, the same object the home rail reads). Both labels are established on their surfaces; unifying them is a copy call for the owner.

## Deviations — flag at review, not silently resolved

- **Two slots outrun their files.** The hero pair and the mascot render soft on a 2x display (§The renders). Built to his proportions and reported, not shrunk to fit.
- **`Silence`, not `Silence switch`.** The callout labels are his eight words as baked, case normalized; the drafters' "Silence switch" was not adopted.
- **The pop-out has no alt.** It is the mascot the Home screen's alt already describes, grown out of the screen; `alt=""`, so it reads to assistive tech as nothing.

## Recommendations (not built)

- **Three sharper exports:** `Robot.png` at 540px wide or more, `Home Device.png` and `Favorites Device.png` at about 900px wide, same transparent cut-outs, same folder. The caps in `case-study-page.tsx` (`max-w-[24rem]` on the hero boxes, 58% on the pop-out) can then rise to his mock's proportions without softness.
- **Or, with his word, the sharper front view:** the device inside `Device Physical UX_words.png` is 1.9× the screen renders; windowed to x 28.5–72.5%, y 16.5–82.3% it yields the device alone with no baked-label pixel inside (measured clearances of 17–70px). It crops opaque pixels, so it needs the owner's say-so.
- **`service-page.tsx` → `CloseBand`,** a zero-render-change refactor, when a unit touches the service routes.
- **The other three studies' pages,** one folder at a time, on this template: each is a `*_PAGE` export beside its card and one line in `index.ts`.

## Verification

- `npm run lint`, `npm run typecheck`, `npm run build` (13 static pages, the four case study routes prerendered), `npm run banned-terms` (clean, 105 files): all green.
- **Payload:** the Mascot page's strings appear in `/work/mascot`'s HTML and nowhere else (grep of the built `/` and `/work` HTML and RSC: zero hits).
- **Markup identity:** the built HTML of `/`, `/work`, `/pricing`, both service routes, the 404 and the three placeholder case study routes compared against a build of the pre-change commit (`ad5d99a`, built from a `git archive` of that commit): with `<script>` and preload/stylesheet `<link>` tags stripped, the markup is identical on every one. The script tags themselves differ because the client chunk graph changed (the page's components and the grid's new props moved module boundaries), which is the one difference and is not markup. A first pass caught `WorkGrid` rendering its default classes in a different order; the default string is now the literal `/work` always had.
- **Client bundle:** no chunk under `.next/static/chunks/` contains a Mascot page string; the page's content is tree-shaken out of the client graph that `/` and `/work` share.
- **In the browser** (the preview server, 1280×900 and 375×812): the seam crosses the left device at 42.1% / 39.5% and the right at 62.1% / 59.2%; the mascot's lower orbs cross the seam by 176px / 89px and clear the panel's first content by 43px / 32px; the eight callout markers land on their features at `lg:` (positions read back from the DOM against the measured feature coordinates, all within 0.2%); the hardware list and tags render below `lg:`; no horizontal overflow at 375; the three placeholder routes still render the #39 room.
- **Adversarial review:** a second panel reviewed the page from six lenses (§Review), and every finding taken was fixed before the push.

## Review

Six reviewers read the change (layout and CSS, design-system conformance, accessibility, content rules, payload and build, the records), with three skeptics per finding; the session's usage limit cut most of the skeptics off, so the findings were judged by hand against the code and the rules. Fixed:

- **`scaleSizes` split a `calc()` length at its last space** (`case-study-render.tsx`), so every hint with a subtraction (`calc(100vw - 6rem)`) told the browser the image was smaller than its box, and on a phone the panel's render was fetched at 384px and stretched almost three times. The media condition is now found by matching its parentheses, and the four page hints are unit-checked against the function.
- **The panel's margin stepped at `md:` and `lg:` while the hero row caps at 864px**, so between 800 and 1023px the panel's edge crossed the devices lower than designed; the step is now `min-[864px]:`, tied to the cap.
- **The panel carried an `lg:px-16` interior step** outside the binding `px-6 → md:px-10` ladder; removed.
- **The numbered tags used a fourth type size** (`text-[0.6rem]`) and a hover-strength border at rest; now the micro-label size on a `white/15` hairline.
- **The callout labels were `whitespace-nowrap` in the list below `lg:`** and ran into the next column on a 360px phone; the no-wrap is scoped to the stage.
- **The closing band had no top padding of its own**, so a study without the optional hardware band would have butted it against the panel; each band owns its air.
- **The off-site links gave no new-tab cue** to assistive tech; a screen-reader-only "(opens in a new tab)" suffix, from content.
- **Lists carried no `role="list"`** under Tailwind's `list-style: none`, which WebKit takes as leave to drop list semantics; added to the page's lists.
- **The other-projects tiles used `/work`'s `sizes` ladder inside the measure**, over-fetching on wide screens; `WorkGrid` takes a `sizes` override.
- **Copy:** "silence switch" (the owner's label is "Silence"; the mechanism is not visible), "live location" (a still render cannot show live), "coloured", an alt that described HTML callouts as part of the image, and full stops on two fragment headings.
- **Records:** the architecture doc's §Routes still called every case study route empty; the spec still called the template Unit 25's and the measure the service routes' only; the vision non-goal still said per-project pages were not planned; "first use of the depth token outside the modal" was false (the service block visuals carry it); the hardware stage was missing from the list of slots that outrun their files; the bullets' 70ms step was recorded as 80; the `WorkGrid` prop list omitted `className`; "two placeholder routes" and "three files pulled back" were miscounted; "byte-identity" overstated a markup comparison; the elevated card's 560px cap in the spec now has the page-panel exception.

Not taken: showing two other projects rather than three (would hide a study); `priority` on only one hero render (all three touch the fold at 1280×900); "Mascot edit" as the caption for the face picker (the caption describes what the screen shows); unifying "All work" and "View all" (an owner copy call, §Judgment calls 10).
