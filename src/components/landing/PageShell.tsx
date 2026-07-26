import { Link, NavLink, useLocation } from "react-router-dom";
import { AppleLogoIcon, PlusIcon, WindowsLogoIcon, XIcon } from "@phosphor-icons/react";
import { useDetectedOS } from "@/lib/use-detected-os";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { SolarpunkCredit } from "./SolarpunkCredit";
import { ensureLanguage, persistExplicitLanguage, supportedLanguages } from "@/lib/i18n";
import { externalLinks } from "@/lib/links";
import { cn } from "@/lib/utils";

export function PageShell({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const detectedOS = useDetectedOS();
  const downloadHref = `/download?os=${detectedOS}`;
  const DownloadOSIcon = detectedOS === "windows" ? WindowsLogoIcon : AppleLogoIcon;
  const downloadAriaLabel = `Download Ubik Meetings for ${detectedOS === "windows" ? "Windows" : "Mac"}`;
  const resolvedLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "en").split("-")[0];
  const selectedLanguage = supportedLanguages.includes(resolvedLanguage)
    ? resolvedLanguage
    : "en";
  const navItems = [
    { to: "/how-it-works", label: t("nav.how-it-works", { defaultValue: "How it works" }) },
    { href: externalLinks.docs, label: t("nav.guide", { defaultValue: "Guide" }) },
    { to: "/pricing", label: t("nav.pricing", { defaultValue: "Pricing" }) },
    { to: "/blog", label: t("nav.journal", { defaultValue: "Trade Notes" }) },
    { to: "/security", label: t("nav.trust", { defaultValue: "Security" }) },
    { to: downloadHref, label: "Ubik Meetings", download: true }
  ];

  function handleLanguageChange(language: string) {
    persistExplicitLanguage(language);
    // Locale bundles are code-split, so fetch before switching.
    void ensureLanguage(language).then(() => i18n.changeLanguage(language));
  }

  useEffect(() => {
    document.documentElement.lang = selectedLanguage;
  }, [selectedLanguage]);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={cn("site-shell min-h-dvh bg-background text-foreground", pathname === "/" ? "home-route" : "secondary-route")}>
      <header className={cn("header-matrix site-header sticky top-0 z-40", hasScrolled && "is-scrolled")}>
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="Ubik home" className="hidden min-[430px]:inline-flex">
            <BrandLogo inverse={hasScrolled} />
          </Link>
          <Link to="/" aria-label="Ubik home" className="inline-flex min-[430px]:hidden">
            <BrandLogo compact inverse={hasScrolled} />
          </Link>
          <nav className="hidden items-center gap-4 text-sm lg:flex">
            {navItems.map((item) =>
              "href" in item ? (
                <a key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </a>
              ) : item.download ? (
                <NavLink key={item.to} to={item.to} aria-label={downloadAriaLabel} className="nav-meetings-link">
                  <span className="nav-local-copy nav-local-rest" aria-hidden>
                    {item.label}
                  </span>
                  <span className="nav-local-copy nav-local-action" aria-hidden>
                    <DownloadOSIcon weight="fill" />
                    Download
                  </span>
                </NavLink>
              ) : (
                <NavLink key={item.to} to={item.to} className="nav-link">
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <select
              aria-label="Select language"
              value={selectedLanguage}
              onChange={(event) => handleLanguageChange(event.target.value)}
              className="site-language hidden h-8 border px-2 text-xs sm:block"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
            <a
              href={externalLinks.app}
              className="nav-try-link inline-flex h-9 items-center justify-center border border-primary bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Try Ubik Now
            </a>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "nav-menu-button inline-flex size-8 items-center justify-center bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                  )}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
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
                  <Button asChild onClick={() => setMenuOpen(false)}>
                    <a href={externalLinks.app}>
                      Try Ubik Now
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer border-t">
        <div className="container-page grid gap-8 py-10 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <BrandLogo inverse className="site-footer-logo" />
          <SolarpunkCredit />
          <nav className="flex flex-wrap gap-4 text-sm text-white/72 md:justify-self-end">
            <a href={externalLinks.docs}>{t("nav.guide", { defaultValue: "Guide" })}</a>
            <Link to="/legal/privacy">{t("nav.privacy", { defaultValue: "Privacy" })}</Link>
            <Link to="/legal/subprocessors">Subprocessors</Link>
            <Link to="/legal/cookies">Cookies</Link>
            <Link to="/terms-of-service">{t("nav.terms", { defaultValue: "Terms" })}</Link>
            <Link to="/security">{t("nav.trust", { defaultValue: "Security" })}</Link>
            <Link to={downloadHref}>Ubik Meetings</Link>
            <a href={externalLinks.founderMeeting}>
              {t("footer.contact", { defaultValue: "Talk to founders" })}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
