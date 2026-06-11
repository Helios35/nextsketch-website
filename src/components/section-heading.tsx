import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  /** Small label rendered above the heading. */
  eyebrow?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Shared section heading: display type per docs/04-ux-spec.md
 * §Typography (tight leading, weight 600–700; size scales at the
 * 768px breakpoint).
 */
export function SectionHeading({
  children,
  eyebrow,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow !== undefined && (
        <p className="mb-3 text-sm font-medium tracking-widest uppercase text-ink/60">
          {eyebrow}
        </p>
      )}
      <Tag className="text-4xl leading-tight font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
        {children}
      </Tag>
    </div>
  );
}
