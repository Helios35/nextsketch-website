import Image from "next/image";
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
  /**
   * Renders the placeholder art file from /public/placeholders/ by
   * taxonomy name (unit 08, owner-authorized placeholder imagery):
   * hand-drawn sketch stand-ins rich enough to judge the intended end
   * state. Real assets swap in by file name per Taxonomy §7 — note
   * the interim art is .svg, so a real asset arriving as .jpg/.webp
   * is a one-line extension change at handoff.
   */
  art?: boolean;
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
  gold: "border-gold/50 bg-gold/30 text-gold-ink",
  lavender: "border-lavender/50 bg-lavender/30 text-lavender-ink",
  rose: "border-rose/50 bg-rose/30 text-rose-ink",
  sage: "border-sage/50 bg-sage/30 text-sage-ink",
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
  art = false,
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
      {art && (
        <Image
          src={`/placeholders/${name}.svg`}
          alt=""
          aria-hidden="true"
          fill
          className="object-cover"
        />
      )}
      {accent !== undefined && !art && (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_14px)]"
        />
      )}
      <div
        className={[
          "relative grid place-items-center gap-1 p-4 text-center",
          art ? "m-4 rounded-lg bg-paper/85 px-4 py-3 shadow-sheet" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
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
