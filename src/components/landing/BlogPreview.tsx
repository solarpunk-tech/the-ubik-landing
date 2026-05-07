import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { blogPosts } from "@/lib/landing-content";

export function BlogPreview() {
  const featured = blogPosts[0];

  return (
    <section id="blog" className="border-b bg-background">
      <div className="container-page section-y">
        <Link to="/blog" className="section-label inline-flex items-center gap-2 text-primary">
          Read Trade Notes <ArrowRightIcon aria-hidden />
        </Link>
        <Link to={`/blog/${featured.slug}`} className="mt-5 grid overflow-hidden border bg-card hover:bg-shell">
          {featured.heroLightImage && featured.heroDarkImage ? (
            <div className="bg-shell">
              <img src={featured.heroLightImage} alt="" className="aspect-[16/7] w-full object-cover dark:hidden" loading="lazy" />
              <img src={featured.heroDarkImage} alt="" className="hidden aspect-[16/7] w-full object-cover dark:block" loading="lazy" />
            </div>
          ) : null}
          <div className="grid gap-px bg-border lg:grid-cols-[0.42fr_0.58fr]">
            <div className="bg-card p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {featured.date} / {featured.category}
              </p>
              <h3 className="mt-6 max-w-xl text-3xl font-semibold">{featured.title}</h3>
            </div>
            <div className="bg-card p-5 sm:p-6">
              <p className="max-w-3xl text-base leading-7 text-muted-foreground">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Open latest field note <ArrowRightIcon aria-hidden />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
