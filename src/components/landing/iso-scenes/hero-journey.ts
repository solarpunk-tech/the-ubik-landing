import {
  cylinder,
  dotsSvg,
  extrude,
  fadeLineSvg,
  insetPlan,
  iso,
  lineOnTop,
  lineSvg,
  pathOf,
  planOutline,
  ringSeam,
  sideSeam,
  slabOf,
  solidSvg,
  type Plan,
  type Plane,
  type Point3,
  type SolidStyle
} from "@/lib/iso/iso-kit";
import { painted, screenRect, type Box, type Drawn } from "@/lib/iso/order";

/*
 * The hero's one long scene, drawn left to right and shown through a camera
 * that pans with the story. A pond farm, the plant and its packing line, a
 * truck to the quay, the crane that sets the box on a ship, the ship's
 * crossing, the crane at the far quay and the truck that takes it to the
 * distribution warehouse. One box, lit, is carried the whole way. World
 * units are half a metre-ish: x along the strip, y toward the viewer, z up.
 */

export const LOOP = 30;
/** Scene pixels per world unit: sets how large the machines read through the camera. */
const SCALE = 1.9;
/** Width of what the camera shows, in scene pixels. */
export const WINDOW = 760;
/** And its height; the strip runs diagonally, so the camera follows it down as well. */
export const VIEW_H = 230;

const WORLD_X1 = 730;
const WORLD_Y1 = 80;

const PAD = 6;
const AZIMUTH = 74;
const ELEVATION = 26;
const EXTENT: Point3[] = [
  [-4, 0, -3],
  [-4, WORLD_Y1, -3],
  [WORLD_X1, 0, -3],
  [WORLD_X1, WORLD_Y1, -3],
  [20, 0, 80],
  [WORLD_X1, 0, 80]
];
const flat = EXTENT.map((point) => iso(point, { origin: [0, 0], scale: SCALE, azimuth: AZIMUTH, elevation: ELEVATION }));
const LEFT = Math.min(...flat.map(([x]) => x));
const TOP = Math.min(...flat.map(([, y]) => y));
export const WIDTH = Math.ceil(Math.max(...flat.map(([x]) => x)) - LEFT + PAD * 2);
export const HEIGHT = Math.ceil(Math.max(...flat.map(([, y]) => y)) - TOP + PAD * 2);

const P = { origin: [PAD - LEFT, PAD - TOP] as [number, number], scale: SCALE, azimuth: AZIMUTH, elevation: ELEVATION };

const at = (point: Point3) => iso(point, P);
const boxOf = ({ x, y, w, d }: Plan, z0: number, z1: number): Box => [x, y, z0, x + w, y + d, z1];
const solid = (plan: Plan, z: number, h: number, style: SolidStyle = {}, bevel = 0.4, inner = "") =>
  solidSvg(slabOf(plan, z, h, P, 2, bevel), { tone: "mid", ...style, inner });
const item = (plan: Plan, z: number, h: number, style: SolidStyle = {}, bevel = 0.4, inner = ""): Drawn => ({ box: boxOf(plan, z, z + h), svg: solid(plan, z, h, style, bevel, inner) });
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
const span = (t: number, from: number, to: number) => ease((t - from) / (to - from));
const wrap = (svg: string, opacity: number) => (opacity >= 0.995 ? svg : opacity <= 0.01 ? "" : `<g opacity="${opacity.toFixed(2)}">${svg}</g>`);

/* ---------- the places, in world x ---------- */

const LANE_Y = 41; // truck lane runs y 41..46
const BELT_Z = 11;
const SHIP_X0 = 372; // hull's west end while it waits at the first quay
const SHIP_X1 = 440; // and at the far one
const CONT = { w: 12, d: 5, h: 5 };

const LAND_W: Plan = { x: -4, y: 0, w: 366, d: WORLD_Y1, r: 1 };
const WATER: Plan = { x: 362, y: 0, w: 158, d: WORLD_Y1, r: 0 };
const LAND_E: Plan = { x: 520, y: 0, w: WORLD_X1 - 520 + 4, d: WORLD_Y1, r: 1 };

/* ---------- ground ---------- */

