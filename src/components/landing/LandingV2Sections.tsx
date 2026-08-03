"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRightIcon,
  ArchiveIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleNotchIcon,
  CurrencyInrIcon,
  DesktopIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  FilePdfIcon,
  FishIcon,
  FlagIcon,
  GraphIcon,
  LockKeyIcon,
  PaperPlaneTiltIcon,
  ShippingContainerIcon,
  SparkleIcon,
  TableIcon,
  TimerIcon,
  XIcon
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { MatrixField } from "@/components/landing/MatrixField";
import { externalLinks } from "@/lib/links";
import { trackEvent } from "@/lib/posthog";
import { cn } from "@/lib/utils";
import type { ComponentType, ReactNode } from "react";

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

type QueueRow = {
  title: string;
  meta: string;
  metaIcons?: string[];
  stat: string;
  icon: string;
};

const queueRows: QueueRow[] = [
  {
    title: "Buyer RFQ ready to quote",
    meta: "gmail · salesforce · margin checked",
    metaIcons: [favicon("salesforce.com")],
    stat: "review",
    icon: favicon("gmail.com")
  },
  {
    title: "Container ETA shifted · India → NJ",
    meta: "34 → 52 days · 3 promises recalculated",
    stat: "−18d",
    icon: favicon("maersk.com")
  },
  {
    title: "Margin watch · HS 0306.17",
    meta: "power bi variance flagged before send",
    stat: "2.4%",
    icon: favicon("powerbi.microsoft.com")
  },
  {
    title: "PO → ERP → accounting",
    meta: "zoho · tally · 47 / 12.4 MT",
    metaIcons: [favicon("zoho.com")],
    stat: "draft",
    icon: favicon("tallysolutions.com")
  }
];

const perishableCategories = ["Frozen food", "Dairy", "Meat", "Produce", "Specialty goods"] as const;

const integrationTools = [
  ["gmail", "gmail.com"],
  ["outlook", "outlook.com"],
  ["whatsapp", "whatsapp.com"],
  ["slack", "slack.com"],
  ["salesforce", "salesforce.com"],
  ["hubspot", "hubspot.com"],
  ["zoho", "zoho.com"],
  ["sap", "sap.com"],
  ["oracle", "oracle.com"],
  ["netsuite", "netsuite.com"],
  ["odoo", "odoo.com"],
  ["tally", "tallysolutions.com"],
  ["sage", "sage.com"],
  ["quickbooks", "quickbooks.intuit.com"],
  ["xero", "xero.com"],
  ["power bi", "powerbi.microsoft.com"],
  ["tableau", "tableau.com"],
  ["looker", "looker.com"],
  ["snowflake", "snowflake.com"],
  ["maersk", "maersk.com"],
  ["msc", "msc.com"],
  ["dhl", "dhl.com"],
  ["fedex", "fedex.com"],
  ["stripe", "stripe.com"],
  ["razorpay", "razorpay.com"],
  ["hdfc", "hdfcbank.com"],
  ["okta", "okta.com"],
  ["microsoft", "microsoft.com"],
  ["adobe pdf", "adobe.com"],
  ["chatgpt", "openai.com"],
  ["claude", "claude.ai"],
  ["gemini", "gemini.google.com"],
  ["xai", "x.ai"],
  ["mistral", "mistral.ai"],
  ["perplexity", "perplexity.ai"]
] as const;

const communicationTools = new Set(["gmail", "outlook", "whatsapp", "slack", "microsoft"]);
const recordTools = new Set(["salesforce", "hubspot", "zoho", "sap", "oracle", "netsuite", "odoo"]);
const financeTools = new Set(["tally", "sage", "quickbooks", "xero", "stripe", "razorpay", "hdfc"]);
const logisticsTools = new Set(["maersk", "msc", "dhl", "fedex"]);

function buildTradeCombination(selected: string[]) {
  const hasGroup = (group: Set<string>) => selected.some((tool) => group.has(tool));
  const labels = selected.map((tool) => tool.replace(/\b\w/g, (character) => character.toUpperCase()));

  if (hasGroup(communicationTools) && hasGroup(recordTools) && hasGroup(logisticsTools)) {
    return {
      eyebrow: "Grain shipment control",
      title: "Recover an ETA shift before it becomes a buyer escalation.",
      body: "Join the customer thread, order position, and carrier movement; recalculate the promise and prepare the commercial response.",
      action: "Promise date and buyer update ready"
    };
  }
  if (hasGroup(communicationTools) && hasGroup(recordTools) && hasGroup(financeTools)) {
    return {
      eyebrow: "Shrimp margin protection",
      title: "Test the quote against inventory, landed cost, and the buyer account.",
      body: "Agents reconcile the request with available lots and finance context before choosing where margin or volume should win.",
      action: "Allocation and price strategy prepared"
    };
  }
  if (hasGroup(communicationTools) && hasGroup(logisticsTools)) {
    return {
      eyebrow: "Meat import exception",
      title: "Turn a vessel change into a coordinated inventory move.",
      body: "Match the new ETA to customer commitments and stock cover, then rebalance supply before service levels slip.",
      action: "Inventory reallocation planned"
    };
  }
  if (hasGroup(communicationTools) && hasGroup(recordTools)) {
    return {
      eyebrow: "Rice packaging workflow",
      title: "Carry a packaging change from buyer request to the order record.",
      body: "Read the specification change, resolve the customer and SKU, and update the operating plan across commercial and fulfilment teams.",
      action: "Packaging work package created"
    };
  }
  if (hasGroup(recordTools) && hasGroup(financeTools)) {
    return {
      eyebrow: "Frozen-food working capital",
      title: "See which orders deserve cash, stock, and attention first.",
      body: "Combine open orders, inventory value, and account exposure so agents can compare margin, service, and working-capital tradeoffs.",
      action: "Priority order plan prepared"
    };
  }

  return {
    eyebrow: `${labels[0] ?? "Outlook"} operating signal`,
    title: "Give one source the memory and agents needed to move the work.",
    body: "Ubik resolves the trade entities around the signal, recalls the relevant operating context, and chooses the next bounded task.",
    action: "Next best action composed"
  };
}

type Chip =
  | { kind: "img"; src: string; label: string }
  | { kind: "icon"; icon: ComponentType<{ className?: string }>; label: string };

type PillTone = "primary" | "success" | "support" | "foreground";
type VizStatTone = "default" | "success" | "support";

type MemoryRow = {
  icon: string | "table";
  label: string;
};

type RailStep = {
  time: string;
  title: string;
  heading: ReactNode;
  paragraphs: ReactNode[];
  chips: Chip[];
  pill: {
    tone: PillTone;
    icon: ComponentType<{ className?: string }>;
    label: string;
  };
  vizRow: {
    icon: string | "agent";
    title: string;
    meta: string;
    stat: string;
    statTone?: VizStatTone;
  };
  memoryRows?: MemoryRow[];
  handoff: string;
};

