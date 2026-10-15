import type { CSSProperties, ReactNode } from "react";
import { BrandMark } from "@/components/brand-wordmark";
import {
  DiagramStage,
  type DiagramBreakpoint,
  type DiagramSize,
} from "@/components/diagram-stage";
import { ScrollReveal } from "@/components/scroll-reveal";
import { DIAGRAM_WORDS } from "@/content/diagrams";

/**
 * The site's diagram language — decision-log **#60** (owner call,
 * 2026-10-15): every diagram on the site is drawn in the language of
 * the owner-supplied "Ink Orbit Features" reference, adapted to the
 * NextSketch design system. It replaces the decorative wireframe set of
 * #30 (`service-block-visual.tsx` before #60).
 *
 * **What the reference contributed, and what changed on the way in.**
 * It is a style reference, not code: nothing of it is installed, and
 * every value here is a token from `globals.css`.
 *
 * - **Bracket frames.** Four corner brackets just outside a quiet
 *   panel (`DiagramFrame`). The reference slides them out 3px on hover;
 *   here they only turn from `muted-foreground` to `foreground`,
 *   because the system shows state by colour, never by a transform
 *   (docs/04-ux-spec.md §Interaction vocabulary).
 * - **Line work.** Thin lines, curves into and out of a hub, one of
 *   each pair dashed (`Flow`). Its faint `#363636` lines would fail the
 *   3:1 floor for marks here, so a line is `muted-foreground` at 80%
 *   (3.9:1 on `background`, 3.7:1 on `card`, 3.5:1 on `secondary`).
 * - **Travelling dots, running dashes, a slow pulse** (#62, ambient):
 *   CSS keyframes in `globals.css`, applied `motion-safe` only, paused
 *   off screen by `DiagramStage`. Reduced motion sees each diagram
 *   complete and still: no dot, solid dashes, a ring at rest.
 * - **Mono micro-labels.** JetBrains Mono, uppercase, tracked
 *   (`D_LABEL`), smaller than the page's 0.7rem label because they sit
 *   inside a drawing, and stepping up with the diagram's own width.
 * - **Reveal on scroll.** The shared `ScrollReveal`, so the 200ms
 *   `rise-in` and its reduced-motion parity are the site's, not the
 *   reference's 800ms fade.
 * - **The hub.** Where the reference draws its placeholder "N" glyph,
 *   the NextSketch mark (#49) sits in the hub chip (`AgentHub`): the
 *   agent NextSketch builds in. Its coral lead is the logo's own.
 * - **Inverted chips.** The reference's tooltip chip (an ink fill with
 *   paper text) is `foreground` with `background` text here, 14.4:1.
 *
 * **Coral in a diagram** (docs/04-ux-spec.md §Accent rules): the mark's
 * lead, plus one emphasis per diagram on the thing that is its point
 * (the flagged mail, the routed quote, the scrubbed reading). Never a
 * line colour, never an area fill.
 *
 * **Text is real text.** Labels and sample content are HTML laid over
 * the drawing at the drawing's coordinates (`diagramGrid`), so they
 * keep a legible size while the lines scale with the box. Every string
 * is in `src/content/diagrams.ts`.
 */

/** A rectangle in a diagram's coordinates: x, y, width, height. */
export type Rect = readonly [x: number, y: number, w: number, h: number];

/** A part placed on the canvas: classes plus the coordinates as CSS vars. */
export interface Placement {
  readonly className: string;
  readonly style: CSSProperties;
}

/* Literal per breakpoint, so Tailwind sees every class it compiles. */
const PLACE: Record<DiagramBreakpoint, string> = {
  none: "absolute left-(--px) top-(--py) w-(--pw) h-(--ph)",
  sm: "absolute left-(--px) top-(--py) w-(--pw) h-(--ph) @sm:left-(--wx) @sm:top-(--wy) @sm:w-(--ww) @sm:h-(--wh)",
  "2xl":
    "absolute left-(--px) top-(--py) w-(--pw) h-(--ph) @2xl:left-(--wx) @2xl:top-(--wy) @2xl:w-(--ww) @2xl:h-(--wh)",
};

const SVG_MODE: Record<DiagramBreakpoint, { tall: string; wide: string }> = {
  none: { tall: "", wide: "hidden" },
  sm: { tall: "@sm:hidden", wide: "hidden @sm:block" },
  "2xl": { tall: "@2xl:hidden", wide: "hidden @2xl:block" },
};

const pct = (v: number, of: number): string =>
  `${Number(((v / of) * 100).toFixed(3))}%`;

/**
 * A diagram's coordinate system: its narrow drawing (`tall`), its wide
 * one, and where it switches. `place` turns a rectangle in each drawing
 * into percentages of the canvas, so an HTML part lands exactly where
 * the SVG lines expect it at every width. A width or height of 0 sizes
 * the part to its content.
 */
