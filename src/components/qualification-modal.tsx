"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Button } from "@/components/button";
import { CloseIcon } from "@/components/close-icon";
import {
  MODAL_CONTACT,
  MODAL_CONTACT_HEADING,
  MODAL_ESCAPE_HATCH,
  MODAL_FAILURE,
  MODAL_FAILURE_SUBJECT,
  MODAL_NAV,
  MODAL_OFF_RAMP,
  MODAL_PROGRESS,
  MODAL_QUESTIONS,
  MODAL_SUCCESS,
} from "@/content/modal";
import { submitQualification } from "@/lib/qualify";
import { qualificationPayloadSchema } from "@/lib/schema";

/** Question order per Business Rules 1.1–1.4. */
const QUESTION_ORDER = [
  "project_type",
  "readiness",
  "authority",
  "validation",
] as const;

type QuestionKey = (typeof QUESTION_ORDER)[number];

type Answers = {
  [K in QuestionKey]?: (typeof MODAL_QUESTIONS)[K]["options"][number]["value"];
};

/**
 * Flow screens: the four question steps and the contact step
 * (Business Rules §1), the off-ramp (Rules 2.1–2.2), and the
 * terminal submit screens (UX spec §Qualification modal; failure
 * per Rule 2.7).
 */
type Screen = QuestionKey | "contact" | "off_ramp" | "success" | "failure";

/** Steps the progress dots cover — the qualified path. */
const PROGRESS_STEPS = [...QUESTION_ORDER, "contact"] as const;

function isQuestionKey(screen: Screen): screen is QuestionKey {
  return (QUESTION_ORDER as readonly string[]).includes(screen);
}

/**
 * Branch evaluation, run on every Next press against the *current*
 * answers — which is what makes E1 hold: going back and changing Q1
 * to "I'm still exploring" re-evaluates Rule 2.1 and routes to the
 * off-ramp regardless of how far the visitor had advanced.
 */
function screenAfter(key: QuestionKey, answers: Answers): Screen {
  switch (key) {
    case "project_type":
      return answers.project_type === "exploring" ? "off_ramp" : "readiness";
    case "readiness":
      return answers.readiness === "exploring" ? "off_ramp" : "authority";
    case "authority":
      return "validation";
    case "validation":
      return "contact";
  }
}

interface ContactFields {
  name: string;
  email: string;
  company: string;
  details: string;
  /** Honeypot (Rule 2.8) — anything non-empty rejects at the schema. */
  hp: string;
}

const EMPTY_CONTACT: ContactFields = {
  name: "",
  email: "",
  company: "",
  details: "",
  hp: "",
};

interface ComposedAnswer {
  label: string;
  value: string;
}

/**
 * The visitor's answers as label/value pairs — rendered on the
 * failure screen and carried in the fallback mailto body so nothing
 * is lost (Rule 2.7). Labels are the canonical question/field copy.
 */
function composeAnswers(
  answers: Answers,
  contact: ContactFields,
): ComposedAnswer[] {
  const composed: ComposedAnswer[] = [];
  for (const key of QUESTION_ORDER) {
    const { question, options } = MODAL_QUESTIONS[key];
    const selected = options.find((option) => option.value === answers[key]);
    if (selected !== undefined) {
      composed.push({ label: question, value: selected.label });
    }
  }
  const { fields } = MODAL_CONTACT;
  composed.push({ label: fields.name.label, value: contact.name });
  composed.push({ label: fields.email.label, value: contact.email });
  if (contact.company !== "") {
    composed.push({ label: fields.company.label, value: contact.company });
  }
  if (contact.details !== "") {
    composed.push({ label: fields.details.label, value: contact.details });
  }
  return composed;
}

const HEADING_CLASS =
  "text-2xl font-bold tracking-tight text-balance outline-none md:text-3xl";

const INPUT_CLASS =
  "mt-2 w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const OPTION_CLASS =
  "flex min-h-11 cursor-pointer items-center rounded-2xl border border-ink/20 " +
  "bg-white/60 px-5 py-4 text-left text-base font-medium " +
  "motion-safe:transition-colors " +
  "hover:border-ink/60 hover:bg-white has-checked:border-ink has-checked:bg-ink " +
  "has-checked:text-white has-focus-visible:outline-2 " +
  "has-focus-visible:outline-offset-2 has-focus-visible:outline-ink";

const MAILTO = `mailto:${MODAL_ESCAPE_HATCH.email}`;

interface QualificationModalProps {
  /** Fired after the native dialog closes; the provider unmounts us. */
  onClose: () => void;
}

/**
 * The qualification modal — Business Rules §1–2 as a client-side
 * state machine (docs/07-technical-spec.md §Business logic). Overlay,
 * no route: the builder's call docs/03-site-architecture.md
 * delegates, recorded in briefs/build-notes/06-qualification-modal.md.
 *
 * Mounted fresh on every open (E2: no cooldown, always fresh) on a
 * native <dialog> via showModal() — focus trap, Esc-to-close, and
 * top-layer rendering are the platform's. Escape hatch and a back
 * control on every step (Rules 1.6, 2.6). Interim submit resolves to
 * the failure-fallback per docs/decision-log.md #6 — see
 * @/lib/qualify.
 */
