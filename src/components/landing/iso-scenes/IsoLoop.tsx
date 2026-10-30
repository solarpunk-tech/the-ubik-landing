import { useEffect, useMemo, useRef } from "react";
import "@/lib/iso/iso.css";
import "@/components/landing/port-figure/port-figure.css";
import { asksForStillness, useInView } from "@/lib/iso/react/live";

/**
 * A small anatomy scene that redraws itself from a pure `frame(t)` each tick.
 * The server and first render show `frame(still)`; the loop runs at 30 fps
 * only while the scene is on screen, and not at all under reduced motion.
 * `paper` picks the fill: the card's white, or the page itself.
 */
export function IsoLoop({
  width,
  height,
  frame,
  still,
  loop,
  paper = "card",
  className
}: {
  width: number;
  height: number;
  frame: (t: number) => string;
  still: number;
  loop: number;
  paper?: "card" | "page";
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<SVGGElement>(null);
  const inView = useInView(stage);
  const first = useMemo(() => frame(still), [frame, still]);

  useEffect(() => {
    const group = layer.current;
    if (!group || !inView || asksForStillness()) return;
    let clock = still;
    let last = 0;
    let since = 0;
    let handle = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock = (clock + dt) % loop;
      since += dt;
      if (since >= 1 / 30) {
        since = 0;
        group.innerHTML = frame(clock);
      }
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [inView, frame, still, loop]);

  return (
    <div ref={stage} aria-hidden className={["iso port-figure", paper === "page" ? "port-figure-bg" : "", className].filter(Boolean).join(" ")}>
      <svg className="iso-svg" viewBox={`0 0 ${width} ${height}`} focusable="false">
        <g ref={layer} dangerouslySetInnerHTML={{ __html: first }} />
      </svg>
    </div>
  );
}
