# Build Note 10 — Lead Destination (Sprint 02 · Unit 02)

**Date:** 2026-06-18 · **Branch:** `feature/lead-destination` · **Sprint 02 (Lead Capture) Unit 02.**
**Status:** Committed and pushed to `origin/feature/lead-destination`; **no PR** (per owner policy — Nate opens the PR after he verifies). Feature-branch push = Vercel **preview** deploy only; production is `main`.
**Blocked-but-shipped:** the owner-provided credentials don't exist yet (sprint plan setup checklist is unchecked), so this is built fully against the seam and flagged back — see *Open for Nate*. No credentials were invented and no placeholder destination can fake success.

## What changed

Filled the Unit 01 hand-off seam (`deliverLead`, previously hardcoded `false`) with the real durable destinations. A validated lead is now recorded to the **Google Sheet "Inbound Leads"** (the durable system of record — the row Nate scans) **and** opens a task in the **Asana "Inbound Leads" project** (the action item Nate works) — sprint plan Decision 2. Success (`ok:true`) is now gated on the durable Sheet write, so the modal's success screen is finally honest. **Units 01 + 02 together close the leak.**

The Unit 01 `{ ok }` contract and the route were preserved — the modal's success / failure / preserve-answers behavior (Rule 2.7) needed no change. The route handler's comments were the only edit there (the "until Unit 02" framing was now historical).

## Files

