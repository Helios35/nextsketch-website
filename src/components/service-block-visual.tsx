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

/** A skeleton line. Width and tone come from the caller. */
function Bar({ className }: { className: string }) {
  return <span className={`block h-1.5 ${className}`} />;
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
 * strip over. Chrome tints are the #31 set; `gold` appears once, on     *
 * the area chart, and nowhere else.                                    *
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
        className={`flex h-full min-w-0 flex-col overflow-hidden border border-white/15 bg-surface ${className}`}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}

/** Ranked rows: a filled bar of decreasing width beside a value bar. */
const RANKED: readonly { w: string; tone: string }[] = [
  { w: "w-full", tone: "bg-lavender/70" },
  { w: "w-4/5", tone: "bg-sage/70" },
  { w: "w-3/5", tone: "bg-rose/70" },
  { w: "w-2/5", tone: "bg-white/25" },
];

/** List rows: a tinted mark beside a label. */
const LIST_ROWS: readonly string[] = [
  "bg-rose/70",
  "bg-sage/70",
  "bg-lavender/70",
  "bg-white/25",
];

function NewProductVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="grid h-full grid-cols-[1.15fr_1.2fr_0.8fr] gap-2.5">
          {/* Left column. */}
          <div className="grid min-h-0 min-w-0 grid-rows-[1.05fr_1fr] gap-2.5">
            {/* Headline figure over an area chart. The chart is the one
                gold element in the whole mosaic; everything else is
                chrome or the white alpha ladder. */}
            <MosaicTile delay={120} className="p-3.5">
              <Bar className="w-16 bg-white/35" />
              <span className="mt-3 block h-4 w-3/4 bg-white/85" />
              <span className="mt-2.5 flex items-center gap-2">
                <Dot tone="bg-sage/80" />
                <Bar className="w-20 bg-white/20" />
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
                        stopColor="var(--color-gold)"
                        stopOpacity="0.32"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-gold)"
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
                    stroke="var(--color-gold)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </MosaicTile>

            {/* Two-series line chart over a gridded plot. */}
            <MosaicTile delay={190} className="p-3.5">
              <Bar className="w-20 bg-white/35" />
              <span className="mt-2.5 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-4 bg-rose/80" />
                  <Bar className="w-8 bg-white/20" />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-4 bg-white/45" />
                  <Bar className="w-8 bg-white/20" />
                </span>
              </span>
              <div className="mt-auto flex grow items-stretch gap-2 pt-3">
                <span className="flex w-4 shrink-0 flex-col justify-between py-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="h-1 w-3 bg-white/15" />
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
                        className="text-white/10"
                      />
                    ))}
                    <path
                      d="M0 76 L30 70 L60 52 L90 40 L120 26 L150 18 L200 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/45"
                    />
                    <path
                      d="M0 78 L30 76 L60 72 L90 66 L120 62 L150 58 L200 54 L200 80 L0 80 Z"
                      fill="currentColor"
                      className="text-rose/25"
                    />
                    <path
                      d="M0 78 L30 76 L60 72 L90 66 L120 62 L150 58 L200 54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-rose/80"
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
                <span className="size-7 shrink-0 border border-white/20 bg-white/5" />
                <span className="space-y-1.5">
                  <Bar className="w-24 bg-white/35" />
                  <Bar className="w-14 bg-white/20" />
                </span>
              </span>
              <span className="mt-auto block h-2 w-full bg-white/[0.07]">
                <span className="block h-full w-[62%] bg-sage/75" />
              </span>
              <span className="mt-2.5 flex items-center gap-2">
                <Dot tone="bg-sage/80" />
                <Bar className="w-16 bg-white/20" />
              </span>
            </MosaicTile>

            {/* Ranked category bars. */}
            <MosaicTile delay={310} className="p-3.5">
              <Bar className="w-28 bg-white/35" />
              <div className="mt-auto space-y-2.5">
                {RANKED.map((row, i) => (
                  <span key={i} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 items-center gap-2 px-2 ${row.w} ${row.tone}`}
                    >
                      <span className="size-1.5 shrink-0 rotate-45 bg-ink/40" />
                      <span className="h-1.5 w-8 bg-ink/30" />
                    </span>
                    <Bar className="w-10 shrink-0 bg-white/25" />
                  </span>
                ))}
              </div>
            </MosaicTile>

            {/* Three-figure stat row beside a squared gauge. */}
            <MosaicTile delay={370} className="p-3.5">
              <span className="flex items-start justify-between">
                <Bar className="h-2.5 w-20 bg-white/45" />
                <span className="flex size-9 shrink-0 items-center justify-center border-2 border-white/12 border-t-sage/80 border-r-sage/80">
                  <span className="size-3 bg-white/15" />
                </span>
              </span>
              <div className="mt-auto grid grid-cols-3 gap-2">
                {["bg-white/70", "bg-white/70", "bg-sage/80"].map((tone, i) => (
                  <span key={i} className="space-y-2">
                    <Bar className="w-10 bg-white/20" />
                    <span className={`block h-2.5 w-12 ${tone}`} />
                  </span>
                ))}
              </div>
            </MosaicTile>
          </div>

          {/* Right column. */}
          <div className="grid min-h-0 min-w-0 grid-rows-[1.1fr_1fr] gap-2.5">
            {/* Scheduled list: a mark and a two-line row, hairline divided. */}
            <MosaicTile delay={430}>
              <span className="border-b border-white/10 px-3.5 py-3">
                <Bar className="w-20 bg-white/40" />
              </span>
              <div className="flex grow flex-col justify-around">
                {LIST_ROWS.map((tone, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2.5 border-b border-white/[0.07] px-3.5 py-2.5 last:border-b-0"
                  >
                    <span
                      className={`size-5 shrink-0 border border-white/15 ${tone}`}
                    />
                    <span className="space-y-1.5">
                      <Bar className="w-12 bg-white/30" />
                      <Bar className="w-8 bg-white/15" />
                    </span>
                  </span>
                ))}
              </div>
            </MosaicTile>

            {/* Activity list: a mark and a single line. */}
            <MosaicTile delay={490}>
              <span className="border-b border-white/10 px-3.5 py-3">
                <Bar className="w-16 bg-white/40" />
              </span>
              <div className="flex grow flex-col justify-around px-3.5">
                {LIST_ROWS.map((tone, i) => (
                  <span key={i} className="flex items-center gap-2.5">
                    <span className={`size-1.5 shrink-0 rotate-45 ${tone}`} />
                    <Bar className="w-16 bg-white/30" />
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
 * logo. The reference's syntax colours map onto the #31 chrome set —   *
 * `lavender` for keywords and component files, `sage` for strings,     *
 * `rose` for values and stylesheets, the white alpha ladder for        *
 * identifiers and punctuation, `white/12` for comments. `gold` appears *
 * once, on the active tab, and nowhere else.                           *
 * ------------------------------------------------------------------ */

/** Disclosure caret for a tree row. Inline SVG, per §Interaction vocabulary. */
function Caret({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`size-2.5 shrink-0 text-white/35 ${open ? "rotate-90" : ""}`}
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
      className="size-2.5 shrink-0 text-white/25"
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
  { depth: 2, tone: "bg-rose/70", w: "w-14" },
  { depth: 1, folder: true, open: true, w: "w-16" },
  { depth: 2, tone: "bg-lavender/70", w: "w-12" },
  { depth: 2, tone: "bg-lavender/70", w: "w-14", active: true },
  { depth: 2, tone: "bg-lavender/70", w: "w-16" },
  { depth: 2, tone: "bg-lavender/70", w: "w-11" },
  { depth: 1, folder: true, w: "w-10" },
  { depth: 1, folder: true, w: "w-11" },
  { depth: 1, tone: "bg-gold/70", w: "w-13" },
  { depth: 1, tone: "bg-lavender/70", w: "w-12" },
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
  { tone: "bg-lavender/70", w: "w-12" },
  { tone: "bg-gold/70", w: "w-11" },
  { tone: "bg-white/30", w: "w-14" },
  { tone: "bg-sage/70", w: "w-10" },
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
      { w: "w-10", tone: "bg-lavender/70" },
      { w: "w-8", tone: "bg-white/30" },
      { w: "w-6", tone: "bg-lavender/70" },
      { w: "w-12", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-lavender/70" },
      { w: "w-4", tone: "bg-white/20" },
      { w: "w-9", tone: "bg-white/30" },
      { w: "w-14", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-lavender/70" },
      { w: "w-7", tone: "bg-white/30" },
      { w: "w-16", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-lavender/70" },
      { w: "w-12", tone: "bg-white/30" },
      { w: "w-10", tone: "bg-sage/60" },
    ],
  },
  { indent: 0, tokens: [] },
  {
    indent: 0,
    tokens: [
      { w: "w-8", tone: "bg-lavender/70" },
      { w: "w-9", tone: "bg-rose/60" },
      { w: "w-3", tone: "bg-white/20" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-3", tone: "bg-white/20" }] },
  {
    indent: 2,
    tokens: [
      { w: "w-4", tone: "bg-white/30" },
      { w: "w-3", tone: "bg-rose/60" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-8", tone: "bg-white/30" },
      { w: "w-10", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-6", tone: "bg-white/30" },
      { w: "w-20", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-9", tone: "bg-white/30" },
      { w: "w-16", tone: "bg-sage/60" },
      { w: "w-3", tone: "bg-white/20" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-24", tone: "bg-white/12" }] },
  { indent: 1, tokens: [{ w: "w-3", tone: "bg-white/20" }] },
  {
    indent: 0,
    tokens: [
      { w: "w-6", tone: "bg-lavender/70" },
      { w: "w-4", tone: "bg-white/20" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-5", tone: "bg-white/25" }] },
  /* Where it was abandoned: the caret, parked on an empty line. It is a
     CODE entry rather than a trailing element so the gutter and the code
     column hold the same number of items and stay aligned. */
  { indent: 1, tokens: [], caret: true },
];

function ProductCompletionVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="flex h-full min-w-0">
          {/* Explorer. */}
          <div className="flex w-[36%] min-w-0 shrink-0 flex-col border-r border-white/10 py-3">
            <ScrollReveal delay={120}>
              <span className="flex items-center justify-between px-3 pb-2.5">
                <Bar className="h-2 w-14 bg-white/45" />
                <span className="size-2.5 rounded-none border border-white/25" />
              </span>
            </ScrollReveal>
            <div className="flex min-h-0 grow flex-col justify-between">
              {TREE.map((row, i) => (
                <ScrollReveal key={i} delay={170 + i * 22}>
                  <span
                    className={`flex items-center gap-1.5 py-[3px] pr-2 ${
                      row.active ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span
                      className={`flex items-center gap-1.5 ${INDENT[row.depth]} pl-2`}
                    >
                      {row.folder ? (
                        <>
                          <Caret open={row.open} />
                          <span className="size-2.5 shrink-0 border border-white/30" />
                        </>
                      ) : (
                        <>
                          <span className="size-2.5 shrink-0" />
                          <span className={`size-2 shrink-0 ${row.tone}`} />
                        </>
                      )}
                      <Bar
                        className={`${row.w} ${
                          row.active
                            ? "bg-white/60"
                            : row.folder
                              ? "bg-white/30"
                              : "bg-white/25"
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
            {/* Tab strip. The active tab is the one gold element. */}
            <ScrollReveal delay={260}>
              <span className="flex items-stretch border-b border-white/10">
                {TABS.map((tab, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-2 border-r border-white/[0.07] px-2.5 py-2.5 ${
                      i === 0 ? "border-t border-t-gold bg-white/[0.04]" : ""
                    }`}
                  >
                    <span className={`size-2.5 shrink-0 ${tab.tone}`} />
                    <Bar
                      className={`${tab.w} ${i === 0 ? "bg-white/55" : "bg-white/25"}`}
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
                  <span key={i} className="h-1.5 w-2.5 bg-white/15" />
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
                          className={`block h-1.5 ${t.w} ${t.tone}`}
                        />
                      ))}
                      {line.caret === true && (
                        <span className="block h-3 w-0.5 bg-gold" />
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
 * avatar photo. `gold` appears once, on the today line.                *
 * ------------------------------------------------------------------ */

/** Overlapping squares, the system's stand-in for an avatar stack. */
function AvatarStack() {
  return (
    <span className="flex shrink-0 items-center">
      {["bg-lavender/45", "bg-sage/45", "bg-rose/45"].map((tone, i) => (
        <span
          key={i}
          className={`size-3 shrink-0 border border-white/20 ${tone} ${
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
        <span key={i} className="size-[2px] bg-white/30" />
      ))}
    </span>
  );
}

/**
 * A squared progress gauge. The reference uses a donut; round is not in
 * this system's vocabulary, so it is a square whose leading edges carry
 * the tint — the same device the bento's stat tile uses.
 */
function Gauge({ tone }: { tone: string }) {
  return (
    <span
      className={`size-4 shrink-0 border-2 border-white/12 ${tone}`}
      aria-hidden="true"
    />
  );
}

/** One task bar on the timeline. */
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
        className={`flex items-center gap-2 border px-2 py-2 ${
          selected
            ? "border-white/45 bg-[#101013] shadow-[var(--shadow-modal)]"
            : "border-white/15 bg-surface"
        }`}
      >
        <Gauge tone={gauge} />
        <span className="min-w-0 grow space-y-1.5">
          <Bar
            className={selected ? "w-full bg-white/55" : "w-full bg-white/35"}
          />
          <span className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 border border-white/20" />
            <Bar className="w-2/3 bg-white/15" />
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
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="flex h-full min-w-0">
          {/* Rail. */}
          <div className="flex w-[22%] min-w-0 shrink-0 flex-col border-r border-white/10 py-3">
            <ScrollReveal delay={120}>
              <span className="flex items-center gap-1.5 px-3 pb-4">
                <span className="size-3 shrink-0 border border-white/30" />
                <Bar className="w-10 bg-white/45" />
              </span>
            </ScrollReveal>
            <div className="flex min-h-0 grow flex-col justify-start gap-[7px]">
              {RAIL.map((item, i) => (
                <ScrollReveal key={i} delay={160 + i * 28}>
                  <span
                    className={`flex items-center gap-2 px-3 py-1.5 ${
                      item.active === true ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span
                      className={`size-2.5 shrink-0 border ${
                        item.active === true
                          ? "border-white/45"
                          : "border-white/25"
                      }`}
                    />
                    <Bar
                      className={`${item.w} ${
                        item.active === true ? "bg-white/55" : "bg-white/25"
                      }`}
                    />
                    {item.badge === true && (
                      <span className="ml-auto size-2.5 shrink-0 bg-rose/70" />
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
              <span className="flex items-start justify-between gap-3 border-b border-white/10 px-3 py-3">
                <span className="min-w-0 space-y-2">
                  <span className="flex items-center gap-1.5">
                    <Bar className="w-8 bg-white/20" />
                    <span className="size-1 shrink-0 rotate-45 bg-white/20" />
                    <Bar className="w-7 bg-white/20" />
                    <span className="size-1 shrink-0 rotate-45 bg-white/20" />
                    <Bar className="w-9 bg-white/20" />
                  </span>
                  <Bar className="h-2.5 w-28 bg-white/60" />
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <Kebab />
                  <span className="size-2.5 border border-white/25" />
                  <span className="relative">
                    <span className="block size-2.5 border border-white/25" />
                    <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-rose/80" />
                  </span>
                  <AvatarStack />
                  <span className="h-4 w-8 border border-white/20" />
                </span>
              </span>
            </ScrollReveal>

            {/* Tabs. */}
            <ScrollReveal delay={250}>
              <span className="flex items-stretch gap-4 border-b border-white/10 px-3">
                {["w-10", "w-9", "w-7", "w-12", "w-9"].map((w, i) => (
                  <span
                    key={i}
                    className={`py-2.5 ${
                      i === 0 ? "border-b border-white/70" : ""
                    }`}
                  >
                    <Bar
                      className={`${w} ${i === 0 ? "bg-white/60" : "bg-white/22"}`}
                    />
                  </span>
                ))}
              </span>
            </ScrollReveal>

            {/* Date scale. */}
            <ScrollReveal delay={295}>
              <span className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <Bar
                    key={i}
                    className={`w-4 ${i === 7 ? "bg-gold/80" : "bg-white/20"}`}
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
                    className={`h-full grow border-r border-white/[0.06] ${
                      i === 5 || i === 6 || i === 11
                        ? "bg-[repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_7px)] text-white/[0.05]"
                        : ""
                    }`}
                  />
                ))}
              </span>

              {/* Today. The one gold element on the plane. */}
              <span className="absolute top-0 bottom-0 left-[62%] w-0.5 bg-gold" />

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
                  className="text-lavender/60"
                />
              </svg>

              {/* Phase rules. */}
              <ScrollReveal
                delay={330}
                className="absolute top-[3%] right-[4%] left-[3%]"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rotate-45 bg-sage/80" />
                  <Bar className="w-10 shrink-0 bg-white/40" />
                  <span className="h-px grow bg-white/20" />
                </span>
              </ScrollReveal>
              <ScrollReveal
                delay={520}
                className="absolute top-[70%] right-[4%] left-[3%]"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rotate-45 bg-rose/80" />
                  <Bar className="w-14 shrink-0 bg-white/40" />
                  <span className="h-px grow bg-white/20" />
                </span>
              </ScrollReveal>

              {/* Selected row band, behind its card. */}
              <span className="absolute top-[26%] right-0 left-0 h-[16%] bg-white/[0.04]" />

              <TaskCard
                at="top-[12%] left-[6%] w-[52%]"
                delay={370}
                gauge="border-t-sage/80 border-r-sage/80"
              />
              <TaskCard
                at="top-[28%] left-[22%] w-[54%]"
                delay={420}
                gauge="border-t-lavender/80 border-r-lavender/80"
                selected
              />
              <TaskCard
                at="top-[45%] left-[12%] w-[50%]"
                delay={465}
                gauge="border-t-white/45 border-r-white/45"
              />
              <TaskCard
                at="top-[58%] left-[34%] w-[52%]"
                delay={505}
                gauge="border-t-rose/80 border-r-rose/80"
              />
              <TaskCard
                at="top-[80%] left-[46%] w-[50%]"
                delay={560}
                gauge="border-t-sage/80 border-r-sage/80"
              />
            </div>
          </div>
        </div>
        <VisualFade />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Internal Tool — an analytics panel.                                 *
 * A status summary beside a trend chart with a read-out on one point.  *
 * Replaces the framed dashboard mock (owner, 2026-08-30); **this block *
 * only** — nothing else on either route changes.                      *
 *                                                                      *
 * It is the right subject for the tier: "a real tool that you own",    *
 * something a team logs into to see what their agents did.            *
 *                                                                      *
 * Frameless like 01, 02 and 03. Rule 4.3 as everywhere: no label, no   *
 * count, no date, no axis value. The reference's two series map onto   *
 * `lavender` and `rose`, its status marks onto the #31 chrome set, and *
 * `gold` appears once — on the read-out point, which is the one thing  *
 * the whole composition points at.                                     *
 * ------------------------------------------------------------------ */

/** Status rows in the summary panel. */
const STATUS: readonly { tone: string; w: string; pill: string }[] = [
  { tone: "bg-lavender/80", w: "w-12", pill: "w-6" },
  { tone: "bg-sage/80", w: "w-10", pill: "w-2" },
  { tone: "bg-rose/80", w: "w-16", pill: "w-4" },
];

function InternalToolVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="flex h-full min-w-0 gap-3 p-3">
          {/* Summary. A bordered sub-panel is chrome, not the outer box
              the owner asked to lose — the composition itself has no
              frame. */}
          <div className="flex w-[34%] min-w-0 shrink-0 flex-col border border-white/15 p-3">
            <ScrollReveal delay={120}>
              <Bar className="h-2 w-16 bg-white/50" />
            </ScrollReveal>
            <div className="mt-4 space-y-2">
              {STATUS.map((row, i) => (
                <ScrollReveal key={i} delay={170 + i * 55}>
                  {/* §Surfaces' sub-panel recipe for a data row. */}
                  <span className="flex items-center gap-2.5 border border-white/12 bg-white/[0.02] px-2.5 py-2">
                    <span className={`size-2 shrink-0 rotate-45 ${row.tone}`} />
                    <Bar className={`${row.w} bg-white/35`} />
                    <span className="ml-auto flex h-4 shrink-0 items-center border border-white/15 px-1.5">
                      <span className={`block h-1.5 ${row.pill} bg-white/30`} />
                    </span>
                  </span>
                </ScrollReveal>
              ))}
            </div>
            {/* The read-out note, with its own mark. */}
            <ScrollReveal delay={345} className="mt-auto">
              <span className="flex gap-2 pt-3">
                <span className="mt-0.5 size-3 shrink-0 rotate-45 border border-white/25" />
                <span className="min-w-0 grow space-y-1.5">
                  <Bar className="w-full bg-white/20" />
                  <Bar className="w-4/5 bg-white/20" />
                  <Bar className="w-3/5 bg-white/12" />
                </span>
              </span>
            </ScrollReveal>
          </div>

          {/* Trend. */}
          <div className="flex min-w-0 grow flex-col">
            <ScrollReveal delay={200}>
              <span className="flex items-center justify-between gap-3">
                <Bar className="h-2 w-24 bg-white/50" />
                {/* Range selector. Squared, not the reference's pill. */}
                <span className="flex shrink-0 items-stretch border border-white/15">
                  {["w-10", "w-8", "w-7"].map((w, i) => (
                    <span
                      key={i}
                      className={`flex items-center px-2 py-1.5 ${
                        i === 1 ? "bg-white/[0.08]" : ""
                      }`}
                    >
                      <span
                        className={`block h-1.5 ${w} ${
                          i === 1 ? "bg-white/55" : "bg-white/25"
                        }`}
                      />
                    </span>
                  ))}
                </span>
              </span>
            </ScrollReveal>

            {/* Plot. */}
            <ScrollReveal delay={260} className="mt-4 flex min-h-0 grow">
              <span className="flex w-5 shrink-0 flex-col justify-between py-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-1.5 w-4 bg-white/20" />
                ))}
              </span>
              <span className="relative min-w-0 grow">
                <svg
                  viewBox="0 0 200 100"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                  fill="none"
                >
                  {[40, 80, 120, 160].map((x) => (
                    <line
                      key={x}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="100"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-white/[0.08]"
                    />
                  ))}
                  <path
                    d="M0 28 C14 60 26 78 40 72 C54 66 58 34 72 32 C86 30 92 18 104 22 C116 26 122 58 136 60 C150 62 156 44 170 42 C184 40 192 28 200 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-lavender/75"
                  />
                  <path
                    d="M0 78 C12 70 20 52 32 48 C44 44 48 22 60 20 C72 18 78 46 90 52 C102 58 108 44 120 40 C132 36 138 72 150 76 C162 80 168 40 180 36 C192 32 196 58 200 62"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-rose/75"
                  />
                </svg>

                {/* The read-out point. Gold, and the only gold here. The
                    reference glows; §Surfaces bans that, so presence
                    comes from a hairline halo instead. */}
                <span className="absolute top-[18%] left-[52%] flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/30">
                  <span className="size-2 rotate-45 bg-gold" />
                </span>

                {/* Its read-out card. */}
                <span className="absolute top-[2%] left-[56%] space-y-1.5 border border-white/20 bg-[#101013] px-2.5 py-2">
                  <Bar className="w-14 bg-white/45" />
                  <Bar className="w-12 bg-white/25" />
                </span>
              </span>
            </ScrollReveal>

            {/* Scale. */}
            <ScrollReveal delay={330}>
              <span className="mt-2.5 flex items-center justify-between pl-5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Bar key={i} className="w-6 bg-white/20" />
                ))}
              </span>
            </ScrollReveal>
          </div>
        </div>
        <VisualFade />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * AI Workflow Integration — the tile cluster. KEPT (owner direction). *
 * The reference's own shape, and the one block it actually suits:     *
 * agents dropped into the processes a business already runs.          *
 * ------------------------------------------------------------------ */

/**
 * Real product marks (owner direction, 2026-08-31 — decision-log #34,
 * a narrow supersession of #30's logo refusal for this one visual):
 * the tiles carry actual app icons, "like the behance and linkedin
 * icons in the footer". Satellites are **Bootstrap Icons** (MIT) — the
 * footer's own set (`social-icon.tsx` precedent: one matched 16-unit
 * grid beats mixed sources) — including the LinkedIn mark the footer
 * already ships. The centre is the **Anthropic logomark** (Simple
 * Icons, 24-unit grid), the one mark Bootstrap does not carry; swap
 * its path for OpenAI's if the owner prefers ChatGPT at the hub.
 * `fill="currentColor"` keeps the #31 chrome tints working unchanged.
 */
const APP_ICONS = {
  anthropic: {
    viewBox: "0 0 24 24",
    d: "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z",
  },
  envelope: {
    viewBox: "0 0 16 16",
    d: "M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z",
  },
  linkedin: {
    viewBox: "0 0 16 16",
    d: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z",
  },
  slack: {
    viewBox: "0 0 16 16",
    d: "M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111.756 8.43 1.68 8.43h1.682zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682zm6.749 1.682c0-.926.755-1.682 1.68-1.682S16 4.964 16 5.889s-.756 1.681-1.68 1.681h-1.681zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68s.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681z",
  },
  github: {
    viewBox: "0 0 16 16",
    d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8",
  },
  calendar: {
    viewBox: "0 0 16 16",
    d: "M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
  },
  google: {
    viewBox: "0 0 16 16",
    d: "M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z",
  },
} as const;

type AppKey = keyof typeof APP_ICONS;

/**
 * The satellites, spread around the centre hub (owner: "spread them
 * out a bit"). Positions are percentages of the 4/3 stage, tile
 * centres; the connector SVG derives its line ends from the same
 * numbers so the two cannot drift. Tones are the #31 chrome set the
 * old cluster carried, reassigned — `gold` still appears once, on the
 * centre. Kept inside roughly 70% of the fade's radius so the veil
 * dims the edge tiles into the card without erasing the marks.
 */
const HUB = { x: 50, y: 50 };
const SATELLITES: readonly {
  icon: AppKey;
  tone: string;
  x: number;
  y: number;
}[] = [
  { icon: "envelope", tone: "text-sage/85", x: 29, y: 24 },
  { icon: "linkedin", tone: "text-lavender/85", x: 71, y: 24 },
  { icon: "slack", tone: "text-rose/85", x: 15, y: 55 },
  { icon: "github", tone: "text-white/45", x: 85, y: 55 },
  { icon: "calendar", tone: "text-white/45", x: 33, y: 81 },
  { icon: "google", tone: "text-sage/70", x: 67, y: 81 },
];

function Tile({
  icon,
  tone,
  emphasis,
  delay,
}: {
  icon: AppKey;
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

  /* The satellites' 16-grid glyphs fill their viewBox edge to edge
     where the old 24-grid marks sat inside a 3.5px margin, so they
     step down one size to hold the same optical weight; the centre
     keeps the larger cut — the focus stays on the hub. */
  const { viewBox, d } = APP_ICONS[icon];

  return (
    <ScrollReveal delay={delay}>
      <div
        className={`flex size-16 items-center justify-center border bg-surface transition-colors duration-150 md:size-[74px] ${surface} ${tone}`}
      >
        <svg
          viewBox={viewBox}
          fill="currentColor"
          className={emphasis ? "size-7 md:size-8" : "size-6 md:size-7"}
        >
          <path d={d} />
        </svg>
      </div>
    </ScrollReveal>
  );
}

function WorkflowVisual() {
  return (
    <div className={SHELL}>
      {/* Same 4/3 box as the framed mocks, so all five rows line up.
          Frameless on purpose: this one is a cluster, not a screen.

          **The fade rides the stage now, and that is correct.** The
          compact 2-3-2 cluster needed the fade on its own ~240px box —
          `inset-0` on the frame put every tile inside the clear zone
          and the dissolve vanished (see the git history of this file).
          The spread hub-and-spoke layout fills the 4/3 stage the way
          the framed mocks fill theirs, so the fade sits on the stage
          for the same reason theirs can. Values unchanged. */}
      <div className="relative aspect-[4/3] w-full">
        <VisualFade />
        {/* The wiring lands first, then the hub, then the apps — the
            workflow graph's documented assembly order. Dotted, square
            caps (the system has no round joins), on the white ladder.
            The SVG shares the satellites' percent coordinates (times
            4.48 / 3.36 for the 448x336 viewBox, the stage's own 4/3),
            and the tiles' opaque `surface` fill masks the line ends,
            so each spoke visually stops at a tile edge. */}
        <ScrollReveal delay={120} className="absolute inset-0">
          <svg viewBox="0 0 448 336" className="h-full w-full text-white/25">
            {SATELLITES.map(({ icon, x, y }) => (
              <path
                key={icon}
                d={`M${HUB.x * 4.48} ${HUB.y * 3.36}L${x * 4.48} ${y * 3.36}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="1.5 5.5"
                strokeLinecap="square"
              />
            ))}
          </svg>
        </ScrollReveal>
        {SATELLITES.map(({ icon, tone, x, y }, i) => (
          <div
            key={icon}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <Tile icon={icon} tone={tone} emphasis={false} delay={260 + i * 55} />
          </div>
        ))}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
        >
          <Tile icon="anthropic" tone="text-gold" emphasis delay={200} />
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
