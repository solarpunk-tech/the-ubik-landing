import {
  cylinder,
  depthOf,
  dotsSvg,
  extrude,
  faceTextSvg,
  fadeLineSvg,
  fitProjection,
  insetPlan,
  iso,
  lineOnTop,
  lineSvg,
  pathOf,
  planOutline,
  ringSeam,
  sideMatrix,
  sideRing,
  sideSeam,
  slabOf,
  solidSvg,
  topTicks,
  wireSvg,
  type Plan,
  type Plane,
  type Point3,
  type Projection,
  type SolidStyle,
  translateAlong
} from "@/lib/iso/iso-kit";
import { BOX, LEVEL } from "./model";

/*
 * A berth in miniature. Water at the back, the ship alongside, the quay in
 * front with its crane rails, a ship-to-shore crane spanning the truck lane,
 * a chassis under the crane and a gate booth at the lane's end. World units
 * are half a metre: x along the quay, y from the water inland, z up.
 */

export const WIDTH = 640;
export const HEIGHT = 420;
const AZIMUTH = 62;
const ELEVATION = 40;

export type Box = [number, number, number, number, number, number];
export interface Item {
  id: string;
  box: Box;
  svg: string;
}

const QUAY_Z = 12;
const WATER: Plan = { x: 34, y: -40, w: 238, d: 78, r: 0 };
const QUAY: Plan = { x: 34, y: 38, w: 238, d: 108, r: 1.5 };
const RAILS = [52, 113];
const LANE: [number, number] = [70, 78.6];

const HULL: Plane[] = [
  [60, -19],
  [230, -19],
  [262, 4.5],
  [230, 28],
  [60, 28]
];
const DECK_Z = 22;
const BAYS = [93.2, 119.6, 145.8, 172.2, 198.6];
const ROW_Y = (row: number) => -15.5 + row * BOX.wide;
export const PICK = { bay: 2, row: 3 };
// Tiers per bay and row. The pickup stack keeps two under the box, and the rows in front of it stay low so the box clears them.
const TIERS = [
  [3, 3, 4, 4, 3, 3, 2, 1],
  [2, 4, 4, 3, 3, 4, 3, 2],
  [3, 3, 2, 2, 2, 2, 1, 1],
  [4, 4, 3, 3, 4, 3, 3, 2],
  [2, 3, 3, 2, 2, 3, 2, 1]
];

const LEG_X = [138, 174];
const LEG_Y = [50, 111];
const PORTAL_Z = 78;
const BOOM_Z: [number, number] = [84, 91];
const BOOM_Y: [number, number] = [-42, 134];
const GIRDER_X = [136.5, 175.5];

export const BOX_PLAN: Plan = { x: BAYS[PICK.bay], y: ROW_Y(PICK.row), w: BOX.long, d: BOX.wide, r: 0 };
const TRAILER_X = 145;
const POST: Plan = { x: 240, y: 80, w: 3, d: 3, r: 0 };
export const PIVOT: Point3 = [241.5, 80, 20.4];
export const ARM_LENGTH = 16;
export const PIN_AT: Plane[] = [
  [226.4, 90.5],
  [228.4, 90.5],
  [230.4, 90.5]
];
export const PIN_BASE = 31.4;
export const PIN_RISE = 3.4;

const span = ({ x, y, w, d }: Plan, z0: number, z1: number): Point3[] => {
  const out: Point3[] = [];
  for (const px of [x, x + w]) for (const py of [y, y + d]) for (const z of [z0, z1]) out.push([px, py, z]);
  return out;
};

export const P: Projection = fitProjection(
  [
    ...span(WATER, 0, 3),
    ...span(QUAY, 0, QUAY_Z),
    ...span({ x: 136, y: 103.5, w: 44, d: 4, r: 0 }, 122, 125),
    ...span({ x: 136.5, y: BOOM_Y[0], w: 43.5, d: BOOM_Y[1] - BOOM_Y[0], r: 0 }, BOOM_Z[0], BOOM_Z[1])
  ],
  WIDTH,
  HEIGHT,
  { pad: 10, azimuth: AZIMUTH, elevation: ELEVATION }
);

