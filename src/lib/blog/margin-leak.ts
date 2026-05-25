import type { BlogPost } from "@/lib/blog/types";

export type LeakNode = {
  id: string;
  label: string;
  shortLabel: string;
  bps: number;
  remainingCents: number;
  category: "commercial" | "policy" | "logistics" | "quality" | "finance";
  description: string;
  control: string;
};

export type PatchItem = {
  title: string;
  copy: string;
  nodes: string;
};

export type SourceCard = {
  publisher: string;
  title: string;
  url: string;
  favicon: string;
  faviconLabel: string;
  note: string;
};

export const marginLeakPost: BlogPost = {
  slug: "the-60-bps-bleed-shrimp-margin-loss",
  date: "2026-05-25",
  updated: "2026-05-25",
  category: "Margin Intelligence",
  title: "The 60-bps bleed: anatomy of margin loss in a seafood RFQ-to-PO cycle",
  excerpt:
    "One anonymized shrimp trade shows how quote latency, freight drift, detention, deglazed weight, remedy reserves, and cash timing can quietly turn a clean order into a lower-margin book.",
  seoTitle: "The 60-bps bleed: shrimp margin loss from RFQ to PO",
  seoDescription:
    "A visual Ubik Trade Note on seafood margin leakage: RFQ latency, counterparty scoring, FX, freight, demurrage, temperature events, deglazed weight, AD/CVD reserves, financing, and drawback discipline.",
  canonical: "https://theubik.com/blog/the-60-bps-bleed-shrimp-margin-loss",
  author: "Ubik field team",
  readingTime: "11 min read",
  template: "visual-analysis",
  featured: true,
  ogImage: "https://theubik.com/blog/margin-leak/header-light.png",
  heroLightImage: "/blog/margin-leak/header-light.png",
  heroDarkImage: "/blog/margin-leak/header-dark.png"
};

export const leakNodes: LeakNode[] = [
  {
    id: "rfq-latency",
    label: "RFQ intake delay",
    shortLabel: "RFQ",
    bps: 7,
    remainingCents: 9.93,
    category: "commercial",
    description:
      "A late first response rarely appears as a line-item loss. It shows up as weaker quote-to-order conversion or a trader haircuting price to win back credibility.",
    control: "Auto-triage inbound RFQs and force a quote or no-bid inside five minutes."
  },
  {
    id: "counterparty",
    label: "Counterparty scoring gap",
    shortLabel: "KYC+",
    bps: 4,
    remainingCents: 9.89,
    category: "quality",
    description:
      "Paper KYC can pass while harvest-event, label-weight, SIMP, or claims-history discipline is weak. The cost lands later as holds, rework, or destination credits.",
    control: "Score factories on trade behavior, not just registry documents."
  },
  {
    id: "fx",
    label: "FX timing",
    shortLabel: "FX",
    bps: 6,
    remainingCents: 9.83,
    category: "finance",
    description:
      "The trade looks commercially fine until INR, IDR, VND, EUR, or USD cash conversion lands. The error is treating FX as background noise after quote validity starts.",
    control: "Lock FX by rule at quote validity, not by trader memory."
  },
  {
    id: "freight",
    label: "Freight reprice",
    shortLabel: "FRT",
    bps: 5,
    remainingCents: 9.78,
    category: "logistics",
    description:
      "Freight indexes are more normal than 2024, but still jumpy enough that fixed delivered prices can go stale between quote and booking.",
    control: "Tie quote validity to a live freight benchmark and reprice after trigger thresholds."
  },
  {
    id: "detention",
    label: "Demurrage and detention",
    shortLabel: "DET",
    bps: 8,
    remainingCents: 9.7,
    category: "logistics",
    description:
      "Two extra reefer days can beat the headline freight move. This is usually an elapsed-time failure, not a market-pricing failure.",
    control: "Run a container free-time burn-down monitor by box, terminal, appointment, hold, and consignee readiness."
  },
  {
    id: "temperature",
    label: "Temperature deviation",
    shortLabel: "TEMP",
    bps: 4,
    remainingCents: 9.66,
    category: "quality",
    description:
      "Small frozen-chain excursions tend to become regrade and claim friction rather than a dramatic rejection. The right unit is degree-hours, not only max temperature.",
    control: "Write temperature claim language around degree-hours and attach logger evidence at shipment close."
  },
  {
    id: "count-size",
    label: "Count-size slippage",
    shortLabel: "COUNT",
    bps: 7,
    remainingCents: 9.59,
    category: "quality",
    description:
      "Selling one count and receiving a meaningful tail of smaller material converts quietly into customer credits and commercial goodwill.",
    control: "Settle count on a post-thaw, deglazed sample protocol written into the PO."
  },
  {
    id: "deglazed",
    label: "Glaze and moisture",
    shortLabel: "DGLZ",
    bps: 6,
    remainingCents: 9.53,
    category: "quality",
    description:
      "Gross packed weight can hide the real economics. Short-weight and removable glaze turn a cheap supplier quote into a claim file.",
    control: "Normalize supplier quotes to deglazed net kilograms and test arrival samples the same way."
  },
  {
    id: "forwarder",
    label: "Forwarder spread",
    shortLabel: "FWD",
    bps: 4,
    remainingCents: 9.49,
    category: "logistics",
    description:
      "This is not always fraud. It is often convenience tax: all-in buy rates drifting wide to public freight references without a variance reason.",
    control: "Store every forwarder quote against a live benchmark snapshot and variance note."
  },
  {
    id: "finance",
    label: "Working-capital carry",
    shortLabel: "TENOR",
    bps: 5,
    remainingCents: 9.44,
    category: "finance",
    description:
      "Finance cost is often booked below gross margin, which lets traders underprice tenor even when SOFR and local benchmarks are not zero.",
    control: "Quote product basis, freight basis, FX basis, and tenor basis separately."
  },
  {
    id: "remission",
    label: "Unclaimed remission or drawback",
    shortLabel: "DUTY",
    bps: 4,
    remainingCents: 9.4,
    category: "policy",
    description:
      "For India-linked trade, RoDTEP and drawback discipline matter because missed remission is usually priced away upstream or lost in filing.",
    control: "Reconcile export HS, remission eligibility, and filing status at shipment close."
  }
];

