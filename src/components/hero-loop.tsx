"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface HeroLoopProps {
  /** Self-hosted asset under /public (never a remote URL). */
  src: string;
  /** The clip's first frame: painted at once, and the reduced-motion / no-JS view. */
  poster: string;
}

/**
 * Hero footage (decision-log #46, owner call 2026-10-05): one silent
 * loop that plays on its own — rotating studio shot, then strategist,
 * builder and partner, joined by dissolves. It replaces the
 * scroll-scrubbed orbit and the scroll-scrubbed backdrop behind the
 * lower sections; nothing on the site is scroll-linked to video any
 * more, and this is the only video the site mounts.
 *
 * **The seam is in the file, not here.** The clip is built so its last
 * frame flows into its first, so the native `loop` attribute is the
 * whole mechanism: no fade, no crossfade, no restart handling in code.
 * The asset ships exactly as delivered (no re-encode, trim or resize).
 *
 * **Playback starts from the effect, not the `autoPlay` attribute**, so
 * the motion gate holds before anything moves: server HTML is the
 * poster, reduced-motion visitors never call `play()`, and no-JS
 * visitors keep the poster — the same static fallback the scrubbed
 * orbit gave both. `muted` is what lets a browser start it without a
 * gesture (and `playsInline` keeps iOS from going full-screen). A
 * refused `play()` — iOS Low Power Mode, a data saver — rejects its
 * promise; it is caught deliberately, so the poster simply stays and
 * the console stays clean. A mid-session reduced-motion flip pauses and
 * calls `load()`, which re-arms the poster rather than freezing on
 * whatever frame was showing; that also aborts a pending `play()`,
 * whose rejection the same catch absorbs. If the browser pauses the
 * loop while the page is hidden, it restarts when the page is visible
 * again (see the effect).
 *
 * Loading: `preload="metadata"` + poster in the server HTML, so the
 * still paints with the page and reduced-motion visitors fetch only
 * metadata. `play()` pulls the rest. The video never blocks the hero
 * text: it is decorative paint behind it, not part of its layout.
 *
 * Decorative by contract (aria-hidden); the hero's image-band treatment
 * (ink/40 overlay + bottom scrim) rides above the footage so the white
 * headline stays legible on every frame.
 */
export function HeroLoop({ src, poster }: HeroLoopProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    // The hook returns its server snapshot (false) on the hydration
    // pass and corrects a render later, so on its own it let a
    // reduced-motion visitor's first pass call play() before the
    // cleanup cancelled it (measured: play, then pause + load 7ms
    // later). Reading the query here too means play() is never called
    // for them at all.
    const reduced =
      reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (video === null || reduced) return;
    const start = () => {
      video.play().catch(() => {
        // Autoplay refused or aborted: the poster stays. Not an error.
      });
    };
    // Browsers pause video-only playback while the page is hidden (this
    // clip has no audio track). Chrome resumes it when the tab returns;
    // the Claude desktop preview pane was measured not to, leaving the
    // hero frozen mid-clip, and nothing obliges every engine to. So the
    // loop restarts itself whenever the page is visible again, including
    // a back/forward-cache restore. play() on a playing video is a no-op.
    const resume = () => {
      if (document.visibilityState === "visible" && video.paused) start();
    };
    start();
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    return () => {
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      video.pause();
      video.load();
    };
  }, [reduceMotion]);

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
    </div>
  );
}
