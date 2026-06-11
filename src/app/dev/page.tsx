import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Placeholder } from "@/components/placeholder";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SketchAccent } from "@/components/sketch-accent";
import { FINAL_CTA, HERO, MANIFESTO, PROCESS } from "@/content/copy";
import { FAQ_ITEMS } from "@/content/faq";
import { MODAL_QUESTIONS } from "@/content/modal";
import { SERVICES } from "@/content/services";
import { ACCENT_NAMES, type AccentName } from "@/lib/types";

// Tailwind compiles class literals only — accent classes must be static.
const ACCENT_BG: Record<AccentName, string> = {
  gold: "bg-gold",
  lavender: "bg-lavender",
  rose: "bg-rose",
  sage: "bg-sage",
};
const ACCENT_TEXT: Record<AccentName, string> = {
  gold: "text-gold-ink",
  lavender: "text-lavender-ink",
  rose: "text-rose-ink",
  sage: "text-sage-ink",
};

/**
 * SCRATCH PAGE — primitives gallery for visual verification only.
 * Deleted before merge (briefs/01-kickoff-foundation.md §Definition
 * of Done). Not linked from anywhere.
 */
export default function DevGallery() {
  return (
    <main className="flex flex-col gap-20 py-20">
      <Container>
        <SectionHeading eyebrow="Tokens" as="h1">
          Color tokens
        </SectionHeading>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {ACCENT_NAMES.map((accent) => (
            <div key={accent} className={`rounded-lg p-6 ${ACCENT_BG[accent]}`}>
              <p className={`font-medium ${ACCENT_TEXT[accent]}`}>{accent}</p>
              <p className={`font-hand text-2xl ${ACCENT_TEXT[accent]}`}>
                paired ink text
              </p>
            </div>
          ))}
          <div className="rounded-lg bg-paper-bright p-6">
            <p>paper-bright</p>
          </div>
          <div className="rounded-lg bg-ink p-6">
            <p className="text-white">ink / white</p>
          </div>
        </div>
      </Container>

      <Container>
        <SectionHeading eyebrow="Primitives">Buttons</SectionHeading>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button>{HERO.cta}</Button>
          <Button variant="secondary" href="#top">
            {FINAL_CTA.cta}
          </Button>
        </div>
      </Container>

      <Container>
        <SectionHeading eyebrow="Primitives">Sketch accents</SectionHeading>
        <div className="mt-8 grid grid-cols-2 gap-10 md:grid-cols-4">
          {ACCENT_NAMES.map((accent) => (
            <div key={accent} className="flex flex-col gap-6">
              <SketchAccent variant="underline" accent={accent} className="w-40" />
              <SketchAccent variant="circle" accent={accent} className="w-40" />
              <SketchAccent variant="arrow" accent={accent} className="w-20" />
            </div>
          ))}
        </div>
        <p className="mt-6 font-hand text-2xl text-ink/70">
          {PROCESS.headline}
        </p>
      </Container>

      <Container>
        <SectionHeading eyebrow="Primitives">Placeholders</SectionHeading>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Placeholder section="work" index={1} />
          <Placeholder section="work" index={2} ratio="4/3" />
          <Placeholder section="about" index={1} ratio="3/4" className="max-w-60" />
        </div>
      </Container>

      <Container>
        <SectionHeading eyebrow="Motion">Reveal + content constants</SectionHeading>
        <div className="mt-8 flex flex-col gap-10">
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed">
              {HERO.subheadline}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-lg leading-relaxed">
              {MANIFESTO.headline}
            </p>
          </Reveal>
          {PROCESS.phases.map((phase, i) => (
            <Reveal key={phase.slug} delay={i * 0.05}>
              <div
                className={`max-w-2xl rounded-lg p-6 ${ACCENT_BG[phase.accent]}`}
              >
                <p className={`font-bold ${ACCENT_TEXT[phase.accent]}`}>
                  {phase.order} — {phase.name}
                </p>
                <p className={`mt-2 ${ACCENT_TEXT[phase.accent]}`}>
                  {phase.description}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal>
            <div className="max-w-2xl">
              <p className="font-bold">{SERVICES[0].name}</p>
              <p className="mt-1">{SERVICES[0].description}</p>
              <p className="mt-4 font-bold">{FAQ_ITEMS[0].question}</p>
              <p className="mt-1">{FAQ_ITEMS[0].answer}</p>
              <p className="mt-4 font-bold">
                {MODAL_QUESTIONS.project_type.question}
              </p>
              <ul className="mt-1 list-disc pl-5">
                {MODAL_QUESTIONS.project_type.options.map((option) => (
                  <li key={option.value}>{option.label}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
