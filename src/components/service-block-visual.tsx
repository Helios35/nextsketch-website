import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { VisualFade } from "@/components/visual-fade";
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
 * **Since decision-log #53 (2026-10-15)** the product route's three
 * blocks keep their three mocks, now under their ways-in names. The
 * Internal Tool mock left with its block. The agentic route's four
 * example jobs (#57) carry no visual until the visuals brief (owner
 * direction, 2026-10-15: no empty or stand-in frame in production). The
 * app cluster of #34, which stood in for Email triage for a day, had no
 * block left and was deleted; git history keeps it. No visual was
 * restyled or redrawn here.
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
 * **Colour: a narrow supersession of decision #14 (owner direction,
 * 2026-08-28), recoloured by the rebrand (#47).** #14 orphaned every
 * accent but one (gold then, coral `brand` since #47), and the unit-26
 * brief repeats it: "Do not read the per-service `accent` field… those
 * values are dead data." The owner asked for these mocks to carry
 * colour "in the same colour range as our palette (reds greens and
 * others)". Under fin that range is the dark chart steps: terracotta
 * (`chart-1`, was `rose`), sage (`chart-5`, was `sage`) and plum
 * (`chart-4`, was `lavender`), with indigo (`chart-2`) as the fourth
 * hue the editor's file types need. That is honoured
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
 * - **Coral (`brand`) remains the only emphasis** (#47: it took gold's
 *   place one for one). Each mock spends it at full strength on the
 *   element that is the point of it: the area chart, the active tab and
 *   its parked caret, the today line, the read-out point, the hub tile.
 *   The chrome sits at 30 to 75% alpha. fin's chart steps are more
 *   saturated than the old pastels, so the old 45 to 85% ladder came
 *   down about ten points (glyphs 75%, strokes and marks 60 to 70%,
 *   token bars 50 to 60%, avatar chips 40%, area fills 15 to 20%), and
 *   terracotta sits a further ten points under the others because it
 *   shares coral's hue family and is the one chrome hue that could be
 *   read as the accent. They are chrome, and they stay under coral.
 * - **No new token.** #14's "no new tokens" clause is untouched: these
 *   are fin's chart steps, already in `globals.css` and scoped there to
 *   these wireframes (#47). The neutral ladder is `muted`, `accent`,
 *   `muted-foreground` and `foreground` at alpha; hairlines are
 *   `border`.
 *
 * **Adapted from an owner-supplied shadcn reference, layout only** —
 * the posture PR #27 took with the gallery and build-note 23 with the
 * pricing module. It contributed the split row, the alternation, the
 * tile cluster kept below, and the fade that dissolves a visual into
 * the page. It did **not** contribute any of its dependencies (`Card`,
 * `Button`, `lucide-react`, `@radix-ui/react-slot`,
 * `class-variance-authority`, a `cn()` helper, a `/components/ui`
 * directory, **none installed**), its third-party product logos, or
 * its token palette. The corners the mocks carry now are fin's radius
 * scale (#48: frames `rounded-xl`, panels `rounded-lg`, controls
 * `rounded-md`, skeleton bars and dots `rounded-full`), not the
 * reference's.
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

/** A skeleton line. Width and tone come from the caller. */
function Bar({ className }: { className: string }) {
  return <span className={`block h-1.5 rounded-full ${className}`} />;
}

/** A status dot in the interface-chrome palette. */
function Dot({ tone }: { tone: string }) {
  return <span className={`size-1.5 shrink-0 rotate-45 ${tone}`} />;
}

/* ------------------------------------------------------------------ *
 * New Product — a product dashboard, as a bento mosaic.               *
 * Replaces the single window mock, which read as a generic skeleton    *
 * box (owner, 2026-08-30). Structure adapted from an owner-supplied    *
 * dashboard reference; **this block only** — the other four visuals    *
 * and the shared `Fade` / `FRAME` are untouched.                      *
 *                                                                      *
 * Rule 4.3 is unchanged and is why every figure, label and logo in     *
 * that reference is a bar here: a dashboard printing invented balances  *
 * and brand marks is exactly the claim decision #5 retired the stat     *
 * strip over. Chrome tints are the #31 set (fin chart steps, #47);     *
 * coral (`brand`) appears once, on the area chart, and nowhere else.   *
 * ------------------------------------------------------------------ */

/**
 * One tile in the mosaic. The mosaic is deliberately **not** wrapped in
 * `FRAME`: a bento cropped by a hard outer border reads as a
 * screenshot, which is the thing being replaced. Each tile carries its
 * own hairline instead and the grid dissolves at the box edge.
 *
 * `min-w-0` and `overflow-hidden` are load-bearing, not tidy-up. A grid
 * item defaults to `min-width: auto`, so a fixed-width bar inside a
 * narrow column pushes the track wider, the grid wider, and the page
 * wider — a horizontal scrollbar on a phone, from a decorative mock.
 * With these the content clips instead, which the fade hides anyway.
 */
function MosaicTile({
  delay,
  className = "",
  children,
}: {
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal delay={delay} className="min-h-0 min-w-0">
      <div
        className={`flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card ${className}`}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}

/** Ranked rows: a filled bar of decreasing width beside a value bar. */
const RANKED: readonly { w: string; tone: string }[] = [
  { w: "w-full", tone: "bg-chart-4/60" },
  { w: "w-4/5", tone: "bg-chart-5/60" },
  { w: "w-3/5", tone: "bg-chart-1/50" },
  { w: "w-2/5", tone: "bg-muted-foreground/40" },
];

/** List rows: a tinted mark beside a label. */
const LIST_ROWS: readonly string[] = [
  "bg-chart-1/50",
  "bg-chart-5/60",
  "bg-chart-4/60",
  "bg-muted-foreground/40",
];

function NewProductVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <div className="grid h-full grid-cols-[1.15fr_1.2fr_0.8fr] gap-2.5">
          {/* Left column. */}
          <div className="grid min-h-0 min-w-0 grid-rows-[1.05fr_1fr] gap-2.5">
            {/* Headline figure over an area chart. The chart is the one
                coral element in the whole mosaic; everything else is
                chrome or the neutral token ladder. Its area fill is
                tempered to 24% because coral runs hotter at the same
                alpha (#47). */}
            <MosaicTile delay={120} className="p-3.5">
              <Bar className="w-16 bg-muted-foreground/60" />
              <span className="mt-3 block h-4 w-3/4 rounded-sm bg-foreground/85" />
              <span className="mt-2.5 flex items-center gap-2">
                <Dot tone="bg-chart-5/70" />
                <Bar className="w-20 bg-accent" />
              </span>
              <div className="-mx-3.5 -mb-3.5 mt-auto h-1/2">
                <svg
                  viewBox="0 0 200 70"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <defs>
                    <linearGradient id="np-area" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-brand)"
                        stopOpacity="0.24"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-brand)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 58 L18 52 L34 54 L52 44 L70 46 L88 34 L104 37 L122 26 L140 22 L158 14 L176 12 L200 4 L200 70 L0 70 Z"
                    fill="url(#np-area)"
                  />
                  <path
                    d="M0 58 L18 52 L34 54 L52 44 L70 46 L88 34 L104 37 L122 26 L140 22 L158 14 L176 12 L200 4"
                    fill="none"
                    stroke="var(--color-brand)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </MosaicTile>

            {/* Two-series line chart over a gridded plot. */}
            <MosaicTile delay={190} className="p-3.5">
              <Bar className="w-20 bg-muted-foreground/60" />
              <span className="mt-2.5 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-4 rounded-full bg-chart-1/60" />
                  <Bar className="w-8 bg-accent" />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-4 rounded-full bg-muted-foreground/80" />
                  <Bar className="w-8 bg-accent" />
                </span>
              </span>
              <div className="mt-auto flex grow items-stretch gap-2 pt-3">
                <span className="flex w-4 shrink-0 flex-col justify-between py-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="h-1 w-3 rounded-full bg-accent" />
                  ))}
                </span>
                <span className="relative grow">
                  <svg
                    viewBox="0 0 200 80"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    {[4, 22, 40, 58, 76].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="200"
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-border"
                      />
                    ))}
                    <path
                      d="M0 76 L30 70 L60 52 L90 40 L120 26 L150 18 L200 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground/80"
                    />
                    <path
                      d="M0 78 L30 76 L60 72 L90 66 L120 62 L150 58 L200 54 L200 80 L0 80 Z"
                      fill="currentColor"
                      className="text-chart-1/15"
                    />
                    <path
                      d="M0 78 L30 76 L60 72 L90 66 L120 62 L150 58 L200 54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-chart-1/60"
                    />
                  </svg>
                </span>
              </div>
            </MosaicTile>
          </div>

          {/* Middle column. */}
          <div className="grid min-h-0 min-w-0 grid-rows-[0.85fr_1.25fr_0.9fr] gap-2.5">
            {/* Goal card with a progress track. */}
            <MosaicTile delay={250} className="p-3.5">
              <span className="flex items-center gap-2.5">
                <span className="size-7 shrink-0 rounded-md border border-border bg-muted" />
                <span className="space-y-1.5">
                  <Bar className="w-24 bg-muted-foreground/60" />
                  <Bar className="w-14 bg-accent" />
                </span>
              </span>
              <span className="mt-auto block h-2 w-full rounded-full bg-muted">
                <span className="block h-full w-[62%] rounded-full bg-chart-5/60" />
              </span>
              <span className="mt-2.5 flex items-center gap-2">
                <Dot tone="bg-chart-5/70" />
                <Bar className="w-16 bg-accent" />
              </span>
            </MosaicTile>

            {/* Ranked category bars. */}
            <MosaicTile delay={310} className="p-3.5">
              <Bar className="w-28 bg-muted-foreground/60" />
              <div className="mt-auto space-y-2.5">
                {RANKED.map((row, i) => (
                  <span key={i} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 items-center gap-2 rounded-sm px-2 ${row.w} ${row.tone}`}
                    >
                      <span className="size-1.5 shrink-0 rotate-45 bg-background/40" />
                      <span className="h-1.5 w-8 rounded-full bg-background/30" />
                    </span>
                    <Bar className="w-10 shrink-0 bg-muted-foreground/40" />
                  </span>
                ))}
              </div>
            </MosaicTile>

            {/* Three-figure stat row beside a ring gauge. */}
            <MosaicTile delay={370} className="p-3.5">
              <span className="flex items-start justify-between">
                <Bar className="h-2.5 w-20 bg-muted-foreground/80" />
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-border border-t-chart-5/70 border-r-chart-5/70">
                  <span className="size-3 rounded-full bg-accent" />
                </span>
              </span>
              <div className="mt-auto grid grid-cols-3 gap-2">
                {["bg-foreground/70", "bg-foreground/70", "bg-chart-5/70"].map((tone, i) => (
                  <span key={i} className="space-y-2">
                    <Bar className="w-10 bg-accent" />
                    <span className={`block h-2.5 w-12 rounded-full ${tone}`} />
                  </span>
                ))}
              </div>
            </MosaicTile>
          </div>

          {/* Right column. */}
          <div className="grid min-h-0 min-w-0 grid-rows-[1.1fr_1fr] gap-2.5">
            {/* Scheduled list: a mark and a two-line row, hairline divided. */}
            <MosaicTile delay={430}>
              <span className="border-b border-border px-3.5 py-3">
                <Bar className="w-20 bg-muted-foreground/80" />
              </span>
              <div className="flex grow flex-col justify-around">
                {LIST_ROWS.map((tone, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5 last:border-b-0"
                  >
                    <span
                      className={`size-5 shrink-0 rounded-md border border-border ${tone}`}
                    />
                    <span className="space-y-1.5">
                      <Bar className="w-12 bg-muted-foreground/50" />
                      <Bar className="w-8 bg-accent" />
                    </span>
                  </span>
                ))}
              </div>
            </MosaicTile>

            {/* Activity list: a mark and a single line. */}
            <MosaicTile delay={490}>
              <span className="border-b border-border px-3.5 py-3">
                <Bar className="w-16 bg-muted-foreground/80" />
              </span>
              <div className="flex grow flex-col justify-around px-3.5">
                {LIST_ROWS.map((tone, i) => (
                  <span key={i} className="flex items-center gap-2.5">
                    <span className={`size-1.5 shrink-0 rotate-45 ${tone}`} />
                    <Bar className="w-16 bg-muted-foreground/50" />
                  </span>
                ))}
              </div>
            </MosaicTile>
          </div>
        </div>
        <VisualFade />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Completion — a developer environment.                       *
 * An explorer tree beside a tabbed editor. Replaces the framed window  *
 * mock, which had a box around it and too little detail (owner,        *
 * 2026-08-30). Structure adapted from an owner-supplied editor         *
 * screenshot; **this block only** — nothing else on either route       *
 * changes.                                                            *
 *                                                                      *
 * **No outer frame, on purpose.** A border around it makes it read as  *
 * a screenshot pasted on the page; the internal chrome (the explorer   *
 * rule, the tab strip, the gutter) is what says "editor", and the      *
 * shared `VisualFade` dissolves the edges instead.                     *
 *                                                                      *
 * Rule 4.3 as everywhere else: no filename, no code, no numeral, no    *
 * logo. The reference's syntax colours map onto the #31 chrome set     *
 * (fin chart steps, #47): plum `chart-4` for keywords and component    *
 * files, sage `chart-5` for strings, terracotta `chart-1` for values   *
 * and stylesheets, indigo `chart-2` for the config file type, the      *
 * `muted-foreground` ladder for identifiers and punctuation, `muted`   *
 * for comments. Coral (`brand`) marks the active tab and the parked    *
 * caret, and nowhere else.                                             *
 * ------------------------------------------------------------------ */

/** Disclosure caret for a tree row. Inline SVG, per §Interaction vocabulary. */
function Caret({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`size-2.5 shrink-0 text-muted-foreground/60 ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M4.5 2 L8 6 L4.5 10" />
    </svg>
  );
}

/** Close affordance on a tab. */
function TabClose() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-2.5 shrink-0 text-muted-foreground/40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M3 3 L9 9 M9 3 L3 9" />
    </svg>
  );
}

