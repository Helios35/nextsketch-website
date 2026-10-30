# Build Note 43: Five Levels messaging (adhoc)

**Date:** 2026-10-30 · **Branch:** `adhoc/five-levels-messaging` · **Base:** `main` @ `7a579ed` (Brief 1, `adhoc/level-colors`, merged as PR #50)
**Status:** COMPLETE. The five levels of AI live in Services, on both service routes and on `/pricing`. The whole Services card links to its page. **Amended before merge (Nate, 2026-10-30):** the cards no longer open, and prices show on `/pricing` only (#73); see Owner changes before merge. Email triage is a morning sort, and internal tools sit under AI Product Development. All four gates green. No PR: Nate opens it.
**Decisions:** **#69** (the Five Levels, the doc as source), **#70** (whole-card link, superseding #30's name-only link), **#71** (email triage, a morning sort), **#72** (internal tools under AI Product Development), **#73** (prices on `/pricing` only, before merge). Next free row **#74**, next build note **44**.
**Brief:** "Adhoc Unit: Five Levels messaging" (Nate, 2026-10-29 and 2026-10-30), Brief 2 of 2. Source: "NextSketch Messaging: The 5 Levels of AI" (2026-10-29), read end to end from Nate's OneDrive (`__WORK/_SKETCH_MARKETING/`); it was not attached.

---

## Owner changes before merge (Nate, 2026-10-30)

Two changes, on this branch, nothing else.

1. **The Services cards do not open (#69, amended).** The levels panel is gone, with its hover, focus and touch states and its 200ms row animation. Each card is one flex column again (`flex h-full flex-col`, CTA on `mt-auto`, grid `gap-4`), exactly `main`'s structure, so the two-row subgrid that kept the CTAs still while a panel opened left with it. Each card keeps its two level marks and "Levels 2 and 3" (or "4 and 5"), the whole-card link (#70) and the offer tab. What each level means is still in the band above and on the service routes.
2. **Prices show on `/pricing` only (#73).** Removed: the home cards' price row ("$3,998 upfront | $2,998 a month", "$12,000 upfront | $10,000 a month") and each service route's hero price line. The `price` fields left `Service`, `ServicePageContent`, `SERVICES` and `SERVICE_PAGES`. `/pricing` is untouched, and `PRICES` stays the one place a figure lives, read now by `src/content/pricing.ts` alone.

**Left as they were, flagged:** the proof band's "Prices on the page" (home, under the hero) and the product route's "The same published price as a new build". Neither shows a figure.

**Verified** in headless Chrome against the pushed tip before the change (`cc99fac`, served from a `git archive` build on :3101):
- **Text:** the only lines gone are the four card prices, the panel's eight level lines ("means" and "Examples: …"), and the two hero price lines. Nothing was added. `/pricing` and the 404 lose nothing.
- **Layout, at 360, 768, 1280 and 1920:** every section on `/pricing`, the 404, the home page except Services, and the service routes except the hero matches the previous tip element for element (box, colour, type, text). Zero-size diagram connectors are compared by size only, since a zero-size box reports the viewport's corner. Inside Services, the heading, the levels band (70 elements) and the waitlist band (12) are identical, and the cards start at the same height. Inside each hero, the price line is the only thing gone, and the buttons row is identical, just higher (76px at 1280).
- **Cards, mouse at 768, 1280 and 1920, touch at 360 and 768:** nothing moves or grows on hover, on keyboard focus of the link or the CTA, or on touch. No `$` in either card. The two CTAs line up from 768. Build With Us opens the form with `agentic` or `new_product` ticked, and a click on the card body opens the right route.
- **Built HTML:** no published figure ($3,998, $2,998, $12,000, $10,000) outside `/pricing`. The agentic route's other dollar amounts are diagram sample data (#60), unchanged.
- **Gates:** lint ✓ · typecheck ✓ · build ✓ · banned-terms ✓ (58 files).

---

## Pre-flight: what disagreed with the doc

Every line on the cards, the service pages and `/pricing` was read against the doc. Two disagreed, and they are the only lines removed or rewritten:

| Where | Was | Now | Why |
|---|---|---|---|
| `/services/agentic-system`, Email triage | "An agent reads every email that comes in, sorts it, drafts the replies, and flags the few you actually need to look at." | "Every morning, an agent sorts the inbox, drafts the replies, and flags the few you actually need to look at." **DRAFT** | Read as always-on (Level 4); the doc and Nate call it a morning sort (Level 2), #71 |
| Every `ServiceCta`'s accessible name (cards and service rows) | "Build With Us — Agentic System Integration" | "Build With Us, Agentic System Integration" | The doc bans em and en dashes in copy, and a screen reader reads this aloud |

Already in line with the doc: no "Internal Tool" offer and no "$7,998" anywhere; offer names and prices are the site's. **Flagged, not changed (out of scope):** Work's "Every screen is built and designed by Next Sketch" (two words) and Work's four "— See More" card labels (em dashes); the form's "Within 1–3 months" (an en dash).

**Proof nothing else was removed:** the visible text and every accessible name and link of `/`, `/pricing` and both service routes were dumped from `main` and from the branch. The only `main` lines missing from the branch are the email-triage line and the nine dashed accessible names above.

## Where the levels landed

**The data** is `src/content/levels.ts`:
- `LEVELS`: number, name, line, means, examples and offer.
- `OFFER_LEVELS`: agentic 2 and 3, product 4 and 5.
- The surface strings.

Name, line and examples are the doc's, verbatim.

**The mark** is `LevelMark` (`level-mark.tsx`): Brief 1's level colour in the doc's shape.
- **Shapes:** Level 1 circle, 2 square, 3 triangle, 4 diamond, 5 hexagon.
- **Level 1 is the doc's outlier:** a hollow, dashed circle, with its text a step dimmer.
- **Size:** 14px by default and 16px in the band and the level cards. At 12px the hexagon read as a dot at 1x, so I raised it.
- **Never alone:** a mark always sits beside its level's number or name, and is `aria-hidden`.

### `/` Services

1. **The levels band** (`levels-band.tsx`) sits between the section heading and the cards, in the diagram language: `DiagramFrame` brackets around a dot-grid `card` canvas.
   - It is built from headings and lists, not a `role="img"` drawing, so every level is read aloud.
   - **Three groups:** Level 1 alone ("Not sold", "Where most businesses stop", with a dashed caption line); Levels 2 and 3 under the agentic offering's colour line and name; 4 and 5 under the product offering's.
   - **From 1024px** the five steps share a baseline and rise 2rem a level, like the doc's staircase. Below that the groups stack.
   - A dashed rule divides Level 1 from Level 2.
   - **"We start here"** over Level 2 is the band's one coral mark.
2. **Each card carries its levels:** under the subtitle, its two marks and "Levels 2 and 3" (or "4 and 5").
3. ~~**Each card opens up**~~: removed before merge (#69, amended). See Owner changes before merge.
4. **The whole card links to its page** (#70). See below.

### Both service routes

- **A levels section after the hero:**
  - Eyebrow "The 5 levels of AI in business".
  - The heading names the offering and its levels, with coral on "Levels 2 and 3" or "Levels 4 and 5".
  - Then an intro line, and one card per level: mark and "Level n", the name, the line, "What it means", and "Examples".
  - The product page's section names **internal tools** (Level 4) and its intro says NextSketch builds them (#72).
- **The agentic page's four example rows carry their level** beside the index: email triage and weekly reporting are Level 2, quoting and intake and document and data entry are Level 3. These come from the doc's examples. The tag stays muted, so a deep link's `:target` coral stays on the index.
- **The product page's three ways in carry no level.** Any of them can be Level 4 or 5.

### `/pricing`

Each tier, under its name, shows its two marks and one line:
- "Covers Levels 2 and 3: AI automations and integrating AI into your systems."
- "Covers Levels 4 and 5: internal tools and custom agentic systems."

The line sits inside the name's cell, so the seven-row subgrid and every price, term and monthly rule are untouched.

## How the cards opened (removed before merge)

As first built and pushed in `b567c7c`. Nate removed it before merge (#69, amended); this section is the record of what was there.

- **Hover:** `group-hover/card`, which only fires for pointers that can hover.
- **Keyboard focus:** `group-focus-within/card`. Tabbing to the card's link or to Build With Us opens it, and the first card's panel was measured open at both tab stops.
- **Touch screens:** `[@media(hover:none)]` keeps the panel open at rest.
  - A tap on the card opens its page, so a tap target of its own would compete with that.
  - So on phones and touch tablets the content is simply there, reachable without a gesture.
  - **This is a deviation from "reachable by tap" read literally.** Recommended: keep it. The alternative is a small "Show levels" toggle inside the card.
- **Motion:** the panel's row animates `grid-template-rows` 0fr → 1fr in 200ms, and reduced motion takes the transition away (base layer).
- **Screen readers:** the panel is clipped, not hidden, so a screen reader reads it open or closed. It holds no focusable or clickable element.
- **It opens below Build With Us,** and each card is a two-row subgrid (the `/pricing` tiers' device): row one is everything down to the CTA, row two is the panel. Two bugs in the first cut shaped this, both caught by the width sweep:
  - With the panel above the CTA, entering a card pushed Build With Us down out from under the pointer, so a click opened the page instead of the form (768).
  - With one flex column, the shorter product card's CTA sat on spare space the opening panel used up, so it jumped up (768, 1280, 1920).

  Now neither CTA moves while either card opens: 0px measured at 768, 1280 and 1920. The card beside an open one gains empty space below its CTA.

## The whole-card link (#70)

- **One link:** the offering's name is still the card's only link, so a screen reader hears the offering's name once. Its `::after` is stretched over the card, so a click anywhere opens the route.
- **Hover:** hovering anywhere turns the name coral, as hovering the name did.
- **Focus:** the focus ring moves to the card's edge.
- **Build With Us** sits above that layer (`relative z-10`).
- **Nothing eats a click:** the decorative rotated diamonds in the card (the index, the examples) and the offer tab are `pointer-events-none`. A rotated mark paints above the stretched link and would otherwise swallow a click.

## Verification

All in headless Chrome, `main` served from a `git archive` build, the branch on :3100.

**Before and after.** I took 20 full-page shots of each build (5 routes at 360, 768, 1280 and 1920), with LCD text on and off.
- **The 404** is byte-identical at every width.
- **Above the changes,** the pages differ only by 1–2/255 gradient dither (hero scrim, page glow).
- **Below the changes,** the service routes and `/pricing` are pixel-identical.
- **Home below Services** (Process, About, the final CTA, the footer) differs in pixels because Services grew by a fractional height and the text re-snaps. A layout fingerprint proves it's a shift, not a change: every element's box, text, colour and type, relative to its section, matches `main` at all four widths. The only exceptions are two About flip icons, 0.01px off at 360 from rounding.

**Mouse, keyboard and touch** (360 touch, 768 mouse, 768 touch, 1280, 1920, both cards):
- **Rest:** the panel is closed for a mouse, open on touch.
- **Hover and keyboard focus:** both open it.
- **Build With Us:** clicked where it sat at rest, with the pointer coming up from below the card, it opens the form with the right offer ticked (`agentic` or `new_product`).
- **Card body:** a real click on the description opens the right route.
- **Coverage:** every probed point inside both cards (6px by 12px grid) resolves to the card link or to Build With Us at all four widths.

**Every form door,** clicked on all four touched routes: all 17 open the modal, and every offer-specific door ticks its offering.

**Built HTML:**
- None of: "every email that comes in", "$7,998", "Internal Tool" (exact case), guarantee, 10x, revolutionary, magic, "Claude on a schedule", "Claude in your systems", "custom systems", "about 3k".
- "Next Sketch" appears only in the footer's legal name and in Work's flagged line.
- No dash in any touched line.

**Contrast:**

| Text or mark | Measured | Floor |
|---|---|---|
| Level marks (`level-1`…`level-5`) on `secondary`, `card`, `background` | 4.75 to 6.03:1 | 3:1 |
| Level 1's dashed stroke, at full `level-1` | 5.29:1 on `card` | 3:1 |
| "We start here", coral on the canvas fill | 5.63:1 on `card` | 4.5:1 |
| Muted text (lines, captions, examples) | 4.63:1 or better | 4.5:1 |

The muted-text figure covers `secondary` 4.63, `card` 4.96 and `background` 5.36.

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ · `npm run banned-terms` ✓ (58 files).

**Not checked:** Safari, Firefox, iOS and Android (Chromium only), a real screen reader (the accessibility names and roles were checked in the DOM), and a 2x screen.

## Every new or changed line

**From the doc, verbatim** (approved by the doc itself):
- **The five level names:** "Chatting with AI", "AI automations", "Integrating AI into your systems", "Internal tools", "Custom agentic systems".
- **Their lines and examples.**
- **The band's eyebrow:** "The 5 levels of AI in business".
- **Its headline:** "Where does your business sit?"
- **Its subline:** "Most businesses stop at Level 1. We help you climb."
- **Level 1's caption:** "Where most businesses stop".

**DRAFT, for Nate's yes or a change:**
- **"Not sold"** (the doc's table cell, used as a label) and **"We start here"**.
- **Labels:** "Level 1" to "Level 5", "Levels 2 and 3", "Levels 4 and 5", "What it means" and "Examples" ("Examples: …" left with the card panel).
- **What each level means:**
  1. "Someone on your team asks, every time. Nothing happens until a person presses go."
  2. "Nobody has to ask. It runs on a timer, and a person approves what it did."
  3. "It changes things inside your own tools (CRM, calendar, files, accounting), not just the text it writes."
  4. "Software your business owns, running in the cloud even when nobody is at a desk."
  5. "Your whole team uses it, and so do your own clients."
- **Agentic route:** "Agentic System Integration covers Levels 2 and 3." and "Most businesses stop at Level 1, chatting with AI. We take you further: first work that runs on its own schedule, then agents that work inside the tools you already use."
- **Product route:** "AI Product Development covers Levels 4 and 5." and "Past automations, the next step is software you own. We build internal tools with always-on agents, and custom agentic systems your team and your clients use."
- **`/pricing`:** "Covers Levels 2 and 3: AI automations and integrating AI into your systems." and "Covers Levels 4 and 5: internal tools and custom agentic systems."
- **Email triage:** "Every morning, an agent sorts the inbox, drafts the replies, and flags the few you actually need to look at."
- **Accessible names:** "Build With Us, <offering or example>"; "Level 1, not sold: where most businesses stop"; "Agentic System Integration: Levels 2 and 3"; "AI Product Development: Levels 4 and 5".

## Deviations and builder calls (each comes back to Nate)

1. ~~**Touch screens show the card's levels open**~~: moot, the cards no longer open.
2. **The doc's "you are here" is not used.** The band can't know where a visitor sits; the doc's approved "Where does your business sit?" asks instead, and Level 1 says "Where most businesses stop".
3. ~~**The Services cards are now two-row subgrids**~~: moot, they are one flex column again, as on `main`.
4. **The service routes' level cards carry no offer tab.** They're level surfaces, so the level mark identifies them; a green tab beside an olive hexagon would put two near-twin colours on one card.
5. **The `ServiceCta` dash fix reaches the service rows too.** It's one component.
6. **The doc is in the stack as `docs/five-levels-messaging.md`.** That's a word-for-word transcription with a short header: the source, its authority under Rule 4.1, and the offer-colour swap of #67. It's unnumbered, like `scope-lock-mvp.md`.
7. **Docs beyond the brief's list:** Taxonomy §5 and §8 (the tokens in use, the component names).
8. **The email-triage diagram is unchanged.** It already shows a batch (48 unread, then sorted).
9. **The doc's own open items:** this unit closes three of its four ("Add internal tools…", "Decide how the site describes email triage", "Put the 5 levels on the website"). The fourth, renaming the levels in the Automation Levels notes and the Short scripts, is outside the repo.
