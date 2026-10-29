import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import {
  ArrowUpRightIcon,
  CalculatorIcon,
  CheckIcon,
  EnvelopeSimpleIcon,
  FilePdfIcon,
  FlagIcon,
  LinkSimpleIcon,
  MagnifyingGlassIcon,
  PencilSimpleLineIcon,
} from "@phosphor-icons/react";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

export type RunStep = { icon: string; text: string; time: string };

const icons: Record<string, typeof CheckIcon> = {
  read: EnvelopeSimpleIcon,
  link: LinkSimpleIcon,
  search: MagnifyingGlassIcon,
  calc: CalculatorIcon,
  flag: FlagIcon,
  doc: FilePdfIcon,
  draft: PencilSimpleLineIcon,
};

const STEP_MS = 1150;
const HOLD_MS = 2800;

type Labels = {
  step: string;
  agent: string;
  reads: string;
  review: string;
  approve: string;
  open: string;
  memory?: string;
  links?: string;
  subagents?: string;
};

// Which of the team's apps a step works in: reading starts in the inbox or
// portal, linking and calculating happen against the system of record, checks
// go to the second source. Indexes into `apps`.
const stepApp: Record<string, number> = { read: 0, link: 2, search: 1, calc: 2, flag: 1, doc: 2, draft: 0 };
// How many subagents a step fans out to while it runs.
const stepFanout: Record<string, number> = { read: 3, link: 2, search: 3, calc: 2, flag: 2, doc: 1, draft: 1 };

/**
 * One agent run, as the product would show it: what it is doing now with a
 * clock, step n of N on a segmented bar, the finished steps with their time,
 * and the person's controls once the draft is ready. Replays while on screen;
 * shows the finished run under reduced motion. Re-key it to restart.
 */
