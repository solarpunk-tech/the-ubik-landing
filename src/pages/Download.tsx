import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AppleLogoIcon,
  AppStoreLogoIcon,
  DownloadSimpleIcon,
  GooglePlayLogoIcon,
  InfoIcon,
  WindowsLogoIcon
} from "@phosphor-icons/react";
import { PageShell } from "@/components/landing/PageShell";
import { DesktopTour } from "@/components/landing/download/DesktopTour";
import { InstallGuide } from "@/components/landing/download/InstallGuide";
import { StripHero } from "@/components/landing/download/StripHero";
import { Seo } from "@/components/seo/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDownloadLinks } from "@/lib/use-download-links";
import { detectOS, type OS } from "@/lib/use-detected-os";
import { trackEvent } from "@/lib/posthog";

// Copy on this page is sourced from the desktop app repo (ubik-meetings origin/main);
// DesktopTour.tsx lists the file behind each chapter.

type DownloadChoice = "mac" | "windows";

type DownloadOption = {
  id: DownloadChoice;
  os: OS;
  label: string;
  cta: string;
  fileLabel: string;
  chip: string;
};

type MobileOption = {
  id: "app_store" | "google_play";
  label: string;
  storeUrl: string | null;
};

const mobileOptions: MobileOption[] = [
  {
    id: "app_store",
    label: "App Store",
    storeUrl: null
  },
  {
    id: "google_play",
    label: "Google Play",
    storeUrl: "https://play.google.com/store/apps/details?id=technology.solarpunk.ubik.capture"
  }
];

const downloadOptions: DownloadOption[] = [
  {
    id: "mac",
    os: "mac",
    label: "Mac",
    cta: "Download for Mac",
    fileLabel: "Ubik-universal.dmg",
    chip: "Apple silicon + Intel",
  },
  {
    id: "windows",
    os: "windows",
    label: "Windows",
    cta: "Download for Windows",
    fileLabel: "Ubik-Setup.exe",
    chip: "Windows 10+",
  }
];

const callApps = [
  { label: "Google Meet", domain: "meet.google.com" },
  { label: "Zoom", domain: "zoom.us" },
  { label: "Microsoft Teams", domain: "teams.microsoft.com" },
  { label: "Webex", domain: "webex.com" }
];

const kickerClass = "tabular-nums text-[12.5px] font-medium text-muted-foreground";

function getInitialChoice(requested: string | null): DownloadChoice {
  if (requested === "windows") return "windows";
  if (requested === "mac") return "mac";
  return detectOS() === "windows" ? "windows" : "mac";
}

function favicon(domain: string, size = 64) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

function getDownloadHref(choice: DownloadChoice, links: ReturnType<typeof useDownloadLinks>) {
  if (choice === "windows") return links.windows;
  return links.mac;
}

