import { useEffect, useRef, useState } from "react";
import {
  CalendarDotsIcon,
  ChatCircleIcon,
  EnvelopeSimpleIcon,
  ListChecksIcon,
  MagnifyingGlassIcon,
  ScanIcon,
  VideoCameraIcon
} from "@phosphor-icons/react";
import { LiveStripBackdrop } from "@/components/landing/MeetingsLiveStrip";
import { cn } from "@/lib/utils";

// The desktop strip, as the app draws it (ubik-meetings desktop/src/Strip.jsx):
// at rest the blue square alone; click it and the icon row grows out of it.
// Light-only like the real strip. It plays itself (square, row, each icon in
// turn) until someone clicks; then it is theirs. Still under reduced motion.

const ICONS = [
  { id: "ask", label: "Ask ubik", Icon: ChatCircleIcon },
  { id: "note", label: "New meeting note", Icon: VideoCameraIcon },
  { id: "calendar", label: "Calendar", Icon: CalendarDotsIcon },
  { id: "mail", label: "Mail", Icon: EnvelopeSimpleIcon },
  { id: "tasks", label: "Tasks", Icon: ListChecksIcon },
  { id: "search", label: "Search", Icon: MagnifyingGlassIcon },
  { id: "capture", label: "Capture", Icon: ScanIcon }
] as const;

const C = { ink: "#10182B", sub: "#35426B", border: "#BFCEE8", well: "#F2F0EA", blue: "#315CF4" };

export function StripHero({ className = "mt-10 h-48" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [lit, setLit] = useState<number | null>(null);
  const [driven, setDriven] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The self-playing loop: rest, open, light each icon in turn, close.
  useEffect(() => {
    if (!driven || reduced || !inView) return;
    let step = -2;
    const tick = () => {
      step += 1;
      if (step === -1) {
        setOpen(true);
        setLit(null);
      } else if (step >= 0 && step < ICONS.length) {
        setLit(step);
      } else if (step >= ICONS.length) {
        setOpen(false);
        setLit(null);
        step = -3;
      }
    };
    const id = window.setInterval(tick, 1100);
    return () => window.clearInterval(id);
  }, [driven, reduced, inView]);

  return (
    <div ref={rootRef} className={cn("relative flex items-center justify-center overflow-hidden", className)} style={{ background: C.well }}>
      <LiveStripBackdrop />
      <div
        className="relative z-10 inline-flex items-center rounded-full bg-white p-1 shadow-[0px_2px_10px_0px_hsl(0_0%_0%/0.06),0px_4px_6px_-1px_hsl(0_0%_0%/0.06)]"
        style={{ border: `1px solid ${C.border}` }}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close the strip" : "Open the strip"}
          onClick={() => {
            setDriven(false);
            setOpen((o) => !o);
            setLit(null);
          }}
          className="grid size-9 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#315CF4]"
        >
          <span className="block size-3.5 rounded-[4px]" style={{ background: C.blue }} />
        </button>
        <div
          className="grid transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ gridTemplateColumns: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="flex items-center gap-1 pl-1 pr-1">
              {ICONS.map(({ id, label, Icon }, i) => (
                <button
                  key={id}
                  type="button"
                  tabIndex={open ? 0 : -1}
                  aria-label={label}
                  title={label}
                  onClick={() => {
                    setDriven(false);
                    setLit(i);
                  }}
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full outline-none transition-[background,color,opacity,transform] duration-200 focus-visible:ring-2 focus-visible:ring-[#315CF4]",
                    open ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  )}
                  style={{
                    transitionDelay: open ? `${i * 28}ms` : "0ms",
                    background: lit === i ? C.ink : "transparent",
                    color: lit === i ? "#fff" : C.sub
                  }}
                >
                  <Icon size={19} aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
