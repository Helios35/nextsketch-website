# Build Note 26 — The Service Routes (adhoc Unit 26)

**Date:** 2026-08-28 · **Branch:** `adhoc/service-routes` · **Base:** `main` @ `4582c75`
**Status:** Built, not merged. PR opened by the owner. Adhoc, per `briefs/26-service-routes-adhoc.md`.
**Follows:** PR #33 / build-note 25 (the service-name alignment this unit had to wait for).

---

## What the brief said, and what the owner decided instead

The brief specified **four routes, one per service slug**, and left three things explicitly to the owner in session. All three were answered on 2026-08-28, and one of them overrides the brief's own shape:

| Brief | Owner's call | Where it is recorded |
|---|---|---|
| Four routes, one per `ServiceSlug` | **Two grouped pages**, each with an anchored block per topic | decision-log **#30** |
| "How the home-page service cards reach these pages" — open | The card's **name** links to that service's block; the card's CTA is unchanged | #30 |
| "What sections a service page carries" — open | **Four blocks:** hero · topic blocks · how it works · close. No proof band, no FAQ, no testimonials, no price. | #30 |
| "Product Support has no matching pricing tier" — open | Answered **by omission**: no page states or implies a figure, so the gap never reaches a visitor | #30 |

Unit 25 was confirmed merged (`4582c75`) before any of this was written, so nothing here was built against the old service names.

## What shipped

| | Files | Lines |
|---|---|---|
| New | 5 | — |
| Changed | 3 source + 5 docs | — |

**New:**

| Path | What |
|---|---|
| `src/app/services/product/page.tsx` | The route + its metadata. Thin, like `pricing/page.tsx`. |
| `src/app/services/agentic-system/page.tsx` | Same. |
| `src/components/service-page.tsx` | Hero, the anchored topic blocks, and the close. |
| `src/components/service-process.tsx` | The "how it works" numbered card grid. |
| `src/content/service-pages.ts` | Both pages' content. |

**Changed:** `src/lib/types.ts` (the route/anchor vocabulary), `src/content/services.ts` (`SERVICE_PAGE_HREF`), `src/components/services-section.tsx` (the card name becomes a link), plus `docs/03`, `docs/04`, `docs/06`, `docs/07` and the decision log.

**Identifiers introduced:**

| Where | New |
|---|---|
| `src/lib/types.ts` | `ServicePageSlug`, `serviceRoute`, `ServiceBlockId`, `SERVICE_BLOCK_PAGE`, `serviceBlockHref`, `ServicePageBlock`, `ServicePageContent` |
| `src/content/service-pages.ts` | `SERVICE_PAGES`, `SERVICE_PAGE_INCLUDED_LABEL` |
| `src/content/services.ts` | `SERVICE_PAGE_HREF` |
| `src/components/` | `ServicePage`, `ServiceProcess` |

`src/lib/types.ts` gains one import it did not have: `type ProjectType` from `src/lib/schema.ts`, so `ServicePageBlock` can carry the need its CTA preselects. Type-only, erased at compile, and `schema.ts` does not import `types.ts`, so there is no cycle.

## The route shape, and why

**Two thin routes, no dynamic segment.** A `[slug]` segment for two entries buys nothing and costs `generateStaticParams`, a `notFound()` path and a layer of indirection between a route and its metadata. Two files match the `/pricing` precedent exactly.

**A service page slug is not a `ServiceSlug`, and the code says so out loud.** `product` groups three services and has no service behind it; `agentic-system` is spelled exactly like its slug because that page *is* that service. Keeping them in one union would have been the quiet mistake here — `SERVICE_PAGE_HREF` sends three cards to a block and the fourth to a page root, and that difference is only legible because the two vocabularies are separate types.

| Card | Destination |
|---|---|
| New Product | `/services/product#new-product` |
| Product Completion | `/services/product#product-completion` |
| Product Support | `/services/product#product-support` |
| Agentic System | `/services/agentic-system` (the page, not a block — the two blocks are *depths* of it, not the service) |

**No hash is hand-written anywhere.** `serviceBlockHref` looks a block's page out of `SERVICE_BLOCK_PAGE`, a total map, so a link cannot pair a block with a page that does not carry it and every href is root-relative by construction. This was the brief's headline trap, and it is closed structurally rather than by review.

## The four blocks

