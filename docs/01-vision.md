# Vision — NextSketch Website Rebuild

**Version:** 2.1 · **Date:** 2026-07-06 · **Status:** Active — aligned to the redesign decisions (decision-log #13–#14, Redesign Unit 01)
**Answers:** Why does this exist?
**Upstream sources:** NextSketch Brand Philosophy v1.0, NextSketch Messaging & Branding Kit v1.0, `concept-website-rebuild.md`

> **Reconciliation tags:** **CURRENT** (true as-built) · **CHANGED** (rewritten to match the as-built or an owner decision) · **PLANNED** (redesign — decision-log #13) · **RETIRED** (no longer the plan). The *why* is unchanged; the *shape of the solution* pivoted (2026-06-14) from an eleven-section scrolling page to a single dark cinematic hero — and now grows again (2026-07-06, decision-log #13): **five sections — Manifesto, Services, Process, About, Final CTA — join the hero in the dark design-system language** (`04-ux-spec.md` v3.0). The old eleven-section light page is **retired**, not the storytelling itself.

---

## Problem statement — **CURRENT**

The current nextsketch.com sells a company that no longer exists: an industrial/mechanical design consultancy with hardware case studies, template SaaS pricing, Calendly "book a free chat" CTAs, and SEO targeting design-services keywords. NextSketch has repositioned as a product development firm — software products and agentic systems, from idea to production, with a partner who stays. Every visitor today receives the wrong story, and the site's conversion paths (Calendly, "free chat") directly violate the new brand's qualification mindset.

## Target user — **CURRENT**

Three buyer profiles, defined canonically in Messaging Kit §04:

1. **The founder with an idea** (primary) — software idea, non-technical, afraid of wasting money on the wrong build.
2. **The business owner stuck at 70%** (secondary) — burned by a previous agency, stalled build, needs trust signals.
3. **The SMB ready to upgrade** (tertiary) — operating but inefficient, pitched decks before, wants working systems.

## Proposed solution — **CHANGED**

A website that is itself proof of capability: sleek, modern, fast, with purposeful animation — "a product, not a brochure." It tells the new story in the Messaging Kit's words and qualifies visitors through a **two-door qualification modal** instead of a contact page, self-filtering away people who are still exploring.

**As-built (the live MVP):** a dark cinematic landing hero opening a scrolling home page, plus a standalone `/pricing` route. The old "the landing page is the entire site for now" (decision-log #1; build-note 08) is **superseded** — by #13/#16 which grew the page, and by **#23** (2026-08-25) which added the second route. The hero screen is still the opening: headline ("From idea to production. Gain a real partner." — decision-log #18, 2026-08-24, superseding the locked Messaging Kit Option A "From idea to production. And we stay."), a supporting line, a capability strip naming the four services, and the primary CTA that opens the modal. **PLANNED (decision-log #13):** the page grows section-by-section — Manifesto, Services, Process, About, Final CTA — each designed against the hero-derived design system. The old eleven-section light storytelling is **RETIRED** (its code dormant on disk; sections outside the #13 set return only by a new decision).

## Success metrics

- **Qualified and quick leads reach the durable pipeline** — the Google Sheet "Inbound Leads" (system of record) + a best-effort Asana task, with an instant auto-reply to the lead and a real-time alert to Nathan. The right buyers raise their hand. **CHANGED** (was: "completions arrive at hello@nextsketch.com" — email is now best-effort notification, not the record; see `07-technical-spec.md`).
- "Still exploring" visitors hit the soft off-ramp — and may opt into a low-pressure "Stay in Touch" capture instead of being turned away. **CHANGED** (off-ramp now captures; was a no-form dead end).
- Zero banned language anywhere (per Business Rules §3). **CURRENT.**
- A visitor matching any of the three profiles can articulate what NextSketch does and how engagement works **from the single hero screen**. **CHANGED** (was "after one scroll").
- The site replaces the Webflow site on nextsketch.com (domain cutover complete). **CHANGED** — the cutover is **parked** (decision-log #5, a separate milestone — not retired); the bar today is the live Vercel production URL. Execution owned by the runbook / launch-readiness.

## Non-goals

- Not a portfolio site — the page itself is the credibility play. **CURRENT** (more so now: the single hero *is* the proof). The "selected work" grid is **RETIRED** (not in the #13 section set).
- Not a content/SEO play at launch — blog and newsletter are cut. **CURRENT.**
- No e-commerce, no client portal, no CMS, **no backend beyond one serverless lead route — ever** (decision-log #8). **CURRENT** (hardened post-pivot). *"No pricing display" is* **CHANGED** *— `/pricing` publishes the four tiers and their figures (decision-log #23/#25, 2026-08-25). The page still sells nothing and takes no payment: it qualifies, so #8 is untouched.*
- Not a multi-page site — one page plus the modal. **CURRENT** (now literally one screen).
- No lead nurture infrastructure (CRM, sequences) at launch. **CURRENT** — note the durable record is a Google Sheet + best-effort Asana task with transactional email, not a CRM (decision-log #7/#8).
