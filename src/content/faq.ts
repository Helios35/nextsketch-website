import type { FaqItem } from "@/lib/types";

/** The six Q&As verbatim from Messaging Kit §05 (PRD F9). */
export const FAQ_ITEMS = [
  {
    question: "How is this different from any other dev shop?",
    answer:
      "Most dev shops build what you ask for without questioning whether it's the right thing to build. We validate first, build second. And we don't hand off — we stay with you after launch.",
  },
  {
    question: "Do you only build AI/agent products?",
    answer:
      "No. We build whatever the problem requires — traditional software, agentic systems, or a combination. We don't default to agents. We default to what works.",
  },
  {
    question: "What if we've already started building?",
    answer:
      "We handle rescues. We assess what's been built, validate the direction, and either get you to the finish line or help you make the call to restart.",
  },
  {
    question: "What does the ongoing partnership actually look like?",
    answer:
      "Retainer-based. We stay involved with the product — managing, iterating, and building what comes next. Scoped case-by-case based on what the product needs.",
  },
  {
    question: "Do you work with non-technical founders?",
    answer:
      "Yes. You don't need to understand how to build it. You need to understand the problem you're solving. We handle everything else.",
  },
  {
    question: "How do you price it?",
    answer:
      "Strategy and build are scoped upfront with defined deliverables. Ongoing partnership is retainer-based, scoped to what the product needs. No surprise invoices.",
  },
] as const satisfies readonly FaqItem[];
