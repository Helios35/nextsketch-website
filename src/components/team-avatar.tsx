"use client";

import { useId, useRef, useState } from "react";
import { useLoopVideo } from "@/lib/use-loop-video";
import { useMounted } from "@/lib/use-mounted";
import type { TeamMember } from "@/lib/types";

/**
 * The flip affordance in the card's corner: two arcs chasing each other,
 * the digital card's "tap to flip" mark without its label (the label
 * would be copy the owner has not written). Decorative: the button's
 * name and its expanded state say what it does.
 */
function TurnIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 12a8 8 0 0 0-13.66-5.66" />
      <path d="M6.34 2.34v4h4" />
      <path d="M4 12a8 8 0 0 0 13.66 5.66" />
      <path d="M17.66 21.66v-4h-4" />
    </svg>
  );
}

/**
 * One person in About's team row (decision-log #63): a two-sided card
 * after the owner's digital card, with the person's name and title
 * always shown beneath it (owner, 2026-10-15). The front is their avatar
 * clip; a click flips it to the back, which says who they are in a
 * few sentences (`bio`) (#64 records the motion).
 *
 * **The card is a toggle button**, as the digital card's flip is. Click,
 * Enter and Space are the native button's, so all three flip it; a
 * second press flips it back; `aria-pressed` carries which way it faces
 * (only after hydration, since a no-JS button cannot flip). Its
 * accessible name is the person's `alt` line ("Julie, Client Partner at
 * NextSketch") and its description is the `bio` on the back
 * (`aria-describedby`), so a screen reader hears who each person is
 * whichever way the card faces. A button's contents are presentational,
 * so nothing inside it is read twice.
 *
 * **The flip** is a transition on `transform`, `rotateY(0)` to
 * `rotateY(180deg)` over 700ms on the shared `--ease-out`, inside a
 * `perspective-distant` (1200px) box. Both faces are `backface-hidden`;
 * the back is pre-turned 180°, so it reads the right way round when the
 * card has flipped. **Reduced motion** sees no flip: the base-layer
 * block in globals.css sets every transition to 0s (and the transition
 * is `motion-safe` besides), so the same press shows the back at once. The 700ms runs past the 200ms ceiling and the flip is
 * a transform on a control; #64 records both exemptions.
 *
 * **The back** is a `card` face, filled with the `bio` in Inter, sized
 * for the card: `text-sm` from `sm:` (276px at 640), `text-lg` from
 * `md:` (340px at 768), `text-2xl` at 1.5 leading from `lg:` (436px),
 * clear of the flip mark in the corner. A phone's card (148px at 360)
 * cannot hold it, so
 * below `sm:` the back shows `bioShort` at `text-xs` instead, and that
 * copy is `aria-hidden`: the accessible description is always `bio`
 * (`aria-describedby` reads a referenced element even while it is
 * `display: none`).
 *
 * **The caption** (name, then title) is plain text under the card,
 * always visible, server-rendered, and outside the button, so it is
 * read in place as well as through the button's name.
 *
 * **The clip** loops natively and plays only while on screen, through
 * the shared `useLoopVideo` contract (the hero's, extracted by #64):
 * `preload="none"` and a first-frame poster, so nothing downloads until
 * the row is in view, and reduced-motion and no-JS visitors see the
 * poster only. The front takes the old portrait's treatment: a `border`
 * hairline on a `muted` tile at `rounded-xl`, under the image-band
 * bottom scrim in `background` (docs/04-ux-spec.md §Surfaces); hover
 * lifts the hairline to `muted-foreground/50`, the card hover rule.
 */
export function TeamAvatar({ member }: { member: TeamMember }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const bioId = useId();
  useLoopVideo(videoRef, { whileVisible: true });

  const face =
    "absolute inset-0 overflow-hidden rounded-xl border border-border backface-hidden transition-colors duration-150 group-hover:border-muted-foreground/50";
  const mark =
    "absolute right-3 bottom-3 size-4 text-muted-foreground transition-colors duration-150 group-hover:text-foreground";

  return (
    <div>
      <button
        type="button"
        aria-label={member.alt}
        aria-describedby={bioId}
        aria-pressed={mounted ? open : undefined}
        onClick={() => setOpen((value) => !value)}
        className="group block w-full cursor-pointer rounded-xl perspective-distant focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span
          className={`relative block aspect-square transform-3d ease-out motion-safe:transition-transform motion-safe:duration-700 ${
            open ? "rotate-y-180" : "rotate-y-0"
          }`}
        >
          <span className={`${face} bg-muted`}>
            <video
              ref={videoRef}
              src={member.video}
              poster={member.poster}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent"
            />
            <TurnIcon className={mark} />
          </span>
          <span
            className={`${face} flex rotate-y-180 items-center bg-card px-3 pt-3 pb-8 text-left sm:px-5 sm:pt-5 sm:pb-10 lg:px-8 lg:pt-8 lg:pb-12`}
          >
            <span
              id={bioId}
              className="hidden text-sm leading-relaxed text-foreground sm:block md:text-lg lg:text-2xl lg:leading-normal"
            >
              {member.bio}
            </span>
            <span
              aria-hidden="true"
              className="text-xs leading-snug text-foreground sm:hidden"
            >
              {member.bioShort}
            </span>
            <TurnIcon className={mark} />
          </span>
        </span>
      </button>
      <div className="mt-4">
        <p className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {member.name}
        </p>
        <p className="mt-1 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
          {member.title}
        </p>
      </div>
    </div>
  );
}
