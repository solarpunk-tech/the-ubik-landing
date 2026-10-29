import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type DeployOption = { id: "premises" | "cloud" | "local"; label: string; title: string; copy: string; boundary: string; out: string };

type OwnCopy = {
  eyebrow: string;
  title: string;
  lede: string;
  options: DeployOption[];
  stack: [string, string, string];
  systems: [string, string, string, string];
  team: string;
  securityLink: string;
  complianceLabel: string;
};

const compliancePosture = [
  { label: "GDPR", mark: "EU" },
  { label: "DPDP", mark: "IN" },
  { label: "SOC 2", mark: "SOC" }
] as const;

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

// Left column: your systems, as tiles. Centres, top to bottom.
const SYS_Y = [70, 146, 222, 298];
const BOX = { x: 160, y: 50, w: 320, h: 276 };
const AGENTS = { x: 186, y: 156, s: 60 };
const MEMORY = { x: 300, y: 92, s: 52 };
const MODELS = { x: 300, y: 228, s: 52 };
const TEAM = { x: 400, y: 160, s: 52 };

const ink = (name: string, alpha = 1) => `hsl(var(--${name}) / ${alpha})`;

/*
 * Models behind the private inference gateway. In your VPC that is the
 * providers' private endpoints in your own cloud account; on your hardware
 * it is open-weights models you host.
 */
const modelSets: Record<DeployOption["id"], [string, string][]> = {
  cloud: [["CLAUDE", "anthropic.com"], ["GEMINI", "gemini.google.com"], ["GPT", "openai.com"]],
  premises: [["LLAMA", "meta.com"], ["MISTRAL", "mistral.ai"], ["DEEPSEEK", "deepseek.com"]],
  local: [["LLAMA", "meta.com"], ["MISTRAL", "mistral.ai"], ["DEEPSEEK", "deepseek.com"]]
};
const CHIP = { x: 372, y: 238, w: 96, h: 18, gap: 6 };

/** A square tile with an icon in it and a mono caption underneath, in the anatomy-diagram style. */
function Tile({ x, y, s, label, sub, children, filled = false }: { x: number; y: number; s: number; label: string; sub?: string; children: React.ReactNode; filled?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx="3" fill={filled ? ink("primary") : ink("muted")} stroke={filled ? "none" : ink("border-strong")} />
      <g transform={`translate(${x + s / 2} ${y + s / 2})`}>{children}</g>
      <text x={x + s / 2} y={y + s + 15} textAnchor="middle" className="own-anat-label">{label}</text>
      {sub ? <text x={x + s / 2} y={y + s + 27} textAnchor="middle" className={filled ? "own-anat-label own-anat-accent" : "own-anat-label"}>{sub}</text> : null}
    </g>
  );
}

