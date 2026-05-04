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
    title: "Access model",
    copy:
      "Ubik uses OAuth-based access for Google and Microsoft workspaces. Requested scopes should match the workflow being enabled, and access remains revocable through provider controls.",
    icon: LockKeyIcon
  },
  {
    title: "Data boundaries",
    copy:
      "Workspace data is processed to provide user-facing features such as extraction, prioritization, draft preparation, and workflow review. Customer workspace data is not sold.",
    icon: DatabaseIcon
  },
  {
    title: "AI boundaries",
    copy:
      "Customer workspace data is not used to train third-party AI models. Ubik prepares evidence-backed assistance; operators decide what is sent or pushed downstream.",
    icon: ShieldCheckIcon
  },
  {
    title: "Human control",
    copy:
      "Sensitive actions such as confirmations, approvals, outbound replies, and ERP-ready handoffs remain reviewable by a human operator before execution.",
    icon: FingerprintIcon
  }
];

const reviewChecklist = [
  "Confirm OAuth scopes match the first workflow being piloted.",
  "Confirm admin approval flow for Google or Microsoft workspaces.",
  "Confirm which inboxes, folders, files, and ERP touchpoints are connected.",
  "Confirm human-review requirements for replies, approvals, and ERP handoffs.",
  "Confirm retention, deletion, and audit-log expectations before production rollout.",
  "Confirm security review materials needed for SOC 2 readiness or internal vendor review."
];

export default function SecurityMemo() {
  function shareMemo() {
    void navigator.clipboard.writeText(window.location.href);
    toast.success("Trust note copied for your tech team.");
  }

  return (
    <PageShell>
      <Seo
        title="Ubik Trust Note"
        description="A trust note covering Ubik OAuth scopes, data boundaries, AI boundaries, human review, revocation, and security review posture."
        canonical="https://theubik.com/security"
      />
      <main className="relative overflow-hidden">
        <MatrixField variant="security" density="high" seed="cto-security-memo" />
        <div className="container-page section-y relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
              <div className="flex flex-col gap-5">
                <Badge variant="secondary" className="w-fit">Trust</Badge>
                <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">
                  Security posture for an AI operating layer.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                  This memo is written for technical reviewers evaluating Ubik for trade operations,
                  purchase-order workflows, inquiry autopilot, shipment visibility, and ERP-ready
                  human-approved actions.
                </p>
              </div>
              <Card className="bg-card/95 backdrop-blur">
                <CardHeader>
                  <CardTitle>Executive position</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground">
                  <p>
                    Ubik should be evaluated as a controlled operating layer above existing source
                    systems, not as a replacement for your ERP, inbox, or document store.
                  </p>
                  <p>
                    The initial rollout should start with one workflow, least-privilege scopes,
                    human approval gates, and a documented security review before production scale.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <Button onClick={shareMemo}>
                <ClipboardTextIcon data-icon="inline-start" />
                Share this with your tech team
              </Button>
              <Button asChild variant="outline">
                <a href={externalLinks.founderMeeting}>
                  Request security review
                </a>
              </Button>
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

            <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <Badge variant="outline" className="mb-4">Review checklist</Badge>
                <h2 className="text-3xl font-semibold">Before enabling a production workspace.</h2>
                <p className="mt-3 text-muted-foreground">
                  Use this checklist with the technical owner before Ubik handles live replies,
                  confirmations, or ERP-ready actions.
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
                  <h2 className="text-2xl font-semibold">Need the full review packet?</h2>
                  <p className="mt-2 text-primary-foreground/85">
                    Share this memo with the technical owner, then book a founder-led security walkthrough.
                  </p>
                </div>
                <Button asChild variant="secondary">
                  <a href={externalLinks.app}>
                    Start review <ArrowRightIcon data-icon="inline-end" />
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
