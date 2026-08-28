# PRD — NextSketch Website Rebuild

**Version:** 2.1 · **Date:** 2026-07-06 · **Status:** Active — aligned to the redesign decisions (decision-log #13–#14, Redesign Unit 01)
**Answers:** What are we building?
**References:** `01-vision.md` (why) · `03-site-architecture.md` (structure) · `04-ux-spec.md` (look/behavior) · `05-business-rules.md` (logic) · `06-taxonomy.md` (naming) · `07-technical-spec.md` (how) · `08-runbook.md` (ops)

> **Reconciliation tags:** **CURRENT** (true as-built) · **CHANGED** (rewritten to match the as-built or an owner decision) · **PLANNED** (in the redesign set — decision-log #13 — designed per-section later) · **RETIRED** (no longer the plan; recorded so it can't be mistaken for current). The MVP that shipped is a **single dark cinematic hero + two-door qualification modal + a durable lead pipeline**. The old **eleven-section light page is RETIRED as a destination** (2026-07-06): the redesign instead adds **five sections — Manifesto, Services, Process, About, Final CTA — in the dark design-system language** (`04-ux-spec.md` v3.0). Dormant component code/copy stays on disk (build-note 08).

> **REVIEW NOTES**
> 1. *(closed)* **Hero stat strip** — the pivot **dropped** the stats marquee (no invented numbers / social proof — Brand Philosophy §10, Rule 4.3) and repurposed the strip into the **capability strip** naming the four services (build-note 08). Stat-strip copy still exists dormant in `HERO.stats` (placeholder `00`s) — a leftover of the retired build, not a plan. No open question.
> 2. *(closed)* **Footer social links** — resolved as **LinkedIn, X/Twitter, Instagram** (decision-log #4); URLs owner-owed before launch. A footer is **not in the redesign section set** (decision-log #13) — dormant; the social set is locked for whenever one ships.
> 3. **Testimonial copy** — **RETIRED with the testimonials section** (not in the #13 set). If testimonials ever return, quotes must be re-approved by the original clients first (this constraint survives the retirement).

---

## Overview — **CHANGED**

A marketing site for NextSketch on Next.js/Vercel, replacing the Webflow site. **As-built: a dark cinematic home page (hero + six sections), a standalone `/pricing` route, and two service routes under `/services/`** (**decision-log #23**, 2026-08-25 — the site is no longer single-page; **#30**, 2026-08-28 — the service routes), with a **two-door** branching qualification modal as the structured lead path. **Shipped (decision-log #13, extended by #16):** Selected Work, Manifesto, Services, Process, About and Final CTA, added one unit at a time, each designed against the hero-derived design system (`04-ux-spec.md`). The old eleven-section scrolling page is **RETIRED** (dormant in code, not a destination). The lead path writes to a durable Google Sheet + best-effort Asana, with transactional email — not a single notification email (see `07-technical-spec.md`).

## Background — **CURRENT**

Brand repositioning completed June 2026 (Brand Philosophy v1.0, Messaging Kit v1.0). Autonomous Whales retired and folded in. See `01-vision.md`. The 2026-06-14 owner-directed pivot to the single dark hero is recorded in decision-log #1 and build-note 08.

## Goals

1. Communicate the new positioning using Messaging Kit §05 copy as the canonical source. **CURRENT** (the live hero uses locked Hero copy; the planned sections re-confirm their §05 copy at their units — #13).
2. Qualify leads via the modal; soft-filter "still exploring" visitors (logic in `05-business-rules.md` §2). **CURRENT** (now a two-door modal; off-ramp captures).
3. Feel like a product: purposeful animation, fast loads. **CURRENT** (the dark hero — marquee + rise-in, `motion-safe`). A Process section is **PLANNED** (#13); its interaction model is decided at its section unit.
4. Deploy on Vercel; survive domain cutover from Webflow. **CHANGED** — deploys on Vercel (**CURRENT**); the `nextsketch.com` cutover is **parked** (decision-log #5, a separate milestone — not retired).

## Non-goals — **CURRENT**

See `01-vision.md`. Additionally: no A/B testing framework, no i18n. The pre-pivot "no dark mode at launch" is **moot** — the site ships **dark by design** (there is no light/dark toggle; dark is the only theme). No backend beyond the single serverless lead route (decision-log #8).

## User stories

- As a **founder with an idea**, I want to understand **from the hero** that NextSketch takes ideas to production and stays, so that I trust them enough to start the modal. **CHANGED** (was "in one scroll").
- As a **burned business owner**, I want to see the partner-not-vendor positioning, so that I feel safe raising my hand again. **CURRENT** (the rescue service appears in the capability strip); deeper treatment lands with the **PLANNED** Services/Manifesto sections (#13).
- As an **SMB owner exploring AI**, I want plain-language signal that agentic systems apply to me. **CURRENT** (capability strip); deeper treatment lands with the **PLANNED** Services section (#13).
- As a **visitor who is still exploring**, I want an honest signal that I'm not ready yet — and an optional way to stay in touch. **CHANGED** (off-ramp now captures).
- As **Nathan (owner)**, I want every lead durably recorded **and** an alert with all answers, so I can qualify and respond personally. **CHANGED** (Sheet system of record + Asana + a `[Lead …]` alert email; not a single email).

## Functional requirements

| # | Requirement | Status |
|---|-------------|--------|
| F1 | Single **dark hero** screen with a wordmark header and a "Start a Conversation" CTA that opens the modal. (The pre-pivot sticky-nav scrolling page is **RETIRED**; whether the redesigned page gets a nav is decided during the section units.) | **CHANGED** |
| F2 | Qualification modal: **two doors** — a low-friction quick path (name + email + optional needs) as the primary entry, and the four-question qualifier reachable from it; branching per Business Rules §2; accessible from the hero CTA. Email escape hatch (`hello@nextsketch.com`) visible in the modal and as the no-JS fallback. | **CHANGED** |
| F3 | A completed lead (either door) is durably recorded to the **Google Sheet "Inbound Leads"** (system of record, gates capture success) + a **best-effort Asana task**, then triggers a lead **auto-reply** and Nathan's **alert** via Resend (`after()`, best-effort). No database (decision-log #8). | **CHANGED** |
| F4 | Process section (four canonical phases — Taxonomy §2). Design decided at its section unit against `04-ux-spec.md`; the old expandable-rows/circled-numbers spec is **RETIRED**. | **PLANNED** (#13) |
| F5 | Selected-work grid (4 placeholder tiles). Not in the #13 set; returning it requires a new decision. | **RETIRED** |
| F6 | Services section (four canonical services — Taxonomy §1). The service **names** are live in the capability strip (**CURRENT**); the section is designed at its unit — gold-only accent (#14), the old four-accent cards are **RETIRED**. | **PLANNED** (#13) |
| F7 | About section ("about me", solo). | **PLANNED** (#13) |
| F8 | Testimonials (2–3 placeholder quote blocks). Not in the #13 set. | **RETIRED** |
| F9 | FAQ accordion (six Q&As verbatim). Not in the #13 set; the Q&A copy stays canonical in the Messaging Kit if it returns. | **RETIRED** |
| F10 | Animation: live hero capability marquee + rise-in (`motion-safe`) — **CURRENT**. New-section entrances draw on the shipped motion vocabulary under the binding contract (`04-ux-spec.md` §Motion). Handwritten sketch accents are **RETIRED**. A scroll-driven background video + parallax is **PLANNED — not yet designed** (`04-ux-spec.md` §Motion). | **CHANGED** |
| F11 | All CTA copy obeys Business Rules §3 (banned/required language). | **CURRENT** |
| F12 | Custom 404 page (on-brand, light `paper` surface, links back to the page). | **CURRENT** |

## Non-functional requirements

| # | Requirement | Status |
|---|-------------|--------|
| N1 | Performance: Lighthouse ≥ 90 perf/a11y/SEO on mobile; LCP < 2.5s. | **CURRENT** (target) |
| N2 | Fully responsive 360px–1920px. | **CURRENT** |
| N3 | Accessibility: WCAG 2.1 AA; modal keyboard-navigable and focus-trapped. | **CURRENT** |
| N4 | SEO: full meta rewrite targeting software product development (live in `SITE.title`/`description`). OG image placeholder. | **CURRENT** (OG image still owed) |
| N5 | Spam protection on submission without CAPTCHA: **honeypot + minimum-time check** on both doors (Rule 2.8). | **CHANGED** — honeypot + min-time **CURRENT**; **rate limiting was never implemented** (deferred; in-memory per-IP is unreliable on Vercel serverless — build-note 09 §3). |

## Acceptance criteria

- The live screen renders with approved Hero copy and the interim background image; no lorem ipsum — real Messaging Kit copy only. **CURRENT.** (The old multi-section placeholder-asset criteria are **RETIRED**; each redesign section defines its acceptance criteria in its own unit brief.)
- Modal: the "still exploring" path never reaches the qualifier contact step (it routes to the off-ramp, which may capture an email); a completed lead (quick or qualified) is durably recorded before success is shown — **no fake success** (Rule 2.7). **CHANGED.**
- Grep sweep of build output finds zero banned terms (Business Rules §3.2). **CURRENT** (CI gate).
- Site deploys from `main` to Vercel; preview deploys on branches. **CURRENT.**
- Reduced-motion mode disables all non-essential animation. **CURRENT.**

## Open questions

1. ~~Stat strip content~~ — closed (Review Note 1: dropped, repurposed to capability strip).
2. ~~Footer socials~~ — closed (decision-log #4).
3. OG/social share image — still needs a designed asset at handoff. **Open** (launch-readiness).
4. ~~Live background image is an interim Unsplash placeholder~~ — closed (Unit 03, decision-log #15: self-hosted hero orbit footage + poster shipped, build-note 18).
