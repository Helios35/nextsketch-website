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
 * **Imagery (owner-supplied, 2026-09-14): six renders, in this
 * order.** The owner set the hero: the three handhelds floating. The
 * slots below are laid out for those six, which is why this module
 * declares one fewer image block than the template's default rhythm.
 * Each frame's ratio is picked for its render (per-slot override):
 * the hero is `4/3` because the floating devices fill a near-square
 * frame and a `16/9` crop would take the top device's head off; the
 * two pairs are `1/1` because all four are square or near-square
 * compositions with the subject centred; the closing full-width is
 * the default `16/9`, the one landscape composite. The files land at
 * `/public/work/mascot/mascot-0<n>.<ext>` in page order; until they
 * do, `src` is absent and every frame renders the placeholder with
 * the real image's `alt`.
 *
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
  /* mascot-01: the three handhelds floating (owner: the top image). */
  hero: {
    ratio: "4/3",
    alt: "Three Mascot handhelds floating against a pale blue background: a green one showing a game, a blue one showing the home screen, and a white one turned to show its camera.",
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
    /* mascot-02 and mascot-03: the handheld beside the parent's phone. */
    {
      type: "pair",
      images: [
        {
          ratio: "1/1",
          alt: "The blue Mascot handheld showing an incoming call from a parent, beside a parent's phone showing the child's live location on a map and a push-to-talk bar.",
        },
        {
          ratio: "1/1",
          alt: "The blue Mascot handheld on its home screen, beside a parent's phone showing the Templates and Learn cards.",
        },
      ],
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
    /* mascot-04 and mascot-05: the labelled hardware and the app screens. */
    {
      type: "pair",
      images: [
        {
          ratio: "1/1",
          alt: "The blue Mascot handheld from the front with its controls labelled: silence, power, volume, push to talk, SOS button, game pad joystick, game pad buttons and front speaker.",
        },
        {
          ratio: "1/1",
          alt: "Three parent app screens on a dark purple background: Templates and Learn cards, a live location map above an activity summary, and a recent activity timeline with a question typed to the mascot.",
        },
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
    /* mascot-06: the hardware detail composite. */
    {
      type: "image",
      image: {
        alt: "Two close views of the blue Mascot handheld: its side edge with the orange push-to-talk button, and its lower face with the joystick, the red SOS button, two game pad buttons and the speaker grille.",
      },
    },
  ],
} as const satisfies CaseStudy;
