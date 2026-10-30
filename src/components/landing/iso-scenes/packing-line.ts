import {
  cylinder,
  dotsSvg,
  fitProjection,
  iso,
  lineOnTop,
  lineSvg,
  pathOf,
  planOutline,
  insetPlan,
  sideSeam,
  slabOf,
  solidSvg,
  type Plan,
  type Point3,
  type SolidStyle
} from "@/lib/iso/iso-kit";
import { painted, type Box, type Drawn } from "@/lib/iso/order";

/*
 * A packing cell. Cartons ride a belt through a scanner gate, a robot arm
 * drops a part into each one and the tape closes it; every third carton
 * fails the scan and a pusher knocks it into the reject bin. World units are
 * centimetres-ish: x along the belt, y across it, z up.
 */

export const WIDTH = 360;
export const HEIGHT = 240;

const BELT_Z = 11;
const BELT: Plan = { x: 0, y: 0, w: 184, d: 14, r: 0 };
const CARTON = { w: 14, d: 10, h: 9 };
const LANE_Y = 2;
const SPEED = 20;
const PERIOD = 2.4;
export const LOOP = PERIOD * 3 * 4;
const SCAN_X = 47;
const ARM_X = 104;
const PUSH_X = 146;
const BIN: Plan = { x: 138, y: 18, w: 20, d: 14, r: 0.5 };

const P = fitProjection(
  [
    [-12, -34, -3],
    [196, -34, -3],
    [-12, 36, -3],
    [196, 36, -3],
    [44, -4, 36],
    [ARM_X, -24, 36],
    [196, 36, 0]
  ],
  WIDTH,
  HEIGHT,
  { pad: 8, azimuth: 52, elevation: 32 }
);

const at = (point: Point3) => iso(point, P);
const box = ({ x, y, w, d }: Plan, z0: number, z1: number): Box => [x, y, z0, x + w, y + d, z1];
const slab = (plan: Plan, z: number, h: number, style: SolidStyle = {}, bevel = 0.3) => solidSvg(slabOf(plan, z, h, P, 2, bevel), { tone: "mid", ...style });

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};

/* ---------- static parts ---------- */

const PLINTH: Plan = { x: -12, y: -34, w: 208, d: 70, r: 1.5 };
const plinth = slab(PLINTH, -3, 3, { tone: "lo" }, 0.6) + lineSvg(planOutline(insetPlan(PLINTH, 3), 0, P, 2), { tone: "faint" });

const legs = [6, 90, 172].flatMap((lx) => [1, 11].map((ly) => ({ box: [lx, ly, 0, lx + 2, ly + 2, 8] as Box, svg: slab({ x: lx, y: ly, w: 2, d: 2, r: 0 }, 0, 8, { tone: "mid" }, 0) })));

const rollers: string[] = [];
for (let rx = 3; rx < BELT.w; rx += 5) rollers.push(lineOnTop([rx, BELT.y + 0.6], [rx, BELT.y + BELT.d - 0.6], BELT_Z, P));
const belt: Drawn = {
  box: box(BELT, 8, BELT_Z),
  svg: solidSvg(slabOf(BELT, 8, BELT_Z - 8, P, 2, 0.4), { tone: "hi", inner: lineSvg(sideSeam(BELT, 9.5, P, 2), { tone: "lo" }) }) + lineSvg(rollers.join(""), { tone: "faint" })
};

const POST_W = 3;
const gateBack: Drawn = { box: [SCAN_X - 3, -4, 0, SCAN_X, -1, 30], svg: slab({ x: SCAN_X - 3, y: -4, w: POST_W, d: 3, r: 0 }, 0, 30, { tone: "hi" }) };
const gateFront: Drawn = { box: [SCAN_X - 3, 15, 0, SCAN_X, 18, 30], svg: slab({ x: SCAN_X - 3, y: 15, w: POST_W, d: 3, r: 0 }, 0, 30, { tone: "hi" }) };
const gateBeam: Drawn = {
  box: [SCAN_X - 4, -4.5, 30, SCAN_X + 1, 18.5, 34],
  svg:
    slab({ x: SCAN_X - 4, y: -4.5, w: 5, d: 23, r: 0 }, 30, 4, { tone: "hi" }, 0.4) +
    dotsSvg([at([SCAN_X + 1, 6, 32]), at([SCAN_X + 1, 8.5, 32]), at([SCAN_X + 1, 11, 32])], { size: 0.55, tone: "hi" })
};

