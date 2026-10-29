import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "motion/react";
import { DatabaseIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// Copy lives under home.outcomes.items, in this order.
const workOutputViews = ["reply", "route", "approval", "eta"] as const;
type WorkView = (typeof workOutputViews)[number];

type WorkOutput = { label: string; status: string; title: string; copy: string; system: string };

/*
 * The memory graph above the paper. Every node is something ubik already
 * holds: a mailbox, a PO, a carrier booking. Switching outputs does not swap
 * a picture; the same nodes drift to new places, and the three that produced
 * this output pull into a line and link up. PO-2481 and MSK-2841 carry across
 * outputs, so the reader sees one memory serving several jobs.
 */
type MemoryNode = { id: string; label: string; icon?: ReactNode };

const memoryNodes: MemoryNode[] = [
  { id: "gmail", label: "Gmail", icon: <img src="/logos/gmail.svg" alt="" /> },
  { id: "vendors", label: "4 vendors" },
  { id: "programme", label: "Programme" },
  { id: "maersk", label: "MSK-2841", icon: <img src={favicon("maersk.com")} alt="" /> },
  { id: "lane", label: "VTZ → EWR" },
  { id: "po", label: "PO-2481", icon: <DatabaseIcon weight="bold" /> },
  { id: "managers", label: "3 managers" },
  { id: "floor", label: "Margin floor" },
  { id: "eta", label: "ETA 18 Nov" },
  { id: "buyer", label: "Buyer promise" },
  { id: "whatsapp", label: "WhatsApp", icon: <img src="/logos/whatsapp.svg" alt="" /> },
  { id: "cert", label: "Health cert" },
  { id: "hapag", label: "Hapag-Lloyd", icon: <img src={favicon("hapag-lloyd.com")} alt="" /> },
  { id: "amcor", label: "Amcor", icon: <img src={favicon("amcor.com")} alt="" /> },
  { id: "coldstore", label: "Cold store A" },
  { id: "so", label: "SO-29481" },
  { id: "lot", label: "Lot 87" },
  { id: "fx", label: "USD/INR 83.2" }
];

const memoryChains: Record<WorkView, [string, string, string]> = {
  reply: ["gmail", "vendors", "programme"],
  route: ["maersk", "lane", "po"],
  approval: ["managers", "floor", "po"],
  eta: ["maersk", "eta", "buyer"]
};

// Links the graph keeps between turns, drawn faint until a chain lights them.
const memoryEdges: [string, string][] = [
  ["gmail", "vendors"], ["vendors", "programme"], ["programme", "po"],
  ["maersk", "lane"], ["lane", "po"], ["managers", "floor"], ["floor", "po"],
  ["maersk", "eta"], ["eta", "buyer"], ["whatsapp", "buyer"], ["whatsapp", "eta"],
  ["cert", "po"], ["cert", "buyer"], ["gmail", "whatsapp"],
  ["hapag", "lane"], ["amcor", "vendors"], ["coldstore", "lot"], ["lot", "cert"],
  ["so", "buyer"], ["so", "po"], ["fx", "floor"], ["coldstore", "so"]
];

const CHAIN_X = [0.17, 0.5, 0.83];
const TWEEN_MS = 760;

type Point = { x: number; y: number };

/**
 * Where every node sits for one output, as fractions of the band. Idle nodes
 * scatter to the edges; in the wide layout they fill four rows around the
 * chain, so the whole memory is legible while it reshuffles.
 */
type Shape = "band" | "wide" | "column";

function layoutFor(view: WorkView, shape: Shape): Record<string, Point> {
  const chain = memoryChains[view];
  const seed = workOutputViews.indexOf(view) + 1;
  const idle = memoryNodes.filter((node) => !chain.includes(node.id));
  const layout: Record<string, Point> = {};
  const wide = shape === "wide";
  const step = dealStep(idle.length);
  if (shape === "column") {
    // The chain runs down the middle; the rest of memory lines both edges, dealt differently per output.
    chain.forEach((id, index) => { layout[id] = { x: 0.5, y: 0.24 + index * 0.26 }; });
    const rows = Math.ceil(idle.length / 2);
    idle.forEach((node, index) => {
      const slot = (index * step + seed * 5) % idle.length;
      const left = slot % 2 === 0;
      const row = Math.floor(slot / 2);
      layout[node.id] = { x: left ? 0.2 + (row % 2) * 0.05 : 0.8 - (row % 2) * 0.05, y: 0.07 + (row / Math.max(1, rows - 1)) * 0.86 };
    });
    return layout;
  }
  chain.forEach((id, index) => { layout[id] = { x: CHAIN_X[index], y: wide ? 0.54 : 0.56 }; });
  idle.forEach((node, index) => {
    if (wide) {
      // Four rows, two above the chain and two below; the seed deals the nodes out differently per output.
      const slot = (index * step + seed * 5) % idle.length;
      const row = slot % 4;
      const col = Math.floor(slot / 4);
      const cols = Math.ceil(idle.length / 4);
      const span = row === 0 ? 0.62 : 0.8;
      layout[node.id] = { x: 0.08 + (col / Math.max(1, cols - 1)) * span + (row % 2 ? 0.05 : 0), y: [0.12, 0.31, 0.78, 0.95][row] };
      return;
    }
    // Alternate edges, then spread along each one; the seed reshuffles the order per output.
    const slot = (index * step + seed * 3) % idle.length;
    const top = slot % 2 === 0;
    const along = Math.floor(slot / 2) / Math.ceil(idle.length / 2);
    // The top edge stops short of the label in the corner.
    layout[node.id] = top ? { x: 0.05 + along * 0.74, y: 0.16 } : { x: 0.07 + along * 0.9, y: 0.94 };
  });
  return layout;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
// A dealing step that shares no factor with the count, so every idle node gets its own slot.
const dealStep = (count: number) => [7, 11, 13, 3, 5].find((step) => gcd(step, count) === 1) ?? 1;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function MemoryShuffle({ view, label, wide: wideLayout, dark = false }: { view: WorkView; label: string; wide: boolean; dark?: boolean }) {
  const reducedMotion = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [points, setPoints] = useState(() => layoutFor(view, "band"));
  const pointsRef = useRef(points);
  const [settled, setSettled] = useState(true);
  const chain = memoryChains[view];
  // The labelled graph needs the room; on a phone the band stays the compact one.
  // Beside the paper the panel is tall, so the memory runs as a column.
  const shape: Shape = wideLayout && size.w && size.h > size.w * 0.6 ? "column" : wideLayout && size.w >= 560 ? "wide" : "band";
  const wide = shape !== "band";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = layoutFor(view, shape);
    const from = pointsRef.current;
    const duration = reducedMotion ? 0 : TWEEN_MS;
    let start = 0;
    let frame = 0;
    const step = (now: number) => {
      if (!start) {
        start = now;
        setSettled(false);
      }
      const t = duration ? ease(Math.min(1, (now - start) / duration)) : 1;
      const next: Record<string, Point> = {};
      for (const id of Object.keys(target)) {
        next[id] = { x: from[id].x + (target[id].x - from[id].x) * t, y: from[id].y + (target[id].y - from[id].y) * t };
      }
      pointsRef.current = next;
      setPoints(next);
      if (t < 1) frame = requestAnimationFrame(step);
      else setSettled(true);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [view, shape, reducedMotion]);

  const px = (id: string) => ({ x: points[id].x * size.w, y: points[id].y * size.h });
  const linked = (a: string, b: string) => {
    const i = chain.indexOf(a);
    const j = chain.indexOf(b);
    return i >= 0 && j >= 0 && Math.abs(i - j) === 1;
  };
  const path = chain.map((id, index) => `${index ? "L" : "M"}${px(id).x.toFixed(1)} ${px(id).y.toFixed(1)}`).join(" ");

  return (
    <div ref={ref} className={cn("memory-shuffle", wide && "is-wide", shape === "column" && "is-column", dark && "is-dark")} aria-hidden>
      <span className="memory-shuffle-label">{label}</span>
      {size.w ? (
        <svg width={size.w} height={size.h}>
          {memoryEdges.map(([a, b]) => {
            const on = linked(a, b);
            return (
              <line
                key={`${a}-${b}`}
                x1={px(a).x} y1={px(a).y} x2={px(b).x} y2={px(b).y}
                className={on ? "is-linked" : undefined}
                pathLength={on ? 1 : undefined}
              />
            );
          })}
          {settled && !reducedMotion ? (
            <rect key={view} width="6" height="6" x="-3" y="-3" className="memory-shuffle-runner">
              <animateMotion dur="1.3s" path={path} fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .2 1" />
            </rect>
          ) : null}
        </svg>
      ) : null}
      {memoryNodes.map((node) => {
        const on = chain.includes(node.id);
        return (
          <span
            key={node.id}
            className={on ? "memory-node is-on" : "memory-node"}
            style={{ left: `${points[node.id].x * 100}%`, top: `${points[node.id].y * 100}%` }}
          >
            <i />
            <b>
              {node.icon}
              {node.label}
            </b>
          </span>
        );
      })}
    </div>
  );
}

function BulkReplyArtifact() {
  const vendors = [
    ["Amcor", "amcor.com", "Film spec + MOQ", "Replied · 14:36"],
    ["Mondi", "mondigroup.com", "Kraft carton grade", "Replied · 14:37"],
    ["Berry Global", "berryglobal.com", "Liner allocation", "Replied · 14:38"],
    ["Sealed Air", "sealedair.com", "Cold-chain pouch", "Replied · 14:38"]
  ] as const;

  return (
    <div className="bulk-reply-artifact">
      <div className="bulk-reply-head"><span>Vendor</span><span>Update</span><span>Status</span></div>
      {vendors.map(([name, domain, request, status]) => (
        <div className="bulk-reply-row" key={name}>
          <span><img src={favicon(domain)} alt="" />{name}</span>
          <span>{request}</span>
          <strong><i />{status}</strong>
        </div>
      ))}
      <div className="artifact-nudge"><span>4 replies / 1 reviewed action</span><strong>Written to packaging programme</strong></div>
    </div>
  );
}

function ShipmentRouteArtifact() {
  return (
    <div className="shipment-route-artifact">
      <div className="route-canvas">
        <svg viewBox="0 0 640 220" role="img" aria-label="Booked Maersk route and a dotted lower-cost alternative proposed by Ubik">
          <path className="route-coast" d="M46 23c41 35 24 72 62 94 27 16 12 52 48 78M584 16c-28 42-14 75-52 98-34 21-17 57-58 87" />
          <path className="route-current" d="M112 154C220 61 391 55 528 145" />
          <path className="route-alternate" d="M112 154C233 197 394 194 528 145" />
          <circle cx="112" cy="154" r="7" />
          <circle cx="528" cy="145" r="7" />
        </svg>
        <span className="route-point is-origin"><strong>Visakhapatnam</strong><small>IN VTZ</small></span>
        <span className="route-point is-destination"><strong>Newark</strong><small>US EWR</small></span>
        <span className="route-carrier is-current"><img src={favicon("maersk.com")} alt="" />Maersk · booked</span>
        <span className="route-carrier is-alternate"><img src={favicon("hapag-lloyd.com")} alt="" />Hapag-Lloyd · alternative</span>
        <span className="route-ubik-signal"><i />Efficiency found</span>
      </div>
      <div className="route-comparison">
        <div><span>Booked route</span><strong>38 days · $46.2K</strong></div>
        <div className="is-better"><span>Ubik alternative</span><strong>34 days · $37.8K</strong></div>
        <p>−4 days <b>and</b> −$8.4K</p>
      </div>
    </div>
  );
}

/**
 * Deterministic square identicon for the approver avatars.
 *
 * These are fictional operators in a product mockup, so a stock-photo service
 * would be inventing faces for people who don't exist. A generated mark from
 * the same square vocabulary as everything else says "a person" without
 * pretending to be one, and costs no network request.
 */
function Identicon({ seed }: { seed: string }) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: boolean[] = [];

  // Mirrored 5x5 so it reads as a face-like mark rather than static.
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 3; x += 1) {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      cells[y * 5 + x] = ((h >>> 0) % 100) > 45;
    }
    cells[y * 5 + 3] = cells[y * 5 + 1];
    cells[y * 5 + 4] = cells[y * 5 + 0];
  }
  return (
    <svg className="identicon" viewBox="0 0 5 5" aria-hidden="true" focusable="false">
      {cells.map((on, i) =>
        on ? <rect key={i} x={i % 5} y={Math.floor(i / 5)} width="1" height="1" /> : null
      )}
    </svg>
  );
}