const ground = (() => {
  const land = solidSvg(slabOf(LAND_W, -3, 3, P, 4, 0.6), { tone: "lo" }) + solidSvg(slabOf(LAND_E, -3, 3, P, 4, 0.6), { tone: "lo" });
  const water = solidSvg(slabOf(WATER, -3, 2, P, 2), { tone: "lo", flat: true, className: "port-water" });
  const waves: string[] = [];
  for (let i = 0; i < 26; i++) {
    const wx = 366 + ((i * 41) % 148);
    const wy = 4 + ((i * 23) % 72);
    if (wx > 372 && wx < 520 && wy > 26 && wy < 58) continue;
    waves.push(fadeLineSvg([at([wx, wy, -1]), at([wx + 9, wy, -1])], { fade: [3, 3], tone: "lo" }));
  }
  const road = (x0: number, x1: number) =>
    solidSvg(slabOf({ x: x0, y: 38, w: x1 - x0, d: 11, r: 0 }, 0, 0.4, P, 2), { tone: "lo", flat: true }) + lineSvg(lineOnTop([x0, 43.5], [x1, 43.5], 0.4, P), { tone: "lo", dashed: true });
  const ponds: Plan[] = [
    { x: 6, y: 8, w: 54, d: 30, r: 7 },
    { x: 6, y: 46, w: 54, d: 24, r: 6 }
  ];
  const pondSvg = ponds
    .map((pond) => solidSvg(slabOf(pond, 0, 0.6, P, 6), { tone: "lo", flat: true, className: "port-water" }) + [4, 8].map((r) => lineSvg(planOutline(insetPlan(pond, r), 0.6, P, 6), { tone: "faint" })).join(""))
    .join("");
  return land + water + waves.join("") + road(150, 362) + road(520, 724) + pondSvg;
})();

/* ---------- static parts ---------- */

const STATIC: Drawn[] = [];

// Pond farm: aerators on both ponds, a feed shed, and the harvest crates stacked on the bank between.
for (const [cx, cy] of [[28, 22], [44, 56], [20, 58]] as const) {
  STATIC.push({
    box: [cx - 3, cy - 3, 0, cx + 3, cy + 3, 6],
    svg: solidSvg(cylinder(cx, cy, 3, 0.6, 2, P, 18, 0.3), { tone: "hi" }) + lineSvg(pathOf([at([cx - 5, cy, 3]), at([cx + 5, cy, 3])]) + pathOf([at([cx, cy - 5, 3]), at([cx, cy + 5, 3])]), { tone: "mid" })
  });
}
const SHED: Plan = { x: 64, y: 50, w: 12, d: 14, r: 0.4 };
STATIC.push(item(SHED, 0, 9, { tone: "hi" }, 0.4, lineSvg(sideSeam(SHED, 7, P, 2), { tone: "faint" })));
for (const [cx, cy, cz] of [[64, 12, 0], [71, 12, 0], [64, 20, 0], [71, 20, 0], [67.5, 16, 5], [64, 28, 0], [71, 28, 0]] as const) {
  const crate: Plan = { x: cx, y: cy, w: 6, d: 6, r: 0 };
  STATIC.push(item(crate, cz, 5, { tone: "hi" }, 0.3, lineSvg(sideSeam(crate, cz + 2.5, P, 2), { tone: "faint" })));
}

// Plant: the hall with dock doors on its front, roof units and a chimney.
const HALL: Plan = { x: 84, y: 6, w: 72, d: 30, r: 0.5 };
const doors = [92, 108, 124].map((dx) => pathOf([at([dx, 36, 0]), at([dx, 36, 12]), at([dx + 10, 36, 12]), at([dx + 10, 36, 0])])).join("");
STATIC.push(item(HALL, 0, 24, { tone: "hi" }, 0.6, lineSvg(sideSeam(HALL, 20, P, 2) + sideSeam(HALL, 17.6, P, 2), { tone: "lo" }) + lineSvg(doors, { tone: "mid" })));
for (const ux of [88, 102, 116]) STATIC.push(item({ x: ux, y: 12, w: 9, d: 7, r: 0.3 }, 24, 4, { tone: "hi" }, 0.3, lineSvg(sideSeam({ x: ux, y: 12, w: 9, d: 7, r: 0.3 }, 26, P, 2), { tone: "faint" })));
STATIC.push({ box: [138, 14, 24, 146, 22, 46], svg: solidSvg(cylinder(142, 18, 3.4, 24, 22, P, 24, 0.4), { tone: "hi" }) });

