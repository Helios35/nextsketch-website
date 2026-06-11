# nextsketch-website

Single-page marketing site for NextSketch — Next.js (App Router) on Vercel.

The canonical documentation stack lives in [`docs/`](docs/); every build unit starts from a brief in [`briefs/`](briefs/) and records its as-built state in [`briefs/build-notes/`](briefs/build-notes/). Conventions, branching, and quality gates are defined in [`docs/00-project-setup.md`](docs/00-project-setup.md).

## Commands

```
npm run dev          # local dev server
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run build        # production build
```

CI runs lint, typecheck, and build on every PR (`.github/workflows/ci.yml`).

_CI smoke check: this line proves the pipeline runs on PRs._
