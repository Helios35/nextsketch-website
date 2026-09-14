import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/arrow-icon";

/**
 * An off-site link on a case study route — "Visit website" and "View
 * on Behance" (decision-log #43). The §Interaction-vocabulary gold
 * underlined text link with the shared arrow, the same affordance the
 * home cards' "See More" row and `<ServiceCta>` carry, so a link reads
 * as a link everywhere on the site. The arrow is the one `ArrowIcon`,
 * turned to point up and out (`-rotate-45`) because the destination
 * leaves the site — the rail turns the same icon around for "previous".
 *
 * Adapted from the reference's "visit website" control, which is a
 * plain text link with an up-right arrow and a stacked-label hover
 * swap. The swap is not reproduced: this system's hover on a text
 * link is the colour shift to white and the arrow nudge at the 150ms
 * micro-transition tempo, and that is what it does here.
 *
 * **The rule for "Visit website" (owner, 2026-09-14): it renders only
 * for a live project.** A study declares `liveHref` in its content
 * module; none of the current four is live, so none declares one and
 * the control appears nowhere today. `case-study-page.tsx` gates it on
 * the field, and this component carries no notion of "live" itself —
 * it renders whatever it is handed, so the page stays the one place
 * that decides. Opens in a new tab, the way the cards did when they
 * carried the Behance link.
 *
 * Navigation, not a conversion CTA, so the Rule 3.1 set does not bind
 * the label (the `WORK_LINK` reasoning). Server component.
 */
export function CaseStudyLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group/link inline-flex min-h-11 items-center gap-2 text-base font-medium text-gold underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {children}
      <span className="transition-[translate] duration-150 motion-safe:group-hover/link:translate-x-0.5">
        <ArrowIcon className="size-4 -rotate-45" />
      </span>
    </a>
  );
}
