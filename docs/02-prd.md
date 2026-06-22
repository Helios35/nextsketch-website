# PRD — NextSketch Website Rebuild

**Version:** 2.0 · **Date:** 2026-06-22 · **Status:** Active — reconciled to the as-built MVP (Sprint 03 doc audit)
**Answers:** What are we building?
**References:** `01-vision.md` (why) · `03-site-architecture.md` (structure) · `04-ux-spec.md` (look/behavior) · `05-business-rules.md` (logic) · `06-taxonomy.md` (naming) · `07-technical-spec.md` (how) · `08-runbook.md` (ops)

> **Reconciliation tags (Sprint 03 audit, 2026-06-22):** **CURRENT** (true as-built) · **CHANGED** (rewritten to as-built) · **DEFERRED** (still the plan for a later build, not shipped — preserved, not deleted). The MVP that shipped is a **single dark cinematic hero + two-door qualification modal + a durable lead pipeline**. The eleven-section page is deferred; its component code is dormant and its copy lives in `src/content/copy.ts`.

> **REVIEW NOTES**
> 1. *(closed)* **Hero stat strip** — the pivot **dropped** the stats marquee (no invented numbers / social proof — Brand Philosophy §10, Rule 4.3) and repurposed the strip into the **capability strip** naming the four services (build-note 08). Stat-strip copy still exists dormant in `HERO.stats` (placeholder `00`s) for the deferred multi-section build. No open question.
> 2. *(closed)* **Footer social links** — resolved as **LinkedIn, X/Twitter, Instagram** (decision-log #4); URLs owner-owed before launch. The footer itself is **DEFERRED** (dormant with the multi-section build); the social set is locked when it ships.
> 3. **Testimonial copy** — quotes are rewritten for the new positioning and must be re-approved by the original clients before launch; build with placeholder blocks. **DEFERRED** with the multi-section build (the testimonials section is dormant).

---

## Overview — **CHANGED**

A marketing site for NextSketch on Next.js/Vercel, replacing the Webflow site. **As-built: a single dark cinematic landing hero** with a **two-door** branching qualification modal as the structured lead path. The eleven-section scrolling page is **DEFERRED** (future build, dormant in code). The lead path writes to a durable Google Sheet + best-effort Asana, with transactional email — not a single notification email (see `07-technical-spec.md`).

## Background — **CURRENT**

Brand repositioning completed June 2026 (Brand Philosophy v1.0, Messaging Kit v1.0). Autonomous Whales retired and folded in. See `01-vision.md`. The 2026-06-14 owner-directed pivot to the single dark hero is recorded in decision-log #1 and build-note 08.

## Goals

1. Communicate the new positioning using Messaging Kit §05 copy as the canonical source. **CURRENT** (the live hero uses locked Hero copy; the rest of the §05 copy is dormant for the deferred sections).
2. Qualify leads via the modal; soft-filter "still exploring" visitors (logic in `05-business-rules.md` §2). **CURRENT** (now a two-door modal; off-ramp captures).
3. Feel like a product: purposeful animation, fast loads. **CURRENT** (the dark hero — marquee + rise-in, `motion-safe`). The "interactive process section" is **DEFERRED**.
4. Deploy on Vercel; survive domain cutover from Webflow. **CHANGED/DEFERRED** — deploys on Vercel (**CURRENT**); the `nextsketch.com` cutover is **parked** (decision-log #5).

## Non-goals — **CURRENT**

See `01-vision.md`. Additionally: no A/B testing framework, no i18n. The pre-pivot "no dark mode at launch" is **moot** — the site ships **dark by design** (there is no light/dark toggle; dark is the only theme). No backend beyond the single serverless lead route (decision-log #8).

## User stories

- As a **founder with an idea**, I want to understand **from the hero** that NextSketch takes ideas to production and stays, so that I trust them enough to start the modal. **CHANGED** (was "in one scroll").
- As a **burned business owner**, I want to see the partner-not-vendor positioning, so that I feel safe raising my hand again. **CURRENT** (the rescue service appears in the capability strip; the dedicated rescue section is **DEFERRED**).
- As an **SMB owner exploring AI**, I want plain-language signal that agentic systems apply to me. **CURRENT** (capability strip); the explanatory section is **DEFERRED**.
- As a **visitor who is still exploring**, I want an honest signal that I'm not ready yet — and an optional way to stay in touch. **CHANGED** (off-ramp now captures).
- As **Nathan (owner)**, I want every lead durably recorded **and** an alert with all answers, so I can qualify and respond personally. **CHANGED** (Sheet system of record + Asana + a `[Lead …]` alert email; not a single email).

## Functional requirements

| # | Requirement | Status |
|---|-------------|--------|
| F1 | Single **dark hero** screen with a wordmark header and a "Start a Conversation" CTA that opens the modal. (The pre-pivot sticky-nav scrolling page is **DEFERRED**.) | **CHANGED** |
| F2 | Qualification modal: **two doors** — a low-friction quick path (name + email + optional needs) as the primary entry, and the four-question qualifier reachable from it; branching per Business Rules §2; accessible from the hero CTA. Email escape hatch (`hello@nextsketch.com`) visible in the modal and as the no-JS fallback. | **CHANGED** |
| F3 | A completed lead (either door) is durably recorded to the **Google Sheet "Inbound Leads"** (system of record, gates capture success) + a **best-effort Asana task**, then triggers a lead **auto-reply** and Nathan's **alert** via Resend (`after()`, best-effort). No database (decision-log #8). | **CHANGED** |
| F4 | Interactive process section (four phases, expandable). | **DEFERRED** |
| F5 | Selected-work grid (4 placeholder tiles). | **DEFERRED** |
| F6 | Services section (four service cards with accents). The four service **names** appear live in the hero capability strip; the cards are deferred. | **DEFERRED** (names CURRENT) |
| F7 | About section ("about me", solo). | **DEFERRED** |
| F8 | Testimonials (2–3 placeholder quote blocks). | **DEFERRED** |
| F9 | FAQ accordion (six Q&As verbatim). | **DEFERRED** |
| F10 | Animation: live hero capability marquee + rise-in (`motion-safe`). Scroll-triggered section reveals + handwritten sketch accents. | live motion **CURRENT**; sketch/scroll reveals **DEFERRED** |
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

- The live screen renders with approved Hero copy and the interim background image; no lorem ipsum — real Messaging Kit copy only. **CURRENT.** (Multi-section placeholder-asset criteria are **DEFERRED**.)
- Modal: the "still exploring" path never reaches the qualifier contact step (it routes to the off-ramp, which may capture an email); a completed lead (quick or qualified) is durably recorded before success is shown — **no fake success** (Rule 2.7). **CHANGED.**
- Grep sweep of build output finds zero banned terms (Business Rules §3.2). **CURRENT** (CI gate).
- Site deploys from `main` to Vercel; preview deploys on branches. **CURRENT.**
- Reduced-motion mode disables all non-essential animation. **CURRENT.**

## Open questions

1. ~~Stat strip content~~ — closed (Review Note 1: dropped, repurposed to capability strip).
2. ~~Footer socials~~ — closed (decision-log #4).
3. OG/social share image — still needs a designed asset at handoff. **Open** (launch-readiness).
4. Live background image is an interim Unsplash placeholder — replace with a self-hosted brand asset before launch (build-note 08). **Open** (owner-owed).
