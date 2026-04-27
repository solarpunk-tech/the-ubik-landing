import { Link, NavLink } from "react-router-dom";
import { ListIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { BrandLogo } from "./BrandLogo";

const navItems = [
  { to: "/#product", label: "Product" },
  { to: "/#security", label: "Security" },
  { to: "/security", label: "CTO memo" },
  { to: "/privacy-policy", label: "Privacy" },
  { to: "/terms-of-service", label: "Terms" }
];

export function PageShell({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/94 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Ubik home" className="hidden min-[430px]:inline-flex">
            <BrandLogo />
          </Link>
          <Link to="/" aria-label="Ubik home" className="inline-flex min-[430px]:hidden">
            <BrandLogo compact />
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="hover:text-foreground">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <select
              aria-label="Select language"
              value={i18n.language.split("-")[0]}
              onChange={(event) => void i18n.changeLanguage(event.target.value)}
              className="hidden h-8 border bg-background px-2 text-xs text-muted-foreground sm:block"
            >
              {Object.keys(i18n.services.resourceStore.data).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
            <Button asChild size="sm">
              <Link to="/try">Try now</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                  aria-label="Open menu"
                >
                  <ListIcon aria-hidden />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>
                    <BrandLogo />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link key={item.to} to={item.to} className="text-sm font-medium">
                      {item.label}
                    </Link>
                  ))}
                  <Separator />
                  <Button asChild>
                    <Link to="/try">Try now</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t bg-shell">
        <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <BrandLogo />
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-of-service">Terms</Link>
            <Link to="/security">Security memo</Link>
            <a href="mailto:shubhranshu@solarpunk.technology?subject=Ubik%20founder%20demo">Talk to founders</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
