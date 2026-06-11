# Build Notes — 01 Foundation

**Branch:** `feature/foundation` · **Date:** 2026-06-11 · **Brief:** `briefs/01-kickoff-foundation.md`

---

## What was created

### Setup (landed on `main` ahead of this unit)
- Scaffold: Next.js 16.2.9 / React 19.2.4 / Tailwind v4 / TypeScript strict / ESLint 9, `src/` dir, `@/*` alias, npm. Deps added: `motion@12`, `zod@4`, `resend@6`, `@vercel/analytics@2`.
- CI (`.github/workflows/ci.yml`): `npm ci` · lint · typecheck · build on every PR + push to `main`, node 24. Proven on the trivial PR #1 (setup-checklist gate).
- `docs/` + `briefs/` copied into the repo root.

### Design tokens — `src/app/globals.css`
Tailwind v4 `@theme` exposing **exactly** the Taxonomy §5 tokens (`paper`, `paper-bright`, `ink`, `white`, `gold`/`gold-ink`, `lavender`/`lavender-ink`, `rose`/`rose-ink`, `sage`/`sage-ink`). The default Tailwind palette is **cleared** (`--color-*: initial`) so off-palette utilities don't compile — the accent-pairing rule is mechanically enforceable. Fonts: `--font-sans` (Inter), `--font-hand` (Caveat) via `next/font/google` variables set in `layout.tsx`.

### Type contracts — `src/lib/`
- `schema.ts`: `qualificationPayloadSchema` (Zod 4) + inferred `QualificationPayload`. `exploring` values are absent from the enums by construction (Rule 2.1); honeypot `_hp` must be empty; `_t ≥ 3000`.
- `types.ts`: `SECTION_IDS`/`SectionId` (Taxonomy §6), `ACCENT_NAMES`/`AccentName`, `Service`, `ProcessPhase`, `FaqItem`.

### Content constants — `src/content/`
`copy.ts` (site meta, nav, hero — Headline Option A, manifesto, process, fit, final CTA), `services.ts` (4 services, Taxonomy §1 slugs + accents), `faq.ts` (6 Q&As verbatim), `modal.ts` (Q1–Q4 + options with Taxonomy §3 payload values, contact fields, escape hatch, off-ramp, success, failure-fallback, nav labels). All typed `as const satisfies` against the contracts. `exploring` exists only in `modal.ts` option lists (UI-only).

### Shared primitives — `src/components/`
`Button` (pill, primary ink/white + secondary outlined, anchor-or-button via discriminated props, ≥44px target, focus-visible outline), `Container` (max-width, renders `<section id>` for Taxonomy §6 anchors), `SectionHeading` (display type per UX spec), `Placeholder` (fixed aspect, `placeholder-{section}-{nn}` naming per Taxonomy §7), `SketchAccent` (underline/circle/arrow, Motion `pathLength` draw-on, ≤600ms, once, accent via static class map + `currentColor`).

### Motion utilities — `src/lib/motion.ts`, `src/lib/use-mounted.ts`, `src/components/reveal.tsx`
Reveal variants (12px rise + fade, 500ms, once, `amount: 0.3`). `<Reveal>` and `<SketchAccent>` are the only animation entry points — ESLint `no-restricted-imports` errors on `motion/react` anywhere else in `src/`.

### Banned-terms gate — `scripts/check-banned-terms.mjs` (`npm run banned-terms`)
Scans built output (`.next/server/app/**/*.{html,rsc}`, incl. segment/prefetch RSC) **and** `src/content/*.ts`. Rule 3.2 + 3.4 term lists; case-insensitive; lookaround word boundaries; normalizes `&#x27;`-style entities, `’`, and `’` before matching; strips tags so terms split across inline elements still match; **fails closed** if nothing was scanned. Final CI step. **Proof in PR #2 history:** seeded "free consultation" → CI red on the banned-terms step → reverted → green.

