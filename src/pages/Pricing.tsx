import { useState } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { brandAssets } from "@/lib/brand";
import { externalLinks } from "@/lib/links";
import { cn } from "@/lib/utils";

const baseFeatures = [
  "Webapp + Local desktop add-on",
  "Memory workflows for inbox, meetings, projects and ops",
  "10+ LLMs plus live trade artifacts",
  "Market intelligence projects + agentic browsing",
  "Local meeting recorder and device-held credentials"
];

const enterpriseFeatures = [
  "Everything in Base",
  "WhatsApp + email + ERP + CRM workflow automation",
  "RFQ, PO, VMI, margin and traceability playbooks",
  "Domain expert + forward-deployed product engineer",
  "Private deployments, SSO, roles and audit logs"
];

const localPills = [
  "Local meeting recorder",
  "Desktop context bridge",
  "Private files are encrypted",
  "Credentials stay on-device"
];

const pricingFaqs = [
  {
    question: "What data is shared with LLMs?",
    answer: [
      "Ubik minimizes what is sent to external LLMs. Models are used for planning, reasoning and drafting actions, not for bulk raw-data ingestion.",
      "Sensitive context like RFQs, supplier pricing, margins, customer names and credentials is kept in Ubik's context layer, local workspace or private deployment depending on the setup.",
      "Enterprise customers can configure private, local or air-gapped deployments. Customer data is never used to train third-party models."
    ]
  },
  {
    question: "What does Base cover?",
    answer: [
      "Base is the personal AI workspace for one operator. It includes the Ubik Webapp, Ubik Local, local meeting recording, memory workflows, market intelligence projects, live artifacts and agentic browsing.",
      "It is built for individual trade, pricing, meeting and operations work before Ubik becomes a wider workflow layer for the team."
    ]
  },
  {
    question: "How does Enterprise expand Base?",
    answer: [
      "Enterprise starts with everything in Base, then adds cross-team workflow automation across WhatsApp, email, ERP, CRM, documents and customer-facing operations.",
      "It includes domain expert support, forward-deployed product engineering, custom playbooks, SSO/SAML, role-based permissions, audit logs and private deployment options."
    ]
  },
  {
    question: "How do credentials and private files work?",
    answer: [
      "Credentials stay on-device. Private files are encrypted. Ubik Local is designed to bridge desktop context to the Webapp without turning your local machine into a public data lake.",
      "Enterprise deployments can keep sensitive workflows in private, local or air-gapped environments depending on the security model."
    ]
  },
  {
    question: "Can Base handle trade and market intelligence work?",
    answer: [
      "Yes. Base supports import/export market intelligence projects, live-updating artifacts, meeting memory, browser workflows and multi-model reasoning across Claude, ChatGPT, Gemini, Grok and more.",
      "Enterprise takes those same primitives and connects them to shared systems, approvals, audit trails and customer workflows."
    ]
  }
];