export const at = (point: Point3) => iso(point, P);
export const translate = (by: number[]) => translateAlong(P, by as Point3);
const boxOf = ({ x, y, w, d }: Plan, z0: number, z1: number): Box => [x, y, z0, x + w, y + d, z1];
const slab = (plan: Plan, z: number, h: number, style: SolidStyle = {}, steps = 2, bevel = 0) =>
  solidSvg(slabOf(plan, z, h, P, steps, bevel), { tone: "mid", ...style });
const line = (points: Point3[], tone: "hi" | "mid" | "lo" | "faint" = "lo") => lineSvg(pathOf(points.map(at)), { tone });

/** Corrugation on the faces you can see, door bars on the +x end, tier seams wrapping the corners. */
function containerDetail(plan: Plan, z0: number, tiers: number) {
  const { x, y, w, d } = plan;
  const top = z0 + tiers * BOX.high;
  const ribs: string[] = [];
  for (let rx = x + 1.2; rx < x + w - 0.6; rx += 1.6) ribs.push(pathOf([at([rx, y + d, z0]), at([rx, y + d, top])]));
  for (const ry of [y + d * 0.36, y + d * 0.64]) ribs.push(pathOf([at([x + w, ry, z0]), at([x + w, ry, top])]));
  const seams: string[] = [];
  for (let tier = 1; tier < tiers; tier++) seams.push(sideSeam(plan, z0 + tier * BOX.high, P, 2));
  return lineSvg(ribs.join(""), { tone: "faint" }) + lineSvg(seams.join(""), { tone: "lo" });
}

function containerSvg(plan: Plan, z0: number, tiers: number, lit = false) {
  const paths = slabOf(plan, z0, tiers * BOX.high, P, 2, 0.5);
  const top = z0 + tiers * BOX.high;
  const castings = [
    [plan.x + 0.6, plan.y + 0.6],
    [plan.x + plan.w - 0.6, plan.y + 0.6],
    [plan.x + 0.6, plan.y + plan.d - 0.6],
    [plan.x + plan.w - 0.6, plan.y + plan.d - 0.6]
  ].map(([px, py]) => at([px, py, top]));
  return solidSvg(paths, { tone: lit ? "hi" : "mid", lit, inner: containerDetail(plan, z0, tiers) }) + dotsSvg(castings, { size: 0.45, tone: lit ? "hi" : "mid" });
}

function water() {
  const paths = slabOf(WATER, 0, 3, P, 2);
  const waves: string[] = [];
  for (let index = 0; index < 22; index++) {
    const wx = ((index * 53) % 300) + 2;
    const wy = -42 + ((index * 29) % 34);
    if (wx < 38 || wx > 254 || (wx > 54 && wx < 268 && wy > -24)) continue;
    waves.push(fadeLineSvg([at([wx, wy, 3]), at([wx + 14, wy, 3])], { fade: [5, 5], tone: "lo" }));
  }
  return solidSvg(paths, { tone: "lo", crease: "faint", flat: true, className: "port-water" }) + waves.join("");
}

