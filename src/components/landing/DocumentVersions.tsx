import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type DocumentVersionsCopy = {
  documents: string[];
  flags: { index: number; text: string }[];
  count: string;
  review: string;
  reading: string;
  kept: string;
  done: string;
};

const favicon = (src: string) => (src.startsWith("/") || src.startsWith("data:") ? src : `https://www.google.com/s2/favicons?domain=${src}&sz=64`);
const ZOHO = "zoho.com";
const MAERSK = "/integrations/MAERSK-B.CO.svg";
const GMAIL = "/logos/gmail.svg";
const OUTLOOK = "/logos/outlook.svg";
const WHATSAPP = "/logos/whatsapp.svg";
// Google serves its own "G" for every google.com subdomain, so Drive and Sheets carry their marks inline.
export const DRIVE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 87 78'%3E%3Cpath fill='%230066DA' d='M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z'/%3E%3Cpath fill='%2300AC47' d='M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 48.5A9 9 0 0 0 0 53h27.5z'/%3E%3Cpath fill='%23EA4335' d='M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z'/%3E%3Cpath fill='%2300832D' d='M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z'/%3E%3Cpath fill='%232684FC' d='M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z'/%3E%3Cpath fill='%23FFBA00' d='M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z'/%3E%3C/svg%3E";
export const SHEETS = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 20'%3E%3Cpath fill='%230F9D58' d='M2 0h8l6 6v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z'/%3E%3Cpath fill='%2387CEAC' d='M10 0l6 6h-4a2 2 0 0 1-2-2z'/%3E%3Cpath fill='%23fff' d='M3.5 9h9v7h-9zm1 1v1.5h3V10zm4 0v1.5h3V10zm-4 2.5V14h3v-1.5zm4 0V14h3v-1.5z'/%3E%3C/svg%3E";
const DROPBOX = "dropbox.com";
const DOCUSIGN = "docusign.com";

/*
 * Where each of the 36 documents arrived from, and the file names it arrived
 * under, oldest first. Same order as the document labels in the copy. File
 * names are what vendors actually send, so they are not translated.
 */
const files: { source: string; names: string[] }[] = [
  { source: ZOHO, names: ["PO-2481.pdf", "PO-2481 (1).pdf", "PO-2481 rev 2.pdf"] },
  { source: GMAIL, names: ["PI_2481.pdf", "PI_2481 v2.pdf", "PI_2481 v2 final.pdf"] },
  { source: DOCUSIGN, names: ["Contract signed.pdf"] },
  { source: GMAIL, names: ["LC draft.docx", "LC draft v3.docx", "LC final.pdf"] },
  { source: SHEETS, names: ["CI-2481.xlsx", "CI-2481 latest.xlsx"] },
  { source: WHATSAPP, names: ["Packing list.xlsx", "Packing list (1).xlsx", "Packing list (2).xlsx"] },
  { source: MAERSK, names: ["BL MSK-2841 draft.pdf", "BL MSK-2841 v2.pdf"] },
  { source: GMAIL, names: ["SWB_2841.pdf"] },
  { source: MAERSK, names: ["Booking conf.pdf", "Booking conf amended.pdf"] },
  { source: OUTLOOK, names: ["SI v1.docx", "SI v4 final.docx", "SI v9 final.docx"] },
  { source: MAERSK, names: ["VGM.pdf"] },
  { source: DRIVE, names: ["COO scan.pdf", "COO scan (1).pdf"] },
  { source: WHATSAPP, names: ["IMG_4471.jpg", "Health cert latest.pdf"] },
  { source: GMAIL, names: ["Docs_2481.zip", "Docs_2481 (2).zip"] },
  { source: DRIVE, names: ["Phyto.pdf"] },
  { source: GMAIL, names: ["Fumigation cert.pdf"] },
  { source: OUTLOOK, names: ["Policy 2481.pdf", "Policy 2481 endorsed.pdf"] },
  { source: DROPBOX, names: ["Inspection_final.pdf", "Inspection_final_FINAL.pdf"] },
  { source: GMAIL, names: ["Lab results.pdf", "Lab results v2.pdf"] },
  { source: WHATSAPP, names: ["IMG_4480.jpg"] },
  { source: DRIVE, names: ["Shipping bill.pdf"] },
  { source: OUTLOOK, names: ["Entry 7501.pdf", "Entry 7501 corrected.pdf"] },
  { source: OUTLOOK, names: ["ISF 10+2.xlsx"] },
  { source: MAERSK, names: ["Arrival notice.pdf", "Arrival notice rev 2.pdf"] },
  { source: GMAIL, names: ["DO.pdf"] },
  { source: MAERSK, names: ["Freight INV.pdf", "Freight INV v2.pdf"] },
  { source: ZOHO, names: ["DN-118.pdf"] },
  { source: ZOHO, names: ["CN-042.pdf", "CN-042 (1).pdf"] },
  { source: GMAIL, names: ["Draft scan.pdf"] },
  { source: GMAIL, names: ["Remittance.pdf"] },
  { source: WHATSAPP, names: ["Claim photos.zip", "Claim photos (3).zip"] },
  { source: SHEETS, names: ["Reefer log.csv", "Reefer log latest.csv"] },
  { source: MAERSK, names: ["Release order.pdf"] },
  { source: WHATSAPP, names: ["IMG_4502.jpg"] },
  { source: SHEETS, names: ["GRN 2026.xlsx", "GRN 2026 updated.xlsx"] },
  { source: GMAIL, names: ["COA bundle.zip", "COA bundle v2.zip"] }
];

/*
 * New versions land while ubik reads: `at` is the read position when the
 * file arrives. Some replace a file ubik already read (it re-checks and keeps
 * the newer one), some land ahead of the cursor.
 */