const stroke = { fill: "none", stroke: ink("foreground", 0.75), strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const icons = {
  erp: <g {...stroke}><ellipse cx="0" cy="-6" rx="8" ry="3" /><path d="M-8 -6v12c0 1.7 3.6 3 8 3s8-1.3 8-3v-12M-8 0c0 1.7 3.6 3 8 3s8-1.3 8-3" /></g>,
  doc: <g {...stroke}><path d="M-6 -9h8l5 5v13h-13z M2 -9v5h5 M-3 1h7 M-3 5h5" /></g>,
  memory: <g {...stroke}><rect x="-9" y="-7" width="18" height="14" rx="3" /><path d="M-5 -2h10 M-5 2h6" /></g>,
  models: <g {...stroke}><path d="M0 -9l8 4.5v9L0 9l-8-4.5v-9z M0 0l8-4.5 M0 0v9 M0 0l-8-4.5" /></g>,
  team: <g {...stroke}><circle cx="0" cy="-4" r="4" /><path d="M-8 9c1-5 4-7 8-7s7 2 8 7" /></g>,
  globe: <g {...stroke}><circle r="9" /><path d="M-9 0h18 M0 -9c-4 4-4 14 0 18 M0 -9c4 4 4 14 0 18" /></g>,
  grid: <g fill="#fff">{[-1, 0, 1].flatMap((r) => [-1, 0, 1].map((c) => <rect key={`${r}${c}`} x={c * 8 - 3} y={r * 8 - 3} width="6" height="6" rx="1" />))}</g>
};

/**
 * The deployment picture, drawn like an anatomy diagram: your systems feed
 * ubik's agents inside a boundary, the agents read and write memory and call
 * models, a person approves, and the wire to the outside world is cut. The
 * boundary is relabelled for each option; on VPC it carries the clouds, on a
 * laptop it gets a base. Comets run along the wires; they hold still under
 * reduced motion.
 */
function PerimeterDrawing({ option, copy, animate }: { option: DeployOption; copy: OwnCopy; animate: boolean }) {
  const laptop = option.id === "local";
  const agentsMid = AGENTS.y + AGENTS.s / 2;
  const bus = 128;
  const inWires = SYS_Y.map((y) => `M88 ${y} H${bus} V${agentsMid} H${AGENTS.x}`);
  const memWire = `M${AGENTS.x + AGENTS.s} ${agentsMid - 10} H270 V${MEMORY.y + MEMORY.s / 2} H${MEMORY.x}`;
  const modelWire = `M${AGENTS.x + AGENTS.s} ${agentsMid + 10} H270 V${MODELS.y + MODELS.s / 2} H${MODELS.x}`;
  const teamWire = `M${AGENTS.x + AGENTS.s} ${agentsMid} H${TEAM.x}`;
  const outWire = `M${TEAM.x + TEAM.s} ${agentsMid} H${BOX.x + BOX.w} H566`;
  const models = modelSets[option.id];
  const chipWires = models.map((_, index) => `M${MODELS.x + MODELS.s} ${MODELS.y + MODELS.s / 2} H${CHIP.x - 10} V${CHIP.y + index * (CHIP.h + CHIP.gap) + CHIP.h / 2} H${CHIP.x}`);
  const wires = [...inWires, memWire, modelWire, teamWire, ...chipWires];
  const outWords = option.out.toUpperCase().split(" ");
  const half = Math.ceil(outWords.length / 2);
  const outLines: [string, string | undefined] = outWords.length > 2 ? [outWords.slice(0, half).join(" "), outWords.slice(half).join(" ")] : [outWords.join(" "), undefined];
  const sysIcons = [
    <image key="g" href="/logos/gmail.svg" x="-9" y="-9" width="18" height="18" />,
    <image key="w" href="/logos/whatsapp.svg" x="-9" y="-9" width="18" height="18" />,
    icons.erp,
    icons.doc
  ];

  return (
    <svg key={option.id} viewBox="0 0 640 360" className="own-stack-drawing h-auto w-full" role="img" aria-label={`${option.title} ${option.boundary}`}>
      <defs>
        <pattern id="own-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={ink("foreground", 0.12)} />
        </pattern>
      </defs>
      <rect width="640" height="360" fill="url(#own-dots)" />

      <text x="40" y="30" className="own-anat-label">YOUR DATA</text>
      {copy.systems.map((label, index) => (
        <Tile key={label} x={40} y={SYS_Y[index] - 24} s={48} label={label.toUpperCase()}>
          {sysIcons[index]}
        </Tile>
      ))}

      {/* The boundary, relabelled per option. */}
      <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} fill={ink("background", 0.82)} stroke={ink("foreground", 0.35)} strokeDasharray={option.id === "cloud" ? "5 4" : undefined} rx={laptop ? 8 : 0} />
      {laptop ? <path d={`M${BOX.x - 24} ${BOX.y + BOX.h + 6} h${BOX.w + 48} l-14 14 h${-(BOX.w + 20)} z`} fill={ink("muted")} stroke={ink("foreground", 0.3)} /> : null}
      <rect x={BOX.x + 12} y={BOX.y - 7} width={option.boundary.length * 7.4 + 16} height="14" fill={ink("background")} />
      <text x={BOX.x + 20} y={BOX.y + 4} className="own-anat-label own-anat-strong">{option.boundary.toUpperCase()}</text>
      {option.id === "cloud"
        ? ["aws.amazon.com", "cloud.google.com", "azure.microsoft.com"].map((domain, index) => (
            <g key={domain} transform={`translate(${BOX.x + BOX.w - 84 + index * 26} ${BOX.y + 12})`}>
              <rect width="20" height="20" rx="3" fill="#fff" stroke={ink("border-strong")} />
              <image href={favicon(domain)} x="3" y="3" width="14" height="14" />
            </g>
          ))
        : null}
      {option.id === "premises"
        ? [0, 1, 2].map((unit) => (
            <g key={unit} transform={`translate(${BOX.x + BOX.w - 64} ${BOX.y + 14 + unit * 9})`}>
              <rect width="48" height="7" rx="1" fill={ink("muted")} stroke={ink("border-strong")} />
              <circle cx="42" cy="3.5" r="1.6" fill={ink("primary")} className="own-led" style={{ animationDelay: `${unit * 300}ms` }} />
            </g>
          ))
        : null}

      {/* Prior context: memory feeds back into the agents. */}
      <path d={`M${MEMORY.x + MEMORY.s / 2} ${MEMORY.y} V72 H${AGENTS.x + AGENTS.s / 2} V${AGENTS.y}`} fill="none" stroke={ink("primary", 0.6)} strokeDasharray="3 3" />
      <text x={(AGENTS.x + MEMORY.x + MEMORY.s) / 2} y="67" textAnchor="middle" className="own-anat-label own-anat-accent">PRIOR CONTEXT</text>

      {wires.map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke={ink("foreground", 0.28)} strokeDasharray="2 3" />
          {animate ? (
            <>
              <path d={d} pathLength="100" className="own-comet own-comet-tail" style={{ animationDelay: `${(d.length % 7) * 0.25}s` }} />
              <path d={d} pathLength="100" className="own-comet" style={{ animationDelay: `${(d.length % 7) * 0.25}s` }} />
            </>
          ) : null}
        </g>
      ))}

      <Tile x={AGENTS.x} y={AGENTS.y} s={AGENTS.s} label="UBIK" sub={copy.stack[0].toUpperCase()} filled>
        {icons.grid}
      </Tile>
      <Tile x={MEMORY.x} y={MEMORY.y} s={MEMORY.s} label={copy.stack[1].toUpperCase()}>{icons.memory}</Tile>
      <Tile x={MODELS.x} y={MODELS.y} s={MODELS.s} label="PRIVATE" sub="INFERENCE">{icons.models}</Tile>
      {models.map(([name, domain], index) => {
        const y = CHIP.y + index * (CHIP.h + CHIP.gap);
        return (
          <g key={name}>
            <rect x={CHIP.x} y={y} width={CHIP.w} height={CHIP.h} rx="3" fill={ink("card")} stroke={ink("border-strong")} />
            <rect x={CHIP.x + 3} y={y + 3} width="12" height="12" rx="2" fill="#fff" />
            <image href={favicon(domain)} x={CHIP.x + 4} y={y + 4} width="10" height="10" />
            <text x={CHIP.x + 21} y={y + 12.5} className="own-anat-label own-anat-strong">{name}</text>
          </g>
        );
      })}
      <Tile x={TEAM.x} y={TEAM.y} s={TEAM.s} label={copy.team.toUpperCase()}>{icons.team}</Tile>

      {/* The line out is cut. */}
      <path d={outWire} fill="none" stroke={ink("destructive", 0.55)} strokeDasharray="4 4" />
      <path d={`M${(BOX.x + BOX.w + 566) / 2 - 6} ${agentsMid - 6} l12 12 m0 -12 l-12 12`} stroke={ink("destructive")} strokeWidth="2" strokeLinecap="round" />
      {/* The outside label can run long ("Stays in your account"), so it breaks onto two lines. */}
      <Tile x={566} y={agentsMid - 24} s={48} label={outLines[0]} sub={outLines[1]}>{icons.globe}</Tile>
    </svg>
  );
}

