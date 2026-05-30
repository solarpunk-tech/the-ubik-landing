import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixField } from "@/components/landing/MatrixField";
import { LandingV2Hero, LandingV2HowSection, LandingV2ToolsSection } from "@/components/landing/LandingV2Sections";
import { HowWorkflowCarousel } from "@/components/landing/HowWorkflowCarousel";
import { BlogPreview } from "@/components/landing/BlogPreview";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { PageShell } from "@/components/landing/PageShell";
import { bottomCallouts, compareBacklink, faqs, proofPoints, securityCards } from "@/lib/landing-content";
import { externalLinks } from "@/lib/links";
import { trackEvent } from "@/lib/posthog";

type TeamTickerCompany = {
  label: string;
  domain?: string;
  logo?: string;
};

const teamTickerCompanies: TeamTickerCompany[] = [
  { label: "AZ Gems", domain: "azgems.com" },
  { label: "Sandhya Aqua", logo: "https://sandhyaaqua.com/wp-content/uploads/2020/07/SA-Logo.png" },
  { label: "Dr. Reddy's", domain: "drreddys.com" },
  { label: "Airtel", domain: "airtel.in" },
  { label: "Udaan", domain: "udaan.com" },
  { label: "Ola", domain: "olaelectric.com" },
  { label: "AquaExchange", domain: "aquaexchange.com" },
  { label: "ClearTax", domain: "cleartax.in" },
  { label: "Arintra", domain: "arintra.com" },
  { label: "Lumian", domain: "lumian.ai" },
  { label: "Housing", domain: "housing.com" }
] as const;

