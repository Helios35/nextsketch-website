# Project Setup Reference — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active
**Purpose:** Hand-to-agent standards for standing up and working in the repo. Every brief inherits this document.
**References:** `07-technical-spec.md` (stack decisions — binding)

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

## Setup checklist (gate before kickoff slice starts)

- [ ] Repo created, scaffold committed, pushed
- [ ] CI runs and passes on a trivial PR
- [ ] `docs/` copied into repo root so briefs can cite repo-relative paths

**Deferred (owner decision 2026-06-11 — not gates for the foundation slice):**
- [ ] Vercel connected, preview deploy loads — required before the `lead-api` unit and before launch
- [ ] Env vars set in Vercel (`RESEND_API_KEY`, `NOTIFY_EMAIL`) — required before the `lead-api` unit can be tested
