import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  /** Mono micro-label rendered above the heading. */
  eyebrow?: string;
  /**
   * Gold structural index rendered before the eyebrow, e.g. "01" —
   * the redesign sections' shared "(01)" marker rhythm.
   */
  index?: string;
  as?: "h1" | "h2" | "h3";
  /**
   * Display scale per docs/04-ux-spec.md §Typography: "display" for
   * section headings, "hero" reserved for a top-of-page promise.
   */
  size?: "display" | "hero";
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  display: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
  hero: "text-5xl md:text-7xl lg:text-8xl",
};

/**
 * Shared section heading, re-skinned to the hero-derived design
 * system (Redesign Unit 02): display face is Space Grotesk at
 * font-medium / tight tracking / tight leading (docs/04-ux-spec.md
 * §Typography), the eyebrow is the JetBrains Mono micro-label with an
 * optional gold index. Colors ride on currentColor so the heading
 * works on ink (white sections) and on the 404's paper surface alike.
 */
export function SectionHeading({
  children,
  eyebrow,
  index,
  as: Tag = "h2",
  size = "display",
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {(eyebrow !== undefined || index !== undefined) && (
        <p className="mb-4 flex items-baseline gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          {index !== undefined && (
            <span className="text-gold">({index})</span>
          )}
          {eyebrow !== undefined && (
            <span className="opacity-55">{eyebrow}</span>
          )}
        </p>
      )}
      <Tag
        className={`${SIZE_CLASS[size]} leading-[1.05] font-medium tracking-tight text-balance`}
      >
        {children}
      </Tag>
    </div>
  );
}