function ApprovalArtifact() {
  const approvals = [
    ["AM", "Operations", "Service protected", "Expedite +$3.2K"],
    ["MR", "Commercial", "Margin above floor", "−60 bps"],
    ["SI", "Quality", "Lot 87 cleared", "Cert retained"]
  ] as const;

  return (
    <div className="approval-artifact">
      <div className="approval-steps" aria-label="Delegated, reviewed, approved, committed">
        <i className="is-done" /><i className="is-done" /><i className="is-done" /><i />
      </div>
      <div className="approval-step-labels"><span>Delegated</span><span>Reviewed</span><span>Approved</span><span>Committed</span></div>
      <div className="approval-list">
        {approvals.map(([initials, role, decision, tradeoff]) => (
          <div key={role}>
            <span className="approval-person"><Identicon seed={role} /><b>{initials}</b></span>
            <p><strong>{role}</strong><small>Approved in their Ubik</small></p>
            <p><strong>{decision}</strong><small>{tradeoff}</small></p>
            <span className="approval-check">✓</span>
          </div>
        ))}
      </div>
      <div className="approval-leadership-note">
        <span>Leadership readout</span>
        <strong>Protect the buyer promise. Margin remains 40 bps above floor.</strong>
      </div>
    </div>
  );
}

function EtaWatchArtifact() {
  return (
    <div className="eta-watch-artifact">
      <div className="eta-metrics">
        <div><span>Next carrier check</span><strong>02:14</strong></div>
        <div><span>Promises watched</span><strong>22</strong></div>
      </div>
      <div className="eta-stack" aria-label="18 in SLA, 3 watched, 0 breached, 1 pending">
        <span className="is-ok" style={{ width: "82%" }} />
        <span className="is-watch" style={{ width: "13%" }} />
        <span className="is-pending" style={{ width: "5%" }} />
      </div>
      <div className="eta-legend">
        <span><i className="is-ok" />In SLA <strong>18</strong></span>
        <span><i className="is-watch" />Watch <strong>3</strong></span>
        <span><i className="is-breach" />Breached <strong>0</strong></span>
        <span><i className="is-pending" />Pending <strong>1</strong></span>
      </div>
      <div className="eta-focus-row">
        <span><img src={favicon("maersk.com")} alt="" />Maersk / MSK-2841</span>
        <p><strong>Buyer promise holds</strong><small>Review again if ETA moves ±2 days</small></p>
        <em>WATCH</em>
      </div>
      <div className="artifact-nudge"><span>Next check · 18:00 local</span><strong>3 shipments need no action yet</strong></div>
    </div>
  );
}

