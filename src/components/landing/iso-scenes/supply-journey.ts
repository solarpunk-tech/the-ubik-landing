import {
  cylinder,
  dotsSvg,
  extrude,
  fadeLineSvg,
  fitProjection,
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
import { painted, type Box, type Drawn } from "@/lib/iso/order";

/*
 * One shipment's journey, left to right: a farm pond and its harvest crates,
 * the processing plant with a vision camera watching the dock, the cold
 * store, a truck on the road, the port crane, the ship, and a freighter
 * overhead. The one lit part is the box being carried, on the truck.
 */

export const WIDTH = 1200;
export const HEIGHT = 300;
export const LOOP = 18;

const LAND: Plan = { x: -4, y: 0, w: 372, d: 52, r: 1 };
const WATER: Plan = { x: 368, y: 0, w: 112, d: 52, r: 0 };

const P = fitProjection(
  [
    [-4, 0, -3],
    [-4, 52, -3],
    [480, 0, -3],
    [480, 52, -3],
    [160, 20, 78],
    [460, 20, 78],
    [330, 15, 52]
  ],
  WIDTH,
  HEIGHT,
  { pad: 8, azimuth: 74, elevation: 26 }
);

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

/* ---------- ground ---------- */

const ground = (() => {
  const land = solidSvg(slabOf(LAND, -3, 3, P, 4, 0.6), { tone: "lo" });
  const water = solidSvg(slabOf(WATER, -3, 2, P, 2), { tone: "lo", flat: true, className: "port-water" });
  const waves: string[] = [];
  for (let i = 0; i < 14; i++) {
    const wx = 372 + ((i * 37) % 100);
    const wy = 4 + ((i * 19) % 44);
    if (wx > 386 && wx < 456 && wy > 8 && wy < 36) continue;
    waves.push(fadeLineSvg([at([wx, wy, -1]), at([wx + 9, wy, -1])], { fade: [3, 3], tone: "lo" }));
  }
  const road = solidSvg(slabOf({ x: 206, y: 30, w: 100, d: 13, r: 0 }, 0, 0.4, P, 2), { tone: "lo", flat: true }) +
    lineSvg(lineOnTop([206, 36.5], [306, 36.5], 0.4, P), { tone: "lo", dashed: true });
  const pond: Plan = { x: 4, y: 10, w: 44, d: 30, r: 6 };
  const ripples = [4, 8, 12].map((r) => lineSvg(planOutline(insetPlan(pond, r), 0.6, P, 6), { tone: "faint" })).join("");
  return land + water + waves.join("") + road + solidSvg(slabOf(pond, 0, 0.6, P, 6), { tone: "lo", flat: true, className: "port-water" }) + ripples;
})();

/* ---------- static parts ---------- */

const STATIC: Drawn[] = [];

// Farm: an aerator on the pond and the harvest crates by its bank.
STATIC.push({
  box: [24, 22, 0, 30, 28, 6],
  svg: solidSvg(cylinder(27, 25, 3, 0.6, 2, P, 18, 0.3), { tone: "hi" }) + lineSvg(pathOf([at([22, 25, 3]), at([32, 25, 3])]) + pathOf([at([27, 20, 3]), at([27, 30, 3])]), { tone: "mid" })
});
for (const [cx, cy, cz] of [[54, 14, 0], [62, 14, 0], [54, 22, 0], [62, 22, 0], [58, 18, 5], [54, 30, 0]] as const) {
  const crate: Plan = { x: cx, y: cy, w: 7, d: 7, r: 0 };
  STATIC.push(item(crate, cz, 5, { tone: "hi" }, 0.3, lineSvg(sideSeam(crate, cz + 2.5, P, 2), { tone: "faint" })));
}

// Plant: the hall, roof units, a chimney, and the dock doors on its front.
const HALL: Plan = { x: 80, y: 6, w: 72, d: 32, r: 0.5 };
const doors = [92, 108, 124].map((dx) => pathOf([at([dx, 38, 0]), at([dx, 38, 12]), at([dx + 10, 38, 12]), at([dx + 10, 38, 0])])).join("");
const slats: string[] = [];
for (const dx of [92, 108, 124]) for (let sz = 3; sz < 12; sz += 3) slats.push(pathOf([at([dx, 38, sz]), at([dx + 10, 38, sz])]));
STATIC.push(item(HALL, 0, 24, { tone: "hi" }, 0.6, lineSvg(sideSeam(HALL, 20, P, 2) + sideSeam(HALL, 17.6, P, 2), { tone: "lo" }) + lineSvg(doors, { tone: "mid" }) + lineSvg(slats.join(""), { tone: "faint" })));
for (const ux of [86, 100, 114]) STATIC.push(item({ x: ux, y: 12, w: 9, d: 7, r: 0.3 }, 24, 4, { tone: "hi" }, 0.3, lineSvg(sideSeam({ x: ux, y: 12, w: 9, d: 7, r: 0.3 }, 26, P, 2), { tone: "faint" })));
STATIC.push({ box: [136, 14, 24, 144, 22, 46], svg: solidSvg(cylinder(140, 18, 3.4, 24, 22, P, 24, 0.4), { tone: "hi", inner: lineSvg(pathOf([at([142.4, 20.4, 40]), at([142.4, 20.4, 42])]), { tone: "lo" }) }) });
// Vision camera on a mast by the dock: the Labs piece, its lens lit.
STATIC.push({
  box: [156, 42, 0, 162, 47, 28],
  svg:
    solid({ x: 157.6, y: 43.6, w: 1.6, d: 1.6, r: 0 }, 0, 24, { tone: "hi" }, 0) +
    solid({ x: 156, y: 42, w: 6, d: 4.4, r: 0.4 }, 24, 3.6, { tone: "hi" }, 0.3) +
    dotsSvg([at([159, 46.4, 25.8])], { size: 1.3, tone: "hi" }) +
    `<path class="iso-line" data-tone="lit" data-dashed="" d="${pathOf([at([159, 46.4, 25.8]), at([150, 50, 0.4])])}"/>`
});

// Cold store: a tall ribbed box with reefer units on the roof.
const COLD: Plan = { x: 172, y: 8, w: 28, d: 30, r: 0.5 };
const ribs: string[] = [];
for (let rx = 174; rx < 200; rx += 2.6) ribs.push(pathOf([at([rx, 38, 0]), at([rx, 38, 34])]));
STATIC.push(item(COLD, 0, 34, { tone: "hi" }, 0.6, lineSvg(ribs.join(""), { tone: "faint" })));
STATIC.push(item({ x: 178, y: 14, w: 7, d: 7, r: 0.3 }, 34, 4, { tone: "hi" }, 0.3));
STATIC.push(item({ x: 188, y: 14, w: 7, d: 7, r: 0.3 }, 34, 4, { tone: "hi" }, 0.3));

// Port: the quay, a stack of boxes and a crane whose boom reaches over the water.
const QUAY: Plan = { x: 306, y: 0, w: 62, d: 52, r: 0.5 };
STATIC.push(item(QUAY, 0, 6, { tone: "mid" }, 0.6));
for (const [sx, sy, tiers] of [[310, 4, 3], [310, 9, 2], [310, 14, 1], [310, 40, 2], [310, 45, 1]] as const) {
  const stack: Plan = { x: sx, y: sy, w: 14, d: 5, r: 0 };
  const seams = Array.from({ length: tiers - 1 }, (_, i) => sideSeam(stack, 6 + (i + 1) * 5, P, 2)).join("");
  STATIC.push(item(stack, 6, tiers * 5, { tone: "hi" }, 0.3, lineSvg(seams, { tone: "lo" })));
}
for (const lx of [334, 356]) for (const ly of [10, 30]) STATIC.push(item({ x: lx, y: ly, w: 2.4, d: 2.4, r: 0 }, 6, 38, { tone: "hi" }, 0));
for (const ly of [10, 30]) STATIC.push(item({ x: 332, y: ly - 0.3, w: 28, d: 3, r: 0 }, 44, 3, { tone: "hi" }, 0.3));
for (const gy of [14, 25]) {
  const lacing: Point3[] = [];
  for (let gx = 322, up = false; gx <= 404; gx += 4, up = !up) lacing.push([gx, gy + 2, up ? 52 : 47]);
  STATIC.push(item({ x: 320, y: gy, w: 86, d: 2, r: 0 }, 47, 5, { tone: "hi" }, 0.3, lineSvg(pathOf(lacing.map(at)), { tone: "lo" })));
}

/* ---------- moving parts ---------- */

const HULL: Plane[] = [
  [386, 8],
  [446, 8],
  [462, 21],
  [446, 34],
  [386, 34]
];

function ship(t: number): Drawn[] {
  const dx = Math.sin((t / LOOP) * Math.PI * 2) * 3;
  const ring = HULL.map(([x, y]) => [x + dx, y] as Plane);
  const out: Drawn[] = [
    {
      box: [386 + dx, 8, -1, 462 + dx, 34, 9],
      svg: solidSvg(extrude(ring, -1, 10, P, { bevel: 0.6 }), { tone: "mid", halo: true, inner: lineSvg(ringSeam(ring, 3, P), { tone: "lo" }) })
    },
    item({ x: 388 + dx, y: 12, w: 10, d: 18, r: 0.3 }, 9, 14, { tone: "hi" }, 0.4, lineSvg(sideSeam({ x: 388 + dx, y: 12, w: 10, d: 18, r: 0.3 }, 20, P, 2), { tone: "mid" }))
  ];
  for (let bx = 402; bx < 440; bx += 13) {
    for (const [ry, tiers] of [[11, 2], [16, 3], [21, 3], [26, 2]] as const) {
      const stack: Plan = { x: bx + dx, y: ry, w: 12, d: 5, r: 0 };
      out.push(item(stack, 9, tiers * 4.4, { tone: "hi" }, 0.3, lineSvg(sideSeam(stack, 9 + 4.4, P, 2), { tone: "faint" })));
    }
  }
  return out;
}

function truck(t: number): Drawn[] {
  // Out of the cold store, along the road to the quay, then fade and come again.
  const share = (t % (LOOP / 2)) / (LOOP / 2);
  const x = 200 + ease(share / 0.8) * 92;
  const fade = Math.min(clamp(share / 0.08), 1 - clamp((share - 0.84) / 0.12));
  const wrap = (svg: string) => (fade < 1 ? `<g opacity="${fade.toFixed(2)}">${svg}</g>` : svg);
  const box: Plan = { x, y: 32, w: 16, d: 5, r: 0 };
  const cab: Plan = { x: x + 17, y: 31.6, w: 6, d: 5.8, r: 0.6 };
  const wheels = [x + 3, x + 7, x + 19].map((wx) => pathOf(Array.from({ length: 12 }, (_, i) => at([wx + Math.cos((i / 12) * Math.PI * 2) * 1.6, 37.2, 1.6 + Math.sin((i / 12) * Math.PI * 2) * 1.6])), true)).join("");
  return [
    { box: [x, 31.6, 0, x + 16.5, 37.4, 3.4], svg: wrap(`<path class="port-wheel" d="${wheels}"/>` + solid({ x, y: 32, w: 16.5, d: 5, r: 0 }, 2, 1.4, { tone: "hi" }, 0.2)) },
    { box: [x, 32, 3.4, x + 16, 37, 9.4], svg: wrap(solidSvg(slabOf(box, 3.4, 6, P, 2, 0.3), { tone: "hi", lit: true, inner: lineSvg(sideSeam(box, 6.4, P, 2), { tone: "faint" }) })) },
    { box: [x + 17, 31.6, 1.6, x + 23, 37.4, 9.6], svg: wrap(solidSvg(slabOf(cab, 1.6, 8, P, 4, 0.4), { tone: "hi", inner: lineSvg(sideSeam(cab, 7, P, 4), { tone: "mid" }) })) }
  ];
}

/** The freighter overhead: fuselage, wings and tail, crossing right to left. */
function plane(t: number) {
  const share = (t % LOOP) / LOOP;
  const x = 470 - share * 330;
  const z = 66 + Math.sin(share * Math.PI) * 6;
  const fade = Math.min(clamp(share / 0.08), 1 - clamp((share - 0.88) / 0.1));
  const body: Plan = { x: x - 22, y: 18, w: 44, d: 5, r: 2.4 };
  const svg =
    solid({ x: x - 4, y: 4, w: 9, d: 33, r: 1 }, z + 1.4, 0.9, { tone: "hi" }, 0.2) +
    solidSvg(slabOf(body, z, 5, P, 6, 0.5), { tone: "hi", inner: lineSvg(sideSeam(body, z + 3.2, P, 6), { tone: "faint" }) }) +
    solid({ x: x + 16, y: 19.6, w: 5, d: 1.8, r: 0.4 }, z + 5, 6, { tone: "hi" }, 0.2) +
    solid({ x: x + 15, y: 13, w: 5, d: 15, r: 0.6 }, z + 3.6, 0.8, { tone: "hi" }, 0.2) +
    dotsSvg([-14, -10, -6, 2, 6, 10].map((wx) => at([x + wx, 23, z + 3.4])), { size: 0.45, tone: "mid" });
  return `<g opacity="${fade.toFixed(2)}">${svg}</g>`;
}

export function frame(t: number) {
  return ground + painted([...STATIC, ...ship(t), ...truck(t)], P) + plane(t);
}

export const STILL = 4.2;
