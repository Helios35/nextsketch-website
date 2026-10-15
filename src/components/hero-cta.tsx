"use client";

import type { MouseEvent } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { useQualificationModal } from "@/components/qualification-modal-provider";
import { MODAL_ESCAPE_HATCH } from "@/content/modal";

/**
 * Hero CTA: the template's divided-arrow button (a label segment and
 * a bordered arrow segment), styled exactly as <Button> primary with
 * `arrow` (fin's stone `primary` fill, charcoal `primary-foreground`
 * mark, `rounded-md`; decision-log #47, corners #48). Only the type
 * step differs: `text-lg`, the hero's scale. It opens the qualification
 * modal and, without JS, degrades to the email escape hatch (Business
 * Rules E3), the same seam as <ModalTrigger>, rebuilt here so the
 * button can take the template's segmented shape at the hero's scale.
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
      className="group/cta inline-flex items-stretch rounded-md bg-primary text-lg font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="flex items-center px-6 py-3">{label}</span>
      <span className="flex items-center border-l border-primary-foreground/20 px-4 py-3">
        <span className="transition-transform duration-150 motion-safe:group-hover/cta:translate-x-0.5">
          <ArrowIcon className="size-5" />
        </span>
      </span>
    </a>
  );
}
