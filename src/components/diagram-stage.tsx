"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/** A diagram's coordinate space: the `viewBox` its parts are drawn in. */
export interface DiagramSize {
  readonly w: number;
  readonly h: number;
}

/**
 * Where a diagram switches from its narrow drawing to its wide one,
 * measured on the diagram itself (a container query), not the viewport:
 * the same diagram is 264px wide in a phone's service row and 512px in a
 * desktop one. `sm` is 24rem (the service rows), `2xl` 42rem (the Why
 * section's wider column). `none` keeps one drawing at every width.
 */
export type DiagramBreakpoint = "none" | "sm" | "2xl";

const ASPECT: Record<DiagramBreakpoint, string> = {
  none: "aspect-(--diagram-ar)",
  sm: "aspect-(--diagram-ar) @sm:aspect-(--diagram-ar-wide)",
  "2xl": "aspect-(--diagram-ar) @2xl:aspect-(--diagram-ar-wide)",
};

/**
 * The canvas every diagram draws on (decision-log #60): a fixed-aspect
 * box, sized as a container so the diagram's text steps with the
 * diagram's own width rather than the viewport's.
 *
 * **Its one job besides the box: stop the ambient motion off screen.**
 * The travelling dots, running dashes and pulses (#62) are continuous
 * CSS animations; with eight diagrams on two pages, running them all
 * the time spends the main thread on things nobody can see. An
 * IntersectionObserver marks the canvas `data-idle` while it is off
 * screen, and one rule pauses every animation inside it. The server
 * HTML carries no `data-idle`, so with no JS the motion simply runs
 * (and reduced motion never starts it: every animation is applied
 * `motion-safe`).
 *
 * Two drawings, one box: `tall` is the narrow drawing and `wide` the
 * wide one; the aspect ratio switches at `breakpoint`, and so does each
 * placed part (`diagramGrid` in `diagram.tsx`).
 */
export function DiagramStage({
  tall,
  wide = tall,
  breakpoint = "none",
  capTall = false,
  className,
  children,
}: {
  tall: DiagramSize;
  wide?: DiagramSize;
  breakpoint?: DiagramBreakpoint;
  /**
   * Hold the narrow drawing to 24rem, centred, until the wide one takes
   * over (`2xl` only): a portrait drawing scaled to a 40rem column
   * would run over a thousand pixels tall.
   */
  capTall?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null || typeof IntersectionObserver !== "function") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry !== undefined) setIdle(!entry.isIntersecting);
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = {
    "--diagram-ar": `${tall.w} / ${tall.h}`,
    "--diagram-ar-wide": `${wide.w} / ${wide.h}`,
  } as CSSProperties;

  return (
    <div className={`@container w-full ${className ?? ""}`}>
      <div
        ref={ref}
        data-idle={idle ? "" : undefined}
        className={`relative w-full ${ASPECT[breakpoint]} ${capTall ? "mx-auto max-w-sm @2xl:max-w-none" : ""} [&[data-idle]_*]:[animation-play-state:paused]`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
