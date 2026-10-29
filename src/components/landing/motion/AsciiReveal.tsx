import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const GLYPHS = "#%&*+=-:./\\|<>[]{}01xo";
const noop = () => () => {};
const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Text that decodes into place glyph by glyph once `active` turns true:
 * each character shows noise until its turn, so the layout never moves.
 */
export function DecodeText({ text, active, delay = 0, duration = 700, className }: { text: string; active: boolean; delay?: number; duration?: number; className?: string }) {
  const reducedMotion = Boolean(useReducedMotion());
  // Real text first, so prerendered HTML and no-JS readers get the words.
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (reducedMotion || !active) return;
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - start) / duration));
      const settled = Math.floor(progress * text.length);
      setShown(
        text
          .split("")
          .map((char, index) => (index < settled || char === " " ? char : glyph()))
          .join("")
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, text, delay, duration, reducedMotion]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{reducedMotion ? text : shown}</span>
    </span>
  );
}

/**
 * A field of glyphs laid over a block that dissolves outward from the centre
 * once `active`, the loading state resolving into the real content beneath.
 */
export function AsciiSkeleton({ active, cols = 34, rows = 9, art, className }: { active: boolean; cols?: number; rows?: number; art?: string[]; className?: string }) {
  const reducedMotion = Boolean(useReducedMotion());
  // Only cover the content after hydration, never in the prerendered HTML.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const cells = useMemo(() => {
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    const max = Math.hypot(cx, cy);
    return Array.from({ length: cols * rows }, (_, index) => {
      const x = index % cols;
      const y = Math.floor(index / cols);
      // A mascot drawn in the middle of the field holds while the noise around
      // it clears, then goes last.
      const ax = art ? x - Math.floor((cols - Math.max(...art.map((line) => line.length))) / 2) : -1;
      const ay = art ? y - Math.floor((rows - art.length) / 2) : -1;
      const mascot = art?.[ay]?.[ax];
      if (mascot && mascot !== " ") return { char: mascot, mascot: true, delay: 720 + ((x * 7 + y * 13) % 9) * 30 };
      return { char: glyph(), mascot: false, delay: Math.round((Math.hypot(x - cx, (y - cy) * 2) / max) * 520) };
    });
  }, [cols, rows, art]);
  if (reducedMotion || !mounted) return null;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 grid overflow-hidden rounded-[inherit] bg-card font-mono text-[11px] leading-none text-primary-text/60", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, opacity: active ? 0 : 1, transition: `opacity 200ms linear ${art ? 1100 : 900}ms` }}
    >
      {cells.map((cell, index) => (
        <span
          key={index}
          className={cn("grid place-items-center", cell.mascot && "font-bold text-primary-text")}
          style={{ opacity: active ? 0 : cell.mascot ? 1 : 0.55, transition: `opacity 160ms linear ${cell.delay}ms` }}
        >
          {cell.char}
        </span>
      ))}
    </div>
  );
}
