import type { LevelNumber } from "@/lib/types";

/**
 * A level's mark — decision-log **#69**. Each level of AI keeps one
 * colour (#67) and one shape everywhere it appears, from the owner's
 * 5 Levels doc: Level 1 a circle, 2 a square, 3 a triangle, 4 a
 * diamond, 5 a hexagon.
 *
 * **Level 1 is the doc's outlier:** a hollow, dashed circle, because it
 * is where most businesses stop and NextSketch does not sell it. Its
 * text beside it goes a step dimmer (`muted-foreground`), never its
 * mark: the stroke stays at full `level-1`, which holds 3:1 on every
 * surface (#67).
 *
 * The shapes are drawn to about the same visual weight in a 16-unit
 * box, at 14px by default (`size-3.5`): at 12px the hexagon read as a
 * dot at 1x. The levels band and the service routes' level cards take
 * 16px. A mark is always beside its
 * level's number or name, so neither colour nor shape is ever the only
 * thing that says which level it is. Decorative to assistive tech for
 * the same reason. Level 4's diamond is larger than the 6px coral list
 * diamond and is never used as a list marker, so the two do not read as
 * one thing.
 */
export function LevelMark({
  level,
  className = "size-3.5",
}: {
  level: LevelNumber;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {level === 1 && (
        <circle
          cx={8}
          cy={8}
          r={5.75}
          fill="none"
          strokeWidth={1.5}
          strokeDasharray="2.4 2"
          className="stroke-level-1"
        />
      )}
      {level === 2 && (
        <rect x={2.75} y={2.75} width={10.5} height={10.5} className="fill-level-2" />
      )}
      {level === 3 && <path d="M8 1.75 14.5 13.75H1.5Z" className="fill-level-3" />}
      {level === 4 && <path d="M8 1 15 8 8 15 1 8Z" className="fill-level-4" />}
      {level === 5 && (
        <path
          d="M8 1.25 13.85 4.63V11.37L8 14.75 2.15 11.37V4.63Z"
          className="fill-level-5"
        />
      )}
    </svg>
  );
}
