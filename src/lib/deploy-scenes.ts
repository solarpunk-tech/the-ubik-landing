/**
 * Deploy tiles — the same vector-cutout + dither treatment as the hero, at
 * card scale. Drawn with plain 2D vector commands, sampled and ordered-dithered
 * into brand squares by <DitherTile>, so the deployment options are rendered in
 * exactly the same material as the hero rather than as a separate icon set.
 *
 * DitherTile supplies the viewport-aware animation loop. Scene geometry accepts
 * a phase so selected silhouettes can move without changing their identity.
 */

export type DeploySceneDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, phase?: number) => void;

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

/** Your cloud — a private cloud wearing a discreet spy hat. */
const drawCloud: DeploySceneDraw = (ctx, w, h) => {
  // Dashed private perimeter.
  ink(ctx, 0.48);
  ctx.lineWidth = Math.max(1.5, w * 0.012);
  ctx.setLineDash([w * 0.035, w * 0.024]);
  ctx.strokeRect(w * 0.12, h * 0.16, w * 0.76, h * 0.7);
  ctx.setLineDash([]);

  // Cloud body.
  ink(ctx, 0.9);
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.7);
  ctx.bezierCurveTo(w * 0.13, h * 0.58, w * 0.22, h * 0.45, w * 0.35, h * 0.49);
  ctx.bezierCurveTo(w * 0.37, h * 0.33, w * 0.61, h * 0.31, w * 0.66, h * 0.49);
  ctx.bezierCurveTo(w * 0.81, h * 0.43, w * 0.9, h * 0.58, w * 0.81, h * 0.7);
  ctx.lineTo(w * 0.2, h * 0.7);
  ctx.closePath();
  ctx.fill();

  // Spy hat: broad brim, angled crown, and a punched-out band.
  ink(ctx, 1);
  ctx.save();
  ctx.translate(w * 0.49, h * 0.19);
  ctx.rotate(-0.08);
  ctx.fillRect(-w * 0.27, h * 0.13, w * 0.54, h * 0.1);
  ctx.beginPath();
  ctx.moveTo(-w * 0.18, h * 0.14);
  ctx.lineTo(-w * 0.13, -h * 0.08);
  ctx.lineTo(w * 0.16, -h * 0.05);
  ctx.lineTo(w * 0.21, h * 0.14);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.9)";
  ctx.fillRect(-w * 0.17, h * 0.065, w * 0.36, h * 0.055);
  ctx.restore();

  // One paper row separates hat from cloud so the two silhouettes stay
  // legible after the 5px dither sample.
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(w * 0.25, h * 0.39, w * 0.5, h * 0.055);
  ctx.restore();

  // Private instances visible inside the cloud.
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.82)";
  for (let i = 0; i < 3; i += 1) {
    ctx.fillRect(w * (0.38 + i * 0.09), h * 0.53, w * 0.055, h * 0.09);
  }
  ctx.restore();
};

/** Managed — an athletic android sprinting the workload forward. */
const drawManaged: DeploySceneDraw = (ctx, w, h, phase = 0) => {
  const stride = Math.sin(phase * 2.2);
  const lift = Math.cos(phase * 4.4) * h * 0.012;
  const cx = w * (0.56 + Math.sin(phase * 0.7) * 0.014);
  const shoulderY = h * 0.36 + lift;
  const hipY = h * 0.61 + lift;

  // Speed trails.
  ink(ctx, 0.42);
  ctx.lineWidth = Math.max(1.5, w * 0.012);
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(w * (0.08 + i * 0.035), h * (0.34 + i * 0.13));
    ctx.lineTo(w * (0.32 + i * 0.025), h * (0.34 + i * 0.13));
    ctx.stroke();
  }

  // Stable head and torso keep most of the silhouette unchanged.
  ink(ctx, 1);
  ctx.fillRect(cx - w * 0.06, h * 0.12 + lift, w * 0.12, h * 0.17);
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.105, shoulderY);
  ctx.lineTo(cx + w * 0.095, shoulderY - h * 0.035);
  ctx.lineTo(cx + w * 0.065, hipY);
  ctx.lineTo(cx - w * 0.075, hipY);
  ctx.closePath();
  ctx.fill();

  // Face slit and chest core.
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.9)";
  ctx.fillRect(cx - w * 0.037, h * 0.18 + lift, w * 0.075, h * 0.035);
  ctx.fillRect(cx - w * 0.03, h * 0.44 + lift, w * 0.06, h * 0.075);
  ctx.restore();

  // Limbs shift through a running loop while torso/head remain anchored.
  ink(ctx, 0.88);
  ctx.lineCap = "square";
  ctx.lineWidth = Math.max(6, w * 0.052);
  const armSwing = stride * w * 0.075;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.085, shoulderY + h * 0.02);
  ctx.lineTo(cx - w * 0.17 - armSwing * 0.35, h * 0.48);
  ctx.lineTo(cx - w * 0.11 - armSwing, h * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.075, shoulderY);
  ctx.lineTo(cx + w * 0.17 + armSwing * 0.35, h * 0.43);
  ctx.lineTo(cx + w * 0.28 + armSwing, h * 0.36);
  ctx.stroke();

  const legSwing = stride * w * 0.08;
  ctx.lineWidth = Math.max(7, w * 0.06);
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.035, hipY);
  ctx.lineTo(cx - w * 0.1 - legSwing, h * 0.75);
  ctx.lineTo(cx - w * 0.3 - legSwing * 0.6, h * 0.84);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.035, hipY);
  ctx.lineTo(cx + w * 0.12 + legSwing, h * 0.72);
  ctx.lineTo(cx + w * 0.27 + legSwing * 0.55, h * 0.88);
  ctx.stroke();

  // Ground dash.
  ink(ctx, 0.55);
  ctx.fillRect(w * 0.18, h * 0.91, w * 0.68, h * 0.018);
};

