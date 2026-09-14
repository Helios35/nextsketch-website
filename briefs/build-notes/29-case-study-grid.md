# Build Note 29 — The Case Study Grid (adhoc "Unit 24")

**Date:** 2026-09-14 · **Branch:** `adhoc/case-study-grid` · **Base:** `main` @ `24676cf`
**Status:** Committed and pushed; **no PR** (owner policy — Nate opens it). Adhoc, outside the brief set. The brief calls this Unit 24; the notes folder had already reached 28, so this is **29** and the case study template (the brief's Unit 25, **held** until the owner supplies its reference and images) will be 30.
**Follows:** PR #36 / build-note 28. **Decisions:** #39–#41 (this unit's rows).

---

## The gap this closes

The home page's proof band shows four projects and a "View all" control. Behind that control was the owner's Behance profile, and behind each card the project's Behance page — nothing on this site held the work in full, and nothing on this site was a case study. This unit builds the room, not the furniture: `/work` is a real page holding every case study in content, `/work/<slug>` is a real route per study, and both are **layout-final and empty**. The template that fills them is the next unit's, built against a reference the owner has not yet supplied.

## Pre-flight: what the brief got wrong about the codebase

The brief said it was written without the repo connected and to trust the code over it. It was right to say so. Verified before anything was touched:

| The brief said | What is true on `main` @ `24676cf` |
|---|---|
| "Five source files cite rows #25 and #26 that do not exist" | They exist. Build-note 24 wrote them after the fact on 2026-08-28. The log runs **#1–#38** unbroken, so this unit's rows are **#39–#41** (the brief guessed the tail; the preamble now says #42 is next) |
| "The missing build note for the pricing page" | `briefs/build-notes/23-pricing-page.md` exists |
| Whether the $2,098 retainer change shipped | It shipped: PR #36, decision #38, build-note 28 |
| "The site was two routes; it is now many" | It was already **four** routes plus the 404 and the API (#23, #30). The docs said so; the brief's sitemap premise was a unit behind |
| "Every image in this unit is a placeholder" | The four work items already carry **owner-supplied screenshots** shipped on the home page since PR #27. See judgment call 5 |
| "Anything heavy … hosted externally and referenced by URL, the way the existing scroll footage already is" | The scroll footage is **committed under `public/`**: `hero-orbit.mp4` and the three backdrop clips, 12.3 MB tracked in git, no LFS. Recorded against the facts in #41 |
| Build note "24-case-study-grid.md" | 24 is taken (decision reconcile). This note is **29** |
| The home cards' destination "may carry a live-site link" | They carried **Behance case study pages**, not live client sites — see judgment call 1 |

None of it blocked the build; all of it would have shipped wrong paperwork if trusted.

## Pre-flight: the gap list

Every consumer of the work content and the work card, traced from `src/content/work.ts` and `src/components/work-section.tsx` before a line changed:

| # | Consumer | Reads | Changed? |
|---|---|---|---|
| 1 | `work-section.tsx` (the home band) | `WORK_ITEMS`, `WORK_EYEBROW`, `WORK_HEADLINE`, `WORK_INTRO` | **No.** `WORK_ITEMS` keeps its name; its value is now the case study list |
| 2 | `work-rail.tsx` → `WorkRail` | `WORK_RAIL`, `WORK_VIEW_ALL` | The trailing card's destination only (through content) |
| 3 | `work-rail.tsx` → `WorkCard` (private) | `WORK_LINK`, `WORK_PLACEHOLDER_LABEL`, `item.href` | **Yes.** Exported, given the `tile` variant, links to `workHref(slug)` |
| 4 | `work-rail.tsx` → `ViewAllCard` | `WORK_VIEW_ALL.href` | Doc block only; the href moved in content |
| 5 | `src/lib/types.ts` → `WorkItem` | the item shape | **Yes.** `slug` added, `href` → `sourceHref` |
| 6 | `scripts/check-banned-terms.mjs` | walks `src/content/` recursively | **No.** Picked up the new `case-studies/` modules and both routes on its own — 105 files scanned, up from 56 |
| 7 | `docs/03`, `04`, `06`, `07`, `01`, `02`, `README` | the route count, the card, the "View all" | Reconciled |

There is exactly one component that renders a work item (`WorkCard`) and one section that mounts the rail. The brief's warning that "there is more than one surface that renders work items" is true only in the sense that the card is rendered inside a rail *and* now inside a grid — both through the one component.

## What shipped

| Path | What |
|---|---|
| `src/app/work/page.tsx` | **New.** The grid route: `/pricing`'s chrome, the band's intro copy, `<WorkGrid>` |
| `src/app/work/[slug]/page.tsx` | **New.** One route per study, prerendered; `dynamicParams = false`; the placeholder body |
| `src/components/work-grid.tsx` | **New.** The count-aware column ladder and the tile grid |
| `src/content/case-studies/{mascot,saas-platform,agentic-platform,parcell}.ts` + `index.ts` | **New.** One module per study (#41); `CASE_STUDIES` and `findCaseStudy` |
| `src/components/work-rail.tsx` | `WorkCard` exported with `variant` / `sizes` / `priority`; every card links to its route; the unlinked branch removed |
| `src/content/work.ts` | `WORK_ITEMS` re-pointed at `CASE_STUDIES`; `WORK_VIEW_ALL.href` → `ROUTES.work`; new `WORK_PAGE` and `CASE_STUDY_PAGE` |
| `src/lib/types.ts` | `WorkItem.slug`, `WorkItem.sourceHref` (was `href`), `CaseStudy`, `ROUTES.work`, `workHref` |
| `docs/decision-log.md` | Rows **#39–#41**, the numbering preamble, six new open items in the footer |
| `docs/03`, `04`, `06`, `07`, `01`, `02`, `README.md` | Sitemap, the card's tile variant and the new surfaces, slugs and routes, project tree, route count |

**Identifiers introduced** (canonical here, not in the brief): `CaseStudy` · `ROUTES.work` · `workHref` · `WorkItem.slug` · `WorkItem.sourceHref` · `CASE_STUDIES` · `findCaseStudy` · `WorkCard` (exported) · `WorkCardVariant` · `WorkGrid` · `WORK_PAGE` · `CASE_STUDY_PAGE`.

Untouched, as the brief required and `git diff --stat` shows: `scroll-video.tsx`, `video-scrub.ts`, `brand-wordmark.tsx`, `site-nav.tsx`, `site-footer.tsx`, `copy.ts`, `layout.tsx`, `page.tsx`, `work-section.tsx`, `check-banned-terms.mjs`, `NSOS-Transfer/` (gitignored, untracked, not listed). No dependency added.

## The routes

**`/work` is a static page and `/work/[slug]` is a dynamic segment prerendered per study.** `generateStaticParams` maps `CASE_STUDIES` to slugs, so the build emits `/work/mascot`, `/work/saas-platform`, `/work/agentic-platform` and `/work/parcell` as static HTML (the build output marks them `●` SSG; every other route is still `○`). Adding a module to the index adds a route; nothing in `src/app/` changes.

**`dynamicParams = false`, deliberately.** With the default an unknown slug would be rendered on demand — a request-time server function for a page that cannot exist, on a site whose only server surface is `/api/qualify` (#8). With it, `/work/does-not-exist` goes straight to the root `not-found.tsx`. Verified: **HTTP 404**, the site's own paper 404 (`bg-paper`, "This page doesn't exist.", the "Go to the page" control), not a Next default and not an empty shell. The `findCaseStudy` → `notFound()` guard in the page stays as the type narrowing and as insurance should the flag ever flip.

**`params` is a promise in Next 16** and is typed by hand as `Promise<{ slug: string }>` rather than with the generated `PageProps<'/work/[slug]'>` helper: that global only exists after a build or `next dev` has written `.next/types`, and CI runs `typecheck` before `build`, so the helper would fail the very first gate on a clean checkout.

**`/work` and `#work` (#40).** The nav's Work item is still `/#work`, the band. `/work` is not a nav item and is reached from the band's "View all". `src/content/copy.ts` is untouched — that is the whole point of the row.

## The content shape (#41)

One module per case study under `src/content/case-studies/`, each `as const satisfies CaseStudy`, collected in `CASE_STUDIES` in the owner's 2026-08-24 order. `CaseStudy` is `WorkItem` (what the card shows) plus `title` and `description` (what the route's metadata needs) — deliberately nothing else. The block composition Unit 25 introduces grows this type; no narrative field was scaffolded to hold copy nobody has supplied (Rule 4.3).

The four entries moved out of `work.ts` **byte for byte** — names, links, screenshots, summaries, `tone: "bright"` on the dashboard and the luminance notes that justify it. `WORK_ITEMS` survives as an alias (`readonly WorkItem[] = CASE_STUDIES`) so `work-section.tsx` did not have to change.

`index.ts` throws at module evaluation if two modules declare one slug. The build evaluates it to collect the static params, so a collision fails `next build` loudly instead of prerendering one route and leaving the second study silently unreachable behind `find`'s first match.

## Slug source (judgment call 2 — picked, not silent)

`WorkItem` had `id` (`work-01` …, the asset key) and no slug. Three shapes were considered:

| Shape | Verdict |
|---|---|
| Use `id` as the segment (`/work/work-01`) | Refused: a URL a visitor reads should name the work, and `work-01` is a file-naming convention |
| A `WorkSlug` union in `types.ts` (the `ServicePageSlug` precedent) | Refused: it would make adding a study a type edit as well as a content file, which is the one thing #41 says adding a study must not be |
| **A required `slug: string` on `WorkItem`, per module, the published title slugified** | **Shipped.** `mascot` · `saas-platform` · `agentic-platform` · `parcell`. Kebab-case per Taxonomy §8; the Behance title is the name the owner released the work under (build-note 20), so the URL asserts nothing the card does not |

Typo-safety is not lost by using `string`: no hand-written slug exists anywhere — every href is `workHref(item.slug)` from the item itself, so a card can only point at a route the build prerenders. **Recommendation:** ratify these four, or rename one field per module; nothing else moves.

## The card, and its tile variant

`WorkCard` is exported from `work-rail.tsx` — **same file, no fork, reached through a prop**, as the brief required — with three additions and one subtraction:

- `variant?: "rail" | "tile"` selects the screenshot's `sizes` default; `sizes?: string` overrides it (the grid knows its own ladder and passes it exactly); `priority?: boolean` lets the grid's first row preload. The tile changes **nothing visible**: same 16/9 frame, grade, copy block, gold row, hover, focus ring. It is the card sized by a grid cell instead of a snap slide.
- **Every card links, to `workHref(item.slug)`.** The old per-item "linked or plain container" branch is gone, not hidden: a route exists for every entry by construction, so there is no unlinked card to render.
- `target="_blank" rel="noreferrer"` went with the Behance destination; an internal route opens in the same tab.
- The anchor's accessible name separator changed from an em dash to a comma (`"Mascot, See More"`). It is rendered copy the card carries onto a new surface, #19 binds it, and the line was being rewritten anyway. Flagged here rather than slipped in.

## The grid, and the column ladder

`work-grid.tsx` is a landmark region under an `sr-only` heading (the `/pricing` tier grid's shape), `gap-4`, squared cards on solid `surface`, the band's gutter ladder. The reference the brief anticipated never arrived, so nothing was adapted from one; the grid is the site's own vocabulary and **nothing was installed** — no masonry, no lightbox, no animation library.

**The column count is chosen from the tile count, not the viewport alone.** A grid of four strands one tile the moment it goes to three columns, at any width where three columns happen. So the ladder is: one column below `md`; two from `md`; **three from `xl` only when `count % 3 !== 1`**; **four from `2xl` only when `count % 4 === 0`**. For today's four that is `1 / 2 / 2 / 4` — no orphan anywhere. Five gives `3 + 2` at `xl`, six `3 + 3`, eight `4 + 4` at `2xl`. Seven cannot avoid one at two *or* three columns; the last tile then stands alone at its neighbours' size, which is the honest degradation, not a stretched or centred one. One study renders as one tile at the width it would have among more.

Two of the breakpoints moved during measurement. Two columns start at `md`, not `sm`: at 640px a half-width tile is 280px, under the 307px the summaries were written to (build-note 20), and they clamped. Three columns start at `xl`, not `lg`: at 1024px a third of the track is 288px and the copy no longer fits. Every class is a literal assembled from named pieces (Tailwind compiles only what it can read), and the image `sizes` hint is derived from the same ladder so a srcset choice can never under-fetch.

| Viewport | Columns | Tile | Rows | Summary lines | Overflow |
|---|---|---|---|---|---|
| 360 × 740 | 1 | 312px | 4 | 2 of 2, none clipped | none |
| 768 × 1024 | 2 | 336px | 2 | 2 of 2, none clipped | none |
| 1280 × 800 | 2 | 560px | 2 | — | none |
| 1920 × 1080 | 4 | 432px | 1 | — | none |

No layout shift as screenshots load: the frame is the card's fixed `aspect-video` box and `next/image` carries `width`/`height`. The first two tiles carry `priority` — they are the largest above-the-fold paint at every width, and two 65 KB preloads is the right trade against four. Entrance is `<ScrollReveal>` on the Services-card rhythm, staggered across the row (`120 + column·80ms`) rather than down the list, so a later row cascades the way the first did.

## The placeholder route

`/work/<slug>` is `/pricing`'s chrome with a `min-h-dvh` intro band and nothing invented in it: a mono **"All work"** route back to the grid (the footer anchors' voice, the shared `ArrowIcon` reversed — the rail's "previous" control does the same), the **"Case study"** eyebrow, the study's name at `display` scale, its summary, one full-white line behind the gold list marker saying the detail is coming (the `/pricing` term's treatment: a disclosure, not a decorative aside), and a `ghost` divided-arrow **"View on Behance"** out to `sourceHref`, rendered only when a study has one. Both controls are navigation and read as navigation; the Rule 3.1 set does not bind them, the same reasoning `WORK_LINK` records. **No narrative, no image, no block, no metric, no quote.** Every string lives in `CASE_STUDY_PAGE` in `src/content/work.ts`, DRAFT.

`min-h-dvh` is the one geometric departure from `/pricing`: with four lines of content the footer would otherwise sit halfway up a tall viewport, and the band the template will fill is at least a screen. The sticky lockup wrapper is unchanged and verified.

## The home page did not move

Measured, not asserted. The production build on `main` @ `24676cf` was taken before the first edit and diffed against this branch's build of `/`, tokenised on tags:

- **Five attribute differences and nothing else.** Four card anchors (`href` to `/work/<slug>`; `target` and `rel` gone; the accessible-name separator) and the View all anchor's `href` (`/work`). Chunk hashes differ because the bundle changed; no element, class or text node did.
- **Backdrop cadence (#17), 1920 × 1080:** hero 2808px, Work band 1111px, `opaqueBottom` 3919, `heroRelease` 1728, `start` 2839, `max` 7371, **`range` 4532** — the number build-note 22 recorded at this viewport. Clip one reads `t = 0.002` at `start`; all three clips read `8.042 / 8.042` at page bottom.

## The wordmark handoff on the new routes

Probed on `/work` at 1920 × 1080 at scrollY 0 / 78 / 82 / 300: the page lockup alone at top 24 below 80px; the bar's (top 20) plus the page's (24) from 82px up. Identical to the documented `/pricing` pattern. The bar reads over these routes exactly as it does over `/pricing` — transparent until 80px, over the glow rather than over footage — which is judgment call 3's answer: it does not read badly, and nothing about the wordmark was touched.

## Judgment calls — brought back, with recommendations

1. **The home cards' destination.** Today (on `main`) every card is an anchor to the project's **Behance case study page** (not a live client site), `target="_blank"`, labelled "See More". Outcome 5 of the brief requires the cards to land on the case study route, so they do. **The Behance destination was not discarded:** it is `sourceHref` on each module and renders as "View on Behance" on the study's route, one hop away. **Recommendation:** keep it this way while the routes are empty — a visitor who clicks a card still reaches the real case study in one more click — and let Unit 25 decide whether the link survives once the page has its own content. If you would rather the cards keep opening Behance directly until Unit 25 merges, that is one line in `WorkCard` (`href={item.sourceHref ?? workHref(item.slug)}`) and I would advise against it: it would make the two surfaces disagree about what a card is for.
2. **Slug source.** Above. Ratify or rename per module.
3. **The bar at the top of `/work`.** Above. No change recommended.
4. **What the brief asserted wrongly.** The table at the top. Nothing needs a decision except the footage premise, which #41 now records truthfully.
5. **"Every image in this unit is a placeholder."** The brief assumed no imagery existed; four owner-supplied screenshots have been shipping on the home band since PR #27. The tile is the same card, so it renders the same shipped screenshots — layout, responsive behaviour and hover were still settled against the fixed 16/9 frame the brief wanted, and rendering grey boxes over real owner assets on a production route would have been a visible regression. The card's no-image branch (`WORK_PLACEHOLDER_LABEL` in the same frame) is unchanged and still the fallback for a study without a screenshot. **Recommendation:** no change. If you want the grid signed off on boxes, say so and the four `image` fields come out of the modules for the review.
6. **The page glow.** #35 named three routes. `/work` and the case study routes carry it too, because every route without the footage now shares one chrome and a flat-black `/work` between a glowing `/pricing` and a glowing service route would read as the mistake. One `<PageGlow />` line per route to remove. **Recommendation:** keep, and let #35 read as "every route without the footage."
7. **The "View on Behance" label** names the platform. All four published pages are on it; a study published elsewhere changes the one string in `CASE_STUDY_PAGE`. Draft, pending approval like the rest.
8. **The grid's `<h1>`** reuses the band's owner-specified headline ("Real Products doing the job they were built to do") and supporting line rather than drafting a second set — Rule 4.1 posture. A page-specific line is yours to write; it drops into `WORK_PAGE` and nowhere else.

## Deviations — flag at review, not silently resolved

1. **`WorkItem.href` is renamed `sourceHref`.** A field called `href` that was no longer the card's href was a trap for the next agent. Touches the type and the four modules; no other consumer existed.
2. **The card's aria-label separator** — em dash to comma, above.
3. **The unlinked-card branch is removed** rather than kept dormant: it cannot be reached, and dead branches in this component have been the source of "deliberate, do not correct" comments before (#29).
4. **`min-h-dvh` on the case study band** where `/pricing` no longer carries it, above.
5. **This note is 29, not 24**, and the next is 30, not 25. The brief said to renumber to the real tail.
6. **The em-dash count in the decision-log footer is unchanged** and still true: no rendered string in `work.ts` or `case-studies/` carries one. `NOT_FOUND.body` still does and is now the landing for `/work/<unknown>`; added to the open items, not edited (owner copy, Rule 4.1).

## Found in the sweep, not fixed

- **`NOT_FOUND.body` says "NextSketch lives on a single page now"** — stale since #23, DRAFT copy, and it is what `/work/does-not-exist` renders. Added to the "Still open (owner)" list.
- **`WORK_INTRO`'s "Next Sketch"** (two words) is now on `/work`'s intro as well as the band. Build-note 20's deviation 2, still open; added to the footer so it stops living only in an old note.
- **The scroll footage is in git**, 12.3 MB across four clips, contrary to the brief. Not moved — that is an owner call with a deploy consequence — and #41 binds only case study media.
- **`README.md` said "Two pages"** — stale since #30, not just since this unit. Fixed in passing, since the brief's grep-and-fix instruction covers route counts.
- **The Apollo visitor pixel** still returns three 400s on `localhost` — pre-existing (build-note 19), not app code, and present on every route.

## Recommendations (not built)

- **`robots: { index: false }` on the four case study routes while they are empty.** Four near-identical "the full case study is coming" pages are not what search should find first. Not added, for the reason build-note 22 gave for the empty `/pricing`: an unremoved `noindex` after Unit 25 would be worse than a briefly-indexed placeholder. If the template is more than a couple of weeks out, add it and put its removal in the Unit 25 brief.
- **The em-dash scan for `check-banned-terms.mjs`**, fourth time of asking (notes 20, 21, 22). This unit added five new content surfaces to the site and kept them clean by hand, which is exactly the thing a gate exists to make unnecessary.

## Verification

`lint`, `typecheck`, `build`, `banned-terms` green — the gate picked up the new routes and the `case-studies/` directory on its own (105 files scanned, `work.html`, four case study pages and their RSC payloads included) with no change to `check-banned-terms.mjs`. Build output: `/work` `○` static, `/work/[slug]` `●` SSG with the four slugs listed.

In-browser, dev server, Chromium:

- **`/work` at 360 · 768 · 1280 · 1920** — the table above; no stranded tile, no horizontal overflow (`scrollWidth ≤ innerWidth` at every width), no clipped name or summary, no shift as screenshots load.
- **Keyboard** — Tab reaches every tile in order with the card's 2px white `focus-visible` ring; Enter on a focused tile lands on its route (`/work/saas-platform`, title "SaaS Platform | NextSketch").
- **Every link on `/work` and `/work/mascot`** — the built HTML carries only root-relative internal anchors (`/#work` · `/#why` · `/#services` · `/#process` · `/#about` · `/#top` ×2 · `/pricing` ×2 · `/work`) plus the two social URLs and the Behance source; not one resolves to a `/work#…` dead end. End-to-end: footer About from `/work/mascot` lands on `/#about` with the section in view; the page lockup and the bar's lockup both carry `/#top`.
- **From `/`** — the first card lands on `/work/mascot`; "View all" lands on `/work`.
- **`/work/does-not-exist`** — HTTP 404, the site's paper 404.
- **No JavaScript** — every tile, the back link and the source link are plain `<a href>` in the SSR HTML; the grid needs no script to lay out; `ScrollReveal` renders visible on the server.
- **Home page** — the built `<main>` diff and the backdrop numbers above; `#work` still `data-backdrop-hidden`; "View all" still a real snap slide.
- **Wordmark handoff** on `/work` at 0 / 78 / 82 / 300 — identical to `/pricing`.
- **Console** — clean apart from the pre-existing Apollo 400s.
- **Reduced motion** — not re-measured: the pane cannot emulate it, and every new surface uses only the shipped gates (`motion-safe:animate-rise-in` with inline delays, `<ScrollReveal>`), which build-note 27 verified under a forced `reduce`.
- `git diff --stat` — no formatting churn, no unrelated file, no change to `scroll-video.tsx`, `video-scrub.ts` or `brand-wordmark.tsx`.

---

⛔ **Stopped here, per the brief.** Unit 25 (`adhoc/case-study-template`, build-note 30) does not start until the owner's reference template and images are in hand. Nothing of the narrative layout, block set, copy or motion vocabulary was scaffolded.
