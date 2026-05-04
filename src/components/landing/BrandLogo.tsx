import { brandAssets } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  const sizeClass = compact ? "size-10" : "h-auto w-28 sm:w-32";

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src={compact ? brandAssets.markLight : brandAssets.wordmarkLight}
        alt="Ubik"
        className={cn(sizeClass, "dark:hidden")}
      />
      <img
        src={compact ? brandAssets.markDark : brandAssets.wordmarkDark}
        alt="Ubik"
        className={cn(sizeClass, "hidden dark:block")}
      />
    </span>
  );
}
