/**
 * Route loader — the brand mark, working.
 *
 * A blue square orbits the corners of a hairline frame. Everything stays at
 * zero radius, which is the one thing the dot-matrix loader it replaced got
 * wrong for this system.
 *
 * Pure CSS keyframes rather than a JS animation library: this renders inside a
 * Suspense fallback, so it must not depend on any chunk that is still loading.
 */
export function SquareLoader({
  size = 40,
  label = "Loading"
}: {
  size?: number;
  label?: string;
}) {
  return (
    <span
      className="square-loader"
      style={{ "--sq-size": `${size}px` } as React.CSSProperties}
      role="status"
      aria-label={label}
    >
      <span className="square-loader-frame" aria-hidden="true">
        <i />
      </span>
    </span>
  );
}
