import { Container } from "@/components/container";
import { FOOTER, NAV, SITE } from "@/content/copy";

/**
 * Site footer per docs/03-site-architecture.md §Navigation: the same
 * anchors as the nav, the visible mailto escape hatch (Business
 * Rules 2.6), the legal line (casing per Taxonomy §8), and the three
 * social links per docs/decision-log.md #4 (placeholder hrefs; real
 * URLs owner-owed before launch).
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    // border-t articulates the footer inside the dark closing run
    // (#start band → footer, unit 08).
    <footer className="border-t border-white/10 bg-ink text-white">
      <Container className="py-16 md:py-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-baseline">
          <a href="#top" className="text-lg font-bold tracking-tight">
            {SITE.name}
          </a>
          <nav aria-label={FOOTER.label}>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {NAV.items.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
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
          className="mt-14 inline-block text-2xl font-semibold tracking-tight underline-offset-8 hover:underline md:text-4xl"
        >
          {SITE.email}
        </a>
        <div className="mt-14 flex flex-col justify-between gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center">
          <p className="text-sm text-white/60">
            © {year} {SITE.legalName}
          </p>
          <ul className="flex gap-6">
            {FOOTER.socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
