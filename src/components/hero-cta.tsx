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
      strokeWidth={2.25}
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
 * Hero CTA — the page's signature element. A tactile, raised object:
 * a warm-white gradient surface (lit from the top, not a flat fill), a
 * gold "go" chip carrying the arrow, and a layered shadow that includes
 * a soft gold glow (ui-ux-pro-max "Modern Dark": accent glow behind the
 * primary button). It lifts on hover with the glow intensifying and the
 * arrow advancing, and compresses on press — all on the shared expo-out
 * easing, gated for reduced motion.
 *
 * It opens the qualification modal and, without JS, degrades to the
 * email escape hatch (Business Rules E3) — the same seam as
 * <ModalTrigger>, rebuilt here for the bespoke shape.
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
      className={[
        "group/cta inline-flex items-center gap-4 rounded-2xl py-2.5 pr-2.5 pl-7",
        "bg-gradient-to-b from-white to-[#efeae0] text-ink",
        "shadow-[var(--shadow-cta)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-premium)]",
        "hover:shadow-[var(--shadow-cta-hover)] motion-safe:hover:-translate-y-0.5",
        "motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
      ].join(" ")}
    >
      <span className="text-lg font-medium tracking-[-0.01em]">{label}</span>
      <span className="flex size-10 items-center justify-center rounded-xl bg-gold text-gold-ink transition-transform duration-300 ease-[var(--ease-premium)] motion-safe:group-hover/cta:translate-x-0.5">
        <ArrowRight />
      </span>
    </a>
  );
}
