import { useEffect, useRef } from "react";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

type Gull = { x: number; y: number; z: number; phase: number; rate: number; glide: number; drift: number };

// Seeded so the flock is the same on every visit.
function makeFlock(count: number): Gull[] {
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: count }, (_, index) => {
    // Three loose groups across the sky, each with a nearer and a farther bird.
    const group = index % 3;
    return {
      x: group * 0.36 + rand() * 0.18,
      y: 0.18 + rand() * 0.55,
      z: 0.35 + rand() * 0.65,
      phase: rand() * Math.PI * 2,
      rate: 5.5 + rand() * 3,
      glide: rand() * Math.PI * 2,
      drift: rand() * Math.PI * 2
    };
  });
}

const FRAMES = 16;
const SPRITE = 72; // CSS px per frame, a bird's full span plus margin

/**
 * One gull in the engraving's hand, seen from below as it crosses: each wing
 * a crescent with a bent wrist, hatched like the plate's shading, the
 * primaries inked solid at the tip, a lens of a body with the head forward
 * and a short wedge of tail. Drawn in unit space: the half-span is 1.
 * `flap` runs -1 (wings down) to 1 (wings up).
 */
function drawGull(ctx: CanvasRenderingContext2D, flap: number, ink: string) {
  ctx.fillStyle = ink;
  ctx.strokeStyle = ink;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // The wrist leads the beat and the hand follows it, so the tip lags behind.
  const wristY = -0.08 - 0.3 * flap;
  const tipY = wristY + 0.12 - 0.24 * flap;
  for (const side of [-1, 1]) {
    const leading = new Path2D();
    leading.moveTo(side * 0.07, -0.01);
    leading.quadraticCurveTo(side * 0.24, wristY - 0.08, side * 0.44, wristY);
    leading.quadraticCurveTo(side * 0.74, wristY - 0.05, side * 1.0, tipY);
    const wing = new Path2D(leading);
    wing.quadraticCurveTo(side * 0.76, wristY + 0.12, side * 0.47, wristY + 0.12);
    wing.quadraticCurveTo(side * 0.27, (wristY + 0.12 + 0.07) / 2 + 0.03, side * 0.08, 0.07);
    wing.closePath();
    ctx.save();
    ctx.clip(wing);
    // A pale wash, the plate's hatching across the wing, the primaries inked solid.
    ctx.globalAlpha = 0.14;
    ctx.fill(wing);
    ctx.globalAlpha = 0.65;
    ctx.lineWidth = 0.02;
    for (let h = -1.3; h < 1.3; h += 0.06) {
      ctx.beginPath();
      ctx.moveTo(h, -1);
      ctx.lineTo(h + 0.3, 1);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.95;
    ctx.fillRect(side > 0 ? 0.76 : -1.3, -1.3, 0.54, 2.6);
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 0.045;
    ctx.stroke(leading);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 0.022;
    ctx.stroke(wing);
  }
  ctx.globalAlpha = 1;
  // Tail, body, head: a slim lens with the head forward.
  ctx.beginPath();
  ctx.moveTo(-0.12, 0.03);
  ctx.lineTo(-0.27, 0.0);
  ctx.lineTo(-0.27, 0.075);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0.0, 0.03, 0.15, 0.048, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0.16, 0.01, 0.045, 0, Math.PI * 2);
  ctx.fill();
}

/** The whole flap cycle drawn once into a strip, so each frame of the flock is only image copies. */
function spriteStrip(ink: string, dpr: number) {
  const strip = document.createElement("canvas");
  const px = Math.round(SPRITE * dpr);
  strip.width = px * FRAMES;
  strip.height = px;
  const ctx = strip.getContext("2d");
  if (!ctx) return strip;
  for (let frame = 0; frame < FRAMES; frame++) {
    const flap = Math.sin((frame / FRAMES) * Math.PI * 2);
    ctx.save();
    ctx.translate(frame * px + px / 2, px * 0.55);
    ctx.scale(px * 0.46, px * 0.46);
    drawGull(ctx, flap, ink);
    ctx.restore();
  }
  return strip;
}

/** Gulls crossing the sky over the engraving. Animates only on screen, at 30 fps; one still frame under reduced motion. */
function GullFlock({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flock = makeFlock(13);
    let frame = 0;
    let last = 0;
    let clock = 0;
    let since = 0;
    let ink = "";
    let strip: HTMLCanvasElement | null = null;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strip = null;
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      // The ink follows the theme through the canvas's own CSS colour; redraw the strip when it changes.
      const colour = getComputedStyle(canvas).color;
      if (!strip || colour !== ink) {
        ink = colour;
        strip = spriteStrip(ink, dpr);
      }
      const px = strip.height;
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(1.4, width / 1100);
      for (const gull of flock) {
        // Glide for a stretch, then flap: a glide holds the wings just above level.
        const gliding = Math.max(0, Math.sin(clock * 0.35 + gull.glide));
        const beat = clock * gull.rate * (1 - gliding * 0.9) + gull.phase;
        const cell = gliding > 0.6 ? Math.round(FRAMES * 0.08) : ((Math.floor((beat / (Math.PI * 2)) * FRAMES) % FRAMES) + FRAMES) % FRAMES;
        const span = width + 120;
        const x = ((gull.x * span + clock * (14 + gull.z * 26) * scale) % span) - 60;
        const y = gull.y * height + Math.sin(clock * 0.6 + gull.drift) * 6 * gull.z;
        const size = (16 + gull.z * 26) * Math.max(0.75, scale);
        ctx.globalAlpha = 0.45 + gull.z * 0.5;
        ctx.drawImage(strip, cell * px, 0, px, px, x - size / 2, y - size * 0.55, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      // Clamp the step so a backgrounded tab does not jump the flock across the sky.
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0);
      last = now;
      clock += dt;
      since += dt;
      if (since >= 1 / 30) {
        since = 0;
        draw();
      }
      frame = requestAnimationFrame(loop);
    };

    resize();
    if (reduced) draw();
    else frame = requestAnimationFrame(loop);
    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-x-0 top-0 h-[55%] w-full text-primary dark:text-primary-text" />;
}

/**
 * The footer's illustration: an engraved port panorama. The art is a
 * transparent ink mask (public/footer/port.webp), painted through
 * CSS mask-image in the action blue, so it is the brand colour in both themes
 * with no paper colour of its own. A flock of gulls crosses the sky; it holds
 * still under reduced motion.
 */
export function PortIsland({ className }: { className?: string }) {
  // The mask is ~1.7 MB of engraving, so it is only requested near the footer.
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0 });
  // The flock runs only while the footer is on screen.
  const { ref: skyRef, inView: onScreen } = useInView<HTMLDivElement>({ threshold: 0, once: false });
  return (
    <div ref={ref} role="img" aria-label="An engraved port: container ship, gantry cranes, stacked containers and a harbour town on the hill" className={cn("port-engraving relative w-full", className)}>
      <div className={cn("port-engraving-ink absolute inset-0", inView && "is-loaded")} />
      <div ref={skyRef} className="absolute inset-0">
        <GullFlock active={onScreen} />
      </div>
    </div>
  );
}
