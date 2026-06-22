# Project Setup Reference — NextSketch Website Rebuild

**Version:** 1.1 · **Date:** 2026-06-22 · **Status:** Active — conventions current; one-time setup reconciled (Sprint 03 doc audit)
**Purpose:** Hand-to-agent standards for standing up and working in the repo. Every brief inherits this document.
**References:** `07-technical-spec.md` (stack decisions — binding)

> **Sprint 03 audit note:** the conventions below are **CURRENT** (unchanged by the pivot). The one-time scaffold/setup checklist is **historical** (done in Sprint 01); the canonical, full environment-variable list now lives in `07-technical-spec.md` §Environment variables and `08-runbook.md` (the pre-pivot `RESEND_API_KEY` / `NOTIFY_EMAIL` pair is incomplete — the lead pipeline added the Sheet/Asana vars in Sprint 02).

---

## Repository

- GitHub, owner's personal account, repo name: `nextsketch-website`, default branch `main`.
- `main` is production: every merge auto-deploys via Vercel. Work never lands on `main` directly — branch + PR, even solo.

## Scaffold (one-time)

1. `npx create-next-app@latest nextsketch-website` — TypeScript, App Router, Tailwind, ESLint, `src/` directory, import alias `@/*`.
2. Add: `motion`, `zod`, `resend`, `@vercel/analytics`. Package manager: **npm** (no lockfile ambiguity; owner has no tooling preferences).
3. `.gitignore` includes `.env.local` (scaffold default — verify).
4. Connect repo to Vercel project; set env vars per `07-technical-spec.md`.
5. CI: GitHub Actions on every PR — `npm run lint` · `tsc --noEmit` · `npm run build` · banned-terms gate (grep built HTML output for Rule 3.2/3.4 terms; any hit fails).

## Conventions

- **Branches:** `feature/<unit-slug>` (e.g., `feature/foundation`, `feature/qualification-modal`). One unit, one branch, one PR.
- **Commits:** imperative, scoped, small (`Add color tokens to Tailwind theme`). No drive-by changes outside the unit.
- **Naming:** per `06-taxonomy.md` §8 — PascalCase components, kebab-case files, snake_case payload values, token names exactly as Taxonomy §5.
- **Single responsibility:** one component, one job. Check `src/components/` before creating anything new; extend before duplicating.
- **Copy is code:** all user-facing strings live in `src/content/*.ts`. No string literals for copy inside components. This is what makes the banned-terms gate and future copy edits tractable.
- **Quality bar:** TypeScript strict mode stays on; zero `any`; zero ESLint suppressions without an inline reason comment; every interactive element keyboard-accessible at the time it's built, not retrofitted.
- **Accessibility & motion:** every animation behind the shared reduced-motion utility — no raw `animate` calls in section components.

## Definition of done (every unit)

Lint, typecheck, build green locally and in CI · build-notes written to `briefs/build-notes/` · deviations from docs flagged in the PR, never silently resolved.

## Setup checklist (one-time — completed Sprint 01; historical)

- [x] Repo created, scaffold committed, pushed
- [x] CI runs and passes on a trivial PR
- [x] `docs/` copied into repo root so briefs can cite repo-relative paths

**Was deferred at foundation (owner decision 2026-06-11); resolved in Sprint 02:**
- [x] Vercel connected, preview deploy loads
- [~] Env vars set in Vercel — the full lead-pipeline set (Sheet / Asana / Resend) is in `07-technical-spec.md` §Environment variables; `LEADS_SHEET_WEBHOOK_URL` gates capture and is set first. Live go-live verification is owner-gated (`08-runbook.md` smoke test).
