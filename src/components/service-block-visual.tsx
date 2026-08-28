import { ScrollReveal } from "@/components/scroll-reveal";
import type { ServiceBlockId } from "@/lib/types";

/**
 * The decorative half of a "what you get" row (decision-log **#30**) —
 * one purpose-built mock per block.
 *
 * **Five visuals, not five shuffles (owner feedback, 2026-08-28).** The
 * first cut gave every block the same 2-3-2 tile cluster with the marks
 * reordered, which read as one visual repeated five times. Four of the
 * five are now their own thing, and the owner named what each should
 * be: a product UI for New Product, a developer workspace for Product
 * Completion, a dashboard UI for Internal Tool, the tile cluster kept
 * for AI Workflow Integration, and a free choice for Product Support
 * (a live-product ops panel: the service is "the product is live, now
 * it needs to grow", so the mock is uptime ticks and a release
 * timeline).
 *
 * **They are wireframes, and that is a Rule 4.3 requirement, not a
 * style choice.** Not one of them contains a readable string, a number,
 * a metric, a logo or a product name. A mock that showed a chart with
 * an axis, a row of integration logos, or a dashboard with figures in
 * it would be asserting things nobody has approved, on the two pages a
 * search visitor lands on first — which is exactly what Rule 4.3 and
 * decision #5 (the retired stat strip's invented numbers) exist to
 * stop. Skeleton bars assert nothing. The whole visual is `aria-hidden`
 * so it says nothing to assistive tech either.
 *
 * **Adapted from an owner-supplied shadcn reference, layout only** —
 * the posture PR #27 took with the gallery and build-note 23 with the
 * pricing module. What it contributed: the split row, the alternation,
 * the tile cluster kept below, and the idea of a visual that dissolves
 * into the page rather than sitting on it as a hard rectangle. What it
 * did **not**: any of its dependencies (`Card`, `Button`,
 * `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, a
 * `cn()` helper, a `/components/ui` directory — **none installed**),
 * its third-party product logos, its `rounded-xl`, or its shadcn token
 * palette. Squared is the shape of the brand, the page is `ink`, there
 * is no light mode, and the default Tailwind palette is cleared in
 * `globals.css` so only brand tokens compile.
 *
 * **Surfaces are the system's.** Frames are the hairline `white/15`
 * over solid `#0a0a0c` the rest of these routes use — solid rather than
 * §Surfaces' translucent-plus-blur because no `ScrollVideo` is mounted
 * here (#17) and there is nothing behind them to blur. Skeleton matter
 * rides the white alpha ladder. `gold` appears **once per mock**, on
 * the one element that is the point of it, and never as a second
 * accent (#14). The framed mocks carry §Surfaces' own bottom scrim
 * (`from-ink/85 via-ink/20 to-transparent`) so they bleed into the page
 * the way the tile cluster's radial fade does.
 *
 * **The marks and mocks are a flagged judgment call.** §Interaction
 * vocabulary settles the *list marker* and bans `lucide-react`, but it
 * does not cover a decorative wireframe, and the spec's instruction for
 * an uncovered case is to generalize from shipped code and flag rather
 * than invent silently. Everything below is built from shapes the
 * system already uses: the squared frame, the hairline, the rotated
 * square, the alpha ladder.
 *
 * Server component. Entrances are the shared `ScrollReveal` at the
 * §Motion-inventory list rhythm, so each mock assembles row by row
 * rather than appearing; no keyframe was added and `globals.css` is
 * untouched.
 */

/** Shared outer box, so all five mocks occupy the same footprint. */
const SHELL = "relative mx-auto w-full max-w-md";

/** The squared hairline window every framed mock is drawn inside. */
const FRAME =
  "relative overflow-hidden border border-white/15 bg-[#0a0a0c]";

/** §Surfaces' bottom scrim — the mock bleeds into the page. */
function Scrim() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent"
    />
  );
}

/** A skeleton line. Width and tone come from the caller. */
function Bar({ className }: { className: string }) {
  return <span className={`block h-1.5 ${className}`} />;
}

