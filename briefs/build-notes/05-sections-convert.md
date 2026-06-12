# Build Notes — 05 Sections: Convert

**Branch:** `feature/sections-convert` · **Date:** 2026-06-12 · **Brief:** `briefs/05-sections-convert.md`

---

## What was created

### Components — `src/components/`
- **`FitSection`** (`fit-section.tsx`, server): Who it's for (#fit) — qualify + self-filter (architecture row 9). Statement headline with a sage sketch underline under "ready to move" (the qualifying phrase — self-selection is the section's job), body offset right in the manifesto's editorial rhythm. The second paragraph is the filter that sends explorers away on good terms.
- **`FaqSection`** (`faq-section.tsx`, server): FAQ (#faq) — the six Q&As verbatim from `FAQ_ITEMS`. Accordion per the UX spec's component spec (hairline dividers, plus→minus rotation, one open at a time) on the same native `<details name="faq-item">` exclusive-accordion pattern as Process — reuse, not fork, exactly as build-notes 03/04 directed. Two-column at `lg` (heading left, list right) per the reference layout; all items start closed so the six questions scan as a list.
- **`FinalCtaSection`** (`final-cta-section.tsx`, server): Final CTA (#start) — convert (architecture row 11). Contained ink panel (the About-panel precedent, build-notes 04 deviation 3 reasoning), `FINAL_CTA` headline/body/cta, primary action as `Button variant="inverse"` → `mailto:hello@nextsketch.com` (locked interim behavior, see deviations), gold sketch arrow annotating the CTA (an explicitly licensed placement: "margin arrows pointing to CTAs", UX spec §Sketch accent system), hidden below `md` (deviation 5).

### Shared affordance — `src/components/plus-icon.tsx`
**`PlusIcon`** extracted verbatim from `process-section.tsx` (zero behavior change there — same classes, same geometry) so FAQ reuses the rotating plus→× affordance instead of forking it. See deviation 2.

### Primitive extensions (props, not forks)
- **`Button`** gains `variant="inverse"` (white bg / ink text) — primary's role on ink surfaces. The focus-outline color moved from `BASE` into each variant string: the ring must contrast with the surface the button sits on (an ink ring is invisible on the ink panel; inverse gets `outline-white`). Primary/secondary rendering unchanged.

### Content — `src/content/copy.ts`
- `FAQ` — section heading ("Common questions"). The six Q&As are canonical; **no heading exists in Messaging Kit §05** (architecture row 10 names only the Q&As), so the heading is **DRAFT pending owner approval** (deviation 4).

### Routes — `src/app/page.tsx`
`#fit`, `#faq`, `#start` slots filled in place (min-heights dropped, frame untouched). All ten Taxonomy §6 sections now render — every visible section of the site exists. Stale frame comment about min-height placeholders tidied.

## Verification performed
- `npm run lint` · typecheck · `npm run build` · `npm run banned-terms` green locally (26 files scanned, clean — includes the new copy), re-run after the last code change.
- Browser walkthrough (desktop + 375px mobile): all three sections render per spec; FAQ exclusivity confirmed mechanically (opening item 3 closes item 1; `open` states checked in DOM); plus→× affordance on open; six questions and answers byte-identical to `FAQ_ITEMS`; no horizontal overflow at 375px (`scrollWidth` = viewport).
- Anchors: `#fit`/`#faq`/`#start` land at exactly section top − 80px scroll margin (measured 79/80/80 — subpixel rounding).
- `#start` CTA: `href="mailto:hello@nextsketch.com"`, white-on-ink (computed `rgb(255,255,255)` bg / `rgb(0,0,0)` text on `rgb(0,0,0)` panel), single-line pill, 48px tall (≥44px target).
- No-JS (Business Rules E3): raw server HTML contains every visible string of all three sections, six `<details name="faq-item">` (natively openable JS-free), the mailto, and zero `opacity:0` styles.
- Reduced motion (headless Chrome, `--force-prefers-reduced-motion`): full page visible in the hydrated DOM, zero `opacity:0`, zero rise transforms — accents pre-drawn.
- No console errors or warnings; no server errors.
- No regression: Process accordion exclusivity and plus icons intact after the `PlusIcon` extraction; all ten anchors present; nav and footer untouched; footer mailto intact.

## Decisions & deviations (flagged, not silently resolved)
1. **`#start` interim action is the mailto escape hatch** — locked in the brief (anchoring `#start` to itself is meaningless; mailto matches the E3 degrade path). `Button`'s discriminated href/onClick API means unit 06 swaps the action without restructuring — same seam as the nav and hero CTAs. No modal stub exists.
2. **`PlusIcon` extracted from `process-section.tsx`** — the brief's "do not touch other sections" guardrail collided with the non-negotiable reuse rule (build-notes 03: "reuse, don't fork" for exactly this affordance). Resolved toward reuse with the smallest possible touch: the icon moved verbatim to its own file and process-section's only change is the import. Behavior and rendering there are unchanged (verified above).
3. **FAQ pattern wasn't ambiguous** — the brief offered a judgment call (accordion vs. open list), but the UX spec names it outright: "FAQ accordion: hairline dividers, plus→minus rotation, one open at a time." Built as specified; no recommendation owed. All items start closed (Process's "Strategy open by default" is spec'd for Process only; closed-by-default lets the six questions scan, and `<details>` keeps every answer reachable without JS).
4. **`FAQ.headline` drafted** ("Common questions") — no canonical heading exists for the section. Brand-voice draft following the reference layout's naming; **needs owner approval** (the established drafted-copy pattern).
5. **Final-CTA arrow hidden below `md`** — inside the panel's padding the arrow squeezed the pill into a two-line wrap at 375px, the only wrapping button on the site. The annotation is a desktop flourish; mobile keeps the clean single-line pill.
6. **Final CTA is a contained ink panel, not full-bleed** — same constraint and reasoning as the About panel (build-notes 04 deviation 3): sections render inside the shared `Container` frame. The page now closes ink-panel → footer-ink, matching the reference layout's dark closing run.
7. **Underline target is a presentation marker, not copy** — `"ready to move"` matched against the canonical `FIT.headline` at render (hero/manifesto pattern); if the copy changes the accent degrades to nothing rather than mis-annotating.
8. **Accent assignments:** fit underline sage (presentational; completes the gold/rose/sage spread across the page's three underlines), final-CTA arrow gold on ink (base tone — the pairing rule governs accent *backgrounds*; on ink, the base accent is the contrast-correct choice, matching the white-on-ink text treatment). One-handwritten-element-per-viewport holds — this unit adds no handwritten text.
9. **Brief 05 copied into `briefs/`** — docs-in-repo pattern (unit 02, deviation 8).

## Naming reference
`FitSection` (`fit-section.tsx`) · `FaqSection` (`faq-section.tsx`) · `FinalCtaSection` (`final-cta-section.tsx`) · `PlusIcon` (`plus-icon.tsx`, shared). Content exports added: `FAQ` (heading only — `FAQ_ITEMS` unchanged in `faq.ts`). Primitive props added: `Button variant="inverse"`.

## What downstream units inherit
- **Unit 06 swaps three CTA actions** from `href` to `onClick` via `Button`'s discriminated props: nav + mobile overlay (unit 02), hero (unit 03), and the final-CTA section (`final-cta-section.tsx` — currently `href={mailto}`). The final-CTA's mailto is interim, not an escape-hatch requirement: Rule 2.6 is satisfied by the footer and the modal's own persistent hatch.
- `Button variant="inverse"` is the primary-on-ink treatment for any future dark surface (modal screens on ink, if the design goes there).
- `PlusIcon` is the shared accordion affordance — import from `@/components/plus-icon`, pair with a `group` `<details>`.
- Every visible section of the site now exists; unit 07's smoke pass walks the complete page.
- Owner-owed at launch-readiness (unchanged) + drafted copy awaiting approval now includes `FAQ.headline`.