export const patchList: PatchItem[] = [
  {
    title: "Five-minute RFQ operating rule",
    copy: "Pull last good spec, freight, FX basis, and approved counterparty state before the first human reply.",
    nodes: "RFQ / FX / freight"
  },
  {
    title: "Spec-linked coding library",
    copy: "Make HS mapping a product attribute tied to cook state, breading, sauce, packing medium, destination, and remedy reserve.",
    nodes: "classification / AD-CVD / remission"
  },
  {
    title: "Free-time burn-down screen",
    copy: "One box-level queue with terminal, free days left, appointment state, customs hold, and consignee readiness.",
    nodes: "detention / claims"
  },
  {
    title: "Deglazed economics standard",
    copy: "Compare every offer on deglazed net kilograms, stated glaze, count protocol, and arrival-sample evidence.",
    nodes: "count / glaze / short weight"
  },
  {
    title: "Finance basis on every quote",
    copy: "Show customer price, product basis, freight basis, FX basis, and tenor basis as separate operating facts.",
    nodes: "FX / working capital"
  }
];

export const marginLeakSources: SourceCard[] = [
  {
    publisher: "FAO GLOBEFISH",
    title: "Shrimp species analysis",
    url: "https://www.fao.org/in-action/globefish/species-analysis/shrimps/en",
    favicon: "https://www.google.com/s2/favicons?domain=fao.org&sz=64",
    faviconLabel: "FAO",
    note: "Market backdrop for balanced 2025 shrimp trade with tariff-driven volatility."
  },
  {
    publisher: "FDA",
    title: "Imported frozen seafood short-weight sampling",
    url: "https://www.food-safety.com/articles/10664-fda-sampling-finds-one-third-of-imported-ice-glazed-seafood-products-to-be-fraudulent",
    favicon: "https://www.google.com/s2/favicons?domain=food-safety.com&sz=64",
    faviconLabel: "FDA",
    note: "Public warning signal for deglazed-weight and short-weight claim discipline."
  },
  {
    publisher: "Codex Alimentarius",
    title: "Quick-frozen shrimps or prawns standard",
    url: "https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXS%2B92-1981%252FCXS_092e.pdf",
    favicon: "https://www.google.com/s2/favicons?domain=fao.org&sz=64",
    faviconLabel: "CX",
    note: "Standard basis for net contents exclusive of glaze and deglazed count checks."
  },
  {
    publisher: "NOAA Fisheries",
    title: "Seafood Import Monitoring Program",
    url: "https://www.fisheries.noaa.gov/international/seafood-import-monitoring-program",
    favicon: "https://www.google.com/s2/favicons?domain=fisheries.noaa.gov&sz=64",
    faviconLabel: "NOAA",
    note: "Chain-of-custody context for shrimp import records and document accuracy."
  },
  {
    publisher: "Drewry",
    title: "World Container Index",
    url: "https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry",
    favicon: "https://www.google.com/s2/favicons?domain=drewry.co.uk&sz=64",
    faviconLabel: "DR",
    note: "Freight-rate benchmark used to frame quote-validity drift."
  },
  {
    publisher: "Xeneta",
    title: "Ocean container market update",
    url: "https://www.xeneta.com/news/xeneta-weekly-ocean-container-shipping-market-update-14.5.2026",
    favicon: "https://www.google.com/s2/favicons?domain=xeneta.com&sz=64",
    faviconLabel: "XE",
    note: "Far East to U.S. East Coast spot-rate context through mid-May 2026."
  },
  {
    publisher: "International Trade Administration",
    title: "Frozen warmwater shrimp AD/CVD determinations",
    url: "https://www.trade.gov/final-determinations-ad-cvd-investigations-frozen-warmwater-shrimp-ecuador-india-indonesia-and",
    favicon: "https://www.google.com/s2/favicons?domain=trade.gov&sz=64",
    faviconLabel: "ITA",
    note: "Remedy-accrual and cash-deposit context for Ecuador, India, Indonesia, and Vietnam."
  },
  {
    publisher: "FRED",
    title: "90-day average SOFR",
    url: "https://fred.stlouisfed.org/series/SOFR90DAYAVG",
    favicon: "https://www.google.com/s2/favicons?domain=fred.stlouisfed.org&sz=64",
    faviconLabel: "FR",
    note: "Finance benchmark used to keep tenor visible in quote economics."
  },
  {
    publisher: "DGFT",
    title: "RoDTEP schedule and notifications",
    url: "https://www.dgft.gov.in/CP/index.jsp?opt=RoDTEP",
    favicon: "https://www.google.com/s2/favicons?domain=dgft.gov.in&sz=64",
    faviconLabel: "DGFT",
    note: "India remission context, including schedule alignment effective 1 May 2026."
  }
];
