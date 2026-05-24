const TILE_PX = 42;

const directions: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1]
];

export function applyMatrixDrift(): void {
  if (typeof document === "undefined") return;
  const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
  const root = document.documentElement;
  root.style.setProperty("--matrix-drift-x", `${dx * TILE_PX}px`);
  root.style.setProperty("--matrix-drift-y", `${dy * TILE_PX}px`);
}
