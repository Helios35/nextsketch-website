/**
 * What the diagrams say: decision-log **#60** (the Ink Orbit diagram
 * language) and **#61** (visuals may carry labels, sample names, sample
 * numbers and generic tool names; supersedes #30's no-text rule and
 * Rule 4.3 as applied to visuals).
 *
 * **Everything here is inside a visual, and about NextSketch's work.**
 * The names, figures and tool names are samples of the jobs the site
 * describes, drawn the way the owner-supplied "Ink Orbit Features"
 * reference draws its own (labels, sample people, sample numbers). None
 * of it is a claim about a client, a result or an integration, and
 * nothing outside the visuals reads from this file: site copy still
 * states only real facts (Rule 4.3). The reference's own sample content
 * (its placeholder brand, its sample copy) does not ship.
 *
 * **DRAFT, builder-written (2026-10-15), for Nate's review.** No
 * caption outside a visual reads from here, so editing a string moves
 * nothing but the diagram it sits in.
 *
 * `label` on each diagram is what assistive tech hears: the diagram's
 * root is `role="img"` (or `role="group"` where it has controls) and
 * this is its accessible name, so every sample string inside it is
 * read once, as a sentence, rather than as a list of fragments.
 *
 * Mono labels are written in sentence case and set uppercase in CSS,
 * the way every mono micro-label on the site is. Decision-log #19 binds
 * every string (no em dashes); Rule 3.2's gate scans this file.
 */

/** Words every before-and-after diagram shares. */
export const DIAGRAM_WORDS = {
  before: "Before",
  after: "After",
  agent: "Agent",
} as const;

/** The Why section's visual: a process being mapped (#55's body copy). */
export const PROCESS_MAP = {
  label:
    "A process map of one request, from inbox to done, in six steps. Three of them are repeated by hand: reading and sorting the request, finding the customer, and drafting the reply. Those three are marked as the spots where an agent goes. Pricing the job stays with a person.",
  title: "Process map",
  route: "One request, inbox to done",
  legend: {
    request: "The request",
    byHand: "Repeated by hand: where an agent goes",
  },
  steps: [
    { name: "Request comes in", tag: "Start", byHand: false },
    {
      name: "Read and sort it",
      tag: "By hand",
      detail: "30 a day",
      byHand: true,
    },
    {
      name: "Find the customer",
      tag: "By hand",
      detail: "30 a day",
      byHand: true,
    },
    { name: "Price the job", tag: "A person", byHand: false },
    {
      name: "Draft the reply",
      tag: "By hand",
      detail: "25 a day",
      byHand: true,
    },
    { name: "Reply sent", tag: "Done", byHand: false },
  ],
} as const;

/** `/services/agentic-system#email-triage`. */
export const EMAIL_TRIAGE = {
  label:
    "Email triage, before and after. Before: an inbox with 48 unread emails, from invoices and delivery updates to newsletters and promotions. After: an agent has sorted it. Two emails are flagged for you to read, and the other 46 have their replies drafted.",
  before: {
    title: "48 unread",
    rows: [
      { from: "Dana Ruiz", subject: "Invoice 2291 is overdue?" },
      { from: "Supplier", subject: "Delivery moved to Friday" },
      { from: "Newsletter", subject: "This week in retail" },
      { from: "Mo Lee", subject: "Can we move Thursday?" },
      { from: "Billing", subject: "Your October receipt" },
      { from: "Ivy Chen", subject: "Price for 40 units" },
      { from: "Promotions", subject: "20% off this weekend" },
      { from: "Sam Ortiz", subject: "Contract changes" },
      { from: "Calendar", subject: "Updated: team sync" },
      { from: "Support", subject: "Ticket 4471 closed" },
    ],
  },
  after: {
    title: "Sorted",
    flagged: {
      label: "Flagged",
      count: "2",
      rows: [
        { from: "Dana Ruiz", subject: "Invoice 2291 is overdue?" },
        { from: "Sam Ortiz", subject: "Contract changes" },
      ],
    },
    drafted: {
      label: "Drafted",
      count: "46",
      rows: [
        { from: "Mo Lee", subject: "Can we move Thursday?" },
        { from: "Ivy Chen", subject: "Price for 40 units" },
        { from: "Supplier", subject: "Delivery moved to Friday" },
        { from: "Billing", subject: "Your October receipt" },
      ],
    },
    draftTag: "Draft",
  },
} as const;

/** `/services/agentic-system#weekly-reporting`. Generic tool names only. */
export const WEEKLY_REPORT = {
  label:
    "Weekly reporting, before and after. Before: the week's numbers sit in four separate tools: sales in a spreadsheet, new leads in the CRM, orders in billing and the click rate in ads. After: an agent pulls each one into a single weekly report and delivers it on Monday morning. Choose a tool to see where its number lands.",
  before: { title: "4 tools" },
  after: {
    title: "Delivered",
    report: "Weekly report",
    week: "Week 42",
    sent: "Sent Mon 8:00",
  },
  pulling: "Pulling",
  sources: [
    { tool: "Spreadsheet", metric: "Sales", value: "$18,420" },
    { tool: "CRM", metric: "New leads", value: "126" },
    { tool: "Billing", metric: "Orders", value: "312" },
    { tool: "Ads", metric: "Click rate", value: "2.4%" },
  ],
} as const;

