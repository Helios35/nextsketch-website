# PRD — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active
**Answers:** What are we building?
**References:** `01-vision.md` (why) · `03-site-architecture.md` (structure) · `04-ux-spec.md` (look/behavior) · `05-business-rules.md` (logic) · `06-taxonomy.md` (naming) · `07-technical-spec.md` (how) · `08-runbook.md` (ops)

> **REVIEW NOTES**
> 1. **Hero stat strip** — the reference layout shows a small stats row (e.g., "04 / 40+ / 100%"). Brand doc discourages social-proof-as-credibility. Recommendation: ship with process-facts instead of vanity stats ("4 phases · 1 partner · 0 handoffs") or cut. Owner decides at first review.
> 2. **Footer social links** — old site had Instagram/Twitter/Facebook/LinkedIn. Not discussed. Recommendation: LinkedIn only, matching "how to reach them" in Messaging Kit §04. Owner decides.
> 3. **Testimonial copy** — decision locked that quotes are rewritten for the new positioning, but rewritten quotes must be re-approved by the original clients before launch. Build with placeholder quote blocks until approved text exists.

---

## Overview

A single-page marketing site for NextSketch on Next.js/Vercel, replacing the Webflow site. Eleven sections on one scrolling page, a branching qualification modal as the sole structured lead path, placeholder images throughout pending asset handoff.

## Background

Brand repositioning completed June 2026 (Brand Philosophy v1.0, Messaging Kit v1.0). Autonomous Whales retired and folded in. See `01-vision.md`.

## Goals

1. Communicate the new positioning using Messaging Kit §05 copy as the canonical source.
2. Qualify leads via the modal; soft-filter "still exploring" visitors (logic in `05-business-rules.md` §2).
3. Feel like a product: purposeful animation, interactive process section, fast loads.
4. Deploy on Vercel; survive domain cutover from Webflow.

## Non-goals

See `01-vision.md`. Additionally: no A/B testing framework, no i18n, no dark mode at launch.

## User stories

- As a **founder with an idea**, I want to understand in one scroll that NextSketch takes ideas to production and stays, so that I trust them enough to start the qualification modal.
- As a **burned business owner**, I want to see that rescue work is a named service and that the engagement model is transparent, so that I feel safe raising my hand again.
- As an **SMB owner exploring AI**, I want plain-language explanation of agentic systems, so that I can tell whether this applies to my business.
- As a **visitor who is still exploring**, I want an honest signal that I'm not ready yet, so that I leave with a positive impression and return later.
- As **Nathan (owner)**, I want every modal completion emailed to me with all answers, so that I can qualify and respond personally.

## Functional requirements

| # | Requirement |
|---|-------------|
| F1 | Single scrolling page with sections per `03-site-architecture.md`; sticky nav with anchor links and a "Start a Conversation" button that opens the modal. |
| F2 | Qualification modal: multi-step, branching per Business Rules §2, accessible from all CTAs. Email escape hatch (hello@nextsketch.com) visible inside modal and in footer. |
| F3 | Modal submissions are emailed to hello@nextsketch.com with all answers (Tech Spec §API). No database at launch. |
| F4 | Interactive process section: four phases (Strategy / Build / Validate / Partner) expandable, copy from Messaging Kit §05. |
| F5 | Selected-work grid: 4 tiles with structured placeholders (see `06-taxonomy.md` §Placeholders) ready for asset swap. |
| F6 | Services section: the four canonical services (`06-taxonomy.md` §Services), each with its accent color pair (`04-ux-spec.md`). |
| F7 | About section renders as "about me" — single principal (Nathan), photo placeholder. |
| F8 | Testimonials: 2–3 quote blocks, placeholder text until approved rewrites exist (Review Note 3). |
| F9 | FAQ accordion: the six Q&As from Messaging Kit §05 verbatim. |
| F10 | Scroll-triggered animations + handwritten sketch accents per `04-ux-spec.md`; all honor `prefers-reduced-motion`. |
| F11 | All CTA copy obeys Business Rules §3 (banned/required language). |
| F12 | Custom 404 page (one extra route, on-brand, links back to home). |

## Non-functional requirements

| # | Requirement |
|---|-------------|
| N1 | Performance: Lighthouse ≥ 90 performance/accessibility/SEO on mobile; LCP < 2.5s. |
| N2 | Fully responsive 360px–1920px. |
| N3 | Accessibility: WCAG 2.1 AA; modal keyboard-navigable and focus-trapped. |
| N4 | SEO: full meta rewrite — title/description target software product development positioning, not design services. OG image placeholder. |
| N5 | Spam protection on modal submission (honeypot + basic rate limit) without CAPTCHA friction. |

## Acceptance criteria

- Every section renders with placeholder assets and approved copy; no lorem ipsum in headline/body positions — real Messaging Kit copy only.
- Modal: "Still exploring" path never reaches the contact step; qualified path completes and the email arrives with all answers.
- Grep sweep of build output finds zero banned terms (Business Rules §3.2).
- Site deploys from `main` to Vercel; preview deploys on branches.
- Reduced-motion mode disables all non-essential animation.

## Open questions

1. Stat strip content (Review Note 1).
2. Footer socials (Review Note 2).
3. OG/social share image — needs designed asset at handoff.
