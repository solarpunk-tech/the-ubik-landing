import {
  ArrowRightIcon,
  ClipboardTextIcon,
  DatabaseIcon,
  FingerprintIcon,
  LockKeyIcon,
  ShieldCheckIcon
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Google } from "@/components/ui/svgs/google";
import { Microsoft } from "@/components/ui/svgs/microsoft";
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
      "Admins choose the connected tools and workflows. Ubik does not replace your ERP, inbox, or document store.",
    icon: LockKeyIcon
  },
  {
    title: "We ask for only what the workflow needs",
    copy:
      "Access is scoped to the approved inboxes, folders, files, or systems needed to prepare reviewed work.",
    icon: DatabaseIcon
  },
  {
    title: "AI drafts, humans approve",
    copy:
      "Ubik can summarize, extract, prioritize, and draft. Replies, approvals, and ERP-ready handoffs stay human-reviewed.",
    icon: FingerprintIcon
  },
  {
    title: "Your data is not training data",
    copy:
      "Customer workspace data is not sold or used to train third-party AI models. Sensitive trade context stays in the approved workspace.",
    icon: ShieldCheckIcon
  },
  {
    title: "Cookieless session telemetry",
    copy:
      "PostHog JS telemetry helps us see product-flow issues without ad cookies. Sensitive prompt and session fields are protected before capture.",
    icon: ClipboardTextIcon
  }
];

const adminApproval = [
  {
    title: "Google Workspace",
    copy:
      "Review requested permissions, approve the pilot workflow, and revoke access from Google Admin controls.",
    logo: Google
  },
  {
    title: "Microsoft 365",
    copy:
      "Review and grant app permissions in Microsoft Entra, scoped only to the workflow being piloted.",
    logo: Microsoft
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
  {
    title: "SOC 2 Type II",
    copy: "Audit track underway for customer trust reviews.",
    status: "In progress"
  },
  {
    title: "GDPR",
    copy: "EU data handling and DPA posture in review.",
    status: "In progress"
  },
  {
    title: "ISO 27001",
    copy: "Security controls mapped for certification readiness.",
    status: "In progress"
  },
  {
    title: "AES-256 at rest",
    copy: "Workspace data is encrypted at rest."
  },
  {
    title: "TLS 1.3 in transit",
    copy: "Traffic is encrypted in transit."
  },
  {
    title: "Audit log on every action",
    copy: "Approved workflows stay reviewable."
  }
];

function StatusTicker({ label }: { label: string }) {
  return (
    <span className="inline-flex w-fit items-center gap-2 border border-support/50 bg-support/15 px-2.5 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-support-foreground">
      <span className="size-2 animate-pulse bg-support shadow-[0_0_12px_hsl(var(--support)/0.8)]" aria-hidden />
      {label}
    </span>
  );
}

export default function SecurityMemo() {
  function shareMemo() {
    void navigator.clipboard.writeText(window.location.href);
    toast.success("Security note link copied.");
  }

  return (
    <PageShell>
      <Seo
        title="Ubik Security Note for Seafood Operators"
        description="A client-facing trust note for seafood importers, exporters, processors, and their customers."
        canonical="https://theubik.com/security"
        image="https://theubik.com/social/security.png"
      />
      <main className="relative overflow-hidden">
        <MatrixField variant="security" density="high" seed="client-trust-note" />
        <div className="container-page section-y relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
              <div className="flex flex-col gap-5">
                <Badge variant="secondary" className="w-fit">Security</Badge>
                <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">
                  Security for seafood operators and their customers.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                  Ubik connects only approved company tools for quotes, approvals, POs, and shipment
                  work. It drafts; operators stay in control.
                </p>
              </div>
              <Card className="bg-card/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Operating position</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground">
                  <p>
                    Start with one approved workflow. Connect only what that workflow needs.
                  </p>
                  <p>
                    Expand after permissions, audit trail, and approvals are reviewed by the right owners.
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
                <div key={item.title} className="grid min-h-32 content-between gap-4 bg-background p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p>
                  </div>
                  {item.status ? <StatusTicker label={item.status} /> : null}
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
                <h2 className="text-3xl font-semibold">Access approval is scoped.</h2>
                <p className="mt-3 text-muted-foreground">
                  Your company reviews the app, permissions, and first workflow before access is
                  granted. Access can be limited to the pilot and revoked by admins.
                </p>
              </div>
              <div className="grid gap-px bg-border md:grid-cols-2">
                {adminApproval.map(({ title, copy, logo: Logo }) => (
                  <Card key={title} className="border-0 bg-card/96 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center border bg-background">
                          <Logo className="size-5" aria-hidden />
                        </span>
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-muted-foreground">{copy}</CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <div className="mt-8 border bg-background/88 p-5 text-sm leading-6 text-muted-foreground">
              <p className="font-medium text-foreground">For workspace admins</p>
              <p className="mt-2">
                Treat Ubik like any other app approval: confirm the app and permissions, approve only
                the pilot workflow, and revoke access if the pilot ends.
              </p>
            </div>

            <Separator className="my-10" />

            <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <Badge variant="outline" className="mb-4">Before going live</Badge>
                <h2 className="text-3xl font-semibold">Production review.</h2>
                <p className="mt-3 text-muted-foreground">
                  Confirm scope, owners, approvals, revocation, and customer security expectations
                  before Ubik handles live replies, confirmations, or ERP-ready actions.
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
                    We can walk your commercial owner, system admin, and operating team through the
                    exact workflow before anything goes live.
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
