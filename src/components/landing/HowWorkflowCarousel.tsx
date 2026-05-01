import { useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DotmSquare1 } from "@/components/ui/dotm-square-1";
import { MatrixField } from "@/components/landing/MatrixField";
import { usePrefersReducedMotion } from "@/lib/dotmatrix-hooks";
import { howWorkflows } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

type HowWorkflowCarouselProps = {
  compact?: boolean;
};

type Workflow = (typeof howWorkflows)[number];

function WorkflowMedia({ workflow, compact }: { workflow: Workflow; compact: boolean }) {
  const reducedMotion = usePrefersReducedMotion();
  const showControls = reducedMotion || !compact;

  return (
    <div className="mt-6 grid gap-3">
      <div className="aspect-video overflow-hidden border border-border bg-background">
        {workflow.media.type === "video" ? (
          <video
            key={workflow.media.src}
            className="size-full object-cover"
            src={workflow.media.src}
            poster={workflow.media.poster}
            muted
            loop={!reducedMotion}
            autoPlay={!reducedMotion}
            playsInline
            preload="metadata"
            controls={showControls}
            aria-label={workflow.media.alt}
          />
        ) : (
          <img className="size-full object-contain" src={workflow.media.src} alt={workflow.media.alt} loading="lazy" />
        )}
      </div>
      {"secondaryMedia" in workflow && workflow.secondaryMedia && !compact ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {workflow.secondaryMedia.map((item) => (
            <div key={item.src} className="aspect-video overflow-hidden border border-border bg-background">
              <img className="size-full object-cover object-top" src={item.src} alt={item.alt} loading="lazy" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HowWorkflowCarousel({ compact = false }: HowWorkflowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const workflows = compact
    ? howWorkflows.filter((workflow) => ["Operator home", "Inbox to reviewed action", "VMI exception"].includes(workflow.title))
    : howWorkflows;
  const active = workflows[activeIndex] ?? workflows[0];

  return (
    <div className={cn("relative overflow-hidden border bg-card", compact ? "p-4" : "p-5 sm:p-6")}>
      <MatrixField variant="subtle" density="low" seed={`workflow-${active.title}`} className="opacity-35" />
      <div className="relative z-10 grid gap-px bg-border lg:grid-cols-[0.74fr_1.2fr_0.86fr]">
        <section className="bg-card p-5">
          <p className="section-label">Workflow shown</p>
          <div className="mt-5 flex flex-col gap-2">
            {workflows.map((workflow, index) => (
              <button
                key={workflow.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "border p-3 text-left transition-colors",
                  index === activeIndex ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-shell"
                )}
              >
                <span className="block text-xs uppercase tracking-[0.14em] opacity-70">{workflow.eyebrow}</span>
                <span className="mt-1 block font-semibold">{workflow.title}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="relative min-h-[18rem] bg-shell p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Product journey</p>
              <h3 className="mt-2 text-2xl font-semibold">{active.title}</h3>
            </div>
            <DotmSquare1 size={34} dotSize={4} aria-label="Product media accent" />
          </div>
          <WorkflowMedia workflow={active} compact={compact} />
        </section>

        <section className="bg-card p-5">
          <p className="section-label">Review loop</p>
          <h3 className="mt-2 text-xl font-semibold">{active.outcome}</h3>
          <div className="mt-6 grid gap-px bg-border">
            {active.steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 bg-background p-3">
                <span className="text-xs text-primary">0{index + 1}</span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
          {!compact ? (
            <Button asChild className="mt-6">
              <a href="mailto:shubhranshu@solarpunk.technology?subject=Ubik%20workflow%20walkthrough">
                Automate my workflows <ArrowRightIcon data-icon="inline-end" />
              </a>
            </Button>
          ) : null}
        </section>
      </div>
    </div>
  );
}
