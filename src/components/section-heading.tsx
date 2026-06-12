import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  /** Small label rendered above the heading. */
  eyebrow?: string;
  as?: "h1" | "h2" | "h3";
  /**
   * Display scale per docs/04-ux-spec.md §Typography: "display" for
   * section headings, "statement" for the editorial spreads that
   * carry a section on type alone (manifesto, final CTA), "hero" for
   * the top-of-page promise (64–96px desktop / 40–48px mobile).
   */
  size?: "display" | "statement" | "hero";
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<SectionHeadingProps["size"]>, string> = {
  display: "text-4xl md:text-5xl lg:text-6xl",
  statement: "text-4xl md:text-6xl lg:text-7xl",
  hero: "text-5xl md:text-7xl lg:text-8xl",
};

/**
 * Shared section heading: display type per docs/04-ux-spec.md
 * §Typography (tight leading, weight 600–700; size scales at the
 * 768px breakpoint).
 */
export function SectionHeading({
  children,
  eyebrow,
  as: Tag = "h2",
  size = "display",
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow !== undefined && (
        <p className="mb-3 text-sm font-medium tracking-widest uppercase text-ink/60">
          {eyebrow}
        </p>
      )}
      <Tag
        className={`${SIZE_CLASS[size]} leading-tight font-bold tracking-tight text-balance`}
      >
        {children}
      </Tag>
    </div>
  );
}
