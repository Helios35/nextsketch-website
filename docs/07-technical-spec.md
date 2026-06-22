# Technical Spec — NextSketch Website Rebuild

**Version:** 2.0 · **Date:** 2026-06-22 · **Status:** Active — reconciled to the as-built lead pipeline (Sprint 03 doc audit)
**Answers:** How is it built?
**References:** `05-business-rules.md` (logic to implement) · `06-taxonomy.md` (names/values) · `08-runbook.md` (ops) · Live code: `src/app/api/qualify/route.ts`, `src/lib/{schema,lead-delivery,lead-format,lead-notify,qualify}.ts`, `scripts/inbound-leads.gs`

> **Reconciliation tags (Sprint 03 audit, 2026-06-22):** **CURRENT** (true as-built) · **CHANGED** (rewritten to as-built) · **DEFERRED** (not shipped). The Sprint 02 ⚠ flag notes (integrations, env, API, data model) are now **rewritten into the as-built spec below** and the flags retired. Where this doc and the code disagree, the **code wins** — this spec was traced from it.

> **REVIEW NOTES**
> 1. *(closed)* **Email provider** — **Resend** was chosen and is live (account owner-owned). Used for **notification only** (auto-reply + alert), not as the lead record.

---

## System overview — **CHANGED**

A statically-rendered **single dark landing hero** with **exactly one serverless API route** for lead submission (`POST /api/qualify`). **No database, no auth, no CMS, and no backend beyond that one route — ever** (decision-log #8). Content is code (typed constants in `src/content/*.ts`), since canonical copy is locked and changes are owner decisions. The durable lead record is an external **Google Sheet** (+ a best-effort Asana task); the site stores nothing server-side.

## Tech stack — **CURRENT** (versions as-built)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, TypeScript) · React 19 | `/api/qualify` is a Route Handler using native `Request`/`Response` and `after()` from `next/server` |
| Styling | **Tailwind CSS v4** | Token-based theme in `src/app/globals.css` (`@theme`); default palette cleared so only brand tokens compile (`06-taxonomy.md` §5) |
| Animation | CSS keyframes, `motion-safe`-gated | The live hero + modal use CSS keyframes (no `motion/react` import — the `no-restricted-imports` rule). `motion` (Framer) is installed for the deferred multi-section reveals |
| Fonts | `next/font/google` | **Space Grotesk** (display/UI) + **JetBrains Mono** (mono); self-hosted at build, zero layout shift (decision-log #1) |
| Email | **Resend** (`resend` SDK) | Lead auto-reply + Nathan's alert — **best-effort notification**, via `after()` (Rule 2.5) |
| Lead record | Google Apps Script web-app webhook (Sheet) + Asana REST API | Plain `fetch` POSTs — **no SDK dependency added** |
| Validation | **Zod v4** | Discriminated-union schema for the lead payload, shared client/server (`src/lib/schema.ts`) |
| Analytics | `@vercel/analytics` | Cookieless |
| Hosting | **Vercel** (production = `main`; branches = preview) | |
| Repo | GitHub **`Helios35/nextsketch-website`**, **private** (decision-log #2) | `main` is production |

## Data model — **CHANGED** (no database; the Zod union is the contract, the Sheet is the record)

**No database** (decision-log #8). The durable record is the **Google Sheet "Inbound Leads"** (system of record) plus a best-effort **Asana** task. The **Zod discriminated union** (`src/lib/schema.ts`) is the de-facto data contract — a lead is one of two `kind`s:

```
LeadPayload = QualificationPayload | QuickLeadPayload   // discriminated on `kind`

QualificationPayload {                       QuickLeadPayload {
  kind: "qualified"                            kind: "quick"
  project_type: new_product|rescue|            source: "quick_door" | "off_ramp"
                agentic|partnership            name:  string (1..100)
  readiness:    now|soon                       email: valid email
  authority:    full|shared|none               project_types?: (canonical project types)[]  // off_ramp omits
  validation:   validated|willing|build_first  details?: string (0..1000)
  name:  string (1..100)                       _hp?:  "" (honeypot — Rule 2.8)
  email: valid email                           _t:    number ≥ 3000 (Rule 2.8)
  company?: string (0..100)                  }
  details?: string (0..1000)
  _hp?:  "" (honeypot — Rule 2.8)            // "exploring" values are UI-only — excluded from the
  _t:    number ≥ 3000 (Rule 2.8)            // qualifier enums so the off-ramp can't be POSTed (2.1)
}
```

**Sheet record (the durable row).** `toSheetRecord` (`src/lib/lead-format.ts`) flattens either kind into the **same 11 columns, in this order** — so the Apps Script column mapping never branches (`scripts/inbound-leads.gs`; build-note 14):

`timestamp · lead_type · signal · name · email · company · project_type · readiness · authority · validation · details`

Stored values are the **display labels** the visitor saw (resolved from the canonical `MODAL_QUESTIONS` map, `06-taxonomy.md` §3 — never re-typed). The quick door leaves the qualifier columns (`company`, `readiness`, `authority`, `validation`) empty and writes its multi-select needs as a `"; "`-joined list into `project_type`. `lead_type` ∈ `qualified`/`flagged`/`quick`/`exploring`; `signal` is the Rule 2.5 label.

## API design — **CHANGED**

`POST /api/qualify` — **the only server-side surface.**
- **Accepts:** `LeadPayload` JSON. Validated with `leadPayloadSchema` (the discriminated union). The discriminator enforces the right shape per `kind`; the qualifier enums exclude `exploring` (Rule 2.1); both kinds require an empty honeypot and `_t ≥ 3000` (Rule 2.8). **Server-side re-validation is the security boundary** — off-ramp/honeypot/too-fast submissions reject here even on a direct POST.
- **Does:** hands the validated lead to `deliverLead` (the durable seam). On a durable success, schedules `after(() => notifyLead(payload))` so the auto-reply + alert run **after** the response is flushed (best-effort; an email failure can never block or reverse the capture). Reports `{ ok }` **honestly** — success only once the lead is durably recorded.
- **Returns:** `200 {ok:true}` (durably recorded) · `503 {ok:false}` (valid but not deliverable — destination unreachable or not yet configured) · `400 {ok:false}` (validation reject or malformed JSON) · `500 {ok:false}` (unexpected thrown error) · `405` (non-POST, Next default). The body is a **generic `{ ok }`** on every rejection — a probe is never told which guard tripped. The client reads `ok` + HTTP-ok and runs Rule 2.7 on anything but `ok:true`.
- **No rate limit.** The pre-pivot `429`/"5-per-hour in-memory per IP" was **never implemented** (unreliable on Vercel serverless; build-note 09 §3). There is also no application-level request-body size cap beyond Vercel's platform limit (~4.5 MB) and the schema's field caps. Both sit in the same deferred abuse-hardening bucket.

## Delivery seam — **CHANGED** (`src/lib/lead-delivery.ts`)

`deliverLead(payload): Promise<boolean>` attempts both destinations concurrently (`Promise.allSettled` — one throwing can't short-circuit the other) and **gates success on the Sheet**:
- **Google Sheet "Inbound Leads"** — the **durable system of record**. A single `fetch` POST of the formatted record to the owner-provided Apps Script web-app webhook (`LEADS_SHEET_WEBHOOK_URL`); any non-2xx or missing URL resolves `false` → capture reports not-ok (no fake success). Timeout 10s. Chosen over a service account + `googleapis` to add **no dependency** (smallest diff).
- **Asana "Inbound Leads" project** — **best-effort**. `POST https://app.asana.com/api/1.0/tasks` with a Bearer token (`ASANA_ACCESS_TOKEN`, `ASANA_PROJECT_ID`). A failure/missing config is logged but **never fails the capture** — the Sheet is the record. Timeout 8s.
- **Resiliency model (decided in build-note 10):** the Sheet gates success; Asana is best-effort. Every reported success is genuinely, durably recorded; a flaky Asana can't manufacture a false failure for a saved lead. Accepted trade-off: a Sheet-fail/Asana-succeed case reports not-ok, and a retry can create a duplicate Asana task (cheaper than a lost lead; dedupe by hand).

## Notification — **CHANGED** (`src/lib/lead-notify.ts`)

`notifyLead(payload)` fires **two emails via Resend**, concurrently and best-effort (`Promise.allSettled`), only after a durable capture:
- **Auto-reply to the lead** — instant acknowledgment honoring the success-screen promise. Reply-to is `hello@nextsketch.com`. Copy is chosen per door (qualified / quick / exploring) so it never describes content the lead didn't provide; the exploring variant drops the two-business-day promise.
- **Alert to Nathan** (`NOTIFY_EMAIL`) — subject carries the Rule 2.5 signal label; body carries contact details + every answer as display labels. Reply-to is the lead's address.
- **Sender:** `LEAD_FROM_EMAIL` (verified branded sender) if set, else Resend's interim `onboarding@resend.dev` (decision-log #9 / Decision 3) so email works pre-DNS. HTML user fields are escaped; send errors are logged sanitized (code + status + message, never a raw object).

## Business logic implementation — **CURRENT**

- Branching (Rules 2.1–2.3): client-side state machine in `QualificationModal`; the server re-validates so the off-ramp can't be bypassed by a direct POST.
- Two doors share one submit seam (`submitQualification` → `/api/qualify`); downstream code branches on `kind` (Unit 04) — no parallel system.
- Language rules (§3): all copy in `src/content/*.ts`; a CI check greps the built output for Rule 3.2/3.4 banned terms and fails the build on a hit.

## Auth and permissions — **CURRENT**

None. All public. `/api/qualify` is the only mutation surface, protected by the Rule 2.8 guards. The no-backend invariant (decision-log #8) is binding: anything that appears to need a database, login, or a second server surface stops and returns to the owner.

## Error handling — **CURRENT**

- API: structured JSON errors, no stack traces to the client; failures `console.error`-logged for Vercel (sanitized — `name: message`, never the raw thrown value).
- Client: a non-2xx / network failure → Rule 2.7 preserve-and-fallback UI.
- Global: Next.js error boundary + custom 404 (PRD F12).
- Sheet-side: the Apps Script appends the row **then** returns 200; any error throws → non-2xx → site reports not-ok (no catch-and-return-200). Formula injection is neutralized on write (apostrophe-prefix on `= + - @`). (build-note 14.)

## Dependencies and integrations — **CHANGED**

Resend (email — best-effort, via `after()`) · **Google Apps Script webhook** (Sheet system of record — plain POST, no SDK) · **Asana REST API** (best-effort task — no SDK) · Vercel Analytics (cookieless → no cookie banner) · Google Fonts via `next/font` (build-time only). No CRM/HubSpot/Klaviyo path (decision-log #7). No cookies → no cookie banner required.

## Environment variables — **CHANGED** (all server-only; no `NEXT_PUBLIC_` prefix)

| Var | Purpose | Gating |
|---|---|---|
| `LEADS_SHEET_WEBHOOK_URL` | Apps Script web-app URL that appends the Sheet row | **Durable record — gates capture success.** Unset ⇒ every capture honestly reports not-ok. **Set first.** |
| `ASANA_ACCESS_TOKEN` + `ASANA_PROJECT_ID` | Asana "Inbound Leads" task | Best-effort. Unset ⇒ task skipped; capture still succeeds. |
| `RESEND_API_KEY` | Resend auth for the auto-reply + alert | Notification only (best-effort). Unset ⇒ emails skipped; lead still captured. |
| `NOTIFY_EMAIL` | **Recipient of the `[Lead …]` alert (Nathan's inbox)** — distinct from the `hello@nextsketch.com` escape hatch / auto-reply reply-to | Unset ⇒ alert skipped (auto-reply unaffected). |
| `LEAD_FROM_EMAIL` *(optional)* | Verified branded sender (`"NextSketch <hello@nextsketch.com>"`) | Unset ⇒ sends from Resend's interim onboarding domain (decision-log #9); set once DNS verifies. |

## Project structure — **CURRENT** (as-built)

```
src/
  app/            — layout.tsx (dark ink shell, fonts), page.tsx (hero),
                    globals.css (Tailwind v4 theme), not-found.tsx,
                    api/qualify/route.ts (the only server surface)
  components/     — hero.tsx, hero-cta.tsx, qualification-modal.tsx,
                    qualification-modal-provider.tsx, button.tsx
                    (DORMANT, deferred: Nav, sections, SiteNav/Footer,
                     Reveal, SketchAccent, etc. — on disk, not rendered)
  content/        — copy.ts (SITE + LANDING live; multi-section copy dormant),
                    modal.ts, email.ts, faq.ts, services.ts
  lib/            — schema.ts (Zod union), qualify.ts (submit seam),
                    lead-delivery.ts, lead-format.ts, lead-notify.ts
scripts/          — inbound-leads.gs (the Apps Script reference copy; build-note 14)
```
