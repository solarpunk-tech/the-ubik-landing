import { depthOf, iso, type Point3, type Projection } from "./iso-kit";

/** An axis-aligned world box: [x0, y0, z0, x1, y1, z1]. */
export type Box = [number, number, number, number, number, number];
export interface Drawn {
  box: Box;
  svg: string;
}

/*
 * Painter's order for boxes. Two boxes that don't intersect have a plane
 * between them, and the one on the viewer's side of any such plane is
 * nearer; when they overlap on screen, every separating plane gives the same
 * answer. So for each pair that overlaps on screen the first separating axis
 * decides, and a topological sort (ties by depth) gives the order.
 */
const EPS = 0.01;
const centre = (b: Box): Point3 => [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2];

function behind(a: Box, b: Box, P: Projection) {
  for (let axis = 0; axis < 3; axis++) {
    if (a[axis + 3] <= b[axis] + EPS) return true;
    if (b[axis + 3] <= a[axis] + EPS) return false;
  }
  return depthOf(centre(a), P) < depthOf(centre(b), P);
}

export function screenRect(b: Box, P: Projection) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) {
    const [sx, sy] = iso([x, y, z], P);
    x0 = Math.min(x0, sx);
    y0 = Math.min(y0, sy);
    x1 = Math.max(x1, sx);
    y1 = Math.max(y1, sy);
  }
  return [x0, y0, x1, y1];
}

/** Indices of `items` in back-to-front order. */
export function paintOrder(items: { box: Box }[], P: Projection): number[] {
  const rects = items.map((item) => screenRect(item.box, P));
  const count = items.length;
  const after: number[][] = Array.from({ length: count }, () => []);
  const needs = new Array<number>(count).fill(0);
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const a = rects[i];
      const b = rects[j];
      if (a[2] <= b[0] || b[2] <= a[0] || a[3] <= b[1] || b[3] <= a[1]) continue;
      if (behind(items[i].box, items[j].box, P)) {
        after[i].push(j);
        needs[j]++;
      } else {
        after[j].push(i);
        needs[i]++;
      }
    }
  }
  const depth = items.map((item) => depthOf(centre(item.box), P));
  const ready = new Set<number>();
  for (let i = 0; i < count; i++) if (!needs[i]) ready.add(i);
  const order: number[] = [];
  const done = new Set<number>();
  while (done.size < count) {
    let pick = -1;
    for (const i of ready) if (pick < 0 || depth[i] < depth[pick]) pick = i;
    // A cycle: take the farthest remaining item and carry on.
    if (pick < 0) for (let i = 0; i < count; i++) if (!done.has(i) && (pick < 0 || depth[i] < depth[pick])) pick = i;
    ready.delete(pick);
    done.add(pick);
    order.push(pick);
    for (const next of after[pick]) if (--needs[next] === 0 && !done.has(next)) ready.add(next);
  }
  return order;
}

/** The items' markup, back to front. */
export const painted = (items: Drawn[], P: Projection) => paintOrder(items, P).map((index) => items[index].svg).join("");
