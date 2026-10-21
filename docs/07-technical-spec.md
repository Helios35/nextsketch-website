# Technical Spec — NextSketch Website Rebuild

**Version:** 2.7 · **Date:** 2026-10-21 · **Status:** Active (2.7: the email-first modal, decision-log #65: the `quick` and `followup` kinds, the lead ID, the Sheet update and the follow-up alert; 2.6: the About team, decision-log #63 and #64: `team-avatar.tsx`, `use-loop-video.ts`, `public/team/`, the portrait placeholder deleted; 2.5: the waitlist band's third payload kind, `waitlist`, decision-log #58, and the two offerings' tree, #53; 2.4: `hero-cta.tsx` left the tree, folded into `<Button>`, build-note 34): reconciled to the as-built lead pipeline (Sprint 03 doc audit); route count and project structure updated for the service routes (#30); the scroll-scrubbed video components and their engine removed from the tree (#46); styling, fonts, motion and the hero loop's assets reconciled to the fin Zen Linen dark rebrand (#47 to #50)
**Answers:** How is it built?
**References:** `05-business-rules.md` (logic to implement) · `06-taxonomy.md` (names/values) · `08-runbook.md` (ops) · Live code: `src/app/api/qualify/route.ts`, `src/lib/{schema,lead-delivery,lead-format,lead-notify,qualify}.ts`, `scripts/inbound-leads.gs`

> **Reconciliation tags (Sprint 03 audit, 2026-06-22):** **CURRENT** (true as-built) · **CHANGED** (rewritten to as-built) · **DEFERRED** (not shipped). The Sprint 02 ⚠ flag notes (integrations, env, API, data model) are now **rewritten into the as-built spec below** and the flags retired. Where this doc and the code disagree, the **code wins** — this spec was traced from it.

> **REVIEW NOTES**
> 1. *(closed)* **Email provider** — **Resend** was chosen and is live (account owner-owned). Used for **notification only** (auto-reply + alert), not as the lead record.

---

## System overview — **CHANGED**

**Four statically-prerendered pages** — the dark scrolling home page, `/pricing` (decision-log #23, 2026-08-25) and the **two service routes** `/services/product` + `/services/agentic-system` (**#30**, 2026-08-28) — with **exactly one serverless API route** for lead submission (`POST /api/qualify`). Adding routes did **not** add a server surface: all four prerender to static HTML at build and sell nothing. **No database, no auth, no CMS, and no backend beyond that one route — ever** (decision-log #8, unchanged by #23). Content is code (typed constants in `src/content/*.ts`), since canonical copy is locked and changes are owner decisions. The durable lead record is an external **Google Sheet** (+ a best-effort Asana task); the site stores nothing server-side.

## Tech stack — **CURRENT** (versions as-built)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, TypeScript) · React 19 | `/api/qualify` is a Route Handler using native `Request`/`Response` and `after()` from `next/server` |
| Styling | **Tailwind CSS v4** | **CHANGED (decision-log #47, #48).** The token layer is `src/app/globals.css`: fin's Zen Linen **dark** values (the only theme; no light set, no toggle) as raw custom properties on `:root`, republished into Tailwind's namespaces by an `@theme inline` bridge, the way fin builds it. Tailwind's stock colour, radius, shadow, text-shadow and drop-shadow namespaces are cleared first (`initial`), so only the site's tokens compile and a component never writes a hex (`06-taxonomy.md` §5). Every radius step derives from one `--radius` token (#48), so a bare `rounded` compiles to nothing. `color-scheme: dark` renders native UI dark |
| Animation | CSS keyframes, `motion-safe`-gated | The live hero + modal use CSS keyframes (no `motion/react` import: the `no-restricted-imports` rule). The design system binds the redesign sections to the same contract (`04-ux-spec.md` §Motion), so `motion` (Framer) is installed but has no planned consumer; uninstalling it is a future cleanup call. **CHANGED (#47):** fin's motion rule binds, with every animation at 200ms or less (the marquee is ambient and exempt), and one `prefers-reduced-motion: reduce` block in `globals.css`'s base layer sets every transition to 0s and every animation to 0.01ms (so `animationend` still fires) site-wide, so no component has to remember |
| Fonts | `next/font/google` | **CHANGED (decision-log #47).** **Inter** (`--font-inter`: the interface, body and every figure) + **Playfair Display** (`--font-playfair-display`, normal and italic: display headings and the brand voice) + **JetBrains Mono** (`--font-jetbrains-mono`: labels), loaded in `layout.tsx` and mapped to `font-sans` / `font-serif` / `font-mono` in `globals.css`; self-hosted at build, zero layout shift (decision-log #1). Space Grotesk is retired |
| Email | **Resend** (`resend` SDK) | Lead auto-reply + Nathan's alert — **best-effort notification**, via `after()` (Rule 2.5) |
| Lead record | Google Apps Script web-app webhook (Sheet) + Asana REST API | Plain `fetch` POSTs — **no SDK dependency added** |
| Validation | **Zod v4** | Discriminated-union schema for the lead payload, shared client/server (`src/lib/schema.ts`) |
| Analytics | `@vercel/analytics` | Cookieless |
| Hosting | **Vercel** (production = `main`; branches = preview) | |
| Repo | GitHub **`Helios35/nextsketch-website`**, **private** (decision-log #2) | `main` is production |

## Data model — **CHANGED** (no database; the Zod union is the contract, the Sheet is the record)

**No database** (decision-log #8). The durable record is the **Google Sheet "Inbound Leads"** (system of record) plus a best-effort **Asana** task. The **Zod discriminated union** (`src/lib/schema.ts`) is the de-facto data contract. Since decision-log #65 the modal is email-first, so a lead arrives in up to two parts, `quick` (step 1, the lead) and `followup` (step 2, attached to it), and a third kind, `waitlist`, carries the Services waitlist band's email (decision-log #58; not a lead, but the same seam):

```
LeadPayload = QuickLeadPayload | FollowupPayload | WaitlistPayload   // discriminated on `kind`

QuickLeadPayload {                           FollowupPayload {            // #65; every answer optional,
  kind: "quick"                                kind: "followup"           // at least one present
  source: "quick_door"                         lead_id: uuid (step 1's)
  email: valid email                           email: valid email (step 1's; must match the row)
  project_types: (canonical types)[] ≥ 1       project_types: (canonical types)[] ≥ 1 (step 1's)
  _hp?:  "" (honeypot — Rule 2.8)              project_type?: new_product|rescue|agentic|partnership|exploring
  _t:    number ≥ 3000 (Rule 2.8)              readiness?:    now|soon|exploring
}                                              authority?:    full|shared|none
                                               validation?:   validated|willing|build_first
WaitlistPayload {                              name?: string (1..100)
  kind: "waitlist"                             company?: string (1..100)
  email: valid email                           details?: string (1..1000)
  _hp?: ""; _t: number ≥ 3000   // #58         _hp?: ""; _t: number ≥ 3000
}                                            }
```

**Sheet record (the durable row).** `toSheetRecord` (`src/lib/lead-format.ts`) flattens a step 1 lead or a waitlist entry into the **same 12 columns, in this order** — so the Apps Script column mapping never branches (`scripts/inbound-leads.gs`; build-note 14):

`timestamp · lead_type · signal · name · email · company · project_type · readiness · authority · validation · details · lead_id`

Stored values are the **display labels** the visitor saw (resolved from the canonical `MODAL_QUESTIONS` map, `06-taxonomy.md` §3 — never re-typed). Step 1 leaves `name`, `company` and the qualifier columns empty, writes its offerings as a `"; "`-joined list into `project_type`, and writes the server's `lead_id`. A waitlist entry fills `email`, `lead_type: waitlist` and `signal: [Waitlist]` and leaves every other column empty (#58). `lead_type` ∈ `quick`/`partial`/`qualified`/`flagged`/`exploring`/`waitlist`; `signal` is the Rule 2.5 label.

**Sheet update (step 2, #65).** `toSheetUpdate` sends `{ action: "update", lead_id, email, fields }`: `fields` holds only what step 2 collected (labels again; a Q1 answer goes after the step 1 offerings in `project_type`) plus the recomputed `lead_type` and `signal`. The script finds the row whose **Lead ID** and **Email** both match, writes each field into its column, never touches `timestamp`, `email` or `lead_id`, and answers `{ ok: true, updated: true }`. No row is added. The **Lead ID** column is found by its header and, on a Sheet made before #65, added after the last used column on the first append, so no existing row or column moves.

## API design — **CHANGED**

`POST /api/qualify` — **the only server-side surface.**
- **Accepts:** `LeadPayload` JSON. Validated with `leadPayloadSchema` (the discriminated union). The discriminator enforces the right shape per `kind`; step 1 needs at least one offering; a follow-up needs at least one answer; every kind, the waitlist's included, requires an empty honeypot and `_t ≥ 3000` (Rule 2.8). **Server-side re-validation is the security boundary** — honeypot/too-fast/malformed submissions reject here even on a direct POST, and a follow-up whose lead ID and email match no row is refused by the Sheet script (503).
- **Does:** for step 1, mints a random `lead_id` (`crypto.randomUUID()`) and hands the validated lead to `deliverLead` (the durable seam); on a durable success, schedules `after(() => notifyLead(payload, leadId))` so the auto-reply + alert run **after** the response is flushed (best-effort; an email failure can never block or reverse the capture). For a follow-up (#65), hands it to `updateLead`; on a confirmed update, schedules `after(() => notifyFollowup(payload))` (Nate's follow-up alert only). A waitlist entry goes through `deliverLead` with no ID. Reports `{ ok }` **honestly** — success only once the lead is durably recorded or updated.
- **Returns:** `200 {ok:true, lead_id}` (step 1 durably recorded; the browser sends `lead_id` back with step 2) · `200 {ok:true}` (follow-up updated, or waitlist recorded) · `503 {ok:false}` (valid but not deliverable — destination unreachable or not yet configured) · `400 {ok:false}` (validation reject or malformed JSON) · `500 {ok:false}` (unexpected thrown error) · `405` (non-POST, Next default). The body is a **generic `{ ok }`** on every rejection — a probe is never told which guard tripped. The client reads `ok` + HTTP-ok and runs Rule 2.7 on anything but `ok:true`.
- **No rate limit.** The pre-pivot `429`/"5-per-hour in-memory per IP" was **never implemented** (unreliable on Vercel serverless; build-note 09 §3). There is also no application-level request-body size cap beyond Vercel's platform limit (~4.5 MB) and the schema's field caps. Both sit in the same deferred abuse-hardening bucket.

## Delivery seam — **CHANGED** (`src/lib/lead-delivery.ts`)

`deliverLead(payload, leadId): Promise<boolean>` (step 1 and the waitlist band) attempts both destinations concurrently (`Promise.allSettled` — one throwing can't short-circuit the other) and **gates success on the Sheet**:
- **Google Sheet "Inbound Leads"** — the **durable system of record**. A single `fetch` POST of the formatted record to the owner-provided Apps Script web-app webhook (`LEADS_SHEET_WEBHOOK_URL`); any non-2xx or missing URL resolves `false` → capture reports not-ok (no fake success). Timeout 10s. Chosen over a service account + `googleapis` to add **no dependency** (smallest diff).
- **Asana "Inbound Leads" project** — **best-effort**, for leads only: a waitlist entry is never tasked (decision-log #58, owner direction 2026-10-15), and `createAsanaTask` does not accept one. `POST https://app.asana.com/api/1.0/tasks` with a Bearer token (`ASANA_ACCESS_TOKEN`, `ASANA_PROJECT_ID`). A failure/missing config is logged but **never fails the capture** — the Sheet is the record. Timeout 8s.
- **Step 2, `updateLead(payload)` (#65):** one POST of `toSheetUpdate` to the same webhook. Success only on a 2xx **whose JSON body is exactly `{ ok: true, updated: true }`**: a script that predates #65 answers a plain `{ ok: true }` (and appends the update as a stray row), so reading the body is what keeps that from passing as success. No Asana call: the task opened on step 1 says further answers land on the row with its Lead ID and in a follow-up alert.
- **Resiliency model (decided in build-note 10):** the Sheet gates success; Asana is best-effort. Every reported success is genuinely, durably recorded; a flaky Asana can't manufacture a false failure for a saved lead. Accepted trade-off: a Sheet-fail/Asana-succeed case reports not-ok, and a retry can create a duplicate Asana task (cheaper than a lost lead; dedupe by hand).

## Notification — **CHANGED** (`src/lib/lead-notify.ts`)

`notifyLead(payload, leadId)` fires **two emails via Resend** on step 1, concurrently and best-effort (`Promise.allSettled`), only after a durable capture. A waitlist entry gets the alert only, under its `[Waitlist]` subject, with no auto-reply (#58):
- **Auto-reply to the lead** — instant acknowledgment honoring the success-screen promise. Reply-to is `hello@nextsketch.com`. One variant since #65 (`LEAD_AUTOREPLY_QUICK`), greeting "Hi there," since step 1 asks no name; the qualifier and exploring variants retired, since the auto-reply goes out before any answer exists.
- **Alert to Nathan** (`NOTIFY_EMAIL`) — subject: the signal label, the email and the offerings; body: the email, the lead ID and the offerings. Reply-to is the lead's address.
- **Follow-up alert to Nathan** (`notifyFollowup`, #65) — only after a confirmed step 2 update: subject `<recomputed label> <email> (follow-up)`, body the email, the lead ID and only what step 2 added. The visitor gets no second email.
- **Sender:** `LEAD_FROM_EMAIL` (verified branded sender) if set, else Resend's interim `onboarding@resend.dev` (decision-log #9 / Decision 3) so email works pre-DNS. HTML user fields are escaped; send errors are logged sanitized (code + status + message, never a raw object).

## Business logic implementation — **CURRENT**

- Branching (Rules 2.1–2.3): client-side state machine in `QualificationModal`. Since #65 a still-exploring answer is sent to the lead and ends step 2 on the off-ramp; the server stores it.
- The modal's two steps and the waitlist band share one submit seam (`submitQualification` → `/api/qualify`, which returns step 1's `leadId`); downstream code branches on `kind` (Unit 04, #58, #65) — no parallel system.
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
  app/            layout.tsx (the dark `background` shell, the three
                  next/font families, modal provider; #47),
                  page.tsx (home: hero, the proof band and six
                  sections; the waitlist band inside Services, #58),
                  pricing/page.tsx (the standalone route, #23),
                  services/product/page.tsx +
                  services/agentic-system/page.tsx (the two service
                  routes, #30; no /services index),
                  globals.css (the token layer: fin Zen Linen dark,
                  #47; also the hero's all-edge `hero-fade` mask,
                  #50), not-found.tsx (dark since #47), favicon.ico
                  (recoloured, #49),
                  api/qualify/route.ts (the only server surface)
  components/     hero.tsx + hero-loop.tsx, site-nav.tsx,
                  site-footer.tsx, the six section components,
                  team-avatar.tsx (About's flip cards, #63),
                  pricing-tiers.tsx (the /pricing grid, #25),
                  service-page.tsx + service-process.tsx (the two
                  service routes, one offering each since #53),
                  proof-band.tsx + waitlist-band.tsx (the home
                  bands, #58),
                  work-rail.tsx, scroll-reveal.tsx,
                  parallax.tsx, section-heading.tsx, brand-wordmark.tsx,
                  qualification-modal(-provider).tsx, modal-trigger.tsx,
                  button.tsx (variant + size, #26; the hero's `large`
                  size, build-note 34)
                  (DORMANT, the retired paper plan: hero-section.tsx,
                   sketch-accent.tsx, the held sections, Reveal, etc.:
                   on disk, not rendered; delete vs. keep is an open
                   owner call, build-note 08)
  content/        copy.ts (SITE + NAV + LANDING live; retired-plan copy
                  dormant), work.ts, pricing.ts, services.ts,
                  service-pages.ts (the two routes' content, #30,
                  #53; references services.ts/pricing.ts, never
                  re-literals their names or figures), modal.ts,
                  email.ts, faq.ts. services.ts holds the two
                  offerings and `PRICES`, the one place a figure lives
  lib/            types.ts (SectionId, ROUTES, sectionHref,
                  PricingTier + PricingTierSlug, ServicePageSlug +
                  ServiceBlockId + serviceRoute/serviceBlockHref, #30;
                  TeamMember, #63), use-loop-video.ts (the looping-
                  clip playback contract, hero and avatars, #64),
                  schema.ts
                  (Zod union), qualify.ts (submit seam),
                  lead-delivery.ts, lead-format.ts, lead-notify.ts
public/           hero-loop.mp4 + hero-loop-poster.jpg (the hero loop,
                  #46; since #50 the delivered hero-loop-sketch footage
                  and its first-frame poster, byte-identical, installed
                  at these paths), work/ (the #work screenshots),
                  team/ (the About avatars: {id}.mp4 as delivered +
                  {id}-poster.jpg, #63), placeholders/ (empty since
                  #63 retired the About portrait; the naming
                  convention's home)
scripts/          inbound-leads.gs (the Apps Script reference copy; build-note 14)
                  check-banned-terms.mjs (the Rule 3.2/3.4 gate)
```
