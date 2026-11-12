import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/iso/iso.css";
import "@/components/landing/port-figure/port-figure.css";
import "./hero-journey.css";
import { asksForStillness, useInView } from "@/lib/iso/react/live";
import { LOOP, ORIGINS, STILL, VIEW_H, WINDOW, calloutPx, calloutsFor, cameraAt, frame, type Origin } from "./hero-journey";

const FADE = 0.55;
const visibility = (t: number, from: number, to: number) => Math.min(Math.max((t - from) / FADE, 0), Math.max((to - t) / FADE, 0), 1);
const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

/**
 * The hero's long scene, shown through a camera that pans with the box. The
 * first part (where the goods start) changes on each page load, to show the
 * same flow for shrimp, crops, pharma or packaging. Callouts are HTML pinned
 * to world points. Runs only on screen at 30 fps; reduced motion shows one still.
 */
export function HeroJourney({ className }: { className?: string }) {
  const { t: tr } = useTranslation();
  const stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const layer = useRef<SVGGElement>(null);
  const tags = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(stage);
  const win = useRef(WINDOW);
  // The server and first paint use the first origin; the client then picks one at random.
  const [origin, setOrigin] = useState<Origin>(ORIGINS[0]);
  useEffect(() => {
    setOrigin(ORIGINS[Math.floor(Math.random() * ORIGINS.length)]);
  }, []);
  const callouts = useMemo(() => calloutsFor(origin), [origin]);
  const first = useMemo(() => frame(STILL, origin), [origin]);
  const anchors = useMemo(() => callouts.map(calloutPx), [callouts]);

  useEffect(() => {
    const pin = (time: number) => {
      const w = win.current;
      const [cam, camY] = cameraAt(time, w);
      svg.current?.setAttribute("viewBox", `${cam.toFixed(1)} ${camY.toFixed(1)} ${w.toFixed(1)} ${VIEW_H}`);
      const box = stage.current?.clientWidth ?? 0;
      callouts.forEach((c, i) => {
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
    const clockRef = { current: STILL };
    measure();
    const watch = new ResizeObserver(() => {
      measure();
      pin(clockRef.current);
    });
    if (stage.current) watch.observe(stage.current);
    pin(STILL);
    const group = layer.current;
    if (group) group.innerHTML = frame(STILL, origin);
    if (!group || !inView || asksForStillness()) return () => watch.disconnect();
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
        group.innerHTML = frame(clock, origin);
        pin(clock);
      }
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(handle);
      watch.disconnect();
    };
  }, [inView, callouts, anchors, origin]);

  return (
    <div ref={stage} className={["iso port-figure port-figure-bg hero-journey", className].filter(Boolean).join(" ")} aria-hidden>
      <svg ref={svg} className="iso-svg" viewBox={`0 0 ${WINDOW} ${VIEW_H}`} focusable="false">
        <g ref={layer} dangerouslySetInnerHTML={{ __html: first }} />
      </svg>
      {callouts.map((c, i) => (
        <div key={c.id + origin} ref={(node) => { tags.current[i] = node; }} className="hero-journey-tag" style={{ opacity: 0 }}>
          <span className="hero-journey-apps">
            {c.apps.map((domain) => (
              <img key={domain} src={favicon(domain)} alt="" width={18} height={18} loading="eager" />
            ))}
          </span>
          <span className="hero-journey-copy">
            <span className="hero-journey-head">
              <strong>{tr(`home.hero.journey.${c.key}.team`)}</strong>
              <span className="hero-journey-mark" />
            </span>
            <span className="hero-journey-action">{tr(`home.hero.journey.${c.key}.action`)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
