import { type MouseEvent, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AppleLogoIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  GooglePlayLogoIcon,
  HardDrivesIcon,
  InfoIcon,
  ShieldWarningIcon,
  WindowsLogoIcon
} from "@phosphor-icons/react";
import { MeetingsLiveStrip } from "@/components/landing/MeetingsLiveStrip";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

type MobileOption = {
  id: "windows_store" | "google_play";
  label: string;
  storeUrl: string | null;
};

const mobileOptions: MobileOption[] = [
  {
    id: "windows_store",
    label: "Windows Store",
    storeUrl: null
  },
  {
    id: "google_play",
    label: "Google Play",
    storeUrl: null
  }
];

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
    kicker: "Guest list",
    title: "Doesn't join meetings.",
    copy: "ubik Meetings stays on your desktop, so there is no extra bot in the guest list.",
    visual: "participants"
  },
  {
    kicker: "Screen share",
    title: "Invisible to screen share.",
    copy: "Keep the helper window outside shared screens while it tracks meeting context locally.",
    visual: "screen"
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

const screenShareRows = [
  { surface: "Your screen", detail: "Helper window with meeting context", state: "Visible" },
  { surface: "Shared screen", detail: "Only the window you chose to share", state: "Hidden" },
  { surface: "Recording", detail: "No Ubik overlay in the captured frame", state: "Hidden" }
];

const kickerClass =
  "font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-foreground/60 dark:text-foreground/70";

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

function SpecimenHeader({ label, note }: { label: string; note?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2.5">
      <span className={kickerClass}>{label}</span>
      {note ? <span className="font-mono text-[0.66rem] text-foreground/60 dark:text-foreground/72">{note}</span> : null}
    </div>
  );
}

function NotificationRail() {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-0">
        <SpecimenHeader label="Desktop alerts" note={`${notifications.length} queued`} />
        <ul className="divide-y">
          {notifications.map((notification) => (
            <li key={notification.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
              <img src={favicon(notification.domain)} alt="" className="size-5" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{notification.title}</p>
                <p className="truncate font-mono text-[0.68rem] text-foreground/62 dark:text-foreground/76">
                  {notification.meta} <span className="text-primary">{notification.signal}</span>
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-[0.64rem] uppercase tracking-[0.1em]">
                {notification.cta}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function PreReadPanel() {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-0">
        <SpecimenHeader label="Pre-read preview" />
        <div className="flex items-start justify-between gap-4 border-b px-4 py-3">
          <p className="text-sm leading-6 text-foreground/72 dark:text-foreground/82">
            Context Ubik can assemble before you join.
          </p>
          <Badge
            variant="outline"
            className="shrink-0 border-primary/30 bg-primary/5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary"
          >
            Coming soon
          </Badge>
        </div>
        <dl className="divide-y">
          {preReadSources.map((source) => (
            <div key={source.label} className="grid grid-cols-[auto_1fr] items-center gap-3 px-4 py-3">
              <img src={favicon(source.domain)} alt="" className="size-5" />
              <div className="min-w-0">
                <dt className="truncate text-sm font-medium text-foreground">{source.label}</dt>
                <dd className="m-0 truncate text-xs text-foreground/62 dark:text-foreground/76">{source.detail}</dd>
              </div>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function ProofVisual({ visual }: { visual: (typeof proofCards)[number]["visual"] }) {
  if (visual === "participants") {
    return (
      <div>
        <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2.5">
          <span className={kickerClass}>Participant roster</span>
          <span className="inline-flex items-center gap-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-primary">
            <CheckCircleIcon weight="fill" aria-hidden />
            No bot
          </span>
        </div>
        <ul className="divide-y">
          {rosterSurfaces.map((surface) => (
            <li key={surface.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5">
              <img src={favicon(surface.domain)} alt="" className="size-4" />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">{surface.label}</p>
                <p className="truncate text-[0.68rem] text-foreground/62 dark:text-foreground/76">{surface.detail}</p>
              </div>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-foreground/60 dark:text-foreground/72">
                Local
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2.5">
        <span className={kickerClass}>Share surface</span>
        <span className="font-mono text-[0.66rem] text-foreground/60 dark:text-foreground/72">local only</span>
      </div>
      <table className="w-full text-left text-xs">
        <tbody>
          {screenShareRows.map((row) => (
            <tr key={row.surface} className="border-b last:border-0">
              <td className="px-4 py-3 align-top">
                <p className="font-medium text-foreground">{row.surface}</p>
                <p className="mt-1 text-[0.68rem] leading-5 text-foreground/62 dark:text-foreground/76">{row.detail}</p>
              </td>
              <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-[0.62rem] uppercase tracking-[0.1em] text-foreground/70 dark:text-foreground/80">
                {row.state}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Download() {
  const links = useDownloadLinks();
  const [params] = useSearchParams();
  const [selectedId, setSelectedId] = useState<DownloadChoice>(() => getInitialChoice(params.get("os")));
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const selected = downloadOptions.find((option) => option.id === selectedId) ?? downloadOptions[0];
  const steps = selected.os === "windows" ? windowsSteps : macSteps;

  const versionText = useMemo(() => {
    if (links.loading) return "Loading latest release...";
    return links.version ? `Version ${links.version}` : "Latest desktop release";
  }, [links.loading, links.version]);

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
          <div className="container-page relative z-10 py-14 sm:py-16">
            <div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Your meetings, remembered. No bot in the room.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/72 dark:text-foreground/82">
                ubik Meetings runs quietly on your desktop: it hears the call, captures the decision and the
                owner, and files both against the deal they belong to. Nothing extra on the guest list.
                Nothing extra in the recording.
              </p>
            </div>

            <div className="mt-10">
              <MeetingsLiveStrip />
            </div>

            <p className={`${kickerClass} mt-12`}>Desktop</p>
            <div className="mt-4 grid gap-px border bg-border sm:grid-cols-3">
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
                          className={isSelected ? "text-primary" : "text-foreground/70"}
                          aria-hidden
                        />
                        {option.label}
                      </span>
                      <Badge variant="outline" className="font-mono text-[0.62rem] uppercase tracking-[0.12em]">
                        {option.chip}
                      </Badge>
                    </div>
                    <p className="text-sm leading-6 text-foreground/72 dark:text-foreground/82">{option.explainer}</p>
                    <p className="font-mono text-[0.66rem] text-foreground/60 dark:text-foreground/72">
                      {option.fileLabel}
                    </p>
                    <Button asChild size="lg" variant={isSelected ? "default" : "outline"} className="mt-auto w-full">
                      <a
                        href={href}
                        aria-current={isSelected ? "true" : undefined}
                        aria-disabled={links.loading}
                        onClick={(event) => {
                          setSelectedId(option.id);
                          handleDownloadClick(event, option);
                        }}
                        className={links.loading ? "pointer-events-none opacity-60" : undefined}
                      >
                        <DownloadSimpleIcon data-icon="inline-start" aria-hidden />
                        {option.cta}
                      </a>
                    </Button>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 font-mono text-[0.7rem] leading-5 text-foreground/62 dark:text-foreground/76">
              {versionText} · {selected.fileLabel} · {selected.helper}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/62 dark:text-foreground/76">
              Not sure which Mac you have? Open Apple menu, About This Mac. M-series means Apple silicon; Intel
              means the Intel build.
            </p>

            <p className={`${kickerClass} mt-10`}>Mobile</p>
            <div className="mt-4 grid gap-px border bg-border sm:grid-cols-2">
              {mobileOptions.map((option) => {
                const OptionIcon = option.id === "windows_store" ? WindowsLogoIcon : GooglePlayLogoIcon;

                return (
                  <div key={option.id} className="flex flex-col gap-3 bg-card p-5 opacity-70">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                        <OptionIcon className="text-foreground/70" aria-hidden />
                        {option.label}
                      </span>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-primary/30 bg-primary/5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary"
                      >
                        Coming soon
                      </Badge>
                    </div>
                    <Button size="lg" variant="outline" className="mt-auto w-full" disabled aria-disabled="true">
                      <DownloadSimpleIcon data-icon="inline-start" aria-hidden />
                      Coming soon
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container-page section-y">
          <div className="max-w-3xl">
            <p className={kickerClass}>On your desktop</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Alerts now, prepared context next.</h2>
            <p className="mt-3 text-foreground/72 dark:text-foreground/82">
              The app surfaces what is about to happen and what needs a decision, without pulling you into
              another window.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <NotificationRail />
            <PreReadPanel />
          </div>
        </section>

        <Separator />

        <section className="container-page section-y">
          <div className="max-w-3xl">
            <p className={kickerClass}>What it does not do</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">No bot. No overlay in the share. No new window to babysit.</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {proofCards.map((card) => (
              <article key={card.title} className="flex flex-col border bg-card">
                <ProofVisual visual={card.visual} />
                <div className="mt-auto border-t p-5">
                  <p className={kickerClass}>{card.kicker}</p>
                  <h3 className="mt-2 text-lg font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/72 dark:text-foreground/82">{card.copy}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 border-y py-6">
            <p className={kickerClass}>Compatible with every tool</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
              {compatibleTools.map((tool) => (
                <div key={tool.label} className="inline-flex items-center gap-2 text-sm font-medium">
                  <img src={favicon(tool.domain)} alt="" className="size-4" />
                  {tool.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page pb-16 sm:pb-20">
          <div className="max-w-3xl">
            <p className={kickerClass}>Install</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Install once. Keep the meeting loop local.</h2>
            <p className="mt-3 text-foreground/72 dark:text-foreground/82">
              Three steps, then meeting context lands in the same reviewed queue as the rest of your operating
              memory.
            </p>
          </div>
          <ol className="mt-6 flex max-w-3xl flex-col divide-y border-y">
            {steps.map(({ n, title, copy }) => (
              <li key={n} className="grid grid-cols-[2rem_1fr] gap-4 py-4">
                <span className="flex size-8 items-center justify-center border bg-primary/10 font-mono text-sm font-semibold text-primary">
                  {n}
                </span>
                <div className="text-sm leading-6">
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="mt-1 text-foreground/72 dark:text-foreground/82">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
          {showInstallGuide ? (
            <div className="mt-6 flex max-w-3xl gap-3 border border-primary/30 bg-primary/5 p-5">
              <InfoIcon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <p className="text-sm leading-6 text-foreground/86">
                <strong className="text-foreground">Download started for {selected.label}.</strong> Follow the
                steps above once the installer appears in Downloads.
              </p>
            </div>
          ) : null}
        </section>
      </main>
    </PageShell>
  );
}
