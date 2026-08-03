import { ArrowRightIcon, BookOpenIcon, PlayIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HowWorkflowCarousel } from "@/components/landing/HowWorkflowCarousel";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";
import { externalLinks } from "@/lib/links";

export default function HowItWorks() {
  const [mode, setMode] = useState<"watch" | "read">("watch");

  const readJourneys = [
    {
      label: "01 / Chat + memory",
      title: "Ask across the operation, not just one prompt.",
      copy: "ubik connects the current question to the people, files, meetings, and decisions behind it. The memory layer gives the chat a working ontology before it suggests a move.",
      image: "/prototypes/posters/know-anything-navigation.jpg",
      alt: "ubik trade memory search across meetings, chats, and linked work"
    },
    {
      label: "02 / Inbox",
      title: "Turn a thread into a reviewed next move.",
      copy: "Buyer and supplier email becomes a decision surface: what changed, what is at risk, who owns it, and whether ubik should draft a reply, create a task, or wait for approval.",
      image: "/prototypes/posters/inbox-navigation.jpg",
      alt: "ubik inbox review surface showing a rate confirmation requiring approval"
    },
    {
      label: "03 / Tasks",
      title: "Keep the follow-up owned until it is done.",
      copy: "Tasks carry the source context, due date, owner, and decision trail. The work can move from a personal queue to a team handoff without losing why it exists.",
      image: "/prototypes/posters/home-task-nav.jpg",
      alt: "ubik operator home showing tasks and the operating queue"
    }
  ];

  return (
    <PageShell>
      <Seo
        title="Learn ubik | Decision intelligence for perishable trade"
        description="Learn how ubik helps perishable food importers and exporters connect memory, decision-making, chat, inbox, and tasks."
      />
      <main className="overflow-hidden">
        <section className="branded-page-hero relative border-b">
          <MatrixField variant="hero" density="medium" seed="how-it-works-page" />
          <div className="container-page section-y relative z-10 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <p className="section-label">Learn / the operator layer</p>
              <h1 className="mt-4 text-5xl font-semibold leading-[1.02] sm:text-6xl">
                How ubik helps perishable food operators make the next decision.
              </h1>
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <p className="text-lg leading-8 text-primary-foreground/84">
                Importers and exporters already have systems of record. ubik adds the memory, ontology, and decision layer that helps teams move from scattered signals to reviewed action.
              </p>
              <Button asChild className="mt-6">
                <a href={externalLinks.app}>
                  Try ubik Now <ArrowRightIcon data-icon="inline-end" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="container-page section-y">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">Choose your pace</p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">See the idea, then inspect the work.</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-foreground/72 dark:text-foreground/82">
                  Watch a short product journey or read the smaller operating pattern behind it.
                </p>
              </div>
              <div className="flex shrink-0 border" role="tablist" aria-label="Learn format">
                <button type="button" role="tab" aria-selected={mode === "watch"} onClick={() => setMode("watch")} className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ${mode === "watch" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-shell"}`}>
                  <PlayIcon aria-hidden /> Watch
                </button>
                <button type="button" role="tab" aria-selected={mode === "read"} onClick={() => setMode("read")} className={`inline-flex items-center gap-2 border-l px-4 py-2 text-sm font-medium ${mode === "read" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-shell"}`}>
                  <BookOpenIcon aria-hidden /> Read
                </button>
              </div>
            </div>

            {mode === "watch" ? (
              <div className="mt-8">
                <HowWorkflowCarousel />
                <p className="mt-4 text-sm leading-6 text-foreground/60 dark:text-foreground/72">Video placeholders are ready for the recorded process walkthroughs. We will replace the current prototype clips as each journey is finalized.</p>
              </div>
            ) : (
              <div className="mt-8 grid gap-px bg-border sm:grid-cols-3">
                {readJourneys.map((journey) => (
                  <article key={journey.label} className="bg-card p-4 sm:p-5">
                    <div className="aspect-square overflow-hidden border bg-shell">
                      <img src={journey.image} alt={journey.alt} loading="lazy" className="size-full object-cover" />
                    </div>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">{journey.label}</p>
                    <h3 className="mt-3 text-xl font-semibold leading-tight">{journey.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{journey.copy}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-px bg-border sm:grid-cols-3">
            {[
              ["01", "Memory + ontology", "ubik builds a usable operating picture before chat or automation makes a recommendation."],
              ["02", "Decision making", "The system routes evidence, ownership, and review instead of producing another orphan answer."],
              ["03", "Connected work", "Inbox, Tasks, apps, integrations, and workflows become the surfaces where decisions get finished."],
            ].map(([number, title, copy]) => (
              <div key={number} className="bg-background p-5">
                <p className="font-mono text-xs text-primary">{number}</p>
                <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
