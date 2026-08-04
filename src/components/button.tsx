import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { ArrowIcon } from "@/components/arrow-icon";

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";

type AsButton = ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsAnchor = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = {
  variant?: ButtonVariant;
  /**
   * Divided-arrow treatment (docs/04-ux-spec.md §Interaction
   * vocabulary): a label segment plus a hairline-divided arrow box —
   * the system's advance affordance, matching the hero CTA. Without
   * it the button is the plain squared block (terminal actions drop
   * the arrow segment).
   */
  arrow?: boolean;
} & (AsButton | AsAnchor);

const BASE =
  "group/button inline-flex min-h-11 items-center justify-center rounded-none " +
  "text-base font-medium transition-transform duration-150 " +
  "motion-safe:hover:scale-[1.02] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

/* Outline color lives with the variant: the focus ring must contrast
 * with the surface the button sits on (ink ring is invisible on ink). */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white focus-visible:outline-ink",
  secondary:
    "border border-ink bg-transparent text-ink focus-visible:outline-ink",
  /** The advance surface on ink (nav / final CTA): white bg / ink text. */
  inverse: "bg-white text-ink focus-visible:outline-white",
  /** Secondary's role on ink surfaces (§Interaction vocabulary): white hairline. */
  ghost:
    "border border-white/30 bg-transparent text-white transition-colors " +
    "hover:border-white/60 hover:bg-white/[0.06] focus-visible:outline-white",
};

/** Hairline divider between the label and arrow segments, per surface. */
const DIVIDER: Record<ButtonVariant, string> = {
  primary: "border-white/15",
  secondary: "border-ink/15",
  inverse: "border-ink/15",
  ghost: "border-white/30",
};

/**
 * Squared button per docs/04-ux-spec.md §Interaction vocabulary
 * (Redesign Unit 02 re-skin — the pill is retired with the paper
 * system). Renders an anchor when `href` is set, otherwise a real
 * <button>. Copy always comes from src/content/. Hover scale is
 * CSS-only and gated by motion-safe; with `arrow`, the arrow nudges
 * on hover exactly like the hero CTA (Tailwind v4 note: the
 * standalone scale/translate properties are what transition).
 */
export function Button({
  variant = "primary",
  arrow = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    BASE,
    VARIANTS[variant],
    arrow ? "items-stretch" : "px-7 py-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content: ReactNode = arrow ? (
    <>
      <span className="flex items-center px-6 py-3">{children}</span>
      <span
        className={`flex items-center border-l px-4 py-3 ${DIVIDER[variant]}`}
      >
        <span className="transition-transform duration-150 motion-safe:group-hover/button:translate-x-0.5">
          <ArrowIcon className="size-5" />
        </span>
      </span>
    </>
  ) : (
    children
  );

  if (rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AsAnchor)}>
        {content}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as AsButton)}>
      {content}
    </button>
  );
}
