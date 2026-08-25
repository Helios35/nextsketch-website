# Build Note 22 — Hamburger Nav + Pricing Link (adhoc Unit 22)

**Date:** 2026-08-25 · **Branch:** `adhoc/nav-hamburger` · **Base:** `main` @ `4ecead6`
**Status:** Committed and pushed; **no PR** (owner policy — Nate opens it). Adhoc, outside the brief set. Follows PR #28 / build-note 21.

## The gap this closes

Two things, one branch.

The nav showed five anchor tabs on desktop and only collapsed to a hamburger below `md`. The owner wants the tabs gone entirely: **one right-justified burger at every screen size**, with a sixth item — **Pricing** — inside it.

Pricing itself was owed as a *section* under decision #16. The owner superseded that on 2026-08-24: it is a nav item plus **its own page**. That is the part with teeth, because the site had been single-route since the 2026-06-14 pivot and every nav link was built on that assumption.

## Pre-flight: the consumer gap list

The brief said to trace `NAV.items` before touching it and warned there was more than one consumer. There are **three**, across two files — plus three hardcoded wordmark links the brief does not mention, which break the same way:

| # | Site | Shape on `main` | Breaks from `/pricing`? |
|---|---|---|---|
| 1 | `site-nav.tsx:145` | desktop tab row, hash derived from `id` | yes |
| 2 | `site-nav.tsx:197` | overlay list, hash derived from `id` | yes |
| 3 | `site-footer.tsx:82` | footer anchors, hash derived from `id` | yes |
| 4 | `site-nav.tsx:133` | hardcoded `href="#top"` (scrolled wordmark) | yes |
| 5 | `site-nav.tsx:180` | hardcoded `href="#top"` (overlay wordmark) | yes |
| 6 | `site-footer.tsx:61` | hardcoded `href="#top"` (footer lockup) | yes |
| 7 | `copy.ts:45` | `satisfies readonly { id: SectionId; label: string }[]` | type surface had to change |

Consumer 1 was deleted with the tab row. The rest were converted. Nothing else in `src/` reads `NAV.items` or builds a section hash.

## What shipped

- **New:** `src/app/pricing/page.tsx` (the route), `src/content/pricing.ts` (its copy).
- **Changed:** `src/components/site-nav.tsx` (tab row removed, burger and overlay ungated, gutters, hrefs), `src/components/site-footer.tsx` (hrefs), `src/content/copy.ts` (`NAV` reshaped), `src/lib/types.ts` (`ROUTES` + `sectionHref`).
- **Decisions:** `docs/decision-log.md` **#22–#24**, plus the "Still open (owner)" footer maintained in place.
- **Docs:** `03-site-architecture.md` (v2.2), `04-ux-spec.md` (v3.2), `06-taxonomy.md` (v2.2), `07-technical-spec.md`, `01-vision.md`, `02-prd.md`, `README.md`.

Six source files, +270 / −50 before docs.

## The nav

The bar is now the wordmark slot and one burger, `justify-between`, at every width. Deleting the tab row is the whole change to the bar — the burger simply lost `md:hidden`, and so did the overlay. Bar height is unchanged: the tab row's items and the burger both carry `min-h-11`, so the tallest child is 44px either way.

**The overlay gained the bar's gutter ladder** (`px-6 / sm:px-8 / lg:px-16`). It was flat `px-6`, which already drifted 8px from the bar between `sm` and `md` — a window nobody looked at, because the overlay only opened below `md`. Opening it at every width would have turned that into a sideways jump of up to 40px at `lg`. This is the one change to the overlay beyond removing its breakpoint gate.

Everything else about the overlay is untouched and verified intact at desktop: focus moves to Close on open, Tab cycles inside and wraps, Escape closes, `body` scroll locks and unlocks, focus returns to the burger, `aria-expanded` tracks.

## Pricing is a route, so the item shape had to change

`NAV.items` used to be `{ id: SectionId, label }`, and each consumer built the hash itself from `id`. That shape cannot express a route at all, and the derived hash breaks the moment a second route exists: a bare `#work` resolves against the *current* route, so on `/pricing` it means `/pricing#work` — nothing. Six dead links, silently.

