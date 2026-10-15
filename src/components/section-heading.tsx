import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  /** Mono micro-label rendered above the heading. */
  eyebrow?: string;
  /**
   * Coral (`brand`) structural index rendered before the eyebrow, e.g.
   * "01": the redesign sections' shared "(01)" marker rhythm.
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
 * Shared section heading, re-skinned to fin's Zen Linen (decision-log
 * #47): display face is Playfair Display at font-bold / tight tracking
 * / 1.08 leading for its descenders (docs/04-ux-spec.md §Typography),
 * the eyebrow is the JetBrains Mono micro-label in `muted-foreground`
 * with an optional coral (`brand`) index. The heading itself rides on
 * currentColor, which is `foreground` on every route now the 404 is
 * dark too.
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
            <span className="text-brand">({index})</span>
          )}
          {eyebrow !== undefined && (
            <span className="text-muted-foreground">{eyebrow}</span>
          )}
        </p>
      )}
      <Tag
        className={`${SIZE_CLASS[size]} font-serif leading-[1.08] font-bold tracking-tight text-balance`}
      >
        {children}
      </Tag>
    </div>
  );
}
