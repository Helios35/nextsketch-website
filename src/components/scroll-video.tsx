"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { createVideoScrubber } from "@/lib/video-scrub";

interface ScrollVideoSource {
  /** Self-hosted asset under /public (never a remote URL). */
  src: string;
  /** Static first-frame poster — the reduced-motion / no-JS fallback. */
  poster: string;
}

interface ScrollVideoProps {
  /**
   * Clips in page order. The sequence divides the page's scroll range
   * evenly — one segment per clip, each clip's full timeline scrubbed
   * across its segment — crossfading at the seams.
   */
  sources: readonly ScrollVideoSource[];
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
 * main — re-measured on resize; falls back to the whole page if the
 * hero isn't found), so no footage is spent unseen. Covered clips
 * are not scrubbed — seeks are decode work.
 *
 * Loading: clips ship `preload="metadata"` + posters so the hero
 * orbit owns the initial bandwidth (adversarial review, Unit 03);
 * the effect upgrades them to auto once the visitor scrolls within a
 * viewport of the reveal. Reduced-motion visitors never upgrade —
 * they keep the first clip's poster for the price of metadata.
 *
 * Painting: fixed inset-0 at -z-10 — above the root ink canvas
 * (globals.css moves the page surface to <html> for exactly this),
 * below all in-flow content, under the hero's image-band treatment
 * (ink/40 overlay + bottom scrim) so foreground text stays legible.
 *
 * Fallbacks: reduced-motion never scrubs (static first frame of the
 * first clip under the same overlays — no motion, ever; a
 * mid-session flip resets the timeline to that frame); no-JS gets
 * the same static frame via the poster.
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

    // The hero runway that covers the backdrop — resolved at setup
    // and on resize, not per scroll event. Document height, by
    // contrast, is read per event: the Process accordion changes it
    // without a resize.
    let start = 0;
    const measure = () => {
      const hero = document.querySelector<HTMLElement>(
        "main > section:first-of-type",
      );
      start =
        hero === null ? 0 : Math.max(0, hero.offsetHeight - window.innerHeight);
    };

    let upgraded = false;
    let lastP = -1;
    const applied: number[] = videos.map((_, i) => (i === 0 ? 1 : 0));

    const update = () => {
      // Fetch the sequence in earnest only once the visitor is within
      // a viewport of revealing it — until then the hero clip owns
      // the bandwidth.
      if (!upgraded && window.scrollY + window.innerHeight >= start) {
        upgraded = true;
        videos.forEach((video) => {
          video.preload = "auto";
        });
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const range = max - start;
      const p = range > 0 ? clamp01((window.scrollY - start) / range) : 0;
      if (p === lastP) return;
      lastP = p;
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
        if (opacities[i] !== applied[i]) {
          applied[i] = opacities[i];
          video.style.opacity = opacities[i].toFixed(3);
        }
        if (i >= covered && opacities[i] > 0) {
          scrubbers[i].seekToward(clamp01(p * count - i));
        }
      });
    };
    const remeasure = () => {
      measure();
      lastP = -1;
      update();
    };

    remeasure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    videos.forEach((video) => {
      video.addEventListener("loadedmetadata", remeasure);
    });
    return () => {
      scrubbers.forEach((scrubber) => scrubber.cancel());
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", remeasure);
      videos.forEach((video, i) => {
        video.removeEventListener("loadedmetadata", remeasure);
        video.style.opacity = i === 0 ? "1" : "0";
        // A mid-session reduced-motion flip must land on the contract
        // frame (the first clip's first frame), not wherever the
        // scrub stopped. Harmless on unmount.
        video.currentTime = 0;
        video.preload = "metadata";
      });
    };
  }, [reduceMotion]);

  return (
    <div ref={containerRef} aria-hidden="true" className="fixed inset-0 -z-10">
      {sources.map((source, i) => (
        <video
          key={source.src}
          src={source.src}
          poster={source.poster}
          muted
          playsInline
          preload="metadata"
          style={{ opacity: i === 0 ? 1 : 0 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}
      <div className="absolute inset-0 bg-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
    </div>
  );
}
