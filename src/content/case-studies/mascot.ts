import type {
  CaseStudy,
  CaseStudyPageContent,
  CaseStudyRender,
} from "@/lib/types";

/**
 * Mascot — the first card in the rail and the first tile on `/work`.
 *
 * Name, link and screenshot are the owner's (supplied 2026-08-24); the
 * summary is DRAFT, written from the linked project and pending
 * approval (build-note 20). Moved here from the `WORK_ITEMS` inventory
 * in `src/content/work.ts` unchanged — one module per case study is the
 * settled shape (decision-log #41), so adding a study is adding a file
 * beside this one and a line in `index.ts`.
 *
 * `slug` is the published title slugified (Taxonomy §8, §6). `title`
 * and `description` are the route's metadata in the `PRICING.title`
 * house form; both DRAFT.
 *
 * The study's page is `MASCOT_PAGE` below, registered in `index.ts`
 * (decision-log #43); this object stays the card, and nothing on it
 * changed.
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
} as const satisfies CaseStudy;

/**
 * The eight on-device screens are one render of one device with a
 * different screen each, so they share one visible box: measured from
 * the files' alpha channel (build-note 30), the device spans x 68–391
 * and y 49–533 of the 446×581 canvas. The handheld's features, for
 * the callouts below, were measured against this box.
 */
const SCREEN = {
  width: 446,
  height: 581,
  window: { x0: 68, y0: 49, x1: 391, y1: 533 },
} as const;

/** One of the eight screens, by its file. */
const screen = (file: string, alt: string): CaseStudyRender => ({
  src: `/work/mascot/${file}`,
  alt,
  ...SCREEN,
});

/**
 * Mascot's page (decision-log #43, 2026-09-18): the owner's own example
 * ("Case Study Mascot example.png", after the Volvo Cars App page he
 * supplied as inspiration), built on the design system. Imagery is the
 * owner's folder of 2026-09-18, ten of its thirteen files: the two
 * near-duplicate home screens (`Home Device-1/-2`) and the render with
 * the labels baked in (`Device Physical UX_words`) are not used; the
 * labels are rebuilt as callouts on the plain render, in the owner's
 * words. Files live at `/public/work/mascot/`, renamed kebab-case
 * (Taxonomy §8), byte-identical to the folder.
 *
 * **Everything written here is DRAFT** pending the owner's word, and
 * it claims nothing the approved facts and the renders do not show
 * (Rule 4.3): no client, no numbers, no results, no timeline. The
 * headline is the owner's own line. The statement beside the panel's
 * render is the ratified summary (omitted here, so the page reads it
 * from `MASCOT`), and the answer to his question is the proof band's
 * own line (omitted, so the page reads `WORK_INTRO`). The owner edits
 * copy here and nowhere else.
 *
 * **Resolution.** The image optimizer never enlarges a file, so the
 * three slots laid out wider than their files paint them stretched:
 * the hero pair (a 384px box paints the 446px canvas at 529 CSS px,
 * 1.2x at 1x, 2.4x at 2x), the mascot (223 CSS px from a 135px file)
 * and the hardware stage (a 376px box, 518 CSS px, 1.2x at 1x). Sharper
 * exports of `Home Device`, `Favorites Device` and `Robot` are owed
 * for them; every other render sits at or under its file's width at
 * 1x.
 */
