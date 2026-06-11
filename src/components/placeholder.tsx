import type { SectionId } from "@/lib/types";

type PlaceholderRatio = "16/9" | "4/3" | "1/1" | "3/4";

interface PlaceholderProps {
  /** Section the asset belongs to — drives the taxonomy file name. */
  section: SectionId;
  /** 1-based asset number within the section. */
  index: number;
  ratio?: PlaceholderRatio;
  className?: string;
}

const RATIO_CLASS: Record<PlaceholderRatio, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
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
  className,
}: PlaceholderProps) {
  const name = `placeholder-${section}-${String(index).padStart(2, "0")}`;

  return (
    <div
      data-placeholder={name}
      className={[
        RATIO_CLASS[ratio],
        "grid place-items-center overflow-hidden rounded-lg border border-ink/10 bg-paper-bright",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="font-hand text-xl text-ink/40">{name}</span>
    </div>
  );
}
