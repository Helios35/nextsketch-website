# Concept One-Pager — NextSketch Website Rebuild
*Output of a brainstorm session. This is what Discovery prototypes and tests.*

**Date:** 2026-06-11 · **Status:** Concept locked — ready for prototype

---

## The problem
NextSketch's current site sells the old company: industrial design, hardware, Calendly "book a free chat" CTAs, and template SaaS pricing. The brand has repositioned — software products and agentic systems, idea to production, partner who stays — and the site actively contradicts that story. Every visitor who lands today gets the wrong company.

## Who has it
Three buyer profiles (per Messaging Kit): the founder with an unbuilt software idea, the SMB owner stuck at 70% on a stalled build, and the established SMB ready to embed agents. All non-technical or semi-technical, all burned-or-wary, all deciding from the website whether NextSketch is credible enough to start a conversation.

## The bet
A ready-to-move founder or SMB owner will complete a qualification modal — answering real questions before getting contact access — because the site convinces them NextSketch can take them from idea to production and stay, and the friction itself signals "this firm is serious."

## Why now
Brand repositioning is complete (Brand Philosophy + Messaging Kit v1.0, June 2026). Autonomous Whales is retired and folded in. Every day the old site stays up, it qualifies the wrong people and disqualifies the right ones.

## The riskiest assumption
**That a qualification modal increases lead quality without killing lead volume.** It replaces the conventional contact page (no Calendly, no generic form) — a visible email escape hatch is the only fallback. If the right buyers — especially the twice-burned SMB owner — abandon the modal AND skip the email, lead capture collapses. Friction-as-filter is the core conversion strategy; it has to hold.

## The cheapest test
Build the single-page prototype with the modal (placeholders for images/work). Put it in front of 3–5 people matching the buyer profiles. Watch them: do they reach the modal, open it, finish it? Walk-away signal: if a majority open the modal and abandon it — or say they'd email instead — the modal needs an escape hatch (visible email) or fewer questions before this ships.

## What would kill this
The strongest case against: portfolio-shaped credibility with no portfolio. The site keeps a "selected work" grid (placeholders) and testimonials, but the real software/agentic case studies don't exist yet and the existing testimonials praise *design* work by name. A skeptical, previously-burned buyer looking for proof may find a beautiful site with hollow proof sections — the exact "talkers, not builders" impression the brand forbids. Mitigation: the page itself must be the proof (interactive, product-like, fast), and testimonials/work must be curated or reframed before launch, not just dropped in.

## Decisions locked (this session)
Single scrolling page · no pricing section · no contact page — qualification modal is the primary lead path, **with a visible escape hatch (email address shown in/near the modal and footer)** so abandoners aren't lost · **existing testimonials will be rewritten** to fit the software/agentic positioning before launch — no design/hardware references carried over · testimonials + team kept, but team renders as "about me" (Nathan, solo) · work grid ships with placeholders, real assets during build · handwritten/sketch styling as accents only (annotations, underlines, arrows — never body or full headlines) · brand colors carried over from current nextsketch.com · stack must deploy on Vercel (Next.js) · copy sourced from Messaging Kit §05, CTA language rules enforced ("Start a Conversation" — never "Book a Call"/"Free")

## Parking lot
- Extract exact brand hex values from current site CSS during setup
- Newsletter (newsletter.nextsketch.com) — keep the subscribe link? Decide at scope lock
- Blog/articles section — current site has an empty one; cut or plan content later
- Modal question set — draft from Universal Qualifying Questions (Brand Philosophy §7)
- Animation inventory: scroll reveals, marquee, hover states — define at scope, not concept
- SEO carryover: current meta targets industrial design keywords; full meta rewrite needed
