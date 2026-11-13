import type { CSSProperties, ReactNode } from "react";
import {
  CalendarDotsIcon,
  ChatCircleIcon,
  EnvelopeSimpleIcon,
  GearSixIcon,
  ListChecksIcon,
  MagnifyingGlassIcon,
  PulseIcon,
  ScanIcon,
  VideoCameraIcon
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// Mini mockups of the ubik desktop app (ubik-meetings origin/main, desktop/src):
// the floating strip with its blue square (Strip.jsx), the pop-up and its views
// (panel/*View.jsx), the meeting card (cards/meeting.jsx), the capture bar
// (CaptureBar.jsx). Drawn in the site's tokens so they follow light and dark.
// The people, companies and numbers in them are made up.

export type ShotId = "meetings" | "dictation" | "ask" | "mail" | "pulse" | "history";

const rise = (i: number) => ({ "--i": i }) as CSSProperties;

function favicon(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function Bars() {
  return (
    <span className="dt-bars" aria-hidden>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

const VIEW_ICONS = {
  Ask: ChatCircleIcon,
  Mail: EnvelopeSimpleIcon,
  Calendar: CalendarDotsIcon,
  Tasks: ListChecksIcon,
  Notes: VideoCameraIcon,
  Activity: PulseIcon,
  Search: MagnifyingGlassIcon
} as const;

type ViewName = keyof typeof VIEW_ICONS;
const TABS = ["Ask", "Mail", "Calendar", "Tasks", "Notes", "Activity", "Search"] as const satisfies readonly ViewName[];

// Strip buttons, in the app's default order (stripConstants.mjs).
const STRIP_ICONS = [
  { id: "Ask", Icon: ChatCircleIcon },
  { id: "Notes", Icon: VideoCameraIcon },
  { id: "Calendar", Icon: CalendarDotsIcon },
  { id: "Mail", Icon: EnvelopeSimpleIcon },
  { id: "Tasks", Icon: ListChecksIcon },
  { id: "Search", Icon: MagnifyingGlassIcon },
  { id: "Capture", Icon: ScanIcon }
] as const;

/**
 * The floating strip. At rest it is the blue square alone; open, the row of
 * icon buttons grows out of it. While recording the square gives way to bars.
 */
function Strip({ live = false, label, active, open = true }: { live?: boolean; label?: string; active?: string; open?: boolean }) {
  return (
    <div className="mx-auto flex w-fit items-center gap-1 rounded-full border bg-card p-1 shadow-sm">
      <span className="grid size-7 place-items-center" aria-hidden>
        <span className="size-2.5 rounded-[3px] bg-primary" />
      </span>
      {live ? <Bars /> : null}
      {label ? <span className="pr-2 text-[11px] font-medium text-muted-foreground">{label}</span> : null}
      {!live && open
        ? STRIP_ICONS.map(({ id, Icon }) => (
            <span
              key={id}
              className={cn(
                "grid size-[26px] place-items-center rounded-full",
                id === active ? "bg-foreground text-card" : "text-muted-foreground"
              )}
            >
              <Icon size={14} aria-hidden />
            </span>
          ))
        : null}
    </div>
  );
}

/** The pop-up under the strip. Icon tabs; the current one is an ink pill with its name. */
function Popup({ tab, children, className }: { tab: ViewName | "Settings"; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm", className)}>
      <div className="flex items-center gap-0.5 border-b px-2 py-1.5">
        {TABS.map((t) => {
          const Icon = VIEW_ICONS[t];
          const current = t === tab;
          return (
            <span
              key={t}
              className={cn(
                "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full text-[12px] font-medium",
                current ? "bg-foreground pl-2.5 pr-3 text-card" : "w-8 text-muted-foreground"
              )}
            >
              <Icon size={15} aria-hidden />
              {current ? t : null}
            </span>
          );
        })}
        <span
          className={cn(
            "ml-auto inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full text-[12px] font-medium",
            tab === "Settings" ? "bg-foreground pl-2.5 pr-3 text-card" : "w-8 text-muted-foreground"
          )}
        >
          <GearSixIcon size={15} aria-hidden />
          {tab === "Settings" ? "Settings" : null}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium text-muted-foreground">{children}</p>;
}

function Btn({ children, primary }: { children: ReactNode; primary?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-md px-2 text-[11px] font-medium",
        primary ? "bg-primary text-primary-foreground" : "border text-foreground"
      )}
    >
      {children}
    </span>
  );
}

function MeetingsShot() {
  return (
    <div className="flex flex-col gap-3">
      <div className="dt-rise flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm" style={rise(0)}>
        <img src={favicon("meet.google.com")} alt="" className="size-4" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground">Meeting now · Google Meet</p>
          <p className="truncate text-[13px] font-semibold text-foreground">Supplier price review</p>
        </div>
        <Btn primary>Start recording</Btn>
      </div>
      <Popup tab="Notes">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[11px] text-muted-foreground">Supplier price review · 32 min · 4 people</p>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-primary">
            <Bars /> Recording
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <div className="dt-rise" style={rise(1)}>
            <Label>Action items</Label>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              <li className="flex items-center justify-between gap-3 text-[12px] text-foreground">
                <span className="truncate">Send the revised PI</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">Avery · Fri</span>
              </li>
              <li className="flex items-center justify-between gap-3 text-[12px] text-foreground">
                <span className="truncate">Confirm the reefer slot</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">You · Mon</span>
              </li>
            </ul>
          </div>
          <div className="dt-rise" style={rise(2)}>
            <Label>Decisions</Label>
            <p className="mt-1.5 text-[12px] text-foreground">Hold the FOB price until the slot is confirmed.</p>
          </div>
          <div className="dt-rise" style={rise(3)}>
            <Label>Slides</Label>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="grid h-9 w-14 shrink-0 grid-rows-3 gap-1 rounded border bg-secondary p-1.5" aria-hidden>
                <i className="block rounded-sm bg-primary/60" />
                <i className="block w-2/3 rounded-sm bg-border" />
                <i className="block w-1/2 rounded-sm bg-border" />
              </span>
              <p className="min-w-0 text-[12px] text-foreground">
                <span className="text-muted-foreground">12:04</span> Price bands by grade, as discussed
              </p>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

const DICTATED =
  "Hi Avery, the revised PI is attached. We can hold the price until Friday if the reefer slot is confirmed.".split(" ");

function DictationShot() {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-1.5 border-b px-3 py-2" aria-hidden>
          <i className="size-2 rounded-full bg-border" />
          <i className="size-2 rounded-full bg-border" />
          <i className="size-2 rounded-full bg-border" />
          <span className="ml-2 text-[11px] text-muted-foreground">Any app · New message</span>
        </div>
        <div className="border-b px-4 py-2 text-[12px] text-muted-foreground">To: Avery Stone</div>
        <p className="min-h-[7.5rem] px-4 py-3 text-[13px] leading-6 text-foreground">
          {DICTATED.map((word, i) => (
            <span key={i} className="dt-word" style={rise(i)}>
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="dt-key inline-flex h-9 items-center rounded-md border bg-card px-3 text-[12px] font-medium text-foreground">
          Left Control
        </span>
        <span className="text-[12px] text-muted-foreground">hold, speak, let go</span>
      </div>
      <Strip live label="Listening" />
    </div>
  );
}

function AskShot() {
  return (
    <Popup tab="Ask">
      <div className="flex flex-col gap-3">
        <div className="dt-rise ml-auto max-w-[85%] rounded-lg border px-3 py-2 text-[12px] text-foreground" style={rise(0)}>
          What did we agree with this buyer last time?
        </div>
        <ul className="flex flex-col gap-1.5">
          <li className="dt-rise text-[11px] text-muted-foreground" style={rise(1)}>
            Searched mail · 3 threads
          </li>
          <li className="dt-rise text-[11px] text-muted-foreground" style={rise(2)}>
            Read meeting notes · Supplier price review
          </li>
        </ul>
        <p className="dt-rise text-[12px] leading-5 text-foreground" style={rise(3)}>
          FOB held at last quarter's price, on condition the reefer slot is confirmed by Monday. Avery owes the revised PI.
        </p>
        <div className="dt-rise mt-1 rounded-lg border p-2.5" style={rise(4)}>
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-[11px] text-foreground">
            <span className="size-2 shrink-0 rounded-sm bg-primary" aria-hidden />
            <span className="truncate">Window behind: Q4 price sheet · Excel</span>
          </span>
          <p className="mt-2 text-[12px] text-muted-foreground">Ask anything</p>
        </div>
      </div>
    </Popup>
  );
}

const SUGGESTED = [
  { title: "Send the packing list to the carrier", fill: true },
  { title: "Confirm the cut-off for BL-2408", fill: false }
];

function MailShot() {
  return (
    <Popup tab="Mail">
      <div className="flex flex-col gap-3">
        <div className="dt-rise" style={rise(0)}>
          <p className="truncate text-[13px] font-semibold text-foreground">Re: Reefer booking for BL-2408</p>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">Carrier desk · 09:12</p>
          <p className="mt-2 text-[12px] leading-5 text-foreground">
            Slot is held to Monday 18:00. Please send the packing list and confirm the cut-off.
          </p>
        </div>
        <Label>Suggested tasks</Label>
        <ul aria-label="Suggested tasks" className="-mt-1 flex flex-col gap-2">
          {SUGGESTED.map((s, i) => (
            <li key={s.title} className="dt-rise flex items-center gap-2.5" style={rise(i + 1)}>
              <span className="dt-ring size-3.5 shrink-0 rounded-full" data-fill={s.fill} style={rise(i + 1)} aria-hidden />
              <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">{s.title}</span>
              <Btn>Add</Btn>
              <span className="text-[11px] text-muted-foreground">Discard</span>
            </li>
          ))}
        </ul>
        <div className="dt-rise flex items-center gap-2.5 border-t pt-3" style={rise(3)}>
          <img src={favicon("meet.google.com")} alt="" className="size-3.5" />
          <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">14:00 Supplier price review</span>
          <Btn>Join</Btn>
        </div>
      </div>
    </Popup>
  );
}

function PulseShot() {
  return (
    <Popup tab="Activity">
      <div className="mb-3 flex gap-4 border-b">
        <span className="-mb-px border-b-2 border-transparent pb-2 text-[11px] text-muted-foreground">Notifications</span>
        <span className="-mb-px border-b-2 border-foreground pb-2 text-[11px] font-medium text-foreground">Pulse</span>
      </div>
      <ul className="flex flex-col gap-3">
        <li className="dt-rise flex items-start gap-3" style={rise(0)}>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted-foreground">Looks done</p>
            <p className="text-[12px] font-medium text-foreground">Send the revised PI</p>
            <p className="text-[11px] text-muted-foreground">The PI went to Avery by mail at 11:42.</p>
          </div>
          <Btn primary>Close</Btn>
        </li>
        <li className="dt-rise flex items-start gap-3" style={rise(1)}>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-muted-foreground">Duplicate</p>
            <p className="text-[12px] font-medium text-foreground">Book reefer slot · Confirm reefer slot</p>
          </div>
          <Btn>Merge</Btn>
        </li>
        <li
          className="dt-rise flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 text-[12px] text-foreground"
          style={rise(2)}
        >
          <span>Closed “Send the revised PI”</span>
          <span className="flex gap-3 text-[11px] font-medium text-primary">
            <span>Undo</span>
            <span>View</span>
          </span>
        </li>
      </ul>
    </Popup>
  );
}

// A fixed month, so the picture never reshuffles.
const HEAT = [0, 1, 2, 3, 2, 0, 0, 1, 2, 4, 3, 1, 0, 0, 2, 3, 4, 4, 2, 0, 0, 1, 3, 4, 3, 1, 0, 0, 2, 3, 2, 4, 3, 0, 0];

function HistoryShot() {
  return (
    <div className="flex flex-col gap-3">
      <div className="dt-rise flex items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2 shadow-sm" style={rise(0)}>
        <span className="flex gap-2">
          <Btn>Screenshot area</Btn>
          <Btn>Record screen</Btn>
        </span>
        <span className="shrink-0 rounded border px-1.5 py-0.5 text-[11px] text-muted-foreground">⌃⇧S</span>
      </div>
      <Popup tab="Settings">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[13px] font-semibold text-foreground">History · November</p>
          <p className="text-[11px] text-muted-foreground">Hours on screen</p>
        </div>
        <div className="dt-heat mt-2 grid w-fit grid-flow-col grid-rows-7 gap-1" aria-hidden>
          {HEAT.map((l, i) => (
            <i key={i} className="size-3" style={{ "--l": l, "--d": `${Math.floor(i / 7) * 90 + (i % 7) * 30 + 200}ms` } as CSSProperties} />
          ))}
        </div>
        <p className="dt-rise mt-3 text-[12px] leading-5 text-foreground" style={rise(3)}>
          Morning in mail and the Q4 price sheet. Afternoon on the supplier call, then the PI.
        </p>
        <div className="dt-rise mt-3 flex flex-wrap items-center gap-1.5" style={rise(4)}>
          <span className="text-[11px] text-muted-foreground">Never logged</span>
          <span className="rounded-md border px-1.5 py-0.5 text-[11px] text-foreground">Private windows</span>
          <span className="rounded-md border px-1.5 py-0.5 text-[11px] text-foreground">Password managers</span>
          <span className="rounded-md border px-1.5 py-0.5 text-[11px] text-foreground">Apps you pick</span>
        </div>
      </Popup>
    </div>
  );
}

const SHOTS: Record<ShotId, () => JSX.Element> = {
  meetings: MeetingsShot,
  dictation: DictationShot,
  ask: AskShot,
  mail: MailShot,
  pulse: PulseShot,
  history: HistoryShot
};

/** The desk the shot sits on. `id` remounts the content so its motion replays. */
export function TourShot({ id, className }: { id: ShotId; className?: string }) {
  const Shot = SHOTS[id];
  return (
    <div className={cn("dt-desk overflow-hidden rounded-xl border p-4 sm:p-6", className)} aria-hidden>
      <div key={id} className="dt-shot-enter mx-auto flex w-full max-w-md flex-col gap-3">
        {id === "dictation" ? null : <Strip live={id === "meetings"} active={{ ask: "Ask", mail: "Mail", pulse: "Tasks", history: "Capture" }[id as string]} />}
        <Shot />
      </div>
    </div>
  );
}
