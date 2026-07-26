import { useEffect, useRef, useState } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { gsap } from "gsap";
import scrollama from "scrollama";
import {
  ArrowRightIcon,
  ChartLineDownIcon,
  ClockCountdownIcon,
  CurrencyDollarIcon,
  GaugeIcon,
  SealCheckIcon
} from "@phosphor-icons/react";
import { usePrefersReducedMotion } from "@/lib/dotmatrix-hooks";
import { cn } from "@/lib/utils";
import { leakNodes, marginLeakSources, patchList, type LeakNode } from "@/lib/blog/margin-leak";

const categoryClass: Record<LeakNode["category"], string> = {
  commercial: "fill-primary",
  policy: "fill-destructive",
  logistics: "fill-chart-2",
  quality: "fill-support",
  finance: "fill-chart-4"
};

const categoryLabel: Record<LeakNode["category"], string> = {
  commercial: "Commercial",
  policy: "Policy",
  logistics: "Logistics",
  quality: "Quality",
  finance: "Finance"
};

const heroStats = [
  ["$220k", "landed value in the anonymized example"],
  ["10.00c", "planned gross margin per revenue dollar"],
  ["60 bps", "quiet execution leakage before month-end"]
];

function marginLabel(value: number) {
  return `${value.toFixed(2)}c`;
}

function LeakProgressStrip({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="grid grid-cols-11 gap-1" aria-hidden>
      {leakNodes.map((node, index) => (
        <div
          key={node.id}
          className={cn(
            "h-1.5 transition-colors",
            index <= activeIndex ? categoryClass[node.category].replace("fill-", "bg-") : "bg-border"
          )}
        />
      ))}
    </div>
  );
}

function FigurePair({
  light,
  dark,
  alt,
  caption
}: {
  light: string;
  dark: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="overflow-hidden border bg-shell">
      <img src={light} alt={alt} className="aspect-[16/9] w-full object-cover dark:hidden" loading="lazy" />
      <img src={dark} alt={alt} className="hidden aspect-[16/9] w-full object-cover dark:block" loading="lazy" />
      <figcaption className="border-t bg-background p-4 text-xs leading-5 text-foreground/72 dark:text-foreground/82">{caption}</figcaption>
    </figure>
  );
}

