import { brandAssets } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <picture>
        <source srcSet={compact ? brandAssets.markDark : brandAssets.wordmarkDark} media="(prefers-color-scheme: dark)" />
        <img
          src={compact ? brandAssets.markLight : brandAssets.wordmarkLight}
          alt="Ubik"
          className={cn(compact ? "size-10" : "h-auto w-28 sm:w-32")}
        />
      </picture>
    </span>
  );
}
