import { cylinder, fitProjection, iso, lineSvg, pathOf, sideSeam, slabOf, solidSvg, type Plan, type Point3 } from "@/lib/iso/iso-kit";
import { painted, type Drawn } from "@/lib/iso/order";
import { HEIGHT, WIDTH, box, ease, slabWith } from "./note-kit";

/*
 * Origin roulette: three origin stacks ride a turntable; it spins, settles on
 * the next origin under the pointer, and that stack's top lights up.
 */

export { HEIGHT, WIDTH };

const C = { x: 60, y: 30 };
const R = 46;
const ORIGINS = 3;
export const LOOP = 9;
export const STILL = 6.5;

const P = fitProjection(
  [
    [C.x - R - 6, C.y - R - 6, -3],
    [C.x + R + 6, C.y - R - 6, -3],
    [C.x - R - 6, C.y + R + 6, -3],
    [C.x + R + 6, C.y + R + 6, -3],
    [C.x, C.y - 30, 34]
  ],
  WIDTH,
  HEIGHT,
  { pad: 10, azimuth: 45, elevation: 32 }
);
const at = (point: Point3) => iso(point, P);
const slab = slabWith(P);

const base = solidSvg(cylinder(C.x, C.y, R + 6, -3, 3, P, 64, 0.6), { tone: "lo" });
const deck: Drawn = { box: [C.x - R, C.y - R, 0, C.x + R, C.y + R, 2], svg: solidSvg(cylinder(C.x, C.y, R, 0, 2, P, 64, 0.4), { tone: "mid" }) };
const hub: Drawn = { box: [C.x - 6, C.y - 6, 2, C.x + 6, C.y + 6, 6], svg: solidSvg(cylinder(C.x, C.y, 6, 2, 4, P, 28, 0.3), { tone: "hi" }) };
// The pointer stays put at the back; whichever stack stops under it is the pick.
const POINTER_ANGLE = -Math.PI / 2;
const pointer: Drawn = {
  box: [C.x - 2, C.y - R - 8, 0, C.x + 2, C.y - R - 4, 30],
  svg: slab({ x: C.x - 1.5, y: C.y - R - 8, w: 3, d: 3, r: 0 }, 0, 26, { tone: "hi" }) + lineSvg(pathOf([at([C.x, C.y - R - 6, 26]), at([C.x, C.y - R + 2, 24])]), { tone: "red" })
};

function stack(angle: number, index: number, picked: boolean): Drawn[] {
  const sx = C.x + Math.cos(angle) * (R - 16);
  const sy = C.y + Math.sin(angle) * (R - 16);
  const tiers = [3, 2, 4][index];
  return Array.from({ length: tiers }, (_, tier) => {
    const plan: Plan = { x: sx - 9, y: sy - 5, w: 18, d: 10, r: 0.2 };
    const z = 2 + tier * 7;
    return {
      box: box(plan, z, z + 6.6),
      svg: solidSvg(slabOf(plan, z, 6.6, P, 2, 0.3), { tone: tier % 2 ? "mid" : "hi", lit: picked && tier === tiers - 1, inner: lineSvg(sideSeam(plan, z + 3.3, P, 2), { tone: "faint" }) })
    };
  });
}

export function frame(t: number) {
  const local = t % LOOP;
  // Spin, then settle on the next origin and hold.
  const turn = ease(local / (LOOP * 0.7));
  const target = POINTER_ANGLE - ((Math.floor(t / LOOP) + 1) % ORIGINS) * ((Math.PI * 2) / ORIGINS);
  const angle = target - (1 - turn) * Math.PI * 4;
  const settled = local > LOOP * 0.7;
  const items: Drawn[] = [deck, hub, pointer];
  for (let i = 0; i < ORIGINS; i++) {
    const a = angle + i * ((Math.PI * 2) / ORIGINS);
    const picked = settled && Math.abs(Math.atan2(Math.sin(a - POINTER_ANGLE), Math.cos(a - POINTER_ANGLE))) < 0.2;
    items.push(...stack(a, i, picked));
  }
  return base + painted(items, P);
}
