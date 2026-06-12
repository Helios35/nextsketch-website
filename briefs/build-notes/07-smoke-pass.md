# Build Notes — 07 Smoke / Propagation Pass

**Branch:** `feature/smoke-pass` · **Date:** 2026-06-12 · **Brief:** `briefs/07-smoke-pass.md`
**Verdict: PASS.** The full site works as one piece. Zero structural findings, zero in-branch fixes needed. Two informational notes (§Findings). Everything owner-owed is in §8.

Verified state: `main` at `981facd` (unit 06 merge — all six units in). Tooling: dev server walkthrough in a controlled browser (desktop 1440×900, mobile 375×812, plus 360/768/1024 sweeps), headless Chrome for forced reduced-motion, raw-HTML fetches for no-JS, local + CI gate runs.

| # | Sub-task | Covered by checks |
|---|----------|-------------------|
| 02 | page-shell | 1, 2, 6, 7 |
| 03 | sections-story | 1, 4, 5, 6 |
| 04 | sections-proof | 1, 4, 5, 6 |
| 05 | sections-convert | 1, 2, 3, 4, 6 |
| 06 | qualification-modal | 3, 4, 6, 7 |

---

## 1. Full-page walkthrough — PASS

- All ten Taxonomy §6 sections render in canonical order in the DOM: `top → why → process → work → services → about → voices → fit → faq → start` (queried `section[id]` order), framed by nav and footer — the 12-row structure of `docs/03-site-architecture.md` §Page structure.
- **Desktop (1440):** hero at hero scale with gold underline under "stay", stat strip `<dl>` under a hairline; manifesto with rose underline; process accordion (Strategy open, gold circle on the open number); work 2×2 asymmetric grid (right column offset); services on their four Taxonomy accents with paired `-ink` text; About ink panel with portrait placeholder; two quiet testimonial blocks (gold/sage quote marks); fit; FAQ two-column with six closed items; final-CTA ink panel (white inverse pill + gold arrow) closing into the ink footer. Screenshot-verified per section.
- **Mobile (375):** single column throughout, work tiles stack to one column (all tiles x=24, w=327), hamburger replaces desktop links, no horizontal overflow (`scrollWidth` = 375).
- **Breakpoint sweep (UX spec §Responsive: 360/768/1024/1440):** zero horizontal overflow at every width; nav switches burger ↔ links exactly at `md` (768).
- Nav shrink: transparent + `py-5` (20px) at top → solid paper `rgba(229,230,225,1)` + hairline `border-ink/10` + `py-3` (12px) past 80px scroll, reverts at top. Computed-style verified both states.
- Zero app console errors or warnings across the whole walkthrough (only Vercel Analytics dev-mode debug lines and HMR notices).

## 2. Anchors, logo, 404 — PASS

