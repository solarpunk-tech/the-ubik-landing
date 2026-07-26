/**
 * Hero scenes — vector cutouts for the particle field.
 *
 * Each scene paints a grayscale composition with plain 2D vector commands
 * (no SVG parsing, no image requests, no asset bytes). HeroParticleField
 * rasterises one of these at grid resolution, reads the luminance, and turns
 * it into a field of brand squares via ordered dithering.
 *
 * Because the output is dithered to squares, these only need to read as
 * silhouettes with a few tonal steps — think woodblock print, not render.
 * Values: 1 = full ink, 0 = paper.
 */

export type SceneDraw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export type HeroScene = {
  id: string;
  /** Used for the aria description of the hero. */
  label: string;
  draw: SceneDraw;
};

const ink = (ctx: CanvasRenderingContext2D, value: number) => {
  const level = Math.round(255 * (1 - value));
  ctx.fillStyle = `rgb(${level},${level},${level})`;
  ctx.strokeStyle = `rgb(${level},${level},${level})`;
};

/** Deterministic per-scene noise so a scene looks identical across reloads. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), 2246822519) + 374761393) >>> 0;
    s = (s ^ (s >>> 13)) >>> 0;
    return s / 4294967295;
  };
}

/* ---------------------------------------------------------------------------
   1. The wave — a cresting swell with breaking claws, after the Japanese
   woodblock tradition. Original geometry, not a trace.
   --------------------------------------------------------------------------- */
