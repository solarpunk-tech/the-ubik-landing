import type { ReactNode } from "react";
import { CheckIcon, FilePdfIcon, FileXlsIcon, PaperPlaneTiltIcon, SealCheckIcon, WarningIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/*
 * What each team's run produces, drawn as the document or tool it lands in
 * and built up one step at a time (step 0..5). Illustrative data throughout.
 */

const show = (on: boolean) => cn("transition-all duration-500", on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0");

function Window({ title, badge, dark = false, children }: { title: string; badge: ReactNode; dark?: boolean; children: ReactNode }) {
  return (
    <div className={cn("flex h-full min-h-[21rem] flex-col overflow-hidden rounded-xl border shadow-lg", dark ? "border-white/10 bg-[#1e1e1e] text-white" : "border-border bg-card text-card-foreground")}>
      <div className={cn("flex items-center gap-2 border-b px-3 py-2 text-[12px]", dark ? "border-white/10 bg-[#2b2b2b]" : "border-border bg-background")}>
        <span className="flex gap-1">
          <i className="size-2.5 rounded-full bg-[#ff5f57]" />
          <i className="size-2.5 rounded-full bg-[#febc2e]" />
          <i className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        {badge}
        <span className={cn("truncate", dark ? "text-white/70" : "text-muted-foreground")}>{title}</span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

const PsBadge = () => <img src="/logos/photoshop.svg" alt="" className="size-4 rounded-[3px]" />;

/** Sales: the buyer reply writes itself, the ETA chip changes, send waits for approval. */
export function BuyerEmailArtifact({ step }: { step: number }) {
  const lines = [
    "Hi Dana,",
    "The carrier moved the vessel by three days, so SO-29481 now lands on 17 Nov instead of 14 Nov.",
    "The 2 other open orders on this lane are unaffected.",
    "I have held your pallet slot at the cold store for the new date."
  ];
  return (
    <Window title="Reply · Re: SO-29481 delivery" badge={<PaperPlaneTiltIcon className="size-4 text-primary-text" />}>
      <div className="grid gap-2 p-4 text-[13px]">
        <p className="flex gap-2 border-b border-border pb-2 text-muted-foreground">
          To <span className="text-foreground">Dana Ruiz · Harbour Foods</span>
        </p>
        <p className={cn("flex items-center gap-2", show(step >= 3))}>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[12px] text-muted-foreground line-through">ETA 14 Nov</span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-[12px] font-medium text-accent-foreground">ETA 17 Nov</span>
          <span className="text-[12px] text-muted-foreground">from the carrier update</span>
        </p>
        <div className="mt-1 grid gap-1.5 leading-5">
          {lines.map((line, index) => (
            <p key={line} className={show(step >= (index < 2 ? 4 : 5))}>
              {line}
            </p>
          ))}
          {step >= 4 && step < 5 ? <span className="inline-block h-4 w-px animate-pulse bg-foreground" /> : null}
        </div>
      </div>
      <div className={cn("absolute inset-x-4 bottom-4 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-[12.5px]", show(step >= 5))}>
        <span className="text-muted-foreground">2 more replies drafted</span>
        <span className="rounded-md bg-primary px-2.5 py-1 font-medium text-primary-foreground">Send after approval</span>
      </div>
    </Window>
  );
}

/** Warehouse: lots fill the order, warehouse by warehouse, until 12.4 MT is covered. */
export function AllocationArtifact({ step }: { step: number }) {
  const lots = [
    ["LOT-87", "Cold store A", "4.0", "Mar 2027"],
    ["LOT-91", "Cold store A", "3.2", "Apr 2027"],
    ["LOT-93", "Cold store B", "2.8", "Apr 2027"],
    ["LOT-96", "Cold store B", "2.4", "May 2027"]
  ];
  const allocated = lots.slice(0, Math.max(0, step - 1)).reduce((sum, lot) => sum + Number(lot[2]), 0);
  return (
    <Window title="Allocation plan · SO-29481.xlsx" badge={<FileXlsIcon className="size-4 text-ok-text" />}>
      <div className="p-4 text-[13px]">
        <div className="grid grid-cols-[1fr_1.3fr_0.7fr_0.9fr] gap-2 border-b border-border pb-2 text-[12px] text-muted-foreground">
          <span>Lot</span><span>Warehouse</span><span>MT</span><span>Expiry</span>
        </div>
        {lots.map((lot, index) => (
          <div key={lot[0]} className={cn("grid grid-cols-[1fr_1.3fr_0.7fr_0.9fr] gap-2 border-b border-border py-2 tabular-nums", show(step >= index + 2))}>
            <span className="font-medium">{lot[0]}</span><span>{lot[1]}</span><span>{lot[2]}</span><span className="text-muted-foreground">{lot[3]}</span>
          </div>
        ))}
        <div className="mt-4">
          <div className="flex justify-between text-[12.5px]">
            <span className="text-muted-foreground">Allocated</span>
            <span className="font-semibold tabular-nums">{allocated.toFixed(1)} / 12.4 MT</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-chart-1 transition-[width] duration-700" style={{ width: `${(allocated / 12.4) * 100}%` }} />
          </div>
        </div>
      </div>
    </Window>
  );
}

/** Packaging: the label is edited in Photoshop: the lot code moves above the barcode, layer by layer. */
export function PhotoshopArtifact({ step }: { step: number }) {
  const moved = step >= 3;
  const layers = ["Allergen panel", "Lot code", "Barcode", "Brand", "Background"];
  const activeLayer = step >= 2 ? 1 : 0;
  return (
    <Window dark title="MC-label-2kg_v3.psd @ 100%" badge={<PsBadge />}>
      <div className="grid h-full grid-cols-[2rem_1fr_7.5rem]">
        <div className="flex flex-col items-center gap-2 border-r border-white/10 bg-[#2b2b2b] py-3">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className={cn("size-4 rounded-[3px]", index === 1 ? "bg-[#31A8FF]" : "bg-white/15")} />
          ))}
        </div>
        <div className="grid place-items-center bg-[#535353] p-4">
          <div className="relative aspect-[4/3] w-full max-w-[15rem] rounded-sm bg-[#f4efe4] p-3 text-[#10182b] shadow-xl">
            <p className="text-[13px] font-bold tracking-tight">HARBOUR FOODS</p>
            <p className="text-[10px]">Frozen vannamei · 2 kg</p>
            <p className={cn("mt-1 rounded-[2px] text-[9px] leading-3", step >= 1 ? "bg-[#fff3c4] outline outline-1 outline-[#e0b400]" : "")}>Contains: crustaceans. Packed in a facility that handles fish.</p>
            <span
              className="absolute left-3 text-[9px] font-semibold tabular-nums transition-all duration-700"
              style={{ top: moved ? "58%" : "84%" }}
            >
              LOT 87 · EXP 03/2027
            </span>
            <span className="absolute bottom-3 right-3 flex h-7 items-end gap-[1.5px]">
              {Array.from({ length: 18 }, (_, index) => (
                <i key={index} className="bg-[#10182b]" style={{ width: index % 3 === 0 ? 2 : 1, height: "100%" }} />
              ))}
            </span>
            {step >= 2 ? (
              <span
                className="pointer-events-none absolute left-2 h-4 w-32 border border-dashed border-[#31A8FF] transition-all duration-700"
                style={{ top: moved ? "calc(58% - 3px)" : "calc(84% - 3px)" }}
              />
            ) : null}
          </div>
        </div>
        <div className="border-l border-white/10 bg-[#2b2b2b] p-2 text-[11px]">
          <p className="mb-1.5 text-white/50">Layers</p>
          {layers.map((layer, index) => (
            <p key={layer} className={cn("truncate rounded px-1.5 py-1", index === activeLayer && step >= 1 ? "bg-[#31A8FF]/30 text-white" : "text-white/70")}>
              {layer}
            </p>
          ))}
          <p className={cn("mt-3 rounded bg-white/5 px-1.5 py-1 text-white/80", show(step >= 4))}>Sent to packaging and QA</p>
        </div>
      </div>
    </Window>
  );
}

/** Procurement: supplier replies line up in one comparison, and one is recommended. */
export function SupplierCompareArtifact({ step }: { step: number }) {
  const rows = [
    ["Amcor", "$0.42", "20k", "18 d", false],
    ["Mondi", "$0.39", "30k", "24 d", false],
    ["Berry Global", "$0.41", "15k", "16 d", true],
    ["Sealed Air", "$0.47", "10k", "12 d", false]
  ] as const;
  return (
    <Window title="Supplier comparison · Carton liner" badge={<FileXlsIcon className="size-4 text-ok-text" />}>
      <div className="p-4 text-[13px]">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr] gap-2 border-b border-border pb-2 text-[12px] text-muted-foreground">
          <span>Supplier</span><span>Unit</span><span>MOQ</span><span>Lead</span>
        </div>
        {rows.map(([name, price, moq, lead, pick], index) => (
          <div
            key={name}
            className={cn(
              "grid grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr] gap-2 rounded-md px-1 py-2 tabular-nums transition-colors duration-500",
              show(step >= 1 && index < step + 1),
              pick && step >= 4 && "bg-accent font-medium"
            )}
          >
            <span className="flex items-center gap-1.5">{name}{pick && step >= 4 ? <CheckIcon weight="bold" className="size-3.5 text-primary-text" /> : null}</span>
            <span>{price}</span><span>{moq}</span><span>{lead}</span>
          </div>
        ))}
        <p className={cn("mt-3 rounded-lg border border-border bg-background p-2.5 text-[12.5px]", show(step >= 5))}>
          Recommend <b>Berry Global</b>: lowest MOQ under 20 days, BRC certificate valid to 2027.
        </p>
      </div>
    </Window>
  );
}

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