export function diagramGrid(
  breakpoint: DiagramBreakpoint,
  tall: DiagramSize,
  wide: DiagramSize = tall,
) {
  const dim = (v: number, of: number) => (v > 0 ? pct(v, of) : "auto");
  return {
    breakpoint,
    tall,
    wide,
    place(t: Rect, w: Rect = t): Placement {
      return {
        className: PLACE[breakpoint],
        style: {
          "--px": pct(t[0], tall.w),
          "--py": pct(t[1], tall.h),
          "--pw": dim(t[2], tall.w),
          "--ph": dim(t[3], tall.h),
          "--wx": pct(w[0], wide.w),
          "--wy": pct(w[1], wide.h),
          "--ww": dim(w[2], wide.w),
          "--wh": dim(w[3], wide.h),
        } as CSSProperties,
      };
    },
  };
}

export type DiagramGrid = ReturnType<typeof diagramGrid>;

/** A part of a diagram, placed at its coordinates on the canvas. */
export function Place({
  at,
  className,
  children,
}: {
  at: Placement;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`${at.className} ${className ?? ""}`} style={at.style}>
      {children}
    </div>
  );
}

/**
 * Text inside a diagram. Smaller than the page's own steps because it
 * sits in a drawing, and sized by the drawing's width (container
 * queries on `DiagramStage`): 9 and 10px from 448px wide for labels,
 * 10 and 11px for sample content. Colour is the caller's: text is
 * `foreground` or `muted-foreground` (4.6:1 or better on every diagram
 * surface), or coral where it is the diagram's one emphasis.
 */
export const D_LABEL =
  "font-mono text-[0.5625rem] leading-none tracking-[0.12em] whitespace-nowrap uppercase @md:text-[0.625rem]";
export const D_TEXT = "text-[0.625rem] leading-tight @md:text-[0.6875rem]";
/**
 * Text set straight on a canvas rather than in a panel takes the
 * canvas's own fill behind its glyphs, so no dot of the grid ever sits
 * under a letter (a dot is the `border` step, where muted text would
 * fall to about 4.1:1). `ON_CANVAS` for a service row's inset well,
 * `ON_PAGE_CANVAS` for the Why section's card.
 */
export const ON_CANVAS = "w-fit bg-background px-0.5";
export const ON_PAGE_CANVAS = "w-fit bg-card px-0.5";
/** Figures inside a diagram: Inter, tabular, like every figure on the site. */
export const D_FIGURE = `${D_TEXT} font-medium tabular-nums`;

