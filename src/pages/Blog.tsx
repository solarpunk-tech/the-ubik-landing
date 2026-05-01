import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  FlowArrowIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StackIcon
} from "@phosphor-icons/react";
import { PageShell } from "@/components/landing/PageShell";
import { SharePostPanel } from "@/components/landing/SharePostPanel";
import { Seo } from "@/components/seo/Seo";
import { blogPosts } from "@/lib/landing-content";

type BlogPost = (typeof blogPosts)[number];

const metricBars = [
  { label: "Raw material exposure", value: "55-62%", width: "82%" },
  { label: "Trade still running through email and chat", value: "90%", width: "90%" },
  { label: "Typical operating margin", value: "5-15%", width: "34%" },
  { label: "Pricing-error tolerance", value: "2%", width: "18%" }
];

const workflowSteps = [
  { label: "Inquiry", copy: "Buyer asks for price, substitution, volume, or timing." },
  { label: "Context", copy: "Inventory, COGS, lane timing, and account history are assembled." },
  { label: "Guardrail", copy: "Margin and policy checks run before a draft reaches the operator." },
  { label: "Review", copy: "A human approves, edits, or rejects the action before it moves." }
];

const thesisNodes = [
  { icon: StackIcon, title: "Software today", copy: "A workspace reads across inboxes, files, ERP, CRM, meetings, and trade documents." },
  { icon: FlowArrowIcon, title: "Operations next", copy: "Reviewed agents take on repeatable workflows without replacing the systems of record." },
  { icon: ShieldCheckIcon, title: "Bounded expansion", copy: "Human approval, audit trails, and lane discipline keep automation from becoming uncontrolled trading." }
];

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t py-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-4 text-base leading-8 text-muted-foreground">{children}</div>
    </section>
  );
}

