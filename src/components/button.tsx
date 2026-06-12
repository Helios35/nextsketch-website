import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "inverse";

type AsButton = ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsAnchor = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = { variant?: ButtonVariant } & (AsButton | AsAnchor);

const BASE =
  "inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3 " +
  "text-base font-medium transition-transform duration-150 " +
  "motion-safe:hover:scale-[1.02] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

/* Outline color lives with the variant: the focus ring must contrast
 * with the surface the button sits on (ink ring is invisible on ink). */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white focus-visible:outline-ink",
  secondary:
    "border border-ink bg-transparent text-ink focus-visible:outline-ink",
  /** Primary's role on ink surfaces (final-CTA panel): white bg / ink text. */
  inverse: "bg-white text-ink focus-visible:outline-white",
};

/**
 * Pill button per docs/04-ux-spec.md §Component specs. Renders an
 * anchor when `href` is set (hash links at foundation stage),
 * otherwise a real <button>. Copy always comes from src/content/.
 * Hover scale is CSS-only and gated by motion-safe; the accent
 * underline-sketch on hover composes with <SketchAccent> downstream.
 */
export function Button({ variant = "primary", className, ...rest }: ButtonProps) {
  const cls = [BASE, VARIANTS[variant], className].filter(Boolean).join(" ");

  if (rest.href !== undefined) {
    return <a className={cls} {...(rest as AsAnchor)} />;
  }
  return <button className={cls} {...(rest as AsButton)} />;
}