const railSteps: RailStep[] = [
  {
    time: "09:14 ist",
    title: "Email arrives",
    heading: "09:14 — Buyer email arrives.",
    paragraphs: [
      <>
        Atlantic Cold Storage replies to the RFQ thread. They want <b>12.4 MT of HS 0306.17</b>, CIF NJ, delivery in 6
        weeks. Email lands in Gmail like any other day.
      </>,
      <>
        The thread is muted in your inbox — Gmail thinks it&apos;s just one of 200 emails today. <b>ubik knows
        different.</b>
      </>
    ],
    chips: [
      { kind: "img", src: favicon("gmail.com"), label: "gmail · thread 8472" },
      { kind: "img", src: favicon("salesforce.com"), label: "sf · opp 28471" },
      { kind: "icon", icon: FishIcon, label: "HS 0306.17" }
    ],
    pill: { tone: "primary", icon: EnvelopeSimpleIcon, label: "incoming · 09:14:21" },
    vizRow: {
      icon: favicon("gmail.com"),
      title: "Re: shrimp · 12.4 MT · partial?",
      meta: "atlantic cold · vinod@atlanticcold.com",
      stat: "9:14"
    },
    handoff: "agent → reading inbox"
  },
  {
    time: "09:16",
    title: "Agent reads",
    heading: (
      <>
        09:16 — <em>ubik</em> reads the thread.
      </>
    ),
    paragraphs: [
      <>
        ubik&apos;s agent pulls the buyer&apos;s last 6 invoices, lane history, tariff stack, and finance terms from
        Salesforce. Cross-references against your CRM opportunity 28471.
      </>,
      <>
        <b>2.4 seconds</b>. Then it starts drafting.
      </>
    ],
    chips: [
      { kind: "icon", icon: SparkleIcon, label: "6 invoices read" },
      { kind: "icon", icon: GraphIcon, label: "lane history clean" },
      { kind: "icon", icon: FlagIcon, label: "2 prior at HS 0306.18" }
    ],
    pill: { tone: "primary", icon: CircleNotchIcon, label: "agent thinking" },
    vizRow: {
      icon: "agent",
      title: "ubik · reading bl-2408-219",
      meta: "Invoice Monitor · context window · 47 tools",
      stat: "2.4s"
    },
    memoryRows: [
      { icon: favicon("gmail.com"), label: "6 invoices · Atlantic Cold · last 8 months" },
      { icon: favicon("whatsapp.com"), label: "“floor must stay under $3.20/kg” · vinod · May 19" },
      { icon: "table", label: "floor pricing final · Atlantic Cold.xlsx · finance · May 18" }
    ],
    handoff: "agent → drafting reply"
  },
  {
    time: "09:23",
    title: "Margin checked",
    heading: "09:23 — Margin checked.",
    paragraphs: [
      <>
        The draft references Power BI variance for HS 0306.17 over the last 90 days. Margin holds at <b>18.4%</b>{" "}
        against your <b>17.5%</b> guardrail. Below threshold = ubik blocks.
      </>,
      <>
        Above threshold = ubik moves to handoff. <b>You&apos;ll see it before send.</b>
      </>
    ],
    chips: [
      { kind: "img", src: favicon("powerbi.microsoft.com"), label: "power bi · 90d" },
      { kind: "icon", icon: CheckIcon, label: "guardrail intact" },
      { kind: "icon", icon: CurrencyInrIcon, label: "+ ₹2,40,000 net" }
    ],
    pill: { tone: "success", icon: CheckCircleIcon, label: "margin intact" },
    vizRow: {
      icon: favicon("powerbi.microsoft.com"),
      title: "Margin guardrail · HS 0306.17",
      meta: "guardrail 17.5% · actual 18.4%",
      stat: "+ 0.9%",
      statTone: "success"
    },
    handoff: "agent → preparing handoff"
  },
  {
    time: "10:01",
    title: "You approve",
    heading: (
      <>
        10:01 — You read the queue. <em>You approve.</em>
      </>
    ),
    paragraphs: [
      <>
        The card shows up in your queue with all the context inline — draft, margin proof, prior shipments, tariff
        stack. You take 38 seconds. You click <b>Approve &amp; send</b>.
      </>,
      <>
        ubik flashes green. The undo toast slides in. You have <b>8 seconds</b> to back out.
      </>
    ],
    chips: [
      { kind: "icon", icon: EyeIcon, label: "read · 38s" },
      { kind: "icon", icon: CheckIcon, label: "approved · 10:01:23" },
      { kind: "icon", icon: ArrowRightIcon, label: "undo window 8s" }
    ],
    pill: { tone: "foreground", icon: LockKeyIcon, label: "commit" },
    vizRow: {
      icon: favicon("gmail.com"),
      title: "Reply drafted & approved",
      meta: "hemanth · 10:01:23 ist",
      stat: "38s"
    },
    handoff: "human → approved"
  },
  {
    time: "10:04",
    title: "Sent to ERP",
    heading: (
      <>
        10:04 — Reply sent. PO mapped. <em>System has the ball.</em>
      </>
    ),
    paragraphs: [
      <>
        Reply lands in the buyer&apos;s inbox 10:01:24. ubik fires the PO ingestion pipeline: parses SKUs, maps to Zoho
        ERP, drafts the Tally accounting receipt, queues for accounting review.
      </>,
      <>
        External system — we poll <b>every 60s</b>.
      </>
    ],
    chips: [
      { kind: "img", src: favicon("gmail.com"), label: "reply sent" },
      { kind: "img", src: favicon("zoho.com"), label: "zoho · po mapped" },
      { kind: "img", src: favicon("tallysolutions.com"), label: "tally · drafted" }
    ],
    pill: { tone: "primary", icon: PaperPlaneTiltIcon, label: "sent → erp queue" },
    vizRow: {
      icon: favicon("zoho.com"),
      title: "Zoho ERP · BL-2408-219 · mapped",
      meta: "poll 60s · next 10:05:00",
      stat: "queued"
    },
    handoff: "system → external queue"
  },
  {
    time: "10:05",
    title: "Follow-up queued",
    heading: (
      <>
        10:05 — Follow-up <em>auto-queued.</em>
      </>
    ),
    paragraphs: [
      <>
        Quote sent. ubik immediately queues a follow-up nudge. <b>No buyer reply in 48 hours?</b> A contextual
        check-in drafts automatically — referencing the original shipment, price agreed, and next steps.
      </>,
      <>
        It lands in your queue before it sends. <b>One click to approve or adjust.</b>
      </>
    ],
    chips: [
      { kind: "icon", icon: TimerIcon, label: "trigger · 48h no reply" },
      { kind: "icon", icon: EnvelopeSimpleIcon, label: "draft ready · T+48h" },
      { kind: "icon", icon: EyeIcon, label: "human review first" }
    ],
    pill: { tone: "support", icon: TimerIcon, label: "follow-up · scheduled" },
    vizRow: {
      icon: favicon("gmail.com"),
      title: "Re: shrimp · 12.4 MT · following up",
      meta: "queued · sends if no reply · +48h",
      stat: "48h",
      statTone: "support"
    },
    handoff: "agent → follow-up queued"
  },
  {
    time: "13:15",
    title: "Buyer confirms",
    heading: (
      <>
        13:15 — Buyer confirms <em>on WhatsApp.</em>
      </>
    ),
    paragraphs: [
      <>
        Vinod pings on WhatsApp: <b>“looks good, sending PO by EOD.”</b> ubik reads the message, threads it into
        shipment BL-2408-219, and cancels the pending follow-up automatically.
      </>,
      <>
        Audit trail now includes the WA confirmation. <b>Memory updated. Follow-up window closed.</b>
      </>
    ],
    chips: [
      { kind: "img", src: favicon("whatsapp.com"), label: "whatsapp · vinod" },
      { kind: "icon", icon: CheckIcon, label: "threaded · bl-2408-219" },
      { kind: "icon", icon: XIcon, label: "follow-up cancelled" }
    ],
    pill: { tone: "success", icon: CheckCircleIcon, label: "buyer confirmed" },
    vizRow: {
      icon: favicon("whatsapp.com"),
      title: "“looks good, sending PO by EOD”",
      meta: "vinod · atlantic cold · 13:15 ist",
      stat: "confirmed",
      statTone: "success"
    },
    handoff: "buyer → confirmed"
  },
  {
    time: "14:22",
    title: "Audit-logged",
    heading: (
      <>
        14:22 — Accounting acknowledges. <em>Audit-logged.</em>
      </>
    ),
    paragraphs: [
      <>
        Tally fires its acknowledgement at 14:22:18. ubik stamps the audit rail: <b>everything that touched this
        shipment</b> — every agent action, every human approval, every poll, every retry.
      </>,
      <>
        Quote sent. Margin recovered. Trade memory updated. <b>Tomorrow morning starts from here.</b>
      </>
    ],
    chips: [
      { kind: "icon", icon: LockKeyIcon, label: "committed" },
      { kind: "icon", icon: ArchiveIcon, label: "audit · 2408-219" },
      { kind: "icon", icon: TimerIcon, label: "5h 08m total" }
    ],
    pill: { tone: "foreground", icon: LockKeyIcon, label: "final · audit logged" },
    vizRow: {
      icon: favicon("tallysolutions.com"),
      title: "Quote sent · audit committed",
      meta: "5h 08m · 6 handoffs · 0 retries",
      stat: "+ ₹2.4L",
      statTone: "success"
    },
    handoff: "final → committed"
  }
];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">{children}</span>;
}

