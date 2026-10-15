"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { CloseIcon } from "@/components/close-icon";
import {
  MODAL_CONTACT,
  MODAL_CONTACT_HEADING,
  MODAL_ESCAPE_HATCH,
  MODAL_FAILURE,
  MODAL_FAILURE_SUBJECT,
  MODAL_NAV,
  MODAL_OFF_RAMP,
  MODAL_OFF_RAMP_SUCCESS,
  MODAL_PROGRESS,
  MODAL_QUESTIONS,
  MODAL_QUICK,
  MODAL_SUCCESS,
  type QuickNeed,
} from "@/content/modal";
import { submitQualification } from "@/lib/qualify";
import { leadPayloadSchema } from "@/lib/schema";

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
 * Flow screens: the quick door (Unit 04 — the low-friction primary
 * entry), the four question steps and the contact step (Business
 * Rules §1), the off-ramp (Rules 2.1–2.2, now with an email capture),
 * and the terminal submit screens (UX spec §Qualification modal;
 * failure per Rule 2.7).
 */
type Screen =
  | "quick"
  | QuestionKey
  | "contact"
  | "off_ramp"
  | "success"
  | "failure";

/** Steps the progress meter covers — the qualified path. */
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
  /** Quick door's optional multi-select needs (Sprint 03 adhoc). */
  projectTypes: QuickNeed[];
  /** Honeypot (Rule 2.8) — anything non-empty rejects at the schema. */
  hp: string;
}

const EMPTY_CONTACT: ContactFields = {
  name: "",
  email: "",
  company: "",
  details: "",
  projectTypes: [],
  hp: "",
};

/** Resolve a quick-door need value to the short label the visitor saw. */
function needLabel(value: string): string {
  return MODAL_QUICK.needsOptions.find((o) => o.value === value)?.label ?? value;
}

/*
 * The quick door's mutual-exclusion rule (Sprint 03 adhoc: a new build
 * and a product completion were either-or, so picking one greyed out
 * the other) retired with decision-log #53. The door now offers the two
 * offerings, which combine freely.
 */

/**
 * One label/value pair of a visitor's answers. Exported with
 * `ComposedAnswers` and `fallbackMailto` so the waitlist band's failure
 * fallback is this one, not a copy (decision-log #58, Rule 2.7).
 */
export interface ComposedAnswer {
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
  if (contact.projectTypes.length > 0) {
    composed.push({
      label: MODAL_QUICK.messageLabel,
      value: contact.projectTypes.map(needLabel).join("; "),
    });
  }
  if (contact.details !== "") {
    composed.push({ label: fields.details.label, value: contact.details });
  }
  return composed;
}

/* Visual language per the fin Zen Linen system (decision-log #47, #48):
 * fin's radius steps, `border` hairlines, the `card` glass, Playfair
 * display headings, JetBrains Mono micro-labels, and the flat coral
 * `brand` accent (no glows). Every focus indicator is `ring`. */

/* Panel heading at display scale: Playfair Display 700 (fin §1).
 * Exported for the waitlist band's failure fallback (#58). */
export const HEADING_CLASS =
  "font-serif text-2xl leading-[1.08] font-bold tracking-tight text-balance text-foreground outline-none md:text-3xl";

/**
 * Uppercase mono caption, the marquee label treatment, in
 * `muted-foreground`. Exported with `INPUT_CLASS` so the waitlist band's
 * field is this field, not a copy of it (decision-log #58).
 */
export const CAPTION_CLASS =
  "font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground";

