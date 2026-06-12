import { ModalTrigger } from "@/components/modal-trigger";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { FINAL_CTA } from "@/content/copy";

/**
 * Final CTA (#start) — convert (docs/03-site-architecture.md row 11).
 * A full-bleed ink band (unit 08 band variant; the contained panel of
 * unit 05 deviation 6 is revisited the same way as About) that runs
 * straight into the ink footer — the page's dark closing run, at
 * statement scale. The margin arrow pointing at the CTA is an
 * explicitly licensed sketch placement (docs/04-ux-spec.md §Sketch
 * accent system).
 *
 * The button opens the qualification modal via <ModalTrigger>,
 * which degrades to the mailto escape hatch without JS — the E3
 * path that was this CTA's interim behavior in unit 05.
 */
export function FinalCtaSection() {
  return (
    <div className="py-28 md:py-40">
      <Reveal>
        <SectionHeading size="statement" className="max-w-3xl">
          {FINAL_CTA.headline}
        </SectionHeading>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
          {FINAL_CTA.body}
        </p>
        <div className="mt-12 flex items-center gap-4">
          <ModalTrigger variant="inverse">{FINAL_CTA.cta}</ModalTrigger>
          <SketchAccent
            variant="arrow"
            accent="gold"
            strokeWidth={5}
            className="hidden h-auto w-10 -scale-x-100 self-start md:block"
          />
        </div>
      </Reveal>
    </div>
  );
}
