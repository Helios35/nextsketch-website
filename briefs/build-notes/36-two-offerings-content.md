# Build Note 36: Two offerings, content and structure (adhoc)

**Date:** 2026-10-15 · **Branch:** `adhoc/two-offerings-content` · **Base:** `main` @ `d459c4e`
**Status:** COMPLETE. The site sells two offerings, Agentic System Integration first, on every surface; Part B ships verbatim; the three home bands are in; the waitlist captures through the modal's seam. All four gates green. Fourteen builder calls come back to Nate below; three want his word (2, 3 and 5).
**Follows:** build-notes 34 and 35. **Decisions:** **#53 to #59** appended; the footer closes seven items and adds one. Next free row **#60**, next build note **37**.
**Brief:** "Adhoc Unit: Two offerings, content and structure" (Nate, 2026-10-15; Brief 1 of 3). The visuals brief (2) and the About/team brief (3) follow.

---

## Pre-flight gap list

Traced from `src/content/` and `src/app/` before anything changed. The brief was written from a read-only look at `main` @ `d459c4e`; where it and the code differed, the code won.

**Consumers mapped:**

| Thing | Read by |
|---|---|
| The services (`SERVICES`, `SERVICE_NEED`, `SERVICE_PAGE_HREF`, `ServiceSlug`) | `services-section.tsx` (cards, CTAs, card-name links), `service-pages.ts` (block names, descriptions, needs), `types.ts`. `LANDING.capabilities` repeated the four names as literals |
| The pricing tiers (`PRICING_TIERS`, `PRICING_NEED`, `PricingTier`, `PricingTierSlug`) | `pricing-tiers.tsx`, and `service-pages.ts`, whose agentic blocks rendered the two tier names and descriptions |
| The modal's project types | `modal.ts` (`MODAL_QUESTIONS`, `MODAL_QUICK.needsOptions`), `qualification-modal.tsx` (`NEED_CONFLICTS`, `initialNeed`), the provider, `ModalTrigger`, `ServiceCta`; `lead-format.ts` and `lead-notify.ts` write the labels into the Sheet, the Asana task and the alert; `schema.ts` holds the stored values |
| The service-route blocks | `service-pages.ts`, `types.ts` (`ServiceBlockId`, `SERVICE_BLOCK_PAGE`, `ServicePageBlock`, `ServicePageContent`), `service-page.tsx`, `service-block-visual.tsx` (one visual per block id), `serviceBlockHref` (exported, no caller) |
| The process | `copy.ts` (`PROCESS`, the dormant `PROCESS_ACCENTS`), `process-section.tsx` and `service-process.tsx` (both hard-coded `"validate"` for the aside), `types.ts` (`ProcessPhaseSlug`) |

**Gaps found:**

1. **`claude/site-content-running-notes.md`**, which the brief cites for the calls behind it, is in neither the repo nor the reference folder. Built from the brief alone.
2. **The hero is already taller than 768px at 1024×768** on `main`: 882px, the `pt-19` guard of #51 at work. "Fits at 1024×768 with no overflow" was therefore measured as no added height, no horizontal overflow, and the strip still clear of the logo (below).
3. **Every preselect was typed to all four project types**, while the quick door showed four tabs. Cutting the door to two would have let `/services/product`'s Product Completion and Product Support CTAs preselect a value with no visible tab, submitted invisibly. Every preselect is now typed to the door's own options (`QuickNeed`), so that cannot compile.
4. **The product route's hero and close preselected nothing**, because three services shared the page (#30). With one offering they preselect `new_product` (builder call 1).
5. **Figures lived in one place** (`pricing.ts`); Part B puts them on three surfaces in three wordings. They now live once (`PRICES`).
6. **Internal Tool's monthly was $6,998** (an owner call of 2026-10-01 recorded only in `pricing.ts` comments; #45 records $2,998). It retires with the tier, so nothing turns on it.
7. **The modal's failure fallback was inline in the modal**, and its mailto subject is about qualification answers. The band reuses the pieces, exported; the subject does not fit (builder call 5).
8. **The lead alert's intro and reply hint say "lead"**, which a waitlist entry is not (builder call 4).
9. **`PROCESS_ACCENTS`** (dormant, F10) is keyed by phase slug, so renaming the slugs touched it; its keys follow, so the dormant set compiles. No dormant file was deleted.
10. **Two accessible names compose an em dash** in component code, `Build With Us — <name>` (`service-cta.tsx`) and `<project> — See More` (`work-rail.tsx`). Not lines this unit touched; flagged.
11. An **empty `src/content/case-studies/` folder** (25 September, left by a branch switch; git ignores it) and `NSOS-Transfer/` were left alone.

