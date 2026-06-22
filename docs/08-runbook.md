# Runbook — NextSketch Website Rebuild

**Version:** 2.0 · **Date:** 2026-06-22 · **Status:** Active (pre-launch) — reconciled to the as-built pipeline (Sprint 03 doc audit)
**Answers:** How do we run it?
**References:** `07-technical-spec.md` (what's deployed)

> **Reconciliation tags (Sprint 03 audit, 2026-06-22):** **CURRENT** (true as-built) · **CHANGED** (rewritten to as-built) · **DEFERRED** (planned, not executed). The Sprint 02 ⚠ flag notes (monitoring, failure modes) are now **ratified into the sections below** and the flags retired. The Webflow→Vercel domain cutover is documented but **not executed** (decision-log #5, parked).

---

## Deployment process — **CURRENT**

1. Work merges to `main` on GitHub (`Helios35/nextsketch-website`, private — decision-log #2).
2. Vercel auto-builds and deploys `main` to production; every branch/PR gets a preview URL.
3. CI gate: build fails on banned-term grep hit (Rule 3.2/3.4) or type errors.
4. Verify after deploy: set the env vars below, then run the **Production smoke test** below. The **Sheet is the durable record** — not the email (email is best-effort notification). When triaging "no lead," check the Sheet first.

## Production smoke test (lead capture) — **CURRENT**

Run on the deployed site **after** the env vars below are set. Proves both doors and honest failure handling end-to-end.

1. **Quick path:** open the modal (it opens to the quick door) → name + email + pick a need → "Talk to Us" → success ("…within two business days"). Confirm all four artifacts: a Sheet row (`lead_type: quick`, signal `[Lead — quick]`), an Asana task, the lead auto-reply, and Nate's `[Lead …]` alert.
2. **Full qualifier:** "Rather walk us through it?" → answer the four questions on a qualified (non-exploring) path → contact step → submit. Confirm the same four artifacts (`lead_type: qualified` or `flagged`).
3. **Off-ramp capture:** pick "I'm still exploring" → off-ramp → "Stay in Touch" with name + email. Confirm the gentle success, a Sheet row (`lead_type: exploring`, signal `[Lead — exploring]`), and the gentler auto-reply (no two-day promise).
4. **Honest failure (no fake success):** temporarily point `LEADS_SHEET_WEBHOOK_URL` at a failing/empty value and submit → the modal shows "That didn't go through — your answers are safe." with answers preserved + the escape hatch (Rule 2.7); restore the webhook after.
5. **As-built checks:** modal renders full-height on mobile (≤375px); reduced-motion users get no animation; banned-terms gate green (CI).

## Environment variables — **CHANGED**

Set in Vercel project settings for **Production and Preview**; never committed. Local dev uses `.env.local` (gitignored). All server-only (no `NEXT_PUBLIC_`). Names only here — values live in Vercel.

| Var | Purpose | Gating |
|---|---|---|
| `LEADS_SHEET_WEBHOOK_URL` | Apps Script web-app URL for the "Inbound Leads" Sheet; appends a row, returns 2xx on success | **Durable record — gates capture success.** Unset ⇒ every capture honestly reports not-ok (no fake success). **Set this first.** |
| `ASANA_ACCESS_TOKEN` + `ASANA_PROJECT_ID` | Open a task in the Asana "Inbound Leads" project | Best-effort. Unset ⇒ task skipped, capture still succeeds. |
| `RESEND_API_KEY` | Resend key for the lead auto-reply + Nate's alert | Notification only (best-effort, via `after()`). Unset ⇒ emails skipped, lead still captured. |
| `NOTIFY_EMAIL` | Recipient of the `[Lead …]` alert (Nate's inbox) | Unset ⇒ alert skipped (auto-reply unaffected). |
| `LEAD_FROM_EMAIL` *(optional)* | Verified branded sender (e.g. `"NextSketch <hello@nextsketch.com>"`) | Unset ⇒ sends from Resend's interim onboarding domain (decision-log #9); set once DNS verifies. |

The "Inbound Leads" Apps Script ships as `scripts/inbound-leads.gs` (build-note 14) — paste it into the bound Sheet, deploy as a Web app (*Execute as: Me*, *Who has access: Anyone*), and use the `/exec` URL as `LEADS_SHEET_WEBHOOK_URL`. The script neutralizes spreadsheet formula injection on write (apostrophe-prefix on `= + - @`).

## Domain migration — Webflow → Vercel (one-time cutover) — **DEFERRED** (parked, decision-log #5)

Documented plan; **not executed**. Today's production bar is the Vercel `*.vercel.app` URL, not the `nextsketch.com` move. Owner confirms the domain currently points to Webflow and the owner controls it.

1. Build complete and validated on the Vercel preview / `*.vercel.app` domain first.
2. In Vercel: add `nextsketch.com` + `www.nextsketch.com` to the project. Vercel shows required DNS records.
3. At the DNS host (check where the nameservers point before cutover): replace Webflow records with Vercel's (`A 76.76.21.21` apex, `CNAME cname.vercel-dns.com` www, per Vercel's instructions at cutover time).
4. Do NOT cancel/delete the Webflow site until DNS has fully propagated and production is verified (keep it 1–2 weeks as fallback).
5. Verify SSL issued by Vercel, both apex and www resolve, www → apex redirect works.
6. **Email caution:** `hello@nextsketch.com` MX records are independent of the website records — do not touch MX / TXT (SPF/DKIM) entries during cutover. (SPF/DKIM **are** edited separately to verify the Resend sending domain — a different task from the website A/CNAME cutover.)

## Redirects (set in `next.config`) — **DEFERRED** (verify at cutover)

`/projects`, `/projects/*`, `/about-us`, `/contact-us` → `/` (301). Old Webflow URLs die gracefully; preserves residual link equity. A domain-cutover item — verify when the cutover runs (decision-log #5).

## Monitoring — **CURRENT**

- **Vercel Analytics:** traffic + Web Vitals (review weekly post-launch).
- **Lead pipeline:** any week with zero captures AND nonzero traffic → manually run the smoke test (silent pipeline failure is failure mode #1). The **Sheet is the source of truth** — check it, not just the inbox.
- **Email (Resend):** Resend sends **two** emails per capture — the lead **auto-reply** and Nate's **alert** — fired via `after()` **only after** the durable Sheet write, so a Resend outage degrades notification but never the captured lead. Sends are logged in Vercel under `lead-notify:`; delivery failures/bounces show in the Resend dashboard. Interim sender (decision-log #9): until `LEAD_FROM_EMAIL` is set, email sends from Resend's onboarding domain — Nate's alert works immediately; the lead auto-reply may be limited to the account's own verified address until DNS verifies.
- **Delivery logs:** Sheet/Asana outcomes log in Vercel under `lead-delivery:` (incl. "Asana task NOT created — lead is safe").

## Common failure modes — **CURRENT**

| Symptom | Likely cause | Fix |
|---|---|---|
| Modal always "didn't go through" (no capture) | `LEADS_SHEET_WEBHOOK_URL` unset/wrong, or the Apps Script not returning 2xx | Set/fix the webhook in Vercel env, redeploy; check Vercel logs under `lead-delivery:` |
| Sheet row appears but no Asana task | `ASANA_ACCESS_TOKEN` / `ASANA_PROJECT_ID` unset/invalid (best-effort) | Set/fix in Vercel env; the lead is safe in the Sheet meanwhile (log: "Asana task NOT created") |
| Capture works but no emails | `RESEND_API_KEY` unset/revoked/quota, or `NOTIFY_EMAIL` unset | Set/rotate in Vercel env; check Resend logs + Vercel `lead-notify:` logs (the lead is already captured) |
| Lead emails in spam / auto-reply not reaching arbitrary recipients | Branded domain not verified in Resend (still on interim sender) | Verify `nextsketch.com` SPF/DKIM in Resend, set `LEAD_FROM_EMAIL` |
| Site down after DNS change | Wrong/partial DNS records | Re-check Vercel domain panel; rollback DNS to Webflow values if needed |

*(There is no rate-limit / `429` failure mode: rate limiting was never implemented — in-memory per-IP limiting is unreliable on Vercel serverless; deferred to its own unit with a shared store if abuse appears — build-note 09 §3.)*

## Rollback procedure — **CURRENT**

Vercel → Deployments → previous good deployment → "Promote to Production" (instant). For DNS-level disaster in week 1–2 of a cutover: restore Webflow DNS records (Webflow site kept live as fallback).

## Access and credentials map — **CURRENT**

| Asset | Who holds access |
|---|---|
| GitHub repo (`Helios35/nextsketch-website`, private) | Nathan (owner) |
| Vercel project | Nathan |
| Domain/DNS | Nathan (registrar — record here at cutover) |
| Google Sheet "Inbound Leads" + Apps Script | Nathan |
| Asana "Inbound Leads" project + access token | Nathan |
| Resend account | Nathan |
| `hello@nextsketch.com` inbox + `NOTIFY_EMAIL` (alert) inbox | Nathan |