function quay() {
  const paths = slabOf(QUAY, 0, QUAY_Z, P, 4, 1);
  const ticks = topTicks(36, 270, 4, 5, QUAY.y, QUAY_Z, [1.2, 2.6], P);
  const cope = lineSvg(lineOnTop([QUAY.x, 41.5], [QUAY.x + QUAY.w, 41.5], QUAY_Z, P), { tone: "lo" });
  const joints = [96, 130, 206, 252].map((jx) => lineOnTop([jx, QUAY.y], [jx, QUAY.y + QUAY.d], QUAY_Z, P)).join("");
  const lane = LANE.map((ly) => lineOnTop([QUAY.x, ly], [QUAY.x + QUAY.w, ly], QUAY_Z, P)).join("");
  const rails = RAILS.map((ry) => solidSvg(slabOf({ x: QUAY.x + 1, y: ry - 0.7, w: QUAY.w - 2, d: 1.4, r: 0 }, QUAY_Z, 0.7, P, 2), { tone: "mid", flat: true })).join("");
  const sideTicks = [] as string[];
  for (let sx = 40; sx <= 268; sx += 16) sideTicks.push(pathOf([at([sx, QUAY.y + QUAY.d, QUAY_Z]), at([sx, QUAY.y + QUAY.d, QUAY_Z - 2.4])]));
  return (
    solidSvg(paths, { tone: "mid", halo: true }) +
    lineSvg(joints, { tone: "faint" }) +
    lineSvg(lane, { tone: "lo", dashed: true }) +
    cope +
    lineSvg(ticks.minor, { tone: "lo" }) +
    lineSvg(ticks.major, { tone: "mid" }) +
    lineSvg(sideTicks.join(""), { tone: "lo" }) +
    rails
  );
}

function hull() {
  const paths = extrude(HULL, 3, DECK_Z - 3, P, { bevel: 0.8 });
  const inner = lineSvg(ringSeam(HULL, 8, P), { tone: "lo" }) + lineSvg(ringSeam(HULL, 19.5, P), { tone: "faint" });
  const hawse = lineSvg(sideRing([250, 13.6, 16.5], 1, "x", P, 14), { tone: "mid" });
  const draft: string[] = [];
  // Draft marks: a rule up the bow plate from the hull bottom to the sheer seam, ticks hanging off it.
  const rule: Plane = [234, 25.04];
  draft.push(pathOf([at([rule[0], rule[1], 3]), at([rule[0], rule[1], 19.5])]));
  for (let dz = 5; dz <= 17; dz += 2) draft.push(pathOf([at([rule[0], rule[1], dz]), at([rule[0] + 1.6, rule[1] - 1.18, dz])]));
  return solidSvg(paths, { tone: "mid", halo: true, inner }) + hawse + lineSvg(draft.join(""), { tone: "lo" });
}

function house() {
  const body: Plan = { x: 64, y: -14, w: 24, d: 38, r: 0.5 };
  const seams = [29, 35.5, 42].map((z) => sideSeam(body, z, P, 2)).join("");
  const windows = sideSeam(body, 45.6, P, 2) + sideSeam(body, 44.2, P, 2);
  const funnel: Plan = { x: 66, y: 1.5, w: 9, d: 9, r: 2 };
  const portholes: [number, number][] = [];
  for (let px = 66; px <= 86; px += 2.5) for (const pz of [32, 38.5]) portholes.push(at([px, 24, pz]));
  return (
    slab({ x: 80, y: -17, w: 8, d: 3, r: 0 }, 45, 1.6, { tone: "mid" }) +
    solidSvg(slabOf(body, DECK_Z, 26, P, 2, 0.6), { tone: "hi", inner: lineSvg(seams, { tone: "faint" }) + lineSvg(windows, { tone: "mid" }) }) +
    dotsSvg(portholes, { size: 0.4, tone: "mid" }) +
    slab({ x: 80, y: 24, w: 8, d: 3, r: 0 }, 45, 1.6, { tone: "mid" }) +
    solidSvg(slabOf(funnel, 48, 12, P, 4, 0.4), { tone: "hi", inner: lineSvg(sideSeam(funnel, 56.5, P, 4) + sideSeam(funnel, 55, P, 4), { tone: "mid" }) }) +
    lineSvg(planOutline(insetPlan(funnel, 1.2), 60, P, 4), { tone: "lo" }) +
    slab({ x: 86.4, y: 5, w: 1.1, d: 1.1, r: 0 }, 48, 16, { tone: "mid" }) +
    slab({ x: 86.4, y: 1, w: 1.1, d: 9, r: 0 }, 60.4, 0.8, { tone: "mid" })
  );
}

