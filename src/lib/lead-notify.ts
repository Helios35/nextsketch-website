import { Resend } from "resend";

import { SITE } from "@/content/copy";
import {
  LEAD_ALERT,
  LEAD_AUTOREPLY_QUICK,
  LEAD_FOLLOWUP_ALERT,
} from "@/content/email";
import { MODAL_CONTACT, MODAL_QUICK } from "@/content/modal";
import { followupAnswers, leadSignal, quickNeeds } from "@/lib/lead-format";
import type {
  FollowupPayload,
  NewEntryPayload,
  QuickLeadPayload,
  WaitlistPayload,
} from "@/lib/schema";

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
 * A waitlist entry (decision-log #58) gets the alert only: no
 * auto-reply, because the band's on-page confirmation is the whole
 * acknowledgement.
 *
 * Email-first (decision-log #65): both emails go out on step 1, which
 * is the lead (an email and the offerings, no name). Step 2's answers
 * arrive later as a `followup`: `notifyFollowup` sends Nate one short
 * follow-up alert pointing at the same lead, and the visitor gets no
 * second auto-reply.
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

/**
 * A Resend client and sender, or `null` (logged) when no API key is set:
 * every send is best-effort, so a missing key skips email and never
 * touches a capture that already succeeded.
 */
function resolveMailer(): { resend: Resend; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "lead-notify: RESEND_API_KEY not set — skipping the lead auto-reply and Nate's alert (best-effort; the lead is already durably captured). Set it in Vercel env (sprint plan owner setup checklist).",
    );
    return null;
  }
  const { from, branded } = resolveSender();
  if (!branded) {
    console.warn(
      "lead-notify: LEAD_FROM_EMAIL not set — sending from Resend's interim onboarding sender (Decision 3). Set LEAD_FROM_EMAIL to the verified branded sender once DNS is verified.",
    );
  }
  return { resend: new Resend(apiKey), from };
}

