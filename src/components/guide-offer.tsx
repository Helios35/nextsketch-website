"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { CloseIcon } from "@/components/close-icon";
import {
  CAPTION_CLASS,
  fallbackMailto,
  HoneypotField,
  INPUT_CLASS,
  type ComposedAnswer,
} from "@/components/qualification-modal";
import { useQualificationModal } from "@/components/qualification-modal-provider";
import { GUIDE_ASSETS, GUIDE_OFFER } from "@/content/guide";
import { MODAL_ESCAPE_HATCH } from "@/content/modal";
import { markGuideOffer, useGuideOfferMark } from "@/lib/guide-offer";
import { submitQualification } from "@/lib/qualify";
import { leadPayloadSchema } from "@/lib/schema";
import { ROUTES } from "@/lib/types";

type Status = "idle" | "submitting" | "success" | "failure";

/**
 * How far down the page counts as "a bit of a scroll": half a viewport.
 * Far enough that a visitor has chosen to read on, near enough that it
 * shows on every page that scrolls at all.
 */
const SCROLL_TRIGGER = 0.5;

/** Save the guide under its clean name (the PDF is same-origin). */
function downloadGuide(): void {
  const link = document.createElement("a");
  link.href = GUIDE_ASSETS.pdf;
  link.download = GUIDE_ASSETS.downloadName;
  document.body.append(link);
  link.click();
  link.remove();
}

/**
 * The free guide card (decision-log **#76**): a toast that offers "The
 * Small Business Guide to AI" for a name and an email.
 *
 * **When it shows.** Once a visitor scrolls half a viewport down a page,
 * on every route but `/pricing` (where they are already close to the
 * form). Never on load, never server-rendered (so no-JS visitors never
 * see it), and never while the form (the qualification modal) is open.
 * It steps aside while another form on the page is on screen (the
 * waitlist band), unless the visitor is using the card. Once they close
 * it, get the guide, or send the form, it is done for them for good
 * (`src/lib/guide-offer.ts`).
 *
 * **One capture path, not a second one.** It submits through the
 * modal's seam (`submitQualification` → `POST /api/qualify`) as `kind:
 * "guide"`, so the lead is re-validated server-side, written to the
 * Sheet that gates success, tasked in Asana and alerted to Nate under
 * `[Guide lead]`, and the guide email goes out in place of the
 * auto-reply. Same anti-bot guards (Rule 2.8): the modal's honeypot,
 * and the minimum time measured from when the card appeared. The field,
 * caption, honeypot, button and mailto builder are the modal's and the
 * site's own, not copies.
 *
 * **The download only follows a save.** `ok` is the server's verdict,
 * true only once the Sheet row is written; then the PDF downloads and
 * the thank-you shows. Anything else keeps what they typed and shows
 * the failure line with the escape hatch (Rule 2.7), nothing downloaded.
 *
 * **Indigo.** The card is the site's `chart-2` indigo, the `guide`
 * token, used here and nowhere else. Everything on it is `guide-
 * foreground` (the page's dark step, 5.71:1). The card re-points two
 * tokens for its own subtree: `muted-foreground` (the shared caption's
 * colour, 1.07:1 on indigo) and `ring` (the focus outline, 2.06:1 on
 * indigo) both become `guide-foreground`, so the shared field and
 * caption pass on it. The fields and the button keep their dark fills,
 * which read 4.94:1 against the card (3.75:1 on hover).
 *
 * **Calm.** It never takes focus when it appears; a polite live region
 * says it is there. It comes first in the document, so the first Tab on
 * a page reaches it. Esc closes it when focus is in it or nowhere.
 * Under reduced motion it appears without the slide (the `motion-safe`
 * gate, and the base layer's reduced-motion block).
 */
