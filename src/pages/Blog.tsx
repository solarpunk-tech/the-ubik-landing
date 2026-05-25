import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SealCheckIcon,
  WarningDiamondIcon
} from "@phosphor-icons/react";
import { AiMonitorLayerArticle } from "@/components/blog/AiMonitorLayerVisuals";
import { MarginLeakArticle } from "@/components/blog/MarginLeakVisuals";
import { DecisionTreeTable, OriginFlowMap, OriginPortraitRail, TariffDifferentialMatrix } from "@/components/blog/OriginRouletteVisuals";
import { PageShell } from "@/components/landing/PageShell";
import { SharePostPanel } from "@/components/landing/SharePostPanel";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { aiMonitorPost, blogPosts, getBlogPostBySlug, marginLeakPost, originRoulettePost, type BlogPost } from "@/lib/blog";
import { sourceNotes } from "@/lib/blog/origin-roulette";

type ArticleShellProps = {
  post: BlogPost;
  children: React.ReactNode;
};

const asymmetricBets = [
  {
    title: "India cooked 21/25 for EU retail beats Ecuadorian HLSO on margin",
    copy:
      "The India-EU tariff path and value-added processing depth create a better net-back story than raw HLSO. The risk is not the thesis; it is processor-level residue control and backup qualification."
  },
  {
    title: "Indonesia is the convex U.S. diversifier if certification holds",
    copy:
      "If radiation certification, residue discipline, and ADD review outcomes stay clean, Indonesia can undercut Ecuador on certain U.S. HLSO books. Position it as a small tranche, not the core book."
  },
  {
    title: "30-count vs 60-count decides India vs Ecuador",
    copy:
      "For large 30-count raw material, Ecuador’s farm-gate advantage can be decisive when the India-Ecuador gap closes. On 60-count, the gap is tighter, so India can still compete when processors protect margin through forex, cooked yield, and value-added conversion."
  }
];

const tripwires = [
  {
    title: "Disease risk to watch",
    copy:
      "Indonesia’s Java and Lampung recovery remains fragile, while Ecuador’s seasonal dry-to-rainy transition keeps Vibrio and WSSV on the stocking-density watchlist."
  },
  {
    title: "Regulatory tripwire",
    copy:
      "IEEPA-style tariff suspensions, ADD/CVD reviews, and EU forced-labour readiness can change landed cost faster than farm-gate price moves."
  },
  {
    title: "Where Vietnam re-export rules bite",
    copy:
      "HS 1605 entries need raw-material traceability, not only processing-country paperwork. The exact document set depends on whether the input is wild-caught or farmed."
  }
];

const wisdomChecks = [
  {
    claim: "Ecuador will keep undercutting India on price.",
    answer:
      "True for HLSO, weaker for cooked. Ecuador keeps the raw-material cost edge, but India’s cooked and breaded processing depth plus the EU FTA path changes the landed-cost math."
  },
  {
    claim: "The U.S. stays the highest-margin shrimp market.",
    answer:
      "Still true in some foodservice windows, but less automatic. Tariffs, cash deposits, and weaker U.S. import demand make EU cooked programs newly competitive."
  },
  {
    claim: "Vietnam’s IUU yellow card does not matter for shrimp.",
    answer:
      "It matters commercially for seafood-risk perception and wild-caught or processed wild inputs. For farmed vannamei, the tighter issues are residue control, establishment approvals, and raw-material traceability."
  }
];

function ArticleShell({ post, children }: ArticleShellProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.date,
    dateModified: post.updated,
    author: {
      "@type": "Organization",
      name: post.author
    },
    publisher: {
      "@type": "Organization",
      name: "Ubik",
      url: "https://theubik.com"
    },
    mainEntityOfPage: post.canonical,
    url: post.canonical,
    image: post.ogImage
  };

  return (
    <PageShell>
      <Seo
        title={`${post.seoTitle} — Ubik Trade Notes`}
        description={post.seoDescription}
        canonical={post.canonical}
        image={post.ogImage}
        type="article"
      />
      <JsonLd data={jsonLd} />
      <main className="container-page section-y">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon aria-hidden /> Trade Notes
        </Link>
        <article className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_16rem] xl:items-start">
          <div className="min-w-0">
            <header className="max-w-4xl">
              <p className="section-label">
                {post.date} / {post.category}
              </p>
              <h1 className="mt-4 text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">{post.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <span>Last updated {post.updated}</span>
                <span>/</span>
                <span>{post.author}</span>
                <span>/</span>
                <span>{post.readingTime}</span>
              </div>
            </header>
            {post.heroLightImage && post.heroDarkImage ? (
              <figure className="mt-10 aspect-[16/9] overflow-hidden border bg-shell sm:aspect-[2/1]">
                <img src={post.heroLightImage} alt="" className="h-full w-full object-cover dark:hidden" />
                <img src={post.heroDarkImage} alt="" className="hidden h-full w-full object-cover dark:block" />
              </figure>
            ) : null}
            {children}
          </div>
          <aside className="xl:sticky xl:top-24 xl:justify-self-start">
            <SharePostPanel title={post.title} url={post.canonical} />
          </aside>
        </article>
      </main>
    </PageShell>
  );
}

function ArticleSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t py-8 sm:py-10">
      <h2 className="text-3xl font-semibold">{title}</h2>
      <div className="mt-5 grid gap-4 text-base leading-8 text-muted-foreground">{children}</div>
    </section>
  );
}

function TemplatePlaceholder({ template }: { template: BlogPost["template"] }) {
  return (
    <div className="mt-10 border bg-card p-6">
      <p className="section-label">Template reserved</p>
      <h2 className="mt-3 text-3xl font-semibold">
        {template === "workflow" ? "Workflow article template" : template === "founder-thesis" ? "Founder thesis template" : "Market intelligence template"}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
        This renderer is kept for the next researched Trade Note. It preserves the article chrome, metadata, share flow, and responsive layout without shipping placeholder copy publicly.
      </p>
    </div>
  );
}

function OriginRouletteArticle() {
  return (
    <div className="mt-10 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8">
      <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-px bg-border lg:grid-cols-[0.86fr_1.14fr]">
        <div className="min-w-0 bg-card p-5 sm:p-6">
          <p className="section-label">Trade-desk note / 7 May 2026</p>
          <h2 className="mt-5 text-3xl font-semibold">Buyer strategy for Q3 2026 and Q1 2027 books.</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Fifteen months ago, the shrimp desk carried three assumptions: the U.S. would take every kilo, Ecuador’s cost edge would narrow, and value-added processing was a side quest. All three broke. The origin mix now turns on tariff gates, certification depth, disease windows, and which product can clear the destination at the lowest landed cost with the least forward-book risk.
          </p>
        </div>
        <div className="grid min-w-0 bg-background p-5 sm:p-6">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-px bg-border sm:grid-cols-3">
            {[
              ["~6 Million MT", "Rabobank estimate for 2025 farmed shrimp output, cited by FAO"],
              ["231,804 MT", "Ecuador to U.S. 2025 volume"],
              ["0% base", "Raw 0306.17 MFN duty; not the same as all-in landed duty"]
            ].map(([stat, label]) => (
              <div key={stat} className="bg-card p-4">
                <p className="font-mono text-2xl text-primary">{stat}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border bg-shell p-4 text-sm leading-6 text-muted-foreground">
            The buyer question is no longer “is there enough shrimp?” It is “which shrimp clears the regulatory gate, keeps the landed-cost curve sane, and does not trap the book in one origin’s policy risk?”
          </div>
        </div>
      </section>

      <ArticleSection id="cold-open" title="What changed since January 2025">
        <p>
          India’s “U.S. shock” forced a real pivot. Exports diversified toward Vietnam, China, and Europe while farmers consolidated after the late-2025 price crash. The February 2026 U.S.-India reset lowered the reciprocal tariff pressure, but it did not erase the memory of a book that can become uneconomic overnight.
        </p>
        <p>
          Ecuador converted the disruption into structural share. Its cost base still makes it the HLSO anchor, but China’s domestic production and inventory cycles increasingly decide whether Ecuadorian surplus stays absorbed or hits the U.S. and EU spot market.
        </p>
        <p>
          Certification moved from nice-to-have to table stakes. BAP, ASC, antibiotic-free discipline, SIMP traceability, establishment approvals, import certification, forced-labour readiness, and CATCH/Annex IV where wild-caught inputs are involved are now commercial variables, not compliance footnotes.
        </p>
        <p>
          The U.S. tariff read now needs a stack, not a single country number. Base MFN duty for many raw frozen shrimp lines is 0%, but temporary surcharge treatment, trade-framework implementation, AD/CVD cash deposits, China Section 301 exposure, and product carveouts can still change the cash cost at entry.
        </p>
      </ArticleSection>

      <OriginPortraitRail />

      <ArticleSection id="origin-map" title="Country-by-country origin map">
        <p>
          Ecuador and India are the two anchors, but for different reasons. Ecuador wins raw HLSO landed cost; India is the swing bet in cooked & value added products where tariff treatment and processing depth matter more than pond cost alone.
        </p>
        <p>
          Vietnam remains the processing desk’s best friend and the compliance desk’s hardest conversation. Indonesia is a small convexity tranche if radiation certification and residue controls keep holding. Thailand is premium processing with labour scrutiny. China is the demand-side price floor. Saudi Arabia and Bangladesh are optionality, not base load.
        </p>
      </ArticleSection>

      <OriginFlowMap />
      <TariffDifferentialMatrix />
      <DecisionTreeTable />

      <ArticleSection id="decision-rule" title="The decision rule">
        <p>
          For Q3 2026 spot, tariffs and landed cost dominate. Ecuador and India carry most of the book, with Indonesia used only as a certified diversifier and Vietnam reserved for processing-heavy lines.
        </p>
        <p>
          For Q1 2027 forward books, the discriminator shifts to regulatory trajectory. Establishment approvals, residue control, SIMP expansion, forced-labour readiness, AD/CVD reviews, and CATCH or Annex IV documentation where wild-caught inputs are involved matter more than a temporary spot discount.
        </p>
      </ArticleSection>

      <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-px bg-border lg:grid-cols-3">
        {asymmetricBets.map((bet, index) => (
          <div key={bet.title} className="bg-card p-5 sm:p-6">
            <p className="font-mono text-sm text-primary">BET 0{index + 1}</p>
            <h2 className="mt-6 text-2xl font-semibold">{bet.title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{bet.copy}</p>
          </div>
        ))}
      </section>

      <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-px bg-border lg:grid-cols-3">
        {tripwires.map(({ title, copy }) => (
          <div key={title} className="bg-background p-5 sm:p-6">
            <WarningDiamondIcon className="text-primary" size={24} aria-hidden />
            <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </section>

      <ArticleSection id="pressure-test" title="Pressure-testing conventional wisdom">
        <div className="grid gap-4">
          {wisdomChecks.map(({ claim, answer }) => (
            <div key={claim} className="border bg-card p-5">
              <div className="flex gap-3">
                <CheckCircleIcon className="mt-1 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-xl font-semibold">{claim}</h3>
                  <p className="mt-3 text-base leading-8 text-muted-foreground">{answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ArticleSection>

      <section id="sources" className="scroll-mt-24 border bg-shell p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <SealCheckIcon className="text-primary" aria-hidden />
          <p className="section-label">Source and limitation note</p>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
          This note is a buyer-strategy synthesis, not legal advice or a live customs ruling. Tariffs, ADD/CVD cash deposits, import alerts, and certification requirements can change without matching the cadence of public trade articles.
        </p>
        <div className="mt-5 grid gap-px bg-border md:grid-cols-2">
          {sourceNotes.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="group grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 bg-background p-4 transition-colors hover:bg-card"
            >
              <span className="relative flex size-10 items-center justify-center border bg-shell">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-primary">{source.faviconLabel}</span>
                <img
                  src={source.favicon}
                  alt=""
                  className="absolute size-5"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              </span>
              <span className="min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">{source.publisher}</span>
                <span className="mt-1 flex items-start gap-2 text-sm font-medium text-foreground">
                  <span className="min-w-0">{source.title}</span>
                  <ArrowRightIcon className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </span>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">{source.note}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArticleBody({ post }: { post: BlogPost }) {
  if (post.slug === aiMonitorPost.slug) {
    return <AiMonitorLayerArticle />;
  }

  if (post.slug === marginLeakPost.slug) {
    return <MarginLeakArticle />;
  }

  if (post.slug === originRoulettePost.slug) {
    return <OriginRouletteArticle />;
  }

  return <TemplatePlaceholder template={post.template} />;
}

function BlogNotFound() {
  return (
    <PageShell>
      <Seo
        title="Trade Note not found — Ubik"
        description="The requested Ubik Trade Note could not be found."
        canonical="https://theubik.com/blog"
      />
      <main className="container-page section-y">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon aria-hidden /> Trade Notes
        </Link>
        <div className="mt-10 max-w-2xl border bg-card p-6">
          <p className="section-label">Missing field note</p>
          <h1 className="mt-4 text-4xl font-semibold">This Trade Note is not published.</h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            The blog route is live, but this slug does not match a published Ubik Trade Note.
          </p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Back to Trade Notes <ArrowRightIcon aria-hidden />
          </Link>
        </div>
      </main>
    </PageShell>
  );
}

export default function Blog() {
  const { slug } = useParams();
  const selected = slug ? getBlogPostBySlug(slug) : null;

  if (slug && !selected) {
    return <BlogNotFound />;
  }

  if (selected) {
    return (
      <ArticleShell post={selected}>
        <ArticleBody post={selected} />
      </ArticleShell>
    );
  }

  return (
    <PageShell>
      <Seo
        title="Ubik Trade Notes"
        description="Buyer strategy notes on perishable operations, shrimp sourcing, reviewed automation, and the operator layer above existing systems."
        canonical="https://theubik.com/blog"
      />
      <main className="container-page section-y">
        <div className="grid gap-px bg-border">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="grid min-h-72 bg-background hover:bg-shell lg:grid-cols-[0.44fr_0.56fr]">
              <div className="p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {post.date} / {post.category}
                </p>
                <h2 className="mt-8 max-w-xl text-3xl font-semibold">{post.title}</h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{post.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Read field note <ArrowRightIcon aria-hidden />
                </span>
              </div>
              {post.heroLightImage && post.heroDarkImage ? (
                <div className="min-h-64 overflow-hidden bg-shell">
                  <img src={post.heroLightImage} alt="" className="h-full min-h-64 w-full object-cover dark:hidden" loading="lazy" />
                  <img src={post.heroDarkImage} alt="" className="hidden h-full min-h-64 w-full object-cover dark:block" loading="lazy" />
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
