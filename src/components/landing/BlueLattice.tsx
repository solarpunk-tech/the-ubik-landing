import type { ComponentProps } from "react";
import { LatticeField } from "@/components/ui/lattice-field";
import { cn } from "@/lib/utils";

// Mischief's Lattice Field in ubik blue. `edge` is where the dots gather; they
// thin out toward the opposite side, which keeps text there on clear ground.
const FADE = {
  right: "[mask-image:linear-gradient(to_left,black_30%,transparent_80%)]",
  bottom: "[mask-image:linear-gradient(to_top,black_20%,transparent_65%)]"
} as const;

export function BlueLattice({ edge = "right", className, surfaceClassName, ...props }: { edge?: keyof typeof FADE } & ComponentProps<typeof LatticeField>) {
  return (
    <LatticeField
      spacing={13}
      dotSize={2.6}
      color="--dither-ink"
      echoColor="--dither-color-blue"
      pointerRadius={120}
      push={22}
      className={className}
      surfaceClassName={cn("opacity-100", FADE[edge], surfaceClassName)}
      {...props}
    />
  );
}
