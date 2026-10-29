import { useEffect, useRef, useState, type ReactNode } from "react";
import { AsciiSkeleton } from "@/components/landing/motion/AsciiReveal";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const CELL = 4;

/**
 * An ordered-dither gradient in the action blue: dense at the bottom-right,
 * thinning to nothing at the top-left, drawn once per size (no animation).
 * The colour comes from the canvas's own CSS colour so it follows the theme.
 */
function DitherField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas).color;
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Distance from the top-left corner, eased, is the tone to dither.
          const tone = Math.pow((x / cols) * 0.45 + (y / rows) * 0.55, 1.8) * 0.85;
          if (tone * 16 > BAYER[(y % 4) * 4 + (x % 4)]) ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
        }
      }
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full text-primary/30 dark:text-primary/40", className)} />;
}

/**
 * The picture slot on a workflow card: a dither gradient behind the product
 * widget, and an ASCII field over it that dissolves from the centre when the
 * card scrolls into view, the way a loading state resolves into content.
 * `art` puts that workflow's ASCII mascot in the middle of the field.
 */
export function DitherPanel({ children, art, className }: { children: ReactNode; art?: string[]; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  // Once the reveal has played, the widget grows into the panel's padding so
  // nothing in it is clipped; the dither stays as the loading frame only.
  // The panel keeps its height, so the card below does not jump.
  const [settled, setSettled] = useState<number | null>(null);
  useEffect(() => {
    if (!inView) return;
    const timer = window.setTimeout(() => setSettled(ref.current?.offsetHeight ?? null), art ? 1500 : 1200);
    return () => window.clearTimeout(timer);
  }, [inView, art, ref]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden border-b border-border bg-secondary/30 p-3 transition-[padding] duration-500 ease-out", className, settled && "!p-0")} style={settled ? { height: settled } : undefined}>
      <DitherField className={cn("transition-opacity duration-500", settled !== null && "opacity-0")} />
      <div className={cn("relative", settled && "h-full [&>*:first-child]:!h-full [&>*:first-child]:!rounded-none [&>*:first-child]:!border-0 [&>*:first-child]:!shadow-none")}>
        {children}
        <AsciiSkeleton active={inView} cols={32} rows={14} art={art} className="rounded-lg" />
      </div>
    </div>
  );
}
