import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DotmSquare1 } from "@/components/ui/dotm-square-1";
import { MatrixField } from "@/components/landing/MatrixField";
import { SourceLogoTile } from "@/components/landing/SourceLogoTile";
import { liveQueueRows, queueActions } from "@/lib/landing-content";
import { usePrefersReducedMotion } from "@/lib/dotmatrix-hooks";
import { cn } from "@/lib/utils";

const appLogoMap: Record<
  string,
  { logo: "excel" | "gmail" | "microsoft" | "salesforce" | "fallback"; meta: string; logoPath?: string; wordmarkOnly?: boolean }
> = {
  Gmail: { logo: "gmail", meta: "Gmail" },
  Salesforce: { logo: "salesforce", meta: "SF" },
  Microsoft: { logo: "microsoft", meta: "MS" },
  Oracle: { logo: "fallback", meta: "OR", logoPath: "/integrations/oracle.svg" },
  "Power BI": { logo: "microsoft", meta: "BI", logoPath: "/integrations/power-bi.svg" },
  Zoho: { logo: "fallback", meta: "Zoho", logoPath: "/integrations/zoho-logo-512.png" }
};

function getAccountingApp() {
  const language = typeof navigator !== "undefined" ? navigator.language : "";
  const languages = typeof navigator !== "undefined" ? navigator.languages.join(" ") : "";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const regionSource = `${language} ${languages} ${timeZone}`.toLowerCase();
  const europeanRegions = [
    "-at",
    "-be",
    "-ch",
    "-de",
    "-dk",
    "-es",
    "-fi",
    "-fr",
    "-gb",
    "-ie",
    "-it",
    "-nl",
    "-no",
    "-pl",
    "-pt",
    "-se",
    "europe/"
  ];

  if (regionSource.includes("-in") || regionSource.includes("asia/kolkata") || regionSource.includes("calcutta")) {
    return {
      label: "Tally",
      logo: "fallback" as const,
      meta: "Tally",
      logoPath: "/integrations/tally logo india.png",
      wordmarkOnly: false
    };
  }

  if (europeanRegions.some((region) => regionSource.includes(region))) {
    return {
      label: "Sage",
      logo: "fallback" as const,
      meta: "Sage",
      logoPath: "/integrations/Sage_logo.png",
      wordmarkOnly: false
    };
  }

  return { label: "Excel", logo: "excel" as const, meta: "Excel", wordmarkOnly: false };
}

export function LiveQueuePreview() {
  const reducedMotion = usePrefersReducedMotion();
  const [accountingApp] = useState(getAccountingApp);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % liveQueueRows.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <Card className="relative overflow-hidden border-primary/25 bg-card shadow-sm">
      <MatrixField variant="subtle" density="low" seed="queue-card" className="opacity-25" />
      <CardHeader className="relative border-b bg-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Live operating queue</CardTitle>
            <CardDescription>Signals spanning inbox, CRM, ERP, BI, and trade docs</CardDescription>
          </div>
          <DotmSquare1 size={34} dotSize={4} aria-label="Queue sweep" />
        </div>
      </CardHeader>
      <CardContent className="relative grid gap-px bg-border p-px">
        {liveQueueRows.map((row, index) => {
          const active = index === activeIndex;
          const action = active ? queueActions[activeIndex % queueActions.length] : row.status;

          return (
            <div
              key={row.title}
              className={cn(
                "grid gap-3 p-4 transition-colors duration-500 sm:grid-cols-[1fr_auto] sm:items-center",
                active ? "queue-row-active bg-primary text-primary-foreground" : "bg-card"
              )}
            >
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  {row.apps.map((app) => {
                    const logo = app === "Accounting" ? accountingApp : appLogoMap[app] ?? { logo: "fallback" as const, meta: app };
                    const label = app === "Accounting" ? accountingApp.label : app;
                    return (
                      <SourceLogoTile
                        key={app}
                        label={label}
                        logo={logo.logo}
                        meta={logo.meta}
                        logoPath={logo.logoPath}
                        compact
                        active={active}
                        wordmarkOnly={logo.wordmarkOnly}
                      />
                    );
                  })}
                </div>
                <p className="font-medium">{row.title}</p>
                <p className={cn("text-sm", active ? "text-primary-foreground" : "text-muted-foreground")}>{row.copy}</p>
              </div>
              <Badge variant={active ? "secondary" : "outline"}>{action}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
