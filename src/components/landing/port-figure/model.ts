/*
 * The truth the figure moves by. One loop of a ship-to-shore crane cycle,
 * squeezed into 17 seconds: the spreader takes a 40 ft box off the ship,
 * the trolley runs it landside and sets it on a chassis, and the gate only
 * opens once the three documents behind the box agree. World units are
 * half a metre, so a 40 ft box is 24.4 × 4.9 × 5.2.
 */

export const LOOP = 17;

export const BOX = { long: 24.4, wide: 4.9, high: 5.2 };

/** Heights the moving parts travel between, in world units. */
export const LEVEL = {
  onShip: 32.4, // the box's floor, third tier up on deck
  travel: 62, // the box's floor while the trolley runs
  onChassis: 17.6, // the box's floor on the trailer bed
  spreaderPark: 70 // the spreader's floor when it carries nothing
};

/** How far the trolley runs, ship row to truck lane, and how far the truck drives off. */
export const RUN = 72.3;
export const DRIVE = 80;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const span = (t: number, from: number, to: number) => ease((t - from) / (to - from));

export interface Pose {
  /** Trolley travel along y, 0 over the ship row. */
  trolley: number;
  /** Floor of the spreader. */
  spreader: number;
  /** Floor of the box, and whether it rides the truck. */
  box: number;
  boxOnTruck: boolean;
  boxOpacity: number;
  truck: number;
  truckOpacity: number;
  /** 0..1 each: BL, invoice, packing list. */
  pins: [number, number, number];
  lamp: boolean;
  /** Barrier angle, 0 down across the lane, 1 straight up. */
  arm: number;
  readout: string;
}

export function poseAt(time: number): Pose {
  const t = ((time % LOOP) + LOOP) % LOOP;
  const top = LEVEL.onShip + BOX.high;

  // Spreader: down onto the box, up with it, along, down, then away.
  let spreader: number;
  if (t < 1.2) spreader = LEVEL.spreaderPark + (top - LEVEL.spreaderPark) * span(t, 0, 1.2);
  else if (t < 1.6) spreader = top;
  else if (t < 3.4) spreader = top + (LEVEL.travel - LEVEL.onShip) * span(t, 1.6, 3.4);
  else if (t < 6.4) spreader = LEVEL.travel + BOX.high;
  else if (t < 8.4) spreader = LEVEL.travel + BOX.high + (LEVEL.onChassis - LEVEL.travel) * span(t, 6.4, 8.0);
  else spreader = LEVEL.onChassis + BOX.high + (LEVEL.spreaderPark - LEVEL.onChassis - BOX.high) * span(t, 8.4, 9.6);

  const trolley = t < 9.6 ? RUN * span(t, 3.4, 6.4) : RUN * (1 - span(t, 9.6, 12.4));
  const truck = t < 14.2 ? DRIVE * span(t, 9.6, 13.6) : 0;
  const fadeIn = span(t, 14.2, 15.4);
  const boxOnTruck = t >= 8.0 && t < 14.2;
  const box = t < 1.6 || t >= 14.2 ? LEVEL.onShip : boxOnTruck ? LEVEL.onChassis : spreader - BOX.high;
  const leaving = clamp((truck - 46) / 34);

  const pin = (at: number) => (t < 13.6 ? span(t, at, at + 0.5) : 1 - span(t, 13.6, 14.2));
  const pins: [number, number, number] = [pin(4.0), pin(5.2), pin(6.4)];
  const lamp = t >= 8.2 && t < 13.6;
  const arm = t < 12.6 ? span(t, 8.8, 10.0) : 1 - span(t, 12.6, 13.6);

  let readout = "MSKU 4821930 · on board · docs 0/3";
  if (t >= 1.6) readout = "Hoisting MSKU 4821930 · docs 0/3";
  if (t >= 4.5) readout = "Bill of lading matched · 1/3";
  if (t >= 5.7) readout = "Invoice matched · 2/3";
  if (t >= 6.9) readout = "Packing list matched · 3/3";
  if (t >= 8.2) readout = "Cleared · gate open";
  if (t >= 10.2) readout = "Gate out · MSKU 4821930";
  if (t >= 14.2) readout = "Next box · on board · docs 0/3";

  return {
    trolley,
    spreader,
    box,
    boxOnTruck,
    boxOpacity: t >= 14.2 ? fadeIn : 1 - leaving,
    truck,
    truckOpacity: t >= 14.2 ? fadeIn : 1 - leaving,
    pins,
    lamp,
    arm,
    readout
  };
}

/** The still frame for reduced motion and the server render: loaded, cleared, gate up. */
export const STILL = 10.4;
