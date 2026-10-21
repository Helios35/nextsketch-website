import type {
  AUTHORITY_VALUES,
  EXPLORING,
  ProjectType,
  READINESS_VALUES,
  VALIDATION_VALUES,
} from "@/lib/schema";

/**
 * Qualification modal copy and answer options.
 *
 * Question text per docs/05-business-rules.md §1; label→payload
 * mapping per docs/06-taxonomy.md §3 — builders never invent
 * alternate values. The questions are step 2 of the email-first modal
 * (decision-log #65): every one optional. "exploring" routes to the
 * off-ramp's ending (Rule 2.1) and, since #65, is recorded on the lead.
 */

export interface ModalOption<V extends string> {
  readonly value: V;
  readonly label: string;
}

type ProjectTypeValue = ProjectType | typeof EXPLORING;
type ReadinessValue = (typeof READINESS_VALUES)[number] | typeof EXPLORING;
type AuthorityValue = (typeof AUTHORITY_VALUES)[number];
type ValidationValue = (typeof VALIDATION_VALUES)[number];

export const MODAL_QUESTIONS = {
  project_type: {
    question: "What do you need built or improved?",
    /**
     * Two offerings, agentic first (decision-log #53). The stored
     * values are unchanged: `rescue` and `partnership` are now ways
     * into AI Product Development rather than offers of their own, and
     * the lead record keeps telling them apart. Labels are owner copy
     * (2026-10-15); "I'm still exploring" is unchanged.
     */
    options: [
      { value: "agentic", label: "AI agents for the work my business already does" },
      { value: "new_product", label: "A new product built from scratch" },
      { value: "rescue", label: "Finishing a product someone else started" },
      { value: "partnership", label: "Ongoing help with a live product" },
      { value: "exploring", label: "I'm still exploring" },
    ] as const satisfies readonly ModalOption<ProjectTypeValue>[],
  },
  readiness: {
    question: "When are you looking to start?",
    options: [
      { value: "now", label: "Ready now" },
      { value: "soon", label: "Within 1–3 months" },
      { value: "exploring", label: "Just exploring" },
    ] as const satisfies readonly ModalOption<ReadinessValue>[],
  },
  authority: {
    question: "Can you make the decision to move on this?",
    options: [
      { value: "full", label: "Yes, it's my call" },
      { value: "shared", label: "Shared decision" },
      { value: "none", label: "No — I'd need buy-in" },
    ] as const satisfies readonly ModalOption<AuthorityValue>[],
  },
  validation: {
    question: "Are you open to validating the idea before we build?",
    options: [
      { value: "validated", label: "Already validated" },
      { value: "willing", label: "Yes — that's why I'm here" },
      { value: "build_first", label: "I just want it built" },
    ] as const satisfies readonly ModalOption<ValidationValue>[],
  },
} as const;

/**
 * Contact step (Business Rules 1.5), the last screen of step 2. Since
 * #65 the email is step 1's, so this screen asks name, company and
 * "tell us about it", all optional; `email` keeps its label for the
 * failure fallback's summary and Nate's alert.
 */
export const MODAL_CONTACT = {
  fields: {
    name: { label: "Name", required: false },
    email: { label: "Email", required: true },
    company: { label: "Company", required: false },
    details: { label: "Tell us about it", required: false, maxLength: 1000 },
  },
  submit: "Let's See if We're a Fit",
} as const;

/**
 * Step 1, the quick door (Rule 1.7; email-first since decision-log #65):
 * an email and at least one of the two offerings, nothing else.
 * Submitting it saves the lead; everything else is step 2. Heading,
 * label, options and submit are unchanged; `body` is owner copy (#65).
 */
