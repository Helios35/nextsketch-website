"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { createVideoScrubber } from "@/lib/video-scrub";

interface ScrollVideoProps {
  /**
   * Self-hosted assets under /public (never remote URLs), in page
   * order. The sequence divides the page's scroll range evenly — one
   * segment per clip, each clip's full timeline scrubbed across its
   * segment — crossfading at the seams.
   */
  sources: readonly string[];
}

/** Fraction of the sequence's progress a crossfade seam spans. */
const CROSSFADE = 0.08;

/**
 * Scroll-synced background video sequence (Redesign Unit 02,
 * owner-directed revision 2026-07-06; extended to a multi-clip
 * cinematic sequence in Unit 03): the footage is the site's fixed
 * backdrop and its timeline is driven by scroll through the shared
 * scrub engine — frames advance only while the visitor scrolls,
 * freeze the moment scrolling stops, and no element ever play()s
 * (no autoplay, no audio, no controls; decorative by contract,
 * aria-hidden).
 *
 * Sequencing (Unit 03): the clips stack in DOM order and each later
 * clip fades in over the previous at its segment boundary (direct
 * style writes, never React state — byte-stable SSR). Sequence
 * progress starts where the hero band starts revealing the backdrop
 * (the hero's runway bottom, measured from the first section in
 * main; falls back to the whole page if the hero isn't found), so
 * no footage is spent unseen behind the hero. Covered clips are not
 * scrubbed — seeks are decode work.
 *
 * Painting: fixed inset-0 at -z-10 — above the root ink canvas
 * (globals.css moves the page surface to <html> for exactly this),
 * below all in-flow content, under the hero's image-band treatment
 * (ink/40 overlay + bottom scrim) so foreground text stays legible.
 *
 * Fallbacks: reduced-motion never scrubs (static first frame of the
 * first clip under the same overlays — no motion, ever); no-JS gets
 * the same static frame; before metadata loads the ink canvas shows
 * through.
 */
export function ScrollVideo({ sources }: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (container === null || reduceMotion) return;
    const videos = Array.from(container.querySelectorAll("video"));
    if (videos.length === 0) return;
    const scrubbers = videos.map(createVideoScrubber);
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const hero = document.querySelector<HTMLElement>(
        "main > section:first-of-type",
      );
      const start =
        hero === null
          ? 0
          : Math.max(0, hero.offsetHeight - window.innerHeight);
      const range = max - start;
      const p = range > 0 ? clamp01((window.scrollY - start) / range) : 0;
      const count = videos.length;
      const opacities = videos.map((video, i) =>
        i === 0 ? 1 : clamp01((p - (i / count - CROSSFADE / 2)) / CROSSFADE),
      );
      // The highest fully-opaque layer covers everything below it.
      let covered = 0;
      for (let i = count - 1; i > 0; i -= 1) {
        if (opacities[i] === 1) {
          covered = i;
          break;
        }
      }
      videos.forEach((video, i) => {
        video.style.opacity = opacities[i].toFixed(3);
        if (i >= covered && opacities[i] > 0) {
          scrubbers[i].seekToward(clamp01(p * count - i));
        }
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    videos.forEach((video) => {
      video.addEventListener("loadedmetadata", update);
    });
    return () => {
      scrubbers.forEach((scrubber) => scrubber.cancel());
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      videos.forEach((video, i) => {
        video.removeEventListener("loadedmetadata", update);
        video.style.opacity = i === 0 ? "1" : "0";
      });
    };
  }, [reduceMotion]);

  return (
    <div ref={containerRef} aria-hidden="true" className="fixed inset-0 -z-10">
      {sources.map((source, i) => (
        <video
          key={source}
          src={source}
          muted
          playsInline
          preload="auto"
          style={{ opacity: i === 0 ? 1 : 0 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}
      <div className="absolute inset-0 bg-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
    </div>
  );
}
