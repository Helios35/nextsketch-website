# Build Note 39: Email-first form (adhoc)

**Date:** 2026-10-21 · **Branch:** `adhoc/email-first-form` · **Base:** `main` @ `94732c2` (PR #46 merged)
**Status:** COMPLETE, committed on the branch, no PR (Nate opens it). The modal opens on an email and the two offerings, and sending that saves the lead. Everything else moves to an optional step 2 that fills in the same Sheet row. All four gates green. **Before merge, Nate deploys the updated Apps Script** (below); nothing else on his side changes.
**Follows:** build-note 38. **Decisions:** **#65** appended. Next free row **#66**, next build note **40**.
**Brief:** "Adhoc Unit: Email-first form" (Nate, 2026-10-21; Brief 1 of 2, Brief 2 is `adhoc/asha-team`). The Apps Script change was brought back before any code, as the brief required, and Nate approved option A the same day, with the builder's recommendations on the other calls.

---

## Pre-flight

**Traced:** `qualification-modal.tsx` → `submitQualification` (`src/lib/qualify.ts`) → `POST /api/qualify` → `deliverLead` (Sheet gates success, Asana best-effort) → `notifyLead` (auto-reply + Nate's alert, via `after()`), and `scripts/inbound-leads.gs` behind the Sheet webhook.

**Gaps found before building** (brought back with the recommendation):

1. **The Apps Script only appends** and drops any key it has no column for; the Sheet had no ID column. Step 2 had no way to find step 1's row, so "one visitor, one lead" needed a script change (the blocker).
2. **Asana is a lead consumer the brief didn't list.** Step 1 opens a task, but task creation is still not working live (decision log, "Still open").
3. **The nav doesn't open the modal.** Its featured button links to `/pricing`. The doors are the hero and final CTAs (no preselect), the two Services cards, the two pricing tiers, and on each service route its hero CTA, its block CTAs and its close.
4. **Step 1 never asks a name now**, so every auto-reply is nameless, and the alert subject and Asana title used the name.
5. **`exploring` was UI-only**: the schema refused it by design. Recording it (Outcome 6) makes it a stored value.
6. **Copy the brief froze that now reads oddly:** the step 1 auto-reply ("Your message is in front of Nathan", a two-business-day promise) and the contact heading ("Last step — where do we reach you?") over a screen with no email field.

**Before-captures** (`main` @ `94732c2`, `next start`, headless Chrome over CDP, reduced motion): all 9 modal screens (quick door, Q1–Q4, contact, off-ramp, success, failure) at 360, 768, 1280 and 1920. They are kept in the session scratchpad with the after-captures, not committed.

## What shipped

- **Step 1** (`screen: "quick"`): the unchanged heading, Part B's body, the email field, "What do you need?" as the two offering boxes (at least one, both fine), Back (closes) and "Talk to Us". No name, no message, no side door.
  - **No box checked:** the send is held back. "Pick at least one." shows under the boxes in `destructive` (about 4.5:1 on `card`), is tied to the group with `aria-describedby`, is announced as an alert, and focus moves to the first box. Checking a box clears it.
  - **Missing or malformed email:** held back by the browser's own validation.
  - **On success:** the server returns a `lead_id` and the modal moves straight to step 2.
- **Step 2:** the four questions, then name, company and "tell us about it", with the same text and answers.
  - **Every field is optional:** Next is always enabled, and an unanswered question is passed over.
  - **First screen:** Part B's heading and body sit above Q1, and Q1's question steps down to a subheading that labels the radio group. From Q2 on, the question is the heading again.
  - **Navigation:** no Back on the first step 2 screen; Back everywhere after it.
  - **"Skip for now"** is in the header, left of the close control, on every step 2 screen.
- **Ending step 2.** The final submit, Skip, or a still-exploring Next all send whatever step 2 collected, as one `followup`. If nothing was collected, nothing is sent.
  - **Endings:** success, or the off-ramp's message if an answer was "still exploring". The off-ramp is terminal, with Close.
  - **Failure:** the Rule 2.7 fallback with every answer, step 1's included, and Back returns to the screen that sent.
- **Retired:**
  - **Flow:** the side door "Rather walk us through it?", the off-ramp's "Stay in Touch" capture and its confirmation screen.
  - **Copy (deleted, git keeps it):** `MODAL_QUICK.toQualifier`, `MODAL_OFF_RAMP.capture`, `MODAL_OFF_RAMP_SUCCESS`, and the qualifier and exploring auto-replies (`LEAD_AUTOREPLY`, `LEAD_AUTOREPLY_EXPLORING`). The one auto-reply now goes out on step 1, before any answer exists.
- **Every door still preselects** through `initialNeed`; the provider and triggers are untouched.

## How step 2 attaches to the step 1 lead

1. **Step 1:** `POST /api/qualify` with `{ kind: "quick", source: "quick_door", email, project_types (≥1), _hp, _t }`. The route mints `crypto.randomUUID()`, `deliverLead` writes the row with that ID in the new `lead_id` key, the route answers `{ ok: true, lead_id }`, and `after()` sends the auto-reply and Nate's alert.
2. **Step 2:** `POST /api/qualify` with `{ kind: "followup", lead_id, email, project_types, …answers given, _hp, _t }`. At least one answer must be present.
   - **The update:** `updateLead` posts `toSheetUpdate`, which is `{ action: "update", lead_id, email, fields }`. `fields` holds only what step 2 collected, as display labels, plus the recomputed `lead_type` and `signal`. A Q1 answer is written after the step 1 offerings in the one project column ("AI product development; Finishing a product someone else started"), which is why the follow-up repeats step 1's offerings.
   - **What the script does:** finds the row whose Lead ID **and** Email match, writes each field into its column, never writes the timestamp, email or Lead ID, and answers `{ ok: true, updated: true }`.
   - **What the site accepts:** success only on that exact reply. A pre-#65 script would answer a plain `{ ok: true }` after appending the update as a stray row, and that must not pass as success.
   - **After a confirmed update:** `after(() => notifyFollowup(payload))` sends Nate one alert. No Asana call, no auto-reply.
3. **Who can update a row:** only someone holding the random ID from step 1's response, together with the email it was saved under. A guessed or replayed ID with another email is refused by the script (503 to the browser). Updates overwrite, so a retry after a timeout is harmless.

## The Sheet and Apps Script change, and what Nate must do

**`scripts/inbound-leads.gs`:**

- **New column:** **Lead ID**. It's found by its header text, not its position. On a Sheet made before #65, the first append adds it after the last used column (column L on the standard eleven-column sheet).
  - No existing row or column moves, and old rows keep a blank Lead ID.
  - If Nate has added columns of his own on the right, Lead ID goes after them, and a new row leaves his cells empty.
- **New branch:** `action: "update"`. It finds the row with a `TextFinder` on the Lead ID column and checks the Email cell (case-insensitive, ignoring the formula-guard apostrophe). It then writes each field through the same formula-injection guard as an append, never touching the timestamp, email or Lead ID. It throws if the ID or email doesn't match, or if `fields` is missing.
- **Unchanged:** appends from the current site still work. Rows without a `lead_id` get a blank cell.

**Nate's one action, before this merges:**

1. Open the bound script.
2. Paste the whole new file over the old one and save.
3. **Deploy → Manage deployments → the existing Web app → Edit → Version: New version → Deploy.** Editing the existing deployment keeps the `/exec` URL, so `LEADS_SHEET_WEBHOOK_URL` and Vercel stay as they are.
4. Optionally, open the URL in a browser for the liveness reply.

**Order matters:** if the site goes live first, step 1 still saves, but every step 2 reports failure and the old script leaves a stray half-empty row per attempt. That case was reproduced locally (see Verification). It's written up in the runbook, along with its failure-mode row.

## Signal labels (Rule 2.5, Outcome 7)

`[Lead — quick]` now always means **step 1 only**. When step 2 adds anything, the row's `lead_type` and `signal` are recomputed. The first match wins:

| Step 2 answers | `lead_type` | Signal |
|---|---|---|
| Q1 or Q2 "still exploring" | `exploring` | `[Lead — exploring]` |
| Q3 `none` and Q4 `build_first` | `flagged` | `[Lead — review answers]` |
| Q3 `none` | `flagged` | `[Lead — needs buy-in]` |
| Q4 `build_first` | `flagged` | `[Lead — build-first mindset]` |
| all four answered, no flag | `qualified` | `[Lead]` |
| anything else (a question passed over, or only contact fields) | `partial` (new) | `[Lead — partial]` (new) |

**The emails:**

- **Step 1 alert:** subject `[Lead — quick] <email> — <offerings>`; the body carries the email, the Lead ID and the offerings.
- **Follow-up alert:** subject `<recomputed label> <email> (follow-up)`; the body opens with "More from a lead already in the Sheet. Same Lead ID, same row.", then the email, the Lead ID and only what step 2 added.

## A missing name (Outcome 8)

- **Sheet:** step 1 writes an empty name cell; step 2 fills it if the visitor gives one.
- **Alert:** subject and body use the email, with no name line.
- **Asana:** the task is titled `[Lead — quick] <email> — <offerings>`. Its notes carry the email, the Lead ID, the offerings, and a line saying further answers land on the row with that ID and in a follow-up alert.
- **Auto-reply:** always opens "Hi there,", since step 1 never has a name.

## Files

- **Changed:**
  - **Capture code:** `src/lib/schema.ts` (`quick` = step 1, `followup` = step 2, `EXPLORING` and the answer enums exported; `qualified` and `off_ramp` removed), `src/app/api/qualify/route.ts`, `src/lib/qualify.ts` (`leadId` on the result), `src/lib/lead-delivery.ts` (`updateLead`, a shared `postToSheet`), `src/lib/lead-format.ts` (`toSheetUpdate`, `followupAnswers`, the labels above), `src/lib/lead-notify.ts` (`notifyFollowup`, one alert renderer for text and HTML), `scripts/inbound-leads.gs`.
  - **Modal and copy:** `src/components/qualification-modal.tsx`, `src/content/modal.ts` (`MODAL_STEP2`, `MODAL_QUICK.body` and `needsRequired`, retirements), `src/content/email.ts` (`greeting: "Hi there,"`, `leadIdLabel`, `LEAD_FOLLOWUP_ALERT`).
  - **Comments only:** `src/content/services.ts` and `src/content/work.ts`, which cited the retired "Stay in Touch" carve-out.
- **Docs:** `docs/05-business-rules.md` (§1 intro, 1.5–1.7, 2.1, 2.2, 2.4, 2.5, 2.7, 2.8, 3.1, 4.4, E1, glossary, open question closed), `06-taxonomy.md` (§3, §4, §9), `07-technical-spec.md`, `04-ux-spec.md`, `02-prd.md`, `03-site-architecture.md`, `01-vision.md`, `08-runbook.md` (smoke test, script redeploy, failure mode), `decision-log.md` (#65, preamble, Still open). `scope-lock-mvp.md` is a dated June snapshot and was left as it is, as #53 left it.

## Builder calls (each comes back to Nate)

1. **Part B's step 2 heading and body sit on the Q1 screen**, above the question, not on an intro screen of their own (one less click).
2. **No Back on step 2's first screen**, because step 1 is already sent (Rule 1.6 amended).
3. **Skip sits in the header**, beside the close control. Back, Skip and Next don't fit in one row at 360px, and the header never scrolls away. The meter's segments narrow below `sm:` (`w-5`) to make room.
4. **Skip after some answers saves them** (one follow-up alert), then shows success. Closing with the × keeps the lead and drops only what wasn't sent.
5. **The off-ramp ending is terminal** (Close only), like success. E1 still holds: changing Q1 to exploring routes there, and answers left past it from an earlier pass are not sent.
6. **Q1 goes in the one project column after the step 1 offerings**, rather than in a new column. That keeps the Sheet change to one column.
7. **The follow-up repeats step 1's email and offerings.** The email lets the script check the row; the offerings let the server compose the project cell.
8. **Step 2 doesn't touch Asana.** Commenting on the task would need its ID carried through the browser. The task's notes point at the Sheet row instead.
9. **`[Lead — partial]` / `partial`** is a new label and type, so `[Lead]` keeps meaning "all four answered".
10. **Builder DRAFT copy:** "Pick at least one.", "Hi there,", and the follow-up alert's intro and "(follow-up)" tag. None has an em dash.

## Deviations from the brief

- **The nav is listed as a door; it isn't one.** Every door that exists was checked (17 across four routes).
- **The brief doesn't list Asana as a consumer.** Step 1 still opens the task; step 2 leaves it alone (call 8).
- **The payload contract moved.** `kind: "qualified"` became `kind: "followup"` with every answer optional, and `source: "off_ramp"` retired. **No stored value moved**: Sheet labels, enum values and old rows are as they were.
- **Copy beyond Part B:** the four DRAFT strings in call 10. The retired copy objects were deleted rather than left dormant.
- **Contact heading and step 1 auto-reply body are unchanged**, as the brief froze them, even though they now read oddly (Pre-flight 6).

## Verification

**Gates:** `lint` ✓ · `typecheck` ✓ · `next build` ✓ · `banned-terms` ✓ (57 files).

**Apps Script, offline:** the real `.gs` was run in Node against an in-memory sheet that mimics the `SpreadsheetApp` calls it makes. 8 checks pass:

- a blank sheet gets 12 headers and frozen row 1;
- a pre-#65 sheet gains Lead ID in L with no data moved;
- an update fills only the matching row and ignores timestamp, email and Lead ID in `fields`;
- update values go through the formula guard;
- a wrong email, an unknown ID or missing `fields` all throw and write nothing;
- an update on a sheet with no Lead ID column throws and adds no column;
- an owner-added column at L is kept and Lead ID goes to M;
- waitlist rows append with a blank ID.

**End to end, on the real API:** `next start` from this branch, with `LEADS_SHEET_WEBHOOK_URL` pointed at a local server running the **real `.gs`**. That sheet started as a pre-#65 one with an old row. `RESEND_BASE_URL` pointed at a local recorder, so the real `lead-notify` code built and "sent" every email. Driven in headless Chrome:

| Brief check | Result |
|---|---|
| Email + one box, submit, close | ✓ one row (`quick`, `[Lead — quick]`, empty name, Lead ID), Nate's alert and the auto-reply ("Hi there,") |
| Email + both boxes, all of step 2 | ✓ still one row with every answer (`qualified`, `[Lead]`, both offerings + Q1 in one cell), one follow-up alert `[Lead] b@example.com (follow-up)` carrying the same Lead ID, one auto-reply in total |
| Email + box, then Skip | ✓ success screen, one row, no update sent, no follow-up alert |
| Skip after two answers | ✓ saved as `[Lead — partial]`, one follow-up alert |
| Step 2 "I'm still exploring" | ✓ recorded (`exploring`, `[Lead — exploring]`, "…; I'm still exploring"), off-ramp message, Close only. Also via Q2 "Just exploring" after Back from Q4 (E1): Q3's earlier answer is not sent |
| No box / invalid email | ✓ both held back, nothing sent; the message appears, is described, takes focus and clears on a check |
| Failure fallback | ✓ step 1 with the Sheet down: fallback with email + offering in the list and the mailto; Back, then a retry, saves. Step 2 down: fallback with every answer; Back returns to the sending screen |
| Honeypot / minimum time | ✓ the client refuses both with no request. Direct POSTs: honeypot, sub-3s, no box, bad email, `off_ramp` source and the old `qualified` kind → 400; a follow-up for an unknown lead → 503 |
| No-JS | ✓ every CTA is a `mailto:` anchor in the server HTML (Rule E3, unchanged) |
| Every door preselects | ✓ 17 doors on `/`, `/pricing` and both service routes: the hero and final CTAs check nothing (as on `main`), the agentic card, tier and route CTAs check `agentic`, and the product ones check `new_product`. None shows a name field or the side door |
| Keyboard only | ✓ Enter on the hero CTA opens step 1 with focus on its heading → Tab to email → a box → Talk to Us. With no box, focus lands on the first box; Space checks it; Enter sends → focus on "Got it. Want to tell us more?" → arrows choose, Tab reaches Next → Shift+Tab reaches Close, then Skip → Enter → success heading focused → Escape closes |
| Screen reader | ✓ (accessibility tree): the dialog is named by each screen's heading; on Q1 the radio group is named by the question subheading; the offerings group carries "Pick at least one." as its description; Skip and Close are named buttons |
| Deploy order | ✓ with the **old** script: step 1 saves; step 2 shows the failure fallback (no fake success) and the old script leaves a stray row. Hence "script first" |

**After-captures:** 11 screens × 4 widths. No header overflow at any width, including Skip, the meter and the close control at 360. On Q1 the Next button sits **about 50px below the modal's fold at 360×780 and 1280×832**, so it needs a short scroll; it's in view at 768 and 1920, and Skip is in view everywhere. That's the cost of call 1; an intro screen of its own would remove it.

**Not verified:**

- Google's runtime: real `TextFinder` / `getLastColumn` behaviour, and the HTTP status Apps Script returns on a thrown error. For updates the site doesn't rely on the status, since it requires the explicit reply.
- Real Resend delivery, and Asana (still not live).
- A real screen reader (accessibility tree only).
- Safari and iOS.

## Out of scope, noted

- The waitlist band (only its shared imports were kept intact), analytics, question text and answers, and the Asha team card (Brief 2).