/** The drawing layer: an SVG in the canvas's own coordinates. */
export function DiagramSvg({
  grid,
  mode = "tall",
  children,
}: {
  grid: DiagramGrid;
  mode?: "tall" | "wide";
  children: ReactNode;
}) {
  const size = mode === "tall" ? grid.tall : grid.wide;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size.w} ${size.h}`}
      className={`pointer-events-none absolute inset-0 size-full overflow-visible ${SVG_MODE[grid.breakpoint][mode]}`}
    >
      {children}
    </svg>
  );
}

const BRACKET =
  "pointer-events-none absolute size-3 border-muted-foreground transition-colors duration-150 group-hover/frame:border-foreground group-focus-within/frame:border-foreground";

/**
 * The bracket frame: four corner brackets just outside a quiet panel
 * on the dot-grid canvas. On the page ground (the Why section) the
 * panel is a `card`; inside a card (a service row) it is the
 * `background` step, an inset well, so a diagram reads as one surface
 * in both places. The brackets are `muted-foreground` (5.4:1 on
 * `background`, 5.0:1 on `card`) and turn `foreground` while the frame
 * is hovered or holds focus.
 */
export function DiagramFrame({
  surface,
  className,
  children,
}: {
  surface: "page" | "card";
  className?: string;
  children: ReactNode;
}) {
  const panel =
    surface === "page" ? "rounded-xl bg-card" : "rounded-lg bg-background";
  return (
    <div className={`group/frame relative ${className ?? ""}`}>
      <span
        aria-hidden="true"
        className={`${BRACKET} -top-1.5 -left-1.5 border-t-[1.5px] border-l-[1.5px]`}
      />
      <span
        aria-hidden="true"
        className={`${BRACKET} -top-1.5 -right-1.5 border-t-[1.5px] border-r-[1.5px]`}
      />
      <span
        aria-hidden="true"
        className={`${BRACKET} -bottom-1.5 -left-1.5 border-b-[1.5px] border-l-[1.5px]`}
      />
      <span
        aria-hidden="true"
        className={`${BRACKET} -right-1.5 -bottom-1.5 border-r-[1.5px] border-b-[1.5px]`}
      />
      <div
        className={`relative overflow-hidden border border-border bg-diagram-grid ${panel}`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * A line in a diagram, and the dots that travel it. `dashed` lines run
 * their dashes (the reference's second line of each pair). Dots are
 * `foreground`, `packets` of
 * them spread evenly round the loop and started part-way through it, so
 * a diagram never opens with every dot at its start.
 */
export function Flow({
  d,
  dashed = false,
  packets = 1,
  duration = 2.8,
  offset = 0,
}: {
  d: string;
  dashed?: boolean;
  packets?: number;
  duration?: number;
  offset?: number;
}) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        strokeWidth={1.25}
        vectorEffect="non-scaling-stroke"
        className={`stroke-muted-foreground/80 ${dashed ? "[stroke-dasharray:3_4] motion-safe:animate-diagram-dash" : ""}`}
      />
      {Array.from({ length: packets }, (_, i) => (
        <circle
          key={i}
          r={2.4}
          className="diagram-packet fill-foreground motion-safe:animate-diagram-travel"
          style={{
            offsetPath: `path("${d}")`,
            animationDuration: `${duration}s`,
            animationDelay: `${-(offset + (i * duration) / packets).toFixed(2)}s`,
          }}
        />
      ))}
    </g>
  );
}

/**
 * The agent: the NextSketch mark in a chip, with a ring that pulses
 * slowly (#62) and rests, full and still, under reduced motion.
 */
export function AgentHub({ at }: { at: Placement }) {
  return (
    <div className={at.className} style={at.style}>
      <span
        aria-hidden="true"
        className="absolute -inset-[22%] rounded-lg border border-muted-foreground/60 motion-safe:animate-diagram-pulse"
      />
      <span className="relative flex size-full items-center justify-center rounded-md border border-muted-foreground bg-secondary shadow-2xl">
        <BrandMark className="h-[58%] w-auto" />
      </span>
    </div>
  );
}

/**
 * A panel inside a diagram: a `card` with a mono header row (a kicker
 * on the left, a title on the right) over its body.
 */
export function Panel({
  kicker,
  title,
  bodyClassName,
  children,
}: {
  kicker: string;
  title: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex size-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-2 py-1.5 @md:px-2.5 @md:py-2">
        <span className={`${D_LABEL} text-muted-foreground`}>{kicker}</span>
        <span className={`${D_LABEL} truncate text-foreground`}>{title}</span>
      </div>
      <div
        className={`relative min-h-0 flex-1 overflow-hidden ${bodyClassName ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * One drawing in a service row: the product ways in (#53, #60).        *
 * ------------------------------------------------------------------ */

/**
 * The product diagrams' coordinate system: one 4/3 drawing at every
 * width, the frame the product rows' wireframes held, so their rows
 * keep their height.
 */
export const ROW_GRID = diagramGrid("none", { w: 400, h: 300 });

/**
 * A single-drawing diagram in a service row: the frame, the canvas and
 * the reveal. `role="img"` named by `label`, unless it holds a control
 * (`interactive`), when it is a `role="group"` under the same name and
 * hides its own drawing.
 */
export function RowDiagram({
  label,
  interactive = false,
  children,
}: {
  label: string;
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      role={interactive ? "group" : "img"}
      aria-label={label}
      className="mx-auto w-full max-w-md lg:max-w-none"
    >
      <div aria-hidden={interactive ? undefined : true}>
        <ScrollReveal>
          <DiagramFrame surface="card">
            <DiagramStage tall={ROW_GRID.tall}>{children}</DiagramStage>
          </DiagramFrame>
        </ScrollReveal>
      </div>
    </div>
  );
}

/**
 * A product's window in a drawing: a `card` with a chrome row (three
 * dots, a mono title, a mono note on the right). Its contents are
 * placed on the canvas by the caller, below the chrome row's 22 units.
 */
export function ProductWindow({
  at,
  chrome,
  title,
  note,
}: {
  at: Placement;
  chrome: Placement;
  title: string;
  note?: ReactNode;
}) {
  return (
    <>
      <Place at={at} className="rounded-md border border-border bg-card" />
      <Place
        at={chrome}
        className="flex items-center gap-2 border-b border-border px-2 @md:px-2.5"
      >
        <span aria-hidden="true" className="flex shrink-0 gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground/80"
            />
          ))}
        </span>
        <span className={`${D_LABEL} truncate text-foreground`}>{title}</span>
        {note !== undefined && (
          <span className={`${D_LABEL} ml-auto text-muted-foreground`}>
            {note}
          </span>
        )}
      </Place>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Before and after: the agentic examples' one composition (#57, #60).  *
 * The before panel, the agent, the after panel, joined by two lines    *
 * in and two out. Stacked under 24rem of width, side by side from it.  *
 * ------------------------------------------------------------------ */

const BA = diagramGrid("sm", { w: 300, h: 520 }, { w: 400, h: 300 });

const BA_AT = {
  before: BA.place([14, 14, 272, 200], [14, 14, 130, 272]),
  after: BA.place([14, 306, 272, 200], [256, 14, 130, 272]),
  hub: BA.place([134, 244, 32, 32], [184, 134, 32, 32]),
  hubLabel: BA.place([178, 260, 0, 0], [200, 176, 0, 0]),
};

const BA_FLOWS = {
  tall: [
    "M110,214 C110,232 145,226 145,244",
    "M190,214 C190,232 155,226 155,244",
    "M145,276 C145,294 110,288 110,306",
    "M155,276 C155,294 190,288 190,306",
  ],
  wide: [
    "M144,108 C166,108 164,145 184,145",
    "M144,192 C166,192 164,155 184,155",
    "M216,145 C236,145 234,108 256,108",
    "M216,155 C236,155 234,192 256,192",
  ],
} as const;

function BeforeAfterFlows({ mode }: { mode: "tall" | "wide" }) {
  return (
    <DiagramSvg grid={BA} mode={mode}>
      {BA_FLOWS[mode].map((d, i) => (
        <Flow
          key={d}
          d={d}
          dashed={i % 2 === 1}
          duration={i % 2 === 1 ? 3.2 : 2.6}
          offset={i * 0.45}
        />
      ))}
    </DiagramSvg>
  );
}

/**
 * Before, the agent, after. Each example supplies its two panels' titles
 * and bodies; the frame, the lines, the hub and the reveal are shared,
 * so the four read as one family.
 *
 * **What assistive tech hears.** A static diagram is `role="img"` and
 * its `label` is the whole description. A diagram whose before panel
 * holds controls (`interactive`) is a `role="group"` under the same
 * label instead: its controls stay reachable and everything else in it
 * is hidden, so nothing is read twice.
 */
export function BeforeAfterDiagram({
  label,
  before,
  after,
  status,
  interactive = false,
}: {
  label: string;
  before: { title: string; body: ReactNode; bodyClassName?: string };
  after: { title: string; body: ReactNode; bodyClassName?: string };
  /** A second line under the hub's label, e.g. what it is pulling now. */
  status?: ReactNode;
  interactive?: boolean;
}) {
  const hide = interactive ? true : undefined;
  return (
    <div
      role={interactive ? "group" : "img"}
      aria-label={label}
      className="mx-auto w-full max-w-md lg:max-w-none"
    >
      {/* A static diagram's drawing is hidden outright: its name says it
          all, and browsers do not all treat an img's children as
          presentational. An interactive one hides all but its controls. */}
      <div aria-hidden={interactive ? undefined : true}>
        <ScrollReveal>
          <DiagramFrame surface="card">
            <DiagramStage tall={BA.tall} wide={BA.wide} breakpoint="sm">
              <BeforeAfterFlows mode="tall" />
              <BeforeAfterFlows mode="wide" />
              <div
                className={BA_AT.before.className}
                style={BA_AT.before.style}
              >
                <ScrollReveal delay={120} className="size-full">
                  <Panel
                    kicker={DIAGRAM_WORDS.before}
                    title={before.title}
                    bodyClassName={before.bodyClassName}
                  >
                    {before.body}
                  </Panel>
                </ScrollReveal>
              </div>
              <div aria-hidden={hide}>
                <AgentHub at={BA_AT.hub} />
                <div
                  className={`${BA_AT.hubLabel.className} -translate-y-1/2 text-left @sm:translate-y-0 @sm:-translate-x-1/2 @sm:text-center`}
                  style={BA_AT.hubLabel.style}
                >
                  <span
                    className={`${D_LABEL} ${ON_CANVAS} block text-muted-foreground @sm:mx-auto`}
                  >
                    {DIAGRAM_WORDS.agent}
                  </span>
                  {status !== undefined && (
                    <span
                      className={`${D_LABEL} ${ON_CANVAS} mt-1.5 block text-foreground @sm:mx-auto`}
                    >
                      {status}
                    </span>
                  )}
                </div>
              </div>
              <div
                aria-hidden={hide}
                className={BA_AT.after.className}
                style={BA_AT.after.style}
              >
                <ScrollReveal delay={200} className="size-full">
                  <Panel
                    kicker={DIAGRAM_WORDS.after}
                    title={after.title}
                    bodyClassName={after.bodyClassName}
                  >
                    {after.body}
                  </Panel>
                </ScrollReveal>
              </div>
            </DiagramStage>
          </DiagramFrame>
        </ScrollReveal>
      </div>
    </div>
  );
}
