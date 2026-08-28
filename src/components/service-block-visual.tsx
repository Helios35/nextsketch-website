import { ScrollReveal } from "@/components/scroll-reveal";
import type { ServiceBlockId } from "@/lib/types";

/**
 * The decorative half of a "what you get" row (decision-log **#30**,
 * third revision, 2026-08-28) — a 2-3-2 cluster of squared hairline
 * tiles dissolving into the page behind a radial fade.
 *
 * **Adapted from an owner-supplied reference, layout only** — the
 * posture PR #27 took with the gallery, build-note 23 with the pricing
 * module, and this unit already took twice. What the reference
 * contributed: the split row (a tile cluster on one side, the text on
 * the other), the 2-3-2 stack, the single emphasized tile in the middle
 * row, and the radial gradient that fades the cluster's edges into the
 * page surface. What it did **not**:
 *
 * - **Its dependencies.** The reference is shadcn: `Card`, `Button`,
 *   `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`,
 *   a `cn()` helper and a `/components/ui` directory. **None of it
 *   ships and none of it is installed.** This repo's standing posture
 *   is zero new dependencies (build-note 23), §Interaction vocabulary
 *   is explicit that "Icons are inline SVG, never `lucide-react`",
 *   components live in `src/components/` flat, and class composition is
 *   the repo's array join. Nothing here imports anything new.
 * - **Third-party product logos.** The reference's tiles are GitHub,
 *   Slack, Notion, Figma and so on. Rendering those would assert
 *   integrations nobody has approved, which is exactly the invented
 *   claim Rule 4.3 exists to stop, on the pages a search visitor lands
 *   on first. The tiles carry **abstract geometric marks** instead:
 *   decoration, not a claim, and the whole cluster is `aria-hidden` so
 *   it says nothing to assistive tech either.
 * - **`rounded-xl`, `shadow-black-950/10`, `bg-muted`, `dark:` variants
 *   and the shadcn token palette.** Squared is the shape of the brand,
 *   the page is `ink`, there is no light mode, and the default Tailwind
 *   palette is cleared in `globals.css` so only brand tokens compile.
 *
 * **The marks are a judgment call, flagged.** §Interaction vocabulary
 * settles the *list marker* (the gold diamond) and bans `lucide-react`,
 * but it does not cover a decorative tile cluster, and the spec's own
 * instruction for that case is to generalize and flag rather than
 * invent silently. So the set is built only from shapes the system
 * already uses — the rotated square, the hairline, the squared frame —
 * at the white alpha ladder, with `gold` reserved for the one
 * emphasized tile. No new token, no new color, no third accent.
 *
 * Each block gets its own arrangement, because the owner asked for the
 * visual to suit the service rather than repeat: the agentic blocks
 * lead with the hub and branch marks, `product-completion` leads with
 * the notched square, `product-support` with the step line. One
 * vocabulary, five readings.
 *
 * Tiles are **solid `#0a0a0c`** rather than §Surfaces' translucent-plus
 * blur, for the same reason the rest of these routes are: no
 * `ScrollVideo` is mounted (#17), so there is nothing behind a tile to
 * blur. The emphasized tile takes the shared `--shadow-modal` depth
 * token, never a glow (§Surfaces: "depth comes from shadow and blur,
 * never from colored light").
 *
 * Server component. Entrances are the shared `ScrollReveal` at the
 * §Motion-inventory list rhythm, so the cluster assembles tile by tile;
 * no keyframe was added and `globals.css` is untouched.
 */

/** 24px viewBox, `currentColor`, hairline stroke — the ArrowIcon contract. */
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
} as const;