function WorkArtifactView({ view }: { view: WorkView }) {
  if (view === "reply") return <BulkReplyArtifact />;
  if (view === "route") return <ShipmentRouteArtifact />;
  if (view === "approval") return <ApprovalArtifact />;
  return <EtaWatchArtifact />;
}



/** Four outputs from one trade decision, each drawn as the product would show it, beside the memory that produced it. */
export function TradeWorkLedger({ className, wide = false }: { className?: string; wide?: boolean }) {
  const { t } = useTranslation();
  const outputs = t("home.outcomes.items", { returnObjects: true }) as WorkOutput[];
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const output = outputs[active];

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % workOutputViews.length), 4400);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const tabs = (
    <div className="trade-work-index" role="tablist" aria-label={t("home.outcomes.indexLabel")}>
      {outputs.map((item, index) => (
        <button
          key={workOutputViews[index]}
          type="button"
          role="tab"
          aria-selected={index === active}
          className={index === active ? "is-active" : undefined}
          onClick={() => {
            setActive(index);
            setIsPaused(true);
          }}
        >
          <span>0{index + 1}</span>
          <strong>{item.label}</strong>
          <em>{item.status}</em>
          {index === active && !isPaused ? <i className="trade-work-progress" key={`${active}-progress`} aria-hidden /> : null}
        </button>
      ))}
    </div>
  );
  const paper = (
    <article className="trade-work-paper" key={workOutputViews[active]}>
      <div className="trade-work-paper-topline">
        <span>{output.system}</span>
        <strong>{output.status}</strong>
      </div>
      <h3>{output.title}</h3>
      <p>{output.copy}</p>
      <WorkArtifactView view={workOutputViews[active]} />
    </article>
  );

  // Wide: the steps run across the top; memory lights up in the dark panel on the left, the work it produced sits on paper on the right.
  if (wide) {
    return (
      <div className={cn("trade-work-ledger is-wide is-split", className)} aria-label={t("home.outcomes.ledgerLabel")}>
        {tabs}
        <div className="trade-work-split">
          <div className="trade-work-memory">
            <MemoryShuffle view={workOutputViews[active]} label={t("home.outcomes.memoryLabel")} wide dark />
          </div>
          <div className="trade-work-stage">{paper}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("trade-work-ledger", className)} aria-label={t("home.outcomes.ledgerLabel")}>
      <div className="trade-work-ledger-body">
        {tabs}
        <div className="trade-work-stage">
          <MemoryShuffle view={workOutputViews[active]} label={t("home.outcomes.memoryLabel")} wide={false} />
          {paper}
        </div>
      </div>
    </div>
  );
}
