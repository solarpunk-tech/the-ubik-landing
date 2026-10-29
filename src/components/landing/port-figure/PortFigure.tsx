import { useEffect, useMemo, useRef } from "react";
import "@/lib/iso/iso.css";
import "./port-figure.css";
import { Plate } from "@/lib/iso/react/draw";
import { asksForStillness, useInView } from "@/lib/iso/react/live";
import { translateAlong } from "@/lib/iso/iso-kit";
import { LEVEL, LOOP, RUN, STILL, poseAt, type Pose } from "./model";
import {
  BACKGROUND,
  BOX_SVG,
  CAB_SVG,
  HEIGHT,
  OVERLAY,
  P,
  SPREADER_REST,
  SPREADER_SVG,
  STATIC,
  TRAILER_SVG,
  TROLLEY_SVG,
  WIDTH,
  armPath,
  lampSvg,
  movingBoxes,
  orderOf,
  pinsSvg,
  ropesPath
} from "./scene";

const MOVING = ["box", "spreader", "trolley", "trailer", "cab", "pins", "lamp", "arm"] as const;

// Behind the hero the berth has no ground: no water, no quay slab, just the machines on the page.
const GROUNDLESS = STATIC.filter((item) => item.id !== "quay");

function sorted(pose: Pose, background: boolean) {
  const boxes = movingBoxes(pose);
  return orderOf([...(background ? GROUNDLESS : STATIC).map(({ id, box }) => ({ id, box })), ...MOVING.map((id) => ({ id, box: boxes[id] }))]);
}

/** Inner markup of each moving part in a pose. Used for the first render and every frame. */
function movingParts(pose: Pose) {
  const boxShift = pose.boxOnTruck ? [pose.truck, RUN, pose.box - LEVEL.onShip] : [0, pose.trolley, pose.box - LEVEL.onShip];
  return {
    box: { transform: translateAlong(P, boxShift as [number, number, number]), opacity: pose.boxOpacity },
    spreader: { transform: translateAlong(P, [0, pose.trolley, pose.spreader - SPREADER_REST]) },
    trolley: { transform: translateAlong(P, [0, pose.trolley, 0]) },
    truck: { transform: translateAlong(P, [pose.truck, 0, 0]), opacity: pose.truckOpacity },
    ropes: ropesPath(pose.trolley, pose.spreader),
    pins: pinsSvg(pose.pins),
    arm: armPath(pose.arm)
  };
}

function Part({ id, pose }: { id: string; pose: Pose }) {
  const parts = movingParts(pose);
  switch (id) {
    case "box":
      return <g data-id="box" transform={parts.box.transform} opacity={parts.box.opacity} dangerouslySetInnerHTML={{ __html: BOX_SVG }} />;
    case "spreader":
      return (
        <g data-id="spreader">
          <path className="iso-line" data-tone="mid" data-part="ropes" d={parts.ropes} />
          <g transform={parts.spreader.transform} data-part="spreader" dangerouslySetInnerHTML={{ __html: SPREADER_SVG }} />
        </g>
      );
    case "trolley":
      return <g data-id="trolley" transform={parts.trolley.transform} dangerouslySetInnerHTML={{ __html: TROLLEY_SVG }} />;
    case "trailer":
      return <g data-id="trailer" transform={parts.truck.transform} opacity={parts.truck.opacity} dangerouslySetInnerHTML={{ __html: TRAILER_SVG }} />;
    case "cab":
      return <g data-id="cab" transform={parts.truck.transform} opacity={parts.truck.opacity} dangerouslySetInnerHTML={{ __html: CAB_SVG }} />;
    case "pins":
      return <g data-id="pins" dangerouslySetInnerHTML={{ __html: parts.pins }} />;
    case "lamp":
      return <g data-id="lamp" data-on={pose.lamp ? "" : undefined} dangerouslySetInnerHTML={{ __html: lampSvg() }} />;
    case "arm":
      return (
        <g data-id="arm">
          <path className="port-arm" d={parts.arm} />
          <path className="port-arm-stripes" d={parts.arm} />
        </g>
      );
    default:
      return null;
  }
}

