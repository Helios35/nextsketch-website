# Build Note 08 — Landing Rebuild (dark cinematic hero)

**Date:** 2026-06-14 · **Branch:** `feature/landing-rebuild` · **Owner-directed.**
**Status:** Committed locally, **not pushed, no PR** (per owner policy — Nate opens the PR after he verifies).

## What changed

Replaced the multi-section site with a **single dark cinematic landing hero** — "the landing page is the entire site for now." Adapted from an owner-supplied template (a 21st.dev-style fullscreen hero) and re-skinned to the NextSketch brand. The qualification modal is kept and opens from the hero CTA.

## Decisions (owner-set this session)

- **Fonts (owner choice):** Inter + Caveat → **Space Grotesk** (display/UI) + **JetBrains Mono** (capability strip + mono labels), via `next/font/google` variable fonts. `next/font` self-hosts them at build time — no runtime requests. Inter/Caveat retired.
- **Hero treatment (owner choice):** **dark cinematic re-skin.** Full-bleed background image + layered ink scrims (base `bg-ink/50` + top/bottom gradients) for white-on-dark legibility; white headline with the **gold** brand accent (`#E4B976`) on the two payoff words ("production", "stay"). The template's lime `--primary` was **not** added — brand gold is used.
- **Brand-truth edits to the template:**
  - Dropped the fake 5-person **avatar stack** (NextSketch is one person — Brand Philosophy §10, ABOUT copy).
  - Dropped the invented **revenue-stats marquee** (no social proof, no invented numbers — Brand Philosophy §10, Rule 4.3). Repurposed it into the **capability strip** sanctioned by UX spec §Motion inventory, showing the **four canonical services** (Taxonomy §1, exact casing).
  - Headline = locked **Option A** ("From idea to production. And we stay."). Supporting line = Messaging Kit §03 **Message 4** (verbatim).
- **Qualification modal:** untouched. Hero CTA = "Start a Conversation" (Rule 3.1) → shared `<ModalTrigger>` → modal; no-JS degrades to `mailto` (Business Rules E3).
- **Conventions held:** inline SVG arrow (no `lucide-react`); project's flat `src/components/` structure (not shadcn `/components/ui`); all copy in `src/content/copy.ts` (`LANDING`).
- **Motion:** capability marquee + hero `rise-in` are **CSS keyframes, `motion-safe`-gated** (no `motion/react` import — ESLint `no-restricted-imports` respected; same reduced-motion contract as the modal animations).
- **Shell:** `SiteNav` + `SiteFooter` no longer mounted; body is the dark ink theme. The 404 (`not-found.tsx`) was given its own light paper surface so it stays legible on the dark layout.

## Files

- **New:** `src/components/hero.tsx`.
- **Modified:** `src/content/copy.ts` (added `LANDING`), `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/not-found.tsx`.
- **Dormant (not deleted):** the multi-section component files (sections, `site-nav`, `site-footer`, `container`, `reveal`, `sketch-accent`, etc.) remain on disk but are no longer rendered — non-destructive/reversible. They still compile and are excluded from the build output, so the banned-terms gate does not scan them.

## Verification

- **Gates (local):** `lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ · `banned-terms` ✓ (26 files). CI deferred to PR time (runs on push/PR only).
- **Browser:** desktop 1280×800 + mobile 375×812. Computed fonts confirmed (`Space Grotesk` headline, `JetBrains Mono` strip); accent = `rgb(228,185,118)` = `#E4B976`. CTA opens the qualification modal (Q1 → "Step 1 of 5"), modal renders correctly over the dimmed hero. No console or server errors. Capability strip reads once to AT (duplicate marquee copies `aria-hidden`); headline carries an `aria-label` so its accessible name keeps word spacing.

## Open for Nate

1. **Background image is an INTERIM remote Unsplash placeholder** — replace with a self-hosted brand asset before launch (`LANDING.backgroundImage`).
2. **★ Doc-stack drift:** the doc stack (`02-prd`, `03-site-architecture`, `04-ux-spec`, taxonomy color/typography) still describes the 10-section light (paper/ink, Inter+Caveat) site. This landing supersedes it for the live site — needs a docs pass if the direction sticks.
3. **Dormant multi-section files** — decide delete vs. keep once the direction is confirmed.
4. Confirm the hero supporting line (Message 4) and the wordmark-only header (no nav, no second CTA) read as intended.
5. **No push / no PR** — committed only; open the PR when you've verified.
