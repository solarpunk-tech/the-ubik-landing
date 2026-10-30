import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRightIcon, CheckIcon, EnvelopeSimpleIcon, FileIcon, FilePdfIcon, FileXlsIcon, MinusIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import type {
  DocumentCheckVisual,
  PackagingVisual,
  PlanningVisual,
  SupplierUpdatesVisual,
  WorkflowCopy,
  WorkflowSlug
} from "@/lib/workflows";
import { cn } from "@/lib/utils";
import { LiveSquare } from "./SupplierExampleCard";
import { RunPreview } from "@/components/landing/WorkflowRun";

/**
 * Steps 0..count while the element is on screen, holds on the finished state,
 * then starts over. Reduced motion jumps straight to the finished state.
 */
function useStepper(count: number, stepMs = 750, holdMs = 3200) {
  const reducedMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(reducedMotion ? count : 0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setStep((value) => (value >= count ? 0 : value + 1)), step >= count ? holdMs : stepMs);
    return () => window.clearTimeout(timer);
  }, [visible, step, count, stepMs, holdMs]);

  return { ref, step };
}

const shown = (on: boolean) => cn("transition-all duration-500", on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0");

function Frame({ children, className, innerRef }: { children: ReactNode; className?: string; innerRef: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={innerRef} aria-hidden className={cn("flex flex-col gap-2.5 overflow-hidden rounded-lg border border-border bg-card p-3.5 text-[12.5px] shadow-sm", className)}>
      {children}
    </div>
  );
}

/** Supplier updates: the weekly sheet goes out, the replies come back as before → after. */
function SupplierUpdates({ v, className }: { v: SupplierUpdatesVisual; className?: string }) {
  const { ref, step } = useStepper(v.changes.length + 1);
  return (
    <Frame innerRef={ref} className={className}>
      <div className="flex items-start gap-2.5 rounded-md border border-border bg-background p-2.5">
        <EnvelopeSimpleIcon className="mt-0.5 size-4 shrink-0 text-primary-text" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{v.subject}</p>
          <p className="truncate text-muted-foreground">{v.to}</p>
          <span className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md border border-border bg-card px-2 py-0.5">
            <FileXlsIcon className="size-3.5 shrink-0 text-ok-text" />
            <span className="truncate">{v.attachment}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <span className="flex items-center gap-2">
          <LiveSquare className="size-1.5" />
          {v.repliesLabel}
        </span>
        <span className={cn("rounded-full bg-ok/15 px-2 py-0.5 text-[12px] font-medium text-ok-text", shown(step >= 1))}>{v.status}</span>
      </div>
      <ul className="grid gap-1.5">
        {v.changes.map((change, index) => (
          <li key={change.po} className={cn("flex items-center gap-2 rounded-md bg-accent/60 px-2 py-1.5 tabular-nums", shown(step > index + 0))}>
            <span className="shrink-0 font-medium">{change.po}</span>
            <span className="shrink-0 text-muted-foreground">{change.field}</span>
            <span className="ml-auto flex min-w-0 items-center gap-1.5">
              <span className="truncate text-muted-foreground line-through">{change.from}</span>
              <ArrowRightIcon className="size-3 shrink-0 text-primary-text" />
              <span className="truncate font-semibold">{change.to}</span>
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

const docIcon = {
  received: <CheckIcon weight="bold" className="size-3 text-ok-text" />,
  partial: <MinusIcon weight="bold" className="size-3 text-support-text" />,
  missing: <XIcon weight="bold" className="size-3 text-destructive" />
};

/** Document verification: the checklist fills in, one disagreement surfaces, the fix is drafted. */
function DocumentCheck({ v, className }: { v: DocumentCheckVisual; className?: string }) {
  const { ref, step } = useStepper(v.docs.length + 2, 420);
  const findingOn = step > v.docs.length;
  const draftOn = step > v.docs.length + 1;
  return (
    <Frame innerRef={ref} className={className}>
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-border px-2 py-0.5 font-medium tabular-nums">{v.po}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[12px] text-muted-foreground">{v.stage}</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {v.docs.map((doc, index) => (
          <li key={doc.name} className="flex min-w-0 items-center gap-1.5">
            <span className={cn("inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border", step > index ? "border-transparent bg-muted" : "border-border")}>
              {step > index ? docIcon[doc.state] : null}
            </span>
            <span className={cn("truncate", step > index ? "text-foreground" : "text-muted-foreground/70")}>{doc.name}</span>
          </li>
        ))}
      </ul>
      <div className={cn("rounded-md border border-destructive/40 bg-destructive/5 p-2", shown(findingOn))}>
        <p className="flex items-center gap-1.5 font-semibold text-destructive">
          <WarningIcon weight="fill" className="size-3.5" /> {v.finding.severity}
          <span className="ml-auto font-normal text-muted-foreground">{v.finding.owner}</span>
        </p>
        <p className="mt-1 line-clamp-2 leading-[1.35]">{v.finding.text}</p>
      </div>
      <div className={cn("mt-auto flex items-center justify-between gap-2", shown(draftOn))}>
        <span className="flex min-w-0 items-center gap-1.5">
          <FilePdfIcon className="size-3.5 shrink-0 text-destructive" />
          <span className="truncate">{v.invoice}</span>
        </span>
        <span className="inline-flex h-7 shrink-0 items-center rounded-md bg-primary px-2.5 text-[12px] font-medium text-primary-foreground">{v.send}</span>
      </div>
    </Frame>
  );
}

const riskTone: Record<string, string> = {
  Finished: "bg-ok/15 text-ok-text",
  Safe: "bg-ok/15 text-ok-text",
  Watch: "bg-support/25 text-support-text",
  "At risk": "bg-destructive/10 text-destructive",
  Critical: "bg-destructive text-destructive-foreground"
};
const barTone: Record<string, string> = {
  Finished: "bg-ok",
  Safe: "bg-chart-1",
  Watch: "bg-support",
  "At risk": "bg-destructive",
  Critical: "bg-destructive"
};

/** Production planning: each load fills to what the plant has produced; the stalled ones say why. */
function Planning({ v, className }: { v: PlanningVisual; className?: string }) {
  const { ref, step } = useStepper(2, 300, 5200);
  const filled = step >= 1;
  return (
    <Frame innerRef={ref} className={className}>
      <p className="truncate font-medium">{v.title}</p>
      <ul className="grid gap-2">
        {v.loads.map((load) => (
          <li key={load.id} className="grid gap-1">
            <div className="flex items-center gap-2 tabular-nums">
              <span className="w-14 shrink-0 font-medium">{load.id}</span>
              <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className={cn("absolute inset-y-0 left-0 rounded-full transition-[width] duration-[1400ms] ease-out", barTone[load.risk])}
                  style={{ width: filled ? `${load.progress}%` : "0%" }}
                />
              </span>
              <span className={cn("w-16 shrink-0 rounded-full px-1.5 py-0.5 text-center text-[11.5px] font-medium", riskTone[load.risk])}>{load.risk}</span>
            </div>
            {load.note ? <p className={cn("truncate pl-16 text-[12px] text-muted-foreground", shown(step >= 2))}>{load.note}</p> : null}
          </li>
        ))}
      </ul>
      <div className={cn("mt-auto flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5", shown(step >= 2))}>
        <EnvelopeSimpleIcon className="size-3.5 shrink-0 text-primary-text" />
        <span className="shrink-0 text-muted-foreground">{v.reportLabel}</span>
        <FileXlsIcon className="ml-auto size-3.5 shrink-0 text-ok-text" />
        <span className="truncate">{v.report}</span>
      </div>
    </Frame>
  );
}

/** Packaging tracker: the artwork thread builds up, and the task follows whoever the next move is on. */
function Packaging({ v, className }: { v: PackagingVisual; className?: string }) {
  const { ref, step } = useStepper(v.thread.length + 1, 800);
  return (
    <Frame innerRef={ref} className={className}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-medium">{v.task}</p>
        <span className="shrink-0 text-muted-foreground">{v.owner}</span>
      </div>
      <ol className="grid gap-1">
        {v.thread.map((message, index) => {
          const ours = message.from === "You";
          return (
            <li key={index} className={cn("flex min-w-0 items-center gap-1.5", ours && "justify-end", shown(step > index))}>
              <span
                className={cn(
                  "flex min-w-0 max-w-[88%] items-center gap-1.5 rounded-md px-2 py-1",
                  ours ? "bg-primary/10" : "border border-border bg-background"
                )}
              >
                {!ours ? <span className="shrink-0 font-medium">{message.from}</span> : null}
                {message.file ? (
                  <>
                    {message.file.endsWith(".psd") ? (
                      <img src="/logos/photoshop.svg" alt="" className="size-3.5 shrink-0 rounded-[3px]" />
                    ) : (
                      <FileIcon className="size-3.5 shrink-0 text-primary-text" />
                    )}
                    <span className="truncate font-medium">{message.file}</span>
                  </>
                ) : (
                  <span className="truncate text-muted-foreground">{message.text}</span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      <div className={cn("mt-auto flex flex-wrap items-center gap-1.5", shown(step > v.thread.length - 1))}>
        <span className="rounded-full bg-support/25 px-2 py-0.5 text-[12px] font-medium text-support-text">{v.status}</span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[12px] font-medium">{v.chase}</span>
        <span className="ml-auto flex gap-0.5" title="SLA">
          {v.sla.map((level, index) => (
            <span key={level} className={cn("h-1.5 w-4 rounded-full", index <= v.slaActive ? (index === 0 ? "bg-ok" : "bg-support") : "bg-muted")} />
          ))}
        </span>
      </div>
    </Frame>
  );
}

/** The picture for a workflow: a different product surface for each, never a shared template. */
export function WorkflowVisual({ slug, visual, className }: { slug: WorkflowSlug; visual: WorkflowCopy["visual"]; className?: string }) {
  if (!visual) return <RunPreview slug={slug} className={cn(className, "!p-0 text-[12.5px]")} />;
  switch (slug) {
    case "supplier-followups":
      return <SupplierUpdates v={visual as SupplierUpdatesVisual} className={className} />;
    case "shipment-documents":
      return <DocumentCheck v={visual as DocumentCheckVisual} className={className} />;
    case "production-planning":
      return <Planning v={visual as PlanningVisual} className={className} />;
    case "packaging-quality":
      return <Packaging v={visual as PackagingVisual} className={className} />;
    default:
      return <RunPreview slug={slug} className={cn(className, "!p-0 text-[12.5px]")} />;
  }
}
