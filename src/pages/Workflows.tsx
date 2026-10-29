import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { DiscussButton } from "@/components/landing/DiscussButton";
import { MatrixField } from "@/components/landing/MatrixField";
import { DitherPanel } from "@/components/landing/DitherPanel";
import { workflowMascots } from "@/lib/workflow-mascots";
import { WorkflowVisual } from "@/components/landing/WorkflowVisuals";
import { PageShell } from "@/components/landing/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { trackEvent } from "@/lib/posthog";
import { workflowPath, workflowSlugs, type WorkflowCopy } from "@/lib/workflows";

export default function Workflows() {
  const { t } = useTranslation();
  const items = workflowSlugs.map((slug) => ({ slug, ...(t(`workflows.items.${slug}`, { returnObjects: true }) as WorkflowCopy) }));

  return (
    <PageShell>
      <Seo title={t("workflows.seo.title")} description={t("workflows.seo.description")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: t("workflows.title"),
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            url: `https://theubik.com${workflowPath(item.slug)}`
          }))
        }}
      />
      <main className="overflow-hidden">
        <section className="branded-page-hero relative border-b">
          <MatrixField variant="hero" density="medium" seed="workflows-page" />
          <div className="container-page section-y relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="section-label">{t("workflows.eyebrow")}</p>
              <h1 className="mt-4 text-5xl font-semibold leading-[1.02] sm:text-6xl">{t("workflows.title")}</h1>
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <p className="text-lg leading-8 text-primary-foreground/84">{t("workflows.lede")}</p>
              <DiscussButton location="workflows_hero" className="mt-6" />
            </div>
          </div>
        </section>

        <section className="container-page section-y">
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((item) => (
              <article key={item.slug} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <DitherPanel art={workflowMascots[item.slug]} className="p-4 sm:p-5">
                  <WorkflowVisual slug={item.slug} visual={item.visual} className="h-[17.5rem]" />
                </DitherPanel>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="text-[12.5px] font-medium text-muted-foreground">{item.audience}</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">{item.name}</h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{item.lede}</p>
                <ol className="mt-6 grid gap-2 border-t border-border pt-5 text-sm sm:grid-cols-2">
                  {item.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-2">
                      <span className="tabular-nums text-primary-text">0{index + 1}</span>
                      <span className="font-medium">{step.title}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  to={workflowPath(item.slug)}
                  onClick={() => trackEvent("workflow_card_clicked", { workflow: item.slug, location: "workflows" })}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  {t("workflows.labels.open")} <ArrowRightIcon aria-hidden />
                </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
