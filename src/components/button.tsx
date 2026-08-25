import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { ArrowIcon } from "@/components/arrow-icon";

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";
type ButtonSize = "default" | "compact";

type AsButton = ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type AsAnchor = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = {
  variant?: ButtonVariant;
  /**
   * "compact" is the bar scale: a **38px** control against default's
   * 50px, so it sits inside the nav without dominating the 44px burger
   * beside it. Its *visible* box is under the binding 44px touch target
   * (§Layout), so it carries a transparent `::after` that extends the
   * hit area back to 44px — thinner to look at, unchanged to tap. Use
   * it for dense chrome, never for a page's primary action.
   */
  size?: ButtonSize;
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
  "group/button inline-flex items-center justify-center rounded-none " +
  "font-medium transition-transform duration-150 " +
  "motion-safe:hover:scale-[1.02] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * The hit-area extension that lets a control be shorter than the
 * binding 44px touch target without actually shrinking the target
 * (§Layout). A transparent `::after` is part of the element's own hit
 * region, so the tap area stays 44px tall while the painted box is
 * 38px. `inset-x-0` keeps it inside the button's own width, so it never
 * reaches sideways over a neighbouring control.
 */
const HIT_AREA =
  "relative after:absolute after:inset-x-0 after:top-1/2 " +
  "after:h-11 after:-translate-y-1/2 after:content-['']";

/**
 * Type scale and padding travel together, and both live here rather
 * than in BASE so a size *replaces* them instead of competing with
 * them. That is not stylistic: `text-sm` and `text-base` are the same
 * specificity, so a caller appending one via `className` would win or
 * lose on Tailwind's stylesheet order, not on class order. Selecting
 * one string per size removes the tie entirely.
 *
 * `arrow` splits its padding across the two segments (§Interaction
 * vocabulary's divided-arrow), so each size carries the segment
 * paddings too and the treatment scales as one piece.
 */
const SIZES: Record<
  ButtonSize,
  { plain: string; arrow: string; arrowLabel: string; arrowBox: string }
> = {
  default: {
    plain: "min-h-11 text-base px-7 py-3",
    arrow: "min-h-11 text-base items-stretch",
    arrowLabel: "px-6 py-3",
    arrowBox: "px-4 py-3",
  },
  /**
   * 38px painted (14px text on 8px of vertical padding, plus the
   * hairline), 44px tapped. Deliberately flat across breakpoints: the
   * earlier responsive step existed only to stop the full-size button
   * crowding a phone bar, and a control that is the right height
   * everywhere does not need it.
   */
  compact: {
    plain: `${HIT_AREA} text-sm px-4 py-2`,
    arrow: `${HIT_AREA} text-sm items-stretch`,
    arrowLabel: "px-4 py-2",
    arrowBox: "px-3 py-2",
  },
};

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
 * `min-h-11` lives in the size table, not BASE, because "compact" is
 * deliberately shorter than it. Every size that is not hit-extended
 * must carry it, or the control silently drops under the binding 44px
 * touch target.
 *
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
  size = "default",
  arrow = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const scale = SIZES[size];
  const cls = [
    BASE,
    VARIANTS[variant],
    arrow ? scale.arrow : scale.plain,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content: ReactNode = arrow ? (
    <>
      <span className={`flex items-center ${scale.arrowLabel}`}>
        {children}
      </span>
      <span
        className={`flex items-center border-l ${scale.arrowBox} ${DIVIDER[variant]}`}
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
