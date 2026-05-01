import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { blogPosts } from "@/lib/landing-content";

export function BlogPreview() {
  const featured = blogPosts[0];

  return (
    <section id="blog" className="border-b bg-background">
      <div className="container-page section-y grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="section-label">Journal</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Notes on perishable work, systems, and reviewed automation.
          </h2>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Read the journal <ArrowRightIcon aria-hidden />
          </Link>
        </div>
        <div className="grid gap-px bg-border">
          {blogPosts.slice(0, 2).map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="grid gap-3 bg-card p-5 hover:bg-shell">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {post.date} / {post.category}
              </p>
              <h3 className="text-2xl font-semibold">{post.title}</h3>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
          <Link to={`/blog/${featured.slug}`} className="bg-card p-5 text-sm font-medium text-primary hover:bg-shell">
            Open latest field note <ArrowRightIcon className="ml-2 inline" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
