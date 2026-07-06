# Build Note 16 — Hero-Derived Design System (Redesign Unit 01)

**Date:** 2026-07-06 · **Branch:** `docs/ui-spec-hero-system` · **Brief:** Redesign Unit 01 (workspace `briefs/redesign/01-ui-spec-design-system.md`)
**Status:** Docs-only. Pushed for review, **no PR** (per owner policy — Nate opens the PR).

## What changed

Rewrote `docs/04-ux-spec.md` (v2.0 → **v3.0**) from a reconciliation-tagged component list into a **reusable, hero-derived design system** — the shared language the five redesign sections (Manifesto, Services, Process, About, Final CTA — decision-log #13) will be built against. Every rule was traced from the as-built source (`src/components/hero.tsx`, `hero-cta.tsx`, `qualification-modal.tsx`, `src/app/globals.css`); nothing invented. **No code touched** — the diff is `docs/04-ux-spec.md` + this build note.

## What the system now codifies

- **Color & theme:** dark theme (`ink` surface, `white` text), **`gold` #E4B976 as the only accent** with the binding gold/`gold-ink` pairing rule; the `#0a0a0c` elevated-surface literal ("never pure #000 for elevated surfaces"); and the **white/ink alpha ladders** (hairline, fill, text-hierarchy, overlay/scrim stops) that give the system its texture.
- **Typography:** the three roles (Space Grotesk display · JetBrains Mono uppercase micro-label · body) with shipped scales/tracking, the display→label→body cadence, gold payoff words, the gold-italic aside, and the over-image text-shadow values.
- **Surfaces:** three levels — flat `ink` page, the image band (ink/40 overlay + bottom scrim), and the **glass panel** (translucent near-black + backdrop-blur + hairline border + `--shadow-modal`; no glows), with sub-panel treatment.
- **Spacing/layout/responsive:** the `px-6 → sm:px-8 → lg:px-16` gutter rhythm, bottom-anchored full-bleed composition, the sm: two-column split, measure caps (`max-w-4xl`, `560px` card), vertical cadences, ≥44px touch targets, full-screen-mobile/card-desktop panel posture, anchor scroll-margin.
- **Motion:** the binding contract (CSS keyframes, `motion-safe`-gated, reduced-motion parity, no `motion/react`) plus the shipped vocabulary (`rise-in`, `marquee`, `modal-in`, `step-in`, 150ms micro-transitions) with easings and the Tailwind-v4 standalone `scale`/`translate` transition note.
- **Interaction vocabulary:** divided-arrow advance button, hairline ghost, flat-gold selection rows/tabs, gold underline links, input treatment, the binding gold/white focus-ring rule, the segmented progress meter, the gold diamond marker, inline-SVG-never-lucide.
- A **"How to build a new section from this doc"** checklist up top so a section-builder can work blind.

## Removed / demoted

- The retired **paper / editorial / sketch-accent** system is demoted to a single clearly-labelled **RETIRED** section (was spread through the doc as DEFERRED component specs, a sketch-accent section, deferred motion rows, and deferred responsive/empty-state sections). It's recorded as history that must not be referenced for new sections; dormant code/copy on disk noted as a separate owner call.
- **Owner directive (2026-07-06, this session): gold is the only accent — all other colors orphaned.** `lavender`/`rose`/`sage` (+ `-ink` pairs) and `paper-bright` are now **orphaned** — token names kept in `globals.css` (code untouched), but no design role and unavailable to sections. This supersedes the Sprint-03 "DEFERRED for the multi-section build" posture.
- Tag vocabulary updated accordingly: **CURRENT / CHANGED / RETIRED / PLANNED** (DEFERRED is gone — the old multi-section build is no longer a pending destination; the new sections build on this system).

## Judgment calls (per the brief's standing rule — recommendations, not silent resolutions)

1. **`paper` and the 404.** "Orphan all other colors" collides with the live 404, which uses a light `paper` surface (code wins over doc). Resolved as: `paper` is orphaned *from the design system* with the 404 documented as the one live exception. **Recommend** deciding at review whether the 404 should eventually be re-skinned dark (a future code unit) or stay light.
2. **`gold-ink`, `white`, `ink` kept.** Read the directive as targeting *accent* colors; `gold-ink` is gold's binding pairing partner (modal selection) and `ink`/`white` are the theme, so all three stay.
3. **DEFERRED → RETIRED.** With the accents orphaned and decision-log #13 pointing the five new sections at the dark system, the old multi-section light design can no longer be "deferred, not dead" — it's retired as a direction. Dormant files/copy on disk remain a separate owner decision (build-note 08, open item 3).

## Flagged for reviewer (found, not fixed — other docs are out of scope this unit)

- **`docs/decision-log.md` ends at #12.** The brief cites **#13** (redesign reactivated; section set); the **2026-07-06 orphan-all-but-gold directive** also deserves an entry. Recommend logging both at the next decision-log touch (noted in the spec's Review Note 2).
- **`docs/06-taxonomy.md`:** §1 Services and §2 Process phases still map rose/lavender/sage accent pairs per service/phase; §5 says the non-gold accents are "DEFERRED (multi-section build)"; §9's deprecation row says the light theme is "deferred to the multi-section build". All three are stale under the orphan directive. §6 Section IDs and §7 Placeholders describe the retired build and will need revisiting when the five new sections define their anchors.
- **`docs/02-prd.md`:** F10 still lists "scroll-triggered section reveals + handwritten sketch accents" as DEFERRED; the eleven-section framing in §Overview predates decision-log #13's five-section set.
- **`docs/03-site-architecture.md`:** the deferred multi-section outline (and its section list) predates the #13 section set; 404-paper row is fine (matches the exception).

## Verification

- Diff is docs-only: `docs/04-ux-spec.md` + `briefs/build-notes/16-ui-spec-design-system.md`.
- `npm run lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (unchanged code; run to satisfy the standing DoD).
- Spot-checked every cited class/value against the source files (hero, hero-cta, modal, globals.css); inspiration image (workspace `briefs/next sketch inspo.webp`) used for fidelity only — its rust accent not adopted.
