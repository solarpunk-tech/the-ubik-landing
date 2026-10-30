import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import { DRIVE, SHEETS } from "@/components/landing/DocumentVersions";

type Source = { app: string; value: string; time: string };
type MemoryNode = { id: string; name: string; ref: string; rule: string; sources: Source[]; pick: number; note: string; links: string[] };
type AppsCopy = {
  eyebrow: string;
  title: string;
  lede: string;
  groups: string[];
  commonLabel: string;
  nodeLabel: string;
  ruleLabel: string;
  selected: string;
  evidence: string;
  linkedLabel: string;
  nodes: MemoryNode[];
  common: string[];
};

const favicon = (src: string) => (src.startsWith("/") || src.startsWith("data:") ? src : `https://www.google.com/s2/favicons?domain=${src}&sz=64`);

// The apps ubik reads, grouped as in copy.groups. Names are product names, so not translated.
const appGroups: [string, string][][] = [
  [["Gmail", "/logos/gmail.svg"], ["Outlook", "/logos/outlook.svg"], ["WhatsApp", "/logos/whatsapp.svg"], ["Slack", "slack.com"]],
  [["Zoho", "zoho.com"], ["Tally", "tallysolutions.com"], ["SAP", "sap.com"], ["Odoo", "odoo.com"], ["Oracle", "oracle.com"]],
  [["Google Sheets", SHEETS], ["Excel", "office.com"], ["Google Drive", DRIVE], ["Dropbox", "dropbox.com"], ["DocuSign", "docusign.com"]],
  [["Maersk", "/integrations/MAERSK-B.CO.svg"], ["Flexport", "flexport.com"], ["FDA", "fda.gov"]]
];
const allApps = appGroups.flat();
// "Zoho Books" and "Gmail · forwarder" resolve to the Zoho and Gmail tiles.
const appFor = (source: string) => allApps.find(([name]) => source.startsWith(name));

// 0 sources land, 1 the rule runs, 2 one record is selected, 3 it links into memory.
const PHASE_MS = [1000, 1100, 1200, 3000];

/**
 * Connected apps, and what ubik does when they disagree. A memory node (the
 * bill of lading on PO-2481, say) has a value in three systems; the rule
 * picks one, the others stay attached as evidence, and the selected record
 * links to the orders it belongs to. The tiles on the left light up for the
 * apps the current node reads from. Cycles through the nodes until one is
 * picked; final state only under reduced motion.
 */
