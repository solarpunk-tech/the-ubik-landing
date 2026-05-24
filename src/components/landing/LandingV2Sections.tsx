"use client";

import { useEffect, useMemo, useState } from "react";
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
    title: "RFQ ready to quote · Atlantic Cold Storage",
    meta: "gmail · salesforce · margin checked",
    metaIcons: [favicon("salesforce.com")],
    stat: "+ ₹2.4L",
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
    title: "PO → ERP → Accounting · BL-2408-219",
    meta: "zoho · tally · 47 / 12.4 MT",
    metaIcons: [favicon("zoho.com")],
    stat: "draft",
    icon: favicon("tallysolutions.com")
  }
];

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
  return <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{children}</span>;
}

function FaviconImg({ src, alt = "" }: { src: string; alt?: string }) {
  return <img src={src} alt={alt} className="size-[18px]" loading="lazy" />;
}

export function LandingV2Hero() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [thinkTime, setThinkTime] = useState(3.4);

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

    return () => {
      window.clearInterval(rowTimer);
      window.clearInterval(thinkTimer);
    };
  }, []);

  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden border-b">
      <MatrixField variant="hero" density="high" seed="ubik-hero-po-to-order" />
      <div className="container-page relative z-10 grid min-h-[calc(100svh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_1.15fr] lg:py-18">
        <div>
          <div className="inline-flex items-center gap-2 border bg-background px-2.5 py-1.5 font-mono text-[11px] tracking-[0.04em] text-muted-foreground shadow-sm">
            <FishIcon className="size-3 text-primary" weight="regular" />
            <span>Live for Global Seafood</span>
          </div>

          <h1 className="mt-5 text-5xl font-semibold leading-[0.98] text-foreground sm:text-6xl lg:text-[4.5rem]">
            Self-Evolving
            <br />
            Workspace
            <br />
            for <span className="text-primary">Trade Operations</span>
          </h1>

          <p className="mt-5 max-w-[32rem] text-base leading-[1.55] text-muted-foreground sm:text-lg">
            Built to automate decision making for{" "}
            <span className="font-semibold text-primary">frozen food</span> importers, exporters moving{" "}
            <span className="font-semibold text-primary">$300M+</span> or{" "}
            <span className="font-semibold text-primary">20,000+ containers</span> a year
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button asChild size="lg" className="h-[42px] px-5">
              <a href={externalLinks.app} onClick={() => trackEvent("cta_clicked", { cta: "try_ubik", location: "hero" })}>
                Try Ubik Now <ArrowRightIcon />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-[42px] px-5">
              <a href={externalLinks.founderMeeting} onClick={() => trackEvent("cta_clicked", { cta: "talk_to_founders", location: "hero" })}>
                Talk to founders
              </a>
            </Button>
          </div>
        </div>

        <div className="border bg-card shadow-lg">
          <div className="flex items-center justify-between gap-4 border-b bg-shell px-[1.125rem] py-[0.875rem]">
            <h4 className="text-[13px] font-semibold">Operating queue · tuesday 09:14 ist</h4>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground before:size-1.5 before:animate-pulse before:bg-green-500 before:content-['']">
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
                    <div className={cn("mt-0.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.04em]", active ? "text-primary-foreground/95" : "text-muted-foreground")}>
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
            <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.04em] text-primary">
              <span className="size-1.5 animate-pulse bg-primary" />
              <span>ubik · drafting buyer reply · {thinkTime.toFixed(1)}s</span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.04em] text-muted-foreground">auto-refresh · 12s</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingV2ToolsSection() {
  return (
    <section className="relative border-b bg-background py-16">
      <MatrixField variant="subtle" density="medium" seed="tools-band" />
      <div className="container-page relative z-10">
        <div className="mb-8 grid items-end gap-5 lg:grid-cols-2">
          <div>
            <SectionEyebrow>§ tools we read from</SectionEyebrow>
            <h2 className="mt-2 text-3xl font-semibold leading-[1.1] tracking-[-0.028em] sm:text-4xl">
              Wherever your work already <span className="text-primary">lives.</span>
            </h2>
          </div>
          <p className="text-[15px] leading-[1.6] text-muted-foreground">
            Connect to your stack and stop switching apps for work. We read state, draft, take action while you
            monitor.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-px border bg-border sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
          {integrationTools.map(([label, domain]) => (
            <div key={label} className="flex flex-col items-center gap-2 bg-card px-3 py-4 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-accent">
              <img src={favicon(domain)} alt="" className="size-[22px]" loading="lazy" />
              <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground">{label}</span>
            </div>
          ))}
          <div className="flex items-center justify-center bg-card px-3 py-4 font-mono text-[10px] text-muted-foreground">
            + <b className="ml-1 text-foreground">120</b>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingV2HowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const step = railSteps[activeStep];
  const toneClasses = useMemo(
    () => ({
      primary: "bg-primary text-primary-foreground",
      success: "bg-green-600 text-white",
      support: "bg-amber-600 text-white",
      foreground: "bg-foreground text-background"
    }),
    []
  );
  const statToneClasses = useMemo(
    () => ({
      default: "text-primary",
      success: "text-green-600",
      support: "text-amber-700 dark:text-amber-300"
    }),
    []
  );

  function RailStepPanel({ item }: { item: RailStep }) {
    return (
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:gap-8">
        <div>
          <h4 className="mb-2 text-2xl font-semibold">{item.heading}</h4>
          <div className="max-w-[34rem] space-y-4 text-[14px] leading-[1.6] text-muted-foreground">
            {item.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 border bg-card px-2.5 py-[0.3rem] font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground"
              >
                {chip.kind === "img" ? (
                  <img src={chip.src} alt="" className="size-3.5" loading="lazy" />
                ) : (
                  <chip.icon className="size-3 text-primary" />
                )}
                <span>{chip.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex min-h-[240px] flex-col gap-3 border bg-background p-4">
          <span className={cn("inline-flex w-fit items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em]", toneClasses[item.pill.tone])}>
            <item.pill.icon className="size-3" />
            {item.pill.label}
          </span>

          <div className="grid grid-cols-[24px_1fr_auto] items-center gap-2.5 border bg-card px-3 py-2.5 text-[12px]">
            {item.vizRow.icon === "agent" ? (
              <span className="size-[18px] bg-primary" />
            ) : (
              <img src={item.vizRow.icon} alt="" className="size-[18px]" loading="lazy" />
            )}
            <div>
              <div className="text-[13px] font-medium">{item.vizRow.title}</div>
              <div className="font-mono text-[10px] tracking-[0.04em] text-muted-foreground">{item.vizRow.meta}</div>
            </div>
            <span className={cn("font-mono text-[12px] font-semibold", statToneClasses[item.vizRow.statTone ?? "default"])}>
              {item.vizRow.stat}
            </span>
          </div>

          {item.memoryRows ? (
            <div className="flex flex-col gap-1.5 border bg-shell px-3 py-2.5">
              <div className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                memory · 3 sources recalled
              </div>
              {item.memoryRows.map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                  {row.icon === "table" ? (
                    <TableIcon className="size-3 text-primary" />
                  ) : (
                    <img src={row.icon} alt="" className="size-3" loading="lazy" />
                  )}
                  <span className="text-[11px] text-foreground">{row.label}</span>
                </div>
              ))}
            </div>
          ) : null}

          <span className="inline-flex items-center border-l-2 border-primary bg-shell px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-primary">
            {item.handoff}
          </span>
        </div>
      </div>
    );
  }

  return (
    <section id="how" className="relative border-b border-t bg-background py-20">
      <MatrixField variant="process" density="medium" seed="how-rail-band" />
      <div className="container-page relative z-10">
        <div className="mb-10 grid items-end gap-5 lg:grid-cols-2">
          <div>
            <SectionEyebrow>§ how it works · tuesday 09:14–14:22</SectionEyebrow>
            <h2 className="mt-2 text-3xl font-semibold leading-[1.1] tracking-[-0.028em] sm:text-4xl">
              A whole shipment, <span className="text-primary">one morning</span>, six handoffs.
            </h2>
          </div>
          <p className="text-[15px] leading-[1.6] text-muted-foreground">
            Scrub the rail to walk through a real Tuesday. Buyer email arrives at 9:14. Quote sent and audit-logged by
            14:22. <b className="font-medium text-foreground">Six explicit handoffs.</b> Every one human-reviewed.
          </p>
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
                  <div className="font-mono text-[10px] font-medium tracking-[0.06em] text-muted-foreground">{item.time}</div>
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
                <div className="font-mono text-[10px] font-medium tracking-[0.06em] text-muted-foreground">{item.time}</div>
                <div className="mt-1 text-[12px] font-medium leading-[1.4]">{item.title}</div>
              </button>
            ))}
          </nav>

          <div className="hidden px-8 py-7 md:block">
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
          <p className="text-[15px] leading-[1.6] text-muted-foreground">
            Five seafood-native workflow primitives. In production with importers, exporters, and processors moving
            $300M+ a year. <b className="font-medium text-foreground">Every action human-reviewed before it moves.</b>
          </p>
        </div>

        <div className="grid gap-px border bg-border md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col gap-3 bg-card px-7 py-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex size-9 items-center justify-center border bg-muted text-primary">
                  <item.icon className="size-[18px]" />
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{item.num}</span>
              </div>
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.018em]">{item.title}</h3>
              <p className="text-[13px] leading-[1.6] text-muted-foreground">{item.body}</p>
              <span className="mt-2 inline-flex items-center border-l-2 border-primary bg-shell px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-primary">
                {item.handoff}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