function WaterfallChart({ activeIndex }: { activeIndex: number }) {
  const width = 940;
  const height = 500;
  const margin = { top: 48, right: 34, bottom: 92, left: 54 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const domain = ["start", ...leakNodes.map((node) => node.id), "end"];
  const xScale = scaleBand<string>({
    domain,
    range: [0, innerWidth],
    padding: 0.22
  });
  const yScale = scaleLinear<number>({
    domain: [9.36, 10.04],
    range: [innerHeight, 0],
    nice: false
  });
  const bandwidth = xScale.bandwidth();
  const activeNode = leakNodes[activeIndex] ?? leakNodes[0];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Waterfall chart showing a planned 10 cent gross margin falling by 60 basis points to 9.40 cents."
      className="w-full min-w-[42rem]"
    >
      <rect width={width} height={height} className="fill-shell" />
      <Group left={margin.left} top={margin.top}>
        {[10, 9.8, 9.6, 9.4].map((tick) => (
          <g key={tick}>
            <line x1={0} x2={innerWidth} y1={yScale(tick)} y2={yScale(tick)} className="stroke-border" strokeDasharray="4 6" />
            <text x={-12} y={yScale(tick) + 4} textAnchor="end" className="fill-muted-foreground font-mono text-[11px]">
              {marginLabel(tick)}
            </text>
          </g>
        ))}

        <Bar
          x={xScale("start")}
          y={yScale(10)}
          width={bandwidth}
          height={yScale(9.4) - yScale(10)}
          className="fill-foreground/10 stroke-foreground"
          strokeWidth={1.4}
        />
        <text x={(xScale("start") ?? 0) + bandwidth / 2} y={yScale(10) - 14} textAnchor="middle" className="fill-primary font-mono text-xl">
          10.00c
        </text>

        {leakNodes.map((node, index) => {
          const previous = index === 0 ? 10 : leakNodes[index - 1]!.remainingCents;
          const x = xScale(node.id) ?? 0;
          const y = yScale(previous);
          const barHeight = Math.max(2, yScale(node.remainingCents) - yScale(previous));
          const isActive = index === activeIndex;
          return (
            <g key={node.id}>
              <line
                x1={x - bandwidth * 0.42}
                x2={x + bandwidth * 1.42}
                y1={yScale(previous)}
                y2={yScale(previous)}
                className={cn("stroke-muted-foreground", isActive ? "opacity-80" : "opacity-30")}
                strokeDasharray="5 5"
              />
              <Bar
                x={x}
                y={y}
                width={bandwidth}
                height={barHeight}
                className={cn(`margin-leak-bar-${index}`, categoryClass[node.category], isActive ? "opacity-100" : "opacity-55")}
                strokeWidth={isActive ? 2 : 1}
              />
              <text
                x={x + bandwidth / 2}
                y={y - 10}
                textAnchor="middle"
                className={cn("font-mono text-base", isActive ? "fill-primary" : "fill-muted-foreground")}
              >
                -{node.bps}
              </text>
              <text
                x={x + bandwidth / 2}
                y={innerHeight + 28}
                textAnchor="middle"
                className={cn("fill-foreground font-mono text-[11px]", isActive ? "font-semibold" : "")}
              >
                {node.shortLabel}
              </text>
            </g>
          );
        })}

        <Bar
          x={xScale("end")}
          y={yScale(9.4)}
          width={bandwidth}
          height={yScale(9.36) - yScale(9.4)}
          className="fill-primary/20 stroke-primary"
          strokeWidth={1.4}
        />
        <text x={(xScale("end") ?? 0) + bandwidth / 2} y={yScale(9.4) - 14} textAnchor="middle" className="fill-primary font-mono text-xl">
          9.40c
        </text>
        <text x={(xScale("end") ?? 0) + bandwidth / 2} y={innerHeight + 28} textAnchor="middle" className="fill-foreground font-mono text-[11px]">
          END
        </text>

        <g transform={`translate(${innerWidth - 230}, ${innerHeight - 106})`}>
          <rect width="220" height="84" className="fill-background stroke-border" />
          <text x="14" y="24" className="fill-muted-foreground font-mono text-[11px] uppercase tracking-[0.14em]">
            Active leak
          </text>
          <text x="14" y="50" className="fill-foreground text-sm font-semibold">
            {activeNode.label}
          </text>
          <text x="14" y="70" className="fill-primary font-mono text-xs">
            {categoryLabel[activeNode.category]} / -{activeNode.bps} bps / {marginLabel(activeNode.remainingCents)} left
          </text>
        </g>
      </Group>
    </svg>
  );
}

