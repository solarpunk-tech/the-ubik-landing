import { cylinder, dotsSvg, fitProjection, iso, lineOnTop, lineSvg, pathOf, sideSeam, slabOf, solidSvg, type Plan, type Point3 } from "@/lib/iso/iso-kit";
import { painted, type Box, type Drawn } from "@/lib/iso/order";
import { HEIGHT, WIDTH, box, clamp, ease, faded, plinthOf, slabWith } from "./note-kit";

/*
 * The Invisible Drift: two model towers read the same record, a monitor gate
 * checks their readings, and every third record they disagree on leaves the
 * belt for the review tray.
 */

export { HEIGHT, WIDTH };

const BELT: Plan = { x: 0, y: 0, w: 150, d: 12, r: 0 };
const BELT_Z = 9;
const DOC = { w: 11, d: 8, h: 2.4 };
const GATE_X = 70;
const SPLIT_X = 108;
const TRAY: Plan = { x: 100, y: 20, w: 22, d: 14, r: 0.5 };
const SPEED = 18;
const PERIOD = 2;
export const LOOP = PERIOD * 3 * 5;
export const STILL = 3.4;

const P = fitProjection(
  [
    [-10, -34, -3],
    [160, -34, -3],
    [-10, 40, -3],
    [160, 40, -3],
    [GATE_X, 6, 40],
    [40, -26, 34]
  ],
  WIDTH,
  HEIGHT,
  { pad: 10, azimuth: 52, elevation: 32 }
);
const at = (point: Point3) => iso(point, P);
const slab = slabWith(P);

const plinth = plinthOf(P, { x: -10, y: -34, w: 170, d: 74, r: 1.5 });
const rollers: string[] = [];
for (let rx = 3; rx < BELT.w; rx += 5) rollers.push(lineOnTop([rx, 0.6], [rx, BELT.d - 0.6], BELT_Z, P));
const belt: Drawn = {
  box: box(BELT, 6, BELT_Z),
  svg: solidSvg(slabOf(BELT, 6, BELT_Z - 6, P, 2, 0.4), { tone: "hi", inner: lineSvg(sideSeam(BELT, 7.5, P, 2), { tone: "lo" }) }) + lineSvg(rollers.join(""), { tone: "faint" })
};
const towers: Drawn[] = [
  [34, -24],
  [52, -24]
].map(([cx, cy], index) => ({
  box: [cx - 5, cy - 5, 0, cx + 5, cy + 5, 26 + index * 4] as Box,
  svg:
    solidSvg(cylinder(cx, cy, 5, 0, 22 + index * 4, P, 28, 0.4), { tone: index ? "mid" : "hi" }) +
    solidSvg(cylinder(cx, cy, 3.4, 22 + index * 4, 3, P, 24, 0.3), { tone: "hi", lit: index === 0 })
}));
const gate: Drawn[] = [
  { box: [GATE_X - 2, -4, 0, GATE_X + 1, -1, 30], svg: slab({ x: GATE_X - 2, y: -4, w: 3, d: 3, r: 0 }, 0, 30, { tone: "hi" }) },
  { box: [GATE_X - 2, 13, 0, GATE_X + 1, 16, 30], svg: slab({ x: GATE_X - 2, y: 13, w: 3, d: 3, r: 0 }, 0, 30, { tone: "hi" }) },
  {
    box: [GATE_X - 3, -4.5, 30, GATE_X + 2, 16.5, 34],
    svg: slab({ x: GATE_X - 3, y: -4.5, w: 5, d: 21, r: 0 }, 30, 4, { tone: "hi" }, 0.4) + dotsSvg([at([GATE_X + 2, 4, 32]), at([GATE_X + 2, 6, 32]), at([GATE_X + 2, 8, 32])], { size: 0.55, tone: "hi" })
  }
];
const tray: Drawn[] = [
  { box: box(TRAY, 0, 0.6), svg: slab(TRAY, 0, 0.6, { tone: "lo", flat: true }, 0) },
  {
    box: [TRAY.x, TRAY.y + TRAY.d - 1, 0, TRAY.x + TRAY.w, TRAY.y + TRAY.d, 5],
    svg: slab({ x: TRAY.x, y: TRAY.y + TRAY.d - 1, w: TRAY.w, d: 1, r: 0 }, 0, 5, { tone: "mid" }, 0) + slab({ x: TRAY.x + TRAY.w - 1, y: TRAY.y, w: 1, d: TRAY.d, r: 0 }, 0, 5, { tone: "mid" }, 0)
  }
];
const wires =
  lineSvg(pathOf([at([34, -24, 22]), at([34, -10, 34]), at([GATE_X - 1, 6, 34])]), { tone: "lo", dashed: true }) +
  lineSvg(pathOf([at([52, -24, 26]), at([52, -8, 36]), at([GATE_X - 1, 6, 34])]), { tone: "lo", dashed: true });
const STATIC: Drawn[] = [belt, ...towers, ...gate, ...tray];

function doc(x: number, y: number, z: number, flagged: boolean, opacity: number): Drawn {
  const plan: Plan = { x, y, w: DOC.w, d: DOC.d, r: 0.3 };
  const top = z + DOC.h;
  const lines = [2, 4, 6].map((ly) => lineOnTop([x + 1.5, y + ly], [x + DOC.w - (ly === 6 ? 4 : 1.5), y + ly], top, P)).join("");
  const svg = slab(plan, z, DOC.h, { tone: "hi" }, 0.2) + lineSvg(lines, { tone: flagged ? "red" : "lo" });
  return { box: [x, y, z, x + DOC.w, y + DOC.d, top], svg: faded(svg, opacity) };
}

export function frame(t: number) {
  const items: Drawn[] = [...STATIC];
  let reading = false;
  for (let i = Math.floor((t - 12) / PERIOD); i <= Math.floor(t / PERIOD); i++) {
    const age = t - i * PERIOD;
    if (age < 0) continue;
    const odd = ((i % 3) + 3) % 3 === 1;
    const x = -12 + SPEED * age;
    const centre = x + DOC.w / 2;
    if (centre > GATE_X - 6 && centre < GATE_X + 3) reading = true;
    const flagged = odd && centre > GATE_X;
    if (flagged && centre >= SPLIT_X) {
      const since = (centre - SPLIT_X) / SPEED;
      const slide = ease(since / 0.5);
      const fall = ease((since - 0.3) / 0.35);
      const opacity = 1 - clamp((since - 1.8) / 0.6);
      if (opacity > 0) items.push(doc(SPLIT_X - DOC.w / 2, 2 + slide * 21, BELT_Z - fall * (BELT_Z - 0.6), true, opacity));
      continue;
    }
    if (x > BELT.w + 4) continue;
    items.push(doc(x, 2, BELT_Z, flagged, Math.min(clamp((x + 12) / 10), 1 - clamp((x - (BELT.w - 14)) / 16))));
  }
  const beam = reading
    ? [4, 6, 8].map((sy) => lineSvg(pathOf([at([GATE_X - 0.5, sy, 30]), at([GATE_X - 0.5, sy, BELT_Z + DOC.h])]), { tone: "lit", flow: true })).join("")
    : "";
  return plinth + wires + painted(items, P) + beam;
}
