import { useEffect, useRef, useState } from "react";
import { pickScene, type HeroScene } from "@/lib/hero-scenes";

/**
 * The page field.
 *
 * A single fixed, viewport-sized <canvas> that owns every square on the page.
 * A vector scene (lib/hero-scenes) is ordered-dithered into a grid of squares
 * that forms the hero illustration, and from there:
 *
 *   - scrolling detaches the squares and they fall the length of the document,
 *     settling into a drift at the footer
 *   - scroll-up reverses exactly, because every position is a pure function of
 *     scrollY rather than an integrated velocity
 *   - the pointer pushes squares aside anywhere on the page, using swept
 *     segment tests so a fast flick can't tunnel between two samples
 *
 * Positions are kept in *document* space and converted to viewport space at
 * draw time, so the canvas only ever has to be as big as the window no matter
 * how long the page is.
 */

const BAYER_8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
].map((row) => row.map((v) => (v + 0.5) / 64));

type Particle = {
  /** Home, in document coordinates. */
  hx: number;
  hy: number;
  /** Horizontal resting place in the footer drift, document coordinates. */
  sx: number;
  /** Which row of the drift it lands in; resolved against the live footer. */
  settleRow: number;
  /**
   * Journey expressed as fractions of the page's scrollable range rather than
   * absolute pixel offsets. Three carousels on this page swap panels of
   * differing heights every few seconds, which changes document height — and
   * anything pinned to a snapshot of that height drifts a row at a time as the
   * page grows and shrinks underneath it.
   */
  startFrac: number;
  endFrac: number;
  /** Transient pointer displacement. */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  luma: number;
  heat: number;
  /** Stable phase and blue-ramp index for coherent ambient flow. */
  phase: number;
  tone: number;
  /** Survives the in-flight cull — fixed per particle so it never flickers. */
  keep: boolean;
};

