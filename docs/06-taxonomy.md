# Taxonomy — NextSketch Website Rebuild

**Version:** 2.6 · **Date:** 2026-10-14 · **Status:** Active. One service vocabulary across every surface, and the slugs double as route segments (decision-log #27–#30); token names are fin's Zen Linen dark set, and the old ones are retired (#47–#48, §5); one hero video asset, now carrying the #50 sketch footage at the same filename (#46, #50, §7)
**Answers:** How is everything classified and named?
**References:** `05-business-rules.md` (logic that uses these values) · `04-ux-spec.md` (color roles) · `07-technical-spec.md` (the lead data contract) · `src/lib/schema.ts`, `src/lib/lead-format.ts`, `src/content/modal.ts` (canonical values in code) · `src/app/globals.css`, `src/app/layout.tsx` (canonical token and font names in code)

> **Reconciliation tags:** **CURRENT** (true as-built) · **CHANGED** (rewritten to match the as-built or an owner decision) · **RETIRED** (no longer the direction; recorded so it can't be mistaken for current). The Sprint-03 **DEFERRED** tag is gone (2026-07-06): the old multi-section light build is no longer a pending destination, because the redesign (decision-log #13) adds five sections in the dark design-system language instead. **Coral (`brand`) is the only accent** (decision-log #47, 2026-10-14): it supersedes #14's gold under the same one-accent rule, and the site is dark only, with no theme toggle. Code is canonical where it and this doc disagree; for §5 that means `src/app/globals.css`.

---

## Classification systems index

1. Services
2. Process phases
3. Modal answers (label → payload mapping)
4. Lead types & signals
5. Design tokens (color, radius, type, shadow, motion, utilities)
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

**Three vocabularies, and only one of them renames.** The *display name* is what a visitor reads. The *slug* is kebab-case (§8), matches the display name one-for-one, and is now **live in URLs** — three of the four are anchors on `/services/product` and the fourth, `agentic-system`, is a route segment (#30, §6). The *payload value* is snake_case (§3), is written to the lead record, and is a **contract that does not move with a rename** — which is why `product-support` still stores as `partnership`. Canonical in `src/lib/types.ts` → `ServiceSlug`, `src/content/services.ts` → `SERVICES` + `SERVICE_NEED`, and `src/lib/schema.ts` → `PROJECT_TYPE_VALUES`.

This closes a divergence open since **2026-08-04**, when the cards took short names while this table and `LANDING.capabilities` kept long ones. Aligning the capability strip is a **Rule 4.1 edit to Messaging Kit §05** canonical copy and carries its own row (#28) — like the hero headline under #18, **do not "correct" the strip back to the Kit's long forms.**

The service **descriptions** are still §05 as written; a rename is not permission to reword them (Rule 4.1). Coral (`brand`) is the only accent (#47, superseding #14's gold); the old per-service accent pairs (gold/rose/lavender/sage) and the paper-design service cards are **RETIRED**, and the dormant `accent` field is dead data: `SERVICES` in `src/content/services.ts` still names `gold`, `rose`, `lavender` and `sage` (typed by `ACCENT_NAMES` in `src/lib/types.ts`), none of which is a token any more, and it is never rendered (§5 RETIRED).

### Two kinds of agentic system — **CURRENT (#29)**

`/pricing` sells the Agentic System service at **two depths**, which is why two tiers share one project type rather than one of them being mis-mapped:

| Tier | What it is | Preselects |
|---|---|---|
| **AI Workflow Integration** | Agents and custom tools dropped into processes the business already runs. Workflow level, no product wrapped around them. | `agentic` |
| **Internal Tool** | A full product with a real interface and agents behind it, owned by the client and logged into by their team. | `agentic` |

The modal asks a visitor **what they need, not how deep they want to go** — the depth is what the two price points express. This is positioning language, not an implementation note, and the service routes now consume it: **the two depths are the two anchored blocks on `/services/agentic-system`** (`#ai-workflow-integration`, `#internal-tool`), rendering the tier names and tier descriptions from `src/content/pricing.ts` with no price (#30).

## 2. Process phases (ordered, exactly four) — **CURRENT** (model) · **RETIRED** (accent mapping)

The four-phase model is canonical and still exists in code (`src/content/copy.ts` → `PROCESS`); a **Process section** is in the redesign set (decision-log #13), designed later against `04-ux-spec.md`. The old per-phase accent pairs are **RETIRED**: coral (`brand`) is the only accent (decision-log #47, superseding #14's gold). The dormant `PROCESS` copy's accent fields (`gold` / `lavender` / `rose` / `sage`, `src/content/copy.ts`) are a leftover of the retired design, not a spec, and none of those names is a token any more (§5 RETIRED).

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

## 5. Design tokens · **CHANGED (decision-log #47–#48, 2026-10-14)**

**This section owns the names; `04-ux-spec.md` §Color owns the roles** (what each token is for, where coral may be spent, the measured contrast). Every name below is declared in `src/app/globals.css` and nowhere else: raw custom properties on `:root`, republished into Tailwind's namespaces by an `@theme inline` bridge, so **the utility name is the token name** (`bg-card`, `text-muted-foreground`, `border-border`, `outline-ring`, `bg-brand`). The names are **fin's** (the Zen Linen design system), and the values are its **dark set only**, copied as values (#47): there is no light set, no `.dark` variant and no theme toggle, so fin's `.dark` values live on `:root`. Tailwind's stock `--color-*`, `--radius-*`, `--shadow-*`, `--text-shadow-*` and `--drop-shadow-*` namespaces are cleared to `initial` before the tokens are declared, so **a color, radius or shadow name not listed here does not compile**; that includes Tailwind's own `white` and `black`. Only Tailwind's keyword colors `transparent`, `current` and `inherit`, which are not theme names, still compile (components use `transparent` for clear borders and gradient ends). A component never writes a hex, an `rgb()` or a named color.

### Color: 26 names, Tailwind key `--color-{name}` · **CHANGED (decision-log #47)**

| Name | Kind | In use |
|---|---|---|
| `background` · `foreground` | page ground · primary text | yes |
| `card` · `card-foreground` | elevated surface · text on it | `card` yes; `card-foreground` defined, unused (it equals `foreground`, which components use) |
| `popover` · `popover-foreground` | fin's overlay surface · text on it | defined, unused |
| `primary` · `primary-foreground` | the advance button · text on it | yes |
| `secondary` · `secondary-foreground` | sub-panel and control fill · text on it | `secondary` yes; `secondary-foreground` defined, unused |
| `muted` · `muted-foreground` | decorative fill · secondary text | yes |
| `accent` · `accent-foreground` | fin's **hover fill** (also the brighter skeleton fill inside the wireframes) · text on it | `accent` yes; `accent-foreground` defined, unused |
| `destructive` | error mark | defined, unused |
| `border` · `input` | every hairline · input borders | yes (`border` is also the base-layer default border color and the scrollbar thumb) |
| `ring` | every focus indicator, one color site-wide | yes |
| `sidebar` | fin's darkest step | defined, unused |
| `brand` · `brand-foreground` | **coral, the one accent** · text and marks on a coral fill | yes. `brand-foreground` is **the site's own addition** (fin has none; #47, build-note 33) |
| `chart-1` · `chart-2` · `chart-3` · `chart-4` · `chart-5` | fin's dark categorical steps (terracotta · indigo · ochre · plum · sage) | `chart-1`, `-2`, `-4`, `-5` yes, **only as interface chrome inside the service routes' wireframes** (`service-block-visual.tsx`; #31 carried by #47); `chart-3` defined, unused |

**Three things called "accent", and only one is the accent.** The site's one accent (#47, the rule #14 set for gold) is the token **`brand`**. fin's token named **`accent`** is a neutral hover fill (a gray step), never a highlight. The **`accent` field** in `src/content` (§1, §2, RETIRED below) is dead data that names no token. Prose that says "the accent" means `brand`; a builder reaching for emphasis never uses `accent`.

**Pairing rule (fin's naming, CURRENT/binding):** a fill `X` pairs with `X-foreground` for the text and marks that sit on it. The old `-ink` pairing rule (accent bg ⇒ paired `-ink` text) is **RETIRED** with its tokens; its one live descendant is `brand` ⇒ `brand-foreground`: a coral fill always carries `brand-foreground`, never `foreground` (roles and ratios in `04-ux-spec.md` §Color).

**`chart-*` is not a service palette.** The wireframes took the retired hues' places one for one (`rose` → `chart-1`, `lavender` → `chart-4`, `sage` → `chart-5`, the old gold file-type tints → `chart-2`), and the numbers say nothing about a service: no block, tier or phase owns a step, and the dead `accent` data must never be wired to them.

### Radius · **CHANGED (decision-log #48)**

One token, **`--radius`**, and five derived steps in the Tailwind radius namespace: **`sm` · `md` · `lg` · `xl` · `2xl`** (utilities `rounded-sm` … `rounded-2xl`; the derivation is fin's, ratios in `globals.css`). Tailwind's built-in `rounded-none` and `rounded-full` are not theme keys and still compile; **bare `rounded` compiles to nothing**, so every corner is a named step. Which step goes where is `04-ux-spec.md`.

### Type · **CHANGED (decision-log #47)**

| Tailwind key | Utility | Face | `next/font` variable (`src/app/layout.tsx`) |
|---|---|---|---|
| `--font-sans` | `font-sans` | Inter | `--font-inter` |
| `--font-serif` | `font-serif` | Playfair Display | `--font-playfair-display` |
| `--font-mono` | `font-mono` | JetBrains Mono | `--font-jetbrains-mono` |

`--font-space-grotesk` is **RETIRED** (§9). Usage by role is `04-ux-spec.md` §Typography.

### Shadow · **CHANGED (decision-log #47)**

- **`shadow-xs` · `shadow-sm` · `shadow-md` · `shadow-lg` · `shadow-xl` · `shadow-2xl`**: fin's soft scale, the only box shadows that compile.
- **`text-shadow-over-video`** and **`drop-shadow-over-video`**: the site's own additions (fin has none), for text and the logo over the home hero footage and nowhere else.

### Motion · **CHANGED (decision-log #47)**

One easing, **`--ease-out`** (on `:root`), and four animations: **`animate-modal-in` · `animate-step-in` · `animate-rise-in` · `animate-marquee`** (the marquee reads the component-local `--duration` and `--gap`). Durations and the reduced-motion rule are `04-ux-spec.md` §Motion.

### Custom utilities (`@utility` in `globals.css`) · **CHANGED**

| Utility | What it is | Used by |
|---|---|---|
| `hero-fade` | The hero footage's all-edge spatial mask: two smoothstep ramps, one per axis, intersected, so the footage and its overlays dissolve into the page on every edge with no hard stop (#50). A mask, not a background, hence no `bg-` prefix | `hero-loop.tsx` only |
| `bg-hero-scrim` | The hero's bottom scrim under the headline, tuned for the #50 footage (the frame-by-frame contrast measurements are in build-note 33) | `hero-loop.tsx` only |
| `bg-page-glow` | The page glow of #35, recolored from gold to `brand` (#47) | `page-glow.tsx` (`/pricing`, `/services/*`) |
| `bg-visual-fade` | The fade every service-route wireframe shares, transparent at the center and dissolving into `card` | `visual-fade.tsx` |

`dialog::backdrop` carries a literal (the `background` value at 72%, plus a blur) rather than a token, because `::backdrop` did not inherit custom properties in the verification browser; it is a value, not a name, and nothing references it.

### RETIRED (decision-log #47, 2026-10-14)

These names have **left the token layer** and no longer compile. Successors are given where one exists; "none" means the role went with the old design.

| Retired name | Successor |
|---|---|
| `ink` | `background` (page ground); scrims and overlays take `background` at an alpha, most at their old one, but the hero's are retuned for the #50 footage (`background/25` plus `bg-hero-scrim`, was `ink/40` plus a short gradient) and the capability strip's ground is `background/40` (was `ink/30`) |
| `surface` | `card` |
| `white` (and its alpha ladder) | `foreground` for the upper steps, `muted-foreground` for the lower (roles in `04-ux-spec.md`) |
| `gold` | `brand` (coral), spent exactly where gold was and nowhere new; the one exception is the two gold file-type tints inside a wireframe, which are chrome and took `chart-2` (above) |
| `gold-ink` | `brand-foreground` |
| `paper` | `background`: the 404 goes dark (#47), which ends `paper`'s last live use |
| `paper-bright` | none |
| `lavender` · `rose` · `sage` | none as tokens; inside the wireframes only, `chart-4` · `chart-1` · `chart-5` (#31 carried) |
| `lavender-ink` · `rose-ink` · `sage-ink` | none (the `-ink` pairing retired; pairs are `-foreground` now) |
| `--shadow-modal` | `shadow-2xl` |
| `--ease-premium` | `--ease-out` (the same curve, renamed) |
| `--font-space-grotesk` | `--font-inter` / `--font-playfair-display` (Type, above) |

**The names survive as data, not as tokens.** The dead `accent` data in `src/content` still uses four of them as **data values**: `SERVICES` (`src/content/services.ts`), `PROCESS` and `PROCESS_ACCENTS` (`src/content/copy.ts`) carry `gold`, `lavender`, `rose` and `sage`, typed by `ACCENT_NAMES` / `AccentName` in `src/lib/types.ts`. **It is never rendered**, it names no token (nothing in `globals.css` answers to those strings), and it stays as it is, because the rebrand did not touch `src/content`. The dormant held-section components use the type too (none is imported by a route): `testimonials-section.tsx`, `sketch-accent.tsx` and `placeholder.tsx` key their class maps by `AccentName`, so the string `gold` survives there as a **map key**, now resolving to `brand` classes, with the other three keys resolving to neutrals (except `sketch-accent.tsx`'s on-fill map, which gives every key `brand-foreground`); `hero-section.tsx` and `fit-section.tsx` pass `gold` and `sage` as an `accent` **prop value** to `SketchAccent`. A grep for `gold` that lands in any of these places is reading dead data, a key or a prop value, not a leftover token.

## 6. Routes and section IDs — **CHANGED** (four routes; service slugs are now route segments) · **RETIRED** (held-section IDs)

### Routes — **CHANGED (decision-log #23, 2026-08-25; #30, 2026-08-28)**

| Route | What it is | Status |
|---|---|---|
| `/` | The home page — hero + six sections, one scroll | **CURRENT** |
| `/pricing` | Standalone pricing page, statically prerendered | **CHANGED (new, #23)** |
| `/services/product` | New Product · Product Completion · Product Support, as anchored blocks | **CHANGED (new, #30)** |
| `/services/agentic-system` | Agentic System, at its two depths | **CHANGED (new, #30)** |
| `/api/qualify` | POST-only lead endpoint, no page | **CURRENT** (see `07-technical-spec.md`) |

Route paths are kebab-case per §8. **None of these is a server surface** — all four pages prerender to static HTML, so decision #8 is untouched. Canonical in `src/lib/types.ts` → `ROUTES` (the two static paths) and `serviceRoute` (the service segments, built from `ServicePageSlug` so the segment and the slug cannot disagree).

**There is no `/services` index route** (#30): the home page's `#services` section is the hub.

### Service page slugs and block anchors — **CURRENT (#30)**

A **service page slug is not a `ServiceSlug`.** Two pages cover four services, so one of them is a group:

| Page slug | Route | Blocks (anchor ids) |
|---|---|---|
| `product` | `/services/product` | `new-product` · `product-completion` · `product-support` — the §1 slugs, one per service |
| `agentic-system` | `/services/agentic-system` | `ai-workflow-integration` · `internal-tool` — the two depths of §1's "Two kinds of agentic system" |

`agentic-system` is spelled exactly like its `ServiceSlug` because that page *is* that service; `product` is a group name with no service behind it. The agentic blocks are kebab-cased from the **tier names**, not the terse tier slugs (`workflow` / `tool`), because these appear in the URL. Canonical in `src/lib/types.ts` → `ServicePageSlug`, `ServiceBlockId`, `SERVICE_BLOCK_PAGE`, and `src/content/service-pages.ts` → `SERVICE_PAGES`.

The home page's cards link to the **route root**, so a visitor lands on the hero (#30, corrected 2026-08-30). The block anchors stay live for a shared or bookmarked URL, and `serviceBlockHref` remains the only sanctioned way to build one — it looks a block's page out of `SERVICE_BLOCK_PAGE`, so a link can never pair a block with a page that does not carry it and every href is root-relative by construction.

### Section IDs (anchor names)

The live anchor set, all on `/`: `top` (page top — wordmark target, on `<main>`) · **`work` (Selected Work)** · `why` (Manifesto) · `services` · `process` · `about` · `start` (Final CTA). These reuse the fitting old IDs, as this section anticipated. `start` is reached via the CTAs, not a nav item. **The service routes carry their own anchor set** (`ServiceBlockId`, above), which is deliberately separate from `SectionId`: these ids exist on `/services/*`, not on `/`, and typing them together would let a `/#new-product` ship.

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

**The two service routes are not nav items (#30).** The nav is settled (#22, #24, #26) and this unit does not reopen it: the service pages are reached from the `#services` cards, where each card's **name** links to that service's block. Adding them to `NAV.items` is a separate owner call.

**Destinations are root-relative, never bare hashes** (#23). A bare `#work` resolves against the current route, so on `/pricing` it would mean `/pricing#work` — nothing. `NAV.items` therefore carries a finished `href` per item rather than a `SectionId` the components turn into `#${id}`; anchors are built by `sectionHref()` in `src/lib/types.ts`, which keeps the `SectionId` literal so a mistyped anchor still fails typecheck. Both wordmark targets are `NAV.home` = `/#top`.

**The nav is a hamburger at every breakpoint** (#22): there is no visible tab row at any width, and the overlay is the only place these six render.

**`work` reactivated — CHANGED (decision-log #16, 2026-08-24).** It was dormant under #13, which required a new decision to bring it back; the owner made that call to fix a conversion problem (nothing on the page demonstrated proof of work). It ships as the **first section below the hero** and takes the **(01)** structural index, renumbering the rest to (02)–(06). The remaining old IDs (`voices` · `fit` · `faq`) stay dormant with their held sections — reactivating any still requires a new decision (#13).

## 7. Placeholder assets (naming convention) — **CURRENT** (convention) · **RETIRED** (old inventory)

The naming convention stands for any future section asset: `placeholder-{section}-{nn}.{ext}` in `/public/placeholders/`, fixed aspect ratio, swap-in at handoff.

**Work screenshots · CURRENT (decision-log #16, 2026-08-24).** The selected-work images are **shipped brand assets, not placeholders** (the hero/backdrop precedent below), so they land at **`/public/work/{id}.jpg`** (kebab-case per §8), `{id}` matching the item's `id` in `src/content/work.ts`. Any source resolution is fine: the card frame is a fixed **16/9** box and the image center-crops from the top (`object-cover object-top`), so every card matches regardless of the screenshot's real dimensions (owner requirement). An item with no `image` yet renders the layout-final placeholder (a `secondary` frame with a `muted-foreground` mono label; `ink` is a retired name, §5) in that same frame, so the real asset swaps in with zero layout shift. The old multi-section placeholder *inventory* (work tiles, testimonial blocks) is **RETIRED** with that build; redesign sections define their asset needs per-section (#13). The interim remote hero background image is **CLOSED** (Unit 03, decision-log #15): the hero footage is a **shipped brand asset**, not a placeholder. **CHANGED (decision-log #46, 2026-10-05):** the site carries exactly one video, **`hero-loop.mp4`** + **`hero-loop-poster.jpg`** (its first frame) in `/public/` (kebab-case per §8; referenced via `LANDING.backgroundVideo` / `backgroundPoster`, config not copy). The Unit 03 orbit clip and the three persona backdrop clips, each with its poster, are **RETIRED** and deleted from the repo (git history keeps them).

**Hero footage · CHANGED (decision-log #50, 2026-10-14).** The names do not move; the bytes do. **`hero-loop.mp4`** and **`hero-loop-poster.jpg`** now carry the fin-palette sketch footage, delivered as `hero-loop-sketch.mp4` + `hero-loop-sketch-poster.jpg` and installed byte-identical at the existing filenames (no re-encode, trim or resize), the way the #46 footage was hosted. So `LANDING.backgroundVideo` / `backgroundPoster` and everything in `src/content` are unchanged, and **the delivered `hero-loop-sketch*` names are source names only, never a path in `/public/`**: a new asset under that name would be a second video, which the one-video rule above (#46) does not allow. The footage of Nate the #46 loop carried (studio, strategist, builder, partner) is **RETIRED** (git history keeps it). The all-edge fade is not a property of the asset: it is the `hero-fade` mask in `globals.css` (§5), and the file still loops on its own seam.

## 8. Naming conventions — **CURRENT**

- Components: PascalCase (`QualificationModal`, `HeroCta`).
- Files/routes/slugs: kebab-case. Payload values: snake_case (§3). Apps Script reference: `scripts/inbound-leads.gs`.
- Design tokens: fin's kebab-case names exactly as `src/app/globals.css` declares them (§5); a fill `X` pairs with `X-foreground`. A site addition takes a fin-shaped name (`brand-foreground`) or names its one use (`over-video`), never a hue (`gold`, `coral`).
- Brand name: **NextSketch** (one word, capital N and S) in all copy; legal line: "Next Sketch LLC".

## 9. Deprecation log

| Retired value | Replaced by | Why | Old-data handling |
|---|---|---|---|
| Fonts: **Inter**, **Caveat** | **Space Grotesk** (display/UI) + **JetBrains Mono** (mono) | 2026-06-14 pivot (decision-log #1, superseded) | None to migrate; Caveat must not appear as a current design claim. **Superseded in part 2026-10-14 (#47):** Inter returns as the interface face and Space Grotesk retires (row below) |
| Light **paper/ink** theme as the default page surface | **Dark** theme (`ink` surface, `white` text, `gold` accent) | 2026-06-14 pivot | The light design is **retired** (decision-log #13: the redesign builds dark), not deferred, and #47 keeps the site dark only. The token names themselves are retired 2026-10-14 (#47, rows below) |
| Per-service / per-phase **accent pairs** (rose, lavender, sage rotation) | **Gold-only accent** (`gold`/`gold-ink`) | Decision-log #14 (2026-07-06) | Dormant copy's accent fields are leftovers, not spec. **Superseded 2026-10-14 (#47):** the orphaned tokens are removed and the one accent is coral (rows below) |
| Color token names `ink` · `white` · `surface` · `gold`/`gold-ink` · `paper` · `paper-bright` · `lavender`/`rose`/`sage` and their `-ink` pairs; `--shadow-modal`; `--ease-premium` | fin's names (§5): `background`, `foreground` / `muted-foreground`, `card`, `brand` / `brand-foreground`, `chart-*` (wireframe chrome only), `shadow-2xl`, `--ease-out` | Decision-log #47 (2026-10-14): rebrand to fin's Zen Linen, dark only | Removed from `globals.css`; they no longer compile. The dead `accent` data in `src/content` keeps `gold` / `lavender` / `rose` / `sage` as data values, never rendered (§5 RETIRED) |
| **Gold-only accent** (`gold` `#E4B976`) | **Coral-only accent** (`brand` `#F26A4B`), the same one-accent rule | Decision-log #47 supersedes #14 | Spent exactly where gold was and nowhere new; no gold token, hex or utility class remains in code (the string survives only as an `AccentName` data value and map key, §5 RETIRED) |
| Font: **Space Grotesk** (display/UI) | **Inter** (interface and figures) + **Playfair Display** (display headings and the brand voice); JetBrains Mono unchanged | Decision-log #47 (2026-10-14) | `--font-space-grotesk` gone from `layout.tsx` and `globals.css` (§5 Type) |
| **Squared corners** (`rounded-none` as the shape of the brand) | fin's radius scale from one `--radius` token (§5 Radius) | Decision-log #48 (2026-10-14) | The "squared, not `rounded-xl`" clauses of #16 and #30 retire with it |
| The **light 404** (`paper` surface) | Dark, on `background`, like every route | Decision-log #47 (2026-10-14) | Ends `paper`'s last live use |
| Hero footage of Nate (studio, strategist, builder, partner) in `hero-loop.mp4` | The fin-palette sketch footage, same filenames (§7) | Decision-log #50 supersedes the footage portion of #46 | Paths and `LANDING` config unchanged; git history keeps the old footage |
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