export function QualificationModal({ onClose }: QualificationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  /** Modal-open timestamp for the minimum-time check (Rule 2.8); set on mount. */
  const openedAt = useRef(0);
  const headingId = useId();
  const [screen, setScreen] = useState<Screen>("project_type");
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<ContactFields>(EMPTY_CONTACT);
  const [submitting, setSubmitting] = useState(false);

  /*
   * Layout effect so the dialog opens before first paint — the
   * author display class would otherwise flash the closed dialog
   * inline for a frame.
   */
  useLayoutEffect(() => {
    openedAt.current = Date.now();
    dialogRef.current?.showModal();
  }, []);

  /* Scroll lock behind the modal (UX spec; SiteNav overlay pattern). */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  /*
   * Move focus to the step heading on every screen so keyboard and
   * screen-reader users land on the question, not a stale control.
   */
  useEffect(() => {
    headingRef.current?.focus();
  }, [screen]);

  const close = () => dialogRef.current?.close();

  const stepIndex = (PROGRESS_STEPS as readonly string[]).indexOf(screen);

  const setAnswer = <K extends QuestionKey>(key: K, value: Answers[K]) =>
    setAnswers((current) => ({ ...current, [key]: value }));

  const goNext = () => {
    if (isQuestionKey(screen) && answers[screen] !== undefined) {
      setScreen(screenAfter(screen, answers));
    }
  };

  /**
   * Back per Rule 1.6 — every step has one. From Q1 it closes (the
   * page is what's behind); from the off-ramp it returns to whichever
   * question triggered Rule 2.1 so the answer can be changed (E1/E2).
   */
  const goBack = () => {
    switch (screen) {
      case "project_type":
        close();
        break;
      case "readiness":
        setScreen("project_type");
        break;
      case "authority":
        setScreen("readiness");
        break;
      case "validation":
        setScreen("authority");
        break;
      case "contact":
        setScreen("validation");
        break;
      case "off_ramp":
        setScreen(
          answers.project_type === "exploring" ? "project_type" : "readiness",
        );
        break;
      case "failure":
        setScreen("contact");
        break;
      case "success":
        close();
        break;
    }
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /*
     * Validation gate: the payload must satisfy
     * qualificationPayloadSchema before anything is submitted.
     * "exploring" answers can't reach here (Rule 2.1 routed them to
     * the off-ramp) and can't pass the schema either — UI-only by
     * construction. A parse failure (honeypot, sub-3s timing) goes
     * to the failure-fallback: the lead is never silently dropped.
     */
    const parsed = qualificationPayloadSchema.safeParse({
      project_type: answers.project_type,
      readiness: answers.readiness,
      authority: answers.authority,
      validation: answers.validation,
      name: contact.name,
      email: contact.email,
      company: contact.company === "" ? undefined : contact.company,
      details: contact.details === "" ? undefined : contact.details,
      _hp: contact.hp,
      _t: Date.now() - openedAt.current,
    });
    if (!parsed.success) {
      setScreen("failure");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitQualification(parsed.data);
      setScreen(result.ok ? "success" : "failure");
    } catch {
      // Rule 2.7: preserve the composed answers, show the escape hatch.
      setScreen("failure");
    } finally {
      setSubmitting(false);
    }
  };

  const composed = composeAnswers(answers, contact);
  const failureMailto = `${MAILTO}?subject=${encodeURIComponent(
    MODAL_FAILURE_SUBJECT,
  )}&body=${encodeURIComponent(
    composed.map(({ label, value }) => `${label}\n${value}`).join("\n\n"),
  )}`;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={headingId}
      className={[
        "flex h-dvh max-h-none w-full max-w-none flex-col bg-paper p-0 text-ink",
        "md:m-auto md:h-auto md:max-h-[85dvh] md:w-full md:max-w-[560px] md:rounded-3xl",
        "md:shadow-sheet-xl",
        // backdrop color lives in globals.css (::backdrop var-inheritance quirk)
        "motion-safe:animate-modal-in",
      ].join(" ")}
    >
      <header className="flex items-center justify-between gap-4 px-6 pt-4 md:px-10 md:pt-6">
        {stepIndex === -1 ? (
          <span aria-hidden="true" />
        ) : (
          <div>
            <p className="sr-only">
              {MODAL_PROGRESS.step(stepIndex + 1, PROGRESS_STEPS.length)}
            </p>
            <div aria-hidden="true" className="flex items-center gap-2">
              {PROGRESS_STEPS.map((step, i) => (
                <span
                  key={step}
                  className={`h-2 rounded-full motion-safe:transition-[width,background-color] motion-safe:duration-300 ${
                    i === stepIndex
                      ? "w-6 bg-ink"
                      : i < stepIndex
                        ? "w-2 bg-ink"
                        : "w-2 bg-ink/20"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        <button
          type="button"
          aria-label={MODAL_NAV.close}
          onClick={close}
          className="inline-flex min-h-11 min-w-11 items-center justify-center"
        >
          <CloseIcon />
        </button>
      </header>

      <div
        key={screen}
        className="min-h-0 grow overflow-y-auto px-6 py-6 md:px-10 md:py-8 motion-safe:animate-step-in"
      >
        {isQuestionKey(screen) && (
          <>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className={HEADING_CLASS}
            >
              {MODAL_QUESTIONS[screen].question}
            </h2>
            <div
              role="radiogroup"
              aria-labelledby={headingId}
              className="mt-6 flex flex-col gap-3"
            >
              {MODAL_QUESTIONS[screen].options.map(({ value, label }) => (
                <label key={value} className={OPTION_CLASS}>
                  <input
                    type="radio"
                    name={screen}
                    value={value}
                    checked={answers[screen] === value}
                    onChange={() => setAnswer(screen, value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <Button variant="secondary" type="button" onClick={goBack}>
                {MODAL_NAV.back}
              </Button>
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[screen] === undefined}
                className="disabled:pointer-events-none disabled:opacity-40"
              >
                {MODAL_NAV.next}
              </Button>
            </div>
          </>
        )}

        {screen === "contact" && (
          <>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className={HEADING_CLASS}
            >
              {MODAL_CONTACT_HEADING}
            </h2>
            <form onSubmit={handleContactSubmit} className="mt-6">
              <div className="flex flex-col gap-4">
                <label className="block">
                  <span className="text-sm font-medium">
                    {MODAL_CONTACT.fields.name.label}
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={contact.name}
                    onChange={(e) =>
                      setContact({ ...contact, name: e.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">
                    {MODAL_CONTACT.fields.email.label}
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">
                    {MODAL_CONTACT.fields.company.label}
                  </span>
                  <input
                    type="text"
                    name="company"
                    maxLength={100}
                    autoComplete="organization"
                    value={contact.company}
                    onChange={(e) =>
                      setContact({ ...contact, company: e.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">
                    {MODAL_CONTACT.fields.details.label}
                  </span>
                  <textarea
                    name="details"
                    rows={4}
                    maxLength={MODAL_CONTACT.fields.details.maxLength}
                    value={contact.details}
                    onChange={(e) =>
                      setContact({ ...contact, details: e.target.value })
                    }
                    className={INPUT_CLASS}
                  />
                </label>
              </div>
              {/* Honeypot (Rule 2.8): visually and AT-hidden; bots fill it. */}
              <input
                type="text"
                name="_hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={contact.hp}
                onChange={(e) => setContact({ ...contact, hp: e.target.value })}
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />
              <div className="mt-8 flex items-center justify-between gap-4">
                <Button variant="secondary" type="button" onClick={goBack}>
                  {MODAL_NAV.back}
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="disabled:pointer-events-none disabled:opacity-40"
                >
                  {MODAL_CONTACT.submit}
                </Button>
              </div>
            </form>
          </>
        )}

        {screen === "off_ramp" && (
          <>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className={HEADING_CLASS}
            >
              {MODAL_OFF_RAMP.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/80">
              {MODAL_OFF_RAMP.body}
            </p>
            <p className="mt-6 text-base leading-relaxed">
              {MODAL_OFF_RAMP.closing}{" "}
              <a
                href={MAILTO}
                className="font-medium underline underline-offset-4"
              >
                {MODAL_ESCAPE_HATCH.email}
              </a>
            </p>
            <div className="mt-8">
              <Button variant="secondary" type="button" onClick={goBack}>
                {MODAL_NAV.back}
              </Button>
            </div>
          </>
        )}

        {screen === "success" && (
          <>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className={HEADING_CLASS}
            >
              {MODAL_SUCCESS.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/80">
              {MODAL_SUCCESS.body}
            </p>
            <div className="mt-8">
              <Button type="button" onClick={close}>
                {MODAL_NAV.close}
              </Button>
            </div>
          </>
        )}

        {screen === "failure" && (
          <>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className={HEADING_CLASS}
            >
              {MODAL_FAILURE.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/80">
              {MODAL_FAILURE.body}
            </p>
            <dl className="mt-6 space-y-4 rounded-2xl border border-ink/10 bg-paper-bright p-5">
              {composed.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-sm text-ink/60">{label}</dt>
                  <dd className="font-medium whitespace-pre-wrap">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="secondary" type="button" onClick={goBack}>
                {MODAL_NAV.back}
              </Button>
              <Button href={failureMailto}>{MODAL_ESCAPE_HATCH.email}</Button>
            </div>
          </>
        )}
      </div>

      {/* Escape hatch, persistent at every step (Rule 2.6). */}
      <footer className="border-t border-ink/10 px-6 py-4 text-sm text-ink/70 md:px-10">
        {MODAL_ESCAPE_HATCH.prompt}{" "}
        <a
          href={MAILTO}
          className="font-medium text-ink underline underline-offset-4"
        >
          {MODAL_ESCAPE_HATCH.email}
        </a>
      </footer>
    </dialog>
  );
}
