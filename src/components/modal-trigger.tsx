"use client";

import type { MouseEvent, ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/button";
import { useQualificationModal } from "@/components/qualification-modal-provider";
import { MODAL_ESCAPE_HATCH } from "@/content/modal";
import type { ProjectType } from "@/lib/schema";

interface ModalTriggerProps {
  children: ReactNode;
  variant?: ButtonProps["variant"];
  /** Divided-arrow advance treatment — see Button. */
  arrow?: ButtonProps["arrow"];
  className?: string;
  /** Runs before the modal opens (e.g. close the menu). */
  onBeforeOpen?: () => void;
  /**
   * Preselects this project type in the quick door's "What do you
   * need?" selector — how a pricing tier carries its own need into the
   * form. Omitted, the modal opens with nothing selected, exactly as
   * every other CTA on the site does.
   */
  need?: ProjectType;
}

/**
 * The site-wide conversion CTA: opens the qualification modal. The
 * one seam every CTA shares — rendered as a real mailto anchor so
 * no-JS visitors degrade to the email escape hatch (Business Rules
 * E3); with JS the click is intercepted and the modal opens instead.
 *
 * `need` extends this with the preselection `ServiceCta` already
 * carries (decision-log #25). The two are deliberately not merged:
 * `ServiceCta` is the §Interaction-vocabulary **gold underlined text
 * link** and this is the **squared block button**, so they are the same
 * behaviour on two different affordances. The pricing tiers need a
 * button, and the provider's `openModal(need?)` signature already
 * supported this — nothing new was invented, the argument was simply
 * not reachable from a Button until now.
 */
export function ModalTrigger({
  children,
  variant,
  arrow,
  className,
  onBeforeOpen,
  need,
}: ModalTriggerProps) {
  const { openModal } = useQualificationModal();

  return (
    <Button
      variant={variant}
      arrow={arrow}
      className={className}
      href={`mailto:${MODAL_ESCAPE_HATCH.email}`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onBeforeOpen?.();
        openModal(need);
      }}
    >
      {children}
    </Button>
  );
}
