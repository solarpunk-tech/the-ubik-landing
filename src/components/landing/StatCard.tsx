import { BlueLattice } from "./BlueLattice";
import { CountUp } from "./CountUp";

/** A stat card: the figure counts up over a lattice of blue dots that parts around the pointer. */
export function StatCard({ label, value, note }: { label: string; value: string; note: string; seed?: number }) {
  return (
    <BlueLattice edge="right" className="flex min-h-[11rem] flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:min-h-[15rem] md:p-8">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div>
        <p className="-ml-0.5 text-5xl font-bold leading-none tracking-tight tabular-nums text-foreground sm:text-6xl">
          <CountUp value={value} />
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{note}</p>
      </div>
    </BlueLattice>
  );
}
