import { Placeholder } from "@/components/placeholder";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ABOUT } from "@/content/copy";

/**
 * About (#about) — the person behind it, solo
 * (docs/03-site-architecture.md row 7). An ink panel inside the
 * Container frame: the reference layout's dark about band, contained
 * rather than full-bleed so the shared page frame stays untouched
 * (judgment flagged in build-notes). Photo is a layout-final
 * placeholder — real photography is owner-owed at launch-readiness.
 */
export function AboutSection() {
  return (
    <div className="py-24 md:py-32">
      <Reveal>
        <div className="grid gap-10 rounded-3xl bg-ink px-8 py-12 text-white md:grid-cols-[3fr_2fr] md:gap-16 md:p-16">
          <div>
            <SectionHeading>{ABOUT.headline}</SectionHeading>
            <div className="mt-8 space-y-6">
              {ABOUT.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-prose text-lg leading-relaxed text-white/80"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <Placeholder
            section="about"
            index={1}
            ratio="3/4"
            className="self-center md:max-w-sm md:justify-self-end"
          />
        </div>
      </Reveal>
    </div>
  );
}
