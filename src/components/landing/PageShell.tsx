import { Link, NavLink } from "react-router-dom";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "./BrandLogo";
import { SolarpunkCredit } from "./SolarpunkCredit";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/#product", label: "Product" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Journal" },
  { to: "/security", label: "Trust" }
];

export function PageShell({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground lg:flex">
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
            <Link
              to="/try"
              className="nav-try-link inline-flex h-9 items-center justify-center border border-primary bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Try now
            </Link>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex size-8 items-center justify-center bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden",
                    menuOpen ? "text-foreground" : "text-primary"
                  )}
                  aria-label="Open menu"
                >
                  {menuOpen ? <XIcon aria-hidden /> : <PlusIcon aria-hidden />}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 px-5" showCloseButton={false}>
                <SheetHeader className="px-0 pt-5">
                  <SheetTitle>
                    <BrandLogo />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="border-b py-4 text-sm font-medium">
                      {item.label}
                    </Link>
                  ))}
                  <Button asChild onClick={() => setMenuOpen(false)}>
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
        <div className="container-page grid gap-8 py-10 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <BrandLogo />
          <SolarpunkCredit />
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground md:justify-self-end">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-of-service">Terms</Link>
            <Link to="/security">Trust</Link>
            <a href="mailto:shubhranshu@solarpunk.technology?subject=Ubik%20founder%20demo">Talk to founders</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
