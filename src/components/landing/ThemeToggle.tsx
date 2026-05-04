import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  showLabels?: boolean;
};

export function ThemeToggle({ className, showLabels = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const activeTheme = resolvedTheme === "dark" ? "dark" : "light";
  const nextTheme = activeTheme === "dark" ? "light" : "dark";
  const nextThemeLabel = nextTheme === "dark" ? "dark mode" : "light mode";
  const Icon = nextTheme === "dark" ? MoonIcon : SunIcon;

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextThemeLabel}`}
      aria-pressed={activeTheme === "dark"}
      title={`Switch to ${nextThemeLabel}`}
      onClick={() => setTheme(nextTheme)}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 border border-border bg-background/75 px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        showLabels ? "w-full justify-between" : "size-9 px-0",
        className
      )}
    >
      <Icon aria-hidden className="size-4" />
      {showLabels ? (
        <span className="flex flex-1 items-center justify-between gap-3">
          <span>Theme</span>
          <span className="text-xs uppercase text-muted-foreground">{activeTheme}</span>
        </span>
      ) : null}
    </button>
  );
}
