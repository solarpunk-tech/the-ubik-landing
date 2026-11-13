import { useEffect, useRef } from "react";
import "./dot-loader.css";

const COLS = 7;
const ROWS = 7;

/** Deterministic 0..1 noise, so the server and the client draw the same grid. */
const noise = (i: number) => {
  const n = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
};

/**
 * Route loader: a 7 by 7 grid of dots that crackles at random and fills from
 * the bottom as the page loads. The fill eases toward 94% and never claims to
 * be done; the page replacing the loader is the finish. No label.
 *
 * It lives in a Suspense fallback, so it is plain DOM and a timer: it touches
 * nothing that is still loading. Reduced motion gets a half-filled, still grid.
 */
export function DotLoader({ label = "Loading page" }: { label?: string }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const dots = Array.from(grid.children) as HTMLElement[];
    // A dot's threshold: low rows fill first, with noise so the fill is ragged.
    const threshold = dots.map((_, i) => {
      const row = Math.floor(i / COLS);
      const fromBottom = (ROWS - 1 - row) / (ROWS - 1);
      return fromBottom * 0.62 + noise(i) * 0.38;
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dots.forEach((dot, i) => dot.classList.toggle("active", threshold[i] < 0.5));
      return;
    }

    let progress = 0;
    const tick = window.setInterval(() => {
      progress += (0.94 - progress) * 0.045;
      dots.forEach((dot, i) => {
        const filled = threshold[i] < progress;
        // Chaos: filled dots drop out and empty ones spark, more of it while the fill is young.
        const jitter = Math.random() < 0.16;
        dot.classList.toggle("active", jitter ? !filled && Math.random() < 0.6 : filled);
      });
    }, 90);
    return () => window.clearInterval(tick);
  }, []);

  return (
    <div ref={gridRef} className="dot-loader" role="status" aria-label={label}>
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}