function DecisionIntelligenceArticle() {
  return (
    <div className="mt-10 grid gap-8">
      <div className="grid gap-px bg-border lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-card p-5 sm:p-6">
          <p className="section-label">Operating pressure</p>
          <h2 className="mt-5 text-3xl font-semibold">Small misses become margin events.</h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Perishable trade teams do not lose time because they lack software. They lose time because critical work crosses inboxes, spreadsheets, documents, calls, and ERP screens before anyone can make a reviewed decision.
          </p>
        </div>
        <div className="grid gap-3 bg-background p-5 sm:p-6">
          {metricBars.map((bar) => (
            <div key={bar.label} className="grid gap-2">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium">{bar.label}</span>
                <span className="font-mono text-primary">{bar.value}</span>
              </div>
              <div className="h-2 bg-muted">
                <div className="h-full bg-primary" style={{ width: bar.width }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ArticleSection title="What decision intelligence means here">
        <p>
          Decision intelligence is not a chat box over the business. It is a system that assembles operational evidence, applies domain guardrails, and prepares the next action for human review. In perishable supply chains, that means a quote, purchase order, shipment update, margin exception, or traceability answer can be prepared with context already attached.
        </p>
        <p>
          The useful unit is the reviewed action. A model can draft language, but the workspace must know which inventory record, lane assumption, pricing formula, and customer promise it used. That is the difference between generic AI output and work an operator can approve.
        </p>
      </ArticleSection>

      <div className="grid gap-px bg-border sm:grid-cols-3">
        {["Source context", "Margin guardrails", "Human approval"].map((item, index) => (
          <div key={item} className="bg-background p-5">
            <p className="font-mono text-sm text-primary">0{index + 1}</p>
            <h3 className="mt-6 text-xl font-semibold">{item}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {index === 0
                ? "Connect the thread to documents, ERP rows, customer history, and market context."
                : index === 1
                  ? "Check pricing, timing, and policy before an outbound action is suggested."
                  : "Keep the operator in control before anything is sent or written back."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteWorkflowArticle() {
  return (
    <div className="mt-10 grid gap-8">
      <div className="border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2 text-primary">
          <ChartLineUpIcon aria-hidden />
          <p className="section-label text-primary">Workflow compression</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[0.35fr_1fr_0.35fr] md:items-center">
          <div>
            <p className="text-4xl font-semibold">5-7d</p>
            <p className="mt-2 text-sm text-muted-foreground">Manual inquiry-to-quote path</p>
          </div>
          <div className="grid gap-2">
            <div className="h-px bg-border" />
            <div className="grid grid-cols-4 gap-px bg-border">
              {workflowSteps.map((step) => (
                <div key={step.label} className="min-h-28 bg-background p-3">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{step.label}</p>
                  <p className="mt-3 text-sm leading-5">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-4xl font-semibold text-primary">6h</p>
            <p className="mt-2 text-sm text-muted-foreground">Reviewed quote packet</p>
          </div>
        </div>
      </div>

      <ArticleSection title="Why the cycle gets shorter">
        <p>
          Quote work usually stalls because no one source has the answer. The operator needs current inventory, cost assumptions, prior customer context, margin boundaries, shipment timing, and any substitution rules. When those pieces are collected one by one, the clock stretches across days.
        </p>
        <p>
          A reviewed workflow changes the shape of the task. Ubik prepares the packet first: evidence, draft reply, risk notes, and source-system references. The operator spends time judging the action instead of gathering fragments.
        </p>
      </ArticleSection>

      <div className="grid gap-4 border-y py-6 sm:grid-cols-2">
        {["Before", "After"].map((title) => (
          <div key={title} className="grid gap-3">
            <h3 className="text-xl font-semibold">{title}</h3>
            <ul className="grid gap-3 text-sm leading-6 text-muted-foreground">
              {(title === "Before"
                ? ["Thread copied into spreadsheet", "COGS checked in ERP", "Margin reviewed after draft", "Customer waits through handoffs"]
                : ["Thread linked to source context", "COGS and inventory attached", "Margin guardrail visible before send", "Operator approves one packet"]
              ).map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircleIcon className="mt-1 shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThesisArticle() {
  return (
    <div className="mt-10 grid gap-8">
      <div className="grid gap-px bg-border lg:grid-cols-3">
        {thesisNodes.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="bg-card p-5 sm:p-6">
            <Icon className="text-primary" size={24} aria-hidden />
            <h2 className="mt-8 text-2xl font-semibold">{title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>

      <ArticleSection title="The thesis">
        <p>
          Vertical AI is often described as software for a narrow industry. That framing is too small. The better question is which operating motions can be handled by software with domain memory, connected source systems, and review gates.
        </p>
        <p>
          In perishable trade, the first wedge is the workbench: quotes, purchase orders, shipment changes, inventory promises, meeting memory, and traceability. Over time, the same operating memory can support better procurement timing, hedged lanes, and more disciplined customer commitments.
        </p>
      </ArticleSection>

      <div className="border bg-shell p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <SparkleIcon className="text-primary" aria-hidden />
          <h2 className="text-2xl font-semibold">Customer boundary</h2>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
          The operating layer should not compete with customers on the same lanes. It should make existing operators faster, safer, and more measurable while keeping commercial control with the business that owns the customer relationship.
        </p>
      </div>
    </div>
  );
}

function ArticleBody({ post }: { post: BlogPost }) {
  if (post.slug === "buyer-follow-up-to-order-packet") {
    return <QuoteWorkflowArticle />;
  }

  if (post.slug === "human-in-loop-erp-handoffs") {
    return <ThesisArticle />;
  }

  return <DecisionIntelligenceArticle />;
}

export default function Blog() {
  const { slug } = useParams();
  const selected = slug ? blogPosts.find((post) => post.slug === slug) ?? blogPosts[0] : null;

  if (selected) {
    return (
      <PageShell>
        <Seo title={`${selected.title} — Ubik Journal`} description={selected.excerpt} />
        <main className="container-page section-y">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon aria-hidden /> Journal
          </Link>
          <article className="mt-10 grid gap-10 lg:grid-cols-[1fr_16rem] lg:items-start">
            <div className="max-w-3xl">
              <p className="section-label">
                {selected.date} / {selected.category}
              </p>
              <h1 className="mt-4 text-5xl font-semibold leading-[1.05] sm:text-6xl">{selected.title}</h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">{selected.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <span>Last updated 2026-04-29</span>
                <span>/</span>
                <span>Ubik field team</span>
              </div>
              <ArticleBody post={selected} />
            </div>
            <aside className="lg:sticky lg:top-24 lg:justify-self-start">
              <SharePostPanel title={selected.title} url={`https://theubik.com/blog/${selected.slug}`} />
            </aside>
          </article>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Seo
        title="Ubik Journal"
        description="Minimal notes on perishable operations, reviewed automation, and the operator layer above existing systems."
      />
      <main className="container-page section-y">
        <div className="grid gap-8 border-b pb-10 lg:grid-cols-[0.9fr_1.1fr]">
          <h1 className="text-5xl font-semibold leading-[1.05] sm:text-6xl">Ubik Journal</h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Sparse notes on perishable operations, source systems, and the review loops that keep work moving.
          </p>
        </div>
        <div className="grid gap-px bg-border lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="min-h-72 bg-background p-5 hover:bg-shell">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {post.date} / {post.category}
              </p>
              <h2 className="mt-8 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
