import { brandAssets } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
  inverse?: boolean;
};

export function BrandLogo({ compact = false, className, inverse = false }: BrandLogoProps) {
  const sizeClass = compact ? "size-10" : "h-auto w-28 sm:w-32";
  const lightSource = compact ? brandAssets.markLight : brandAssets.wordmarkLight;
  const darkSource = compact ? brandAssets.markDark : brandAssets.wordmarkDark;

  if (inverse) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <img src={darkSource} alt="Ubik" className={sizeClass} />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img
        src={lightSource}
        alt="Ubik"
        className={cn(sizeClass, "dark:hidden")}
      />
      <img
        src={darkSource}
        alt="Ubik"
        className={cn(sizeClass, "hidden dark:block")}
      />
    </span>
  );
}
