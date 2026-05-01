import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixField } from "@/components/landing/MatrixField";
import { ProductSurface } from "@/components/landing/ProductSurface";
import { LiveQueuePreview } from "@/components/landing/LiveQueuePreview";
import { VerticalTicker } from "@/components/landing/VerticalTicker";
import { HowWorkflowCarousel } from "@/components/landing/HowWorkflowCarousel";
import { BlogPreview } from "@/components/landing/BlogPreview";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { PageShell } from "@/components/landing/PageShell";
import { bottomCallouts, faqs, heroTickerItems, proofPoints, securityCards } from "@/lib/landing-content";

export default function Index() {
  return (
    <PageShell>
      <Seo
        title="Ubik — Personalised Workspace for Perishable Trade"
        description="Ubik is a personalised workspace for seafood importers, exporters, and processors. $700M+ in customer aggregate revenue. 20x faster RFQ cycles. SOC 2 Type 2."
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
              "Personalised workspace for perishable trade. Built for seafood importers, exporters, and processors. Compresses RFQ cycles 20x, recovers margin from RFQ leakage, runs SOC 2 Type 2.",
            offers: [
              { "@type": "Offer", name: "Base", price: "100", priceCurrency: "USD", description: "Monthly personal AI workspace with Ubik Local included" },
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
        <section className="relative min-h-[calc(100svh-4rem)] border-b">
          <MatrixField variant="hero" density="high" seed="ubik-hero-po-to-order" />
          <div className="container-page relative z-10 grid min-h-[calc(100svh-4rem)] items-center gap-10 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:py-18">
            <div className="flex max-w-3xl flex-col gap-7">
              <VerticalTicker items={heroTickerItems} />
              <div className="flex flex-col gap-5">
                <h1 className="soft-blur-block text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
                  Personalised <span className="text-primary">Workspace</span> for Perishable Trade
                </h1>
                <p className="soft-blur-block max-w-2xl text-lg leading-8 text-muted-foreground">
                  Built for seafood importers, exporters, and processors moving{" "}
                  <span className="font-medium text-primary">$300M+</span> a year. Ubik turns CRM, ERP,
                  email, and WhatsApp into reviewed agent workflows.
                </p>
              </div>
              <div className="soft-blur-block flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="mailto:shubhranshu@solarpunk.technology?subject=Ubik%20founder%20demo">
                    Talk to founders <ArrowRightIcon data-icon="inline-end" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/try">Realise true value in 30 days</Link>
                </Button>
              </div>
            </div>

            <LiveQueuePreview />
          </div>
        </section>

        <section className="border-b bg-shell">
          <div className="container-page grid gap-px bg-border py-px md:grid-cols-3">
            {proofPoints.map(({ stat, label }) => (
              <div key={stat} className="bg-shell p-6">
                <p className="text-3xl font-semibold text-primary">{stat}</p>
                <p className="mt-1 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="product" className="container-page section-y">
          <div className="mb-10 flex max-w-3xl flex-col gap-3">
            <Badge variant="outline" className="w-fit">What Ubik does</Badge>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              The operator layer above your ERP, CRM, email, and WhatsApp.
            </h2>
            <p className="text-muted-foreground">
              Five seafood-native workflow primitives in production: RFQ to quote, PO ingestion, transit-aware scheduling, VMI pull-rate, lot traceability. Every action human-reviewed before it moves.
            </p>
          </div>
          <ProductSurface />
        </section>

        <section id="how" className="relative border-y bg-shell">
          <MatrixField variant="process" density="high" seed="process-band" />
          <div className="container-page section-y relative z-10 grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="flex flex-col gap-4">
              <Badge variant="secondary" className="w-fit">How it works</Badge>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                See one workflow move through the loop.
              </h2>
              <p className="text-muted-foreground">
                A large vertically integrated seafood conglomerate compressed RFQ cycles from 5-7 days to 6 hours. A US processor moved PO processing from manual work to 30-second extraction. Each loop captures signal, matches context, prepares one reviewed action.
              </p>
              <Button asChild variant="outline" className="w-fit">
                <Link to="/how-it-works">
                  Open full walkthrough <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <HowWorkflowCarousel compact />
          </div>
        </section>

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
                SOC 2 Type 2, GDPR, ISO 27001. EU and APAC data residency. Your RFQs, supplier pricing, and margins never become training input for any third-party model.
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

        <section className="border-b bg-shell">
          <div className="container-page section-y grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="secondary" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl font-semibold">Answers for buyers, security reviewers, and investors.</h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Specific answers, real customer numbers, no jargon. The questions seafood operators and CTOs actually ask before signing.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map(({ question, answer }) => (
                <AccordionItem key={question} value={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

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
                <Button asChild variant="secondary" size="lg">
                  <a href="mailto:shubhranshu@solarpunk.technology?subject=Ubik%20founder%20demo">Talk to founders</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/try">Realise true value in 30 days</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container-page pb-16">
          <div className="grid gap-px bg-border md:grid-cols-3">
            {bottomCallouts.map(({ title }) => (
              <div key={title} className="bg-background p-5">
                <h3 className="font-semibold">{title}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
