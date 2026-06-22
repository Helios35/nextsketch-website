import type { QualificationPayload } from "@/lib/schema";

/**
 * Qualification modal copy and answer options.
 *
 * Question text per docs/05-business-rules.md §1; label→payload
 * mapping per docs/06-taxonomy.md §3 — builders never invent
 * alternate values. "exploring" exists only here in the UI layer:
 * it routes to the off-ramp (Rule 2.1) and is rejected by the
 * submit schema by construction.
 */

export interface ModalOption<V extends string> {
  readonly value: V;
  readonly label: string;
}

type ProjectTypeValue = QualificationPayload["project_type"] | "exploring";
type ReadinessValue = QualificationPayload["readiness"] | "exploring";
type AuthorityValue = QualificationPayload["authority"];
type ValidationValue = QualificationPayload["validation"];

export const MODAL_QUESTIONS = {
  project_type: {
    question: "What do you need built or improved?",
    options: [
      { value: "new_product", label: "New product from scratch" },
      { value: "rescue", label: "Stuck at 70% — rescue or finish" },
      { value: "agentic", label: "Agentic systems for my product or operations" },
      { value: "partnership", label: "My live product needs a partner" },
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

/** Contact step (Business Rules 1.5). */
export const MODAL_CONTACT = {
  fields: {
    name: { label: "Name", required: true },
    email: { label: "Email", required: true },
    company: { label: "Company", required: false },
    details: { label: "Tell us about it", required: false, maxLength: 1000 },
  },
  submit: "Let's See if We're a Fit",
} as const;

/**
 * Quick door (Sprint 02 Unit 04) — the low-friction primary path: name,
 * email, and an optional one-line message, no qualifier questions. The
 * full four-question qualifier stays reachable from here as the optional
 * "tell us more" path (`toQualifier`). The message reuses the contact
 * step's `details` field so it lands in the same lead record.
 *
 * New flow + copy = a spec change touching Business Rules §1–2 — flagged
 * for the Sprint 03 audit (docs/05-business-rules.md). DRAFT in brand
 * voice pending owner approval.
 */
export const MODAL_QUICK = {
  heading: "Tell us what you need.",
  body: "The short version. Your name, your email, and a line on what you're building — we'll take it from there.",
  /** Label for the optional needs selector. */
  messageLabel: "What do you need?",
  /**
   * Multi-select options replacing the free-text line (Sprint 03 adhoc),
   * laid out as two levels: the primary build (new product / product
   * completion — mutually exclusive) then the add-ons (product support /
   * agentic system — combine with either). Stored as `project_types` and
   * written to the Sheet's existing `project_type` column as a delimited
   * list. Values are canonical project types (docs/06-taxonomy.md §3) —
   * "Product support" is the `partnership` type. The selection is optional.
   */
  needsOptions: [
    { value: "new_product", label: "New product" },
    { value: "rescue", label: "Product completion" },
    { value: "partnership", label: "Product support" },
    { value: "agentic", label: "Agentic system" },
  ],
  /** Submit CTA (Rule 3.1 set). */
  submit: "Talk to Us",
  /** Secondary affordance into the full four-question qualifier. */
  toQualifier: "Rather walk us through it? Answer a few questions",
} as const;

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
 * error state. Opening line per Rule 2.2; remainder drafted in brand
 * voice — DRAFT pending owner approval, see
 * briefs/build-notes/01-foundation.md.
 */
export const MODAL_OFF_RAMP = {
  headline: "You're not ready for this yet — and that's the right read.",
  body: "We work with people who have a real problem to solve and the authority to move on it. Still exploring is a fine place to be — it's just not where we add value. When you're ready to build, come back. We'll be here.",
  closing: "Until then, the door stays open:",
  /**
   * Off-ramp email capture (Sprint 02 Unit 04): an honest, low-pressure
   * offer to stay in touch instead of only showing the door — NOT a hard
   * sell (Rule 2.2 intent preserved). New flow + copy flagged for the
   * Sprint 03 audit. DRAFT pending owner approval.
   */
  capture: {
    prompt:
      "Or leave your details and we'll reach out when the timing's right — no sequence, no pressure.",
    submit: "Stay in Touch",
  },
} as const;

/** Success screen (UX spec §Qualification modal). */
export const MODAL_SUCCESS = {
  headline: "That's everything we need.",
  body: "You'll hear from Nathan within two business days.",
} as const;

/**
 * Off-ramp capture confirmation (Sprint 02 Unit 04) — a gentler success
 * than MODAL_SUCCESS. An "exploring" visitor isn't promised a
 * two-business-day reply; they're told, honestly, that we'll be here.
 * DRAFT pending owner approval, flagged for the Sprint 03 audit.
 */
export const MODAL_OFF_RAMP_SUCCESS = {
  headline: "Got it — we'll be here.",
  body: "No follow-up sequence, no pressure. When you're ready to build, you'll know where to find us — and we'll reach out if the timing lines up.",
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