Items now carry a finished, **root-relative** `href`. Anchors are built by `sectionHref()` in `src/lib/types.ts`:

```ts
export const sectionHref = <T extends SectionId>(id: T): `/#${T}` => `/#${id}`;
```

Generic on purpose. A plain `(id: SectionId) => string` would have thrown away the typo-safety the old shape gave for free; this keeps the literal, so a mistyped anchor still fails typecheck rather than shipping a dead link. `ROUTES` sits beside it as the canonical route list.

On `/` the change is a no-op: `/#work` and `#work` are the same document and the same fragment navigation, so the motion-gated smooth scroll behaves exactly as before. Measured: all five anchors still land at exactly **80px** from the viewport top, the `scroll-margin-top: 5rem` that clears the 68px shrunken bar.

**The footer picked up both changes for free** because it maps the same array — which is the argument for one source rather than two. A footer deriving its own hash would have grown a dead link and a missing item in the same commit.

## The wordmark, and the one place this brief contradicts itself

The brief is emphatic that `brand-wordmark.tsx` and the nav's wordmark branch are out of bounds, and its reviewer checklist asks for "no change to the nav's wordmark branch". It also requires that from `/pricing`, "every nav item, every footer item and both wordmarks land correctly on the home page."

**Those two cannot both hold.** The wordmark links are `href="#top"`, which on `/pricing` resolves to `/pricing#top` — the exact dead link the unit exists to prevent. The three of them are now `href={NAV.home}` (`/#top`).

That is the **only** change inside the wordmark branch: one attribute value. No change to `brand-wordmark.tsx`, the hero's `<header>`, the 80px handoff, the size, the position, or the markup structure. Flagged rather than resolved silently, per the brief's own instruction to trust the code over the document.

## `/pricing`

Layout-final and deliberately empty: nav, footer, page metadata, flat `ink`, and a bottom-anchored `min-h-dvh` band repeating the hero's posture. `display`-scale `SectionHeading`, one gold payoff word, **no text shadow** (plain ink — §Typography bans it, the same rule the Work band follows). Copy lives in `src/content/pricing.ts`. **No prices, no tiers, no bullets** — Unit 23's, and Rule 4.3 forbids inventing them.

`ScrollVideo` is not mounted. The backdrop belongs to the home page and its range is measured from *that* page's hero-plus-opaque region (#17); nothing here goes near it.

### The lockup, and the 28px hole a literal copy would have left

`/pricing` has no hero, so nothing supplies the above-the-fold lockup unless the page does. It does, at the hero's exact geometry — **measured identical at 1920×1080: `top 24, left 64, 127.8 × 28` on both pages.**

It is **not** a plain `absolute` copy of `hero.tsx`, and that is deliberate. The hero's lockup is `absolute` inside a stage that is `sticky` across 160vh of runway, so it holds the top of the viewport far past the 80px handoff. Reproduced as a bare `absolute` on a page with no runway, it scrolls out of view at **52px** while the bar's does not appear until **80px** — a 28px window with no logo on screen anywhere, which is precisely the blink outcome 6 exists to prevent.

The fix is a zero-height sticky wrapper:

```tsx
<div className="sticky top-0 z-10 h-0">
  <header className="px-6 py-6 sm:px-8 lg:px-16">…</header>
</div>
```

`h-0` keeps it out of the flow so the lockup still paints at the hero's exact 24px offset; sticky pins it for the section's full viewport, covering the handoff. Pure CSS, so no-JS behaves the same. Verified by sampling every scroll position through the handoff (0 · 20 · 40 · 52 · 60 · 70 · 79 · 81 · 90 · 120 · 300): **a wordmark is on screen at all of them**, with the bar's arriving at 81 and the page's covered by the 95%-opaque bar from then on — the same mechanism as `/`.

**It is not a link.** The fixed bar spans the top band at `z-40` and swallows every click there, so a linked lockup would be a link that cannot be clicked. Verified with `elementFromPoint`. Going home is carried by the bar's own wordmark past 80px, the footer's, and the menu.

