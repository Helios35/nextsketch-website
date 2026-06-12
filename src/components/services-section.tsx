import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { SERVICES, SERVICES_HEADLINE } from "@/content/services";
import type { AccentName } from "@/lib/types";

/**
 * Static accent→class map (Tailwind compiles literals only). Accent
 * background takes its paired -ink text — the pairing rule, binding
 * per docs/04-ux-spec.md §Color system.
 */
const CARD_CLASS: Record<AccentName, string> = {
  gold: "bg-gold text-gold-ink",
  lavender: "bg-lavender text-lavender-ink",
  rose: "bg-rose text-rose-ink",
  sage: "bg-sage text-sage-ink",
};

/**
 * Services (#services) — name the four engagements
 * (docs/03-site-architecture.md row 6). Four cards, each on its
 * Taxonomy §1 accent with paired ink text; copy verbatim from the
 * canonical SERVICES constants (Rule 4.1). Hover: subtle lift +
 * annotation arrow draws in the corner (UX spec §Component specs).
 */
export function ServicesSection() {
  return (
    <div className="py-24 md:py-32">
      <Reveal>
        <SectionHeading className="max-w-4xl">
          {SERVICES_HEADLINE}
        </SectionHeading>
      </Reveal>
      <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2">
        {SERVICES.map((service, i) => (
          <Reveal key={service.slug} delay={i * 0.1}>
            <div
              className={`group relative h-full rounded-2xl p-8 shadow-sheet hover:shadow-sheet-lg md:p-10 motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1.5 ${CARD_CLASS[service.accent]}`}
            >
              <h3 className="max-w-[85%] text-xl font-semibold tracking-tight md:text-2xl">
                {service.name}
              </h3>
              <p className="mt-4 max-w-prose leading-relaxed opacity-80 md:pb-8">
                {service.description}
              </p>
              <SketchAccent
                variant="arrow"
                accent={service.accent}
                tone="ink"
                drawOn="hover"
                strokeWidth={5}
                className="pointer-events-none absolute right-6 bottom-6 h-auto w-8"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