// Cold store, past the packing line.
const COLD: Plan = { x: 180, y: 8, w: 28, d: 28, r: 0.5 };
const ribs: string[] = [];
for (let rx = 182; rx < 208; rx += 2.6) ribs.push(pathOf([at([rx, 36, 0]), at([rx, 36, 32])]));
STATIC.push(item(COLD, 0, 32, { tone: "hi" }, 0.6, lineSvg(ribs.join(""), { tone: "faint" })));
STATIC.push(item({ x: 186, y: 14, w: 7, d: 7, r: 0.3 }, 32, 4, { tone: "hi" }, 0.3));

// Packing line: belt on legs, scanner gate over it, robot arm and tote on the near side.
const BELT: Plan = { x: 80, y: 40, w: 78, d: 6, r: 0 };
const rollers: string[] = [];
for (let rx = 83; rx < 80 + BELT.w; rx += 5) rollers.push(lineOnTop([rx, BELT.y + 0.6], [rx, BELT.y + BELT.d - 0.6], BELT_Z, P));
for (const lx of [84, 112, 150]) for (const ly of [40.5, 44]) STATIC.push(item({ x: lx, y: ly, w: 1.6, d: 1.6, r: 0 }, 0, 8, { tone: "mid" }, 0));
STATIC.push({
  box: boxOf(BELT, 8, BELT_Z),
  svg: solidSvg(slabOf(BELT, 8, BELT_Z - 8, P, 2, 0.4), { tone: "hi", inner: lineSvg(sideSeam(BELT, 9.5, P, 2), { tone: "lo" }) }) + lineSvg(rollers.join(""), { tone: "faint" })
});
const SCAN_X = 122;
STATIC.push(item({ x: SCAN_X - 3, y: 37.5, w: 3, d: 2.5, r: 0 }, 0, 30, { tone: "hi" }, 0));
STATIC.push(item({ x: SCAN_X - 3, y: 46.5, w: 3, d: 2.5, r: 0 }, 0, 30, { tone: "hi" }, 0));
STATIC.push({
  box: [SCAN_X - 4, 37, 30, SCAN_X + 1, 49.5, 34],
  svg: solid({ x: SCAN_X - 4, y: 37, w: 5, d: 12.5, r: 0 }, 30, 4, { tone: "hi" }, 0.4) + dotsSvg([at([SCAN_X + 1, 41, 32]), at([SCAN_X + 1, 43.5, 32]), at([SCAN_X + 1, 46, 32])], { size: 0.55, tone: "hi" })
});
const ARM_X = 104;
const ARM_BASE_Y = 74;
STATIC.push({
  box: [ARM_X - 6, ARM_BASE_Y - 6, 0, ARM_X + 6, ARM_BASE_Y + 6, 12],
  svg:
    solidSvg(cylinder(ARM_X, ARM_BASE_Y, 6, 0, 4, P, 28, 0.4), { tone: "mid" }) +
    solidSvg(cylinder(ARM_X, ARM_BASE_Y, 4, 4, 8, P, 24, 0.4), { tone: "hi", inner: lineSvg(pathOf([at([ARM_X + 2.8, ARM_BASE_Y + 2.8, 7]), at([ARM_X + 2.8, ARM_BASE_Y + 2.8, 11])]), { tone: "lo" }) })
});
const TOTE: Plan = { x: ARM_X - 7, y: 59, w: 14, d: 7, r: 0.4 };
STATIC.push({
  box: boxOf(TOTE, 0, 7),
  svg: solid(TOTE, 0, 7, { tone: "mid" }) + lineSvg(planOutline(insetPlan(TOTE, 1), 7, P, 2), { tone: "lo" }) + dotsSvg([at([ARM_X - 3, 62.5, 7]), at([ARM_X, 62.5, 7]), at([ARM_X + 3, 62.5, 7])], { size: 0.8, tone: "mid" })
});

