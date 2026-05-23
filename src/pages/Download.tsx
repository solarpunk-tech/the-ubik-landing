import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppleLogoIcon, CheckCircleIcon, WindowsLogoIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatrixField } from "@/components/landing/MatrixField";
import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";
import { downloads } from "@/lib/links";
import { detectOS, type OS } from "@/lib/use-detected-os";
import { trackEvent } from "@/lib/posthog";

function triggerDownload(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.rel = "noopener";
  anchor.click();
}

const macSteps = [
  { n: 1, title: "Open the installer", copy: "Open Ubik.dmg from your Downloads folder." },
  { n: 2, title: "Move to Applications", copy: "Drag the Ubik icon into your Applications folder." },
  { n: 3, title: "Launch Ubik", copy: "Open Ubik from your Applications folder." }
];

const windowsSteps = [
  { n: 1, title: "Open the installer", copy: "Open UbikMeetingSetup.exe from your Downloads folder." },
  { n: 2, title: "Approve the prompt", copy: "Accept the Windows install prompt to continue." },
  { n: 3, title: "Launch Ubik", copy: "Open Ubik from the Start menu." }
];

const localHighlights = [
  {
    title: "Spreadsheets without uploads",
    copy: "Read workbook context from forecasts, order sheets, and margin trackers while the file stays on your machine."
  },
  {
    title: "Portal context, reviewed",
    copy: "Bring signals from customer, supplier, and retail portals into reviewed Ubik workflows without naming or storing every login in the cloud."
  },
  {
    title: "Documents into memory",
    copy: "Promote approved specs, contracts, shipment docs, and decisions into Ubik memory on your workspace or your own servers."
  }
];

export default function Download() {
  const [params] = useSearchParams();
  const requested = params.get("os");
  const initialOS: OS = requested === "windows" ? "windows" : requested === "mac" ? "mac" : detectOS();
  const [os, setOS] = useState<OS>(initialOS);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const fired = useRef(false);

  const href = useMemo(() => (os === "windows" ? downloads.windows : downloads.mac), [os]);
  const steps = os === "windows" ? windowsSteps : macSteps;

  function handleDownloadClick(nextOS?: OS) {
    const resolvedOS = nextOS ?? os;
    if (nextOS) setOS(nextOS);
    fired.current = true;
    setShowInstallGuide(true);
    trackEvent("download_clicked", { os: resolvedOS });
  }

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const t = window.setTimeout(() => triggerDownload(href), 250);
    return () => window.clearTimeout(t);
    // Only auto-fire once on mount, for the initial OS.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell>
      <Seo
        title="Download Ubik Meetings"
        description="Download Ubik Meetings for Mac or Windows. Your install will start automatically."
      />
      <main className="relative overflow-hidden">
        <section className="relative border-b">
          <MatrixField variant="hero" density="medium" seed="download-hero" />
          <div className="container-page relative z-10 flex flex-col items-center gap-8 py-20 text-center lg:py-28">
            <Badge variant="secondary" className="gap-1.5">
              <CheckCircleIcon weight="fill" className="text-primary" aria-hidden />
              Download started
            </Badge>

            <p className="max-w-3xl text-base leading-7 text-foreground sm:text-lg">
              Ubik Meetings captures meeting audio for notes today; next, it becomes the private desktop bridge for spreadsheets, portals, and trade documents.
            </p>

            <div className="flex max-w-3xl flex-col gap-4">
              <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
                Thanks for downloading.
                <br />
                Just a few steps left.
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Your download will begin automatically. If it didn{"’"}t start,{" "}
                <a
                  href={href}
                  className="font-medium text-primary underline underline-offset-4 hover:no-underline"
                  onClick={() => handleDownloadClick()}
                >
                  download Ubik Meetings manually
                </a>
                .
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant={os === "mac" ? "default" : "outline"}
                onClick={() => handleDownloadClick("mac")}
              >
                <a href={downloads.mac}>
                  <AppleLogoIcon weight="fill" data-icon="inline-start" />
                  Download Ubik Meetings for Mac
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant={os === "windows" ? "default" : "outline"}
                onClick={() => handleDownloadClick("windows")}
              >
                <a href={downloads.windows}>
                  <WindowsLogoIcon weight="fill" data-icon="inline-start" />
                  Download Ubik Meetings for Windows
                </a>
              </Button>
            </div>

            {showInstallGuide ? (
              <div className="grid w-full max-w-5xl gap-px bg-border text-left md:grid-cols-3">
                {steps.map(({ n, title, copy }) => (
                  <div key={n} className="bg-background p-5 sm:p-6">
                    <div className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {n}
                    </div>
                    <h2 className="mt-4 text-lg font-semibold">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="text-xs text-muted-foreground">
              Version {downloads.version} · Detected: {os === "mac" ? "macOS" : "Windows"}
            </p>
          </div>
        </section>

        <section className="container-page section-y">
          <div className="mb-10 flex max-w-5xl flex-col gap-3">
            <h2 className="text-3xl font-semibold sm:text-4xl">Your local bridge for intelligence.</h2>
            <p className="text-muted-foreground lg:whitespace-nowrap">
              Ubik Meetings captures useful computer context and sends only reviewed trade signals into Ubik.
            </p>
          </div>
          <div className="mb-12 grid gap-px bg-border md:grid-cols-3">
            {localHighlights.map(({ title, copy }) => (
              <div key={title} className="bg-background p-6">
                <p className="section-label">Coming soon</p>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