/**
 * Fig 1: a ship-to-shore crane takes a box off the ship and sets it on a
 * truck while the gate booth's three pins rise, one per document matched.
 * When all three are up the lamp lights and the barrier lifts. The loop runs
 * only on screen and stands still under reduced motion. `background` drops the frame and sits it behind
 * the hero's own content.
 */
export function PortFigure({ className, background = false }: { className?: string; background?: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<SVGGElement>(null);
  const inView = useInView(stage);
  const still = useMemo(() => poseAt(STILL), []);
  const firstOrder = useMemo(() => sorted(still, background), [still, background]);
  const items = useMemo(() => new Map(STATIC.map((item) => [item.id, item.svg])), []);
  const clock = useRef(STILL);

  useEffect(() => {
    const root = stage.current;
    const group = layer.current;
    if (!root || !group || !inView || asksForStillness()) return;
    const nodes = new Map<string, SVGGElement>();
    group.querySelectorAll<SVGGElement>(":scope > g[data-id]").forEach((node) => nodes.set(node.dataset.id!, node));
    const readout = root.querySelector<HTMLElement>("[data-readout]");
    let last = 0;
    let frame = 0;
    let shown = firstOrder.join();
    let said = "";

    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      clock.current = (clock.current + dt) % LOOP;
      const pose = poseAt(clock.current);
      const parts = movingParts(pose);
      nodes.get("box")?.setAttribute("transform", parts.box.transform);
      nodes.get("box")?.setAttribute("opacity", String(parts.box.opacity));
      nodes.get("trolley")?.setAttribute("transform", parts.trolley.transform);
      for (const id of ["trailer", "cab"]) {
        nodes.get(id)?.setAttribute("transform", parts.truck.transform);
        nodes.get(id)?.setAttribute("opacity", String(parts.truck.opacity));
      }
      const spreader = nodes.get("spreader");
      spreader?.querySelector("[data-part=ropes]")?.setAttribute("d", parts.ropes);
      spreader?.querySelector("[data-part=spreader]")?.setAttribute("transform", parts.spreader.transform);
      const pins = nodes.get("pins");
      if (pins && pins.dataset.state !== pose.pins.join()) {
        pins.innerHTML = parts.pins;
        pins.dataset.state = pose.pins.join();
      }
      nodes.get("lamp")?.toggleAttribute("data-on", pose.lamp);
      nodes.get("arm")?.querySelectorAll("path").forEach((path) => path.setAttribute("d", parts.arm));
      if (readout && pose.readout !== said) {
        readout.textContent = pose.readout;
        said = pose.readout;
      }
      const order = sorted(pose, background);
      const key = order.join();
      if (key !== shown) {
        for (const id of order) {
          const node = nodes.get(id);
          if (node) group.appendChild(node);
        }
        shown = key;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, firstOrder, background]);

  const art = (
    <svg
      className="iso-svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role={background ? undefined : "img"}
      aria-label={
        background
          ? undefined
          : "A container crane lifts a box off a ship onto a truck. At the gate, three pins rise as the bill of lading, invoice and packing list are matched; when all three are up the lamp lights and the barrier lifts."
      }
      focusable="false"
    >
      {background ? null : <g dangerouslySetInnerHTML={{ __html: BACKGROUND }} />}
      <g ref={layer}>
        {firstOrder.map((id) =>
          items.has(id) ? <g key={id} data-id={id} dangerouslySetInnerHTML={{ __html: items.get(id)! }} /> : <Part key={id} id={id} pose={still} />
        )}
      </g>
      <g dangerouslySetInnerHTML={{ __html: OVERLAY }} />
    </svg>
  );

  // Behind the hero: no frame, no readout, nothing to focus or hover.
  if (background) {
    return (
      <div ref={stage} aria-hidden className={className ? `iso port-figure port-figure-bg ${className}` : "iso port-figure port-figure-bg"}>
        {art}
      </div>
    );
  }

  return (
    <div
      ref={stage}
      className={className ? `iso port-figure ${className}` : "iso port-figure"}
    >
      <Plate fig="Fig 1" title="Berth 4 · discharge" readout={still.readout}>
        {art}
      </Plate>
    </div>
  );
}
