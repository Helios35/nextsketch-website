# Taxonomy — NextSketch Website Rebuild

**Version:** 2.1 · **Date:** 2026-07-06 · **Status:** Active — aligned to the redesign decisions (decision-log #13–#14, Redesign Unit 01)
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
6. Section IDs
7. Placeholder assets
8. Naming conventions
9. Deprecation log

## 1. Services (canonical names, exact casing) — **CURRENT** (names) · **RETIRED** (accent mapping)

The four service names are live: the dark hero's **capability strip** renders them verbatim (`src/content/copy.ts` → `LANDING.capabilities`, exact casing). A **Services section** is in the redesign set (decision-log #13), designed later against `04-ux-spec.md` — **gold is its only accent** (decision-log #14). The old per-service accent pairs (gold/rose/lavender/sage) and the paper-design service cards are **RETIRED**.

| Display name | Slug | Status |
|---|---|---|
| New Products from Scratch | `new-product` | name **CURRENT** (capability strip); section planned (#13) |
| Rescue & Completion | `rescue` | name **CURRENT**; section planned (#13) |
| Agentic Systems Integration | `agentic` | name **CURRENT**; section planned (#13) |
| Ongoing Product Partnership | `partnership` | name **CURRENT**; section planned (#13) |

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

## 6. Section IDs (anchor names) — **CURRENT** (redesign set) · **RETIRED** (held-section IDs)

The live anchor set (Redesign Unit 02, decision-log #13): `top` (page top — nav/footer wordmark target, on `<main>`) · `why` (Manifesto) · `services` · `process` · `about` · `start` (Final CTA). These reuse the fitting old IDs, as this section anticipated. `NAV.items` targets `why` / `services` / `process` / `about`; `start` is reached via the CTAs and the footer, not a nav item. The remaining old IDs (`work` · `voices` · `fit` · `faq`) belong to the held sections and stay dormant with them — reactivating any requires a new decision (#13).

## 7. Placeholder assets (naming convention) — **CURRENT** (convention) · **RETIRED** (old inventory)

The naming convention stands for any future section asset: `placeholder-{section}-{nn}.{ext}` in `/public/placeholders/`, fixed aspect ratio, swap-in at handoff. The old multi-section placeholder *inventory* (work tiles, testimonial blocks) is **RETIRED** with that build; redesign sections define their asset needs per-section (#13). The live site's only placeholder is the **interim remote hero background image** (`LANDING.backgroundImage`, config not a copy asset) — owner-owed before launch.

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
| Brand: Autonomous Whales | NextSketch (single brand) | DBA retired | Banned term (Rule 3.4) |
| Term: "automations" / "agentic workflows" | "embedded agents" / "agentic systems" | Brand Philosophy changelog | Banned term (Rule 3.2) |
| CTA: "Book a free chat" + Calendly links | Modal + Rule 3.1 CTA set | Qualification mindset | Calendly removed entirely |
| Pages: /projects, /about-us, /contact-us | Single page | Architecture decision | 301 redirects (`08-runbook.md`) — owner-executed at domain cutover |
