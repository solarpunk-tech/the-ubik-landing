import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon, CheckIcon, DatabaseIcon, FileXlsIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { PageShell } from "@/components/landing/PageShell";
import { DiscussButton } from "@/components/landing/DiscussButton";
import { LiveSquare, SupplierExampleCard } from "@/components/landing/SupplierExampleCard";
import { AgentRun, type RunStep } from "@/components/landing/motion/AgentRun";
import {
  AllocationArtifact,
  BuyerEmailArtifact,
  ComplianceBrowserArtifact,
  ContainerLoadArtifact,
  PhotoshopArtifact,
  SupplierCompareArtifact
} from "@/components/landing/motion/RunArtifacts";
import { useInView } from "@/lib/use-in-view";
import { DitherPanel } from "@/components/landing/DitherPanel";
import { workflowMascots } from "@/lib/workflow-mascots";
import { PortFigure } from "@/components/landing/port-figure/PortFigure";
import { WorkflowVisual } from "@/components/landing/WorkflowVisuals";
import { OwnYourStack } from "@/components/landing/OwnYourStack";
import { cn } from "@/lib/utils";
import { featuredBlogPost } from "@/lib/landing-content";
import { appLink } from "@/lib/links";
import { featuredWorkflowSlugs, workflowPath, type WorkflowCopy as WorkflowPageCopy } from "@/lib/workflows";
import { trackEvent } from "@/lib/posthog";

/* The loop verb lives on the card chip, not in a caption strip above the grid.
   One occurrence each: the chip labels its own card, so a separate
   Remember/Reason/Act line would have restated it a second time.
   Copy lives under home.platform.layers, in this order. */

type TeamCompany = {
  label: string;
  domain?: string;
  logo?: string;
};

