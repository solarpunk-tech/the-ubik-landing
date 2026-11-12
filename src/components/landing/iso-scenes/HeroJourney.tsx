import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/iso/iso.css";
import "@/components/landing/port-figure/port-figure.css";
import "./hero-journey.css";
import { asksForStillness, useInView } from "@/lib/iso/react/live";
import { CALLOUTS, LOOP, STILL, VIEW_H, WINDOW, calloutPx, cameraAt, frame } from "./hero-journey";

const FADE = 0.55;
const visibility = (t: number, from: number, to: number) => Math.min(Math.max((t - from) / FADE, 0), Math.max((to - t) / FADE, 0), 1);

/**
 * The hero's long scene: a pond farm, the plant, a ship, a far port and the
 * distribution warehouse, shown through a camera that pans with the box. The
 * Ubik callouts are HTML pinned to world points, so their text stays crisp at
 * any width. Runs only on screen at 30 fps; reduced motion shows one still.
 */
export function HeroJourney({ className }: { className?: string }) {
  const { t: tr } = useTranslation();
  const stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const layer = useRef<SVGGElement>(null);
  const tags = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(stage);
  const first = useMemo(() => frame(STILL), []);
  const anchors = useMemo(() => CALLOUTS.map(calloutPx), []);
  const win = useRef(WINDOW);

  useEffect(() => {
    const pin = (time: number) => {
      const w = win.current;
      const [cam, camY] = cameraAt(time, w);
      svg.current?.setAttribute("viewBox", `${cam.toFixed(1)} ${camY.toFixed(1)} ${w.toFixed(1)} ${VIEW_H}`);
      const box = stage.current?.clientWidth ?? 0;
      CALLOUTS.forEach((c, i) => {
        const node = tags.current[i];
        if (!node) return;
        const v = visibility(time, c.from, c.to);
        const [px, py] = anchors[i];
        // Keep the chip inside the stage; the leader line stays on its anchor.
        const want = ((px - cam) / w) * box;
        const half = node.offsetWidth / 2;
        const left = Math.min(Math.max(want, half + 4), Math.max(box - half - 4, half + 4));
        node.style.left = `${left.toFixed(1)}px`;
        node.style.setProperty("--lead", `${(want - left).toFixed(1)}px`);
        node.style.top = `${(((py - camY) / VIEW_H) * 100).toFixed(2)}%`;
        node.style.opacity = v.toFixed(2);
        node.style.setProperty("--rise", `${((1 - v) * 6).toFixed(1)}px`);
      });
    };
    // Narrow screens look through a narrower window, so the scene never shrinks below a readable size.
    const measure = () => {
      const width = stage.current?.clientWidth ?? 0;
      if (width) win.current = Math.min(WINDOW, Math.max(300, width / 1.35));
    };
    measure();
    const watch = new ResizeObserver(() => {
      measure();
      pin(clockRef.current);
    });
    if (stage.current) watch.observe(stage.current);
    const clockRef = { current: STILL };
    pin(STILL);
    const group = layer.current;
    if (!group || !inView || asksForStillness()) return;
    let clock = STILL;
    let last = 0;
    let since = 0;
    let handle = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock = (clock + dt) % LOOP;
      clockRef.current = clock;
      since += dt;
      if (since >= 1 / 30) {
        since = 0;
        group.innerHTML = frame(clock);
        pin(clock);
      }
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(handle);
      watch.disconnect();
    };
  }, [inView, anchors]);

  return (
    <div ref={stage} className={["iso port-figure port-figure-bg hero-journey", className].filter(Boolean).join(" ")} aria-hidden>
      <svg ref={svg} className="iso-svg" viewBox={`0 0 ${WINDOW} ${VIEW_H}`} focusable="false">
        <g ref={layer} dangerouslySetInnerHTML={{ __html: first }} />
      </svg>
      {CALLOUTS.map((c, i) => (
        <div key={c.id} ref={(node) => { tags.current[i] = node; }} className="hero-journey-tag" style={{ opacity: 0 }}>
          <span className="hero-journey-mark" aria-hidden>ubik<i /></span>
          <span className="hero-journey-kicker">{c.kicker}</span>
          <span>{tr(`home.hero.journey.${c.key}`)}</span>
        </div>
      ))}
    </div>
  );
}
