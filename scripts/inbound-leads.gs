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
