# Site Architecture — NextSketch Website Rebuild

**Version:** 2.2 · **Date:** 2026-08-25 · **Status:** Active — the site is now two routes (decision-log #22–#24, adhoc Unit 22)
**Answers:** How is it structured?
**References:** `02-prd.md` (what) · `04-ux-spec.md` (how each section looks) · `05-business-rules.md` (modal logic)

> **Reconciliation tags:** **CURRENT** (true as-built) · **CHANGED** (rewritten to match the as-built or an owner decision) · **PLANNED** (redesign section set — decision-log #13) · **RETIRED** (no longer the plan; recorded so it can't be mistaken for current). The live structure is **the scrolling home page + a standalone `/pricing` route + the modal overlay + a 404**. The redesign built out five sections (Manifesto, Services, Process, About, Final CTA) on the home page in the dark design-system language (`04-ux-spec.md` v3.0), joined by Selected Work (#16). **The site is no longer single-page: decision-log #23 (2026-08-25) ships Pricing as its own route**, superseding #16's "next section" framing. The old eleven-section plan is **RETIRED**; its component code is dormant on disk.

---

## Sitemap

```
/            — the home page: hero + six sections, one scroll        [CURRENT]
/pricing     — standalone pricing route (static, ink surface)        [CHANGED — #23]
/404         — custom not-found (light paper surface)                [CURRENT]
[modal]      — qualification modal (overlay, no route)               [CURRENT]
/api/qualify — POST-only serverless lead endpoint (no page)          [CURRENT — see 07]
```

**CHANGED.** `/` carries the hero plus its six sections (Taxonomy §6 anchors), and `/pricing` is now a second route (**decision-log #23**) — the first time the site has had more than one page since the 2026-06-14 pivot. `/pricing` is **statically prerendered and sells nothing**: it is a page, not a server surface, so **decision #8 stands untouched** and `/api/qualify` is still the entire server-side footprint. Because a second route exists, **every nav and footer link is root-relative** (`/#work`, not `#work`): a bare hash resolves against the current route, so `#work` on `/pricing` would mean `/pricing#work`, which is nothing (#23). Old Webflow routes (`/projects`, `/about-us`, `/contact-us`, `/projects/*`) get permanent redirects to `/` — configured for the domain cutover, which is **parked** (decision-log #5; runbook §Redirects). The modal is an overlay with no route (no `/start` deep-link was added).

## Navigation structure — **CHANGED** (hamburger at every breakpoint)

**CURRENT (as-built).** `SiteNav` and `SiteFooter` are both live and mount **per page** (`page.tsx` and `pricing/page.tsx`), not in `src/app/layout.tsx`, so the 404 keeps its own light paper surface. *(This section previously recorded them as RETIRED and unmounted — that was true of the 2026-06-14 pivot and was left stale when Redesign Unit 02 remounted them. Corrected here.)*

**The bar** is fixed, transparent over the hero, and turns to elevated glass with reduced height past 80px of scroll. It holds the brand lockup on the left and **one right-justified hamburger** — **at every screen size** (**decision-log #22**, 2026-08-25). The visible desktop tab row is **RETIRED**; the full-screen ink overlay is now the only place the items render, at all widths. There is **no CTA in the nav** (owner direction 2026-07-06 — the hero CTA and `#start` carry conversion), and the bar is deliberately **not route-aware**.

**The lockup** appears in the bar only once scrolled, because above the fold it belongs to the page: `hero.tsx` renders it on `/`, and `pricing/page.tsx` renders its own for the same reason (no hero there to supply one). Both sit on the same gutter at the same size, so the bar's takes over at 80px without a jump or a blink.

**The item set** is six, in order: **Work · Why · Services · Process · About · Pricing** (Taxonomy §6). Work leads (#21); Pricing is last and is the only item that leaves the page (#24). The **footer maps the same `NAV.items`**, so it carries the identical six plus the social set (#4, narrowed 2026-07-27) and the legal line — one source, so the two can never disagree.

**Every destination is root-relative** so it resolves from `/pricing` as well as `/` (#23), including both wordmark targets. With scripting off, the nav bar is a lockup and an inert burger — the tab row was its no-JS surface — but the footer's six anchors are plain `<a>` on every page, so nothing becomes unreachable (#22).

## Page structure — **CHANGED**

**Live (as-built):** the dark cinematic hero (`src/components/hero.tsx`): wordmark, headline ("From idea to production. Gain a real partner." — **decision-log #18**, gold accent on "production" / "partner"), Messaging Kit §03 Message 4 supporting line, the capability strip (four services), and the CTA → modal — followed by the section set below. Messaging Kit §05 **Hero Option A** ("From idea to production. And we stay."), which this row previously recorded as locked, is **superseded** (#18); it survives on disk only in the dormant `HERO.headline`. Detail in `04-ux-spec.md` §Live components.

**Section set on the home page (decision-log #13, extended by #16).** The five redesign sections join the hero on `/`, built one unit at a time against `04-ux-spec.md`, with Selected Work added ahead of them by #16. *(The prose elsewhere in the doc stack still says "five sections" in places — pre-existing drift from #16, which made it six; flagged, not reconciled in this unit.)* Pricing is **not** in this set: #23 moved it to its own route.

| Section | Job | Canonical copy source |
|---------|-----|----------------------|
| **Selected Work** (`#work`) — **CHANGED, live (decision-log #16)** | **Prove the work is real — the conversion-recovery band, first below the hero; leads the nav (#21)** | **None in Messaging Kit. `src/content/work.ts` — owner-supplied names, links and screenshots delivered 2026-08-24; summaries DRAFT in brand voice (Rule 4.3)** |
| Manifesto | Reframe the problem | "Most firms build what you ask for…" (`src/content/copy.ts`, dormant — re-confirm at the unit) |
| Services | Name the four engagements (Taxonomy §1) | Messaging Kit §05 Services |
| Process | Show the workflow + differentiator (Taxonomy §2) | "Strategy. Build. Validate. Stay." four-phase |
| About | The person behind it (solo) | New copy, Brand Philosophy §8 |
| Final CTA | Convert → modal | "Ready to build?…" |

**Retired section plan (the old eleven-section page — RETIRED).** Nav, `#top` hero (shipped re-skinned — the one survivor), Manifesto `#why`, Process `#process`, Selected work `#work`, Services `#services`, About `#about`, Testimonials `#voices`, Who it's for `#fit`, FAQ `#faq`, Final CTA `#start`, Footer. Recorded so it can't be mistaken for the plan: five of its sections have **successors** in the #13 set (designed fresh, dark — the old layouts don't carry over); **Selected work has since returned on exactly that basis — a new decision (#16, 2026-08-24), designed fresh as a dark card rail, nothing of the paper-era tile grid carried over**. Testimonials, Who it's for, FAQ, nav and footer still do **not** — returning any of them requires a new decision. Dormant copy stays in `src/content/copy.ts`.

## User flows — **CHANGED**

**Live (as-built):** Hero → CTA opens the modal → **quick door** (name + email + optional needs) **or** "Rather walk us through it?" → the four-question **qualifier** → contact step. A "still exploring" answer on the qualifier (Q1/Q2) routes to the **off-ramp**, which offers an optional "Stay in Touch" email capture. Any abandoner keeps the `hello@nextsketch.com` escape hatch (in-modal and as the no-JS fallback). Logic in `05-business-rules.md` §1–2.

**RETIRED (the old multi-section journeys).** The pre-pivot scroll journeys routed through sections that are no longer planned (FAQ, Testimonials, Who it's for). New on-page journeys are defined as the #13 sections ship — the modal remains the single conversion point.

## Access rules — **CURRENT**

Everything public. No auth, no gated content, no roles — and **no backend beyond `/api/qualify`** (decision-log #8). The API route is the only server-side surface.
