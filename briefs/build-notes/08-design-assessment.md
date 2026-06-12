# Design Assessment — Why the Site Reads Flat, and the Direction to Fix It

**Unit:** 08 design-followup · **Date:** 2026-06-12 · **Brief:** `briefs/08-design-followup.md`
**Written for:** Nate. This is the diagnosis the brief asked for — plain language first, designer vocabulary introduced as it's needed, so the next time something feels off you have words for it.

---

## The verdict in one paragraph

The site isn't badly designed — it's *undesigned in one specific dimension*. Sprint 01 built the skeleton (structure, type scale, color tokens, motion rules) and built it correctly. What never got built is the **atmosphere**: everything that sits *behind and around* the content. Every one of the ten sections sits on the same uninterrupted gray-green field (`paper`, #E5E6E1) with black text on top of it. There are no shadows, no texture, no tonal shifts between sections, no imagery, and the brand's four accent colors are nearly absent. The result is what designers call a **flat value structure** — if you squint at the page, it's one continuous tone from top to bottom. Nothing recedes, so nothing advances. That's the feeling you couldn't name: not "bad," but **airless**. A premium page has *depth of field* — surfaces that feel near, far, lit, and material. Ours has a single plane.

## Why this is a positioning failure, not just an aesthetic one

The reference layout you picked (the PIXOR-style image) gets its life from three things: **photography doing the heavy lifting**, **sections that alternate tone** (light band, white band, dark band), and **dense editorial structure**. Sprint 01 carried over its *layout bones* — the asymmetric work grid, the two-column FAQ, the dark closing run — but none of those three life-givers. Photography was deliberately deferred (honest placeholders), and nothing was put in its place. So the page is a stage with the sets struck: the blocking is right, but it reads as a rehearsal, not a performance. For a firm whose pitch is "the site itself is proof of build quality," rehearsal-grade is a positioning miss.

## Section by section — what's specifically flat

| Section | What I saw on the live build |
|---|---|
| **Hero** | A wall of empty paper. Giant black Inter headline, gray subcopy, one black pill, one thin gold squiggle. Nothing behind the type — no texture, no light, no environment. The brand is paper/ink/**sketch**, and there is no sketch anywhere in the atmosphere. The stat strip is four numbers floating over a single hairline. |
| **Manifesto** | Typographically sound (statement + offset columns — the editorial rhythm is genuinely good) but it floats in the same unbroken field as the hero, so the eye registers "more of the same" instead of "new movement." |
| **Process** | The strongest section (real interaction, the circled number, the handwritten note) — but it's drawn entirely in hairlines on the same paper. The "interactive centerpiece" has the same visual weight as the FAQ. |
| **Selected work** | The weakest screen on the page. The accent tints are at 20% opacity over paper — they read as four near-identical pale gray boxes. The hatching is almost invisible. This is 40% of the proof zone reading as *unfinished wireframe* rather than *art-directed placeholder*. |
| **Services** | The one full-color moment, and it shows — this section already works. But the cards are flat fills with no shadow, so even at full accent they feel like colored rectangles, not surfaces. |
| **About** | The ink panel gives real contrast (good), but inside it: a pale empty box where a portrait should be. The darkest, most personal section of the page centers a void. |
| **Testimonials** | Two near-white cards on paper — #F3F3F3 on #E5E6E1 is a 4% difference; the cards barely separate from the background. |
| **Fit / FAQ** | Competent and quiet — fine in isolation, but by this point the page has repeated the identical pattern (headline left, content below, hairlines) seven times. |
| **Final CTA** | The ink panel works, the arrow annotation works. But it's the same rounded rectangle as About, so the close has no escalation. |

## The five root causes (the vocabulary)

1. **No tonal structure.** Premium pages alternate *bands* of value — light, lighter, dark — so scrolling feels like moving through rooms. Ours is one room, ten meters long. (The two ink panels help, but they're contained cards floating in paper, not rooms you enter.)
2. **No depth cues.** There is not a single shadow on the page. Every surface is a 1px hairline or a flat fill, so nothing sits *above* anything else. Depth is the cheapest "expensive" signal there is — paper that casts a soft shadow reads as material; paper that doesn't reads as a mockup.
3. **No texture.** The brand says *paper*, but the background is a flat hex value — digital gray, not paper. Real paper has grain. A drawing sheet has a grid. This is the brand's largest unclaimed asset: the site is named after a *sketch* and contains almost no evidence of drawing.
4. **Accent starvation.** The spec's rule is "≥80% of any viewport stays neutral" — the build is running at ~98%. The four accents (gold, lavender, rose, sage) appear at full strength exactly once (services). Everywhere else they're at 20% opacity or confined to 3px strokes.
5. **Uniform motion.** Everything that moves does the identical 12px rise-and-fade. Uniform motion stops registering after the second section — it's polite to the point of invisibility. (The sketch draw-ons are the exception — they have character — but they're small and rare.)

## The direction: **"The Working Drawing"**

One idea, applied everywhere: **the page is a sheet from NextSketch's own drawing set.** Not a metaphor pasted on top — the brand already *is* paper, ink, and sketch; the name itself is a drawing term. The fix is to let the page behave like the material it's named after. Concretely:

1. **Paper that behaves like paper.** A faint drafting grid (graph-paper lines in ink at ~4%) behind the hero and the dark bands, fading out as you scroll into the content; a near-invisible grain over the whole page so the background reads as *stock*, not as a hex value. Both are tonal extensions of existing tokens — no new hues.
2. **Tonal bands — rooms to move through.** Process moves onto a full-bleed `paper-bright` band (a clean white sheet laid on the desk). About and the Final CTA become true full-bleed ink bands (revisiting the contained-panel call from build-notes 04, exactly as that note anticipated — done via a Container variant, no overflow hacks). The page now scrolls: gridded paper → paper → white sheet → paper → ink room → paper → ink close into the footer's dark run.
3. **Depth — a sheet-shadow system.** One consistent soft shadow scale ("sheets resting on a desk," not app-style elevation) applied to the cards, tiles, and the modal. Hovers lift the sheet and bloom the shadow.
4. **The work tiles become pinned sheets.** Each placeholder tile becomes a sheet of drawing paper — slightly rotated, shadow-cast, carrying an actual **sketch**: hand-drawn product wireframes (a browser frame, an app flow, an agent graph, a dashboard) in the tile's accent. Clearly placeholder — no project names, no outcomes, the "Case study — coming in build" label stays — but now they convey *the firm draws before it builds*. The About portrait gets the same treatment: a contour line-drawing portrait on a pinned sheet, obviously a sketch, swapped for photography by file name when it exists.
5. **The stat strip becomes a title block.** Engineering drawings carry a boxed title block — a ruled grid of values and labels. The stat strip gets exactly that treatment: hairline-boxed cells, big tabular numerals, small tracked-out labels. The placeholder `00`s stop looking unfinished and start looking like a document awaiting its revision stamp — which is the literal truth.
6. **Motion with hierarchy.** The reveal curve gets a longer, softer ease (the current one is functional; the new one settles like paper landing). The accordion opens get a real (motion-gated) expansion. A hairline gold progress stroke draws along the nav's bottom edge as you scroll — the page literally *draws itself* as you read it. Everything stays behind the existing motion-safe gates; reduced-motion users get the full composed page, static.

### What this direction is *not*

- Not a new palette — every color on the page after this unit is an existing token or a tint/translucency of one.
- Not borrowed minimalism — the grid, the pinned sheets, the title block, and the hand-drawn placeholder art are NextSketch's own vocabulary (sketch/draft/build), not an agency-template skin.
- Not louder copy or new sections — copy and structure are untouched by contract.

## What success looks like

Open the preview cold. Within three seconds the page should answer "do these people sweat details?" with yes — texture you can feel, surfaces that sit at different depths, color that earns its placements, sketches that prove the name. Scroll once: the page should pass through distinct rooms and close in a confident dark run. Switch on reduced motion: the same composed page, still. The placeholders should look *art-directed and waiting for assets*, not absent.

## Judgment calls being exercised (delegated taste, flagged honestly)

- **Full-bleed bands** — revisits build-notes 04 deviation 3 via a `Container` variant; this unit is the owner-initiated "revisit" that note reserved.
- **Placeholder sketch art as real SVG files** in `/public/placeholders/` per Taxonomy §7 naming — swap procedure unchanged (note: real assets arriving as `.jpg`/`.webp` change the file extension; one-line code touch at handoff, flagged in build-notes).
- **Reveal curve/distance change** (12px/500ms → 16px/600ms, softer ease) — a deviation from the UX spec's motion inventory; the spec is updated to as-built in this unit per the brief.
- **No new dependencies, no new hues.** If any moment genuinely demands a new hue, it comes back to you as a question instead of shipping.
