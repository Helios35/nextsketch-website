/**
 * The page-background glow on `/pricing` and the two service routes —
 * and nowhere else. The home page is explicitly out of bounds (owner
 * direction, 2026-08-31; decision-log #35) — its footage now lives in
 * the hero alone (#46), and its lower sections sit on plain
 * `background`.
 *
 * Adapted from an owner-supplied background component (a radial
 * spotlight + animated noise-canvas snippet). What survives is **the
 * glow alone** — owner: "ONLY use the glow NOTHING ELSE":
 *
 * - The noise canvas is dropped, and with it the component's only
 *   client JS: a rAF loop repainting a 1024px canvas every other frame
 *   is a standing per-frame cost, is not `motion-safe:` gated, and the
 *   §Motion posture (CSS keyframes only, reduced-motion parity) has no
 *   slot for it. Without it this is a server component shipping zero
 *   JS.
 * - The demo variant's grid lines and the `bg-slate-950` base go too:
 *   these pages are `background` already, and the default Tailwind
 *   palette is cleared in `globals.css`, so `slate` would not even
 *   compile.
 * - The snippet's `/components/ui` (shadcn) instruction does not
 *   apply — components in this repo live flat in `src/components/`
 *   (build-note 23 posture; unit 26 refused the same directory).
 *
 * The spotlight keeps the source's exact geometry (`circle 560px at
 * 50% 200px`) recoloured to the brand accent, coral (`brand`,
 * decision-log #47), through the `bg-page-glow` utility in
 * `globals.css`, so the colour lives in the token layer and nowhere
 * here. **The mix percentage there is the intensity knob**: the source
 * ships its orange at full strength, which here would flood the hero
 * and cost the linen headline its contrast, so it is tempered (further
 * than the retired accent was, since coral is hotter). It is 12%
 * (decision-log #52), and contrast sets the ceiling: much above 13%,
 * `muted-foreground` text crossing the glow's centre falls under 4.5:1.
 *
 * `fixed inset-0 -z-10` is the source's own mounting: the glow rides
 * the viewport, above the `background` page ground and beneath every
 * band. That is why the bands on these routes shed their own
 * `bg-background`: an opaque band over a `-z-10` backdrop simply hides
 * it (the same
 * reasoning as home's transparent sections over the footage, #16
 * inverted). `pointer-events-none` + `aria-hidden`: pure decoration.
 */
export function PageGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-page-glow"
    />
  );
}
