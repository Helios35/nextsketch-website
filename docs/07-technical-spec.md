# Technical Spec — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active
**Answers:** How is it built?
**References:** `05-business-rules.md` (logic to implement) · `06-taxonomy.md` (names/values) · `08-runbook.md` (ops)

> **REVIEW NOTES**
> 1. **Email provider** — recommendation: **Resend** (free tier, 100 emails/day, first-class Vercel/Next.js integration). Owner has no tools yet; a free Resend account + domain verification is needed during build. Fallback if rejected: Formspree. Decision needed before the lead pipeline unit.

---

## System overview

Statically-rendered single-page marketing site with one serverless API route for lead submission. No database, no auth, no CMS. Content is code (typed constants), since canonical copy is locked in the Messaging Kit and changes are owner decisions.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15+ (App Router, TypeScript) | First-class Vercel target; API route for leads; static generation for speed |
| Styling | Tailwind CSS v4 | Token-based theme matching `06-taxonomy.md` §5 color tokens |
| Animation | Motion (Framer Motion) | Scroll-triggered reveals, modal transitions, SVG stroke draw-on; built-in reduced-motion support |
| Fonts | `next/font/google` | Self-hosted at build; zero layout shift. Pairing per UX Review Note 1 |
| Email | Resend (Review Note 1) | Lead notification per Rule 2.4 |
| Validation | Zod | Schema for modal payload, shared client/server |
| Analytics | `@vercel/analytics` | Zero-config, decision locked |
| Hosting | Vercel (production = `main`) | Decision locked |
| Repo | GitHub, `nextsketch-website`, owner's personal account | Owner said "name it whatever" |

## Data model / ERD

**None at launch — explicit decision.** Leads exist only as emails (Rule 2.4). The Zod schema is the de-facto data contract:

```
QualificationPayload {
  project_type: 'new_product'|'rescue'|'agentic'|'partnership'   // 'exploring' never submits (Rule 2.1)
  readiness:    'now'|'soon'                                      // 'exploring' never submits
  authority:    'full'|'shared'|'none'
  validation:   'validated'|'willing'|'build_first'
  name: string (1..100)
  email: string (valid email)
  company?: string (0..100)
  details?: string (0..1000)
  _hp?: string        // honeypot, must be empty (Rule 2.8)
  _t: number          // ms since modal open, must be ≥ 3000 (Rule 2.8)
}
```

If a database is added later (post-launch), this schema becomes the `leads` table and this section becomes an ERD — versioned change.

## API design

`POST /api/qualify`
- Accepts: `QualificationPayload` (JSON). Validates with Zod; enforces Rules 2.1 (exploring values rejected server-side too), 2.8 (honeypot, timing).
- Does: builds lead email — subject per Rule 2.5 flag logic, body = all answers using Taxonomy §3 display labels + payload values + ISO timestamp. Sends via Resend to `NOTIFY_EMAIL`.
- Returns: `200 {ok:true}` · `400 {ok:false, error}` validation · `429` rate-limited · `500 {ok:false}` provider failure (client then executes Rule 2.7 fallback).
- Rate limit: in-memory/sliding-window per IP, 5/hour (sufficient without persistence; revisit post-launch).

> ⚠️ **Sprint 02 (Unit 03) flag — Sprint 03 doc audit, not rewritten here.** Resend no longer *is* the capture (Unit 02 moved the durable record to the Sheet + Asana). Resend now sends **two notification emails after** a durable capture, fired via `after()` so they run post-response and are best-effort — a send failure never blocks or reverses the capture (no fake failure of a stored lead): (1) an **auto-reply to the lead** honoring the `MODAL_SUCCESS` two-business-days promise, reply-to the brand inbox; (2) a **real-time alert to `NOTIFY_EMAIL`** with the Rule 2.5 signal in the subject and every answer (Taxonomy §3 labels) in the body, reply-to the lead. The "one email to hello@nextsketch.com" framing of Rule 2.4 is the alert recipient question below. See `briefs/build-notes/11-notify.md`.

## Business logic implementation

- Branching (Rules 2.1–2.3): client-side state machine in `QualificationModal`; server re-validates so the off-ramp can't be bypassed by direct POST.
- Language rules (§3): all copy lives in `src/content/*.ts` typed constants — single grep surface. CI check greps built output for Rule 3.2/3.4 banned terms and fails the build on a hit.

## Auth and permissions

None. All public. API route is the only mutation surface, protected per Rule 2.8.

## Error handling

- API: structured JSON errors, no stack traces to client; failures logged via `console.error` (visible in Vercel logs).
- Client: modal submit failure → Rule 2.7 preserve-and-fallback UI.
- Global: Next.js error boundary + custom 404 (PRD F12).

## Dependencies and integrations

Resend (email) · Vercel Analytics · Google Fonts via next/font (build-time only). No other third parties. No cookies beyond Vercel Analytics' cookieless tracking → no cookie banner required.

> ⚠️ **Sprint 02 (Unit 02) flag — reconcile in the Sprint 03 doc audit, not rewritten here.** Lead capture now writes to two destinations (sprint plan Decision 2): the **Google Sheet "Inbound Leads"** (durable system of record, via an owner-provided Apps Script web-app webhook — a plain POST, no new dependency) and the **Asana "Inbound Leads" project** (best-effort task, via the Asana REST API). These are the system of record (no database). See `briefs/build-notes/10-lead-destination.md`.

## Environment variables

| Var | Purpose | Where set |
|---|---|---|
| `RESEND_API_KEY` | Email provider auth | Vercel project settings (prod + preview) |
| `NOTIFY_EMAIL` | Lead destination, `hello@nextsketch.com` | Vercel project settings |

> ⚠️ **Sprint 02 (Unit 02) flag — Sprint 03 doc audit.** Lead destination adds three server-only vars (no `NEXT_PUBLIC_` prefix), all owner-provided via the sprint plan setup checklist and set in Vercel (prod + preview) + local `.env.local`: `LEADS_SHEET_WEBHOOK_URL` (Apps Script web-app URL that appends the row — gates capture success), `ASANA_ACCESS_TOKEN` and `ASANA_PROJECT_ID` (best-effort Asana task). Until `LEADS_SHEET_WEBHOOK_URL` is set, captures honestly report not-ok (no fake success).

> ⚠️ **Sprint 02 (Unit 03) flag — Sprint 03 doc audit.** Notification clarifies/adds env: `NOTIFY_EMAIL` is now the **alert recipient** (Nate's inbox), distinct from the `hello@nextsketch.com` escape hatch / auto-reply reply-to (the table's "Lead destination, `hello@nextsketch.com`" gloss is pre-pivot). New optional server-only `LEAD_FROM_EMAIL` — the verified branded sender (a bare address or `"Name <addr>"`); **when unset, email falls back to Resend's interim onboarding sender** so launch isn't blocked on DNS (Decision 3). `RESEND_API_KEY` unset → notification is skipped (best-effort), the lead is still captured.

## Project structure (target)

```
src/
  app/            — layout, page, api/qualify/route.ts, not-found
  components/     — Nav, Hero, Manifesto, ProcessSection, WorkGrid,
                    Services, About, Testimonials, Fit, Faq, FinalCta,
                    Footer, QualificationModal, SketchAccent
  content/        — copy.ts, faq.ts, services.ts, modal.ts (canonical copy)
  lib/            — schema.ts (Zod), email.ts, rate-limit.ts
public/placeholders/
```
