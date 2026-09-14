import type { CaseStudy } from "@/lib/types";

/**
 * Agentic Platform — the third card and tile, and the third case
 * study rendered by the template (decision-log #42).
 *
 * Name, link and screenshot are the owner's (2026-08-24); the summary
 * is DRAFT pending approval. `name` is the Behance title, not the
 * product name inside the screenshot, for the reason `saas-platform.ts`
 * records. One module per case study (#41).
 *
 * The screenshot takes the base grade despite reading as dark: it is
 * bimodal — a near-black app inside a light grey canvas — and lifting
 * it blows the canvas out (build-note 20). No `tone` on purpose.
 *
 * **Everything below `description` is DRAFT starter copy**, written
 * 2026-09-14 at the owner's direction on the reference page's
 * structure, grounded in the one known screenshot (a dark 3D CAD
 * workspace with a gear model beside an AI assistant panel) and the
 * summary. It is software, and the copy says so: nothing here reads
 * as the retired physical-product service line (Rule 3.4). No client,
 * no numbers, no results (Rule 4.3); intent written as intent. The
 * owner edits it here and nowhere else. Every image slot is a
 * placeholder until imagery arrives; each `alt` describes what the
 * real image should show. `slug` is the published title slugified
 * (Taxonomy §8, §6); `title` and `description` are DRAFT metadata.
 */
export const AGENTIC_PLATFORM = {
  slug: "agentic-platform",
  id: "work-03",
  name: "Agentic Platform",
  summary: "A CAD tool where an embedded agent drafts parts.",
  sourceHref: "https://www.behance.net/gallery/226572695/Agentic-Platform",
  image: "/work/work-03.webp",
  alt: "A laptop showing a dark 3D CAD workspace with a gear model beside an AI assistant panel.",
  title: "Agentic Platform | NextSketch",
  description:
    "Agentic Platform: a CAD tool where an embedded agent drafts parts. Selected work from NextSketch.",
  intro:
    "A desktop CAD tool where an embedded agent drafts parts from what the user describes, inside the workspace itself.",
  need: "agentic",
  meta: [
    { label: "Industry", value: "CAD software" },
    { label: "Scope", value: "Design and build" },
    { label: "Platform", badges: ["agentic-platform"] },
  ],
  hero: {
    alt: "The dark 3D CAD workspace with a gear model beside the AI assistant panel.",
  },
  blocks: [
    {
      type: "text",
      label: "The challenge",
      statement:
        "Drafting a part means turning intent into modeling steps, and an agent bolted on as a separate chat window sits outside that work.",
      body: [
        "A separate window splits the job: the request lives in the chat, the result in the model, and nothing shows what changed. The agent had to work where the modeling happens.",
      ],
    },
    {
      type: "pair",
      images: [
        {
          alt: "The assistant panel with a request typed in, beside the gear model.",
        },
        { alt: "The gear model in the modeling workspace." },
      ],
    },
    {
      type: "image",
      image: {
        alt: "The full interface: the gear model in the workspace and the assistant panel to its side.",
      },
    },
    {
      type: "text",
      label: "The goal",
      statement:
        "The goal was a workspace where the user says what they want and the agent drafts the part in the same view.",
      body: [
        "The model had to stay primary. The agent could not cover it or pull the work into another screen, and the user needed a way to step in at any point.",
      ],
    },
    {
      type: "pair",
      images: [
        { alt: "The assistant panel with a request and the agent's reply." },
        { alt: "The gear model centered in the model view." },
      ],
    },
    {
      type: "text",
      label: "What we built",
      statement:
        "We designed and built every screen: a dark 3D modeling workspace with the model at its center and an assistant panel docked beside it.",
      body: [
        "The panel holds the request and the agent's reply beside the model, so the exchange and the result share one screen. The dark palette keeps the geometry in front, and the model view never gives up the center.",
      ],
    },
    {
      type: "image",
      image: {
        alt: "The CAD interface at full width, the model and the assistant panel side by side.",
      },
    },
  ],
} as const satisfies CaseStudy;
