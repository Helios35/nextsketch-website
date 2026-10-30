# Taxonomy — NextSketch Website Rebuild

**Version:** 3.3.1 · **Date:** 2026-10-30 · **Status:** Active (3.3.1: §5 `bg-page-glow` draws a dot grid, decision-log #68; 3.3: Asha joins the team, decision-log #66: §7 her clip and poster, `asha.mp4` and `asha-poster.jpg`, §8 her `id`; 3.2: the email-first modal, decision-log #65 as amended the same day: §3 the lead kinds `quick` (step 1, with `first_name` and `last_name`) and `followup` (step 2), `exploring` stored on Q1 and Q2, the `qualified` kind and the `off_ramp` source retired; §4 the `partial` lead type and what each label now says about how far a lead got; §9; 3.1: About becomes the team, decision-log #63 and #64: §7 the team clips and posters and the narrowed one-video rule, §8 the team names, §9 the portrait retired; 3.0: the diagram language, decision-log #60 to #62: §5 the diagram animations and utilities, `bg-visual-fade` and the `chart-*` chrome retired, §8 the diagram names, §9; 2.9: two offerings, decision-log #53 to #58: §1 the two names, §2 Map / Build / Validate / Optimize, §3 the modal labels, §4 the waitlist kind, §6 the route anchors, §9; 2.8: `bg-page-glow` at 12%, #52; 2.7: §8's component example follows the code after the design-system audit, build-note 34). One vocabulary across every surface, now two offerings, each slug its route segment (decision-log #27, #30, #53); token names are fin's Zen Linen dark set, and the old ones are retired (#47–#48, §5); one hero video asset, now carrying the #50 sketch footage at the same filename (#46, #50, §7)
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

## 1. Services: the two offerings (canonical names, exact casing) — **CHANGED (decision-log #53, 2026-10-15)** · **RETIRED** (the four services of #27, the two agentic depths of #29, the accent mapping)

**These two names are what the site says everywhere a visitor can read them**, agentic first — the hero **capability strip**, the Services cards, the `/pricing` tiers, both service routes' eyebrows, and the modal's quick-door selector (in sentence case there, §3). The one-vocabulary rule of #27 stands: a name the quick door does not use is a name that disappears mid-conversion.

| Display name | Slug | Payload value (§3) | Status |
|---|---|---|---|
| Agentic System Integration | `agentic-system` | `agentic` | **CHANGED** (#53; was "Agentic System") |
| AI Product Development | `product` | `new_product` | **CHANGED** (#53, new; the page slug it already had) |

**Three vocabularies, and the display name no longer mirrors its slug word for word.** The *display name* is what a visitor reads. The *slug* is kebab-case (§8) and is **the slug of the offering's page** (`/services/agentic-system`, `/services/product`; §6), which #53 left unchanged, so `ServiceSlug` and `ServicePageSlug` are one union. The *payload value* is snake_case (§3), is written to the lead record, and is a **contract that does not move with a rename**: no lead data migrates. Canonical in `src/lib/types.ts` → `ServiceSlug`, `src/content/services.ts` → `SERVICES` + `SERVICE_NEED` + `PRICES`, and `src/lib/schema.ts` → `PROJECT_TYPE_VALUES`.

**What retired, and where it went.** The four services of #27 (New Product, Product Completion, Product Support, Agentic System) leave every surface a visitor reads. **Internal Tool**, one of #29's two agentic depths, retires from the site (NextSketch is building an installable product of its own; the waitlist band of #58 shows it). **Product Completion and Product Support fold into AI Product Development** as two of its three ways in, which keep their blocks and anchors on `/services/product` (§6). Their payload values (`rescue`, `partnership`) stay in the schema, where the qualifier still records them (§3). The capability strip reads its names from `SERVICES`, so it cannot drift from the cards; **do not "correct" it to the Messaging Kit**, which is out of date and outside this repo (Rule 4.1).

Coral (`brand`) is the only accent (#47); the old per-service accent pairs are **RETIRED**, and the dead `accent` field retired from `SERVICES` with the four services that carried it (#53).

### Two kinds of agentic system — **RETIRED (#53)**

`/pricing` sold the old Agentic System service at two depths, **AI Workflow Integration** and **Internal Tool** (#29, #36), both preselecting `agentic`. Internal Tool retired from the site and AI Workflow Integration's offer became Agentic System Integration, so there is one agentic tier and one agentic page. The page's blocks are now four example jobs (§6, #57), not depths. Recorded so the two names cannot be mistaken for current.

## 2. Process phases (ordered, exactly four) — **CHANGED (decision-log #55, 2026-10-15)** (model) · **RETIRED** (accent mapping)

The four-phase model is canonical in code (`src/content/copy.ts` → `PROCESS`), rendered by `/`'s Process section and both service routes' How it works. **#55 renamed two phases**: Strategy became **Map**, Partner became **Optimize**; Build and Validate keep their names. Slugs follow the names, so none is a fossil; they appear in no URL and no payload. The "this is the part most firms skip" aside renders on the phase `PROCESS.annotationPhase` names, **Map** since #55 (it was Validate). The old per-phase accent pairs are **RETIRED**: coral (`brand`) is the only accent (decision-log #47, superseding #14's gold). The `PROCESS` copy's accent fields (`gold` / `lavender` / `rose` / `sage`) and the dormant `PROCESS_ACCENTS` map are a leftover of the retired design, not a spec, and none of those names is a token any more (§5 RETIRED).

| Order | Display | Slug | Status |
|---|---|---|---|
| 01 | Map | `map` | **CHANGED** (#55; was Strategy / `strategy`) |
| 02 | Build | `build` | CURRENT |
| 03 | Validate | `validate` | CURRENT |
| 04 | Optimize | `optimize` | **CHANGED** (#55; was Partner / `partner`) |

## 3. Modal answers — label-to-payload mapping — **CURRENT** (question values) · **CHANGED** (email-first kinds, decision-log #65)

Payload values are what the lead record stores (the Sheet writes the display **labels**; the snake_case values are the schema/contract). Builders never invent alternates. Canonical in `src/content/modal.ts` + `src/lib/schema.ts`.

**Lead `kind` discriminator (CHANGED — Sprint 02 Unit 04; #58; #65):** a lead arrives in up to two parts. **`kind: "quick"`** is step 1, the lead itself (first name, last name, email and the offerings, `source: "quick_door"`); **`kind: "followup"`** is step 2, the qualifier's answers and the contact fields, all optional, carrying the step 1 **`lead_id`** and email so it updates that lead's row. A third kind, `kind: "waitlist"`, is the waitlist band's entry and not a lead (below). **Retired by #65:** `kind: "qualified"` (the qualifier's answers ride the follow-up now) and `source: "off_ramp"` (the off-ramp's capture is gone).

**`lead_id` (CHANGED, new, #65):** a random UUID the server mints for each step 1 lead, returned to the browser and written to the Sheet's **Lead ID** column. Step 2 is matched to its row by it (and the email). A waitlist entry has none.

**Qualifier (step 2, `kind: "followup"`) — CURRENT values, every answer optional since #65:**

**Q1 `project_type` — CHANGED (decision-log #53; labels and order only, values unchanged):** AI agents for the work my business already does → `agentic` · A new product built from scratch → `new_product` · Finishing a product someone else started → `rescue` · Ongoing help with a live product → `partnership` · I'm still exploring → `exploring`

**Q2 `readiness`:** Ready now → `now` · Within 1–3 months → `soon` · Just exploring → `exploring`

**Q3 `authority`:** Yes, it's my call → `full` · Shared decision → `shared` · No — I'd need buy-in → `none`

**Q4 `validation`:** Already validated → `validated` · Yes — that's why I'm here → `willing` · I just want it built → `build_first`

**Contact (step 2's last screen):** `company`, `details`, both optional (#65). `first_name`, `last_name` and `email` are step 1's; the follow-up repeats them (the email so the row can be matched, the names for Nate's follow-up alert, never rewritten on the row), and repeats step 1's `project_types` so a Q1 answer can be written beside them.

> `exploring` (Q1/Q2) ends step 2 on the off-ramp (Rule 2.1). **CHANGED (#65):** it is now a **stored value**, recorded on the lead (the Sheet writes its label, "I'm still exploring" or "Just exploring"). It was UI-only and refused by the schema while the qualifier was a door of its own (`src/lib/schema.ts`, `EXPLORING`).

**Quick door, step 1 (`kind: "quick"`) — CHANGED (#65, amended 2026-10-21):** collects **`first_name`** and **`last_name`** (both required, 1–50 characters; the Sheet's one Name column holds them joined, `"Jane Doe"`), `email` and the **multi-select** `project_types`, **at least one required**; nothing else (the single `name` it carried before #65 is split in two; its optional `details` moved to step 2). **Since #53 the door offers the two offerings**, agentic first, which combine freely (the old new-product / completion exclusion retired with them). The schema still accepts all four canonical values in `project_types`; the door shows two (`src/content/modal.ts` → `MODAL_QUICK.needsOptions`, typed as `QuickNeed`, which is also the type of every CTA's preselect):

| Value | Qualifier label (Q1) | Quick-door label |
|---|---|---|
| `agentic` | AI agents for the work my business already does | Agentic system integration |
| `new_product` | A new product built from scratch | AI product development |
| `rescue` | Finishing a product someone else started | (not offered; a way into AI Product Development) |
| `partnership` | Ongoing help with a live product | (not offered; a way into AI Product Development) |

In the Sheet's one project column, a step 2 Q1 answer is written after the step 1 offerings, `"; "`-joined ("AI product development; Finishing a product someone else started"). The off-ramp capture (`source: "off_ramp"`) is **retired** (#65).

**Waitlist (`kind: "waitlist"`) — CHANGED (new, decision-log #58):** the Services waitlist band's entry: `email` and the §2.8 guards, nothing else. Not a lead (§4).

## 4. Lead types & signals — **CHANGED**

Computed in `src/lib/lead-format.ts` (`leadSignal`). The pre-pivot set (`qualified` / `flagged` / `off_ramp`, where off-ramp was "not a lead, not emailed") is superseded. **Since #65** step 1 writes `quick`, and step 2, if it adds anything, recomputes the type and label on the same row (first match in the order below, from `exploring` down to `partial`), so the label says how far a lead got: `[Lead — quick]` is step 1 only, anything else means step 2 added something.

| `lead_type` | Meaning | Signal label (Rule 2.5) |
|---|---|---|
| `exploring` | Step 2 answered Q1 or Q2 "still exploring" (#65; before, the off-ramp's own capture) | `[Lead — exploring]` |
| `flagged` | Step 2 answered Q3 = `none` and/or Q4 = `build_first` | `[Lead — review answers]` (both) · `[Lead — needs buy-in]` · `[Lead — build-first mindset]` |
| `qualified` | Step 2 answered all four questions, no flags | `[Lead]` |
| `partial` | Step 2 added something but passed over at least one question (new, #65) | `[Lead — partial]` |
| `quick` | Step 1 only: the name, email and offerings (#65; before, the quick door's own completion) | `[Lead — quick]` |
| `waitlist` | Waitlist band entry (#58): an email for the installable product, not a lead | `[Waitlist]` |

**Lead `source` (quick kind only):** `quick_door`, the one door left. `off_ramp` (the still-exploring capture) is **retired** (#65); its old rows keep `lead_type: exploring`. A waitlist entry has no `source`: its `kind` is its own.

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
| `accent` · `accent-foreground` | fin's **hover fill** (also the skeleton lines inside the diagrams) · text on it | `accent` yes; `accent-foreground` defined, unused |
| `destructive` | error mark | defined, unused |
| `border` · `input` | every hairline · input borders | yes (`border` is also the base-layer default border color and the scrollbar thumb) |
| `ring` | every focus indicator, one color site-wide | yes |
| `sidebar` | fin's darkest step | defined, unused |
| `brand` · `brand-foreground` | **coral, the one accent** · text and marks on a coral fill | yes. `brand-foreground` is **the site's own addition** (fin has none; #47, build-note 33) |
| `chart-1` · `chart-2` · `chart-3` · `chart-4` · `chart-5` | fin's dark categorical steps (terracotta · indigo · ochre · plum · sage) | defined, **unused since #60**: `chart-1`, `-2`, `-4` and `-5` were interface chrome inside the service routes' wireframes (#31, carried by #47), which retired; the diagrams use none of them |

**Three things called "accent", and only one is the accent.** The site's one accent (#47, the rule #14 set for gold) is the token **`brand`**. fin's token named **`accent`** is a neutral hover fill (a gray step), never a highlight. The **`accent` field** in `src/content` (§1, §2, RETIRED below) is dead data that names no token. Prose that says "the accent" means `brand`; a builder reaching for emphasis never uses `accent`.

**Pairing rule (fin's naming, CURRENT/binding):** a fill `X` pairs with `X-foreground` for the text and marks that sit on it. The old `-ink` pairing rule (accent bg ⇒ paired `-ink` text) is **RETIRED** with its tokens; its one live descendant is `brand` ⇒ `brand-foreground`: a coral fill always carries `brand-foreground`, never `foreground` (roles and ratios in `04-ux-spec.md` §Color).

**`chart-*` is not a service palette** (and since #60 not in use at all; the paragraph stays as the record). The wireframes took the retired hues' places one for one (`rose` → `chart-1`, `lavender` → `chart-4`, `sage` → `chart-5`, the old gold file-type tints → `chart-2`), and the numbers say nothing about a service: no block, tier or phase owns a step, and the dead `accent` data must never be wired to them.

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

One easing, **`--ease-out`** (on `:root`), and nine animations: **`animate-modal-in` · `animate-step-in` · `animate-rise-in` · `animate-marquee`** (the marquee reads the component-local `--duration` and `--gap`), and the diagrams' ambient five (#62): **`animate-diagram-travel` · `animate-diagram-dash` · `animate-diagram-pulse` · `animate-diagram-trace` · `animate-diagram-sheet`**. Durations and the reduced-motion rule are `04-ux-spec.md` §Motion.

### Custom utilities (`@utility` in `globals.css`) · **CHANGED**

| Utility | What it is | Used by |
|---|---|---|
| `hero-fade` | The hero footage's all-edge spatial mask: two smoothstep ramps, one per axis, intersected, so the footage and its overlays dissolve into the page on every edge with no hard stop (#50). A mask, not a background, hence no `bg-` prefix | `hero-loop.tsx` only |
| `bg-hero-scrim` | The hero's bottom scrim under the headline, tuned for the #50 footage (the frame-by-frame contrast measurements are in build-note 33) | `hero-loop.tsx` only |
| `bg-page-glow` | The page glow of #35, recolored from gold to `brand` (#47), at 12% since #52, and since #68 a dot grid (a 1px dot every 16px, `bg-diagram-grid`'s) at that colour under a mask with the glow's geometry; the name is kept so its one call site is unchanged | `page-glow.tsx` (`/pricing`, `/services/*`) |
| `bg-diagram-grid` | The diagram canvas's dot grid: a 1px `border` dot every 16px (#60) | `diagram.tsx` (`DiagramFrame`) |
| `diagram-packet` | A dot that travels a diagram line: invisible until its `motion-safe` animation runs, dropped where `offset-path` is unsupported (#60, #62). Not a `bg-` utility because it paints nothing itself | `diagram.tsx` (`Flow`), `process-map-diagram.tsx` |
| `bg-visual-fade` | **RETIRED (#60):** the fade every service-route wireframe shared. Deleted with `visual-fade.tsx` and the wireframes | none |

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
| `lavender` · `rose` · `sage` | none as tokens; inside the wireframes only, `chart-4` · `chart-1` · `chart-5` (#31 carried), until the wireframes retired (#60) |
| `lavender-ink` · `rose-ink` · `sage-ink` | none (the `-ink` pairing retired; pairs are `-foreground` now) |
| `--shadow-modal` | `shadow-2xl` |
| `--ease-premium` | `--ease-out` (the same curve, renamed) |
| `--font-space-grotesk` | `--font-inter` / `--font-playfair-display` (Type, above) |

**The names survive as data, not as tokens.** The dead `accent` data in `src/content` still uses four of them as **data values**: `PROCESS` and `PROCESS_ACCENTS` (`src/content/copy.ts`) carry `gold`, `lavender`, `rose` and `sage`, typed by `ACCENT_NAMES` / `AccentName` in `src/lib/types.ts`. (`SERVICES` carried them too until its `accent` field retired with the four services, #53.) **It is never rendered**, it names no token (nothing in `globals.css` answers to those strings), and it stays as it is, because the rebrand did not touch `src/content`. The dormant held-section components use the type too (none is imported by a route): `testimonials-section.tsx`, `sketch-accent.tsx` and `placeholder.tsx` key their class maps by `AccentName`, so the string `gold` survives there as a **map key**, now resolving to `brand` classes, with the other three keys resolving to neutrals (except `sketch-accent.tsx`'s on-fill map, which gives every key `brand-foreground`); `hero-section.tsx` and `fit-section.tsx` pass `gold` and `sage` as an `accent` **prop value** to `SketchAccent`. A grep for `gold` that lands in any of these places is reading dead data, a key or a prop value, not a leftover token.

## 6. Routes and section IDs — **CHANGED** (four routes; an offering's slug is its route segment) · **RETIRED** (held-section IDs)

### Routes — **CHANGED (decision-log #23, 2026-08-25; #30, 2026-08-28)**

| Route | What it is | Status |
|---|---|---|
| `/` | The home page — hero + six sections, one scroll | **CURRENT** |
| `/pricing` | Standalone pricing page, statically prerendered | **CHANGED (new, #23)** |
| `/services/product` | AI Product Development: its three ways in, as anchored blocks | **CHANGED (new, #30; one offering since #53)** |
| `/services/agentic-system` | Agentic System Integration: four example jobs, as anchored blocks | **CHANGED (new, #30; #53, #57)** |
| `/api/qualify` | POST-only lead endpoint, no page | **CURRENT** (see `07-technical-spec.md`) |

Route paths are kebab-case per §8. **None of these is a server surface** — all four pages prerender to static HTML, so decision #8 is untouched. Canonical in `src/lib/types.ts` → `ROUTES` (the two static paths) and `serviceRoute` (the service segments, built from `ServicePageSlug` so the segment and the slug cannot disagree).

**There is no `/services` index route** (#30): the home page's `#services` section is the hub.

### Service page slugs and block anchors — **CHANGED (#30; #53, #57)**

**Since #53 a service page slug is a `ServiceSlug` again**: each of the two offerings has one page, and its slug is that page's (`ServicePageSlug` is the same union). Under #30 it was not, because one page grouped three services.

| Page slug | Route | Blocks (anchor ids) |
|---|---|---|
| `product` | `/services/product` | `new-product` · `product-completion` · `product-support`: the three ways into AI Product Development (Build from scratch, Finish what someone started, Ongoing product team), **on the anchors the retired service slugs gave them**, so an old shared link still lands on its block |
| `agentic-system` | `/services/agentic-system` | `email-triage` · `weekly-reporting` · `quoting-and-intake` · `document-and-data-entry`: the four example jobs (#57), kebab-cased from their names because they appear in the URL |

**Retired anchors (#53):** `ai-workflow-integration` and `internal-tool`, the two depths' blocks. A link to either still opens `/services/agentic-system`, at the top: a fragment with no target is ignored, never an error. Canonical in `src/lib/types.ts` → `ServicePageSlug`, `ServiceBlockId`, `SERVICE_BLOCK_PAGE`, and `src/content/service-pages.ts` → `SERVICE_PAGES`.

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

**The two service routes are not nav items (#30).** The nav is settled (#22, #24, #26) and was not reopened by #53 or #58: the service pages are reached from the `#services` cards, where each card's **name** links to its offering's route. Adding them to `NAV.items` is a separate owner call.

**Destinations are root-relative, never bare hashes** (#23). A bare `#work` resolves against the current route, so on `/pricing` it would mean `/pricing#work` — nothing. `NAV.items` therefore carries a finished `href` per item rather than a `SectionId` the components turn into `#${id}`; anchors are built by `sectionHref()` in `src/lib/types.ts`, which keeps the `SectionId` literal so a mistyped anchor still fails typecheck. Both wordmark targets are `NAV.home` = `/#top`.

**The nav is a hamburger at every breakpoint** (#22): there is no visible tab row at any width, and the overlay is the only place these six render.

**`work` reactivated — CHANGED (decision-log #16, 2026-08-24).** It was dormant under #13, which required a new decision to bring it back; the owner made that call to fix a conversion problem (nothing on the page demonstrated proof of work). It ships as the **first section below the hero** and takes the **(01)** structural index, renumbering the rest to (02)–(06). The remaining old IDs (`voices` · `fit` · `faq`) stay dormant with their held sections — reactivating any still requires a new decision (#13).

## 7. Placeholder assets (naming convention) — **CURRENT** (convention) · **RETIRED** (old inventory)

The naming convention stands for any future section asset: `placeholder-{section}-{nn}.{ext}` in `/public/placeholders/`, fixed aspect ratio, swap-in at handoff.

**Work screenshots · CURRENT (decision-log #16, 2026-08-24).** The selected-work images are **shipped brand assets, not placeholders** (the hero/backdrop precedent below), so they land at **`/public/work/{id}.jpg`** (kebab-case per §8), `{id}` matching the item's `id` in `src/content/work.ts`. Any source resolution is fine: the card frame is a fixed **16/9** box and the image center-crops from the top (`object-cover object-top`), so every card matches regardless of the screenshot's real dimensions (owner requirement). An item with no `image` yet renders the layout-final placeholder (a `secondary` frame with a `muted-foreground` mono label; `ink` is a retired name, §5) in that same frame, so the real asset swaps in with zero layout shift. The old multi-section placeholder *inventory* (work tiles, testimonial blocks) is **RETIRED** with that build; redesign sections define their asset needs per-section (#13). The interim remote hero background image is **CLOSED** (Unit 03, decision-log #15): the hero footage is a **shipped brand asset**, not a placeholder. **CHANGED (decision-log #46, 2026-10-05):** the site carries exactly one video, **`hero-loop.mp4`** + **`hero-loop-poster.jpg`** (its first frame) in `/public/` (kebab-case per §8; referenced via `LANDING.backgroundVideo` / `backgroundPoster`, config not copy). The Unit 03 orbit clip and the three persona backdrop clips, each with its poster, are **RETIRED** and deleted from the repo (git history keeps them).

**Hero footage · CHANGED (decision-log #50, 2026-10-14).** The names do not move; the bytes do. **`hero-loop.mp4`** and **`hero-loop-poster.jpg`** now carry the fin-palette sketch footage, delivered as `hero-loop-sketch.mp4` + `hero-loop-sketch-poster.jpg` and installed byte-identical at the existing filenames (no re-encode, trim or resize), the way the #46 footage was hosted. So `LANDING.backgroundVideo` / `backgroundPoster` and everything in `src/content` are unchanged, and **the delivered `hero-loop-sketch*` names are source names only, never a path in `/public/`**: a new asset under that name would be a second video, which the one-video rule above (#46) does not allow. The footage of Nate the #46 loop carried (studio, strategist, builder, partner) is **RETIRED** (git history keeps it). The all-edge fade is not a property of the asset: it is the `hero-fade` mask in `globals.css` (§5), and the file still loops on its own seam.

**Team avatars · CHANGED (new, decision-log #63, 2026-10-15; a third member, #66, 2026-10-23).** The About team row's avatars are **shipped brand assets** under **`/public/team/`**: **`{id}.mp4`**, the owner's clip installed byte-identical (no re-encode, trim or resize), and **`{id}-poster.jpg`**, its first frame, `{id}` matching the member's `id` in `ABOUT.team` (`src/content/copy.ts`; kebab-case per §8). Three members today: `nate.mp4` + `nate-poster.jpg`, `julie.mp4` + `julie-poster.jpg`, and **`asha.mp4` + `asha-poster.jpg`** (#66: Asha, the AI Content Creator). The delivered names (`Nate-team-preview.mp4`; `Julie-team-preview_v2.mp4`, which replaced her first `Julie-team-preview.mp4` at the same path; `Asha Team Avatar.mp4`) are source names only, never a path in `/public/` (the #50 precedent). No poster was delivered, so the builder cut each from frame 0 of its file at 960×960; an owner still may replace any under the same name. **This narrows #46's one-video rule:** the hero still carries exactly one video, `hero-loop.mp4`, the only one that plays from load and the only footage behind text; the avatars are the site's only other clips, one per member, each playing only while on screen (#64).

## 8. Naming conventions — **CURRENT**

- Components: PascalCase (`QualificationModal`, `ModalTrigger`).
- Diagrams (#60): a component that draws a diagram ends in `Diagram` and names its job (`ProcessMapDiagram`, `EmailTriageDiagram`, `WeeklyReportingDiagram`, `QuotingIntakeDiagram`, `DocumentEntryDiagram`, `BuildFromScratchDiagram`, `FinishStartedDiagram`, `ProductTeamDiagram`); the shared parts are `DiagramFrame`, `DiagramStage`, `DiagramSvg`, `Flow`, `AgentHub`, `Panel`, `Place`, `ProductWindow`, `RowDiagram`, `BeforeAfterDiagram`, and the mark alone is `BrandMark`. Files: `diagram.tsx`, `diagram-stage.tsx`, `process-map-diagram.tsx`, `agentic-diagrams.tsx`, `weekly-reporting-diagram.tsx`, `product-diagrams.tsx`, `product-team-diagram.tsx`. Their strings are one export per diagram in `src/content/diagrams.ts` (`PROCESS_MAP`, `EMAIL_TRIAGE`, `WEEKLY_REPORT`, `QUOTING_INTAKE`, `DOCUMENT_ENTRY`, `BUILD_FROM_SCRATCH`, `FINISH_STARTED`, `ONGOING_TEAM`, plus the shared `DIAGRAM_WORDS`).
- About team (#63): one `TeamAvatar` (`team-avatar.tsx`) per `TeamMember` (`src/lib/types.ts`) in `ABOUT.team` (`src/content/copy.ts`); a member's `id` is kebab-case and names their files (§7): `nate`, `julie`, `asha` (#66). The looping-clip playback contract both the hero and the avatars use is `useLoopVideo` (`src/lib/use-loop-video.ts`, #64).
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
| Payload **`kind: "qualified"`**; **`source: "off_ramp"`**; the side door "Rather walk us through it? Answer a few questions" (`MODAL_QUICK.toQualifier`); the off-ramp's "Stay in Touch" capture and its confirmation (`MODAL_OFF_RAMP.capture`, `MODAL_OFF_RAMP_SUCCESS`); the qualifier and exploring auto-replies (`LEAD_AUTOREPLY`, `LEAD_AUTOREPLY_EXPLORING`) | Step 1 (`kind: "quick"`, first name + last name + email + offerings; the single `name` field split in two) and step 2 (`kind: "followup"`, on the same `lead_id`) | Decision-log #65 (2026-10-21): email-first modal | **No lead data migrates.** Old rows keep their values (`qualified`, `flagged`, `quick`, `exploring`) and a blank Lead ID; the Sheet gains the Lead ID column on the right. Code and copy are deleted (git history keeps them) |
| "Leads exist only as emails" / single email to `hello@nextsketch.com` | **Google Sheet system of record** (+ best-effort Asana) with Resend **notification** | Sprint 02 Units 02–03 | See `07-technical-spec.md` §Data model |
| Services: Industrial Design, UI/UX Design, Mechanical Design | §1 services | Repositioning, June 2026 | None to migrate; must not appear (Rule 3.4) |
| Service names: "New Products from Scratch", "Rescue & Completion", "Agentic Systems Integration", "Ongoing Product Partnership" (and the 2026-08-04 card short forms "Agentic Systems" / "Ongoing Partnership") | §1 names — New Product, Product Completion, Product Support, Agentic System | Decision-log #27–#28 (2026-08-28): one vocabulary, the quick door's | Display only. **Payload values are unchanged**, so no lead data migrates and no `/api/qualify` contract moves |
| Service slugs `rescue`, `agentic`, `partnership` | `product-completion`, `agentic-system`, `product-support` | Decision-log #27 — a slug should not be a fossil of a retired name | Internal only; never appeared in a URL or a payload. **Pricing tier slugs are NOT renamed** — `custom` ("New Product") and `rescue` ("Product Completion") stay as they are, and the mismatch is a separate owner call |
| Pricing tier names "Save Your Project", "Custom Product" | "Product Completion", "New Product" | Decision-log #27 | Display only; prices, descriptions, notes, order and the empty `features` arrays are untouched |
| Brand: Autonomous Whales | NextSketch (single brand) | DBA retired | Banned term (Rule 3.4) |
| Term: "automations" / "agentic workflows" | "embedded agents" / "agentic systems" | Brand Philosophy changelog | Banned term (Rule 3.2) until **#54 (2026-10-15)** lifted "automation" / "automations": "AI automation" now describes the offer that "agentic system" names (Rule 3.3) |
| Service names New Product, Product Completion, Product Support, Agentic System (#27), and the agentic depths AI Workflow Integration and Internal Tool (#29) | The two offerings (§1): **Agentic System Integration** and **AI Product Development** | Decision-log #53 (2026-10-15): two offerings, agentic first; Internal Tool retires from the site | Display only. **Payload values unchanged**, so no lead data migrates. Product Completion and Product Support live on as ways into AI Product Development, on their old block anchors (§6) |
| Service slugs `new-product`, `product-completion`, `product-support` as offering keys | `agentic-system`, `product`: the route slugs the two pages already had | #53 | Internal only. The three survive as `/services/product` block anchors, so no URL moved |
| Agentic block anchors `ai-workflow-integration`, `internal-tool` | `email-triage` · `weekly-reporting` · `quoting-and-intake` · `document-and-data-entry` (§6) | #53, #57 | A link to an old anchor opens the page at the top |
| Pricing tier Internal Tool (`tool`), the struck former prices and their "Down from" label; tier slugs `tool` and `rescue` | Two tiers, `workflow` (Agentic System Integration) and `custom` (AI Product Development), each with "Included" and "What the monthly covers" lists | #56 | Display only; the two kept slugs are unchanged fossils (§1) |
| Process phases Strategy (`strategy`) and Partner (`partner`) | **Map** (`map`) and **Optimize** (`optimize`) (§2) | #55 | No URL or payload carries a phase slug |
| Quick-door labels New product, Product completion, Product support, Agentic system; the qualifier's Q1 labels | "Agentic system integration", "AI product development"; the #53 Q1 labels (§3) | #53 | Values unchanged. `rescue` and `partnership` stay in the schema, where the qualifier sends them |
| Vocabulary: "from idea to production" (Rule 3.3) | none: retired from the vocabulary | #54 | Its last live uses (site title and description, the product route description) were replaced by #59; the dormant `HERO` copy keeps it on disk |
| The service routes' decorative wireframes (`NewProductVisual`, `ProductCompletionVisual`, `ProductSupportVisual`), `VisualFade` / `bg-visual-fade`, and `chart-*` as wireframe chrome (#31) | The diagrams (§8; `04-ux-spec.md` §Diagrams) | Decision-log #60 (2026-10-15): one diagram language, the Ink Orbit style | Deleted; git keeps them. The `chart-*` tokens stay defined, unused |
| The no-text rule for visuals (#30; Rule 4.3 as applied to visuals) | Visuals may carry labels, sample names, sample numbers and generic tool names | Decision-log #61 | Copy outside visuals still states only real facts |
| CTA: "Book a free chat" + Calendly links | Modal + Rule 3.1 CTA set | Qualification mindset | Calendly removed entirely |
| About portrait (`public/placeholders/placeholder-about-01.jpg`, `ABOUT.portraitAlt`) | The team row: `ABOUT.team`, `/public/team/{id}.mp4` + `{id}-poster.jpg` (§7) | Decision-log #63 (2026-10-15): About becomes the team | The file is deleted (git history keeps it); the `placeholder-{section}-{nn}` convention (§7) stands for future assets, and `/public/placeholders/` stays with its `.gitkeep` |
| Pages: /projects, /about-us, /contact-us | Single page | Architecture decision | 301 redirects (`08-runbook.md`) — owner-executed at domain cutover |
