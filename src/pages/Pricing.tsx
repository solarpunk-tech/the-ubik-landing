import { useEffect } from "react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixField } from "@/components/landing/MatrixField";
import { MeetingsLiveStrip } from "@/components/landing/MeetingsLiveStrip";
import { PageShell } from "@/components/landing/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { externalLinks } from "@/lib/links";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/posthog";

const teammateFeatures = [
  "One production workflow (pick from the library or we build it)",
  "The full Workspace, including the mobile app for the floor",
  "Organisational memory",
  "Email and WhatsApp ingestion",
  "Connectors for SAP, Oracle, Zoho, NetSuite, Dynamics 365, Salesforce, HubSpot and 100+ more apps, including ERPs with no API",
  "Human approval on every write",
  "Unlimited users"
];

const enterpriseFeatures = [
  "Everything in Teammate",
  "Multiple workflows",
  "Custom decision logic on your own context graph: every approval, exception and precedent, reused",
  "Policy engine and audit trail",
  "A trade expert and a product engineer on the account"
];

const replacesRows = [
  ["Per-seat SaaS, price grows with headcount", "One price per workflow, unlimited users"],
  ["Six-month ERP implementation", "First workflow live in weeks"],
  ["Implementation consultants and transformation decks", "Trade expert and engineer on the account, included"],
  ["Forward-deployed engineers at day rates", "Workflows configured, not rebuilt, for each customer"],
  ["Four to seven coordinators chasing emails", "One teammate that chases, checks and prepares the decision"]
] as const;

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

const pricingFaqs = [
  {
    question: "What data is shared with LLMs?",
    answer: [
      "Ubik minimizes what is sent to external LLMs. Models are used for planning, reasoning and drafting actions, not for bulk raw-data ingestion.",
      "Sensitive context like RFQs, supplier pricing, margins, customer names and credentials is kept in Ubik's context layer. Customer data is never used to train third-party models."
    ]
  },
  {
    question: "What does Teammate cover?",
    answer: [
      "Teammate is one production workflow running on the full Workspace: the mobile app for the floor, organisational memory, email and WhatsApp ingestion, connectors for your ERP, CRM and 100+ more apps, and human approval on every write.",
      "Everyone on the team can use it. You pay for the workflow, not the people."
    ]
  },
  {
    question: "How does Enterprise expand Teammate?",
    answer: [
      "Enterprise starts with everything in Teammate, then adds more workflows, each priced on its own, plus decision briefs for the people who sign.",
      "Decisions run on your own context graph, so every approval, exception and precedent is kept and reused. It adds a policy engine with an audit trail, and keeps a trade expert and a product engineer on the account."
    ]
  },
  {
    question: "How do credentials and private files work?",
    answer: [
      "Credentials stay on-device. Private files are encrypted. ubik Meetings is designed to bridge desktop context to the Webapp without turning your local machine into a public data lake.",
      "Audit trail on every change. SOC 2 in progress."
    ]
  },
  {
    question: "Why no per-seat pricing?",
    answer: [
      "Because the floor should use it. A packing supervisor without an email address signs in with a phone number, and we are not charging you for that."
    ]
  },
  {
    question: "What counts as a workflow?",
    answer: [
      "One repeatable job with a defined input, a check, and a human approval, for example yield reconciliation, packaging tracking, export documents or supplier follow-up."
    ]
  },
  {
    question: "Can we start on Teammate and move to Enterprise?",
    answer: [
      "Yes. Enterprise is the same platform with more workflows and decision briefs. Nothing is re-implemented."
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
  useEffect(() => {
    trackEvent("pricing_viewed");
  }, []);

  return (
    <PageShell>
      <Seo
        title="Pricing | Ubik"
        description="Teammate is $1,000 a month for one AI workflow with unlimited users. Enterprise adds more workflows and decision briefs. Priced per workflow, not per person."
        canonical="https://theubik.com/pricing"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Ubik",
          description: "AI operating workspace for perishable trade operators, priced per workflow with unlimited users.",
          offers: [
            {
              "@type": "Offer",
              name: "Teammate",
              description: "One production workflow on the full Workspace, unlimited users.",
              price: "1000",
              priceCurrency: "USD",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "1000",
                priceCurrency: "USD",
                billingDuration: "P1M",
                unitText: "workflow"
              }
            },
            { "@type": "Offer", name: "Enterprise", priceCurrency: "USD", description: "Custom: platform plus workflows, priced each." }
          ]
        }}
      />

      <main className="pricing-brand-page relative overflow-hidden">
        <MatrixField variant="hero" density="medium" seed="pricing-workspace" />
        <section className="container-page section-y relative z-10">
          <div className="pricing-brand-hero mb-10">
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
          </div>

          <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
            <Card className="border-0 bg-primary text-primary-foreground">
              <CardHeader className="gap-6 p-6 sm:p-8">
                <div>
                  <p className="section-label text-primary-foreground/85">Teammate</p>
                  <CardTitle className="mt-3 text-3xl">Teammate</CardTitle>
                </div>
                <div>
                  <p className="text-5xl font-semibold">
                    $1,000
                    <span className="ml-2 text-base font-medium text-primary-foreground/85">/ month</span>
                  </p>
                  <p className="mt-5 max-w-xl text-primary-foreground/92">
                    One AI teammate. One workflow a month. Everything we offer, no seats.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-8 p-6 pt-0 sm:p-8 sm:pt-0">
                <FeatureList features={teammateFeatures} active />
                <div className="grid gap-3">
                  <Button asChild variant="secondary" size="lg">
                    <a href={externalLinks.founderMeeting}>
                      Start with one workflow <ArrowRightIcon data-icon="inline-end" />
                    </a>
                  </Button>
                  <p className="text-sm text-primary-foreground/88">
                    Priced per workflow, not per person. Add a second workflow when the first one is boring.
                  </p>
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
                    Platform plus workflows, priced each. Decision briefs for the people who sign.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-8 p-6 pt-0 sm:p-8 sm:pt-0">
                <FeatureList features={enterpriseFeatures} />
                <div className="grid gap-3">
                  <Button asChild size="lg">
                    <a href={externalLinks.founderMeeting}>
                      Talk to us <ArrowRightIcon data-icon="inline-end" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          <section className="mt-16" aria-labelledby="pricing-replaces-title">
            <h2 id="pricing-replaces-title" className="text-2xl font-semibold sm:text-3xl">
              What this replaces
            </h2>
            <table className="mt-6 w-full border-collapse text-left text-sm leading-6 sm:text-base">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="section-label w-1/2 pb-3 pr-6 font-medium">The old way</th>
                  <th scope="col" className="section-label w-1/2 pb-3 font-medium">Ubik</th>
                </tr>
              </thead>
              <tbody>
                {replacesRows.map(([oldWay, ubik]) => (
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
            <p className="mt-6 text-foreground/72 dark:text-foreground/82">Coordination used to be a payroll line. Now it is a workflow.</p>
          </section>

          <section className="mt-16 grid gap-px border border-border bg-border lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="pricing-apps-title">
            <MeetingsLiveStrip className="py-10" />
            <div className="grid content-center gap-6 bg-card p-6 sm:p-8">
              <h2 id="pricing-apps-title" className="text-2xl font-semibold">Get the apps</h2>
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
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em]">Soon</span>
                  </Button>
                ))}
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-foreground/72 dark:text-foreground/82">
                {privacyLabels.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="secondary" className="mb-4">
                Questions
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
