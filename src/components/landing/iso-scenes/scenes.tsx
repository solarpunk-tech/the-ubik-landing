import { IsoLoop } from "./IsoLoop";
import * as packing from "./packing-line";
import * as journey from "./supply-journey";

/** A packing cell: scan, pack, reject. Sits in the corner of the pricing card. */
export function PackingLineFigure({ className }: { className?: string }) {
  return <IsoLoop width={packing.WIDTH} height={packing.HEIGHT} frame={packing.frame} still={packing.STILL} loop={packing.LOOP} className={className} />;
}

/** Pond to plant to port to ship, with a freighter overhead. A full-width strip on the page itself. */
export function SupplyJourneyFigure({ className }: { className?: string }) {
  return <IsoLoop width={journey.WIDTH} height={journey.HEIGHT} frame={journey.frame} still={journey.STILL} loop={journey.LOOP} paper="page" className={className} />;
}
