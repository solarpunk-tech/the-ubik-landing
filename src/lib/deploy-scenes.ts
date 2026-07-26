/**
 * Deploy tiles — the same vector-cutout + dither treatment as the hero, at
 * card scale. Drawn with plain 2D vector commands, sampled and ordered-dithered
 * into brand squares by <DitherTile>, so the deployment options are rendered in
 * exactly the same material as the hero rather than as a separate icon set.
 *
 * These are static: no particles, no rAF, one draw at mount.
 */

export type DeploySceneDraw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const ink = (ctx: CanvasRenderingContext2D, value: number) => {
  const level = Math.round(255 * (1 - value));
  ctx.fillStyle = `rgb(${level},${level},${level})`;
  ctx.strokeStyle = `rgb(${level},${level},${level})`;
};

/** On premises — a rack row seen head-on, hardware you can walk up to. */
const drawPremises: DeploySceneDraw = (ctx, w, h) => {
  const racks = 3;
  const gap = w * 0.045;
  const rackW = (w - gap * (racks + 1)) / racks;
  for (let r = 0; r < racks; r += 1) {
    const x = gap + r * (rackW + gap);
    const top = h * (0.2 + (r === 1 ? 0 : 0.06));
    // Cabinet
    ink(ctx, r === 1 ? 0.95 : 0.6);
    ctx.fillRect(x, top, rackW, h * 0.72 - (top - h * 0.2));
    // Unit slots punched out so it reads as a rack, not a slab.
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    const units = 7;
    for (let u = 0; u < units; u += 1) {
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(x + rackW * 0.14, top + h * 0.05 + u * h * 0.075, rackW * 0.72, h * 0.028);
    }
    ctx.restore();
  }
  // Floor line.
  ink(ctx, 0.5);
  ctx.fillRect(0, h * 0.93, w, h * 0.02);
};

/** Your cloud — a VPC boundary with instances inside it. */
const drawCloud: DeploySceneDraw = (ctx, w, h) => {
  // Geometry is derived from the centre out so the whole composition sits in
  // the middle of the tile rather than drifting toward the top-left.
  const boxW = w * 0.76;
  const boxH = h * 0.62;
  const boxX = (w - boxW) / 2;
  const boxY = (h - boxH) / 2;

  // Perimeter, drawn as a dashed boundary: the point is that it is *yours*.
  ink(ctx, 0.85);
  ctx.lineWidth = Math.max(2, w * 0.018);
  ctx.setLineDash([w * 0.05, w * 0.035]);
  ctx.strokeRect(boxX, boxY, boxW, boxH);
  ctx.setLineDash([]);

  // Instances inside the boundary, centred as a block. Even ink across all six:
  // the old alternating 0.55 dithered most of them away, which read as a
  // lopsided scatter rather than a grid.
  const cols = 3;
  const rows = 2;
  const gapX = w * 0.05;
  const gapY = h * 0.09;
  const bw = (boxW * 0.78 - gapX * (cols - 1)) / cols;
  const bh = (boxH * 0.62 - gapY * (rows - 1)) / rows;
  const gridW = bw * cols + gapX * (cols - 1);
  const gridH = bh * rows + gapY * (rows - 1);
  const startX = (w - gridW) / 2;
  const startY = (h - gridH) / 2;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      ink(ctx, (r + c) % 2 === 0 ? 0.95 : 0.78);
      ctx.fillRect(startX + c * (bw + gapX), startY + r * (bh + gapY), bw, bh);
    }
  }
};

