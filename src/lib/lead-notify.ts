import { Resend } from "resend";

import { SITE } from "@/content/copy";
import {
  LEAD_ALERT,
  LEAD_AUTOREPLY,
  LEAD_AUTOREPLY_EXPLORING,
  LEAD_AUTOREPLY_QUICK,
} from "@/content/email";
import { MODAL_CONTACT, MODAL_QUESTIONS } from "@/content/modal";
import { labelFor, leadSignal } from "@/lib/lead-format";
import type { LeadPayload } from "@/lib/schema";

/**
 * Lead notification (Sprint 02 Unit 03 — notify). Fires two emails via
 * Resend (already installed; Decision 3) on every successful capture:
 *
 *   • Auto-reply to the lead — an instant acknowledgment in NextSketch
 *     voice that honors the modal's success-screen promise
 *     (`MODAL_SUCCESS`: "you'll hear from Nathan within two business
 *     days"). Reply-to is the brand inbox so a reply reaches Nate.
 *   • Alert to Nate — the Rule 2.5 signal in the subject + every answer
 *     and contact detail in the body, so he can respond without digging.
 *     Reply-to is the lead's address so one reply reaches them directly.
 *
 * Best-effort by contract (brief Outcome 4): this is invoked from the
 * route via `after()`, so it runs *after* the response is sent and
 * *only* once the lead is durably recorded (Unit 02). An email failure
 * can therefore never block or reverse a capture — the lead is already
 * safe. Failures are logged, never thrown back into the request.
 *
 * Resilient to a missing branded domain (Decision 3): if
 * `LEAD_FROM_EMAIL` (the verified sender) isn't set yet, sending falls
 * back to Resend's interim onboarding sender so email works on launch
 * day with no hard DNS dependency.
 *
 * Server-only: reads `RESEND_API_KEY` / `NOTIFY_EMAIL` / `LEAD_FROM_EMAIL`
 * (no `NEXT_PUBLIC_` prefix) — must never reach the client.
 */

/**
 * Resend's shared onboarding sender — works the moment an API key
 * exists, before any domain is verified (Decision 3 interim path).
 * Note: while sending from this shared domain, Resend may restrict
 * delivery of the lead auto-reply to the account's own verified
 * address; Nate's alert (to `NOTIFY_EMAIL`) is unaffected. Full
 * arbitrary-recipient delivery follows domain verification — owner-owned.
 */
const INTERIM_SENDER = "NextSketch <onboarding@resend.dev>";

/** The four qualification answers, in modal order (Business Rules §1). */
const QUESTION_ORDER = [
  "project_type",
  "readiness",
  "authority",
  "validation",
] as const;

/** Escape user-supplied text before it lands in the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Safe text for a Resend send error: the typed code, status, and
 * message only — never a raw object whose chain could carry sensitive
 * detail into the Vercel logs (secrets rule, mirrors lead-delivery).
 */
function describeSendError(error: {
  name: string;
  statusCode: number | null;
  message: string;
}): string {
  return `${error.name} (${error.statusCode ?? "—"}): ${error.message}`;
}

/** Pick the verified branded sender if set, else the interim sender. */
function resolveSender(): { from: string; branded: boolean } {
  const branded = process.env.LEAD_FROM_EMAIL?.trim();
  if (branded) return { from: branded, branded: true };
  return { from: INTERIM_SENDER, branded: false };
}

export async function notifyLead(payload: LeadPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "lead-notify: RESEND_API_KEY not set — skipping the lead auto-reply and Nate's alert (best-effort; the lead is already durably captured). Set it in Vercel env (sprint plan owner setup checklist).",
    );
    return;
  }

  const resend = new Resend(apiKey);
  const { from, branded } = resolveSender();
  if (!branded) {
    console.warn(
      "lead-notify: LEAD_FROM_EMAIL not set — sending from Resend's interim onboarding sender (Decision 3). Set LEAD_FROM_EMAIL to the verified branded sender once DNS is verified.",
    );
  }

  const capturedAt = new Date().toISOString();

  // Send both concurrently; `allSettled` so one failing can never stop
  // the other (mirrors lead-delivery). Both are best-effort.
  const [autoReply, alert] = await Promise.allSettled([
    sendAutoReply(resend, from, payload),
    sendAlert(resend, from, payload, capturedAt),
  ]);

  if (autoReply.status === "rejected") {
    console.error("lead-notify: auto-reply threw —", String(autoReply.reason));
  } else if (!autoReply.value) {
    console.error("lead-notify: lead auto-reply NOT sent (see error above).");
  }
  if (alert.status === "rejected") {
    console.error("lead-notify: Nate alert threw —", String(alert.reason));
  } else if (!alert.value) {
    console.error("lead-notify: Nate alert NOT sent (see error above).");
  }
}

/**
 * Instant acknowledgment to the lead. Plain, on-brand, and consistent
 * with the success screen the visitor just saw. Reply-to is the brand
 * inbox (`SITE.email`) so any reply reaches Nate.
 *
 * Copy is chosen per door so it never describes content the lead didn't
 * provide (Unit 04): the qualifier keeps "your answers / project
 * details"; the quick door gets answer-neutral wording but the same
 * two-business-day promise (it's a ready lead); the off-ramp
 * ("exploring") capture gets the gentler, no-promise variant matching
 * MODAL_OFF_RAMP_SUCCESS.
 */
