# Runbook — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active (pre-launch draft)
**Answers:** How do we run it?
**References:** `07-technical-spec.md` (what's deployed)

---

## Deployment process

1. Work merges to `main` on GitHub (`nextsketch-website`).
2. Vercel auto-builds and deploys `main` to production; every branch/PR gets a preview URL.
3. CI gate: build fails on banned-term grep hit (Rule 3.2/3.4) or type errors.
4. Verify after deploy: set the env vars below, then run the **Production smoke test (Sprint 02 capture)** below. The **Sheet is the durable record** — not the email (email is best-effort notification, build-notes 10–11); when triaging "no lead," check the Sheet first.

## Production smoke test (Sprint 02 capture)

Run on the deployed site **after** the env vars below are set. Proves both doors and honest failure handling end-to-end (Unit 05 verification gate).

1. **Quick path:** open the modal (it opens to the quick door) → fill name + email + a line → "Talk to Us" → success ("…within two business days"). Confirm all four artifacts: a Sheet row (`lead_type: quick`, signal `[Lead — quick]`), an Asana task, the lead auto-reply, and Nate's `[Lead …]` alert.
2. **Full qualifier:** "Rather walk us through it?" → answer the four questions on a qualified (non-exploring) path → contact step → submit. Confirm the same four artifacts (`lead_type: qualified` or `flagged`).
3. **Off-ramp capture:** pick "I'm still exploring" → off-ramp → "Stay in Touch" with name + email. Confirm the gentle success, a Sheet row (`lead_type: exploring`, signal `[Lead — exploring]`), and the gentler auto-reply (no two-day promise).
4. **Honest failure (no fake success):** temporarily point `LEADS_SHEET_WEBHOOK_URL` at a failing/empty value and submit → the modal shows "That didn't go through — your answers are safe." with answers preserved + the escape hatch (Rule 2.7); restore the webhook after.
5. **As-built checks:** modal renders full-height on mobile (≤375px); reduced-motion users get no animation; banned-terms gate green (CI).

## Environment variables

Set in Vercel project settings for **Production and Preview**; never committed. Local dev uses `.env.local` (gitignored). Names only here — values live in Vercel.

| Var | Purpose | Gating |
|---|---|---|
| `LEADS_SHEET_WEBHOOK_URL` | Apps Script web-app URL for the "Inbound Leads" Sheet; appends a row, returns 2xx on success | **Durable record — gates capture success.** Unset ⇒ every capture honestly reports not-ok (no fake success). **Set this first.** |
| `ASANA_ACCESS_TOKEN` + `ASANA_PROJECT_ID` | Open a task in the Asana "Inbound Leads" project | Best-effort. Unset ⇒ task skipped, capture still succeeds. |
| `RESEND_API_KEY` | Resend key for the lead auto-reply + Nate's alert | Notification only (best-effort, via `after()`). Unset ⇒ emails skipped, lead still captured. |
| `NOTIFY_EMAIL` | Recipient of the `[Lead …]` alert (Nate's inbox) | Unset ⇒ alert skipped (auto-reply unaffected). |
| `LEAD_FROM_EMAIL` *(optional)* | Verified branded sender (e.g. `"NextSketch <hello@nextsketch.com>"`) | Unset ⇒ sends from Resend's interim onboarding domain (Decision 3); set once DNS verifies. |

When building the Apps Script: format the lead columns as plain text (or prefix `= + - @`) to neutralize spreadsheet formula injection (build-note 10). The pre-pivot table listed only `RESEND_API_KEY` / `NOTIFY_EMAIL`; the Sheet + Asana vars were added in Sprint 02 Units 02–03.

## Domain migration — Webflow → Vercel (one-time cutover)

Owner confirms: domain currently points to Webflow; owner controls it.

1. Build complete and validated on the Vercel preview/`*.vercel.app` domain first.
2. In Vercel: add `nextsketch.com` + `www.nextsketch.com` to the project. Vercel shows required DNS records.
3. At the DNS host (where nextsketch.com's nameservers point — check before cutover): replace Webflow records with Vercel's (`A 76.76.21.21` for apex, `CNAME cname.vercel-dns.com` for www, per Vercel's instructions at cutover time).
4. Do NOT cancel/delete the Webflow site until DNS has fully propagated and production is verified (keep it 1–2 weeks as fallback).
5. Verify SSL issued by Vercel, both apex and www resolve, www → apex redirect works.
6. Email caution: `hello@nextsketch.com` MX records are independent of the website records — do not touch MX/TXT(SPF/DKIM) entries during cutover.

## Redirects (set in `next.config`)

`/projects`, `/projects/*`, `/about-us`, `/contact-us` → `/` (301). Old Webflow URLs die gracefully; preserves any residual link equity.

## Monitoring

- Vercel Analytics: traffic + Web Vitals (review weekly post-launch).
- Lead pipeline: any week with zero `[Lead]` emails AND nonzero traffic → manually test the modal (silent pipeline failure is failure mode #1).
- Resend dashboard: delivery failures/bounces.

> ⚠️ **Sprint 02 (Unit 03) flag — Sprint 03 doc audit, not rewritten here.** Resend now sends **two** emails per capture: the **lead auto-reply** and **Nate's alert** (to `NOTIFY_EMAIL`). They fire via `after()` **only after** the durable Sheet write (Unit 02), so a Resend outage degrades notification but never the captured lead — check the Sheet, not just the inbox, when triaging "no email." Sends are logged in Vercel under `lead-notify:`. Interim sender (Decision 3): until `LEAD_FROM_EMAIL` (verified branded sender) is set, email sends from Resend's onboarding domain — Nate's alert works immediately; the lead auto-reply may be limited to the account's own verified address until DNS verifies. See `briefs/build-notes/11-notify.md`.

## Common failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| Modal always "didn't go through" (no capture) | `LEADS_SHEET_WEBHOOK_URL` unset/wrong, or the Apps Script not returning 2xx | Set/fix the webhook in Vercel env, redeploy; check Vercel logs under `lead-delivery:` |
| Sheet row appears but no Asana task | `ASANA_ACCESS_TOKEN` / `ASANA_PROJECT_ID` unset/invalid (best-effort) | Set/fix in Vercel env; the lead is safe in the Sheet meanwhile (log: "Asana task NOT created") |
| Capture works but no emails | `RESEND_API_KEY` unset/revoked/quota, or `NOTIFY_EMAIL` unset | Set/rotate in Vercel env; check Resend logs + Vercel `lead-notify:` logs (the lead is already captured) |
| Lead emails in spam / auto-reply not reaching arbitrary recipients | Branded domain not verified in Resend (still on interim sender) | Verify `nextsketch.com` SPF/DKIM in Resend, set `LEAD_FROM_EMAIL` |
| Site down after DNS change | Wrong/partial DNS records | Re-check Vercel domain panel; rollback DNS to Webflow values if needed |

> ⚠️ **Sprint 02 Unit 05 flag — Sprint 03 doc audit.** The pre-pivot "All submissions 429 / `lib/rate-limit.ts`" row was removed: rate limiting was **never implemented** (deferred in Unit 01, build-note 09 §3 — in-memory per-IP limiting is unreliable on Vercel serverless). Revisit as its own unit with a shared store if abuse appears; it is not a leak-stopper. The §Redirects (`next.config`) entry is a domain-cutover item and is **out of scope until the Webflow cutover** (Decision 5) — verify it then.

## Rollback procedure

Vercel → Deployments → previous good deployment → "Promote to Production" (instant). For DNS-level disaster in week 1–2: restore Webflow DNS records (Webflow site still live as fallback).

## Access and credentials map

| Asset | Who holds access |
|---|---|
| GitHub repo | Nathan (owner) |
| Vercel project | Nathan |
| Domain/DNS | Nathan (registrar TBD — record here at cutover) |
| Resend account | Nathan (created during build) |
| hello@nextsketch.com inbox | Nathan |
