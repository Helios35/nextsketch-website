import { MODAL_QUESTIONS } from "@/content/modal";
import type { QualificationPayload } from "@/lib/schema";

/**
 * Lead formatting (Sprint 02 Unit 02) — turns a validated
 * `QualificationPayload` into the human-readable shapes the durable
 * destinations record: one Google Sheet row and one Asana task. Pure:
 * no I/O, no env, no secrets — so it stays easy to reason about and
 * Unit 03 (notify) can reuse `leadSignal` for the email subject and
 * the same labels for the body without forking the destination code.
 *
 * Answer labels are read straight from `MODAL_QUESTIONS` (the canonical
 * label↔value map, docs/06-taxonomy.md §3) — never re-typed here, so
 * the Sheet/Asana wording can't drift from what the modal showed the
 * visitor. Taxonomy §3 says payload values are the stored values; we
 * keep that value↔label tie rather than inventing alternates.
 */

/**
 * Resolve a payload value to its canonical display label (Taxonomy §3).
 * Exported so Unit 03 (notify) builds the alert email body from the
 * same resolver the Sheet/Asana records use — the labels can't drift
 * across destinations because there is one resolver, one source.
 */
export function labelFor(
  options: readonly { readonly value: string; readonly label: string }[],
  value: string,
): string {
  // A schema-validated payload always has a matching option; fall back
  // to the raw value rather than throw — never lose a lead's answer.
  return options.find((option) => option.value === value)?.label ?? value;
}

export type LeadType = "qualified" | "flagged";

export interface LeadSignal {
  /** Taxonomy §4 lead type: `flagged` if any signal is set. */
  readonly type: LeadType;
  /** Q3 = "No — I'd need buy-in" (Rule 2.5). */
  readonly needsBuyIn: boolean;
  /** Q4 = "I just want it built" (Rule 2.5). */
  readonly buildFirst: boolean;
  /** The `[Lead …]` prefix (Rule 2.5), reused as the task/subject flag. */
  readonly label: string;
}

/**
 * Rule 2.5 signal-flag logic + Taxonomy §4 lead type. The `[Lead …]`
 * label is canonical (Rule 2.5 names these exact strings); Unit 03
 * reuses it as the email subject prefix.
 */
export function leadSignal(payload: QualificationPayload): LeadSignal {
  const needsBuyIn = payload.authority === "none";
  const buildFirst = payload.validation === "build_first";

  let label = "[Lead]";
  if (needsBuyIn && buildFirst) label = "[Lead — review answers]";
  else if (needsBuyIn) label = "[Lead — needs buy-in]";
  else if (buildFirst) label = "[Lead — build-first mindset]";

  return {
    type: needsBuyIn || buildFirst ? "flagged" : "qualified",
    needsBuyIn,
    buildFirst,
    label,
  };
}

/**
 * The flat, human-scannable record appended as one "Inbound Leads"
 * Sheet row. Keys are stable so the owner's Apps Script maps them to
 * columns; labels (not raw enum values) are used so the row reads the
 * way the modal did. `capturedAt` is an ISO timestamp stamped at
 * delivery time (kept out of this pure module).
 */
export function toSheetRecord(
  payload: QualificationPayload,
  capturedAt: string,
): Record<string, string> {
  const signal = leadSignal(payload);
  return {
    timestamp: capturedAt,
    lead_type: signal.type,
    signal: signal.label,
    name: payload.name,
    email: payload.email,
    company: payload.company ?? "",
    project_type: labelFor(MODAL_QUESTIONS.project_type.options, payload.project_type),
    readiness: labelFor(MODAL_QUESTIONS.readiness.options, payload.readiness),
    authority: labelFor(MODAL_QUESTIONS.authority.options, payload.authority),
    validation: labelFor(MODAL_QUESTIONS.validation.options, payload.validation),
    details: payload.details ?? "",
  };
}

/**
 * The Asana task for one captured lead: a scannable title carrying the
 * Rule 2.5 flag, and notes with every answer (labelled), contact
 * details, and the capture timestamp.
 */
export function toAsanaTask(
  payload: QualificationPayload,
  capturedAt: string,
): { name: string; notes: string } {
  const signal = leadSignal(payload);
  const projectType = labelFor(
    MODAL_QUESTIONS.project_type.options,
    payload.project_type,
  );
  const company = payload.company ? ` · ${payload.company}` : "";

  const name = `${signal.label} ${payload.name}${company} — ${projectType}`;
  const notes = [
    `Captured: ${capturedAt}`,
    "",
    `Name:    ${payload.name}`,
    `Email:   ${payload.email}`,
    `Company: ${payload.company ?? "—"}`,
    "",
    `Project type: ${projectType}`,
    `Readiness:    ${labelFor(MODAL_QUESTIONS.readiness.options, payload.readiness)}`,
    `Authority:    ${labelFor(MODAL_QUESTIONS.authority.options, payload.authority)}`,
    `Validation:   ${labelFor(MODAL_QUESTIONS.validation.options, payload.validation)}`,
    "",
    `Details: ${payload.details ?? "—"}`,
  ].join("\n");

  return { name, notes };
}
