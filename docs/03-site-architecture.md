# Site Architecture — NextSketch Website Rebuild

**Version:** 2.0 · **Date:** 2026-06-22 · **Status:** Active — reconciled to the as-built MVP (Sprint 03 doc audit)
**Answers:** How is it structured?
**References:** `02-prd.md` (what) · `04-ux-spec.md` (how each section looks) · `05-business-rules.md` (modal logic)

> **Reconciliation tags (Sprint 03 audit, 2026-06-22):** **CURRENT** (true as-built) · **CHANGED** (rewritten to as-built) · **DEFERRED** (multi-section build, not shipped — preserved, not deleted). The live structure is a **single dark hero screen + the modal overlay + a 404**. The eleven-section page below is the deferred plan; its component code is dormant.

---

## Sitemap

```
/            — the single dark landing hero (the entire live site)   [CHANGED]
/404         — custom not-found (light paper surface)                [CURRENT]
[modal]      — qualification modal (overlay, no route)               [CURRENT]
/api/qualify — POST-only serverless lead endpoint (no page)          [CURRENT — see 07]
```

**CHANGED.** `/` was "the page (all sections)"; it is now the single hero. No anchor routes are live. **DEFERRED:** old Webflow routes (`/projects`, `/about-us`, `/contact-us`, `/projects/*`) get permanent redirects to `/` — configured for the domain cutover, which is **parked** (decision-log #5; runbook §Redirects). The modal is an overlay with no route (no `/start` deep-link was added).

## Navigation structure — **DEFERRED**

The pre-pivot sticky top nav (logo + anchor links Process · Work · Services · About · FAQ + "Start a Conversation" button) and footer nav belong to the multi-section build (dormant; `SiteNav`/`SiteFooter` not mounted). **CURRENT (as-built):** the live hero shows a **wordmark-only header** (no nav, no second CTA) and the single hero CTA "Start a Conversation". The footer and its social set (decision-log #4) ship with the multi-section build.

## Page structure — **CHANGED**

**Live (as-built):** one screen — the dark cinematic hero (`src/components/hero.tsx`): wordmark, headline ("From idea to production. And we stay." — Hero Option A, gold accent on the payoff words), Messaging Kit §03 Message 4 supporting line, the capability strip (four services), and the CTA → modal. Detail in `04-ux-spec.md` §Component specs.

**Deferred section order (the multi-section plan — DEFERRED, copy lives in `src/content/copy.ts`):**

| # | Section | ID | Job | Canonical copy source |
|---|---------|----|----|----------------------|
| 1 | Nav | — | Orient + persistent CTA | Business Rules §3 |
| 2 | Hero | `#top` | The promise in 3 seconds | Messaging Kit §05 Hero Option A *(this is the one section that shipped — re-skinned dark)* |
| 3 | Manifesto | `#why` | Reframe the problem | "Most firms build what you ask for…" |
| 4 | Process | `#process` | Show the workflow + differentiator | "Strategy. Build. Validate. Stay." four-phase |
| 5 | Selected work | `#work` | Visual credibility (placeholders) | Placeholder spec in `06-taxonomy.md` |
| 6 | Services | `#services` | Name the four engagements | Messaging Kit §05 Services |
| 7 | About | `#about` | The person behind it (solo) | New copy, Brand Philosophy §8 |
| 8 | Testimonials | `#voices` | Secondary reassurance | Placeholder pending approved rewrites |
| 9 | Who it's for | `#fit` | Qualify + self-filter | "Built for founders and business owners…" |
| 10 | FAQ | `#faq` | Objection handling | Six Q&As verbatim |
| 11 | Final CTA | `#start` | Convert | "Ready to build?…" → modal |
| 12 | Footer | — | Escape hatch + housekeeping | hello@nextsketch.com visible |

## User flows — **CHANGED**

**Live (as-built):** Hero → CTA opens the modal → **quick door** (name + email + optional needs) **or** "Rather walk us through it?" → the four-question **qualifier** → contact step. A "still exploring" answer on the qualifier (Q1/Q2) routes to the **off-ramp**, which offers an optional "Stay in Touch" email capture. Any abandoner keeps the `hello@nextsketch.com` escape hatch (in-modal and as the no-JS fallback). Logic in `05-business-rules.md` §1–2.

**Deferred (the multi-section journeys — DEFERRED):**
- **Founder with an idea:** Hero → Process → Services (New Products) → FAQ → modal.
- **Stuck at 70%:** Hero → Manifesto → Services (Rescue & Completion) → Testimonials → modal.
- **SMB upgrader:** Hero → Services (Agentic Systems) → Who it's for → modal.

## Access rules — **CURRENT**

Everything public. No auth, no gated content, no roles — and **no backend beyond `/api/qualify`** (decision-log #8). The API route is the only server-side surface.
