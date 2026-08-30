# Build Note 26 — The Service Routes (adhoc Unit 26)

**Date:** 2026-08-28 · **Branch:** `adhoc/service-routes` · **Base:** `main` @ `4582c75`
**Status:** Built, not merged. PR opened by the owner. Adhoc, per `briefs/26-service-routes-adhoc.md`.
**Three passes at one band.** The routes were built first. The owner then supplied a reference for the "what you get" band and it was rebuilt into flat columns; he scrapped that and supplied a third reference, and it was rebuilt again into alternating split rows. Only the third ships — the first two are recorded so nobody re-proposes them.
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
| New | 6 | — |
| Changed | 3 source + 5 docs | — |

**New:**

| Path | What |
|---|---|
| `src/app/services/product/page.tsx` | The route + its metadata. Thin, like `pricing/page.tsx`. |
| `src/app/services/agentic-system/page.tsx` | Same. |
| `src/components/service-page.tsx` | Hero, the "what you get" split rows, and the close. |
| `src/components/service-block-visual.tsx` | The five wireframe mocks — the visual half of each row. |
| `src/components/service-process.tsx` | The "how it works" numbered card grid. |
| `src/content/service-pages.ts` | Both pages' content. |

**Changed:** `src/lib/types.ts` (the route/anchor vocabulary), `src/content/services.ts` (`SERVICE_PAGE_HREF`), `src/components/services-section.tsx` (the card name becomes a link), plus `docs/03`, `docs/04`, `docs/06`, `docs/07` and the decision log.

**Identifiers introduced:**

| Where | New |
|---|---|
| `src/lib/types.ts` | `ServicePageSlug`, `serviceRoute`, `ServiceBlockId`, `SERVICE_BLOCK_PAGE`, `serviceBlockHref`, `ServicePageBlock`, `ServicePageContent` |
| `src/content/service-pages.ts` | `SERVICE_PAGES` |
| `src/content/services.ts` | `SERVICE_PAGE_HREF` |
| `src/components/` | `ServicePage`, `ServiceProcess`, `ServiceBlockVisual` |

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
2. **"What you get"** — the topic blocks as alternating split rows (see below), one `<section id>` each.
3. **How it works** — the four canonical phases as a numbered card grid, from the owner-supplied reference.
4. **Close** — `FINAL_CTA` heading with its gold phrase and the CTA repeated. The gold `/pricing` link it briefly carried was **removed by the owner** (2026-08-28); `/pricing` stays reachable from the nav bar's featured button and the footer on every page.

**The "how it works" reference contributed layout only** — the PR #27 and build-note 23 posture. It gave a titled block above a numbered card row with the numeral **outside and above** each card. Refused: its visual mocks inside each card (we have no such asset, and inventing one is Rule 4.3), its three-step count (the process is four phases and has been since Taxonomy §2), its rounded cards, pill eyebrow and grey fill.

**It is deliberately not `<ProcessSection>`.** That component is the home page's `#process` accordion and carries the page's `(04)` section index. Mounting it here would put a second `id="process"` on a route that also links to `/#process`. The *content* is reused — same `PROCESS.phases`, same headline, same gold-italic aside — so a phase edit still lands in one place.

## The "what you get" band — three passes, one survivor

It has been rebuilt twice at the owner's direction, against two different references. **Only the third ships.** The first two are recorded so nobody re-proposes them:

| Pass | Shape | Verdict |
|---|---|---|
| 1 | A vertical stack of full-width glass cards, bullet list as a second column inside each card | Scrapped |
| 2 | A flat multi-column band, one column per topic, no card chrome, top hairline per column | Scrapped — "does not fit" |
| 3 | **Alternating split rows: text one side, a fading tile cluster the other** | **Ships** |

### What ships

Each block is a two-column row. The text side runs mono index → panel-scale name → description → gold-diamond deliverables list → **`<ServiceCta>`**. The visual side is a **wireframe mock built for that block**.

**The block CTA is the home page's service-card CTA, exactly** (owner direction, 2026-08-28). It shipped as the reference's outline button — the shared `<Button>` at `ghost` through `<ModalTrigger>` — and is now `<ServiceCta>`, the §Interaction-vocabulary gold underlined text link, so a service's CTA looks the same on the card that sends a visitor here and on the block they land on. Same seam, same `need`, same Rule 3.1 label; only the affordance changed.