const armBase: Drawn = {
  box: [ARM_X - 6, -30, 0, ARM_X + 6, -18, 12],
  svg:
    solidSvg(cylinder(ARM_X, -24, 6, 0, 4, P, 28, 0.4), { tone: "mid" }) +
    solidSvg(cylinder(ARM_X, -24, 4, 4, 8, P, 24, 0.4), { tone: "hi", inner: lineSvg(pathOf([at([ARM_X + 2.8, -21.2, 7]), at([ARM_X + 2.8, -21.2, 11])]), { tone: "lo" }) })
};
const TOTE: Plan = { x: ARM_X - 7, y: -16, w: 14, d: 7, r: 0.4 };
const tote: Drawn = {
  box: box(TOTE, 0, 7),
  svg: slab(TOTE, 0, 7, { tone: "mid" }) + lineSvg(planOutline(insetPlan(TOTE, 1), 7, P, 2), { tone: "lo" }) + dotsSvg([at([ARM_X - 3, -12.5, 7]), at([ARM_X, -12.5, 7]), at([ARM_X + 3, -12.5, 7])], { size: 0.8, tone: "mid" })
};

const pusherBody: Drawn = {
  box: [PUSH_X - 4, -14, 8, PUSH_X + 4, -4, 16],
  svg: slab({ x: PUSH_X - 4, y: -14, w: 8, d: 10, r: 0.4 }, 8, 8, { tone: "hi" }, 0.4) + slab({ x: PUSH_X - 1, y: -12, w: 2, d: 2, r: 0 }, 0, 8, { tone: "mid" }, 0)
};

const binBack: Drawn = {
  box: [BIN.x, BIN.y, 0, BIN.x + BIN.w, BIN.y + 1, 8],
  svg: slab({ x: BIN.x, y: BIN.y, w: BIN.w, d: 1, r: 0 }, 0, 8, { tone: "mid" }, 0) + slab({ x: BIN.x, y: BIN.y, w: 1, d: BIN.d, r: 0 }, 0, 8, { tone: "mid" }, 0)
};
const binFloor: Drawn = { box: box(BIN, 0, 0.6), svg: slab(BIN, 0, 0.6, { tone: "lo", flat: true }, 0) };
const binFront: Drawn = {
  box: [BIN.x, BIN.y + BIN.d - 1, 0, BIN.x + BIN.w, BIN.y + BIN.d, 8],
  svg:
    slab({ x: BIN.x + BIN.w - 1, y: BIN.y, w: 1, d: BIN.d, r: 0 }, 0, 8, { tone: "mid" }, 0) +
    solidSvg(slabOf({ x: BIN.x, y: BIN.y + BIN.d - 1, w: BIN.w, d: 1, r: 0 }, 0, 8, P, 2), {
      tone: "mid",
      inner: lineSvg(pathOf([at([BIN.x + 3, BIN.y + BIN.d, 4]), at([BIN.x + BIN.w - 3, BIN.y + BIN.d, 4])]), { tone: "faint" })
    })
};

const STATIC: Drawn[] = [...legs, belt, gateBack, gateFront, gateBeam, armBase, tote, pusherBody, binBack, binFloor, binFront];

/* ---------- moving parts ---------- */

function carton(x: number, y: number, z: number, state: { packed: boolean; scanned: boolean; bad: boolean }, opacity: number): Drawn {
  const plan: Plan = { x, y, w: CARTON.w, d: CARTON.d, r: 0 };
  const top = z + CARTON.h;
  let detail = "";
  if (state.packed) detail += lineSvg(lineOnTop([x, y + CARTON.d / 2], [x + CARTON.w, y + CARTON.d / 2], top, P), { tone: "mid" });
  else detail += lineSvg(planOutline(insetPlan(plan, 1.2), top, P, 2), { tone: "lo" });
  if (state.scanned) {
    const label = pathOf([at([x + 3, y + CARTON.d, z + 3]), at([x + 7, y + CARTON.d, z + 3]), at([x + 7, y + CARTON.d, z + 5.5]), at([x + 3, y + CARTON.d, z + 5.5])], true);
    detail += state.bad
      ? `<path class="pl-label pl-bad" d="${label}"/>`
      : `<path class="pl-label" d="${label}"/>`;
  }
  const svg = solidSvg(slabOf(plan, z, CARTON.h, P, 2, 0.4), { tone: "hi", inner: lineSvg(sideSeam(plan, top - 2, P, 2), { tone: "faint" }) }) + detail;
  return { box: [x, y, z, x + CARTON.w, y + CARTON.d, top], svg: opacity < 1 ? `<g opacity="${opacity.toFixed(2)}">${svg}</g>` : svg };
}

