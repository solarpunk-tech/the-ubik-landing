import { Link, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import { DiscussButton } from "@/components/landing/DiscussButton";
import { PageShell } from "@/components/landing/PageShell";
import { WorkflowRun } from "@/components/landing/WorkflowRun";
import { WorkflowVisual } from "@/components/landing/WorkflowVisuals";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { appIcons, workflowApps } from "@/lib/apps";
import { isWorkflowSlug, workflowPath, workflowSlugs, type WorkflowCopy } from "@/lib/workflows";

/** One workflow: what it does in a sentence, the product surface, four steps and what the team gets. */
export default function WorkflowPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  if (!isWorkflowSlug(slug)) return <Navigate to="/workflows" replace />;

  const item = t(`workflows.items.${slug}`, { returnObjects: true }) as WorkflowCopy;
  const label = (key: string, values?: Record<string, number>) => t(`workflows.labels.${key}`, values);
  const related = workflowSlugs.filter((other) => other !== slug);

  return (
    <PageShell>
      <Seo title={item.seoTitle} description={item.seoDescription} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: item.name,
          description: item.lede,
          step: item.steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.title, text: step.copy }))
        }}
      />
      <main className="overflow-hidden">
        <section className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-[12.5px] font-medium text-muted-foreground">
              <Link to="/workflows" className="hover:underline">{label("all")}</Link>
              <span aria-hidden className="mx-1.5 text-border-strong">/</span>
              {item.audience}
            </p>
            <h1 className="home-display mt-4 max-w-[14ch]" style={{ fontSize: "clamp(2.6rem, 5vw, 4.4rem)" }}>{item.name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{item.lede}</p>
            <DiscussButton location={`workflow_${slug}_hero`} label={item.cta} className="mt-8" />
          </div>
          <div className="home-stage relative">
            <WorkflowVisual slug={slug} visual={item.visual} className="min-h-[19rem] p-5 text-[13.5px] shadow-2xl" />
          </div>
        </section>

        <section className="container-page pb-14 sm:pb-20">
          <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {(item.stats ?? []).map((stat) => (
              <div key={stat.label} className="bg-background p-5 sm:p-6">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-semibold tracking-[-0.03em] tabular-nums text-primary-text sm:text-4xl">{stat.value}</dd>
                <dd className="mt-2 text-sm leading-6 text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
          {item.statsNote ? <p className="mt-3 text-[12.5px] text-muted-foreground">{item.statsNote}</p> : null}
          <ConnectsTo key={slug} apps={workflowApps[slug]} label={label} />
        </section>

        <section className="border-y border-border bg-card/60">
          <div className="container-page py-14 sm:py-20">
            <WorkflowRun slug={slug} steps={item.steps} title={label("steps")} />
          </div>
        </section>

        <section className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">{label("outputs")}</h2>
            <ul className="mt-6 grid gap-3">
              {item.outputs.map((output) => (
                <li key={output} className="flex items-start gap-3 text-base">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-accent text-primary-text">
                    <CheckIcon weight="bold" className="size-3" />
                  </span>
                  {output}
                </li>
              ))}
            </ul>
            <DiscussButton location={`workflow_${slug}_footer`} label={item.cta} className="mt-8" />
          </div>
          <nav aria-label={label("related")}>
            <h2 className="text-[12.5px] font-medium text-muted-foreground">{label("related")}</h2>
            <ul className="mt-3 grid gap-2">
              {related.map((other) => (
                <li key={other}>
                  <Link
                    to={workflowPath(other)}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-border-strong"
                  >
                    <span>
                      {t(`workflows.items.${other}.name`)}
                      <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">{t(`workflows.items.${other}.summary`)}</span>
                    </span>
                    <ArrowRightIcon aria-hidden className="shrink-0 text-primary-text transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>
    </PageShell>
  );
}

function AppChip({ name, small = false }: { name: string; small?: boolean }) {
  return (
    <li className={cn("flex items-center gap-2 rounded-lg border border-border bg-card font-medium", small ? "px-2 py-1 text-[12.5px]" : "px-2.5 py-1.5 text-[13px]")}>
      {appIcons[name] ? <img src={appIcons[name]} alt="" className="size-4 rounded-[3px] object-contain" loading="lazy" /> : null}
      {name}
    </li>
  );
}

/** What the workflow reads and writes, then the rest of the catalogue for the same team behind "+N more". */
function ConnectsTo({ apps, label }: { apps: { core: string[]; more: string[] }; label: (key: string, values?: Record<string, number>) => string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5">
      <ul className="flex flex-wrap items-center gap-2">
        <li className="mr-1 text-[12.5px] font-medium text-muted-foreground">{label("connects")}</li>
        {apps.core.map((name) => <AppChip key={name} name={name} />)}
        {apps.more.length ? (
          <li>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-border-strong px-2.5 py-1.5 text-[13px] font-medium text-primary-text hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex -space-x-1.5" aria-hidden>
                {apps.more.slice(0, 3).map((name) => (
                  <img key={name} src={appIcons[name]} alt="" className="size-4 rounded-full bg-card object-contain ring-2 ring-card" loading="lazy" />
                ))}
              </span>
              {open ? "−" : label("more", { n: apps.more.length })}
            </button>
          </li>
        ) : null}
      </ul>
      {open ? (
        <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4 sm:p-5">
          <p className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-0.5 text-[12.5px] font-medium text-foreground">
              <span aria-hidden className="size-2 bg-primary" />
              ask ubik
            </span>
            {label("moreNote")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {apps.more.map((name) => <AppChip key={name} name={name} small />)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
