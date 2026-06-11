# Kickoff Brief — NextSketch Website Rebuild: Foundation

**Branch:** `feature/foundation`
**Date:** 2026-06-11 · **Status:** Ready (blocked only by setup checklist in `docs/00-project-setup.md`)

---

## Project Standards

Before writing any code, read the project setup reference in full:
`docs/00-project-setup.md`

Follow all conventions defined there — branching, naming, commit hygiene, copy-is-code, single responsibility, and quality rules apply to every task in this project, starting with this one. Confirm its setup checklist passes before starting this unit.

---

## Repository Orientation

Key locations (target structure in `docs/07-technical-spec.md`):
- `docs/` — the full canonical doc stack; the only source of truth
- `src/content/` — every user-facing string lives here, typed
- `src/lib/` — shared schema, utilities
- `src/components/` — shared primitives first; check here before creating anything
- `public/placeholders/` — placeholder assets per naming convention

---

## Context

Every downstream unit — the section components, the qualification modal, the lead API — depends on the same groundwork: the color tokens, the type contracts, the canonical copy constants, the motion utilities, and the sketch-accent primitive. If that groundwork doesn't exist first, each unit will invent its own version and they will diverge. This unit creates the foundation. **No pages with real sections. No routes. No modal. No API. Foundation only.**

This unit must be completed and merged before any other unit starts — specifically before `section-shell` units, `qualification-modal`, and `lead-api`.

---

## Before Writing Any Code

Read the following in full:

- `docs/01-vision.md` — why this site exists; what success means
- `docs/02-prd.md` — what's being built; the three REVIEW NOTES that are still open (don't resolve them — they're owner decisions)
- `docs/03-site-architecture.md` — the section map and IDs your scaffolding must anticipate
- `docs/04-ux-spec.md` — color system, typography, sketch accent system, motion inventory; the binding accent-pairing rule
- `docs/05-business-rules.md` — especially §3 language rules (your content constants are the enforcement surface) and §1–2 (the modal contract your types must encode)
- `docs/06-taxonomy.md` — every name, token, slug, and payload value; you never invent alternates
- `docs/07-technical-spec.md` — stack, schema, project structure
- NextSketch Brand Philosophy v1.0 + Messaging Kit v1.0 (in `docs/brand/` if copied, else request from owner) — the voice and the canonical copy itself

---

## What to Build

Outcomes — what exists when this unit is done:

- **Design tokens:** Tailwind theme exposing exactly the Taxonomy §5 color tokens; fonts wired via `next/font` per UX spec Review Note 1 recommendation (flag, don't decide, if the owner hasn't approved the pairing).
- **Type contracts:** `QualificationPayload` Zod schema in `src/lib/schema.ts` per Tech Spec, encoding Taxonomy §3 values; shared TS types for services, phases, FAQ items, section IDs.
- **Canonical content constants:** `src/content/` populated from Messaging Kit §05 — hero, manifesto, process phases, services, who-it's-for, FAQ, final CTA, modal questions/answers — typed against the contracts above. Banned-term lint of this directory passes.
- **Shared primitives:** `Button` (primary/secondary per UX spec), `Container`, `SectionHeading`, `Placeholder` (fixed-aspect, taxonomy naming), `SketchAccent` (SVG stroke draw-on: underline, circle, arrow variants, reduced-motion safe).
- **Motion utilities:** shared reveal variants + reduced-motion hook; the only animation entry point downstream units use.
- **CI banned-terms gate:** implemented and proven failing on a seeded banned term, then green.

**Not in this unit:** page sections, the qualification modal UI, the `/api/qualify` route, nav, footer, 404, any layout composition beyond a bare shell that proves fonts/tokens load. If it's visible to a visitor as content, it's downstream.

---

## Definition of Done

- Primitives render in isolation (scratch page acceptable, deleted before merge).
- Schema compiles; content constants typecheck against contracts; nothing imports them yet.
- `npm run lint` · `tsc --noEmit` · `npm run build` green locally and in CI; banned-terms gate demonstrated.
- Build-notes written to `briefs/build-notes/01-foundation.md`: what was created, what was named what, any deviation from the docs — flagged, not silently resolved.

---

## Judgment Calls

Anything ambiguous comes back with a recommendation — it does not get silently resolved. The open PRD Review Notes (stat strip, footer socials, testimonial copy) and UX Review Note 1 (font pairing) are owner decisions; build around them, don't answer them. A "hold" from the owner is a full stop.
