import { BrandWordmark } from "@/components/brand-wordmark";
import { FOOTER, NAV, SITE } from "@/content/copy";

/**
 * Site footer per docs/03-site-architecture.md §Navigation: the same
 * anchors as the nav, the visible mailto escape hatch (Business
 * Rules 2.6), the legal line (casing per Taxonomy §8), and the
 * social links (set + real URLs per FOOTER.socials in
 * src/content/copy.ts).
 *
 * Dark re-skin (Redesign Unit 02, docs/04-ux-spec.md v3.0): the
 * shared <Container> gives way to the full-width band on the hero
 * gutter rhythm (px-6 / sm:px-8 / lg:px-16) with the section-opening
 * top hairline; anchors and socials take the mono micro-label voice;
 * the mailto centerpiece becomes the system's gold link treatment at
 * display scale (§Color — links are gold, underlined). All hovers are
 * the 150ms micro-transition; hairlines come from the white alpha
 * ladder (/10). Server component — no interactivity beyond plain
 * anchors.
 *
 * Layout restructured (owner-supplied reference, 2026-08-04) — the
 * reference contributed structure only; every token, face and hover
 * here is still the system's:
 * - Identity band: brand lockup left, socials right, md:items-start.
 *   The socials move up out of the legal row, which is what gives the
 *   band a right-hand anchor and the closing row its calm.
 * - The mailto keeps its display-scale centerpiece slot between the
 *   bands — the reference has no equivalent, and demoting it would
 *   cost both the design system's one gold display link and the
 *   Business Rules 2.6 visibility the doc above names.
 * - Closing band: a 10-column grid on lg — legal line held in the
 *   left three columns, section anchors right-aligned across the
 *   remaining seven. Below lg the grid collapses to normal flow.
 *   The reference stacks a second right-hand row for legal links;
 *   this site has no privacy/terms pages, so that row is absent
 *   rather than filled with links that would 404.
 *
 * Both grid children carry an explicit lg:row-[1] — placing only the
 * columns would let sparse auto-placement push the legal line onto a
 * second row, since the anchors claim the cursor first.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  /** Shared mono micro-label treatment — anchors and socials alike. */
  const microLink =
    "inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-white/60 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <footer className="bg-ink text-white">
      <div className="px-6 py-16 sm:px-8 md:py-20 lg:px-16">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="#top"
            className="inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <BrandWordmark className="h-7 w-auto" />
          </a>
          <ul className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 md:mt-0">
            {FOOTER.socials.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className={microLink}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a
          href={`mailto:${SITE.email}`}
          className="mt-14 inline-block py-1.5 text-2xl font-medium tracking-tight text-gold underline underline-offset-8 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:text-4xl"
        >
          {SITE.email}
        </a>
        <div className="mt-14 border-t border-white/10 pt-8 lg:grid lg:grid-cols-10 lg:items-center">
          <nav aria-label={FOOTER.label} className="lg:col-[4/11] lg:row-[1]">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-1 lg:justify-end">
              {NAV.items.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className={microLink}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* white/55 (the mono-caption stop), not /40 — the legal line
              is real text and must clear WCAG AA contrast on ink. */}
          <p className="mt-6 font-mono text-xs tracking-[0.14em] text-white/55 lg:col-[1/4] lg:row-[1] lg:mt-0">
            © {year} {SITE.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