function FeatureList({ features, active = false }: { features: string[]; active?: boolean }) {
  return (
    <ul className="grid gap-3 text-sm leading-6">
      {features.map((feature) => (
        <li key={feature} className="flex gap-3">
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

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const basePrice = billing === "annual" ? "$85" : "$100";

  return (
    <PageShell>
      <Seo
        title="Pricing — Ubik"
        description="Choose Base for a personal AI workspace or Enterprise for trade workflows across teams, systems and geographies."
        canonical="https://theubik.com/pricing"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Ubik",
          description: "AI operating workspace for perishable trade operators.",
          offers: [
            { "@type": "Offer", name: "Base", price: billing === "annual" ? "85" : "100", priceCurrency: "USD", priceSpecification: "Monthly subscription" },
            { "@type": "Offer", name: "Enterprise", priceCurrency: "USD", description: "Custom pricing" }
          ]
        }}
      />

      <main className="relative overflow-hidden">
        <MatrixField variant="hero" density="medium" seed="pricing-workspace" />
        <section className="container-page section-y relative z-10">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-5">
                Pricing
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Choose the workspace that matches your <span className="text-primary">operating reality.</span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                Start with a personal AI workspace. Go Enterprise when Ubik needs to run workflows across your trade stack, team and customers.
              </p>
            </div>
            <div className="grid grid-cols-2 border border-border bg-card p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={cn("px-4 py-2 transition-colors", billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("annual")}
                className={cn("px-4 py-2 transition-colors", billing === "annual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                Annual <span className="ml-1 text-[11px]">Save 15%</span>
              </button>
            </div>
          </div>

          <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
            <Card className="border-0 bg-primary text-primary-foreground">
              <CardHeader className="gap-6 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-label text-primary-foreground/65">Base</p>
                    <CardTitle className="mt-3 text-3xl">Base</CardTitle>
                  </div>
                  {billing === "annual" ? (
                    <Badge variant="secondary" className="bg-primary-foreground text-primary">
                      Save 15%
                    </Badge>
                  ) : null}
                </div>
                <div>
                  <p className="text-5xl font-semibold">
                    {basePrice}
                    <span className="ml-2 text-base font-medium text-primary-foreground/70">/ month</span>
                  </p>
                  <p className="mt-5 max-w-xl text-primary-foreground/80">
                    For operators who want a personal AI workspace for trade, market intelligence, meetings and live work artifacts.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-8 p-6 pt-0 sm:p-8 sm:pt-0">
                <FeatureList features={baseFeatures} active />
                <div className="grid gap-3">
                  <Button asChild variant="secondary" size="lg">
                    <a href={externalLinks.app}>
                      Realise true value in 30 days <ArrowRightIcon data-icon="inline-end" />
                    </a>
                  </Button>
                  <p className="text-sm text-primary-foreground/70">Built for one operator. Comes with Ubik Local included.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card">
              <CardHeader className="gap-6 p-6 sm:p-8">
                <div>
                  <p className="section-label">Enterprise</p>
                  <CardTitle className="mt-3 text-3xl">Enterprise</CardTitle>
                </div>
                <div>
                  <p className="text-5xl font-semibold">Custom</p>
                  <p className="mt-5 max-w-xl text-muted-foreground">
                    For seafood importers, exporters and processors running mission-critical trade workflows across teams, systems and geographies.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-8 p-6 pt-0 sm:p-8 sm:pt-0">
                <FeatureList features={enterpriseFeatures} />
                <div className="grid gap-3">
                  <Button asChild size="lg">
                    <a href={externalLinks.founderMeeting}>
                      Talk to founders <ArrowRightIcon data-icon="inline-end" />
                    </a>
                  </Button>
                  <p className="text-sm text-muted-foreground">Built with your operators in 30 days. Priced around value recovered, not seats.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="mt-8 border border-border bg-card p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="section-label">Computer and browser use</p>
                <h2 className="mt-3 flex flex-wrap items-end gap-3 text-2xl font-semibold">
                  <img src={brandAssets.wordmarkLight} alt="Ubik" className="h-auto w-28 dark:hidden sm:w-32" />
                  <img src={brandAssets.wordmarkDark} alt="Ubik" className="hidden h-auto w-28 dark:block sm:w-32" />
                  <span className="pb-1 text-xl leading-none">Local</span>
                </h2>
              </div>
              <div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Today, it records and summarizes local meetings. Next, it becomes the hotkey-summoned desktop overlay that bridges your local context with the Ubik Webapp.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {localPills.map((pill) => (
                    <span key={pill} className="border border-border bg-background px-3 py-2 text-xs font-medium">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="secondary" className="mb-4">
                Data handling
              </Badge>
              <h2 className="text-3xl font-semibold">LLMs plan and draft. Ubik controls the context.</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {pricingFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 border-l border-border pl-4 text-sm leading-7 text-muted-foreground">
                      {faq.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </section>
      </main>
    </PageShell>
  );
}
