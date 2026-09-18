import { ModalTrigger } from "@/components/modal-trigger";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { FINAL_CTA } from "@/content/copy";
import type { ProjectType } from "@/lib/schema";

/**
 * Presentation marker, not copy: the qualification promise the close
 * turns on takes the gold payoff treatment (docs/04-ux-spec.md
 * §Typography). The same phrase `FinalCtaSection` accents on `/`, on
 * the same string. Degrades to an unaccented headline if the canonical
 * copy changes.
 */
const CLOSE_ACCENT_PHRASE = "right fit";

interface CloseBandProps {
  /**
   * The `<h2>`'s id, which the section's `aria-labelledby` points at.
   * Passed in rather than fixed because two routes may never share one
   * — and so the service routes keep the id they shipped with.
   */
  headingId: string;
  /** Preselects this project type in the modal (the `ServiceCta` seam). */
  need?: ProjectType;
  /** Extra classes on the band — a route that needs top padding adds it. */
  className?: string;
  /** Classes on the inner wrapper — the service routes' page measure. */
  contentClassName?: string;
}

/**
 * The closing band every non-home route ends on: the `FINAL_CTA`
 * heading with its gold payoff phrase, and the divided-arrow
 * `<ModalTrigger>` repeated — nothing beside it (owner direction,
 * 2026-08-28: the close carries one action).
 *
 * **A verbatim copy of the close inline in `service-page.tsx`**
 * (decision-log #43), so the case study page ends the same way. Nothing
 * here is new: the markup, the classes, the reveal rhythm (0 / 120ms)
 * and the accent are exactly what the service routes ship. The two
 * knobs are `need` and the wrapper class, the two things the service
 * page already parameterises in place. `service-page.tsx` still
 * carries its own inline copy: switching it to this component is a
 * zero-render-change refactor left for a unit that may touch the
 * service routes (the owner scoped this one to the Mascot page), and
 * the archived first template verified that swap byte-identical in
 * the built HTML.
 *
 * It is deliberately **not** `<FinalCtaSection>`: that component is
 * `#start` on the home page and carries the page's `(06)` section
 * index and the over-footage text shadow. Mounting it elsewhere would
 * put a second `id="start"` on a route that also links to `/#start`.
 * Content is shared (`FINAL_CTA`), the component is not.
 *
 * Server component; the trigger brings its own client boundary.
 */
export function CloseBand({
  headingId,
  need,
  className,
  contentClassName,
}: CloseBandProps) {
  const closeHeadline = FINAL_CTA.headline;
  const closeAccentStart = closeHeadline.indexOf(CLOSE_ACCENT_PHRASE);

  return (
    <section
      aria-labelledby={headingId}
      className={[
        "w-full px-6 pb-28 sm:px-8 sm:pb-32 lg:px-16 lg:pb-44",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={contentClassName}>
        <ScrollReveal>
          <SectionHeading
            as="h2"
            eyebrow={FINAL_CTA.eyebrow}
            className="max-w-3xl"
          >
            <span id={headingId}>
              {closeAccentStart === -1 ? (
                closeHeadline
              ) : (
                <>
                  {closeHeadline.slice(0, closeAccentStart)}
                  <span className="text-gold">{CLOSE_ACCENT_PHRASE}</span>
                  {closeHeadline.slice(
                    closeAccentStart + CLOSE_ACCENT_PHRASE.length,
                  )}
                </>
              )}
            </span>
          </SectionHeading>
        </ScrollReveal>
        {/* The CTA repeated, and nothing beside it. The close carried
            a gold text link to `/pricing` labelled `PRICING.headline`;
            the owner removed it (2026-08-28), so the close is the one
            action again. `/pricing` is still reached from the nav bar's
            featured button and the footer on every page. */}
        <ScrollReveal delay={120} className="mt-10">
          <ModalTrigger variant="inverse" arrow need={need}>
            {FINAL_CTA.cta}
          </ModalTrigger>
        </ScrollReveal>
      </div>
    </section>
  );
}