## The backdrop cadence — measured, not asserted

Decision #17 pins `range = (scrollHeight − innerHeight) − max(0, opaqueBottom − innerHeight)`. `<main>` is untouched, and the nav is fixed and out of flow, so the **only** thing in this unit that could move `range` is the footer growing a line for a sixth item.

It does not, at any width. Measured in-browser by hiding the sixth list item and re-reading:

| Viewport | footer h (6 items) | footer h (5) | `range` (6) | `range` (5) | Δ |
|---|---|---|---|---|---|
| 360×720 | 421 | 421 | 5808 | 5808 | **0** |
| 414×896 | 421 | 421 | 5568 | 5568 | **0** |
| 640×800 | 373 | 373 | 5435 | 5435 | **0** |
| 768×1024 | 353 | 353 | 4944 | 4944 | **0** |
| 1024×768 | 313 | 313 | 5079 | 5079 | **0** |
| 1280×720 | 313 | 313 | 4724 | 4724 | **0** |
| 1920×1080 | 313 | 313 | 4532 | 4532 | **0** |

And the boundary frames still hold: **clip 1 at `t = 0.002` the instant the backdrop becomes visible; clip 3 at `8.042 / 8.042` at page bottom.**

The stronger result is upstream of all of it: the home page's rendered `<main>` is **byte-identical to `main` @ `4ecead6`** — 48,152 bytes on both sides, diffed from the two production builds. Everything below the nav is literally unchanged.

## Deviations — flag at review, not silently resolved

1. **The nav's wordmark branch is touched.** One attribute, `href="#top"` → `href={NAV.home}`, in both nav instances and the footer. Unavoidable; see above. The reviewer's "no change to the nav's wordmark branch" check will show it.
2. **No-JS narrowing.** The overlay is closed at server render, so its items are not in the SSR HTML — meaning the tab row *was* the nav's only no-JS surface, and without scripting the bar is now a lockup and an inert burger. The burger was already inert without JS at mobile widths, and `SiteFooter` renders the same six as plain anchors on every page, so **no destination becomes unreachable**. Recorded in decision #22 as an accepted narrowing; the fix, if it is not acceptable, is under Recommendations.
3. **The `/pricing` lockup is a sticky wrapper, not a literal `absolute` copy of `hero.tsx`.** The brief said to copy the hero's pattern; copying it literally leaves a 28px hole. Reasoning and measurement above.
4. **The overlay's gutters changed** beyond removing the breakpoint gate. Alignment correctness, not taste; it also fixes a pre-existing 8px drift between `sm` and `md`.
5. **`PRICING.title` uses a pipe, not an em dash.** `SITE.title` separates with an em dash, but it is canonical copy approved under decision #3 and predates #19. A new string does not inherit that exception, so the two titles now separate differently. Not resolved by editing approved copy.
6. **The burger glyph sits 12px inside the gutter**, because it is a 20px icon centred in a 44px target. Pre-existing, but more visible now that it is the only thing on the right at desktop, where the tab row's text used to end flush. `SiteFooter` solves the identical problem with `-mx-3`. Not applied — it would move the shipped mobile burger — but it is the one-class fix if the owner wants glyph-flush alignment.
7. **`site-nav.tsx`'s `<span aria-hidden>` comment still says "right-aligning the links".** It right-aligns the burger now. Left alone deliberately, to keep the diff inside the wordmark branch to the single unavoidable attribute.
8. **Docs fixed beyond the brief's named list.** `03-site-architecture.md` §Navigation still recorded `SiteNav`/`SiteFooter` as RETIRED and unmounted — stale since Redesign Unit 02 remounted them, and squarely a nav description, so the grep sweep the brief asked for caught it. `04-ux-spec.md`'s dormant-file list named `site-nav.tsx` for the same reason. `07-technical-spec.md`'s System overview and project tree, and `README.md`'s "Single-page marketing site", assert a structure #23 falsifies. `01-vision.md` and `02-prd.md` had the same claim and got one-clause fixes. **Revert any of these if you would rather they lived only here.**

