import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const STEP = 5; // px between dot centres, in CSS pixels

/**
 * The wordmark as a halftone of dots: each dot's size is how much of the
 * letter covers that cell, so edges fall off into smaller dots. Dots near the
 * pointer swell and turn blue; one dot in the square after "ubik" is always
 * blue. Redraws on resize and theme change; static under reduced motion.
 */
export function DotWordmark({ text = "ubik", className }: { text?: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: { x: number; y: number; r: number; accent: boolean }[] = [];
    let pointer = { x: -9999, y: -9999 };
    let frame = 0;
    let t = 0;

    const colour = (name: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`;

    const sample = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw the word once off screen, then read its coverage per cell.
      const off = document.createElement("canvas");
      off.width = Math.round(width);
      off.height = Math.round(height);
      const o = off.getContext("2d");
      if (!o) return;
      const size = height * 1.05;
      o.font = `600 ${size}px "IBM Plex Mono", ui-monospace, monospace`;
      o.textBaseline = "alphabetic";
      const textWidth = o.measureText(text).width;
      const square = size * 0.2;
      const total = textWidth + square * 1.6;
      const left = (width - total) / 2;
      const baseline = height * 0.84;
      o.fillStyle = "#000";
      o.fillText(text, left, baseline);
      o.fillRect(left + textWidth + square * 0.45, baseline - square, square, square);
      const squareBox = { x: left + textWidth + square * 0.45, y: baseline - square, s: square };

      const data = o.getImageData(0, 0, off.width, off.height).data;
      dots = [];
      for (let y = STEP / 2; y < off.height; y += STEP) {
        for (let x = STEP / 2; x < off.width; x += STEP) {
          let covered = 0;
          let count = 0;
          for (let dy = -2; dy <= 2; dy += 2) {
            for (let dx = -2; dx <= 2; dx += 2) {
              const px = Math.round(x + dx);
              const py = Math.round(y + dy);
              if (px < 0 || py < 0 || px >= off.width || py >= off.height) continue;
              count += 1;
              if (data[(py * off.width + px) * 4 + 3] > 128) covered += 1;
            }
          }
          if (!covered) continue;
          const accent = x >= squareBox.x && x <= squareBox.x + squareBox.s && y >= squareBox.y && y <= squareBox.y + squareBox.s;
          dots.push({ x, y, r: (STEP / 2) * 0.9 * Math.sqrt(covered / count), accent });
        }
      }
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const ink = colour("--foreground");
      const blue = colour("--primary");
      for (const dot of dots) {
        const d = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
        const near = Math.max(0, 1 - d / 90);
        const wave = reduced ? 0 : 0.12 * Math.sin(t / 700 + dot.x / 60);
        const r = dot.r * (1 + near * 0.55 + wave);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0.4, r), 0, Math.PI * 2);
        ctx.fillStyle = dot.accent || near > 0.35 ? blue : ink;
        ctx.globalAlpha = dot.accent ? 1 : 0.85;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      t = now;
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      sample();
      cancelAnimationFrame(frame);
      if (reduced) draw();
      else frame = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (reduced) draw();
    };
    const onLeave = () => {
      pointer = { x: -9999, y: -9999 };
      if (reduced) draw();
    };

    // Only animate while visible.
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else cancelAnimationFrame(frame);
    });
    visibility.observe(canvas);
    const resize = new ResizeObserver(() => start());
    resize.observe(canvas);
    const theme = new MutationObserver(() => draw());
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    void document.fonts?.ready.then(start);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      theme.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return <canvas ref={canvasRef} aria-hidden className={cn("block w-full", className)} />;
}