## What shipped, surface by surface

**Home.**
- **Hero:** the capability row reads the two offerings (from `SERVICES`); the **audience line** sits under the supporting line. Headline, supporting line, CTA, overlays and fade unchanged (#51).
- **Proof band** (new, `proof-band.tsx`): directly under the hero, above Work. Three claims behind coral list diamonds.
- **Work:** unchanged.
- **Why** (`#why`, the Manifesto component): eyebrow "Process mapping", the owner headline with "map first" in coral, the two body paragraphs. Slot, id and nav label unchanged.
- **Services:** the headline; **two cards**, each with its index, name (still a link to its route), subtitle, line, price row and the shared "Build With Us" CTA; the agentic card adds the four example names. Then the **waitlist band** (new, `waitlist-band.tsx`).
- **Process:** "Map. Build. Validate. Optimize." with "Optimize." in coral; the four phases; the aside on Map. Map opens on load, as the first phase always has.
- **About, Final CTA:** untouched.
- **Search title and description:** Part B's.

**`/services/agentic-system`:** title and description; eyebrow "Agentic System Integration"; the #37 `<h1>` unchanged; the lead line, the new intro and the price in the hero; the ribbon carries the four example names; **four example blocks** (Email triage, Weekly reporting, Quoting and intake, Document and data entry), each with what the agent does, a "What we map first" panel and a visual slot; then **"What you get" and "What the monthly covers"**; How it works and the close as before. The Internal Tool and AI Workflow Integration blocks are gone.

**`/services/product`:** title and description; eyebrow "AI Product Development"; the owner `<h1>` with "stay" in coral (closing the `<h1>` owed since #30); lead line, intro and price; the ribbon carries the three ways in; **Build from scratch, Finish what someone started and Ongoing product team** on the existing blocks, anchors and visuals, each with its four bullets.

**`/pricing`:** title and description; the new intro; **two tiers** (Agentic System Integration, AI Product Development), each with Part B's description, figures, captions, "Included" and "What the monthly covers" lists. No struck price, no "Down from". Eyebrow, headline, coral word, term, footnote and CTAs unchanged.

**Modal:** the quick door's two options (agentic first); the qualifier's Q1 labels, agentic first. Questions, flow, off-ramp and every other screen unchanged.

**404:** the new body line.

**Lead pipeline:** a third payload kind, `waitlist` (below). The Sheet, Asana and alert now read the new labels.

**Gate:** "automation" and "automations" are out of `check-banned-terms.mjs`; its stale "⚠ OWED" comment now cites #20.

## Fields, types and slugs

| | Added | Renamed / changed | Retired |
|---|---|---|---|
| `src/lib/types.ts` | `Service.subtitle`, `.price`, `.examples`; `PricingTier.monthlyCovers`; `ServicePageBlock.mapFirst`; `ServicePageContent.leadLine`, `.price`, `.offer` | `ServiceSlug` is now `"agentic-system" \| "product"` (each offering's existing route slug), and `ServicePageSlug` is the same union; `ProcessPhaseSlug` is `map \| build \| validate \| optimize`; `ServiceBlockId` gains the four example anchors; every `need` is `QuickNeed` | `Service.accent` (dead data, #47); `PricingTier.upfrontWas`; `PricingTierSlug` loses `tool` and `rescue`; `ServiceBlockId` loses `ai-workflow-integration` and `internal-tool` |
| `src/content/services.ts` | `PRICES` (the one place a figure lives), `SERVICES_WAITLIST` | `SERVICES` (two entries), `SERVICE_NEED` and `SERVICE_PAGE_HREF` (keyed by the two slugs), `SERVICES_HEADLINE` | the four service entries |
| `src/content/pricing.ts` | `PRICING.monthlyCoversLabel` | `PRICING.title`, `.description`, `.intro`; `PRICING_NEED` reads `SERVICE_NEED`; `PRICING_TIERS` (two, names from `SERVICES`, figures from `PRICES`) | `PRICING.upfrontWasLabel`; the `tool` and `rescue` tiers |
| `src/content/service-pages.ts` | `SERVICE_PAGE_LABELS` | both pages rewritten; ribbons read their blocks' names | the two-depth blocks |
| `src/content/copy.ts` | `LANDING.audienceLine`, `PROOF`, `PROCESS.annotationPhase` | `SITE.title`, `.description`; `NOT_FOUND.body`; `LANDING.capabilities` reads `SERVICES`; `MANIFESTO`; `PROCESS`; `PROCESS_ACCENTS` keys | |
| `src/content/modal.ts` | `QuickNeed` (type) | `MODAL_QUICK.needsOptions` (two); Q1 labels and order | |
| `src/lib/schema.ts` | `waitlistPayloadSchema`, `WaitlistPayload`; `botGuards` (the two guards, shared) | `leadPayloadSchema` gains the third kind | |
| `src/lib/lead-format.ts`, `lead-notify.ts` | `WAITLIST_SIGNAL`; the `waitlist` lead type; `sendWaitlistAlert` | `leadSignal`, `toSheetRecord`, `toAsanaTask` handle the kind; `notifyLead` skips the auto-reply for it | |
| Components | `proof-band.tsx`, `waitlist-band.tsx`; in `qualification-modal.tsx`, the exports `CAPTION_CLASS`, `INPUT_CLASS`, `HEADING_CLASS`, `HoneypotField`, `ComposedAnswers`, `fallbackMailto` (the modal now renders through the last two itself) | `pricing-tiers.tsx` (`TierList`, seven rows, two columns); `service-page.tsx` (`OfferList`, the hero lines, the map panel); `service-block-visual.tsx` (`SlotVisual`) | `InternalToolVisual`; `NEED_CONFLICTS` and the tabs' disabled state |

**Unchanged, as the brief requires:** routes; the `/services/product` anchors; the payload values `new_product`, `rescue`, `agentic`, `partnership`; the pricing tier slugs `workflow` and `custom`; the Sheet's eleven columns and their order.

## Where the audience line landed: in the hero

Under the supporting line, in the right-hand column (Inter `text-sm md:text-base`, linen, right-aligned from `sm:`, with the over-video shadow). The column is bottom-anchored and far shorter than the headline column from `sm:` up, so it adds no height; on a phone the stack is shorter than the screen, so it moves the content up instead.

| Size | Hero height, before → after | Strip top (logo bottom 76) | Horizontal overflow |
|---|---|---|---|
| 1024×768 | 882 → **882** | 76 → 76 (the #51 guard) | none |
| 1280×720 | 727 → 727 | 76 → 76 | none |
| 1280×800, 1366×768, 1440×900, 1920×1080, 768×1024 | = viewport, unchanged | unchanged | none |
| 414×896, 390×844, 375×667, 360×780 | = viewport, unchanged | 483 → 425, 431 → 373, 230 → 172, 343 → 285 | none |

**Contrast over the footage**, re-measured because the line lifts the supporting line (by about 64px from `sm:`) and, on a phone, the coral phrase. Method: motion on, the loop paused and seeked every 0.5s through all 59 frames, the three texts made transparent with no shadow, and the 5th percentile of per-pixel contrast behind each line box. Worst frame per size:

| Size | Coral "work in production" | Supporting line | Audience line |
|---|---|---|---|
| 1920×1080 | 5.37 | 5.63 | 13.76 |
| 1440×900 | 5.39 | 5.57 | 13.62 |
| 1280×800 | 5.37 | 5.48 | 13.29 |
| 1280×720 | 5.36 | 5.48 | 13.15 |
| 1024×768 | 5.43 | 5.50 | 13.43 |
| 768×1024 | 5.45 | 5.54 | 13.33 |
| 414×896 | 5.40 | 5.61 | 13.42 |
| 390×844 | 5.40 | 5.57 | 13.42 |
| 375×667 | 5.37 | 5.55 | 13.42 |
| 360×780 | 5.39 | 5.51 | 13.42 |

All clear 4.5:1. Every other new text sits on a flat fill at a ratio the UX spec records: linen on `background` 14.4 (proof band, waitlist line and confirmation, lead lines and prices on the service routes), `muted-foreground` on `card` 5.0 (card subtitles, examples, tier list labels), on `background` 5.4 (the waitlist eyebrow and field label) and on `secondary` 4.6 (the "What we map first" label). On the glow routes the new page-ground texts are linen, which #52's measurement bounds well above the floor.

## How the waitlist capture is labelled

- **Payload:** `kind: "waitlist"`, `email`, and the two guards (`_hp`, `_t`, the latter timed from when the band mounted). No name, no answers.
- **Sheet row:** the same eleven columns: `lead_type: waitlist`, `signal: [Waitlist]`, the email, every other column empty.
- **Asana task:** `[Waitlist] <email>`, notes "Door: Waitlist band (Services)".
- **Alert to Nate:** subject `[Waitlist] <email>`, body the email and the capture time. **No auto-reply.**
- **`[Waitlist]` is deliberately not a `[Lead …]` label**, so an entry reads apart from a lead wherever Nate sees it.

## Builder calls (each comes back to Nate)

1. **`/services/product`'s hero and close now preselect AI product development** (`new_product`). Under #30 they preselected nothing because three services shared the page; it is one offering now. Every CTA on both routes preselects its page's offering.
2. **Visual stand-ins on the agentic route:** the app cluster of #34 (whose block retired) stands in for **Email triage**, and the other three blocks show an **empty `secondary` 4/3 frame**. Only the Internal Tool mock was deleted. Brief 2 replaces all four. *Wants Nate's word if the empty frames should not reach production before Brief 2.*
3. **Waitlist routing:** an entry goes to the Sheet (which gates success), an Asana task in Inbound Leads, and Nate's alert; only the auto-reply is carved out, which is the literal reading of "the same durable capture path" and Rule 2.4. *Wants Nate's word: keeping waitlist entries out of Asana, or out of the inbox, is a one-line change each.*
4. **The waitlist alert carries no new copy:** subject `[Waitlist] <email>`, body the labelled email and time. The lead alert's "New lead from the NextSketch site." and "Reply to this email to reach the lead directly." are not reused, because a waitlist entry is not a lead.
5. **The waitlist fallback's mailto has no subject line.** Part B is silent, and the modal's subject ("Project inquiry — my qualification answers") would mislabel the email. *Wants a line from Nate.*
6. **The waitlist fallback reuses the modal's failure copy** (as Part B says), which reads "your answers are safe" / "Your answers are below" for a single email, and carries two em dashes in lines this unit did not touch. *Flagged.*
7. **No-JS waitlist:** the form's action is the escape-hatch mailto, so a no-JS submit reaches a person (Business Rules E3) instead of putting the address in a URL.
8. **Placement:** the service routes' price sits in the hero, under the intro, in `/pricing`'s term-line treatment; the agentic "What you get / What the monthly covers" band sits after the four examples, before How it works.
9. **Each example block keeps the "Build With Us" CTA** every service-route block carries (owner direction, #30). Part B lists the block's name, line, map line and visual, and is silent on the CTA.
10. **Proof band:** three Inter medium items behind coral list diamonds, no hairline above or below (a rule there would redraw the seam the hero's all-edge fade removes, #50).
11. **Waitlist band:** under a `border-t` hairline, not a card, so it does not read as a third offering; its button is the `secondary` `<Button>`, the quieter step, because it is not a conversion action.
12. **Service cards:** Part B's order (name, subtitle, line, price, examples), then the CTA. The subtitle is `muted-foreground` medium; the price row is linen, never coral (coral stays on `/pricing`'s monthly figures), stacked on a phone and divided by a hairline from `sm:`. Both names still fit one line at every width (measured: "Agentic System Integration" 224px against a 264px column at 360, 249px against 280px at 768), so the owner's one-line rule holds; the `xl:text-lg` step for the old 4-up grid went with it.
13. **Grids:** the Services cards and the pricing tiers run two columns from `md` at every wider width, full-bleed as before.
14. **Single sources:** `LANDING.capabilities` reads `SERVICES`; the tier names read `SERVICES`; the figures live in `PRICES`; the example names are the offering's `examples`, read by the card, the blocks and the ribbon; the agentic monthly list is the tier's.

## Deviations from the brief

- **Status DRAFT.** The brief was pasted as the unit to build, so Part B was treated as signed off and ships verbatim.
- **Docs beyond the listed spec updates:** Rules 2.4, 2.5, 2.7 and 2.8 and the glossary name the waitlist (it is a third payload kind), `07-technical-spec.md` records the data contract, `08-runbook.md` gains a waitlist smoke step, and `01-vision.md` and `02-prd.md` drop "four services". `docs/concept-website-rebuild.md` is the original concept and is left as history.
- **Footer:** the brief named five items to close; two more are closed because #56 resolves them ("what the monthly buys" and New Product's "price it to the deliverable" description), and the pricing-slug item is narrowed to the two kept slugs. One new item lists this unit's open calls.
- **Comment-only changes beyond F12:** stale comments in the files this unit rewrote were brought up to date (the service routes, pricing, the visuals, the gate's lookaround note).

## Verification

Headless Chrome over the DevTools protocol against `next start` production builds, reduced motion on, from scratch scripts kept outside the repo.

| Check | Result |
|---|---|
| Every surface at 360, 768, 1280, 1920 | 143 before-captures from `main`, 154 after (5 routes as scrolled tiles plus 12 modal states per width). Page heights grow where content was added (the agentic route +1,515 to +2,384px); the 404 is the same height. From the second question on, every 360 modal state is byte-identical to `main`, so the fallback refactor changed nothing in the modal |
| Built HTML and RSC (41 files) | No "Internal Tool", "AI Workflow Integration", "Product Completion", "Product Support", "Down from", "$5,000", "$7,998", "$6,998" or "from idea to production". The remaining case-insensitive hits are Part B's own words ("a new product built from scratch", "We stay. Every month…") and a script attribute (`strategy`) |
| Em dashes | None in the visible text of any route (there were 22 on `main`). Every em dash in a line this unit added sits in a code comment (#19 exempts them) |
| Preselects, modal stubbed | 17 CTAs: home cards `agentic` / `new_product`; tiers `agentic` / `new_product`; all six agentic-route CTAs `agentic`; all five product-route CTAs `new_product`; home hero and Final CTA nothing, as before. The door shows exactly the two options |
| Both doors, stubbed | Qualifier → success; quick door → failure fallback on a stubbed 500; off-ramp → its capture and success. Payloads keep their keys and order |
| Waitlist, at 1280 and 360 | Success: `{kind:"waitlist", email, _hp:"", _t≥3000}` sent, confirmation shown and focused. Stubbed 500: the fallback with the email preserved, mailto `?body=Your%20email%0A…`; Back returns to the field, focused, value kept. Under 3s: nothing sent, the fallback shown |
| The real route, Sheet webhook pointed at a local recorder | waitlist → 200 and the row above; too fast, honeypot, no email, bad email, unknown kind → 400; quick door with both offerings → `project_type: "Agentic system integration; AI product development"`; qualifier `rescue` → "Finishing a product someone else started" |
| Links and anchors | 30 internal hrefs on the four routes, every one 200, every anchor present. `/services/agentic-system#internal-tool` and `#ai-workflow-integration` open the page at the top with no error. An unknown path returns 404 |
| Hero at 1024×768, contrast | The two tables above |
| Console | Only the known local noise (the Vercel insights 404, the Apollo pixel 400) and the stubbed 500 |

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ (the same six routes) · `npm run banned-terms` ✓ (56 files). The gate passes with "AI automation" in the copy and fails (exit 1) on a planted "Book a Call".

**Not verified:** the Resend branch (no key locally, so the waitlist alert and the skipped auto-reply are typechecked, not sent); Asana (no token); real Safari, Firefox, iOS and Android (Chromium only here); production.

## Out of scope, noted

- Restyling visuals (Brief 2), About and the team (Brief 3), new SEO pages and schema, build-note 34's F2 to F11, the unmerged case-study branches, and the modal and email em dashes this unit did not touch.
- The Messaging Kit and Brand Philosophy are out of date and outside the repo; Rule 4.1 now says the copy traces to #53 to #59.