export function GuideOffer() {
  const pathname = usePathname();
  const { isOpen: formOpen } = useQualificationModal();
  const mark = useGuideOfferMark();
  const cardRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  /** When the card first appeared, for the minimum-time check (Rule 2.8). */
  const shownAt = useRef(0);
  const headingId = useId();
  /** Latched once the visitor scrolls far enough on a page it shows on. */
  const [triggered, setTriggered] = useState(false);
  /** The path on which another form is on screen, if any. */
  const [formInViewOn, setFormInViewOn] = useState<string | null>(null);
  const [focusInside, setFocusInside] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");

  const onPricing = pathname === ROUTES.pricing;
  /* Done for this visitor, unless it is the download this card just made
     (its thank-you stays until they close it). */
  const available = mark === null || (mark === "downloaded" && status === "success");
  const formInView = formInViewOn === pathname;
  const visible =
    available &&
    triggered &&
    !onPricing &&
    !formOpen &&
    (!formInView || focusInside || status !== "idle");
  /* Mounted (hidden) before it is due, so the cover is already loaded when
     it slides in; kept mounted while it steps aside, so nothing typed is
     lost. Never on `/pricing` unless it already showed elsewhere. */
  const mounted = available && (triggered || !onPricing);

  /* The trigger: half a viewport down any page but /pricing. */
  useEffect(() => {
    if (triggered || onPricing || mark !== null) return;
    const check = () => {
      if (window.scrollY >= window.innerHeight * SCROLL_TRIGGER) setTriggered(true);
    };
    const frame = requestAnimationFrame(check);
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
    };
  }, [triggered, onPricing, mark]);

  /* Step aside while another form on the page is on screen. */
  useEffect(() => {
    if (!mounted) return;
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.isConnected) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setFormInViewOn(onScreen.size > 0 ? pathname : null);
    });
    for (const form of document.querySelectorAll("form")) {
      if (!cardRef.current?.contains(form)) observer.observe(form);
    }
    return () => observer.disconnect();
  }, [mounted, pathname]);

  /* Start the minimum-time clock the first time it shows. */
  useEffect(() => {
    if (visible && shownAt.current === 0) shownAt.current = Date.now();
  }, [visible]);

  /* Esc closes it, when focus is in the card or nowhere at all, so the
     key never closes it on its way to the nav menu or another control. */
  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const active = document.activeElement;
      const inCard = active instanceof Node && cardRef.current?.contains(active);
      if (inCard || active === null || active === document.body) {
        markGuideOffer("closed");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  /* The visitor asked for this one: the thank-you takes focus, and the
     card is done for them once it has rendered. */
  useEffect(() => {
    if (status !== "success") return;
    successRef.current?.focus();
    markGuideOffer("downloaded");
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /* Re-validated client-side first, exactly as the modal does: a
       tripped honeypot or a sub-3s submit parse-fails here and shows the
       failure line with nothing sent. */
    const parsed = leadPayloadSchema.safeParse({
      kind: "guide",
      name,
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
      if (result.ok) {
        downloadGuide();
        setStatus("success");
      } else {
        setStatus("failure");
      }
    } catch {
      setStatus("failure");
    }
  };

  const composed: ComposedAnswer[] = [
    { label: GUIDE_OFFER.fields.name.label, value: name },
    { label: GUIDE_OFFER.fields.email.label, value: email },
  ];

  return (
    <>
      {mounted && (
        <aside
          ref={cardRef}
          data-guide-offer=""
          aria-labelledby={headingId}
          hidden={!visible}
          onFocus={() => setFocusInside(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setFocusInside(false);
            }
          }}
          className={[
            // A toast: the bottom edge on a phone (12px gutters), the
            // bottom-right corner from sm, 480px wide there (it was 400px
            // and read cramped, Nate 2026-11-12). Below the nav bar (z-40)
            // and its menu (z-50), and never taller than the space under
            // the bar.
            "fixed inset-x-3 bottom-3 z-30 max-h-[calc(100dvh-6rem)] overflow-y-auto",
            "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[30rem]",
            "rounded-xl bg-guide text-guide-foreground shadow-guide",
            // The two tokens the shared caption and focus outline read,
            // re-pointed for this indigo surface (see the doc block).
            "[--muted-foreground:var(--guide-foreground)] [--ring:var(--guide-foreground)]",
            // Slides up and grows upward a little, motion-safe only.
            "origin-bottom motion-safe:animate-guide-in",
          ].join(" ")}
        >
          {/* The phone layout stays tight (every pixel covers the page);
              from sm the card has room, so it breathes: wider padding,
              a larger cover and heading, a step up in body size and more
              space between the rows. */}
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-3.5 pr-10 sm:gap-5">
              {/* The cover, cropped to the book by its frame (the file is
                  the delivered image, a book on black). Decorative: the
                  heading beside it says what it is. */}
              <div className="relative aspect-[5/7] w-14 shrink-0 overflow-hidden rounded-md sm:w-20">
                <Image
                  src={GUIDE_ASSETS.cover}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(min-width: 640px) 112px, 79px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 sm:pt-1">
                <p className={CAPTION_CLASS}>{GUIDE_OFFER.eyebrow}</p>
                <h2
                  id={headingId}
                  className="mt-1.5 font-serif text-lg leading-tight font-bold tracking-tight text-balance sm:mt-2 sm:text-2xl"
                >
                  {GUIDE_OFFER.heading}
                </h2>
              </div>
            </div>
            <p className="mt-3 text-sm leading-snug sm:mt-5 sm:text-base sm:leading-relaxed">
              {GUIDE_OFFER.body}
            </p>
            <button
              type="button"
              aria-label={GUIDE_OFFER.close}
              onClick={() => markGuideOffer("closed")}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 inline-flex size-11 items-center justify-center rounded-md transition-colors duration-150 hover:bg-guide-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <CloseIcon />
            </button>

            {status === "success" ? (
              <p
                ref={successRef}
                tabIndex={-1}
                role="status"
                className="mt-4 text-base leading-snug font-medium outline-none sm:mt-5 sm:text-lg"
              >
                {GUIDE_OFFER.success}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  <label className="block min-w-0">
                    <span className={CAPTION_CLASS}>{GUIDE_OFFER.fields.name.label}</span>
                    <input
                      type="text"
                      name="name"
                      required
                      maxLength={GUIDE_OFFER.fields.name.maxLength}
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </label>
                  <label className="block min-w-0">
                    <span className={CAPTION_CLASS}>{GUIDE_OFFER.fields.email.label}</span>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </label>
                </div>
                <HoneypotField value={hp} onChange={setHp} />
                {status === "failure" && (
                  /* Rule 2.7: what they typed stays in the fields, and the
                     escape hatch carries it in the mailto body. The link is
                     underlined, not coral: coral on indigo is 1.07:1. */
                  <p role="alert" className="mt-3 text-sm leading-snug font-medium sm:mt-4 sm:text-base">
                    {GUIDE_OFFER.failure.lead}{" "}
                    <a
                      href={fallbackMailto(composed, GUIDE_OFFER.heading)}
                      className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {MODAL_ESCAPE_HATCH.email}
                    </a>{" "}
                    {GUIDE_OFFER.failure.tail}
                  </p>
                )}
                {/* The site's secondary button: its dark fill reads on
                    indigo (4.94:1) where the stone advance would not
                    (2.06:1). A terminal action, so no arrow segment. */}
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={status === "submitting"}
                  className="mt-3.5 w-full sm:mt-5"
                >
                  {GUIDE_OFFER.submit}
                </Button>
                <p className="mt-2 text-xs leading-snug sm:mt-3 sm:text-sm">
                  {GUIDE_OFFER.smallPrint}
                </p>
              </form>
            )}
          </div>
        </aside>
      )}
      {/* Announces the card when it appears, without moving focus. */}
      <p aria-live="polite" className="sr-only">
        {visible ? `${GUIDE_OFFER.eyebrow}. ${GUIDE_OFFER.heading}` : ""}
      </p>
    </>
  );
}
