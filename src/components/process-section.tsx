import { PlusIcon } from "@/components/plus-icon";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { PROCESS } from "@/content/copy";

/**
 * Process (#process) — the interactive centerpiece
 * (docs/04-ux-spec.md §Component specs): four rows, one open at a
 * time, Strategy open by default, the open phase's number circled in
 * its accent. Built on native <details name> exclusive accordions —
 * works without JS (Business Rules E3), keyboard-accessible by
 * default, and needs no animation primitive beyond the existing
 * <SketchAccent> draw-on (the circle mounts visible when its row
 * opens, which is when the viewport trigger fires). Desktop rows and
 * the mobile accordion are the same control at different type scales.
 */
export function ProcessSection() {
  return (
    <div className="py-24 md:py-32">
      <Reveal>
        <SectionHeading className="max-w-4xl">{PROCESS.headline}</SectionHeading>
      </Reveal>
      <div className="mt-14 md:mt-20">
        {PROCESS.phases.map((phase, i) => (
          <Reveal key={phase.slug}>
            <details
              name="process-phase"
              open={i === 0}
              className="group border-t border-ink/10 last:border-b"
            >
              <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:gap-8 md:py-8 [&::-webkit-details-marker]:hidden">
                <span className="relative inline-flex w-10 shrink-0 justify-center text-sm font-semibold tracking-widest text-ink/60 md:w-14 md:text-base">
                  {phase.order}
                  <SketchAccent
                    variant="circle"
                    accent={phase.accent}
                    strokeWidth={8}
                    className="pointer-events-none absolute top-1/2 left-1/2 hidden h-auto w-14 -translate-x-1/2 -translate-y-1/2 group-open:block md:w-18"
                  />
                </span>
                <span className="grow text-2xl font-semibold tracking-tight md:text-4xl">
                  {phase.name}
                </span>
                <PlusIcon />
              </summary>
              <div className="pb-8 pl-15 md:pb-10 md:pl-22">
                <p className="max-w-prose text-base leading-relaxed text-ink/80 md:text-lg">
                  {phase.description}
                </p>
                {phase.slug === "validate" && (
                  <p className="mt-5 flex items-end gap-3 font-hand text-2xl text-rose-ink">
                    <span>{PROCESS.annotation}</span>
                    <SketchAccent
                      variant="arrow"
                      accent="rose"
                      strokeWidth={5}
                      className="h-auto w-8 -scale-y-100"
                    />
                  </p>
                )}
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
