import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { howWorkflows } from "@/lib/landing-content";
import { externalLinks } from "@/lib/links";
import { cn } from "@/lib/utils";

type HowWorkflowCarouselProps = {
  compact?: boolean;
};

type Workflow = (typeof howWorkflows)[number];

function WorkflowMedia({ workflow, compact }: { workflow: Workflow; compact: boolean }) {
  const reducedMotion = Boolean(useReducedMotion());
  const showControls = reducedMotion || !compact;

  return (
    <div className="workflow-product-media">
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
  );
}

export function HowWorkflowCarousel({ compact = false }: HowWorkflowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());
  const workflows = compact
    ? howWorkflows.filter((workflow) => ["Operator home", "Inbox to reviewed action", "VMI exception"].includes(workflow.title))
    : howWorkflows;
  const active = workflows[activeIndex] ?? workflows[0];

  return (
    <div className="workflow-showcase border border-border bg-shell text-primary-foreground">
      <LayoutGroup id={compact ? "homepage-workflows" : "all-workflows"}>
        <div className="workflow-tabs" role="tablist" aria-label="Product workflows">
          {workflows.map((workflow, index) => (
            <button
              key={workflow.title}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn("workflow-tab", index === activeIndex && "is-active")}
            >
              {index === activeIndex ? (
                <motion.span
                  layoutId="workflow-tab-active"
                  className="workflow-tab-active"
                  transition={{ type: "spring", stiffness: 420, damping: 38 }}
                />
              ) : null}
              <span className="relative z-10 font-mono text-[11px] uppercase">0{index + 1} · {workflow.eyebrow}</span>
              <strong className="relative z-10">{workflow.title}</strong>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.title}
          className="workflow-active-grid"
          initial={reducedMotion ? false : { opacity: 0, clipPath: "inset(0 0 0 8%)", x: 18 }}
          animate={{ opacity: 1, clipPath: "inset(0 0 0 0%)", x: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, clipPath: "inset(0 8% 0 0)", x: -12 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="workflow-copy">
            <p className="font-mono text-[11px] uppercase text-primary-foreground/55">Agent workflow</p>
            <h3>{active.outcome}</h3>
            <ol className="workflow-receipt">
              {active.steps.map((step, index) => (
                <li key={step}>
                  <span>0{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            {!compact ? (
              <Button asChild variant="outline" className="mt-6 border-primary-foreground/70 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <a href={externalLinks.founderMeeting}>
                  Automate my workflows <ArrowRightIcon data-icon="inline-end" />
                </a>
              </Button>
            ) : null}
          </div>
          <WorkflowMedia workflow={active} compact={compact} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
