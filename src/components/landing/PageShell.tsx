import { Link, NavLink } from "react-router-dom";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "./BrandLogo";
import { SolarpunkCredit } from "./SolarpunkCredit";
import { ThemeToggle } from "./ThemeToggle";
import { persistExplicitLanguage, supportedLanguages } from "@/lib/i18n";
import { externalLinks } from "@/lib/links";
import { cn } from "@/lib/utils";

export function PageShell({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const resolvedLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "en").split("-")[0];
  const selectedLanguage = supportedLanguages.includes(resolvedLanguage)
    ? resolvedLanguage
    : "en";
  const navItems = [
    { to: "/#product", label: t("nav.product", { defaultValue: "Product" }) },
    { to: "/how-it-works", label: t("nav.how-it-works", { defaultValue: "How it works" }) },
    { href: externalLinks.docs, label: t("nav.guide", { defaultValue: "Guide" }) },
    { to: "/pricing", label: t("nav.pricing", { defaultValue: "Pricing" }) },
    { to: "/blog", label: t("nav.journal", { defaultValue: "Journal" }) },
    { to: "/security", label: t("nav.trust", { defaultValue: "Trust" }) }
  ];

  function handleLanguageChange(language: string) {
    persistExplicitLanguage(language);
    void i18n.changeLanguage(language);
  }

  useEffect(() => {
    document.documentElement.lang = selectedLanguage;
  }, [selectedLanguage]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="header-matrix sticky top-0 z-40 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Ubik home" className="hidden min-[430px]:inline-flex">
            <BrandLogo />
          </Link>
          <Link to="/" aria-label="Ubik home" className="inline-flex min-[430px]:hidden">
            <BrandLogo compact />
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground lg:flex">
            {navItems.map((item) =>
              "href" in item ? (
                <a key={item.href} href={item.href} className="hover:text-foreground">
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.to} to={item.to} className="hover:text-foreground">
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
          <div className="flex items-center gap-2">
            <select
              aria-label="Select language"
              value={selectedLanguage}
              onChange={(event) => handleLanguageChange(event.target.value)}
              className="hidden h-8 border bg-background px-2 text-xs text-muted-foreground sm:block"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
            <ThemeToggle className="hidden sm:inline-flex" />
            <a
              href={externalLinks.founderMeeting}
              className="nav-try-link inline-flex h-9 items-center justify-center border border-primary bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("footer.contact", { defaultValue: "Talk to founders" })}
            </a>
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
                  {navItems.map((item) =>
                    "href" in item ? (
                      <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="border-b py-4 text-sm font-medium">
                        {item.label}
                      </a>
                    ) : (
                      <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="border-b py-4 text-sm font-medium">
                        {item.label}
                      </Link>
                    )
                  )}
                  <div className="border-b py-4">
                    <ThemeToggle showLabels />
                  </div>
                  <Button asChild onClick={() => setMenuOpen(false)}>
                    <a href={externalLinks.app}>
                      {t("cta.realise-value", { defaultValue: "Realise true value in 30 days" })}
                    </a>
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
            <a href={externalLinks.docs}>{t("nav.guide", { defaultValue: "Guide" })}</a>
            <Link to="/privacy-policy">{t("nav.privacy", { defaultValue: "Privacy" })}</Link>
            <Link to="/terms-of-service">{t("nav.terms", { defaultValue: "Terms" })}</Link>
            <Link to="/security">{t("nav.trust", { defaultValue: "Trust" })}</Link>
            <a href={externalLinks.founderMeeting}>
              {t("footer.contact", { defaultValue: "Talk to founders" })}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
