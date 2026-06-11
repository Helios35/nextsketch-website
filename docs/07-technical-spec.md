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

## Environment variables

| Var | Purpose | Where set |
|---|---|---|
| `RESEND_API_KEY` | Email provider auth | Vercel project settings (prod + preview) |
| `NOTIFY_EMAIL` | Lead destination, `hello@nextsketch.com` | Vercel project settings |

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
