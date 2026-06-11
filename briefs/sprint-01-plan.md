# Sprint 01 — Full Site Build — Sprint Plan

**Source:** Original scope (`docs/02-prd.md` + `docs/03-site-architecture.md`) + foundation build-notes + owner decisions 2026-06-11. No feedback breakdown — this sprint comes from locked scope, not triaged feedback.
**Reference:** `briefs/build-notes/01-foundation.md`
**Started:** 2026-06-11   **Status:** planning
**Branch model:** Documented override — one branch per sub-task (`feature/<unit-slug>`), per the locked branching convention in `docs/00-project-setup.md`. Each merges to `main` after owner review; smaller PRs match the one-owner review capacity.

## What this sprint is

- Every visitor-facing surface of the single-page site, built and merged: nav, all 11 content sections, footer, 404, and the full qualification modal.
- Exit state: the complete page renders with canonical copy and placeholders — everything except live lead delivery (deferred, Decision 1).
- Governing rule: smallest diff that meets the requirement. Extend foundation primitives with props or variants. Nothing gets forked or rebuilt.

## Sub-tasks

| # | Sub-task | Scope shape | Brief |
|---|----------|-------------|-------|
| 02 | `page-shell` — sticky shrinking nav, footer (anchors · mailto · legal · socials), 404, page composition with all section anchors (empty slots) | layout | _written at build time_ |
| 03 | `sections-story` — Hero (#top, incl. placeholder stat strip), Manifesto (#why), Process (#process) | new components | _written at build time_ |
| 04 | `sections-proof` — Selected work (#work), Services (#services), About (#about), Testimonials (#voices, placeholder blocks) | new components | _written at build time_ |
| 05 | `sections-convert` — Who it's for (#fit), FAQ (#faq), Final CTA (#start) | new components | _written at build time_ |
| 06 | `qualification-modal` — full branching flow per Business Rules §1–2: Q1–Q4, off-ramp, contact step, client-side validation against `qualificationPayloadSchema`; interim submit behavior per Decision 2 | flow | _written at build time_ |
| 07 | Smoke / propagation pass — full-page walkthrough, anchors, banned-terms on real output, reduced motion, mobile | verify | _written at build time_ |

Sequenced shell-first so every section sub-task slots into an already-merged page frame; modal last because it's the largest and touches the most rules.

## Decisions log

| # | Item | Decision | Rationale |
|---|------|----------|-----------|
| 1 | Lead API timing | **Deferred to Sprint 02** (`/api/qualify` + Resend + Vercel). Sprint 02 also re-arms the deferred Vercel items in the setup checklist. | Resend account and Vercel project don't exist; only Nate can create them (Tech Spec Review Note 1). Everything visual ships now; nothing visual depends on the API. Owner call 2026-06-11. |
| 2 | Modal submit without an API | A completed qualified path resolves to the **failure-fallback screen** (`MODAL_FAILURE` → email escape hatch, hello@nextsketch.com). No fake success state, no disabled submit. Replaced by the real route in Sprint 02. | Honest interim behavior: a lead who completes the flow still gets a working path to contact (Business Rules Rule 2.4 intent). Site doesn't launch before Sprint 02 anyway. |
| 3 | Stat strip (PRD Review Note 1) | **Build with placeholder stats.** Real numbers from Nate before launch. | Owner call 2026-06-11. Parked: owner Nate, due at launch-readiness check. |
| 4 | Footer socials (PRD Review Note 2) | **LinkedIn, X/Twitter, Instagram.** Built with placeholder hrefs; real URLs from Nate before launch. | Owner call 2026-06-11. Parked: owner Nate, due at launch-readiness check. |
| 5 | Drafted copy | **Approved as canonical** (2026-06-11): `SITE` title/description, `MODAL_OFF_RAMP` body + closing, `MODAL_SUCCESS.headline`, `MODAL_FAILURE`. Closes build-notes deviations 4 and 5. | Owner reviewed the approval gate and shipped the drafts. Promoted to project decision log. |
| 6 | Modal: overlay vs `/start` shallow route | **Builder's call**, recorded in build-notes — exactly as `docs/03-site-architecture.md` already specifies. | Not a plan-level decision; the architecture doc delegated it. |
| 7 | Testimonial copy (PRD Review Note 3) | Unchanged: **placeholder blocks** until original clients re-approve rewritten quotes. Never ship unapproved quotes. | Locked 2026-06-11 pre-sprint; restated so the gate is explicit. |

## What's touched, where

- `src/app/page.tsx` — created in 02, extended by 03–05 (each section slots into its anchor)
- `src/app/layout.tsx` — nav/footer composition (02), modal mount point (06)
- `src/content/*` — read-only imports everywhere; any copy change is a spec change, not a build change
- Foundation primitives (`Button`, `Container`, `SectionHeading`, `Placeholder`, `Reveal`, `SketchAccent`) — reused by every sub-task; lint already blocks raw `motion/react` imports

## Out of scope (this sprint)

- `/api/qualify` route, Resend integration, Vercel project + deploy + env vars → Sprint 02
- DNS cutover, old-Webflow-route redirects, MX-record handling → launch (per `docs/08-runbook.md`)
- Real testimonial quotes, real stat numbers, social URLs, real work imagery → owner-supplied, due at launch-readiness
- Pricing section, contact page, blog, newsletter → cut, locked 2026-06-11

## References

- `briefs/build-notes/01-foundation.md` — canonical naming + what downstream units inherit
- `docs/02-prd.md` · `docs/03-site-architecture.md` · `docs/04-ux-spec.md` · `docs/05-business-rules.md` · `docs/06-taxonomy.md`
- Brand docs (`docs/brand/`, gitignored) — Messaging Kit §05 is canonical copy

## Verification (reviewer, between sub-tasks)

- [ ] Intended change visible
- [ ] Propagation didn't break anything
- [ ] Reuse rule held (primitives extended, not forked)
- [ ] Specs updated (or deviation flagged in build-notes)
- [ ] No scope creep
