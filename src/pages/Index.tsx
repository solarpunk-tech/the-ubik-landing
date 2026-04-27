import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  DatabaseIcon,
  FileSearchIcon
} from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DotmSquare3 } from "@/components/ui/dotm-square-3";
import { DotmTriangle2 } from "@/components/ui/dotm-triangle-2";
import { MatrixField } from "@/components/landing/MatrixField";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { PageShell } from "@/components/landing/PageShell";
import { capabilities, faqs, processSteps, proofPoints, securityCards } from "@/lib/landing-content";

export default function Index() {
  return (
    <PageShell>
      <Seo
        title="Ubik — AI operator workbench for trade operations"
        description="Ubik unifies inquiries, purchase orders, shipments, approvals, and ERP-ready handoffs for seafood, perishables, and trade operations teams."
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
            operatingSystem: "Web",
            description:
              "AI operator workbench for inquiries, purchase orders, shipments, approvals, and ERP-ready handoffs."
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
              <Badge variant="secondary" className="w-fit">
                AI operator workbench for trade operations
              </Badge>
              <div className="flex flex-col gap-5">
                <h1 className="text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
                  From inquiry to approved order, without the tab storm.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Ubik is the AI workspace from Solarpunk Technology for seafood, perishables,
                  and trade teams coordinating through inboxes, spreadsheets, ERPs, and WhatsApp.
                  It turns scattered signals into reviewed actions.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/try">
                    Try now <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:shubhranshu@solarpunk.technology?subject=Ubik%20founder%20demo">
                    Talk to founders
                  </a>
                </Button>
              </div>
              <p className="max-w-xl text-sm text-muted-foreground">
                Built for CTOs and operators who need fewer tabs, cleaner handoffs, and faster
                decisions while keeping humans in control.
              </p>
            </div>

            <Card className="relative overflow-hidden border-primary/25 bg-card/95 shadow-sm backdrop-blur">
              <MatrixField variant="subtle" density="low" seed="queue-card" className="opacity-40" />
              <CardHeader className="relative border-b bg-shell/88">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Live operating queue</CardTitle>
                    <CardDescription>Order, shipment, and exception signals</CardDescription>
                  </div>
                  <DotmTriangle2 size={34} dotSize={4} aria-label="Loading queue" />
                </div>
              </CardHeader>
              <CardContent className="relative grid gap-px bg-border p-px">
                {[
                  ["PO review", "Two customer POs need SKU mapping and delivery-date checks.", "Now"],
                  ["Inquiry autopilot", "Buyer asks for availability, quote readiness, and next shipment window.", "Draft"],
                  ["Shipment exception", "Container ETA moved; customer inventory note is ready for approval.", "11:20"],
                  ["Quality packet", "COA and claim context collected for human review.", "Review"]
                ].map(([title, copy, meta]) => (
                  <div key={title} className="grid gap-1 bg-background/96 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">{copy}</p>
                    </div>
                    <Badge variant="outline">{meta}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-b bg-shell">
          <div className="container-page grid gap-px bg-border py-px md:grid-cols-3">
            {proofPoints.map(({ stat, label, copy }) => (
              <div key={stat} className="bg-shell p-6">
                <p className="text-3xl font-semibold text-primary">{stat}</p>
                <p className="mt-1 text-sm font-medium">{label}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="product" className="container-page section-y">
          <div className="mb-10 flex max-w-3xl flex-col gap-3">
            <Badge variant="outline" className="w-fit">What Ubik does</Badge>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              One operating layer for the work ERPs do not see in time.
            </h2>
            <p className="text-muted-foreground">
              Ubik does not replace your source systems. It reads across authorized tools,
              assembles the evidence, and presents the next decision before margin leaks into
              rework, delays, or missed follow-ups.
            </p>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, copy }) => (
              <Card key={title} className="border-0">
                <CardHeader>
                  <Icon className="text-primary" aria-hidden />
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">{copy}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative border-y bg-shell">
          <MatrixField variant="process" density="high" seed="process-band" />
          <div className="container-page section-y relative z-10 grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="flex flex-col gap-4">
              <Badge variant="secondary" className="w-fit">How it works</Badge>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                From inbox to approved order in one review loop.
              </h2>
              <p className="text-muted-foreground">
                Start with one workflow: an inquiry queue, a PO-to-order lane, a shipment exception
                loop, or a compliance pack. Ubik brings the context together, then waits for review.
              </p>
            </div>
            <div className="grid gap-px bg-border md:grid-cols-3">
              {processSteps.map((step, index) => (
                <div key={step.title} className="flex min-h-60 flex-col justify-between bg-shell/94 p-5 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">0{index + 1}</Badge>
                    {index < 2 ? <DotmSquare3 size={28} dotSize={4} aria-label="In flight" /> : <CheckCircleIcon className="text-primary" aria-hidden />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
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
                A CTO-readable security posture, not a badge wall.
              </h2>
              <p className="text-muted-foreground">
                Ubik is designed for least-privilege OAuth, revocable access, human approval gates,
                and security review before production rollout. Customer workspace data is not sold
                or used to train third-party AI models.
              </p>
              <Button asChild variant="outline" className="w-fit">
                <Link to="/security">
                  Share this with your tech team <ArrowRightIcon data-icon="inline-end" />
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
              <h2 className="text-3xl font-semibold">Answers for operators and answer engines.</h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Direct answers written for buyers, CTO reviewers, and LLM answer engines evaluating
                AI operations software.
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

        <section className="container-page section-y">
          <Card className="relative overflow-hidden border-primary/30 bg-primary text-primary-foreground">
            <MatrixField variant="cta" density="high" seed="cta-blue-sweep" />
            <CardContent className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div>
                <Badge variant="secondary" className="mb-5 border-primary-foreground/20 bg-primary-foreground text-primary">
                  Plan to production
                </Badge>
                <h2 className="max-w-3xl text-3xl font-semibold sm:text-4xl">
                  Run one operational workflow before checkout goes live.
                </h2>
                <p className="mt-4 max-w-2xl text-primary-foreground/85">
                  The current flow captures early access. Razorpay is the planned international
                  gateway when paid access turns on; today the goal is choosing the first workflow
                  worth piloting.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild variant="secondary" size="lg">
                  <Link to="/try">Try now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <a href="mailto:shubhranshu@solarpunk.technology?subject=Ubik%20founder%20demo">Talk to founders</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container-page pb-16">
          <div className="grid gap-px bg-border md:grid-cols-3">
            {[
              [ClockCountdownIcon, "Volatile markets", "Surface delayed signals before they become margin leakage."],
              [DatabaseIcon, "Existing systems", "Keep ERPs, inboxes, and file stores as sources while Ubik prepares actions."],
              [FileSearchIcon, "Audit context", "Preserve the thread, file, and decision path behind every reviewed action."]
            ].map(([Icon, title, copy]) => (
              <div key={String(title)} className="bg-background p-5">
                <Icon className="text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{String(copy)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