function legs(): Item[] {
  const out: Item[] = [];
  for (const lx of LEG_X) {
    for (const ly of LEG_Y) {
      const leg: Plan = { x: lx, y: ly, w: 4, d: 4, r: 0 };
      const bogie: Plan = { x: lx - 3, y: ly - 1, w: 10, d: 6, r: 0.4 };
      const bands = [34, 52, 70].map((z) => sideSeam(leg, z, P, 2)).join("");
      const wheels = [lx - 0.8, lx + 4.8].map((wx) => sideRing([wx, ly + 5, 14.5], 1.5, "y", P, 16)).join("");
      const rungs: string[] = [];
      for (let rz = 20; rz < PORTAL_Z - 2; rz += 3) rungs.push(pathOf([at([lx + 4, ly + 1, rz]), at([lx + 4, ly + 3, rz])]));
      out.push({
        id: `leg-${lx}-${ly}`,
        box: [lx - 3, ly - 1, 12.7, lx + 7, ly + 5, PORTAL_Z],
        svg:
          solidSvg(slabOf(bogie, 12.7, 4.3, P, 2, 0.4), { tone: "mid" }) +
          `<path class="port-wheel" d="${wheels}"/>` +
          solidSvg(slabOf(leg, 17, PORTAL_Z - 17, P, 2), { tone: "hi", inner: lineSvg(bands, { tone: "lo" }) }) +
          lineSvg(rungs.join(""), { tone: "faint" })
      });
    }
    out.push({
      id: `sill-${lx}`,
      box: [lx, 54, 34, lx + 4, 111, 37],
      svg: slab({ x: lx, y: 54, w: 4, d: 57, r: 0 }, 34, 3, { tone: "mid" })
    });
    out.push({
      id: `cross-${lx}`,
      box: [lx - 0.5, 54.5, 79, lx + 4.5, 110.5, PORTAL_Z + 6],
      svg: slab({ x: lx - 0.5, y: 54.5, w: 5, d: 56, r: 0 }, 79, 5, { tone: "mid" })
    });
  }
  for (const ly of LEG_Y) {
    const portal: Plan = { x: 136, y: ly - 0.5, w: 44, d: 5, r: 0 };
    out.push({ id: `portal-${ly}`, box: boxOf(portal, PORTAL_Z, PORTAL_Z + 6), svg: slab(portal, PORTAL_Z, 6, { tone: "hi" }, 2, 0.5) });
  }
  return out;
}

function boom(): Item[] {
  const out: Item[] = [];
  for (const gx of GIRDER_X) {
    const girder: Plan = { x: gx, y: BOOM_Y[0], w: 4.5, d: BOOM_Y[1] - BOOM_Y[0], r: 0 };
    const face = gx + 4.5;
    const lacing: Point3[] = [];
    for (let ly = BOOM_Y[0] + 1, up = false; ly <= BOOM_Y[1] - 1; ly += 5, up = !up) lacing.push([face, ly, up ? BOOM_Z[1] : BOOM_Z[0]]);
    out.push({
      id: `girder-${gx}`,
      box: boxOf(girder, BOOM_Z[0], BOOM_Z[1]),
      svg: solidSvg(slabOf(girder, BOOM_Z[0], BOOM_Z[1] - BOOM_Z[0], P, 2, 0.5), { tone: "hi", inner: line(lacing, "lo") })
    });
    const post: Plan = { x: gx + 0.6, y: 104, w: 3, d: 3, r: 0 };
    out.push({ id: `apex-${gx}`, box: boxOf(post, BOOM_Z[1], 122), svg: slab(post, BOOM_Z[1], 122 - BOOM_Z[1], { tone: "hi" }) });
  }
  const head: Plan = { x: 136, y: 103.5, w: 44, d: 4, r: 0 };
  out.push({ id: "apex-head", box: boxOf(head, 122, 125), svg: slab(head, 122, 3, { tone: "hi" }, 2, 0.4) });
  const machinery: Plan = { x: 140, y: 117, w: 36, d: 15, r: 0.4 };
  const vents: string[] = [];
  for (let vx = 143; vx < 158; vx += 1.6) vents.push(pathOf([at([vx, 132, 93.5]), at([vx, 132, 97])]));
  out.push({
    id: "machinery",
    box: boxOf(machinery, BOOM_Z[1], 101),
    svg:
      solidSvg(slabOf(machinery, BOOM_Z[1], 10, P, 2, 0.6), { tone: "hi", inner: lineSvg(vents.join(""), { tone: "lo" }) }) +
      faceTextSvg(sideMatrix([163, 132], 96.6, P, "left"), "ubik", { size: 3.6, tone: "hi" })
  });
  return out;
}