/** Managed — the same workload, with Ubik holding it up. */
const drawManaged: DeploySceneDraw = (ctx, w, h) => {
  // Whole composition is balanced around the tile's centre: block above the
  // midline, brackets and mark below it, so it no longer sits top-heavy.
  const blockW = w * 0.52;
  const blockH = h * 0.3;
  const blockX = (w - blockW) / 2;
  const blockY = h * 0.14;

  ink(ctx, 0.95);
  ctx.fillRect(blockX, blockY, blockW, blockH);
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  for (let u = 0; u < 3; u += 1) {
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(blockX + blockW * 0.12, blockY + blockH * (0.18 + u * 0.28), blockW * 0.76, blockH * 0.12);
  }
  ctx.restore();

  // The hands under it. Heavier ink and a thicker stroke than before: at this
  // scale a 0.6 hairline dithered away almost entirely, so the block looked
  // like it was floating with nothing beneath it.
  ink(ctx, 0.82);
  ctx.lineWidth = Math.max(3, w * 0.032);
  ctx.beginPath();
  ctx.moveTo(w * 0.16, h * 0.84);
  ctx.quadraticCurveTo(w * 0.2, h * 0.6, w * 0.42, h * 0.57);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.84, h * 0.84);
  ctx.quadraticCurveTo(w * 0.8, h * 0.6, w * 0.58, h * 0.57);
  ctx.stroke();

  // Ubik's mark sitting at the base — the operator on duty.
  ink(ctx, 1);
  ctx.fillRect(w * 0.44, h * 0.72, w * 0.12, h * 0.13);
};

/** Organisational memory — stacked, inset ledger bars with punched-out rows. */
const drawMemory: DeploySceneDraw = (ctx, w, h) => {
  const bars = 3;
  const barH = h * 0.16;
  const gap = h * 0.09;
  let y = (h - (bars * barH + (bars - 1) * gap)) / 2;
  for (let i = 0; i < bars; i += 1) {
    const inset = i * w * 0.05;
    ink(ctx, i === 1 ? 0.95 : 0.6);
    ctx.fillRect(w * 0.1 + inset, y, w * 0.8 - inset * 2, barH);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    for (let l = 0; l < 3; l += 1) {
      ctx.fillRect(w * 0.17 + inset, y + barH * (0.2 + l * 0.27), w * 0.46 - inset * 2, barH * 0.09);
    }
    ctx.restore();
    y += barH + gap;
  }
};

/** Operating intelligence — a node graph, patterns learned from the record. */
const drawIntelligence: DeploySceneDraw = (ctx, w, h) => {
  const nodes: [number, number][] = [
    [0.5, 0.16],
    [0.2, 0.42],
    [0.8, 0.42],
    [0.34, 0.78],
    [0.66, 0.78],
    [0.5, 0.5]
  ];
  ink(ctx, 0.5);
  ctx.lineWidth = Math.max(1.5, w * 0.012);
  const edges: [number, number][] = [
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
    [1, 3],
    [2, 4],
    [0, 1],
    [0, 2]
  ];
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(w * nodes[a][0], h * nodes[a][1]);
    ctx.lineTo(w * nodes[b][0], h * nodes[b][1]);
    ctx.stroke();
  });
  nodes.forEach(([nx, ny], i) => {
    ink(ctx, i === 5 ? 1 : 0.85);
    const r = i === 5 ? w * 0.055 : w * 0.038;
    ctx.beginPath();
    ctx.arc(w * nx, h * ny, r, 0, Math.PI * 2);
    ctx.fill();
  });
};

/** Agentic workflows — a swarm converging on one action, not a lone actor. */
const drawAgents: DeploySceneDraw = (ctx, w, h) => {
  ink(ctx, 1);
  ctx.fillRect(w * 0.42, h * 0.42, w * 0.16, h * 0.16);

  const angles = [200, 260, 320, 20, 80, 140];
  angles.forEach((deg, i) => {
    const rad = (deg * Math.PI) / 180;
    const dist = w * 0.32;
    const x = w * 0.5 + Math.cos(rad) * dist;
    const y = h * 0.5 + Math.sin(rad) * dist;

    ctx.save();
    ink(ctx, 0.4);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = Math.max(1, w * 0.008);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.stroke();
    ctx.restore();

    ink(ctx, 0.55 + (i % 3) * 0.12);
    const s = w * 0.09;
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
  });
};

export const deployScenes: Record<string, DeploySceneDraw> = {
  premises: drawPremises,
  cloud: drawCloud,
  managed: drawManaged,
  memory: drawMemory,
  intelligence: drawIntelligence,
  agents: drawAgents
};
