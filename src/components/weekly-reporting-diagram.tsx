"use client";

import { useEffect, useRef, useState } from "react";
import {
  BeforeAfterDiagram,
  D_FIGURE,
  D_LABEL,
  D_TEXT,
} from "@/components/diagram";
import { WEEKLY_REPORT, weeklySourceLabel } from "@/content/diagrams";
import { useMounted } from "@/lib/use-mounted";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Weekly reporting (decision-log #57), drawn in the diagram language of
 * #60: numbers scattered across four tools become one finished report,
 * delivered. The one agentic diagram with controls, after the
 * reference's integrations hub, which lights one tool at a time.
 *
 * **What it does.** Each tool is a toggle button (`aria-pressed`).
 * Hovering, focusing or pressing one lights it, names it under the
 * agent ("Pulling" and the tool), and marks its row in the report with
 * the diagram's one coral emphasis, so a visitor can follow a number
 * from where it lives to where it lands. With nothing chosen, the
 * diagram walks the four tools itself every 1.8s: ambient motion
 * (#62), so it never starts under reduced motion, never runs off
 * screen, and stops the moment a visitor points at or picks a tool.
 * It is a class swap; the colour change is the 150ms micro-transition.
 *
 * **What assistive tech hears.** The diagram is a `role="group"` named
 * by `WEEKLY_REPORT.label`, which ends by inviting a choice; each
 * button is named for its tool, metric and figure; the report and the
 * agent are hidden, because the label already says what they show.
 *
 * Server HTML and the hydration pass show nothing lit (the cycle needs
 * JS), the same still state reduced motion keeps.
 */

const CYCLE_MS = 1800;

/** One small glyph per tool, inline SVG (§Interaction vocabulary). */
const GLYPHS = [
  /* Spreadsheet: a grid. */
  "M2 2.5h8v7H2zM2 5h8M2 7.5h8M5 2.5v7",
  /* CRM: two people. */
  "M4.2 5.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zM1.5 10c0-1.7 1.2-3 2.7-3s2.7 1.3 2.7 3M8 5a1.3 1.3 0 1 0 0-2.6M8.6 7.1c1.1.3 1.9 1.4 1.9 2.9",
  /* Billing: a card. */
  "M1.5 3h9v6h-9zM1.5 5h9M3 7.5h2",
  /* Ads: a rising line. */
  "M1.5 9.5 4.5 6l2 2 4-5M8 3h2.5v2.5",
] as const;

function ToolGlyph({ index }: { index: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="size-3 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={GLYPHS[index % GLYPHS.length]} />
    </svg>
  );
}

/** The report's mini chart: six weeks of sales, the last one this week. */
const BARS = [46, 58, 52, 70, 64, 82] as const;

export function WeeklyReportingDiagram() {
  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);

  const sources = WEEKLY_REPORT.sources;
  const cycling =
    mounted &&
    !reduceMotion &&
    onScreen &&
    hovered === null &&
    pressed === null;

  useEffect(() => {
    const el = ref.current;
    if (el === null || typeof IntersectionObserver !== "function") return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry !== undefined) setOnScreen(entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!cycling) return;
    const timer = window.setInterval(
      () => setAuto((n) => (n + 1) % sources.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(timer);
  }, [cycling, sources.length]);

  const active = hovered ?? pressed ?? (cycling ? auto : null);
  const activeSource = active === null ? undefined : sources[active];

  return (
    <div ref={ref}>
      <BeforeAfterDiagram
        interactive
        label={WEEKLY_REPORT.label}
        status={
          activeSource === undefined ? undefined : (
            <>
              {WEEKLY_REPORT.pulling}
              <span className="mt-1.5 block bg-background">
                {activeSource.tool}
              </span>
            </>
          )
        }
        before={{
          title: WEEKLY_REPORT.before.title,
          bodyClassName:
            "grid grid-cols-2 gap-1.5 p-1.5 @sm:grid-cols-1 @md:gap-2 @md:p-2",
          body: sources.map((source, i) => (
            <button
              key={source.tool}
              type="button"
              aria-pressed={pressed === i}
              aria-label={weeklySourceLabel(source)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => setPressed((p) => (p === i ? null : i))}
              className={`flex min-h-11 min-w-0 cursor-pointer flex-col justify-center gap-1 rounded-md border bg-secondary px-2 py-1.5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring @md:px-2.5 ${active === i ? "border-foreground" : "border-border hover:border-muted-foreground/50"}`}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <ToolGlyph index={i} />
                <span className={`${D_LABEL} truncate text-muted-foreground`}>
                  {source.tool}
                </span>
              </span>
              <span className="flex min-w-0 items-baseline justify-between gap-2">
                <span className={`${D_TEXT} truncate text-muted-foreground`}>
                  {source.metric}
                </span>
                <span className={`${D_FIGURE} text-foreground`}>
                  {source.value}
                </span>
              </span>
            </button>
          )),
        }}
        after={{
          title: WEEKLY_REPORT.after.title,
          bodyClassName: "p-2 @md:p-2.5",
          body: (
            <>
              {/* Last week's report under this one: the report lands
                  every week. */}
              <span
                aria-hidden="true"
                className="absolute inset-2 translate-x-1 -translate-y-1 rounded-sm border border-border bg-secondary @md:inset-2.5"
              />
              <div className="relative flex h-full flex-col rounded-sm border border-muted-foreground/60 bg-secondary p-2 motion-safe:animate-diagram-sheet @md:p-2.5">
                <span className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <span className={`${D_LABEL} text-foreground`}>
                    {WEEKLY_REPORT.after.report}
                  </span>
                  <span className={`${D_LABEL} text-muted-foreground`}>
                    {WEEKLY_REPORT.after.week}
                  </span>
                </span>
                <span className="mt-2 block space-y-1 @md:space-y-1.5">
                  {sources.map((source, i) => (
                    <span
                      key={source.tool}
                      className="flex items-baseline justify-between gap-2"
                    >
                      <span
                        className={`${D_TEXT} flex min-w-0 items-center gap-1.5 transition-colors duration-150 ${active === i ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        <span
                          className={`size-1.5 shrink-0 rotate-45 transition-colors duration-150 ${active === i ? "bg-brand" : "bg-transparent"}`}
                        />
                        <span className="truncate">{source.metric}</span>
                      </span>
                      <span className={`${D_FIGURE} text-foreground`}>
                        {source.value}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-auto flex h-[22%] min-h-4 items-end gap-1 border-b border-border pt-2">
                  {BARS.map((h, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-t-sm ${i === BARS.length - 1 ? "bg-foreground" : "bg-muted-foreground"}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </span>
                <span
                  className={`${D_LABEL} mt-2 flex items-center gap-1.5 text-muted-foreground`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="size-2.5 shrink-0 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  >
                    <path d="M2.5 6.2 5 8.5l4.5-5" />
                  </svg>
                  <span className="truncate">{WEEKLY_REPORT.after.sent}</span>
                </span>
              </div>
            </>
          ),
        }}
      />
    </div>
  );
}
