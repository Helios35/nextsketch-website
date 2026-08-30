/**
 * The one fade every service-page graphic uses.
 *
 * **There is exactly one of these on purpose.** It was four: the hero
 * visuals, the block mocks, the bento mosaic and the tile cluster each
 * grew their own gradient as they were tuned, and they drifted into
 * four different characters — some soft, some abrupt, some not reaching
 * the edges at all. Every graphic on these routes now imports this and
 * nothing else. If a fade needs changing, it changes here, for all of
 * them. **Do not add a second local one.**
 *
 * Two things are load-bearing in the value:
 *
 * 1. **The ellipse is sized explicitly.** `ellipse at center` with no
 *    size defaults to `farthest-corner`, which puts the last stop at
 *    the *corners*. On a 4/3 box that leaves the left and right
 *    mid-edges at 80% of the radius and the top and bottom at 60%, so
 *    the sides barely fade and the top and bottom read as a hard cut.
 *    `ellipse 50% 50%` sizes the radii to half-width and half-height
 *    (radial-gradient size percentages resolve against the
 *    corresponding box dimension), so the ramp ends exactly on all four
 *    mid-edges and every side dissolves the same amount.
 * 2. **The ramp is long.** `45% → 100%` spends more than half the
 *    radius on the transition. A short ramp is what makes a fade read
 *    as a cut-off rather than a dissolve, which is the failure this
 *    file exists to stop repeating.
 *
 * A literal gradient rather than a token utility, for the reason
 * `globals.css` gives for the dialog backdrop: the `color-mix()` form
 * Tailwind compiles tokens to computes correctly but does not always
 * paint. `--color-ink` is a plain hex, so referencing it is safe.
 *
 * It fills its positioned parent, so the parent is what decides *what*
 * dissolves — a framed mock fades to its frame, and the tile cluster
 * fades to the cluster's own box rather than the stage around it.
 */
export function VisualFade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,transparent_45%,var(--color-ink)_100%)]"
    />
  );
}
