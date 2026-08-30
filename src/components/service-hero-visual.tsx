import type { CSSProperties, ReactNode } from "react";
import type { ServicePageSlug } from "@/lib/types";

/**
 * The service hero's illustration — one per route, drawn on a plane
 * tilted in perspective (owner direction, 2026-08-30, against a
 * supplied reference hero).
 *
 * **Perspective is net-new vocabulary in this repo, and that is a
 * flagged judgment call.** There is no `perspective`, `rotateX`,
 * `preserve-3d`, `skew` or `matrix3d` anywhere else in `src/`; the only
 * rotation the design system has ever used is `rotate-45` on the gold
 * diamond marker. §Surfaces and §Interaction vocabulary do not cover a
 * tilted decorative plane, and the spec's instruction for an uncovered
 * case is to generalize from shipped code and flag rather than invent
 * silently. Everything *on* the plane is therefore the vocabulary that
 * already exists — squared hairline cards on solid `#0a0a0c`, skeleton
 * matter on the white alpha ladder, chrome tints from the #31 set, one
 * gold element, the same radial fade the wireframe mocks use. Only the
 * tilt itself is new. Written as arbitrary properties rather than
 * Tailwind 3D utilities, so it does not depend on a utility set the
 * repo has never compiled.
 *
 * **The tilt is layout; the entrance is motion.** A static transform has
 * nothing for `prefers-reduced-motion` to suppress, so only the entrance
 * is gated. The illustration **assembles on load** rather than arriving
 * as one block (owner direction, 2026-08-30): connectors first, then the
 * panes in flow order, each on the shared `rise-in`. **No keyframe was
 * added** — `globals.css` is untouched.
 *
 * **Two things make that work, and both are load-bearing.**
 *
 * 1. **The delay is an inline style, not an `[animation-delay:…]`
 *    class.** The class form does not work anywhere on this site:
 *    `motion-safe:animate-rise-in` compiles to the `animation`
 *    *shorthand*, which resets `animation-delay` to `0s`, and the
 *    `motion-safe:` variant sorts *after* the plain delay utility, so it
 *    always wins. Measured: every `[animation-delay:…]` element on `/`,
 *    `/pricing` and these routes computes `0s`. `ScrollReveal` is the one
 *    thing that staggers correctly, because it sets `animationDelay`
 *    inline — an inline style beats any class. Same fix here.
 * 2. **The entrance and the depth live on different elements.**
 *    `rise-in` animates `transform: translateY(16px)`, which would
 *    overwrite a pane's `translateZ` and flatten the plane for the whole
 *    700ms before snapping back. So each pane is two elements: an outer
 *    that holds its position and its `translateZ`, and an inner that
 *    holds the surface and the animation. Never merge them.
 *
 * **Rule 4.3 governs the content, as it does every mock on these
 * routes.** The reference labels each node ("Book a demo", "Send email
 * message"); inventing equivalents would assert product behaviour
 * nobody has approved, on the two pages a search visitor lands on
 * first. Owner-confirmed: skeleton bars, no readable text. Not one
 * string, numeral, metric or logo appears, and the whole visual is
 * `aria-hidden`.
 *
 * **Contained, not bled.** The reference runs its illustration off the
 * page edge. A rotated plane overflowing horizontally widens the page,
 * and the usual fix — `overflow-x-clip` on an ancestor — would sit
 * above the hero's `sticky` lockup and put the 80px wordmark handoff at
 * risk. The stage clips instead, and the radial fade dissolves the clip
 * so it reads as depth rather than a cut.
 */

/**
 * The tilt. Shared by both routes so the two heroes read as one system,
 * and scaled down rather than re-authored at narrow widths — `scale` is
 * its own property in Tailwind v4, so it composes with the centring
 * `translate` and the plane's `transform` instead of fighting them.
 */
const STAGE =
  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 " +
  "scale-[0.58] sm:scale-[0.74] lg:scale-[0.72] xl:scale-[0.88] " +
  "[perspective:1500px]";

const TILT =
  "[transform:rotateX(32deg)_rotateZ(-24deg)] [transform-style:preserve-3d]";

/**
 * The stage clips, so the fade is what keeps that from reading as a
 * cut. Literal gradient rather than a token utility, for the reason
 * `globals.css` gives for the dialog backdrop: the `color-mix()` form
 * Tailwind compiles tokens to computes correctly but does not always
 * paint. `--color-ink` is a plain hex, so referencing it is safe.
 */
function Fade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_46%,var(--color-ink)_97%)]"
    />
  );
}

