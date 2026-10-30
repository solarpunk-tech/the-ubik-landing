/**
 * SOC 2 status shield. It says "In progress" because the audit is not done:
 * the site claims certification nowhere, and this badge must not either.
 */
export function SocBadge({ label, className = "h-[74px] w-16" }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 74" role="img" aria-label={`SOC 2 Type II, ${label}`} className={`${className} shrink-0`}>
      <path d="M4 3h56v44L32 71 4 47Z" className="fill-card stroke-border-strong" strokeWidth="2" />
      <text x="32" y="22" textAnchor="middle" className="fill-foreground text-[13px] font-bold">SOC 2</text>
      <text x="32" y="34" textAnchor="middle" className="fill-primary-text text-[8.5px] font-semibold tracking-[0.12em]">TYPE II</text>
      <text x="32" y="46" textAnchor="middle" className="fill-muted-foreground text-[6.5px] font-semibold tracking-[0.08em]">{label.toUpperCase()}</text>
      <rect x="29" y="53" width="6" height="6" className="fill-primary" />
    </svg>
  );
}
