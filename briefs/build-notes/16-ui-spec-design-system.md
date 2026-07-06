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

## Flagged for reviewer — RESOLVED same session (owner directed: "address flags now")

The brief's "flag, don't rewrite" guardrail was lifted by the owner after the first commit; a follow-up commit on this branch aligned the stack. Still docs-only.

- **`docs/decision-log.md`:** added **#13** (redesign reactivated — five-section set, per-section design against the system; old eleven-section plan superseded as a destination) and **#14** (gold-only accent; lavender/rose/sage/`paper-bright` orphaned; `paper` = 404 exception). A supersession note was appended to #12.
- **`docs/06-taxonomy.md` → v2.1:** §1/§2 accent-pair columns removed (mappings RETIRED; sections planned per #13); §5 rewritten to gold-only + orphaned set; §6 old anchors RETIRED (per-section anchor calls, old-ID reuse as default where it fits); §7 convention kept, old inventory RETIRED; §9 deprecation log — light-theme row corrected (retired, not deferred) + two new rows (accent pairs → gold-only; eleven-section plan → five-section redesign). DEFERRED tag retired from the legend.
- **`docs/02-prd.md` → v2.1:** Overview/tag-legend reframed around the #13 set; F4/F6/F7 → **PLANNED** (#13); F5/F8/F9 → **RETIRED** (not in the set; return requires a new decision); F10 → sketch accents RETIRED, scroll-video/parallax noted as PLANNED; review notes 1–3 and user stories retagged.
- **`docs/03-site-architecture.md` → v2.1:** the deferred eleven-section table replaced by a **planned five-section set** table (order/anchors confirmed per-section) + a demoted RETIRED record of the old plan; nav/footer explicitly *undecided* (not in the #13 set — owner call at the section units); old scroll journeys RETIRED.
- **`docs/04-ux-spec.md`:** Review Note 2 closed; "flagged for reviewer" cross-references updated to point at the aligned docs.

A full grep sweep (DEFERRED / multi-section / eleven-section / sketch / Caveat / lavender / rose / sage) surfaced drift beyond the original flag list; also aligned:

- **`docs/01-vision.md` → v2.1:** solution shape updated (page grows per #13; eleven-section storytelling RETIRED, not "deferred, not dead"); work-grid non-goal retagged RETIRED.
- **`docs/05-business-rules.md` → v2.1:** rule numbers untouched; 2.6 footer clause reworded (no footer planned), 4.1 copy-canon note points at the #13 sections, 4.2/4.3 retagged RETIRED with their constraints preserved; DEFERRED dropped from the tag legend.
- **`docs/07-technical-spec.md`:** the "`motion` installed for the deferred multi-section reveals" claim corrected (no planned consumer — the design system binds sections to CSS keyframes; uninstall is a future cleanup call); repo-layout comment retagged dormant/retired-plan.
- **`docs/scope-lock-mvp.md`:** locked doc left intact; a dated **supersession banner** added (re-lock loudly): the "returns later" bucket is superseded by #13/#14 — light theme + sketch accents retired for good; pipeline, launch bar, and "Out for good" cuts unchanged.

Left alone deliberately: `00-project-setup.md` + `08-runbook.md` ("deferred" there = domain cutover / rate limiting — unrelated to design); historical decision-log entries #1–#12 (records, not claims — #12 got a one-line supersession pointer); dormant code/copy (code untouched by this unit).

## Verification

- Diff is docs-only: `docs/04-ux-spec.md` + `briefs/build-notes/16-ui-spec-design-system.md`.
- `npm run lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (unchanged code; run to satisfy the standing DoD).
- Spot-checked every cited class/value against the source files (hero, hero-cta, modal, globals.css); inspiration image (workspace `briefs/next sketch inspo.webp`) used for fidelity only — its rust accent not adopted.
