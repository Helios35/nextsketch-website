# Vision — NextSketch Website Rebuild

**Version:** 2.0 · **Date:** 2026-06-22 · **Status:** Active — reconciled to the as-built MVP (Sprint 03 doc audit)
**Answers:** Why does this exist?
**Upstream sources:** NextSketch Brand Philosophy v1.0, NextSketch Messaging & Branding Kit v1.0, `concept-website-rebuild.md`

> **Reconciliation tags (Sprint 03 audit, 2026-06-22):** **CURRENT** (true as-built) · **CHANGED** (rewritten to as-built) · **DEFERRED** (still the plan for a later build, not shipped — preserved, not deleted). The *why* is unchanged; the *shape of the solution* pivoted (2026-06-14) from an eleven-section scrolling page to a single dark cinematic hero. The multi-section storytelling is deferred, not dead.

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

**As-built (the live MVP):** a **single dark cinematic landing hero** — "the landing page is the entire site for now" (decision-log #1; build-note 08). One screen: headline ("From idea to production. And we stay."), a supporting line, a capability strip naming the four services, and the primary CTA that opens the modal. The eleven-section storytelling (manifesto, interactive process, work grid, services, about, testimonials, FAQ, etc.) is **DEFERRED** — its code is dormant, preserved for a later build, not deleted.

## Success metrics

- **Qualified and quick leads reach the durable pipeline** — the Google Sheet "Inbound Leads" (system of record) + a best-effort Asana task, with an instant auto-reply to the lead and a real-time alert to Nathan. The right buyers raise their hand. **CHANGED** (was: "completions arrive at hello@nextsketch.com" — email is now best-effort notification, not the record; see `07-technical-spec.md`).
- "Still exploring" visitors hit the soft off-ramp — and may opt into a low-pressure "Stay in Touch" capture instead of being turned away. **CHANGED** (off-ramp now captures; was a no-form dead end).
- Zero banned language anywhere (per Business Rules §3). **CURRENT.**
- A visitor matching any of the three profiles can articulate what NextSketch does and how engagement works **from the single hero screen**. **CHANGED** (was "after one scroll").
- The site replaces the Webflow site on nextsketch.com (domain cutover complete). **DEFERRED** — parked (decision-log #5); the bar today is the live Vercel production URL, not the `nextsketch.com` cutover. Execution owned by the runbook / launch-readiness.

## Non-goals

- Not a portfolio site — the page itself is the credibility play. **CURRENT** (more so now: the single hero *is* the proof). The "selected work" grid with placeholders is **DEFERRED** with the multi-section build.
- Not a content/SEO play at launch — blog and newsletter are cut. **CURRENT.**
- No pricing display, no e-commerce, no client portal, no CMS, **no backend beyond one serverless lead route — ever** (decision-log #8). **CURRENT** (hardened post-pivot).
- Not a multi-page site — one page plus the modal. **CURRENT** (now literally one screen).
- No lead nurture infrastructure (CRM, sequences) at launch. **CURRENT** — note the durable record is a Google Sheet + best-effort Asana task with transactional email, not a CRM (decision-log #7/#8).