// Quay and crane at the departure port, and the same again at the far one. Legs at y 30 and 54 straddle the truck lane.
function quay(x: number, w: number, craneLegs: number[], girder: [number, number]) {
  STATIC.push(item({ x, y: 0, w, d: WORLD_Y1, r: 0.5 }, 0, 0.8, { tone: "lo", flat: true }, 0));
  for (const [sx, sy, tiers] of [[x + 4, 6, 3], [x + 4, 12, 2], [x + 4, 18, 1], [x + 4, 62, 2], [x + 4, 68, 3]] as const) {
    const stack: Plan = { x: sx, y: sy, w: 14, d: 5, r: 0 };
    const seams = Array.from({ length: tiers - 1 }, (_, i) => sideSeam(stack, (i + 1) * 5, P, 2)).join("");
    STATIC.push(item(stack, 0, tiers * 5, { tone: "hi" }, 0.3, lineSvg(seams, { tone: "lo" })));
  }
  for (const lx of craneLegs) for (const ly of [30, 54]) STATIC.push(item({ x: lx, y: ly, w: 2.4, d: 2.4, r: 0 }, 0, 44, { tone: "hi" }, 0));
  for (const gy of [30, 54]) {
    const lacing: Point3[] = [];
    for (let gx = girder[0], up = false; gx <= girder[1]; gx += 4, up = !up) lacing.push([gx, gy + 1, up ? 52 : 47]);
    STATIC.push(item({ x: girder[0], y: gy, w: girder[1] - girder[0], d: 2, r: 0 }, 44, 4, { tone: "hi" }, 0.3, lineSvg(pathOf(lacing.map(at)), { tone: "lo" })));
  }
}
quay(306, 56, [322, 346], [316, 412]);
quay(520, 60, [534, 556], [462, 566]);

// Warehouse: a long low shed with dock doors on the road side, roof vents, and a loading canopy.
const WARE: Plan = { x: 604, y: 6, w: 92, d: 30, r: 0.5 };
const wdoors = [612, 630, 648, 666].map((dx) => pathOf([at([dx, 36, 0]), at([dx, 36, 13]), at([dx + 12, 36, 13]), at([dx + 12, 36, 0])])).join("");
const wslats: string[] = [];
for (const dx of [612, 630, 648, 666]) for (let sz = 3; sz < 13; sz += 3) wslats.push(pathOf([at([dx, 36, sz]), at([dx + 12, 36, sz])]));
STATIC.push(item(WARE, 0, 22, { tone: "hi" }, 0.6, lineSvg(sideSeam(WARE, 18, P, 2), { tone: "lo" }) + lineSvg(wdoors, { tone: "mid" }) + lineSvg(wslats.join(""), { tone: "faint" })));
for (const ux of [616, 636, 656, 676]) STATIC.push(item({ x: ux, y: 12, w: 10, d: 8, r: 0.3 }, 22, 3.6, { tone: "hi" }, 0.3, lineSvg(sideSeam({ x: ux, y: 12, w: 10, d: 8, r: 0.3 }, 23.6, P, 2), { tone: "faint" })));
STATIC.push(item({ x: 600, y: 50, w: 30, d: 12, r: 0.5 }, 0, 7, { tone: "hi" }, 0.4));

/* ---------- moving parts ---------- */

const HULL = (x: number): Plane[] => [
  [x, 30],
  [x + 60, 30],
  [x + 76, 42],
  [x + 60, 54],
  [x, 54]
];

const shipX = (t: number) => SHIP_X0 + (SHIP_X1 - SHIP_X0) * span(t, 15.0, 19.5);
const shipOpacity = (t: number) => Math.min(clamp(t / 1.2), 1 - clamp((t - 27) / 1.4));