1. **Hero** — `/pricing`'s intro band, reproduced: sticky lockup, mono eyebrow, `display`-scale `<h1>` with a gold payoff word, description, divided-arrow `ModalTrigger`. Load-time `rise-in` at 0 / 120 / 200ms, not a scroll trigger, because it is above the fold.
2. **Topic blocks** — one `<section id>` each, a squared hairline glass card running mono index → panel-scale name → description → gold `ServiceCta`, with the pricing card's `Included` list as a second column when bullets exist.
3. **How it works** — the four canonical phases as a numbered card grid, from the owner-supplied reference.
4. **Close** — `FINAL_CTA` heading with its gold phrase, the CTA repeated, and one gold link to `/pricing`.

**The "how it works" reference contributed layout only** — the PR #27 and build-note 23 posture. It gave a titled block above a numbered card row with the numeral **outside and above** each card. Refused: its visual mocks inside each card (we have no such asset, and inventing one is Rule 4.3), its three-step count (the process is four phases and has been since Taxonomy §2), its rounded cards, pill eyebrow and grey fill.

**It is deliberately not `<ProcessSection>`.** That component is the home page's `#process` accordion and carries the page's `(04)` section index. Mounting it here would put a second `id="process"` on a route that also links to `/#process`. The *content* is reused — same `PROCESS.phases`, same headline, same gold-italic aside — so a phase edit still lands in one place.

## Copy: nothing was written for the page

Every rendered string on both routes already existed and is *referenced*, never re-literalled — a second copy of a §05 line in a second file is drift waiting to happen.

