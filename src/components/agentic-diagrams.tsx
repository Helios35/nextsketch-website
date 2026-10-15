import type { ReactNode } from "react";
import {
  BeforeAfterDiagram,
  D_FIGURE,
  D_LABEL,
  D_TEXT,
} from "@/components/diagram";
import {
  DOCUMENT_ENTRY,
  EMAIL_TRIAGE,
  QUOTING_INTAKE,
} from "@/content/diagrams";

/**
 * Three of the agentic page's four example jobs (decision-log #57),
 * drawn in the diagram language of #60: each one's before, the agent,
 * and its after, in the shared `BeforeAfterDiagram`. The fourth,
 * weekly reporting, has controls and lives in its own client file
 * (`weekly-reporting-diagram.tsx`).
 *
 * Server components: the only motion is the shared lines' ambient
 * dots and dashes and the hub's pulse (#62), all CSS.
 *
 * **Coral, once per diagram** (docs/04-ux-spec.md §Accent rules): the
 * flagged mail, the routed quote, and "0 retyped". The mark's lead in
 * the hub is the logo's own. A detail the agent pulls out of a message
 * or a document carries a dashed `muted-foreground` underline in the
 * before panel, so the before and after visibly hold the same facts.
 */

/** The pulled-out-detail underline the before panels share. */
const DETAIL =
  "underline decoration-muted-foreground decoration-dashed underline-offset-2";

/** A small outlined mono tag, e.g. "Draft". */
function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      className={`${D_LABEL} shrink-0 rounded-sm border border-muted-foreground/60 px-1 py-0.5 text-muted-foreground`}
    >
      {children}
    </span>
  );
}

