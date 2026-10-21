/**
 * Inbound Leads — Google Apps Script web app (NextSketch · Sprint 02 Unit 06;
 * update action added by decision-log #65, the email-first modal)
 *
 * Receives one captured lead as JSON from the site's lead pipeline and
 * appends it as a row to the bound "Inbound Leads" spreadsheet, or, for a
 * step 2 follow-up, fills in the row an earlier append wrote. This is the
 * script behind LEADS_SHEET_WEBHOOK_URL — the credential that gates
 * capture (build-note 10, Unit 02).
 *
 * THE SCRIPT MATCHES THE SITE — not the other way around.
 *
 *   • Append (step 1 of the modal, and the waitlist band): POST, body =
 *     JSON.stringify(toSheetRecord(...)) from src/lib/lead-format.ts — a
 *     flat object with these keys, in order:
 *       timestamp, lead_type, signal, name, email, company,
 *       project_type, readiness, authority, validation, details, lead_id
 *     Reply: {ok:true}.
 *   • Update (step 2, #65): POST, body = JSON.stringify(toSheetUpdate(...))
 *     — {action:"update", lead_id, email, fields:{...}}. Finds the row
 *     whose Lead ID matches AND whose Email matches, and writes each key of
 *     `fields` into its column. It never touches the row's timestamp,
 *     email or lead ID. Reply: {ok:true, updated:true}. The site requires
 *     that exact reply for an update, so an older copy of this script
 *     (which would append the update as a new row) can never pass for one.
 *   • Success: we write first, THEN return, so a reply means the row is
 *     durably written — no fake success.
 *   • Failure: any error is allowed to throw, so the site reports not-ok
 *     → the visitor keeps their answers (Business Rule 2.7). We never
 *     catch-and-return-ok, which would manufacture a false success for a
 *     lead that was NOT saved. An update whose lead ID or email matches no
 *     row throws too.
 *
 * Bound script: writes to the spreadsheet it is pasted into
 * (SpreadsheetApp.getActiveSpreadsheet) — no Sheet ID or URL is hardcoded.
 *
 * Security: lead-supplied text whose first character is = + - @ (or a
 * tab/CR) is prefixed with a single quote so a cell can never execute as
 * a spreadsheet formula — the injection risk flagged in build-note 10.
 *
 * Deploying a change: paste this whole file over the old one, save, then
 * Deploy → Manage deployments → (the existing web app) → Edit → Version:
 * New version → Deploy. Editing the existing deployment keeps the /exec
 * URL, so LEADS_SHEET_WEBHOOK_URL does not change.
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

// The column an update finds its row by (#65). Not in COLUMNS: it is found
// by its header, wherever it sits, and added after the last used column
// the first time it is needed. A Sheet made before #65 therefore gains it
// on the right, and no existing row or column moves.
const LEAD_ID = { key: "lead_id", header: "Lead ID" };

// Keys an update may never write: the row's identity and capture time.
const PROTECTED_KEYS = ["timestamp", "email", "lead_id"];

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
  const isUpdate = data.action === "update";

  // Serialize writes so two concurrent captures can't clobber a row or
  // double-write the header. If the lock can't be taken, waitLock throws
  // → not-ok (the site preserves the visitor's answers — far better than
  // a lost or corrupted row).
  const lock = LockService.getScriptLock();
  lock.waitLock(LOCK_TIMEOUT_MS);
  try {
    if (isUpdate) {
      updateLeadRow(data);
    } else {
      appendLeadRow(data);
    }
  } finally {
    lock.releaseLock();
  }

  // Reached only if the write did not throw → the row is written.
  return jsonOutput(isUpdate ? { ok: true, updated: true } : { ok: true });
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
    sheet.appendRow(COLUMNS.map((column) => column.header).concat(LEAD_ID.header));
    sheet.setFrozenRows(1);
  }

  const row = COLUMNS.map((column) => sanitizeCell(data[column.key]));
  const idColumn = leadIdColumn(sheet, true);
  // Blank cells between the eleven columns and Lead ID, if the owner has
  // added columns of their own there (a new row has nothing to lose).
  while (row.length < idColumn - 1) row.push("");
  row[idColumn - 1] = sanitizeCell(data[LEAD_ID.key]);
  // appendRow atomically writes a new last row; a write failure throws
  // and propagates → the site reports not-ok (no fake success).
  sheet.appendRow(row);
}

function updateLeadRow(data) {
  if (!data.lead_id || !data.email || !data.fields) {
    throw new Error("inbound-leads: an update needs lead_id, email and fields");
  }
  const sheet = getLeadsSheet();
  const idColumn = leadIdColumn(sheet, false);
  const lastRow = sheet.getLastRow();
  if (idColumn === 0 || lastRow < 2) {
    throw new Error("inbound-leads: no row carries that lead_id");
  }

  const match = sheet
    .getRange(2, idColumn, lastRow - 1, 1)
    .createTextFinder(String(data.lead_id))
    .matchEntireCell(true)
    .findNext();
  if (!match) throw new Error("inbound-leads: no row carries that lead_id");
  const row = match.getRow();

  const emailColumn = columnOf("email");
  const stored = sheet.getRange(row, emailColumn).getValue();
  if (normalizeEmail(stored) !== normalizeEmail(data.email)) {
    throw new Error("inbound-leads: that lead_id belongs to another email");
  }

  COLUMNS.forEach((column, index) => {
    if (PROTECTED_KEYS.indexOf(column.key) !== -1) return;
    if (!Object.prototype.hasOwnProperty.call(data.fields, column.key)) return;
    sheet.getRange(row, index + 1).setValue(sanitizeCell(data.fields[column.key]));
  });
}

// 1-based column of the Lead ID header, or 0 if the sheet has none yet.
// With `create`, a missing header is written after the last used column.
function leadIdColumn(sheet, create) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn > 0) {
    const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    const index = headers.indexOf(LEAD_ID.header);
    if (index !== -1) return index + 1;
  }
  if (!create) return 0;
  const column = Math.max(lastColumn, COLUMNS.length) + 1;
  sheet.getRange(1, column).setValue(LEAD_ID.header);
  return column;
}

function columnOf(key) {
  return COLUMNS.findIndex((column) => column.key === key) + 1;
}

// Compare emails the way the cell stores them: the formula guard may have
// prefixed a quote, and case never distinguishes two addresses here.
function normalizeEmail(value) {
  return String(value).replace(/^'/, "").trim().toLowerCase();
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
