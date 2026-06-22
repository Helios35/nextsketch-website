# Build Note 14 — Inbound-Leads Sheet Script (Sprint 02 · Unit 06)

**Date:** 2026-06-22 · **Branch:** `feature/leads-sheet-script` · **Sprint 02 (Lead Capture) Unit 06 — follow-on; unblocks the Sheet destination.**
**Status:** Committed and pushed to `origin/feature/leads-sheet-script`; **no PR** (owner policy — Nate opens the PR after he verifies). The script's *logic* is verified offline; the **live `/exec` deploy + a real row are owner actions** (the agent can't touch Nate's Google account) — see *Open for Nate*. Nothing was faked.

## The gap this closes

The lead pipeline (Unit 02) already POSTs every captured lead to a Google Apps Script web-app at `LEADS_SHEET_WEBHOOK_URL` and **gates capture success on that write** (`writeLeadToSheet`, `src/lib/lead-delivery.ts`). That script never existed — so the one credential that gates capture couldn't be produced and the site couldn't go live. This unit delivers the script, paste-ready, plus a committed reference copy.

## What shipped

- **New:** `scripts/inbound-leads.gs` — the committed reference copy of the Apps Script. **Byte-identical** to the paste-ready block below.
- It receives the exact lead JSON the site sends, appends it as one row to the bound "Inbound Leads" spreadsheet, neutralizes formula injection on write, and returns the success/failure response the site's caller expects.
- **No app code changed** — the script matches the site, not the other way around (brief scope guardrail). `lint` ✓ and `tsc --noEmit` ✓ stayed green (a `.gs` file is outside both tools' surface; nothing in `src/` moved).

## The contract (traced from the site — this is what the script matches)

- **Request:** `POST`, body = `JSON.stringify(toSheetRecord(payload, capturedAt))` from `src/lib/lead-format.ts`. That is a flat object with these **11 keys, in this order** — which is the script's column order:

  `timestamp · lead_type · signal · name · email · company · project_type · readiness · authority · validation · details`

  Both doors send the same 11 keys: the quick door simply leaves the qualifier columns (`company`, `readiness`, `authority`, `validation`) empty and writes its multi-select needs as a `"; "`-joined list into `project_type`. So the column mapping never branches.
- **Success:** `writeLeadToSheet` treats **any 2xx as success and never reads the body**. The script appends the row **first**, then returns `200 {ok:true}` — so a 200 genuinely means the row is written. **No fake success.**
- **Failure:** any error (empty/malformed body, lock timeout, a Sheets write that throws) is allowed to propagate, so Apps Script returns a **non-2xx**. The site then reports not-ok and the modal preserves the visitor's answers (Business Rule 2.7). The script **never** catches-and-returns-200, which would manufacture a false success for a lead that was *not* saved.

> Why a thrown error reaches the site as non-2xx even through the Apps Script 302 redirect: `doPost` runs and (on success) appends the row on the initial POST; the redirect just fetches the already-computed output, so `fetch` (which follows redirects by default) sees the 200. If `doPost` throws, Apps Script returns a 500 with no redirect — `response.ok` is false. This matches exactly the 200/500 mock contract Unit 02 was verified against (build-note 10).

## Exact column order (left → right)

| Col | Header | Record key | Qualified | Quick door |
|-----|--------|-----------|-----------|-----------|
| A | Captured At | `timestamp` | ISO timestamp | ISO timestamp |
| B | Lead Type | `lead_type` | `qualified` / `flagged` | `quick` / `exploring` |
| C | Signal | `signal` | `[Lead]` / `[Lead — …]` | `[Lead — quick]` / `[Lead — exploring]` |
| D | Name | `name` | ✔ | ✔ |
| E | Email | `email` | ✔ | ✔ |
| F | Company | `company` | ✔ (optional) | *(empty)* |
| G | Project / Needs | `project_type` | single answer label | `"; "`-joined needs |
| H | Readiness | `readiness` | answer label | *(empty)* |
| I | Authority | `authority` | answer label | *(empty)* |
| J | Validation | `validation` | answer label | *(empty)* |
| K | Details | `details` | ✔ (optional) | optional one-liner |

Header row is created once on a blank sheet and frozen; values are the display labels the modal showed (the site resolves enums → labels in `toSheetRecord`), so the row reads the way the visitor saw it.

## Decisions / judgment calls

- **Formula-injection neutralization = apostrophe prefix on write.** Any cell value whose first character is `= + - @` (or a tab/CR) is stored with a leading single quote (`sanitizeCell`). It can therefore never be parsed as a live formula. Chosen over "format the columns as plain text" (build-note 10 offered both) because it is **value-level and deterministic** — it travels with the data and doesn't depend on a column's number-format being preserved across edits/sorts/paste. *Residual:* if a value's apostrophe is shown rather than consumed, the cell reads e.g. `'=evil` — still inert, and a visible-tampering tell is acceptable (arguably desirable). Applied uniformly to every cell; system fields (`timestamp`, `lead_type`, `signal`) never start with a risky char, so they're untouched.
- **Append is serialized with `LockService` (`waitLock` 15s).** Two concurrent captures can't clobber a row or double-write the header. If the lock can't be acquired, `waitLock` throws → not-ok → the visitor keeps their answers — strictly better than a lost/corrupted row. Cheap insurance even on a low-traffic site.
- **`appendRow`, not `getLastRow` + `setValues`.** `appendRow` writes a new last row atomically, sidestepping a read-then-write race on the row index entirely.
- **Bound to the active spreadsheet; no Sheet ID/URL hardcoded** (brief guardrail). `getLeadsSheet` uses the first tab by default; set the `TAB_NAME` constant to target a specific tab if the leads ever share a workbook.
- **Added a harmless `doGet` liveness reply** (`{ok:true, note:…}`) so Nate can paste the `/exec` URL into a browser to confirm the deploy without sending a fake lead. It writes no row.

## Deviation (flag for the Sprint 03 doc audit — not fixed now)

- `docs/07-technical-spec.md` still describes "leads exist only as emails" (pre-pivot). The Sheet-as-system-of-record reality was already flagged for the Sprint 03 audit in build-note 10; this script is the owner-side half of that integration. No new deviation beyond what Unit 02 already raised — recorded here so the Sheet mechanism travels with the audit.

## Verification (builder, offline)

Apps Script is V8 JavaScript, so the script's logic was exercised in Node against fake `SpreadsheetApp` / `LockService` / `ContentService` hosts, using the **exact 11-key record shape** the site POSTs (the `toSheetRecord` contract). **All 7 checks passed:**

1. `COLUMNS` key order **===** the `toSheetRecord` key order (11 fields, aligned).
2. A POST writes a frozen header row + a correctly-ordered data row; injection payloads in `name` (`=HYPERLINK…`), `company` (`+1…`), `details` (`@SUM…`) all land apostrophe-prefixed (inert); non-risky values untouched; returns `{ok:true}`.
3. Quick-door row: qualifier columns empty, needs joined into `project_type`, a leading-`-` value neutralized.
4. A missing optional key → empty cell (no `undefined`, no throw).
5. **No fake success:** a simulated Sheets write failure **throws** (→ non-2xx), never a 200.
6. Malformed JSON and an empty body both **throw** (→ non-2xx).
7. `doGet` returns the liveness reply and writes no row.

What could **not** be verified here: a real row in Nate's real Sheet via a deployed `/exec` URL — that needs his Google account (Unit 05 / deploy-smoke covers the live end-to-end once the URL is set). The request shape, column order, success/failure behavior, and injection safety are all proven against the contract.

## Open for Nate — deploy the script & set the env var

1. Open the **Inbound Leads** Google Sheet → **Extensions → Apps Script**.
2. Delete the default `Code.gs` contents and paste the script below (or the contents of `scripts/inbound-leads.gs` — they're identical). Save.
3. **Deploy → New deployment** → type **Web app**.
   - **Execute as:** *Me*.
   - **Who has access:** *Anyone* (the site posts unauthenticated; "Anyone" — not "Anyone with Google account").
   - Deploy, authorize the scopes when prompted.
4. Copy the **Web app URL** (ends in `/exec`). That value is `LEADS_SHEET_WEBHOOK_URL`.
5. Set it in **Vercel** env (Production **and** Preview) and local `.env.local`. **This is the credential that gates capture — set it first** (build-note 10, Unit 02).
6. *(Optional sanity check)* open the `/exec` URL in a browser — you should see `{"ok":true,"note":"Inbound Leads webhook is live…"}`. The first real lead through the site (or the Unit 05 smoke) writes the header + first row.

If you'd rather target a specific tab (e.g. the leads sheet has multiple tabs), set the `TAB_NAME` constant at the top of the script to that tab's name before deploying.

## Paste-ready script

```js
/**
 * Inbound Leads — Google Apps Script web app (NextSketch · Sprint 02 Unit 06)
 *
 * Receives one captured lead as JSON from the site's lead pipeline and
 * appends it as a row to the bound "Inbound Leads" spreadsheet. This is
 * the script behind LEADS_SHEET_WEBHOOK_URL — the credential that gates
 * capture (build-note 10, Unit 02).
 *
 * THE SCRIPT MATCHES THE SITE — not the other way around.
 *
 *   • Request:  POST, body = JSON.stringify(toSheetRecord(...)) from
 *     src/lib/lead-format.ts — a flat object with these keys, in order:
 *       timestamp, lead_type, signal, name, email, company,
 *       project_type, readiness, authority, validation, details
 *     (src/lib/lead-delivery.ts → writeLeadToSheet POSTs exactly this).
 *   • Success: the caller (writeLeadToSheet) treats ANY 2xx as success
 *     and never reads the body. We append the row first, THEN return 200,
 *     so a 200 means the row is durably written — no fake success.
 *   • Failure: any error is allowed to throw, so Apps Script returns a
 *     non-2xx and the site reports not-ok → the visitor keeps their
 *     answers (Business Rule 2.7). We never catch-and-return-200, which
 *     would manufacture a false success for a lead that was NOT saved.
 *
 * Bound script: writes to the spreadsheet it is pasted into
 * (SpreadsheetApp.getActiveSpreadsheet) — no Sheet ID or URL is hardcoded.
 *
 * Security: lead-supplied text whose first character is = + - @ (or a
 * tab/CR) is prefixed with a single quote so a cell can never execute as
 * a spreadsheet formula — the injection risk flagged in build-note 10.
 */

// Optional: target a specific tab by name. Leave "" to use the first tab
// of the bound spreadsheet (the common single-tab "Inbound Leads" sheet).
const TAB_NAME = "";

// Column order + human headers. `key` is the exact key the site sends
// (toSheetRecord); the order here IS the sheet's left-to-right column
// order. Keep this aligned to toSheetRecord — if the site's record
// changes shape, this is what moves (and gets flagged), never the site.
const COLUMNS = [
  { key: "timestamp", header: "Captured At" },
  { key: "lead_type", header: "Lead Type" },
  { key: "signal", header: "Signal" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "company", header: "Company" },
  { key: "project_type", header: "Project / Needs" },
  { key: "readiness", header: "Readiness" },
  { key: "authority", header: "Authority" },
  { key: "validation", header: "Validation" },
  { key: "details", header: "Details" },
];

// Max time to wait for the write lock before giving up (→ throw → not-ok).
const LOCK_TIMEOUT_MS = 15000;

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    // No body to record — fail loudly so the site reports not-ok rather
    // than silently 200-ing an empty capture.
    throw new Error("inbound-leads: empty POST body");
  }

  // Malformed JSON throws here → non-2xx → site reports not-ok.
  const data = JSON.parse(e.postData.contents);

  // Serialize writes so two concurrent captures can't clobber a row or
  // double-write the header. If the lock can't be taken, waitLock throws
  // → not-ok (the site preserves the visitor's answers — far better than
  // a lost or corrupted row).
  const lock = LockService.getScriptLock();
  lock.waitLock(LOCK_TIMEOUT_MS);
  try {
    appendLeadRow(data);
  } finally {
    lock.releaseLock();
  }

  // Reached only if the append did not throw → the row is written.
  return jsonOutput({ ok: true });
}