/** Organisational memory — a time-indexed record vault. */
const drawMemory: DeploySceneDraw = (ctx, w, h) => {
  // Offset history layers behind the current record.
  ink(ctx, 0.48);
  ctx.fillRect(w * 0.13, h * 0.13, w * 0.58, h * 0.64);
  ink(ctx, 0.68);
  ctx.fillRect(w * 0.2, h * 0.2, w * 0.58, h * 0.64);
  ink(ctx, 1);
  ctx.fillRect(w * 0.27, h * 0.27, w * 0.58, h * 0.64);

  // Punch a paper window into the front record.
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.9)";
  ctx.fillRect(w * 0.36, h * 0.34, w * 0.4, h * 0.48);
  ctx.restore();

  // Visible record rows and valid-time / known-time markers.
  ink(ctx, 0.62);
  [0.4, 0.52, 0.64, 0.76].forEach((y, index) => {
    ctx.fillRect(w * 0.43, h * y, w * (index === 1 ? 0.25 : 0.29), h * 0.045);
  });
  ink(ctx, 0.78);
  [0.4, 0.52, 0.64, 0.76].forEach((y, index) => {
    ctx.fillRect(w * 0.38, h * y, w * (index === 2 ? 0.045 : 0.032), h * 0.05);
  });
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

/** Agentic workflows — signal lanes converging into reviewed action. */
const drawAgents: DeploySceneDraw = (ctx, w, h) => {
  // Three source lanes enter from existing systems.
  ink(ctx, 0.58);
  ctx.lineWidth = Math.max(1.5, w * 0.012);
  [0.25, 0.5, 0.75].forEach((y, index) => {
    const endY = h * (0.43 + index * 0.07);
    ctx.beginPath();
    ctx.moveTo(w * 0.06, h * y);
    ctx.bezierCurveTo(w * 0.22, h * y, w * 0.28, endY, w * 0.42, endY);
    ctx.stroke();
    ink(ctx, 0.72 + index * 0.1);
    ctx.fillRect(w * 0.07, h * y - w * 0.035, w * 0.07, w * 0.07);
  });

  // Ubik reasoning core.
  ink(ctx, 1);
  ctx.fillRect(w * 0.4, h * 0.34, w * 0.2, h * 0.32);
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.88)";
  ctx.fillRect(w * 0.46, h * 0.43, w * 0.08, h * 0.14);
  ctx.restore();

  // Reviewed action leaves the core and resolves into two committed outputs.
  ink(ctx, 0.68);
  ctx.lineWidth = Math.max(2, w * 0.016);
  ctx.beginPath();
  ctx.moveTo(w * 0.6, h * 0.5);
  ctx.lineTo(w * 0.75, h * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w * 0.7, h * 0.44);
  ctx.lineTo(w * 0.76, h * 0.5);
  ctx.lineTo(w * 0.7, h * 0.56);
  ctx.stroke();
  ink(ctx, 0.9);
  ctx.fillRect(w * 0.78, h * 0.31, w * 0.14, h * 0.14);
  ctx.fillRect(w * 0.78, h * 0.57, w * 0.14, h * 0.14);
};

export const deployScenes: Record<string, DeploySceneDraw> = {
  premises: drawPremises,
  cloud: drawCloud,
  managed: drawManaged,
  memory: drawMemory,
  intelligence: drawIntelligence,
  agents: drawAgents
};
