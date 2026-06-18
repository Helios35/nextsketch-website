# Build Note 13 — Deploy & Smoke (Sprint 02 · Unit 05)

**Date:** 2026-06-18 · **Branch:** `feature/deploy-smoke` · **Sprint 02 (Lead Capture) Unit 05 — the closing gate.**
**Status:** **Blocked-but-prepared.** Everything the build agent can do is done and green (gates + runbook + smoke procedure). The **live production verification is owner-gated and NOT yet done** — it needs the owner setup-checklist credentials in Vercel and the human merge-gate test on the deployed site. **The sprint's exit gate is not passed until that live smoke runs.** No production result was faked (standing rule: "flag, don't fake").

## What this unit is

Verification + deploy only — **no new features** (brief standing rule). The goal is the capture pipeline proven end-to-end on the production deployment for both doors. Per the brief and the access map (`docs/08-runbook.md`), the env provisioning and the live end-to-end are **owner actions** (Vercel + the Resend/Sheet/Asana accounts are Nathan's; the reviewer verification is explicitly "human, at the merge gate").

## What was done (build-agent side, complete)

- **Gates on the real merged build (main + Unit 04):** `lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (route `ƒ /api/qualify`, dynamic) · `banned-terms` ✓ (27 files). Outcome 4 (gates green on the real build) is met.
- **As-built UI checks** (carried from Unit 04 browser verification on the identical, now-merged code): modal opens to the quick door; the full qualifier still runs; the off-ramp captures; a not-ok capture shows the failure-fallback with answers preserved + escape hatch (Rule 2.7); mobile (375px) renders full-height; all new motion is `motion-safe`-gated (reduced-motion intact). No console errors. (See build-note 12.)
- **Runbook updated** (`docs/08-runbook.md`) to reflect what actually shipped in Sprint 02:
  - **Environment variables** — expanded from the pre-pivot `RESEND_API_KEY` / `NOTIFY_EMAIL` to the full set with gating semantics (see below).
  - **Deployment verify step** — now points to the new smoke test and states the **Sheet is the durable record** (not the email).
  - **Production smoke test (Sprint 02 capture)** — a new section: the exact both-doors + off-ramp + forced-failure + as-built checklist to run on the deployed site.
  - **Common failure modes** — replaced the misleading "429 / `lib/rate-limit.ts`" row (rate limiting was never implemented — Unit 01 deviation, build-note 09 §3) with accurate Sheet/Asana/email rows; flagged rate-limit + redirects for Sprint 03.

## Environment variables required in Vercel (names only — values are owner-held)

Set for **Production and Preview**; never committed.

| Var | Role | If unset |
|---|---|---|
| `LEADS_SHEET_WEBHOOK_URL` | Apps Script webhook for the "Inbound Leads" Sheet — **gates capture success** | Every capture honestly reports not-ok (no fake success). **Set first.** |
| `ASANA_ACCESS_TOKEN` + `ASANA_PROJECT_ID` | Asana "Inbound Leads" task (best-effort) | Task skipped; capture still succeeds |
| `RESEND_API_KEY` | Lead auto-reply + Nate's alert (best-effort, via `after()`) | Emails skipped; lead still captured |
| `NOTIFY_EMAIL` | Recipient of the `[Lead …]` alert | Alert skipped (auto-reply unaffected) |
| `LEAD_FROM_EMAIL` *(optional)* | Verified branded sender | Sends from Resend's interim onboarding domain (Decision 3) |

## Owner-gated — blocks the sprint's exit gate (cannot be done by the build agent)

1. **Provision the setup checklist** (sprint plan): create the Resend account + key, the "Inbound Leads" Google Sheet + Apps Script webhook URL, the Asana token + project id; confirm `NOTIFY_EMAIL`. (When building the Apps Script, format lead columns as plain text to neutralize formula injection — build-note 10.)
2. **Set the env vars above in Vercel** (Production + Preview). No repo/Vercel access from the build agent.
3. **Run the production smoke test** (`docs/08-runbook.md` → "Production smoke test (Sprint 02 capture)") on the deployed site: both doors land Sheet row + Asana task + auto-reply + alert; the off-ramp leaves an email; a forced failure preserves answers + shows the escape hatch.
4. **Confirm the production URL** to verify against (domain is still on Webflow — Decision 5; the `*.vercel.app` production URL is the bar this unit deploys to, not the `nextsketch.com` cutover, which is parked).

## Scope held

- **No domain cutover** (Decision 5, parked) — this unit's bar is capture working on the production Vercel app, not the `nextsketch.com` move off Webflow.
- No feature work, no re-skin, no reviving dormant files.

## Open for Nate

1. **Provide / confirm the credentials** are set in Vercel (the four required vars, + optional `LEAD_FROM_EMAIL`). Without `LEADS_SHEET_WEBHOOK_URL` the live smoke can't pass (captures will report not-ok by design).
2. **Run the production smoke test** and tick the reviewer checklist in the brief — that is the gate that closes Sprint 02.
3. **Share the production URL** if you'd like me to do any non-credentialed deploy checks (does the deployed page load / no build error) — I can verify the page renders, but the credentialed end-to-end is yours to run.
4. **Branch pushed, no PR** — `feature/deploy-smoke` is on origin (runbook + this note; no code change). Open the PR when ready.
