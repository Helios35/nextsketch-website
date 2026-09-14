import type { CaseStudy } from "@/lib/types";

/**
 * Mascot — the first card in the rail and the first tile on `/work`,
 * and the first case study rendered by the template (decision-log
 * #42).
 *
 * Name, link and screenshot are the owner's (supplied 2026-08-24); the
 * summary is DRAFT pending approval (build-note 20). One module per
 * case study is the settled shape (#41): adding a study is adding a
 * file beside this one and a line in `index.ts`.
 *
 * **Everything below `description` is DRAFT starter copy**, written
 * 2026-09-14 at the owner's direction ("fill the content as needed")
 * on the reference page's structure — an intro, three detail rows,
 * then challenge / goal / what-we-built blocks between image frames.
 * It is grounded in the one known screenshot and the summary and
 * claims nothing beyond them: no client, no numbers, no results
 * (Rule 4.3). Intent is written as intent. The owner edits it here and
 * nowhere else.
 *
 * Every image slot is a placeholder until the owner supplies imagery
 * (`src` absent); each `alt` describes what the real image should
 * show, so the file lands into a frame that already announces it.
 * `slug` is the published title slugified (Taxonomy §8, §6). `title`
 * and `description` are the route's metadata; DRAFT.
 */
export const MASCOT = {
  slug: "mascot",
  id: "work-01",
  name: "Mascot",
  summary: "An AI companion device for kids, and the app parents run it.",
  sourceHref: "https://www.behance.net/gallery/197568297/Mascot",
  image: "/work/work-01.webp",
  alt: "A blue handheld kids device beside a phone showing its companion app, with mascot avatars and activity cards.",
  title: "Mascot | NextSketch",
  description:
    "Mascot: an AI companion device for kids, and the app parents run it. Selected work from NextSketch.",
  intro:
    "A handheld AI companion device for kids, and the mobile app parents use to run it.",
  need: "new_product",
  meta: [
    { label: "Industry", value: "Kids' consumer tech" },
    { label: "Scope", value: "Design and build" },
    { label: "Platform", badges: ["device", "mobile-app"] },
  ],
  hero: {
    alt: "A handheld kids device beside a phone showing its companion app, with mascot avatars and activity cards.",
  },
  blocks: [
    {
      type: "text",
      label: "The challenge",
      statement:
        "A companion device for kids has two people to serve: the child holding it and the parent who runs it from an app.",
      body: [
        "The child's side has to feel like play. The parent's side has to stay in charge without turning into a settings menu, where the choices that matter get buried.",
      ],
    },
    {
      type: "pair",
      images: [
        { alt: "The handheld device on its own." },
        {
          alt: "The companion app on a phone, open to the mascot avatars a child picks from.",
        },
      ],
    },
    {
      type: "image",
      image: { alt: "The mascot avatars in the companion app." },
    },
    {
      type: "text",
      label: "The goal",
      statement:
        "The goal was a parent app that gives a clear view and real control, and feels simple rather than technical.",
      body: [
        "Screens a parent can read at a glance and act on in the moment, and a place in the app that belongs to the child, not the parent. None of it should need explaining.",
      ],
    },
    {
      type: "pair",
      images: [
        { alt: "An activity card opened in the companion app." },
        { alt: "The parental controls screen in the companion app." },
      ],
    },
    {
      type: "text",
      label: "What we built",
      statement:
        "NextSketch designed and built every screen: the mascots a child picks from, the activity cards, and the parental controls that run the device.",
      body: [
        "The mascot picker is the child's. The activity cards and the controls are the parent's, laid out so a change is one look and one tap rather than a trip through settings.",
      ],
    },
    {
      type: "image",
      image: {
        alt: "A selection of the companion app's screens: the mascot picker, activity cards and parental controls.",
      },
    },
  ],
} as const satisfies CaseStudy;
