import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { HowWorkflowCarousel } from "@/components/landing/HowWorkflowCarousel";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

export default function HowItWorks() {
  return (
    <PageShell>
      <Seo
        title="How Ubik works — Source signals to reviewed action"
        description="See how Ubik captures work signals, assembles context, and prepares reviewed actions without replacing your systems."
      />
      <main className="overflow-hidden">
        <section className="relative border-b">
          <MatrixField variant="hero" density="high" seed="how-it-works-page" />
          <div className="container-page section-y relative z-10 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <div>
              <p className="section-label">How it works</p>
              <h1 className="mt-4 text-5xl font-semibold leading-[1.02] sm:text-6xl">
                From scattered work signals to one reviewed move.
              </h1>
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <p className="text-lg leading-8 text-muted-foreground">
                Ubik watches authorized systems, builds a context packet, and keeps a human review point before the handoff.
              </p>
              <Button asChild className="mt-6">
                <Link to="/try">
                  Pick a workflow <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container-page section-y">
          <HowWorkflowCarousel />
        </section>
      </main>
    </PageShell>
  );
}
