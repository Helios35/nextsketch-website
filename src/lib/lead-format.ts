import { MODAL_QUESTIONS, MODAL_QUICK } from "@/content/modal";
import {
  EXPLORING,
  type FollowupPayload,
  type LeadPayload,
  type NewEntryPayload,
  type QuickLeadPayload,
} from "@/lib/schema";

/**
 * Lead formatting (Sprint 02 Unit 02; extended Unit 04; email-first
 * since decision-log #65) — turns a validated payload into the
 * human-readable shapes the durable destinations record: one Google
 * Sheet row, the update that enriches it, and one Asana task. Pure: no
 * I/O, no env, no secrets — so it stays easy to reason about and the
 * notify module reuses `leadSignal` and the labels without forking the
 * destination code.
 *
 * A lead arrives in up to two parts (#65). Step 1 (`kind: "quick"`, the
 * name, email and offerings) appends the row, carrying the `lead_id` the
 * server minted, with the qualifier columns empty. Step 2 (`kind:
 * "followup"`) never appends: `toSheetUpdate` fills that same row's
 * answer columns and recomputes its signal. The waitlist band (#58) is
 * a third kind and not a lead: it fills the same columns with an email,
 * `lead_type: waitlist` and its own `[Waitlist]` label, and never becomes
 * an Asana task (owner direction, 2026-10-15).
 *
 * Answer labels are read straight from `MODAL_QUESTIONS` (the canonical
 * label↔value map, docs/06-taxonomy.md §3) — never re-typed here, so
 * the Sheet/Asana wording can't drift from what the modal showed the
 * visitor. Taxonomy §3 says payload values are the stored values; we
 * keep that value↔label tie rather than inventing alternates.
 */

/**
 * Resolve a payload value to its canonical display label (Taxonomy §3).
 * Exported so the notify module builds the alert email body from the
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

/**
 * The step 1 offerings as the short labels the visitor saw (Sprint 03
 * adhoc), joined for the single Sheet `project_type` cell, the Asana
 * task and the alerts.
 */
export function quickNeeds(values: readonly string[]): string {
  return values
    .map((value) => labelFor(MODAL_QUICK.needsOptions, value))
    .join("; ");
}

/**
 * The visitor's two names joined, as the Sheet's one Name column, the
 * alerts and the Asana task show them (#65, amended 2026-10-21).
 */
export function fullName(payload: {
  first_name: string;
  last_name: string;
}): string {
  return `${payload.first_name} ${payload.last_name}`.trim();
}

/** The four qualifier questions, in modal order (Business Rules §1). */
export const QUESTION_ORDER = [
  "project_type",
  "readiness",
  "authority",
  "validation",
] as const;

/** The step 2 answers given, as question/answer label pairs, in order. */
export function followupAnswers(
  payload: FollowupPayload,
): { question: string; answer: string }[] {
  return QUESTION_ORDER.flatMap((key) => {
    const value = payload[key];
    return value === undefined
      ? []
      : [
          {
            question: MODAL_QUESTIONS[key].question,
            answer: labelFor(MODAL_QUESTIONS[key].options, value),
          },
        ];
  });
}

export type LeadType =
  | "qualified"
  | "flagged"
  | "partial"
  | "quick"
  | "exploring"
  | "waitlist";

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
 * The waitlist band's signal label (decision-log #58). Deliberately not
 * a `[Lead …]` label: a waitlist entry is interest in a product that
 * does not exist yet, and the brief asks that Nate can tell it from a
 * lead at a glance in the Sheet and the alert subject.
 */
export const WAITLIST_SIGNAL = "[Waitlist]";

/**
 * Rule 2.5 signal-flag logic + Taxonomy §4 lead type. The label is what
 * tells Nate how far a lead got (#65, Outcome 7):
 *
 *   • step 1 only: `[Lead — quick]`, the label the answer-less quick
 *     door always had;
 *   • step 2 answered: recomputed from the answers, first match wins:
 *     `[Lead — exploring]` (Q1 or Q2 "still exploring", Rule 2.1), then
 *     the Rule 2.5 flags (`[Lead — review answers]`, `[Lead — needs
 *     buy-in]`, `[Lead — build-first mindset]`), then `[Lead]` when all
 *     four questions are answered, and `[Lead — partial]` when any was
 *     skipped.
 *
 * So `[Lead — quick]` always means step 1 only, and any other `[Lead …]`
 * label means step 2 added something.
 */
