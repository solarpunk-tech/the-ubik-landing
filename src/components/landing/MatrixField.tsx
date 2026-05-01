import type { CSSProperties } from "react";
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
  low: 86,
  medium: 132,
  high: 188
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

export function MatrixField({
  variant = "subtle",
  density = "medium",
  seed = variant,
  className,
  interactive = false
}: MatrixFieldProps) {
  const baseSeed = hashSeed(seed);
  const count = densityCells[density];
  const cells = Array.from({ length: count }, (_, index) => {
    const x = randomFrom(baseSeed, index);
    const y = randomFrom(baseSeed, index + count);
    const pulse = randomFrom(baseSeed, index + count * 2);
    const scale = 0.64 + randomFrom(baseSeed, index + count * 3) * 1.45;
    const opacity = 0.12 + randomFrom(baseSeed, index + count * 4) * 0.72;
    return {
      style: {
        "--mx": `${(x * 100).toFixed(2)}%`,
        "--my": `${(y * 100).toFixed(2)}%`,
        "--ms": scale.toFixed(2),
        "--mo": opacity.toFixed(2),
        "--md": `${(pulse * -5.5).toFixed(2)}s`
      } as CSSProperties
    };
  });

  return (
    <div
      aria-hidden
      className={cn("matrix-field", variantClass[variant], interactive && "matrix-field-interactive", className)}
    >
      {cells.map((cell, index) => (
        <span key={index} className="matrix-dot" style={cell.style} />
      ))}
    </div>
  );
}