async function sendAutoReply(
  resend: Resend,
  from: string,
  payload: LeadPayload,
): Promise<boolean> {
  const copy =
    payload.kind === "qualified"
      ? LEAD_AUTOREPLY
      : payload.source === "off_ramp"
        ? LEAD_AUTOREPLY_EXPLORING
        : LEAD_AUTOREPLY_QUICK;
  const firstName = payload.name.trim().split(/\s+/)[0] || payload.name.trim();
  const greeting = copy.greeting(firstName);

  const text = [
    greeting,
    "",
    copy.heading,
    "",
    ...copy.body,
    "",
    copy.signoff,
  ].join("\n");

  const html = wrapHtml(
    [
      `<p>${escapeHtml(greeting)}</p>`,
      `<p><strong>${escapeHtml(copy.heading)}</strong></p>`,
      ...copy.body.map((line) => `<p>${escapeHtml(line)}</p>`),
      `<p>${escapeHtml(copy.signoff)}</p>`,
    ].join("\n"),
  );

  const { error } = await resend.emails.send({
    from,
    to: payload.email,
    replyTo: SITE.email,
    subject: copy.subject,
    text,
    html,
  });

  if (error) {
    console.error("lead-notify: auto-reply send error —", describeSendError(error));
    return false;
  }
  return true;
}

/**
 * Real-time alert to Nate. Subject carries the Rule 2.5 signal label
 * (so a needs-buy-in / build-first lead is obvious in the inbox); body
 * carries contact details + every answer as display labels. Reply-to
 * is the lead's address so one reply reaches them directly.
 */
async function sendAlert(
  resend: Resend,
  from: string,
  payload: LeadPayload,
  capturedAt: string,
): Promise<boolean> {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    console.error(
      "lead-notify: NOTIFY_EMAIL not set — cannot send Nate's alert (best-effort; the lead is already durably captured). Set it in Vercel env (sprint plan owner setup checklist).",
    );
    return false;
  }

  const signal = leadSignal(payload);
  const details = payload.details?.trim() ? payload.details.trim() : "—";
  const fields = MODAL_CONTACT.fields;
  // Company only exists on the qualifier; the quick door collects none.
  const company =
    payload.kind === "qualified" && payload.company?.trim()
      ? payload.company.trim()
      : "—";

  // Qualifier answers only exist on the full path; the quick door has none
  // (the subject's signal label already says which door it came through).
  const answers =
    payload.kind === "qualified"
      ? QUESTION_ORDER.map((key) => ({
          question: MODAL_QUESTIONS[key].question,
          answer: labelFor(MODAL_QUESTIONS[key].options, payload[key]),
        }))
      : [];

  const subject =
    payload.kind === "qualified"
      ? `${signal.label} ${payload.name} — ${labelFor(
          MODAL_QUESTIONS.project_type.options,
          payload.project_type,
        )}`
      : `${signal.label} ${payload.name}`;

  const textLines: string[] = [
    LEAD_ALERT.intro,
    "",
    `${fields.name.label}: ${payload.name}`,
    `${fields.email.label}: ${payload.email}`,
  ];
  if (payload.kind === "qualified") {
    textLines.push(`${fields.company.label}: ${company}`);
  }
  textLines.push("");
  if (answers.length > 0) {
    textLines.push(
      LEAD_ALERT.answersHeading,
      ...answers.map(({ question, answer }) => `${question}\n  → ${answer}`),
      "",
    );
  }
  textLines.push(
    `${fields.details.label}: ${details}`,
    "",
    `${LEAD_ALERT.capturedLabel}: ${capturedAt}`,
    "",
    LEAD_ALERT.replyHint,
  );
  const text = textLines.join("\n");

  const contactHtml = [
    "<p>",
    `${escapeHtml(fields.name.label)}: ${escapeHtml(payload.name)}<br>`,
    `${escapeHtml(fields.email.label)}: ${escapeHtml(payload.email)}`,
  ];
  if (payload.kind === "qualified") {
    contactHtml.push(
      `<br>${escapeHtml(fields.company.label)}: ${escapeHtml(company)}`,
    );
  }
  contactHtml.push("</p>");

  const answersHtml =
    answers.length > 0
      ? [
          `<p><strong>${escapeHtml(LEAD_ALERT.answersHeading)}</strong></p>`,
          "<ul>",
          ...answers.map(
            ({ question, answer }) =>
              `<li>${escapeHtml(question)}<br><strong>${escapeHtml(answer)}</strong></li>`,
          ),
          "</ul>",
        ]
      : [];

  const html = wrapHtml(
    [
      `<p>${escapeHtml(LEAD_ALERT.intro)}</p>`,
      ...contactHtml,
      ...answersHtml,
      `<p>${escapeHtml(fields.details.label)}: ${escapeHtml(details)}</p>`,
      `<p>${escapeHtml(LEAD_ALERT.capturedLabel)}: ${escapeHtml(capturedAt)}</p>`,
      `<p>${escapeHtml(LEAD_ALERT.replyHint)}</p>`,
    ].join("\n"),
  );

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("lead-notify: alert send error —", describeSendError(error));
    return false;
  }
  return true;
}

/** Minimal, mail-client-safe HTML shell around the message body. */
function wrapHtml(inner: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a">\n${inner}\n</div>`;
}
