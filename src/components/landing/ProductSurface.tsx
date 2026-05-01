import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DotmCircular5 } from "@/components/ui/dotm-circular-5";
import { DotmCircular4 } from "@/components/ui/dotm-circular-4";
import { DotmSquare6 } from "@/components/ui/dotm-square-6";
import { SourceLogoTile } from "@/components/landing/SourceLogoTile";
import { operatorSignals, reviewedOutputs, sourceSystems } from "@/lib/landing-content";

function StatusPill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "alert" | "success" }) {
  return (
    <Badge
      variant={tone === "default" ? "secondary" : "outline"}
      className={[
        "px-2.5 py-1 text-[11px] font-medium shadow-none",
        tone === "alert" ? "support-chip" : "",
        tone === "success" ? "border-primary/25 bg-primary/5 text-primary" : ""
      ].join(" ")}
    >
      {children}
    </Badge>
  );
}

export function ProductSurface() {
  return (
    <Card className="surface-card overflow-hidden">
      <CardContent className="grid gap-px bg-border p-px lg:grid-cols-[0.86fr_1.14fr_0.9fr]">
        <section className="bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label">Your source systems</p>
              <h3 className="mt-2 text-xl font-semibold">Keep your stack.</h3>
            </div>
            <DotmSquare6 size={32} dotSize={4} aria-label="Source systems scanning" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {sourceSystems.map((system) => (
              <SourceLogoTile key={system.label} label={system.label} logo={system.logo} meta={system.meta} logoPath={system.logoPath} />
            ))}
          </div>
        </section>

        <section className="relative bg-primary p-5 text-primary-foreground">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label text-primary-foreground">Ubik</p>
              <h3 className="mt-2 text-xl font-semibold text-primary-foreground">Trade intelligence personalised.</h3>
              <p className="mt-1 text-sm text-primary-foreground/80">Read, match, prioritize.</p>
            </div>
            <DotmCircular4 size={36} dotSize={5} color="hsl(var(--primary-foreground))" aria-label="Operator layer scanning" />
          </div>
          <div className="mt-5 grid gap-px bg-primary-foreground/20">
            {operatorSignals.map((signal, index) => (
              <div key={signal.label} className={index === 0 ? "bg-primary-foreground p-4 text-primary" : "bg-primary-foreground/10 p-4"}>
                <div className="flex items-start gap-3">
                  <Badge
                    variant={index === 0 ? "secondary" : "outline"}
                    className={
                      index === 0
                        ? "bg-foreground text-background"
                        : "border-primary-foreground/25 text-primary-foreground"
                    }
                  >
                    {signal.label}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium leading-6">{signal.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label">Reviewed output</p>
              <h3 className="mt-2 text-xl font-semibold">Review before it moves.</h3>
            </div>
            <DotmCircular5 size={34} dotSize={4.5} aria-label="Reviewed output sweep" />
          </div>
          <div className="mt-5 grid gap-px bg-border">
            {reviewedOutputs.map((item, index) => (
              <div key={item.label} className="bg-card p-4">
                <div className="flex items-start gap-3">
                  {index < reviewedOutputs.length - 1 ? (
                    <ArrowRightIcon className="mt-1 text-primary" aria-hidden />
                  ) : (
                    <CheckCircleIcon className="mt-1 text-primary" aria-hidden />
                  )}
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusPill tone="alert">Approval required before send</StatusPill>
            <StatusPill tone="success">Systems unchanged</StatusPill>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
