import {
  ArrowRightIcon,
  ClipboardTextIcon,
  DatabaseIcon,
  FingerprintIcon,
  LockKeyIcon,
  ShieldCheckIcon
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";
import { externalLinks } from "@/lib/links";

const memoBlocks = [
  {
    title: "You approve the workspace",
    copy:
      "Your admin decides which company tools and workflows are connected. Ubik does not replace your ERP, inbox, or document store.",
    icon: LockKeyIcon
  },
  {
    title: "We ask for only what the workflow needs",
    copy:
      "Access is matched to the approved pilot workflow: the inboxes, folders, files, or business systems needed to prepare reviewed work.",
    icon: DatabaseIcon
  },
  {
    title: "AI drafts, humans approve",
    copy:
      "Ubik can summarize, extract, prioritize, and draft. Buyer replies, confirmations, approvals, and ERP-ready handoffs stay reviewed by a human operator.",
    icon: FingerprintIcon
  },
  {
    title: "Your data is not training data",
    copy:
      "Customer workspace data is not sold and is not used to train third-party AI models. Sensitive trade context stays inside the approved workspace or deployment model.",
    icon: ShieldCheckIcon
  }
];

const adminApproval = [
  {
    title: "Google Workspace",
    copy:
      "Your Google admin can review the app, see requested permissions, approve the workflow, and revoke access from Google Admin controls."
  },
  {
    title: "Microsoft 365",
    copy:
      "Your Microsoft admin can review and grant app permissions in Microsoft Entra. Ubik should be approved only for the workflow being piloted."
  }
];

const reviewChecklist = [
  "Choose one workflow to start: inquiry, PO, approvals, shipment visibility, or traceability.",
  "Confirm the tools, inboxes, folders, files, and ERP or CRM touchpoints needed.",
  "Confirm who can approve buyer replies, confirmations, approvals, and ERP-ready handoffs.",
  "Confirm what Ubik may read, summarize, extract, or draft.",
  "Confirm where your admin can revoke Google or Microsoft access.",
  "Confirm the audit or security packet your customer needs before go-live."
];

const trustBaselines = [
  "SOC 2 Type 2",
  "GDPR",
  "ISO 27001",
  "AES-256 at rest",
  "TLS 1.3 in transit",
  "Audit log on every action"
];

export default function SecurityMemo() {
  function shareMemo() {
    void navigator.clipboard.writeText(window.location.href);
    toast.success("Trust note link copied.");
  }

  return (
    <PageShell>
      <Seo
        title="Ubik Trust Note for Seafood Operators"
        description="A plain-language trust note for seafood importers, exporters, processors, and their customers."
        canonical="https://theubik.com/security"
      />
      <main className="relative overflow-hidden">
        <MatrixField variant="security" density="high" seed="client-trust-note" />
        <div className="container-page section-y relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
              <div className="flex flex-col gap-5">
                <Badge variant="secondary" className="w-fit">Trust</Badge>
                <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">
                  Trust for seafood operators and their customers.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                  Ubik connects to approved company tools so your team can prepare quotes, approvals,
                  POs, and shipment work faster. It does not take over your ERP, inbox, or customer
                  communication. Operators stay in control.
                </p>
              </div>
              <Card className="bg-card/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Plain-English position</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground">
                  <p>
                    Start with one approved workflow. Give Ubik only the tool access needed for that
                    workflow. Keep human approval on sensitive moves.
                  </p>
                  <p>
                    Expand only when your admin, operators, and customer reviewers are comfortable
                    with the permissions, audit trail, and approval flow.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={externalLinks.founderMeeting}>
                  Talk to founders <ArrowRightIcon data-icon="inline-end" />
                </a>
              </Button>
              <Button onClick={shareMemo} variant="outline">
                <ClipboardTextIcon data-icon="inline-start" />
                Copy trust note
              </Button>
            </div>

            <div className="mb-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {trustBaselines.map((item) => (
                <div key={item} className="bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border md:grid-cols-2">
              {memoBlocks.map(({ title, copy, icon: Icon }) => (
                <Card key={title} className="border-0 bg-card/96 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="text-primary" aria-hidden />
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">{copy}</CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-10" />

            <section className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <Badge variant="outline" className="mb-4">Admin approval</Badge>
                <h2 className="text-3xl font-semibold">What approval means.</h2>
                <p className="mt-3 text-muted-foreground">
                  Admin approval is not a blank cheque. It is the step where your company reviews
                  the app, the requested permissions, and the first workflow before access is granted.
                </p>
              </div>
              <div className="grid gap-px bg-border md:grid-cols-2">
                {adminApproval.map(({ title, copy }) => (
                  <Card key={title} className="border-0 bg-card/96 backdrop-blur">
                    <CardHeader>
                      <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-muted-foreground">{copy}</CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <div className="mt-8 border bg-background/88 p-5 text-sm leading-6 text-muted-foreground">
              <p className="font-medium text-foreground">For workspace admins</p>
              <p className="mt-2">
                Treat Ubik like any other app approval: confirm the app, confirm the permissions,
                approve only the workflow being piloted, and revoke access if the pilot ends.
              </p>
            </div>

            <Separator className="my-10" />

            <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <Badge variant="outline" className="mb-4">Before going live</Badge>
                <h2 className="text-3xl font-semibold">A simple review list.</h2>
                <p className="mt-3 text-muted-foreground">
                  Use this list with the director, operator, and admin before Ubik handles live
                  replies, confirmations, or ERP-ready actions.
                </p>
              </div>
              <div className="grid gap-px bg-border">
                {reviewChecklist.map((item, index) => (
                  <div key={item} className="grid grid-cols-[auto_1fr] gap-4 bg-background p-4 text-sm leading-6">
                    <Badge variant="outline">0{index + 1}</Badge>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <Card className="relative mt-10 overflow-hidden border-primary/30 bg-primary text-primary-foreground">
              <MatrixField variant="cta" density="medium" seed="security-cta" />
              <CardContent className="relative z-10 flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Want to review access before onboarding?</h2>
                  <p className="mt-2 text-primary-foreground/85">
                    We can walk your director, admin, and operator through the exact workflow before
                    anything goes live.
                  </p>
                </div>
                <Button asChild variant="secondary">
                  <a href={externalLinks.founderMeeting}>
                    Talk to founders <ArrowRightIcon data-icon="inline-end" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
