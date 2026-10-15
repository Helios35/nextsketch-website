# Build Note 37: Diagram visuals in the Ink Orbit style (adhoc)

**Date:** 2026-10-15 · **Branch:** `adhoc/diagram-visuals` · **Base:** `main` @ `7ae5c99` (Brief 1 merged as PR #44)
**Status:** COMPLETE, pushed, no PR (Nate opens it). Every diagram on the site is drawn in one language adapted from the "Ink Orbit Features" reference; the eight the brief names exist; the wireframe set is retired; nothing outside the diagrams moved. All four gates green.
**Follows:** build-note 36. **Decisions:** **#60 to #62** appended. Next free row **#63**, next build note **38**.
**Brief:** "Adhoc Unit: Diagram visuals in the Ink Orbit style" (Nate, 2026-10-15; Brief 2 of 3), with the reference component `ink-orbit-features.tsx` (style reference only). Brief 3 (About and team) follows.

---

## Pre-flight

**Gaps found before drawing anything:**

1. **`claude/site-content-running-notes.md` §6h**, which the brief cites for the owner call, is in neither the repo nor the reference folder (the same gap build-note 36 recorded). Built from the brief and the reference alone.
2. **The reference is a shadcn-style component with its own palette, fonts, hatch, portraits and sample brand** ("NeuraForge AI", its people and copy). Taken as a style reference only: nothing installed, no `/components/ui`, every value a token, none of its sample content shipped (#61).
3. **Brief 1 left the agentic rows in a no-visual layout** (from `lg:` the "What we map first" panel takes the visual's half, build-note 36 builder call 15). Giving each block a visual flips `hasBlockVisual`, so those rows split again and the map panel returns under the description at desktop. That is the layout change the brief implies; it is the one difference the comparison below finds outside a diagram.
4. **The Why section had no visual slot.** The diagram had to go somewhere new (builder call 1).
5. **Fin's 3:1 floor for marks** rules out the reference's faint lines (`#363636` on `#121212` is about 1.5:1), and **fin's "coral is never a chart fill"** rules out a coral area under a chart. Both drove the line and coral calls below.
6. **SVG text scales with its drawing**, and the same diagram is 262px wide on a phone and 512px on a desktop row. Text in the reference's way (SVG `<text>` at 7 to 8.5 units) would be about 5px on a phone. Every label here is HTML laid over the lines (builder call 6).

**Before-captures** (main, `next start`, headless Chrome): every route at 360, 768, 1280 and 1920 as scrolled viewport tiles, **104 with reduced motion and 104 with motion on**, kept outside the repo.

## The inventory, before and after

| Route and anchor | Before (main @ `7ae5c99`) | After |
|---|---|---|
| `/` `#why` | No visual: heading and two paragraphs | **`ProcessMapDiagram`** under the body, in its column: one request moving through six steps, the three done by hand marked in coral with an empty agent slot each |
| `/services/agentic-system#email-triage` | No visual (`VISUALS` mapped it to `null`; Brief 1 deleted the #34 app cluster that stood in) | **`EmailTriageDiagram`**: 48 unread → sorted, 2 flagged, 46 drafted |
| `#weekly-reporting` | No visual (the empty-frame stand-in was deleted) | **`WeeklyReportingDiagram`**: four tools' numbers → one weekly report, delivered; the tools are toggle buttons |
| `#quoting-and-intake` | No visual | **`QuotingIntakeDiagram`**: a customer's request → a drafted quote, routed to sales |
| `#document-and-data-entry` | No visual | **`DocumentEntryDiagram`**: a pile of 23 files → rows in accounting, 0 retyped |
| `/services/product#new-product` | `NewProductVisual`: a bento dashboard mosaic (with build-note 33's coral area fill) | **`BuildFromScratchDiagram`**: a product taking shape, two agents inside it, week 5 of 8 |
| `#product-completion` | `ProductCompletionVisual`: an IDE explorer and editor | **`FinishStartedDiagram`**: a half-built product, an assessment of what to keep, fix and build, 70% to launch |
| `#product-support` | `ProductSupportVisual`: a Gantt timeline (with build-note 34's F9 second coral mark) | **`ProductTeamDiagram`**: a live product's status and twelve weeks of users with each release marked; the chart scrubs |
| shared | `VisualFade` (`bg-visual-fade`) on every mock; `chart-*` as wireframe chrome (#31) | **Retired.** The diagram primitives (below) |
| `/pricing`, 404 | No diagram | No diagram |

**Not diagrams, left alone (the brief's guardrails):** the hero loop (#50, #51), the Work row screenshots, the About portrait (Brief 3), the capability strip, the proof band, the pricing tiers, the How-it-works numerals, and the dormant `placeholder.tsx` and `sketch-accent.tsx`.

## Components added, changed and removed

| File | Status | What it holds |
|---|---|---|
| `src/components/diagram.tsx` | **new** | The language: `diagramGrid` (a drawing's coordinates, turned into percentages of the canvas), `Place`, `DiagramSvg` (the line layer), `DiagramFrame` (the brackets and the panel), `Flow` (a line and its travelling dots), `AgentHub`, `Panel`, `ProductWindow`, `RowDiagram` (a single-drawing row diagram), `BeforeAfterDiagram` (the agentic composition), and the text recipes `D_LABEL`, `D_TEXT`, `D_FIGURE`, `ON_CANVAS`, `ON_PAGE_CANVAS` |
| `src/components/diagram-stage.tsx` | **new, client** | `DiagramStage`: the fixed-aspect canvas, a size container, two drawings switched on its own width, and the off-screen pause |
| `src/components/process-map-diagram.tsx` | **new** | `ProcessMapDiagram` (the Why section) |
| `src/components/agentic-diagrams.tsx` | **new** | `EmailTriageDiagram`, `QuotingIntakeDiagram`, `DocumentEntryDiagram` |
| `src/components/weekly-reporting-diagram.tsx` | **new, client** | `WeeklyReportingDiagram` (toggle buttons, the tool walk) |
| `src/components/product-diagrams.tsx` | **new** | `BuildFromScratchDiagram`, `FinishStartedDiagram` |
| `src/components/product-team-diagram.tsx` | **new, client** | `ProductTeamDiagram` (the scrubber) |
| `src/content/diagrams.ts` | **new** | Every string a diagram renders, accessible names included: `DIAGRAM_WORDS`, `PROCESS_MAP`, `EMAIL_TRIAGE`, `WEEKLY_REPORT` (+ `weeklySourceLabel`), `QUOTING_INTAKE`, `DOCUMENT_ENTRY`, `BUILD_FROM_SCRATCH`, `FINISH_STARTED`, `ONGOING_TEAM` |
| `src/components/service-block-visual.tsx` | **rewritten** | The block-to-diagram map; `hasBlockVisual` and `ServiceBlockVisual` keep their names and contract. The three wireframes, `Bar`, `Dot`, `MosaicTile`, `Caret`, `TabClose`, `AvatarStack`, `Kebab`, `Gauge`, `TaskCard` and their data are gone |
| `src/components/brand-wordmark.tsx` | **extended** | `BrandMark`, the mark alone, drawing the same two paths as the lockup from shared constants (`MARK_BODY`, `MARK_LEAD`); the lockup's rendered markup is unchanged |
| `src/components/manifesto-section.tsx` | **changed** | Renders `ProcessMapDiagram` under the body |
| `src/components/visual-fade.tsx` | **deleted** | Its only consumer was the wireframes |
| `src/app/globals.css` | **changed** | Five keyframes and `--animate-diagram-*` (#62); `bg-diagram-grid` and `diagram-packet` added; `bg-visual-fade` removed; the `chart-*` comment updated |
| `service-page.tsx`, `service-pages.ts` | comments only | Stale "until the visuals brief" and "tile cluster" comments brought up to date. No markup change |

**Names** follow Taxonomy §8, recorded there: a diagram component ends in `Diagram` and names its job.

## The language as built

- **Frame:** four 12px brackets (1.5px, `muted-foreground`) 6px outside a panel; they turn `foreground` at 150ms on hover or while focus is inside. On the page ground (Why) the panel is a `card` at `rounded-xl`; in a service row it is an inset `background` well at `rounded-lg`.
- **Canvas:** the `bg-diagram-grid` dot grid (a 1px `border` dot every 16px), fixed aspect, a size container. Agentic before-and-after: 300×520 stacked under 24rem of its own width, 400×300 side by side from it. Process map: 320×584 under 42rem (held to 24rem wide), 900×256 from it. Product: one 400×300 drawing.
- **Lines:** 1.25px non-scaling, `muted-foreground/80`; one of each pair dashed and running. **Dots** `foreground`, travelling on `offset-path`.
- **Agent:** the NextSketch mark in a `secondary` chip with a `muted-foreground` border, `shadow-2xl`, a pulsing ring.
- **Text:** HTML over the drawing: mono labels 9px, 10px from 448px of diagram width; sample text Inter 10px, 11px; figures tabular.

## How each diagram is labelled for assistive tech

| Diagram | Role | Accessible name | What else is exposed |
|---|---|---|---|
| Process map | `img` | `PROCESS_MAP.label` | nothing (the drawing is `aria-hidden`) |
| Email triage | `img` | `EMAIL_TRIAGE.label` | nothing |
| Weekly reporting | `group` | `WEEKLY_REPORT.label` (ends "Choose a tool to see where its number lands.") | the panel header ("Before", "4 tools") and four `button`s with `aria-pressed`, each named by `weeklySourceLabel` ("CRM: New leads, 126. Show where it lands in the report."); the agent and the report are hidden |
| Quoting and intake | `img` | `QUOTING_INTAKE.label` | nothing |
| Document and data entry | `img` | `DOCUMENT_ENTRY.label` | nothing |
| Build from scratch | `img` | `BUILD_FROM_SCRATCH.label` | nothing |
| Finish what someone started | `img` | `FINISH_STARTED.label` | nothing |
| Ongoing product team | `group` | `ONGOING_TEAM.label` | one `slider` named "Week of the chart to inspect", `aria-valuemin` 1, `aria-valuemax` 12, `aria-valuetext` such as "Week 10: 1,150 users, v1.6 shipped, Smarter alerts" |

None is marked decorative: every one says more than the copy beside it (the sample job, its numbers), so each names itself. The static ones wrap their drawing in `aria-hidden` as well as carrying `role="img"`, because Chrome's accessibility tree still exposed the text under a bare `role="img"` (checked with `Accessibility.getFullAXTree`).

## Where coral is used

| Diagram | Coral |
|---|---|
| Every agent chip and agent slot | the mark's own lead (#49) |
| Process map | the diamonds on the three steps done by hand, and the legend's diamond |
| Email triage | "Flagged", its diamond and the left rule on the two flagged rows |
| Weekly reporting | the diamond on the report row of the tool being followed (moves with the choice or the walk) |
| Quoting and intake | "Routed to" and its arrow |
| Document and data entry | "0 retyped" and its diamond |
| Build from scratch | today's diamond on the timeline, and "Today" |
| Finish what someone started | "Launch" and the diamond at the end of the bar |
| Ongoing product team | the chart's reading point |

Never a line, never an area fill. Every coral text and mark sits on `background`, `card` or `secondary` (6.1, 5.6, 5.3:1).

## The motion exemption as built (#62)

| Motion | Keyframe | Duration | Where | Reduced motion | Off screen |
|---|---|---|---|---|---|
| Dots travelling a line | `diagram-travel` (`offset-distance` 0 → 100%, fading in and out) | 2.2 to 3.2s, set per line, started part-way round | every `Flow` | no dot (`diagram-packet` is invisible until animated) | paused |
| Dashes running | `diagram-dash` (`stroke-dashoffset` to −14) | 1.4s | the dashed line of each pair, the process map's line, the outlines of parts still being built | dashes still | paused |
| Pulse | `diagram-pulse` (scale 1 → 1.18, opacity 1 → 0.35) | 2.4s | the agent's ring; "Live" | ring and dot at rest | paused |
| The request | `diagram-trace` (holds at each of six stops, longest at the three by hand) | 10s | process map | rests at step 1 (a static dot) | paused |
| The report landing | `diagram-sheet` (8px slide and fade, then holds) | 7s | weekly reporting | sheet in place | paused |
| The tool walk | JS class swap (the colour change is the 150ms micro-transition) | every 1.8s | weekly reporting | never starts (`usePrefersReducedMotion`) | stops (its own IntersectionObserver) |

All keyframes live in `globals.css` `@theme`, applied `motion-safe` only; `DiagramStage` marks an off-screen canvas `data-idle`, and one rule pauses every animation inside it. Measured with motion on: dots move on every diagram (4 per agentic diagram, 2 per product build diagram, 1 on the process map), offscreen canvases carry `data-idle`. With reduced motion: no animation runs inside any diagram and no dot is visible.

## Builder calls (each comes back to Nate)

1. **The Why diagram sits under the body, in the body's column** (`lg:ml-auto lg:max-w-4xl`), but **outside the body's `Parallax`**, so the body's whisper drift is measured exactly as before. The gap (64px, 80px from `md:`) clears the drift's 48px cap.
2. **One composition for all four agentic examples**: before panel, the agent, after panel, two lines in and two out. It reads as one family and makes "before and after" unmistakable; the cost is that the four differ only inside their panels.
3. **Two drawings per before-and-after**, switched on the diagram's own width (a container query): stacked under 24rem (phones), side by side from it. A side-by-side drawing at 262px would leave each panel about 90px wide. The stacked drawing is tall (about 450px at 360), so **the agentic page grows by about 2,000px on a phone** (6,597 → 8,600 at 360) and 600 to 1,540px elsewhere.
4. **The product diagrams keep the wireframes' 4/3 box**, so those rows keep their height (2px taller at 360 and 768: the frame's border).
5. **The canvas is a dot grid**, not the reference's diagonal hatch: the hero's sketch footage draws on a dark dot grid, so the diagrams sit on the same paper. Inside a row card the canvas is an inset `background` well; on the page it is a `card`.
6. **Text is HTML over the drawing**, not SVG text, at 9 to 11px: smaller than the page's 0.7rem label, larger than the reference's 7px.
7. **The brackets change colour on hover and focus, and do not slide** (deviation from the reference; the system shows state by colour).
8. **Lines at rest are `muted-foreground` at 80%** (3.7 to 3.9:1), brighter than the reference's, for the 3:1 floor.
9. **Interaction is limited to two diagrams**, each with real controls: weekly reporting's four toggle buttons (hover, focus or press lights a tool, names it under the agent, marks its report row; with nothing chosen the diagram walks the tools) and the ongoing team's chart as a slider. The reference's hover-only avatars and tooltips are not reproduced: nothing in a diagram is revealed by hover alone.
10. **The sample content is mine and is DRAFT** (#61): the people (Dana Ruiz, Sam Ortiz, Mo Lee, Ivy Chen, Jo Park), the vendors (Acme Supply, Harbor Print, Lakeside Freight, Pine & Co), the figures ($18,420, 126, 312, 2.4%, $3,400, $1,240), "Week 42", "v1.4" to "v1.7", the six process steps and their counts, and every accessible name. All in `src/content/diagrams.ts`.
11. **The process map marks pricing as "A person"**: the copy beside it says the map shows "where it would just add noise", so one step is deliberately left to a person.
12. **Lists longer than their panel are clipped, not faded.** A fade at the foot washed the last row's text under 4.5:1 (measured 4.0), so it was removed.
13. **The document pile is fanned** (each file name clear of the next) with a degree or two of tilt, a static transform (#32 flagged the first rotated plane). A tighter, more scattered pile put one card's edge through the next card's file name and measured 4.29 to 4.46:1. The accounting table drops its due-date column side by side, where the panel is too narrow for three figures, and shows it stacked.
14. **`chart-*` stays defined, now unused.** Removing fin tokens is the open delete-vs-keep call build-note 34 already lists.
15. **Decision log, append only:** #60 to #62 name what they supersede (#30's wireframe clauses, #31, #57's slots, the no-text rule); rows #30, #31, #34 and #57 carry no inline supersession note, because the brief says append only. The preamble's next number and the footer's open and resolved items were updated, as every unit does.

## Deviations from the brief or the reference

- **From the reference:** no portraits, no presence dots in green, no rays or neutral glow behind the hub, no hatched page, no 800ms reveal or 1.8s line draw-on (entrances stay the 200ms `rise-in`), no SMIL `animateMotion` (CSS `offset-path` keyframes instead, so the reduced-motion and `motion-safe` rules apply), brackets that do not slide, and lines and labels brighter for the contrast floor. Its tooltip chip survives as the chart's reading.
- **Docs beyond the four listed:** `docs/00-project-setup.md` names the new exemption in its motion floor.
- **Dormant files untouched:** `placeholder.tsx` and `sketch-accent.tsx` still say in comments that the chart steps are wireframe chrome; they are F10's dormant set, out of scope.

## Verification

Headless Chrome over the DevTools protocol against `next start` production builds: the branch on :3100 and `main` (built from `git archive main`) on :3101. Scripts kept outside the repo.

| Check | Result |
|---|---|
| Every diagram at 360, 768, 1280, 1920, motion off and on | **111 after-tiles with reduced motion and 111 with motion on**, every route at every width, plus element captures of each diagram while building. Page heights: `/` +632 / +281 / +336 / +336px (the process map); the agentic route +2,003 / +1,538 / +600 / +600px (four diagrams; the stacked drawing on a phone); `/services/product` +2 / +2 / 0 / 0px (the frame's border); `/pricing` and the 404 unchanged. No horizontal overflow anywhere |
| Nothing outside the diagrams changed | Element by element against `main` at all four widths, reduced motion: every element outside a diagram captured on both builds (the walk skips a diagram's subtree and descends into anything that holds one), compared by pixels and by a layout fingerprint (every descendant's box relative to the element, plus its paint properties). **`/pricing` and the 404: pixel-identical. `/`: all 10 parts identical** (6 or 5 by pixels; the rest have identical fingerprints and differ only by a fractional-pixel document offset, because the process map's height is fractional and the sections below it re-snap their text). **`/services/product`: all 8 identical** (the rows' text columns included). **`/services/agentic-system`: hero, lists, How it works, close and footer identical; at 360 and 768 the rows' text columns too.** At 1280 and 1920 the four rows' text columns change, from Brief 1's `lg:contents` (no box) to a half-width column beside the diagram, with the same text: the expected consequence of each block having a visual (pre-flight 3) |
| Contrast, every text and every meaningful mark in every diagram, at rest and lit (a tool pressed, the chart scrubbed to week 7) | 64 diagram captures (8 diagrams × 4 widths × 2 states): **1,534 text runs, none under 4.5:1, worst 4.63:1** (`muted-foreground` on `secondary`); **1,040 marks, none under 3:1, worst 3.16:1** (the chart's guide line under the reading, `foreground` at 40%), lines 3.48:1 or better (3.48 where an agent's lane crosses a product module on `secondary`, 3.66 on `card`, 3.89 on the canvas). Method: screenshot with the text visible and again with it transparent, and sample only the pixels the glyphs change (the 98th-percentile background pixel against the text's computed colour); marks hidden and the pixels under them read the same way. **Decorative fills are excluded and counted, not measured** (60 instances: the build timeline's phase gaps, which are the canvas colour, and the chart's `border` grid lines), as the system classes them (§Color: skeleton fills, tracks, hairlines) |
| Motion | Motion on: dots move and are visible on every diagram; off-screen canvases paused. Reduced motion: no animation inside any diagram, no dot, the request at rest at step 1, nothing lit |
| Keyboard | Tab reaches the four weekly buttons and the chart slider and nothing else in a diagram; each shows the `ring` outline (2px, 11.8:1); Enter presses a tool (`aria-pressed` true, the agent names it), Space releases it; on the slider ArrowLeft ×3 moves week 12 → 9, Home → 1, End → 12, with `aria-valuetext` following. Every control is 44px or larger |
| Accessibility tree | Six `image` nodes named by their labels with no exposed children; two `group`s exposing only their buttons and their slider |
| Overflow | No horizontal scroll on any route at any width |

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ (the same six routes) · `npm run banned-terms` ✓ (57 files).

**Not verified:** real Safari, Firefox, iOS and Android (Chromium only; CSS `offset-path` on SVG is supported in all three engines' current versions, and where it is not, the dots are dropped by an `@supports` rule rather than parked at a corner); a real screen reader (the accessibility tree was read, not listened to); Windows High Contrast; production.

## Out of scope, noted

- Copy outside the diagrams; the About and team section (Brief 3); build-note 34's F2 to F8, F10 and F11; the unmerged case-study branches.
- The hero video, the Work screenshots and the About portrait.