export function ConnectedMemory() {
  const { t } = useTranslation();
  const copy = t("learn.apps", { returnObjects: true }) as AppsCopy;
  const reducedMotion = Boolean(useReducedMotion());
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(reducedMotion ? 3 : 0);
  const [paused, setPaused] = useState(false);
  const node = copy.nodes[active];
  const shown = reducedMotion ? 3 : phase;

  useEffect(() => {
    if (reducedMotion || !inView) return;
    if (phase === 3 && paused) return;
    const timer = window.setTimeout(() => {
      if (phase < 3) setPhase(phase + 1);
      else {
        setActive((value) => (value + 1) % copy.nodes.length);
        setPhase(0);
      }
    }, PHASE_MS[phase]);
    return () => window.clearTimeout(timer);
  }, [phase, paused, inView, reducedMotion, copy.nodes.length]);

  const select = (index: number) => {
    setActive(index);
    setPhase(reducedMotion ? 3 : 0);
    setPaused(true);
  };

  const sourceApps = node.sources.map((source) => appFor(source.app)?.[0]);
  const pickedApp = sourceApps[node.pick];

  return (
    <section className="bg-shell text-primary-foreground" aria-labelledby="platform-apps-title">
      <div ref={ref} className="container-page py-16 sm:py-24">
        <p className="founder-company-label !text-primary-foreground/70">{copy.eyebrow}</p>
        <h2 id="platform-apps-title" className="home-section-title !max-w-4xl text-primary-foreground">{copy.title}</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/80">{copy.lede}</p>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="grid content-start gap-6">
            {appGroups.map((group, groupIndex) => (
              <div key={copy.groups[groupIndex]}>
                <p className="text-[12.5px] font-medium text-primary-foreground/60">{copy.groups[groupIndex]}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {group.map(([name, src]) => {
                    const isSource = sourceApps.includes(name);
                    const isPicked = shown >= 2 && name === pickedApp;
                    return (
                      <li
                        key={name}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12.5px] transition-[border-color,background-color,color,box-shadow] duration-300",
                          isPicked
                            ? "border-primary-foreground bg-primary-foreground font-medium text-foreground shadow-[0_0_0_3px_hsl(var(--primary)/0.55)]"
                            : isSource
                              ? "border-primary-foreground/45 bg-primary-foreground/[0.08] text-primary-foreground"
                              : "border-primary-foreground/12 text-primary-foreground/65"
                        )}
                      >
                        <img
                          src={favicon(src)}
                          alt=""
                          className={cn("size-4 shrink-0 rounded-[3px] object-contain transition-[filter,opacity] duration-300", !isSource && !isPicked && "opacity-60 grayscale")}
                        />
                        {name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="border-t border-primary-foreground/12 pt-5">
              <p className="text-[12.5px] font-medium text-primary-foreground/60">{copy.commonLabel}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" role="tablist" aria-label={copy.commonLabel}>
                {copy.common.map((name) => {
                  const index = copy.nodes.findIndex((item) => item.name === name);
                  if (index < 0) {
                    return (
                      <li key={name} className="rounded-full border border-dashed border-primary-foreground/20 px-2.5 py-1 text-[12.5px] text-primary-foreground/60">
                        {name}
                      </li>
                    );
                  }
                  return (
                    <li key={name}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={index === active}
                        onClick={() => select(index)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          index === active ? "border-primary bg-primary text-primary-foreground" : "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                        )}
                      >
                        <span aria-hidden className="size-1.5 bg-current" />
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <MemoryCard key={node.id} node={node} copy={copy} phase={shown} />
        </div>
      </div>
    </section>
  );
}

/** The memory node as the app shows it: three sources, the rule, the record kept. */
function MemoryCard({ node, copy, phase }: { node: MemoryNode; copy: AppsCopy; phase: number }) {
  return (
    <div className="min-w-0 self-start rounded-2xl border border-border bg-card p-4 text-foreground shadow-xl sm:p-5" role="tabpanel">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
          <span aria-hidden className={cn("size-2.5 bg-primary", phase < 3 && "doc-versions-cursor")} />
          {copy.nodeLabel}
          <span aria-hidden>/</span>
          <span className="font-semibold text-foreground">{node.name}</span>
        </p>
        <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">{node.ref}</span>
      </div>

      <div className={cn("memory-rule mt-4", phase === 1 && "is-running")}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-text">{copy.ruleLabel}</span>
        <span className="text-[13px] leading-5">{node.rule}</span>
      </div>

      <ul className="mt-3 grid gap-2">
        {node.sources.map((source, index) => {
          const app = appFor(source.app);
          const picked = phase >= 2 && index === node.pick;
          const dropped = phase >= 2 && index !== node.pick;
          return (
            <li
              key={source.app}
              style={{ animationDelay: `${index * 160}ms` }}
              className={cn(
                "memory-source grid grid-cols-[1.75rem_1fr_auto] items-center gap-3 rounded-xl border px-3 py-2.5 transition-[border-color,background-color,opacity] duration-300",
                picked ? "border-primary bg-primary/[0.07]" : "border-border",
                dropped && "opacity-60"
              )}
            >
              <span className="grid size-7 place-items-center rounded-md border border-border bg-white">
                {app ? <img src={favicon(app[1])} alt="" className="size-4 object-contain" /> : null}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] text-muted-foreground">
                  {source.app} · <span className="tabular-nums">{source.time}</span>
                </span>
                <span className="block truncate font-mono text-[13px] font-medium">{source.value}</span>
              </span>
              {picked ? (
                <span className="memory-badge inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  <CheckIcon aria-hidden weight="bold" /> {copy.selected}
                </span>
              ) : dropped ? (
                <span className="memory-badge rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{copy.evidence}</span>
              ) : (
                <span aria-hidden className="h-5 w-14 rounded-md bg-muted" />
              )}
            </li>
          );
        })}
      </ul>

      <div className={cn("mt-4 grid gap-3 border-t border-border pt-4 transition-opacity duration-500", phase >= 3 ? "opacity-100" : "opacity-0")}>
        <p className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted-foreground">
          {copy.linkedLabel}
          {node.links.map((link, index) => (
            <span key={link} style={{ animationDelay: `${index * 140}ms` }} className={cn("memory-link-chip rounded-md border border-primary/40 bg-primary/[0.06] px-2 py-0.5 font-mono text-[11px] text-foreground", phase >= 3 && "is-on")}>
              {link}
            </span>
          ))}
        </p>
        <p className="flex items-center gap-2 text-[13px]">
          <span aria-hidden className="size-2 shrink-0 rounded-[2px] bg-destructive" />
          {node.note}
        </p>
      </div>
    </div>
  );
}
