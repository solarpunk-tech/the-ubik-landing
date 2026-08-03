import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { MatrixField } from "@/components/landing/MatrixField";
import { TradeNoteBitmatrix } from "@/components/landing/TradeNoteBitmatrix";
import { featuredBlogPost } from "@/lib/landing-content";

export function BlogPreview() {
  const featured = featuredBlogPost;

  return (
    <section id="blog" className="trade-notes-band relative overflow-hidden border-b bg-background py-16 sm:py-20">
      <MatrixField variant="subtle" density="low" seed="trade-notes-band" />
      <div className="container-page relative z-10">
        <Link to={`/blog/${featured.slug}`} className="trade-note-feature group grid border bg-card lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)]">
          <div className="trade-note-copy order-2 flex flex-col justify-between p-6 sm:p-8 lg:order-1">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Trade Notes · operating intelligence</p>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.04] sm:text-5xl">
                Research built for the next trade decision.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-foreground/70">
                Field notes on margin, sourcing, evidence, and AI operations for perishable-trade teams.
              </p>
            </div>
            <div className="mt-10 border-t pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">
                {featured.date} · {featured.category}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-tight">{featured.title}</h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read the field note <ArrowRightIcon aria-hidden />
              </span>
            </div>
          </div>
          <div className="order-1 flex items-center justify-center overflow-hidden border-b bg-shell p-4 sm:p-6 lg:order-2 lg:border-b-0 lg:border-l">
            <div className="trade-note-illustration-frame aspect-square w-full max-w-[16rem] p-2 sm:p-3">
              <TradeNoteBitmatrix variant="drift" className="h-full w-full" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