export const MASCOT_PAGE = {
  /* The owner's own line ("Mascot Your Kid Friendly AI Driven
     Companion"), every word kept and nothing hyphenated (a hyphen in
     "AI-driven" stranded "AI-" at a line end on a phone), set in the
     site's sentence case with a full stop after the name and a comma.
     Reverting to his casing is a one-string change. The accent is one
     word, the promise the line lands on. */
  headline: "Mascot. Your kid friendly, AI driven companion.",
  accentPhrase: "companion",
  service: "new-product",
  badges: ["device", "mobile-app"],
  hero: {
    renders: [
      screen(
        "home-device.png",
        "The blue Mascot handheld on its home screen: the mascot ringed by icons for calls, photos, the map, the mascot, games, learning, favorites and the camera.",
      ),
      screen(
        "favorites-device.png",
        "The Mascot handheld on its Favorites screen: four family avatars in colored circles, one ringed in green.",
      ),
    ],
    /* The mascot render, placed so its head registers on the mascot
       drawn on the home screen (measured: the on-screen head sits at
       47.0% × 35.3% of the device box, the render's own head at
       39.4% × 35.4% of its canvas) at 58% of the device's width. */
    popout: {
      /* Decorative: it is the mascot the home screen's alt already
         describes, grown out of the screen, so it carries no alt of
         its own and reads to assistive tech as nothing. */
      render: {
        src: "/work/mascot/robot.png",
        alt: "",
        width: 135,
        height: 183,
      },
      left: 24.1,
      top: 16.7,
      width: 58,
    },
  },
  panel: {
    render: {
      src: "/work/mascot/device-and-phone-round-3.png",
      alt: "The Mascot handheld on a call with Mom, beside a parent's phone showing the child's location on a map, a dashed route and a push-to-talk bar.",
      width: 1318,
      height: 1237,
      window: { x0: 337, y0: 253, x1: 999, y1: 991 },
    },
    eyebrow: "The product",
    body: "The child talks to the mascot and to family from the handheld. The parent sees where the child is, and talks back, from the phone.",
    bullets: [
      "The handheld's screens: loading, home, favorites, a chat with the mascot, a face picker and push to talk.",
      "The parent app: the child's location on a map, push to talk, Templates and Learn cards, and a line to message the mascot.",
      "Push to talk at both ends: an orange button on the handheld's edge, a bar along the bottom of the phone.",
    ],
    question: {
      heading: "What did we do?",
      screens: [
        {
          render: screen(
            "loading-device.png",
            "The Mascot handheld loading, the mascot over the words Hold on a sec.",
          ),
          caption: "Loading",
        },
        {
          render: screen(
            "home-device.png",
            "The Mascot handheld on its home screen, the mascot in a ring of icons.",
          ),
          caption: "Home",
        },
        {
          render: screen(
            "favorites-device.png",
            "The Mascot handheld on its Favorites screen, four family avatars.",
          ),
          caption: "Favorites",
        },
        {
          render: screen(
            "mascot-ai-device.png",
            "The Mascot handheld in a chat with the mascot, with Hey and How are you as reply chips.",
          ),
          caption: "Mascot chat",
        },
        {
          render: screen(
            "mascot-edit-device.png",
            "The Mascot handheld on the face picker: a row of faces to choose from under the mascot, with arrows either side.",
          ),
          caption: "Face picker",
        },
        {
          render: screen(
            "ptt-device.png",
            "The Mascot handheld on a push-to-talk call with Mom: her avatar in a green ring over a waveform.",
          ),
          caption: "Push to talk",
        },
      ],
    },
  },
  hardware: {
    eyebrow: "The handheld",
    heading: "What the child holds",
    body: "Push to talk on the right edge, power and volume on the left, silence on top. Under the screen, a joystick, two game pad buttons, an SOS button and a speaker.",
    render: screen(
      "home-device.png",
      "The Mascot handheld from the front on its home screen.",
    ),
    /* Features measured on the device box: this array is the record
       (build-note 30 §The renders repeats the eight points). */
    annotations: [
      { label: "Silence", x: 31.8, y: 0.7, side: "top" },
      { label: "Power", x: 1.0, y: 28.7, side: "left" },
      { label: "Push to talk", x: 98.2, y: 28.5, side: "right" },
      { label: "Volume", x: 1.0, y: 66.1, side: "left" },
      { label: "Game pad joystick", x: 24.8, y: 80.1, side: "left" },
      { label: "SOS button", x: 56.5, y: 72.8, side: "right" },
      { label: "Game pad buttons", x: 81.4, y: 78.8, side: "right" },
      { label: "Front speaker", x: 65.8, y: 94.5, side: "bottom" },
    ],
    back: {
      render: {
        src: "/work/mascot/bcm-front-back-14.png",
        alt: "The Mascot handheld from the front and the back: a camera lens, a speaker grille, and the mascot and the Mascot name embossed in the blue shell.",
        width: 1318,
        height: 1224,
        window: { x0: 181, y0: 152, x1: 1106, y1: 1071 },
      },
      caption: "Front and back",
    },
  },
  closing: {
    eyebrow: "The parent app",
    heading: "What the parent runs",
    body: "The child's location on a map, push to talk, the Templates and Learn cards, and a line to message the mascot, all on the phone the parent already carries. Two screens, built to talk to each other.",
    render: {
      src: "/work/mascot/front-final-shot.png",
      alt: "The Mascot handheld beside a parent's phone showing the app: three child avatars, a Templates card, a Learn card and a Message Mascot line.",
      width: 1515,
      height: 1273,
      window: { x0: 305, y0: 159, x1: 1179, y1: 1107 },
    },
  },
} as const satisfies CaseStudyPageContent;
