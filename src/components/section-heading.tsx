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
  /**
   * "center" sets the heading and its eyebrow on the centre line: the
   * case study page's band headings (decision-log #43), whose
   * composition the owner centred. Default "start", the hero's
   * bottom-left anchor, which every other surface keeps.
   */
  align?: "start" | "center";
  className?: string;
}

/**
 * `hero` is the live hero's own ladder (`hero.tsx`, and §Typography's
 * "hero scale text-4xl → sm:5xl → md:6xl → lg:7xl"). It read
 * `text-5xl md:text-7xl lg:text-8xl` until 2026-09-18, a leftover of
 * the retired paper hero (`hero-section.tsx`, dormant, its only
 * caller), and was reconciled to the spec when the case study page
 * became its first live caller (decision-log #43): at `lg:text-8xl`
 * the owner's headline broke into three lines with a hyphen stranded
 * at a line end. No live route rendered the old value.
 */
const SIZE_CLASS: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  display: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
  hero: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
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
  align = "start",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  /* Built so the default renders exactly the markup it always did: no
     empty class attribute, no trailing space. */
  const wrapperClass = [centered ? "text-center" : null, className]
    .filter(Boolean)
    .join(" ");
  const eyebrowClass = [
    "mb-4 flex items-baseline gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase",
    centered ? "justify-center" : null,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={wrapperClass === "" ? undefined : wrapperClass}>
      {(eyebrow !== undefined || index !== undefined) && (
        <p className={eyebrowClass}>
          {index !== undefined && <span className="text-gold">({index})</span>}
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
