import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { MatrixField } from "@/components/landing/MatrixField";
import { featuredBlogPost } from "@/lib/landing-content";

export function BlogPreview() {
  const featured = featuredBlogPost;

  return (
    <section id="blog" className="relative border-b bg-background">
      <MatrixField variant="subtle" density="low" seed="blog-band" />
      <div className="container-page section-y relative z-10">
        <Link to="/blog" className="section-label inline-flex items-center gap-2 text-primary">
          Read Trade Notes <ArrowRightIcon aria-hidden />
        </Link>
        <Link to={`/blog/${featured.slug}`} className="mt-5 grid overflow-hidden border bg-card hover:bg-shell">
          {featured.heroLightImage && featured.heroDarkImage ? (
            <div className="aspect-[16/9] overflow-hidden bg-shell">
              <img src={featured.heroLightImage} alt="" className="h-full w-full object-contain dark:hidden" loading="lazy" />
              <img src={featured.heroDarkImage} alt="" className="hidden h-full w-full object-contain dark:block" loading="lazy" />
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