type Field = {
  particles: Particle[];
  cell: number;
  /** Refreshed whenever the document resizes, never snapshotted. */
  footerTop: number;
  maxScroll: number;
  buckets: Map<number, Particle[]>;
  bucketSize: number;
  bucketCols: number;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function buildField(
  scene: HeroScene,
  heroTop: number,
  heroW: number,
  heroH: number,
  footerTop: number,
  docH: number,
  viewH: number,
  cell: number
): Field | null {
  const cols = Math.max(1, Math.floor(heroW / cell));
  const rows = Math.max(1, Math.floor(heroH / cell));

  const buffer = document.createElement("canvas");
  buffer.width = cols;
  buffer.height = rows;
  const bctx = buffer.getContext("2d", { willReadFrequently: true });
  if (!bctx) return null;

  bctx.fillStyle = "#fff";
  bctx.fillRect(0, 0, cols, rows);
  bctx.save();
  bctx.scale(cols / heroW, rows / heroH);
  scene.draw(bctx, heroW, heroH);
  bctx.restore();

  const { data } = bctx.getImageData(0, 0, cols, rows);
  const raw: { hx: number; hy: number; luma: number; r1: number; r2: number }[] = [];

  for (let gy = 0; gy < rows; gy += 1) {
    for (let gx = 0; gx < cols; gx += 1) {
      const i = (gy * cols + gx) * 4;
      const luma = 1 - (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      if (luma <= 0.02) continue;
      if (luma < BAYER_8[gy & 7][gx & 7]) continue;
      const seed = (gx * 73856093) ^ (gy * 19349663);
      const r3 = ((seed >>> 2) & 1023) / 1023;

      // Keep the illustration clear of the hero copy. This used to be a CSS
      // mask on the canvas, but the canvas is fixed and full-page, so the mask
      // also cut the settled footer drift in half. Doing it here — as a
      // probabilistic cull that thins toward the copy — gives the same soft
      // edge on the artwork and leaves the rest of the page unmasked.
      const narrow = heroW < 1024;
      const t = narrow
        ? (gy / rows - 0.34) / 0.28   // on one column the copy sits up top
        : (gx / cols - 0.36) / 0.3;   // on two columns it sits left
      if (r3 > Math.min(1, Math.max(0, t))) continue;

      raw.push({
        hx: gx * cell + cell / 2,
        hy: heroTop + gy * cell + cell / 2,
        luma,
        r1: ((seed >>> 8) & 1023) / 1023,
        r2: ((seed >>> 18) & 1023) / 1023
      });
    }
  }

  // Build the drift: a loose grid filled from the bottom up, so arriving
  // squares read as settling into a pile rather than lining up on one row.
  // The pile rests just *above* the footer's top edge and spills a little way
  // into it, so the blue footer reads as the floor they land on.
  // Only the squares that survive the in-flight cull ever reach the floor —
  // the rest dissolve on the way down. That keeps the drift shallow enough to
  // sit against the footer instead of stacking up over the last section.
  // Three rows resting exactly on the footer's top edge: enough to read as
  // settled, shallow enough that it never reaches the footer's links.
  const pileFloor = footerTop;
  const pileRows = 3;
  const pileCols = Math.max(1, Math.floor(heroW / cell));
  const pileCapacity = pileCols * pileRows;

  // Squares nearest the bottom of the hero fall first and land deepest, which
  // keeps the pile filling from the floor upward.
  raw.sort((a, b) => b.hy - a.hy);

  let settleSlot = 0;
  const particles: Particle[] = raw.map((p) => {
    // Survivors settle in arrival order; once the three rows are full the
    // remainder dissolve mid-air rather than piling higher.
    const slot = p.r1 > 0.78 ? settleSlot++ : -1;
    const keep = slot >= 0 && slot < pileCapacity;
    const row = slot < 0 ? 0 : Math.floor(slot / pileCols);
    const col = slot < 0 ? 0 : slot % pileCols;
    const jitter = (p.r2 - 0.5) * cell * 0.9;

    // The fall begins near the end of the hero — late enough that the
    // illustration is never raining over the first body section, early enough
    // that you actually see it let go while the hero is still on screen.
    const maxScroll0 = Math.max(1, docH - viewH);
    const startFrac = Math.min(0.5, (heroH * (0.9 + p.r1 * 0.35)) / maxScroll0);
    const endFrac = Math.min(0.94, Math.max(startFrac + 0.12, 0.58 + p.r2 * 0.34));

    return {
      hx: p.hx,
      hy: p.hy,
      sx: col * cell + cell / 2 + jitter,
      settleRow: row,
      startFrac,
      endFrac,
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      luma: p.luma,
      heat: 0,
      phase: p.r1 * Math.PI * 0.7 + p.hx * 0.006 + p.hy * 0.004,
      tone: Math.min(3, Math.floor((p.luma * 0.58 + p.r1 * 0.2 + p.hx / heroW * 0.22) * 4)),
      // ~22% of the field survives the fall. Enough to read as motion on the
      // way down and to form a drift at the bottom, far too sparse to
      // interfere with the copy it passes over.
      keep
    };
  });

  // Spatial index over *home* positions is useless once things fall, so the
  // buckets are rebuilt against live positions each frame instead — but only
  // for squares currently on screen, which keeps it cheap.
  return {
    particles,
    cell,
    footerTop: pileFloor,
    maxScroll: Math.max(1, docH - viewH),
    buckets: new Map(),
    bucketSize: cell * 4,
    bucketCols: Math.ceil(heroW / (cell * 4)) + 2
  };
}

/**
 * `scene` is passed in so the hero headline can describe the artwork on screen.
 * Index owns the pick; the local fallback keeps the component usable on its own.
 */
export function ParticleField({ scene: sceneProp }: { scene?: HeroScene } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [fallbackScene] = useState<HeroScene>(() => pickScene());
  const scene = sceneProp ?? fallbackScene;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");

    let field: Field | null = null;
    let raf = 0;
    let running = false;
    let dpr = 1;
    let vw = 0;
    let vh = 0;
    let scrollY = 0;
    let lastTick = 0;
    let elapsed = 0;

    // Pointer is tracked in document space so it lines up with the squares.
    let pointer: { x: number; y: number } | null = null;
    let lastPointer: { x: number; y: number } | null = null;
    let pointerIdleAt = 0;

    let inkColors = ["hsl(227 88% 70%)", "hsl(227 84% 62%)", "hsl(227 81% 56%)", "hsl(227 78% 46%)"];
    function readTokens() {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
      const match = v.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
      if (!match) return;
      const hue = Number(match[1]);
      const saturation = Number(match[2]);
      const lightness = Number(match[3]);
      const lightnessSteps = [lightness + 14, lightness + 6, lightness, lightness - 10];
      inkColors = lightnessSteps.map(
        (step, index) =>
          `hsl(${hue} ${Math.max(0, saturation - index * 2)}% ${Math.min(88, Math.max(24, step))}%)`
      );
    }

    function measure() {
      const hero = document.querySelector<HTMLElement>(".home-hero");
      const footer = document.querySelector<HTMLElement>(".site-footer");
      if (!hero) return false;

      vw = window.innerWidth;
      vh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(vw * dpr);
      canvas!.height = Math.round(vh * dpr);
      canvas!.style.width = `${vw}px`;
      canvas!.style.height = `${vh}px`;

      const heroRect = hero.getBoundingClientRect();
      const heroTop = heroRect.top + window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const footerTop = footer
        ? footer.getBoundingClientRect().top + window.scrollY
        : docH - 200;

      // Finer cells give the silhouettes and their motion a smoother gradient.
      // Low-core and small-screen devices retain a lighter particle budget.
      const lean = vw < 640 || (navigator.hardwareConcurrency || 8) <= 4;
      const cell = lean ? 10 : vw < 1100 ? 8 : 7;

      field = buildField(scene, heroTop, heroRect.width, heroRect.height, footerTop, docH, vh, cell);
      return Boolean(field);
    }

    function draw() {
      if (!field) return;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, vw, vh);

      const cell = field.cell;
      const tones = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      // Squares that have left the hero cross live copy on their way down.
      // They are heavily thinned and split by where they are: `driftEdge` is
      // out in the page gutters where nothing is being read, `driftOver` is
      // across the content column and stays near-invisible. The point is a
      // hint that something is still falling, not a curtain over the text.
      const driftEdge = new Path2D();
      const driftOver = new Path2D();

      // Content column, matching .container-page (max-width 88rem, centred).
      const colW = Math.min(vw, 88 * 16);
      const colL = (vw - colW) / 2 + 32;
      const colR = vw - colL;

      // Rebuild the spatial index from what is actually on screen this frame.
      const buckets = field.buckets;
      buckets.clear();
      const { bucketSize, bucketCols } = field;

      const maxScroll = field.maxScroll;
      const footerTop = field.footerTop;
      const prog = scrollY / maxScroll;

      for (const p of field.particles) {
        const span = p.endFrac - p.startFrac || 1;
        const t = Math.min(1, Math.max(0, (prog - p.startFrac) / span));
        const e = easeInOut(t);

        // Settle position is resolved against the *live* footer each frame, so
        // a carousel changing the page height can't shift the drift.
        const settleY = footerTop - p.settleRow * cell * 0.92;
        const flowStrength = Math.pow(1 - e, 2);
        const flowPhase = elapsed * 0.62 + p.phase;
        const ambientX = (
          Math.sin(flowPhase + p.hy * 0.004) * cell * 0.34 +
          Math.sin(elapsed * 0.27 + p.hx * 0.009) * cell * 0.13
        ) * flowStrength;
        const ambientY = (
          Math.cos(flowPhase * 0.83 + p.hx * 0.004) * cell * 0.22 +
          Math.sin(elapsed * 0.2 + (p.hx + p.hy) * 0.005) * cell * 0.1
        ) * flowStrength;
        const dx = p.hx + (p.sx - p.hx) * e + p.ox + ambientX;
        const dy = p.hy + (settleY - p.hy) * e + p.oy + ambientY;

        const sy = dy - scrollY;
        if (sy < -cell || sy > vh + cell) continue;

        const key = Math.floor(sy / bucketSize) * bucketCols + Math.floor(dx / bucketSize);
        const list = buckets.get(key);
        if (list) list.push(p);
        else buckets.set(key, [p]);

        const breathe = 1 + Math.sin(elapsed * 0.9 + p.phase) * 0.055 * flowStrength;
        const size = cell * (0.34 + p.luma * 0.5 + p.heat * 0.42) * breathe;
        const half = size / 2;
        const rx = dx - half;
        const ry = sy - half;

        if (e > 0.06 && p.heat < 0.25) {
          // Everything that isn't a survivor dissolves the moment it leaves
          // the hero and never comes back — that is what keeps both the
          // transit and the footer drift sparse.
          if (!p.keep) continue;
          if (e < 0.97) {
            // Still falling: near-invisible over the content column, merely
            // faint out in the gutters.
            if (dx > colL && dx < colR) driftOver.rect(rx, ry, size, size);
            else driftEdge.rect(rx, ry, size, size);
            continue;
          }
          // Landed in the drift — back over dead space, so full strength.
        }
        const heatLift = p.heat > 0.5 ? 1 : 0;
        const tone = Math.min(3, p.tone + heatLift);
        tones[tone].rect(rx, ry, size, size);
      }

      ctx!.fillStyle = inkColors[1];
      ctx!.globalAlpha = 0.07;
      ctx!.fill(driftOver);
      ctx!.fillStyle = inkColors[2];
      ctx!.globalAlpha = 0.2;
      ctx!.fill(driftEdge);
      const toneAlpha = [0.32, 0.48, 0.66, 0.82];
      for (let i = 0; i < tones.length; i += 1) {
        ctx!.fillStyle = inkColors[i];
        ctx!.globalAlpha = toneAlpha[i];
        ctx!.fill(tones[i]);
      }
      ctx!.globalAlpha = 1;
    }

    function applyPointer() {
      if (!field || !pointer) return;
      const from = lastPointer ?? pointer;
      const { buckets, bucketSize, bucketCols, cell } = field;
      // Deliberately tight — this follows the cursor everywhere on the page, so
      // a wide field of influence would feel like drag rather than a nudge.
      const radius = cell * 3.2;
      const radiusSq = radius * radius;
      const steps = Math.max(
        1,
        Math.min(24, Math.ceil(Math.hypot(pointer.x - from.x, pointer.y - from.y) / (cell * 0.9)))
      );
      const touched = new Set<Particle>();

      for (let s = 0; s <= steps; s += 1) {
        const t = s / steps;
        const px = from.x + (pointer.x - from.x) * t;
        const pyDoc = from.y + (pointer.y - from.y) * t;
        const pyView = pyDoc - scrollY;
        const bx = Math.floor(px / bucketSize);
        const by = Math.floor(pyView / bucketSize);

        for (let oy = -1; oy <= 1; oy += 1) {
          for (let ox = -1; ox <= 1; ox += 1) {
            const list = buckets.get((by + oy) * bucketCols + (bx + ox));
            if (!list) continue;
            for (const p of list) {
              if (touched.has(p)) continue;
              const span = p.endFrac - p.startFrac || 1;
              const prog = scrollY / field.maxScroll;
              const e = easeInOut(Math.min(1, Math.max(0, (prog - p.startFrac) / span)));
              const settleY = field.footerTop - p.settleRow * field.cell * 0.92;
              const cxp = p.hx + (p.sx - p.hx) * e + p.ox;
              const cyp = p.hy + (settleY - p.hy) * e + p.oy;
              const ddx = cxp - px;
              const ddy = cyp - pyDoc;
              const d2 = ddx * ddx + ddy * ddy;
              if (d2 > radiusSq) continue;
              const d = Math.sqrt(d2) || 1;
              const force = (1 - d / radius) * 2.1;
              p.vx += (ddx / d) * force;
              p.vy += (ddy / d) * force;
              p.heat = Math.min(1, p.heat + force * 0.24);
              touched.add(p);
            }
          }
        }
      }
      lastPointer = pointer;
    }

    function tick(now: number) {
      if (!running || !field) return;
      const deltaMs = lastTick ? Math.min(42, now - lastTick) : 16.667;
      const frame = deltaMs / 16.667;
      lastTick = now;
      elapsed += deltaMs / 1000;
      scrollY = window.scrollY;

      applyPointer();
      if (pointer && now - pointerIdleAt > 2000) {
        pointer = null;
        lastPointer = null;
      }

      for (const p of field.particles) {
        if (p.ox || p.oy || p.vx || p.vy || p.heat) {
          p.vx += -p.ox * 0.13 * frame;
          p.vy += -p.oy * 0.13 * frame;
          const damping = Math.pow(0.83, frame);
          p.vx *= damping;
          p.vy *= damping;
          p.ox += p.vx * frame;
          p.oy += p.vy * frame;
          p.heat *= Math.pow(0.91, frame);
          if (Math.abs(p.ox) < 0.01 && Math.abs(p.vx) < 0.01) { p.ox = 0; p.vx = 0; }
          if (Math.abs(p.oy) < 0.01 && Math.abs(p.vy) < 0.01) { p.oy = 0; p.vy = 0; }
          if (p.heat < 0.01) p.heat = 0;
        }
      }

      draw();
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running || reduceQuery.matches) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onScroll() {
      scrollY = window.scrollY;
      // If the loop is quiet (reduced motion, throttled tab) still repaint, so
      // scrolling never leaves the field stranded mid-page.
      if (!running || performance.now() - lastTick > 200) draw();
    }

    function setPointerFrom(clientX: number, clientY: number) {
      pointer = { x: clientX, y: clientY + window.scrollY };
      pointerIdleAt = performance.now();
    }

    function onPointerMove(e: PointerEvent) {
      if (coarseQuery.matches) return;
      setPointerFrom(e.clientX, e.clientY);
    }

    // Touch has no hover, so there is no cursor to follow. The nearest honest
    // equivalent is to respond where the finger actually is while it is down.
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (t) setPointerFrom(t.clientX, t.clientY);
    }
    function onTouchEnd() {
      pointer = null;
      lastPointer = null;
    }

    const boot = () => {
      readTokens();
      if (!measure()) return;
      setReady(true);
      scrollY = window.scrollY;
      draw();
      if (!reduceQuery.matches) start();
    };

    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(boot, { timeout: 500 })
      : window.setTimeout(boot, 80);

    // The carousels on this page swap panels of differing heights every few
    // seconds. That changes document height, which moves the footer and the
    // scrollable range — so refresh those two anchors instead of rebuilding
    // the field, which would be far too expensive to do on a timer.
    function refreshAnchors() {
      if (!field) return;
      const footer = document.querySelector<HTMLElement>(".site-footer");
      if (footer) field.footerTop = footer.getBoundingClientRect().top + window.scrollY;
      field.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }

    const bodyObserver = new ResizeObserver(() => {
      refreshAnchors();
      if (!running || performance.now() - lastTick > 200) draw();
    });
    bodyObserver.observe(document.body);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (measure()) draw();
      }, 200);
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onReduceChange = () => {
      if (reduceQuery.matches) { stop(); draw(); } else start();
    };
    // Re-read the brand colour when the theme flips.
    const themeObserver = new MutationObserver(() => { readTokens(); draw(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener("change", onReduceChange);

    return () => {
      stop();
      bodyObserver.disconnect();
      themeObserver.disconnect();
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener("change", onReduceChange);
    };
  }, [scene]);

  return (
    <div className={`particle-field${ready ? " is-ready" : ""}`} data-scene={scene.id} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