| Slot | Source |
|---|---|
| Block names | Taxonomy §1 / `PRICING_TIERS` names |
| Block descriptions | Messaging Kit §05 via `SERVICES`; the two tier descriptions via `PRICING_TIERS` |
| Agentic hero intro | The Agentic System §05 description |
| Eyebrows / `<h1>` fallbacks | `"Agentic System"` (Taxonomy §1, exact) and `"Products"` (the group word out of `SERVICES_HEADLINE` — the two routes are that sentence's two halves) |
| How it works | `PROCESS.eyebrow`, `PROCESS.headline`, `PROCESS.phases`, `PROCESS.annotation` |
| Close | `FINAL_CTA.eyebrow`, `.headline`, `.cta`; the pricing link's label is `PRICING.headline` |
| CTAs | `LANDING.cta`, `FINAL_CTA.cta`, `SERVICES_CTA` — all three from the Rule 3.1 exhaustive set |
| `Included` label | The word `PRICING.featuresLabel` uses, deliberately not a second one |

**The two exceptions are the metadata**, which the brief required by name ("Real metadata on all four… These are the first pages anyone will land on from search"). Both are **DRAFT pending approval**, on the `SITE.title` precedent:

| Route | Title | Description |
|---|---|---|
| `/services/product` | `Product Development \| NextSketch` | "New products built from an idea, half built products taken to launch, and live products kept growing. NextSketch builds software from idea to production, and stays." |
| `/services/agentic-system` | `Agentic Systems \| NextSketch` | "Embedded agents built into the processes your business already runs, or an internal tool your team logs into with agents behind it. NextSketch builds agentic systems that solve a real problem." |

## ⚠ Owner-owed copy — drafted below, rendering nothing until approved

Three slots are empty, and each renders **nothing at all** rather than a placeholder or an empty frame (Rule 4.3, and the brief's "draft what is missing, put it in the build notes for approval, and stop"). This is the `/pricing` empty-`features` posture. **All of it drops into `src/content/service-pages.ts` and nowhere else.**

### 1. The one-line promise (`headline` + `accentPhrase`)

The `<h1>` currently falls back to `name` — `"Products"` and `"Agentic System"`. That is canonical vocabulary rather than drafted copy, so nothing invented ships and the page is never headless, but it is thin and it is the single most visible thing this unit left behind. Drafts, gold payoff word in **bold**:

| Route | Draft `headline` | `accentPhrase` |
|---|---|---|
| `/services/product` | "Software built from idea to **production**." | `production` |
| `/services/product` (alt) | "Whatever state your product is in, we take it **forward**." | `forward` |
| `/services/agentic-system` | "Agents built into the work your business **already does**." | `already does` |
| `/services/agentic-system` (alt) | "Intelligence in your product, because it solves a **real problem**." | `real problem` |

### 2. The `/services/product` hero intro

There is no approved group-level description for three services, so that hero carries none. Draft:

> "Three ways in, one way of working. Whether the product does not exist yet, stalled at 70%, or is live and needs to keep growing, we validate first, build it correctly, and stay."

### 3. The "what you get" bullets (`included`)

Empty on all five blocks. Deliverables, not adjectives, per the brief. Four to six each:

**New Product**
- A validated scope you sign off on before a line is written
- A working product in production, not a demo
- The build run through our internal workflow, start to finish
- Handover of everything: code, accounts, deployment
- A partner still there the week after launch

**Product Completion**
- A written assessment of what was built and what it is worth keeping
- A direction validated before more money goes into it
- The remaining work scoped and priced as one flat figure
- The product live in production
- Two months to decide whether we stay

**Product Support**
- A retainer that covers evolution, not just uptime
- Monthly work agreed with you, not billed by the hour
- The product maintained, monitored and kept current
- Whatever comes next, built by the people who built it
- No handoff, no relearning your business

**AI Workflow Integration**
- An assessment of where agents create real value in your day to day
- Embedded agents built into the processes you already run
- Custom tools where an agent alone will not do the job
- Validation in production, on your real work
- One flat upfront figure, then the monthly partnership

**Internal Tool**
- A tool your team logs into, built around how they actually work
- Agents behind a real interface, not a chat window
- Built on your processes, not a template
- Yours to own, with everything handed over
- Validation in production, then the monthly partnership

## Deviations and calls made

**1. The card name became a link — the one change to a shipped component.** The brief calls the card affordance an owner call; the owner answered it with "goes to the sections covering each topic clicked", and without it the pages are unreachable from the site. The name rests as the white heading it already was under a `white/25` hairline underline and takes gold only on hover and focus. Deliberately **not** the §Interaction-vocabulary gold text link: gold on the heading would put a second gold element directly above the card's gold CTA and spend the page's one accent twice per card. An underline adds no width, so the measured one-line `nowrap` guarantee is intact. **The card's existing CTA is untouched** — same modal, same preselect. Six lines, trivially reverted.

**2. `PRICING.headline` is the `/pricing` link's label.** The brief asked for "one line linking to `/pricing`". Authoring that line is new copy; `PRICING.headline` is approved copy that says exactly what is on the other end, so the link's accessible name is its own destination and nothing is invented.

**3. "One line each, scoped to this service" was not done.** The owner's layout asked the four phases to be scoped per service. That is five sets of new copy, so the band renders the existing approved `phase.description` instead. Scoped one-liners are a separate copy pass; say the word and they are drafted.

**4. The reference's visual panels are absent.** No asset exists for a phase and inventing one is Rule 4.3. If real ones arrive the card already has the slot.

**5. Neither route is in the nav.** #22/#24/#26 settled the six items and this unit does not reopen them. Consequence, recorded rather than resolved: **a visitor on one service route cannot reach the other from the chrome** — only via `/#services`. Adding them is a separate owner call.

**6. Inherited, not introduced: em dashes render on these pages.** `PROCESS.phases` carries two (`"No wasted effort — we move into build"`, `"what comes next — as long as"`), and `ServiceCta`'s `aria-label` builds `"{label} — {service}"`. All three predate decision #19 and render identically on `/`; #19 is not enforced mechanically and rewording canonical copy is an owner call (Rule 4.1). Flagged, not touched.

## Verification

All green, and the browser checks the brief asked for were run rather than assumed:

| Check | Result |
|---|---|
| `npm run typecheck` | clean |
| `npm run lint` | clean |
| `npm run build` | clean — `/services/product` and `/services/agentic-system` both marked **○ (Static)** |
| `npm run banned-terms` | clean, 56 files |
| Console errors on both routes | none from the site. Four 400s are the Apollo visitor tracker and the Vercel analytics debug script hitting external endpoints from localhost — site-wide, pre-existing (unit 19). |
| Every link **from** a service route | 17 anchors audited in-browser: all root-relative, all resolving. Nav overlay's six, footer's six, both wordmarks, the pricing link, the CTAs' `mailto` fallback. **No bare hashes.** |
| Deep link | `/services/product#product-support` lands the block at exactly 80px from the top — the `section[id]` scroll-margin, clearing the fixed bar. Same for `#new-product` via a real click from `/#services`. |
| Wordmark handoff | Probed at y = 0 / 40 / 78 / 82 / 120 / 300 and compared against `/pricing` at the same points: **identical**. Page lockup only below 80px (top 24), both from 82px up (nav 20–21, page 24). No window with no logo. |
| Mobile (375×812) | No horizontal overflow (`scrollWidth === innerWidth`); blocks and phase cards stack cleanly. |

## Open for the owner

1. **The three copy slots above.** Nothing else in this unit is blocked on anything.
2. **Ratify or replace the two page titles and descriptions.**
3. **Do the service routes belong in the nav?** Today they do not, and the two pages cannot reach each other.
4. **Scoped per-service phase lines** — the one part of the owner's layout not built, and deliberately.