function ship(t: number): Drawn[] {
  const opacity = shipOpacity(t);
  if (opacity <= 0.01) return [];
  const x = shipX(t);
  const bob = Math.sin((t / LOOP) * Math.PI * 12) * 0.5;
  const ring = HULL(x).map(([hx, hy]) => [hx, hy] as Plane);
  const out: Drawn[] = [
    {
      box: [x, 30, -1, x + 76, 54, 9],
      svg: wrap(solidSvg(extrude(ring, -1 + bob * 0.3, 10, P, { bevel: 0.6 }), { tone: "mid", halo: true, inner: lineSvg(ringSeam(ring, 3, P), { tone: "lo" }) }), opacity)
    },
    { box: [x + 2, 34, 9, x + 12, 50, 23], svg: wrap(solid({ x: x + 2, y: 34, w: 10, d: 16, r: 0.3 }, 9, 14, { tone: "hi" }, 0.4, lineSvg(sideSeam({ x: x + 2, y: 34, w: 10, d: 16, r: 0.3 }, 20, P, 2), { tone: "mid" })), opacity) }
  ];
  for (let bx = x + 16; bx < x + 62; bx += 13) {
    for (const [ry, tiers] of [[31, 2], [36, 3], [41, bx === x + 29 ? 2 : 3], [46, 2]] as const) {
      const stack: Plan = { x: bx, y: ry, w: 12, d: 5, r: 0 };
      out.push({ box: boxOf(stack, 9, 9 + tiers * 4.4), svg: wrap(solid(stack, 9, tiers * 4.4, { tone: "hi" }, 0.3, lineSvg(sideSeam(stack, 9 + 4.4, P, 2), { tone: "faint" })), opacity) });
    }
  }
  return out;
}

interface Truck {
  x: number; // bed's west end
  opacity: number;
}

/** Truck A: waits at the belt's end to be loaded, then runs to the first crane and backs away. */
function truckA(t: number): Truck {
  if (t < 6.4) return { x: 158 + 0, opacity: clamp(t / 1.0) };
  if (t < 9.8) return { x: 158 + (326 - 158) * span(t, 6.4, 9.8), opacity: 1 };
  return { x: 326 - 60 * span(t, 11.0, 13.8), opacity: 1 - clamp((t - 11.4) / 2.2) };
}
/** Truck B: waits under the far crane, loads, then drives to the warehouse door. */
function truckB(t: number): Truck {
  const opacity = Math.min(clamp((t - 17.0) / 1.2), 1 - clamp((t - 28.0) / 1.3));
  if (t < 24.2) return { x: 538, opacity };
  return { x: 538 + (644 - 538) * span(t, 24.2, 28.0), opacity };
}

function truckSvg(truck: Truck): Drawn[] {
  const { x, opacity } = truck;
  if (opacity <= 0.01) return [];
  const bed: Plan = { x, y: LANE_Y, w: 16.5, d: 5, r: 0 };
  const cab: Plan = { x: x + 17, y: LANE_Y - 0.4, w: 6, d: 5.8, r: 0.6 };
  const wheels = [x + 3, x + 7, x + 19].map((wx) => pathOf(Array.from({ length: 12 }, (_, i) => at([wx + Math.cos((i / 12) * Math.PI * 2) * 1.6, LANE_Y + 5.2, 1.6 + Math.sin((i / 12) * Math.PI * 2) * 1.6])), true)).join("");
  return [
    { box: [x, LANE_Y - 0.4, 0, x + 16.5, LANE_Y + 5.4, 3.4], svg: wrap(`<path class="port-wheel" d="${wheels}"/>` + solid(bed, 2, 1.4, { tone: "hi" }, 0.2), opacity) },
    { box: [x + 17, LANE_Y - 0.4, 1.6, x + 23, LANE_Y + 5.4, 9.6], svg: wrap(solidSvg(slabOf(cab, 1.6, 8, P, 4, 0.4), { tone: "hi", inner: lineSvg(sideSeam(cab, 7, P, 4), { tone: "mid" }) }), opacity) }
  ];
}

/** Where the lit box is, in world units, and how visible. */
function boxPose(t: number): { at: Point3; opacity: number } {
  const a = truckA(t);
  const b = truckB(t);
  const trolley1 = crane1(t);
  const trolley2 = crane2(t);
  const onA: Point3 = [a.x + 2, LANE_Y, 3.4];
  const onB: Point3 = [b.x + 2, LANE_Y, 3.4];
  const onShip = (x: number): Point3 => [x + 29, 41, 9 + 2 * 4.4];
  if (t < 10.6) return { at: onA, opacity: clamp((t - 0.4) / 1.0) };
  if (t < 14.2) return { at: [trolley1.x - CONT.w / 2, LANE_Y, trolley1.carry - CONT.h], opacity: 1 };
  if (t < 21.0) return { at: onShip(shipX(t)), opacity: 1 };
  if (t < 24.1) return { at: [trolley2.x - CONT.w / 2, LANE_Y, trolley2.carry - CONT.h], opacity: 1 };
  return { at: onB, opacity: b.opacity };
}

