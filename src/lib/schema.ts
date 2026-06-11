import { z } from "zod";

/**
 * Qualification modal payload — the de-facto data contract
 * (docs/07-technical-spec.md §Data model). Shared client/server.
 *
 * "exploring" answers for project_type and readiness are UI-only:
 * they route to the off-ramp (Business Rules 2.1) and never submit,
 * so they are deliberately absent from these enums. The server
 * re-validating with this schema is what makes the off-ramp
 * impossible to bypass by direct POST.
 */
export const qualificationPayloadSchema = z.object({
  project_type: z.enum(["new_product", "rescue", "agentic", "partnership"]),
  readiness: z.enum(["now", "soon"]),
  authority: z.enum(["full", "shared", "none"]),
  validation: z.enum(["validated", "willing", "build_first"]),
  name: z.string().trim().min(1).max(100),
  email: z.email(),
  company: z.string().trim().max(100).optional(),
  details: z.string().trim().max(1000).optional(),
  /** Honeypot (Business Rules 2.8): absent or empty, anything else rejects. */
  _hp: z.literal("").optional(),
  /** Milliseconds since modal open (Business Rules 2.8): sub-3s completions reject. */
  _t: z.number().int().min(3000),
});

export type QualificationPayload = z.infer<typeof qualificationPayloadSchema>;
