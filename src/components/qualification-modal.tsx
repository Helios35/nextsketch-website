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
  MODAL_PROGRESS,
  MODAL_QUESTIONS,
  MODAL_QUICK,
  MODAL_STEP2,
  MODAL_SUCCESS,
  type QuickNeed,
} from "@/content/modal";
import { submitQualification, type QualifyResult } from "@/lib/qualify";
import { EXPLORING, leadPayloadSchema } from "@/lib/schema";

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
 * Flow screens (decision-log #65, email-first): step 1 is the quick door
 * (Rule 1.7: first name, last name, email and at least one offering),
 * which saves the lead;
 * step 2 is the four question steps and the contact step (Business
 * Rules §1), every one optional, attaching to that lead; then the
 * terminal screens: success, the off-ramp as step 2's ending for a
 * still-exploring answer (Rules 2.1–2.2), and the failure fallback
 * (Rule 2.7).
 */
type Screen =
  | "quick"
  | QuestionKey
  | "contact"
  | "off_ramp"
  | "success"
  | "failure";

/** Steps the progress meter covers: step 2's screens. */
const PROGRESS_STEPS = [...QUESTION_ORDER, "contact"] as const;

function isQuestionKey(screen: Screen): screen is QuestionKey {
  return (QUESTION_ORDER as readonly string[]).includes(screen);
}

/**
 * Branch evaluation, run on every Next press against the *current*
 * answers — which is what makes E1 hold: going back and changing Q1
 * to "I'm still exploring" re-evaluates Rule 2.1 and routes to the
 * off-ramp regardless of how far the visitor had advanced. An
 * unanswered question is passed over (#65: every one is optional).
 */
function screenAfter(key: QuestionKey, answers: Answers): Screen {
  switch (key) {
    case "project_type":
      return answers.project_type === EXPLORING ? "off_ramp" : "readiness";
    case "readiness":
      return answers.readiness === EXPLORING ? "off_ramp" : "authority";
    case "authority":
      return "validation";
    case "validation":
      return "contact";
  }
}

/**
 * The answers a step 2 submit sends: every answer in order, up to and
 * including the first "still exploring". Rule 2.1 ends the questions
 * there, so answers left from an earlier pass (E1: the visitor went back
 * and changed Q1) are not sent with it.
 */
function submittedAnswers(answers: Answers): Answers {
  const sent: Answers = {};
  for (const key of QUESTION_ORDER) {
    const value = answers[key];
    if (value === undefined) continue;
    Object.assign(sent, { [key]: value });
    if (value === EXPLORING) break;
  }
  return sent;
}

interface ContactFields {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  details: string;
  /** Step 1's offerings: at least one before it sends (#65). */
  projectTypes: QuickNeed[];
  /** Honeypot (Rule 2.8) — anything non-empty rejects at the schema. */
  hp: string;
}

const EMPTY_CONTACT: ContactFields = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  details: "",
  projectTypes: [],
  hp: "",
};

