import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";

type AsButton = ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsAnchor = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = { variant?: ButtonVariant } & (AsButton | AsAnchor);

const BASE =
  "inline-flex min-h-11 items-center justify-center rounded-full px-7 py-3 " +
  "text-base font-medium " +
  "transition-[transform,box-shadow,background-color,border-color,color] " +
  "duration-200 ease-[var(--ease-premium)] " +
  // Lift on hover, settle + compress on press — tactile, gated for reduced motion.
  "motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

/* Outline color lives with the variant: the focus ring must contrast
 * with the surface the button sits on (ink ring is invisible on ink).
 * Variants carry a depth shadow so buttons read as raised material, not
 * flat fills; the ink-surface `inverse` warms to a gold glow on hover. */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white shadow-[0_8px_24px_-10px_rgb(0_0_0/0.5)] " +
    "hover:shadow-[0_14px_34px_-10px_rgb(0_0_0/0.6)] focus-visible:outline-ink",
  secondary:
    "border border-ink bg-transparent text-ink hover:bg-ink/[0.04] focus-visible:outline-ink",
  /** Primary's role on ink surfaces (final-CTA panel, dark modal): white bg / ink text. */
  inverse:
    "bg-white text-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.7)] " +
    "hover:shadow-[0_16px_40px_-12px_rgb(0_0_0/0.78),0_0_30px_-8px_rgb(228_185_118/0.45)] " +
    "focus-visible:outline-white",
  /** Secondary's role on ink surfaces (dark qualification modal): white hairline. */
  ghost:
    "border border-white/30 bg-transparent text-white " +
    "hover:border-white/60 hover:bg-white/[0.06] focus-visible:outline-white",
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
