import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  AppStoreLogoIcon,
  AppleLogoIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  GooglePlayLogoIcon,
  KeyIcon,
  LockKeyIcon,
  MicrophoneIcon,
  PlugsConnectedIcon,
  WindowsLogoIcon
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixField } from "@/components/landing/MatrixField";
import { PackingLineFigure } from "@/components/landing/iso-scenes/scenes";
import { MeetingsLiveStrip } from "@/components/landing/MeetingsLiveStrip";
import { PageShell } from "@/components/landing/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/posthog";

const connectorApps = [
  ["SAP", "sap.com"],
  ["Oracle", "oracle.com"],
  ["Zoho", "zoho.com"],
  ["NetSuite", "netsuite.com"],
  ["Dynamics 365", "dynamics.microsoft.com"],
  ["Salesforce", "salesforce.com"],
  ["HubSpot", "hubspot.com"]
] as const;

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const ConnectorsFeature = ({ label, more }: { label: string; more: string }) => (
  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
    {label}
    <span className="flex items-center gap-1">
      {connectorApps.map(([label, domain]) => (
        <span key={label} className="flex size-5 items-center justify-center bg-white" title={label}>
          <img src={favicon(domain)} alt={label} className="size-3.5 object-contain" loading="lazy" />
        </span>
      ))}
    </span>
    {more}
  </span>
);

const desktopApps = [
  { label: "Mac", href: "/download?os=mac", icon: AppleLogoIcon },
  { label: "Windows", href: "/download?os=windows", icon: WindowsLogoIcon }
];

const mobileApps = [
  { label: "iOS", icon: AppStoreLogoIcon },
  { label: "Android", icon: GooglePlayLogoIcon }
];

const privacyLabels = [
  { label: "Local recorder", icon: MicrophoneIcon },
  { label: "Desktop context bridge", icon: PlugsConnectedIcon },
  { label: "Encrypted files", icon: LockKeyIcon },
  { label: "Credentials on-device", icon: KeyIcon }
];