export function AgentRun({
  team,
  steps,
  result,
  labels,
  apps = [],
  artifact,
  onDone,
  className,
}: {
  team: string;
  steps: RunStep[];
  result: string;
  labels: Labels;
  /** One favicon URL per app the team uses; each step lights the one it works in. */
  apps?: string[];
  /** The thing the agent is producing, drawn for the current step (0..steps.length). */
  artifact?: (step: number) => ReactNode;
  onDone?: () => void;
  className?: string;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const total = steps.length;
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.35,
    once: false,
  });
  const [step, setStep] = useState(reducedMotion ? total : 0);
  const [clock, setClock] = useState(0);
  const done = step >= total;

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setTimeout(
      () => {
        if (done) onDone?.();
        else setStep((value) => value + 1);
      },
      done ? HOLD_MS : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [inView, reducedMotion, done, step, onDone]);

  useEffect(() => {
    if (!inView || reducedMotion || done) return;
    const tick = window.setInterval(() => setClock((value) => value + 1), 1000);
    return () => window.clearInterval(tick);
  }, [inView, reducedMotion, done]);

  const current = steps[Math.min(step, total - 1)];
  const appFor = (item: RunStep) => (apps.length ? (stepApp[item.icon] ?? 0) % apps.length : -1);
  const usedApps = new Set(steps.slice(0, step + (done ? 0 : 1)).map(appFor));
  const activeApp = done ? -1 : appFor(current);
  const CurrentIcon = icons[current.icon] ?? CheckIcon;

  return (
    <div
      ref={ref}
      className={cn(
        "grid min-w-0 gap-6 rounded-[1.4rem] border border-white/10 bg-foreground p-5 text-background shadow-2xl sm:p-6 dark:border-border dark:bg-card dark:text-foreground",
        artifact && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5">
            {done ? (
              <CheckIcon weight="bold" className="size-4 text-ok-text" />
            ) : (
              <>
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                <span className="size-2 bg-primary" />
              </>
            )}
          </span>
          {!done ? (
            <CurrentIcon className="size-5 shrink-0 opacity-70" />
          ) : null}
          <p
            className={cn(
              "min-w-0 flex-1 truncate text-lg font-medium tracking-[-0.02em]",
              !done && "opacity-80",
            )}
          >
            {done ? result : current.text}
          </p>
          <span className="shrink-0 text-lg tabular-nums opacity-70">
            0:{String(clock).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-[13px] opacity-60">
          <span>
            {labels.agent} · {team}
          </span>
          <span className="tabular-nums">
            {labels.step
              .replace("{{n}}", String(Math.min(step + 1, total)))
              .replace("{{total}}", String(total))}
          </span>
        </div>
        <div
          className="mt-2 grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}
        >
          {steps.map((_, index) => (
            <span
              key={index}
              className="relative h-1.5 overflow-hidden rounded-full bg-white/10 dark:bg-muted"
            >
              <span
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full bg-chart-2",
                  index === step && !done && "run-segment-fill",
                )}
                style={{
                  width:
                    index < step
                      ? "100%"
                      : index === step && !done
                        ? undefined
                        : "0%",
                }}
              />
            </span>
          ))}
        </div>

        <ol className="mt-5 grid gap-1">
          {steps.map((item, index) => {
            const Icon = icons[item.icon] ?? CheckIcon;
            const isDone = index < step;
            const isNow = index === step && !done;
            const app = appFor(item);
            return (
              <li
                key={item.text}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-lg px-1 py-1.5 text-[14px] transition-opacity duration-300",
                  isDone ? "opacity-90" : isNow ? "opacity-100" : "opacity-0",
                )}
              >
                {app >= 0 ? (
                  <span className={cn("relative inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-white transition-shadow", isNow && "ring-2 ring-primary ring-offset-2 ring-offset-foreground dark:ring-offset-card")}>
                    <img src={apps[app]} alt="" className="size-4" loading="lazy" />
                  </span>
                ) : (
                  <Icon className="size-[18px] shrink-0 opacity-70" />
                )}
                <span className={cn("min-w-0 flex-1 truncate", isNow && "opacity-70")}>{item.text}</span>
                {isNow && labels.subagents ? (
                  <span className="hidden shrink-0 items-center gap-1.5 text-[12.5px] opacity-60 sm:inline-flex">
                    <span className="run-fanout" aria-hidden>
                      {Array.from({ length: stepFanout[item.icon] ?? 1 }, (_, dot) => <i key={dot} style={{ animationDelay: `${dot * 160}ms` }} />)}
                    </span>
                    {labels.subagents.replace("{{n}}", String(stepFanout[item.icon] ?? 1))}
                  </span>
                ) : null}
                <span className="shrink-0 text-[13px] tabular-nums opacity-60">
                  {isDone ? item.time : isNow ? "…" : ""}
                </span>
              </li>
            );
          })}
        </ol>

        {labels.memory ? (
          // Each finished step writes its links into memory: a node per step, the newest one pulsing.
          <div className="mb-5 mt-4 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-[12.5px] dark:bg-muted/60">
            <span className="shrink-0 opacity-60">{labels.memory}</span>
            <span className="flex min-w-0 flex-1 items-center">
              {steps.map((_, index) => (
                <span key={index} className="flex min-w-0 flex-1 items-center last:flex-none">
                  <span className={cn("size-2 shrink-0 transition-all duration-500", index < step ? "bg-primary" : "bg-white/15 dark:bg-border", index === step - 1 && !done && "memory-node-new")} />
                  {index < total - 1 ? <span className={cn("h-px flex-1 transition-colors duration-500", index < step - 1 ? "bg-primary/70" : "bg-white/10 dark:bg-border")} /> : null}
                </span>
              ))}
            </span>
            <span className="shrink-0 tabular-nums opacity-70">{labels.links?.replace("{{n}}", String(step * 3))}</span>
          </div>
        ) : (
          <div className="mb-5" />
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 dark:border-border">
          {apps.length ? (
            <span className="mr-auto flex items-center gap-2 text-[13px]">
              <span className="opacity-70">{labels.reads}</span>
              {apps.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "size-5 rounded-[5px] bg-white p-0.5 transition-all duration-300",
                    index === activeApp ? "scale-125 ring-2 ring-primary" : usedApps.has(index) || done ? "opacity-100" : "opacity-35",
                  )}
                />
              ))}
            </span>
          ) : null}
          <span
            className={cn(
              "inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-[14px] transition-opacity dark:border-border",
              !done && "opacity-40",
            )}
          >
            {labels.review}
          </span>
          <span
            className={cn(
              "inline-flex h-9 items-center rounded-full bg-primary px-4 text-[14px] font-medium text-primary-foreground transition-opacity",
              !done && "opacity-40",
            )}
          >
            {labels.approve}
          </span>
          <span className="inline-flex h-9 items-center gap-1.5 px-2 text-[14px] opacity-70">
            {labels.open} <ArrowUpRightIcon className="size-3.5" />
          </span>
        </div>
      </div>
      {artifact ? <div className="min-w-0">{artifact(step)}</div> : null}
    </div>
  );
}
