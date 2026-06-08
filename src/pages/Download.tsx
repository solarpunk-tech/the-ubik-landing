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
  SparkleIcon,
  WindowsLogoIcon
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
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
};

const downloadOptions: DownloadOption[] = [
  {
    id: "mac_arm64",
    os: "mac",
    label: "macOS - Apple Silicon",
    cta: "Download for Mac",
    helper: "Recommended for most Macs sold since 2020.",
    fileLabel: "Ubik-Meeting-arm64.dmg"
  },
  {
    id: "mac_x64",
    os: "mac",
    label: "macOS - Intel",
    cta: "Download for Mac",
    helper: "Use this if your Mac has an Intel processor.",
    fileLabel: "Ubik-Meeting-x64.dmg"
  },
  {
    id: "windows",
    os: "windows",
    label: "Windows",
    cta: "Download for Windows",
    helper: "For Windows 10 and Windows 11 workstations.",
    fileLabel: "Ubik-Meeting-Setup.exe"
  }
];

const macSteps = [
  { n: 1, title: "Open the installer", copy: "Open the Ubik Meetings DMG from your Downloads folder." },
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
    copy: "Ubik Meetings stays on your desktop, so there is no extra bot in the guest list.",
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
    <div className="relative mx-auto w-full max-w-[24rem] border bg-card text-left shadow-lg shadow-primary/10">
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
    <div className="border bg-card p-5 shadow-lg shadow-primary/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SparkleIcon className="mt-0.5 text-primary" aria-hidden />
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
          <p className="text-sm font-semibold">Meeting participants</p>
          <span className="inline-flex items-center gap-1 bg-primary/8 px-2 py-1 text-[0.65rem] font-semibold text-primary">
            <CheckCircleIcon weight="fill" aria-hidden />
            No bot detected
          </span>
        </div>
        {["Gina Huels", "Todd Cremin", "Holly Gleason", "Tomas Hansen"].map((name, index) => (
          <div key={name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t pt-2">
            <span className="size-7 bg-primary/10" aria-hidden />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{name}</p>
              <p className="truncate text-[0.65rem] text-foreground/60">meeting guest</p>
            </div>
            <span className="text-[0.65rem] text-foreground/60">{index === 0 ? "Owner" : "Speaker"}</span>
          </div>
        ))}
      </div>
    );
  }

  if (visual === "screen") {
    return (
      <div className="relative h-full min-h-52 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-[54%] border-2 border-emerald-500 bg-card p-4">
          <span className="bg-foreground/72 px-2 py-1 text-[0.66rem] font-semibold text-background">Visible to you</span>
          <div className="mt-5 space-y-2 text-xs">
            <p className="font-semibold text-primary">AI Response</p>
            <p className="leading-5 text-foreground/70">Flag missing PO context before the reply is approved.</p>
          </div>
        </div>
        <div className="absolute inset-y-0 left-[50%] w-px bg-foreground/60" />
        <div className="absolute inset-y-0 right-0 w-[50%] bg-muted/80 p-4">
          <span className="float-right bg-foreground/72 px-2 py-1 text-[0.66rem] font-semibold text-background">Invisible to others</span>
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
      <div className="relative mx-auto w-full max-w-xs border bg-foreground p-3 text-background">
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-[4/3] bg-background/18" />
          <div className="aspect-[4/3] bg-primary/70" />
        </div>
        <div className="mt-3 h-8 bg-background/10" />
        <div className="absolute bottom-4 right-4 flex border border-background/35 bg-background/12 backdrop-blur">
          <div className="grid w-8 place-items-center border-r border-background/25 py-2">
            <span className="size-2 bg-primary" aria-hidden />
          </div>
          <div className="grid gap-1.5 p-2">
            {[HardDrivesIcon, EnvelopeSimpleIcon, ShieldWarningIcon].map((Icon, index) => (
              <span key={index} className="flex h-6 w-28 items-center gap-2 border border-background/20 bg-background/12 px-2">
                <Icon className="size-3.5 text-background" aria-hidden />
                <span className="h-1.5 flex-1 bg-background/70" />
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
  const selectedHref = selected.id === "windows" ? links.windows : selected.id === "mac_x64" ? links.mac_x64 : links.mac_arm64;
  const SelectedOSIcon = selected.os === "windows" ? WindowsLogoIcon : AppleLogoIcon;
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

  function handleDownloadClick(event: MouseEvent<HTMLAnchorElement>) {
    if (links.loading) {
      event.preventDefault();
      return;
    }

    setShowInstallGuide(true);
    trackEvent("download_clicked", { os: selected.os, build: selected.id, version: links.version });
  }

  return (
    <PageShell>
      <Seo
        title="Download Ubik Meetings"
        description="Download Ubik Meetings for Mac or Windows. Join meetings from your desktop without adding a bot to the guest list."
      />
      <main className="relative overflow-hidden">
        <section className="relative border-b bg-background">
          <MatrixField variant="hero" density="medium" seed="download-meetings-hero" />
          <div className="container-page relative z-10 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
                Ubik Meetings stays with you, not inside the call.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-foreground/72 dark:text-foreground/82 sm:text-lg">
                A private desktop companion for meeting alerts, reviewed notes, and the work context operators need before the next action moves.
              </p>
              {canInstallDesktop ? (
                <div className="mx-auto mt-8 flex max-w-3xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="lg" className="h-11 px-5 text-base">
                    <a
                      href={selectedHref}
                      aria-disabled={links.loading}
                      onClick={handleDownloadClick}
                      className={links.loading ? "pointer-events-none opacity-60" : undefined}
                    >
                      <SelectedOSIcon weight="fill" data-icon="inline-start" />
                      {selected.cta}
                      <DownloadSimpleIcon data-icon="inline-end" />
                    </a>
                  </Button>
                  <label className="flex h-11 items-center gap-2 border bg-background px-3 text-sm text-foreground/72 dark:text-foreground/82">
                    <span className="whitespace-nowrap">Change build</span>
                    <select
                      aria-label="Select installer"
                      value={selectedId}
                      onChange={(event) => {
                        setSelectedId(event.target.value as DownloadChoice);
                        setShowInstallGuide(false);
                      }}
                      className="h-8 min-w-44 bg-transparent text-sm font-medium text-foreground outline-none"
                    >
                      {downloadOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : (
                <div className="mx-auto mt-8 max-w-xl border bg-card px-5 py-4 text-sm font-medium leading-6 text-foreground shadow-sm">
                  Open this page on a Mac or Windows desktop to install Ubik Meetings.
                </div>
              )}
              <p className="mt-3 text-xs leading-5 text-foreground/62 dark:text-foreground/76">
                {canInstallDesktop
                  ? `${selected.helper} ${versionText} · ${selected.fileLabel}`
                  : `${versionText} · Desktop installer available for macOS and Windows`}
              </p>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div className="order-2 grid content-center gap-8 lg:order-1">
                <MeetingNotificationCard />
              </div>
              <div className="order-1 mx-auto flex flex-col items-center gap-4 lg:order-2">
                <FloatingWidget />
                <p className="max-w-36 text-center font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-foreground/60">
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
                  <div className="min-h-72 border bg-shell p-5">
                    <div className="h-full border bg-background/78 p-4 shadow-sm">
                      <ProofVisual visual={card.visual} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    <p className="mt-2 text-base leading-7 text-foreground/72 dark:text-foreground/82">{card.copy}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-foreground/58">
                Compatible with every tool
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                {compatibleTools.map((tool) => (
                  <div key={tool.label} className="inline-flex items-center gap-2 text-sm font-medium text-foreground/76 dark:text-foreground/86">
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
                : "Ubik Meetings is a Mac and Windows desktop app. Keep this page handy, then reopen it on your workstation to choose the right installer."}
            </p>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {(canInstallDesktop
              ? steps
              : [
                  { n: 1, title: "Use a workstation", copy: "Open this page from the Mac or Windows machine where you want Ubik Meetings installed." },
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
