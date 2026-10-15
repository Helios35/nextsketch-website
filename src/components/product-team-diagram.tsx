"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  D_FIGURE,
  D_LABEL,
  DiagramSvg,
  ON_CANVAS,
  Place,
  ROW_GRID,
  RowDiagram,
  diagramGrid,
} from "@/components/diagram";
import { ONGOING_TEAM } from "@/content/diagrams";

/**
 * The ongoing product team (decision-log #53), drawn in the diagram
 * language of #60: a live product being watched and improved. It
 * replaces the Product Support timeline of #30 (and with it build-note
 * 34's F9, the second coral mark on that timeline's date scale).
 *
 * A live status row, then twelve weeks of the product's weekly active
 * users with each release marked on the axis, then what ships next.
 * After the reference's insights chart, **the chart can be scrubbed**:
 * the pointer moves the reading, and so do the arrow keys, Home and End,
 * because the chart is a `role="slider"` (its value text says the week,
 * the users and any release that week). The reading's point is the
 * diagram's one coral emphasis; the line and its fill are linen, never
 * coral (fin §1: coral is never a chart fill).
 *
 * At rest, and on the server, the reading is the latest week. The
 * pulse on "Live" is ambient (#62), applied `motion-safe`.
 *
 * The diagram is a `role="group"` named by `ONGOING_TEAM.label`, so the
 * slider is reachable and everything else in it is hidden.
 */

const G = ROW_GRID;

/* The chart's plot, in the canvas's coordinates. */
const PLOT = { x0: 34, x1: 366, y0: 92, y1: 196 } as const;
const WEEKS = ONGOING_TEAM.weeks;
const LO = Math.min(...WEEKS);
const HI = Math.max(...WEEKS);

const xAt = (i: number) =>
  PLOT.x0 + (i / (WEEKS.length - 1)) * (PLOT.x1 - PLOT.x0);
const yAt = (v: number) =>
  PLOT.y1 - ((v - LO) / (HI - LO)) * (PLOT.y1 - PLOT.y0);

/** A smooth line through the weeks: horizontal tangents at each point. */
const LINE = WEEKS.map((v, i) => {
  const x = xAt(i).toFixed(1);
  const y = yAt(v).toFixed(1);
  if (i === 0) return `M${x},${y}`;
  const cx = ((xAt(i - 1) + xAt(i)) / 2).toFixed(1);
  return `C${cx},${yAt(WEEKS[i - 1]).toFixed(1)} ${cx},${y} ${x},${y}`;
}).join(" ");
const AREA = `${LINE} L${PLOT.x1},${PLOT.y1} L${PLOT.x0},${PLOT.y1} Z`;

const AT = {
  status: G.place([14, 14, 372, 22]),
  card: G.place([14, 44, 372, 196]),
  header: G.place([24, 52, 352, 20]),
  scrub: G.place([24, 80, 352, 124]),
  axis: G.place([24, 214, 352, 18]),
  next: G.place([14, 254, 372, 30]),
};

/** Percent placement for HTML marks laid on the plot. */
const PCT = diagramGrid("none", G.tall);

const users = (v: number) => v.toLocaleString("en-US");

function releaseIn(week: number) {
  return ONGOING_TEAM.releases.find((r) => r.week === week);
}

function valueText(i: number): string {
  const week = i + 1;
  const release = releaseIn(week);
  return `${ONGOING_TEAM.weekLabel} ${week}: ${users(WEEKS[i])} ${ONGOING_TEAM.usersLabel}${release === undefined ? "" : `, ${release.version} shipped, ${release.note}`}`;
}