/**
 * The explorer tree. `depth` is the indent step, `kind` decides the
 * mark: a hollow square is a folder, a filled one is a file tinted by
 * type. `active` is the open file, the one row with a fill behind it.
 */
const TREE: readonly {
  depth: 0 | 1 | 2 | 3;
  folder?: boolean;
  open?: boolean;
  tone?: string;
  w: string;
  active?: boolean;
}[] = [
  { depth: 0, folder: true, w: "w-20" },
  { depth: 0, folder: true, w: "w-12" },
  { depth: 0, folder: true, open: true, w: "w-8" },
  { depth: 1, folder: true, w: "w-12" },
  { depth: 1, folder: true, open: true, w: "w-11" },
  { depth: 2, tone: "bg-chart-1/50", w: "w-14" },
  { depth: 1, folder: true, open: true, w: "w-16" },
  { depth: 2, tone: "bg-chart-4/60", w: "w-12" },
  { depth: 2, tone: "bg-chart-4/60", w: "w-14", active: true },
  { depth: 2, tone: "bg-chart-4/60", w: "w-16" },
  { depth: 2, tone: "bg-chart-4/60", w: "w-11" },
  { depth: 1, folder: true, w: "w-10" },
  { depth: 1, folder: true, w: "w-11" },
  { depth: 1, tone: "bg-chart-2/60", w: "w-13" },
  { depth: 1, tone: "bg-chart-4/60", w: "w-12" },
  { depth: 1, folder: true, w: "w-14" },
  { depth: 1, folder: true, w: "w-8" },
  { depth: 1, folder: true, w: "w-16" },
];

