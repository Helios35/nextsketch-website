import { ModalTrigger } from "@/components/modal-trigger";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { FINAL_CTA } from "@/content/copy";

/**
 * Final CTA (#start) — convert (docs/03-site-architecture.md row 11).
 * The closing ink panel, contained like the About panel so the shared
 * page frame stays untouched. The margin arrow pointing at the CTA is
 * an explicitly licensed sketch placement (docs/04-ux-spec.md §Sketch
 * accent system).
 *
 * The button opens the qualification modal via <ModalTrigger>,
 * which degrades to the mailto escape hatch without JS — the E3
 * path that was this CTA's interim behavior in unit 05.
 */
export function FinalCtaSection() {
  return (
    <div className="py-24 md:py-32">
      <Reveal>
        <div className="rounded-3xl bg-ink px-8 py-14 text-white md:p-20">
          <SectionHeading className="max-w-3xl">
            {FINAL_CTA.headline}
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {FINAL_CTA.body}
          </p>
          <div className="mt-10 flex items-center gap-4">
            <ModalTrigger variant="inverse">{FINAL_CTA.cta}</ModalTrigger>
            <SketchAccent
              variant="arrow"
              accent="gold"
              strokeWidth={5}
              className="hidden h-auto w-10 -scale-x-100 self-start md:block"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