/* ------------------------------------------------------------------ *
 * New Product — a product UI.                                         *
 * A window with chrome, a content column and one gold primary action: *
 * the "working product in production" the §05 line promises.          *
 * ------------------------------------------------------------------ */
function NewProductVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={FRAME}>
          {/* Window chrome. Squared marks, not the macOS circles —
              round is not in this system's vocabulary. */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="size-1.5 bg-white/25" />
            <span className="size-1.5 bg-white/25" />
            <span className="size-1.5 bg-white/25" />
            <span className="ml-3 h-1.5 w-24 bg-white/10" />
          </div>
          <div className="space-y-6 px-6 py-7">
            <ScrollReveal delay={200} className="space-y-2.5">
              <Bar className="w-3/5 bg-white/30" />
              <Bar className="w-2/5 bg-white/15" />
            </ScrollReveal>
            <ScrollReveal delay={280} className="space-y-2.5">
              <Bar className="w-full bg-white/10" />
              <Bar className="w-11/12 bg-white/10" />
              <Bar className="w-4/6 bg-white/10" />
            </ScrollReveal>
            {/* The one gold element: the product's primary action. */}
            <ScrollReveal delay={360}>
              <span className="flex h-7 w-32 items-center bg-gold px-3">
                <span className="h-1.5 w-14 bg-gold-ink/60" />
              </span>
            </ScrollReveal>
            {/* A page region, not a row of tiles: a wide content
                column beside a narrow one. Three equal squares read as
                app icons, which is the one thing this mock must not
                look like (owner feedback) — it is a product's own
                interface, not a grid of other people's products. */}
            <ScrollReveal
              delay={440}
              className="grid grid-cols-[2fr_1fr] gap-3 pt-1"
            >
              <span className="space-y-2 border border-white/10 p-3">
                <span className="block h-1.5 w-1/2 bg-white/20" />
                <span className="block h-1.5 w-full bg-white/10" />
                <span className="block h-1.5 w-4/5 bg-white/10" />
              </span>
              <span className="space-y-2 border border-white/10 p-3">
                <span className="block h-1.5 w-2/3 bg-white/20" />
                <span className="block h-1.5 w-full bg-white/10" />
              </span>
            </ScrollReveal>
          </div>
          <Scrim />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Completion — a developer workspace.                         *
 * Tabs, a line-number gutter and indented code lines that thin out    *
 * and stop: "someone got you 70% there and disappeared."              *
 * ------------------------------------------------------------------ */

/** Indent step, width and tone per line. The tail is the point. */
const CODE_LINES: readonly { indent: string; width: string; tone: string }[] = [
  { indent: "ml-0", width: "w-5/12", tone: "bg-white/25" },
  { indent: "ml-4", width: "w-8/12", tone: "bg-white/20" },
  { indent: "ml-4", width: "w-6/12", tone: "bg-white/20" },
  { indent: "ml-8", width: "w-9/12", tone: "bg-white/15" },
  { indent: "ml-8", width: "w-4/12", tone: "bg-white/15" },
  { indent: "ml-4", width: "w-7/12", tone: "bg-white/10" },
  /* Where it was abandoned. The last line is a stub and the caret
     after it is the only gold on this mock. */
  { indent: "ml-4", width: "w-2/12", tone: "bg-white/10" },
];

function ProductCompletionVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={FRAME}>
          {/* Tab strip. The first tab is active, marked by the gold
              underline the Process accordion uses for "you are here". */}
          <div className="flex items-stretch border-b border-white/10">
            <span className="flex items-center gap-2 border-b border-gold px-4 py-3">
              <span className="size-1.5 rotate-45 bg-gold" />
              <span className="h-1.5 w-12 bg-white/30" />
            </span>
            <span className="flex items-center px-4 py-3">
              <span className="h-1.5 w-10 bg-white/10" />
            </span>
            <span className="flex items-center px-4 py-3">
              <span className="h-1.5 w-8 bg-white/10" />
            </span>
          </div>
          <div className="flex">
            {/* Line-number gutter. Ticks, never numerals: a numeral is
                content and this mock carries none. */}
            <div className="flex flex-col gap-3 border-r border-white/10 px-3 py-5">
              {CODE_LINES.map((_, i) => (
                <span key={i} className="h-1.5 w-2 bg-white/15" />
              ))}
              <span className="h-1.5 w-2 bg-white/[0.06]" />
              <span className="h-1.5 w-2 bg-white/[0.06]" />
            </div>
            <div className="grow px-4 py-5">
              {CODE_LINES.map((line, i) => (
                <ScrollReveal key={i} delay={200 + i * 55}>
                  <span
                    className={`mb-3 block h-1.5 ${line.indent} ${line.width} ${line.tone}`}
                  />
                </ScrollReveal>
              ))}
              {/* The caret, parked where the last firm stopped. */}
              <ScrollReveal delay={200 + CODE_LINES.length * 55}>
                <span className="ml-4 block h-3 w-0.5 bg-gold" />
              </ScrollReveal>
            </div>
          </div>
          <Scrim />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Support — a live-product ops panel.                         *
 * Uptime ticks and a release timeline whose newest marker is gold:    *
 * "the product is live. Now it needs to grow." No axis, no figures.   *
 * ------------------------------------------------------------------ */

/** Fourteen ticks. The last two are gold: still running, still current. */
const TICKS = Array.from({ length: 14 }, (_, i) => i);

function ProductSupportVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={FRAME}>
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="h-1.5 w-20 bg-white/25" />
            <span className="flex items-center gap-2">
              <span className="size-1.5 rotate-45 bg-gold" />
              <span className="h-1.5 w-10 bg-white/15" />
            </span>
          </div>
          <div className="space-y-7 px-6 py-7">
            {/* Uptime strip. Heights vary so it reads as a record
                rather than a pattern; no scale, no labels. */}
            <ScrollReveal delay={200}>
              <span className="flex items-end gap-1.5">
                {TICKS.map((i) => (
                  <span
                    key={i}
                    className={`w-1.5 ${
                      i > 11 ? "bg-gold" : "bg-white/20"
                    } ${
                      ["h-6", "h-8", "h-7", "h-9"][i % 4]
                    }`}
                  />
                ))}
              </span>
            </ScrollReveal>
            {/* Release timeline: evenly spaced markers on a hairline,
                the newest one filled. "We stay." */}
            <ScrollReveal delay={300}>
              <span className="relative flex items-center justify-between border-t border-white/15 pt-0">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`-mt-[3px] size-1.5 rotate-45 ${
                      i === 4 ? "bg-gold" : "bg-white/25"
                    }`}
                  />
                ))}
              </span>
            </ScrollReveal>
            <ScrollReveal delay={380} className="space-y-2.5">
              <Bar className="w-full bg-white/10" />
              <Bar className="w-10/12 bg-white/10" />
              <Bar className="w-5/12 bg-white/10" />
            </ScrollReveal>
          </div>
          <Scrim />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Internal Tool — a dashboard UI.                                     *
 * Sidebar, top bar and a data table: "a real tool that you own,       *
 * built around how your team actually works." Deliberately denser     *
 * than the New Product window so the two never read as one mock.      *
 * ------------------------------------------------------------------ */
function InternalToolVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={`${FRAME} flex`}>
          {/* Sidebar. The first item is the active one, in gold. */}
          <div className="w-16 shrink-0 space-y-3 border-r border-white/10 px-3 py-4">
            <span className="block h-1.5 w-6 bg-white/25" />
            <span className="mt-5 block h-1.5 w-10 bg-gold" />
            <span className="block h-1.5 w-8 bg-white/15" />
            <span className="block h-1.5 w-9 bg-white/15" />
            <span className="block h-1.5 w-7 bg-white/15" />
          </div>
          <div className="grow">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="h-1.5 w-16 bg-white/25" />
              <span className="h-5 w-12 border border-white/20" />
            </div>
            {/* Table. A header row, then rows of cells — the shape of a
                tool a team logs into, with nothing written in it. */}
            <div className="px-4 py-4">
              <ScrollReveal delay={200}>
                <span className="mb-3 grid grid-cols-[2fr_1fr_1fr] gap-3 border-b border-white/10 pb-2">
                  <span className="h-1.5 bg-white/25" />
                  <span className="h-1.5 bg-white/25" />
                  <span className="h-1.5 bg-white/25" />
                </span>
              </ScrollReveal>
              {[0, 1, 2, 3].map((r) => (
                <ScrollReveal key={r} delay={260 + r * 60}>
                  <span className="mb-3 grid grid-cols-[2fr_1fr_1fr] items-center gap-3">
                    <span className="h-1.5 bg-white/12" />
                    <span className="h-1.5 bg-white/12" />
                    {/* One agent-run marker per table, gold, on the
                        row the eye lands on first. */}
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`size-1.5 rotate-45 ${
                          r === 1 ? "bg-gold" : "bg-white/20"
                        }`}
                      />
                      <span className="h-1.5 grow bg-white/12" />
                    </span>
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <Scrim />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * AI Workflow Integration — the tile cluster. KEPT (owner direction). *
 * The reference's own shape, and the one block it actually suits:     *
 * agents dropped into the processes a business already runs.          *
 * ------------------------------------------------------------------ */

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
  /** A squared frame inside a frame — a system with an edge. */
  frame: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" {...STROKE} />
      <rect x="8.5" y="8.5" width="7" height="7" {...STROKE} />
    </>
  ),
  /** Four cells — a process made of steps. */
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" {...STROKE} />
      <rect x="13.5" y="3.5" width="7" height="7" {...STROKE} />
      <rect x="3.5" y="13.5" width="7" height="7" {...STROKE} />
      <rect x="13.5" y="13.5" width="7" height="7" {...STROKE} />
    </>
  ),
  /** Layers — the stack the work already runs on. */
  stack: (
    <>
      <path d="M3.5 6.5h17" {...STROKE} />
      <path d="M3.5 12h17" {...STROKE} />
      <path d="M3.5 17.5h17" {...STROKE} />
    </>
  ),
  /** A hub with spokes — the agent, sitting inside the process. */
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
  /** A step line — the day to day, over time. */
  step: <path d="M3.5 17.5h4.5V12h4.5V7h4.5v10.5h3.5" {...STROKE} />,
  /** A field of points — the volume the work runs at. */
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