**The sides alternate down the page** (owner direction) — that is what stops three or five rows reading as one table. The **text is always first in the DOM**; `lg:order-*` does the swapping, so the reading order and the single-column mobile stack both put substance before decoration.

### The page measure

Every band on both routes now centres its content on **`max-w-6xl`** (owner direction, 2026-08-30). The bands stay full-width and keep the binding gutter ladder; an inner `mx-auto w-full max-w-6xl` wrapper does the centring, applied to all four — hero, the "what you get" rows, §How it works, the close.

The symptom: at a wide viewport the two-column rows spread edge to edge, so the `max-w-lg` text column hugged the left gutter while the `max-w-md` mock centred itself in a very wide track. No two rows agreed and nothing lined up with the band above.

Three details that decide the implementation:

- **The measure is `<Container>`'s existing `max-w-6xl`,** so nothing new is invented.
- **It sits on an inner wrapper, not on the band.** `box-sizing: border-box` would otherwise subtract the gutters from the measure and shrink the content by 128px at `lg:`.
- **Mocks take `lg:max-w-none` and fill their column,** so a mock's outer edge meets the measure exactly as the text does on the other side. Centred inside the track it stayed inset by ~48px — the same inconsistency the measure was added to remove. Below `lg:` the row stacks and the `max-w-md` cap returns, so a mock never blows up to the full band on a tablet.

**The hero lockup is deliberately outside the measure**, on the viewport gutter. The nav bar's wordmark is there, and the two must land in the same place across the 80px handoff; centring it with the content would reintroduce the jump the zero-height sticky wrapper exists to prevent. Re-verified after the change.

> **An ambient gold hero glow shipped briefly and was removed** (owner direction, 2026-08-30). It reproduced the warm light in `/`'s orbit footage as a soft `gold` radial, on an `isolate` wrapper spanning the hero and the band under it so it could bleed. All of it is gone — the wrapper, the gradient, and the `bg-ink` removals it required — and the hero is flat `ink` again. The mocks' own radial fades are unrelated and untouched.

Measured at 1800px: `h1`, every block row, the process grid and the close heading all run 316→1468, the mocks sit flush at 924→1468 (and 316→860 on the alternating rows), and `scrollWidth === innerWidth`. `/` and `/pricing` still measure 64→1721 — untouched.

### Five visuals, not five shuffles

The first cut of this pass gave every block the same 2-3-2 tile cluster with the marks reordered. The owner's verdict was blunt and correct — "all the visuals are the same" — and he named what four of them should be. Only AI Workflow Integration keeps the cluster, which is the one block it actually suits:

| Block | Visual | Reads as |
|---|---|---|
| New Product | **Product UI** — window chrome, content column, one gold primary action, a page region below | The working product in production the §05 line promises |
| Product Completion | **Developer workspace** — tab strip with a gold active tab, line-number gutter, indented code lines that thin out and stop, a parked caret | "Someone got you 70% there and disappeared" |
| Product Support | **Live-product ops panel** (owner left this one to me) — uptime ticks with the newest two in gold, a release timeline with the newest marker filled | "The product is live. Now it needs to grow." |
| AI Workflow Integration | **The tile cluster — KEPT** (owner direction) | Agents dropped into processes the business already runs |
| Internal Tool | **Dashboard UI** — sidebar with a gold active item, top bar, a data table with an agent-run marker | "A real tool that you own", denser than the New Product window so the two never read as one mock |

Two things were explicitly ruled out and are worth recording: the mocks must **not look like app tiles** (owner, twice), which is why New Product's lower region is a wide-plus-narrow page layout rather than three equal squares; and the tile cluster is now used **once**, not as a house style.

### Detail, colour and one shared box (third round of owner feedback)

Three changes came back on the mocks, and one of them needed a decision row:

- **More interface detail.** Every mock now carries real chrome — window bar, nav row, tab strip, status bar, sidebar, top bar — and a **profile chip top-right**, which the owner named specifically.
- **Colour.** See below; recorded as **#31**.
- **One box, one fade.** All five sit in the same `4/3` frame so the rows line up down the page, and all five carry the tile cluster's **radial fade** rather than the earlier bottom scrim, so each dissolves into the page from every edge. The fade was tuned twice and then put back. Softening it (`ellipse 112% 112%`, clear out to 58%) kept the new chrome and profile chip legible at the edges, but the owner asked for the fade back, so it is the **full-strength** `transparent 40% → ink 94%` again. **One trap in this, and it bit once.** The tile cluster's fade must sit on the **cluster's own box**, not the shared `4/3` frame. `inset-0` on the frame scales the gradient's radius to 448x336 while the cluster is only ~240px across, so every tile lands inside the clear zone and the dissolve disappears while the CSS still reads as correct. The framed mocks fill their frame, so theirs can sit on it; this one cannot. That is a deliberate trade, recorded so nobody re-softens it: these are atmosphere, not diagrams, and a mock reading as a hard rectangle pasted on the page is the thing the fade exists to prevent. Anything that has to stay legible therefore belongs toward the centre of a mock — which is where each one's gold element already sits.

