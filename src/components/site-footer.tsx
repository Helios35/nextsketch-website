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
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="px-6 py-16 sm:px-8 md:py-20 lg:px-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <a
            href="#top"
            className="inline-flex min-h-11 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <BrandWordmark className="h-7 w-auto" />
          </a>
          <nav aria-label={FOOTER.label}>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-1">
              {NAV.items.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-white/60 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <a
          href={`mailto:${SITE.email}`}
          className="mt-14 inline-block py-1.5 text-2xl font-medium tracking-tight text-gold underline underline-offset-8 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:text-4xl"
        >
          {SITE.email}
        </a>
        <div className="mt-14 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          {/* white/55 (the mono-caption stop), not /40 — the legal line
              is real text and must clear WCAG AA contrast on ink. */}
          <p className="font-mono text-xs tracking-[0.14em] text-white/55">
            © {year} {SITE.legalName}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {FOOTER.socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.14em] text-white/60 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
