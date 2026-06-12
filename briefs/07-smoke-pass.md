# Brief 07 — Smoke / Propagation Pass

**Owner (build):** AI coding agent
**Owner (review):** Nate
**Sprint:** Sprint 01 — Full Site Build (`briefs/sprint-01-plan.md`) — unit 07 (verify; closes the sprint)

---

## Project Standards

Read `docs/00-project-setup.md` in full. Read ALL build-notes in `briefs/build-notes/` (01–06) — this unit verifies the sprint against what they say shipped, including every flagged deviation and every draft-pending-approval.

## Component Rules — non-negotiable

This is a verify unit. The default diff is **zero**. Trivial fixes (typos, broken anchor, missing alt text) may land in this branch; anything structural is a finding, not a fix — report it.

## Pre-flight

Confirm a clean working tree and that unit 06 is merged to `main`. Build the report skeleton from the sprint plan's sub-task table before testing anything.

## Branch

`feature/smoke-pass` — per the sprint plan's branch override. May merge with an empty or near-empty diff; the deliverable is the report.

---

## The Problem

Six units merged one at a time, each verified in isolation. Nobody has yet walked the whole site as a visitor would, end-to-end, on one build. Propagation bugs — a section that broke an anchor, a CTA the modal swap missed, a banned term that slipped into composed output — only show up at this level.

## The Outcome We Want

A written verification report (`briefs/build-notes/07-smoke-pass.md`) with evidence per check, covering:

1. **Full-page walkthrough** — every section in canonical order, desktop and mobile breakpoints per the UX spec.
2. **Every anchor** from nav and footer lands correctly; logo scrolls to top; 404 renders and routes back.
3. **Every CTA** opens the modal; all four user flows from `docs/03-site-architecture.md` §User flows traced end-to-end, including the off-ramp exit and the modal-abandoner path.
4. **Language sweep on built output** — `npm run banned-terms` green, plus a manual spot-check of Rule 3.1 (CTA set), 3.3 (vocabulary), 3.4 (retired brand) on the rendered page.
5. **Honest-placeholder audit** — stat strip, work tiles, testimonials, social hrefs: all clearly placeholder, none inventing facts (Rules 4.2–4.3, Decision Log #4–5).
6. **Degradation passes** — reduced motion, no-JS (E3: page readable, CTAs degrade to mailto), keyboard-only through the modal.
7. **Gates** — lint · typecheck · build · banned-terms green in CI on the final merged state.
8. **Open-items ledger** — everything owner-owed before launch, collected from build-notes 01–06 in one list (approvals pending, URLs, stats, Sprint 02 items).

## Scope Guardrails

- Findings beyond trivial fixes get reported with a severity and a recommendation — not fixed in this branch.
- Do not resolve pending owner approvals; list them.

## Spec Updates (if any)

If the walkthrough finds build-vs-docs drift, list it in the report — owner decides which side moves.

## Verification — builder (before handing back)

The report IS the verification. Every check above has a pass/fail and evidence (command output, screenshot reference, or walkthrough note). Fails carry severity + recommendation.

## Out of Scope (do not bundle)

- Fixing structural findings — those become Sprint 02 candidates or pre-launch items.
- Lead API, Vercel deploy, launch readiness — Sprint 02 and the launch gate.

## What Done Looks Like

A report Nate can read in one sitting that says, with evidence: the full site works as one piece, here's everything still owed and by whom. Sprint 01 closes on its merge.

## References

- `briefs/sprint-01-plan.md` — sub-task table + decisions 1–7
- `briefs/build-notes/` 01–06 · `docs/decision-log.md`
- `docs/03-site-architecture.md` §User flows · `docs/05-business-rules.md` §3–4, E1–E3 · `docs/04-ux-spec.md` §Responsive

---

## Verification — reviewer (human, at the merge gate)

- [ ] Report covers all eight areas with evidence; spot-check three claims at random.
- [ ] Open-items ledger matches your own list of what you owe.
- [ ] Any in-branch fixes are genuinely trivial.
- [ ] Sprint 01 gate: ready to plan Sprint 02 (lead API + Vercel).
