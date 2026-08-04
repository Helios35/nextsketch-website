"use client";

import type { MouseEvent } from "react";
import { useQualificationModal } from "@/components/qualification-modal-provider";
import { MODAL_ESCAPE_HATCH } from "@/content/modal";
import type { ProjectType } from "@/lib/schema";

/**
 * Per-service conversion CTA (owner direction 2026-08-04): opens the
 * qualification modal with this card's service already selected in the
 * quick door's "What do you need?" step.
 *
 * Shares ModalTrigger's seam — a real mailto anchor that the click
 * intercepts — so no-JS visitors still reach the escape hatch
 * (Business Rules E3). It is a separate component rather than a
 * ModalTrigger variant because the affordance is different: the gold
 * underlined text link of the §Color rule, not Button's block-button
 * vocabulary (solid surface, divided-arrow box, scale-on-hover).
 * Forcing it through Button would mean bending Button's padding and
 * hover for one caller.
 */

/** Inline arrow — the project uses inline SVG icons, never lucide. */
function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

interface ServiceCtaProps {
  label: string;
  /** The project type this card's CTA preselects in the modal. */
  need: ProjectType;
  /**
   * Names the service in the accessible name, so four identical
   * "Build With Us" links don't read as four identical links out of
   * context (the card heading is not programmatically tied to them).
   */
  service: string;
}

export function ServiceCta({ label, need, service }: ServiceCtaProps) {
  const { openModal } = useQualificationModal();

  return (
    <a
      href={`mailto:${MODAL_ESCAPE_HATCH.email}`}
      aria-label={`${label} — ${service}`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        openModal(need);
      }}
      className="group/cta inline-flex min-h-11 items-center gap-2 text-base font-medium text-gold underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {label}
      <span className="transition-[translate] duration-150 motion-safe:group-hover/cta:translate-x-0.5">
        <ArrowIcon />
      </span>
    </a>
  );
}