interface Crane {
  x: number; // trolley's x
  spreader: number; // spreader's floor height
  carry: number; // top of what hangs under it (0 if nothing)
}

const CRANE_PARK = 62;
const TOP_OF_TRUCK = 3.4 + CONT.h;
const TOP_OF_SHIP = 9 + 2 * 4.4 + CONT.h;

function crane1(t: number): Crane {
  // Rest over the ship, to the truck, down, up, over, down, up, and rest.
  let x = 380;
  let z = CRANE_PARK;
  if (t >= 8.2 && t < 9.8) x = 380 + (334 - 380) * span(t, 8.2, 9.8);
  else if (t >= 9.8 && t < 11.6) {
    x = 334;
    z = t < 10.6 ? CRANE_PARK + (TOP_OF_TRUCK - CRANE_PARK) * span(t, 9.8, 10.6) : TOP_OF_TRUCK + (CRANE_PARK - TOP_OF_TRUCK) * span(t, 10.6, 11.6);
  } else if (t >= 11.6 && t < 13.4) {
    x = 334 + (407 - 334) * span(t, 11.6, 13.4);
    z = CRANE_PARK;
  } else if (t >= 13.4 && t < 15.2) {
    x = 407;
    z = t < 14.2 ? CRANE_PARK + (TOP_OF_SHIP - CRANE_PARK) * span(t, 13.4, 14.2) : TOP_OF_SHIP + (CRANE_PARK - TOP_OF_SHIP) * span(t, 14.2, 15.2);
  } else if (t >= 15.2 && t < 17.0) x = 407 + (380 - 407) * span(t, 15.2, 17.0);
  const carrying = t >= 10.6 && t < 14.2;
  return { x, spreader: z, carry: carrying ? z : 0 };
}

function crane2(t: number): Crane {
  const pick = shipX(20.3) + 29 + CONT.w / 2; // the box's centre on the arrived ship
  const drop = 546;
  let x = 500;
  let z = CRANE_PARK;
  if (t >= 19.2 && t < 20.3) x = 500 + (pick - 500) * span(t, 19.2, 20.3);
  else if (t >= 20.3 && t < 22.0) {
    x = pick;
    z = t < 21.0 ? CRANE_PARK + (TOP_OF_SHIP - CRANE_PARK) * span(t, 20.3, 21.0) : TOP_OF_SHIP + (CRANE_PARK - TOP_OF_SHIP) * span(t, 21.0, 22.0);
  } else if (t >= 22.0 && t < 23.4) {
    x = pick + (drop - pick) * span(t, 22.0, 23.4);
    z = CRANE_PARK;
  } else if (t >= 23.4 && t < 24.8) {
    x = drop;
    z = t < 24.1 ? CRANE_PARK + (TOP_OF_TRUCK - CRANE_PARK) * span(t, 23.4, 24.1) : TOP_OF_TRUCK + (CRANE_PARK - TOP_OF_TRUCK) * span(t, 24.1, 24.8);
  } else if (t >= 24.8) x = drop + (500 - drop) * span(t, 24.8, 26.4);
  else x = pick;
  if (t < 19.2) x = 500;
  const carrying = t >= 21.0 && t < 24.1;
  return { x, spreader: z, carry: carrying ? z : 0 };
}

function craneRig(c: Crane, gx: [number, number]): Drawn[] {
  // The trolley rides between the two girders; ropes drop from it to the spreader.
  const z = 48;
  const x = clamp01(c.x, gx[0] + 2, gx[1] - 2);
  const trolley: Plan = { x: x - 3, y: 30, w: 6, d: 26, r: 0.3 };
  const ropes = [31.5, 52.5].map((ry) => pathOf([at([x, ry, z]), at([x, ry, c.spreader + (c.carry ? 0 : 0)])])).join("");
  const spreader: Plan = { x: x - 6.5, y: 40, w: 13, d: 6, r: 0.3 };
  return [
    { box: boxOf(trolley, 48, 51), svg: solid(trolley, 48, 3, { tone: "hi" }, 0.3) },
    { box: boxOf(spreader, c.spreader, c.spreader + 1.2), svg: lineSvg(ropes, { tone: "mid" }) + solid(spreader, c.spreader, 1.2, { tone: "hi" }, 0.2) }
  ];
}
const clamp01 = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* ---------- the packing line ---------- */