export function leadSignal(payload: LeadPayload): LeadSignal {
  if (payload.kind === "waitlist") {
    return {
      type: "waitlist",
      needsBuyIn: false,
      buildFirst: false,
      label: WAITLIST_SIGNAL,
    };
  }

  if (payload.kind === "quick") {
    return {
      type: "quick",
      needsBuyIn: false,
      buildFirst: false,
      label: "[Lead — quick]",
    };
  }

  const needsBuyIn = payload.authority === "none";
  const buildFirst = payload.validation === "build_first";

  if (payload.project_type === EXPLORING || payload.readiness === EXPLORING) {
    return { type: "exploring", needsBuyIn, buildFirst, label: "[Lead — exploring]" };
  }
  if (needsBuyIn || buildFirst) {
    let label = "[Lead — build-first mindset]";
    if (needsBuyIn && buildFirst) label = "[Lead — review answers]";
    else if (needsBuyIn) label = "[Lead — needs buy-in]";
    return { type: "flagged", needsBuyIn, buildFirst, label };
  }
  const allAnswered = QUESTION_ORDER.every((key) => payload[key] !== undefined);
  return allAnswered
    ? { type: "qualified", needsBuyIn, buildFirst, label: "[Lead]" }
    : { type: "partial", needsBuyIn, buildFirst, label: "[Lead — partial]" };
}

/**
 * The flat, human-scannable record appended as one "Inbound Leads"
 * Sheet row. Keys are stable so the owner's Apps Script maps them to
 * columns; labels (not raw enum values) are used so the row reads the
 * way the modal did. `capturedAt` is an ISO timestamp stamped at
 * delivery time (kept out of this pure module). `leadId` is the ID step
 * 2 finds the row by (#65); a waitlist entry has none.
 */
export function toSheetRecord(
  payload: NewEntryPayload,
  capturedAt: string,
  leadId: string,
): Record<string, string> {
  const signal = leadSignal(payload);
  // Same twelve columns for every kind, so the Apps Script mapping never
  // branches: step 1 leaves the company and the qualifier columns empty
  // for step 2 to fill; a waitlist entry is an email and its label.
  return {
    timestamp: capturedAt,
    lead_type: signal.type,
    signal: signal.label,
    name: payload.kind === "quick" ? fullName(payload) : "",
    email: payload.email,
    company: "",
    project_type:
      payload.kind === "quick" ? quickNeeds(payload.project_types) : "",
    readiness: "",
    authority: "",
    validation: "",
    details: "",
    lead_id: leadId,
  };
}

/**
 * The update a step 2 follow-up sends the Sheet (#65): find the row by
 * `lead_id` (the email must match it too) and set `fields` on it. Only
 * what the visitor gave is in `fields`, plus the recomputed signal, so a
 * skipped question leaves its cell as step 1 wrote it (empty). A Q1
 * answer goes in the one project column after the step 1 offerings,
 * since the column holds both. The name is step 1's and is never sent
 * here. The script never lets an update touch the row's timestamp,
 * email or lead ID.
 */
export function toSheetUpdate(payload: FollowupPayload): {
  action: "update";
  lead_id: string;
  email: string;
  fields: Record<string, string>;
} {
  const signal = leadSignal(payload);
  const fields: Record<string, string> = {
    lead_type: signal.type,
    signal: signal.label,
  };
  if (payload.project_type !== undefined) {
    fields.project_type = [
      quickNeeds(payload.project_types),
      labelFor(MODAL_QUESTIONS.project_type.options, payload.project_type),
    ].join("; ");
  }
  for (const key of ["readiness", "authority", "validation"] as const) {
    const value = payload[key];
    if (value !== undefined) {
      fields[key] = labelFor(MODAL_QUESTIONS[key].options, value);
    }
  }
  for (const key of ["company", "details"] as const) {
    const value = payload[key];
    if (value !== undefined) fields[key] = value;
  }
  return {
    action: "update",
    lead_id: payload.lead_id,
    email: payload.email,
    fields,
  };
}

/**
 * The Asana task for one step 1 lead: a scannable title carrying the
 * signal and the name, and notes with the contact details, the
 * offerings, the lead ID and the capture timestamp. Step 2
 * does not touch the task; its answers land on the Sheet row with the
 * same lead ID and in Nate's follow-up alert, and the notes say so.
 */
export function toAsanaTask(
  payload: QuickLeadPayload,
  capturedAt: string,
  leadId: string,
): { name: string; notes: string } {
  const signal = leadSignal(payload);
  const needs = quickNeeds(payload.project_types);
  const notes = [
    `Captured: ${capturedAt}`,
    "",
    `Name:    ${fullName(payload)}`,
    `Email:   ${payload.email}`,
    `Lead ID: ${leadId}`,
    "",
    `Looking for: ${needs}`,
    "",
    "Any more answers land on the Sheet row with this Lead ID, and in a follow-up alert.",
  ].join("\n");
  return { name: `${signal.label} ${fullName(payload)} — ${needs}`, notes };
}