### Colour — decision #31, a narrow supersession of #14

The owner asked for colour "in the same colour range as our palette (reds greens and others)". That palette is `rose`, `sage` and `lavender` — **the three tokens decision #14 orphaned, and which this unit's own brief repeats a ban on.** Raised with him, reaffirmed, implemented, and narrowed on the way in the way **#26** narrowed "no CTA in the nav":

| Guardrail | How it holds |
|---|---|
| Chrome only | Syntax highlighting, status dots, an avatar chip, tinted cluster marks. Never a brand accent, never on a real control, never outside a mock |
| Never per-service | No block owns a colour. The `accent` field in `src/content/services.ts` is still unread and still dead data; the retired accent-block card vocabulary stays retired |
| Gold still the only emphasis | Spent at full strength exactly once per mock — the primary action, the active tab, the current release, the active nav item, the centre tile. The three chrome colours sit at 45–85% alpha beneath it |
| No new token | #14's "no new tokens" clause is untouched |

**The alphas and the mark stroke were measured, not guessed.** `sage` (#aebbba) and `lavender` (#bbb2ce) are deliberately desaturated pastels: below roughly 70% alpha, or at the hairline 1.25px stroke, they resolve to plain grey on a near-black tile. The cluster's marks went to **1.75px** for exactly this reason. Above ~85% they start competing with gold. `04-ux-spec.md` §Orphaned colors is amended to match, so the next agent does not read the old blanket ban and "fix" this.

### The mocks assert nothing — a Rule 4.3 requirement, not a style choice

**Not one of the five contains a readable string, a numeral, a metric, a logo or a product name.** A chart with an axis, a dashboard with figures, or a row of integration logos would assert things nobody has approved, on the two pages a search visitor lands on first. Decision **#5** is the precedent: the retired stat strip's invented numbers. Skeleton bars assert nothing, and every visual is `aria-hidden` so it says nothing to assistive tech either.

Surfaces are the system's: framed mocks are hairline `white/15` over solid `#0a0a0c` (solid, not §Surfaces' translucent-plus-blur, because no `ScrollVideo` is mounted here and there is nothing to blur), skeleton matter rides the white alpha ladder, and **`gold` appears once per mock** on the element that is the point of it.

### What the reference contributed, and what it did not

**Contributed:** the split, the alternation, the 2-3-2 stack, the single emphasized tile, and the radial fade.

**Refused:**