const INDENT: Record<0 | 1 | 2 | 3, string> = {
  0: "pl-0",
  1: "pl-3",
  2: "pl-6",
  3: "pl-9",
};

/** Editor tabs. The first is active. */
const TABS: readonly { tone: string; w: string }[] = [
  { tone: "bg-chart-4/60", w: "w-12" },
  { tone: "bg-chart-2/60", w: "w-11" },
  { tone: "bg-muted-foreground/50", w: "w-14" },
  { tone: "bg-chart-5/60", w: "w-10" },
];

/**
 * Syntax-coloured code. Each line is a run of tokens; the tail thins to
 * a stub and stops, which is the "got you 70% there and disappeared"
 * metaphor the previous mock carried and this one keeps.
 */
const CODE: readonly {
  indent: 0 | 1 | 2 | 3;
  tokens: { w: string; tone: string }[];
  caret?: boolean;
}[] = [
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-chart-4/60" },
      { w: "w-8", tone: "bg-muted-foreground/50" },
      { w: "w-6", tone: "bg-chart-4/60" },
      { w: "w-12", tone: "bg-chart-5/50" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-chart-4/60" },
      { w: "w-4", tone: "bg-accent" },
      { w: "w-9", tone: "bg-muted-foreground/50" },
      { w: "w-14", tone: "bg-chart-5/50" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-chart-4/60" },
      { w: "w-7", tone: "bg-muted-foreground/50" },
      { w: "w-16", tone: "bg-chart-5/50" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-chart-4/60" },
      { w: "w-12", tone: "bg-muted-foreground/50" },
      { w: "w-10", tone: "bg-chart-5/50" },
    ],
  },
  { indent: 0, tokens: [] },
  {
    indent: 0,
    tokens: [
      { w: "w-8", tone: "bg-chart-4/60" },
      { w: "w-9", tone: "bg-chart-1/40" },
      { w: "w-3", tone: "bg-accent" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-3", tone: "bg-accent" }] },
  {
    indent: 2,
    tokens: [
      { w: "w-4", tone: "bg-muted-foreground/50" },
      { w: "w-3", tone: "bg-chart-1/40" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-8", tone: "bg-muted-foreground/50" },
      { w: "w-10", tone: "bg-chart-5/50" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-6", tone: "bg-muted-foreground/50" },
      { w: "w-20", tone: "bg-chart-5/50" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-9", tone: "bg-muted-foreground/50" },
      { w: "w-16", tone: "bg-chart-5/50" },
      { w: "w-3", tone: "bg-accent" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-24", tone: "bg-muted" }] },
  { indent: 1, tokens: [{ w: "w-3", tone: "bg-accent" }] },
  {
    indent: 0,
    tokens: [
      { w: "w-6", tone: "bg-chart-4/60" },
      { w: "w-4", tone: "bg-accent" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-5", tone: "bg-muted-foreground/40" }] },
  /* Where it was abandoned: the caret, parked on an empty line. It is a
     CODE entry rather than a trailing element so the gutter and the code
     column hold the same number of items and stay aligned. */
  { indent: 1, tokens: [], caret: true },
];

function ProductCompletionVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <div className="flex h-full min-w-0">
          {/* Explorer. */}
          <div className="flex w-[36%] min-w-0 shrink-0 flex-col border-r border-border py-3">
            <ScrollReveal delay={120}>
              <span className="flex items-center justify-between px-3 pb-2.5">
                <Bar className="h-2 w-14 bg-muted-foreground/80" />
                <span className="size-2.5 rounded-sm border border-muted-foreground/40" />
              </span>
            </ScrollReveal>
            <div className="flex min-h-0 grow flex-col justify-between">
              {TREE.map((row, i) => (
                <ScrollReveal key={i} delay={170 + i * 22}>
                  <span
                    className={`flex items-center gap-1.5 py-[3px] pr-2 ${
                      row.active ? "bg-muted" : ""
                    }`}
                  >
                    <span
                      className={`flex items-center gap-1.5 ${INDENT[row.depth]} pl-2`}
                    >
                      {row.folder ? (
                        <>
                          <Caret open={row.open} />
                          <span className="size-2.5 shrink-0 rounded-sm border border-muted-foreground/50" />
                        </>
                      ) : (
                        <>
                          <span className="size-2.5 shrink-0" />
                          <span className={`size-2 shrink-0 rounded-sm ${row.tone}`} />
                        </>
                      )}
                      <Bar
                        className={`${row.w} ${
                          row.active
                            ? "bg-foreground/60"
                            : row.folder
                              ? "bg-muted-foreground/50"
                              : "bg-muted-foreground/40"
                        }`}
                      />
                    </span>
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Editor. */}
          <div className="flex min-w-0 grow flex-col">
            {/* Tab strip. The active tab carries the coral (`brand`)
                top rule. */}
            <ScrollReveal delay={260}>
              <span className="flex items-stretch border-b border-border">
                {TABS.map((tab, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-2 border-r border-border px-2.5 py-2.5 ${
                      i === 0 ? "border-t border-t-brand bg-secondary" : ""
                    }`}
                  >
                    <span className={`size-2.5 shrink-0 rounded-sm ${tab.tone}`} />
                    <Bar
                      className={`${tab.w} ${i === 0 ? "bg-muted-foreground" : "bg-muted-foreground/40"}`}
                    />
                    <TabClose />
                  </span>
                ))}
              </span>
            </ScrollReveal>

            {/* Gutter and code. */}
            <div className="flex min-h-0 grow pt-2.5">
              <span className="flex w-7 shrink-0 flex-col items-end justify-between pr-2">
                {CODE.map((_, i) => (
                  <span key={i} className="h-1.5 w-2.5 rounded-full bg-accent" />
                ))}
              </span>
              <div className="flex min-w-0 grow flex-col justify-between pr-3">
                {CODE.map((line, i) => (
                  <ScrollReveal key={i} delay={310 + i * 42}>
                    <span
                      className={`flex h-1.5 items-center gap-1.5 ${INDENT[line.indent]}`}
                    >
                      {line.tokens.map((t, j) => (
                        <span
                          key={j}
                          className={`block h-1.5 rounded-full ${t.w} ${t.tone}`}
                        />
                      ))}
                      {line.caret === true && (
                        <span className="block h-3 w-0.5 bg-brand" />
                      )}
                    </span>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
        <VisualFade />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Support — a project timeline.                               *
 * A rail, a header, tabs, a date scale and a Gantt body with task      *
 * cards, a today line and a dependency link. Replaces the framed ops   *
 * panel (owner, 2026-08-30); **this block only**.                     *
 *                                                                      *
 * It suits the §05 line better than the ops panel did: "the product is *
 * live. Now it needs to grow." A plan with work still ahead of the     *
 * today line is what a retainer looks like.                            *
 *                                                                      *
 * Frameless, like 01 and 02 — a border makes it read as a screenshot.  *
 * Rule 4.3 as everywhere: no title, no date, no name, no numeral, no   *
 * avatar photo. Coral (`brand`) appears once, on the today line and   *
 * its tick on the date scale.                                          *
 * ------------------------------------------------------------------ */

/**
 * Overlapping circles, the system's stand-in for an avatar stack
 * (avatars are `rounded-full`, #48).
 */
function AvatarStack() {
  return (
    <span className="flex shrink-0 items-center">
      {["bg-chart-4/40", "bg-chart-5/40", "bg-chart-1/30"].map((tone, i) => (
        <span
          key={i}
          className={`size-3 shrink-0 rounded-full border border-border ${tone} ${
            i > 0 ? "-ml-1" : ""
          }`}
        />
      ))}
    </span>
  );
}

/** The row-overflow affordance: three stacked marks. */
function Kebab() {
  return (
    <span className="flex shrink-0 flex-col gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-[2px] rounded-full bg-muted-foreground/50" />
      ))}
    </span>
  );
}

/**
 * A ring progress gauge, the reference's donut. With the squared rule
 * retired (#48) it is a `rounded-full` ring whose leading edges carry
 * the tint, the same device the bento's stat tile uses.
 */
function Gauge({ tone }: { tone: string }) {
  return (
    <span
      className={`size-4 shrink-0 rounded-full border-2 border-border ${tone}`}
      aria-hidden="true"
    />
  );
}

/**
 * One task bar on the timeline. The selected one takes the sub-panel
 * step (`secondary`), a lift off the `card` plane as its old fill was off
 * the old surface (#47); its brighter hairline is what sets it apart
 * from the selected row band, which shares that fill.
 */
function TaskCard({
  at,
  delay,
  gauge,
  selected = false,
}: {
  at: string;
  delay: number;
  gauge: string;
  selected?: boolean;
}) {
  return (
    <ScrollReveal delay={delay} className={`absolute ${at}`}>
      <span
        className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${
          selected
            ? "border-muted-foreground/50 bg-secondary shadow-2xl"
            : "border-border bg-card"
        }`}
      >
        <Gauge tone={gauge} />
        <span className="min-w-0 grow space-y-1.5">
          <Bar
            className={selected ? "w-full bg-muted-foreground" : "w-full bg-muted-foreground/60"}
          />
          <span className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 rounded-sm border border-accent" />
            <Bar className="w-2/3 bg-accent" />
          </span>
        </span>
        <AvatarStack />
        <Kebab />
      </span>
    </ScrollReveal>
  );
}

/** Sidebar rail items; index 1 is the open section, index 3 carries a count. */
const RAIL: readonly { w: string; active?: boolean; badge?: boolean }[] = [
  { w: "w-12" },
  { w: "w-10", active: true },
  { w: "w-11" },
  { w: "w-12", badge: true },
  { w: "w-14" },
  { w: "w-8" },
  { w: "w-9" },
];

function ProductSupportVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <div className="flex h-full min-w-0">
          {/* Rail. */}
          <div className="flex w-[22%] min-w-0 shrink-0 flex-col border-r border-border py-3">
            <ScrollReveal delay={120}>
              <span className="flex items-center gap-1.5 px-3 pb-4">
                <span className="size-3 shrink-0 rounded-sm border border-muted-foreground/50" />
                <Bar className="w-10 bg-muted-foreground/80" />
              </span>
            </ScrollReveal>
            <div className="flex min-h-0 grow flex-col justify-start gap-[7px]">
              {RAIL.map((item, i) => (
                <ScrollReveal key={i} delay={160 + i * 28}>
                  <span
                    className={`flex items-center gap-2 px-3 py-1.5 ${
                      item.active === true ? "bg-muted" : ""
                    }`}
                  >
                    <span
                      className={`size-2.5 shrink-0 rounded-sm border ${
                        item.active === true
                          ? "border-muted-foreground/80"
                          : "border-muted-foreground/40"
                      }`}
                    />
                    <Bar
                      className={`${item.w} ${
                        item.active === true ? "bg-muted-foreground" : "bg-muted-foreground/40"
                      }`}
                    />
                    {item.badge === true && (
                      <span className="ml-auto size-2.5 shrink-0 rounded-full bg-chart-1/50" />
                    )}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Main. */}
          <div className="flex min-w-0 grow flex-col">
            {/* Header: breadcrumb, title, actions. */}
            <ScrollReveal delay={200}>
              <span className="flex items-start justify-between gap-3 border-b border-border px-3 py-3">
                <span className="min-w-0 space-y-2">
                  <span className="flex items-center gap-1.5">
                    <Bar className="w-8 bg-accent" />
                    <span className="size-1 shrink-0 rotate-45 bg-accent" />
                    <Bar className="w-7 bg-accent" />
                    <span className="size-1 shrink-0 rotate-45 bg-accent" />
                    <Bar className="w-9 bg-accent" />
                  </span>
                  <Bar className="h-2.5 w-28 bg-foreground/60" />
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <Kebab />
                  <span className="size-2.5 rounded-sm border border-muted-foreground/40" />
                  <span className="relative">
                    <span className="block size-2.5 rounded-sm border border-muted-foreground/40" />
                    <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-chart-1/60" />
                  </span>
                  <AvatarStack />
                  <span className="h-4 w-8 rounded-md border border-accent" />
                </span>
              </span>
            </ScrollReveal>

            {/* Tabs. */}
            <ScrollReveal delay={250}>
              <span className="flex items-stretch gap-4 border-b border-border px-3">
                {["w-10", "w-9", "w-7", "w-12", "w-9"].map((w, i) => (
                  <span
                    key={i}
                    className={`py-2.5 ${
                      i === 0 ? "border-b border-foreground/70" : ""
                    }`}
                  >
                    <Bar
                      className={`${w} ${i === 0 ? "bg-foreground/60" : "bg-muted-foreground/40"}`}
                    />
                  </span>
                ))}
              </span>
            </ScrollReveal>

            {/* Date scale. */}
            <ScrollReveal delay={295}>
              <span className="flex items-center justify-between border-b border-border px-3 py-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <Bar
                    key={i}
                    className={`w-4 ${i === 7 ? "bg-brand/80" : "bg-accent"}`}
                  />
                ))}
              </span>
            </ScrollReveal>

            {/* Timeline body. */}
            <div className="relative min-h-0 grow">
              {/* Column rules, with the non-working columns hatched. The
                  repeating-linear-gradient hatch is the placeholder
                  tile's own device, reused rather than invented. */}
              <span className="absolute inset-0 flex">
                {Array.from({ length: 12 }, (_, i) => (
                  <span
                    key={i}
                    className={`h-full grow border-r border-border ${
                      i === 5 || i === 6 || i === 11
                        ? "bg-[repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_7px)] text-muted"
                        : ""
                    }`}
                  />
                ))}
              </span>

              {/* Today. The one coral (`brand`) element on the plane. */}
              <span className="absolute top-0 bottom-0 left-[62%] w-0.5 bg-brand" />

              {/* Dependency link: one task waiting on another. */}
              <svg
                viewBox="0 0 200 120"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <path
                  d="M150 34 C176 34 176 62 150 62 L120 62"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="text-chart-4/50"
                />
              </svg>

              {/* Phase rules. */}
              <ScrollReveal
                delay={330}
                className="absolute top-[3%] right-[4%] left-[3%]"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rotate-45 bg-chart-5/70" />
                  <Bar className="w-10 shrink-0 bg-muted-foreground/80" />
                  <span className="h-px grow bg-border" />
                </span>
              </ScrollReveal>
              <ScrollReveal
                delay={520}
                className="absolute top-[70%] right-[4%] left-[3%]"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rotate-45 bg-chart-1/60" />
                  <Bar className="w-14 shrink-0 bg-muted-foreground/80" />
                  <span className="h-px grow bg-border" />
                </span>
              </ScrollReveal>

              {/* Selected row band, behind its card. */}
              <span className="absolute top-[26%] right-0 left-0 h-[16%] bg-secondary" />

              <TaskCard
                at="top-[12%] left-[6%] w-[52%]"
                delay={370}
                gauge="border-t-chart-5/70 border-r-chart-5/70"
              />
              <TaskCard
                at="top-[28%] left-[22%] w-[54%]"
                delay={420}
                gauge="border-t-chart-4/70 border-r-chart-4/70"
                selected
              />
              <TaskCard
                at="top-[45%] left-[12%] w-[50%]"
                delay={465}
                gauge="border-t-muted-foreground/80 border-r-muted-foreground/80"
              />
              <TaskCard
                at="top-[58%] left-[34%] w-[52%]"
                delay={505}
                gauge="border-t-chart-1/60 border-r-chart-1/60"
              />
              <TaskCard
                at="top-[80%] left-[46%] w-[50%]"
                delay={560}
                gauge="border-t-chart-5/70 border-r-chart-5/70"
              />
            </div>
          </div>
        </div>
        <VisualFade />
      </div>
    </div>
  );
}

/**
 * Block -> its visual, or `null` for none. Total over `ServiceBlockId`,
 * so a new block cannot ship without a decision about its visual and
 * cannot silently inherit another's. The Internal Tool visual left with
 * its block (#53). **The four agentic examples (#57) carry none until
 * the visuals brief** (owner direction, 2026-10-15: no empty or
 * stand-in frame in production); their rows render no visual cell, and
 * `service-page.tsx` gives the visual's half to the map panel.
 */
const VISUALS: Record<ServiceBlockId, (() => React.JSX.Element) | null> = {
  "new-product": NewProductVisual,
  "product-completion": ProductCompletionVisual,
  "product-support": ProductSupportVisual,
  "email-triage": null,
  "weekly-reporting": null,
  "quoting-and-intake": null,
  "document-and-data-entry": null,
};

/** Whether a block has a visual, so its row knows to split in two. */
export function hasBlockVisual(block: ServiceBlockId): boolean {
  return VISUALS[block] !== null;
}

export function ServiceBlockVisual({ block }: { block: ServiceBlockId }) {
  const Visual = VISUALS[block];
  if (Visual === null) return null;

  return (
    /* Decorative in full: every mock is skeleton matter carrying no
       readable content, so it is removed from the accessibility tree
       rather than given labels that would read as a feature list. */
    <div aria-hidden="true">
      <Visual />
    </div>
  );
}
