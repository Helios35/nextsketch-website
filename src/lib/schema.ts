import { z } from "zod";

/**
 * Lead payloads — the de-facto data contract (docs/07-technical-spec.md
 * §Data model). Shared client/server.
 *
 * Sprint 02 Unit 04 added a second door, so a lead is now a discriminated
 * union on `kind`:
 *   • "qualified" — the full four-question qualifier (Business Rules §1).
 *   • "quick"     — the low-friction door: name + email + an optional
 *     one-line message, no qualifier answers. `source` records which
 *     low-friction entry it came from (the primary quick path or the
 *     off-ramp capture offered to an "exploring" visitor).
 *
 * The server re-validating with these schemas (POST /api/qualify) is what
 * keeps the guards un-bypassable by a direct POST:
 *   - "exploring" answers for project_type/readiness are UI-only — they
 *     route to the off-ramp (Business Rules 2.1) and are deliberately
 *     absent from the qualified enums, so they never submit.
 *   - the honeypot (`_hp`) and minimum-time (`_t`) anti-bot guards
 *     (Business Rules 2.8) sit on BOTH doors.
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

/** Contact + anti-bot guards every door shares (Business Rules 1.5, 2.8). */
const leadContact = {
  name: z.string().trim().min(1).max(100),
  email: z.email(),
  /** Honeypot (Business Rules 2.8): absent or empty, anything else rejects. */
  _hp: z.literal("").optional(),
  /** Milliseconds since modal open (Business Rules 2.8): sub-3s completions reject. */
  _t: z.number().int().min(3000),
};

/** The full four-question qualifier (Business Rules §1). */
export const qualificationPayloadSchema = z.object({
  kind: z.literal("qualified"),
  project_type: z.enum(PROJECT_TYPE_VALUES),
  readiness: z.enum(["now", "soon"]),
  authority: z.enum(["full", "shared", "none"]),
  validation: z.enum(["validated", "willing", "build_first"]),
  ...leadContact,
  company: z.string().trim().max(100).optional(),
  details: z.string().trim().max(1000).optional(),
});

/**
 * The quick door (Sprint 02 Unit 04). `source` separates the two
 * low-friction entries that share this shape: the primary quick path and
 * the off-ramp capture offered to an "exploring" visitor (Business Rules
 * 2.1–2.2). `details` is the optional free-text line; it reuses the
 * qualifier's `details` field so it lands in the same Sheet column.
 */
export const quickLeadPayloadSchema = z.object({
  kind: z.literal("quick"),
  source: z.enum(["quick_door", "off_ramp"]),
  ...leadContact,
  /**
   * Quick door's optional multi-select "what do you need" categories
   * (adhoc Sprint 03): zero or more canonical project types. The visitor
   * can combine them (e.g. a new product *with* an agentic system).
   * Absent for the off-ramp capture, which collects only name + email.
   */
  project_types: z.array(z.enum(PROJECT_TYPE_VALUES)).optional(),
  details: z.string().trim().max(1000).optional(),
});

/**
 * Either door — the contract the endpoint and the delivery seam validate
 * against. Discriminated on `kind` so the right shape is enforced and a
 * direct POST can't smuggle qualifier answers past the quick guards (or
 * vice versa).
 */
export const leadPayloadSchema = z.discriminatedUnion("kind", [
  qualificationPayloadSchema,
  quickLeadPayloadSchema,
]);

export type QualificationPayload = z.infer<typeof qualificationPayloadSchema>;
export type QuickLeadPayload = z.infer<typeof quickLeadPayloadSchema>;
export type LeadPayload = z.infer<typeof leadPayloadSchema>;
export type LeadSource = QuickLeadPayload["source"];
