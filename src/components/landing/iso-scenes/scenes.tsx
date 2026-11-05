import { IsoLoop } from "./IsoLoop";
import * as packing from "./packing-line";
import * as journey from "./supply-journey";
import * as bleed from "./note-bleed";
import * as drift from "./note-drift";
import * as roulette from "./note-roulette";

/** A packing cell: scan, pack, reject. Sits in the corner of the pricing card. */
export function PackingLineFigure({ className }: { className?: string }) {
  return <IsoLoop width={packing.WIDTH} height={packing.HEIGHT} frame={packing.frame} still={packing.STILL} loop={packing.LOOP} className={className} />;
}

/** Pond to plant to port to ship, with a freighter overhead. A full-width strip on the page itself. */
export function SupplyJourneyFigure({ className }: { className?: string }) {
  return <IsoLoop width={journey.WIDTH} height={journey.HEIGHT} frame={journey.frame} still={journey.STILL} loop={journey.LOOP} paper="page" className={className} />;
}

/** Two models, one monitor gate, a review tray for what they disagree on. Trade Note: The Invisible Drift. */
export function MonitorGateFigure({ className }: { className?: string }) {
  return <IsoLoop width={drift.WIDTH} height={drift.HEIGHT} frame={drift.frame} still={drift.STILL} loop={drift.LOOP} className={className} />;
}

/** A reefer at the quay and its margin stack draining. Trade Note: The 60-bps bleed. */
export function MarginBleedFigure({ className }: { className?: string }) {
  return <IsoLoop width={bleed.WIDTH} height={bleed.HEIGHT} frame={bleed.frame} still={bleed.STILL} loop={bleed.LOOP} className={className} />;
}

/** Three origin stacks on a turntable that settles on one. Trade Note: Origin roulette. */
export function OriginRouletteFigure({ className }: { className?: string }) {
  return <IsoLoop width={roulette.WIDTH} height={roulette.HEIGHT} frame={roulette.frame} still={roulette.STILL} loop={roulette.LOOP} className={className} />;
}
