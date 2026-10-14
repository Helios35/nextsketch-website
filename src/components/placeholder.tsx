import type { AccentName, SectionId } from "@/lib/types";

type PlaceholderRatio = "16/9" | "4/3" | "1/1" | "3/4";

interface PlaceholderProps {
  /** Section the asset belongs to — drives the taxonomy file name. */
  section: SectionId;
  /** 1-based asset number within the section. */
  index: number;
  ratio?: PlaceholderRatio;
  /**
   * Accent-tinted treatment with a diagonal sketch-hatch overlay: the
   * work-tile placeholder spec (docs/04-ux-spec.md §Component specs).
   * Text takes `foreground`: a translucent tint on the dark page is not
   * a coral fill, so `brand-foreground` would not read (decision-log #47).
   */
  accent?: AccentName;
  /**
   * Surface the placeholder sits on. "ink" is the hairline tile on
   * `secondary` (docs/04-ux-spec.md §Surfaces); "paper" is the former
   * light default, now a `card` tile, kept for the dormant sections.
   * Both take the fin image-frame radius (decision-log #47, #48).
   */
  surface?: "paper" | "ink";
  /** Visible site copy inside the block (from a content constant). */
  label?: string;
  className?: string;
}

const RATIO_CLASS: Record<PlaceholderRatio, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
};

/**
 * Static accent→class maps: Tailwind only compiles class literals.
 * Only the gold key tints, in translucent coral so the viewport keeps
 * its neutral base (decision-log #47); the other keys take the neutral
 * `muted` tile, because the chart steps are wireframe chrome only.
 * Hatch strokes flow via currentColor on the overlay so one gradient
 * covers every accent.
 */
const TINT_CLASS: Record<AccentName, string> = {
  gold: "border-brand/40 bg-brand/20 text-foreground",
  lavender: "border-border bg-muted text-foreground",
  rose: "border-border bg-muted text-foreground",
  sage: "border-border bg-muted text-foreground",
};

/**
 * Layout-final placeholder (docs/06-taxonomy.md §7): fixed aspect
 * ratio so the real asset swaps in by file name with zero layout
 * shift. The visible name is the taxonomy asset name — a dev
 * artifact, not site copy.
 */
export function Placeholder({
  section,
  index,
  ratio = "16/9",
  accent,
  surface = "paper",
  label,
  className,
}: PlaceholderProps) {
  const name = `placeholder-${section}-${String(index).padStart(2, "0")}`;

  return (
    <div
      data-placeholder={name}
      className={[
        RATIO_CLASS[ratio],
        "relative grid place-items-center overflow-hidden border",
        surface === "ink"
          ? "rounded-lg border-border bg-secondary text-muted-foreground"
          : accent === undefined
            ? "rounded-lg border-border bg-card text-foreground"
            : `rounded-lg ${TINT_CLASS[accent]}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {accent !== undefined && (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_14px)]"
        />
      )}
      <div className="relative grid place-items-center gap-1 p-4 text-center">
        {label !== undefined && (
          <span className="text-sm font-medium tracking-wide">{label}</span>
        )}
        <span
          className={
            surface === "ink"
              ? "font-mono text-xs tracking-[0.14em] uppercase"
              : label === undefined
                ? "font-sans text-xl"
                : "font-sans text-sm"
          }
        >
          {name}
        </span>
      </div>
    </div>
  );
}
