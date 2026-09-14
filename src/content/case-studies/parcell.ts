import type { CaseStudy } from "@/lib/types";

/**
 * Parcell — the fourth card and tile, and the fourth case study
 * rendered by the template (decision-log #42).
 *
 * Name, link and screenshot are the owner's (2026-08-24); the summary
 * is DRAFT pending approval. One module per case study (#41).
 *
 * **Everything below `description` is DRAFT starter copy**, written
 * 2026-09-14 at the owner's direction on the reference page's
 * structure, grounded in the one known screenshot (two phones: the
 * sign-in screen and the browsing grid) and the summary. No client,
 * no numbers, no results (Rule 4.3); intent written as intent. The
 * owner edits it here and nowhere else. Every image slot is a
 * placeholder until imagery arrives; each `alt` describes what the
 * real image should show. `slug` is the published title slugified
 * (Taxonomy §8, §6); `title` and `description` are DRAFT metadata.
 */
export const PARCELL = {
  slug: "parcell",
  id: "work-04",
  name: "Parcell",
  summary: "A mobile app for discovering and collecting digital art.",
  sourceHref: "https://www.behance.net/gallery/176762755/Parcell",
  image: "/work/work-04.webp",
  alt: "Two phones showing a digital art app's sign-in screen and its browsing grid.",
  title: "Parcell | NextSketch",
  description:
    "Parcell: a mobile app for discovering and collecting digital art. Selected work from NextSketch.",
  intro:
    "A mobile app for discovering and collecting digital art, designed and built by NextSketch.",
  need: "new_product",
  meta: [
    { label: "Industry", value: "Digital art" },
    { label: "Scope", value: "Design and build" },
    { label: "Platform", value: "Mobile" },
  ],
  hero: {
    alt: "Two phones showing the sign-in screen and the browsing grid of digital artworks.",
  },
  blocks: [
    {
      type: "text",
      label: "The challenge",
      statement:
        "On a phone a piece of art gets a small screen, a fast scroll and very little time to register.",
      body: [
        "Discovery is the whole product. The grid had to show a lot of work without turning into noise, and sign-in had to be over before a collector lost interest.",
      ],
    },
    {
      type: "pair",
      images: [
        { alt: "The sign-in screen on a phone." },
        { alt: "The browsing grid of digital artworks on a phone." },
      ],
    },
    {
      type: "image",
      image: { alt: "The browsing grid filling the frame with artwork tiles." },
    },
    {
      type: "text",
      label: "The goal",
      statement:
        "The goal was an app that puts browsing first, so a collector's attention goes to the art and not to the app.",
      body: [
        "The interface around each artwork had to stay quiet, so the piece is what a person looks at, not the controls beside it. On a phone that means restraint: few elements per screen, and the grid given most of the space.",
      ],
    },
    {
      type: "pair",
      images: [
        { alt: "The sign-in form." },
        { alt: "A single artwork tile in the browsing grid." },
      ],
    },
    {
      type: "text",
      label: "What we built",
      statement:
        "NextSketch designed and built every screen, from the sign-in flow to the browsing grid where the collecting happens.",
      body: [
        "Sign-in is short and direct. The grid does most of the work: each artwork gets room to be seen, with consistent spacing and image handling from one piece to the next.",
      ],
    },
    {
      type: "image",
      image: { alt: "A phone showing the browsing grid at full height." },
    },
  ],
} as const satisfies CaseStudy;
