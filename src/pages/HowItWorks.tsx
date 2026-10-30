import { ArrowRightIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DiscussButton } from "@/components/landing/DiscussButton";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { TradeWorkLedger } from "@/components/landing/TradeWorkLedger";
import { DocumentVersions, type DocumentVersionsCopy } from "@/components/landing/DocumentVersions";
import { ConnectedMemory } from "@/components/landing/ConnectedMemory";
import { Seo } from "@/components/seo/Seo";
import { appLink } from "@/lib/links";
import { trackEvent } from "@/lib/posthog";
import { featuredWorkflowSlugs, workflowPath, type WorkflowCopy } from "@/lib/workflows";
import { DitherPanel } from "@/components/landing/DitherPanel";
import { workflowMascots } from "@/lib/workflow-mascots";
import { WorkflowVisual } from "@/components/landing/WorkflowVisuals";

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <PageShell>
      <Seo
        title={t("learn.seo.title")}
        description={t("learn.seo.description")}
        canonical="https://theubik.com/platform"
      />
      <main className="overflow-hidden">
        <section className="branded-page-hero relative border-b">
          <MatrixField variant="hero" density="medium" seed="how-it-works-page" />
          <div className="container-page section-y relative z-10 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <p className="section-label">{t("learn.eyebrow")}</p>
              <h1 className="mt-4 text-5xl font-semibold leading-[1.02] sm:text-6xl">
                {t("learn.title")}
              </h1>
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <p className="text-lg leading-8 text-primary-foreground/84">
                {t("learn.lede")}
              </p>
              <DiscussButton location="how_it_works" label={t("learn.cta")} className="mt-6" />
              <a
                href={appLink("how_it_works_open_app")}
                onClick={() => trackEvent("cta_clicked", { cta: "open_app", location: "how_it_works" })}
                className="mt-4 block text-sm text-primary-foreground/84 underline-offset-4 hover:underline"
              >
                {t("cta.openApp")}
              </a>
            </div>
          </div>
        </section>

        <section className="home-outcomes bg-shell text-primary-foreground" aria-labelledby="platform-evidence-title">
          <div className="container-page py-16 sm:py-24">
            <h2 id="platform-evidence-title" className="home-section-title !max-w-none text-primary-foreground">{t("home.outcomes.title")}</h2>
            <TradeWorkLedger className="mt-10 sm:mt-12" wide />
          </div>
        </section>

        <section className="border-b border-border" aria-labelledby="platform-documents-title">
          <div className="container-page py-16 sm:py-24">
            <p className="founder-company-label">{t("learn.documents.eyebrow")}</p>
            <h2 id="platform-documents-title" className="home-section-title !max-w-4xl">{t("learn.documents.title")}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{t("learn.documents.lede")}</p>
            <DocumentVersions copy={t("learn.documents.grid", { returnObjects: true }) as DocumentVersionsCopy} className="mt-10 sm:mt-12" />
          </div>
        </section>

        <ConnectedMemory />

        <section className="container-page section-y">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold">{t("learn.workflowsTitle")}</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredWorkflowSlugs.map((slug) => (
                <li key={slug}>
                  <Link to={workflowPath(slug)} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[box-shadow,border-color] hover:border-border-strong hover:shadow-lg">
                    <DitherPanel art={workflowMascots[slug]}>
                      <WorkflowVisual slug={slug} visual={(t(`workflows.items.${slug}`, { returnObjects: true }) as WorkflowCopy).visual} className="h-[17.5rem]" />
                    </DitherPanel>
                    <span className="flex items-center justify-between gap-3 p-5 text-base font-semibold">
                      {t(`workflows.items.${slug}.name`)}
                      <ArrowRightIcon aria-hidden className="text-primary-text transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <DiscussButton location="how_it_works_footer" label={t("learn.cta")} className="mt-10" />
          </div>
        </section>
      </main>
    </PageShell>
  );
}
