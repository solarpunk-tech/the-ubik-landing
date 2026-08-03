import { cn } from "@/lib/utils";

type TradeNoteBitmatrixVariant = "drift" | "bleed" | "roulette";

const bitmatrix = [
  [18, 26], [30, 20], [44, 29], [60, 18], [78, 25], [94, 16], [112, 24], [130, 18], [148, 28], [166, 20], [184, 26], [202, 18],
  [24, 54], [38, 66], [54, 48], [72, 60], [90, 52], [108, 68], [126, 48], [144, 62], [162, 50], [180, 66], [198, 54],
  [18, 92], [34, 106], [50, 86], [68, 100], [86, 90], [104, 106], [122, 88], [140, 102], [158, 92], [176, 108], [194, 90], [210, 102],
  [26, 138], [44, 126], [62, 146], [80, 132], [98, 142], [116, 128], [134, 148], [152, 134], [170, 144], [188, 130], [206, 142],
  [18, 178], [36, 190], [54, 172], [72, 184], [90, 176], [108, 192], [126, 174], [144, 188], [162, 178], [180, 194], [198, 176], [214, 188]
] as const;

function BitmatrixDots() {
  return (
    <g className="trade-note-bitmatrix-dots">
      {bitmatrix.map(([cx, cy], index) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index % 5 === 0 ? 1.8 : 1} />)}
    </g>
  );
}

function DriftIllustration() {
  return (
    <g>
      <path className="trade-note-bitmatrix-line" d="M22 170H214M27 45V170" />
      <path className="trade-note-bitmatrix-line" d="M26 150L52 145L74 151L98 132L120 137L143 108L164 118L182 72L204 42" />
      <path className="trade-note-bitmatrix-accent" d="M182 72L204 42L204 68M48 150L60 145M92 133L104 135M154 112L166 116" />
      <path className="trade-note-bitmatrix-fish" d="M188 94c6-8 16-8 23 0-7 8-17 8-23 0Zm0 0-7-6v12l7-6Zm15 0 4-3m-4 3 4 3" />
      <circle className="trade-note-bitmatrix-signal" cx="182" cy="72" r="4" />
      <circle className="trade-note-bitmatrix-signal" cx="204" cy="42" r="4" />
    </g>
  );
}

function BleedIllustration() {
  return (
    <g>
      <path className="trade-note-bitmatrix-line" d="M48 62H176L194 78V156L176 172H48L30 156V78L48 62Z" />
      <path className="trade-note-bitmatrix-line" d="M48 62V172M176 62V172M30 78H194M30 156H194" />
      <path className="trade-note-bitmatrix-accent" d="M112 72V162M124 72V162M136 72V162M156 104c-7 12-5 17 2 22 7 5 6 12-2 20" />
      <path className="trade-note-bitmatrix-line" d="M76 86H100M76 102H100M76 118H100M30 48H58M166 48H194M22 184H86" />
      <circle className="trade-note-bitmatrix-signal" cx="156" cy="158" r="4" />
      <circle className="trade-note-bitmatrix-signal" cx="168" cy="178" r="2.5" />
      <circle className="trade-note-bitmatrix-signal" cx="150" cy="188" r="1.8" />
    </g>
  );
}

function RouletteIllustration() {
  return (
    <g>
      <circle className="trade-note-bitmatrix-line" cx="120" cy="112" r="68" />
      <circle className="trade-note-bitmatrix-line" cx="120" cy="112" r="46" />
      <circle className="trade-note-bitmatrix-signal" cx="120" cy="112" r="10" />
      <path className="trade-note-bitmatrix-line" d="M120 44V180M52 112H188M72 64L168 160M168 64L72 160M120 30V40M120 184V194M38 112H48M192 112H202" />
      <path className="trade-note-bitmatrix-accent" d="M120 112L159 78M159 78l-4 15m4-15-15 4" />
      <circle className="trade-note-bitmatrix-signal" cx="120" cy="44" r="3.5" />
      <circle className="trade-note-bitmatrix-signal" cx="168" cy="64" r="3.5" />
      <circle className="trade-note-bitmatrix-signal" cx="72" cy="160" r="3.5" />
    </g>
  );
}

export function TradeNoteBitmatrix({ variant, className }: { variant: TradeNoteBitmatrixVariant; className?: string }) {
  return (
    <svg aria-hidden="true" className={cn("trade-note-bitmatrix", className)} viewBox="0 0 240 220" fill="none" focusable="false">
      <BitmatrixDots />
      {variant === "drift" ? <DriftIllustration /> : null}
      {variant === "bleed" ? <BleedIllustration /> : null}
      {variant === "roulette" ? <RouletteIllustration /> : null}
    </svg>
  );
}
