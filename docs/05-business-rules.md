# Business Rules — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active
**Answers:** What decisions does the system make?
**References:** `06-taxonomy.md` (canonical values) · `02-prd.md` (requirements) · Brand Philosophy §8/§10 (voice authority)

---

## Overview

Rules governing the qualification modal, lead handling, and language constraints. Cite by number ("per Rule 2.2").

## Glossary

- **Qualified lead** — a modal completion that reached and submitted the contact step.
- **Off-ramp** — the modal end-screen shown to visitors classified as exploring; no contact form.
- **Escape hatch** — the always-visible hello@nextsketch.com mailto path.
- **Banned term** — language Brand Philosophy §8/§10 prohibits anywhere on the site.

## Roles and permissions

One human role: visitor (anonymous, public). One operator: owner (Nathan) — receives lead emails; no admin UI exists.

## 1. Modal — question set

The modal asks, in order (canonical answer values in `06-taxonomy.md` §Modal answers):

- **1.1 — Q1 Project type:** "What do you need built or improved?" → New product from scratch / Stuck at 70% — rescue or finish / Agentic systems for my product or operations / My live product needs a partner / I'm still exploring
- **1.2 — Q2 Readiness:** "When are you looking to start?" → Ready now / Within 1–3 months / Just exploring
- **1.3 — Q3 Authority:** "Can you make the decision to move on this?" → Yes, it's my call / Shared decision / No — I'd need buy-in
- **1.4 — Q4 Validation:** "Are you open to validating the idea before we build?" → Already validated / Yes — that's why I'm here / I just want it built
- **1.5 — Contact step:** name (required), email (required), company (optional), "tell us about it" free text (optional, 1000 char max).
- **1.6** Every step shows the escape hatch (Rule 2.6) and a back control. No step may be skipped except as branched by §2.

## 2. Modal — branching and lead handling

- **2.1 — Off-ramp trigger:** IF Q1 = "I'm still exploring" OR Q2 = "Just exploring" THEN show off-ramp screen immediately; remaining questions and contact step are not shown.
- **2.2 — Off-ramp content:** affirming, non-apologetic ("You're not ready for this yet — and that's the right read…"), no form, escape hatch visible. The off-ramp is a success state for the business, not an error state.
- **2.3 — Qualified path:** all other answer combinations proceed through Q3, Q4, contact step. Q3 = "No — I'd need buy-in" and Q4 = "I just want it built" do NOT block submission — they are signals for Nathan, flagged in the lead email (Rule 2.5). The site filters on exploration, not on imperfect answers.
- **2.4 — Submission:** on contact-step submit, send one email to hello@nextsketch.com containing every answer (labels per `06-taxonomy.md` mapping), timestamp, and page source. No data is stored server-side beyond transient processing (no database at launch).
- **2.5 — Signal flags:** lead email subject prefixes: `[Lead]` default; `[Lead — needs buy-in]` if Q3 = No; `[Lead — build-first mindset]` if Q4 = "I just want it built"; both conditions → `[Lead — review answers]`.
- **2.6 — Escape hatch:** hello@nextsketch.com is visible in the modal footer at every step, on the off-ramp, on the success screen, and in the site footer. It is a plain mailto link — never a form.
- **2.7 — Failure fallback:** if submission fails (network/API error), show the escape hatch with the user's composed answers preserved on screen so nothing is lost. Never silently drop a lead.
- **2.8 — Spam:** honeypot field + minimum-time check (reject < 3s completions) + rate limit per Tech Spec. No CAPTCHA (Rule: friction budget is spent on qualification, not bot tests).

## 3. Language rules (site-wide, enforced at build and in verification)

- **3.1 — Required CTA set (exhaustive):** "Start a Conversation" · "Talk to Us" · "Qualify Your Project" · "Let's See if We're a Fit" · "Build With Us". Primary CTA everywhere: "Start a Conversation".
- **3.2 — Banned terms (grep targets):** Get Started · Free Consultation · Book a Call · Schedule a Call · Request a Quote · Contact Us · Learn More · automation/automations · AI-powered · full-service agency · end-to-end solutions · award-winning · passionate about · let's explore · let's chat · innovative solutions · digital transformation · leverage AI.
- **3.3 — Vocabulary:** "embedded agents" / "agentic systems" (never "automations"); "we stay" / "partner, not a vendor"; "from idea to production."
- **3.4 — Retired brand sweep:** "Autonomous Whales", "industrial design", "mechanical design", "manufacturability" must not appear.

## 4. Content authority

- **4.1** Messaging Kit §05 copy is canonical for hero, manifesto, process, services, who-it's-for, FAQ, final CTA. Edits to canonical copy are owner decisions, logged.
- **4.2** Testimonials render placeholder blocks until client-approved rewritten quotes exist (PRD Review Note 3). Fabricated or unapproved quotes never ship.
- **4.3** Placeholder tiles never carry invented project names or invented outcomes.

## Edge cases

- **E1** Visitor opens modal, goes back from contact step and changes Q1 to "still exploring" → re-evaluate Rule 2.1, route to off-ramp.
- **E2** Repeat visitor who hit the off-ramp → no cooldown; modal always available fresh.
- **E3** JavaScript disabled → CTAs degrade to mailto escape hatch.

## Open questions

None — PRD Review Notes 1–3 are content questions owned by the PRD, not rules.