const MARKS = {
  /** The system's own marker, at tile scale. */
  diamond: (
    <path d="M12 4 20 12 12 20 4 12Z" fill="currentColor" stroke="none" />
  ),
  /** A squared frame inside a frame — a platform with an edge. */
  frame: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" {...STROKE} />
      <rect x="8.5" y="8.5" width="7" height="7" {...STROKE} />
    </>
  ),
  /** Four cells — a structure assembled from parts. */
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" {...STROKE} />
      <rect x="13.5" y="3.5" width="7" height="7" {...STROKE} />
      <rect x="3.5" y="13.5" width="7" height="7" {...STROKE} />
      <rect x="13.5" y="13.5" width="7" height="7" {...STROKE} />
    </>
  ),
  /** The same structure with a cell missing — got you 70% there. */
  notch: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" {...STROKE} />
      <rect x="13.5" y="3.5" width="7" height="7" {...STROKE} />
      <rect x="3.5" y="13.5" width="7" height="7" {...STROKE} />
      <path d="M13.5 20.5h3.5v-3.5" {...STROKE} />
    </>
  ),
  /** Layers — a stack that keeps growing. */
  stack: (
    <>
      <path d="M3.5 6.5h17" {...STROKE} />
      <path d="M3.5 12h17" {...STROKE} />
      <path d="M3.5 17.5h17" {...STROKE} />
    </>
  ),
  /** A hub with spokes — an agent sitting inside a process. */
  hub: (
    <>
      <rect x="9" y="9" width="6" height="6" {...STROKE} />
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" {...STROKE} />
    </>
  ),
  /** One line becoming two — work routed. */
  branch: (
    <>
      <path d="M3.5 12h6" {...STROKE} />
      <path d="M9.5 12 15 6.5h5.5" {...STROKE} />
      <path d="M9.5 12 15 17.5h5.5" {...STROKE} />
    </>
  ),
  /** A step line — something watched over time. */
  step: (
    <path d="M3.5 17.5h4.5V12h4.5V7h4.5v10.5h3.5" {...STROKE} />
  ),
  /** A field of points — the day to day. */
  field: (
    <>
      {[6, 12, 18].map((y) =>
        [6, 12, 18].map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x - 1}
            y={y - 1}
            width="2"
            height="2"
            fill="currentColor"
          />
        )),
      )}
    </>
  ),
} as const;

type MarkKey = keyof typeof MARKS;

/**
 * Seven marks per block, in cluster order: two, then three, then two.
 * Index 3 is the middle row's centre and takes the emphasis treatment.
 * Total over `ServiceBlockId`, so a new block cannot ship without a
 * visual.
 */
const CLUSTERS: Record<ServiceBlockId, readonly MarkKey[]> = {
  "new-product": [
    "diamond",
    "branch",
    "stack",
    "grid",
    "frame",
    "field",
    "hub",
  ],
  "product-completion": [
    "grid",
    "stack",
    "branch",
    "notch",
    "frame",
    "diamond",
    "field",
  ],
  "product-support": [
    "frame",
    "field",
    "stack",
    "step",
    "grid",
    "hub",
    "diamond",
  ],
  "ai-workflow-integration": [
    "field",
    "stack",
    "branch",
    "hub",
    "step",
    "grid",
    "diamond",
  ],
  "internal-tool": [
    "grid",
    "hub",
    "stack",
    "frame",
    "branch",
    "field",
    "diamond",
  ],
};

/** The middle row's centre tile — the reference's one emphasized card. */
const EMPHASIS_INDEX = 3;

const ROWS: readonly (readonly number[])[] = [
  [0, 1],
  [2, 3, 4],
  [5, 6],
];

function Tile({
  mark,
  emphasis,
  delay,
}: {
  mark: MarkKey;
  emphasis: boolean;
  delay: number;
}) {
  /* The emphasized tile is the reference's highlighted card in this
     system's terms: a brighter hairline, the shared depth token, and
     the one gold mark. `group-target:` carries the deep-link "you are
     here" onto it, so the visual answers the anchor as well as the
     index does. */
  const surface = emphasis
    ? "border-white/45 shadow-[var(--shadow-modal)] text-gold group-target:border-gold/60"
    : "border-white/15 text-white/35";

  return (
    <ScrollReveal delay={delay}>
      <div
        className={`flex size-16 items-center justify-center border bg-[#0a0a0c] transition-colors duration-150 md:size-20 ${surface}`}
      >
        <svg viewBox="0 0 24 24" className="size-7 md:size-8">
          {MARKS[mark]}
        </svg>
      </div>
    </ScrollReveal>
  );
}

export function ServiceBlockVisual({ block }: { block: ServiceBlockId }) {
  const marks = CLUSTERS[block];

  return (
    /* Decorative in full: the marks carry no information the text does
       not, so the cluster is removed from the accessibility tree rather
       than given labels that would read as a feature list. */
    <div aria-hidden="true" className="relative mx-auto w-fit">
      {/* The reference's radial fade, on our surface. A literal
          gradient rather than a token utility for the reason
          `globals.css` gives for the dialog backdrop: the color-mix
          form Tailwind compiles tokens to computes correctly but does
          not always paint. `--color-ink` is a plain hex, so it is safe
          to reference directly. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_30%,var(--color-ink)_78%)]"
      />
      {ROWS.map((row, r) => (
        <div key={r} className="mx-auto flex w-fit justify-center gap-2 py-1">
          {row.map((i) => (
            <Tile
              key={i}
              mark={marks[i]}
              emphasis={i === EMPHASIS_INDEX}
              delay={120 + r * 90 + row.indexOf(i) * 60}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
