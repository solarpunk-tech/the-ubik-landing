import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BrainIcon,
  DatabaseIcon,
  GaugeIcon,
  LinkIcon,
  ShieldCheckIcon
} from "@phosphor-icons/react";
import {
  Bar as EvilBar,
  EvilBarChart,
  Grid,
  Tooltip,
  XAxis,
  YAxis
} from "@/components/evilcharts/charts/bar-chart";
import { usePrefersReducedMotion } from "@/lib/dotmatrix-hooks";
import {
  leaderboardSnapshot,
  leaderboardUseCases,
  monitorMetrics,
  monitorSourceLinks,
  monitorSteps,
  providerChips,
  type LeaderboardSnapshotRow,
  type LeaderboardUseCase,
  type MonitorStep
} from "@/lib/blog/ai-monitor-layer";
import { cn } from "@/lib/utils";

const leaderboardChartConfig = {
  score: {
    label: "Use-case score",
    colors: {
      light: ["hsl(var(--primary))"],
      dark: ["hsl(var(--primary))"]
    }
  }
};

const statusIcon: Record<MonitorStep["status"], typeof DatabaseIcon> = {
  input: DatabaseIcon,
  compare: BrainIcon,
  evidence: LinkIcon,
  route: GaugeIcon,
  review: ShieldCheckIcon
};

type LeaderboardChartRow = LeaderboardSnapshotRow & {
  score: number;
};

