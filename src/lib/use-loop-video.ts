"use client";

import { useEffect, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface LoopVideoOptions {
  /**
   * Play only while the clip is on screen, and pause it when it leaves.
   * The About avatars set it (decision-log #64); the hero does not,
   * because it is the top of the page and plays from load (#46).
   */
  whileVisible?: boolean;
}

/**
 * The site's one playback contract for a muted clip that loops natively
 * (decision-log #46; extended to the About avatars by #64). Extracted
 * from `HeroLoop` unchanged so every looping clip shares it rather than
 * forking it.
 *
 * **Playback starts here, not from the `autoPlay` attribute**, so the
 * motion gate holds before anything moves: server HTML is the poster,
 * reduced-motion visitors never call `play()`, and no-JS visitors keep
 * the poster. The element carries `muted` (what lets a browser start it
 * without a gesture) and `playsInline` (which keeps iOS from going
 * full-screen). A refused `play()` (iOS Low Power Mode, a data saver)
 * rejects its promise; it is caught deliberately, so the poster simply
 * stays and the console stays clean. A mid-session reduced-motion flip
 * pauses and calls `load()`, which re-arms the poster rather than
 * freezing on whatever frame was showing; that also aborts a pending
 * `play()`, whose rejection the same catch absorbs.
 *
 * With `whileVisible`, an IntersectionObserver plays the clip as it
 * comes on screen and pauses it as it leaves, so an off-screen clip
 * neither decodes nor (under `preload="none"`) downloads.
 */
export function useLoopVideo(
  ref: RefObject<HTMLVideoElement | null>,
  { whileVisible = false }: LoopVideoOptions = {},
) {
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
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
    let onScreen = !whileVisible;
    const start = () => {
      if (!onScreen) return;
      video.play().catch(() => {
        // Autoplay refused or aborted: the poster stays. Not an error.
      });
    };
    // Browsers pause video-only playback while the page is hidden (the
    // site's clips have no audio track). Chrome resumes it when the tab
    // returns; the Claude desktop preview pane was measured not to,
    // leaving the hero frozen mid-clip, and nothing obliges every engine
    // to. So the loop restarts itself whenever the page is visible
    // again, including a back/forward-cache restore. play() on a playing
    // video is a no-op.
    const resume = () => {
      if (document.visibilityState === "visible" && video.paused) start();
    };
    let observer: IntersectionObserver | undefined;
    if (whileVisible) {
      observer = new IntersectionObserver((entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        if (onScreen) start();
        else video.pause();
      });
      observer.observe(video);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      video.pause();
      video.load();
    };
  }, [ref, reduceMotion, whileVisible]);
}
