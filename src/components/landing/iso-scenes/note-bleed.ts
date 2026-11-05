import { cylinder, dotsSvg, fitProjection, iso, lineSvg, pathOf, slabOf, solidSvg, type Plan, type Point3 } from "@/lib/iso/iso-kit";
import { painted, type Box, type Drawn } from "@/lib/iso/order";
import { HEIGHT, WIDTH, box, ease, faded, plinthOf, slabWith } from "./note-kit";

/*
 * The 60-bps bleed: a reefer waits on its chassis at the quay while the
 * margin stack beside it drains, one coin at a time, along a red leak line.
 */

export { HEIGHT, WIDTH };

const BOX: Plan = { x: 0, y: 0, w: 84, d: 30, r: 0.3 };
const BOX_Z = 10;
const BOX_H = 30;
const STACK = { x: 118, y: 14, r: 9 };
const COIN_H = 2.2;
const COINS = 9;
export const LOOP = 12;
export const STILL = 4;

const P = fitProjection(
  [
    [-10, -14, -3],
    [140, -14, -3],
    [-10, 44, -3],
    [140, 44, -3],
    [0, 0, BOX_Z + BOX_H + 4],
    [STACK.x, STACK.y, COINS * COIN_H + 6]
  ],
  WIDTH,
  HEIGHT,
  { pad: 12, azimuth: 48, elevation: 30 }
);
const at = (point: Point3) => iso(point, P);
const slab = slabWith(P);

const plinth = plinthOf(P, { x: -10, y: -14, w: 150, d: 58, r: 1.5 });
const chassis: Drawn = { box: [2, 4, 3, 82, 26, BOX_Z], svg: slab({ x: 2, y: 4, w: 80, d: 22, r: 0.2 }, 6, BOX_Z - 6, { tone: "lo" }, 0) };
const wheels: Drawn[] = [10, 18, 66, 74].flatMap((wx) =>
  [4, 26].map((wy) => ({ box: [wx - 3, wy - 1, 0, wx + 3, wy + 1, 6] as Box, svg: solidSvg(cylinder(wx, wy, 3, 0, 1.6, P, 20, 0.2), { tone: "mid" }) }))
);
const ribs: string[] = [];
for (let rx = 4; rx < BOX.w; rx += 4) ribs.push(pathOf([at([rx, BOX.d, BOX_Z + 2]), at([rx, BOX.d, BOX_Z + BOX_H - 2])]));
const container: Drawn = {
  box: box(BOX, BOX_Z, BOX_Z + BOX_H),
  svg:
    solidSvg(slabOf(BOX, BOX_Z, BOX_H, P, 2, 0.4), { tone: "hi", inner: lineSvg(ribs.join(""), { tone: "faint" }) }) +
    // The reefer unit on the front end, with its readout.
    slab({ x: -3, y: 4, w: 3, d: 22, r: 0.2 }, BOX_Z + 4, BOX_H - 8, { tone: "mid" }, 0.2) +
    dotsSvg([at([-3, 10, BOX_Z + 20]), at([-3, 14, BOX_Z + 20])], { size: 0.7, tone: "hi", pulse: true })
};
const dish: Drawn = {
  box: [STACK.x - STACK.r - 3, STACK.y - STACK.r - 3, 0, STACK.x + STACK.r + 3, STACK.y + STACK.r + 3, 1],
  svg: solidSvg(cylinder(STACK.x, STACK.y, STACK.r + 3, 0, 1, P, 36, 0.3), { tone: "lo", flat: true })
};

export function frame(t: number) {
  const items: Drawn[] = [chassis, ...wheels, container, dish];
  // The stack drains across most of the loop, then rebuilds.
  const left = COINS - ease((t % LOOP) / (LOOP * 0.85)) * 6;
  const whole = Math.floor(left);
  for (let i = 0; i < Math.ceil(left); i++) {
    const z = 1 + i * COIN_H;
    items.push({
      box: [STACK.x - STACK.r, STACK.y - STACK.r, z, STACK.x + STACK.r, STACK.y + STACK.r, z + COIN_H],
      svg: faded(solidSvg(cylinder(STACK.x, STACK.y, STACK.r, z, COIN_H - 0.3, P, 32, 0.3), { tone: i % 2 ? "mid" : "hi", lit: i === whole - 1 }), i < whole ? 1 : left - whole)
    });
  }
  const leak = lineSvg(pathOf([at([BOX.w, BOX.d / 2, BOX_Z + 6]), at([96, 16, 6]), at([STACK.x - STACK.r, STACK.y, 3])]), { tone: "red", dashed: true, flow: true });
  return plinth + painted(items, P) + leak;
}
