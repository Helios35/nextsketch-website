import { PlusIcon } from "@/components/plus-icon";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { FAQ } from "@/content/copy";
import { FAQ_ITEMS } from "@/content/faq";

/**
 * FAQ (#faq) — objection handling (docs/03-site-architecture.md
 * row 10): the six Q&As verbatim. Accordion per docs/04-ux-spec.md
 * §Component specs — hairline dividers, plus→minus rotation, one open
 * at a time — on the same native <details name> exclusive-accordion
 * pattern as Process (build-notes 03: reuse, don't fork). Works
 * without JS (Business Rules E3): every answer stays openable JS-free.
 * Heading sits left of the list per the reference layout's two-column
 * rhythm; all items start closed so the questions scan as a list.
 */
export function FaqSection() {
  return (
    <div className="grid gap-10 py-24 md:py-32 lg:grid-cols-[1fr_2fr] lg:gap-16">
      <Reveal>
        <SectionHeading>{FAQ.headline}</SectionHeading>
      </Reveal>
      <div>
        {FAQ_ITEMS.map((item) => (
          <Reveal key={item.question}>
            <details
              name="faq-item"
              className="group border-t border-ink/10 last:border-b"
            >
              <summary className="flex cursor-pointer list-none items-baseline gap-5 py-5 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:gap-8 md:py-6 [&::-webkit-details-marker]:hidden">
                <span className="grow text-lg font-semibold tracking-tight md:text-xl">
                  {item.question}
                </span>
                <PlusIcon />
              </summary>
              <p className="max-w-prose pb-6 text-base leading-relaxed text-ink/80 md:pb-8 md:text-lg">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