/** Cluster order: two, then three, then two. Index 3 is the centre. */
const WORKFLOW_MARKS: readonly MarkKey[] = [
  "field",
  "stack",
  "branch",
  "hub",
  "step",
  "grid",
  "diamond",
];

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
     here" onto it, so the visual answers the anchor as the index does. */
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

function WorkflowVisual() {
  return (
    <div className="relative mx-auto w-fit">
      {/* The reference's radial fade. A literal gradient rather than a
          token utility for the reason `globals.css` gives for the
          dialog backdrop: the color-mix form Tailwind compiles tokens
          to computes correctly but does not always paint.
          `--color-ink` is a plain hex, so referencing it is safe. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_30%,var(--color-ink)_78%)]" />
      {ROWS.map((row, r) => (
        <div key={r} className="mx-auto flex w-fit justify-center gap-2 py-1">
          {row.map((i) => (
            <Tile
              key={i}
              mark={WORKFLOW_MARKS[i]}
              emphasis={i === EMPHASIS_INDEX}
              delay={120 + r * 90 + row.indexOf(i) * 60}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Block -> its visual. Total over `ServiceBlockId`, so a new block
 * cannot ship without one and cannot silently inherit another's.
 */
const VISUALS: Record<ServiceBlockId, () => React.JSX.Element> = {
  "new-product": NewProductVisual,
  "product-completion": ProductCompletionVisual,
  "product-support": ProductSupportVisual,
  "ai-workflow-integration": WorkflowVisual,
  "internal-tool": InternalToolVisual,
};

export function ServiceBlockVisual({ block }: { block: ServiceBlockId }) {
  const Visual = VISUALS[block];

  return (
    /* Decorative in full: every mock is skeleton matter carrying no
       readable content, so it is removed from the accessibility tree
       rather than given labels that would read as a feature list. */
    <div aria-hidden="true">
      <Visual />
    </div>
  );
}