export default function Download() {
  const links = useDownloadLinks();
  const [params] = useSearchParams();
  const [selectedId, setSelectedId] = useState<DownloadChoice>(() => getInitialChoice(params.get("os")));
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const selected = downloadOptions.find((option) => option.id === selectedId) ?? downloadOptions[0];

  function handleDownloadClick(option: DownloadOption) {
    setShowInstallGuide(true);
    trackEvent("download_clicked", { os: option.os, build: option.id, version: links.version });
  }

  return (
    <PageShell>
      <Seo
        title="Download ubik for Mac and Windows"
        description="The ubik desktop app for Mac and Windows: meeting notes without a bot on the call, dictation into any app, Ask about the window you are in, and your tasks, mail and calendar in one pop-up."
      />
      <main className="relative overflow-hidden">
        <section className="meetings-brand-hero relative border-b">
          <div className="container-page relative z-10 py-14 sm:py-16">
            <div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                ubik lives across your devices to reach where you are
              </h1>
            </div>

            <StripHero />

            <div className="mt-10 grid gap-px border bg-border text-foreground sm:grid-cols-2 lg:grid-cols-4">
              {downloadOptions.map((option) => {
                const href = getDownloadHref(option.id, links);
                const OptionIcon = option.os === "windows" ? WindowsLogoIcon : AppleLogoIcon;
                const isSelected = option.id === selectedId;

                return (
                  <div key={option.id} className="flex flex-col gap-3 bg-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                        <OptionIcon
                          weight="fill"
                          className={isSelected ? "text-primary" : "text-muted-foreground"}
                          aria-hidden
                        />
                        {option.label}
                      </span>
                      <Badge variant="outline" className="tabular-nums text-[0.62rem]">
                        {option.chip}
                      </Badge>
                    </div>
                    <p className="tabular-nums text-[0.66rem] text-muted-foreground">{option.fileLabel}</p>
                    <Button asChild size="lg" variant={isSelected ? "default" : "outline"} className="mt-auto w-full">
                      <a
                        href={href}
                        aria-current={isSelected ? "true" : undefined}
                        onClick={() => {
                          setSelectedId(option.id);
                          handleDownloadClick(option);
                        }}
                      >
                        <DownloadSimpleIcon data-icon="inline-start" aria-hidden />
                        {option.cta}
                      </a>
                    </Button>
                  </div>
                );
              })}
              {mobileOptions.map((option) => {
                const OptionIcon = option.id === "app_store" ? AppStoreLogoIcon : GooglePlayLogoIcon;
                const live = Boolean(option.storeUrl);

                return (
                  <div key={option.id} className={`flex flex-col gap-3 bg-card p-5 ${live ? "" : "opacity-70"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                        <OptionIcon weight={live ? "fill" : "regular"} className={live ? "text-primary" : "text-muted-foreground"} aria-hidden />
                        {option.label}
                      </span>
                      <Badge
                        variant="outline"
                        className={live ? "shrink-0 tabular-nums text-[0.62rem]" : "shrink-0 border-primary/30 tabular-nums text-[0.62rem] text-primary"}
                      >
                        {live ? "Android" : "Coming soon"}
                      </Badge>
                    </div>
                    <p className="tabular-nums text-[0.66rem] text-muted-foreground">{live ? "Capture app" : "iPhone and iPad"}</p>
                    {live ? (
                      <Button asChild size="lg" variant="outline" className="mt-auto w-full">
                        <a
                          href={option.storeUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent("download_clicked", { os: "android", build: option.id })}
                        >
                          <GooglePlayLogoIcon data-icon="inline-start" aria-hidden />
                          Get it on Google Play
                        </a>
                      </Button>
                    ) : (
                      <Button size="lg" variant="outline" className="mt-auto w-full" disabled aria-disabled="true">
                        <AppStoreLogoIcon data-icon="inline-start" aria-hidden />
                        App Store
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container-page section-y" aria-labelledby="desktop-tour-title">
          <div className="max-w-3xl">
            <h2 id="desktop-tour-title" className="text-3xl font-semibold leading-tight sm:text-4xl">
              What the desktop app <em className="not-italic text-primary">does</em>
            </h2>
          </div>
          <div className="mt-10">
            <DesktopTour />
          </div>
          <div className="mt-12 border-y py-6">
            <p className={kickerClass}>Offers to record calls in</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
              {callApps.map((tool) => (
                <div key={tool.label} className="inline-flex items-center gap-2 text-sm font-medium">
                  <img src={favicon(tool.domain)} alt="" className="size-4" />
                  {tool.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page pb-16 sm:pb-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Install on {selected.label}</h2>
            <div className="inline-flex border" role="group" aria-label="Operating system">
              {downloadOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={option.id === selectedId}
                  onClick={() => setSelectedId(option.id)}
                  className={`h-9 px-4 text-sm font-medium ${option.id === selectedId ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-secondary"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <InstallGuide os={selected.os === "windows" ? "windows" : "mac"} />
          </div>
          {showInstallGuide ? (
            <div className="mt-6 flex max-w-3xl gap-3 border border-primary/30 bg-primary/5 p-5">
              <InfoIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <p className="text-sm leading-6 text-foreground">
                <strong className="text-foreground">Download started for {selected.label}</strong>
              </p>
            </div>
          ) : null}
        </section>
      </main>
    </PageShell>
  );
}
