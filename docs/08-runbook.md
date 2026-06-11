# Runbook — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active (pre-launch draft)
**Answers:** How do we run it?
**References:** `07-technical-spec.md` (what's deployed)

---

## Deployment process

1. Work merges to `main` on GitHub (`nextsketch-website`).
2. Vercel auto-builds and deploys `main` to production; every branch/PR gets a preview URL.
3. CI gate: build fails on banned-term grep hit (Rule 3.2/3.4) or type errors.
4. Verify after deploy: load production URL, open modal, run one test submission, confirm the lead email arrives.

## Environment variables

`RESEND_API_KEY`, `NOTIFY_EMAIL` — set in Vercel project settings for Production and Preview. Never committed. Local dev uses `.env.local` (gitignored).

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

## Common failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| Modal submits but no email | Resend key expired/revoked, or daily quota hit | Rotate key in Vercel env, redeploy; check Resend logs |
| All submissions 429 | Rate-limit too aggressive / shared-IP traffic | Raise limit in `lib/rate-limit.ts`, redeploy |
| Site down after DNS change | Wrong/partial DNS records | Re-check Vercel domain panel; rollback DNS to Webflow values if needed |
| Lead emails in spam | Domain not verified in Resend | Complete Resend domain verification (SPF/DKIM records) |

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
