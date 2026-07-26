import { useMemo, useState } from "react";
import { FishSimpleIcon } from "@phosphor-icons/react";
import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countries110m from "world-atlas/countries-110m.json";
import { cn } from "@/lib/utils";
import {
  decisionRows,
  flowData,
  originFilters,
  originProfiles,
  tariffCells,
  type FlowDatum,
  type OriginProfile
} from "@/lib/blog/origin-roulette";

type FilterValue = (typeof originFilters)[number];

const bracketClass: Record<FlowDatum["tariffBracket"], string> = {
  "0%": "stroke-primary",
  "1-5%": "stroke-chart-2",
  "5-15%": "stroke-support",
  "15%+": "stroke-chart-4",
  blocked: "stroke-destructive"
};

const bracketText: Record<FlowDatum["tariffBracket"], string> = {
  "0%": "0%",
  "1-5%": "1-5%",
  "5-15%": "5-15%",
  "15%+": "15%+",
  blocked: "Blocked"
};

const worldFeatures = feature(
  countries110m as unknown as Topology<{ countries: GeometryCollection }>,
  (countries110m as unknown as Topology<{ countries: GeometryCollection }>).objects.countries
);

function projectArc(flow: FlowDatum, projection: ReturnType<typeof geoRobinson>) {
  const start = projection(flow.from);
  const end = projection(flow.to);

  if (!start || !end) {
    return "";
  }

  const [x1, y1] = start;
  const [x2, y2] = end;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const curve = Math.max(34, Math.min(150, Math.abs(dx) * 0.28 + Math.abs(dy) * 0.16));
  const cx = x1 + dx * 0.5;
  const cy = y1 + dy * 0.5 - curve;

  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

function nodePosition(origin: OriginProfile, projection: ReturnType<typeof geoRobinson>) {
  return projection(origin.coordinates);
}

export function OriginPortraitRail() {
  const [filter, setFilter] = useState<FilterValue>("All");
  const filteredOrigins = useMemo(
    () => originProfiles.filter((origin) => filter === "All" || origin.filter === filter),
    [filter]
  );
  const [selectedId, setSelectedId] = useState<OriginProfile["id"]>("ecuador");
  const selected = filteredOrigins.find((origin) => origin.id === selectedId) ?? filteredOrigins[0] ?? originProfiles[0];

  return (
    <section className="min-w-0 border bg-card">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-px bg-border lg:grid-cols-[0.92fr_1.08fr]">
        <div className="min-w-0 bg-card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 border bg-background px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground/72 dark:text-foreground/82">
              <FishSimpleIcon className="text-primary" aria-hidden />
              Origin filter
            </div>
            {originFilters.map((item) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "border px-3 py-2 text-xs font-medium transition-colors",
                  filter === item ? "bg-primary text-primary-foreground" : "bg-background text-foreground/72 dark:text-foreground/82 hover:text-foreground"
                )}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-5 flex w-full min-w-0 snap-x gap-3 overflow-x-auto pb-3 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0">
            {filteredOrigins.map((origin) => (
              <button
                key={origin.id}
                type="button"
                className={cn(
                  "min-w-56 snap-start border bg-background p-3 text-left transition-colors hover:bg-shell",
                  selected.id === origin.id && "border-primary bg-primary/5"
                )}
                onClick={() => setSelectedId(origin.id)}
              >
                <p className="font-mono text-xs text-primary">{origin.stamp}</p>
                <h3 className="mt-3 text-xl font-semibold">{origin.name}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{origin.role}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] bg-background sm:grid-cols-[0.92fr_1.08fr]">
          <div className="min-w-0 flex items-center justify-center bg-shell p-5">
            <img
              src={selected.lightImage}
              alt={`${selected.name} shrimp origin portrait`}
              className="max-h-[32rem] w-full max-w-sm object-contain dark:hidden"
              loading="lazy"
            />
            <img
              src={selected.darkImage}
              alt={`${selected.name} shrimp origin portrait`}
              className="hidden max-h-[32rem] w-full max-w-sm object-contain dark:block"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 p-5 sm:p-6">
            <p className="section-label">{selected.shortName} origin desk</p>
            <h2 className="mt-3 text-3xl font-semibold">{selected.name}</h2>
            <p className="mt-2 font-mono text-sm text-primary">{selected.stat}</p>
            <p className="mt-5 text-base leading-8 text-foreground/72 dark:text-foreground/82">{selected.details}</p>
            <div className="mt-6 grid gap-3 text-sm leading-6">
              <p><span className="font-medium text-foreground">Buy when:</span> {selected.buyWhen}</p>
              <p><span className="font-medium text-foreground">Avoid when:</span> {selected.avoidWhen}</p>
              <p><span className="font-medium text-foreground">Watch for:</span> {selected.watchFor}</p>
              <p className="border-t pt-3 font-mono text-xs uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">{selected.tariffNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OriginFlowMap() {
  const [activeFlow, setActiveFlow] = useState<FlowDatum | null>(flowData[0]);
  const projection = useMemo(() => geoRobinson().fitSize([940, 460], worldFeatures), []);
  const path = useMemo(() => geoPath(projection), [projection]);
  const maxFlow = Math.max(...flowData.map((flow) => flow.metricTons));

  return (
    <section className="min-w-0 overflow-hidden border bg-card">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-px bg-border lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-label">Origin to destination flow map</p>
              <h2 className="mt-2 text-3xl font-semibold">Where the tonnage is moving</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">
              {Object.entries(bracketText).slice(0, 4).map(([key, label]) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <span className={cn("size-2 bg-current", bracketClass[key as FlowDatum["tariffBracket"]].replace("stroke-", "text-"))} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg viewBox="0 0 940 460" role="img" aria-label="World map showing shrimp origin to destination flow lines by tariff bracket" className="min-w-[46rem]">
              <rect width="940" height="460" className="fill-shell" />
              <g>
                {worldFeatures.features.map((country, index) => (
                  <path key={index} d={path(country) ?? ""} className="fill-card stroke-border" strokeWidth={0.55} />
                ))}
              </g>
              <g>
                {flowData.map((flow) => (
                  <path
                    key={`${flow.origin}-${flow.destination}`}
                    d={projectArc(flow, projection)}
                    className={cn("fill-none transition-opacity", bracketClass[flow.tariffBracket])}
                    strokeWidth={1.8 + (flow.metricTons / maxFlow) * 9}
                    strokeLinecap="round"
                    opacity={activeFlow && activeFlow !== flow ? 0.24 : 0.78}
                    onMouseEnter={() => setActiveFlow(flow)}
                    onFocus={() => setActiveFlow(flow)}
                    tabIndex={0}
                  />
                ))}
              </g>
              <g>
                {originProfiles.map((origin) => {
                  const point = nodePosition(origin, projection);
                  if (!point) return null;
                  return (
                    <g key={origin.id} transform={`translate(${point[0]},${point[1]})`}>
                      <circle r="4.5" className="fill-primary stroke-background" strokeWidth="2" />
                      <text x="8" y="4" className="fill-foreground font-mono text-[11px]">{origin.shortName}</text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
        <aside className="min-w-0 bg-card p-5">
          <p className="section-label">Selected lane</p>
          <h3 className="mt-4 text-2xl font-semibold">
            {activeFlow ? `${activeFlow.origin} -> ${activeFlow.destination}` : "Hover a lane"}
          </h3>
          {activeFlow ? (
            <div className="mt-5 grid gap-4 text-sm leading-6">
              <p className="font-mono text-primary">{activeFlow.metricTons.toLocaleString()} MT</p>
              <p className="text-foreground/72 dark:text-foreground/82">Duty-stack bracket: {bracketText[activeFlow.tariffBracket]}</p>
              <p className="text-foreground/72 dark:text-foreground/82">Status stamp: {activeFlow.status}</p>
            </div>
          ) : null}
          <div className="mt-6 border-t pt-4 text-xs leading-5 text-foreground/72 dark:text-foreground/82">
            Line weights use 2025/early-2026 origin-flow figures and desk-normalized public trade references for visual comparison.
          </div>
        </aside>
      </div>
      <div className="border-t bg-background p-4 lg:hidden">
        <div className="grid gap-2 text-xs">
          {flowData.slice(0, 6).map((flow) => (
            <div key={`${flow.origin}-${flow.destination}-mobile`} className="flex justify-between gap-3 border-b pb-2">
              <span>{flow.origin} to {flow.destination}</span>
              <span className="font-mono text-primary">{flow.metricTons.toLocaleString()} MT</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TariffDifferentialMatrix() {
  const origins = Array.from(new Set(tariffCells.map((cell) => cell.origin)));
  const destinations = Array.from(new Set(tariffCells.map((cell) => cell.destination)));
  const cheapestByDestination = Object.fromEntries(
    destinations.map((destination) => [
      destination,
      Math.min(...tariffCells.filter((cell) => cell.destination === destination).map((cell) => cell.effective))
    ])
  );

  return (
    <section className="min-w-0 border bg-card">
      <div className="border-b p-5 sm:p-6">
        <p className="section-label">Duty-stack matrix</p>
        <h2 className="mt-2 text-3xl font-semibold">Landed-duty exposure by origin and market</h2>
      </div>
      <div className="w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[58rem] table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-36" />
            {destinations.map((destination) => (
              <col key={destination} className="w-52" />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-shell text-left">
              <th className="border-b px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">Origin</th>
              {destinations.map((destination) => (
                <th key={destination} className="border-b px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">{destination}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {origins.map((origin) => (
              <tr key={origin}>
                <th className="border-b px-4 py-4 text-left font-medium">{origin}</th>
                {destinations.map((destination) => {
                  const cell = tariffCells.find((item) => item.origin === origin && item.destination === destination);
                  if (!cell) return <td key={destination} className="border-b p-3" />;
                  const delta = cell.effective - cheapestByDestination[destination];
                  const tone =
                    delta === 0
                      ? "bg-primary text-primary-foreground"
                      : delta <= 5
                        ? "bg-primary/10 text-foreground"
                        : delta <= 15
                          ? "bg-support/25 text-foreground"
                          : "bg-destructive/15 text-foreground";
                  return (
                    <td key={destination} className="border-b p-3 align-top">
                      <div className={cn("flex min-h-28 flex-col justify-between p-4", tone)}>
                        <p className="break-words font-mono text-xl leading-tight">{cell.label ?? `${cell.effective}%`}</p>
                        {cell.note ? <p className="mt-4 text-xs leading-5 opacity-80">{cell.note}</p> : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t p-4 text-xs leading-5 text-foreground/72 dark:text-foreground/82">
        Updated 18 May 2026; U.S. cells are modeled as duty stacks, not single country tariffs. Base MFN duty can be 0% for common raw frozen shrimp lines, while Section 122 status, trade-framework implementation, AD/CVD cash deposits, China Section 301 exposure, and product-specific carveouts can still change importer cash cost.
      </p>
    </section>
  );
}

export function DecisionTreeTable() {
  return (
    <section className="min-w-0 border bg-card">
      <div className="border-b p-5 sm:p-6">
        <p className="section-label">Decision tree</p>
        <h2 className="mt-2 text-3xl font-semibold">Origin optimisation for specific books</h2>
      </div>
      <div className="w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[54rem] border-collapse text-sm">
          <thead className="bg-shell text-left">
            <tr>
              {["Species", "Count", "End-market", "Window", "Certification", "Optimal origin", "Rationale"].map((header) => (
                <th key={header} className="border-b p-3 font-mono text-xs uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {decisionRows.map((row) => (
              <tr key={`${row.species}-${row.count}-${row.market}`}>
                <td className="border-b p-3">{row.species}</td>
                <td className="border-b p-3 font-mono text-primary">{row.count}</td>
                <td className="border-b p-3">{row.market}</td>
                <td className="border-b p-3">{row.window}</td>
                <td className="border-b p-3">{row.certification}</td>
                <td className="border-b p-3 font-medium">{row.origins}</td>
                <td className="border-b p-3 text-foreground/72 dark:text-foreground/82">{row.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
