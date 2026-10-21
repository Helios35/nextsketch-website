import { z } from "zod";

/**
 * Lead payloads — the de-facto data contract (docs/07-technical-spec.md
 * §Data model). Shared client/server.
 *
 * The modal is email-first (decision-log #65), so a lead arrives in up
 * to two parts, and a payload is a discriminated union on `kind`:
 *   • "quick"    — step 1: first name, last name, email and at least one
 *     of the two offerings, all required (owner amendment, 2026-10-21).
 *     This alone is the lead: it is recorded, alerted and auto-replied,
 *     and the server answers with the `lead_id` it minted for the row.
 *   • "followup" — step 2: the four qualifier questions, company and
 *     "tell us about it", every one optional, attached to the step 1
 *     lead by its `lead_id` (and its email). It updates that lead's Sheet
 *     row rather than adding one, and alerts Nate once more.
 *   • "waitlist" — the Services waitlist band (decision-log #58): an
 *     email and nothing else. Not a lead; it rides the same seam so it
 *     gets the same durable record, guards and failure fallback.
 *
 * The server re-validating with these schemas (POST /api/qualify) is what
 * keeps the guards un-bypassable by a direct POST: the honeypot (`_hp`)
 * and minimum-time (`_t`) anti-bot guards (Business Rules 2.8) sit on
 * every kind.
 *
 * Before #65 the qualifier was its own kind (`"qualified"`, with a
 * required single name and every answer required) and "exploring" was a UI-only
 * value the schema refused. Step 2 now carries the qualifier's answers,
 * and "I'm still exploring" / "Just exploring" are recorded on the lead
 * (Rule 2.1), so `exploring` is a stored value of Q1 and Q2.
 */

/**
 * Canonical project_type values (docs/06-taxonomy.md §3). Shared so the
 * qualifier's single-select answer and the quick door's multi-select
 * `project_types` enumerate from one source and can't drift.
 */
export const PROJECT_TYPE_VALUES = [
  "new_product",
  "rescue",
  "agentic",
  "partnership",
] as const;

/**
 * The canonical project type as a type — so the service cards can name
 * the need their CTA preselects without re-declaring the union.
 */
export type ProjectType = (typeof PROJECT_TYPE_VALUES)[number];

/** Q1 and Q2's off-ramp answer (Rule 2.1), stored on a step 2 lead (#65). */
export const EXPLORING = "exploring";

/** Q2–Q4 answer values (docs/06-taxonomy.md §3). */
export const READINESS_VALUES = ["now", "soon"] as const;
export const AUTHORITY_VALUES = ["full", "shared", "none"] as const;
export const VALIDATION_VALUES = ["validated", "willing", "build_first"] as const;

/** Anti-bot guards every entry carries (Business Rules 2.8). */
const botGuards = {
  /** Honeypot (Business Rules 2.8): absent or empty, anything else rejects. */
  _hp: z.literal("").optional(),
  /**
   * Milliseconds since the form was shown — the modal opening, or the
   * waitlist band mounting (Business Rules 2.8): sub-3s completions
   * reject.
   */
  _t: z.number().int().min(3000),
};

/**
 * The offerings a visitor checked on step 1 (Rule 1.7): at least one,
 * and both is fine. The schema accepts all four canonical values; the
 * door shows two.
 */
const projectTypes = z.array(z.enum(PROJECT_TYPE_VALUES)).min(1);

/**
 * Step 1's name, as two required fields (#65, amended 2026-10-21). The
 * Sheet keeps its one Name column: the record joins them ("Jane Doe").
 */
const visitorName = {
  first_name: z.string().trim().min(1).max(50),
  last_name: z.string().trim().min(1).max(50),
};

/**
 * Step 1, the quick door (Rule 1.7): first name, last name, email and at
 * least one offering, all required.
 */
export const quickLeadPayloadSchema = z.object({
  kind: z.literal("quick"),
  /**
   * The door the lead came through. One door is left: the off-ramp's own
   * capture (`off_ramp`) retired with #65, since step 1 already has the
   * email.
   */
  source: z.literal("quick_door"),
  ...visitorName,
  email: z.email(),
  project_types: projectTypes,
  ...botGuards,
});

/**
 * Step 2 (#65): every field optional, attached to the step 1 lead. The
 * `lead_id` is the random ID the server returned for step 1, and the
 * email must match the row's too, so a follow-up can only ever land on
 * the visitor's own lead. `project_types` repeats the step 1 picks so a
 * Q1 answer can be written beside them in the Sheet's one project
 * column, and the name repeats step 1's so Nate's follow-up alert can
 * say whose it is (the row's Name is never rewritten). A follow-up with
 * no answer in it is refused: the modal sends none, so a direct POST of
 * one is a probe.
 */
export const followupPayloadSchema = z
  .object({
    kind: z.literal("followup"),
    lead_id: z.uuid(),
    ...visitorName,
    email: z.email(),
    project_types: projectTypes,
    project_type: z.enum([...PROJECT_TYPE_VALUES, EXPLORING]).optional(),
    readiness: z.enum([...READINESS_VALUES, EXPLORING]).optional(),
    authority: z.enum(AUTHORITY_VALUES).optional(),
    validation: z.enum(VALIDATION_VALUES).optional(),
    company: z.string().trim().min(1).max(100).optional(),
    details: z.string().trim().min(1).max(1000).optional(),
    ...botGuards,
  })
  .refine(
    (payload) =>
      [
        payload.project_type,
        payload.readiness,
        payload.authority,
        payload.validation,
        payload.company,
        payload.details,
      ].some((value) => value !== undefined),
    { message: "a follow-up carries at least one answer" },
  );

/**
 * The waitlist band (decision-log #58): an email for the installable
 * product, and the same anti-bot guards as every door. No name, no
 * answers, no message.
 */
export const waitlistPayloadSchema = z.object({
  kind: z.literal("waitlist"),
  email: z.email(),
  ...botGuards,
});

/**
 * Every entry — the contract the endpoint and the delivery seam validate
 * against. Discriminated on `kind` so the right shape is enforced and a
 * direct POST can't smuggle one kind's fields past another's guards.
 */
export const leadPayloadSchema = z.discriminatedUnion("kind", [
  quickLeadPayloadSchema,
  followupPayloadSchema,
  waitlistPayloadSchema,
]);

export type QuickLeadPayload = z.infer<typeof quickLeadPayloadSchema>;
export type FollowupPayload = z.infer<typeof followupPayloadSchema>;
export type WaitlistPayload = z.infer<typeof waitlistPayloadSchema>;
export type LeadPayload = z.infer<typeof leadPayloadSchema>;
/** The two kinds that add a Sheet row (a follow-up updates one). */
export type NewEntryPayload = QuickLeadPayload | WaitlistPayload;
