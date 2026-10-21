/**
 * Lead-notification email copy (Sprint 02 Unit 03 — notify). Two
 * messages fire on every successful capture (after the lead is durably
 * recorded, Unit 02): an auto-reply to the lead and an alert to Nate.
 *
 * Copy lives here, not in the sender module, so it sits on the same
 * `src/content/*` surface the banned-terms gate scans (project-setup
 * "copy is code") and edits stay one place. Brand voice per Brand
 * Philosophy §8; the auto-reply honors the exact promise the modal's
 * success screen already makes (`MODAL_SUCCESS` — "you'll hear from
 * Nathan within two business days"), so the email can't contradict the
 * screen the visitor just saw.
 *
 * DRAFT — new copy is a spec change (no canonical email copy exists in
 * Messaging Kit §05). Pending owner approval and flagged for the Sprint
 * 03 doc audit (see briefs/build-notes/11-notify.md). The Rule 2.5
 * signal prefix is composed at send time, not stored here.
 *
 * Since decision-log #65 the modal is email-first: the auto-reply goes
 * out once, on step 1, which never asks for a name; step 2 sends Nate a
 * follow-up alert and the visitor nothing. The qualifier and off-ramp
 * auto-replies retired with that (one auto-reply, sent before any answer
 * exists), and so did the name in the greeting.
 */

/**
 * Auto-reply to a step 1 lead (Sprint 02 Unit 04; the only auto-reply
 * since #65). A ready-to-talk lead, so it keeps the honest
 * two-business-day promise; its wording does not claim "your answers"
 * or "your project details", which step 1 does not collect. DRAFT
 * pending owner approval; the greeting is a builder DRAFT (#65).
 */
export const LEAD_AUTOREPLY_QUICK = {
  subject: "We've got your message — NextSketch",
  /** No name is asked on step 1 (#65), so the greeting never uses one. */
  greeting: "Hi there,",
  heading: "Thanks — we've got it.",
  body: [
    "Your message is in front of Nathan now. You'll hear back within two business days — a real reply from the person who'd actually do the work, not an auto-sequence.",
    "If anything changes or you want to add detail before then, just reply to this email. It comes straight to us.",
  ],
  signoff: "— Nathan, NextSketch",
} as const;

/**
 * Real-time alert to Nate. The subject reuses the Rule 2.5 signal label
 * (composed at send time via `leadSignal`) so a needs-buy-in or
 * build-first lead is obvious in the inbox; the body carries every
 * answer and the contact details so Nate can respond without digging.
 * Reply-to is set to the lead's address at send time, so one reply
 * reaches them directly.
 */
export const LEAD_ALERT = {
  intro: "New lead from the NextSketch site.",
  replyHint: "Reply to this email to reach the lead directly.",
  /** Section heading above the qualification answers in the alert body. */
  answersHeading: "Answers",
  /** Label for the capture timestamp line. */
  capturedLabel: "Captured",
  /** Label for the ID the Sheet row carries, which step 2 attaches by (#65). */
  leadIdLabel: "Lead ID",
} as const;

/**
 * Nate's follow-up alert when step 2 adds answers to a lead (#65): one
 * short email pointing at the lead step 1 already alerted, by its email
 * and lead ID. The subject is the recomputed signal, the email and
 * `subjectTag`. Builder DRAFT pending owner approval.
 */
export const LEAD_FOLLOWUP_ALERT = {
  intro: "More from a lead already in the Sheet. Same Lead ID, same row.",
  subjectTag: "(follow-up)",
} as const;
