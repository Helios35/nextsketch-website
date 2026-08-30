import { ScrollReveal } from "@/components/scroll-reveal";
import type { ServiceBlockId } from "@/lib/types";

/**
 * The decorative half of a "what you get" row (decision-log **#30**) —
 * one purpose-built wireframe per block.
 *
 * **Five visuals, not five shuffles (owner feedback, 2026-08-28).** The
 * first cut gave every block the same tile cluster with the marks
 * reordered, which read as one visual repeated five times. The owner
 * named what four of them should be: a product UI for New Product, a
 * developer workspace for Product Completion, a dashboard UI for
 * Internal Tool, the tile cluster kept for AI Workflow Integration, and
 * a free choice for Product Support (a live-product ops panel: that
 * service is "the product is live, now it needs to grow"). "Not apps"
 * was said twice, so no mock is a grid of equal squares.
 *
 * **They are wireframes, and that is a Rule 4.3 requirement, not a
 * style choice.** Not one contains a readable string, a numeral, a
 * metric, a logo or a product name. A mock showing a chart with an
 * axis, a dashboard with figures, or a row of integration logos would
 * assert things nobody has approved, on the two pages a search visitor
 * lands on first — which is what Rule 4.3 and decision **#5** (the
 * retired stat strip's invented numbers) exist to stop. Skeleton bars
 * assert nothing, and every visual is `aria-hidden` so it says nothing
 * to assistive tech either.
 *
 * **Colour — a narrow supersession of decision #14 (owner direction,
 * 2026-08-28).** #14 orphaned every accent but gold, and the unit-26
 * brief repeats it: "Do not read the per-service `accent` field… those
 * values are dead data." The owner asked for these mocks to carry
 * colour "in the same colour range as our palette (reds greens and
 * others)", which is `rose`, `sage` and `lavender`. That is honoured
 * **narrowly, the way #26 narrowly superseded "no CTA in the nav"**:
 *
 * - The colours appear **only as interface chrome inside a decorative
 *   wireframe** — syntax highlighting, status dots, an avatar chip.
 *   They are what makes a mock read as a real screen instead of grey
 *   bars.
 * - They are **never a brand accent and never per-service**. No block
 *   owns a colour, the `accent` field in `src/content/services.ts` is
 *   still unread and still dead, and the retired accent-block card
 *   vocabulary stays retired.
 * - **`gold` remains the only emphasis.** Each mock spends it at full
 *   strength on the element that is the point of it — the primary
 *   action, the active tab, the current release, the active nav item,
 *   the centre tile. The others sit at 45–85% alpha, which was tuned
 *   in-browser rather than guessed: below ~70% a 1.25px stroke on a
 *   near-black tile reads grey, and above ~85% they start competing
 *   with gold. They are chrome, and they stay under it.
 * - **No new token.** #14's "no new tokens" clause is untouched: these
 *   are the four that already exist in `globals.css`.
 *
 * **Adapted from an owner-supplied shadcn reference, layout only** —
 * the posture PR #27 took with the gallery and build-note 23 with the
 * pricing module. It contributed the split row, the alternation, the
 * tile cluster kept below, and the fade that dissolves a visual into
 * the page. It did **not** contribute any of its dependencies (`Card`,
 * `Button`, `lucide-react`, `@radix-ui/react-slot`,
 * `class-variance-authority`, a `cn()` helper, a `/components/ui`
 * directory — **none installed**), its third-party product logos, its
 * `rounded-xl`, or its shadcn token palette.
 *
 * **One box, one fade (owner direction).** All five sit in the same
 * `4/3` frame so the rows line up down the page, and all five carry the
 * cluster's radial fade rather than the earlier bottom scrim, so each
 * dissolves into the page from every edge instead of only the bottom.
 *
 * Server component. Entrances are the shared `ScrollReveal` at the
 * §Motion-inventory list rhythm, so each mock assembles region by
 * region rather than appearing; no keyframe was added and
 * `globals.css` is untouched.
 */

/**
 * Shared outer box — every mock occupies the same footprint.
 *
 * It **fills its column from `lg:` up**, where the row is two-up, so the
 * mock's outer edge meets the page measure exactly as the text column's
 * does on the other side (owner direction, 2026-08-30). Centred inside
 * the track it was inset from that edge by ~48px, which is precisely
 * the row-to-row inconsistency the measure was added to remove. Below
 * `lg:` the row is stacked and the cap comes back, so a mock never
 * blows up to the full band width on a tablet.
 */