function FeatureList({ features, active = false }: { features: ReactNode[]; active?: boolean }) {
  return (
    <ul className="grid gap-3 text-sm leading-6">
      {features.map((feature, index) => (
        <li key={index} className="flex gap-3">
          <CheckCircleIcon
            className={cn("mt-1 size-4 shrink-0", active ? "text-primary-foreground" : "text-primary")}
            weight="bold"
            aria-hidden
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

type FaqCopy = { q: string; a: string[] };

export default function Pricing() {
  const { t } = useTranslation();
  const list = <T,>(key: string) => t(key, { returnObjects: true }) as T;
  // One offer: the first workflow free for a month, priced per workflow after.
  const enterpriseFeatures: ReactNode[] = [
    ...list<string[]>("pricing.enterprise.features").filter((feature) => !feature.startsWith("Everything in")),
    <ConnectorsFeature key="connectors" label={t("pricing.teammate.connectors")} more={t("pricing.teammate.connectorsMore")} />
  ];
  const replacesRows = list<{ old: string; new: string }[]>("pricing.replaces.rows");
  const privacyText = list<string[]>("pricing.apps.privacy");
  const pricingFaqs = list<FaqCopy[]>("pricing.faq.items");

  useEffect(() => {
    trackEvent("pricing_viewed");
  }, []);

  return (
    <PageShell>
      <Seo
        title={t("pricing.seo.title")}
        description={t("pricing.seo.description")}
        canonical="https://theubik.com/pricing"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Ubik",
          description: "AI operating workspace for perishable trade operators, priced per workflow with no user or token limit.",
          offers: [
            { "@type": "Offer", name: "First workflow", price: "0", priceCurrency: "USD", description: "One workflow run end to end for a month, free; then priced per workflow with no user or token limit." }
          ]
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: pricingFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a.join(" ") }
          }))
        }}
      />

      <main className="pricing-brand-page relative overflow-hidden">
        <MatrixField variant="hero" density="medium" seed="pricing-workspace" />
        <section className="container-page section-y relative z-10">
          <div className="pricing-brand-hero mb-10">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-5">
                {t("pricing.badge")}
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {t("pricing.titleLead")} <span className="text-primary">{t("pricing.titleEmphasis")}</span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-primary-foreground/84">
                {t("pricing.lede")}
              </p>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
            <Card className="relative border-0 bg-card">
              <PackingLineFigure className="pointer-events-none absolute top-2 right-2 hidden w-[27rem] lg:block xl:w-[31rem]" />
              <CardHeader className="relative gap-6 p-6 sm:p-8">
                <CardTitle className="text-3xl">{t("pricing.start.name")}</CardTitle>
                <div>
                  <p className="text-5xl font-semibold">{t("pricing.start.price")}</p>
                  <p className="mt-5 max-w-xl text-foreground/72 dark:text-foreground/82">
                    {t("pricing.start.summary")}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-8 p-6 pt-0 sm:p-8 sm:pt-0">
                <FeatureList features={enterpriseFeatures} />
                <div className="grid gap-3">
                  <Button asChild size="lg">
                    <Link to="/demo" onClick={() => trackEvent("cta_clicked", { cta: "request_demo", location: "pricing_start" })}>
                      {t("pricing.start.cta")} <ArrowRightIcon data-icon="inline-end" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          <section className="mt-16" aria-labelledby="pricing-replaces-title">
            <h2 id="pricing-replaces-title" className="text-2xl font-semibold sm:text-3xl">
              {t("pricing.replaces.title")}
            </h2>
            <table className="mt-6 w-full border-collapse text-left text-sm leading-6 sm:text-base">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="section-label w-1/2 pb-3 pr-6 font-medium">{t("pricing.replaces.oldWay")}</th>
                  <th scope="col" className="section-label w-1/2 pb-3 font-medium">{t("pricing.replaces.ubik")}</th>
                </tr>
              </thead>
              <tbody>
                {replacesRows.map(({ old: oldWay, new: ubik }) => (
                  <tr key={oldWay} className="border-b border-border">
                    <td className="py-4 pr-6 align-top text-foreground/60 dark:text-foreground/70">{oldWay}</td>
                    <td className="py-4 align-top">
                      <span className="flex gap-3">
                        <ArrowRightIcon className="mt-1.5 size-3.5 shrink-0 text-primary" weight="bold" aria-hidden />
                        <span className="font-medium">{ubik}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 text-foreground/72 dark:text-foreground/82">{t("pricing.replaces.closing")}</p>
          </section>

          <section className="mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="pricing-apps-title">
            <MeetingsLiveStrip className="py-10" />
            <div className="grid content-center gap-6 bg-card p-6 sm:p-8">
              <h2 id="pricing-apps-title" className="text-2xl font-semibold">{t("pricing.apps.title")}</h2>
              <div className="grid grid-cols-2 gap-2">
                {desktopApps.map(({ label, href, icon: Icon }) => (
                  <Button key={label} asChild variant="outline" size="lg">
                    <Link to={href}>
                      <Icon weight="fill" data-icon="inline-start" aria-hidden />
                      {label}
                      <DownloadSimpleIcon data-icon="inline-end" aria-hidden />
                    </Link>
                  </Button>
                ))}
                {mobileApps.map(({ label, icon: Icon }) => (
                  <Button key={label} variant="outline" size="lg" disabled aria-disabled="true">
                    <Icon weight="fill" data-icon="inline-start" aria-hidden />
                    {label}
                    <span className="tabular-nums text-[0.6rem]">{t("pricing.apps.soon")}</span>
                  </Button>
                ))}
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-foreground/72 dark:text-foreground/82">
                {privacyLabels.map(({ label, icon: Icon }, index) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                    {privacyText[index] ?? label}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="secondary" className="mb-4">
                {t("pricing.faq.badge")}
              </Badge>
              <h2 className="text-3xl font-semibold">{t("pricing.faq.title")}</h2>
            </div>
            {/* Native <details>, not the Radix accordion: Radix drops closed
                answers from the DOM, so crawlers and AI agents never saw them. */}
            <div className="w-full border-t border-border">
              {pricingFaqs.map((faq) => (
                <details key={faq.q} className="group border-b border-border py-4">
                  <summary className="cursor-pointer list-none font-medium marker:hidden">
                    <span className="flex items-start justify-between gap-6">
                      {faq.q}
                      <span aria-hidden className="text-primary transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <div className="mt-3 grid gap-4 border-l border-border pl-4 text-sm leading-7 text-foreground/72 dark:text-foreground/82">
                    {faq.a.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </section>
      </main>
    </PageShell>
  );
}
