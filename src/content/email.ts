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
 * out once, on step 1 (which asks first name, last name and email);
 * step 2 sends Nate a follow-up alert and the visitor nothing. The
 * qualifier and off-ramp auto-replies retired with that (one auto-reply,
 * sent before any answer exists).
 */

/**
 * Auto-reply to a step 1 lead (Sprint 02 Unit 04; the only auto-reply
 * since #65). A ready-to-talk lead, so it keeps the honest
 * two-business-day promise; its wording does not claim "your answers"
 * or "your project details", which step 1 does not collect. DRAFT
 * pending owner approval.
 */
export const LEAD_AUTOREPLY_QUICK = {
  subject: "We've got your message — NextSketch",
  /** Greeting; step 1's first name, resolved at send time. */
  greeting: (firstName: string): string => `Hi ${firstName},`,
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
 * short email pointing at the lead step 1 already alerted, by its name,
 * email and lead ID. The subject is the recomputed signal, the name and
 * `subjectTag`. Builder DRAFT pending owner approval.
 */
export const LEAD_FOLLOWUP_ALERT = {
  intro: "More from a lead already in the Sheet. Same Lead ID, same row.",
  subjectTag: "(follow-up)",
} as const;

/**
 * The guide email (decision-log #76): the one email a free guide lead
 * gets, in place of the auto-reply, sent once the lead is in the Sheet.
 * A link to the guide, never an attachment. Owner copy (the free guide
 * brief, Part B), word for word but for the sign-off. Reply-to is the
 * brand inbox, so "just reply to this email" reaches Nate.
 */
export const LEAD_GUIDE_EMAIL = {
  subject: "Your copy of The Small Business Guide to AI",
  /**
   * The paragraph the link closes. Greets the first word of the name the
   * visitor typed (the card asks one Name, the auto-reply greets a first
   * name), and the link label follows the colon.
   */
  opening: (firstName: string): string =>
    `Hi ${firstName}, here's your copy of The Small Business Guide to AI:`,
  linkLabel: "Download the guide",
  body: [
    'Start with the "map one job this week" checklist near the end. It shows you where your first agent should go.',
    "Want help with the rest? Just reply to this email.",
  ],
  /**
   * DRAFT: Part B signs "Nate, Next Sketch". The brand is one word in all
   * copy (Rule 3.3, Taxonomy §8; "Next Sketch" is the legal line only).
   */
  signoff: "Nate, NextSketch",
} as const;

/**
 * Nate's alert for a guide lead (#76): the usual lead alert, plus one
 * line naming what the visitor asked for. Builder DRAFT.
 */
export const LEAD_GUIDE_ALERT = {
  guideLabel: "Guide",
} as const;