// A GET is not part of the lead contract; provide a harmless liveness
// reply so the deploy URL can be sanity-checked in a browser. Never
// writes a row.
function doGet() {
  return jsonOutput({
    ok: true,
    note: "Inbound Leads webhook is live. POST a lead JSON to append a row.",
  });
}

function appendLeadRow(data) {
  const sheet = getLeadsSheet();

  // Create the header row once, on a blank sheet, and freeze it.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map((column) => column.header));
    sheet.setFrozenRows(1);
  }

  const row = COLUMNS.map((column) => sanitizeCell(data[column.key]));
  // appendRow atomically writes a new last row; a write failure throws
  // and propagates → the site reports not-ok (no fake success).
  sheet.appendRow(row);
}

function getLeadsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (TAB_NAME) {
    const named = spreadsheet.getSheetByName(TAB_NAME);
    if (named) return named;
  }
  return spreadsheet.getSheets()[0];
}

// Neutralize spreadsheet formula injection: a value whose first character
// is = + - @ (or a tab/CR that some tools coerce the same way) is stored
// as inert text by prefixing a single quote. Everything else passes
// through unchanged. null/undefined become an empty cell.
function sanitizeCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) return "'" + text;
  return text;
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
```

## References

- `src/lib/lead-delivery.ts` (`writeLeadToSheet` — the request + 2xx-success contract) · `src/lib/lead-format.ts` (`toSheetRecord` — the 11-key payload shape)
- `briefs/build-notes/10-lead-destination.md` (Unit 02 — design rationale + the formula-injection note this closes)
- `scripts/inbound-leads.gs` (the committed copy, byte-identical to the block above)
