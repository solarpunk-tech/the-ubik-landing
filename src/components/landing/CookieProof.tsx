import { cn } from "@/lib/utils";

/** A grey placeholder bar: the shape of data we do not have. */
function Bar({ w, className }: { w: string; className?: string }) {
  return <span aria-hidden className={cn("block h-3 rounded-sm bg-muted motion-safe:animate-pulse", className)} style={{ width: w }} />;
}

const UNKNOWN = [
  { label: "Who you are", bars: ["58%", "34%"], verdict: "Not collected" },
  { label: "Your name, email or company", bars: ["72%"], verdict: "Not collected" },
  { label: "Your IP address", bars: ["46%"], verdict: "Not stored" },
  { label: "An ID or cookie on your device", bars: ["64%", "28%"], verdict: "None" }
];

const ZEROS = [
  { figure: "0", label: "tracking cookies" },
  { figure: "0", label: "advertising trackers" },
  { figure: "Off", label: "session recordings" },
  { figure: "0", label: "visitor profiles" }
];

/**
 * What a visit to theubik.com tells us, drawn as the data card it would fill:
 * every personal field is a placeholder that stays empty. Mirrors the settings in src/lib/posthog.ts.
 */
export function CookieProof() {
  return (
    <section className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_1fr]" aria-labelledby="cookie-proof-title">
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <h2 id="cookie-proof-title" className="text-xl font-semibold">
          What a visit to theubik.com tells us
        </h2>
        <ul className="mt-6 grid gap-5">
          {UNKNOWN.map((row) => (
            <li key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 sm:grid-cols-[12rem_1fr_auto]">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="col-span-2 grid gap-2 sm:col-span-1" aria-hidden>
                {row.bars.map((w, i) => (
                  <Bar key={i} w={w} />
                ))}
              </span>
              <span className="row-start-1 text-sm font-medium text-foreground sm:row-start-auto">{row.verdict}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ZEROS.map((item) => (
          <div key={item.label} className="flex flex-col justify-between gap-6 rounded-2xl border bg-card p-5">
            <div aria-hidden className="grid gap-2">
              <Bar w="70%" className="h-2.5" />
              <Bar w="45%" className="h-2.5" />
            </div>
            <div>
              <p className="text-4xl font-semibold leading-none tabular-nums text-foreground">{item.figure}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
