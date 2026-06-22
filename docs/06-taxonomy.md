# Taxonomy — NextSketch Website Rebuild

**Version:** 2.0 · **Date:** 2026-06-22 · **Status:** Active — reconciled to the as-built MVP (Sprint 03 doc audit)
**Answers:** How is everything classified and named?
**References:** `05-business-rules.md` (logic that uses these values) · `04-ux-spec.md` (color roles) · `07-technical-spec.md` (the lead data contract) · `src/lib/schema.ts`, `src/lib/lead-format.ts`, `src/content/modal.ts` (canonical values in code)

> **Reconciliation tags (Sprint 03 audit, 2026-06-22):** **CURRENT** (true as-built) · **CHANGED** (rewritten to as-built) · **DEFERRED** (multi-section build, not shipped — preserved, not deleted). The pivot kept the qualifier value mapping intact, added a second (quick) door, and changed which classifications are live vs. dormant. Code is canonical where it and this doc disagree.

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

## 1. Services (pick-one per card; canonical names, exact casing) — **CURRENT**

The four service names are live: the dark hero's **capability strip** renders them verbatim (`src/content/copy.ts` → `LANDING.capabilities`, exact casing). The per-service accent assignment and the service *cards* are **DEFERRED** with the multi-section build.

| Display name | Slug | Accent pair | Status |
|---|---|---|---|
| New Products from Scratch | `new-product` | gold | name **CURRENT** (capability strip); card **DEFERRED** |
| Rescue & Completion | `rescue` | rose | name **CURRENT**; card + accent **DEFERRED** |
| Agentic Systems Integration | `agentic` | lavender | name **CURRENT**; card + accent **DEFERRED** |
| Ongoing Product Partnership | `partnership` | sage | name **CURRENT**; card + accent **DEFERRED** |

## 2. Process phases (ordered, exactly four) — **DEFERRED**

The four-phase model still exists in code (`src/content/copy.ts` → `PROCESS`, with accents) but its section is dormant on the live single screen. Preserved for the multi-section build.

| Order | Display | Slug | Accent pair |
|---|---|---|---|
| 01 | Strategy | `strategy` | gold |
| 02 | Build | `build` | lavender |
| 03 | Validate | `validate` | rose |
| 04 | Partner | `partner` | sage |

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

## 5. Color tokens — **see `04-ux-spec.md` (CHANGED theme, CURRENT token names)**

Token names — `paper` · `paper-bright` · `ink` · `white` · `gold`/`gold-ink` · `lavender`/`lavender-ink` · `rose`/`rose-ink` · `sage`/`sage-ink` — remain canonical and are defined in `src/app/globals.css`; Tailwind theme keys use exactly these names (**CURRENT**). The **theme flipped to dark** (**CHANGED**): on the live site `ink` is the page surface, `white` the text, `gold` the one live accent. `paper`/`paper-bright` and the lavender/rose/sage pairs are **DEFERRED** (multi-section build); the light `paper` 404 surface is **CURRENT**. Pairing rule (accent bg ⇒ paired `-ink` text) is **CURRENT/binding**. Full detail in `04-ux-spec.md` §Color system.

## 6. Section IDs (anchor names) — **DEFERRED**

`top` · `why` · `process` · `work` · `services` · `about` · `voices` · `fit` · `faq` · `start`; nav labels Process, Work, Services, About, FAQ. These anchors and the nav that targets them belong to the multi-section build (dormant). The live single screen has no anchor nav. Values still exist in `src/content/copy.ts` (`NAV`).

## 7. Placeholder assets (naming convention) — **DEFERRED**

`placeholder-{section}-{nn}.{ext}` in `/public/placeholders/`, fixed aspect ratio, swap-in at handoff. Belongs to the multi-section build. The live hero's only placeholder is the **interim remote background image** (`LANDING.backgroundImage`, config not a copy asset) — owner-owed before launch.

## 8. Naming conventions — **CURRENT**

- Components: PascalCase (`QualificationModal`, `HeroCta`).
- Files/routes/slugs: kebab-case. Payload values: snake_case (§3). Apps Script reference: `scripts/inbound-leads.gs`.
- Brand name: **NextSketch** (one word, capital N and S) in all copy; legal line: "Next Sketch LLC".

## 9. Deprecation log

| Retired value | Replaced by | Why | Old-data handling |
|---|---|---|---|
| Fonts: **Inter**, **Caveat** | **Space Grotesk** (display/UI) + **JetBrains Mono** (mono) | 2026-06-14 pivot (decision-log #1, superseded) | None to migrate; must not appear as a current design claim |
| Light **paper/ink** theme as the default page surface | **Dark** theme (`ink` surface, `white` text, `gold` accent) | 2026-06-14 pivot | Token names retained; light theme deferred to the multi-section build |
| Lead type **`off_ramp`** ("not a lead, not emailed, not counted") | **`exploring`** (a captured lead from the off-ramp) | Sprint 02 Unit 04 — off-ramp now captures an email | No data to migrate; honest "exploring" signal instead of a non-lead |
| "Leads exist only as emails" / single email to `hello@nextsketch.com` | **Google Sheet system of record** (+ best-effort Asana) with Resend **notification** | Sprint 02 Units 02–03 | See `07-technical-spec.md` §Data model |
| Services: Industrial Design, UI/UX Design, Mechanical Design | §1 services | Repositioning, June 2026 | None to migrate; must not appear (Rule 3.4) |
| Brand: Autonomous Whales | NextSketch (single brand) | DBA retired | Banned term (Rule 3.4) |
| Term: "automations" / "agentic workflows" | "embedded agents" / "agentic systems" | Brand Philosophy changelog | Banned term (Rule 3.2) |
| CTA: "Book a free chat" + Calendly links | Modal + Rule 3.1 CTA set | Qualification mindset | Calendly removed entirely |
| Pages: /projects, /about-us, /contact-us | Single page | Architecture decision | 301 redirects (`08-runbook.md`) — owner-executed at domain cutover |
