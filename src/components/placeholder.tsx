import type { AccentName, SectionId } from "@/lib/types";

type PlaceholderRatio = "16/9" | "4/3" | "1/1" | "3/4";

interface PlaceholderProps {
  /** Section the asset belongs to — drives the taxonomy file name. */
  section: SectionId;
  /** 1-based asset number within the section. */
  index: number;
  ratio?: PlaceholderRatio;
  /**
   * Accent-tinted treatment with a diagonal sketch-hatch overlay —
   * the work-tile placeholder spec (docs/04-ux-spec.md §Component
   * specs). Text takes the paired -ink per the pairing rule.
   */
  accent?: AccentName;
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
 * Tint stays translucent so the viewport keeps its neutral base
 * (accents are seasoning); hatch strokes flow via currentColor on
 * the overlay so one gradient covers every accent.
 */
const TINT_CLASS: Record<AccentName, string> = {
  gold: "border-gold/40 bg-gold/20 text-gold-ink",
  lavender: "border-lavender/40 bg-lavender/20 text-lavender-ink",
  rose: "border-rose/40 bg-rose/20 text-rose-ink",
  sage: "border-sage/40 bg-sage/20 text-sage-ink",
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
  label,
  className,
}: PlaceholderProps) {
  const name = `placeholder-${section}-${String(index).padStart(2, "0")}`;

  return (
    <div
      data-placeholder={name}
      className={[
        RATIO_CLASS[ratio],
        "relative grid place-items-center overflow-hidden rounded-lg border",
        accent === undefined
          ? "border-ink/10 bg-paper-bright text-ink"
          : TINT_CLASS[accent],
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
            label === undefined
              ? "font-hand text-xl opacity-40"
              : "font-hand text-sm opacity-50"
          }
        >
          {name}
        </span>
      </div>
    </div>
  );
}