- All nine section anchors land at exactly **80px** below viewport top (the global `section[id] { scroll-margin-top: 5rem }` clearing the shrunken nav) — measured `getBoundingClientRect().top` = 80 for `#why #process #work #services #about #voices #fit #faq #start`.
- Footer anchors carry identical hrefs (Process · Work · Services · About · FAQ) plus visible `mailto:hello@nextsketch.com` and legal line `© 2026 Next Sketch LLC`.
- Logo (nav and footer) → `#top`: lands at effective page top (scrollY ≈ 9px — the hero's own scroll margin; nav renders transparent/full-height, i.e. the "at top" state).
- Mobile overlay anchors: link click closes the menu and settles at section top − 80px (measured `#process` = 80 after smooth scroll).
- 404: `GET /this-page-does-not-exist` and `/old-webflow-route` both return **HTTP 404** with the branded page inside the root layout (nav + footer present). "Go to the page" routes back to `/` with all ten sections live. Screenshot-verified.

## 3. CTAs and the four user flows — PASS

All four conversion CTAs open the modal, and all four carry the `mailto:hello@nextsketch.com` degrade href (E3 seam): nav desktop, nav mobile overlay (closes the menu first via `onBeforeOpen`), hero, final-CTA section. Footer mailto stays a plain link (Rule 2.6, not a conversion CTA).

Flows per `docs/03-site-architecture.md` §User flows, traced end-to-end on one build:

- **Founder with an idea** — Q1 "New product from scratch" → Q2 "Ready now" → Q3 "Yes, it's my call" → Q4 "Yes — that's why I'm here" → contact (name/email required, company optional, details optional `maxLength=1000`, honeypot `aria-hidden` + `tabIndex=-1`) → submit (after >3s, clearing the minimum-time check honestly). Interim submit lands on the **failure-fallback** per Decision Log #6: headline "That didn't go through — your answers are safe.", all answer/contact pairs preserved on screen, mailto prefilled with subject + composed answers (Rule 2.7's strongest form). Back from failure returns to contact with field values intact.
- **Stuck at 70%** — Q1 "Stuck at 70% — rescue or finish" proceeds Q2→Q3→Q4→contact (used as the E1 vehicle, below).
- **SMB upgrader** — Q1 "Agentic systems for my product or operations" → "Ready now" → **"No — I'd need buy-in"** → **"I just want it built"** → contact step reached: Rule 2.3 confirmed, signal answers don't block. (Fourth qualified Q1, "My live product needs a partner", also verified to proceed past Q1.)
- **Still exploring** — both Rule 2.1 triggers verified: Q1 = "I'm still exploring" and Q2 = "Just exploring" each route straight to the off-ramp. Off-ramp per Rule 2.2: canonical opening "You're not ready for this yet — and that's the right read.", **no form** (zero inputs), progress dots hidden, mailto visible, back control present. Back returns to the triggering question (Q1 and Q2 respectively).
- **Modal abandoner** — close → modal **unmounts** (no dialog markup left); footer escape hatch still available.

Edge cases: **E1** — from contact, Back×4 to Q1 (answer preserved on each step), change Q1 to exploring, Next → off-ramp. **E2** — close + reopen → fresh flow at Q1, nothing selected, "Step 1 of 5". Step mechanics: Next disabled until a selection exists; focus moves to the step heading on every screen; sr-only "Step n of 5" tracks the dots; modal submit button is "Let's See if We're a Fit" (Rule 3.1 set).

## 4. Language sweep on built output — PASS

- `npm run banned-terms` **green** on the production build: `banned-terms: clean (26 files scanned).` (scans `.next` HTML/RSC + `src/content/*.ts`, fails closed).
- Manual sweep of the **rendered** page text (`/` and the 404): zero hits on the full Rule 3.2 + 3.4 term lists.
- Rule 3.1: the only conversion CTA on the page is "Start a Conversation" (primary everywhere); the modal submit is "Let's See if We're a Fit" — both in the exhaustive set. No off-set CTA found ("Go to the page" / Back / Next / Close are navigation controls, per the build-notes 02 pattern).
- Rule 3.3 vocabulary confirmed present on the rendered page: "embedded agents", "agentic systems", "we stay"/"I stay", "partner, not a vendor", "from idea to production".
- Rule 3.4: no retired-brand term anywhere in rendered output.

## 5. Honest-placeholder audit — PASS

- **Stat strip:** values `00 / 00+ / 00% / 00` — obviously unfinal, inventing nothing (Decision Log #5). Labels are the drafted set awaiting approval (§8).
- **Work tiles (×4):** tinted hatch placeholders labeled "Case study — coming in build" + taxonomy asset names (`placeholder-work-01…04`). No invented project names, no invented outcomes (Rule 4.3).
- **Testimonials (×2):** "Client quote — pending approval" placeholder blocks; no fabricated or unapproved quotes (Rule 4.2, sprint Decision 7).
- **About:** `placeholder-about-01` (3/4 portrait) awaiting owner photography.
- **Socials:** LinkedIn · X / Twitter · Instagram render with placeholder `#` hrefs (Decision Log #4; URLs owner-owed).

## 6. Degradation passes — PASS

- **Reduced motion:** every transition/animation declaration in the compiled CSS — 18 transition + 2 animation (modal-in, step-in) — sits inside `@media (prefers-reduced-motion: no-preference)`; zero ungated (raw-stylesheet analysis). Smooth scroll same-gated. Headless Chrome with `--force-prefers-reduced-motion` on the hydrated page: **zero** `opacity: 0`, **zero** rise transforms, hero through FAQ all present. Hover-draw arrows: the hiding rule (`motion-safe:[stroke-dashoffset:1]`) is itself motion-gated, so reduced-motion users get pre-drawn strokes.
- **No-JS (E3):** raw server HTML contains all ten anchors, every section's copy (hero, manifesto, FAQ Q1 spot-checked), the legal line, zero `opacity:0`, **4 mailto CTAs** (nav + hero + final-CTA + footer hatch), **zero** `#start` CTA hrefs, **zero** dialog markup, and 10 native `<details>` (4 process + 6 FAQ — readable and openable JS-free). Page is fully usable; conversion degrades to mailto exactly as specced.
- **Keyboard-only through the modal:** dialog is `:modal` (native top-layer focus trap + Esc); programmatic focus of a background nav link is blocked (focus stays in-dialog); radios are a proper shared-`name` group (arrow-key semantics native), all focusable; no positive tabindex anywhere; honeypot unfocusable; body scroll locked while open and restored on close; focus moves to the heading on each step. Mobile overlay menu: Esc closes, focus returns to the toggle ("Open menu"), scroll restored.
- **Mobile modal:** full-screen (rect = 375×812 at origin), no horizontal scroll, submit reachable.

## 7. Gates — PASS

- **Local**, on `feature/smoke-pass` (= `main` content): `npm run lint` · `npm run typecheck` · `npm run build` · `npm run banned-terms` — all green.
- **CI on the final merged state:** run `27395880865` on `main` (the unit-06 merge) — **success**, and `.github/workflows/ci.yml` runs exactly the four gates (`npm ci` → lint → typecheck → build → banned-terms).

## 8. Open-items ledger — everything owner-owed, in one list

**Pre-launch content (owner: Nate, due at launch-readiness check):**

1. Real stat-strip numbers (Decision Log #5) — placeholders `00/00+/00%/00` until then.
2. Social URLs for LinkedIn, X/Twitter, Instagram (Decision Log #4) — hrefs are `#` until then.
3. Client-re-approved testimonial quotes (Rule 4.2, sprint Decision 7) — placeholder blocks until then; drop-in copy change.
4. Real work imagery — swaps in by taxonomy name + ratio (`placeholder-work-01…04`).
5. About photography (`placeholder-about-01`, 3/4 portrait).

**Drafted copy awaiting owner approval** (Decision Log #3 approved `SITE` meta, `MODAL_OFF_RAMP` body+closing, `MODAL_SUCCESS.headline`, `MODAL_FAILURE`; still open):

6. Unit 02: `NOT_FOUND` strings · `NAV.label`/`NAV.menu.*`/`FOOTER.label` microcopy · "X / Twitter" display label.
7. Unit 03: `HERO.stats` labels · `PROCESS.annotation`.
8. Unit 04: `WORK.headline`/`tileLabel` · `TESTIMONIALS.headline`/`placeholderLabel` · `ABOUT` full copy (the brief's explicit gate).
9. Unit 05: `FAQ.headline` ("Common questions").
10. Unit 06: `MODAL_CONTACT_HEADING` · `MODAL_PROGRESS.step` · `MODAL_FAILURE_SUBJECT`.

**Sprint 02 (owner-owned accounts + build):**

11. Resend account (Tech Spec Review Note 1) — blocks `lead-api`.
12. Vercel project + env vars (`RESEND_API_KEY`, `NOTIFY_EMAIL`) — re-arms the deferred setup-checklist items; blocks `lead-api` testing and launch.
13. `/api/qualify` route into the `submitQualification` seam: server-side re-validation with the same schema, Rule 2.5 subject flags, rate limiting (Rule 2.8) — replaces the interim failure-fallback submit (Decision Log #6).

**Launch gate (per `docs/08-runbook.md`):**

14. DNS cutover, old-Webflow-route redirects (`/projects`, `/about-us`, `/contact-us`, `/projects/*` → `/`), MX records untouched.

## Findings (non-blocking)

1. **[Info] CI actions deprecation** — `actions/checkout@v4` and `actions/setup-node@v4` run on Node 20, which GitHub deprecates on runners; runs are forced to Node 24 from 2026-06-16 (annotation on every green run). Severity: low — runs stay green today. Recommendation: bump both to `@v5` as a one-line Sprint 02 chore. Not fixed here: CI infrastructure is outside this unit's zero-diff default.
2. **[Info, environmental] Dev-server stale-chunk hiccup** — mid-walkthrough, Turbopack Fast Refresh served a stale chunk (`ChunkLoadError` on a layout chunk), leaving one page-load uninteractive. Cleared by a dev-server restart + fresh `.next`; not reproducible; production build unaffected (static prerender, gates green). No product change; noted in case it recurs on the dev machine (OneDrive file-watching is a plausible aggravator).

## Build-vs-docs drift

None found. Every deviation flagged in build-notes 01–06 is either owner-approved (decision log), an open approval listed in §8, or a documented builder's-call the architecture delegated (modal overlay vs `/start`, recorded in build-notes 06).

## Diff in this branch

Documentation only: this report (and the brief copied into `briefs/` per the docs-in-repo pattern). Zero code changes — the trivial-fix allowance was never needed.

## Sprint 01 exit

The sprint's exit state holds: the complete page renders with canonical copy and honest placeholders; everything except live lead delivery works end-to-end. Ready to plan Sprint 02 (`lead-api` + Vercel).