type BrowserTab = { icon: ReactNode; title: string; url: string };

/** A browser with several tabs open, the way a compliance check actually runs: one portal after another. */
function Browser({ tabs, active, done, children }: { tabs: BrowserTab[]; active: number; done: (index: number) => boolean; children: ReactNode }) {
  return (
    <div className="flex h-full min-h-[21rem] flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg">
      <div className="flex items-end gap-1 border-b border-border bg-muted/70 px-2 pt-2">
        <span className="mb-2.5 mr-1 flex shrink-0 gap-1">
          <i className="size-2.5 rounded-full bg-[#ff5f57]" />
          <i className="size-2.5 rounded-full bg-[#febc2e]" />
          <i className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        {tabs.map((tab, index) => (
          <span
            key={tab.title}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-1.5 rounded-t-lg px-2 py-1.5 text-[11.5px] transition-colors duration-300",
              index === active ? "bg-card text-foreground shadow-[0_-1px_0_hsl(var(--border))]" : "text-muted-foreground"
            )}
          >
            <span className="relative shrink-0">
              {tab.icon}
              {done(index) ? <CheckIcon weight="bold" className="absolute -bottom-1 -right-1 size-2.5 rounded-full bg-ok text-white" /> : null}
            </span>
            <span className="truncate">{tab.title}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-[11.5px] text-muted-foreground">
        <span className="truncate rounded-md bg-muted px-2 py-0.5">{tabs[active].url}</span>
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

function CheckRow({ label, detail, state }: { label: string; detail: string; state: "idle" | "scan" | "clear" }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 rounded-md border px-2.5 py-1.5 transition-colors duration-300", state === "clear" ? "border-ok/40 bg-ok/5" : state === "scan" ? "border-primary/50 bg-primary/5" : "border-border")}>
      <span className="min-w-0">
        <span className="block truncate font-medium">{label}</span>
        <span className="block truncate text-[11.5px] text-muted-foreground">{detail}</span>
      </span>
      {state === "clear" ? <span className="shrink-0 text-[11.5px] font-medium text-ok-text">No match</span> : state === "scan" ? <span className="shrink-0 text-[11.5px] text-primary-text">Checking…</span> : null}
    </div>
  );
}

/**
 * Compliance: the agent works through FDA import alerts, EU RASFF and the BAP
 * registry tab by tab, then checks the certificate itself and stamps the lots.
 */
export function ComplianceBrowserArtifact({ step }: { step: number }) {
  const tabs: BrowserTab[] = [
    { icon: <img src={favicon("fda.gov")} alt="" className="size-3.5" />, title: "FDA import alerts", url: "accessdata.fda.gov/cms_ia/importalert" },
    { icon: <img src={favicon("food.ec.europa.eu")} alt="" className="size-3.5" />, title: "RASFF Window", url: "webgate.ec.europa.eu/rasff-window" },
    { icon: <img src={favicon("bapcertification.org")} alt="" className="size-3.5" />, title: "BAP registry", url: "bapcertification.org/Producers" },
    { icon: <FilePdfIcon className="size-3.5 text-destructive" />, title: "Lot 87.pdf", url: "ubik / evidence / Lot 87 / health-certificate.pdf" }
  ];
  const active = Math.min(step, 3);
  const fields = [
    ["Lot", "87", true],
    ["Establishment no.", "EST-4471", true],
    ["Species", "Litopenaeus vannamei", true],
    ["Issue date", "14 Oct 2026", false]
  ] as const;
  return (
    <Browser tabs={tabs} active={active} done={(index) => index < active}>
      <div key={active} className="grid gap-1.5 p-4 text-[12.5px] [animation:work-paper-in_340ms_cubic-bezier(.22,1,.36,1)]">
        {active === 0 ? (
          <>
            <p className="mb-1 text-[11.5px] text-muted-foreground">Seafood alerts · searched for EST-4471 and 12 lots</p>
            <CheckRow label="Decomposition and histamine" detail="Detention without physical examination" state="clear" />
            <CheckRow label="Aquaculture drug residues" detail="Shrimp and prawns" state="scan" />
            <CheckRow label="Filth and salmonella" detail="Frozen seafood" state="idle" />
          </>
        ) : null}
        {active === 1 ? (
          <>
            <p className="mb-1 text-[11.5px] text-muted-foreground">Notifications · crustaceans · last 90 days</p>
            <CheckRow label="Sulphite above limit" detail="Border rejection · another exporter" state="clear" />
            <CheckRow label="Veterinary residue" detail="Alert · another exporter" state="clear" />
            <CheckRow label="Temperature abuse" detail="Information notice" state="scan" />
          </>
        ) : null}
        {active === 2 ? (
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Facility EST-4471</span>
              <span className="rounded-full bg-ok/15 px-2 py-0.5 text-[11.5px] font-medium text-ok-text">Certified</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <span className="text-muted-foreground">Programme</span><span>BAP processing plant</span>
              <span className="text-muted-foreground">Valid to</span><span className="tabular-nums">Mar 2027</span>
              <span className="text-muted-foreground">Species</span><span>Vannamei shrimp</span>
            </div>
          </div>
        ) : null}
        {active === 3 ? (
          <>
            {fields.map(([label, value, ok], index) => {
              const checked = step >= 4 || index < 3;
              return (
                <div key={label} className={cn("flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 transition-colors duration-300", checked ? (ok ? "border-ok/40 bg-ok/5" : "border-support/60 bg-support/10") : "border-border")}>
                  <span className="text-muted-foreground">{label}</span>
                  <span className="flex items-center gap-1.5 font-medium tabular-nums">
                    {value}
                    {checked ? ok ? <CheckIcon weight="bold" className="size-3.5 text-ok-text" /> : <WarningIcon weight="fill" className="size-3.5 text-support-text" /> : null}
                  </span>
                </div>
              );
            })}
            <p className={cn("text-[12px] text-support-text", show(step >= 4))}>Issue date is after loading. Sent for review.</p>
          </>
        ) : null}
      </div>
      <span className={cn("absolute bottom-4 right-4 inline-flex rotate-[-8deg] items-center gap-1 rounded-md border-2 border-ok-text px-2 py-1 text-[12px] font-bold tracking-[0.12em] text-ok-text transition-all duration-500", step >= 5 ? "scale-100 opacity-90" : "scale-125 opacity-0")}>
        <SealCheckIcon weight="fill" className="size-4" /> 12 CLEARED
      </span>
    </Browser>
  );
}

// Isometric projection for the load plan: x runs along the container, y across it, z up.
const ISO = { s: 19, ox: 70, oy: 62 };
const iso = (x: number, y: number, z: number) => `${(ISO.ox + (x - y) * 0.866 * ISO.s).toFixed(1)},${(ISO.oy + (x + y) * 0.5 * ISO.s - z * ISO.s).toFixed(1)}`;
const face = (points: [number, number, number][]) => points.map(([x, y, z]) => iso(x, y, z)).join(" ");

const BOX = { L: 12, W: 2.4, H: 2.6 };
// 20 pallets, two across, loaded from the nose (x = 0) to the doors.
const pallets = Array.from({ length: 20 }, (_, k) => ({ x: 0.12 + Math.floor(k / 2) * 1.18, y: k % 2 ? 1.24 : 0.1, k }));

function Pallet({ x, y, shown, delay }: { x: number; y: number; shown: boolean; delay: number }) {
  const d = 1.06, h = 1.25;
  return (
    <g className="transition-all duration-500" style={{ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(-14px)", transitionDelay: `${delay}ms` }}>
      <polygon points={face([[x + d, y, 0], [x + d, y + d, 0], [x + d, y + d, h], [x + d, y, h]])} fill="hsl(var(--primary))" fillOpacity="0.78" />
      <polygon points={face([[x, y + d, 0], [x + d, y + d, 0], [x + d, y + d, h], [x, y + d, h]])} fill="hsl(var(--primary))" fillOpacity="0.95" />
      <polygon points={face([[x, y, h], [x + d, y, h], [x + d, y + d, h], [x, y + d, h]])} fill="hsl(var(--primary))" fillOpacity="0.45" />
      <polyline points={face([[x, y + d, h * 0.5], [x + d, y + d, h * 0.5], [x + d, y, h * 0.5]])} fill="none" stroke="hsl(var(--card))" strokeOpacity="0.5" strokeWidth="0.7" />
    </g>
  );
}

/** Finance & Logistics: a 40' reefer loads pallet by pallet while the landed cost and margin build beside it. */
export function ContainerLoadArtifact({ step }: { step: number }) {
  const { L, W, H } = BOX;
  const loaded = step >= 2;
  return (
    <Window title="Load plan · SH-29481 · 40' reefer" badge={<img src={favicon("maersk.com")} alt="" className="size-4" />}>
      <div className="grid gap-2 p-3 text-[12.5px]">
        <svg viewBox="0 0 330 205" className="mx-auto h-48 w-full" role="img" aria-label="Isometric 40-foot reefer container loading 20 pallets">
          {/* Far walls and floor, faint, so the pallets read as inside the box. */}
          <polygon points={face([[0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0]])} fill="hsl(var(--muted))" stroke="hsl(var(--border-strong))" strokeWidth="0.8" />
          <polygon points={face([[0, 0, 0], [L, 0, 0], [L, 0, H], [0, 0, H]])} fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--border-strong))" strokeWidth="0.8" />
          <polygon points={face([[0, 0, 0], [0, W, 0], [0, W, H], [0, 0, H]])} fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--border-strong))" strokeWidth="0.8" />
          {pallets.map((pallet) => (
            <Pallet key={pallet.k} x={pallet.x} y={pallet.y} shown={loaded} delay={pallet.k * 70} />
          ))}
          {/* Near edges as dashed wireframe: the open side of the box. */}
          <polyline points={face([[0, W, H], [L, W, H], [L, 0, H], [0, 0, H], [0, W, H]])} fill="none" stroke="hsl(var(--foreground) / 0.45)" strokeWidth="0.8" strokeDasharray="3 3" />
          <polyline points={face([[L, W, 0], [L, W, H]])} fill="none" stroke="hsl(var(--foreground) / 0.45)" strokeWidth="0.8" strokeDasharray="3 3" />
          <polyline points={face([[0, W, 0], [0, W, H]])} fill="none" stroke="hsl(var(--foreground) / 0.45)" strokeWidth="0.8" strokeDasharray="3 3" />
          <text x="8" y="196" className="fill-muted-foreground text-[10px]">Reefer · −18 °C</text>
          <text x="322" y="196" textAnchor="end" className="fill-muted-foreground text-[10px] tabular-nums">{loaded ? "20 / 20 pallets" : "0 / 20 pallets"}</text>
        </svg>
        <div className={cn("grid grid-cols-3 gap-2 tabular-nums", show(step >= 1))}>
          <span className="rounded-md border border-border px-2 py-1.5"><span className="block text-[11px] text-muted-foreground">Freight</span>$3,180</span>
          <span className="rounded-md border border-border px-2 py-1.5"><span className="block text-[11px] text-muted-foreground">USD/INR</span>83.2</span>
          <span className="rounded-md border border-border px-2 py-1.5"><span className="block text-[11px] text-muted-foreground">Landed / ctn</span>$40.29</span>
        </div>
        <div className={cn("rounded-lg border border-border bg-background p-2.5", show(step >= 3))}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Landed margin <span className="font-semibold text-ok-text tabular-nums">18.4%</span></span>
            <span className={cn("inline-flex items-center gap-1.5", show(step >= 4))}><FilePdfIcon className="size-4 text-destructive" />INV-2481.pdf</span>
          </div>
          <div className="relative mt-2 h-2 rounded-full bg-muted">
            <span className="absolute inset-y-0 left-0 rounded-full bg-ok transition-[width] duration-700" style={{ width: step >= 3 ? "73%" : "0%" }} />
            <span className="absolute -top-1 h-4 w-px bg-foreground" style={{ left: "70%" }} title="17.5% floor" />
          </div>
          <p className={cn("mt-2 text-right text-[12px] font-medium text-primary-text", show(step >= 5))}>Margin approval drafted</p>
        </div>
      </div>
    </Window>
  );
}
