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
 * Auto-reply variant for a quick-door lead (Sprint 02 Unit 04). A quick
 * lead is a ready-to-talk one, so it keeps the same honest
 * two-business-day promise as the qualifier auto-reply — but its wording
 * must not claim "your answers" / "your project details": the quick door
 * collects neither, only a name, email, and an optional one-line message.
 * New copy = a spec change → DRAFT pending owner approval, flagged for the
 * Sprint 03 audit.
 */
export const LEAD_AUTOREPLY_QUICK = {
  subject: "We've got your message — NextSketch",
  greeting: (firstName: string): string => `Hi ${firstName},`,
  heading: "Thanks — we've got it.",
  body: [
    "Your message is in front of Nathan now. You'll hear back within two business days — a real reply from the person who'd actually do the work, not an auto-sequence.",
    "If anything changes or you want to add detail before then, just reply to this email. It comes straight to us.",
  ],
  signoff: "— Nathan, NextSketch",
} as const;

/**
 * Auto-reply variant for an off-ramp ("exploring") capture (Sprint 02
 * Unit 04). The standard LEAD_AUTOREPLY promises a reply within two
 * business days — honest for a ready lead, wrong for someone who just
 * told us they're still exploring. This one matches the off-ramp's "not
 * yet, no pressure" tone instead (MODAL_OFF_RAMP_SUCCESS), so the email
 * can't contradict the screen the visitor just saw. New copy = a spec
 * change → DRAFT pending owner approval, flagged for the Sprint 03 audit.
 */
export const LEAD_AUTOREPLY_EXPLORING = {
  subject: "We've got your note — NextSketch",
  greeting: (firstName: string): string => `Hi ${firstName},`,
  heading: "Thanks for reaching out.",
  body: [
    "We've got your details. No follow-up sequence and no pressure — when you're ready to build, you'll know where to find us, and we'll reach out if the timing lines up.",
    "If anything changes, just reply to this email. It comes straight to us.",
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