export const MODAL_QUICK = {
  heading: "Tell us what you need.",
  body: "The short version. Your email and what you need. We'll take it from there.",
  /** Label for the needs selector: at least one box, both is fine (#65). */
  messageLabel: "What do you need?",
  /**
   * Multi-select options replacing the free-text line (Sprint 03 adhoc).
   * Stored as `project_types` and written to the Sheet's existing
   * `project_type` column as a delimited list. At least one is required
   * since #65.
   *
   * **The two offerings, agentic first (decision-log #53).** Owner copy
   * (2026-10-15). The stored values are unchanged, so no lead data
   * migrates: Agentic System Integration stores as `agentic` and AI
   * Product Development as `new_product`. Product Completion and Product
   * Support left the door with their offers; `rescue` and `partnership`
   * stay in the schema, where the qualifier still sends them. The two
   * combine freely, so the mutual-exclusion rule the old pair needed
   * (new product against completion) is gone with it.
   */
  needsOptions: [
    { value: "agentic", label: "Agentic system integration" },
    { value: "new_product", label: "AI product development" },
  ],
  /**
   * Shown under the boxes when step 1 is sent with none checked. Builder
   * DRAFT pending owner approval (#65; Part B has no line for it).
   */
  needsRequired: "Pick at least one.",
  /** Submit CTA (Rule 3.1 set). */
  submit: "Talk to Us",
} as const;

/**
 * Step 2 (decision-log #65): shown once step 1 has saved the lead. The
 * heading and body sit above the first question; `skip` is on every
 * step 2 screen and lands on the success screen. Owner copy (#65).
 */
export const MODAL_STEP2 = {
  heading: "Got it. Want to tell us more?",
  body: "All optional. A few answers help us show up to the first call ready. Skip it and we'll still be in touch.",
  skip: "Skip for now",
} as const;

/**
 * A quick-door "What do you need?" value: one of the options above.
 * Every CTA that preselects a need is typed to this (`ModalTrigger`,
 * `ServiceCta`, `SERVICE_NEED`, `PRICING_NEED`), so a CTA can never
 * preselect an option the door does not show (decision-log #53).
 */
export type QuickNeed = (typeof MODAL_QUICK.needsOptions)[number]["value"];

/**
 * Escape hatch (Rule 2.6): visible at every step, always a plain
 * mailto — never a form.
 */
export const MODAL_ESCAPE_HATCH = {
  prompt: "Prefer email?",
  email: "hello@nextsketch.com",
} as const;

/**
 * Off-ramp (Rules 2.1–2.2): a success state for the business, not an
 * error state. Since #65 it is step 2's ending when a visitor answers
 * "I'm still exploring" or "Just exploring": the answer is already
 * recorded on the lead, so the off-ramp's own email capture ("Stay in
 * Touch") and its confirmation screen are retired. Opening line per Rule
 * 2.2; body and closing approved as canonical (decision-log #3).
 */
export const MODAL_OFF_RAMP = {
  headline: "You're not ready for this yet — and that's the right read.",
  body: "We work with people who have a real problem to solve and the authority to move on it. Still exploring is a fine place to be — it's just not where we add value. When you're ready to build, come back. We'll be here.",
  closing: "Until then, the door stays open:",
} as const;

/** Success screen (UX spec §Qualification modal). */
export const MODAL_SUCCESS = {
  headline: "That's everything we need.",
  body: "You'll hear from Nathan within two business days.",
} as const;

/**
 * Failure fallback (Rule 2.7): submission failure shows the escape
 * hatch with composed answers preserved on screen.
 */
export const MODAL_FAILURE = {
  headline: "That didn't go through — your answers are safe.",
  body: "Something failed on our end, not yours. Your answers are below — send them to us directly and we'll pick it up from there.",
} as const;

export const MODAL_NAV = {
  back: "Back",
  next: "Next",
  close: "Close",
} as const;

/**
 * Contact-step heading — Business Rules 1.5 names only the fields;
 * no canonical heading exists for the step. DRAFT in brand voice
 * pending owner approval, see
 * briefs/build-notes/06-qualification-modal.md.
 */
export const MODAL_CONTACT_HEADING = "Last step — where do we reach you?";

/**
 * Screen-reader step announcement for the progress dots (sr-only;
 * the NAV.menu microcopy pattern). DRAFT pending owner approval.
 */
export const MODAL_PROGRESS = {
  step: (current: number, total: number): string =>
    `Step ${current} of ${total}`,
} as const;

/**
 * Subject line for the failure-fallback mailto (Rule 2.7): the link
 * carries the visitor's composed answers in the body so a failed
 * submit is one click from recovery. DRAFT pending owner approval.
 */
export const MODAL_FAILURE_SUBJECT = "Project inquiry — my qualification answers";
