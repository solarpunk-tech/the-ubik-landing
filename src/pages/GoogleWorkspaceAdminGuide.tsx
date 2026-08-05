import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckCircleIcon,
  InfoIcon,
  LinkIcon,
  WarningIcon
} from "@phosphor-icons/react";
import { Gmail } from "@/components/ui/svgs/gmail";
import { Google } from "@/components/ui/svgs/google";
import { GoogleCalendar } from "@/components/ui/svgs/googleCalendar";
import { GoogleContacts } from "@/components/ui/svgs/googleContacts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

const CLIENT_ID = "817921716307-4v9rp42d7o51ahtc0jspddj4hrai8e6p.apps.googleusercontent.com";
const SUPPORT_EMAIL = "shubhranshu@solarpunk.technology";

function Path({ children }: { children: ReactNode }) {
  return (
    <code className="border bg-muted px-1.5 py-0.5 font-mono text-[0.82em] text-foreground">
      {children}
    </code>
  );
}

function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-3 flex items-stretch gap-2 border bg-background p-1.5 pl-3 shadow-sm">
      <code className="flex-1 self-center overflow-x-auto whitespace-nowrap font-mono text-xs sm:text-sm">{value}</code>
      <Button type="button" size="sm" variant={copied ? "secondary" : "outline"} onClick={copy} aria-label={`Copy ${label}`}>
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

const steps: { title: string; body: ReactNode; copy?: string }[] = [
  {
    title: "Open API controls",
    body: (
      <>
        Go to <Path>Security → Access and data control → API controls</Path>.
      </>
    )
  },
  {
    title: "Manage third-party access",
    body: (
      <>
        Under <em>App access control</em>, click <Path>Manage Third-Party App Access</Path>.
      </>
    )
  },
  {
    title: "Add the app",
    body: (
      <>
        Click <Path>Add app → OAuth App Name Or Client ID</Path>.
      </>
    )
  },
  {
    title: "Search by client ID",
    body: (
      <>
        Paste ubik&rsquo;s OAuth client ID below, then select the app named <b>ubik</b>.
      </>
    ),
    copy: CLIENT_ID
  },
  {
    title: "Choose who it applies to",
    body: <>Pick an organizational unit, a group, or your whole organization.</>
  },
  {
    title: "Set access to Trusted",
    body: (
      <>
        Choose <Path>Trusted: Can access all Google services</Path>, then <b>Configure / Finish</b>.
      </>
    )
  }
];

const scopes = [
  {
    access: "See & download contacts",
    tag: "Read-only",
    scope: "contacts.readonly",
    why: "Recipient auto-complete and sender identification. ubik never edits or deletes contacts.",
    icon: GoogleContacts
  },
  {
    access: "Read, label & archive Gmail; create drafts",
    scope: "gmail.modify",
    why: "Triage shipment emails, apply labels, archive threads. Never permanently deletes mail.",
    icon: Gmail
  },
  {
    access: "Send email on the user's behalf",
    scope: "gmail.send",
    why: "Send only the replies a user composes and approves inside ubik.",
    icon: Gmail
  },
  {
    access: "Manage calendar events",
    scope: "calendar",
    why: "Read availability, then create or update events a user schedules from ubik.",
    icon: GoogleCalendar
  },
  {
    access: "Sign-in identity",
    scope: "openid · email · profile",
    why: "Authenticate the user and show their name and email in ubik.",
    icon: Google
  }
];

const dataSpec = [
  { term: "Data accessed", detail: "Gmail, Calendar, and contacts for users who explicitly connect their account — scoped to the permissions above." },
  { term: "Connection method", detail: "Google is connected via Aurinko over OAuth 2.0. ubik stores access tokens, never Google passwords." },
  { term: "Permanent deletion", detail: "Never. Archive and trash actions move mail within Gmail only; messages stay recoverable." },
  { term: "Write actions", detail: "Human-approved only. Sends, drafts, and calendar events go out solely on a user's explicit approval." },
  { term: "Encryption", detail: "TLS 1.3 in transit; AES-256 at rest across Postgres, S3, and application storage." },
  { term: "Hosting & region", detail: "Mumbai, India — AWS (ap-south-1) and Google Cloud (asia-south1)." },
  { term: "Retention", detail: "180 days by default, configurable by your admin, and deleted on request." },
  { term: "Sub-processors", detail: "Aurinko, Amazon Web Services, Google Cloud, and Anthropic (AI summarization)." },
  { term: "Disconnect", detail: "Any user can disconnect in ubik or at myaccount.google.com/connections; an admin can revoke trust here." },
  { term: "Verification status", detail: "Google OAuth app verification in progress; ADA-CASA AL1 assessment underway for the Gmail scope." }
];