function CompanyLogoTicker() {
  const companies = [...teamTickerCompanies, ...teamTickerCompanies];
  const logoSrc = (company: TeamTickerCompany) =>
    company.logo ?? `https://www.google.com/s2/favicons?domain=${company.domain}&sz=64`;

  return (
    <section className="relative border-b bg-background py-10">
      <MatrixField variant="subtle" density="low" seed="logo-ticker-band" />
      <div className="container-page relative z-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
          <div>
            <p className="section-label">Companies We have worked with</p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold sm:text-3xl">
              Small team of supply chain operators, builders & ex-founders.
            </h2>
          </div>
          <div className="logo-ticker-fade overflow-hidden bg-background py-2">
            <div className="logo-ticker-track flex w-max items-center gap-8">
              {companies.map((company, index) => (
                <div key={`${company.label}-${index}`} className="flex h-20 w-36 shrink-0 flex-col items-center justify-center gap-2 px-4">
                  <img
                    src={logoSrc(company)}
                    alt=""
                    className="size-8 object-contain"
                    loading="lazy"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{company.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <PageShell>
      <Seo
        title="Ubik | Decision Intelligence for Trade Operations"
        description="Ubik is a personalised workspace for seafood importers, exporters, and processors. $25Mn+ in customer aggregate revenue. 100+ containers. SOC 2 Type II audit in progress."
        image="/og-image.png"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Solarpunk Technology",
            url: "https://theubik.com/",
            product: "Ubik"
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Ubik",
            applicationCategory: "BusinessApplication",
            applicationSubCategory: "Personalised workspace for perishable trade",
            operatingSystem: "Web",
            description:
              "Personalised workspace for perishable trade. Built for seafood importers, exporters, and processors. Compresses RFQ cycles 20x, recovers margin from RFQ leakage, with SOC 2 Type II audit in progress.",
            offers: [
              { "@type": "Offer", name: "Base", price: "100", priceCurrency: "USD", description: "Monthly personal AI workspace with Ubik Meetings included" },
              { "@type": "Offer", name: "Base Annual", price: "85", priceCurrency: "USD", description: "Annual Base price per month, billed annually" },
              { "@type": "Offer", name: "Enterprise", priceCurrency: "USD", description: "Custom workflow automation for teams" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer }
            }))
          }
        ]}
      />

      <main className="overflow-hidden">
        <LandingV2Hero />

        <section className="relative border-b bg-background">
          <MatrixField variant="subtle" density="medium" seed="proof-points" />
          <div className="container-page relative z-10 grid gap-px bg-border py-px md:grid-cols-3">
            {proofPoints.map(({ stat, label }) => (
              <div key={stat} className="bg-background p-6">
                <p className="text-3xl font-semibold text-primary">{stat}</p>
                <p className="mt-1 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <LandingV2HowSection />

        <LandingV2ToolsSection />

        <section id="security" className="relative border-b">
          <MatrixField variant="security" density="medium" seed="security-matrix" />
          <div className="container-page section-y relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col gap-4">
              <Badge variant="outline" className="w-fit">
                Security and data use
              </Badge>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Enterprise-grade trust. Operator-friendly defaults.
              </h2>
              <p className="text-muted-foreground">
                SOC 2 Type II audit in progress, GDPR, ISO 27001. EU and APAC data residency. Your RFQs, supplier pricing, and margins never become training input for any third-party model.
              </p>
              <Button asChild variant="outline" className="w-fit">
                <Link to="/security">
                  View trust note <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-3">
              {securityCards.map(({ icon: Icon, title, copy }) => (
                <Card key={title} className="border-0 bg-card/96 backdrop-blur">
                  <CardHeader>
                    <Icon className="text-primary" aria-hidden />
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">{copy}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow-overview" className="relative border-y bg-background">
          <MatrixField variant="process" density="high" seed="process-band" />
          <div className="container-page section-y relative z-10 grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="flex flex-col gap-4">
              <Badge variant="secondary" className="w-fit">How it works</Badge>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                See one workflow move through the loop.
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  A large frozen food operator compressed RFQ cycles from 5-7 days to 6 hours.
                </p>
                <p>
                  A U.S. processor moved PO processing from manual work to 30-second extraction. Each loop captures signal, matches context, and prepares one reviewed action.
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit">
                <Link to="/how-it-works">
                  Open full walkthrough <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <HowWorkflowCarousel compact />
          </div>
        </section>

        <section id="compare" className="relative border-y">
          <MatrixField variant="process" density="low" seed="compare-backlink" />
          <div className="container-page relative z-10 py-12 sm:py-14">
            <a
              href={compareBacklink.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("compare_backlink_clicked", { href: compareBacklink.href })}
              className="group block"
            >
              <Badge variant="outline" className="mb-4">{compareBacklink.eyebrow}</Badge>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <h2 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                  {compareBacklink.label}
                  <span className="text-primary"> →</span>
                </h2>
                <p className="text-sm text-muted-foreground sm:max-w-xs sm:text-right">
                  Different category. Picks the right model per task, fine-tuned for your ERPs, CRMs and workflows.
                </p>
              </div>
            </a>
          </div>
        </section>

        <section className="relative border-b">
          <MatrixField variant="subtle" density="low" seed="faq-band" />
          <div className="container-page section-y relative z-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="secondary" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl font-semibold">Answers for buyers, security reviewers, and investors.</h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Specific answers, real customer numbers, no jargon. The questions seafood operators and CTOs actually ask before signing.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map(({ question, answer, paragraphs, bullets, seeMore }) => (
                <AccordionItem key={question} value={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>
                    <div className="max-w-3xl border-l border-border pl-4 text-sm leading-7 text-muted-foreground">
                      <div className="grid gap-3 text-pretty">
                        {(paragraphs ?? [answer]).map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      {bullets?.length ? (
                        <ul className="mt-4 grid gap-2 pl-4 text-pretty">
                          {bullets.map((bullet) => (
                            <li key={bullet} className="list-disc pl-1">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {seeMore ? (
                        <a
                          href={seeMore.href}
                          onClick={() => trackEvent("faq_see_more_clicked", { question, href: seeMore.href })}
                          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {seeMore.label} <ArrowRightIcon data-icon="inline-end" />
                        </a>
                      ) : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <CompanyLogoTicker />

        <BlogPreview />

        <section className="container-page section-y">
          <Card className="relative overflow-hidden border-primary/30 bg-primary text-primary-foreground">
            <MatrixField variant="cta" density="high" seed="cta-blue-sweep" />
            <CardContent className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div>
                <Badge variant="secondary" className="mb-5 border-primary-foreground/20 bg-primary-foreground text-primary">
                  Plan to production
                </Badge>
                <h2 className="max-w-3xl text-3xl font-semibold sm:text-4xl">
                  Pick one workflow. See it live in 4 weeks.
                </h2>
                <p className="mt-4 max-w-2xl text-primary-foreground/85">
                  Start with RFQ to quote, PO ingestion, transit-aware scheduling, or lot traceability. If you don't see ROI in 90 days, we work for free until you do.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild variant="secondary" size="lg" className="text-primary">
                  <a href={externalLinks.app} onClick={() => trackEvent("cta_clicked", { cta: "try_ubik", location: "cta_section" })}>
                    Try Ubik Now <ArrowRightIcon data-icon="inline-end" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <a href={externalLinks.founderMeeting} onClick={() => trackEvent("cta_clicked", { cta: "talk_to_founders", location: "cta_section" })}>Talk to founders</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="relative pb-16">
          <MatrixField variant="subtle" density="low" seed="bottom-callouts" />
          <div className="container-page relative z-10">
            <div className="grid gap-px bg-border md:grid-cols-3">
              {bottomCallouts.map(({ title }, index) => (
                <div key={title} className="bg-background p-5">
                  <p className="text-[10px] font-medium uppercase text-primary">0{index + 1}</p>
                  <h3 className="mt-3 max-w-xs text-lg font-semibold leading-snug text-pretty">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
