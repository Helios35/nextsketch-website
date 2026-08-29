# Site Architecture — NextSketch Website Rebuild

**Version:** 2.4 · **Date:** 2026-08-28 · **Status:** Active — the site is **four routes**: the home page, `/pricing`, and **two service routes** under `/services/` (decision-log #22–#26, **#30**)
**Answers:** How is it structured?
**References:** `02-prd.md` (what) · `04-ux-spec.md` (how each section looks) · `05-business-rules.md` (modal logic)

> **Reconciliation tags:** **CURRENT** (true as-built) · **CHANGED** (rewritten to match the as-built or an owner decision) · **PLANNED** (redesign section set — decision-log #13) · **RETIRED** (no longer the plan; recorded so it can't be mistaken for current). The live structure is **the scrolling home page + a standalone `/pricing` route + the modal overlay + a 404**. The redesign built out five sections (Manifesto, Services, Process, About, Final CTA) on the home page in the dark design-system language (`04-ux-spec.md` v3.0), joined by Selected Work (#16). **The site is no longer single-page: decision-log #23 (2026-08-25) ships Pricing as its own route**, superseding #16's "next section" framing. The old eleven-section plan is **RETIRED**; its component code is dormant on disk.

---

## Sitemap

```
/                          — the home page: hero + six sections, one scroll   [CURRENT]
/pricing                   — standalone pricing route (static, ink surface)   [CHANGED — #23]
/services/product          — New Product · Product Completion · Product Support
                             (static, ink surface, anchored blocks)           [NEW — #30]
/services/agentic-system   — Agentic System, at its two depths: AI Workflow
                             Integration · Internal Tool (static, ink)        [NEW — #30]
/404                       — custom not-found (light paper surface)           [CURRENT]
[modal]                    — qualification modal (overlay, no route)          [CURRENT]
/api/qualify               — POST-only serverless lead endpoint (no page)     [CURRENT — see 07]
```

**There is deliberately no `/services` index route.** The home page's `#services` section is the hub, and the four cards there are the entry point (#30).

**CHANGED.** `/` carries the hero plus its six sections (Taxonomy §6 anchors), and `/pricing` is now a second route (**decision-log #23**) — the first time the site has had more than one page since the 2026-06-14 pivot. `/pricing` is **statically prerendered and sells nothing**: it is a page, not a server surface, so **decision #8 stands untouched** and `/api/qualify` is still the entire server-side footprint. Because a second route exists, **every nav and footer link is root-relative** (`/#work`, not `#work`): a bare hash resolves against the current route, so `#work` on `/pricing` would mean `/pricing#work`, which is nothing (#23). **CHANGED again — #30 (2026-08-28).** The site is now **four routes**. The unit-26 brief specified four *service* routes, one per `ServiceSlug`; the owner reduced that to **two grouped pages**, each covering a related group with an anchored `<section id>` per topic, so a card lands a visitor on the thing they clicked rather than at the top of a page about three things. **A service page slug is not a `ServiceSlug`:** `product` is a group name with no service behind it, and `agentic-system` is spelled exactly like its slug because that page *is* that service (Taxonomy §1, §6). Both prerender to static HTML and sell nothing, so **decision #8 still stands untouched** — `/api/qualify` remains the entire server-side footprint. Every href on them is root-relative, built through `serviceRoute` / `serviceBlockHref` in `src/lib/types.ts` rather than hand-written, so a block anchor can never be paired with a page that does not carry it.

Old Webflow routes (`/projects`, `/about-us`, `/contact-us`, `/projects/*`) get permanent redirects to `/` — configured for the domain cutover, which is **parked** (decision-log #5; runbook §Redirects). The modal is an overlay with no route (no `/start` deep-link was added).

## Navigation structure — **CHANGED** (hamburger plus one featured button, at every breakpoint)

**CURRENT (as-built).** `SiteNav` and `SiteFooter` are both live and mount **per page** (`page.tsx` and `pricing/page.tsx`), not in `src/app/layout.tsx`, so the 404 keeps its own light paper surface. *(This section previously recorded them as RETIRED and unmounted — that was true of the 2026-06-14 pivot and was left stale when Redesign Unit 02 remounted them. Corrected here.)*

**The bar** is fixed, transparent over the hero, and turns to elevated glass with reduced height past 80px of scroll. It holds the brand lockup on the left and **one right-justified hamburger** — **at every screen size** (**decision-log #22**, 2026-08-25). The visible desktop tab row is **RETIRED**; the full-screen ink overlay is now the only place the items render, at all widths. Beside the burger it carries **one button — `NAV.featured`, which is Pricing** (**decision-log #26**, 2026-08-25), the shared `<Button>` at the de-emphasized `ghost` variant in the `compact` size. That **narrowly supersedes** the 2026-07-06 "no CTA in the nav" direction, which was about *conversion*: this is navigation to a page, so **the nav still has no conversion CTA** and the hero CTA and `#start` still carry it. The button hides below 375px, where the bar measurably stops fitting; the menu carries Pricing at every width regardless, and bar and menu read the **same object** so the two cannot drift. The bar is `pointer-events-none` with `pointer-events-auto` restored on its own controls, so a page can put a real link under the transparent bar (#26) — which is what lets `/pricing` link its own above-the-fold lockup. The bar is deliberately **not route-aware**.

**The lockup** appears in the bar only once scrolled, because above the fold it belongs to the page: `hero.tsx` renders it on `/`, and `pricing/page.tsx` renders its own for the same reason (no hero there to supply one) — as do **both service routes**, through the shared `<ServicePage>`, which reproduces `/pricing`'s zero-height sticky wrapper exactly (#30). Both sit on the same gutter at the same size, so the bar's takes over at 80px without a jump or a blink.

**The item set** is six, in order: **Work · Why · Services · Process · About · Pricing** (Taxonomy §6). Work leads (#21); Pricing is last and is the only item that leaves the page (#24). The **footer maps the same `NAV.items`**, so it carries the identical six plus the social set (#4, narrowed 2026-07-27) and the legal line — one source, so the two can never disagree.

**The service routes are not nav items, and that is deliberate (#30).** The item set stays **six** — the nav is settled (#22, #24, #26) and this unit does not reopen it. The service pages are reached from the `#services` cards on the home page, where each card's **name** is now a link to that service's block while the card's existing CTA still opens the modal on that service. The footer maps `NAV.items`, so it is unchanged too. Consequence, recorded rather than resolved: **a visitor on a service route cannot reach the other service route from the chrome** — only via `/#services`. Adding them to the nav is a separate owner call.

**Every destination is root-relative** so it resolves from `/pricing` and from `/services/*` as well as `/` (#23, #30), including both wordmark targets. With scripting off, the nav bar is a lockup and an inert burger — the tab row was its no-JS surface — but the footer's six anchors are plain `<a>` on every page, so nothing becomes unreachable (#22).

## Page structure — **CHANGED**

**Live (as-built):** the dark cinematic hero (`src/components/hero.tsx`): wordmark, headline ("From idea to production. Gain a real partner." — **decision-log #18**, gold accent on "production" / "partner"), Messaging Kit §03 Message 4 supporting line, the capability strip (four services), and the CTA → modal — followed by the section set below. Messaging Kit §05 **Hero Option A** ("From idea to production. And we stay."), which this row previously recorded as locked, is **superseded** (#18); it survives on disk only in the dormant `HERO.headline`. Detail in `04-ux-spec.md` §Live components.

**Section set on the home page (decision-log #13, extended by #16).** **Six sections** join the hero on `/`, built one unit at a time against `04-ux-spec.md`: Selected Work (01, added by #16), then the five of #13 — Manifesto (02), Services (03), Process (04), About (05), Final CTA (06). *(#13 named five; #16 added Work ahead of them and renumbered the rest. Reconciled across the doc stack 2026-08-28.)* Pricing is **not** in this set: #23 moved it to its own route.

| Section | Job | Canonical copy source |
|---------|-----|----------------------|
| **Selected Work** (`#work`) — **CHANGED, live (decision-log #16)** | **Prove the work is real — the conversion-recovery band, first below the hero; leads the nav (#21)** | **None in Messaging Kit. `src/content/work.ts` — owner-supplied names, links and screenshots delivered 2026-08-24; summaries DRAFT in brand voice (Rule 4.3)** |
| Manifesto | Reframe the problem | "Most firms build what you ask for…" (`src/content/copy.ts`, dormant — re-confirm at the unit) |
| Services | Name the four engagements (Taxonomy §1) | Messaging Kit §05 Services |
| Process | Show the workflow + differentiator (Taxonomy §2) | "Strategy. Build. Validate. Stay." four-phase |
| About | The person behind it (solo) | New copy, Brand Philosophy §8 |
| Final CTA | Convert → modal | "Ready to build?…" |

**The service routes — CHANGED, live (decision-log #30, 2026-08-28).** Two pages, each four blocks, both rendered by the same `<ServicePage>` component:

| Block | Job | Canonical copy source |
|---|---|---|
| **Hero** | Name the page and open the modal | Eyebrow + `<h1>` fallback = Taxonomy §1 vocabulary. `/services/agentic-system` carries the Agentic System §05 description; `/services/product` groups three services and has no group-level approved copy, so it carries none. **The one-line promise is owner-owed.** |
| **What you get** (the topic blocks, as alternating split rows) | Land a visitor on the thing they clicked, and say what it delivers | `/services/product`: the three §05 service descriptions (`src/content/services.ts`). `/services/agentic-system`: the two tier descriptions (`src/content/pricing.ts`, read not copied). **Deliverable bullets are DRAFT** (`src/content/service-pages.ts`). |
| **How it works** | Show the workflow | `PROCESS.phases` — the same four phases the home page's `#process` accordion renders, as a numbered card grid |
| **Close** | Convert | `FINAL_CTA` heading and CTA. The `/pricing` link it briefly carried was removed by the owner (2026-08-28) |

**No price on either page**, and no link to `/pricing` from the page body — the close carried one briefly and the owner removed it (2026-08-28). `/pricing` is untouched by this unit and stays reachable from the nav bar's featured button and the footer on every page. **Product Support has no matching tier**, which the unit-26 brief flagged as an owner question; it is answered by omission — no page states or implies a figure, so the gap never surfaces to a visitor.

**Retired section plan (the old eleven-section page — RETIRED).** Nav, `#top` hero (shipped re-skinned — the one survivor), Manifesto `#why`, Process `#process`, Selected work `#work`, Services `#services`, About `#about`, Testimonials `#voices`, Who it's for `#fit`, FAQ `#faq`, Final CTA `#start`, Footer. Recorded so it can't be mistaken for the plan: five of its sections have **successors** in the #13 set (designed fresh, dark — the old layouts don't carry over); **Selected work has since returned on exactly that basis — a new decision (#16, 2026-08-24), designed fresh as a dark card rail, nothing of the paper-era tile grid carried over**. Testimonials, Who it's for, FAQ, nav and footer still do **not** — returning any of them requires a new decision. Dormant copy stays in `src/content/copy.ts`.

## User flows — **CHANGED**

**Live (as-built):** Hero → CTA opens the modal → **quick door** (name + email + optional needs) **or** "Rather walk us through it?" → the four-question **qualifier** → contact step. A "still exploring" answer on the qualifier (Q1/Q2) routes to the **off-ramp**, which offers an optional "Stay in Touch" email capture. Any abandoner keeps the `hello@nextsketch.com` escape hatch (in-modal and as the no-JS fallback). Logic in `05-business-rules.md` §1–2.

**RETIRED (the old multi-section journeys).** The pre-pivot scroll journeys routed through sections that are no longer planned (FAQ, Testimonials, Who it's for). New on-page journeys are defined as the #13 sections ship — the modal remains the single conversion point.

## Access rules — **CURRENT**

Everything public. No auth, no gated content, no roles — and **no backend beyond `/api/qualify`** (decision-log #8). The API route is the only server-side surface.