## Verification performed
- `npm run lint` · `npm run typecheck` · `npm run build` · `npm run banned-terms` green locally and in CI.
- Primitives rendered in isolation on a scratch `/dev` gallery (deleted before merge): tokens, both button variants, all 3 sketch variants × 4 accents, placeholder ratios, reveals with canonical copy.
- Reduced-motion verified with `--force-prefers-reduced-motion` (headless, dev + prod builds): accents render pre-drawn, content instantly visible, no transforms. Normal motion verified in a live browser: draw-on and reveals play once on scroll into view.
- The gate caught a real violation during the build (template page copy "get started" in built output) — removed.

## Decisions & deviations (flagged, not silently resolved)

1. **Fonts approved** — Owner approved **Inter + Caveat** (2026-06-11). UX spec Review Note 1 is **closed**.
2. **Repo made private** — the doc stack (internal strategy/messaging) belongs in the repo per `docs/00-project-setup.md`, but the repo was public. Owner approved flipping `Helios35/nextsketch-website` to **private** (2026-06-11). The confidential brand `.docx` files remain **gitignored** (`docs/brand/`) as defense in depth; they exist only in the local working copy.
3. **SSR renders the static branch** — `<Reveal>`/`<SketchAccent>` render fully visible, pre-drawn content on the server and during hydration; animation mounts client-side when motion is allowed. Deviation from "animate from hidden" naïve SSR: testing showed reduced-motion clients inherited the server's `opacity:0` styles and content stayed invisible (hydration doesn't patch stale style attributes). Side benefit: no-JS visitors get a fully readable page (Business Rules E3).
4. **Meta copy drafted** — `SITE.title`/`SITE.description` written per PRD N4 positioning; not Messaging Kit §05 text. **Needs owner approval.**
5. **Off-ramp copy drafted** — only the opening line is canonical (Rule 2.2). Body + closing in `modal.ts` (`MODAL_OFF_RAMP`) drafted in brand voice. **Needs owner approval.** Same for `MODAL_SUCCESS.headline` and `MODAL_FAILURE` strings.
6. **`layout.tsx` imports `SITE`** — DoD said content constants are imported by nothing; the metadata strings are user-facing copy, and copy-is-code outranks. Only `layout.tsx` imports content; sections still don't exist.
7. **Banned-terms CI step added in this unit**, not at scaffold — the gate is a deliverable of this brief; CI before this PR ran lint/typecheck/build only.
8. **CI node version is 24** (not 22): npm 10 (node 22) rejects lockfiles generated by local npm 11 over bundled optional deps (`@emnapi/*` via `@tailwindcss/oxide-wasm32-wasi`). CI matches the dev machine.
9. **Open owner decisions untouched** — PRD Review Notes 1 (stat strip), 2 (footer socials), 3 (testimonial copy) remain open; Tech Spec Review Note 1 (Resend) needed before `lead-api`.

## Naming reference
Components PascalCase in kebab-case files (`section-heading.tsx` → `SectionHeading`). Content constant exports: `SITE`, `NAV`, `HERO`, `MANIFESTO`, `PROCESS`, `FIT`, `FINAL_CTA`, `SERVICES`, `SERVICES_HEADLINE`, `FAQ_ITEMS`, `MODAL_QUESTIONS`, `MODAL_CONTACT`, `MODAL_ESCAPE_HATCH`, `MODAL_OFF_RAMP`, `MODAL_SUCCESS`, `MODAL_FAILURE`, `MODAL_NAV`. Placeholder assets land in `public/placeholders/` per Taxonomy §7.

## What downstream units inherit
Import copy from `@/content/*`, types from `@/lib/types`, the payload schema from `@/lib/schema`. Animate **only** via `<Reveal>`/`<SketchAccent>` (lint enforces). Accent backgrounds always pair with their `-ink` text class. Placeholders via `<Placeholder section index ratio>`.