/** Forestays and backstays: from the apex head to the boom's ends. */
function stays() {
  return GIRDER_X.map((gx) => {
    const sx = gx + 2.25;
    const head = at([sx, 105.5, 125]);
    return (
      wireSvg(head, at([sx, BOOM_Y[0] + 1, BOOM_Z[1]]), { tone: "mid", size: 0.8 }) +
      wireSvg(head, at([sx, BOOM_Y[1] - 1, BOOM_Z[1]]), { tone: "mid", size: 0.8 })
    );
  }).join("");
}

function stacks(): Item[] {
  const out: Item[] = [];
  BAYS.forEach((bx, bay) => {
    TIERS[bay].forEach((tiers, row) => {
      const plan: Plan = { x: bx, y: ROW_Y(row), w: BOX.long, d: BOX.wide, r: 0 };
      out.push({ id: `stack-${bay}-${row}`, box: boxOf(plan, DECK_Z, DECK_Z + tiers * BOX.high), svg: containerSvg(plan, DECK_Z, tiers) });
    });
  });
  return out;
}

function yard(): Item[] {
  const out: Item[] = [];
  const heights = [
    [2, 3, 1, 2, 3],
    [3, 2, 2, 1, 2],
    [1, 2, 3, 3, 2]
  ];
  [44, 70, 96].forEach((bx, bay) => {
    heights[bay].forEach((tiers, row) => {
      const plan: Plan = { x: bx, y: 124 + row * BOX.wide, w: BOX.long, d: BOX.wide, r: 0 };
      out.push({ id: `yard-${bay}-${row}`, box: boxOf(plan, QUAY_Z, QUAY_Z + tiers * BOX.high), svg: containerSvg(plan, QUAY_Z, tiers) });
    });
  });
  return out;
}

function bollards(): Item[] {
  const out: Item[] = [];
  for (let bx = 44; bx < 270; bx += 36) {
    out.push({
      id: `bollard-${bx}`,
      box: [bx - 2.1, 41, QUAY_Z, bx + 2.1, 45.2, 16.4],
      svg: solidSvg(cylinder(bx, 43.1, 1.5, QUAY_Z, 3.6, P, 16), { tone: "mid" }) + solidSvg(cylinder(bx, 43.1, 2.1, 15.6, 0.8, P, 18), { tone: "mid" })
    });
  }
  return out;
}

function poles(): Item[] {
  return [[126, 141]].map(([px, py]) => {
    const pole: Plan = { x: px, y: py, w: 1.4, d: 1.4, r: 0 };
    const head: Plan = { x: px - 2.2, y: py - 0.8, w: 5.8, d: 3, r: 0.3 };
    return {
      id: `pole-${px}`,
      box: [px - 2.2, py - 0.8, QUAY_Z, px + 3.6, py + 2.2, 66],
      svg:
        solidSvg(cylinder(px + 0.7, py + 0.7, 1.6, QUAY_Z, 1.4, P, 16), { tone: "mid" }) +
        slab(pole, QUAY_Z + 1.4, 50.6, { tone: "hi" }) +
        slab(head, 64, 2, { tone: "hi" })
    };
  });
}