export function ProductTeamDiagram() {
  const last = WEEKS.length - 1;
  const [picked, setPicked] = useState<number | null>(null);
  const i = picked ?? last;
  const release = releaseIn(i + 1);

  const onPointer = (event: PointerEvent<HTMLDivElement>) => {
    /* The scrubber spans the canvas from x 24 to 376; the weeks run
       from PLOT.x0 to PLOT.x1 inside it. */
    const box = event.currentTarget.getBoundingClientRect();
    const x = 24 + ((event.clientX - box.left) / box.width) * 352;
    const t = (x - PLOT.x0) / (PLOT.x1 - PLOT.x0);
    setPicked(Math.max(0, Math.min(last, Math.round(t * last))));
  };
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
    };
    if (event.key in step) {
      setPicked(Math.max(0, Math.min(last, i + step[event.key])));
    } else if (event.key === "Home") {
      setPicked(0);
    } else if (event.key === "End") {
      setPicked(last);
    } else {
      return;
    }
    event.preventDefault();
  };

  const point = PCT.place([xAt(i), yAt(WEEKS[i]), 0, 0]);
  /* The reading's chip sits above the point (below it near the top of
     the plot), centred on it, or ending at it near the right edge and
     starting at it near the left, so it never leaves the chart. */
  const chipBelow = yAt(WEEKS[i]) < PLOT.y0 + 30;
  const chipX =
    xAt(i) > PLOT.x1 - 50
      ? "-translate-x-[calc(100%+0.5rem)]"
      : xAt(i) < PLOT.x0 + 50
        ? "translate-x-2"
        : "-translate-x-1/2";

  return (
    <RowDiagram label={ONGOING_TEAM.label} interactive>
      <div aria-hidden="true">
        <Place at={AT.status} className="flex items-center gap-3">
          <span
            className={`${D_LABEL} ${ON_CANVAS} flex items-center gap-1.5 text-foreground`}
          >
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inset-0 rounded-full bg-foreground motion-safe:animate-diagram-pulse" />
              <span className="relative size-2 rounded-full bg-foreground" />
            </span>
            {ONGOING_TEAM.live}
          </span>
          <span className={`${D_LABEL} ${ON_CANVAS} text-muted-foreground`}>
            {ONGOING_TEAM.uptime}
          </span>
          <span
            className={`${D_LABEL} ${ON_CANVAS} ml-auto text-muted-foreground normal-case`}
          >
            {ONGOING_TEAM.releases[ONGOING_TEAM.releases.length - 1].version}
          </span>
        </Place>
        <Place
          at={AT.card}
          className="rounded-md border border-border bg-card"
        />
        <Place
          at={AT.header}
          className="flex items-baseline justify-between gap-2"
        >
          <span className={`${D_LABEL} truncate text-muted-foreground`}>
            {ONGOING_TEAM.chart}
          </span>
          <span className={`${D_FIGURE} text-foreground`}>
            {users(WEEKS[i])}
          </span>
        </Place>

        <DiagramSvg grid={G}>
          <defs>
            <linearGradient id="product-team-area" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0"
                stopColor="var(--color-foreground)"
                stopOpacity="0.12"
              />
              <stop
                offset="1"
                stopColor="var(--color-foreground)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={PLOT.x0}
              x2={PLOT.x1}
              y1={PLOT.y0 + f * (PLOT.y1 - PLOT.y0)}
              y2={PLOT.y0 + f * (PLOT.y1 - PLOT.y0)}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              className="stroke-border"
            />
          ))}
          {/* Each release: a dashed rule up from the axis to the line. */}
          {ONGOING_TEAM.releases.map((r) => (
            <line
              key={r.version}
              x1={xAt(r.week - 1)}
              x2={xAt(r.week - 1)}
              y1={PLOT.y1}
              y2={yAt(WEEKS[r.week - 1])}
              strokeWidth={1.25}
              vectorEffect="non-scaling-stroke"
              className="stroke-muted-foreground/80 [stroke-dasharray:3_4]"
            />
          ))}
          <path d={AREA} fill="url(#product-team-area)" />
          <path
            d={LINE}
            fill="none"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            className="stroke-foreground"
          />
          <line
            x1={PLOT.x0}
            x2={PLOT.x1}
            y1={PLOT.y1}
            y2={PLOT.y1}
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            className="stroke-muted-foreground/80"
          />
          {ONGOING_TEAM.releases.map((r) => (
            <rect
              key={r.version}
              x={xAt(r.week - 1) - 3.5}
              y={PLOT.y1 - 3.5}
              width={7}
              height={7}
              transform={`rotate(45 ${xAt(r.week - 1)} ${PLOT.y1})`}
              className="fill-foreground"
            />
          ))}
          {/* The reading: a guide down to the axis and the coral point. */}
          <line
            x1={xAt(i)}
            x2={xAt(i)}
            y1={PLOT.y0 - 6}
            y2={PLOT.y1}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            className="stroke-foreground/40"
          />
          <circle
            cx={xAt(i)}
            cy={yAt(WEEKS[i])}
            r={4}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            className="fill-brand stroke-card"
          />
        </DiagramSvg>

        <Place
          at={point}
          className={`pointer-events-none ${chipX} ${chipBelow ? "translate-y-3" : "-translate-y-[calc(100%+0.75rem)]"}`}
        >
          <span
            className={`${D_LABEL} block rounded-sm bg-foreground px-1.5 py-1 text-background`}
          >
            {ONGOING_TEAM.weekLabel} {i + 1}
            {release !== undefined && (
              <span className="normal-case"> · {release.version}</span>
            )}
          </span>
        </Place>

        <Place at={AT.axis}>
          {ONGOING_TEAM.releases.map((r) => (
            <span
              key={r.version}
              className={`${D_LABEL} absolute top-0 -translate-x-1/2 text-muted-foreground normal-case`}
              style={{
                left: `${(((xAt(r.week - 1) - 24) / 352) * 100).toFixed(3)}%`,
              }}
            >
              {r.version}
            </span>
          ))}
        </Place>

        <Place
          at={AT.next}
          className="flex items-center gap-2 border-t border-border pt-1"
        >
          <span className="size-1.5 shrink-0 rotate-45 border border-muted-foreground" />
          <span
            className={`${D_LABEL} ${ON_CANVAS} truncate text-muted-foreground`}
          >
            {ONGOING_TEAM.next}
          </span>
        </Place>
      </div>

      {/* The scrubber: the chart's plot as a slider. */}
      <Place at={AT.scrub}>
        <div
          role="slider"
          tabIndex={0}
          aria-label={ONGOING_TEAM.scrub}
          aria-valuemin={1}
          aria-valuemax={WEEKS.length}
          aria-valuenow={i + 1}
          aria-valuetext={valueText(i)}
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onPointerLeave={() => setPicked(null)}
          onBlur={() => setPicked(null)}
          onKeyDown={onKey}
          className="size-full cursor-crosshair touch-pan-y rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </Place>
    </RowDiagram>
  );
}