## Found in the sweep, not fixed

- **Decision #19 is broadly unenforced.** A scan of `src/content/*.ts` with doc blocks stripped finds **36 lines carrying an em dash** in rendered strings — roughly 18 of them on live surfaces: `SITE.title`, `SITE.description`, `NOT_FOUND.body`, two `PROCESS` phase descriptions, and 13 strings in `modal.ts`. The rest are dormant (`HERO`, `FIT`, `TESTIMONIALS`, `faq.ts`) or transactional email. #19 says it binds "every user-facing string in `src/content/`", so the rule and the code disagree today. **Not touched** — that is shipped, owner-approved copy, and Rule 4.1 makes editing it an owner decision. This is the concrete cost of the em-dash gate that notes 20 and 21 both recommended and nobody has built.
- **Cross-document fragment landing sits 76px low.** Hard-navigating to `/#about` lands the section at 156px from the viewport top instead of the 80px a same-page click produces. **Pre-existing and unrelated to this unit** — reproduced identically by a plain hard reload of `/#about`, a path that exists on `main` today and touches none of this code. The link is not broken; the section is fully in view. Worth its own look if deep-link precision matters.
- **"Five sections" drift.** `01-vision.md` and parts of `02-prd.md` / `03-site-architecture.md` still say five sections; #16 made it six. Pre-existing from PR #27, flagged in place, deliberately not reconciled here.

## Recommendations (not built)

- **A `@media (scripting: none)` fallback row for the nav**, if deviation 2 is not acceptable. Render the six as a `display: none` row and reveal it only under `scripting: none` — default-hidden, so a browser without the `scripting` media query falls back to *no* row rather than a visible tab row at every width, which is the safe direction. Roughly a dozen lines of JSX and one rule in `globals.css`. Deliberately not bundled: it re-adds the markup this unit deletes, and whether it earns that is the owner's call.
- **The em-dash scan for `check-banned-terms.mjs`**, third time of asking (notes 20 and 21). The count above is what it would catch on day one, which is also why it needs an owner decision about the existing copy before it can be turned on.
- **`robots: { index: false }` on `/pricing`** while it is a placeholder, if it is going to sit empty for long. Not added — an unremoved `noindex` in Unit 23 would be worse than a briefly-indexed placeholder.

## Verification

`lint`, `typecheck`, `build`, `banned-terms` green. The gate picked up the new route on its own (37 files scanned, `pricing.html` and `pricing.rsc` included) with no change to `check-banned-terms.mjs`, exactly as the brief predicted.

In-browser, dev server, `prefers-reduced-motion: no-preference` confirmed:

- **360 · 767 · 768 · 1024 · 1280 · 1920** — no tab row at any width, burger present and 44×44 at all of them, right edge on the gutter ladder (24 / 32 / 64px).
- **Overlay at 1920 and 360** — covers the viewport, six items in order, `padding-left` matches the bar, Tab wraps after Pricing back to the lockup, Escape closes, focus returns to the burger, scroll lock applied and released.
- **From `/pricing`**, all 14 internal links (7 overlay + 7 footer) resolve to a real target: every hash exists in the home document, `/pricing` returns 200, and not one resolves to a `/pricing#…` dead end. End-to-end click of footer About from `/pricing` lands on `/#about` with the section in view.
- **From `/`**, all five anchors land at exactly 80px; `/pricing` navigates.
- **`/pricing` lockup** pixel-identical to the home hero's; no scroll position between 0 and 300 without a wordmark on screen.
- **Home page** `<main>` byte-identical to `main` @ `4ecead6`; backdrop `range` unchanged at seven viewports; boundary frames `0.002` and `8.042 / 8.042`.
- **Console** clean on both routes. The only 400s are the Apollo visitor pixel rejecting `localhost` — pre-existing (build-note 19), not app code.
- `git diff --stat` — six source files, eight doc files, this note. No formatting churn. `NSOS-Transfer/` untouched and still untracked.