/** Static parts of the gate: booth, roof, the pin block, the barrier post with its lamp housing. */
function gate(): Item[] {
  const booth: Plan = { x: 222, y: 86, w: 12, d: 10, r: 0.5 };
  const roof: Plan = { x: 221, y: 85, w: 14, d: 12, r: 0.5 };
  const block: Plan = { x: 224.6, y: 88.4, w: 7.6, d: 4.2, r: 0.4 };
  const door = pathOf([at([225, 96, 12]), at([225, 96, 22]), at([229, 96, 22]), at([229, 96, 12])]);
  const holes = PIN_AT.map(([px, py]) => lineOnTop([px - 0.9, py], [px + 0.9, py], PIN_BASE, P)).join("");
  return [
    {
      id: "booth",
      box: [221, 85, QUAY_Z, 235, 97, PIN_BASE],
      svg:
        solidSvg(slabOf(booth, QUAY_Z, 16, P, 2, 0.5), {
          tone: "hi",
          inner: lineSvg(sideSeam(booth, 25, P, 2) + sideSeam(booth, 21.4, P, 2), { tone: "mid" }) + lineSvg(door, { tone: "lo" })
        }) +
        solidSvg(slabOf(roof, 28, 1.6, P, 2, 0.5), { tone: "mid" }) +
        solidSvg(slabOf(block, 29.6, PIN_BASE - 29.6, P, 2, 0.3), { tone: "mid", inner: lineSvg(holes, { tone: "faint" }) })
    },
    {
      id: "post",
      box: boxOf(POST, QUAY_Z, 22.4),
      svg: slab(POST, QUAY_Z, 10.4, { tone: "hi" }, 2, 0.4) + dotsSvg([at([241.5, 83, 20.4])], { size: 0.6, tone: "hi" })
    }
  ];
}

export const PIN_BOX: Box = [225, 89.6, PIN_BASE, 231.8, 91.4, PIN_BASE + PIN_RISE];
export const LAMP_PLAN: Plan = { x: 240.2, y: 80.2, w: 2.6, d: 2.6, r: 0 };

/** Paths that change with the pose, built per frame from the same kit. */
export function pinsSvg(rise: [number, number, number]) {
  return PIN_AT.map(([px, py], index) =>
    solidSvg(cylinder(px, py, 0.85, PIN_BASE, 0.15 + PIN_RISE * rise[index], P, 14), { tone: "hi", lit: rise[index] > 0.98 })
  ).join("");
}

export function lampSvg() {
  return solidSvg(slabOf(LAMP_PLAN, 22.4, 2.6, P, 2, 0.3), { tone: "hi", className: "port-lamp" });
}

export function armEnd(lift: number): Point3 {
  const angle = (lift * Math.PI) / 2;
  return [PIVOT[0], PIVOT[1] - Math.cos(angle) * ARM_LENGTH, PIVOT[2] + Math.sin(angle) * ARM_LENGTH];
}

export function armPath(lift: number) {
  return pathOf([at(PIVOT), at(armEnd(lift))]);
}

export function ropesPath(trolley: number, spreaderFloor: number) {
  const out: string[] = [];
  for (const rx of [150, 166]) {
    for (const ry of [-0.1, 3.3]) out.push(pathOf([at([rx, ry + trolley, 85]), at([rx, ry + trolley, spreaderFloor + 3])]));
  }
  return out.join("");
}

/** Moving parts, drawn once at their rest place and moved with a translate. */
export const BOX_SVG = containerSvg(BOX_PLAN, LEVEL.onShip, 1, true);

const SPREADER: Plan = { x: BOX_PLAN.x - 0.6, y: BOX_PLAN.y - 0.3, w: BOX.long + 1.2, d: BOX.wide + 0.6, r: 0 };
export const SPREADER_REST = LEVEL.onShip + BOX.high;
export const SPREADER_SVG =
  solidSvg(slabOf(SPREADER, SPREADER_REST, 1.4, P, 2, 0.3), { tone: "hi" }) +
  solidSvg(slabOf({ x: 152, y: BOX_PLAN.y + 0.3, w: 12, d: 3.6, r: 0.3 }, SPREADER_REST + 1.4, 1.6, P, 2, 0.3), { tone: "hi" });

