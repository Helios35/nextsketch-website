# Site Architecture — NextSketch Website Rebuild

**Version:** 2.1 · **Date:** 2026-07-06 · **Status:** Active — aligned to the redesign decisions (decision-log #13–#14, Redesign Unit 01)
**Answers:** How is it structured?
**References:** `02-prd.md` (what) · `04-ux-spec.md` (how each section looks) · `05-business-rules.md` (modal logic)

> **Reconciliation tags:** **CURRENT** (true as-built) · **CHANGED** (rewritten to match the as-built or an owner decision) · **PLANNED** (redesign section set — decision-log #13) · **RETIRED** (no longer the plan; recorded so it can't be mistaken for current). The live structure is a **single dark hero screen + the modal overlay + a 404**. The redesign adds **five sections (Manifesto, Services, Process, About, Final CTA)** to this page, one unit at a time, in the dark design-system language (`04-ux-spec.md` v3.0). The old eleven-section plan is **RETIRED**; its component code is dormant on disk.

---

## Sitemap

```
/            — the single dark landing hero (the entire live site)   [CHANGED]
/404         — custom not-found (light paper surface)                [CURRENT]
[modal]      — qualification modal (overlay, no route)               [CURRENT]
/api/qualify — POST-only serverless lead endpoint (no page)          [CURRENT — see 07]
```

**CHANGED.** `/` was "the page (all sections)"; it is now the single hero — and grows to hero + the five redesign sections as they ship (#13), still one route. No anchor routes are live yet; each section unit defines its anchor (Taxonomy §6). Old Webflow routes (`/projects`, `/about-us`, `/contact-us`, `/projects/*`) get permanent redirects to `/` — configured for the domain cutover, which is **parked** (decision-log #5; runbook §Redirects). The modal is an overlay with no route (no `/start` deep-link was added).

## Navigation structure — **CURRENT** (wordmark-only) · nav/footer undecided

**CURRENT (as-built):** the live hero shows a **wordmark-only header** (no nav, no second CTA) and the single hero CTA "Start a Conversation". The pre-pivot sticky top nav and footer are **RETIRED** with the old plan (`SiteNav`/`SiteFooter` dormant, not mounted); neither is in the #13 section set. Whether the grown page gets any nav — and a footer carrying the locked social set (decision-log #4) — is an owner call made during the section units, not assumed here.

## Page structure — **CHANGED**

**Live (as-built):** one screen — the dark cinematic hero (`src/components/hero.tsx`): wordmark, headline ("From idea to production. And we stay." — Hero Option A, gold accent on the payoff words), Messaging Kit §03 Message 4 supporting line, the capability strip (four services), and the CTA → modal. Detail in `04-ux-spec.md` §Live components.

**Planned section set (the redesign — PLANNED, decision-log #13).** Five sections join the hero on the single page, built one unit at a time against `04-ux-spec.md`; page order and each section's anchor/layout are confirmed per-section with the owner:

| Section | Job | Canonical copy source |
|---------|-----|----------------------|
| Manifesto | Reframe the problem | "Most firms build what you ask for…" (`src/content/copy.ts`, dormant — re-confirm at the unit) |
| Services | Name the four engagements (Taxonomy §1) | Messaging Kit §05 Services |
| Process | Show the workflow + differentiator (Taxonomy §2) | "Strategy. Build. Validate. Stay." four-phase |
| About | The person behind it (solo) | New copy, Brand Philosophy §8 |
| Final CTA | Convert → modal | "Ready to build?…" |

**Retired section plan (the old eleven-section page — RETIRED).** Nav, `#top` hero (shipped re-skinned — the one survivor), Manifesto `#why`, Process `#process`, Selected work `#work`, Services `#services`, About `#about`, Testimonials `#voices`, Who it's for `#fit`, FAQ `#faq`, Final CTA `#start`, Footer. Recorded so it can't be mistaken for the plan: five of its sections have **successors** in the #13 set (designed fresh, dark — the old layouts don't carry over); Selected work, Testimonials, Who it's for, FAQ, nav and footer do **not** — returning any of them requires a new decision. Dormant copy stays in `src/content/copy.ts`.

## User flows — **CHANGED**

**Live (as-built):** Hero → CTA opens the modal → **quick door** (name + email + optional needs) **or** "Rather walk us through it?" → the four-question **qualifier** → contact step. A "still exploring" answer on the qualifier (Q1/Q2) routes to the **off-ramp**, which offers an optional "Stay in Touch" email capture. Any abandoner keeps the `hello@nextsketch.com` escape hatch (in-modal and as the no-JS fallback). Logic in `05-business-rules.md` §1–2.

**RETIRED (the old multi-section journeys).** The pre-pivot scroll journeys routed through sections that are no longer planned (FAQ, Testimonials, Who it's for). New on-page journeys are defined as the #13 sections ship — the modal remains the single conversion point.

## Access rules — **CURRENT**

Everything public. No auth, no gated content, no roles — and **no backend beyond `/api/qualify`** (decision-log #8). The API route is the only server-side surface.
