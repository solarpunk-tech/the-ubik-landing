import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowSquareOutIcon, CaretDownIcon } from "@phosphor-icons/react";
import { PageShell } from "@/components/landing/PageShell";
import { SupplyJourneyFigure } from "@/components/landing/iso-scenes/scenes";
import { Seo } from "@/components/seo/Seo";
import { externalLinks } from "@/lib/links";
import { trackEvent } from "@/lib/posthog";

/**
 * Where every "Request demo" CTA lands. One promise and the three steps of
 * the free month on the left, the founders' calendar inline on the right, a
 * few questions below. Between the call and the questions, one shipment's
 * journey from pond to port. The calendar is
 * Google's own booking page, so its colours are Google's; everything around
 * it is ours.
 */
export default function Demo() {
  const { t } = useTranslation();
  const steps = t("demo.steps", { returnObjects: true }) as { title: string; copy: string }[];
  const faq = t("demo.faq", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <PageShell>
      <Seo title={t("demo.seo.title")} description={t("demo.seo.description")} canonical="https://theubik.com/demo" />
      <main className="relative overflow-clip">
        <section className="container-page relative z-10 grid gap-10 pt-14 pb-16 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:pb-24">
          <div>
            <p className="section-label">{t("demo.eyebrow")}</p>
            <h1 className="mt-4 max-w-[14ch] text-4xl font-semibold leading-[1.05] sm:text-5xl">{t("demo.title")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/72 dark:text-foreground/82">{t("demo.lede")}</p>
            <ol className="mt-10 grid max-w-xl gap-5">
              {steps.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-x-3">
                  <span className="tabular-nums pt-0.5 text-sm text-primary-text">0{index + 1}</span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-10 flex max-w-xl items-center gap-2.5 border-t border-border pt-5 text-sm text-foreground/72 dark:text-foreground/82">
              <span aria-hidden className="size-1.5 shrink-0 bg-primary" />
              {t("demo.proof")}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
              <h2 className="shrink-0 font-semibold">{t("demo.bookTitle")}</h2>
              <a
                href={externalLinks.founderMeeting}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_clicked", { cta: "book_session_tab", location: "demo" })}
                className="inline-flex items-center gap-1.5 text-xs text-foreground/60 underline-offset-4 hover:underline"
              >
                <span className="hidden sm:inline">{t("demo.bookFallback")}</span>
                <span className="sm:hidden">{t("demo.bookFallbackShort")}</span>
                <ArrowSquareOutIcon aria-hidden className="size-3.5" />
              </a>
            </div>
            <iframe
              src={externalLinks.founderMeetingEmbed}
              title={t("demo.bookTitle")}
              className="block h-[46rem] w-full border-0 bg-white sm:h-[44rem]"
              onLoad={() => trackEvent("booking_calendar_loaded", { location: "demo" })}
            />
            <p className="border-t border-border px-5 py-3 text-xs leading-5 text-foreground/60">
              {t("demo.privacy")} <Link to="/legal/privacy" className="underline underline-offset-2">{t("demo.privacyLink")}</Link>
            </p>
          </div>
        </section>

        <section className="container-page -mt-6 pb-4 lg:-mt-10" aria-hidden>
          <SupplyJourneyFigure className="mx-auto w-full max-w-6xl" />
        </section>

        <section className="container-page relative z-10 pb-20 lg:pb-28">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t("demo.faqTitle")}</h2>
          <div className="mt-6 max-w-3xl divide-y divide-border border-y border-border">
            {faq.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <CaretDownIcon aria-hidden className="size-4 shrink-0 text-foreground/60 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/72 dark:text-foreground/82">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