const CARTON = { w: 14, d: 4.4, h: 5.4 };
const PERIOD = 2.5;
const SPEED = 14;
const START_X = 80;
const END_X = 156;

function carton(x: number, state: { packed: boolean; scanned: boolean }, opacity: number): Drawn {
  const y = 41;
  const z = BELT_Z;
  const plan: Plan = { x, y, w: CARTON.w, d: CARTON.d, r: 0 };
  const top = z + CARTON.h;
  let detail = "";
  if (state.packed) detail += lineSvg(lineOnTop([x, y + CARTON.d / 2], [x + CARTON.w, y + CARTON.d / 2], top, P), { tone: "mid" });
  else detail += lineSvg(planOutline(insetPlan(plan, 1.0), top, P, 2), { tone: "lo" });
  if (state.scanned) {
    const label = pathOf([at([x + 3, y + CARTON.d, z + 1.6]), at([x + 7, y + CARTON.d, z + 1.6]), at([x + 7, y + CARTON.d, z + 3.6]), at([x + 3, y + CARTON.d, z + 3.6])], true);
    detail += `<path class="pl-label" d="${label}"/>`;
  }
  const svg = solidSvg(slabOf(plan, z, CARTON.h, P, 2, 0.4), { tone: "hi", inner: lineSvg(sideSeam(plan, top - 1.6, P, 2), { tone: "faint" }) }) + detail;
  return { box: [x, y, z, x + CARTON.w, y + CARTON.d, top], svg: wrap(svg, opacity) };
}

function wrist(t: number): Point3 {
  const arrive = (ARM_X - CARTON.w / 2 - START_X) / SPEED;
  const phase = ((((t - arrive) % PERIOD) + PERIOD) % PERIOD) / PERIOD;
  const toTote = ease((phase - 0.12) / 0.3);
  const back = ease((phase - 0.62) / 0.3);
  const across = toTote - back;
  const y = 43 + across * 19.5;
  const dip = Math.max(0, 1 - Math.abs(phase < 0.5 ? phase : phase - 1) / 0.1);
  const pick = Math.max(0, 1 - Math.abs(phase - 0.47) / 0.08);
  return [ARM_X, y, 30 - dip * 8 - pick * 12 + across * 2];
}

function arm(t: number) {
  const shoulder: Point3 = [ARM_X, ARM_BASE_Y, 13];
  const hand = wrist(t);
  const elbow: Point3 = [ARM_X, (shoulder[1] + hand[1]) / 2 + 3, Math.max(shoulder[2], hand[2]) + 5];
  const d = pathOf([at(shoulder), at(elbow), at(hand)]);
  const grip: Plan = { x: hand[0] - 2.5, y: hand[1] - 1.5, w: 5, d: 3, r: 0.3 };
  const fingers = [-1.6, 1.6].map((fx) => pathOf([at([hand[0] + fx, hand[1], hand[2] - 1]), at([hand[0] + fx, hand[1], hand[2] - 4])])).join("");
  return (
    `<path class="pl-arm" d="${d}"/><path class="pl-arm-core" d="${d}"/>` +
    dotsSvg([at(shoulder), at(elbow)], { size: 1.6, tone: "hi" }) +
    solid(grip, hand[2] - 1, 2, { tone: "hi" }, 0.2) +
    lineSvg(fingers, { tone: "hi" })
  );
}

