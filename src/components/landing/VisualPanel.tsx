import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The picture slot on a workflow card: a flat well behind the product widget.
 * (It used to draw a dither gradient and an ASCII reveal; both went with
 * ubik-design DESIGN.md §7, which rules out dither and ASCII art.)
 */
export function VisualPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("relative overflow-hidden bg-secondary/30 p-3", className)}>{children}</div>;
}
