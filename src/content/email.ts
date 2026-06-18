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
 * 03 doc audit (see briefs/build-notes/11-notify.md). The lead's name
 * and the Rule 2.5 signal prefix are composed at send time, not stored
 * here.
 */

/**
 * Auto-reply to the lead. Confirms receipt in NextSketch's voice and
 * restates the success-screen promise verbatim in spirit — a real reply
 * from Nathan within two business days, not a nurture sequence.
 */
export const LEAD_AUTOREPLY = {
  /** Subject the lead sees in their inbox. */
  subject: "We've got your project details — NextSketch",
  /** Greeting; first name resolved from the contact step at send time. */
  greeting: (firstName: string): string => `Hi ${firstName},`,
  heading: "Thanks — we've got it.",
  body: [
    "Your answers are in front of Nathan now. You'll hear back within two business days — a real reply from the person who'd actually do the work, not an auto-sequence.",
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
} as const;
