"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import {
  CAPTION_CLASS,
  ComposedAnswers,
  fallbackMailto,
  HEADING_CLASS,
  HoneypotField,
  INPUT_CLASS,
  type ComposedAnswer,
} from "@/components/qualification-modal";
import { ScrollReveal } from "@/components/scroll-reveal";
import { MODAL_ESCAPE_HATCH, MODAL_NAV } from "@/content/modal";
import { SERVICES_WAITLIST } from "@/content/services";
import { submitQualification } from "@/lib/qualify";
import { leadPayloadSchema } from "@/lib/schema";

type Status = "idle" | "submitting" | "success" | "failure";

/**
 * The waitlist band inside Services, under the two cards (decision-log
 * **#58**): an email for the installable product that took Internal
 * Tool's place (#53). A band, not a section: no index, no heading of
 * its own, no nav item.
 *
 * **One capture path, not a second one.** It submits through the
 * modal's seam (`submitQualification` → `POST /api/qualify`), so the
 * entry is re-validated server-side, written to the Sheet that gates
 * success and alerted to Nate (Rule 2.4) under its own `[Waitlist]`
 * label (`kind: "waitlist"`). No Asana task and no auto-reply (owner
 * direction, 2026-10-15). It carries the same anti-bot guards (Rule
 * 2.8): the shared honeypot, and the minimum-time check measured from
 * when the band mounted. Its failure fallback (Rule 2.7) is its own
 * copy (owner, 2026-10-15) over the modal's mechanics: the visitor's
 * entry preserved on screen, and the escape hatch with the entry in the
 * body under the band's own subject. The field, the honeypot, the
 * summary and the mailto builder are the modal's exports, not copies.
 *
 * **No success is shown for an entry that was not stored**: `ok` is the
 * server's verdict, which is true only once the Sheet row is written.
 *
 * **No JS:** the form's action is the escape-hatch mailto, so a submit
 * still reaches a person (Business Rules E3) rather than putting the
 * address in a URL. With JS the submit is intercepted.
 *
 * Focus follows the outcome, as the modal's does: the confirmation or
 * the fallback heading takes focus when it appears, and Back returns it
 * to the field. Nothing moves focus on page load.
 */
export function WaitlistBand() {
  /** When the band mounted, for the minimum-time check (Rule 2.8). */
  const shownAt = useRef(0);
  const successRef = useRef<HTMLParagraphElement>(null);
  const failureRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const settled = useRef(false);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }
    if (status === "success") successRef.current?.focus();
    else if (status === "failure") failureRef.current?.focus();
    else if (status === "idle") inputRef.current?.focus();
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /* Re-validated client-side first, exactly as the modal does: a
       tripped honeypot or a sub-3s submit parse-fails here and goes to
       the fallback with nothing sent. */
    const parsed = leadPayloadSchema.safeParse({
      kind: "waitlist",
      email,
      _hp: hp,
      _t: Date.now() - shownAt.current,
    });
    if (!parsed.success) {
      setStatus("failure");
      return;
    }
    setStatus("submitting");
    try {
      const result = await submitQualification(parsed.data);
      setStatus(result.ok ? "success" : "failure");
    } catch {
      setStatus("failure");
    }
  };

  const composed: ComposedAnswer[] = [
    { label: SERVICES_WAITLIST.fieldLabel, value: email },
  ];

  return (
    <ScrollReveal delay={280} className="mt-10 border-t border-border pt-8 md:mt-12 md:pt-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-12">
        <div>
          <p className={CAPTION_CLASS}>{SERVICES_WAITLIST.eyebrow}</p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground md:text-lg">
            {SERVICES_WAITLIST.line}
          </p>
        </div>
        <div>
          {status === "success" && (
            /* The /pricing term line's treatment: the coral list
               marker beside a medium-weight line. */
            <p
              ref={successRef}
              tabIndex={-1}
              className="flex gap-3 text-base leading-relaxed font-medium text-foreground outline-none md:text-lg"
            >
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-brand"
              />
              {SERVICES_WAITLIST.success}
            </p>
          )}
          {status === "failure" && (
            <>
              <h3 ref={failureRef} tabIndex={-1} className={HEADING_CLASS}>
                {SERVICES_WAITLIST.failure.headline}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-foreground">
                {SERVICES_WAITLIST.failure.body}
              </p>
              <ComposedAnswers composed={composed} />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStatus("idle")}
                >
                  {MODAL_NAV.back}
                </Button>
                <Button
                  href={fallbackMailto(composed, SERVICES_WAITLIST.failure.subject)}
                  arrow
                >
                  {MODAL_ESCAPE_HATCH.email}
                </Button>
              </div>
            </>
          )}
          {(status === "idle" || status === "submitting") && (
            <form
              action={`mailto:${MODAL_ESCAPE_HATCH.email}`}
              method="post"
              encType="text/plain"
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <label className="block grow">
                <span className={CAPTION_CLASS}>{SERVICES_WAITLIST.fieldLabel}</span>
                <input
                  ref={inputRef}
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT_CLASS}
                />
              </label>
              <HoneypotField value={hp} onChange={setHp} />
              {/* The `secondary` fill, not the stone advance: a waitlist
                  is a non-conversion action (Rule 3.1 carve-out, #58),
                  and the two offers' CTAs above stay the section's
                  primary asks. */}
              <Button
                type="submit"
                variant="secondary"
                disabled={status === "submitting"}
              >
                {SERVICES_WAITLIST.submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
