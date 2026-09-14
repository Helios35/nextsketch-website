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
 * **Imagery (owner-supplied, 2026-09-14): six renders from the
 * project's portfolio folder, in this order.** The owner set both ends:
 * the laptop render is the hero and the interface overview ("UI
 * Intro") is the last image. Between them, the two workflow diagrams
 * as a pair and two workspace states full-width. Six of the folder's
 * twelve: the intro board repeats the hero's laptop under a title, and
 * five of the six workspace states differ only by which panel is open,
 * so one of each ships and the rest are a `src` swap away. **The
 * frames keep the template's ratios and the renders crop to them**
 * (owner rule: the image adjusts to the container, never the container
 * to the image): `16/9` for the hero, the full-width states and the
 * closing overview, `4/3` for the pair, `object-cover` centring each.
 * The 2:1 workspace shots sit in the `16/9` slots, where they lose a
 * sliver of width, rather than in the pair, where they would lose
 * their side panels. The files live at
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
  /* agentic-platform-01: the laptop render (owner: the hero). */
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
    /* agentic-platform-02 and -03: the two workflow diagrams. */
    {
      type: "pair",
      images: [
        {
          src: "/work/agentic-platform/agentic-platform-02.png",
          alt: "The AI workflow diagram: the user uploads a file and writes a prompt, the agent asks clarifying questions, the model converts the query to scripts and the CAD engine executes the commands.",
        },
        {
          src: "/work/agentic-platform/agentic-platform-03.png",
          alt: "The MVP process flow: the user answers questions, the model checks parts against the spec or converts the query to scripts, headless CAD executes them, and the user reviews, converts and exports the file.",
        },
      ],
    },
    /* agentic-platform-04: the workspace with the agent prompt open. */
    {
      type: "image",
      image: {
        src: "/work/agentic-platform/agentic-platform-04.png",
        alt: "The workspace with the Work Bench open on its AI tab: the prompt asks for a gear based on the uploaded document, with Define, Design and Analyze actions beneath it and the gear model in the center.",
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
    /* agentic-platform-05: the workspace with the properties open. */
    {
      type: "image",
      image: {
        src: "/work/agentic-platform/agentic-platform-05.png",
        alt: "The workspace with the Work Bench on its Properties tab, the gear's geometry expanded: volume, surface area, bounding box and geometric center beside the model.",
      },
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
    /* agentic-platform-06: the interface overview (owner: the last image). */
    {
      type: "image",
      image: {
        src: "/work/agentic-platform/agentic-platform-06.png",
        alt: "The interface overview: the empty workspace above the UI kit title, then the component sheet of toolbars, feature trees, history lists and Work Bench states.",
      },
    },
  ],
} as const satisfies CaseStudy;