/** Initials in a ring: a sample person. */
function Initials({ children }: { children: string }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-muted-foreground bg-secondary font-mono text-[0.5rem] leading-none text-foreground">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Email triage: a crowded inbox becomes a sorted one, a few flagged    *
 * and the rest drafted. Both lists are longer than their panel on      *
 * purpose, and the panel clips them: no fade at the foot, which would  *
 * wash the last row's text under the 4.5:1 floor.                      *
 * ------------------------------------------------------------------ */

function MailRow({
  from,
  subject,
  unread = false,
  flagged = false,
  tag,
}: {
  from: string;
  subject: string;
  unread?: boolean;
  flagged?: boolean;
  tag?: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 border-b border-border py-1.5 pr-2 @md:py-2 @md:pr-2.5 ${flagged ? "border-l-2 border-l-brand pl-1.5 @md:pl-2" : "pl-2 @md:pl-2.5"}`}
    >
      {unread && (
        <span className="size-1 shrink-0 rounded-full bg-foreground" />
      )}
      <span className="min-w-0 flex-1">
        <span
          className={`${D_TEXT} block truncate font-medium text-foreground`}
        >
          {from}
        </span>
        <span className={`${D_TEXT} block truncate text-muted-foreground`}>
          {subject}
        </span>
      </span>
      {tag !== undefined && <Tag>{tag}</Tag>}
    </div>
  );
}

function GroupHead({
  label,
  count,
  flagged = false,
}: {
  label: string;
  count: string;
  flagged?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary px-2 py-1.5 @md:px-2.5">
      <span
        className={`${D_LABEL} flex items-center gap-1.5 ${flagged ? "text-brand" : "text-muted-foreground"}`}
      >
        {flagged && <span className="size-1.5 shrink-0 rotate-45 bg-brand" />}
        {label}
      </span>
      <span className={`${D_FIGURE} text-foreground`}>{count}</span>
    </div>
  );
}

export function EmailTriageDiagram() {
  const { before, after } = EMAIL_TRIAGE;
  return (
    <BeforeAfterDiagram
      label={EMAIL_TRIAGE.label}
      before={{
        title: before.title,
        body: (
          <>
            {before.rows.map((row) => (
              <MailRow
                key={row.subject}
                from={row.from}
                subject={row.subject}
                unread
              />
            ))}
          </>
        ),
      }}
      after={{
        title: after.title,
        body: (
          <>
            <GroupHead
              label={after.flagged.label}
              count={after.flagged.count}
              flagged
            />
            {after.flagged.rows.map((row) => (
              <MailRow
                key={row.subject}
                from={row.from}
                subject={row.subject}
                flagged
              />
            ))}
            <GroupHead
              label={after.drafted.label}
              count={after.drafted.count}
            />
            {after.drafted.rows.map((row) => (
              <MailRow
                key={row.subject}
                from={row.from}
                subject={row.subject}
                tag={after.draftTag}
              />
            ))}
          </>
        ),
      }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Quoting and intake: a raw request becomes a drafted quote, routed    *
 * to the right person.                                                 *
 * ------------------------------------------------------------------ */

function Paperclip() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="size-2.5 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M8.5 5.5 5.6 8.4a1.8 1.8 0 0 1-2.5-2.5L6.4 2.6a1.2 1.2 0 0 1 1.7 1.7L4.9 7.5" />
    </svg>
  );
}

function RouteArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="size-2.5 shrink-0 text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
    >
      <path d="M2 6h7M6.5 3 9.5 6l-3 3" />
    </svg>
  );
}

export function QuotingIntakeDiagram() {
  const { before, after } = QUOTING_INTAKE;
  return (
    <BeforeAfterDiagram
      label={QUOTING_INTAKE.label}
      before={{
        title: before.title,
        bodyClassName: "flex flex-col gap-2 p-2 @md:p-2.5",
        body: (
          <>
            <span className="flex items-center gap-1.5">
              <Initials>{before.initials}</Initials>
              <span
                className={`${D_TEXT} truncate font-medium text-foreground`}
              >
                {before.from}
              </span>
            </span>
            <p
              className={`${D_TEXT} rounded-md rounded-tl-sm border border-border bg-secondary p-2 leading-snug text-foreground`}
            >
              {before.message.map((part) =>
                "detail" in part ? (
                  <span key={part.text} className={DETAIL}>
                    {part.text}
                  </span>
                ) : (
                  <span key={part.text}>{part.text}</span>
                ),
              )}
            </p>
            <span className="flex w-fit max-w-full items-center gap-1 rounded-sm border border-border px-1.5 py-1">
              <Paperclip />
              <span
                className={`${D_TEXT} truncate font-mono text-muted-foreground`}
              >
                {before.attachment}
              </span>
            </span>
          </>
        ),
      }}
      after={{
        title: after.title,
        bodyClassName: "flex flex-col p-2 @md:p-2.5",
        body: (
          <>
            <span className="flex items-center justify-between gap-2">
              <span className={`${D_FIGURE} text-foreground`}>
                {after.number}
              </span>
              <Tag>{after.status}</Tag>
            </span>
            <span className="mt-2 block space-y-1">
              {after.lines.map((line) => (
                <span
                  key={line.item}
                  className="flex items-baseline justify-between gap-2"
                >
                  <span className={`${D_TEXT} truncate text-muted-foreground`}>
                    {line.item}
                  </span>
                  <span className={`${D_FIGURE} text-foreground`}>
                    {line.amount}
                  </span>
                </span>
              ))}
            </span>
            <span className="mt-1.5 flex items-baseline justify-between gap-2 border-t border-border pt-1.5">
              <span className={`${D_LABEL} text-muted-foreground`}>
                {after.totalLabel}
              </span>
              <span className={`${D_FIGURE} text-foreground`}>
                {after.total}
              </span>
            </span>
            <span className="mt-auto block border-t border-border pt-2">
              <span className={`${D_LABEL} flex items-center gap-1 text-brand`}>
                <RouteArrow />
                {after.routedLabel}
              </span>
              <span className="mt-1.5 flex items-center gap-1.5">
                <Initials>{after.initials}</Initials>
                <span
                  className={`${D_TEXT} truncate font-medium text-foreground`}
                >
                  {after.person}
                </span>
                <span className={`${D_TEXT} truncate text-muted-foreground`}>
                  {after.role}
                </span>
              </span>
            </span>
          </>
        ),
      }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Document and data entry: a pile of documents becomes data filled     *
 * into a system, with no one retyping it.                              *
 * ------------------------------------------------------------------ */

/**
 * Where each document sits in the pile, back to front: fanned down the
 * panel so each one's file name shows clear of the next, the way a
 * stack of papers shows its tabs. No card's edge crosses another's
 * name, so every name keeps the 4.5:1 floor. A tilt of a degree or two
 * is layout, not motion (decision-log #32 flagged the first rotated
 * plane; this is the same device, smaller).
 */
const PILE = [
  "left-[10%] top-[2%] -rotate-2",
  "left-[16%] top-[16%] rotate-[1.5deg]",
  "left-[12%] top-[30%] -rotate-1",
  "left-[18%] top-[44%] rotate-2",
] as const;

/**
 * The table's columns. The due date shows only in the stacked drawing,
 * where the after panel is wide; side by side it would squeeze the
 * figures to an ellipsis.
 */
const COLUMN = [
  "w-[46%] @sm:w-[50%]",
  "w-[24%] @sm:w-auto",
  "@sm:hidden",
] as const;

function Check() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="size-2.5 shrink-0 text-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M2.5 6.2 5 8.5l4.5-5" />
    </svg>
  );
}

export function DocumentEntryDiagram() {
  const { before, after } = DOCUMENT_ENTRY;
  /* The front document is the first row the agent enters, so the before
     and after hold the same facts. */
  const [vendor, amount, due] = after.rows[0];
  /* Drawn back to front, so the first file (the invoice) lands on top. */
  const pile = [...before.files].reverse();
  const front = pile.length - 1;
  return (
    <BeforeAfterDiagram
      label={DOCUMENT_ENTRY.label}
      before={{
        title: before.title,
        body: pile.map((file, i) => (
          <div
            key={file}
            className={`absolute flex h-[53%] w-[66%] flex-col gap-1.5 overflow-hidden rounded-sm border border-border bg-secondary p-1.5 shadow-2xl @md:p-2 ${PILE[i]}`}
          >
            <span
              className={`${D_TEXT} truncate font-mono text-muted-foreground`}
            >
              {file}
            </span>
            {i === front ? (
              <span className="flex flex-col gap-1">
                <span
                  className={`${D_TEXT} w-fit font-medium text-foreground ${DETAIL}`}
                >
                  {vendor}
                </span>
                <span className={`${D_FIGURE} w-fit text-foreground ${DETAIL}`}>
                  {amount}
                </span>
                <span
                  className={`${D_TEXT} w-fit text-muted-foreground ${DETAIL}`}
                >
                  {due}
                </span>
              </span>
            ) : (
              <span className="flex flex-col gap-1">
                <span className="h-1 w-4/5 rounded-full bg-accent" />
                <span className="h-1 w-3/5 rounded-full bg-accent" />
                <span className="h-1 w-2/3 rounded-full bg-accent" />
              </span>
            )}
          </div>
        )),
      }}
      after={{
        title: after.title,
        bodyClassName: "flex flex-col",
        body: (
          <>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  {after.columns.map((column, j) => (
                    <th
                      key={column}
                      className={`${D_LABEL} py-1.5 pl-2 text-left font-normal text-muted-foreground @md:pl-2.5 ${COLUMN[j]}`}
                    >
                      {column}
                    </th>
                  ))}
                  <th className="w-6.5" />
                </tr>
              </thead>
              <tbody>
                {after.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td
                        key={cell}
                        className={`${j === 1 ? D_FIGURE : D_TEXT} truncate py-1.5 pl-2 text-foreground @md:pl-2.5 ${j === 2 ? COLUMN[2] : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                    <td className="px-2">
                      <Check />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <span className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 border-t border-border px-2 py-1.5 @md:px-2.5">
              <span className={`${D_LABEL} text-muted-foreground`}>
                {after.entered}
              </span>
              <span
                className={`${D_LABEL} flex items-center gap-1.5 text-brand`}
              >
                <span className="size-1.5 shrink-0 rotate-45 bg-brand" />
                {after.retyped}
              </span>
            </span>
          </>
        ),
      }}
    />
  );
}
