# Taxonomy — NextSketch Website Rebuild

**Version:** 2.3 · **Date:** 2026-08-28 · **Status:** Active — one service vocabulary across every surface (decision-log #27–#29)
**Answers:** How is everything classified and named?
**References:** `05-business-rules.md` (logic that uses these values) · `04-ux-spec.md` (color roles) · `07-technical-spec.md` (the lead data contract) · `src/lib/schema.ts`, `src/lib/lead-format.ts`, `src/content/modal.ts` (canonical values in code)

> **Reconciliation tags:** **CURRENT** (true as-built) · **CHANGED** (rewritten to match the as-built or an owner decision) · **RETIRED** (no longer the direction; recorded so it can't be mistaken for current). The Sprint-03 **DEFERRED** tag is gone (2026-07-06): the old multi-section light build is no longer a pending destination — the redesign (decision-log #13) adds five sections in the dark design-system language instead, and gold is the only accent (decision-log #14). Code is canonical where it and this doc disagree.

---

## Classification systems index

1. Services
2. Process phases
3. Modal answers (label → payload mapping)
4. Lead types & signals
5. Color tokens
6. Routes, section IDs and the nav item set
7. Placeholder assets
8. Naming conventions
9. Deprecation log

## 1. Services (canonical names, exact casing) — **CHANGED (decision-log #27–#28, 2026-08-28)** · **RETIRED** (accent mapping)

**These four names are what the site says everywhere a visitor can read them** — the Services cards, the hero **capability strip**, the `/pricing` tiers, and the modal's quick-door selector. The quick door is the reference: it is the only surface a visitor reaches *after* choosing, so a name it does not use is a name that disappears mid-conversion.

| Display name | Slug | Payload value (§3) | Status |
|---|---|---|---|
| New Product | `new-product` | `new_product` | **CURRENT** (#27) |
| Product Completion | `product-completion` | `rescue` | **CHANGED** (#27, was "Rescue & Completion" / `rescue`) |
| Product Support | `product-support` | `partnership` | **CHANGED** (#27, was "Ongoing Product Partnership" / `partnership`) |
| Agentic System | `agentic-system` | `agentic` | **CHANGED** (#27, was "Agentic Systems Integration" / `agentic`) |

**Three vocabularies, and only one of them renames.** The *display name* is what a visitor reads. The *slug* is kebab-case (§8), matches the display name one-for-one, and is what unit 26's service routes are built on. The *payload value* is snake_case (§3), is written to the lead record, and is a **contract that does not move with a rename** — which is why `product-support` still stores as `partnership`. Canonical in `src/lib/types.ts` → `ServiceSlug`, `src/content/services.ts` → `SERVICES` + `SERVICE_NEED`, and `src/lib/schema.ts` → `PROJECT_TYPE_VALUES`.

This closes a divergence open since **2026-08-04**, when the cards took short names while this table and `LANDING.capabilities` kept long ones. Aligning the capability strip is a **Rule 4.1 edit to Messaging Kit §05** canonical copy and carries its own row (#28) — like the hero headline under #18, **do not "correct" the strip back to the Kit's long forms.**

The service **descriptions** are still §05 as written; a rename is not permission to reword them (Rule 4.1). Gold is the only accent (#14); the old per-service accent pairs (gold/rose/lavender/sage) and the paper-design service cards are **RETIRED**, and the dormant `accent` field is dead data.

### Two kinds of agentic system — **CURRENT (#29)**

`/pricing` sells the Agentic System service at **two depths**, which is why two tiers share one project type rather than one of them being mis-mapped:

| Tier | What it is | Preselects |
|---|---|---|
| **AI Workflow Integration** | Agents and custom tools dropped into processes the business already runs. Workflow level, no product wrapped around them. | `agentic` |
| **Internal Tool** | A full product with a real interface and agents behind it, owned by the client and logged into by their team. | `agentic` |

The modal asks a visitor **what they need, not how deep they want to go** — the depth is what the two price points express. This is positioning language, not an implementation note: unit 26's service routes depend on it.

## 2. Process phases (ordered, exactly four) — **CURRENT** (model) · **RETIRED** (accent mapping)

The four-phase model is canonical and still exists in code (`src/content/copy.ts` → `PROCESS`); a **Process section** is in the redesign set (decision-log #13), designed later against `04-ux-spec.md`. The old per-phase accent pairs are **RETIRED** — gold is the only accent (decision-log #14); the dormant `PROCESS` copy's accent fields are a leftover of the retired design, not a spec.

| Order | Display | Slug |
|---|---|---|
| 01 | Strategy | `strategy` |
| 02 | Build | `build` |
| 03 | Validate | `validate` |
| 04 | Partner | `partner` |

## 3. Modal answers — label-to-payload mapping — **CURRENT** (qualifier) · **CHANGED** (quick door added)

Payload values are what the lead record stores (the Sheet writes the display **labels**; the snake_case values are the schema/contract). Builders never invent alternates. Canonical in `src/content/modal.ts` + `src/lib/schema.ts`.

**Lead `kind` discriminator (CHANGED — Sprint 02 Unit 04):** every lead is `kind: "qualified"` (the full four-question qualifier) or `kind: "quick"` (the low-friction door). The quick kind also carries `source: "quick_door" | "off_ramp"`.

**Qualifier (`kind: "qualified"`) — CURRENT:**

**Q1 `project_type`:** New product from scratch → `new_product` · Stuck at 70% — rescue or finish → `rescue` · Agentic systems for my product or operations → `agentic` · My live product needs a partner → `partnership` · I'm still exploring → `exploring`

**Q2 `readiness`:** Ready now → `now` · Within 1–3 months → `soon` · Just exploring → `exploring`

**Q3 `authority`:** Yes, it's my call → `full` · Shared decision → `shared` · No — I'd need buy-in → `none`

**Q4 `validation`:** Already validated → `validated` · Yes — that's why I'm here → `willing` · I just want it built → `build_first`

**Contact:** `name`, `email`, `company` (optional, qualifier only), `details` (optional).

> `exploring` is a **UI-only** value (Q1/Q2): it routes to the off-ramp (Rule 2.1) and is deliberately absent from the submit schema's qualifier enums, so it can never be POSTed as a qualified lead (`src/lib/schema.ts`).

**Quick door (`kind: "quick"`) — CHANGED (new):** collects `name`, `email`, an optional `details` line, and an optional **multi-select** `project_types` (zero or more canonical project-type values). The quick door labels are **shorter** than the qualifier's for the same values (`src/content/modal.ts` → `MODAL_QUICK.needsOptions`):

| Value | Qualifier label (Q1) | Quick-door label |
|---|---|---|
| `new_product` | New product from scratch | New product |
| `rescue` | Stuck at 70% — rescue or finish | Product completion |
| `partnership` | My live product needs a partner | Product support |
| `agentic` | Agentic systems for my product or operations | Agentic system |

The off-ramp capture (`source: "off_ramp"`) collects only `name` + `email` (no `project_types`).

## 4. Lead types & signals — **CHANGED**

Computed in `src/lib/lead-format.ts` (`leadSignal`). The pre-pivot set (`qualified` / `flagged` / `off_ramp`, where off-ramp was "not a lead, not emailed") is superseded: the off-ramp now **captures**, so an exploring visitor becomes a real `exploring` lead.

| `lead_type` | Meaning | Signal label (Rule 2.5) |
|---|---|---|
| `qualified` | Full qualifier completed, no flags | `[Lead]` |
| `flagged` | Qualifier completed with Q3 = `none` and/or Q4 = `build_first` | `[Lead — needs buy-in]` · `[Lead — build-first mindset]` · `[Lead — review answers]` (both) |
| `quick` | Quick-door lead (no qualifier answers) | `[Lead — quick]` |
| `exploring` | Off-ramp capture (still-exploring visitor who opted to stay in touch) | `[Lead — exploring]` |

**Lead `source` (quick kind only):** `quick_door` (primary quick path) · `off_ramp` (the still-exploring capture). The signal label encodes which one.

## 5. Color tokens — **see `04-ux-spec.md` §Color (canonical)**

Token names — `paper` · `paper-bright` · `ink` · `white` · `gold`/`gold-ink` · `lavender`/`lavender-ink` · `rose`/`rose-ink` · `sage`/`sage-ink` — remain defined in `src/app/globals.css`; Tailwind theme keys use exactly these names (**CURRENT**). The design system uses four of them (**CURRENT**): `ink` (page surface), `white` (text), and **`gold`/`gold-ink` — the only accent** (decision-log #14). The rest are **orphaned** (**CHANGED**): `lavender`/`rose`/`sage` (+ `-ink` pairs) and `paper-bright` have no design role and are unavailable to new sections; `paper` is orphaned with one live exception — the 404 surface (**CURRENT**). Removing orphaned tokens from `globals.css` is a future owner-approved code change. Pairing rule (accent bg ⇒ paired `-ink` text) is **CURRENT/binding**. Full detail in `04-ux-spec.md` §Color.

## 6. Routes and section IDs — **CHANGED** (a second route; nav items carry hrefs) · **RETIRED** (held-section IDs)

### Routes — **CHANGED (decision-log #23, 2026-08-25)**

| Route | What it is | Status |
|---|---|---|
| `/` | The home page — hero + six sections, one scroll | **CURRENT** |
| `/pricing` | Standalone pricing page, statically prerendered | **CHANGED (new, #23)** |
| `/api/qualify` | POST-only lead endpoint, no page | **CURRENT** (see `07-technical-spec.md`) |

Route paths are kebab-case per §8. `/pricing` is a **page, not a server surface** — decision #8 is untouched. Canonical in `src/lib/types.ts` → `ROUTES`.

### Section IDs (anchor names)

The live anchor set, all on `/`: `top` (page top — wordmark target, on `<main>`) · **`work` (Selected Work)** · `why` (Manifesto) · `services` · `process` · `about` · `start` (Final CTA). These reuse the fitting old IDs, as this section anticipated. `start` is reached via the CTAs, not a nav item.

### Nav item set and order — **CHANGED (decision-log #22–#24, 2026-08-25)**

Six items, in this order, rendered by both `SiteNav`'s overlay and `SiteFooter` from the same `NAV.items` array:

| # | Label | Destination | Kind |
|---|---|---|---|
| 1 | Work | `/#work` | section anchor — leads the set (#21) |
| 2 | Why | `/#why` | section anchor |
| 3 | Services | `/#services` | section anchor |
| 4 | Process | `/#process` | section anchor |
| 5 | About | `/#about` | section anchor |
| 6 | **Pricing** | **`/pricing`** | **route** — last slot (#24) |

**Destinations are root-relative, never bare hashes** (#23). A bare `#work` resolves against the current route, so on `/pricing` it would mean `/pricing#work` — nothing. `NAV.items` therefore carries a finished `href` per item rather than a `SectionId` the components turn into `#${id}`; anchors are built by `sectionHref()` in `src/lib/types.ts`, which keeps the `SectionId` literal so a mistyped anchor still fails typecheck. Both wordmark targets are `NAV.home` = `/#top`.

**The nav is a hamburger at every breakpoint** (#22): there is no visible tab row at any width, and the overlay is the only place these six render.

**`work` reactivated — CHANGED (decision-log #16, 2026-08-24).** It was dormant under #13, which required a new decision to bring it back; the owner made that call to fix a conversion problem (nothing on the page demonstrated proof of work). It ships as the **first section below the hero** and takes the **(01)** structural index, renumbering the rest to (02)–(06). The remaining old IDs (`voices` · `fit` · `faq`) stay dormant with their held sections — reactivating any still requires a new decision (#13).

## 7. Placeholder assets (naming convention) — **CURRENT** (convention) · **RETIRED** (old inventory)

The naming convention stands for any future section asset: `placeholder-{section}-{nn}.{ext}` in `/public/placeholders/`, fixed aspect ratio, swap-in at handoff.

**Work screenshots — CURRENT (decision-log #16, 2026-08-24).** The selected-work images are **shipped brand assets, not placeholders** (the hero/backdrop precedent below), so they land at **`/public/work/{id}.jpg`** — kebab-case per §8, `{id}` matching the item's `id` in `src/content/work.ts`. Any source resolution is fine: the card frame is a fixed **16/9** box and the image center-crops from the top (`object-cover object-top`), so every card matches regardless of the screenshot's real dimensions (owner requirement). An item with no `image` yet renders the layout-final ink placeholder in that same frame, so the real asset swaps in with zero layout shift. The old multi-section placeholder *inventory* (work tiles, testimonial blocks) is **RETIRED** with that build; redesign sections define their asset needs per-section (#13). The interim remote hero background image is **CLOSED** (Unit 03, decision-log #15): the hero and site backdrops are now **shipped brand assets**, not placeholders — `hero-orbit.mp4` / `hero-orbit-poster.jpg` and `backdrop-{strategist,builder,partner}.mp4` + `-poster.jpg` in `/public/` (kebab-case per §8; referenced via `LANDING.backgroundVideo` / `backgroundPoster` and `page.tsx`, config not copy assets).

## 8. Naming conventions — **CURRENT**

- Components: PascalCase (`QualificationModal`, `HeroCta`).
- Files/routes/slugs: kebab-case. Payload values: snake_case (§3). Apps Script reference: `scripts/inbound-leads.gs`.
- Brand name: **NextSketch** (one word, capital N and S) in all copy; legal line: "Next Sketch LLC".

## 9. Deprecation log

| Retired value | Replaced by | Why | Old-data handling |
|---|---|---|---|
| Fonts: **Inter**, **Caveat** | **Space Grotesk** (display/UI) + **JetBrains Mono** (mono) | 2026-06-14 pivot (decision-log #1, superseded) | None to migrate; must not appear as a current design claim |
| Light **paper/ink** theme as the default page surface | **Dark** theme (`ink` surface, `white` text, `gold` accent) | 2026-06-14 pivot | Token names retained; the light design is **retired** (decision-log #13 — the redesign builds dark), not deferred |
| Per-service / per-phase **accent pairs** (rose, lavender, sage rotation) | **Gold-only accent** (`gold`/`gold-ink`) | Decision-log #14 (2026-07-06) | Tokens orphaned in `globals.css` (no design role); dormant copy's accent fields are leftovers, not spec |
| **Eleven-section light page plan** (dormant components + old anchors) | **Five-section dark redesign** — Manifesto, Services, Process, About, Final CTA against `04-ux-spec.md` v3.0 | Decision-log #13 (2026-07-06) | Component code/copy stays dormant on disk (delete vs. keep = separate owner call, build-note 08); must not be referenced for new sections |
| Lead type **`off_ramp`** ("not a lead, not emailed, not counted") | **`exploring`** (a captured lead from the off-ramp) | Sprint 02 Unit 04 — off-ramp now captures an email | No data to migrate; honest "exploring" signal instead of a non-lead |
| "Leads exist only as emails" / single email to `hello@nextsketch.com` | **Google Sheet system of record** (+ best-effort Asana) with Resend **notification** | Sprint 02 Units 02–03 | See `07-technical-spec.md` §Data model |
| Services: Industrial Design, UI/UX Design, Mechanical Design | §1 services | Repositioning, June 2026 | None to migrate; must not appear (Rule 3.4) |
| Service names: "New Products from Scratch", "Rescue & Completion", "Agentic Systems Integration", "Ongoing Product Partnership" (and the 2026-08-04 card short forms "Agentic Systems" / "Ongoing Partnership") | §1 names — New Product, Product Completion, Product Support, Agentic System | Decision-log #27–#28 (2026-08-28): one vocabulary, the quick door's | Display only. **Payload values are unchanged**, so no lead data migrates and no `/api/qualify` contract moves |
| Service slugs `rescue`, `agentic`, `partnership` | `product-completion`, `agentic-system`, `product-support` | Decision-log #27 — a slug should not be a fossil of a retired name | Internal only; never appeared in a URL or a payload. **Pricing tier slugs are NOT renamed** — `custom` ("New Product") and `rescue` ("Product Completion") stay as they are, and the mismatch is a separate owner call |
| Pricing tier names "Save Your Project", "Custom Product" | "Product Completion", "New Product" | Decision-log #27 | Display only; prices, descriptions, notes, order and the empty `features` arrays are untouched |
| Brand: Autonomous Whales | NextSketch (single brand) | DBA retired | Banned term (Rule 3.4) |
| Term: "automations" / "agentic workflows" | "embedded agents" / "agentic systems" | Brand Philosophy changelog | Banned term (Rule 3.2) |
| CTA: "Book a free chat" + Calendly links | Modal + Rule 3.1 CTA set | Qualification mindset | Calendly removed entirely |
| Pages: /projects, /about-us, /contact-us | Single page | Architecture decision | 301 redirects (`08-runbook.md`) — owner-executed at domain cutover |
