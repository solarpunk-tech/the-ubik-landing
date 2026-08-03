import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AppleLogoIcon,
  CaretDownIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  HardDrivesIcon,
  ShieldWarningIcon,
  WindowsLogoIcon
} from "@phosphor-icons/react";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";
import { useDownloadLinks } from "@/lib/use-download-links";
import { detectOS, type OS } from "@/lib/use-detected-os";
import { trackEvent } from "@/lib/posthog";

type DownloadChoice = "mac_arm64" | "mac_x64" | "windows";

type DownloadOption = {
  id: DownloadChoice;
  os: OS;
  label: string;
  cta: string;
  helper: string;
  fileLabel: string;
  chip: string;
  explainer: string;
};

const downloadOptions: DownloadOption[] = [
  {
    id: "mac_arm64",
    os: "mac",
    label: "Mac (M-series)",
    cta: "Download for Mac",
    helper: "Recommended for Macs with M1, M2, M3, M4, or newer Apple silicon chips.",
    fileLabel: "Ubik-Meeting-arm64.dmg",
    chip: "Apple silicon",
    explainer: "Most Macs sold since late 2020 use Apple silicon. Choose this if your Mac model mentions M1, M2, M3, M4, or newer."
  },
  {
    id: "mac_x64",
    os: "mac",
    label: "Mac (Intel)",
    cta: "Download for Mac",
    helper: "Use this for older Intel-based Macs.",
    fileLabel: "Ubik-Meeting-x64.dmg",
    chip: "Intel",
    explainer: "Choose this if About This Mac says Processor: Intel, or if it is an older pre-M-series Mac."
  },
  {
    id: "windows",
    os: "windows",
    label: "Windows",
    cta: "Download for Windows",
    helper: "For Windows 10 and Windows 11 workstations.",
    fileLabel: "Ubik-Meeting-Setup.exe",
    chip: "Windows 10+",
    explainer: "Choose this for Windows 10 or Windows 11 laptops and desktops."
  }
];

const macSteps = [
  { n: 1, title: "Open the installer", copy: "Open the ubik Meetings DMG from your Downloads folder." },
  { n: 2, title: "Move to Applications", copy: "Drag Ubik into Applications, then launch it from there." },
  { n: 3, title: "Allow local detection", copy: "Enable Screen Recording and Microphone in System Settings, then restart Ubik." }
];

const windowsSteps = [
  { n: 1, title: "Open the installer", copy: "Open Ubik-Meeting-Setup.exe from your Downloads folder." },
  { n: 2, title: "Complete the wizard", copy: "Follow the setup wizard and approve the Windows install prompt." },
  { n: 3, title: "Launch from Start", copy: "Open Ubik from Start and allow the requested local permissions." }
];

const proofCards = [
  {
    title: "Doesn't join meetings.",
    copy: "ubik Meetings stays on your desktop, so there is no extra bot in the guest list.",
    visual: "participants"
  },
  {
    title: "Invisible to screen share.",
    copy: "Keep the helper window outside shared screens while it tracks meeting context locally.",
    visual: "screen"
  },
  {
    title: "Follows your workflow.",
    copy: "Move the widget near the notes, spreadsheet, or call window you are already using.",
    visual: "widget"
  }
] as const;

const compatibleTools = [
  { label: "Zoom", domain: "zoom.us" },
  { label: "Slack", domain: "slack.com" },
  { label: "Webex", domain: "webex.com" },
  { label: "Microsoft Teams", domain: "teams.microsoft.com" },
  { label: "Google Meet", domain: "meet.google.com" }
];

const rosterSurfaces = [
  { label: "Google Meet", detail: "Host and invited guests only", domain: "meet.google.com" },
  { label: "Zoom", detail: "No Ubik participant tile", domain: "zoom.us" },
  { label: "Microsoft Teams", detail: "No bot in the roster", domain: "teams.microsoft.com" },
  { label: "Webex", detail: "Desktop helper stays local", domain: "webex.com" }
];