const arrivals: { at: number; doc: number }[] = [
  { at: 3, doc: 0 }, { at: 5, doc: 9 }, { at: 7, doc: 5 }, { at: 9, doc: 1 },
  { at: 11, doc: 9 }, { at: 13, doc: 3 }, { at: 15, doc: 12 }, { at: 16, doc: 5 },
  { at: 18, doc: 6 }, { at: 19, doc: 13 }, { at: 21, doc: 0 }, { at: 22, doc: 17 },
  { at: 23, doc: 4 }, { at: 24, doc: 3 }, { at: 25, doc: 8 }, { at: 26, doc: 21 },
  { at: 27, doc: 1 }, { at: 28, doc: 11 }, { at: 29, doc: 16 }, { at: 30, doc: 23 },
  { at: 31, doc: 18 }, { at: 32, doc: 30 }, { at: 33, doc: 25 }, { at: 34, doc: 27 },
  { at: 34, doc: 31 }, { at: 35, doc: 34 }, { at: 35, doc: 35 }
];

const STEP_MS = 230;
const ARRIVAL_MS = 1100;
const HOLD_MS = 3200;

// The part of a file name that says which version it is.
const VERSION = /(\(\d+\)|\bv\d+( final)?|_?FINAL|\bfinal|\blatest|\brev \d+|\bamended|\bcorrected|\bendorsed|\bupdated)/;

function FileName({ name }: { name: string }) {
  const match = name.match(VERSION);
  if (!match || match.index === undefined) return <>{name}</>;
  return (
    <>
      {name.slice(0, match.index)}
      <span className="doc-version-token">{match[0]}</span>
      {name.slice(match.index + match[0].length)}
    </>
  );
}

/**
 * One shipment's 36 documents as the files they arrived as: PDFs, photos,
 * spreadsheets and ZIPs from mail, chat and portals. ubik's cursor reads them
 * in order while newer versions keep landing; each newer file replaces the
 * old one in place and the status bar says which was kept. The two that
 * disagree with another record turn red. Runs only on screen; static under
 * reduced motion.
 */
export function DocumentVersions({ copy, className }: { copy: DocumentVersionsCopy; className?: string }) {
  const total = files.length;
  const reducedMotion = Boolean(useReducedMotion());
  const [cursor, setCursor] = useState(reducedMotion ? total : 0);
  const [running, setRunning] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const flagged = new Map(copy.flags.map((flag) => [flag.index, flag.text]));

  useEffect(() => {
    if (reducedMotion) return;
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const landed = arrivals.filter((arrival) => arrival.at <= cursor);
  const arriving = arrivals.filter((arrival) => arrival.at === cursor);

  useEffect(() => {
    if (!running) return;
    const delay = cursor >= total ? HOLD_MS : arriving.length ? ARRIVAL_MS : STEP_MS;
    const timer = window.setTimeout(() => setCursor((value) => (value >= total ? 0 : value + 1)), delay);
    return () => window.clearTimeout(timer);
  }, [running, cursor, total, arriving.length]);

  const version = files.map((_, index) => landed.filter((arrival) => arrival.doc === index).length);
  const nameOf = (index: number) => files[index].names[Math.min(version[index], files[index].names.length - 1)];
  const found = copy.flags.filter((flag) => flag.index < cursor);
  const fill = (text: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce((out, [key, value]) => out.split(`{{${key}}}`).join(String(value)), text);

  const latest = arriving[arriving.length - 1];
  const status =
    cursor >= total && !latest
      ? fill(copy.done, { docs: total })
      : latest
        ? fill(copy.kept, { name: nameOf(latest.doc) })
        : fill(copy.reading, { name: nameOf(Math.min(cursor, total - 1)) });

  return (
    <figure ref={root} className={cn("doc-versions w-full", className)}>
      <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-6" aria-label={fill(copy.count, { docs: total, versions: total + landed.length })}>
        {copy.documents.map((label, index) => {
          const isRead = index < cursor;
          const isFlag = flagged.has(index) && isRead;
          const isCurrent = index === cursor && cursor < total;
          const isNew = arriving.some((arrival) => arrival.doc === index);
          return (
            <li
              key={label}
              className={cn(
                "doc-version-cell",
                isRead && !isFlag && "is-read",
                isFlag && "is-flag",
                isCurrent && "is-current",
                isNew && "is-new"
              )}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <img src={favicon(files[index].source)} alt="" className="size-3.5 shrink-0 rounded-[3px] object-contain" />
                <span className="truncate text-[12px] font-medium leading-4">{label}</span>
                {version[index] > 0 ? <span className="doc-version-pill">v{version[index] + 1}</span> : null}
              </span>
              <span key={nameOf(index)} className="doc-version-file">
                <FileName name={nameOf(index)} />
              </span>
            </li>
          );
        })}
      </ol>

      <div className="doc-versions-bar">
        <p className="flex min-w-0 items-center gap-2.5" aria-live="off">
          <span aria-hidden className={cn("size-2.5 shrink-0 bg-primary", running && cursor < total && "doc-versions-cursor")} />
          <span className="truncate font-medium">{status}</span>
        </p>
        <p className="shrink-0 tabular-nums text-muted-foreground">
          {fill(copy.count, { docs: total, versions: total + landed.length })}
          {found.length ? <> · <span className="text-destructive">{fill(copy.review, { flags: found.length })}</span></> : null}
        </p>
      </div>

      <ul className="mt-3 grid min-h-[3.25rem] gap-1.5 text-[13px] sm:grid-cols-2">
        {found.map((flag) => (
          <li key={flag.index} className="flex items-center gap-2">
            <span aria-hidden className="size-2 shrink-0 rounded-[2px] bg-destructive" />
            {flag.text}
          </li>
        ))}
      </ul>
    </figure>
  );
}
