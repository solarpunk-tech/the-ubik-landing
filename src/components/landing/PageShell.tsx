import { Link, NavLink, useLocation } from "react-router-dom";
import { AppleLogoIcon, PlusIcon, WindowsLogoIcon, XIcon } from "@phosphor-icons/react";
import { useDetectedOS } from "@/lib/use-detected-os";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { workflowPath, workflowSlugs } from "@/lib/workflows";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { SolarpunkCredit } from "./SolarpunkCredit";
import { PortIsland } from "./PortIsland";
import { DotWordmark } from "./DotWordmark";
import { SocBadge } from "./SocBadge";
import { ensureLanguage, LANGUAGE_SWITCHER_ENABLED, persistExplicitLanguage, supportedLanguages } from "@/lib/i18n";
import { appLink, externalLinks } from "@/lib/links";
import { trackEvent } from "@/lib/posthog";
import { cn } from "@/lib/utils";

export function PageShell({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const detectedOS = useDetectedOS();
  const downloadHref = `/download?os=${detectedOS}`;
  const DownloadOSIcon = detectedOS === "windows" ? WindowsLogoIcon : AppleLogoIcon;
  const downloadAriaLabel = `Download ubik Meetings for ${detectedOS === "windows" ? "Windows" : "Mac"}`;
  const resolvedLanguage = (i18n.resolvedLanguage ?? i18n.language ?? "en").split("-")[0];
  const selectedLanguage = supportedLanguages.includes(resolvedLanguage)
    ? resolvedLanguage
    : "en";
  const navItems = [
    { to: "/workflows", label: t("nav.workflows") },
    { to: "/platform", label: t("nav.platform") },
    { to: "/pricing", label: t("nav.pricing", { defaultValue: "Pricing" }) },
    { to: "/security", label: t("nav.trust", { defaultValue: "Security" }) },
    { to: "/blog", label: t("nav.journal", { defaultValue: "Trade Notes" }) },
    { to: downloadHref, label: "Ubik App", download: true }
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
          <Link to="/" aria-label="ubik home" className="hidden min-[430px]:inline-flex">
            <BrandLogo inverse={hasScrolled} />
          </Link>
          <Link to="/" aria-label="ubik home" className="inline-flex min-[430px]:hidden">
            <BrandLogo compact inverse={hasScrolled} />
          </Link>
          <nav className="hidden items-center gap-4 text-sm lg:flex">
            {navItems.map((item) =>
              item.download ? (
                <NavLink key={item.to} to={item.to} aria-label={downloadAriaLabel} className="nav-meetings-link">
                  <span className="nav-local-copy nav-local-rest" aria-hidden>
                    {item.label}
                  </span>
                  <span className="nav-local-copy nav-local-action" aria-hidden>
                    <DownloadOSIcon weight="fill" />
                    Download
                  </span>
                </NavLink>
              ) : item.to === "/workflows" ? (
                <WorkflowsMenu key={item.to} label={item.label} />
              ) : (
                <NavLink key={item.to} to={item.to} className="nav-link">
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {LANGUAGE_SWITCHER_ENABLED && (
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
            )}
            <a
              href={appLink("nav_sign_in")}
              onClick={() => trackEvent("cta_clicked", { cta: "open_app", location: "nav" })}
              className="nav-link text-sm max-sm:!hidden"
            >
              {t("nav.signIn")}
            </a>
            <Link
              to="/demo"
              onClick={() => trackEvent("cta_clicked", { cta: "discuss_workflow", location: "nav" })}
              className="nav-try-link inline-flex h-9 items-center whitespace-nowrap justify-center border border-primary bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("nav.cta")}
            </Link>
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
                  {navItems.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="border-b py-4 text-sm font-medium">
                      {item.label}
                    </Link>
                  ))}
                  <a
                    href={appLink("mobile_nav_sign_in")}
                    onClick={() => trackEvent("cta_clicked", { cta: "open_app", location: "mobile_nav" })}
                    className="border-b py-4 text-sm font-medium"
                  >
                    {t("nav.signIn")}
                  </a>
                  <Button asChild className="mt-4" onClick={() => setMenuOpen(false)}>
                    <Link to="/demo" onClick={() => trackEvent("cta_clicked", { cta: "discuss_workflow", location: "mobile_nav" })}>
                      {t("nav.cta")}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {children}
      <footer className="relative overflow-hidden border-t border-border bg-background text-foreground">
        <div className="container-page relative z-10 pt-14">
          <div className="border-b border-border pb-8">
            {/* Wordmark and the SOC 2 status share one centred row, so neither floats against the other. */}
            <div className="flex flex-wrap items-center justify-between gap-6">
              <BrandLogo />
              <Link
                to="/security"
                className="flex items-center gap-3 rounded-xl border border-border bg-card/70 py-2 pl-4 pr-2 transition-colors hover:border-border-strong"
                aria-label={t("footer.socLink")}
              >
                <span className="text-[13px] leading-5 text-muted-foreground">
                  <span className="block font-medium text-foreground">{t("footer.socTitle")}</span>
                  {t("footer.socStatus")}
                </span>
                <SocBadge label={t("footer.socBadge")} className="h-14 w-12" />
              </Link>
            </div>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-muted-foreground">{t("footer.tagline")}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                {t("footer.backedBy")}
                <a href="https://www.antler.co" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary-text">
                  <img src="https://www.google.com/s2/favicons?domain=antler.co&sz=64" alt="" className="size-4 rounded-[3px]" loading="lazy" />
                  Antler
                </a>
              </span>
              <span aria-hidden className="h-4 w-px bg-border" />
              <Link
                to="/demo"
                onClick={() => trackEvent("cta_clicked", { cta: "discuss_workflow", location: "footer" })}
                className="font-medium text-primary-text hover:underline"
              >
                {t("nav.cta")} →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-3">
            <nav aria-label={t("footer.product")} className="grid content-start gap-2.5 text-sm">
              <p className="text-[12.5px] font-medium text-muted-foreground">{t("footer.product")}</p>
              <Link to="/workflows" className="hover:text-primary-text">{t("footer.workflows")}</Link>
              <Link to="/platform" className="hover:text-primary-text">{t("footer.platform")}</Link>
              <Link to="/pricing" className="hover:text-primary-text">{t("footer.pricing")}</Link>
              <Link to={downloadHref} className="hover:text-primary-text">Ubik App</Link>
            </nav>
            <nav aria-label={t("footer.resources")} className="grid content-start gap-2.5 text-sm">
              <p className="text-[12.5px] font-medium text-muted-foreground">{t("footer.resources")}</p>
              <Link to="/blog" className="hover:text-primary-text">{t("footer.notes")}</Link>
              <a href={externalLinks.docs} className="hover:text-primary-text">{t("nav.guide", { defaultValue: "Guide" })}</a>
              <Link to="/security" className="hover:text-primary-text">{t("nav.trust", { defaultValue: "Security" })}</Link>
            </nav>
            <nav aria-label={t("footer.legal")} className="grid content-start gap-2.5 text-sm">
              <p className="text-[12.5px] font-medium text-muted-foreground">{t("footer.legal")}</p>
              <Link to="/legal/privacy" className="hover:text-primary-text">{t("nav.privacy", { defaultValue: "Privacy" })}</Link>
              <Link to="/legal/subprocessors" className="hover:text-primary-text">Subprocessors</Link>
              <Link to="/legal/cookies" className="hover:text-primary-text">Cookies</Link>
              <Link to="/terms-of-service" className="hover:text-primary-text">{t("nav.terms", { defaultValue: "Terms" })}</Link>
            </nav>
          </div>
        </div>
        <PortIsland className="-mt-4 lg:-mt-24" />
        <div className="relative z-10 border-t border-border bg-background">
          <div className="container-page grid items-center gap-4 py-6 text-[12.5px] text-muted-foreground lg:grid-cols-[1fr_minmax(0,38rem)_1fr]">
            <SolarpunkCredit />
            <div className="relative order-first mx-auto w-full max-w-[34rem] lg:order-none">
              <DotWordmark className="h-32 sm:h-40" />
              <Link
                to="/demo"
                onClick={() => trackEvent("cta_clicked", { cta: "discuss_workflow", location: "footer_wordmark" })}
                className="absolute left-1/2 top-1/2 inline-flex h-9 whitespace-nowrap -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-border bg-background/90 px-4 text-[13px] font-medium text-foreground shadow-sm backdrop-blur hover:border-border-strong"
              >
                {t("nav.cta")}
              </Link>
            </div>
            <span className="text-center lg:text-right">© {new Date().getFullYear()} {t("footer.company")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** The header's Workflows entry: opens on hover or focus with the four workflow pages, each in a line. */
function WorkflowsMenu({ label }: { label: string }) {
  const { t } = useTranslation();
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="nav-link nav-menu-trigger bg-transparent hover:bg-transparent">{label}</NavigationMenuTrigger>
          <NavigationMenuContent className="nav-menu-panel !mt-3 !w-[54rem] rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
            <ul className="grid grid-cols-3 gap-1">
              {workflowSlugs.map((slug) => (
                <li key={slug}>
                  <NavigationMenuLink asChild>
                    <Link to={workflowPath(slug)} className="!block rounded-lg !p-3 hover:bg-muted">
                      <span className="block text-sm font-semibold text-foreground">{t(`workflows.items.${slug}.name`)}</span>
                      <span className="mt-1 block text-[13px] leading-5 text-muted-foreground">{t(`workflows.items.${slug}.summary`)}</span>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
            <NavigationMenuLink asChild>
              <Link to="/workflows" className="mt-1 !flex items-center justify-between rounded-lg border-t border-border !px-3 !py-2.5 text-[13px] font-medium text-primary-text hover:bg-muted">
                {t("workflows.labels.all")} <span aria-hidden>→</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
