import { useEffect, useRef } from "react";
import { deployScenes } from "@/lib/deploy-scenes";

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
].map((row) => row.map((v) => (v + 0.5) / 16));

/**
 * A small dithered vector cutout, in the same material as the hero field.
 *
 * A 4x4 Bayer matrix rather than the hero's 8x8 keeps the squares large enough
 * to read. While visible, the sampled field receives a very small coherent
 * drift and a handful of deterministic glints. Animation is capped near 30fps
 * and disabled for reduced-motion users.
 */
export function DitherTile({ scene, className }: { scene: keyof typeof deployScenes; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = deployScenes[scene];
    if (!draw) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let resizeFrame = 0;
    let running = false;
    let visible = false;
    let lastPaint = 0;

    function render(now = 0) {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const phase = now / 1000;

      const cell = 5;
      const cols = Math.max(1, Math.floor(rect.width / cell));
      const rows = Math.max(1, Math.floor(rect.height / cell));

      const buffer = document.createElement("canvas");
      buffer.width = cols;
      buffer.height = rows;
      const bctx = buffer.getContext("2d", { willReadFrequently: true });
      if (!bctx) return;
      bctx.fillStyle = "#fff";
      bctx.fillRect(0, 0, cols, rows);
      bctx.save();
      bctx.scale(cols / rect.width, rows / rect.height);
      draw(bctx, rect.width, rect.height, phase);
      bctx.restore();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;

      const ctx = canvas!.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
      const match = primary.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
      const baseColor = primary ? `hsl(${primary})` : "#315CF4";
      const lightColor = match
        ? `hsl(${match[1]} ${match[2]}% ${Math.min(82, Number(match[3]) + 16)}%)`
        : "#8da7ff";

      const { data } = bctx.getImageData(0, 0, cols, rows);
      const solid = new Path2D();
      const soft = new Path2D();
      const sparkles = new Path2D();
      for (let gy = 0; gy < rows; gy += 1) {
        for (let gx = 0; gx < cols; gx += 1) {
          const i = (gy * cols + gx) * 4;
          const luma = 1 - (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          if (luma <= 0.03) continue;
          if (luma < BAYER_4[gy & 3][gx & 3]) continue;
          const seed = gx * 17.17 + gy * 31.31;
          const drift = reduceQuery.matches ? 0 : Math.sin(phase * 0.72 + gx * 0.24 + gy * 0.18) * 0.7;
          const breathe = reduceQuery.matches ? 1 : 1 + Math.sin(phase * 1.15 + seed) * 0.055;
          const size = cell * (0.5 + luma * 0.42) * breathe;
          const x = gx * cell + (cell - size) / 2 + drift;
          const y = gy * cell + (cell - size) / 2 + Math.cos(phase * 0.58 + seed) * drift * 0.45;
          if (luma > 0.6) solid.rect(x, y, size, size);
          else soft.rect(x, y, size, size);

          const glint = Math.sin(phase * 2.4 + seed);
          if (!reduceQuery.matches && luma > 0.45 && glint > 0.965) {
            const sparkleSize = 1.1 + (glint - 0.965) * 34;
            const cx = x + size / 2;
            const cy = y + size / 2;
            sparkles.rect(cx - sparkleSize, cy - 0.6, sparkleSize * 2, 1.2);
            sparkles.rect(cx - 0.6, cy - sparkleSize, 1.2, sparkleSize * 2);
          }
        }
      }
      ctx.fillStyle = lightColor;
      ctx.globalAlpha = 0.35;
      ctx.fill(soft);
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = 0.95;
      ctx.fill(solid);
      ctx.fillStyle = lightColor;
      ctx.globalAlpha = 0.9;
      ctx.fill(sparkles);
      ctx.globalAlpha = 1;
    }

    function tick(now: number) {
      if (!running) return;
      if (now - lastPaint >= 32) {
        render(now);
        lastPaint = now;
      }
      frame = requestAnimationFrame(tick);
    }

    function start() {
      if (running || !visible || reduceQuery.matches) return;
      running = true;
      frame = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function syncMotion() {
      if (visible && !reduceQuery.matches) start();
      else {
        stop();
        render();
      }
    }

    render();

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => render(performance.now()));
    });
    observer.observe(canvas);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncMotion();
      },
      { threshold: 0.12 }
    );
    visibilityObserver.observe(canvas);

    // Re-render on theme flip so the squares pick up the new brand colour.
    const themeObserver = new MutationObserver(() => render(performance.now()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    reduceQuery.addEventListener("change", syncMotion);

    return () => {
      stop();
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      reduceQuery.removeEventListener("change", syncMotion);
    };
  }, [scene]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
