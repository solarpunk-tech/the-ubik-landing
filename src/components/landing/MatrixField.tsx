import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTime, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

type MatrixVariant = "hero" | "process" | "security" | "cta" | "subtle";
type MatrixDensity = "low" | "medium" | "high";

interface MatrixFieldProps {
  variant?: MatrixVariant;
  density?: MatrixDensity;
  seed?: string;
  className?: string;
  interactive?: boolean;
}

const densityCells: Record<MatrixDensity, number> = {
  low: 18,
  medium: 28,
  high: 42
};

const variantClass: Record<MatrixVariant, string> = {
  hero: "matrix-field-hero",
  process: "matrix-field-process",
  security: "matrix-field-security",
  cta: "matrix-field-cta",
  subtle: "matrix-field-subtle"
};

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomFrom(seed: number, index: number): number {
  let value = seed + Math.imul(index + 1, 374761393);
  value = (value ^ (value >>> 13)) >>> 0;
  value = Math.imul(value, 1274126177) >>> 0;
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

type SwarmCell = {
  x: number;
  y: number;
  phase: number;
  size: number;
  depth: number;
};

function SwarmNode({
  cell,
  cursorX,
  cursorY,
  reducedMotion
}: {
  cell: SwarmCell;
  cursorX: ReturnType<typeof useSpring>;
  cursorY: ReturnType<typeof useSpring>;
  reducedMotion: boolean;
}) {
  const time = useTime();
  const left = useTransform(() => {
    if (reducedMotion) return `${cell.x}%`;

    const dx = cell.x - cursorX.get();
    const dy = cell.y - cursorY.get();
    const distance = Math.hypot(dx, dy);
    const influence = Math.max(0, 1 - distance / 46);
    const current = time.get() / (1200 + cell.depth * 520);
    const wave = Math.sin(current + cell.phase + distance * 0.05) * (1.4 + cell.depth * 2.2);

    return `${cell.x + dx * influence * 0.22 + Math.cos(cell.phase) * wave}%`;
  });
  const top = useTransform(() => {
    if (reducedMotion) return `${cell.y}%`;

    const dx = cell.x - cursorX.get();
    const dy = cell.y - cursorY.get();
    const distance = Math.hypot(dx, dy);
    const influence = Math.max(0, 1 - distance / 46);
    const current = time.get() / (1350 + cell.depth * 480);
    const wave = Math.cos(current + cell.phase * 0.7 + distance * 0.04) * (1.2 + cell.depth * 2);

    return `${cell.y + dy * influence * 0.18 + wave}%`;
  });
  const opacity = useTransform(() => {
    if (reducedMotion) return 0.38 + cell.depth * 0.28;

    const distance = Math.hypot(cell.x - cursorX.get(), cell.y - cursorY.get());
    const influence = Math.max(0, 1 - distance / 38);
    const shimmer = (Math.sin(time.get() / 900 + cell.phase) + 1) / 2;

    return 0.16 + cell.depth * 0.36 + shimmer * 0.18 + influence * 0.34;
  });
  const scale = useTransform(() => {
    if (reducedMotion) return cell.size;

    const distance = Math.hypot(cell.x - cursorX.get(), cell.y - cursorY.get());
    const influence = Math.max(0, 1 - distance / 34);
    const pulse = (Math.sin(time.get() / 760 + cell.phase) + 1) / 2;

    return cell.size * (0.72 + pulse * 0.28 + influence * 0.65);
  });

  return (
    <motion.span
      className="matrix-dot"
      style={{
        left,
        top,
        opacity,
        scale
      }}
    />
  );
}

export function MatrixField({
  variant = "subtle",
  density = "medium",
  seed = variant,
  className,
  interactive = false
}: MatrixFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(50);
  const smoothX = useSpring(cursorX, { stiffness: 90, damping: 24, mass: 0.42 });
  const smoothY = useSpring(cursorY, { stiffness: 90, damping: 24, mass: 0.42 });
  const baseSeed = hashSeed(seed);
  const count = densityCells[density];
  const cells = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        x: Number((randomFrom(baseSeed, index) * 100).toFixed(3)),
        y: Number((randomFrom(baseSeed, index + count) * 100).toFixed(3)),
        phase: randomFrom(baseSeed, index + count * 2) * Math.PI * 2,
        size: Number((0.72 + randomFrom(baseSeed, index + count * 3) * 1.35).toFixed(3)),
        depth: Number(randomFrom(baseSeed, index + count * 4).toFixed(3))
      })),
    [baseSeed, count]
  );

  useEffect(() => {
    if (reducedMotion || !interactive) return;

    const updatePointer = (event: PointerEvent) => {
      const rect = fieldRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return;

      cursorX.set(((event.clientX - rect.left) / rect.width) * 100);
      cursorY.set(((event.clientY - rect.top) / rect.height) * 100);
    };
    const settlePointer = () => {
      cursorX.set(50);
      cursorY.set(50);
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerdown", updatePointer, { passive: true });
    window.addEventListener("pointerleave", settlePointer);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", updatePointer);
      window.removeEventListener("pointerleave", settlePointer);
    };
  }, [cursorX, cursorY, interactive, reducedMotion]);

  return (
    <div
      ref={fieldRef}
      aria-hidden
      className={cn("matrix-field", variantClass[variant], interactive && "matrix-field-interactive", className)}
    >
      {cells.map((cell, index) => (
        <SwarmNode key={index} cell={cell} cursorX={smoothX} cursorY={smoothY} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}