function FigurePair({
  light,
  dark,
  alt,
  caption,
  aspect = "aspect-[16/9]"
}: {
  light: string;
  dark: string;
  alt: string;
  caption: string;
  aspect?: string;
}) {
  return (
    <figure className="overflow-hidden border bg-shell">
      <img src={light} alt={alt} className={cn("w-full object-contain dark:hidden", aspect)} loading="eager" decoding="async" />
      <img src={dark} alt={alt} className={cn("hidden w-full object-contain dark:block", aspect)} loading="eager" decoding="async" />
      <figcaption className="border-t bg-background p-4 text-xs leading-5 text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

function LeaderboardBenchmarkPanel({
  useCase,
  rows,
  className
}: {
  useCase: LeaderboardUseCase;
  rows: LeaderboardChartRow[];
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]", className)}>
      <div className="min-w-0 border bg-background p-3 sm:p-4">
        <div className="mb-4 grid gap-3 border bg-shell p-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div className="inline-flex w-fit items-center gap-2 border bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <span className="size-2 bg-primary" aria-hidden />
            Snapshot as of May 29, 2026
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{useCase.description}</p>
        </div>
        <div className="h-[22rem] min-w-0 sm:h-[26rem]">
          <EvilBarChart
            config={leaderboardChartConfig}
            data={rows}
            layout="horizontal"
            xDataKey="model"
            barRadius={3}
            barCategoryGap={22}
            animationType="center-out"
            chartProps={{ margin: { top: 10, right: 12, bottom: 4, left: 8 } }}
          >
            <Grid horizontal={false} />
            <XAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="model"
              width={112}
              tick={{ fontSize: 12 }}
            />
            <Tooltip roundness="sm" />
            <EvilBar dataKey="score" isClickable enableHoverHighlight glowing variant="gradient" barProps={{ barSize: 18 }} />
          </EvilBarChart>
        </div>
      </div>
      <div className="grid gap-px bg-border">
        {rows.slice(0, 3).map((row) => (
          <div key={row.model} className="bg-background p-4">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              Arena rank {row.arenaRank} / {row.provider}
            </p>
            <h3 className="mt-3 text-lg font-semibold">{row.model}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.bestUse}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProviderFavicon({ name, domain }: { name: string; domain: string }) {
  return (
    <span className="inline-flex items-center gap-2 border bg-background px-3 py-2 text-xs font-medium">
      <span className="relative flex size-6 items-center justify-center border bg-shell">
        <span className="font-mono text-[8px] uppercase text-primary">{name.slice(0, 2)}</span>
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt=""
          className="absolute size-4"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
      </span>
      {name}
    </span>
  );
}

function MonitorDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const active = monitorSteps[activeIndex] ?? monitorSteps[0];
  const Icon = statusIcon[active.status];

  useEffect(() => {
    if (prefersReducedMotion || !cardRef.current) {
      return;
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".monitor-deck-card",
          { x: 28, rotation: 1.2, autoAlpha: 0.72 },
          { x: 0, rotation: 0, autoAlpha: 1, duration: 0.34, ease: "power2.out", overwrite: "auto" }
        );
        gsap.fromTo(
          ".monitor-deck-chip",
          { y: 8, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.22, ease: "power1.out", stagger: 0.035, overwrite: "auto" }
        );
      }, cardRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [activeIndex, prefersReducedMotion]);

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + monitorSteps.length) % monitorSteps.length);
  };

  return (
    <section className="grid min-w-0 gap-5 border bg-card p-4 sm:p-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
      <div>
        <p className="section-label">Swipe / click monitor deck</p>
        <h2 className="mt-3 text-3xl font-semibold">Evidence routing should feel like moving one decision card at a time.</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          The old static evidence chain becomes an operator control: advance the card, inspect the evidence question, then decide whether the row moves, waits, or escalates.
        </p>
        <div className="mt-6 hidden gap-2 md:grid">
          {monitorSteps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 border p-3 text-left text-sm transition-colors",
                activeIndex === index ? "border-primary bg-primary/10" : "bg-background hover:bg-shell"
              )}
            >
              <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
              <span className="truncate">{step.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div
        ref={cardRef}
        className="min-w-0"
        onTouchStart={(event) => {
          touchStartRef.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStartRef.current;
          const end = event.changedTouches[0]?.clientX;
          touchStartRef.current = null;
          if (start == null || end == null || Math.abs(start - end) < 36) {
            return;
          }
          move(start > end ? 1 : -1);
        }}
      >
        <div className="monitor-deck-card min-h-[28rem] border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">{active.kicker}</p>
              <h3 className="mt-5 max-w-xl text-3xl font-semibold">{active.title}</h3>
            </div>
            <span className="monitor-deck-chip flex size-12 shrink-0 items-center justify-center border bg-shell text-primary">
              <Icon size={24} aria-hidden />
            </span>
          </div>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">{active.copy}</p>
          <div className="mt-8 border bg-shell p-4">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Operator question</p>
            <p className="mt-3 text-xl font-semibold">{active.operatorQuestion}</p>
          </div>
          <div className="mt-6 grid grid-cols-6 gap-1" aria-hidden>
            {monitorSteps.map((step, index) => (
              <span
                key={step.id}
                className={cn("monitor-deck-chip h-2", index <= activeIndex ? "bg-primary" : "bg-border")}
              />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={() => move(-1)} className="inline-flex items-center gap-2 border bg-card px-4 py-2 text-sm font-medium hover:bg-shell">
              <ArrowLeftIcon aria-hidden /> Previous
            </button>
            <button type="button" onClick={() => move(1)} className="inline-flex items-center gap-2 border bg-card px-4 py-2 text-sm font-medium hover:bg-shell">
              Next <ArrowRightIcon aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderboardSnapshot() {
  const [activeUseCaseId, setActiveUseCaseId] = useState(leaderboardUseCases[0].id);
  const activeUseCase = leaderboardUseCases.find((useCase) => useCase.id === activeUseCaseId) ?? leaderboardUseCases[0];
  const chartRows = useMemo(
    () =>
      leaderboardSnapshot
        .map((row) => ({ ...row, score: row[activeUseCaseId] }))
        .sort((a, b) => b.score - a.score),
    [activeUseCaseId]
  );

  return (
    <section id="leaderboards" className="scroll-mt-24 border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="section-label">Arena snapshot / as of May 29, 2026</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold">
            The public leaderboard is the shortlist. The trade workflow score decides the router.
          </h2>
        </div>
        <a href="https://arena.ai/leaderboard/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border bg-background px-4 py-2 text-sm font-medium hover:bg-shell">
          Open Arena <ArrowRightIcon aria-hidden />
        </a>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {providerChips.map((provider) => (
          <ProviderFavicon key={provider.name} {...provider} />
        ))}
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
        Recreated from the free public Arena leaderboard view, then remapped for seafood operators: evidence work, routing work, and overall fit for messy supplier files. The point is not to crown one model. It is to make frontier intelligences easy to assign to the right job.
      </p>
      <div className="mt-5 grid gap-2 lg:hidden" role="tablist" aria-label="Arena use cases">
        {leaderboardUseCases.map((useCase) => (
          <div key={useCase.id}>
            <button
              type="button"
              role="tab"
              aria-selected={activeUseCaseId === useCase.id}
              onClick={() => setActiveUseCaseId(useCase.id)}
              className={cn(
                "w-full border p-3 text-left transition-colors",
                activeUseCaseId === useCase.id ? "border-primary bg-primary/10" : "bg-background hover:bg-shell"
              )}
            >
              <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-primary">{useCase.kicker}</span>
              <span className="mt-2 block text-sm font-semibold">{useCase.label}</span>
            </button>
            {activeUseCaseId === useCase.id ? (
              <LeaderboardBenchmarkPanel useCase={activeUseCase} rows={chartRows} className="mt-3" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-5 hidden gap-2 lg:grid lg:grid-cols-4" role="tablist" aria-label="Arena use cases">
        {leaderboardUseCases.map((useCase) => (
          <button
            key={useCase.id}
            type="button"
            role="tab"
            aria-selected={activeUseCaseId === useCase.id}
            onClick={() => setActiveUseCaseId(useCase.id)}
            className={cn(
              "border p-3 text-left transition-colors",
              activeUseCaseId === useCase.id ? "border-primary bg-primary/10" : "bg-background hover:bg-shell"
            )}
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-primary">{useCase.kicker}</span>
            <span className="mt-2 block text-sm font-semibold">{useCase.label}</span>
          </button>
        ))}
      </div>
      <LeaderboardBenchmarkPanel useCase={activeUseCase} rows={chartRows} className="mt-6 hidden lg:grid" />
    </section>
  );
}

function SourceLinks() {
  return (
    <section id="sources" className="border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="size-2.5 bg-primary" aria-hidden />
        <p className="section-label">Sources</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {monitorSourceLinks.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-2 border bg-background px-3 py-2 text-sm font-medium hover:bg-shell focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Open ${source.publisher}: ${source.title}`}
          >
            <span className="relative flex size-6 items-center justify-center border bg-shell">
              <span className="font-mono text-[8px] uppercase text-primary">{source.publisher.slice(0, 2)}</span>
              <img
                src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=64`}
                alt=""
                className="absolute size-4"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.hidden = true;
                }}
              />
            </span>
            {source.publisher}
            <span className="pointer-events-none absolute bottom-full left-0 z-20 mb-3 hidden w-72 border bg-background p-3 text-left shadow-xl group-hover:block group-focus:block sm:w-80">
              <span className="block aspect-[16/9] overflow-hidden border bg-shell">
                <img src={source.image} alt="" className="h-full w-full object-contain" loading="lazy" />
              </span>
              <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.12em] text-primary">{source.publisher}</span>
              <span className="mt-1 block text-sm font-semibold text-foreground">{source.title}</span>
              <span className="mt-2 block text-xs leading-5 text-muted-foreground">{source.note}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function AiMonitorLayerArticle() {
  return (
    <div className="mt-10 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8">
      <section className="grid min-w-0 gap-px bg-border lg:grid-cols-[0.86fr_1.14fr]">
        <div className="bg-card p-5 sm:p-6">
          <p className="section-label">Case study / seafood entity enrichment</p>
          <h2 className="mt-5 text-3xl font-semibold">The failure mode was not a bad answer. It was unsupported confidence entering work.</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            We gave two AI workflows the same seafood exhibitor list and asked for the headquarters or primary operating country. The task looked like enrichment. In practice, it tested whether AI could preserve enough evidence to be trusted inside routing, segmentation, compliance, and outreach.
          </p>
        </div>
        <div className="grid bg-background p-5 sm:p-6">
          <div className="grid gap-px bg-border sm:grid-cols-3">
            {monitorMetrics.map((metric) => (
              <div key={metric.value} className="bg-card p-4">
                <p className="font-mono text-3xl text-primary">{metric.value}</p>
                <p className="mt-3 text-sm font-medium leading-6">{metric.label}</p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{metric.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border bg-shell p-4 text-sm leading-6 text-muted-foreground">
            Adoption gets easier when the system explains where to trust, where to verify, and where to stop. That is the monitor layer.
          </div>
        </div>
      </section>

      <section id="reasoning-leakage" className="scroll-mt-24 border-t py-8 sm:py-10">
        <h2 className="text-3xl font-semibold">From margin leakage to reasoning leakage</h2>
        <div className="mt-5 grid gap-4 text-base leading-8 text-muted-foreground">
          <p>
            The earlier margin note showed how quiet handoff errors erode a seafood file. This note is the AI version: a plausible country tag, missing source context, or overconfident inference can bend routing before anyone sees the weakness.
          </p>
          <p>
            A seafood company can farm in one country, process in another, invoice from a third, and sell through a distributor in a fourth. The field called country is not trivia. It is an operating inference.
          </p>
        </div>
      </section>

      <FigurePair
        light="/blog/ai-monitor-layer/reasoning-leakage-light.png"
        dark="/blog/ai-monitor-layer/reasoning-leakage-dark.png"
        alt="Country signal proof matrix showing seafood entity clues, evidence classes, confidence, and routing decisions."
        caption="A country tag only becomes operational state when the system can show whether the evidence proves headquarters, farm origin, processor base, exporter signal, or only a sales presence."
        aspect="aspect-[4/3]"
      />

      <MonitorDeck />
      <LeaderboardSnapshot />

      <FigurePair
        light="/blog/ai-monitor-layer/routing-friction-light.png"
        dark="/blog/ai-monitor-layer/routing-friction-dark.png"
        alt="Corridor workflow matrix showing AI-assisted seafood operations moving through evidence, routing, and operator review lanes."
        caption="The right monitor does not slow every row. It adds friction to the rows where weak evidence, disagreement, or ambiguity would otherwise leak into the operation."
      />

      <section id="operator-layer" className="scroll-mt-24 border-t py-8 sm:py-10">
        <h2 className="text-3xl font-semibold">What this means for seafood operators</h2>
        <div className="mt-5 grid gap-4 text-base leading-8 text-muted-foreground">
          <p>
            The lesson is not that every task needs two LLMs. The lesson is that every AI-assisted decision needs a monitor appropriate to its risk. Low-risk enrichment can move with agreement and evidence. Medium-risk workflows need disagreement queues. High-risk workflows need direct source traceability and human sign-off.
          </p>
          <p>
            Ubik’s job is to make that practical: read messy trade context, preserve evidence, compare competing answers, route exceptions, remember corrections, and keep the operator in control when the decision matters.
          </p>
        </div>
      </section>

      <FigurePair
        light="/blog/ai-monitor-layer/fragmented-truth-light.png"
        dark="/blog/ai-monitor-layer/fragmented-truth-dark.png"
        alt="Strategic monitor layer stack showing model choice, evidence control, workflow routing, and operator review."
        caption="Seafood is a hard AI environment because truth is split across inboxes, spreadsheets, PDFs, ERP, WhatsApp, inspection documents, and human memory."
      />

      <section className="border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="size-2.5 bg-primary" aria-hidden />
          <p className="section-label">Final takeaway</p>
        </div>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold">AI transformation gets practical when frontier models meet forward-deployed trade expertise.</h2>
        <div className="mt-6 grid gap-px bg-border sm:grid-cols-3">
          {[
            ["Route the model", "Use the right frontier intelligence for research, extraction, exception review, planning, customer updates, or compliance support."],
            ["Deploy the operator layer", "Ubik brings seafood context, workflow design, evidence routing, and continuous improvement into the day-to-day system."],
            ["Lower the transformation cost", "Teams get operating discipline associated with elite consulting and platform work, without waiting for a massive transformation program."]
          ].map(([title, copy]) => (
            <div key={title} className="bg-background p-4">
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <SourceLinks />
    </div>
  );
}
