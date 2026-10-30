import type { ServiceSlug } from "@/lib/types";

/**
 * The offer tab — decision-log **#67**. Each offering carries its own
 * colour (`offer-agentic-system` dark yellow, `offer-product` green, in
 * `globals.css`), and it shows as this one mark only: a short 2px line
 * sitting on the top hairline of the surface that holds the offering,
 * at its content's left edge, like an index tab. The home Services
 * cards, the `/pricing` tiers, and on each service route the ribbon,
 * the example and way-in rows (so the diagram in each row is marked
 * without being redrawn) and the agentic lists.
 *
 * **It identifies; it never emphasises.** Coral keeps every job it had
 * on these surfaces (the index diamond, the list diamonds, the CTA, the
 * monthly figure), and the tab is smaller than any of them, so a
 * visitor notices coral first. A full-width 2px edge was tried and read
 * before coral on the wide service rows; the 1px hairline recoloured
 * alone was too faint to tell the two cards apart at a glance.
 *
 * **Always a line, always beside the name.** A level's colour is one
 * of five shapes (Brief 2), and two pairs nearly match on dark: the
 * product green and olive (level 5, a product level), the agentic
 * yellow and amber (level 2, an agentic level). Each pair stays inside
 * one offering, but an offer's colour is still never a shape and never
 * appears without the offering's name on the same surface, so neither
 * pair relies on hue alone.
 *
 * Positioned, so nothing moves: the host is `relative` and the tab
 * covers its 1px hairline plus 1px inside it. `className` places it
 * horizontally to the host's own padding. It goes last in the host, so
 * it paints over the hairline in DOM order. Decorative to assistive
 * tech: the name beside it already says which offering this is.
 */
const TAB_COLOUR: Record<ServiceSlug, string> = {
  "agentic-system": "bg-offer-agentic-system",
  product: "bg-offer-product",
};

export function OfferTab({
  offer,
  className,
}: {
  offer: ServiceSlug;
  className: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute -top-px h-0.5 w-10 rounded-full ${TAB_COLOUR[offer]} ${className}`}
    />
  );
}