/** Own your data and intelligence: where ubik runs, drawn for each deployment option. */
export function OwnYourStack() {
  const { t } = useTranslation();
  // Key by key, so a locale that still has the old controls copy falls back to English per key.
  const keys = ["eyebrow", "title", "lede", "options", "stack", "systems", "team", "securityLink", "complianceLabel"] as const;
  const copy = Object.fromEntries(keys.map((key) => [key, t(`home.controls.${key}`, { returnObjects: true })])) as unknown as OwnCopy;
  const reducedMotion = Boolean(useReducedMotion());
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const option = copy.options[active];

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % copy.options.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, copy.options.length]);

  return (
    <section className="home-deploy-section border-b border-border" aria-labelledby="home-deploy-proof-title">
      <div className="container-page py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
          <div>
            <p className="founder-company-label">{copy.eyebrow}</p>
            <h2 id="home-deploy-proof-title" className="home-section-title">{copy.title}</h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">{copy.lede}</p>
            <div className="mt-8 grid gap-2" role="tablist" aria-label={copy.eyebrow}>
              {copy.options.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  onClick={() => {
                    setActive(index);
                    setPaused(true);
                  }}
                  className={cn(
                    "grid grid-cols-[2rem_1fr] items-baseline gap-x-2 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    index === active ? "border-primary/50 bg-card shadow-sm" : "border-transparent hover:bg-card/60"
                  )}
                >
                  <span className="text-[12.5px] tabular-nums text-primary-text">0{index + 1}</span>
                  <span>
                    <span className="block text-[12.5px] font-medium text-muted-foreground">{item.label}</span>
                    <span className={cn("block text-lg font-semibold tracking-[-0.02em]", index !== active && "text-muted-foreground")}>{item.title}</span>
                    {index === active ? <span className="mt-1 block text-sm leading-6 text-muted-foreground">{item.copy}</span> : null}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
              <PerimeterDrawing option={option} copy={copy} animate={!reducedMotion} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="compliance-strip !mt-0" aria-label={copy.complianceLabel}>
                <ul>
                  {compliancePosture.map((mark) => (
                    <li key={mark.label}>
                      <span className="compliance-strip-mark" aria-hidden="true">{mark.mark}</span>
                      {mark.label}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/security" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                {copy.securityLink} <ArrowRightIcon aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
