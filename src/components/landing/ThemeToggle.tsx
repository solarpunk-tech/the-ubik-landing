import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  showLabels?: boolean;
};

const themeOptions = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon }
] as const;

export function ThemeToggle({ className, showLabels = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const activeTheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={cn(
        "inline-flex border border-border bg-background p-0.5 text-muted-foreground",
        showLabels ? "w-full" : "w-fit",
        className
      )}
    >
      {themeOptions.map(({ value, label, Icon }) => {
        const isActive = activeTheme === value;

        return (
          <button
            key={value}
            type="button"
            aria-label={`Use ${label.toLowerCase()} theme`}
            aria-pressed={isActive}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex h-8 items-center justify-center gap-1.5 px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              showLabels ? "flex-1" : "size-8 px-0",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon aria-hidden className="size-4" />
            {showLabels ? <span>{label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
