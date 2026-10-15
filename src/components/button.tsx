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
   * vocabulary): a label segment plus a hairline-divided arrow box,
   * the system's advance affordance, matching the hero CTA. Without
   * it the button is the plain `rounded-md` block (terminal actions
   * drop the arrow segment).
   */
  arrow?: boolean;
} & (AsButton | AsAnchor);

/* fin's button: `rounded-md` (decision-log #48), state shown by colour
 * on a 150ms transition, never by transform (the whole-button hover
 * scale is retired with #47). One focus colour site-wide: `ring`. */
const BASE =
  "group/button inline-flex items-center justify-center rounded-md " +
  "font-medium transition-colors duration-150 disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-ring";

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

/*
 * The site is dark only (decision-log #47), so the four variant names
 * converge on two looks. The names stay so no caller changes; the focus
 * ring is `ring` on every surface and lives in BASE.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  /** The advance: fin's stone `primary` fill, charcoal text (7.7:1). */
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    "border border-border bg-secondary text-foreground hover:bg-accent",
  /** The advance on a dark band; dark only, so it is `primary`. */
  inverse: "bg-primary text-primary-foreground hover:bg-primary/90",
  /** Secondary's role on a dark band; dark only, so it is `secondary`. */
  ghost:
    "border border-border bg-secondary text-foreground hover:bg-accent",
};

/** Hairline divider between the label and arrow segments, per fill. */
const DIVIDER: Record<ButtonVariant, string> = {
  primary: "border-primary-foreground/20",
  secondary: "border-border",
  inverse: "border-primary-foreground/20",
  ghost: "border-border",
};

/**
 * `min-h-11` lives in the size table, not BASE, because "compact" is
 * deliberately shorter than it. Every size that is not hit-extended
 * must carry it, or the control silently drops under the binding 44px
 * touch target.
 *
 * fin `rounded-md` button per docs/04-ux-spec.md §Interaction
 * vocabulary (decision-log #47, corners #48; the squared rule is
 * retired). Renders an anchor when `href` is set, otherwise a real
 * <button>. Copy always comes from src/content/. Hover is a colour
 * change only; with `arrow`, the arrow nudges on hover exactly like
 * the hero CTA, gated by motion-safe, because it says "advance"
 * (Tailwind v4 note: the standalone translate property is what
 * transitions).
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
