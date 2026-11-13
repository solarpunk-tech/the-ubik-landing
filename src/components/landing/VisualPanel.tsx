import type { ReactNode } from "react";
import { BlueLattice } from "@/components/landing/BlueLattice";
import { cn } from "@/lib/utils";

/**
 * The picture slot on a workflow card: the product widget with a lattice of
 * blue dots gathered behind it at the bottom, so the text below stays clear.
 */
export function VisualPanel({ children, className, lattice = false }: { children: ReactNode; className?: string; lattice?: boolean }) {
  if (!lattice) return <div className={cn("relative isolate overflow-hidden p-3", className)}>{children}</div>;
  return (
    <BlueLattice edge="bottom" className={cn("p-3", className)}>
      {children}
    </BlueLattice>
  );
}