- **Every one of its dependencies.** The reference is shadcn: `Card`, `Button`, `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, a `cn()` helper and a `/components/ui` directory. **Nothing was installed and nothing ships.** The standing posture is zero new dependencies (build-note 23), §Interaction vocabulary is explicit that "icons are inline SVG, never `lucide-react`", components live flat in `src/components/`, and class composition is the repo's array join. Its outline button became the shared `<Button>` at `ghost` through `<ModalTrigger>`.
- **Its third-party product logos** — GitHub, Slack, Notion, Figma, Discord, VS Code. This was the one refusal that mattered: rendering those asserts integrations nobody has approved, which is precisely the invented claim Rule 4.3 exists to stop, on the two pages a search visitor lands on first. The tiles carry **abstract geometric marks** instead, and the whole cluster is `aria-hidden` so it makes no claim to assistive tech either.
- **`rounded-xl`, `shadow-black-950/10`, `bg-muted`, the `dark:` variants and the shadcn token palette.** Squared is the shape of the brand, the page is `ink`, there is no light mode, and the default Tailwind palette is cleared in `globals.css` so only brand tokens compile.
- **Dropping the deliverables list.** The reference's text column is heading + body + button, because its substance is in the tiles. Ours is decorative, so the section that is *called* "what you get" would have been left saying only what each service is.

### The marks — a flagged judgment call

§Interaction vocabulary settles the *list marker* (the gold diamond) and bans `lucide-react`, but it does not cover a decorative wireframe. The spec's own instruction for that case is to generalize from shipped code and flag, not invent silently. So everything is built **only from shapes the system already uses** — the rotated square, the hairline, the squared frame — on the white alpha ladder, with `gold` reserved for the one emphasized tile per cluster. No new token, no new colour, no third accent. The tile cluster's eight marks are `diamond`, `frame`, `grid`, `stack`, `hub`, `branch`, `step`, `field`; the four framed mocks are built from the squared frame, the hairline and the bar alone.

### Motion

**No keyframe was added; `globals.css` is untouched.**

| Interaction | What it does |
|---|---|
| Text reveal | Each row's text reveals as one block; the deliverables land at `120 + j·70ms`. |
| Mock assembly | Each visual reveals region by region, so it **builds** rather than appears — the cluster tile by tile, the IDE line by line, the dashboard row by row. Shared `ScrollReveal`, so JS only triggers and the CSS `rise-in` animates. |
| **Deep-link target** | The rows are tall, so arriving from a service card has to say *which* one you arrived at. The block's **index goes gold**, and on the agentic block the cluster's **emphasized tile takes a gold hairline**, both at the 150ms tempo — the Process accordion's open-row treatment doing identical work, with gold on only those two elements so the accent stays scarce. **Pure CSS `:target`** — holds with no JS, adds no transform for reduced motion to suppress. |

Deliberately **not** added: hover states on the rows or tiles. They are not interactive, and a hover response on non-interactive content is decoration for its own sake, which Brand Philosophy §9 rejects.

> **Verification note.** The Browser pane does not advance CSS *transitions* while it is not painting, so a naive `getComputedStyle` read of the target treatment returns the pre-transition value forever and reads as a bug. Confirmed correct by disabling transitions inline and re-reading: the targeted row's index is `rgb(228,185,118)` (the `gold` token) and its emphasized tile's hairline is gold at 60%; untargeted rows read `white/0.55` and `white/0.45`.

### The bullets ship as DRAFT

`included` was empty on all five blocks. It is not any more, and this is the one judgment call carried over from pass 2: the owner asked for the layout built with content relevant to each page, and **a layout with nothing in it cannot be reviewed.** The bullets are the ones drafted for approval in this note (below), marked **DRAFT pending owner approval** in `src/content/service-pages.ts` — the flag every other drafted string in this repo carries. Emptying an array restores the render-nothing behaviour exactly.

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

Two slots are empty, and each renders **nothing at all** rather than a placeholder or an empty frame; the third (the bullets) now ships as DRAFT (Rule 4.3, and the brief's "draft what is missing, put it in the build notes for approval, and stop"). This is the `/pricing` empty-`features` posture. **All of it drops into `src/content/service-pages.ts` and nowhere else.**

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

### 3. The "what you get" bullets (`included`) — SHIPPED AS DRAFT, ratify or rewrite

Live on the page (see above). Deliverables, not adjectives, per the brief. Four per block so the rows balance against their tile clusters:

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

**2. The close's `/pricing` link is gone — RESOLVED.** The brief asked for "one line linking to `/pricing`", and it shipped as `PRICING.headline` used as the link text (approved copy that named its own destination, so nothing was authored). The owner removed it on 2026-08-28. The close now carries one action, and `/pricing` is still reachable from the nav bar's featured button and the footer on every page.

**3. "One line each, scoped to this service" was not done.** The owner's layout asked the four phases to be scoped per service. That is five sets of new copy, so the band renders the existing approved `phase.description` instead. Scoped one-liners are a separate copy pass; say the word and they are drafted.

**4. The "how it works" reference's visual panels are absent.** No asset exists for a phase and inventing one is Rule 4.3. If real ones arrive the card already has the slot.

**5. Neither route is in the nav.** #22/#24/#26 settled the six items and this unit does not reopen them. Consequence, recorded rather than resolved: **a visitor on one service route cannot reach the other from the chrome** — only via `/#services`. Adding them is a separate owner call.

**6. Inherited, not introduced: em dashes render on these pages.** `PROCESS.phases` carries two (`"No wasted effort — we move into build"`, `"what comes next — as long as"`). Both predate decision #19 and render identically on `/`; #19 is not enforced mechanically and rewording canonical copy is an owner call (Rule 4.1). Flagged, not touched. (`ServiceCta`'s `aria-label` carries a third, but that component no longer renders on these routes — the blocks use `ModalTrigger` now. It still renders on the home page's cards.)

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
