"use client";

import type { MouseEvent } from "react";
import { useQualificationModal } from "@/components/qualification-modal-provider";
import { MODAL_ESCAPE_HATCH } from "@/content/modal";

/** Inline arrow — the project uses inline SVG icons, never lucide. */
function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
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

/**
 * Hero CTA — the template's divided-arrow button (a label segment and
 * a bordered arrow segment), re-skinned to the brand (white surface /
 * ink mark). It opens the qualification modal and, without JS,
 * degrades to the email escape hatch (Business Rules E3) — the same
 * seam as <ModalTrigger>, rebuilt here so the button can take the
 * template's squared, segmented shape without fighting the shared
 * pill <Button>.
 */
export function HeroCta({ label }: { label: string }) {
  const { openModal } = useQualificationModal();

  return (
    <a
      href={`mailto:${MODAL_ESCAPE_HATCH.email}`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        openModal();
      }}
      className="group/cta inline-flex items-stretch bg-white text-lg font-medium text-ink transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:hover:scale-[1.02]"
    >
      <span className="flex items-center px-6 py-3">{label}</span>
      <span className="flex items-center border-l border-ink/15 px-4 py-3">
        <span className="transition-transform duration-150 motion-safe:group-hover/cta:translate-x-0.5">
          <ArrowRight />
        </span>
      </span>
    </a>
  );
}
