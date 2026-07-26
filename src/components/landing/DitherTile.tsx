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
 * Static by design: one draw at mount and on resize, no animation loop. A 4x4
 * Bayer matrix rather than the hero's 8x8 — at card scale the coarser matrix
 * keeps the squares large enough to read.
 */
export function DitherTile({ scene, className }: { scene: keyof typeof deployScenes; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = deployScenes[scene];
    if (!draw) return;

    let frame = 0;

    function render() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;

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
      draw(bctx, rect.width, rect.height);
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
      ctx.fillStyle = primary ? `hsl(${primary})` : "#315CF4";

      const { data } = bctx.getImageData(0, 0, cols, rows);
      const solid = new Path2D();
      const soft = new Path2D();
      for (let gy = 0; gy < rows; gy += 1) {
        for (let gx = 0; gx < cols; gx += 1) {
          const i = (gy * cols + gx) * 4;
          const luma = 1 - (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          if (luma <= 0.03) continue;
          if (luma < BAYER_4[gy & 3][gx & 3]) continue;
          const size = cell * (0.5 + luma * 0.42);
          const x = Math.round(gx * cell + (cell - size) / 2) + 0.5;
          const y = Math.round(gy * cell + (cell - size) / 2) + 0.5;
          if (luma > 0.6) solid.rect(x, y, size, size);
          else soft.rect(x, y, size, size);
        }
      }
      ctx.globalAlpha = 0.35;
      ctx.fill(soft);
      ctx.globalAlpha = 0.95;
      ctx.fill(solid);
      ctx.globalAlpha = 1;
    }

    render();

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    });
    observer.observe(canvas);

    // Re-render on theme flip so the squares pick up the new brand colour.
    const themeObserver = new MutationObserver(render);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [scene]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
