"use client";

import { useRef } from "react";
import { useLoopVideo } from "@/lib/use-loop-video";

interface HeroLoopProps {
  /** Self-hosted asset under /public (never a remote URL). */
  src: string;
  /** The clip's first frame: painted at once, and the reduced-motion / no-JS view. */
  poster: string;
}

/**
 * Hero footage (decision-log #46, owner call 2026-10-05; footage swapped
 * by #50, 2026-10-14): one silent loop that plays on its own. Five
 * motion-graphics shots in the fin dark palette: a process map draws
 * itself and becomes a finished map, an app screen draws itself and
 * becomes the finished app, and the camera pulls back to a small team
 * using it. Nothing on the site is scroll-linked to video. It was the
 * only video the site mounted until the About avatars joined it
 * (decision-log #64); it is still the only one that plays from load.
 *
 * **The seam is in the file, not here.** The clip is built so its last
 * frame flows into its first, so the native `loop` attribute is the
 * whole mechanism: no fade, no crossfade, no restart handling in code.
 * The asset ships exactly as delivered (no re-encode, trim or resize).
 *
 * **Playback is the shared contract in `useLoopVideo`** (moved there
 * unchanged by #64, so the About avatars reuse it rather than fork it):
 * `play()` from an effect, never the `autoPlay` attribute, so the
 * server HTML is the poster, reduced-motion and no-JS visitors keep the
 * poster, a refused `play()` keeps it quietly, and a loop the browser
 * paused while the page was hidden restarts when it is visible again.
 *
 * Loading: `preload="metadata"` + poster in the server HTML, so the
 * still paints with the page and reduced-motion visitors fetch only
 * metadata. `play()` pulls the rest. The video never blocks the hero
 * text: it is decorative paint behind it, not part of its layout.
 *
 * Decorative by contract (aria-hidden); the hero's image-band treatment
 * rides above the footage: a `background`/25 overlay plus the
 * `bg-hero-scrim` utility, near-solid through the text band and released
 * above it. Tuned for this footage by measurement (globals.css explains
 * the numbers): every line of hero text, coral included, holds 4.5:1 on
 * every frame of the loop.
 *
 * **It dissolves into the page on every edge** (owner direction,
 * 2026-10-14: "fade out in all directions, no hard stops"). The
 * `hero-fade` mask in globals.css sits on the wrapper, so the footage
 * and both overlays fade together to transparent and the page's own
 * `background` shows through: there is no rectangle edge anywhere, and
 * the hero runs into the Work band below it without a seam. The mask is
 * spatial only. The loop's seam in time is the file's, untouched.
 */
export function HeroLoop({ src, poster }: HeroLoopProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useLoopVideo(videoRef);

  return (
    <div aria-hidden="true" className="hero-fade absolute inset-0">
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
      <div className="absolute inset-0 bg-background/25" />
      <div className="absolute inset-0 bg-hero-scrim" />
    </div>
  );
}
