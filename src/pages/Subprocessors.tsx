import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

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
    purpose: "Primary hosting, storage, database (Cloud SQL), analytics warehouse",
    data: "All customer data",
    location: "India (asia-south1) and United States (us-central1)"
  },
  {
    name: "Google Workspace",
    purpose: "Identity provider (SSO) and Gmail/Drive ingestion",
    data: "User identifiers and customer content",
    location: "United States"
  },
  {
    name: "Zep",
    purpose: "Graph memory service (Neo4j)",
    data: "Customer content and derived memory",
    location: "United States"
  },
  {
    name: "Neo4j",
    purpose: "Graph database (via Zep)",
    data: "Customer relationship graphs",
    location: "United States"
  },
  {
    name: "Mem0",
    purpose: "User/preference memory",
    data: "Derived customer data",
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
    purpose: "LLM processing",
    data: "Prompts and outputs from customer content",
    location: "United States"
  },
  {
    name: "Anthropic",
    purpose: "LLM processing (Claude)",
    data: "Prompts and outputs from customer content",
    location: "United States"
  },
  {
    name: "OpenRouter",
    purpose: "LLM routing/gateway",
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
    name: "Tavily",
    purpose: "Web search API",
    data: "Query content derived from customer data",
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
    name: "Razorpay",
    purpose: "Payment processing",
    data: "Payer details and payment metadata",
    location: "India"
  },
  {
    name: "Microsoft",
    purpose: "OAuth identity provider",
    data: "User identifiers",
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
          <p className="text-sm font-medium text-foreground/72 dark:text-foreground/82">Version 1.0 — effective on publication</p>
          <h1 className="mt-3 text-5xl font-semibold">Subprocessors</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/72 dark:text-foreground/82">
            This page lists the third-party subprocessors that Ubik (Solarpunk Technology) engages to process customer personal data or content in delivering the Ubik service.
          </p>

          <section className="mt-10 border bg-card p-5">
            <h2 className="text-2xl font-semibold">Change notification</h2>
            <div className="mt-4 grid gap-3 leading-7 text-foreground/72 dark:text-foreground/82">
              <p>
                When we intend to add or replace a subprocessor, we will provide affected customers with at least 30 days’ advance notice before the new subprocessor begins processing customer data. Notifications are published on our Trust Center and sent by email to affected customers.
              </p>
              <p>
                Customers may object to a new subprocessor on reasonable data-protection grounds during the notice window, as set out in our Data Processing Agreement.
              </p>
            </div>
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
                    <p className="text-xs font-medium uppercase text-foreground/72 dark:text-foreground/82 md:hidden">Subprocessor</p>
                    <p className="mt-1 font-medium md:mt-0">{item.name}</p>
                  </div>
                  <div className="bg-background p-4">
                    <p className="text-xs font-medium uppercase text-foreground/72 dark:text-foreground/82 md:hidden">Purpose</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/72 dark:text-foreground/82 md:mt-0">{item.purpose}</p>
                  </div>
                  <div className="bg-background p-4">
                    <p className="text-xs font-medium uppercase text-foreground/72 dark:text-foreground/82 md:hidden">Data categories</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/72 dark:text-foreground/82 md:mt-0">{item.data}</p>
                  </div>
                  <div className="bg-background p-4">
                    <p className="text-xs font-medium uppercase text-foreground/72 dark:text-foreground/82 md:hidden">Location</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/72 dark:text-foreground/82 md:mt-0">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-3 leading-7 text-foreground/72 dark:text-foreground/82">
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
