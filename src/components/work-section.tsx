import { Placeholder } from "@/components/placeholder";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { WORK } from "@/content/copy";
import type { AccentName } from "@/lib/types";

interface WorkTile {
  /** 1-based taxonomy asset index (placeholder-work-{nn}). */
  index: number;
  accent: AccentName;
  ratio: "4/3" | "1/1";
}

/**
 * Presentational tile inventory: four placeholder tiles, accents
 * cycling the Taxonomy §5 pairs, mixed ratios for the asymmetric
 * grid. No project names, no outcomes (Rule 4.3) — the real case
 * studies swap in by file name (Taxonomy §7).
 */
const TILE_COLUMNS: readonly (readonly WorkTile[])[] = [
  [
    { index: 1, accent: "gold", ratio: "4/3" },
    { index: 2, accent: "lavender", ratio: "1/1" },
  ],
  [
    { index: 3, accent: "rose", ratio: "1/1" },
    { index: 4, accent: "sage", ratio: "4/3" },
  ],
];

/*
 * Pinned-sheet treatment (unit 08): each tile is a sheet of drawing
 * paper resting on the desk — slight alternating rotation, sheet
 * shadow, straightens and lifts on hover. The rotation is static
 * composition (visible as-is under reduced motion); only the
 * transitions are motion-gated.
 */
const SHEET_ROTATION = ["md:-rotate-[0.7deg]", "md:rotate-[0.6deg]"] as const;

function Tile({ tile, delay }: { tile: WorkTile; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div
        className={[
          "group relative rounded-lg shadow-sheet hover:shadow-sheet-lg",
          "motion-safe:transition-[transform,box-shadow,rotate,translate]",
          "motion-safe:duration-300",
          "motion-safe:hover:-translate-y-1.5 motion-safe:hover:rotate-0",
          SHEET_ROTATION[tile.index % 2],
        ].join(" ")}
      >
        <Placeholder
          section="work"
          index={tile.index}
          ratio={tile.ratio}
          accent={tile.accent}
          label={WORK.tileLabel}
          art
        />
        <SketchAccent
          variant="arrow"
          accent={tile.accent}
          tone="ink"
          drawOn="hover"
          strokeWidth={5}
          className="pointer-events-none absolute right-4 bottom-4 h-auto w-8"
        />
      </div>
    </Reveal>
  );
}

/**
 * Selected work (#work) — visual credibility on placeholders
 * (docs/03-site-architecture.md row 5): 2×2 asymmetric grid per the
 * reference layout, accent-tinted hatched tiles per the UX spec's
 * placeholder treatment. Hover: tile lifts, sketch arrow draws in
 * the corner.
 */
export function WorkSection() {
  return (
    <div className="py-24 md:py-32">
      <Reveal>
        <SectionHeading className="max-w-4xl">{WORK.headline}</SectionHeading>
      </Reveal>
      <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
        {TILE_COLUMNS.map((column, c) => (
          <div
            key={c}
            className={`flex flex-col gap-6 md:gap-8 ${c === 1 ? "md:pt-16" : ""}`}
          >
            {column.map((tile, t) => (
              <Tile key={tile.index} tile={tile} delay={(c + t) * 0.1} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