const TROLLEY: Plan = { x: 141, y: BOX_PLAN.y - 1, w: 34, d: 6.9, r: 0 };
const CAB: Plan = { x: 141.4, y: BOX_PLAN.y - 0.4, w: 3.8, d: 5, r: 0.3 };
export const TROLLEY_SVG =
  solidSvg(slabOf(CAB, 78.4, 6.6, P, 2, 0.3), { tone: "hi", inner: lineSvg(sideSeam(CAB, 82.4, P, 2) + sideSeam(CAB, 80.6, P, 2), { tone: "mid" }) }) +
  solidSvg(slabOf(TROLLEY, 85, 4, P, 2, 0.4), { tone: "hi" }) +
  dotsSvg(
    [143, 173].flatMap((wx) => [at([wx, TROLLEY.y + TROLLEY.d, 86.2])]),
    { size: 0.55, tone: "hi" }
  );

const TRAILER: Plan = { x: TRAILER_X, y: 71.8, w: 26, d: 4.4, r: 0 };
const wheel = (wx: number) => sideRing([wx, 76.4, 14.3], 2.1, "y", P, 20);
const hub = (wx: number) => sideRing([wx, 76.6, 14.3], 0.8, "y", P, 12);
export const TRAILER_SVG =
  `<path class="port-wheel" d="${[148.4, 153.4].map(wheel).join("")}"/>` +
  lineSvg([148.4, 153.4].map(hub).join(""), { tone: "mid" }) +
  slab({ x: 164.5, y: 72.4, w: 1, d: 1, r: 0 }, 12, 3, { tone: "mid" }) +
  solidSvg(slabOf(TRAILER, 15, 2.6, P, 2, 0.4), {
    tone: "hi",
    inner: lineSvg(
      [150, 156, 162, 168].map((rx) => pathOf([at([rx, 76.2, 15]), at([rx, 76.2, 17.6])])).join(""),
      { tone: "faint" }
    )
  });

const CAB_BODY: Plan = { x: 173.4, y: 71.3, w: 8, d: 5.4, r: 0.8 };
export const CAB_SVG =
  `<path class="port-wheel" d="${[174.6, 180].map(wheel).join("")}"/>` +
  lineSvg([174.6, 180].map(hub).join(""), { tone: "mid" }) +
  slab({ x: 171, y: 72, w: 12, d: 4, r: 0 }, 13.5, 2, { tone: "mid" }) +
  slab({ x: 172.2, y: 71.6, w: 0.8, d: 0.8, r: 0 }, 15.5, 11.5, { tone: "mid" }) +
  solidSvg(slabOf(CAB_BODY, 15.5, 9.5, P, 4, 0.5), {
    tone: "hi",
    inner: lineSvg(sideSeam(CAB_BODY, 22.6, P, 4) + sideSeam(CAB_BODY, 20.2, P, 4), { tone: "mid" })
  });

export const BACKGROUND = water();
export const OVERLAY = stays();

export const STATIC: Item[] = [
  { id: "quay", box: boxOf(QUAY, 0, QUAY_Z), svg: quay() },
  { id: "hull", box: [60, -19, 3, 262, 28, DECK_Z], svg: hull() },
  { id: "house", box: [64, -17, DECK_Z, 88, 27, 64], svg: house() },
  ...stacks(),
  ...yard(),
  ...bollards(),
  ...poles(),
  ...legs(),
  ...boom(),
  ...gate()
];