const drawWave: SceneDraw = (ctx, w, h) => {
  const rand = rng(0x5eaf00d);

  // Distant swell band. A vertical gradient rather than a flat tone: the
  // dither turns the ramp into a density falloff, so the sea thins out toward
  // the horizon instead of reading as one solid slab of squares.
  const seaTop = h * 0.62;
  const sea = ctx.createLinearGradient(0, seaTop, 0, h);
  sea.addColorStop(0, "rgba(255,255,255,1)");
  sea.addColorStop(0.35, "rgb(214,214,214)");
  sea.addColorStop(1, "rgb(165,165,165)");
  ctx.fillStyle = sea;
  ctx.beginPath();
  ctx.moveTo(0, seaTop);
  for (let x = 0; x <= w; x += w / 28) {
    ctx.lineTo(x, seaTop + Math.sin(x / (w / 9)) * h * 0.018);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // The wave breaks leftward, back toward the headline, so the eye is carried
  // into the copy rather than off the edge of the page. The silhouette is the
  // whole trick: a swell rising off the right edge, a crest that overhangs to
  // the left, and a hollow barrel underneath the lip.
  const lipX = w * 0.46;
  const lipY = h * 0.29;
  // Dense at the crest, thinning toward the trough, so the dither reads as
  // falling density instead of one flat mass.
  const body = ctx.createLinearGradient(w * 0.25, h * 0.85, w * 0.85, h * 0.08);
  body.addColorStop(0, "rgb(216,216,216)");
  body.addColorStop(0.5, "rgb(96,96,96)");
  body.addColorStop(1, "rgb(12,12,12)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(w * 1.06, h * 1.05);
  ctx.lineTo(w * 1.06, h * 0.46);
  // Back of the swell climbing to the crest.
  ctx.bezierCurveTo(w * 0.99, h * 0.24, w * 0.87, h * 0.08, w * 0.72, h * 0.09);
  // The lip, thrown out over the trough.
  ctx.bezierCurveTo(w * 0.6, h * 0.1, w * 0.51, h * 0.19, lipX, lipY);
  // Underside of the lip hooking back — this is what forms the barrel.
  ctx.bezierCurveTo(w * 0.56, h * 0.25, w * 0.65, h * 0.3, w * 0.68, h * 0.43);
  // Inner face dropping into the trough.
  ctx.bezierCurveTo(w * 0.71, h * 0.58, w * 0.61, h * 0.68, w * 0.46, h * 0.72);
  // Front face running down-left into the sea.
  ctx.bezierCurveTo(w * 0.3, h * 0.76, w * 0.13, h * 0.82, -w * 0.05, h * 0.92);
  ctx.lineTo(-w * 0.05, h * 1.05);
  ctx.closePath();
  ctx.fill();

  // Barrel — punched back out to paper so the curl reads as an opening rather
  // than a filled lump. Without this the whole thing renders as a blue disc.
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  const bx = w * 0.63;
  const by = h * 0.36;
  const hollow = ctx.createRadialGradient(bx, by, h * 0.01, bx, by, h * 0.13);
  hollow.addColorStop(0, "rgba(0,0,0,1)");
  hollow.addColorStop(0.7, "rgba(0,0,0,0.9)");
  hollow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = hollow;
  ctx.beginPath();
  ctx.ellipse(bx, by, w * 0.058, h * 0.115, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Breaking claws thrown off the lip, reaching left.
  ink(ctx, 0.85);
  const clawRoot = { x: lipX, y: lipY };
  for (let i = 0; i < 7; i += 1) {
    const t = i / 6;
    const len = (0.05 + rand() * 0.08) * w;
    // Claws march down-left along the lip, shrinking as they go.
    const ax = clawRoot.x - t * w * 0.16 + rand() * w * 0.02;
    const ay = clawRoot.y - t * h * 0.1 + rand() * h * 0.03;
    const tipX = ax - len * 0.7;
    const tipY = ay - len * 0.55;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.quadraticCurveTo(ax - len * 0.5, ay - len * 0.1, tipX, tipY);
    ctx.quadraticCurveTo(ax - len * 0.28, ay - len * 0.42, ax + len * 0.04, ay - len * 0.06);
    ctx.closePath();
    ctx.fill();
    // Foam bead at each tip.
    ctx.beginPath();
    ctx.arc(tipX, tipY, (0.008 + rand() * 0.008) * w, 0, Math.PI * 2);
    ctx.fill();
  }

  // Spray — scattered squares of foam above the break.
  ink(ctx, 0.6);
  for (let i = 0; i < 90; i += 1) {
    const px = lipX - rand() * w * 0.26 + w * 0.1;
    const py = lipY - rand() * h * 0.22 + rand() * h * 0.12;
    const r = (0.002 + rand() * 0.005) * w;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // A small boat in the trough for scale.
  ink(ctx, 1);
  ctx.beginPath();
  ctx.moveTo(w * 0.2, h * 0.78);
  ctx.quadraticCurveTo(w * 0.27, h * 0.84, w * 0.36, h * 0.77);
  ctx.quadraticCurveTo(w * 0.28, h * 0.8, w * 0.2, h * 0.78);
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i < 5; i += 1) {
    ctx.fillRect(w * (0.225 + i * 0.026), h * 0.745, w * 0.006, h * 0.034);
  }
};

/* ---------------------------------------------------------------------------
   2. The container ship — the stacks are literal squares, which is what the
   dither grid is made of anyway.
   --------------------------------------------------------------------------- */
const drawShip: SceneDraw = (ctx, w, h) => {
  const rand = rng(0xc0ffee);
  const deck = h * 0.56;

  // Sea, as a density ramp rather than a flat tone — same trick as the wave:
  // the dither turns the gradient into falloff instead of a slab of squares.
  const seaTop = deck + h * 0.16;
  const sea = ctx.createLinearGradient(0, seaTop, 0, h);
  sea.addColorStop(0, "rgba(255,255,255,0)");
  sea.addColorStop(0.3, "rgb(214,214,214)");
  sea.addColorStop(1, "rgb(158,158,158)");
  ctx.fillStyle = sea;
  ctx.beginPath();
  ctx.moveTo(0, seaTop);
  for (let x = 0; x <= w; x += w / 34) {
    ctx.lineTo(x, seaTop + Math.sin(x / (w / 11)) * h * 0.012);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // Pushed toward the right edge: the copy occupies the left ~40% and the
  // vessel was leaving a dead band of paper along the right margin.
  const bow = w * 1.02;
  const stern = w * 0.4;

  // Hull. A real sheer line — the deck curves up toward a raked bow instead of
  // running dead flat, which is what made the previous silhouette read as a
  // brick. Dense at the waterline, lighter along the deck.
  const hullGrad = ctx.createLinearGradient(0, deck, 0, deck + h * 0.2);
  hullGrad.addColorStop(0, "rgb(64,64,64)");
  hullGrad.addColorStop(1, "rgb(8,8,8)");
  ctx.fillStyle = hullGrad;
  ctx.beginPath();
  ctx.moveTo(stern, deck + h * 0.012);
  ctx.quadraticCurveTo(w * 0.6, deck - h * 0.028, bow, deck - h * 0.05);
  ctx.lineTo(bow - w * 0.008, deck + h * 0.085);
  ctx.quadraticCurveTo(w * 0.62, deck + h * 0.155, stern + w * 0.03, deck + h * 0.15);
  ctx.quadraticCurveTo(stern - w * 0.012, deck + h * 0.13, stern, deck + h * 0.012);
  ctx.closePath();
  ctx.fill();

  // Boot topping.
  ink(ctx, 0.32);
  ctx.beginPath();
  ctx.moveTo(stern + w * 0.01, deck + h * 0.108);
  ctx.quadraticCurveTo(w * 0.62, deck + h * 0.118, bow - w * 0.02, deck + h * 0.052);
  ctx.lineTo(bow - w * 0.02, deck + h * 0.075);
  ctx.quadraticCurveTo(w * 0.62, deck + h * 0.14, stern + w * 0.012, deck + h * 0.13);
  ctx.closePath();
  ctx.fill();

  // Container bays. Gaps between bays and varied stack heights are what stop
  // this reading as one filled rectangle.
  const bays = 7;
  const fieldW = (bow - stern) * 0.76;
  const bayPitch = fieldW / bays;
  for (let b = 0; b < bays; b += 1) {
    const x = stern + w * 0.055 + b * bayPitch;
    // Deck rises toward the bow, so stacks sit progressively higher.
    const lift = (b / (bays - 1)) * h * 0.03;
    const stack = 2 + Math.floor(rand() * 4);
    for (let s = 0; s < stack; s += 1) {
      const boxH = h * 0.038;
      const y = deck - lift - (s + 1) * boxH;
      // Alternating tone per box, lighter as the stack rises.
      ink(ctx, 0.9 - s * 0.11 - (b % 2) * 0.12);
      ctx.fillRect(x, y + h * 0.004, bayPitch * 0.78, boxH - h * 0.008);
    }
  }

  // Superstructure aft, set back from the stacks, with a funnel.
  ink(ctx, 0.95);
  ctx.fillRect(stern + w * 0.005, deck - h * 0.155, w * 0.05, h * 0.155);
  ink(ctx, 0.3);
  for (let r = 0; r < 3; r += 1) {
    ctx.fillRect(stern + w * 0.012, deck - h * (0.14 - r * 0.038), w * 0.036, h * 0.016);
  }
  ink(ctx, 1);
  ctx.fillRect(stern + w * 0.016, deck - h * 0.205, w * 0.022, h * 0.055);

  // Crane masts along the deck — thin verticals for scale.
  ink(ctx, 0.75);
  for (let i = 0; i < 3; i += 1) {
    const mx = stern + w * 0.14 + i * (fieldW / 3);
    ctx.fillRect(mx, deck - h * 0.235, Math.max(1, w * 0.0022), h * 0.08);
    ctx.fillRect(mx - w * 0.014, deck - h * 0.235, w * 0.03, Math.max(1, w * 0.0022));
  }

  // Wake trailing astern, thinning outward.
  ink(ctx, 0.4);
  for (let i = 0; i < 26; i += 1) {
    const t = rand();
    const y = deck + h * (0.15 + t * 0.2);
    const len = w * (0.02 + rand() * 0.09) * (1 - t * 0.5);
    const x = w * 0.2 + rand() * (stern - w * 0.2);
    ctx.fillRect(x, y, len, Math.max(1, h * 0.005));
  }

  // Gulls.
  ink(ctx, 0.65);
  ctx.lineWidth = Math.max(1, w * 0.002);
  for (let i = 0; i < 4; i += 1) {
    const gx = w * (0.45 + rand() * 0.45);
    const gy = h * (0.1 + rand() * 0.18);
    const gs = w * 0.011;
    ctx.beginPath();
    ctx.moveTo(gx - gs, gy);
    ctx.quadraticCurveTo(gx - gs * 0.4, gy - gs * 0.55, gx, gy);
    ctx.quadraticCurveTo(gx + gs * 0.4, gy - gs * 0.55, gx + gs, gy);
    ctx.stroke();
  }
};

/* ---------------------------------------------------------------------------
   3. The harvest — an aquaculture figure bringing in the catch.
   --------------------------------------------------------------------------- */
const drawHarvest: SceneDraw = (ctx, w, h) => {
  const rand = rng(0xa971);

  // Low sun behind the figure. A radial ramp gives the dither a wide, soft
  // falloff — this is what fills the sky with thinning squares.
  const sunX = w * 0.66;
  const sunY = h * 0.34;
  const sun = ctx.createRadialGradient(sunX, sunY, h * 0.02, sunX, sunY, h * 0.46);
  sun.addColorStop(0, "rgb(110,110,110)");
  sun.addColorStop(0.42, "rgb(196,196,196)");
  sun.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(w * 0.2, 0, w * 0.9, h * 0.82);

  // Water plane, densest at the bottom edge.
  const waterTop = h * 0.68;
  const water = ctx.createLinearGradient(0, waterTop, 0, h);
  water.addColorStop(0, "rgba(255,255,255,0)");
  water.addColorStop(0.4, "rgb(206,206,206)");
  water.addColorStop(1, "rgb(150,150,150)");
  ctx.fillStyle = water;
  ctx.fillRect(0, waterTop, w, h - waterTop);

  // The figure, cropped at the chest and scaled large. At a 9px dither grid a
  // full-length person collapses into noise; a close crop of simple masses is
  // the only thing that survives. Everything is composed into the upper two
  // thirds because the hero is taller than the fold on most screens.
  const cx = w * 0.7;
  ink(ctx, 1);

  // Conical hat — one bold triangle, the most legible shape in the scene. The
  // brim overlaps the crown of the head rather than floating above it.
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.105, h * 0.315);
  ctx.quadraticCurveTo(cx, h * 0.285, cx + w * 0.105, h * 0.315);
  ctx.lineTo(cx + w * 0.014, h * 0.145);
  ctx.quadraticCurveTo(cx, h * 0.128, cx - w * 0.014, h * 0.145);
  ctx.closePath();
  ctx.fill();

  // Head tucked under the brim, then neck.
  ctx.beginPath();
  ctx.ellipse(cx - w * 0.006, h * 0.335, w * 0.036, h * 0.042, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(cx - w * 0.022, h * 0.36, w * 0.04, h * 0.045);

  // Shoulders and torso running off the bottom of the frame.
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.105, h * 1.02);
  ctx.quadraticCurveTo(cx - w * 0.105, h * 0.52, cx - w * 0.016, h * 0.4);
  ctx.quadraticCurveTo(cx + w * 0.05, h * 0.4, cx + w * 0.092, h * 0.52);
  ctx.quadraticCurveTo(cx + w * 0.1, h * 0.78, cx + w * 0.108, h * 1.02);
  ctx.closePath();
  ctx.fill();

  // Arm bringing the basket up across the body.
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.095, h * 0.55);
  ctx.quadraticCurveTo(cx - w * 0.17, h * 0.6, cx - w * 0.185, h * 0.68);
  ctx.lineTo(cx - w * 0.132, h * 0.69);
  ctx.quadraticCurveTo(cx - w * 0.124, h * 0.62, cx - w * 0.062, h * 0.59);
  ctx.closePath();
  ctx.fill();

  // Basket of the catch, held at the hip.
  const bx = cx - w * 0.185;
  const by = h * 0.635;
  ink(ctx, 0.82);
  ctx.beginPath();
  ctx.moveTo(bx - w * 0.068, by);
  ctx.lineTo(bx + w * 0.068, by);
  ctx.lineTo(bx + w * 0.05, by + h * 0.1);
  ctx.lineTo(bx - w * 0.05, by + h * 0.1);
  ctx.closePath();
  ctx.fill();
  // No woven texture: at this grid size the erase bled into the torso behind
  // the basket and read as banding rather than weave.
  // The catch mounded above the rim.
  ink(ctx, 1);
  for (let i = 0; i < 12; i += 1) {
    const fx = bx - w * 0.054 + rand() * w * 0.108;
    const fy = by - rand() * h * 0.026;
    ctx.beginPath();
    ctx.ellipse(fx, fy, w * 0.015, h * 0.0095, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ripples where the figure meets the water.
  ink(ctx, 0.5);
  ctx.lineWidth = Math.max(1, w * 0.0022);
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.8, w * (0.14 + i * 0.065), h * (0.011 + i * 0.01), 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Reeds along the left bank for depth.
  ink(ctx, 0.7);
  for (let i = 0; i < 22; i += 1) {
    const rx = rand() * w * 0.42;
    const rh = h * (0.06 + rand() * 0.13);
    ctx.save();
    ctx.translate(rx, h * 0.7 + rand() * h * 0.12);
    ctx.rotate((rand() - 0.5) * 0.45);
    ctx.fillRect(-w * 0.0018, -rh, w * 0.0036, rh);
    ctx.restore();
  }
};

export const heroScenes: HeroScene[] = [
  { id: "wave", label: "A cresting wave rendered as a field of squares", draw: drawWave },
  { id: "ship", label: "A container ship rendered as a field of squares", draw: drawShip },
  { id: "harvest", label: "An aquaculture harvest at dawn rendered as a field of squares", draw: drawHarvest }
];

/**
 * Picks a scene at random per page load. `?scene=wave|ship|harvest` pins one,
 * which makes the hero reviewable and screenshot-stable.
 */
export function pickScene(): HeroScene {
  if (typeof window !== "undefined") {
    const wanted = new URLSearchParams(window.location.search).get("scene");
    const pinned = wanted && heroScenes.find((s) => s.id === wanted);
    if (pinned) return pinned;
  }
  return heroScenes[Math.floor(Math.random() * heroScenes.length)];
}