/** The accessible name of one source button in the weekly report. */
export const weeklySourceLabel = (source: {
  tool: string;
  metric: string;
  value: string;
}): string =>
  `${source.tool}: ${source.metric}, ${source.value}. Show where it lands in the report.`;

/** `/services/agentic-system#quoting-and-intake`. */
export const QUOTING_INTAKE = {
  label:
    "Quoting and intake, before and after. Before: a customer asks in their own words for a price on 40 oak chairs, delivered to Austin by the 12th. After: an agent has pulled out the details and drafted quote Q-1042, $3,400 in total, and routed it to Jo Park in sales to approve.",
  before: {
    title: "New request",
    from: "Sam Ortiz",
    initials: "SO",
    /** The message, with the details the agent pulls out marked. */
    message: [
      { text: "Hi! Could you price " },
      { text: "40 oak chairs", detail: true },
      { text: ", delivered to " },
      { text: "Austin", detail: true },
      { text: " by " },
      { text: "the 12th", detail: true },
      { text: "? It's for an event. Thanks!" },
    ],
    attachment: "floor-plan.pdf",
  },
  after: {
    title: "Draft quote",
    number: "Q-1042",
    status: "Draft",
    lines: [
      { item: "Oak chair × 40", amount: "$3,160" },
      { item: "Delivery, Austin", amount: "$240" },
    ],
    totalLabel: "Total",
    total: "$3,400",
    routedLabel: "Routed to",
    person: "Jo Park",
    role: "Sales",
    initials: "JP",
  },
} as const;

/** `/services/agentic-system#document-and-data-entry`. */
export const DOCUMENT_ENTRY = {
  label:
    "Document and data entry, before and after. Before: a pile of 23 files, invoices, forms, receipts and purchase orders. After: an agent has read them and filled the data into the accounting system, vendor, amount and due date, with nothing retyped by hand.",
  before: {
    title: "23 files",
    files: ["Invoice 0412.pdf", "W-9 form.pdf", "Receipt.jpg", "PO 3381.pdf"],
  },
  after: {
    title: "Accounting",
    columns: ["Vendor", "Amount", "Due"],
    rows: [
      ["Acme Supply", "$1,240", "Oct 30"],
      ["Harbor Print", "$412", "Nov 2"],
      ["Lakeside Freight", "$970", "Nov 5"],
      ["Pine & Co", "$86", "Nov 9"],
    ],
    entered: "23 entered",
    retyped: "0 retyped",
  },
} as const;

/** `/services/product#new-product`: a product taking shape, agents inside. */
export const BUILD_FROM_SCRATCH = {
  label:
    "Build from scratch: a new product taking shape. Its sign-in, navigation and request list are built, its reports screen is still being drawn, and two agents work inside it, one sorting requests and one drafting replies. A timeline runs from map to build to validate to live, at week 5 of 8.",
  window: "Your product",
  progress: "Week 5 of 8",
  modules: {
    list: "Requests",
    chart: "Reports",
    assistant: "Replies",
  },
  agents: ["Sorts requests", "Drafts replies"],
  building: "Building",
  phases: ["Map", "Build", "Validate", "Live"],
  today: "Today",
} as const;

/** `/services/product#product-completion`: half built, assessed, finished. */
export const FINISH_STARTED = {
  label:
    "Finish what someone started: a half-built product being assessed. A written assessment marks what to keep, what to fix and what is missing: keep sign-in and hosting, fix payments, build the admin and the tests. A progress bar runs from 70% built to launch.",
  window: "Their product",
  modules: {
    signIn: "Sign-in",
    payments: "Payments",
    admin: "Admin",
    tests: "Tests",
  },
  assessment: {
    title: "Assessment",
    items: [
      { area: "Sign-in", verdict: "Keep", state: "keep" },
      { area: "Hosting", verdict: "Keep", state: "keep" },
      { area: "Payments", verdict: "Fix", state: "fix" },
      { area: "Admin", verdict: "Missing", state: "missing" },
      { area: "Tests", verdict: "Missing", state: "missing" },
    ],
  },
  built: "70% built",
  launch: "Launch",
} as const;

/** `/services/product#product-support`: a live product, watched and improved. */
export const ONGOING_TEAM = {
  label:
    "Ongoing product team: a live product being watched and improved. It is live with 99.98% uptime. A chart of weekly active users across twelve weeks climbs after each release, from 820 users in week 1 to 1,240 in week 12, with versions 1.4, 1.5 and 1.6 shipped along the way, and version 1.7 next.",
  live: "Live",
  uptime: "Uptime 99.98%",
  chart: "Weekly active users",
  /** Twelve weeks of a sample product's weekly active users. */
  weeks: [820, 842, 836, 905, 931, 924, 1012, 1040, 1036, 1150, 1191, 1240],
  /** Releases land in the week they shipped (1-based). */
  releases: [
    { week: 4, version: "v1.4", note: "Faster checkout" },
    { week: 7, version: "v1.5", note: "AI search" },
    { week: 10, version: "v1.6", note: "Smarter alerts" },
  ],
  weekLabel: "Week",
  usersLabel: "users",
  next: "Next: v1.7, saved searches",
  /** The scrubber's accessible name. */
  scrub: "Week of the chart to inspect",
} as const;