/** Wrist position of the arm: over the tote, then over the belt as each carton passes under it. */
function wrist(t: number): Point3 {
  // A carton's centre crosses ARM_X once per PERIOD; the arm meets it there.
  const arrive = (ARM_X - CARTON.w / 2 + 14) / SPEED;
  const phase = (((t - arrive) % PERIOD) + PERIOD) % PERIOD / PERIOD;
  // 0 at the belt, then up and back to the tote, pick, and return.
  const toTote = ease((phase - 0.12) / 0.3);
  const back = ease((phase - 0.62) / 0.3);
  const across = toTote - back;
  const y = 7 - across * 19.5;
  const dip = Math.max(0, 1 - Math.abs(phase < 0.5 ? phase : phase - 1) / 0.1);
  const pick = Math.max(0, 1 - Math.abs(phase - 0.47) / 0.08);
  const z = 30 - dip * 8 - pick * 12 + across * 2;
  return [ARM_X, y, z];
}

function arm(t: number) {
  const shoulder: Point3 = [ARM_X, -24, 13];
  const hand = wrist(t);
  const elbow: Point3 = [ARM_X, (shoulder[1] + hand[1]) / 2 - 3, Math.max(shoulder[2], hand[2]) + 5];
  const d = pathOf([at(shoulder), at(elbow), at(hand)]);
  const grip: Plan = { x: hand[0] - 2.5, y: hand[1] - 1.5, w: 5, d: 3, r: 0.3 };
  const fingers = [-1.6, 1.6].map((fx) => pathOf([at([hand[0] + fx, hand[1], hand[2] - 1]), at([hand[0] + fx, hand[1], hand[2] - 4])])).join("");
  const carrying = hand[1] < 4 && hand[1] > -10;
  const part = carrying ? slab({ x: hand[0] - 1.5, y: hand[1] - 1.5, w: 3, d: 3, r: 0.2 }, hand[2] - 6, 2.4, { tone: "hi", lit: true }, 0) : "";
  return (
    `<path class="pl-arm" d="${d}"/><path class="pl-arm-core" d="${d}"/>` +
    dotsSvg([at(shoulder), at(elbow)], { size: 1.6, tone: "hi" }) +
    part +
    slab(grip, hand[2] - 1, 2, { tone: "hi" }, 0.2) +
    lineSvg(fingers, { tone: "hi" })
  );
}

export function frame(t: number) {
  const items: Drawn[] = [...STATIC];
  let scanning = false;
  let pushing = 0;
  const first = Math.floor((t - 14) / PERIOD) - 1;
  for (let i = first; i <= Math.floor(t / PERIOD); i++) {
    const age = t - i * PERIOD;
    if (age < 0) continue;
    const bad = ((i % 3) + 3) % 3 === 2;
    const x = -14 + SPEED * age;
    const centre = x + CARTON.w / 2;
    if (centre > SCAN_X - 6 && centre < SCAN_X + 4) scanning = true;
    const state = { scanned: centre > SCAN_X, packed: centre > ARM_X + 2, bad };
    if (bad && centre >= PUSH_X) {
      // Pushed: the carton leaves the belt sideways and drops into the bin.
      const since = (centre - PUSH_X) / SPEED;
      const slide = ease(since / 0.45);
      const fall = ease((since - 0.3) / 0.35);
      pushing = Math.max(pushing, 1 - ease((since - 0.45) / 0.4));
      const opacity = 1 - clamp((since - 1.6) / 0.6);
      if (opacity <= 0) continue;
      items.push(carton(PUSH_X - CARTON.w / 2, LANE_Y + slide * 19, BELT_Z - fall * (BELT_Z - 0.6), state, opacity));
      continue;
    }
    if (x > BELT.w + 6) continue;
    // Fade in where the belt starts and out where it ends, so cartons never pop.
    const opacity = Math.min(clamp((x + 14) / 10), 1 - clamp((x - (BELT.w - 16)) / 18));
    items.push(carton(x, LANE_Y, BELT_Z, state, opacity));
  }
  const rod = 4 + pushing * 6;
  items.push({ box: [PUSH_X - 1.2, -4, 10.6, PUSH_X + 1.2, -4 + rod, 13], svg: slab({ x: PUSH_X - 1.2, y: -4, w: 2.4, d: rod, r: 0 }, 10.6, 2.4, { tone: "hi" }, 0) + slab({ x: PUSH_X - 3, y: -4 + rod - 1, w: 6, d: 1, r: 0 }, 9.6, 4.4, { tone: "hi" }, 0) });
  const beam = scanning
    ? [5.5, 8.5, 11.5].map((sy) => `<path class="iso-line" data-tone="lit" data-flow="" d="${pathOf([at([SCAN_X - 1.5, sy, 30]), at([SCAN_X - 1.5, sy, BELT_Z + CARTON.h])])}"/>`).join("")
    : "";
  return plinth + painted(items, P) + beam + arm(t);
}

/** A frame with a carton under the scanner and the arm over the belt. */
export const STILL = 3.1;
