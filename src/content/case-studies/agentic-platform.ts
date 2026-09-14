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
 * owner edits it here and nowhere else. `slug` is the published title
 * slugified (Taxonomy §8, §6); `title` and `description` are DRAFT
 * metadata.
 *
 * **Imagery (owner-supplied, 2026-09-14): the six files in the owner's
 * "Engen Case Study" folder, nothing else, in file order.** The owner
 * set both ends: `Hero.png` (the laptop) is the hero and `UI Intro.png`
 * is the last image. **The block layout is the template's default
 * rhythm and does not move for a study** (owner rule): hero, pair,
 * full-width, pair, full-width, seven frames. Six files fill six of
 * them; the middle full-width slot renders the placeholder until the
 * owner supplies a seventh image or says which slot goes. **The
 * frames keep the template's ratios and the renders crop to them**
 * (owner rule: the image adjusts to the container, never the
 * container to the image): `16/9` for the hero and the full-width
 * slots, `4/3` for the pairs, `object-cover` centring each. Files at
 * `/public/work/agentic-platform/agentic-platform-0<n>.png` in page
 * order, in the format the owner supplied, renamed kebab-case per
 * Taxonomy §8.
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
  /* agentic-platform-01, the owner's Hero.png: the laptop. */
  hero: {
    src: "/work/agentic-platform/agentic-platform-01.png",
    alt: "A laptop showing the CAD workspace: a gear model on a dark gridded canvas, the feature tree on the left and the Work Bench panel with the agent prompt on the right.",
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
    /* agentic-platform-02 and -03: UI Collapsed and UI Expanded 1. */
    {
      type: "pair",
      images: [
        {
          src: "/work/agentic-platform/agentic-platform-02.png",
          alt: "The empty workspace: a dark gridded canvas with the file chip, the toolbar, the account chip and a lone cube, every panel collapsed.",
        },
        {
          src: "/work/agentic-platform/agentic-platform-03.png",
          alt: "The workspace with the Work Bench open on its AI tab: the prompt asks for a gear based on the uploaded document, with Define, Design and Analyze actions beneath it.",
        },
      ],
    },
    /* The seventh frame: no seventh file in the owner's folder, so the
       placeholder holds the slot rather than the layout changing. */
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
    /* agentic-platform-04 and -05: UI Expanded 2 and UI Expanded 6. */
    {
      type: "pair",
      images: [
        {
          src: "/work/agentic-platform/agentic-platform-04.png",
          alt: "The workspace with the feature tree expanded to its sketches and the Work Bench on its AI tab, the gear model in the center.",
        },
        {
          src: "/work/agentic-platform/agentic-platform-05.png",
          alt: "The workspace with the History tab open, a chat message expanded to its feature list, and the Work Bench on its Properties tab showing the gear's geometry.",
        },
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
    /* agentic-platform-06, the owner's UI Intro.png: the last image. */
    {
      type: "image",
      image: {
        src: "/work/agentic-platform/agentic-platform-06.png",
        alt: "The interface overview: the empty workspace above the UI kit title, with the component sheet of toolbars, feature trees, history lists and the Work Bench beginning beneath.",
      },
    },
  ],
} as const satisfies CaseStudy;