export async function notifyLead(
  payload: NewEntryPayload,
  leadId: string,
): Promise<void> {
  const mailer = resolveMailer();
  if (mailer === null) return;
  const { resend, from } = mailer;

  const capturedAt = new Date().toISOString();

  // Send both concurrently; `allSettled` so one failing can never stop
  // the other (mirrors lead-delivery). Both are best-effort. The
  // waitlist band sends no auto-reply (decision-log #58): its on-page
  // confirmation is the whole acknowledgement, so that slot resolves as
  // nothing to send rather than as a failure. Nate's alert still fires,
  // under the `[Waitlist]` label.
  const [autoReply, alert] = await Promise.allSettled([
    payload.kind === "waitlist"
      ? Promise.resolve(true)
      : sendAutoReply(resend, from, payload),
    payload.kind === "waitlist"
      ? sendWaitlistAlert(resend, from, payload, capturedAt)
      : sendAlert(resend, from, payload, capturedAt, leadId),
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
 * Instant acknowledgment to the lead, sent on step 1 (#65). Plain,
 * on-brand, and consistent with the success screen. Reply-to is the
 * brand inbox (`SITE.email`) so any reply reaches Nate. Step 1 asks no
 * name, so the greeting never uses one (Outcome 8).
 */
async function sendAutoReply(
  resend: Resend,
  from: string,
  payload: QuickLeadPayload,
): Promise<boolean> {
  const copy = LEAD_AUTOREPLY_QUICK;
  const greeting = copy.greeting;

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
 * Real-time alert to Nate for a step 1 lead. Subject carries the signal
 * label, the email (step 1 asks no name, #65) and the offerings; the
 * body carries the email, the lead ID step 2 attaches by and the
 * offerings, so he can respond without digging. Reply-to is the lead's
 * address so one reply reaches them directly.
 */
async function sendAlert(
  resend: Resend,
  from: string,
  payload: QuickLeadPayload,
  capturedAt: string,
  leadId: string,
): Promise<boolean> {
  const to = notifyAddress();
  if (to === null) return false;

  const needs = quickNeeds(payload.project_types);
  return sendToNate(resend, from, {
    to,
    replyTo: payload.email,
    subject: `${leadSignal(payload).label} ${payload.email} — ${needs}`,
    lines: [
      { text: LEAD_ALERT.intro },
      { label: MODAL_CONTACT.fields.email.label, text: payload.email },
      { label: LEAD_ALERT.leadIdLabel, text: leadId },
      { label: MODAL_QUICK.messageLabel, text: needs },
      { label: LEAD_ALERT.capturedLabel, text: capturedAt },
      { text: LEAD_ALERT.replyHint },
    ],
    what: "alert",
  });
}

/**
 * Nate's follow-up alert when step 2 adds answers (#65): one short email
 * pointing at the lead step 1 alerted, by its email and lead ID, under
 * the recomputed signal (so `[Lead — exploring]`, a Rule 2.5 flag,
 * `[Lead]` or `[Lead — partial]` tells him how far it got). The body is
 * only what step 2 added. No auto-reply goes with it.
 */
export async function notifyFollowup(payload: FollowupPayload): Promise<void> {
  const mailer = resolveMailer();
  if (mailer === null) return;
  const to = notifyAddress();
  if (to === null) return;

  const { fields } = MODAL_CONTACT;
  const answers = followupAnswers(payload);
  const lines: AlertLine[] = [
    { text: LEAD_FOLLOWUP_ALERT.intro },
    { label: fields.email.label, text: payload.email },
    { label: LEAD_ALERT.leadIdLabel, text: payload.lead_id },
  ];
  if (payload.name) lines.push({ label: fields.name.label, text: payload.name });
  if (payload.company) {
    lines.push({ label: fields.company.label, text: payload.company });
  }
  if (answers.length > 0) {
    lines.push({ heading: LEAD_ALERT.answersHeading, items: answers });
  }
  if (payload.details) {
    lines.push({ label: fields.details.label, text: payload.details });
  }
  lines.push(
    { label: LEAD_ALERT.capturedLabel, text: new Date().toISOString() },
    { text: LEAD_ALERT.replyHint },
  );

  try {
    const sent = await sendToNate(mailer.resend, mailer.from, {
      to,
      replyTo: payload.email,
      subject: `${leadSignal(payload).label} ${payload.email} ${LEAD_FOLLOWUP_ALERT.subjectTag}`,
      lines,
      what: "follow-up alert",
    });
    if (!sent) {
      console.error("lead-notify: follow-up alert NOT sent (see error above).");
    }
  } catch (error) {
    console.error("lead-notify: follow-up alert threw —", String(error));
  }
}

/** Nate's inbox, or `null` (logged) when `NOTIFY_EMAIL` is not set. */
function notifyAddress(): string | null {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    console.error(
      "lead-notify: NOTIFY_EMAIL not set — cannot send Nate's alert (best-effort; the lead is already durably captured). Set it in Vercel env (sprint plan owner setup checklist).",
    );
    return null;
  }
  return to;
}

/**
 * One block of an alert body: a plain line, a labelled value, or the
 * answers list. Rendered once as text and once as escaped HTML, so the
 * two never say different things.
 */
type AlertLine =
  | { text: string; label?: string }
  | { heading: string; items: { question: string; answer: string }[] };

/** A label as it leads its value: "Email:", but "What do you need?" as is. */
function labelled(label: string): string {
  return /[?:]$/.test(label) ? label : `${label}:`;
}

/** Send one alert to Nate; false (logged) on a Resend error. */
async function sendToNate(
  resend: Resend,
  from: string,
  message: {
    to: string;
    replyTo: string;
    subject: string;
    lines: AlertLine[];
    what: string;
  },
): Promise<boolean> {
  // Consecutive labelled values read as one block (the contact lines);
  // everything else is its own paragraph.
  const text = message.lines
    .map((line, i) => {
      const block =
        "heading" in line
          ? [
              line.heading,
              ...line.items.map(({ question, answer }) => `${question}\n  → ${answer}`),
            ].join("\n")
          : line.label === undefined
            ? line.text
            : `${labelled(line.label)} ${line.text}`;
      const previous = message.lines[i - 1];
      if (i === 0) return block;
      const sameBlock =
        !("heading" in line) &&
        line.label !== undefined &&
        previous !== undefined &&
        !("heading" in previous) &&
        previous.label !== undefined;
      return `${sameBlock ? "\n" : "\n\n"}${block}`;
    })
    .join("");
  const html = wrapHtml(
    message.lines
      .map((line) =>
        "heading" in line
          ? [
              `<p><strong>${escapeHtml(line.heading)}</strong></p>`,
              "<ul>",
              ...line.items.map(
                ({ question, answer }) =>
                  `<li>${escapeHtml(question)}<br><strong>${escapeHtml(answer)}</strong></li>`,
              ),
              "</ul>",
            ].join("\n")
          : line.label === undefined
            ? `<p>${escapeHtml(line.text)}</p>`
            : `<p>${escapeHtml(labelled(line.label))} ${escapeHtml(line.text)}</p>`,
      )
      .join("\n"),
  );

  const { error } = await resend.emails.send({
    from,
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    text,
    html,
  });
  if (error) {
    console.error(`lead-notify: ${message.what} send error —`, describeSendError(error));
    return false;
  }
  return true;
}

/**
 * Alert to Nate for a waitlist entry (decision-log #58): the address and
 * when it came in, under the `[Waitlist]` subject so it never reads as
 * a lead. The lead alert's intro and reply hint both say "lead", which a
 * waitlist entry is not, so neither is reused and nothing new is
 * written: the body is two labelled values.
 */
async function sendWaitlistAlert(
  resend: Resend,
  from: string,
  payload: WaitlistPayload,
  capturedAt: string,
): Promise<boolean> {
  const to = notifyAddress();
  if (to === null) return false;

  const lines = [
    `${MODAL_CONTACT.fields.email.label}: ${payload.email}`,
    `${LEAD_ALERT.capturedLabel}: ${capturedAt}`,
  ];
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: payload.email,
    subject: `${leadSignal(payload).label} ${payload.email}`,
    text: lines.join("\n"),
    html: wrapHtml(lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("\n")),
  });

  if (error) {
    console.error("lead-notify: waitlist alert send error:", describeSendError(error));
    return false;
  }
  return true;
}

/** Minimal, mail-client-safe HTML shell around the message body. */
function wrapHtml(inner: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a">\n${inner}\n</div>`;
}
