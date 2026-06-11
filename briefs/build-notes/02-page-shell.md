# Build Notes — 02 Page Shell

**Branch:** `feature/page-shell` · **Date:** 2026-06-11 · **Brief:** `briefs/02-page-shell.md`

---

## What was created

### Components — `src/components/`
- **`SiteNav`** (`site-nav.tsx`, client): sticky top nav per `docs/03-site-architecture.md` §Navigation — transparent over the hero, then solid paper with hairline border and reduced height (py-5 → py-3) past 80px of scroll. The shrink is plain CSS transitions gated by `motion-safe:` (no new animation primitive needed — the judgment call the brief anticipated never arose). Desktop: placeholder wordmark → `#top`, the five Taxonomy §6 anchor links, primary `Button` CTA → `#start`. Mobile (`< md`): hamburger → full-screen paper overlay with the anchors and CTA; Esc closes, body scroll locks while open, focus moves to the close button on open and returns to the toggle on close, `aria-expanded` wired.
- **`SiteFooter`** (`site-footer.tsx`, server): ink block — wordmark → `#top`, the same five anchors in a labeled nav landmark, the visible mailto escape hatch (`SITE.email`, Rule 2.6), legal line `© {year} Next Sketch LLC` (casing per Taxonomy §8), and three social links per `docs/decision-log.md` #4 with placeholder `#` hrefs.

### Routes — `src/app/`
- **`page.tsx`** — the anchored frame: all ten §6 section ids as empty `Container` slots in canonical order (`docs/03-site-architecture.md` §Page structure), each comment-marked with its owning unit (03–05). `min-h-40` keeps anchor navigation observable until real sections land.
- **`not-found.tsx`** — branded 404 at the app root; handles every unmatched URL, renders inside the root layout (nav + footer present), routes back to `/` via a secondary `Button`. Returns a real HTTP 404.
- **`layout.tsx`** — composes `SiteNav` / `{children}` / `SiteFooter`.
- **`globals.css`** — smooth scrolling gated behind `prefers-reduced-motion: no-preference`; `section[id] { scroll-margin-top: 5rem }` keeps section tops clear of the shrunken nav.

### Content — `src/content/copy.ts`
`NAV` gains `label` ("Main") and `menu.open`/`menu.close` (screen-reader copy). New `FOOTER` (landmark label + socials) and `NOT_FOUND` (eyebrow / headline / body / cta).

## Verification performed
- `npm run lint` · `npm run typecheck` · `npm run build` · `npm run banned-terms` green locally (26 files scanned, clean).
- Browser walkthrough: every nav and footer anchor scrolls end-to-end (`#process` settles at exactly section top − 80px scroll margin); nav turns solid + shrinks past 80px and reverts at top; mobile overlay opens/closes via toggle, link click, and Esc; scroll lock and focus restore confirmed.
- 404: branded page renders inside the layout; `curl` confirms HTTP status 404.
- No console errors or warnings.
- No-JS (Business Rules E3): raw server HTML contains all ten anchors, nav landmark, CTA, footer email, and legal line — the page is fully readable and anchor links work without JS (SSR static branch, foundation pattern held). Mobile-overlay toggle requires JS; footer anchors and scrolling cover that path.
- Reduced motion: headless Chrome with `--force-prefers-reduced-motion` renders the full page, no `opacity: 0` styles; transitions are `motion-safe:`-gated and smooth-scroll is media-query-gated.

## Decisions & deviations (flagged, not silently resolved)
1. **Nav is `position: sticky`, not fixed.** "Transparent over hero" reads as a seamless blend with the paper hero background; sticky avoids content-overlap math for every downstream unit. If unit 03's hero needs the nav floating over imagery, revisit then.
2. **404 copy drafted** — `NOT_FOUND` strings drafted in brand voice (Brand Philosophy §8). **Needs owner approval** (Decision Log #3 pattern). "Go to the page" is a navigation control (like `MODAL_NAV`'s Back/Next/Close), not a Rule 3.1 conversion CTA.
3. **Menu/landmark microcopy drafted** — `NAV.label`, `NAV.menu.*`, `FOOTER.label` (screen-reader-facing). **Needs owner approval**, same pattern.
4. **Social placeholders are `#`** — platform set locked per Decision Log #4; real URLs owner-owed at launch-readiness. The "X / Twitter" display label is drafted copy.
5. **`Container` children now optional** — lets the frame render empty anchored slots. Prop extension, no fork.
6. **Empty slots carry `min-h-40`** — purely so anchors observably scroll pre-content; section units replace it with real content.
7. **CTA interim behavior held** — every "Start a Conversation" anchors to `#start` per the locked guardrail. `Button`'s discriminated href/onClick API means unit 06 swaps the action without restructuring. No modal stub exists.
8. **Sprint plan, brief 02, and decision log copied into the repo** — the brief cites repo-relative paths (`briefs/sprint-01-plan.md`, `docs/decision-log.md`) that existed only in the reference folder; followed the established docs-in-repo pattern.
9. **Footer year computed at build time** (`new Date().getFullYear()` in a server component) — refreshes on every deploy; fine for a legal line.

## Naming reference
`SiteNav` (`site-nav.tsx`) · `SiteFooter` (`site-footer.tsx`). Content exports: `FOOTER`, `NOT_FOUND`; `NAV` extended with `label` and `menu`.

## What downstream units inherit
- Units 03–05 fill the `<Container id="…">` slots in `src/app/page.tsx` in place — drop the `min-h-40`, add content, don't touch `layout.tsx` or the frame.
- Unit 06 mounts the modal in `layout.tsx` and swaps the CTA action from `href="#start"` (nav, overlay; the final-CTA section belongs to unit 05).
- Anchor offset under the sticky nav is global (`section[id]` scroll-margin) — no per-section handling needed.