const notifications = [
  {
    id: "meeting",
    title: "Supplier price review",
    meta: "14:00 - 14:30",
    signal: "in 7m",
    domain: "meet.google.com",
    cta: "Join"
  },
  {
    id: "update",
    title: "Ubik update ready",
    meta: "3.2.1 - 12 MB",
    signal: "2m install",
    domain: "theubik.com",
    cta: "Install"
  },
  {
    id: "alert",
    title: "Compliance gaps flagged",
    meta: "BL-2408-219",
    signal: "review",
    domain: "app.theubik.com",
    cta: "Review"
  }
];

const preReadSources = [
  { label: "Ubik Memory", detail: "Prior price variance and owner notes", domain: "theubik.com" },
  { label: "LinkedIn", detail: "Buyer role and company context", domain: "linkedin.com" },
  { label: "Email", detail: "Latest PO thread and open questions", domain: "gmail.com" },
  { label: "Calendar", detail: "Agenda, attendees, and timing", domain: "calendar.google.com" }
];

function isDesktopInstallDevice() {
  if (typeof window === "undefined") return true;

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const wideEnough = window.matchMedia("(min-width: 1024px)").matches;
  return hasFinePointer && hasHover && wideEnough;
}

function getInitialChoice(requested: string | null): DownloadChoice {
  if (requested === "windows") return "windows";
  if (requested === "mac") return "mac_arm64";
  return detectOS() === "windows" ? "windows" : "mac_arm64";
}

function favicon(domain: string, size = 64) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

function getDownloadHref(choice: DownloadChoice, links: ReturnType<typeof useDownloadLinks>) {
  if (choice === "windows") return links.windows;
  if (choice === "mac_x64") return links.mac_x64;
  return links.mac_arm64;
}

