import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AppleLogoIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import "./install-guide.css";

export type InstallOS = "mac" | "windows";

type Step = { title: string; scene: (os: InstallOS) => ReactNode };

const STEP_MS = 5200;

function Cursor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 20" className={cn("ig-cursor", className)} aria-hidden>
      <path d="M1 1v15l4-3.6 2.7 6 2.4-1-2.6-5.8H13z" fill="#10182B" stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function AppIcon({ className }: { className?: string }) {
  return <img src="/logos/ubik-app-icon.png" alt="" className={cn("size-14 rounded-[22%] shadow-sm", className)} />;
}

function Win({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("ig-pop w-full max-w-sm overflow-hidden rounded-xl border bg-card text-card-foreground shadow-md", className)}>
      <div className="flex items-center gap-1.5 border-b px-3 py-2">
        <i className="size-2.5 rounded-full bg-border" />
        <i className="size-2.5 rounded-full bg-border" />
        <i className="size-2.5 rounded-full bg-border" />
        <span className="ml-2 truncate text-[11px] text-muted-foreground">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Toggle({ on, delay }: { on?: boolean; delay: number }) {
  return (
    <span className="ig-toggle" data-on={on ? "" : undefined} style={{ ["--d" as string]: `${delay}ms` }} aria-hidden>
      <i />
    </span>
  );
}

/* ---- scenes: each remounts when its step becomes active, so it replays ---- */

function MacOpen() {
  return (
    <div className="relative grid place-items-center">
      <div className="ig-disk flex flex-col items-center gap-2">
        <span className="relative grid size-20 place-items-center rounded-2xl border bg-gradient-to-b from-card to-secondary shadow-sm" aria-hidden>
          <span className="absolute inset-x-3 bottom-2 h-1.5 rounded-full bg-border" />
          <AppIcon className="size-12" />
        </span>
        <span className="text-[11px] font-medium text-foreground">Ubik-universal.dmg</span>
      </div>
      <Cursor className="ig-click" />
    </div>
  );
}

function MacDrag() {
  const rowRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(150);

  // Drag exactly as far as the folder is from the icon, whatever the width.
  useLayoutEffect(() => {
    const from = fromRef.current;
    const to = toRef.current;
    if (!from || !to) return;
    setDist(Math.round(to.offsetLeft - from.offsetLeft));
  }, []);

  return (
    <Win title="Ubik-universal" className="relative max-w-md">
      <div ref={rowRef} className="relative flex items-center justify-between px-2 py-3" style={{ ["--dist" as string]: `${dist}px` }}>
        <div ref={fromRef} className="flex flex-col items-center gap-1.5">
          <AppIcon className="ig-drag" />
          <span className="text-[11px] text-foreground">ubik</span>
        </div>
        <span className="text-muted-foreground" aria-hidden>→</span>
        <div ref={toRef} className="flex flex-col items-center gap-1.5">
          <span className="ig-folder grid size-14 place-items-center rounded-[14px] border bg-secondary" aria-hidden>
            <span className="block h-6 w-8 rounded-[4px] bg-primary/30" />
          </span>
          <span className="text-[11px] text-foreground">Applications</span>
        </div>
        <Cursor className="ig-hand" />
      </div>
    </Win>
  );
}

function Permissions({ os }: { os: InstallOS }) {
  const rows = os === "mac" ? ["Microphone", "Screen Recording"] : ["Microphone"];
  return (
    <Win title={os === "mac" ? "Privacy & Security" : "Allow microphone"}>
      <ul className="flex flex-col gap-4">
        {rows.map((r, i) => (
          <li key={r} className="flex items-center justify-between gap-4 text-[13px] font-medium">
            <span className="flex items-center gap-2.5">
              <AppIcon className="size-5 shadow-none" />
              ubik · {r}
            </span>
            <Toggle on delay={500 + i * 900} />
          </li>
        ))}
      </ul>
      {os === "windows" ? (
        <span className="ig-allow mt-5 inline-flex h-8 items-center rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground">Allow</span>
      ) : null}
    </Win>
  );
}

function SignIn() {
  return (
    <Win title="ubik">
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {[
            { label: "Continue with Google", icon: <img src="https://www.google.com/s2/favicons?domain=google.com&sz=64" alt="" className="size-4" /> },
            { label: "Continue with Microsoft", icon: <img src="https://www.google.com/s2/favicons?domain=microsoft.com&sz=64" alt="" className="size-4" /> },
            { label: "Continue with Apple", icon: <AppleLogoIcon size={16} weight="fill" aria-hidden /> }
          ].map((m, i) => (
            <li
              key={m.label}
              className="ig-row inline-flex h-9 items-center gap-2.5 rounded-md border bg-card px-3 text-[12.5px] font-medium text-foreground"
              style={{ ["--d" as string]: `${150 + i * 140}ms` }}
            >
              {m.icon}
              {m.label}
            </li>
          ))}
        </ul>
        <div className="ig-row" style={{ ["--d" as string]: "1100ms" }}>
          <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
            <span>Speech model</span>
            <span className="ig-model-done">Ready</span>
          </div>
          <span className="ig-bar" aria-hidden>
            <i />
          </span>
        </div>
        <span className="ig-row ig-first inline-flex items-center gap-2 text-[12px] font-medium text-foreground" style={{ ["--d" as string]: "3300ms" }}>
          <span className="grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
            <CheckIcon size={10} weight="bold" aria-hidden />
          </span>
          First dictation done
        </span>
      </div>
    </Win>
  );
}

function WinWizard() {
  return (
    <Win title="Ubik Setup">
      <div className="flex items-center gap-4">
        <AppIcon className="size-12" />
        <div>
          <p className="text-[13px] font-medium text-foreground">Install ubik</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Ubik-Setup.exe</p>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <span className="ig-next relative inline-flex h-8 items-center rounded-md bg-primary px-4 text-[12px] font-medium text-primary-foreground">
          Next
          <Cursor className="ig-nextc" />
        </span>
      </div>
    </Win>
  );
}

function WinProgress() {
  return (
    <Win title="Ubik Setup">
      <p className="text-[13px] font-medium text-foreground">Installing</p>
      <span className="ig-bar mt-4" aria-hidden style={{ ["--bar" as string]: "3200ms" }}>
        <i />
      </span>
      <p className="ig-model-done mt-3 text-[11px] text-muted-foreground" style={{ ["--d" as string]: "3300ms" }}>Done</p>
    </Win>
  );
}

function WinStart() {
  return (
    <div className="ig-pop w-full max-w-sm rounded-xl border bg-card p-4 shadow-md">
      <p className="mb-3 text-[11px] text-muted-foreground">Start</p>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="aspect-square rounded-lg bg-secondary" />
        ))}
        <span className="ig-tile relative grid aspect-square place-items-center rounded-lg bg-secondary">
          <AppIcon className="size-9" />
          <Cursor className="ig-tilec" />
        </span>
      </div>
    </div>
  );
}

