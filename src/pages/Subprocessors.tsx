import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

type Subprocessor = {
  name: string;
  purpose: string;
  data: string;
  location: string;
};

const subprocessors: Subprocessor[] = [
  {
    name: "Google Cloud Platform",
    purpose: "Primary hosting, storage, database, and analytics infrastructure",
    data: "Customer data and service metadata",
    location: "India and United States"
  },
  {
    name: "Google Workspace",
    purpose: "Identity provider and Gmail/Drive ingestion",
    data: "User identifiers and authorized customer content",
    location: "United States"
  },
  {
    name: "Microsoft",
    purpose: "OAuth identity provider",
    data: "User identifiers",
    location: "United States"
  },
  {
    name: "Recall.ai",
    purpose: "Meeting recording and transcription",
    data: "Meeting audio, video, and transcripts",
    location: "United States"
  },
  {
    name: "Zep / Neo4j",
    purpose: "Graph memory and relationship context",
    data: "Customer content and derived memory",
    location: "United States; Neo4j region under review"
  },
  {
    name: "Mem0",
    purpose: "User and preference memory",
    data: "Derived customer data",
    location: "United States"
  },
  {
    name: "OpenAI",
    purpose: "LLM processing",
    data: "Prompts and outputs derived from customer content",
    location: "United States"
  },
  {
    name: "Anthropic",
    purpose: "LLM processing",
    data: "Prompts and outputs derived from customer content",
    location: "United States"
  },
  {
    name: "OpenRouter",
    purpose: "LLM routing gateway",
    data: "Prompts and outputs derived from customer content",
    location: "United States"
  },
  {
    name: "Voyage AI",
    purpose: "Text embeddings",
    data: "Customer content converted to vectors",
    location: "United States"
  },
  {
    name: "LlamaIndex / LlamaParse",
    purpose: "Document parsing",
    data: "Customer files such as purchase orders, invoices, and contracts",
    location: "United States"
  },
  {
    name: "Tavily",
    purpose: "Web search API",
    data: "Query content derived from customer workflows",
    location: "United States"
  },
  {
    name: "Composio",
    purpose: "Integration gateway",
    data: "Customer data in transit between authorized tools",
    location: "United States"
  },
  {
    name: "Zoho",
    purpose: "ERP ingestion",
    data: "Customer business data",
    location: "Region under review"
  },
  {
    name: "Razorpay",
    purpose: "Payment processing",
    data: "Payer details and payment metadata",
    location: "India"
  },
  {
    name: "SeaRates",
    purpose: "Shipment tracking",
    data: "Shipment identifiers",
    location: "Region under review"
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
          <p className="text-sm font-medium text-foreground/72 dark:text-foreground/82">Last updated: 2026-06-02</p>
          <h1 className="mt-3 text-5xl font-semibold">Subprocessors</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/72 dark:text-foreground/82">
            This page lists third-party providers that Ubik uses to process customer personal data or customer content when delivering the service.
          </p>

          <section className="mt-10 border bg-card p-5">
            <h2 className="text-2xl font-semibold">Change notification</h2>
            <div className="mt-4 grid gap-3 leading-7 text-foreground/72 dark:text-foreground/82">
              <p>
                Ubik will provide affected customers with advance notice before adding or replacing a subprocessor that processes customer data, as described in the applicable customer agreement or Data Processing Agreement.
              </p>
              <p>
                Customers may contact founders@theubik.com with subprocessor questions, DPA/SCC requests, or reasonable data-protection objections.
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
            <h2 className="text-2xl font-semibold text-foreground">Notes</h2>
            <p>
              PostHog is used for cookieless product and website telemetry and is disclosed in the Privacy Notice. It is not listed here as a customer-data subprocessor when configured without cookies, session recording, user profiles, or customer identifiers.
            </p>
            <p>
              Regions and transfer mechanisms marked as under review are being finalized as part of Ubik's SOC 2 readiness and privacy pack review.
            </p>
          </section>
        </article>
      </main>
    </PageShell>
  );
}
