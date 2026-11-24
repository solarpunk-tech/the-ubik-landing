import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/button";
import { externalLinks } from "@/lib/links";

// Public legal copy mapped from compliance/privacy/subprocessor-list-public.md.
type Subprocessor = {
  name: string;
  purpose: string;
  data: string;
  location: string;
};

const subprocessors: Subprocessor[] = [
  {
    name: "Recall.ai",
    purpose: "Meeting recording & transcription",
    data: "Meeting audio/video and transcripts (customer content)",
    location: "United States"
  },
  {
    name: "Google Cloud Platform",
    purpose: "Primary hosting, storage, databases, encryption keys and analytics",
    data: "All customer data, including the encrypted record of AI prompts and responses",
    location: "India and United States"
  },
  {
    name: "Amazon Web Services",
    purpose: "AI model processing (Amazon Bedrock), document text extraction and file storage",
    data: "Prompts and outputs from customer content; customer-uploaded files and document images",
    location: "India"
  },
  {
    name: "Google Workspace",
    purpose: "Identity provider (SSO) and Gmail/Drive ingestion",
    data: "User identifiers and customer content",
    location: "United States"
  },
  {
    name: "Google (Gemini API)",
    purpose: "AI model processing for market and news signals",
    data: "Prompts that may include customer context",
    location: "United States"
  },
  {
    name: "Aurinko",
    purpose: "Email and calendar sync",
    data: "Mailbox and calendar content",
    location: "United States"
  },
  {
    name: "Zep",
    purpose: "Memory service",
    data: "Customer content and derived memory",
    location: "United States"
  },
  {
    name: "Neo4j",
    purpose: "Graph database for memory",
    data: "Customer relationship graphs",
    location: "United States"
  },
  {
    name: "Voyage AI",
    purpose: "Text embeddings",
    data: "Customer content converted to vectors",
    location: "United States"
  },
  {
    name: "OpenAI",
    purpose: "AI model processing and speech-to-text for voice dictation",
    data: "Prompts and outputs from customer content; dictated audio clips",
    location: "United States"
  },
  {
    name: "Anthropic",
    purpose: "AI model processing (Claude)",
    data: "Prompts and outputs from customer content",
    location: "United States"
  },
  {
    name: "OpenRouter",
    purpose: "AI model routing",
    data: "Prompts and outputs from customer content",
    location: "United States"
  },
  {
    name: "LlamaIndex (LlamaParse)",
    purpose: "Document parsing",
    data: "Customer files (POs, invoices, contracts)",
    location: "United States"
  },
  {
    name: "Exa",
    purpose: "Web search",
    data: "Search queries derived from customer conversations",
    location: "United States"
  },
  {
    name: "Perplexity",
    purpose: "Web research for market and news signals",
    data: "Search queries that may include customer context",
    location: "United States"
  },
  {
    name: "Composio",
    purpose: "Integration gateway",
    data: "Customer data in transit",
    location: "United States"
  },
  {
    name: "Zoho",
    purpose: "ERP ingestion",
    data: "Customer business data",
    location: "India"
  },
  {
    name: "Microsoft",
    purpose: "OAuth identity provider",
    data: "User identifiers",
    location: "United States"
  },
  {
    name: "Okta (Auth0 FGA)",
    purpose: "Feature access control",
    data: "User and organisation identifiers",
    location: "United States"
  },
  {
    name: "Vonage",
    purpose: "Phone number verification for sign-in",
    data: "Phone numbers",
    location: "United States"
  },
  {
    name: "Loops",
    purpose: "Product-update and newsletter email",
    data: "Names and email addresses",
    location: "United States"
  },
  {
    name: "PostHog",
    purpose: "Product analytics, error and crash reports, AI usage metrics",
    data: "Pseudonymous user id, product usage events, error and crash reports, and AI call metadata (model, tokens, cost, timing). Customer prompts and responses are not sent. IP not collected",
    location: "United States"
  },
  {
    name: "Langfuse",
    purpose: "AI call tracing (being retired)",
    data: "Prompts and outputs from customer content",
    location: "United States"
  }
];

export default function Subprocessors() {
  return (
    <PageShell>
      <Seo
        title="Subprocessors | Ubik"
        description="Third-party subprocessors used to deliver Ubik services."
        canonical="https://theubik.com/legal/subprocessors"
      />
      <main className="container-page section-y">
        <article className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-muted-foreground">Version 1.2 — last updated 24 November 2026</p>
          <h1 className="mt-3 text-5xl font-semibold">Subprocessors</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            This page lists the third-party subprocessors that Ubik (Solarpunk Technology) engages to process customer personal data or content in delivering the Ubik service.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href={externalLinks.trustCenter} target="_blank" rel="noopener noreferrer">
                View live Trust Center
              </a>
            </Button>
          </div>

          <section className="mt-10 border bg-card p-5">
            <h2 className="text-2xl font-semibold">Change notification</h2>
            <div className="mt-4 grid gap-3 leading-7 text-muted-foreground">
              <p>
                When we intend to add or replace a subprocessor, we will provide affected customers with at least 30 days’ advance notice before the new subprocessor begins processing customer data. Notifications are published on our Trust Center and sent by email to affected customers.
              </p>
              <p>
                Customers may object to a new subprocessor on reasonable data-protection grounds during the notice window, as set out in our Data Processing Agreement.
              </p>
            </div>
          </section>

          <section className="mt-10 grid gap-3 leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">Changes in version 1.2</h2>
            <p>
              This version corrects the list so that it matches the services we use today. Added: Amazon Web Services, Aurinko, Exa, Google (Gemini API), Langfuse, Loops, Okta (Auth0 FGA), Perplexity and Vonage. Removed, because they no longer process customer data: Mem0, Razorpay and Tavily.
            </p>
            <p>
              The record of AI prompts and responses described in our Privacy Notice is stored on Google Cloud Platform. It is not sent to any additional subprocessor.
            </p>
          </section>

          <section className="mt-10 overflow-hidden border">
            <div className="grid gap-px bg-border">
              <div className="hidden grid-cols-[1.1fr_1.4fr_1.4fr_0.9fr] gap-px bg-border text-sm font-semibold md:grid">
                <div className="bg-shell p-4">Subprocessor</div>
                <div className="bg-shell p-4">Purpose</div>
                <div className="bg-shell p-4">Data categories</div>
                <div className="bg-shell p-4">Location</div>
              </div>
              {subprocessors.map((item) => (
                <div key={item.name} className="grid gap-px bg-border md:grid-cols-[1.1fr_1.4fr_1.4fr_0.9fr]">
                  <div className="bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground md:hidden">Subprocessor</p>
                    <p className="mt-1 font-medium md:mt-0">{item.name}</p>
                  </div>
                  <div className="bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground md:hidden">Purpose</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground md:mt-0">{item.purpose}</p>
                  </div>
                  <div className="bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground md:hidden">Data categories</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground md:mt-0">{item.data}</p>
                  </div>
                  <div className="bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground md:hidden">Location</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground md:mt-0">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-3 leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">Transfers</h2>
            <p>
              For transfers to US-based subprocessors, Ubik relies on the EU Standard Contractual Clauses (SCCs, Modules 2 and 3) together with a Data Processing Agreement per subprocessor. See our Privacy Notice and Data Processing Agreement for detail.
            </p>
          </section>
        </article>
      </main>
    </PageShell>
  );
}
