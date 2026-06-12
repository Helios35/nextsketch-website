"use client";

import type { MouseEvent, ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/button";
import { useQualificationModal } from "@/components/qualification-modal-provider";
import { MODAL_ESCAPE_HATCH } from "@/content/modal";

interface ModalTriggerProps {
  children: ReactNode;
  variant?: ButtonProps["variant"];
  className?: string;
  /** Runs before the modal opens (e.g. close the mobile menu). */
  onBeforeOpen?: () => void;
}

/**
 * The site-wide conversion CTA: opens the qualification modal. The
 * one seam every CTA shares — rendered as a real mailto anchor so
 * no-JS visitors degrade to the email escape hatch (Business Rules
 * E3); with JS the click is intercepted and the modal opens instead.
 */
export function ModalTrigger({
  children,
  variant,
  className,
  onBeforeOpen,
}: ModalTriggerProps) {
  const { openModal } = useQualificationModal();

  return (
    <Button
      variant={variant}
      className={className}
      href={`mailto:${MODAL_ESCAPE_HATCH.email}`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onBeforeOpen?.();
        openModal();
      }}
    >
      {children}
    </Button>
  );
}
