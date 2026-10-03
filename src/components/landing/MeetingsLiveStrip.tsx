import { useEffect, useRef, useState } from "react";
import { CaretDownIcon, ClockCounterClockwiseIcon, MicrophoneIcon } from "@phosphor-icons/react";

// Faithful to the actual desktop app's floating strip (ubik-meetings repo,
// Chip.jsx / tokens.js "C" — the compact-surface design tier): flat corners,
// #315CF4 action blue, #10182B ink, #35426B ink-blue secondary text, a
// #BFCEE8 hairline border, and an 8px square mark that is ALWAYS blue — state
// lives in the controls, never the mark. This illustration is light-only by
// the same rule the real strip follows, independent of the site's theme.
const STRIP = {
  ink: "#10182B",
  sub: "#35426B",
  border: "#BFCEE8",
  well: "#F2F0EA",
  blue: "#315CF4",
  red: "#C42B2B"
};

// A soft, drifting grain fills the whitespace the strip sits in — the same
// backdrop the fig. 1 well would otherwise be a flat block of colour.
// WebGPU-only, loaded on demand (dynamic import, so browsers without
// `navigator.gpu` never fetch it) and it degrades to the flat STRIP.well
// background on any failure: unsupported browser, a blocklisted GPU, reduced
// motion, or the async init rejecting.
const GRAIN_SHADER = `
struct Params { time: f32, texel: vec2f }
@group(0) @binding(0) var<uniform> params: Params;

fn hash(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let cell = floor(uv / max(params.texel, vec2f(0.0009)) * 0.4);
  let grain = hash(cell + floor(params.time * 8.0));
  let drift = sin(uv.x * 5.0 + params.time * 0.35) * 0.5 + 0.5;
  let vignette = smoothstep(0.95, 0.1, distance(uv, vec2f(0.5, 0.55)));
  let base = vec3f(0.949, 0.941, 0.918);
  let tint = vec3f(0.192, 0.361, 0.957);
  let amount = (grain * 0.05 + drift * 0.02) * vignette;
  return vec4f(mix(base, tint, amount), 1.0);
}
`;

function LiveStripBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("gpu" in navigator)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let stop: (() => void) | null = null;
    let gpuHandle: { dispose: () => void } | null = null;

    void (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { init, surface, effect, clock, frameLoop } = await import("vgpu");
      const gpu = await init();
      if (cancelled) {
        gpu.dispose();
        return;
      }
      gpuHandle = gpu;
      const canvasSurface = surface(gpu, canvas, { dpr: [1, 2] });
      const grain = effect(gpu, GRAIN_SHADER, {
        set: { params: { time: 0, texel: canvasSurface.texelSize } }
      });
      canvasSurface.onResize(() => {
        grain.set({ params: { texel: canvasSurface.texelSize } });
      });
      const time = clock(gpu);
      const handle = frameLoop(
        gpu,
        (frame) => {
          grain.set({ params: { time: time.time } });
          frame.pass(canvasSurface, grain);
        },
        { fps: 30 }
      );
      stop = () => handle.stop();
    })().catch(() => {
      // WebGPU can be present but still fail to init (blocklisted GPU, no
      // adapter) — the flat STRIP.well colour underneath is the fallback, so
      // a rejected promise here is silently fine.
    });

    return () => {
      cancelled = true;
      stop?.();
      gpuHandle?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />;
}

export function MeetingsLiveStrip({ className = "py-12 sm:py-16" }: { className?: string }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const cycle = window.setInterval(() => setRecording((value) => !value), 5200);
    return () => window.clearInterval(cycle);
  }, []);

  useEffect(() => {
    if (!recording) return;
    const tick = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => {
      window.clearInterval(tick);
      setSeconds(0);
    };
  }, [recording]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="m-0 h-full">
      <div
        className={`relative flex h-full items-center justify-center overflow-hidden rounded-none ${className}`}
        style={{ background: STRIP.well }}
      >
        <LiveStripBackdrop />
        <div
          className="group relative z-10 inline-flex h-[34px] items-stretch bg-white shadow-[0px_2px_10px_0px_hsl(0_0%_0%/0.06),0px_4px_6px_-1px_hsl(0_0%_0%/0.06)]"
          style={{ border: `1px solid ${STRIP.border}` }}
        >
          <span className="flex items-center px-3">
            <span className="block size-2 shrink-0" style={{ background: STRIP.blue }} aria-hidden />
          </span>
          <span className="my-2 w-px" style={{ background: STRIP.border }} aria-hidden />
          <span
            className="flex items-center gap-1.5 px-3 font-mono text-[0.62rem] font-medium"
            style={{ color: STRIP.sub }}
          >
            <MicrophoneIcon className="size-3" aria-hidden />
            ask ubik
          </span>
          <span className="my-2 w-px" style={{ background: STRIP.border }} aria-hidden />
          <span
            className="flex items-center gap-1.5 px-3 font-mono text-[0.62rem] font-semibold transition-colors duration-150"
            style={{ color: recording ? STRIP.red : STRIP.blue }}
          >
            <span
              className={recording ? "block size-1.5 animate-pulse" : "block size-1.5"}
              style={{ background: recording ? STRIP.red : STRIP.blue }}
              aria-hidden
            />
            {recording ? `REC ${mm}:${ss}` : "Record"}
          </span>
          <div className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-200 ease-out group-hover:grid-cols-[1fr]">
            <div className="overflow-hidden">
              <div
                className="flex h-full items-center gap-1 pl-2 pr-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                style={{ borderLeft: `1px solid ${STRIP.border}` }}
              >
                <span className="flex size-6 items-center justify-center" style={{ color: STRIP.sub }} aria-hidden>
                  <CaretDownIcon className="size-3.5" />
                </span>
                <span className="flex size-6 items-center justify-center" style={{ color: STRIP.sub }} aria-hidden>
                  <ClockCounterClockwiseIcon className="size-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