const teamCompanies: readonly TeamCompany[] = [
  { label: "AZ Gems", domain: "azgems.com" },
  { label: "Sandhya Aqua", logo: "https://sandhyaaqua.com/wp-content/uploads/2020/07/SA-Logo.png" },
  { label: "Dr. Reddy's", domain: "drreddys.com" },
  { label: "Airtel", domain: "airtel.in" },
  { label: "Udaan", domain: "udaan.com" },
  { label: "Ola", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Ola_Cabs_logo.svg" },
  { label: "Walmart", domain: "walmart.com" },
  { label: "Whole Foods Market", domain: "wholefoodsmarket.com" },
  { label: "Costco", domain: "costco.com" },
  { label: "AquaExchange", domain: "aquaexchange.com" },
  { label: "ClearTax", domain: "cleartax.in" },
  { label: "Arintra", domain: "arintra.com" },
  { label: "Lumian", domain: "lumian.ai" },
  { label: "Housing", domain: "housing.com" }
] as const;

// Every row carries a list of interchangeable tools rather than one logo: real
// operators run Gmail *or* Outlook, SAP *or* Oracle *or* Odoo. The source panel
// cycles them so the stack reads as "whatever you already use". Visible copy
// lives under home.workflows.items.<kind>; apps and stats line up by index.
const workflowTeams = [
  {
    number: "01",
    apps: [["gmail.com", "outlook.com"], ["whatsapp.com", "slack.com"], ["salesforce.com", "hubspot.com", "odoo.com"]],
    entity: "Buyer promise / SO-29481",
    validTime: "29 JUL · 12:00",
    knownTime: "19 JUL · 10:06",
    kind: "promise",
    chart: "line",
    stats: ["03", "01", "07"]
  },
  {
    number: "02",
    apps: [["sap.com", "oracle.com", "zoho.com", "odoo.com"], ["manh.com", "blueyonder.com"], ["powerbi.microsoft.com", "tableau.com", "metabase.com"]],
    entity: "Lot allocation / LOT-87",
    validTime: "18 JUL · 14:20",
    knownTime: "19 JUL · 08:16",
    kind: "inventory",
    chart: "bars",
    stats: ["04", "02", "0"]
  },
  {
    number: "03",
    apps: [["fda.gov", "europa.eu"], ["bapcertification.org", "asc-aqua.org", "globalgap.org"], ["docusign.com", "adobe.com"]],
    entity: "Health certificate / Lot 87",
    validTime: "17 JUL · 06:00",
    knownTime: "19 JUL · 09:42",
    kind: "traceability",
    chart: "heatmap",
    stats: ["12", "02", "00"]
  },
  {
    number: "04",
    apps: [["/logos/photoshop.svg", "adobe.com"], ["dropbox.com", "box.com", "sharepoint.com"], ["notion.so", "atlassian.com"]],
    entity: "Pack spec / SKU-4471",
    validTime: "21 JUL · 09:00",
    knownTime: "19 JUL · 11:24",
    kind: "override",
    chart: "steps",
    stats: ["18", "18", "16"]
  },
  {
    number: "05",
    apps: [["outlook.com", "gmail.com"], ["coupa.com", "ariba.com", "zycus.com"], ["docusign.com", "dropbox.com"]],
    entity: "Supplier promise / PKG-2841",
    validTime: "22 JUL · 17:00",
    knownTime: "19 JUL · 14:38",
    kind: "vendors",
    chart: "funnel",
    stats: ["04", "03", "01"]
  },
  {
    number: "06",
    apps: [["ramp.com", "brex.com"], ["maersk.com", "flexport.com"], ["xe.com", "wise.com"]],
    entity: "Landed cost / SH-29481",
    validTime: "17 JUL · 16:10",
    knownTime: "19 JUL · 09:52",
    kind: "margin",
    chart: "stack",
    stats: ["18.4%", "17.5%", "+90 bps"]
  }
] as const;

type WorkflowTeam = (typeof workflowTeams)[number];

type WorkflowCopy = {
  team: string;
  shortTeam: string;
  sourceLine: string;
  apps: { label: string; status: string }[];
  memoryLabel: string;
  links: string[];
  resultLabel: string;
  outcomeTitle: string;
  resultTitle: string;
  resultDetail: string;
  stats: string[];
  run: { steps: RunStep[]; result: string };
};

type RunLabels = { step: string; agent: string; reads: string; review: string; approve: string; open: string; memory: string; links: string; subagents: string };

/* Bios are background, not job description. What each person does at Ubik is
   already the whole page above them; what a buyer cannot tell from the product
   is who built it and what they saw before this. Role and bio live under
   home.team.profiles, in this order. */
const favicon = (domain: string) => (domain.startsWith("/") ? domain : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
const companyLogo = (company: TeamCompany) => company.logo ?? favicon(company.domain ?? "");

/** Title on the left, lede on the right: section heads use the full width on desktop. */
function SectionHead({ id, title, lede, inverse = false }: { id: string; title: string; lede: string; inverse?: boolean }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
      <h2 id={id} className={cn("home-section-title !max-w-none", inverse && "text-primary-foreground")}>{title}</h2>
      <p className={cn("max-w-xl text-lg leading-8 lg:justify-self-end", inverse ? "text-primary-foreground/80" : "text-muted-foreground")}>{lede}</p>
    </div>
  );
}

/** The four workflow pages, each with a live widget for the record it works on. */
function WorkflowLibrary() {
  const { t } = useTranslation();
  return (
    <section className="border-b border-border" aria-labelledby="home-workflows-title">
      <div className="container-page py-16 sm:py-24">
        <SectionHead id="home-workflows-title" title={t("home.workflows.title")} lede={t("home.workflows.lede")} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredWorkflowSlugs.map((slug) => {
            const item = t(`workflows.items.${slug}`, { returnObjects: true }) as WorkflowPageCopy;
            return (
              <Link
                key={slug}
                to={workflowPath(slug)}
                onClick={() => trackEvent("workflow_card_clicked", { workflow: slug, location: "home" })}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[box-shadow,border-color] hover:border-border-strong hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <DitherPanel art={workflowMascots[slug]}>
                  <WorkflowVisual slug={slug} visual={item.visual} className="h-[17.5rem]" />
                </DitherPanel>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold tracking-[-0.02em]">{item.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 border-t border-border pt-4 text-[13px] font-medium text-primary-text">
                    {t("workflows.labels.seeWorkflow")}
                    <ArrowRightIcon aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const runArtifacts: Record<WorkflowTeam["kind"], (props: { step: number }) => React.ReactNode> = {
  promise: BuyerEmailArtifact,
  inventory: AllocationArtifact,
  traceability: ComplianceBrowserArtifact,
  override: PhotoshopArtifact,
  vendors: SupplierCompareArtifact,
  margin: ContainerLoadArtifact
};

function TradeFlowOntology({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  const item = workflowTeams[active];
  const copyFor = (kind: WorkflowTeam["kind"]) => t(`home.workflows.items.${kind}`, { returnObjects: true }) as WorkflowCopy;
  const copy = copyFor(item.kind);
  const labels = t("home.workflows.run", { returnObjects: true }) as RunLabels;
  const Artifact = runArtifacts[item.kind];

  return (
    <section id="workflows" className="trade-flow-section scroll-mt-20 border-b border-border">
      <div className="container-page py-16 sm:py-24">
        <SectionHead id="home-loop-title" title={t("home.workflows.examplesTitle")} lede={t("home.workflows.examplesLede")} />
        <div className="mt-10 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t("home.workflows.spineLabel")}>
          {workflowTeams.map((team, index) => (
            <button
              key={team.kind}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => {
                onSelect(index);
                setIsPaused(true);
              }}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                index === active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground"
              )}
            >
              <span className="tabular-nums opacity-60">{team.number}</span>
              {copyFor(team.kind).team}
            </button>
          ))}
        </div>
        <AgentRun
          key={item.kind}
          className="mt-6"
          team={copy.team}
          steps={copy.run.steps}
          result={copy.run.result}
          labels={labels}
          artifact={(step) => <Artifact step={step} />}
          onDone={isPaused ? undefined : () => onSelect((active + 1) % workflowTeams.length)}
          apps={item.apps.map((alts) => favicon(alts[0]))}
        />
      </div>
    </section>
  );
}

type CardCopy = { label?: string; verb?: string; title: string; copy: string };

type PilotWidgetCopy = Record<"pick" | "reads" | "drafts" | "writes" | "afterApproval" | "reviewed" | "live" | "before" | "pilot" | "expand", string>;

const pilotSources = [
  <img key="gmail" src="/logos/gmail.svg" alt="Gmail" className="size-4" />,
  <img key="outlook" src="/logos/outlook.svg" alt="Outlook" className="size-4" />,
  <img key="whatsapp" src="/logos/whatsapp.svg" alt="WhatsApp" className="size-4" />,
  <DatabaseIcon key="erp" aria-label="ERP" className="size-4 text-primary-text" />,
  <FileXlsIcon key="sheet" aria-label="Spreadsheet" weight="fill" className="size-4 text-ok-text" />
];

/** The small picture under each pilot step: what that step actually settles. */
function PilotWidget({ step, copy, on }: { step: number; copy: PilotWidgetCopy; on: boolean }) {
  if (step === 0) {
    return (
      <div className="grid gap-3">
        <div className="flex gap-1.5">
          {pilotSources.map((icon, index) => (
            <span
              key={index}
              className={cn("inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card transition-all duration-500", on ? "opacity-100" : "translate-y-1 opacity-0")}
              style={{ transitionDelay: `${index * 90}ms` }}
            >
              {icon}
            </span>
          ))}
        </div>
        <span className={cn("inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[12.5px] font-medium text-primary-text transition-opacity duration-500", on ? "opacity-100 delay-500" : "opacity-0")}>
          <LiveSquare className="size-1.5" />
          {copy.pick}
        </span>
      </div>
    );
  }
  if (step === 1) {
    const rows: [string, boolean][] = [[copy.reads, true], [copy.drafts, true], [copy.writes, false]];
    return (
      <ul className="grid gap-2 text-[13px]">
        {rows.map(([label, enabled], index) => (
          <li key={label} className="flex items-center justify-between gap-3">
            <span className="text-foreground/80">{label}</span>
            {enabled ? (
              <span aria-label="On" className={cn("relative h-4 w-7 rounded-full transition-colors duration-300", on ? "bg-primary" : "bg-border")} style={{ transitionDelay: `${300 + index * 200}ms` }}>
                <span className={cn("absolute top-0.5 size-3 rounded-full bg-white transition-[left] duration-300", on ? "left-3.5" : "left-0.5")} style={{ transitionDelay: `${300 + index * 200}ms` }} />
              </span>
            ) : (
              <span className="rounded-full bg-support/25 px-2 py-0.5 text-[12px] font-medium text-support-text">{copy.afterApproval}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (step === 2) {
    return (
      <div className="grid gap-2.5">
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 8 }, (_, index) => (
            <span key={index} className="relative h-5 overflow-hidden rounded-[3px] bg-border/70">
              <span
                className={cn("absolute inset-0 flex items-center justify-center bg-ok/80 text-white transition-opacity duration-300", on ? "opacity-100" : "opacity-0")}
                style={{ transitionDelay: `${400 + index * 160}ms` }}
              >
                <CheckIcon weight="bold" className="size-3" />
              </span>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-[12.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><LiveSquare className="size-1.5" />{copy.live}</span>
          <span className="font-medium text-ok-text">{copy.reviewed}</span>
        </div>
      </div>
    );
  }
  const bars: [string, string, string][] = [[copy.before, "92%", "bg-foreground/20"], [copy.pilot, "38%", "bg-primary"]];
  return (
    <div className="grid gap-2.5">
      {bars.map(([label, width, tone], index) => (
        <div key={label} className="grid grid-cols-[3.25rem_1fr] items-center gap-2 text-[12.5px] text-muted-foreground">
          <span>{label}</span>
          <span className="h-2.5 rounded-full bg-border/50">
            <span className={cn("block h-full rounded-full transition-[width] duration-700 ease-out", tone)} style={{ width: on ? width : "0%", transitionDelay: `${400 + index * 300}ms` }} />
          </span>
        </div>
      ))}
      <span className={cn("ml-[3.75rem] inline-flex w-fit items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-[12px] font-medium transition-opacity duration-500", on ? "opacity-100 delay-1000" : "opacity-0")}>
        {copy.expand}
        <ArrowRightIcon aria-hidden className="size-3 text-primary-text" />
      </span>
    </div>
  );
}

/** One pilot step. Each card watches itself, so on a phone the widgets play as each card arrives. */
function PilotStep({ step, index, widget }: { step: CardCopy; index: number; widget: PilotWidgetCopy }) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.45 });
  return (
    <li ref={ref} className="relative flex min-w-0 flex-col">
      <span className={cn("relative z-10 inline-flex size-8 items-center justify-center rounded-lg border text-[12.5px] font-medium tabular-nums transition-colors duration-500", inView ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-primary-text")} style={{ transitionDelay: `${index * 250}ms` }}>
        0{index + 1}
      </span>
      <div className="mt-4 flex flex-1 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-xl font-semibold tracking-[-0.02em]">{step.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.copy}</p>
        <div className="mt-auto pt-5">
          <div className="rounded-xl border border-border bg-background p-3.5">
            <PilotWidget step={index} copy={widget} on={inView} />
          </div>
        </div>
      </div>
    </li>
  );
}

function PilotSteps() {
  const { t } = useTranslation();
  const steps = t("home.pilot.steps", { returnObjects: true }) as CardCopy[];
  const widget = t("home.pilot.widget", { returnObjects: true }) as PilotWidgetCopy;
  const { ref, inView } = useInView<HTMLOListElement>({ threshold: 0.3 });
  return (
    <section className="home-pilot border-b border-border" aria-labelledby="home-pilot-title">
      <div className="container-page py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="home-pilot-title" className="home-section-title max-w-3xl">{t("home.pilot.title")}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <DiscussButton location="pilot" />
            <Button asChild variant="outline" size="lg" className="home-secondary-action">
              <Link to="/pricing">{t("cta.pricing")}</Link>
            </Button>
          </div>
        </div>
        <ol ref={ref} className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* The track the steps sit on; the square walks it once the row is on screen. */}
          <span aria-hidden className="absolute left-4 right-4 top-4 hidden h-px bg-[linear-gradient(90deg,hsl(var(--border-strong))_50%,transparent_0)] bg-[length:8px_1px] lg:block">
            {inView ? <LiveSquare className="lane-runner absolute -top-[3px] left-0 size-1.5" /> : null}
          </span>
          {steps.map((step, index) => (
            <PilotStep key={step.title} step={step} index={index} widget={widget} />
          ))}
        </ol>
      </div>
    </section>
  );
}

type FaqCopy = { q: string; a: string };

/* Plain <details>: the answers are in the HTML whether or not a reader (or a
   crawler) opens them, and the same list feeds the FAQPage structured data. */
function HomeFaq({ items }: { items: FaqCopy[] }) {
  const { t } = useTranslation();
  return (
    <section className="home-faq border-t border-border" aria-labelledby="home-faq-title">
      <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.7fr_1.3fr]">
        <h2 id="home-faq-title" className="home-section-title">{t("home.faq.title")}</h2>
        <div className="border-t border-border">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-border py-5">
              <summary className="cursor-pointer list-none text-lg font-semibold marker:hidden">
                <span className="flex items-start justify-between gap-6">
                  {item.q}
                  <span aria-hidden className="text-primary transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/72">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  const { t } = useTranslation();
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const scale = t("home.hero.scale", { returnObjects: true }) as { value: string; label: string }[];
  const faq = t("home.faq.items", { returnObjects: true }) as FaqCopy[];

  return (
    <PageShell>
      <Seo
        title={t("home.seo.title")}
        description={t("home.seo.description")}
        canonical="https://theubik.com/"
        image="/og-image.jpg?v=4"
        imageAlt="ubik: decision-making engine for importers and exporters, reading email, conversations and the ERP. An engraving of a harbour quay piled with seafood, dairy, soy, grain and fruit beside a cargo ship."
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Ubik",
          applicationCategory: "BusinessApplication",
          description: t("home.hero.definition"),
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "1000", priceCurrency: "USD", url: "https://theubik.com/pricing" }
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a }
          }))
        }}
      />

      <main className="home-minimal overflow-hidden">
        <section className="home-hero relative overflow-clip">
          <PortFigure background className="home-hero-berth" />
          <div className="container-page relative z-10 grid gap-12 pt-16 pb-10 sm:pt-24 sm:pb-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:pt-20 lg:pb-14">
            <div>
              {/* Two sentences, so a step down from the one-line display size. */}
              <h1 className="home-display max-w-[16ch]" style={{ fontSize: "clamp(2.6rem, 5vw, 4.6rem)" }}>
                {t("home.hero.titleLead")} <em>{t("home.hero.titleEmphasis")}</em>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-foreground/72">{t("home.hero.lede")}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <DiscussButton location="hero" />
                <Button asChild variant="outline" size="lg" className="home-secondary-action">
                  <Link to="/workflows" onClick={() => trackEvent("cta_clicked", { cta: "workflows", location: "hero" })}>
                    {t("home.hero.example")}
                  </Link>
                </Button>
              </div>
              <a
                href={appLink("hero_open_app")}
                onClick={() => trackEvent("cta_clicked", { cta: "open_app", location: "hero" })}
                className="mt-4 inline-block text-sm text-foreground/72 underline-offset-4 hover:underline"
              >
                {t("cta.openApp")}
              </a>
              <div className="mt-12 max-w-xl border-t border-foreground/18 pt-5">
                <p className="tabular-nums text-[12.5px] text-foreground/72">{t("home.hero.scaleLabel")}</p>
                <div className="mt-3 grid grid-cols-3">
                  {scale.map(({ value, label }) => (
                    <div key={label} className="pr-3">
                      <p className="text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
                      <p className="mt-1 tabular-nums text-[12.5px] text-foreground/72">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <SupplierExampleCard />
          </div>
        </section>

        {/* Team credentials sit right under the promise, labelled as what they
            are; customer stories replace or join them only with permission. */}
        <section className="home-closing border-b border-border">
          <div className="container-page py-8">
            <div className="founder-company-row" aria-label={t("home.team.companiesAria")}>
              <span className="founder-company-label">{t("home.evidence.label")}</span>
              <div className="founder-company-ticker logo-ticker-fade">
                <div className="logo-ticker-track">
                  {[...teamCompanies, ...teamCompanies].map((company, index) => (
                    <span key={`${company.label}-${index}`}>
                      <img src={companyLogo(company)} alt="" loading="lazy" />
                      <small>{company.label}</small>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <WorkflowLibrary />

        <TradeFlowOntology active={activeWorkflow} onSelect={setActiveWorkflow} />

        <OwnYourStack />

        <PilotSteps />

        <section className="home-closing">
          <div className="container-page py-16 sm:py-24">
            <div className="closing-cta">
              <div>
                <h2 className="home-section-title closing-cta-title">{t("home.closing.title")}</h2>
                <p className="closing-cta-copy">{t("home.closing.copy")}</p>
                <p className="mt-3 text-sm text-foreground/60">
                  {t("home.closing.pricing")}{" "}
                  <Link to="/pricing" className="font-semibold text-primary hover:underline">{t("cta.pricing")}</Link>
                </p>
              </div>
              <DiscussButton location="closing" />
            </div>
          </div>
        </section>

        <HomeFaq items={faq} />

        <section className="home-journal border-t border-border">
          <div className="container-page grid gap-8 py-16 sm:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <h2 className="home-section-title">{t("home.journal.title")}</h2>
            </div>
            <div className="border-l-2 border-primary pl-6 sm:pl-8">
              <h3 className="max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl">{featuredBlogPost.title}</h3>
              <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{t("home.journal.readLatest")} <ArrowRightIcon /></Link>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
