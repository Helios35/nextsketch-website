# Build Note 15 — Doc Audit & Re-Lock (Sprint 03 — single docs-only unit)

**Date:** 2026-06-22 · **Branch:** `docs/mvp-audit` · **Sprint 03 (Doc Audit & Re-Lock).**
**Status:** Committed on `docs/mvp-audit`; **no PR** (owner policy — Nate opens/orders the PR after he verifies). Docs-only; no `src/` changes.

## What this unit is

Reconcile the doc stack (`docs/00–08` + `decision-log.md`) to the as-built MVP after the 2026-06-14 pivot and the Sprint 02 lead pipeline, and re-lock scope. Governing rule: **docs follow the build** — the live MVP is the source of truth; the pivot is recorded as as-built, not re-litigated. Run via the `sketch-doc-stack` (audit) and `sketch-scope-lock` skills.

Every reconciled claim carries exactly one tag: **CURRENT** (true as-built) · **CHANGED** (rewritten to as-built) · **DEFERRED** (still the plan for a later multi-section build — preserved, not deleted).

## Pre-flight resolution

- **Uncommitted `decision-log.md`.** Working tree carried an uncommitted change to `docs/decision-log.md` whose diff was exactly the #7–#10 restoration + the #1 supersession note + the post-pivot "still open / resolved" lines. The committed `main` did **not** carry #7–#10. This is precisely the pre-flight's "restore #7–#10 if missing from the committed file — do not lose them" case, so the change was **carried onto `docs/mvp-audit`** (not discarded) and folded into sub-task 04. #7–#10 confirmed present and correct against the as-built.
- Working tree otherwise clean; on `main`, up to date; Sprint 02 PRs (#11–#17) merged.

## What changed (file by file)

| Doc | Version | Headline reconciliation |
|---|---|---|
| `00-project-setup` | 1.0→1.1 | Conventions **CURRENT** (unchanged by pivot); one-time setup checklist marked historical/done; env-var subset now points to `07` (full list). |
| `01-vision` | 1.0→2.0 | Problem/users **CURRENT**; solution **CHANGED** (single dark hero); "modal → hello@" success metric **CHANGED** (durable pipeline); domain cutover **DEFERRED**; multi-section **DEFERRED**. |
| `02-prd` | 1.0→2.0 | Overview/F1/F3/N5 **CHANGED**; F4–F10 sections **DEFERRED**; F11/F12/N1–N4 **CURRENT**; Review Notes 1–2 closed; stat-strip dropped→capability strip. |
| `03-site-architecture` | 1.0→2.0 | Sitemap/page-structure/flows **CHANGED** to the single hero + two-door modal; the 11-section order + nav + journeys preserved as **DEFERRED**; access rules **CURRENT** (+ no-backend). |
| `04-ux-spec` | 1.0→2.0 | Fonts **CHANGED** (Space Grotesk + JetBrains Mono); theme **CHANGED** (dark: ink surface/white text/gold accent); modal skin **CHANGED**; capability strip + live motion **CURRENT**; sketch system, pill buttons, nav, section components **DEFERRED**. |
| `05-business-rules` | 1.0→2.0 | **Two-door + off-ramp capture ratified** into the rules (the ⚠ flag retired); 1.7 (quick door) + 2.2/2.4/2.5/2.8 **CHANGED**; rule numbers kept stable; 3.1 carve-out for "Stay in Touch"; testimonials/work authority **DEFERRED**. |
| `06-taxonomy` | 1.0→2.0 | Services names **CURRENT** (cards/accents DEFERRED); process phases **DEFERRED**; modal answers **CURRENT** + quick-door multi-select labels + `kind`/`source` **CHANGED**; lead types **CHANGED** (`off_ramp`→`exploring`, added `quick`); tokens **CHANGED** theme; section IDs/placeholders **DEFERRED**; deprecation log extended. |
| `07-technical-spec` | 1.0→2.0 | Rewritten to as-built: one `POST /api/qualify` surface; no DB / no-backend invariant; Zod discriminated union + 11-col Sheet record as the contract; Sheet gates success / Asana best-effort / Resend via `after()`; full env-var table; status set (200/503/400/500, no 429); versions (Next 16, React 19, Tailwind v4, Zod v4); repo `Helios35/...` private. Sprint 02 ⚠ flags rewritten in. |
| `08-runbook` | 1.0→2.0 | Sprint 02 ⚠ notes ratified into Monitoring + Failure modes; smoke test, env vars, access map current; domain cutover + redirects tagged **DEFERRED** (parked, #5). |
| `decision-log` | — | #1 (fonts) formally **CLOSED/SUPERSEDED**; #5 (stat strip) annotated superseded; #7–#10 confirmed; added **#11** ("live" definition) + **#12** (audit posture); "still open / resolved" lines updated. |
| `scope-lock-mvp` (new) | — | The re-lock one-pager — what's **live / deferred / cut** + what's next. The fuller scope-and-sequence working plan stays in the workspace (Decision #10). |

## Judgment calls (flagged for Nate, with recommendations)

1. **Color tokens — "retire paper/ink" vs. code reality.** The brief said retire paper/ink, but `src/app/globals.css` (canonical) still defines `paper`/`ink`/`white` + the four accent pairs, and the dark theme is *built from* them (`ink` surface, `white` text, `gold` accent). **Resolution (recommend keeping):** I retired paper/ink **as a current light-theme design claim** but kept the **token names CURRENT** (they're in code), tagged the **theme CHANGED** (dark), and tagged `paper`/`paper-bright` + lavender/rose/sage **DEFERRED** (multi-section). The light `paper` 404 surface stays CURRENT. Honest to the code; flagging because it's a CHANGED-vs-DEFERRED nuance the brief asked not to resolve silently.
2. **Quick door is a multi-select, not "an optional one-line message."** Build-note 12 describes the quick door's optional input as a free-text line, but the as-built (`MODAL_QUICK.needsOptions`, commits under PR #16, labeled "Sprint 03 adhoc") is a **multi-select needs selector** using canonical project-type values with shorter labels. **There is no build-note for that form-tweak change** — a gap. **Resolution:** documented the as-built multi-select in `06`/`05` (code wins); recommend a short retro build-note for the form-tweaks PR so the as-built record is complete.
3. **Off-ramp asks name + email** (build-note 12 open question; decision-log "still open"). Left as as-built and kept on the open list — **not resolved** (owner's call). Recommend keeping name+email; mailto is the zero-friction path.
4. **`00-project-setup` reconciled lightly** though no sub-task named it — Outcome #1 covers `docs/00–08`, and it carried a stale env-var subset + a historical setup checklist. Bumped to 1.1, conventions untouched (CURRENT).

## Deviations from the brief

- **"Retire moot artifacts (`briefs/08-design-followup.md`)" — no-op.** That file does not exist in the repo and is referenced nowhere (`grep` clean). Per Decision #10 briefs live in the workspace, not the repo — so there was nothing to retire. Recorded rather than silently skipped.
- **Re-lock produced two documents** (per `sketch-scope-lock`): the one-pager landed in the repo (`docs/scope-lock-mvp.md`, the brief's deliverable); the fuller scope-and-sequence working plan was written to the **workspace** (`briefs/sprint-03/`), honoring Decision #10 + the brief's "only the doc-stack edits + the re-lock one-pager land here" guardrail.
- **`concept-website-rebuild.md` left untouched** — an upstream brainstorm artifact (status "Concept locked"), explicitly dated/labeled historical and outside the `00–08` stack. Not reconciled by design.

## Verification (builder)

- **Tags:** every reconciled claim carries exactly one CURRENT/CHANGED/DEFERRED tag (each doc opens with the legend).
- **Grep sweeps (docs/):** `Inter`/`Caveat` appear only as retired/superseded context (decision-log #1, deprecation log, the closed UX review note + the CHANGED fonts line) — never a current claim. `paper`/`ink` survive only as token names / the DEFERRED light theme / the genuinely-light 404 / `-ink` accent text / "dark ink shell" — no current light-theme page claim. `eleven`/`multi-section`/`scrolling page`/`sticky nav` all read **DEFERRED** or pivot-history. No surviving `⚠` flags, `429`/rate-limit-as-implemented, `Formspree`, "leads exist only as emails", or "one email to hello@" presented as current.
- **`07` ↔ live code:** endpoint (`POST /api/qualify`, only surface), env-var names, Sheet-gates-success, Asana best-effort, Resend-via-`after()`, no-backend invariant, status set (no 429) — all traced from `src/app/api/qualify/route.ts` + `src/lib/{schema,lead-delivery,lead-format,lead-notify,qualify}.ts` + `scripts/inbound-leads.gs`.
- **`decision-log`:** #1 closed; #7–#10 present and consistent with the reconciled docs; #11/#12 added.
- **Cross-doc references:** consistent; no doc cites retired content as current.
- **Scope:** `git diff --stat main` shows only `docs/` touched — **no `src/` changes**.

## Open for Nate

1. The four **judgment calls** above — especially the color-token resolution (#1) and the missing form-tweaks build-note (#2).
2. **Off-ramp name+email** confirmation (#3) — still on the decision-log open list.
3. **Branch, no PR** — `docs/mvp-audit` is ready for review; open/merge it as one PR before any next-sprint unit starts (per the brief). The fuller scope-and-sequence plan is in the workspace.