export default function GoogleWorkspaceAdminGuide() {
  function copyLink() {
    void navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied.");
  }

  return (
    <PageShell>
      <Seo
        title="ubik | Google Workspace Setup & Security"
        description="Approve ubik in your Google Workspace Admin console, and see exactly what it accesses and why."
        canonical="https://theubik.com/google-workspace-admin-guide"
        image="/og-image.png"
        imageAlt="ubik: Google Workspace setup and security"
      />
      <main className="relative">
        <div className="container-page section-y">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Approve <span className="inline-block size-[0.5em] shrink-0 bg-primary" aria-hidden />
                ubik as a Google Workspace Administrator
              </h1>
              <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
                <LinkIcon data-icon="inline-start" aria-hidden />
                Copy link
              </Button>
            </div>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/72 dark:text-foreground/82">
              A two-minute, admin-only step that removes the &ldquo;unverified app&rdquo; warning when your
              team connects Gmail, Calendar, and Contacts.
            </p>

            <Separator className="my-10" />

            <div className="flex gap-3 border border-support/40 bg-support/10 p-5">
              <WarningIcon className="mt-0.5 size-5 shrink-0 text-support" aria-hidden />
              <p className="text-sm leading-6 text-foreground/86">
                <strong className="text-foreground">Why users see a warning today.</strong> ubik is
                completing Google&rsquo;s app-verification review. Until it clears, first connections show
                &ldquo;Google hasn&rsquo;t verified this app.&rdquo; Marking ubik <strong>Trusted</strong> removes
                that screen now, and stops the six-month re-consent prompt.
              </p>
            </div>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold">Set up in the Admin console</h2>
              <p className="mt-2 text-foreground/72 dark:text-foreground/82">
                Sign in to{" "}
                <a href="https://admin.google.com" className="text-primary underline underline-offset-2">
                  admin.google.com
                </a>{" "}
                as a Super Admin, then:
              </p>
              <ol className="mt-6 flex flex-col divide-y border-y">
                {steps.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-4 py-4">
                    <span className="flex size-8 items-center justify-center border bg-primary/10 font-mono text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div className="text-sm leading-6">
                      <p className="font-medium text-foreground">{step.title}</p>
                      <div className="mt-1 text-foreground/72 dark:text-foreground/82">{step.body}</div>
                      {step.copy ? <CopyField value={step.copy} label="client ID" /> : null}
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-sm text-foreground/72 dark:text-foreground/82">
                That&rsquo;s it — the warning clears within minutes for whoever this applies to.
              </p>

              <div className="mt-6 flex gap-3 border border-primary/30 bg-primary/5 p-5">
                <InfoIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <p className="text-sm leading-6 text-foreground/86">
                  <strong className="text-foreground">Does Trusted mean full access? No.</strong> It only
                  clears the warning for the scopes ubik already requests, below — an app can never receive
                  a scope it doesn&rsquo;t ask for. To keep other apps least-privilege, leave them Restricted
                  under <Path>Manage Google Services</Path>; this setting allow-lists ubik specifically.
                </p>
              </div>
            </section>

            <Separator className="my-10" />

            <section>
              <h2 className="text-2xl font-semibold">What ubik accesses — and why</h2>
              <p className="mt-2 text-foreground/72 dark:text-foreground/82">
                The minimum scope each connected feature needs. Nothing more.
              </p>
              <div className="mt-6 overflow-x-auto border">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-foreground/60">
                      <th className="px-4 py-3 font-medium">Access</th>
                      <th className="px-4 py-3 font-medium">Scope</th>
                      <th className="px-4 py-3 font-medium">What it&rsquo;s for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scopes.map(({ access, tag, scope, why, icon: Icon }) => (
                      <tr key={scope} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium text-foreground">
                          <span className="flex items-center gap-2">
                            <Icon className="size-4 shrink-0" aria-hidden />
                            {access}
                            {tag ? (
                              <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                {tag}
                              </Badge>
                            ) : null}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-primary">{scope}</td>
                        <td className="px-4 py-3 text-foreground/72 dark:text-foreground/82">{why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex gap-3 border border-emerald-600/30 bg-emerald-500/10 p-5">
                <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                <p className="text-sm leading-6 text-foreground/86">
                  <strong className="text-foreground">Nothing happens without a person.</strong> ubik never
                  sends mail or touches a calendar on its own — every send and every change goes out only
                  after a user reviews and approves it.
                </p>
              </div>
            </section>

            <Separator className="my-10" />

            <section>
              <h2 className="text-2xl font-semibold">Security &amp; data handling</h2>
              <p className="mt-2 text-foreground/72 dark:text-foreground/82">
                A summary for security review. Full detail in our{" "}
                <Link to="/legal/privacy" className="text-primary underline underline-offset-2">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link to="/terms-of-service" className="text-primary underline underline-offset-2">
                  Terms
                </Link>
                .
              </p>
              <Card className="mt-6">
                <CardContent className="p-0">
                  <dl className="divide-y">
                    {dataSpec.map(({ term, detail }) => (
                      <div key={term} className="grid gap-1 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:gap-4">
                        <dt className="text-sm font-medium text-foreground">{term}</dt>
                        <dd className="m-0 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{detail}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </section>

            <p className="mt-10 text-sm text-foreground/60">
              Questions about this approval? Reach us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline underline-offset-2">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
