# Business Rules — NextSketch Website Rebuild

**Version:** 2.1 · **Date:** 2026-07-06 · **Status:** Active — aligned to the redesign decisions (decision-log #13–#14, Redesign Unit 01)
**Answers:** What decisions does the system make?
**References:** `06-taxonomy.md` (canonical values) · `02-prd.md` (requirements) · `07-technical-spec.md` (how the rules are implemented) · Brand Philosophy §8/§10 (voice authority) · `briefs/build-notes/12-quick-door.md` (the two-door build)

> **Reconciliation tags:** **CURRENT** (true as-built) · **CHANGED** (rewritten to match the as-built or an owner decision) · **RETIRED** (no longer planned — the rule's constraint survives if the feature ever returns). Rule numbers are **stable** — briefs cite them. The Sprint 02 Unit 04 "quick door" changes, previously flagged here for ratification, are now **ratified into the rules below** (the ⚠ flag callout is retired). Cite by number ("per Rule 2.2").

---

## Overview

Rules governing the qualification modal, the two lead doors, lead handling, and language constraints. **The lead path's durable record is the Google Sheet, not an email** (Sprint 02; `07-technical-spec.md`).

## Glossary

- **Qualified lead** — a modal completion through the four-question qualifier (`kind: "qualified"`). **CURRENT.**
- **Quick lead** — a completion through the low-friction quick door (`kind: "quick"`, `source: "quick_door"`): name + email + optional needs, no qualifier questions. **CHANGED (new).**
- **Off-ramp** — the modal end-screen shown to visitors classified as exploring; it keeps its honest "not yet" message **and now offers an optional email capture** (`kind: "quick"`, `source: "off_ramp"`). **CHANGED.**
- **Escape hatch** — the always-visible `hello@nextsketch.com` mailto path. **CURRENT.**
- **System of record** — the Google Sheet "Inbound Leads"; a capture succeeds only once its row is written (`07-technical-spec.md`). **CHANGED (new).**
- **Banned term** — language Brand Philosophy §8/§10 prohibits anywhere on the site. **CURRENT.**

## Roles and permissions — **CURRENT**

One human role: visitor (anonymous, public). One operator: owner (Nathan) — receives the lead alert and works the Sheet/Asana records; no admin UI exists. No accounts, no backend beyond `/api/qualify` (decision-log #8).

## 1. Modal — entry doors & question set

**Two-door entry — CHANGED (Sprint 02 Unit 04).** The modal opens to the **quick door** (Rule 1.7) as the primary, low-friction path; the four-question **qualifier** (Rules 1.1–1.6) is the optional "tell us more" path, reachable from the quick door ("Rather walk us through it?"). §1.1–1.4 are no longer the only way in. Both doors carry the §2.8 anti-bot guards and both degrade to the mailto escape hatch with no JS (Rule E3).

**The qualifier asks, in order (canonical answer values in `06-taxonomy.md` §3) — CURRENT:**

- **1.1 — Q1 Project type:** "What do you need built or improved?" → New product from scratch / Stuck at 70% — rescue or finish / Agentic systems for my product or operations / My live product needs a partner / I'm still exploring
- **1.2 — Q2 Readiness:** "When are you looking to start?" → Ready now / Within 1–3 months / Just exploring
- **1.3 — Q3 Authority:** "Can you make the decision to move on this?" → Yes, it's my call / Shared decision / No — I'd need buy-in
- **1.4 — Q4 Validation:** "Are you open to validating the idea before we build?" → Already validated / Yes — that's why I'm here / I just want it built
- **1.5 — Contact step:** name (required), email (required), company (optional), "tell us about it" free text (optional, 1000 char max).
- **1.6** Every step shows the escape hatch (Rule 2.6) and a back control. No step may be skipped except as branched by §2. **CURRENT.**
- **1.7 — Quick door (CHANGED/new).** Collects name (required), email (required), and an **optional multi-select "what do you need?"** drawn from the canonical project types (`new_product`/`rescue`/`partnership`/`agentic`, shown with short labels — `06-taxonomy.md` §3). Submit CTA "Talk to Us" (Rule 3.1 set). No qualifier questions. *(The needs selector replaced an earlier optional one-line message — a Sprint 03 adhoc change; the schema still carries an optional `details` line.)*

## 2. Modal — branching and lead handling

- **2.1 — Off-ramp trigger:** IF Q1 = "I'm still exploring" OR Q2 = "Just exploring" THEN show the off-ramp screen immediately; remaining qualifier questions and the contact step are not shown. **CURRENT.** Enforced server-side too: the `exploring` values are absent from the submit schema's enums, so a direct POST can't bypass the off-ramp (Rule 2.8; `07-technical-spec.md`).
- **2.2 — Off-ramp content & capture — CHANGED.** The off-ramp stays affirming and non-apologetic ("You're not ready for this yet — and that's the right read…"), keeps the escape hatch visible, and is a **success state for the business, not an error state**. It now **adds an optional, low-pressure "Stay in Touch" email capture** ("…we'll reach out when the timing's right — no sequence, no pressure"). It remains **not a hard sell** — capturing a still-exploring visitor's email honestly, not pushing them to convert.
- **2.3 — Qualified path:** all non-exploring qualifier combinations proceed through Q3, Q4, contact step. Q3 = "No — I'd need buy-in" and Q4 = "I just want it built" do NOT block submission — they are signals for Nathan, flagged in the alert (Rule 2.5). The site filters on exploration, not on imperfect answers. **CURRENT.**
- **2.4 — Submission & durable capture — CHANGED.** On submit (quick **or** qualified), the lead is re-validated server-side and **durably recorded to the Google Sheet "Inbound Leads" (the system of record), with a best-effort task in the Asana "Inbound Leads" project.** A capture reports success **only once the Sheet row is written** — **no fake success** (Rule 2.7). There is **no database** (decision-log #8); the Sheet (+ Asana) is the record. After a durable capture, Resend sends a lead **auto-reply** and Nathan's **alert** — best-effort, post-response, never blocking or reversing the capture (Rule 2.5; `07-technical-spec.md`). *(Supersedes pre-pivot 2.4 "one email to hello@…, no data stored.")*
- **2.5 — Signal flags — CHANGED.** The lead record + alert subject carry a signal label:
  - Qualifier: `[Lead]` default · `[Lead — needs buy-in]` if Q3 = `none` · `[Lead — build-first mindset]` if Q4 = `build_first` · `[Lead — review answers]` if both.
  - Quick door: `[Lead — quick]` (primary quick path) · `[Lead — exploring]` (off-ramp capture). Answer-less leads, so the buy-in/build-first flags don't apply; an `exploring` capture also gets a **gentler auto-reply** (no two-business-day promise), consistent with the off-ramp tone.
- **2.6 — Escape hatch:** `hello@nextsketch.com` is visible in the modal at every step, on the off-ramp, and on the success screen — and in a site footer if one ever ships (no footer is in the redesign section set, decision-log #13). It is a plain mailto link — never a form. **CURRENT.**
- **2.7 — Failure fallback:** if a capture does not durably succeed (validation reject, destination unreachable/unconfigured, or network error), show the escape hatch with the user's composed answers preserved on screen so nothing is lost. Never silently drop a lead, and never show success for a lead that wasn't stored. **CURRENT** (now backed by the real no-fake-success gating in `/api/qualify`).
- **2.8 — Spam — CHANGED.** Both doors carry a **honeypot** field (`_hp`, must be empty) + a **minimum-time check** (`_t` ≥ 3000ms; reject sub-3s completions), enforced server-side. No CAPTCHA (friction budget is spent on qualification, not bot tests). **Rate limiting (the pre-pivot "5/hour per IP") was never implemented** — in-memory per-IP limiting is unreliable on Vercel serverless; deferred to its own unit with a shared store if abuse appears (build-note 09 §3). It is not a leak-stopper.

## 3. Language rules (site-wide, enforced at build and in verification) — **CURRENT**

- **3.1 — Required CTA set (exhaustive):** "Start a Conversation" · "Talk to Us" · "Qualify Your Project" · "Let's See if We're a Fit" · "Build With Us". Primary CTA: "Start a Conversation" (the hero CTA). The quick-door submit uses "Talk to Us" (in the set). **Carve-out (CHANGED):** the off-ramp's **"Stay in Touch"** capture CTA is **intentionally outside** this conversion-CTA set — pushing a §3.1 conversion CTA on a visitor who just said they're still exploring would violate the Rule 2.2 "not a hard sell" intent.
- **3.2 — Banned terms (grep targets):** Get Started · Free Consultation · Book a Call · Schedule a Call · Request a Quote · Contact Us · Learn More · automation/automations · AI-powered · full-service agency · end-to-end solutions · award-winning · passionate about · let's explore · let's chat · innovative solutions · digital transformation · leverage AI.
- **3.3 — Vocabulary:** "embedded agents" / "agentic systems" (never "automations"); "we stay" / "partner, not a vendor"; "from idea to production."
- **3.4 — Retired brand sweep — CHANGED (decision-log #20, 2026-08-24):** "Autonomous Whales", "industrial design", "mechanical design", "manufacturability" must not appear **as a current service claim**. That is what the rule was written to stop: the retired consultancy's service lines reappearing as things NextSketch sells today.
  - **Biography is exempt, by ratified phrase only.** The About section's owner-authored copy says where Nathan *trained*, not what NextSketch offers, which is the opposite use. Exemptions are not granted to a term in general — they are granted to one exact phrase, in one named file, at an asserted occurrence count.
  - **Enforced in `scripts/check-banned-terms.mjs`** via its `ALLOWED` list, which is the source of truth for what is currently sanctioned. Today that is one entry: `"I started in industrial design"`, scoped to `src/content/copy.ts`, count 1. The same clause in any other content file still fails the build; so does rewording the sanctioned paragraph, so an exemption can never outlive the copy it was granted for.
  - Adding an entry is an owner decision and gets a decision-log row. The gate is the enforcement, this rule is the intent, and they are meant to agree — if they ever disagree, the gate wins and this rule is wrong.

## 4. Content authority

- **4.1 — CHANGED (decision-log #18–#19, 2026-08-24; #28, 2026-08-28).** Messaging Kit §05 copy is canonical for manifesto, process, who-it's-for, FAQ and final CTA. Edits to canonical copy are owner decisions, logged — and three have now happened, so §05 is **no longer canonical for the hero headline, the Services headline, or the capability strip's service names**:
  - **Hero headline** traces to **decision #18**, not §05. The live line is `LANDING.headline` in `src/content/copy.ts`. Messaging Kit §05 Hero Option A is **superseded**; it remains marked "locked" in the Kit itself, which lives outside this repo and is owner-owned to reconcile. **Do not "correct" the live hero back to Option A** — that is the specific failure this note exists to prevent.
  - **Services headline** traces to **decision #19** (em-dash removal), not §05 verbatim. The four service *descriptions* remain §05, with the one em dash in the Agentic System description replaced by a comma under the same decision.
  - **Capability strip service names** trace to **decision #28**, not §05. `LANDING.capabilities` renders New Product / Product Completion / Product Support / Agentic System — the quick door's names (Taxonomy §1) — where §05 carries the long forms. The Kit still carries the long forms and is owner-owned to reconcile outside this repo. **Do not "correct" the strip back to them** — the same failure this note exists to prevent for the hero. Renaming a service is **not** permission to reword its description: the four descriptions remain §05 as written (#27).
  - Where a doc and `src/content/` disagree about live copy, **code wins** and the doc is the bug. Copy for retired sections stays dormant on disk.
- **4.2** Testimonials render placeholder blocks until client-approved rewritten quotes exist. Fabricated or unapproved quotes never ship. **RETIRED as a section** (not in the #13 set); the approval constraint survives verbatim if testimonials ever return.
- **4.3 — CHANGED (decision-log #16, 2026-08-24).** Placeholder tiles never carry invented project names or invented outcomes. The **principle is CURRENT** and holds for anything still placeholdered anywhere on the site. The "Work grid RETIRED" note is **superseded**: `#work` was reactivated by decision #16 and now ships **real owner-supplied content** — project names, summaries, 16/9 screenshots and live links in `src/content/work.ts` — so the section is no longer in a placeholder posture at all. Two things the principle still governs there: card titles use each project's own published title rather than a product name the source doesn't assert, and summaries describe only what each product *is*, never how it performed. An item with no `image` still falls back to the layout-final ink placeholder, which is where the original rule bites.
- **4.4 — Email & modal copy (CHANGED/new).** The lead auto-reply + alert copy (`src/content/email.ts`) and the quick-door / off-ramp / success copy (`src/content/modal.ts`) are **DRAFT in brand voice, pending owner approval** — not from Messaging Kit §05. Approve or edit before launch (build-notes 11–12).

## Edge cases — **CURRENT**

- **E1** Visitor opens the qualifier, goes back from the contact step and changes Q1 to "still exploring" → re-evaluate Rule 2.1, route to off-ramp.
- **E2** Repeat visitor who hit the off-ramp → no cooldown; the modal is always available fresh.
- **E3** JavaScript disabled → the hero CTA degrades to the mailto escape hatch.

## Open questions

- **Off-ramp capture asks name + email** (not email-only) — owner to confirm, or say the word to make name optional for the off-ramp source (build-note 12; tracked in `decision-log.md` "Still open"). Everything else in §1–2 is ratified.