/** An optional text field as the payload carries it: blank is absent. */
function optional(value: string): string | undefined {
  return value.trim() === "" ? undefined : value;
}

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
 * fallback runs on these mechanics rather than copies of them; its
 * words are its own (decision-log #58, Rule 2.7).
 */
export interface ComposedAnswer {
  label: string;
  value: string;
}

/**
 * The visitor's answers as label/value pairs — rendered on the
 * failure screen and carried in the fallback mailto body so nothing
 * is lost (Rule 2.7). Labels are the canonical question/field copy.
 * Step 1's name, email and offerings come first; step 2's answers
 * follow when there are any.
 */
function composeAnswers(
  answers: Answers,
  contact: ContactFields,
): ComposedAnswer[] {
  const { fields } = MODAL_CONTACT;
  const composed: ComposedAnswer[] = [
    { label: fields.firstName.label, value: contact.firstName },
    { label: fields.lastName.label, value: contact.lastName },
    { label: fields.email.label, value: contact.email },
  ];
  if (contact.projectTypes.length > 0) {
    composed.push({
      label: MODAL_QUICK.messageLabel,
      value: contact.projectTypes.map(needLabel).join("; "),
    });
  }
  for (const key of QUESTION_ORDER) {
    const { question, options } = MODAL_QUESTIONS[key];
    const selected = options.find((option) => option.value === answers[key]);
    if (selected !== undefined) {
      composed.push({ label: question, value: selected.label });
    }
  }
  for (const key of ["company", "details"] as const) {
    if (optional(contact[key]) !== undefined) {
      composed.push({ label: fields[key].label, value: contact[key] });
    }
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

/* Step 2's first question sits under the step 2 heading (#65), so it
 * steps down one size from HEADING_CLASS; same face and weight. */
const QUESTION_CLASS =
  "mt-8 font-serif text-xl leading-snug font-bold tracking-tight text-balance text-foreground md:text-2xl";

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

/* "Skip for now" (#65): a quiet text control in the header, beside the
 * close button, so it is in the same place on every step 2 screen and
 * never scrolls away. The muted-to-foreground hover is the retired
 * side-door link's treatment. */
const SKIP_CLASS =
  "inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-muted-foreground " +
  "underline underline-offset-4 transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

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
 * rejects anything non-empty. Shared by both steps' forms so each send
 * carries the same anti-bot guard, and by the waitlist band (#58).
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
 * failed submit is one click from recovery. Each caller names its own
 * subject: the modal's `MODAL_FAILURE_SUBJECT`, the waitlist band's
 * `SERVICES_WAITLIST.failure.subject` (decision-log #58).
 */
export function fallbackMailto(
  composed: readonly ComposedAnswer[],
  subject: string,
): string {
  return `${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    composed.map(({ label, value }) => `${label}\n${value}`).join("\n\n"),
  )}`;
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
   * Preselects one step 1 offering — the service cards, tiers and route
   * CTAs carry their offering in here. Seeds initial state only: the
   * visitor can clear or change it like any other selection.
   */
  initialNeed?: QuickNeed;
}

/**
 * The qualification modal — Business Rules §1–2 as a client-side
 * state machine (docs/07-technical-spec.md §Business logic). Overlay,
 * no route: the builder's call docs/03-site-architecture.md
 * delegates, recorded in briefs/build-notes/06-qualification-modal.md.
 *
 * Email-first (decision-log #65): step 1 asks first name, last name,
 * email and at least one offering, all required, and saves the lead; the
 * server answers with a lead ID. Step 2 asks the qualifier questions,
 * company and "tell us about it", every one optional, with "Skip for now" in the
 * header on every screen, and sends what was given as a follow-up on
 * that lead ID, so it lands on the same lead. A still-exploring answer
 * is sent at once and ends on the off-ramp's message.
 *
 * Mounted fresh on every open (E2: no cooldown, always fresh) on a
 * native <dialog> via showModal() — focus trap, Esc-to-close, and
 * top-layer rendering are the platform's. Escape hatch on every screen
 * (Rule 2.6) and a back control on every step but step 2's first, which
 * follows a step already sent (Rule 1.6). No success is ever shown for
 * a send that was not durably recorded (Rule 2.7) — see @/lib/qualify.
 * Styling follows the fin Zen Linen system (decision-log #47, #48): fin
 * radius steps, hairline borders, the card glass, Playfair headings,
 * mono labels, flat coral accent.
 */
export function QualificationModal({
  onClose,
  initialNeed,
}: QualificationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstNeedRef = useRef<HTMLInputElement>(null);
  /** Modal-open timestamp for the minimum-time check (Rule 2.8); set on mount. */
  const openedAt = useRef(0);
  const headingId = useId();
  const questionId = useId();
  const needsErrorId = useId();
  /** Open on step 1 (#65). */
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
  /** Step 1 sent with no box checked: show the message until one is. */
  const [needsError, setNeedsError] = useState(false);
  /** The ID step 1's lead was saved under; step 2 sends it back (#65). */
  const [leadId, setLeadId] = useState<string | null>(null);
  /** The screen a send came from, so the failure fallback's Back returns there (Rule 2.7). */
  const [returnScreen, setReturnScreen] = useState<Screen>("quick");

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
  const inStep2 = stepIndex !== -1;

  const setAnswer = <K extends QuestionKey>(key: K, value: Answers[K]) =>
    setAnswers((current) => ({ ...current, [key]: value }));

  /** Toggle a step 1 offering on/off (multi-select, Sprint 03 adhoc). */
  const toggleNeed = (value: QuickNeed) => {
    const checking = !contact.projectTypes.includes(value);
    if (checking) setNeedsError(false);
    setContact((current) => ({
      ...current,
      projectTypes: checking
        ? [...current.projectTypes, value]
        : current.projectTypes.filter((v) => v !== value),
    }));
  };

  /**
   * Back per Rule 1.6. From step 1 (the entry) it closes; step 2's first
   * screen has none, since step 1 is already sent (#65); every later
   * step 2 screen goes back one; the failure fallback returns to the
   * screen that sent (Rule 2.7).
   */
  const goBack = () => {
    switch (screen) {
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
      case "failure":
        setScreen(returnScreen);
        break;
      default:
        close();
    }
  };

  /**
   * Shared send core for both steps. The payload is re-validated
   * client-side against `leadPayloadSchema` first, so a tripped
   * honeypot or sub-3s timing (Rule 2.8) parse-fails here. Either way a
   * failure goes to the fallback with answers preserved — the lead is
   * never silently dropped (Rule 2.7). `from` is recorded so the
   * fallback's Back resolves to the right screen; `next` picks the
   * screen a durable send moves to.
   */
  const runSubmit = async (
    parsed: ReturnType<typeof leadPayloadSchema.safeParse>,
    from: Screen,
    next: (result: QualifyResult) => Screen,
  ) => {
    setReturnScreen(from);
    if (!parsed.success) {
      setScreen("failure");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitQualification(parsed.data);
      setScreen(result.ok ? next(result) : "failure");
    } catch {
      // Rule 2.7: preserve the composed answers, show the escape hatch.
      setScreen("failure");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Step 1 (Rule 1.7, #65): first name, last name, email and at least
   * one offering. The browser's own validation holds back a missing name
   * or a missing or malformed email; no box checked holds back here with
   * a message under the boxes and
   * focus on the first one. A durable save moves on to step 2 with the
   * lead ID the server returned (with none, there is nothing to attach
   * to, so it ends on success).
   */
  const handleQuickSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contact.projectTypes.length === 0) {
      setNeedsError(true);
      firstNeedRef.current?.focus();
      return;
    }
    const parsed = leadPayloadSchema.safeParse({
      kind: "quick",
      source: "quick_door",
      first_name: contact.firstName,
      last_name: contact.lastName,
      email: contact.email,
      project_types: contact.projectTypes,
      _hp: contact.hp,
      _t: Date.now() - openedAt.current,
    });
    void runSubmit(parsed, "quick", (result) => {
      if (result.leadId === undefined) return "success";
      setLeadId(result.leadId);
      return "project_type";
    });
  };

  /**
   * End step 2 from `from`: the final submit, "Skip for now", or a
   * still-exploring Next (#65). Whatever was given is sent as one
   * follow-up on the step 1 lead; nothing given sends nothing. The
   * ending is the off-ramp's message when an answer was "still
   * exploring" (Rule 2.1), the success screen otherwise.
   */
  const finishStep2 = (from: Screen) => {
    const given = submittedAnswers(answers);
    const exploring =
      given.project_type === EXPLORING || given.readiness === EXPLORING;
    const ending: Screen = exploring ? "off_ramp" : "success";
    const payload = {
      ...given,
      company: optional(contact.company),
      details: optional(contact.details),
    };
    if (leadId === null || Object.values(payload).every((v) => v === undefined)) {
      setScreen(ending);
      return;
    }
    const parsed = leadPayloadSchema.safeParse({
      kind: "followup",
      lead_id: leadId,
      first_name: contact.firstName,
      last_name: contact.lastName,
      email: contact.email,
      project_types: contact.projectTypes,
      ...payload,
      _hp: contact.hp,
      _t: Date.now() - openedAt.current,
    });
    void runSubmit(parsed, from, () => ending);
  };

  /** Next on a question: move on, or end step 2 on "still exploring". */
  const goNext = () => {
    if (!isQuestionKey(screen)) return;
    const next = screenAfter(screen, answers);
    if (next === "off_ramp") finishStep2(screen);
    else setScreen(next);
  };

  /** Step 2's last screen: the contact fields' submit. */
  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    finishStep2("contact");
  };

  const composed = composeAnswers(submittedAnswers(answers), contact);
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
      <header className="flex items-center justify-between gap-3 px-6 pt-5 md:px-10 md:pt-7">
        {inStep2 ? (
          <div>
            <p className="sr-only">
              {MODAL_PROGRESS.step(stepIndex + 1, PROGRESS_STEPS.length)}
            </p>
            {/* Thin segmented meter: rounded-full segments, coral for
                steps reached, `muted-foreground` at 70% at rest (about 3.1:1 on
                `card`, fin's 3:1 floor for marks; decision-log #47).
                Narrower segments below sm leave the header room for
                "Skip for now" (#65). */}
            <div aria-hidden="true" className="flex items-center gap-1.5">
              {PROGRESS_STEPS.map((step, i) => (
                <span
                  key={step}
                  className={`h-[3px] w-5 rounded-full sm:w-7 ${
                    i <= stepIndex ? "bg-brand" : "bg-muted-foreground/70"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <span aria-hidden="true" />
        )}
        <div className="flex items-center gap-1">
          {inStep2 && (
            <button
              type="button"
              onClick={() => finishStep2(screen)}
              disabled={submitting}
              className={SKIP_CLASS}
            >
              {MODAL_STEP2.skip}
            </button>
          )}
          <button
            type="button"
            aria-label={MODAL_NAV.close}
            onClick={close}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <CloseIcon />
          </button>
        </div>
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
                {/* First and last name, required (#65, amended
                    2026-10-21): side by side at every width, so step 1
                    keeps the two field rows it had (name, email) and
                    "Talk to Us" stays in view on a 360px phone. */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <label className="block">
                    <span className={CAPTION_CLASS}>
                      {MODAL_CONTACT.fields.firstName.label}
                    </span>
                    <input
                      type="text"
                      name="first_name"
                      required
                      maxLength={MODAL_CONTACT.fields.firstName.maxLength}
                      autoComplete="given-name"
                      value={contact.firstName}
                      onChange={(e) =>
                        setContact({ ...contact, firstName: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </label>
                  <label className="block">
                    <span className={CAPTION_CLASS}>
                      {MODAL_CONTACT.fields.lastName.label}
                    </span>
                    <input
                      type="text"
                      name="last_name"
                      required
                      maxLength={MODAL_CONTACT.fields.lastName.maxLength}
                      autoComplete="family-name"
                      value={contact.lastName}
                      onChange={(e) =>
                        setContact({ ...contact, lastName: e.target.value })
                      }
                      className={INPUT_CLASS}
                    />
                  </label>
                </div>
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
                  {/* Multi-select tabs: the two offerings (#53), which
                      combine freely; at least one before step 1 sends
                      (#65). Picks are stored as `project_types` → the
                      Sheet's project_type column. Stacked on mobile,
                      side by side from sm up. */}
                  <div
                    role="group"
                    aria-label={MODAL_QUICK.messageLabel}
                    aria-describedby={needsError ? needsErrorId : undefined}
                    className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                  >
                    {MODAL_QUICK.needsOptions.map(({ value, label }, i) => (
                      <label key={value} className={TAB_CLASS}>
                        <input
                          ref={i === 0 ? firstNeedRef : undefined}
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
                  {/* `destructive` on `card` is about 4.5:1. */}
                  {needsError && (
                    <p
                      id={needsErrorId}
                      role="alert"
                      className="mt-2.5 text-sm font-medium text-destructive"
                    >
                      {MODAL_QUICK.needsRequired}
                    </p>
                  )}
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
          </>
        )}

        {isQuestionKey(screen) && (
          <>
            {/* Step 2 opens under its own heading and body (#65); the
                first question sits below them. From Q2 the question is
                the heading again. */}
            {screen === "project_type" ? (
              <>
                <h2
                  id={headingId}
                  ref={headingRef}
                  tabIndex={-1}
                  className={HEADING_CLASS}
                >
                  {MODAL_STEP2.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-foreground">
                  {MODAL_STEP2.body}
                </p>
                <h3 id={questionId} className={QUESTION_CLASS}>
                  {MODAL_QUESTIONS.project_type.question}
                </h3>
              </>
            ) : (
              <h2
                id={headingId}
                ref={headingRef}
                tabIndex={-1}
                className={HEADING_CLASS}
              >
                {MODAL_QUESTIONS[screen].question}
              </h2>
            )}
            <div
              role="radiogroup"
              aria-labelledby={screen === "project_type" ? questionId : headingId}
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
              {screen === "project_type" ? (
                <span aria-hidden="true" />
              ) : (
                <button type="button" onClick={goBack} className={GHOST_CLASS}>
                  {MODAL_NAV.back}
                </button>
              )}
              <button
                type="button"
                onClick={goNext}
                disabled={submitting}
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
            <form onSubmit={handleContactSubmit} className="mt-6">
              <div className="flex flex-col gap-5">
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
            <div className="mt-8">
              <button type="button" onClick={close} className={ADVANCE_CLASS}>
                <AdvanceInner label={MODAL_NAV.close} arrow={false} />
              </button>
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
            <p className="mt-4 text-base leading-relaxed text-foreground">
              {MODAL_SUCCESS.body}
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