function FaviconImg({ src, alt = "" }: { src: string; alt?: string }) {
  return <img src={src} alt={alt} className="size-[18px]" loading="lazy" />;
}

function PerishableTradeChip({ category }: { category: string }) {
  return (
    <div className="trade-chip inline-flex items-center gap-2 border bg-background px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] shadow-sm">
      <span className="trade-chip-pulse" aria-hidden="true" />
      <span className="text-foreground/72 dark:text-foreground/82">Built for perishable trade</span>
      <span className="h-3 w-px bg-border" aria-hidden="true" />
      <span aria-live="polite" className="min-w-[4.6rem] text-primary">{category}</span>
      <span className="trade-chip-scan" aria-hidden="true"><span /></span>
    </div>
  );
}

export function LandingV2Hero() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [thinkTime, setThinkTime] = useState(3.4);
  const [categoryIndex, setCategoryIndex] = useState(0);

  useEffect(() => {
    const rowTimer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % queueRows.length);
    }, 1800);
    const thinkTimer = window.setInterval(() => {
      setThinkTime((current) => {
        const next = current + 0.1;
        return next >= 4.9 ? 3.1 : Number(next.toFixed(1));
      });
    }, 400);
    const categoryTimer = window.setInterval(() => {
      setCategoryIndex((current) => (current + 1) % perishableCategories.length);
    }, 2400);

    return () => {
      window.clearInterval(rowTimer);
      window.clearInterval(thinkTimer);
      window.clearInterval(categoryTimer);
    };
  }, []);

  return (
    <section className="hero-motion-section relative min-h-[calc(100svh-4rem)] overflow-hidden border-b border-border bg-background text-foreground">
      <div className="collision-grid" aria-hidden="true" />
      <div className="container-page relative z-10 grid min-h-[calc(100svh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_1.15fr] lg:py-18">
        <div>
          <PerishableTradeChip category={perishableCategories[categoryIndex]} />

          <h1 className="mt-5 max-w-[31rem] text-5xl font-semibold leading-[0.98] text-foreground sm:text-6xl lg:text-[4.5rem]">
            Every trade decision, <span className="text-primary">held together.</span>
          </h1>

          <p className="mt-6 max-w-[30rem] text-base leading-7 text-foreground/72 sm:text-lg">
            Ubik connects the emails, lots, approvals, and buyer promises that break apart across a shipment—then gives your team one clear next move.
          </p>

          <div className="mt-6 grid max-w-[32rem] grid-cols-3 border border-border bg-card text-foreground">
            {[
              ["100+", "containers"],
              ["$25Mn+", "trade flow"],
              ["2 wk", "workflow live"]
            ].map(([stat, label]) => (
              <div key={stat} className="border-r border-primary-foreground/25 px-3 py-3 last:border-r-0">
                <p className="font-mono text-lg font-semibold leading-none sm:text-xl">{stat}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/58">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button asChild size="lg" className="h-[42px] bg-primary px-5 text-primary-foreground hover:bg-primary/88">
              <a href={externalLinks.app} onClick={() => trackEvent("cta_clicked", { cta: "try_ubik", location: "hero" })}>
                Try ubik Now <ArrowRightIcon />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-[42px] border-foreground/65 bg-transparent px-5 text-foreground hover:bg-foreground hover:text-background">
              <a href={externalLinks.founderMeeting} onClick={() => trackEvent("cta_clicked", { cta: "talk_to_founders", location: "hero" })}>
                Talk to founders
              </a>
            </Button>
          </div>
        </div>

        <div className="hero-queue-panel border bg-card text-foreground shadow-lg">
          <div className="flex items-center justify-between gap-4 border-b bg-shell px-[1.125rem] py-[0.875rem]">
            <h4 className="text-[13px] font-semibold">Operating queue · tuesday 09:14 ist</h4>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-foreground/72 dark:text-foreground/82 before:size-1.5 before:animate-pulse before:bg-green-500 before:content-['']">
              live
            </span>
          </div>

          <div className="grid gap-px bg-border">
            {queueRows.map((row, index) => {
              const active = index === activeIndex;
              return (
                <div
                  key={row.title}
                  className={cn(
                    "grid grid-cols-[28px_1fr_auto] items-center gap-3 bg-card px-[1.125rem] py-[0.875rem] transition-colors duration-500",
                    active && "bg-primary text-primary-foreground"
                  )}
                >
                  <span className={cn("inline-flex size-6 items-center justify-center", active && "bg-background/12")}>
                    <FaviconImg src={row.icon} />
                  </span>
                  <div>
                    <div className="text-[13px] font-medium leading-[1.35]">{row.title}</div>
                    <div className={cn("mt-0.5 flex items-center gap-2 font-mono text-[11px] tracking-[0.04em]", active ? "text-primary-foreground/95" : "text-foreground/72 dark:text-foreground/82")}>
                      {row.metaIcons?.map((icon) => <FaviconImg key={icon} src={icon} />)}
                      <span>{row.meta}</span>
                    </div>
                  </div>
                  <span className={cn("whitespace-nowrap font-mono text-[11px] font-medium tracking-[0.02em]", active ? "text-primary-foreground/95" : "text-foreground")}>
                    {row.stat}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 border-t bg-card px-[1.125rem] py-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-primary">
              <span className="size-1.5 animate-pulse bg-primary" />
              <span>ubik · drafting buyer reply · {thinkTime.toFixed(1)}s</span>
            </span>
            <span className="font-mono text-[11px] tracking-[0.04em] text-foreground/72 dark:text-foreground/82">auto-refresh · 12s</span>
          </div>
        </div>
      </div>
    </section>
  );
}

type CaseStudyFragment = {
  eyebrow: string;
  title: string;
  body: string;
  fragment: ReactNode;
};

const tradeCaseStudy: CaseStudyFragment[] = [
  {
    eyebrow: "01 · signals",
    title: "The RFQ arrives with context already attached.",
    body: "A buyer’s request is connected to the account, lane, and current market signal before anyone starts drafting.",
    fragment: (
      <div className="grid gap-px border bg-border sm:grid-cols-2">
        <div className="bg-card p-3">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/72 dark:text-foreground/82">connected apps</div>
          <div className="flex flex-wrap gap-1.5">
            {["gmail.com", "salesforce.com", "maersk.com"].map((domain) => (
              <span key={domain} className="inline-flex items-center gap-1.5 border bg-background px-2 py-1 font-mono text-[11px] uppercase tracking-[0.04em]">
                <FaviconImg src={favicon(domain)} /> {domain.split(".")[0]}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-card p-3">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/72 dark:text-foreground/82">market signal</div>
          <div className="flex items-center gap-2 text-[12px] font-medium"><GraphIcon className="size-4 text-primary" /> North Atlantic lane stable</div>
        </div>
      </div>
    )
  },
  {
    eyebrow: "02 · recommendation",
    title: "A quote recommendation lands in the queue.",
    body: "The operator sees the draft, margin guardrail, and the reason behind the recommendation in one reviewable row.",
    fragment: (
      <div className="border bg-card">
        <div className="grid grid-cols-[24px_1fr_auto] items-center gap-2.5 px-3 py-3">
          <span className="inline-flex size-6 items-center justify-center bg-primary/10"><FishIcon className="size-4 text-primary" /></span>
          <div><div className="text-[12px] font-medium">Frozen goods RFQ · 12.4 MT · CIF NJ</div><div className="font-mono text-[11px] text-foreground/72 dark:text-foreground/82">recommended quote · buyer context attached</div></div>
          <span className="font-mono text-[11px] font-semibold text-primary">₹2.4L</span>
        </div>
        <div className="flex items-center gap-2 border-t bg-shell px-3 py-2 font-mono text-[11px] uppercase tracking-[0.05em] text-green-700 dark:text-green-300"><FlagIcon className="size-3.5" /> margin 18.4% · guardrail 17.5%</div>
      </div>
    )
  },
  {
    eyebrow: "03 · approval",
    title: "You approve the decision, not a black box.",
    body: "The quote is ready to commit with the PO fields mapped for the next system handoff. Human review stays in the loop.",
    fragment: (
      <div className="border bg-card p-3">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/72 dark:text-foreground/82">PO fields · example order</div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {[["SKU", "HS 0306.17"], ["quantity", "12.4 MT"], ["terms", "CIF NJ"], ["ERP", "Zoho mapped"]].map(([label, value]) => (
            <div key={label} className="border bg-background px-2.5 py-2"><div className="font-mono text-[11px] uppercase text-foreground/60">{label}</div><div className="mt-1 font-medium">{value}</div></div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 bg-shell px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.05em] text-foreground"><CheckCircleIcon className="size-3.5 text-green-400" /> approved · ready to send</div>
      </div>
    )
  },
  {
    eyebrow: "04 · outcome",
    title: "The approved quote becomes reusable trade memory.",
    body: "The decision, its evidence, and every system handoff stay attached for the next shipment.",
    fragment: (
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border bg-card p-4">
        <div><div className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/60">signal</div><div className="mt-1 text-2xl font-semibold">Buyer RFQ</div><div className="font-mono text-[11px] text-foreground/72 dark:text-foreground/82">email + trade context</div></div>
        <ArrowRightIcon className="size-5 text-primary" />
        <div className="text-right"><div className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary">reviewed action</div><div className="mt-1 text-2xl font-semibold text-primary">Quote ready</div><div className="font-mono text-[11px] text-foreground/72 dark:text-foreground/82">evidence attached</div></div>
      </div>
    )
  }
];

function SignalInsightCanvas() {
  const activePoint: number = 5;
  const sourceMarks = [
    ["gmail.com", "buyer thread"],
    ["whatsapp.com", "conversation"],
    ["microsoft.com", "margin model"],
    ["zoho.com", "ERP record"]
  ];

  return (
    <div className="case-insight relative overflow-hidden border-y border-border/80 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-shell px-3 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em]">
          <span className="size-1.5 bg-primary" />
          <span>joined insight · example RFQ</span>
        </div>
        <span className="font-mono text-[11px] text-primary">4 sources · 1 memory thread</span>
      </div>

      <div className="grid lg:grid-cols-[0.72fr_1.4fr_0.78fr]">
        <div className="border-b p-3 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">ontology in context</p>
          <svg viewBox="0 0 220 170" className="mt-3 h-[170px] w-full" role="img" aria-label="Ontology map linking one RFQ to buyer, SKU, lane, and margin">
            <path d="M110 82 L47 34 M110 82 L173 34 M110 82 L47 136 M110 82 L173 136" className="fill-none stroke-primary/35 stroke-[1.5]" />
            <g className="fill-card stroke-primary stroke-[1.5]"><rect x="82" y="57" width="56" height="50" /><circle cx="47" cy="34" r="13" /><circle cx="173" cy="34" r="13" /><circle cx="47" cy="136" r="13" /><circle cx="173" cy="136" r="13" /></g>
            <g className="fill-foreground font-mono text-[11px]"><text x="110" y="79" textAnchor="middle">RFQ</text><text x="110" y="91" textAnchor="middle" className="fill-primary">28471</text><text x="47" y="17" textAnchor="middle">BUYER</text><text x="173" y="17" textAnchor="middle">SKU</text><text x="47" y="159" textAnchor="middle">LANE</text><text x="173" y="159" textAnchor="middle">MARGIN</text></g>
          </svg>
          <p className="mt-1 text-[11px] leading-5 text-foreground/65">One request. Four linked entities. One explainable decision.</p>
        </div>

        <div className="border-b p-3 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between gap-3">
            <div><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">margin by comparable quote</p><p className="mt-1 text-lg font-semibold">18.4% <span className="font-mono text-[11px] font-normal text-green-600">+0.9pp above guardrail</span></p></div>
            <GraphIcon className="size-4 text-primary" />
          </div>
          <svg viewBox="0 0 420 185" className="mt-5 h-[185px] w-full" role="img" aria-label="Margin trend from joined historical quotes">
            <g className="stroke-border stroke-[1]"><path d="M28 12 V158 H410" /><path d="M28 52 H410 M28 96 H410 M28 128 H410" strokeDasharray="3 4" /></g>
            <path d="M28 126 L66 118 L104 130 L142 100 L180 108 L218 82 L256 91 L294 64 L332 72 L370 42 L410 51" className="fill-none stroke-primary stroke-[3]" />
            <path d="M28 126 L66 118 L104 130 L142 100 L180 108 L218 82 L256 91 L294 64 L332 72 L370 42 L410 51 L410 158 L28 158 Z" fill="rgba(58, 88, 230, 0.08)" />
            <line x1={28 + activePoint * 38.2} x2={28 + activePoint * 38.2} y1="20" y2="158" className="stroke-primary/55 stroke-[1] stroke-dasharray-[3_3]" />
            <circle cx={28 + activePoint * 38.2} cy={activePoint === 10 ? 51 : activePoint === 9 ? 42 : activePoint === 7 ? 64 : 82} r="5" className="fill-primary stroke-background stroke-2" />
            <g className="fill-foreground/50 font-mono text-[11px]"><text x="28" y="174">-90d</text><text x="198" y="174">-30d</text><text x="382" y="174">today</text></g>
          </svg>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-foreground/60"><span><i className="mr-1 inline-block size-1.5 bg-primary" />historical quotes</span><span><i className="mr-1 inline-block size-1.5 border border-primary" />current RFQ</span></div>
        </div>

        <div className="p-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">insight</p>
          <p className="mt-3 text-xl font-semibold leading-tight">Hold the quote at <span className="text-primary">$3.42/kg.</span></p>
          <p className="mt-3 text-[11px] leading-5 text-foreground/68">Margin clears the guardrail because the lane recovered 6 days and the last approved floor was recalled from memory.</p>
          <div className="mt-5 border-l-2 border-primary bg-shell px-3 py-2.5"><p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary">why ubik says this</p><p className="mt-1 text-[11px] leading-5">2 comparable quotes · 1 WhatsApp commitment · 1 spreadsheet floor</p></div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t bg-shell px-3 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">memory recalled</span>
        {sourceMarks.map(([domain, label]) => <span key={domain} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-foreground/70"><FaviconImg src={favicon(domain)} />{label}</span>)}
      </div>
    </div>
  );
}

function MemoryJoinCanvas() {
  const rows = [
    ["09:14", "Gmail", "Buyer asks for 12.4 MT · CIF NJ", "request"],
    ["09:16", "WhatsApp", "Floor must stay under $3.20/kg", "memory"],
    ["09:17", "Spreadsheet", "Example buyer · approved floor", "memory"],
    ["09:18", "ERP", "Inventory 47 · available to promise", "context"]
  ];
  return (
    <div className="case-insight overflow-hidden border-y border-border/80 bg-card">
      <div className="flex items-center justify-between border-b bg-shell px-3 py-2.5"><span className="font-mono text-[11px] uppercase tracking-[0.08em]">memory join · 4 signals</span><span className="font-mono text-[11px] text-primary">thread → example RFQ</span></div>
      <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
        <div className="p-3 lg:border-r">
          <div className="mb-3 flex items-center justify-between"><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">same entity, different systems</p><span className="inline-flex items-center gap-1 font-mono text-[11px] text-green-600"><span className="size-1.5 bg-green-500" />synced</span></div>
          <div className="relative border-l border-primary/35 pl-4">
            {rows.map(([time, source, copy, kind]) => (
              <div key={source} className="relative grid grid-cols-[3.2rem_5.3rem_1fr] items-start gap-2 border-b py-3 last:border-b-0">
                <span className="absolute -left-[1.3rem] top-4 size-2 border border-primary bg-card" />
                <span className="font-mono text-[11px] text-foreground/50">{time}</span>
                <span className={cn("font-mono text-[11px] uppercase tracking-[0.06em]", kind === "memory" ? "text-primary" : "text-foreground/60")}>{source}</span>
                <span className="text-[11px] leading-5">{copy}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t bg-shell/60 p-3 lg:border-t-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">what memory changes</p>
          <div className="mt-5 space-y-4">
            <div><p className="text-2xl font-semibold text-primary">3.20/kg</p><p className="font-mono text-[11px] uppercase text-foreground/55">recalled floor</p></div>
            <div className="border-l-2 border-primary px-3"><p className="text-[12px] font-medium">“Floor must stay under $3.20/kg.”</p><p className="mt-1 font-mono text-[11px] text-foreground/55">Buyer · WhatsApp · prior commitment</p></div>
            <p className="text-[11px] leading-5 text-foreground/65">Ubik does not just retrieve the email. It resolves the buyer, shipment, SKU, and prior commitment into one working context.</p>
          </div>
        </div>
      </div>
      <div className="border-t bg-shell px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground"><span className="text-green-300">memory updated</span> · example buyer / RFQ / floor-price</div>
    </div>
  );
}

function ApprovalArtifactCanvas() {
  return (
    <div className="case-insight overflow-hidden border-y border-border/80 bg-shell text-foreground">
      <div className="flex items-center justify-between border-b border-foreground/15 px-3 py-2.5"><span className="font-mono text-[11px] uppercase tracking-[0.08em]">approval artifact · ready to commit</span><span className="text-[11px] text-green-300">guardrail passed</span></div>
      <div className="grid lg:grid-cols-[1fr_0.8fr]">
        <div className="p-4 lg:border-r lg:border-foreground/15"><div className="flex items-end justify-between gap-4"><div><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">buyer reply</p><p className="mt-2 text-xl font-semibold">Quote cleared the margin guardrail.</p></div><span className="font-mono text-[11px] text-green-300">ready for review</span></div><p className="mt-4 max-w-md text-[11px] leading-5 text-foreground/65">The draft includes the margin proof, available inventory, and the linked prior commitment.</p><div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] uppercase text-foreground/55"><span>source proof attached</span><span>undo window 8s</span><span>human approval required</span></div></div>
        <div className="p-4"><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">commit map</p><div className="mt-4 grid gap-2">{[["SKU", "HS 0306.17"], ["Qty", "12.4 MT"], ["Terms", "CIF NJ"], ["ERP", "Zoho · ready"]].map(([key, value]) => <div key={key} className="flex items-center justify-between border-b border-foreground/15 py-2 font-mono text-[11px]"><span className="text-foreground/50">{key}</span><span>{value}</span></div>)}</div></div>
      </div>
      <div className="flex items-center gap-2 border-t border-foreground/15 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-green-300"><CheckCircleIcon className="size-3.5" /> all fields mapped · awaiting operator approval</div>
    </div>
  );
}

function OutcomeTimelineCanvas() {
  return (
    <div className="case-insight overflow-hidden border-y border-border/80 bg-card">
      <div className="border-b bg-shell px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em]">outcome · trade memory written</div>
      <div className="grid items-center gap-4 p-4 sm:grid-cols-[0.8fr_auto_0.8fr]">
        <div><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">request</p><p className="mt-1 text-3xl font-semibold">Buyer RFQ</p><p className="mt-1 text-[11px] text-foreground/60">email, documents, prior commitments</p></div>
        <div className="relative hidden h-px w-full bg-primary/45 sm:block"><span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border border-primary bg-card" /></div>
        <div className="sm:text-right"><p className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">reviewed action</p><p className="mt-1 text-3xl font-semibold text-primary">Quote ready</p><p className="mt-1 text-[11px] text-foreground/60">evidence attached, systems mapped</p></div>
      </div>
      <div className="grid border-t bg-shell sm:grid-cols-3"><div className="border-b p-3 sm:border-b-0 sm:border-r"><p className="font-mono text-[11px] uppercase text-foreground/55">decision</p><p className="mt-1 text-[11px] font-medium">Quote approved</p></div><div className="border-b p-3 sm:border-b-0 sm:border-r"><p className="font-mono text-[11px] uppercase text-foreground/55">system</p><p className="mt-1 text-[11px] font-medium">PO fields mapped</p></div><div className="p-3"><p className="font-mono text-[11px] uppercase text-foreground/55">memory</p><p className="mt-1 text-[11px] font-medium text-primary">Evidence remains searchable</p></div></div>
    </div>
  );
}

function CaseStudyInsightCanvas({ stage }: { stage: number }) {
  if (stage === 1) return <MemoryJoinCanvas />;
  if (stage === 2) return <ApprovalArtifactCanvas />;
  if (stage === 3) return <OutcomeTimelineCanvas />;
  return <SignalInsightCanvas />;
}

export function LandingV2CaseStudy() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = tradeCaseStudy[activeIndex];

  return (
    <section id="case-study" className="case-study-section relative overflow-hidden border-b bg-shell py-20 text-foreground">
      <MatrixField variant="subtle" density="low" seed="example-workflow-band" />
      <div className="container-page relative z-10">
        <div className="mb-9">
          <div>
            <SectionEyebrow>Example workflow · buyer RFQ</SectionEyebrow>
            <h2 className="mt-2 max-w-[66rem] text-3xl font-semibold leading-[1.08] sm:text-5xl">Every trade decision should <span className="text-primary">explain itself.</span></h2>
          </div>
        </div>

        <div className="case-study-scene grid overflow-hidden border-y border-border/80 bg-background lg:grid-cols-[14rem_1fr_14rem]">
          <nav aria-label="Example workflow steps" className="border-b bg-shell/70 p-4 lg:border-b-0 lg:border-r">
            <p className="section-label mb-4">Evidence path</p>
            <div className="flex gap-2 overflow-x-auto lg:grid lg:gap-0 lg:overflow-visible">
              {tradeCaseStudy.map((step, index) => (
                <button key={step.eyebrow} type="button" onClick={() => setActiveIndex(index)} className={cn("case-study-step min-w-[8.5rem] border-b-2 px-2 py-3 text-left transition-colors lg:min-w-0", index === activeIndex ? "border-primary text-foreground" : "border-transparent text-foreground/55 hover:text-foreground")}>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-primary">0{index + 1}</span>
                  <span className="mt-1 block text-[12px] font-medium">{step.eyebrow.replace(/^\d+\s*·\s*/, "")}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="relative min-h-[24rem] overflow-hidden p-5 sm:p-8">
            <div className="case-study-grid absolute inset-0 opacity-60" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.eyebrow} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.24, ease: "easeOut" }} className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">stage 0{activeIndex + 1} · {active.eyebrow.replace(/^\d+\s*·\s*/, "")}</p>
                    <h3 className="mt-2 max-w-[32rem] text-2xl font-semibold leading-[1.08] sm:text-3xl">{active.title}</h3>
                  </div>
                  <span className="hidden border-l-2 border-primary bg-shell px-3 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-primary sm:block">human review</span>
                </div>
                <div className="mt-7"><CaseStudyInsightCanvas stage={activeIndex} /></div>
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="border-t bg-shell/45 p-5 lg:border-l lg:border-t-0">
            <p className="section-label">Decision receipt</p>
            <div className="mt-5 border-l border-primary/40 pl-4">
              {[
                ["Signal captured", activeIndex >= 0],
                ["Context matched", activeIndex >= 1],
                ["Guardrail checked", activeIndex >= 2],
                ["Human approved", activeIndex >= 3]
              ].map(([label, done]) => (
                <div key={String(label)} className="relative pb-5 last:pb-0">
                  <span className={cn("absolute -left-[1.3rem] top-0 size-2 border", done ? "border-primary bg-primary" : "border-border bg-background")} />
                  <p className={cn("font-mono text-[11px] uppercase tracking-[0.08em]", done ? "text-primary" : "text-foreground/45")}>{label}</p>
                  <p className="mt-1 text-[11px] leading-5 text-foreground/65">{done ? "logged in the trace" : "waiting for next handoff"}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4"><span className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/60">Four stages · one evidence trail</span><div className="flex gap-1.5" aria-hidden="true">{tradeCaseStudy.map((step, index) => <span key={step.eyebrow} className={cn("size-1.5", index === activeIndex ? "bg-primary" : "bg-foreground/25")} />)}</div></div>
      </div>
    </section>
  );
}

export function LandingV2FounderStatement() {
  return (
    <section className="founder-signal-section relative border-b py-16">
      <MatrixField variant="subtle" density="low" seed="founder-signal" />
      <div className="container-page relative z-10 grid gap-8 lg:grid-cols-[12rem_1fr] lg:items-start">
        <div className="founder-photo-stack">
          <img src="/founders/hemanth.png" alt="Hemanth Rao, founder of Ubik" className="size-32 border object-cover grayscale" loading="eager" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em]">Hemanth Rao</span>
        </div>
        <figure className="founder-proof-copy max-w-[62rem]">
          <blockquote className="text-2xl font-medium leading-[1.18] tracking-[-0.02em] sm:text-3xl">
            “The hard part of perishable trade is not finding another dashboard. It is knowing which decision is safe to make when the documents, messages, and numbers disagree.”
          </blockquote>
          <p className="mt-7 text-lg leading-8 text-foreground">
            Two decades inside regulated supply chains: pharma compliance, perishable exports, $450M+ of P&amp;L, a
            $1B+ scale-up. Ubik is the system he needed at 2 AM before a container decision.
          </p>
        </figure>
      </div>
    </section>
  );
}

// Keep the concise names available to the landing page composition as well.
export const TradeCaseStudies = LandingV2CaseStudy;
export const FounderStatement = LandingV2FounderStatement;

export function LandingV2ToolsSection() {
  const [selectedTools, setSelectedTools] = useState<string[]>(["outlook"]);
  const reducedMotion = useReducedMotion();
  const combination = buildTradeCombination(selectedTools);

  function toggleTool(label: string) {
    setSelectedTools((current) => {
      if (current.includes(label)) return current.filter((tool) => tool !== label);
      if (current.length >= 3) return current;
      return [...current, label];
    });
  }

  return (
    <section className="systems-band relative overflow-hidden border-b bg-shell py-16 text-foreground sm:py-20">
      <MatrixField variant="security" density="medium" seed="systems-band" />
      <div className="container-page relative z-10">
        <div className="mb-9 grid items-end gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <SectionEyebrow>Systems of work</SectionEyebrow>
          <div>
            <h2 className="text-3xl font-semibold leading-[1.05] sm:text-5xl">
              What systems does Ubik connect to?
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/78">
              Select up to three systems. Ubik combines their signals into an agent workflow for an importer, exporter, or processor.
            </p>
          </div>
        </div>

        <div className="systems-console border border-foreground/24">
          <div className="system-tool-grid">
            {integrationTools.map(([label, domain]) => {
              const selected = selectedTools.includes(label);
              const atLimit = selectedTools.length >= 3 && !selected;
              return (
              <button
                key={label}
                type="button"
                onClick={() => toggleTool(label)}
                aria-pressed={selected}
                aria-disabled={atLimit}
                className={cn("system-tool", selected && "is-active", atLimit && "is-limited")}
              >
                <img src={favicon(domain)} alt="" loading="lazy" />
                <span>{label}</span>
                {selected ? <i>{selectedTools.indexOf(label) + 1}</i> : null}
              </button>
              );
            })}
          </div>

          <div className="system-combination-strip">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedTools.join("-") || "empty"}
                initial={reducedMotion ? false : { opacity: 0, y: 12, clipPath: "inset(15% 0 0 0)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8, clipPath: "inset(0 0 15% 0)" }}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="system-combination-content"
              >
                <div className="system-selection">
                  <span>Selected stack · {selectedTools.length}/3</span>
                  <div>
                    {selectedTools.length ? selectedTools.map((label) => {
                      const tool = integrationTools.find(([toolLabel]) => toolLabel === label);
                      return (
                        <button key={label} type="button" onClick={() => toggleTool(label)} aria-label={`Deselect ${label}`}>
                          <img src={favicon(tool?.[1] ?? "theubik.com")} alt="" />
                          {label}
                          <XIcon aria-hidden />
                        </button>
                      );
                    }) : <p>Select an app above to compose a workflow.</p>}
                  </div>
                </div>
                <div className="system-combination-result">
                  <span>{combination.eyebrow}</span>
                  <h3>{combination.title}</h3>
                  <p>{combination.body}</p>
                </div>
                <div className="system-combination-action">
                  <span className="agent-ubik-core" aria-hidden />
                  <p>{combination.action}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const railToneClasses = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-green-600 text-white",
  support: "bg-amber-600 text-white",
  foreground: "bg-shell text-foreground"
};

type RailChatMessage = {
  source: string;
  domain?: string;
  avatar?: string;
  copy: string;
  kind?: "operator" | "ubik";
};

const railChats: Record<string, { status: string; messages: RailChatMessage[]; task: string }> = {
  "Email arrives": {
    status: "New RFQ",
    messages: [
      { source: "Email", domain: "gmail.com", copy: "Buyer asks for 12.4 MT CIF NJ." },
      { source: "WhatsApp group", domain: "whatsapp.com", copy: "Team recalls the last approved floor." },
      {
        source: "SR Operator",
        kind: "operator",
        avatar: "https://i.pravatar.cc/72?img=12",
        copy: "@ubik create task. Pull buyer context and draft quote."
      }
    ],
    task: "Task created · example RFQ"
  }
};

function RailStepPanel({ item }: { item: RailStep }) {
  if (item.title === "Email arrives") {
    const chat = railChats[item.title];

    return (
      <div className="rail-chat-console">
        <div className="rail-chat-header">
          <span className={cn("inline-flex w-fit items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.06em]", railToneClasses[item.pill.tone])}>
            <item.pill.icon className="size-3" />
            {chat.status}
          </span>
          <span>{item.time}</span>
        </div>

        <div className="rail-chat-thread">
          {chat.messages.map((message) => (
            <div key={`${item.title}-${message.source}-${message.copy}`} className={cn("rail-chat-message", message.kind === "operator" && "is-operator", message.kind === "ubik" && "is-ubik")}>
              {message.kind === "ubik" ? (
                <span className="rail-ubik-mark" aria-hidden="true" />
              ) : message.kind === "operator" ? (
                <img className="rail-operator-avatar" src={message.avatar} alt="" loading="lazy" />
              ) : (
                <img src={favicon(message.domain ?? "theubik.com")} alt="" loading="lazy" />
              )}
              <div>
                <p>{message.source}</p>
                <span>{message.copy}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rail-chat-task">
          <span className="rail-ubik-mark" aria-hidden="true" />
          <p>{chat.task}</p>
        </div>
      </div>
    );
  }

  if (item.title === "Agent reads") {
    return (
      <div className="rail-artifact-grid rail-artifact-grid-ocr">
        <div className="rail-artifact-panel">
          <div className="rail-panel-label"><FilePdfIcon className="size-3.5" /> OCR read</div>
          <div className="rail-doc-sheet">
            <div className="rail-doc-topline" />
            <div className="rail-doc-row"><span>Buyer</span><b>Example account</b></div>
            <div className="rail-doc-row"><span>SKU</span><b>HS 0306.17</b></div>
            <div className="rail-doc-row"><span>Qty</span><b>12.4 MT</b></div>
            <div className="rail-doc-row"><span>Terms</span><b>CIF NJ</b></div>
          </div>
        </div>
        <div className="rail-artifact-panel">
          <div className="rail-panel-label"><SparkleIcon className="size-3.5" /> value check</div>
          <div className="rail-verify-stack">
            {[
              ["invoice history", "6 matched"],
              ["lane memory", "India → NJ"],
              ["finance floor", "$3.20/kg"],
              ["status", "ready to draft"]
            ].map(([label, value]) => (
              <div key={label}><span>{label}</span><b>{value}</b></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (item.title === "Margin checked") {
    return (
      <div className="rail-artifact-grid rail-artifact-grid-margin">
        <div className="rail-artifact-panel">
          <div className="rail-panel-label"><TableIcon className="size-3.5" /> pricing tables</div>
          <div className="rail-data-table">
            {[
              ["Zoho quote", "$3.42", "active"],
              ["Pricing intel", "$3.31", "90d median"],
              ["Finance DB", "$3.20", "floor"],
              ["Freight lane", "$0.18", "NJ CIF"]
            ].map(([source, value, meta]) => (
              <div key={source}><span>{source}</span><b>{value}</b><i>{meta}</i></div>
            ))}
          </div>
        </div>
        <div className="rail-artifact-panel rail-logic-card">
          <div className="rail-panel-label"><CurrencyInrIcon className="size-3.5" /> margin logic</div>
          <p>($3.42 - $3.20) × 12.4 MT</p>
          <div><span>actual</span><b>18.4%</b></div>
          <div><span>guardrail</span><b>17.5%</b></div>
          <strong>pass · +0.9pp</strong>
        </div>
      </div>
    );
  }

  if (item.title === "You approve") {
    return (
      <div className="rail-decision-queue">
        <div className="rail-panel-label"><EyeIcon className="size-3.5" /> decision queue</div>
        <div className="rail-decision-card">
          <span>ready</span>
          <h3>Approve buyer quote</h3>
          <p>Example buyer · 12.4 MT · $3.42/kg</p>
          <div><button type="button">Approve</button><button type="button">Edit draft</button></div>
        </div>
        <div className="rail-decision-foot"><CheckIcon className="size-3.5" /> human approval required before send</div>
      </div>
    );
  }

  if (item.title === "Sent to ERP") {
    return (
      <div className="rail-system-queue">
        {[
          [favicon("gmail.com"), "Email sent", "buyer reply delivered"],
          [favicon("zoho.com"), "Zoho mapped", "example PO"],
          [favicon("tallysolutions.com"), "Tally drafted", "accounting receipt"],
          [favicon("salesforce.com"), "CRM updated", "opp 28471"]
        ].map(([icon, title, copy]) => (
          <div key={title}><img src={icon} alt="" loading="lazy" /><span>{title}</span><p>{copy}</p></div>
        ))}
      </div>
    );
  }

  if (item.title === "Follow-up queued") {
    return (
      <div className="rail-timer-panel">
        <div className="rail-panel-label"><TimerIcon className="size-3.5" /> follow-up timer</div>
        <div className="rail-timer-clock">T+48h</div>
        <div className="rail-timer-track"><i /></div>
        <p>Draft only. No send without review.</p>
      </div>
    );
  }

  if (item.title === "Buyer confirms") {
    return (
      <div className="rail-confirm-panel">
        <div className="rail-chat-message">
          <img src={favicon("whatsapp.com")} alt="" loading="lazy" />
          <div><p>WhatsApp</p><span>Buyer: looks good, sending PO by EOD.</span></div>
        </div>
        <div className="rail-confirm-grid">
          <span>RFQ linked</span>
          <span>follow-up cancelled</span>
          <span>memory updated</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rail-evidence-flow">
      <div className="rail-panel-label"><ArchiveIcon className="size-3.5" /> evidence trail</div>
      <div className="rail-flow-row">
        {[
          [favicon("gmail.com"), "team email"],
          [favicon("adobe.com"), "CEO memo PDF"],
          [favicon("whatsapp.com"), "client update"]
        ].map(([icon, label], index) => (
          <div key={label} className="rail-flow-node">
            <img src={icon} alt="" loading="lazy" />
            <span>{label}</span>
            {index < 2 ? <i aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
      <div className="rail-chat-task">
        <span className="rail-ubik-mark" aria-hidden="true" />
        <p>Shared · evidence attached · example RFQ</p>
      </div>
    </div>
  );
}

export function LandingV2HowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const step = railSteps[activeStep];

  return (
    <section id="how" className="relative border-b border-t bg-background py-14">
      <MatrixField variant="process" density="medium" seed="how-rail-band" />
      <div className="container-page relative z-10">
        <div className="mb-8">
          <div className="max-w-none">
            <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.028em] sm:text-5xl lg:text-6xl">
              A whole shipment, <span className="text-primary">one morning</span>, six handoffs.
            </h2>
          </div>
        </div>

        <div className="border bg-card">
          <div className="grid gap-px bg-border md:hidden">
            {railSteps.map((item, index) => (
              <div key={`${item.time}-${item.title}`} className="bg-card">
                <button
                  type="button"
                  data-on={index === activeStep}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "w-full border-x-0 border-b-0 border-t-[3px] border-transparent bg-card px-3 py-3 text-left transition-colors hover:bg-muted",
                    index === activeStep && "border-t-primary bg-shell"
                  )}
                >
                  <div className="font-mono text-[11px] font-medium tracking-[0.06em] text-foreground/72 dark:text-foreground/82">{item.time}</div>
                  <div className="mt-1 text-[12px] font-medium leading-[1.4]">{item.title}</div>
                </button>
                {index === activeStep ? (
                  <div className="border-t bg-card px-4 py-5">
                    <RailStepPanel item={item} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <nav className="hidden gap-px bg-border md:grid md:grid-cols-4 xl:grid-cols-8">
            {railSteps.map((item, index) => (
              <button
                key={`${item.time}-${item.title}`}
                type="button"
                data-on={index === activeStep}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "border-x-0 border-b-0 border-t-[3px] border-transparent bg-card px-3 py-3 text-left transition-colors hover:bg-muted",
                  index === activeStep && "bg-shell border-t-primary"
                )}
              >
                <div className="font-mono text-[11px] font-medium tracking-[0.06em] text-foreground/72 dark:text-foreground/82">{item.time}</div>
                <div className="mt-1 text-[12px] font-medium leading-[1.4]">{item.title}</div>
              </button>
            ))}
          </nav>

          <div className="hidden p-5 md:block">
            <RailStepPanel item={step} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingV2WhatUbikDoes() {
  const items = [
    {
      icon: EnvelopeSimpleIcon,
      num: "01",
      title: "RFQ to quote",
      body: "Buyer email arrives. ubik pulls account context, inventory, COGS, and margin guardrails. Drafts a quote with three follow-ups attached. You approve, edit, or reject.",
      handoff: "human → review"
    },
    {
      icon: FilePdfIcon,
      num: "02",
      title: "PO ingestion → ERP handoff",
      body: "Buyer's PDF PO lands. ubik parses SKUs, maps to your ERP, prepares the accounting receipt. Pushes to Zoho / SAP / NetSuite on commit. Audit trail attached.",
      handoff: "system → erp queue"
    },
    {
      icon: ShippingContainerIcon,
      num: "03",
      title: "Transit-aware scheduling",
      body: "Container ETA shifts on Maersk. ubik detects, recalculates downstream promise dates, drafts the customer update. Before the customer asks.",
      handoff: "agent → drafting"
    },
    {
      icon: DesktopIcon,
      num: "04",
      title: "Margin watch + trade memory",
      body: "Power BI variance flagged. Pricing error caught before the quote leaves. Decisions searchable across linked projects, meetings, chats, documents.",
      handoff: "final → audited"
    }
  ] as const;

  return (
    <section id="product" className="border-b py-20">
      <div className="container-page">
        <div className="mb-10 grid items-end gap-5 lg:grid-cols-2">
          <div>
            <SectionEyebrow>§ what ubik does</SectionEyebrow>
            <h2 className="mt-2 text-3xl font-semibold leading-[1.1] tracking-[-0.028em] sm:text-4xl">
              The operator layer above your <span className="text-primary">ERP, CRM, email, and WhatsApp.</span>
            </h2>
          </div>
          <p className="text-[15px] leading-[1.6] text-foreground/72 dark:text-foreground/82">
            Five perishable-trade workflow primitives. In production with importers, exporters, and processors moving
            $25Mn+ or 100+ containers a year. <b className="font-medium text-foreground">Every action human-reviewed before it moves.</b>
          </p>
        </div>

        <div className="grid gap-px border bg-border md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col gap-3 bg-card px-7 py-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-9 items-center justify-center border bg-muted text-primary">
                  <item.icon className="size-[18px]" />
                </span>
                <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/72 dark:text-foreground/82">{item.num}</span>
              </div>
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.018em]">{item.title}</h3>
              <p className="text-[13px] leading-[1.6] text-foreground/72 dark:text-foreground/82">{item.body}</p>
              <span className="mt-2 inline-flex items-center border-l-2 border-primary bg-shell px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-primary">
                {item.handoff}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
