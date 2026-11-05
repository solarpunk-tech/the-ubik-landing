import { insetPlan, lineSvg, planOutline, slabOf, solidSvg, type Plan, type Projection, type SolidStyle } from "@/lib/iso/iso-kit";
import type { Box } from "@/lib/iso/order";

/*
 * Shared size and helpers for the Trade Notes scenes (note-drift, note-bleed,
 * note-roulette), drawn with the same kit as the hero port and the packing line.
 * World units are centimetres-ish: x across, y deep, z up.
 */

export const WIDTH = 320;
export const HEIGHT = 240;

export const clamp = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
export const box = ({ x, y, w, d }: Plan, z0: number, z1: number): Box => [x, y, z0, x + w, y + d, z1];
export const slabWith = (P: Projection) => (plan: Plan, z: number, h: number, style: SolidStyle = {}, bevel = 0.3) =>
  solidSvg(slabOf(plan, z, h, P, 2, bevel), { tone: "mid", ...style });
export const plinthOf = (P: Projection, plan: Plan) =>
  slabWith(P)(plan, -3, 3, { tone: "lo" }, 0.6) + lineSvg(planOutline(insetPlan(plan, 3), 0, P, 2), { tone: "faint" });
export const faded = (svg: string, opacity: number) => (opacity < 1 ? `<g opacity="${opacity.toFixed(2)}">${svg}</g>` : svg);
