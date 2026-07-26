import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
const STORAGE_KEY = "ubik-theme";

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

/** Reads the stored choice, falling back to the OS preference. */
export function resolveInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Private mode / blocked storage — fall through to the OS preference.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Dependency-free theme toggle. The previous one used next-themes, which is no
 * longer a dependency of this project — this flips a class on <html>, which is
 * what the `.dark` token block and the `dark:` variant already key off.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (e: MediaQueryListEvent) => {
      // Only follow the OS while the visitor hasn't made an explicit choice.
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        /* ignore */
      }
      const next: Theme = e.matches ? "dark" : "light";
      setTheme(next);
      apply(next);
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  const Icon = next === "dark" ? MoonIcon : SunIcon;

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      onClick={() => {
        setTheme(next);
        apply(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
      }}
      className={cn("theme-toggle inline-flex size-8 items-center justify-center", className)}
    >
      <Icon aria-hidden className="size-4" weight="fill" />
    </button>
  );
}