const MAC: Step[] = [
  { title: "Open the installer", scene: () => <MacOpen /> },
  { title: "Move to Applications", scene: () => <MacDrag /> },
  { title: "Allow Microphone, then Screen Recording", scene: (os) => <Permissions os={os} /> },
  { title: "Sign in and finish setup", scene: () => <SignIn /> }
];

const WINDOWS: Step[] = [
  { title: "Open the installer", scene: () => <WinWizard /> },
  { title: "Complete the wizard", scene: () => <WinProgress /> },
  { title: "Launch from Start", scene: () => <WinStart /> },
  { title: "Allow the microphone, sign in, finish setup", scene: () => <SignIn /> }
];

/**
 * Numbered steps on the left, an animated scene for the active step on the
 * right: the disk image opening, ubik dragged onto Applications, the toggles
 * flipping, the setup finishing. It advances itself while in view; a click
 * picks a step and keeps it. Under reduced motion nothing advances or moves.
 */
export function InstallGuide({ os }: { os: InstallOS }) {
  const steps = os === "mac" ? MAC : WINDOWS;
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setActive(0), [os]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (held || reduced || !inView) return;
    const t = window.setTimeout(() => setActive((n) => (n + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [active, held, reduced, inView, steps.length]);

  return (
    <div ref={rootRef} className="ig grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12" data-still={reduced ? "" : undefined}>
      <ol className="flex flex-col border-t">
        {steps.map((step, i) => {
          const on = i === active;
          return (
            <li key={step.title} className="border-b">
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                onClick={() => {
                  setActive(i);
                  setHeld(true);
                }}
                className="flex w-full items-center gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center border text-sm font-semibold tabular-nums",
                    on ? "border-primary bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}
                >
                  {i + 1}
                </span>
                <span className={cn("text-base font-medium sm:text-lg", on ? "text-foreground" : "text-muted-foreground")}>{step.title}</span>
              </button>
              {on && !held && !reduced ? (
                <span className="dt-progress mb-3 ml-12" aria-hidden>
                  <i key={`${os}-${i}`} style={{ ["--dt-duration" as string]: `${STEP_MS}ms` }} />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="dt-desk grid min-h-[17rem] place-items-center overflow-hidden rounded-xl border p-5 sm:p-8" aria-hidden>
        <div key={`${os}-${active}`} className="grid w-full place-items-center">
          {steps[active].scene(os)}
        </div>
      </div>
    </div>
  );
}
