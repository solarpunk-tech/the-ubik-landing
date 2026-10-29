import { CheckIcon, DatabaseIcon, EnvelopeSimpleIcon, WarningIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type CardCopy = {
  breadcrumb: string[];
  illustrative: string;
  entity: string;
  status: string;
  columns: string[];
  rows: { field: string; po: string; supplier: string; match: boolean }[];
  sourcesLabel: string;
  sources: { kind: "whatsapp" | "erp" | "email"; label: string }[];
  agent: string;
  draftLabel: string;
  draftTo: string;
  draftBody: string;
  owner: string;
  edit: string;
  approve: string;
  footnote: string;
};

const sourceIcon = {
  whatsapp: <WhatsappLogoIcon weight="fill" className="size-3.5 shrink-0 text-[#25D366]" />,
  erp: <DatabaseIcon className="size-3.5 shrink-0 text-primary-text" />,
  email: <EnvelopeSimpleIcon className="size-3.5 shrink-0 text-primary-text" />
};

/** The blue square: the one thing in the system that moves. */
export function LiveSquare({ className }: { className?: string }) {
  return <span aria-hidden className={cn("live-square inline-block size-2 shrink-0 bg-primary", className)} />;
}

/** The lowercase wordmark with its square, as genui's `.ubik-word` draws it. */
export function UbikWord({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-semibold tracking-[-0.02em]", className)}>
      ubik
      <span aria-hidden className="inline-block size-[0.4em] translate-y-[0.1em] bg-primary" />
    </span>
  );
}

/**
 * The homepage's one complete, labelled example, drawn as the product would
 * show it: a buyer's WhatsApp order change against the ERP and the plant's
 * stock, the sources it read, and a drafted reply waiting for a person to approve.
 */
export function SupplierExampleCard() {
  const { t } = useTranslation();
  const card = t("home.hero.card", { returnObjects: true }) as CardCopy;
  return (
    <figure className="home-stage relative pt-6 sm:pb-28">
      <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-2.5">
          <p className="flex min-w-0 items-center gap-1.5 truncate text-[12.5px] text-muted-foreground">
            <UbikWord className="text-foreground" />
            {card.breadcrumb.map((crumb, index) => (
              <span key={crumb} className={cn("truncate", index === card.breadcrumb.length - 1 && "font-medium text-foreground")}>
                <span aria-hidden className="mr-1.5 text-border-strong">/</span>
                {crumb}
              </span>
            ))}
          </p>
          <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[12px] font-medium text-muted-foreground">{card.illustrative}</span>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[12.5px] font-medium tabular-nums">{card.entity}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-support/20 px-2.5 py-0.5 text-[12px] font-medium text-support-text">
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              {card.status}
            </span>
          </div>

          <table className="mt-4 w-full border-separate border-spacing-0 overflow-hidden rounded-lg border border-border text-[13.5px]">
            <thead>
              <tr className="bg-muted/50 text-left text-[12.5px] text-muted-foreground">
                {card.columns.map((column) => (
                  <th key={column} scope="col" className="px-3 py-2 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {card.rows.map((row) => (
                <tr key={row.field} className={row.match ? undefined : "bg-destructive/5"}>
                  <th scope="row" className="border-t border-border px-3 py-2 text-left font-medium">{row.field}</th>
                  <td className="border-t border-border px-3 py-2">{row.po}</td>
                  <td className={cn("border-t border-border px-3 py-2", !row.match && "font-semibold text-destructive")}>
                    <span className="inline-flex items-center gap-1.5">
                      {row.supplier}
                      {row.match ? (
                        <CheckIcon aria-label="Matches" className="text-ok-text" />
                      ) : (
                        <WarningIcon aria-label="Differs" weight="fill" />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px]">
            <span className="text-muted-foreground">{card.sourcesLabel}</span>
            {card.sources.map((source) => (
              <span key={source.label} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-0.5 tabular-nums">
                {sourceIcon[source.kind]}
                {source.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* What ubik is doing right now, in one line. */}
      <div className="absolute left-4 top-0 flex max-w-[85%] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[12.5px] shadow-lg sm:-left-6">
        <LiveSquare />
        <span className="truncate">{card.agent}</span>
      </div>

      {/* The draft, lifted off the record it came from, waiting on a person. */}
      <div className="relative mx-3 -mt-6 rounded-xl border border-border bg-card p-4 shadow-xl sm:absolute sm:bottom-0 sm:left-auto sm:right-[-1rem] sm:mx-0 sm:mt-0 sm:w-[22rem]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12.5px] font-semibold text-primary-text">{card.draftLabel}</p>
          <p className="text-[12px] text-muted-foreground">{card.owner}</p>
        </div>
        <p className="mt-1 text-[12.5px] text-muted-foreground">{card.draftTo}</p>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-5">{card.draftBody}</p>
        <div className="mt-3 flex justify-end gap-2">
          <span className="inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-[13px] font-medium shadow-xs">{card.edit}</span>
          <span className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-xs">{card.approve}</span>
        </div>
      </div>
    </figure>
  );
}