export function MarginLeakScrolly() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeNode = leakNodes[activeIndex] ?? leakNodes[0];

  useEffect(() => {
    const steps = stepRefs.current.filter((step): step is HTMLDivElement => step !== null);
    if (steps.length === 0) {
      return;
    }

    const scroller = scrollama();
    scroller
      .setup({
        step: steps,
        offset: 0.6,
        threshold: 4
      })
      .onStepEnter(({ index }) => {
        setActiveIndex(Math.min(index, leakNodes.length - 1));
      });

    const resize = () => scroller.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      scroller.destroy();
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !chartRef.current) {
      return;
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          `.margin-leak-bar-${activeIndex}`,
          { scaleY: 0.82, opacity: 0.58 },
          { scaleY: 1, opacity: 1, transformOrigin: "50% 0%", duration: 0.34, ease: "power2.out" }
        );
      }, chartRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [activeIndex, prefersReducedMotion]);

  return (
    <section className="grid min-w-0 gap-6 border bg-card p-4 sm:p-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
      <div className="hidden min-w-0 lg:sticky lg:top-24 lg:block" ref={chartRef}>
        <div className="overflow-x-auto border bg-background">
          <WaterfallChart activeIndex={activeIndex} />
        </div>
        <div className="mt-3 grid gap-px bg-border md:grid-cols-[0.72fr_1.28fr]">
          <div className="bg-background p-4">
            <p className="section-label">Active leak</p>
            <p className="mt-3 font-mono text-3xl text-primary">-{activeNode.bps} bps</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-foreground/72 dark:text-foreground/82">
              {marginLabel(activeNode.remainingCents)} margin left
            </p>
          </div>
          <div className="bg-background p-4">
            <h3 className="text-xl font-semibold">{activeNode.label}</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{activeNode.control}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="sticky top-0 z-20 border bg-background/95 p-4 shadow-sm backdrop-blur lg:hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                Leak {String(activeIndex + 1).padStart(2, "0")} / {String(leakNodes.length).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{activeNode.label}</h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-2xl text-primary">-{activeNode.bps}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">bps</p>
            </div>
          </div>
          <div className="mt-4">
            <LeakProgressStrip activeIndex={activeIndex} />
          </div>
          <p className="mt-3 text-xs leading-5 text-foreground/72 dark:text-foreground/82">
            {marginLabel(activeNode.remainingCents)} margin left. {activeNode.control}
          </p>
        </div>
        {leakNodes.map((node, index) => (
          <div
            key={node.id}
            ref={(element) => {
              stepRefs.current[index] = element;
            }}
            className={cn(
              "scroll-mt-28 border bg-background p-5 transition-colors",
              activeIndex === index ? "border-primary bg-primary/5" : "border-border"
            )}
            >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                {String(index + 1).padStart(2, "0")} / {categoryLabel[node.category]}
              </p>
              <p className="font-mono text-sm text-foreground">-{node.bps} bps -&gt; {marginLabel(node.remainingCents)}</p>
            </div>
            <div className="mt-4 grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-3 lg:hidden">
              <div className="font-mono text-2xl text-primary">-{node.bps}</div>
              <div className="h-2 bg-border">
                <div
                  className={cn("h-full", categoryClass[node.category].replace("fill-", "bg-"))}
                  style={{ width: `${Math.max(18, (node.bps / 8) * 100)}%` }}
                />
              </div>
            </div>
            <h3 className="mt-4 text-2xl font-semibold">{node.label}</h3>
            <p className="mt-3 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{node.description}</p>
            <p className="mt-4 border-t pt-3 text-sm leading-6">
              <span className="font-medium text-foreground">Control:</span> <span className="text-foreground/72 dark:text-foreground/82">{node.control}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MarginLeakArticle() {
  return (
    <div className="mt-10 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8">
      <section className="grid min-w-0 gap-px bg-border lg:grid-cols-[0.84fr_1.16fr]">
        <div className="bg-card p-5 sm:p-6">
          <p className="section-label">Unit economics / seafood import desk</p>
          <h2 className="mt-5 text-3xl font-semibold">The market did not blow up. The handoffs did.</h2>
          <p className="mt-5 text-base leading-8 text-foreground/72 dark:text-foreground/82">
            The example is one anonymized 40-foot reefer of farmed vannamei, HLSO 21/25, ex-India to a U.S. East Coast buyer. Planned gross margin was 10.00 cents on the revenue dollar. The desk still leaked 60 basis points across ordinary execution nodes.
          </p>
        </div>
        <div className="grid bg-background p-5 sm:p-6">
          <div className="grid min-w-0 gap-px bg-border sm:grid-cols-3">
            {heroStats.map(([stat, label]) => (
              <div key={stat} className="bg-card p-4">
                <p className="font-mono text-2xl text-primary">{stat}</p>
                <p className="mt-3 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border bg-shell p-4 text-sm leading-6 text-foreground/72 dark:text-foreground/82">
            None of the leaks screamed in month-end P&L. They hid in lower conversion, freight accrual noise, quality deductions, and other landed cost.
          </div>
        </div>
      </section>

      <MarginLeakScrolly />

      <section className="grid gap-px bg-border lg:grid-cols-3">
        {[
          {
            icon: ClockCountdownIcon,
            title: "Elapsed time beats headline freight",
            copy:
              "The counterintuitive leak is detention. Two extra reefer days can beat a week of freight movement on a $220k lot."
          },
          {
            icon: GaugeIcon,
            title: "Deglazed weight is the real unit",
            copy:
              "Gross packed weight is not buyer economics. Quote comparison should normalize to deglazed net kilograms and count protocol."
          },
          {
            icon: CurrencyDollarIcon,
            title: "Cash timing belongs in the quote",
            copy:
              "SOFR, local rates, FX timing, and customer tenor do not disappear because finance books them below gross margin."
          }
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="bg-card p-5 sm:p-6">
            <Icon className="text-primary" size={26} aria-hidden />
            <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
            <p className="mt-4 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{copy}</p>
          </div>
        ))}
      </section>

      <FigurePair
        light="/blog/margin-leak/waterfall-light.png"
        dark="/blog/margin-leak/waterfall-dark.png"
        alt="Blueprint-style seafood import margin waterfall showing a 60 basis point leak."
        caption="A shipment-level view of the same leak: quote validity, detention, deglazed weight, remedy reserve, and finance timing are the five controls that decide whether the file closes clean."
      />

      <section id="where-ai-helps" className="scroll-mt-24 border-t py-8 sm:py-10">
        <h2 className="text-3xl font-semibold">Where AI actually moves the needle</h2>
        <div className="mt-5 grid gap-4 text-base leading-8 text-foreground/72 dark:text-foreground/82">
          <p>
            Not by calling next month’s shrimp price. The high-ROI work is dull: RFQ triage, HS-code guardrails, AD/CVD prompts, document consistency checks, count-size normalization, deglazed-weight claim prep, and free-time exception queues.
          </p>
          <p>
            These are places where public data are structured and the leak is process variability. The AI job is to compress elapsed time and reduce clerical error. The trader still owns the market call.
          </p>
        </div>
      </section>

      <section className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-5">
        {patchList.map((patch, index) => (
          <div key={patch.title} className="bg-background p-5">
            <p className="font-mono text-xs text-primary">PATCH {String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-5 text-xl font-semibold">{patch.title}</h3>
            <p className="mt-4 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{patch.copy}</p>
            <p className="mt-5 border-t pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">{patch.nodes}</p>
          </div>
        ))}
      </section>

      <FigurePair
        light="/blog/margin-leak/deglazed-light.png"
        dark="/blog/margin-leak/deglazed-dark.png"
        alt="Blueprint-style deglazed shrimp inspection card with weight, tolerance, and quality control marks."
        caption="Deglazed economics are the house standard: count, glaze, moisture, and arrival sample evidence all sit on the same operating surface."
      />

      <section id="source-notes" className="scroll-mt-24 border bg-shell p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <SealCheckIcon className="text-primary" aria-hidden />
          <p className="section-label">Source and limitation note</p>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-foreground/72 dark:text-foreground/82">
          This note is an operating synthesis, not legal advice, customs guidance, or an audited industry benchmark. Public data are strongest on freight, remedies, port performance, standards, and short-weight enforcement; RFQ latency and counterparty leakage remain desk-estimate ranges.
        </p>
        <div className="mt-5 grid gap-px bg-border md:grid-cols-2">
          {marginLeakSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="group grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 bg-background p-4 transition-colors hover:bg-card"
            >
              <span className="relative flex size-10 items-center justify-center border bg-shell">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary">{source.faviconLabel}</span>
                <img
                  src={source.favicon}
                  alt=""
                  className="absolute size-5"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              </span>
              <span className="min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">{source.publisher}</span>
                <span className="mt-1 flex items-start gap-2 text-sm font-medium text-foreground">
                  <span className="min-w-0">{source.title}</span>
                  <ArrowRightIcon className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </span>
                <span className="mt-2 block text-xs leading-5 text-foreground/72 dark:text-foreground/82">{source.note}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ChartLineDownIcon className="text-primary" aria-hidden />
          <p className="section-label">Operating takeaway</p>
        </div>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold">Price the file with five live controls: quote clock, free time, deglazed weight, remedy reserve, and tenor.</h2>
      </section>
    </div>
  );
}
