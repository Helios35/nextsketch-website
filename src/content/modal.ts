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