function MeetingNotificationCard() {
  const [active, setActive] = useState(0);
  const current = notifications[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % notifications.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[24rem] border bg-card text-left text-foreground shadow-lg shadow-primary/10">
      <div className="absolute -right-2 -top-2 flex size-6 items-center justify-center bg-primary font-mono text-[0.64rem] font-semibold text-primary-foreground">
        {notifications.length}
      </div>
      <div className="grid h-20 grid-cols-[4px_1fr_auto_auto] overflow-hidden">
        <div className="grid gap-1 py-1.5">
          {notifications.map((notification, index) => (
            <button
              key={notification.id}
              type="button"
              aria-label={`Show ${notification.title}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              className={index === active ? "bg-primary" : "bg-primary/20 transition-colors hover:bg-primary/40"}
            />
          ))}
        </div>
        <div key={current.id} className="flex min-w-0 flex-col justify-center gap-1.5 px-3 motion-safe:animate-notification-fade">
          <div className="flex min-w-0 items-center gap-2">
            <span className={current.id === "alert" ? "size-2 shrink-0 bg-destructive" : "size-2 shrink-0 bg-primary"} aria-hidden />
            <p className="truncate text-sm font-semibold">{current.title}</p>
          </div>
          <p className="font-mono text-[0.68rem] text-foreground/66 dark:text-foreground/78">
            {current.meta} <span className="text-primary">{current.signal}</span>
          </p>
        </div>
        <button type="button" className="flex items-center gap-2 border-l px-3 text-xs font-semibold transition-colors hover:bg-muted">
          <img src={favicon(current.domain)} alt="" className="size-5" />
          {current.cta}
        </button>
        <button type="button" aria-label="Meeting actions" className="flex w-10 items-center justify-center border-l text-foreground/66 transition-colors hover:bg-muted hover:text-foreground">
          <CaretDownIcon aria-hidden />
        </button>
      </div>
    </div>
  );
}

function PreReadPreviewCard() {
  return (
    <div className="border bg-card p-5 text-foreground shadow-lg shadow-primary/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 size-3 shrink-0 bg-primary" aria-hidden />
          <div>
            <p className="text-sm font-semibold">Pre-read preview</p>
            <p className="mt-1 text-xs leading-5 text-foreground/62 dark:text-foreground/76">
              Context Ubik can prepare before you join.
            </p>
          </div>
        </div>
        <span className="border border-primary/30 bg-primary/8 px-2 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-primary">
          Coming soon
        </span>
      </div>
      <div className="mt-4 grid gap-2">
        {preReadSources.map((source) => (
          <div key={source.label} className="grid grid-cols-[auto_1fr] items-center gap-3 border-t pt-2">
            <img src={favicon(source.domain)} alt="" className="size-5" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{source.label}</p>
              <p className="truncate text-[0.68rem] text-foreground/62 dark:text-foreground/76">{source.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingWidget() {
  return (
    <div className="inline-flex border bg-card shadow-lg shadow-primary/10">
      <div className="flex w-12 flex-col items-center gap-3 px-3 py-4">
        <span className="size-3 bg-primary" aria-hidden />
        <div className="flex h-7 items-end gap-1">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="w-1 bg-emerald-500 motion-safe:animate-meeting-bar"
              style={{ height: `${index === 1 ? 18 : 10}px`, animationDelay: `${index * 180}ms` }}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProofVisual({ visual }: { visual: (typeof proofCards)[number]["visual"] }) {
  if (visual === "participants") {
    return (
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Participant roster</p>
          <span className="inline-flex items-center gap-1 border border-primary/20 bg-primary/8 px-2 py-1 text-[0.65rem] font-semibold text-primary">
            <CheckCircleIcon weight="fill" aria-hidden />
            No bot detected
          </span>
        </div>
        {rosterSurfaces.map((surface) => (
          <div key={surface.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t pt-2">
            <span className="flex size-7 items-center justify-center border bg-background">
              <img src={favicon(surface.domain)} alt="" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{surface.label}</p>
              <p className="truncate text-[0.65rem] text-foreground/60 dark:text-foreground/72">{surface.detail}</p>
            </div>
            <span className="text-[0.65rem] text-foreground/60 dark:text-foreground/72">Local</span>
          </div>
        ))}
      </div>
    );
  }

  if (visual === "screen") {
    return (
      <div className="relative h-full min-h-52 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-[54%] border-2 border-emerald-500 bg-card p-4 dark:bg-card/80">
          <span className="bg-primary px-2 py-1 text-[0.66rem] font-semibold text-primary-foreground">Visible to you</span>
          <div className="mt-5 space-y-2 text-xs">
            <p className="font-semibold text-primary">AI Response</p>
            <p className="leading-5 text-foreground/70 dark:text-foreground/82">Flag missing PO context before the reply is approved.</p>
          </div>
        </div>
        <div className="absolute inset-y-0 left-[50%] w-px bg-foreground/60" />
        <div className="absolute inset-y-0 right-0 w-[50%] bg-muted/70 p-4 dark:bg-muted/35">
          <span className="float-right bg-primary px-2 py-1 text-[0.66rem] font-semibold text-primary-foreground">Invisible to others</span>
        </div>
        <div className="absolute bottom-3 left-8 right-8 border bg-background/85 p-4 shadow-lg backdrop-blur">
          <div className="space-y-2">
            <span className="block h-2 w-3/4 bg-muted" />
            <span className="block h-2 w-2/3 bg-muted" />
            <span className="block h-2 w-5/6 bg-muted" />
            <span className="block h-2 w-1/2 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-52 content-center gap-5">
      <div className="relative mx-auto w-full max-w-xs border bg-card p-3 text-foreground">
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-[4/3] bg-background/18 dark:bg-muted/70" />
          <div className="aspect-[4/3] bg-primary/70" />
        </div>
        <div className="mt-3 h-8 bg-background/10 dark:bg-muted/70" />
        <div className="absolute bottom-4 right-4 flex border border-background/35 bg-background/12 backdrop-blur dark:border-border dark:bg-background/90">
          <div className="grid w-8 place-items-center border-r border-background/25 py-2 dark:border-border">
            <span className="size-2 bg-primary" aria-hidden />
          </div>
          <div className="grid gap-1.5 p-2">
            {[HardDrivesIcon, EnvelopeSimpleIcon, ShieldWarningIcon].map((Icon, index) => (
              <span key={index} className="flex h-6 w-28 items-center gap-2 border border-background/20 bg-background/12 px-2 dark:border-border dark:bg-muted/50">
                <Icon className="size-3.5 text-foreground" aria-hidden />
                <span className="h-1.5 flex-1 bg-background/70 dark:bg-foreground/60" />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex items-center gap-2">
        {["command", "up", "down", "left", "right"].map((key) => (
          <span key={key} className="flex h-10 min-w-10 items-center justify-center border bg-card px-3 text-xs font-semibold shadow-sm">
            {key === "command" ? "⌘" : key === "up" ? "↑" : key === "down" ? "↓" : key === "left" ? "←" : "→"}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Download() {
  const links = useDownloadLinks();
  const [params] = useSearchParams();
  const [selectedId, setSelectedId] = useState<DownloadChoice>(() => getInitialChoice(params.get("os")));
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [canInstallDesktop, setCanInstallDesktop] = useState(isDesktopInstallDevice);

  const selected = downloadOptions.find((option) => option.id === selectedId) ?? downloadOptions[0];
  const steps = selected.os === "windows" ? windowsSteps : macSteps;

  const versionText = useMemo(() => {
    if (links.loading) return "Loading latest release...";
    return links.version ? `Version ${links.version}` : "Latest desktop release";
  }, [links.loading, links.version]);

  useEffect(() => {
    const queries = [
      window.matchMedia("(pointer: fine)"),
      window.matchMedia("(hover: hover)"),
      window.matchMedia("(min-width: 1024px)")
    ];

    const updateInstallEligibility = () => setCanInstallDesktop(isDesktopInstallDevice());
    updateInstallEligibility();

    queries.forEach((query) => query.addEventListener("change", updateInstallEligibility));
    return () => {
      queries.forEach((query) => query.removeEventListener("change", updateInstallEligibility));
    };
  }, []);

  function handleDownloadClick(event: MouseEvent<HTMLAnchorElement>, option: DownloadOption) {
    if (links.loading) {
      event.preventDefault();
      return;
    }

    setShowInstallGuide(true);
    trackEvent("download_clicked", { os: option.os, build: option.id, version: links.version });
  }

  return (
    <PageShell>
      <Seo
        title="Download ubik Meetings"
        description="Download ubik Meetings for Mac or Windows. Join meetings from your desktop without adding a bot to the guest list."
      />
      <main className="relative overflow-hidden">
        <section className="meetings-brand-hero relative border-b">
          <MatrixField variant="hero" density="medium" seed="download-meetings-hero" />
          <div className="container-page relative z-10 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
                ubik Meetings stays with you, not inside the call.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-primary-foreground/84 sm:text-lg">
                A private desktop companion for meeting alerts, reviewed notes, and the work context operators need before the next action moves.
              </p>
              {canInstallDesktop ? (
                <div className="mx-auto mt-8 max-w-4xl">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {downloadOptions.map((option) => {
                      const href = getDownloadHref(option.id, links);
                      const OptionIcon = option.os === "windows" ? WindowsLogoIcon : AppleLogoIcon;
                      const isSelected = option.id === selectedId;

                      return (
                        <a
                          key={option.id}
                          href={href}
                          aria-current={isSelected ? "true" : undefined}
                          aria-disabled={links.loading}
                          onClick={(event) => {
                            setSelectedId(option.id);
                            handleDownloadClick(event, option);
                          }}
                          className={[
                            "group grid min-h-36 gap-3 border bg-card p-4 text-left text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected ? "border-primary shadow-lg shadow-primary/10" : "hover:border-primary/50 hover:bg-muted/40",
                            links.loading ? "pointer-events-none opacity-60" : "",
                          ].join(" ")}
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 text-base font-semibold">
                              <OptionIcon weight="fill" className={isSelected ? "text-primary" : "text-foreground/70"} aria-hidden />
                              {option.label}
                            </span>
                            <span className="border bg-background px-2 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-foreground/62 dark:text-foreground/76">
                              {option.chip}
                            </span>
                          </span>
                          <span className="text-sm leading-6 text-foreground/84">{option.explainer}</span>
                          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            {option.cta}
                            <DownloadSimpleIcon aria-hidden />
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mx-auto mt-8 max-w-xl border bg-card px-5 py-4 text-sm font-medium leading-6 text-foreground shadow-sm">
                  Open this page on a Mac or Windows desktop to install ubik Meetings.
                </div>
              )}
              <p className="mt-3 text-xs leading-5 text-primary-foreground/76">
                {canInstallDesktop
                  ? `${selected.helper} ${versionText} · ${selected.fileLabel}`
                  : `${versionText} · Desktop installer available for macOS and Windows`}
              </p>
              <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-primary-foreground/68">
                Not sure which Mac you have? Open Apple menu, About This Mac. M-series means Apple silicon; Intel means the Intel build.
              </p>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div className="order-2 grid content-center gap-8 lg:order-1">
                <MeetingNotificationCard />
              </div>
              <div className="order-1 mx-auto flex flex-col items-center gap-4 lg:order-2">
                <FloatingWidget />
                <p className="max-w-36 text-center font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-primary-foreground/68">
                  Desktop widget
                </p>
              </div>
              <div className="order-3 grid content-center">
                <PreReadPreviewCard />
              </div>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {proofCards.map((card) => (
                <article key={card.title} className="grid gap-5">
                  <div className="min-h-72 border bg-card/60 p-5 dark:bg-card/35">
                    <div className="h-full border bg-background p-4 text-foreground shadow-sm dark:bg-background/65">
                      <ProofVisual visual={card.visual} />
                    </div>
                  </div>
                  <div className="meetings-proof-copy">
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    <p className="mt-2 text-base leading-7 text-foreground/72 dark:text-foreground/82">{card.copy}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="meetings-compatible mt-16 text-center">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
                Compatible with every tool
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                {compatibleTools.map((tool) => (
                  <div key={tool.label} className="inline-flex items-center gap-2 text-sm font-medium">
                    <img src={favicon(tool.domain)} alt="" className="size-4" />
                    {tool.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container-page section-y">
          <div className="mb-10 flex max-w-5xl flex-col gap-3">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {canInstallDesktop ? "Install once. Keep the meeting loop local." : "Install from a desktop when you are ready."}
            </h2>
            <p className="max-w-3xl text-foreground/72 dark:text-foreground/82">
              {canInstallDesktop
                ? "Use the desktop app for meeting alerts now. As the bridge expands, local spreadsheets, portals, and documents can move into reviewed Ubik workflows without turning every file into cloud clutter."
                : "ubik Meetings is a Mac and Windows desktop app. Keep this page handy, then reopen it on your workstation to choose the right installer."}
            </p>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {(canInstallDesktop
              ? steps
              : [
                  { n: 1, title: "Use a workstation", copy: "Open this page from the Mac or Windows machine where you want ubik Meetings installed." },
                  { n: 2, title: "Pick the build", copy: "The desktop page will offer the detected installer first, with a selector for other builds." },
                  { n: 3, title: "Enable local access", copy: "After installing, allow the requested local permissions so meeting detection can run on-device." }
                ]
            ).map(({ n, title, copy }) => (
              <div key={n} className="bg-background p-5 sm:p-6">
                <div className="inline-flex size-8 items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
                  {n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{copy}</p>
              </div>
            ))}
          </div>
          {showInstallGuide ? (
            <p className="mt-5 text-sm font-medium text-primary">
              Download started for {selected.label}. Follow the steps above after the installer appears in Downloads.
            </p>
          ) : null}
        </section>
      </main>
    </PageShell>
  );
}