- **New:** `src/lib/lead-format.ts` — pure formatting (no I/O, no env). Resolves payload values to their canonical display labels by reading `MODAL_QUESTIONS` (the single label↔value source, Taxonomy §3) so Sheet/Asana wording can't drift from the modal; computes the Rule 2.5 signal flag + Taxonomy §4 lead type; builds the Sheet record and the Asana task title+notes. Reusable by Unit 03 for the email subject/body.
- **Modified:** `src/lib/lead-delivery.ts` — `deliverLead` now stamps an ISO `capturedAt`, attempts both destinations via `Promise.allSettled` (one throwing can't short-circuit the other), gates success on the Sheet, logs partial outcomes, returns the Sheet verdict. Two private helpers: `writeLeadToSheet` (POST to the Apps Script webhook) and `createAsanaTask` (POST to the Asana REST API). All identifiers/secrets from `process.env`.
- **Modified:** `src/app/api/qualify/route.ts` — comment-only; reflects that the destination is now wired (no logic change; still maps `deliverLead`'s boolean → `{ ok }`, `200`/`503`).
- **Modified:** `docs/07-technical-spec.md` — two ⚠️ flag notes (integrations + env vars) for the **Sprint 03 doc audit** per the brief. Not a rewrite of the stale doc.

## Decisions / judgment calls

- **Resiliency: the Sheet gates success; Asana is best-effort (the brief asked us to pick + surface).** A capture reports `ok:true` only once the durable Sheet row is written. Asana is attempted on every capture, but a failed/unconfigured Asana is logged and never fails the capture.
  - *Why this best honors "never lose a lead":* the gate is the single durable system of record, so **every reported success is genuinely, durably recorded**, and a flaky Asana can never manufacture a *false failure* for a lead that was actually saved (which would needlessly push a captured visitor to the escape hatch or a duplicate retry).
  - *Alternative A — both must succeed:* rejected. It raises the false-failure rate (any one destination flaking shows failure on an already-captured lead) and is the worst for conversion + duplicates.
  - *Alternative C — at-least-one succeeds:* rejected. The brief framed the choice as "both" vs "one durable / one best-effort," and at-least-one means a "success" might live only in Asana while Nate scans the Sheet — no single guaranteed record.
  - *Accepted trade-off:* if the Sheet write fails but Asana succeeds, the capture reports not-ok (correct — answers preserved); a retry can then create a **duplicate Asana task**. A duplicate task is far cheaper than a lost lead; Asana is best-effort and Nate can dedupe. No dedup logic added (out of scope, and there's no server-side store — owner decision).
- **Google Sheet via an Apps Script web-app webhook, not a service account.** A single `fetch` POST of the formatted record to an owner-provided webhook URL. Chosen over `googleapis` + a service-account key because it adds **no dependency** and is the **smallest diff** (governing rule), and it matches one of the two options the sprint plan setup checklist already offers. The owner's bound script appends the row and must answer 2xx on success.
- **Asana via the REST API.** `POST https://app.asana.com/api/1.0/tasks` with a Bearer token, body `{ data: { name, notes, projects: [projectId] } }`. No dependency added.
- **Labels, not raw enums, in the Sheet/Asana** — so the row/task read the way the modal did (`"No — I'd need buy-in"`, not `none`). Labels are pulled from the canonical map, not re-typed, so they stay tied to the snake_case payload values (Taxonomy §3: "payload values are the stored values; never invent alternates").
- **No fake success while unconfigured.** With `LEADS_SHEET_WEBHOOK_URL` unset, `writeLeadToSheet` logs and returns `false` → capture reports not-ok. This is the same honest failure-fallback as the Unit 01 interim state, now produced by the real delivery path. **Consequence to know:** until the *Sheet* webhook is configured, captures report not-ok even if Asana is wired (Asana alone is not the system of record).
- **Hardening from the adversarial review pass.** Two confirmed findings, both addressed in-code (see Verification):
  - *Bounded outbound timeouts* via `AbortSignal.timeout` — Sheet 10s (gates success; Apps Script can be slow to wake), Asana 8s (best-effort, bounded tighter). A hung destination can no longer hold the serverless function open to its platform limit; a timeout resolves not-ok for the Sheet (answers preserved) and best-effort-false for Asana. **Residual:** the two calls run concurrently (`allSettled`), so a slow-but-not-failed Asana can still add up to its 8s bound to the capture response. Acceptable on a low-traffic site; if it ever bites, move the Asana call to `next/server`'s `after()` to fully decouple it from the response.
  - *Sanitized error logging* — rejected-promise reasons are logged as `name: message` (helper `errMsg`), never the raw thrown object, so no `cause` chain can carry sensitive detail into the Vercel logs (secrets rule). Practical leak risk from `fetch` errors was already near-zero, but the invariant is explicit and the fix is trivial.

## Deviations from the stale spec (flagged for Sprint 03 doc audit — not fixed now)

1. **§API "Does" + §Data model are pre-pivot.** The spec still describes the endpoint *building and sending the lead email via Resend* as the single action and "leads exist only as emails." Sprint 02 re-architected this: the durable record is the Google Sheet + Asana (this unit); the email is Unit 03 notification, not the record. Flagged in the tech-spec integrations + env sections.
2. **New env vars.** `LEADS_SHEET_WEBHOOK_URL`, `ASANA_ACCESS_TOKEN`, `ASANA_PROJECT_ID` (all server-only, no `NEXT_PUBLIC_`). The spec's env table lists only `RESEND_API_KEY` / `NOTIFY_EMAIL`. Flagged.
3. **Google Sheets formula-injection consideration.** A lead field beginning with `= + - @` could be interpreted as a formula when appended to a Sheet. The safe mitigation lives on the **owner's Apps Script side** (format the lead columns as plain text, or prefix risky values) since that code controls how the cell is written. Recorded here so it travels to the owner's Sheet setup; see *Open for Nate*.

## Verification

- **Gates (local):** `lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (route still `ƒ /api/qualify`, dynamic) · `banned-terms` ✓ (26 files; the new `src/lib` files are not a copy surface and contain no banned terms).
- **Endpoint, destination UNCONFIGURED (no env):** valid qualified → `503 {ok:false}` (**no fake success** — the real delivery path ran, found no webhook, returned false honestly) · off-ramp `project_type:"exploring"` → `400` · tripped honeypot → `400` · `_t:500` too-fast → `400` · missing email → `400`. Server logged the honest "LEADS_SHEET_WEBHOOK_URL not set" + "ASANA … not set" lines; no 500/crash.
- **Endpoint, Sheet CONFIGURED against a local mock (Asana left unset):**
  - mock returns `200` → endpoint `200 {ok:true}` (**durable capture gates success**). The mock received the exact formatted row: ISO `timestamp`, `lead_type:"flagged"`, `signal:"[Lead — review answers]"` (a needs-buy-in + build-first lead), contact fields, and the four answers as **display labels** (`"Agentic systems for my product or operations"`, `"Within 1–3 months"`, `"No — I'd need buy-in"`, `"I just want it built"`). With Asana unset, the capture still succeeded → **Asana is genuinely best-effort**; logs showed "lead recorded in Sheet but Asana task NOT created — lead is safe, action item missing."
  - mock returns `500` (forced destination failure) → endpoint `503 {ok:false}` (**not-ok, answers preserved, no fake success**); log "Sheet webhook responded 500."
- **Adversarial review pass:** ran a 12-agent review of the diff across four lenses (no-fake-success/never-lose-a-lead, Next.js 16/server, security, scope/reuse), each finding independently verified. 8 findings, 2 confirmed and fixed (the timeouts + sanitized logging above); the rest dismissed on verification (e.g. response-body consumption is a non-issue on serverless/undici streaming; the Asana token is never logged and embedding it in the `Authorization` header is unavoidable). A Google-Sheets formula-injection note was surfaced and is carried to the owner's Apps Script setup (deviation §3) — verified the payload transmits attacker text faithfully as a JSON string, so the cell-write layer is the correct place to neutralize it.
- **Re-verified after the fixes:** gates green again, and the mock end-to-end re-run still gave `200 {ok:true}` (success), the correct formatted row, and `503 {ok:false}` (forced failure) — no regression from the timeout/logging edits.
- **What could NOT be verified here:** a real row in the real Google Sheet and a real Asana task — both require the owner's credentials, which don't exist yet. The gating, formatting, request shapes, and failure behavior are all proven against the mock; the live end-to-end is Unit 05 (deploy-smoke) once the keys are set. Test scaffolding (a temp mock + a gitignored `.env.local`) was removed after the run.

## Open for Nate

1. **Credentials (the real critical path — owner setup checklist).** Provide and set in Vercel (prod + preview) and local `.env.local`:
   - `LEADS_SHEET_WEBHOOK_URL` — the Apps Script web-app URL bound to the "Inbound Leads" Sheet that appends a row from the POSTed JSON (returns 2xx on success). **Gates capture success — set this first.** When you build the script, format the lead columns as plain text (or prefix `= + - @`) to neutralize spreadsheet formula injection (deviation §3).
   - `ASANA_ACCESS_TOKEN` + `ASANA_PROJECT_ID` — for the "Inbound Leads" project task (best-effort).
2. **Resiliency confirmation.** Confirm the chosen model (Sheet gates success, Asana best-effort) is what you want, incl. the accepted duplicate-Asana-task-on-retry trade-off.
3. **Sheet mechanism.** I chose the Apps Script webhook over a service account (smallest diff, no dependency). If you'd rather use a service account + `googleapis`, say so — it's a different env var and one added dependency.
4. **Branch pushed, no PR** — `feature/lead-destination` is on origin (preview deploy only; production is `main`). Open the PR when you've verified. Per Decision 6 this merges before Unit 03 starts.
