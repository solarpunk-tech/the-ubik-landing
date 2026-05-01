import { useState } from "react";
import { Gmail } from "@/components/ui/svgs/gmail";
import { Microsoft } from "@/components/ui/svgs/microsoft";
import { MicrosoftExcel } from "@/components/ui/svgs/microsoftExcel";
import { Pdf } from "@/components/ui/svgs/pdf";
import { Salesforce } from "@/components/ui/svgs/salesforce";
import { cn } from "@/lib/utils";

type SourceLogoTileProps = {
  label: string;
  logo: "excel" | "gmail" | "microsoft" | "pdf" | "salesforce" | "fallback";
  meta: string;
  logoPath?: string;
  compact?: boolean;
  active?: boolean;
  wordmarkOnly?: boolean;
};

function LogoMark({ logo, meta, logoPath, wordmarkOnly }: Pick<SourceLogoTileProps, "logo" | "meta" | "logoPath" | "wordmarkOnly">) {
  const [assetMissing, setAssetMissing] = useState(false);
  const className = wordmarkOnly ? "h-5 w-full max-w-24 shrink object-contain" : "size-5 shrink-0";

  if (logoPath && !assetMissing) {
    return <img src={logoPath} alt="" className={className} onError={() => setAssetMissing(true)} />;
  }

  if (logo === "gmail") {
    return <Gmail className={className} aria-hidden />;
  }

  if (logo === "excel") {
    return <MicrosoftExcel className={className} aria-hidden />;
  }

  if (logo === "microsoft") {
    return <Microsoft className={className} aria-hidden />;
  }

  if (logo === "pdf") {
    return <Pdf className={className} aria-hidden />;
  }

  if (logo === "salesforce") {
    return <Salesforce className={className} aria-hidden />;
  }

  if (wordmarkOnly) {
    return <span className="block w-full truncate text-center text-sm font-semibold">{meta}</span>;
  }

  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center border border-current/20 text-[9px] font-semibold uppercase">
      {meta.slice(0, 2)}
    </span>
  );
}

export function SourceLogoTile({ label, logo, meta, logoPath, compact = false, active = false, wordmarkOnly = false }: SourceLogoTileProps) {
  if (compact && wordmarkOnly) {
    return (
      <div
        className={cn(
          "inline-flex h-10 min-w-[5.75rem] max-w-[7.5rem] items-center justify-center border px-3",
          active ? "border-primary-foreground/35 bg-primary-foreground text-foreground" : "border-border/70 bg-card shadow-sm"
        )}
        aria-label={label}
      >
        <LogoMark logo={logo} meta={meta} logoPath={logoPath} wordmarkOnly={wordmarkOnly} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 border p-3",
        active ? "border-primary-foreground/20 bg-primary-foreground/12 text-primary-foreground" : "border-border/70 bg-card shadow-sm",
        compact ? "min-w-0 px-2.5 py-2" : "",
      )}
    >
      <LogoMark logo={logo} meta={meta} logoPath={logoPath} wordmarkOnly={wordmarkOnly} />
      <div className="min-w-0">
        <p className={cn("truncate font-medium", compact ? "text-xs" : "text-sm")}>{label}</p>
        {!compact ? <p className="truncate text-xs opacity-70">{meta}</p> : null}
      </div>
    </div>
  );
}