export const INPUT_CLASS =
  "mt-2.5 w-full rounded-md border border-input bg-secondary px-4 py-3 text-base text-foreground " +
  "transition-colors duration-150 placeholder:text-muted-foreground " +
  "focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/* Hairline `secondary` rows with fin's `rounded-md`; hover moves to the
 * border; selected is a flat coral fill with `brand-foreground` text
 * (UX-spec pairing rule, decision-log #47), no glow. */
const OPTION_CLASS =
  "flex min-h-12 cursor-pointer items-center rounded-md border border-border bg-secondary " +
  "px-5 py-4 text-left text-base font-medium text-foreground transition-colors duration-150 " +
  "hover:border-muted-foreground/50 " +
  "has-checked:border-brand has-checked:bg-brand has-checked:text-brand-foreground " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring";

/* Single-select tabs replacing the quick door's free-text line: the same
 * selectable language as OPTION_CLASS (rounded-md, hairline, coral fill
 * on select) as a compact wrapping segmented set rather than full-width rows.
 * The greyed-out conflict state left with the exclusion rule (#53). */
const TAB_CLASS =
  "flex min-h-11 cursor-pointer items-center justify-start gap-2 rounded-md border border-border bg-secondary " +
  "px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors duration-150 " +
  "hover:border-muted-foreground/50 " +
  "has-checked:border-brand has-checked:bg-brand has-checked:text-brand-foreground " +
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring";

/* The check box rendered inside each tab (fin `rounded-sm`), the
 * multi-select affordance. Border/checkmark decoupled from the box fill:
 * `muted-foreground` border (about 4.6:1 on `secondary`, so the empty box
 * clears 3:1 non-text contrast; a `border` hairline is about 1.1:1 and
 * invisible) + hidden mark by default; `brand-foreground` border
 * + visible `brand-foreground` checkmark once the (sr-only) checkbox is
 * checked and the tab turns coral (decision-log #47, #48). */
const TAB_CHECK_CLASS =
  "flex size-4 shrink-0 items-center justify-center rounded-sm border border-muted-foreground " +
  "text-transparent transition-colors duration-150 " +
  "peer-checked:border-brand-foreground peer-checked:text-brand-foreground";

/* Forward action: the divided-arrow button (label segment + bordered
 * arrow box), hand-rolled from button.tsx's primary at the modal's own
 * arrow scale (a `px-3.5` box and an 18px arrow against Button's `px-4`
 * and 20px; build-note 34 records the copy). `primary` fill,
 * `primary-foreground` mark, fin `rounded-md`. State is shown by colour,
 * not scale (fin); only the arrow nudges. */
const ADVANCE_CLASS =
  "group/adv inline-flex min-h-11 items-stretch rounded-md bg-primary text-base font-medium text-primary-foreground " +
  "transition-colors duration-150 hover:bg-primary/90 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";

/* Secondary action: button.tsx's secondary/ghost recipe (`secondary`
 * fill, `border` hairline, `accent` on hover, fin `rounded-md`). */
const GHOST_CLASS =
  "inline-flex min-h-11 items-center rounded-md border border-border bg-secondary px-6 py-3 " +
  "text-base font-medium text-foreground transition-colors duration-150 " +
  "hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Inline checkmark — fills the tab's check box when a need is selected. */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/** Label segment + (optional) divided arrow box, for the advance button. */
function AdvanceInner({ label, arrow = true }: { label: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="flex items-center px-6 py-3">{label}</span>
      {arrow && (
        <span className="flex items-center border-l border-primary-foreground/20 px-3.5 py-3">
          <span className="transition-[translate] duration-150 motion-safe:group-hover/adv:translate-x-0.5">
            <ArrowIcon className="size-[18px]" />
          </span>
        </span>
      )}
    </>
  );
}

/**
 * Honeypot (Rule 2.8): visually and AT-hidden; bots fill it, the schema
 * rejects anything non-empty. Shared by every door's form (Unit 04) so
 * the quick path and off-ramp capture carry the same anti-bot guard as
 * the qualifier's contact step, and by the waitlist band (#58).
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      name="_hp"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute -left-[9999px] h-px w-px opacity-0"
    />
  );
}

const MAILTO = `mailto:${MODAL_ESCAPE_HATCH.email}`;

/**
 * The Rule 2.7 escape hatch with the visitor's answers in the body, so a
 * failed submit is one click from recovery. `subject` is optional: the
 * waitlist band has no approved subject line of its own (build-note 36).
 */
export function fallbackMailto(
  composed: readonly ComposedAnswer[],
  subject?: string,
): string {
  const body = encodeURIComponent(
    composed.map(({ label, value }) => `${label}\n${value}`).join("\n\n"),
  );
  return subject === undefined
    ? `${MAILTO}?body=${body}`
    : `${MAILTO}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

/** The failure fallback's summary of what the visitor entered (Rule 2.7). */
export function ComposedAnswers({
  composed,
}: {
  composed: readonly ComposedAnswer[];
}) {
  return (
    <dl className="mt-6 space-y-4 rounded-lg border border-border bg-secondary p-5">
      {composed.map(({ label, value }) => (
        <div key={label}>
          <dt className={CAPTION_CLASS}>{label}</dt>
          <dd className="mt-1 font-medium whitespace-pre-wrap text-foreground">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface QualificationModalProps {
  /** Fired after the native dialog closes; the provider unmounts us. */
  onClose: () => void;
  /**
   * Preselects one quick-door need — the service-card CTAs carry their
   * card's offering in here. Seeds initial state only: the visitor can
   * clear or change it like any other selection.
   */
  initialNeed?: QuickNeed;
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
 * @/lib/qualify. Styling follows the fin Zen Linen system
 * (decision-log #47, #48): fin radius steps, hairline borders, the
 * card glass, Playfair headings, mono labels, flat coral accent.
 */
export function QualificationModal({
  onClose,
  initialNeed,
}: QualificationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  /** Modal-open timestamp for the minimum-time check (Rule 2.8); set on mount. */
  const openedAt = useRef(0);
  const headingId = useId();
  /** Open to the quick door (Unit 04 — the low-friction primary path). */
  const [screen, setScreen] = useState<Screen>("quick");
  const [answers, setAnswers] = useState<Answers>({});
  /* Lazy initial state, not an effect: the preselection is there on
     first paint, so the tab never flashes unselected. Mounting fresh
     per open (E2) is what keeps this a seed rather than a lock. */
  const [contact, setContact] = useState<ContactFields>(() =>
    initialNeed === undefined
      ? EMPTY_CONTACT
      : { ...EMPTY_CONTACT, projectTypes: [initialNeed] },
  );
  const [submitting, setSubmitting] = useState(false);
  /**
   * The form a submit came from — so the failure-fallback's Back returns
   * to the right door (Rule 2.7) and the success screen can show the
   * gentler off-ramp confirmation when the lead was an "exploring" one.
   */
  const [returnScreen, setReturnScreen] = useState<Screen>("contact");

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

  /** Toggle a quick-door need on/off (multi-select, Sprint 03 adhoc). */
  const toggleNeed = (value: QuickNeed) =>
    setContact((current) => ({
      ...current,
      projectTypes: current.projectTypes.includes(value)
        ? current.projectTypes.filter((v) => v !== value)
        : [...current.projectTypes, value],
    }));

  const goNext = () => {
    if (isQuestionKey(screen) && answers[screen] !== undefined) {
      setScreen(screenAfter(screen, answers));
    }
  };

  /**
   * Back per Rule 1.6 — every step has one. From the quick door (the
   * entry) it closes; from Q1 it returns to the quick door it was
   * reached from; from the off-ramp it returns to whichever question
   * triggered Rule 2.1 so the answer can be changed (E1/E2); from the
   * failure-fallback it returns to the door that submitted (Rule 2.7).
   */
  const goBack = () => {
    switch (screen) {
      case "quick":
        close();
        break;
      case "project_type":
        setScreen("quick");
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
        setScreen(returnScreen);
        break;
      case "success":
        close();
        break;
    }
  };

  /**
   * Shared submit core for every door. The payload is re-validated
   * client-side against `leadPayloadSchema` first: "exploring" answers
   * can't reach the qualifier path (Rule 2.1 routed them to the
   * off-ramp) and can't pass the schema either, and a tripped honeypot
   * or sub-3s timing (Rule 2.8) parse-fails here. Either way a failure
   * goes to the fallback with answers preserved — the lead is never
   * silently dropped (Rule 2.7). `from` is recorded so the fallback's
   * Back and the success variant resolve to the right door.
   */
  const runSubmit = async (
    parsed: ReturnType<typeof leadPayloadSchema.safeParse>,
    from: Screen,
  ) => {
    setReturnScreen(from);
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

  /** Full qualifier (Business Rules §1) — the optional "tell us more" door. */
  const handleQualifiedSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = leadPayloadSchema.safeParse({
      kind: "qualified",
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
    void runSubmit(parsed, "contact");
  };

  /** Quick door (Unit 04) — name + email + an optional one-line message. */
  const handleQuickSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = leadPayloadSchema.safeParse({
      kind: "quick",
      source: "quick_door",
      name: contact.name,
      email: contact.email,
      project_types:
        contact.projectTypes.length > 0 ? contact.projectTypes : undefined,
      _hp: contact.hp,
      _t: Date.now() - openedAt.current,
    });
    void runSubmit(parsed, "quick");
  };

  /** Off-ramp email capture (Unit 04) — the honest "not yet" still leaves a contact. */
  const handleOffRampSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = leadPayloadSchema.safeParse({
      kind: "quick",
      source: "off_ramp",
      name: contact.name,
      email: contact.email,
      _hp: contact.hp,
      _t: Date.now() - openedAt.current,
    });
    void runSubmit(parsed, "off_ramp");
  };

  const composed = composeAnswers(answers, contact);
  const failureMailto = fallbackMailto(composed, MODAL_FAILURE_SUBJECT);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={headingId}
      className={[
        // Full-screen solid `card` on mobile; from md a centred glass
        // card (`card`/95 + blur, `border` hairline, fin `rounded-xl`,
        // decision-log #47, #48).
        "flex h-dvh max-h-none w-full max-w-none flex-col rounded-none bg-card p-0 text-foreground",
        "md:m-auto md:h-auto md:max-h-[85dvh] md:w-full md:max-w-[560px] md:rounded-xl md:border md:border-border md:bg-card/95 md:backdrop-blur-xl md:shadow-2xl",
        // backdrop color lives in globals.css (::backdrop var-inheritance quirk)
        "motion-safe:animate-modal-in",
      ].join(" ")}
    >
      <header className="flex items-center justify-between gap-4 px-6 pt-5 md:px-10 md:pt-7">
        {stepIndex === -1 ? (
          <span aria-hidden="true" />
        ) : (
          <div>
            <p className="sr-only">
              {MODAL_PROGRESS.step(stepIndex + 1, PROGRESS_STEPS.length)}
            </p>
            {/* Thin segmented meter: rounded-full segments, coral for
                steps reached, `muted-foreground` at 70% at rest (about 3.1:1 on
                `card`, fin's 3:1 floor for marks; decision-log #47). */}
            <div aria-hidden="true" className="flex items-center gap-1.5">
              {PROGRESS_STEPS.map((step, i) => (
                <span
                  key={step}
                  className={`h-[3px] w-7 rounded-full ${
                    i <= stepIndex ? "bg-brand" : "bg-muted-foreground/70"
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
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <CloseIcon />
        </button>
      </header>

      <div
        key={screen}
        className="min-h-0 grow overflow-y-auto px-6 py-6 md:px-10 md:py-8 motion-safe:animate-step-in"
      >
        {screen === "quick" && (
          <>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className={HEADING_CLASS}
            >
              {MODAL_QUICK.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground">
              {MODAL_QUICK.body}
            </p>
            <form onSubmit={handleQuickSubmit} className="mt-6">
              <div className="flex flex-col gap-5">
                <label className="block">
                  <span className={CAPTION_CLASS}>
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
                  <span className={CAPTION_CLASS}>
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
                <div className="block">
                  <span className={CAPTION_CLASS}>
                    {MODAL_QUICK.messageLabel}
                  </span>
                  {/* Multi-select tabs (optional): the two offerings
                      (#53), which combine freely. Picks are stored as
                      `project_types` → the Sheet's project_type column.
                      Stacked on mobile, side by side from sm up. */}
                  <div
                    role="group"
                    aria-label={MODAL_QUICK.messageLabel}
                    className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                  >
                    {MODAL_QUICK.needsOptions.map(({ value, label }) => (
                      <label key={value} className={TAB_CLASS}>
                        <input
                          type="checkbox"
                          name="quick_needs"
                          value={value}
                          checked={contact.projectTypes.includes(value)}
                          onChange={() => toggleNeed(value)}
                          className="peer sr-only"
                        />
                        <span aria-hidden="true" className={TAB_CHECK_CLASS}>
                          <CheckIcon />
                        </span>
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <HoneypotField
                value={contact.hp}
                onChange={(value) => setContact({ ...contact, hp: value })}
              />
              <div className="mt-8 flex items-center justify-between gap-4">
                <button type="button" onClick={goBack} className={GHOST_CLASS}>
                  {MODAL_NAV.back}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={ADVANCE_CLASS}
                >
                  <AdvanceInner label={MODAL_QUICK.submit} />
                </button>
              </div>
            </form>
            {/* Secondary path into the full four-question qualifier. */}
            <button
              type="button"
              onClick={() => setScreen("project_type")}
              className="group/more mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {MODAL_QUICK.toQualifier}
              <span className="transition-[translate] duration-150 motion-safe:group-hover/more:translate-x-0.5">
                <ArrowIcon className="size-[18px]" />
              </span>
            </button>
          </>
        )}

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
              className="mt-6 flex flex-col gap-2.5"
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
              <button type="button" onClick={goBack} className={GHOST_CLASS}>
                {MODAL_NAV.back}
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={answers[screen] === undefined}
                className={ADVANCE_CLASS}
              >
                <AdvanceInner label={MODAL_NAV.next} />
              </button>
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
            <form onSubmit={handleQualifiedSubmit} className="mt-6">
              <div className="flex flex-col gap-5">
                <label className="block">
                  <span className={CAPTION_CLASS}>
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
                  <span className={CAPTION_CLASS}>
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
                  <span className={CAPTION_CLASS}>
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
                  <span className={CAPTION_CLASS}>
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
              <HoneypotField
                value={contact.hp}
                onChange={(value) => setContact({ ...contact, hp: value })}
              />
              <div className="mt-8 flex items-center justify-between gap-4">
                <button type="button" onClick={goBack} className={GHOST_CLASS}>
                  {MODAL_NAV.back}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={ADVANCE_CLASS}
                >
                  <AdvanceInner label={MODAL_CONTACT.submit} />
                </button>
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
            <p className="mt-4 text-base leading-relaxed text-foreground">
              {MODAL_OFF_RAMP.body}
            </p>
            <p className="mt-6 text-base leading-relaxed">
              {MODAL_OFF_RAMP.closing}{" "}
              <a
                href={MAILTO}
                className="font-medium text-brand underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {MODAL_ESCAPE_HATCH.email}
              </a>
            </p>
            {/* Optional email capture (Unit 04): an honest "stay in touch,"
                not a hard sell (Rule 2.2 intent preserved). */}
            <form
              onSubmit={handleOffRampSubmit}
              className="mt-8 border-t border-border pt-6"
            >
              <p className="text-base leading-relaxed text-foreground">
                {MODAL_OFF_RAMP.capture.prompt}
              </p>
              <div className="mt-5 flex flex-col gap-5">
                <label className="block">
                  <span className={CAPTION_CLASS}>
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
                  <span className={CAPTION_CLASS}>
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
              </div>
              <HoneypotField
                value={contact.hp}
                onChange={(value) => setContact({ ...contact, hp: value })}
              />
              <div className="mt-8 flex items-center justify-between gap-4">
                <button type="button" onClick={goBack} className={GHOST_CLASS}>
                  {MODAL_NAV.back}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={ADVANCE_CLASS}
                >
                  <AdvanceInner label={MODAL_OFF_RAMP.capture.submit} />
                </button>
              </div>
            </form>
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
              {returnScreen === "off_ramp"
                ? MODAL_OFF_RAMP_SUCCESS.headline
                : MODAL_SUCCESS.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground">
              {returnScreen === "off_ramp"
                ? MODAL_OFF_RAMP_SUCCESS.body
                : MODAL_SUCCESS.body}
            </p>
            <div className="mt-8">
              <button type="button" onClick={close} className={ADVANCE_CLASS}>
                <AdvanceInner label={MODAL_NAV.close} arrow={false} />
              </button>
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
            <p className="mt-4 text-base leading-relaxed text-foreground">
              {MODAL_FAILURE.body}
            </p>
            <ComposedAnswers composed={composed} />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={goBack} className={GHOST_CLASS}>
                {MODAL_NAV.back}
              </button>
              <a href={failureMailto} className={ADVANCE_CLASS}>
                <AdvanceInner label={MODAL_ESCAPE_HATCH.email} />
              </a>
            </div>
          </>
        )}
      </div>

      {/* Escape hatch, persistent at every step (Rule 2.6). */}
      <footer className="flex items-center gap-2 border-t border-border px-6 py-4 md:px-10">
        <span className={CAPTION_CLASS}>{MODAL_ESCAPE_HATCH.prompt}</span>
        <a
          href={MAILTO}
          className="text-sm font-medium text-brand underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {MODAL_ESCAPE_HATCH.email}
        </a>
      </footer>
    </dialog>
  );
}
