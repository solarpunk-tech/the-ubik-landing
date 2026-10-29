import { useEffect, useState } from "react";
import { CheckIcon, PaperPlaneTiltIcon, PaperclipIcon, WarningIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import {
  workflowRuns,
  type ApproveScreen,
  type CompareScreen,
  type DraftScreen,
  type ListScreen,
  type Pill,
  type RunScreen,
  type WorkflowRunData
} from "@/lib/workflow-runs";
import type { WorkflowSlug, WorkflowStep } from "@/lib/workflows";

const STEP_MS = 5600;
const PHASE_MS = 1700;

const toneClass: Record<Pill["tone"], string> = {
  ok: "bg-primary/12 text-primary-text",
  warn: "bg-support/15 text-support-foreground",
  bad: "bg-destructive/12 text-destructive",
  muted: "bg-muted text-muted-foreground"
};

function PillTag({ pill, className }: { pill: Pill; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors duration-500", toneClass[pill.tone], className)}>
      {pill.tone === "ok" ? <CheckIcon aria-hidden weight="bold" /> : pill.tone === "bad" ? <WarningIcon aria-hidden weight="bold" /> : null}
      {pill.text}
    </span>
  );
}

const reveal = (on: boolean) => cn("transition-all duration-500", on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0");
const label = "text-[12px] font-semibold text-muted-foreground";

function ListPanel({ s, phase }: { s: ListScreen; phase: number }) {
  return (
    <div className={cn("grid gap-4", s.side && "lg:grid-cols-[1.3fr_1fr]")}>
      <div>
        <p className={label}>{s.title}</p>
        <ul className="mt-2 grid gap-2">
          {s.rows.map((row, index) => (
            <li key={row.title} className="run-row rounded-xl border border-border p-3" style={{ animationDelay: `${index * 180}ms` }}>
              <p className="flex items-center gap-2 text-[13px] font-medium">
                {row.icon ? <img src={row.icon} alt="" className="size-3.5 shrink-0 object-contain" /> : null}
                <span className="min-w-0 flex-1 truncate">{row.title}</span>
                {!row.reason ? <PillTag pill={row.pill} className={reveal(phase >= 1)} /> : null}
              </p>
              {row.meta ? <p className="mt-1 text-[12px] text-muted-foreground">{row.meta}</p> : null}
              {row.files ? (
                <p className="mt-1.5 flex flex-wrap gap-1">
                  {row.files.map((file) => (
                    <span key={file} className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">
                      <PaperclipIcon aria-hidden className="size-3" /> {file}
                    </span>
                  ))}
                </p>
              ) : null}
              {row.reason ? (
                <p className={cn("mt-2 flex flex-wrap items-center gap-2 text-[12px]", reveal(phase >= 1))}>
                  <PillTag pill={row.pill} />
                  <span className="text-muted-foreground">{row.reason}</span>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      {s.side ? (
        <div>
          <p className={label}>{s.side.title}</p>
          <ul className="mt-2 grid gap-1.5">
            {s.side.items.map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-[12.5px]">
                {item.label}
                <PillTag pill={phase >= 2 ? item.after : item.before} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ComparePanel({ s, phase }: { s: CompareScreen; phase: number }) {
  return (
    <div>
      <p className={label}>{s.title}</p>
      <div className="mt-2 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[28rem] text-left text-[12.5px]">
          <thead className="bg-secondary/50 text-[11px] text-muted-foreground">
            <tr>
              {[...s.columns, ""].map((head, index) => <th key={`${head}-${index}`} className="px-3 py-2 font-medium">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {s.rows.map((row) => {
              const hot = phase >= 1 && row.verdict.tone === "bad";
              return (
                <tr key={row.cells.join("|")} className={cn("border-t border-border transition-colors duration-500", hot && "bg-destructive/[0.06]")}>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className={cn("px-3 py-2.5", cellIndex === 0 ? "font-medium" : "font-mono tabular-nums", hot && row.flag === cellIndex && "font-semibold text-destructive")}>
                      {cell}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-right">
                    <PillTag pill={row.verdict} className={reveal(phase >= 1)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {s.finding ? (
        <div
          className={cn(
            "mt-3 flex flex-wrap items-center gap-2 rounded-xl border p-3 text-[12.5px]",
            s.finding.tone === "warn" ? "border-support/50 bg-support/[0.08]" : "border-destructive/40 bg-destructive/[0.05]",
            reveal(phase >= 2)
          )}
        >
          <PillTag pill={{ text: s.finding.severity, tone: s.finding.tone ?? "bad" }} />
          <span className="font-medium">{s.finding.text}</span>
          <span className="ml-auto rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">{s.finding.owner}</span>
        </div>
      ) : null}
    </div>
  );
}

function DraftPanel({ s, phase }: { s: DraftScreen; phase: number }) {
  return (
    <div className="rounded-xl border border-border">
      <div className="grid gap-1 border-b border-border px-4 py-3 text-[12.5px]">
        <p><span className="inline-block w-16 text-muted-foreground">To</span> {s.to}</p>
        <p><span className="inline-block w-16 text-muted-foreground">Subject</span> {s.subject}</p>
      </div>
      <div className="grid gap-2 px-4 py-3 text-[13px] leading-6">
        {s.body.map((line) => <p key={line}>{line}</p>)}
        {s.attached ? <p className="flex items-center gap-1.5 text-muted-foreground"><PaperclipIcon aria-hidden className="size-3.5" /> {s.attached}</p> : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-secondary/40 px-4 py-3">
        <p className="text-[12px] text-muted-foreground">{s.note}</p>
        {phase >= 2 ? (
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary-text"><CheckIcon aria-hidden weight="bold" /> {s.sent}</span>
        ) : (
          <Button size="sm" className={cn(phase === 1 && "ring-2 ring-primary ring-offset-2 ring-offset-card")}>
            <PaperPlaneTiltIcon data-icon="inline-start" aria-hidden /> {s.send}
          </Button>
        )}
      </div>
    </div>
  );
}

function ApprovePanel({ s, phase }: { s: ApproveScreen; phase: number }) {
  return (
    <div className={cn("grid gap-4", s.side && "lg:grid-cols-2")}>
      <div className="rounded-xl border border-border p-4">
        <p className="flex items-center justify-between gap-2 text-[13px] font-semibold">
          {s.title} {s.badge ? <Badge variant="outline" className="rounded-md font-mono">{s.badge}</Badge> : null}
        </p>
        <ul className="mt-3 grid gap-1.5 text-[12.5px]">
          {s.checks.map((line, index) => (
            <li key={line} className={cn("flex items-start gap-2", reveal(phase >= 1 || index === 0))} style={{ transitionDelay: `${index * 140}ms` }}>
              <CheckIcon aria-hidden weight="bold" className="mt-0.5 shrink-0 text-primary-text" /> {line}
            </li>
          ))}
        </ul>
        {phase >= 2 ? (
          <p className="mt-4 flex items-center gap-1.5 text-[12.5px] font-medium text-primary-text"><CheckIcon aria-hidden weight="bold" /> {s.done}</p>
        ) : (
          <Button size="sm" className={cn("mt-4 w-full", phase === 1 && "ring-2 ring-primary ring-offset-2 ring-offset-card")}>{s.button}</Button>
        )}
        {s.footnote ? <p className="mt-3 text-[11px] leading-4 text-muted-foreground">{s.footnote}</p> : null}
      </div>
      {s.side ? (
        <div className={cn("rounded-xl border border-border p-4", reveal(phase >= 1))}>
          <p className="flex items-center gap-2 text-[13px] font-semibold">{s.side.icon ? <img src={s.side.icon} alt="" className="size-4 object-contain" /> : null} {s.side.title}</p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[12.5px]">
            {s.side.rows.map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="min-w-0 break-words">{value}</dd>
              </div>
            ))}
          </dl>
          {phase >= 2 ? (
            <p className="mt-4 flex items-center gap-1.5 text-[12.5px] font-medium text-primary-text"><CheckIcon aria-hidden weight="bold" /> {s.side.done}</p>
          ) : (
            <Button size="sm" variant="outline" className="mt-4 w-full">{s.side.button}</Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Screen({ screen, phase }: { screen: RunScreen; phase: number }) {
  switch (screen.kind) {
    case "list":
      return <ListPanel s={screen} phase={phase} />;
    case "compare":
      return <ComparePanel s={screen} phase={phase} />;
    case "draft":
      return <DraftPanel s={screen} phase={phase} />;
    case "approve":
      return <ApprovePanel s={screen} phase={phase} />;
  }
}

/** The product window: app name, the record, its status. */
function Frame({ run, children, className }: { run: WorkflowRunData; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-xl", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/50 px-4 py-2.5">
        <p className="flex min-w-0 items-center gap-2 text-[12.5px] text-muted-foreground">
          <span aria-hidden className="size-2.5 shrink-0 bg-primary" />
          <span className="truncate">{run.app}</span> <span aria-hidden>/</span>
          <span className="truncate font-mono font-medium text-foreground">{run.ref}</span>
        </p>
        <span className="flex shrink-0 gap-1.5">
          {run.badges.map((badge, index) => (
            <Badge key={badge} variant={index === 0 ? "outline" : "secondary"} className="rounded-md">{badge}</Badge>
          ))}
        </span>
      </div>
      {children}
    </div>
  );
}

/** A still of the workflow's first screen, for cards and heroes that have no picture of their own. */
export function RunPreview({ slug, className }: { slug: WorkflowSlug; className?: string }) {
  const run = workflowRuns[slug];
  return (
    <Frame run={run} className={cn("text-left", className)}>
      <div className="p-4">
        <Screen screen={run.screens[0]} phase={2} />
      </div>
    </Frame>
  );
}

/** How it runs, as the product shows it: the steps on the left drive the screen on the right. */
export function WorkflowRun({ slug, steps, title }: { slug: WorkflowSlug; steps: WorkflowStep[]; title: string }) {
  const run = workflowRuns[slug];
  const reducedMotion = Boolean(useReducedMotion());
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(reducedMotion ? 2 : 0);
  const [paused, setPaused] = useState(false);
  const shown = reducedMotion ? 2 : phase;

  useEffect(() => {
    if (reducedMotion || !inView) return;
    if (phase === 2 && paused) return;
    const timer = window.setTimeout(() => {
      if (phase < 2) setPhase(phase + 1);
      else {
        setActive((value) => (value + 1) % steps.length);
        setPhase(0);
      }
    }, phase < 2 ? PHASE_MS : STEP_MS - PHASE_MS * 2);
    return () => window.clearTimeout(timer);
  }, [phase, paused, inView, reducedMotion, steps.length]);

  return (
    <div ref={ref} className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
      <div>
        <h2 className="text-2xl font-semibold tracking-[-0.02em]">{title}</h2>
        <ol className="mt-6 grid gap-2" role="tablist" aria-label={title}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <button
                type="button"
                role="tab"
                aria-selected={index === active}
                onClick={() => {
                  setActive(index);
                  setPhase(reducedMotion ? 2 : 0);
                  setPaused(true);
                }}
                className={cn(
                  "relative grid w-full grid-cols-[2rem_1fr] gap-x-2 overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  index === active ? "border-primary/50 bg-card shadow-sm" : "border-transparent hover:bg-card/60"
                )}
              >
                <span className="tabular-nums text-[12.5px] font-medium text-primary-text">0{index + 1}</span>
                <span>
                  <span className={cn("block text-lg font-semibold tracking-[-0.02em]", index !== active && "text-muted-foreground")}>{step.title}</span>
                  {index === active ? <span className="mt-1 block text-sm leading-6 text-muted-foreground">{step.copy}</span> : null}
                </span>
                {index === active && !paused && !reducedMotion ? (
                  <span key={active} aria-hidden className="run-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary" style={{ animationDuration: `${STEP_MS}ms` }} />
                ) : null}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="min-w-0" role="tabpanel">
        <Frame run={run}>
          <div className="min-h-[22rem] p-4 sm:p-5">
            <Screen key={active} screen={run.screens[active]} phase={shown} />
          </div>
        </Frame>
      </div>
    </div>
  );
}