/** Boxes of the moving parts in a pose. */
export function movingBoxes(pose: { trolley: number; spreader: number; box: number; boxOnTruck: boolean; truck: number; arm: number }): Record<string, Box> {
  const dx = pose.boxOnTruck ? pose.truck : 0;
  const dy = pose.boxOnTruck ? 72.3 : pose.trolley;
  const end = armEnd(pose.arm);
  return {
    box: [BOX_PLAN.x + dx, BOX_PLAN.y + dy, pose.box, BOX_PLAN.x + BOX.long + dx, BOX_PLAN.y + BOX.wide + dy, pose.box + BOX.high],
    spreader: [SPREADER.x, SPREADER.y + pose.trolley, pose.spreader, SPREADER.x + SPREADER.w, SPREADER.y + SPREADER.d + pose.trolley, pose.spreader + 3],
    trolley: [141, TROLLEY.y + pose.trolley, 78.4, 175, TROLLEY.y + TROLLEY.d + pose.trolley, 89],
    trailer: [TRAILER_X + pose.truck, 71.3, QUAY_Z, 171 + pose.truck, 76.6, 17.6],
    cab: [171 + pose.truck, 71.3, QUAY_Z, 183 + pose.truck, 76.7, 27],
    pins: PIN_BOX,
    lamp: [LAMP_PLAN.x, LAMP_PLAN.y, 22.4, LAMP_PLAN.x + LAMP_PLAN.w, LAMP_PLAN.y + LAMP_PLAN.d, 25],
    arm: [PIVOT[0] - 0.6, Math.min(PIVOT[1], end[1]) - 0.4, PIVOT[2] - 0.6, PIVOT[0] + 0.6, PIVOT[1] + 0.4, Math.max(PIVOT[2], end[2]) + 0.6]
  };
}

/*
 * Painter's order. Two boxes that don't intersect have a plane between them,
 * and the one on the viewer's side of any such plane is nearer; when they
 * overlap on screen, every separating plane gives the same answer. So:
 * for each pair that overlaps on screen, the first separating axis decides,
 * and a topological sort (nearest-last, ties by depth) gives the order.
 */
const EPS = 0.01;
function behind(a: Box, b: Box) {
  for (let axis = 0; axis < 3; axis++) {
    if (a[axis + 3] <= b[axis] + EPS) return true;
    if (b[axis + 3] <= a[axis] + EPS) return false;
  }
  return depthOf(centre(a), P) < depthOf(centre(b), P);
}
const centre = (b: Box): Point3 => [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2];
function screenRect(b: Box) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) {
    const [sx, sy] = at([x, y, z]);
    x0 = Math.min(x0, sx);
    y0 = Math.min(y0, sy);
    x1 = Math.max(x1, sx);
    y1 = Math.max(y1, sy);
  }
  return [x0, y0, x1, y1];
}
const STATIC_RECTS = new Map(STATIC.map((item) => [item.id, screenRect(item.box)]));

export function orderOf(boxes: { id: string; box: Box }[]): string[] {
  const rects = boxes.map((item) => STATIC_RECTS.get(item.id) ?? screenRect(item.box));
  const count = boxes.length;
  const after: number[][] = Array.from({ length: count }, () => []);
  const needs = new Array(count).fill(0);
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const a = rects[i];
      const b = rects[j];
      if (a[2] <= b[0] || b[2] <= a[0] || a[3] <= b[1] || b[3] <= a[1]) continue;
      if (behind(boxes[i].box, boxes[j].box)) {
        after[i].push(j);
        needs[j]++;
      } else {
        after[j].push(i);
        needs[i]++;
      }
    }
  }
  const depth = boxes.map((item) => depthOf(centre(item.box), P));
  const ready = new Set<number>();
  for (let i = 0; i < count; i++) if (!needs[i]) ready.add(i);
  const order: string[] = [];
  const done = new Set<number>();
  while (done.size < count) {
    let pick = -1;
    for (const i of ready) if (pick < 0 || depth[i] < depth[pick]) pick = i;
    if (pick < 0) {
      // A cycle: take the farthest remaining item and carry on.
      for (let i = 0; i < count; i++) if (!done.has(i) && (pick < 0 || depth[i] < depth[pick])) pick = i;
    }
    ready.delete(pick);
    done.add(pick);
    order.push(boxes[pick].id);
    for (const next of after[pick]) if (--needs[next] === 0 && !done.has(next)) ready.add(next);
  }
  return order;
}