function packingLine(t: number): { items: Drawn[]; beam: string } {
  const items: Drawn[] = [];
  let scanning = false;
  for (let i = Math.floor((t - 8) / PERIOD); i <= Math.floor(t / PERIOD); i++) {
    const age = t - i * PERIOD;
    if (age < 0) continue;
    const x = START_X + SPEED * age;
    if (x > END_X + 4) continue;
    const centre = x + CARTON.w / 2;
    if (centre > SCAN_X - 6 && centre < SCAN_X + 4) scanning = true;
    const opacity = Math.min(clamp((x - START_X) / 8), 1 - clamp((x - (END_X - 14)) / 14));
    items.push(carton(x, { scanned: centre > SCAN_X, packed: centre > ARM_X + 2 }, opacity));
  }
  const beam = scanning ? [41.5, 43.5, 45.5].map((sy) => `<path class="iso-line" data-tone="lit" data-flow="" d="${pathOf([at([SCAN_X - 1.5, sy, 30]), at([SCAN_X - 1.5, sy, BELT_Z + CARTON.h])])}"/>`).join("") : "";
  return { items, beam };
}

/* ---------- the camera ---------- */

/** World x the camera looks at, easing from act to act as the box travels. */
function focusX(t: number) {
  const A = 150;
  const B = 345;
  const C = 575;
  if (t < 6.2) return A;
  if (t < 9.4) return A + (B - A) * span(t, 6.2, 9.4);
  if (t < 15) return B;
  if (t < 18.2) return B + (C - B) * span(t, 15, 18.2);
  if (t < 28.2) return C;
  return C + (A - C) * span(t, 28.2, 30);
}

/** Top-left of the camera's window in scene pixels. */
export function cameraAt(t: number, window = WINDOW): [number, number] {
  const [fx, fy] = at([focusX(t), 40, 0]);
  return [clamp01(fx - window / 2, 0, WIDTH - window), clamp01(fy - VIEW_H * 0.62, 0, HEIGHT - VIEW_H)];
}

/* ---------- callouts ---------- */

export interface Callout {
  id: string;
  from: number;
  to: number;
  point: Point3;
  kicker: string;
  /** i18n key under home.hero.journey. */
  key: string;
}

export const CALLOUTS: Callout[] = [
  { id: "pond", from: 0.6, to: 4.8, point: [34, 24, 4], kicker: "Sourcing", key: "pond" },
  { id: "line", from: 3.2, to: 7.6, point: [118, 30, 30], kicker: "Quality", key: "line" },
  { id: "booking", from: 8.4, to: 12.2, point: [334, 43, 12], kicker: "Logistics", key: "booking" },
  { id: "ship", from: 12.6, to: 17.2, point: [400, 42, 26], kicker: "Sales", key: "ship" },
  { id: "customs", from: 20.0, to: 24.0, point: [512, 42, 28], kicker: "Customs", key: "customs" },
  { id: "delivered", from: 25.2, to: 29.4, point: [650, 38, 22], kicker: "Warehouse", key: "delivered" }
];

export const calloutPx = (c: Callout) => at(c.point);

/* ---------- the frame ---------- */

export function frame(t: number) {
  const [cam] = cameraAt(t);
  const margin = 140;
  const visible = (item: Drawn) => {
    const [x0, , x1] = screenRect(item.box, P);
    return x1 >= cam - margin && x0 <= cam + WINDOW + margin;
  };
  const a = truckA(t);
  const b = truckB(t);
  const line = packingLine(t);
  const pose = boxPose(t);
  const cont: Drawn[] = [];
  if (pose.opacity > 0.01) {
    const plan: Plan = { x: pose.at[0], y: pose.at[1], w: CONT.w, d: CONT.d, r: 0 };
    const lit = t >= 8.4;
    cont.push({
      box: boxOf(plan, pose.at[2], pose.at[2] + CONT.h),
      svg: wrap(solidSvg(slabOf(plan, pose.at[2], CONT.h, P, 2, 0.3), { tone: "hi", lit, inner: lineSvg(sideSeam(plan, pose.at[2] + 2.4, P, 2), { tone: "faint" }) }), pose.opacity)
    });
  }
  const items = [
    ...STATIC,
    ...line.items,
    ...ship(t),
    ...truckSvg(a),
    ...truckSvg(b),
    ...craneRig(crane1(t), [316, 412]),
    ...craneRig(crane2(t), [462, 566]),
    ...cont
  ].filter(visible);
  return ground + painted(items, P) + line.beam + (cam < at([ARM_X + 20, 40, 0])[0] ? arm(t) : "");
}

/** The frame the server and reduced motion show: the box mid-lift at the first quay. */
export const STILL = 10.4;