const SHELL = "relative mx-auto w-full max-w-md lg:max-w-none";

/** The shared aspect box. Squared, hairline, solid — no blur, since
 *  no `ScrollVideo` is mounted here (#17) and there is nothing behind
 *  a mock to blur. */
const FRAME =
  "relative flex aspect-[4/3] flex-col overflow-hidden border border-white/15 bg-[#0a0a0c]";

/**
 * The radial fade, on every visual, at **full strength** (owner
 * direction, 2026-08-28). It was softened once so the newly-added
 * chrome and profile chip would survive at the edges; the owner asked
 * for the fade back, so the dissolve wins and the corner detail is
 * deliberately spent. That is the trade: these are atmosphere, not
 * diagrams, and a mock that reads as a hard rectangle pasted on the
 * page is the thing the fade exists to prevent. Detail that has to be
 * legible therefore lives toward the centre of each mock.
 *
 * A literal gradient rather than a token utility, for the reason
 * `globals.css` gives for the dialog backdrop: the color-mix form
 * Tailwind compiles tokens to computes correctly but does not always
 * paint. `--color-ink` is a plain hex, so referencing it directly is
 * safe. An ellipse rather than a circle because the box is 4/3 and a
 * circle would eat the sides first.
 */
function Fade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-ink)_94%)]"
    />
  );
}

/** The profile chip every mock's chrome carries (owner direction). */
function Profile() {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <span className="h-1.5 w-7 bg-white/15" />
      <span className="size-5 border border-white/20 bg-lavender/55" />
    </span>
  );
}

/** A status dot in the interface-chrome palette. */
function Dot({ tone }: { tone: string }) {
  return <span className={`size-1.5 shrink-0 rotate-45 ${tone}`} />;
}

/* ------------------------------------------------------------------ *
 * New Product — a product UI.                                         *
 * Chrome, a nav row, a content column, one gold primary action and a  *
 * page region: the "working product in production" the §05 promises.  *
 * ------------------------------------------------------------------ */
function NewProductVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={FRAME}>
          {/* Window chrome. Squared marks, not the macOS circles —
              round is not in this system's vocabulary. */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="size-1.5 bg-rose/80" />
            <span className="size-1.5 bg-gold/80" />
            <span className="size-1.5 bg-sage/80" />
            <span className="ml-3 h-1.5 w-20 bg-white/10" />
            <span className="grow" />
            <Profile />
          </div>
          {/* Nav row. */}
          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-2.5">
            <span className="h-1.5 w-8 bg-white/25" />
            <span className="h-1.5 w-10 bg-white/10" />
            <span className="h-1.5 w-7 bg-white/10" />
            <span className="h-1.5 w-9 bg-white/10" />
          </div>
          <div className="grow space-y-4 px-5 py-5">
            <ScrollReveal delay={200} className="space-y-2">
              <span className="block h-2 w-3/5 bg-white/30" />
              <span className="block h-1.5 w-2/5 bg-white/15" />
            </ScrollReveal>
            <ScrollReveal delay={280} className="space-y-2">
              <span className="block h-1.5 w-full bg-white/10" />
              <span className="block h-1.5 w-11/12 bg-white/10" />
            </ScrollReveal>
            {/* The one gold element: the product's primary action,
                beside a de-emphasised second. */}
            <ScrollReveal delay={360} className="flex items-center gap-2">
              <span className="flex h-6 w-24 items-center bg-gold px-2.5">
                <span className="h-1.5 w-12 bg-gold-ink/60" />
              </span>
              <span className="flex h-6 w-16 items-center border border-white/20 px-2.5">
                <span className="h-1.5 w-8 bg-white/20" />
              </span>
            </ScrollReveal>
            {/* A page region, not a row of tiles: a wide content column
                beside a narrow one. Three equal squares read as app
                icons, which is the one thing this must not look like. */}
            <ScrollReveal
              delay={440}
              className="grid grid-cols-[2fr_1fr] gap-2.5"
            >
              <span className="space-y-2 border border-white/10 p-2.5">
                <span className="flex items-center gap-2">
                  <Dot tone="bg-sage/85" />
                  <span className="block h-1.5 w-1/2 bg-white/20" />
                </span>
                <span className="block h-1.5 w-full bg-white/10" />
                <span className="block h-1.5 w-4/5 bg-white/10" />
              </span>
              <span className="space-y-2 border border-white/10 p-2.5">
                <span className="flex items-center gap-2">
                  <Dot tone="bg-rose/85" />
                  <span className="block h-1.5 w-1/2 bg-white/20" />
                </span>
                <span className="block h-1.5 w-full bg-white/10" />
              </span>
            </ScrollReveal>
          </div>
          <Fade />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Completion — a developer workspace.                         *
 * Tabs, a gutter, syntax-coloured code that thins out and stops, and  *
 * a parked caret: "got you 70% there and disappeared."                *
 * ------------------------------------------------------------------ */

/**
 * Each line is its own run of coloured tokens. The colours are the
 * editor's, not the brand's — keywords, strings, comments — and the
 * tail deliberately thins to nothing, which is the whole metaphor.
 */
const CODE_LINES: readonly (readonly { w: string; tone: string }[])[] = [
  [
    { w: "w-8", tone: "bg-lavender/80" },
    { w: "w-14", tone: "bg-white/25" },
    { w: "w-6", tone: "bg-sage/75" },
  ],
  [
    { w: "w-4", tone: "bg-white/10" },
    { w: "w-10", tone: "bg-lavender/80" },
    { w: "w-20", tone: "bg-sage/75" },
  ],
  [
    { w: "w-4", tone: "bg-white/10" },
    { w: "w-12", tone: "bg-white/20" },
    { w: "w-8", tone: "bg-rose/75" },
  ],
  [
    { w: "w-8", tone: "bg-white/10" },
    { w: "w-9", tone: "bg-lavender/80" },
    { w: "w-14", tone: "bg-white/20" },
  ],
  [
    { w: "w-8", tone: "bg-white/10" },
    { w: "w-16", tone: "bg-sage/75" },
  ],
  /* The comment the last firm left behind, then the stub. */
  [{ w: "w-24", tone: "bg-white/12" }],
  [
    { w: "w-4", tone: "bg-white/10" },
    { w: "w-6", tone: "bg-white/15" },
  ],
];

function ProductCompletionVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={FRAME}>
          {/* Tab strip. The first tab is active, marked by the gold
              underline the Process accordion uses for "you are here". */}
          <div className="flex items-stretch border-b border-white/10 pr-4">
            <span className="flex items-center gap-2 border-b border-gold px-4 py-3">
              <span className="size-1.5 rotate-45 bg-gold" />
              <span className="h-1.5 w-10 bg-white/30" />
            </span>
            <span className="flex items-center gap-2 px-4 py-3">
              <Dot tone="bg-sage/80" />
              <span className="h-1.5 w-8 bg-white/10" />
            </span>
            <span className="flex items-center gap-2 px-4 py-3">
              <Dot tone="bg-lavender/80" />
              <span className="h-1.5 w-7 bg-white/10" />
            </span>
            <span className="grow" />
            <span className="flex items-center">
              <Profile />
            </span>
          </div>
          <div className="flex grow">
            {/* Line-number gutter. Ticks, never numerals: a numeral is
                content and this mock carries none. */}
            <div className="flex flex-col gap-[11px] border-r border-white/10 px-3 py-4">
              {CODE_LINES.map((_, i) => (
                <span key={i} className="h-1.5 w-2 bg-white/15" />
              ))}
              <span className="h-1.5 w-2 bg-white/[0.06]" />
              <span className="h-1.5 w-2 bg-white/[0.06]" />
            </div>
            <div className="grow px-4 py-4">
              {CODE_LINES.map((line, i) => (
                <ScrollReveal key={i} delay={200 + i * 55}>
                  <span
                    className={`mb-[11px] flex items-center gap-2 ${
                      i === 0 ? "" : i < 5 ? "pl-4" : "pl-0"
                    }`}
                  >
                    {line.map((token, t) => (
                      <span
                        key={t}
                        className={`block h-1.5 ${token.w} ${token.tone}`}
                      />
                    ))}
                  </span>
                </ScrollReveal>
              ))}
              {/* The caret, parked where the last firm stopped. */}
              <ScrollReveal delay={200 + CODE_LINES.length * 55}>
                <span className="block h-3 w-0.5 bg-gold" />
              </ScrollReveal>
            </div>
          </div>
          {/* Status bar. */}
          <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5">
            <Dot tone="bg-sage/85" />
            <span className="h-1.5 w-10 bg-white/12" />
            <Dot tone="bg-rose/85" />
            <span className="h-1.5 w-6 bg-white/12" />
            <span className="grow" />
            <span className="h-1.5 w-8 bg-white/12" />
          </div>
          <Fade />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Support — a live-product ops panel.                         *
 * Uptime ticks and a release timeline: "the product is live. Now it   *
 * needs to grow." No axis, no scale, no figures.                      *
 * ------------------------------------------------------------------ */

/** Mostly healthy, one bad patch, the newest two current. */
const TICKS: readonly string[] = [
  "bg-sage/75",
  "bg-sage/75",
  "bg-sage/75",
  "bg-rose/80",
  "bg-sage/75",
  "bg-sage/75",
  "bg-sage/75",
  "bg-sage/75",
  "bg-rose/80",
  "bg-sage/75",
  "bg-sage/75",
  "bg-sage/75",
  "bg-gold",
  "bg-gold",
];

const TICK_HEIGHTS = ["h-7", "h-9", "h-8", "h-10"];

function ProductSupportVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={FRAME}>
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <Dot tone="bg-sage/80" />
            <span className="h-1.5 w-16 bg-white/25" />
            <span className="grow" />
            <Profile />
          </div>
          <div className="grow space-y-5 px-5 py-5">
            {/* Uptime strip. Heights vary so it reads as a record
                rather than a pattern; no scale, no labels. */}
            <ScrollReveal delay={200}>
              <span className="flex items-end gap-1.5">
                {TICKS.map((tone, i) => (
                  <span
                    key={i}
                    className={`w-2 ${tone} ${TICK_HEIGHTS[i % 4]}`}
                  />
                ))}
              </span>
            </ScrollReveal>
            {/* Release timeline: evenly spaced markers on a hairline,
                the newest one filled. "We stay." */}
            <ScrollReveal delay={300}>
              <span className="flex items-center justify-between border-t border-white/15">
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
            {/* Event log. */}
            <ScrollReveal delay={380} className="space-y-2.5">
              {[
                { tone: "bg-sage/85", w: "w-full" },
                { tone: "bg-lavender/85", w: "w-10/12" },
                { tone: "bg-rose/85", w: "w-8/12" },
                { tone: "bg-sage/85", w: "w-9/12" },
              ].map((row, i) => (
                <span key={i} className="flex items-center gap-2.5">
                  <Dot tone={row.tone} />
                  <span className={`block h-1.5 ${row.w} bg-white/10`} />
                </span>
              ))}
            </ScrollReveal>
          </div>
          <Fade />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Internal Tool — a dashboard UI.                                     *
 * Sidebar, top bar and a data table: "a real tool that you own."      *
 * Deliberately denser than the New Product window so the two never    *
 * read as one mock.                                                   *
 * ------------------------------------------------------------------ */
const TABLE_ROWS: readonly string[] = [
  "bg-sage/85",
  "bg-gold",
  "bg-rose/85",
  "bg-lavender/85",
  "bg-sage/85",
];

function InternalToolVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={`${FRAME} flex-row`}>
          {/* Sidebar. The active item is the gold one. */}
          <div className="w-16 shrink-0 space-y-3 border-r border-white/10 px-3 py-4">
            <span className="block size-4 border border-white/20 bg-white/5" />
            <span className="mt-5 block h-1.5 w-9 bg-gold" />
            <span className="block h-1.5 w-7 bg-white/15" />
            <span className="block h-1.5 w-8 bg-white/15" />
            <span className="block h-1.5 w-6 bg-white/15" />
            <span className="block h-1.5 w-8 bg-white/15" />
          </div>
          <div className="flex grow flex-col">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="h-1.5 w-14 bg-white/25" />
              <span className="h-4 w-10 border border-white/15" />
              <span className="grow" />
              <Profile />
            </div>
            {/* Table. A header row, then rows of cells — the shape of a
                tool a team logs into, with nothing written in it. */}
            <div className="grow px-4 py-3.5">
              <ScrollReveal delay={200}>
                <span className="mb-3 grid grid-cols-[2fr_1fr_1fr] gap-3 border-b border-white/10 pb-2">
                  <span className="h-1.5 bg-white/25" />
                  <span className="h-1.5 bg-white/25" />
                  <span className="h-1.5 bg-white/25" />
                </span>
              </ScrollReveal>
              {TABLE_ROWS.map((tone, r) => (
                <ScrollReveal key={r} delay={260 + r * 55}>
                  <span className="mb-3 grid grid-cols-[2fr_1fr_1fr] items-center gap-3">
                    <span className="h-1.5 bg-white/12" />
                    <span className="h-1.5 bg-white/12" />
                    {/* The run marker: agents behind a real interface. */}
                    <span className="flex items-center gap-1.5">
                      <Dot tone={tone} />
                      <span className="h-1.5 grow bg-white/12" />
                    </span>
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <Fade />
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

/**
 * 24px viewBox, `currentColor` — the ArrowIcon contract, at 1.75 rather
 * than the hairline 1.25. Measured, not guessed: `sage` and `lavender`
 * are deliberately desaturated pastels, and at 1.25px on a near-black
 * tile they resolve to grey no matter what alpha they carry. The extra
 * half-pixel is what lets the colour register at all.
 */
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
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

/**
 * Cluster order: two, then three, then two. Index 3 is the centre and
 * takes gold. The rest are tinted from the interface-chrome palette,
 * which is what the reference's own tiles did with product logos —
 * without asserting a single integration.
 */
const CLUSTER: readonly { mark: MarkKey; tone: string }[] = [
  { mark: "field", tone: "text-white/45" },
  { mark: "stack", tone: "text-sage/85" },
  { mark: "branch", tone: "text-lavender/85" },
  { mark: "hub", tone: "text-gold" },
  { mark: "step", tone: "text-rose/85" },
  { mark: "grid", tone: "text-white/45" },
  { mark: "diamond", tone: "text-sage/70" },
];

const EMPHASIS_INDEX = 3;

const ROWS: readonly (readonly number[])[] = [
  [0, 1],
  [2, 3, 4],
  [5, 6],
];

function Tile({
  mark,
  tone,
  emphasis,
  delay,
}: {
  mark: MarkKey;
  tone: string;
  emphasis: boolean;
  delay: number;
}) {
  /* The emphasized tile is the reference's highlighted card in this
     system's terms: a brighter hairline, the shared depth token, and
     the one gold mark. `group-target:` carries the deep-link "you are
     here" onto it, so the visual answers the anchor as the index does. */
  const surface = emphasis
    ? "border-white/45 shadow-[var(--shadow-modal)] group-target:border-gold/60"
    : "border-white/15";

  return (
    <ScrollReveal delay={delay}>
      <div
        className={`flex size-16 items-center justify-center border bg-[#0a0a0c] transition-colors duration-150 md:size-[74px] ${surface} ${tone}`}
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
    <div className={SHELL}>
      {/* Same 4/3 box as the framed mocks, so all five rows line up.
          Frameless on purpose: this one is a cluster, not a screen. */}
      <div className="flex aspect-[4/3] items-center justify-center">
        {/* **The fade rides the cluster's own box, not the 4/3 frame.**
            This is load-bearing and it regressed once: `inset-0` on the
            outer frame scales the gradient's radius to 448x336, and the
            cluster is only ~240px across, so every tile landed inside
            the clear zone and the dissolve vanished while the CSS still
            looked correct. The framed mocks fill their frame, so theirs
            can sit on it; this one cannot. Values are the original
            circle stops, unchanged. */}
        <div className="relative mx-auto w-fit">
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_30%,var(--color-ink)_78%)]" />
          {ROWS.map((row, r) => (
            <div
              key={r}
              className="mx-auto flex w-fit justify-center gap-2 py-1"
            >
              {row.map((i) => (
                <Tile
                  key={i}
                  mark={CLUSTER[i].mark}
                  tone={CLUSTER[i].tone}
                  emphasis={i === EMPHASIS_INDEX}
                  delay={120 + r * 90 + row.indexOf(i) * 60}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
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
