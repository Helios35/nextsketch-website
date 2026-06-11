# Taxonomy — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active
**Answers:** How is everything classified and named?
**References:** `05-business-rules.md` (logic that uses these values) · `04-ux-spec.md` (color roles)

---

## Classification systems index

1. Services
2. Process phases
3. Modal answers (label → payload mapping)
4. Lead types
5. Color tokens
6. Section IDs
7. Placeholder assets
8. Deprecation log

## 1. Services (pick-one per card; canonical names, exact casing)

| Display name | Slug | Accent pair |
|---|---|---|
| New Products from Scratch | `new-product` | gold |
| Rescue & Completion | `rescue` | rose |
| Agentic Systems Integration | `agentic` | lavender |
| Ongoing Product Partnership | `partnership` | sage |

## 2. Process phases (ordered, exactly four)

| Order | Display | Slug | Accent pair |
|---|---|---|---|
| 01 | Strategy | `strategy` | gold |
| 02 | Build | `build` | lavender |
| 03 | Validate | `validate` | rose |
| 04 | Partner | `partner` | sage |

## 3. Modal answers — label-to-payload mapping

Payload values are what the lead email and any future storage use. Builders never invent alternates.

**Q1 `project_type`:** New product from scratch → `new_product` · Stuck at 70% — rescue or finish → `rescue` · Agentic systems for my product or operations → `agentic` · My live product needs a partner → `partnership` · I'm still exploring → `exploring`

**Q2 `readiness`:** Ready now → `now` · Within 1–3 months → `soon` · Just exploring → `exploring`

**Q3 `authority`:** Yes, it's my call → `full` · Shared decision → `shared` · No — I'd need buy-in → `none`

**Q4 `validation`:** Already validated → `validated` · Yes — that's why I'm here → `willing` · I just want it built → `build_first`

**Contact:** `name`, `email`, `company`, `details`.

## 4. Lead types (assigned by Rules 2.1–2.5)

| Type | Meaning |
|---|---|
| `qualified` | Completed contact step, no flags |
| `flagged` | Completed, Q3=`none` and/or Q4=`build_first` |
| `off_ramp` | Routed to off-ramp; not a lead, not emailed, not counted as failure |

## 5. Color tokens (values in `04-ux-spec.md`)

`paper` · `paper-bright` · `ink` · `white` · `gold`/`gold-ink` · `lavender`/`lavender-ink` · `rose`/`rose-ink` · `sage`/`sage-ink`. Tailwind theme keys use exactly these names. Pairing rule: accent background ⇒ paired `-ink` text (UX spec, binding).

## 6. Section IDs (anchor names, exact)

`top` · `why` · `process` · `work` · `services` · `about` · `voices` · `fit` · `faq` · `start`. Nav labels: Process, Work, Services, About, FAQ.

## 7. Placeholder assets (naming convention)

Files: `placeholder-{section}-{nn}.{ext}` (e.g., `placeholder-work-01.svg`, `placeholder-about-01.svg`). All placeholders live in `/public/placeholders/`. Each has a fixed aspect ratio documented in the component. Swap procedure: replace file with real asset of the same name and ratio at handoff — no code changes.

## 8. Naming conventions

- Components: PascalCase (`QualificationModal`, `ProcessSection`).
- Files/routes/slugs: kebab-case. Payload values: snake_case (§3).
- Brand name: **NextSketch** (one word, capital N and S) in all copy; legal line: "Next Sketch LLC".

## 9. Deprecation log

| Retired value | Replaced by | Why | Old-data handling |
|---|---|---|---|
| Services: Industrial Design, UI/UX Design, Mechanical Design | §1 services | Repositioning, June 2026 | None to migrate; must not appear (Rule 3.4) |
| Brand: Autonomous Whales | NextSketch (single brand) | DBA retired | Banned term (Rule 3.4) |
| Term: "automations" / "agentic workflows" | "embedded agents" / "agentic systems" | Brand Philosophy changelog | Banned term (Rule 3.2) |
| CTA: "Book a free chat" + Calendly links | Modal + Rule 3.1 CTA set | Qualification mindset | Calendly removed entirely |
| Pages: /projects, /about-us, /contact-us | Single page | Architecture decision | 301 redirects (`08-runbook.md`) |
