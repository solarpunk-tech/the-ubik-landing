import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { PageShell } from "@/components/landing/PageShell";
import { SharePostPanel } from "@/components/landing/SharePostPanel";
import { Seo } from "@/components/seo/Seo";
import { blogPosts } from "@/lib/landing-content";

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
              <div className="mt-10 border-y py-8 text-base leading-8">
                <p>
                  This journal entry is a placeholder for the first Ubik field note. The final article can expand this thesis with examples,
                  screenshots, and customer-safe workflow diagrams.
                </p>
              </div>
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