/** A skeleton line. Width and tone come from the caller. */
function Bar({ className }: { className: string }) {
  return <span className={`block h-1.5 ${className}`} />;
}

/**
 * One card on the plane, as two elements.
 *
 * `at` positions the outer and `z` lifts it toward the viewer, which is
 * what separates the layers once the plane is tilted. `surface` and the
 * entrance ride the inner, so `rise-in`'s `translateY` cannot clobber
 * the outer's `translateZ` — see the doc block.
 */
function Pane({
  at,
  z = 0,
  delay,
  gold = false,
  surface = "",
  children,
}: {
  at: string;
  z?: number;
  delay: number;
  gold?: boolean;
  surface?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute ${at}`}
      style={{ transform: `translateZ(${z}px)` } as CSSProperties}
    >
      <div
        className={`border bg-[#0a0a0c] motion-safe:animate-rise-in ${
          gold
            ? "border-gold/50 shadow-[var(--shadow-modal)]"
            : "border-white/25"
        } ${surface}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Agentic Systems — a workflow graph.                                 *
 * Nodes at four depths joined by dashed connectors, one gold active   *
 * node: agents sitting inside a process the business already runs.    *
 * This is the reference's own subject.                                *
 * ------------------------------------------------------------------ */
function AgenticHeroVisual() {
  return (
    /* A wider plane than the product route's: a graph needs horizontal
       run to read as a flow rather than a pile, and the stage clips and
       fades the overhang anyway. */
    <div className="relative h-[560px] w-[880px]">
      {/* Connectors sit under the nodes on the same plane, and land
          first — the wiring appears, then the work arrives on it.
          Dashed hairlines on the white alpha ladder; the one gold path
          is the route through the active node. */}
      <div
        className="absolute inset-0 motion-safe:animate-rise-in"
        style={{ animationDelay: "300ms" }}
      >
        <svg viewBox="0 0 880 560" className="h-full w-full" fill="none">
          <g stroke="currentColor" strokeWidth="2" strokeDasharray="7 8">
            <path d="M175 255 H205 V130 H235" className="text-white/30" />
            <path d="M175 255 H205 V455 H235" className="text-white/30" />
            <path d="M430 455 H455 V295 H480" className="text-white/30" />
            <path d="M430 130 H455 V295 H480" className="text-gold/60" />
            <path d="M680 295 H700 V145 H725" className="text-white/30" />
            <path d="M680 295 H700 V450 H725" className="text-white/30" />
          </g>
        </svg>
      </div>

      {/* Trigger. */}
      <Pane
        at="top-[215px] left-[0px] w-[175px]"
        z={0}
        delay={360}
        surface="p-5"
      >
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rotate-45 bg-sage/80"
          />
          <Bar className="w-20 bg-white/30" />
        </span>
        <Bar className="mt-3.5 w-28 bg-white/12" />
      </Pane>

      {/* Two parallel branches. */}
      <Pane
        at="top-[70px] left-[235px] w-[195px]"
        z={30}
        delay={430}
        surface="p-5"
      >
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rotate-45 bg-lavender/80"
          />
          <Bar className="w-16 bg-white/30" />
        </span>
        <Bar className="mt-3.5 w-full bg-white/12" />
        <Bar className="mt-2.5 w-24 bg-white/12" />
      </Pane>

      <Pane
        at="top-[400px] left-[235px] w-[195px]"
        z={20}
        delay={480}
        surface="p-5"
      >
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rotate-45 bg-rose/80"
          />
          <Bar className="w-14 bg-white/30" />
        </span>
        <Bar className="mt-3.5 w-28 bg-white/12" />
      </Pane>

      {/* The agent. The one gold element on the plane, lifted furthest
          toward the viewer and landing after the branches feed it — the
          payoff beat of the sequence. */}
      <Pane
        at="top-[240px] left-[480px] w-[200px]"
        z={110}
        delay={560}
        gold
        surface="p-5"
      >
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rotate-45 bg-gold"
          />
          <Bar className="w-20 bg-gold/70" />
        </span>
        <Bar className="mt-3.5 w-full bg-white/25" />
        <Bar className="mt-2.5 w-20 bg-white/15" />
      </Pane>

      {/* Downstream. */}
      <Pane
        at="top-[95px] left-[725px] w-[165px]"
        z={60}
        delay={640}
        surface="p-5"
      >
        <Bar className="w-16 bg-white/30" />
        <Bar className="mt-3.5 w-24 bg-white/12" />
      </Pane>

      <Pane
        at="top-[400px] left-[725px] w-[165px]"
        z={50}
        delay={690}
        surface="p-5"
      >
        <Bar className="w-20 bg-white/30" />
        <Bar className="mt-3.5 w-20 bg-white/12" />
      </Pane>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Products — two overlapping product surfaces.                        *
 * A chart card behind, a task list in front of it: the shape of a     *
 * product someone actually uses, not a diagram of one. Structure is   *
 * adapted from an owner-supplied card reference (2026-08-30); the     *
 * tilt, the surfaces and the Rule 4.3 posture are this system's.      *
 * ------------------------------------------------------------------ */

/**
 * Column fill heights, as a percentage of the track. The peak is the
 * one gold element on this plane; everything else rides the white alpha
 * ladder. Heights only — **no axis, no scale, no numerals, no day
 * labels.** The reference labels every column and prints a figure on
 * every row; reproducing that would put invented metrics on the page a
 * search visitor lands on first, which is what Rule 4.3 and decision #5
 * (the retired stat strip) exist to stop. Varying bars with nothing
 * written on them assert nothing — the same posture the ops panel's
 * uptime strip already ships.
 */
const COLUMNS: readonly number[] = [52, 68, 92, 86, 72, 33, 25];
const PEAK = 2;

/** Chrome tints for the task rows' status dots (#31). */
const TASK_ROWS: readonly string[] = [
  "bg-rose/80",
  "bg-lavender/80",
  "bg-sage/80",
];

function ProductHeroVisual() {
  return (
    <div className="relative h-[560px] w-[720px]">
      {/* The chart card, behind. */}
      <Pane
        at="top-[55px] left-[215px] w-[415px]"
        z={0}
        delay={300}
        surface="p-6"
      >
        <div className="flex items-center justify-between">
          <Bar className="h-2 w-32 bg-white/30" />
          {/* The reference's "This Week" control, squared — rounded is
              not in this system's vocabulary. */}
          <span className="flex items-center gap-2.5 border border-white/20 px-3 py-2">
            <Bar className="w-12 bg-white/25" />
            <span
              aria-hidden="true"
              className="size-1.5 rotate-45 bg-white/30"
            />
          </span>
        </div>
        <div className="mt-8 flex items-end justify-between gap-2.5">
          {COLUMNS.map((fill, i) => (
            <span key={i} className="flex flex-col items-center gap-3.5">
              {/* Track, then the fill rising from the bottom of it. */}
              <span className="relative flex h-[112px] w-3.5 items-end bg-white/[0.06]">
                <span
                  className={`w-full ${i === PEAK ? "bg-gold" : "bg-white/25"}`}
                  style={{ height: `${fill}%` } as CSSProperties}
                />
              </span>
              <Bar className="w-6 bg-white/12" />
            </span>
          ))}
        </div>
      </Pane>

      {/* The task list, lifted in front and overlapping it. */}
      <Pane
        at="top-[295px] left-[70px] w-[375px]"
        z={110}
        delay={440}
        surface="p-6"
      >
        <Bar className="h-2 w-28 bg-white/30" />
        <div className="mt-5 space-y-2.5">
          {TASK_ROWS.map((tone) => (
            /* §Surfaces' sub-panel recipe for a data row, verbatim. */
            <span
              key={tone}
              className="flex items-center gap-3.5 border border-white/12 bg-white/[0.02] p-3.5"
            >
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 rotate-45 ${tone}`}
              />
              <Bar className="w-24 bg-white/25" />
              <span className="grow" />
              <Bar className="w-14 bg-white/15" />
              {/* The reference's photo avatar, as this system's profile
                  chip — a portrait would be an invented person. */}
              <span className="size-6 shrink-0 border border-white/20 bg-lavender/45" />
            </span>
          ))}
        </div>
      </Pane>
    </div>
  );
}

/**
 * Route -> its hero illustration. Total over `ServicePageSlug`, so a
 * third route cannot ship without one and cannot silently inherit
 * another's.
 */
const VISUALS: Record<ServicePageSlug, () => React.JSX.Element> = {
  product: ProductHeroVisual,
  "agentic-system": AgenticHeroVisual,
};

export function ServiceHeroVisual({ page }: { page: ServicePageSlug }) {
  const Visual = VISUALS[page];

  return (
    /* Decorative in full: skeleton matter carrying no readable content,
       so it is removed from the accessibility tree rather than given
       labels that would read as a feature list. */
    <div
      aria-hidden="true"
      className="relative aspect-[4/3] w-full overflow-hidden"
    >
      <div className={STAGE}>
        <div className={TILT}>
          <Visual />
        </div>
      </div>
      <Fade />
    </div>
  );
}
