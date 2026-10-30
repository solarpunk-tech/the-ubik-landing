import { useEffect, useRef } from "react";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

// Density ramp: empty to solid.
const RAMP = " .:-=+*#%@";
const CELL_W = 9;
const CELL_H = 14;

type Ctx = CanvasRenderingContext2D;

/*
 * The three modes of freight as silhouettes, drawn at the character grid's
 * own resolution (one pixel per cell) so reading them back is one
 * getImageData. Alpha is the density: hulls solid, cargo mid, glass light.
 */
function ship(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 34, y);
  ctx.lineTo(x + 31, y + 4);
  ctx.lineTo(x + 3, y + 4);
  ctx.closePath();
  ctx.fill();
  const stacks = [3, 4, 3, 4, 2, 3];
  stacks.forEach((h, i) => {
    ctx.fillStyle = `rgba(0,0,0,${0.45 + (i % 2) * 0.2})`;
    ctx.fillRect(x + 4 + i * 4, y - h, 3.5, h);
  });
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(x + 28, y - 6, 4, 6);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x + 28.5, y - 5, 3, 1);
}

function plane(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,0.95)";
  ctx.beginPath();
  ctx.ellipse(x + 8, y, 8, 1.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.beginPath();
  ctx.moveTo(x + 6, y);
  ctx.lineTo(x + 10, y);
  ctx.lineTo(x + 6, y + 4);
  ctx.lineTo(x + 4, y + 4);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 6, y);
  ctx.lineTo(x + 10, y);
  ctx.lineTo(x + 6, y - 3);
  ctx.lineTo(x + 4, y - 3);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(x + 14.5, y - 2.5, 1.2, 2.5);
}

function truck(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(x, y - 4, 14, 4);
  ctx.fillStyle = "rgba(0,0,0,0.95)";
  ctx.fillRect(x + 14.5, y - 3, 3.5, 3);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(x + 16, y - 2.5, 1.5, 1);
  ctx.fillStyle = "rgba(0,0,0,1)";
  [2, 5, 11, 16].forEach((wx) => ctx.fillRect(x + wx, y, 1.2, 1));
}

function envelope(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(x, y, 14, 6);
  ctx.fillStyle = "rgba(0,0,0,1)";
  for (let i = 0; i <= 7; i++) {
    ctx.fillRect(x + i, y + i * 0.42, 1, 1);
    ctx.fillRect(x + 13 - i, y + i * 0.42, 1, 1);
  }
  ctx.fillRect(x, y, 14, 0.7);
}

function documentPage(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(x, y, 11, 8);
  ctx.fillStyle = "rgba(0,0,0,0.9)";
  ctx.fillRect(x + 2, y + 1, 5, 0.8);
  [3, 4.5, 6].forEach((ly, i) => ctx.fillRect(x + 2, y + ly, i === 2 ? 4 : 7, 0.7));
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(x + 8, y + 5.6, 1.2, 1.2);
}

function bubble(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.roundRect(x, y, 13, 4.5, 1.6);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 2, y + 4.4);
  ctx.lineTo(x + 1, y + 6);
  ctx.lineTo(x + 4.5, y + 4.4);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,1)";
  [4, 6.5, 9].forEach((dx) => ctx.fillRect(x + dx, y + 2, 1, 1));
}

function container(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(x, y, 16, 5);
  ctx.fillStyle = "rgba(0,0,0,0.95)";
  for (let rx = 1; rx < 16; rx += 2) ctx.fillRect(x + rx, y + 0.5, 0.8, 4);
  ctx.fillRect(x, y, 16, 0.6);
}

function pallet(ctx: Ctx, x: number, y: number) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(x, y, 5, 3);
  ctx.fillRect(x + 5.5, y, 5, 3);
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(x + 2.5, y - 3.2, 5.5, 3);
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(x - 0.5, y + 3.2, 11.5, 0.9);
}

type Drawer = (c: Ctx, x: number, y: number) => void;
// Ship, plane and truck carry the freight; the rest is what ubik reads about it.
const FLEET: { draw: Drawer; h: number; lane: number; offset: number; speed: number }[] = [
  { draw: ship, h: 10, lane: 0.56, offset: 0.05, speed: 1 },
  { draw: envelope, h: 6, lane: 0.9, offset: 0.12, speed: 1.35 },
  { draw: container, h: 5, lane: 0.74, offset: 0.3, speed: 1.15 },
  { draw: plane, h: 8, lane: 0.95, offset: 0.48, speed: 1.6 },
  { draw: documentPage, h: 8, lane: 0.6, offset: 0.62, speed: 1.25 },
  { draw: bubble, h: 6, lane: 0.84, offset: 0.78, speed: 1.45 },
  { draw: truck, h: 6, lane: 0.68, offset: 0.92, speed: 1.1 },
  { draw: pallet, h: 6, lane: 0.98, offset: 0.36, speed: 1.3 },
  { draw: documentPage, h: 8, lane: 0.47, offset: 0.4, speed: 0.9 },
  { draw: envelope, h: 6, lane: 0.5, offset: 0.85, speed: 1.05 }
];

/**
 * The hero's background: ships, planes and trucks, and the emails, POs,
 * chats, containers and pallets ubik reads about them, rising through the
 * hero as ASCII in the action blue. They drift up on their own and faster
 * with the scroll, each at its own rate. Faded under the headline so the
 * copy stays clean. Runs only on screen; one still frame under reduced motion.
 */
export function FreightField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0, once: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !inView) return;
    const grid = document.createElement("canvas");
    const g = grid.getContext("2d", { willReadFrequently: true });
    if (!g) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let frame = 0;
    let last = 0;
    let clock = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL_W);
      rows = Math.ceil(height / CELL_H);
      grid.width = cols;
      grid.height = rows;
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      g.clearRect(0, 0, cols, rows);
      // Everything rises: slowly on its own, faster as the page scrolls, each
      // object at its own rate so the field has depth.
      const scale = cols > 110 ? 1.4 : 1;
      const scrolled = window.scrollY / CELL_H;
      const travel = rows + 16 * scale;
      for (const item of FLEET) {
        const rise = (clock * 0.9 + scrolled * 1.6) * item.speed + item.offset * travel;
        const y = rows - (rise % travel);
        const x = cols * item.lane - 8 * scale;
        g.save();
        g.translate(x, y);
        g.scale(scale, scale);
        item.draw(g, 0, 0);
        g.restore();
      }

      const data = g.getImageData(0, 0, cols, rows).data;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas).color;
      ctx.font = `${CELL_H - 2}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const a = data[(y * cols + x) * 4 + 3] / 255;
          if (a < 0.08) continue;
          ctx.fillText(RAMP[Math.min(RAMP.length - 1, Math.round(a * (RAMP.length - 1)))], x * CELL_W, y * CELL_H);
        }
      }
    };

    const loop = (now: number) => {
      // Clamp the step so a backgrounded tab does not jump the fleet across the page.
      clock += Math.min(0.05, last ? (now - last) / 1000 : 0);
      last = now;
      draw();
      frame = requestAnimationFrame(loop);
    };

    resize();
    if (reduced) {
      clock = 18;
      draw();
    } else frame = requestAnimationFrame(loop);
    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [inView]);

  return (
    <div ref={ref} aria-hidden className={cn("freight-field pointer-events-none absolute inset-0", className)}>
      <canvas ref={canvasRef} className="h-full w-full text-primary/60 dark:text-primary-text/55" />
    </div>
  );
}
