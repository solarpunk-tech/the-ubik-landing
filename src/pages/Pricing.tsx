import { useEffect, useState } from "react";
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
import { trackEvent } from "@/lib/posthog";

const baseFeatures = [
  "Webapp + ubik Meetings desktop add-on",
  "2-3 new workflows every month",
  "Inbox, meetings, market intel and live artifacts",
  "10+ LLMs with device-held credentials",
  "Local meeting recorder included"
];

const enterpriseFeatures = [
  "Everything in Base",
  "2-3 new workflows every week",
  "WhatsApp, email, ERP and CRM automation",
  "Custom ERP or CRM transition into Ubik",
  "Maintenance, playbook updates and private controls"
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
      "Base is the personal AI workspace for one operator. It includes the ubik Webapp, ubik Meetings, local meeting recording, market intelligence projects, live artifacts and 2-3 new workflows every month.",
      "It is built for individual trade, pricing, meeting and operations work before Ubik becomes a wider workflow layer for the team."
    ]
  },
  {
    question: "How does Enterprise expand Base?",
    answer: [
      "Enterprise starts with everything in Base, then adds 2-3 new workflows every week across WhatsApp, email, ERP, CRM, documents and customer-facing operations.",
      "A trade expert and product engineer maintain the workflows, handle custom ERP or CRM transition work, and build the right operating system into Ubik. SSO/SAML, role-based permissions, audit logs and private deployment options are included."
    ]
  },
  {
    question: "How do credentials and private files work?",
    answer: [
      "Credentials stay on-device. Private files are encrypted. ubik Meetings is designed to bridge desktop context to the Webapp without turning your local machine into a public data lake.",
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

  useEffect(() => {
    trackEvent("pricing_viewed");
  }, []);
  const basePrice = billing === "annual" ? "$85" : "$100";

  return (
    <PageShell>
      <Seo
        title="Pricing | Ubik"
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

      <main className="pricing-brand-page relative overflow-hidden">
        <MatrixField variant="hero" density="medium" seed="pricing-workspace" />
        <section className="container-page section-y relative z-10">
          <div className="pricing-brand-hero mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-5">
                Pricing
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                The best models, <span className="text-primary">without the meter running.</span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-primary-foreground/84">
                We route each step to the frontier model that can do it and pay for the tokens, so your bill reads the same in a quiet week and a full one.
              </p>
            </div>
            <div className="grid grid-cols-2 border border-border bg-card p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={cn("px-4 py-2 transition-colors", billing === "monthly" ? "bg-primary text-primary-foreground" : "text-foreground/72 dark:text-foreground/82 hover:text-foreground")}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("annual")}
                className={cn("px-4 py-2 transition-colors", billing === "annual" ? "bg-primary text-primary-foreground" : "text-foreground/72 dark:text-foreground/82 hover:text-foreground")}
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
                    <p className="section-label text-primary-foreground/85">Base</p>
                    <CardTitle className="mt-3 text-3xl">Base</CardTitle>
                  </div>
                  {billing === "annual" ? (
                    <Badge variant="secondary" className="bg-shell text-primary-foreground">
                      Save 15%
                    </Badge>
                  ) : null}
                </div>
                <div>
                  <p className="text-5xl font-semibold">
                    {basePrice}
                    <span className="ml-2 text-base font-medium text-primary-foreground/85">/ month</span>
                  </p>
                  <p className="mt-5 max-w-xl text-primary-foreground/92">
                    For operators who want a personal AI workspace plus 2-3 new workflows every month.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-8 p-6 pt-0 sm:p-8 sm:pt-0">
                <FeatureList features={baseFeatures} active />
                <div className="grid gap-3">
                  <Button asChild variant="secondary" size="lg">
                    <a href={externalLinks.app}>
                      Try ubik Now <ArrowRightIcon data-icon="inline-end" />
                    </a>
                  </Button>
                  <p className="text-sm text-primary-foreground/88">Built for one operator. Comes with ubik Meetings included.</p>
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
                  <p className="mt-5 max-w-xl text-foreground/72 dark:text-foreground/82">
                    For teams that want 2-3 new workflows every week, maintained across ERP, CRM, email, WhatsApp and custom systems.
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
                  <p className="text-sm text-foreground/72 dark:text-foreground/82">Built with your operators in 30 days. Priced around value recovered, not seats.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="mt-8 border border-border bg-card p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="section-label">Free desktop app</p>
                {/* The wordmark art has its own internal padding, so pairing it with
                    a text span left "Meetings" floating off the baseline. Stack the
                    lockup instead and let the rule carry the alignment. */}
                <h2 className="ubik-meetings-lockup mt-3">
                  <img src={brandAssets.wordmarkLight} alt="ubik" className="dark:hidden" />
                  <img src={brandAssets.wordmarkDark} alt="ubik" className="hidden dark:block" />
                  <span>Meetings</span>
                </h2>
              </div>
              <div>
                <p className="text-sm leading-6 text-foreground/72 dark:text-foreground/82">
                Records and summarises your meetings on-device, then sits a hotkey away as a desktop overlay that carries the room's context straight into your ubik workspace.
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
              <h2 className="text-3xl font-semibold">LLMs plan and draft. ubik controls the context.</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {pricingFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 border-l border-border pl-4 text-sm leading-7 text-foreground/72 dark:text-foreground/82">
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
