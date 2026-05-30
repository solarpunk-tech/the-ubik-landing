import type { BlogPost } from "@/lib/blog/types";

export type OriginCode =
  | "ecuador"
  | "india"
  | "vietnam"
  | "indonesia"
  | "thailand"
  | "china"
  | "saudi-arabia"
  | "bangladesh";

export type OriginProfile = {
  id: OriginCode;
  name: string;
  shortName: string;
  coordinates: [number, number];
  stamp: string;
  stat: string;
  role: string;
  filter: "US anchor" | "EU value-add" | "Compliance watch" | "Emerging";
  tariffNote: string;
  details: string;
  buyWhen: string;
  avoidWhen: string;
  watchFor: string;
  lightImage: string;
  darkImage: string;
};

export type FlowDatum = {
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  from: [number, number];
  to: [number, number];
  metricTons: number;
  tariffBracket: "0%" | "1-5%" | "5-15%" | "15%+" | "blocked";
  status: string;
};

export type TariffCell = {
  origin: string;
  destination: string;
  effective: number;
  label?: string;
  note?: string;
  pending?: boolean;
};

export type SourceNote = {
  publisher: string;
  title: string;
  url: string;
  favicon: string;
  faviconLabel: string;
  note: string;
};

export type DecisionRow = {
  species: string;
  count: string;
  market: string;
  window: string;
  certification: string;
  origins: string;
  rationale: string;
};

export const originRoulettePost: BlogPost = {
  slug: "origin-roulette-2026-shrimp-sourcing",
  date: "2026-05-07",
  updated: "2026-05-18",
  category: "Buyer Strategy",
  title: "Origin Roulette 2026: where shrimp is moving, and why",
  excerpt:
    "A trade-desk note for shrimp buyers resetting Q3 2026 and Q1 2027 books across tariffs, certification gates, disease risk, re-export exposure, and landed-cost arbitrage.",
  seoTitle: "Origin Roulette 2026: Shrimp sourcing strategy by origin",
  seoDescription:
    "Shrimp sourcing strategy for 2026 buyers: Ecuador, India, Vietnam, Indonesia, Thailand, China, Saudi Arabia, Bangladesh, duty-stack exposure, compliance, origin mix, and forward-book risk.",
  canonical: "https://theubik.com/blog/origin-roulette-2026-shrimp-sourcing",
  author: "Ubik field team",
  readingTime: "12 min read",
  template: "market-intelligence",
  ogImage: "/blog/origin-roulette/header-light.png",
  heroLightImage: "/blog/origin-roulette/header-light.png",
  heroDarkImage: "/blog/origin-roulette/header-dark.png"
};

export const originFilters = ["All", "US anchor", "EU value-add", "Compliance watch", "Emerging"] as const;

const portraitBase = "/blog/origin-roulette/portraits";

export const originProfiles: OriginProfile[] = [
  {
    id: "ecuador",
    name: "Ecuador",
    shortName: "ECU",
    coordinates: [-79.9, -2.2],
    stamp: "ECU / 231.8k MT",
    stat: "231,804 MT to the U.S. in 2025",
    role: "Lowest landed-cost HLSO anchor for U.S. and EU spot cover.",
    filter: "US anchor",
    tariffNote: "U.S. stack: MFN Free for raw 0306.17; CVD 3.78%; Section 122 status separate.",
    details:
      "Ecuador remains the structural volume leader in raw vannamei. The risk is not supply; it is oversupply spilling into U.S. and EU lanes, with spot prices softening when inventories rise.",
    buyWhen: "U.S. and EU HLSO contracts need lowest landed cost with BAP or ASC cover.",
    avoidWhen: "China destocking pushes too much Ecuadorian product into the same spot window.",
    watchFor: "Section 122 / trade-deal carveouts, freight volatility, and dry-to-rainy disease windows.",
    lightImage: `${portraitBase}/light_ecuador.png`,
    darkImage: `${portraitBase}/dark_ecuador.png`
  },
  {
    id: "india",
    name: "India",
    shortName: "IND",
    coordinates: [82.2, 16.7],
    stamp: "IND / stack",
    stat: "$5.5 Bn frozen shrimp exports",
    role: "Post-tariff rebound plus EU value-added arbitrage.",
    filter: "EU value-add",
    tariffNote: "India 18% is a framework reference, not an all-in U.S. importer cash-cost number.",
    details:
      "India did not retreat after the 2025 U.S. shock; it re-routed, consolidated farms, and leaned into cooked, breaded, and antibiotic-free programs. The EU opening is the strategic swing.",
    buyWhen: "EU cooked 21/25 tail-on and U.S. 16/20 HLSO need margin after tariff reset.",
    avoidWhen: "Any U.S. tariff re-escalation turns India uncompetitive overnight.",
    watchFor: "Vietnam re-export masking, antibiotic detentions, and processor-level traceability.",
    lightImage: `${portraitBase}/light_india.png`,
    darkImage: `${portraitBase}/dark_india.png`
  },
  {
    id: "vietnam",
    name: "Vietnam",
    shortName: "VNM",
    coordinates: [105.1, 9.2],
    stamp: "VNM / +17.5",
    stat: "$1.069B shrimp exports in Q1 2026",
    role: "Best value-add processor, weakest EU documentation clock.",
    filter: "EU value-add",
    tariffNote: "IUU yellow-card risk is strongest for wild-caught or processed wild inputs, not blanket farmed vannamei.",
    details:
      "Vietnam still wins where cooked, breaded, tempura, and re-processing discipline matter. The commercial question is whether origin documentation survives CBP and EU scrutiny.",
    buyWhen: "Japan tempura contracts and U.S. breaded foodservice lines are the priority.",
    avoidWhen: "EU retail replenishment needs short clearance windows.",
    watchFor: "HS 1605 origin audits, residue control, establishment approvals, and raw-material traceability.",
    lightImage: `${portraitBase}/light_vietnam.png`,
    darkImage: `${portraitBase}/dark_vietnam.png`
  },
  {
    id: "indonesia",
    name: "Indonesia",
    shortName: "IDN",
    coordinates: [105.3, -5.5],
    stamp: "IDN / FDA",
    stat: "Cs-137 certification risk since 2025",
    role: "Convex U.S. diversifier if compliance holds.",
    filter: "Compliance watch",
    tariffNote: "U.S. stack needs AD 3.90%, CVD de minimis, certification gates, and framework-rate status separated.",
    details:
      "Indonesia is the binary origin. If radiation certification and residue discipline hold, the U.S. landed-cost math can work. If one hold recurs, the book shifts back to Ecuador.",
    buyWhen: "U.S. HLSO needs a third-source tranche and every shipment is certification-backed.",
    avoidWhen: "Port-entry holds or veterinary residue refusals cluster again.",
    watchFor: "FDA import-alert scope, ADD recalculation, and Java/Lampung disease pressure.",
    lightImage: `${portraitBase}/light_indonesia.png`,
    darkImage: `${portraitBase}/dark_indonesia.png`
  },
  {
    id: "thailand",
    name: "Thailand",
    shortName: "THA",
    coordinates: [100.6, 7.2],
    stamp: "THA / 127K MT",
    stat: "Processor-first, production constrained",
    role: "Premium cooked and Japanese tempura, not raw-material scale.",
    filter: "Compliance watch",
    tariffNote: "Low duty on paper; forced-labour scrutiny drives real compliance cost.",
    details:
      "Thailand’s production never returned to its pre-EMS footprint. Its role is now processing imported raw material into higher-touch cooked and breaded products.",
    buyWhen: "Japanese premium cooked programs specify Thai origin and accept the premium.",
    avoidWhen: "EU programs need forced-labour-ready supplier files by Q1 2027.",
    watchFor: "EU Forced Labour Regulation readiness and audited labour documentation.",
    lightImage: `${portraitBase}/light_thailand.png`,
    darkImage: `${portraitBase}/dark_thailand.png`
  },
  {
    id: "china",
    name: "China",
    shortName: "CHN",
    coordinates: [110.4, 21.3],
    stamp: "CHN / 2.56 Mn MT",
    stat: "Demand-side price floor, not U.S. supply",
    role: "Inventory pressure that redirects global HLSO flows.",
    filter: "Compliance watch",
    tariffNote: "Do not model China as 10% all-in; Section 301 and current surcharge exposure sit on top of MFN logic.",
    details:
      "China matters because its import appetite determines whether Ecuadorian and Indian small counts stay absorbed or spill into U.S., EU, and MENA spot markets.",
    buyWhen: "Chinese inventories are normal and pre-CNY restocking tightens supply.",
    avoidWhen: "February-May destocking pushes spot HLSO lower.",
    watchFor: "Government price intervention and greenhouse vannamei expansion.",
    lightImage: `${portraitBase}/light_china.png`,
    darkImage: `${portraitBase}/dark_china.png`
  },
  {
    id: "saudi-arabia",
    name: "Saudi Arabia",
    shortName: "SAU",
    coordinates: [42.6, 16.9],
    stamp: "SAU / 55,000 MT",
    stat: "Halal-origin optionality for MENA and EU",
    role: "Underpriced long option on halal-certified regional supply.",
    filter: "Emerging",
    tariffNote: "Halal positioning is useful; a clean U.S. 0% cell still needs HTS/CBP confirmation.",
    details:
      "Saudi shrimp is no longer just a vision slide. It is a regional premium play with halal documentation advantages, Ramadan seasonality, and scale-up optionality.",
    buyWhen: "MENA value packs need halal-certified product and premium shelf positioning.",
    avoidWhen: "Post-Ramadan inventory flush depresses April-June pricing.",
    watchFor: "NEOM and Red Sea commercial export commitments.",
    lightImage: `${portraitBase}/light_saudi_arabia.png`,
    darkImage: `${portraitBase}/dark_saudi_arabia.png`
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    shortName: "BGD",
    coordinates: [89.1, 22.7],
    stamp: "BGD / EMRG",
    stat: "Black tiger niche, compliance-heavy",
    role: "Small black-tiger and freshwater prawn option, not a scale book.",
    filter: "Emerging",
    tariffNote: "U.S. framework reference is 19%, not 20%; EBA preference risk changes after LDC graduation timing.",
    details:
      "Bangladesh is not a volume answer for vannamei. It works only where a buyer controls QA deeply enough to use black tiger or freshwater prawn as a differentiated line.",
    buyWhen: "EU black tiger retail has a supplier with clean Rapid Alert history and on-site QA.",
    avoidWhen: "A program needs uniform high-volume retail supply.",
    watchFor: "LDC graduation, residue history, and vannamei adoption pace.",
    lightImage: `${portraitBase}/light_bangladesh.png`,
    darkImage: `${portraitBase}/dark_bangladesh.png`
  }
];

export const flowData: FlowDatum[] = [
  {
    origin: "India",
    destination: "United States",
    originCode: "IND",
    destinationCode: "US",
    from: [82.2, 16.7],
    to: [-74.0, 40.7],
    metricTons: 300051,
    tariffBracket: "15%+",
    status: "ADD + reciprocal"
  },
  {
    origin: "Ecuador",
    destination: "United States",
    originCode: "ECU",
    destinationCode: "US",
    from: [-79.9, -2.2],
    to: [-74.0, 40.7],
    metricTons: 231804,
    tariffBracket: "5-15%",
    status: "MFN Free + CVD"
  },
  {
    origin: "Indonesia",
    destination: "United States",
    originCode: "IDN",
    destinationCode: "US",
    from: [105.3, -5.5],
    to: [-74.0, 40.7],
    metricTons: 119331,
    tariffBracket: "1-5%",
    status: "AD + cert"
  },
  {
    origin: "Vietnam",
    destination: "United States",
    originCode: "VNM",
    destinationCode: "US",
    from: [105.1, 9.2],
    to: [-74.0, 40.7],
    metricTons: 64413,
    tariffBracket: "5-15%",
    status: "CVD watch"
  },
  {
    origin: "Ecuador",
    destination: "European Union",
    originCode: "ECU",
    destinationCode: "EU",
    from: [-79.9, -2.2],
    to: [4.9, 52.4],
    metricTons: 260000,
    tariffBracket: "5-15%",
    status: "GSP"
  },
  {
    origin: "India",
    destination: "European Union",
    originCode: "IND",
    destinationCode: "EU",
    from: [82.2, 16.7],
    to: [4.9, 52.4],
    metricTons: 92000,
    tariffBracket: "0%",
    status: "FTA path"
  },
  {
    origin: "Vietnam",
    destination: "China",
    originCode: "VNM",
    destinationCode: "CN",
    from: [105.1, 9.2],
    to: [121.5, 31.2],
    metricTons: 82000,
    tariffBracket: "5-15%",
    status: "growth lane"
  },
  {
    origin: "Thailand",
    destination: "Japan",
    originCode: "THA",
    destinationCode: "JP",
    from: [100.6, 7.2],
    to: [139.7, 35.7],
    metricTons: 36000,
    tariffBracket: "1-5%",
    status: "premium cooked"
  },
  {
    origin: "Saudi Arabia",
    destination: "GCC",
    originCode: "SAU",
    destinationCode: "GCC",
    from: [42.6, 16.9],
    to: [46.7, 24.7],
    metricTons: 66500,
    tariffBracket: "0%",
    status: "halal"
  },
  {
    origin: "Bangladesh",
    destination: "European Union",
    originCode: "BGD",
    destinationCode: "EU",
    from: [89.1, 22.7],
    to: [4.9, 52.4],
    metricTons: 12000,
    tariffBracket: "0%",
    status: "EBA watch"
  }
];

export const tariffCells: TariffCell[] = [
  { origin: "Ecuador", destination: "U.S.", effective: 13.78, label: "0 + 10 + 3.78", note: "MFN Free for raw 0306.17; Section 122 default modeled separately; CVD all-others 3.78%." },
  { origin: "Ecuador", destination: "EU", effective: 5.5 },
  { origin: "Ecuador", destination: "Japan", effective: 3.5 },
  { origin: "Ecuador", destination: "GCC", effective: 5 },
  { origin: "India", destination: "U.S.", effective: 23.77, label: "18 + 5.77", note: "18% framework reference; CVD all-others 5.77%; current Section 122 / HTS treatment separate." },
  { origin: "India", destination: "EU", effective: 0, note: "FTA path" },
  { origin: "India", destination: "Japan", effective: 3.5 },
  { origin: "India", destination: "GCC", effective: 5 },
  { origin: "Vietnam", destination: "U.S.", effective: 22.84, label: "20 + 2.84", note: "20% framework reference; CVD all-others 2.84%; company-specific 221.82% outlier risk." },
  { origin: "Vietnam", destination: "EU", effective: 5.5 },
  { origin: "Vietnam", destination: "Japan", effective: 3.5 },
  { origin: "Vietnam", destination: "GCC", effective: 5 },
  { origin: "Indonesia", destination: "U.S.", effective: 22.9, label: "19 + 3.90", note: "19% framework reference; AD all-others 3.90%; CVD de minimis; certification gates matter." },
  { origin: "Indonesia", destination: "EU", effective: 5.5 },
  { origin: "Indonesia", destination: "Japan", effective: 3.5 },
  { origin: "Indonesia", destination: "GCC", effective: 5 },
  { origin: "Thailand", destination: "U.S.", effective: 19, note: "Framework-rate reference; labour and processor compliance can dominate the desk decision." },
  { origin: "Thailand", destination: "EU", effective: 5.5 },
  { origin: "Thailand", destination: "Japan", effective: 3.5 },
  { origin: "Thailand", destination: "GCC", effective: 5 },
  { origin: "China", destination: "U.S.", effective: 35, label: "MFN + 301 + surcharge", note: "10% is not all-in; China Section 301 reference list includes frozen and prepared shrimp headings." },
  { origin: "China", destination: "EU", effective: 5.5 },
  { origin: "China", destination: "Japan", effective: 3.5 },
  { origin: "China", destination: "GCC", effective: 5 },
  { origin: "Saudi Arabia", destination: "U.S.", effective: 10, label: "MFN Free + check", note: "No Saudi shrimp-specific 0% special-duty source verified; confirm Section 122 / HTS status." },
  { origin: "Saudi Arabia", destination: "EU", effective: 0 },
  { origin: "Saudi Arabia", destination: "Japan", effective: 3.5 },
  { origin: "Saudi Arabia", destination: "GCC", effective: 0 },
  { origin: "Bangladesh", destination: "U.S.", effective: 19, note: "White House framework reference is 19%; product carveout status still needs HTS-line confirmation." },
  { origin: "Bangladesh", destination: "EU", effective: 0 },
  { origin: "Bangladesh", destination: "Japan", effective: 3.5 },
  { origin: "Bangladesh", destination: "GCC", effective: 5 }
];

export const decisionRows: DecisionRow[] = [
  {
    species: "Vannamei",
    count: "16/20",
    market: "U.S. foodservice HLSO",
    window: "Q3 2026 spot",
    certification: "BAP 2-star",
    origins: "Ecuador primary, India secondary",
    rationale: "Tariffs and landed cost dominate the spot window; Ecuador anchors price, India fills after the rate reset."
  },
  {
    species: "Vannamei",
    count: "21/25",
    market: "EU retail cooked tail-on",
    window: "Q3 2026 book",
    certification: "ASC, CATCH, FLR traceable",
    origins: "India primary, Vietnam backup",
    rationale: "India’s value-added tariff path is the margin play; Vietnam remains the processing backup with IUU delay risk."
  },
  {
    species: "Vannamei",
    count: "21/25",
    market: "Saudi/UAE value pack",
    window: "Q3 2026 book",
    certification: "Halal",
    origins: "Saudi Arabia premium, India cost, Ecuador fill",
    rationale: "Saudi origin removes halal documentation friction; India and Ecuador need third-party certification support."
  },
  {
    species: "Vannamei",
    count: "31/40",
    market: "EU retail value pack",
    window: "Q1 2027 forward",
    certification: "ASC, FLR, organic",
    origins: "Ecuador price, India FTA",
    rationale: "Ecuador protects HLSO floor price; India protects cooked/breaded regulatory trajectory."
  },
  {
    species: "Black tiger",
    count: "U-10",
    market: "Japan sushi/tempura",
    window: "Q3 2026 spot",
    certification: "MAFF residue cert",
    origins: "Vietnam, India, Bangladesh niche",
    rationale: "Vietnam wins tempura capability; India covers block-frozen; Bangladesh is a QA-led specialty play."
  }
];

export const sourceNotes: SourceNote[] = [
  {
    url: "https://www.fao.org/fishery/en",
    faviconLabel: "FAO",
    favicon: "https://www.fao.org/favicon.ico",
    publisher: "FAO",
    title: "Fisheries and Aquaculture Market Materials",
    note: "FAO fisheries and aquaculture market data and publications."
  },
  {
    url: "https://www.trade.gov/",
    faviconLabel: "ITA",
    favicon: "https://www.trade.gov/favicon.ico",
    publisher: "ITA",
    title: "International Trade Administration",
    note: "International Trade Administration trade references and ADD/CVD data."
  },
  {
    url: "https://www.shrimpinsights.com/",
    faviconLabel: "SI",
    favicon: "https://www.shrimpinsights.com/favicon.ico",
    publisher: "Shrimp Insights",
    title: "Shrimp Market Coverage",
    note: "Shrimp Insights market coverage and trade analysis."
  },
  {
    url: "https://www.fda.gov/food/import-program-food/import-alerts",
    faviconLabel: "FDA",
    favicon: "https://www.fda.gov/favicon.ico",
    publisher: "FDA",
    title: "Import Alert 99-51 / 99-52",
    note: "FDA Cs-137 import certification and Import Alert releases."
  },
  {
    url: "https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/india_en",
    faviconLabel: "EC",
    favicon: "https://ec.europa.eu/favicon.ico",
    publisher: "EU Commission",
    title: "EU–India FTA and CATCH / IUU Guidance",
    note: "EU-India FTA text publication and EU CATCH/IUU implementation guidance."
  },
  {
    url: "https://mpeda.gov.in/",
    faviconLabel: "MPD",
    favicon: "https://mpeda.gov.in/favicon.ico",
    publisher: "MPEDA",
    title: "FY 2025-26 Seafood Export Release",
    note: "MPEDA / PIB FY 2025-26 seafood export press release."
  },
  {
    url: "https://www.usitc.gov/research_and_analysis/trade_shifts.htm",
    faviconLabel: "UST",
    favicon: "https://www.usitc.gov/favicon.ico",
    publisher: "USITC",
    title: "2025 Warm-Water Shrimp Origin Flows",
    note: "US import and trade press data for 2025 warm-water shrimp origin flows."
  },
  {
    url: "https://vasep.com.vn/",
    faviconLabel: "VSP",
    favicon: "https://vasep.com.vn/favicon.ico",
    publisher: "VASEP",
    title: "Q1 2026 Shrimp Export Updates",
    note: "VASEP Q1 2026 shrimp export updates and Saudi official aquaculture statistics."
  },
  {
    publisher: "USITC",
    title: "Harmonized Tariff Schedule",
    url: "https://hts.usitc.gov/",
    favicon: "https://www.google.com/s2/favicons?domain=hts.usitc.gov&sz=64",
    faviconLabel: "US",
    note: "Base HTS/MFN check for raw frozen shrimp under 0306.17.00 and prepared shrimp lines under 1605.21 / 1605.29."
  },
  {
    publisher: "White House",
    title: "Temporary Import Surcharge and trade-framework actions",
    url: "https://www.whitehouse.gov/presidential-actions/2026/02/imposing-a-temporary-import-surcharge-to-address-fundamental-international-payments-problems/",
    favicon: "https://www.google.com/s2/favicons?domain=whitehouse.gov&sz=64",
    faviconLabel: "WH",
    note: "Policy-framework and Section 122 context used to separate country framework rates from live landed-duty exposure."
  },
  {
    publisher: "International Trade Administration",
    title: "Frozen warmwater shrimp AD/CVD determinations",
    url: "https://www.trade.gov/",
    favicon: "https://www.google.com/s2/favicons?domain=trade.gov&sz=64",
    faviconLabel: "ITA",
    note: "AD/CVD cash-deposit context for Ecuador, India, Indonesia, and Vietnam, including Vietnam company-specific outlier risk."
  },
  {
    publisher: "Shrimp Insights",
    title: "US Imports 2025: origin flow volumes",
    url: "https://www.shrimpinsights.com/byte/us-imports-2025-flat-volume-higher-value-tariff-driven-q4-reset",
    favicon: "https://www.google.com/s2/favicons?domain=shrimpinsights.com&sz=64",
    faviconLabel: "SI",
    note: "Full-year 2025 U.S. import volumes used for Ecuador, India, Indonesia, and Vietnam origin lanes."
  },
  {
    publisher: "FAO GLOBEFISH",
    title: "Shifts in the global shrimp trade and production",
    url: "https://www.fao.org/in-action/globefish/news-events/news/news-detail/shifts-in-the-global-shrimp-trade-and-production/en",
    favicon: "https://www.google.com/s2/favicons?domain=fao.org&sz=64",
    faviconLabel: "FAO",
    note: "Attribution path for the Rabobank estimate that global farmed shrimp production could reach roughly 6 million tonnes in 2025."
  },
  {
    publisher: "NOAA Fisheries",
    title: "European Union Certification Requirements",
    url: "https://www.fisheries.noaa.gov/national/seafood-commerce-trade/european-union-certification-requirements",
    favicon: "https://www.google.com/s2/favicons?domain=fisheries.noaa.gov&sz=64",
    faviconLabel: "NOAA",
    note: "EU CATCH / Annex IV scope used to narrow wild-caught documentation language for farmed vannamei programs."
  },
  {
    publisher: "USITC",
    title: "China Tariffs reference file",
    url: "https://hts.usitc.gov/reststop/file?release=currentRelease&filename=China%20Tariffs",
    favicon: "https://www.google.com/s2/favicons?domain=hts.usitc.gov&sz=64",
    faviconLabel: "US",
    note: "China Section 301 reference used to avoid presenting the China U.S. cell as a simple 10% rate."
  },
  {
    publisher: "European Commission",
    title: "Vietnam IUU yellow-card action",
    url: "https://ec.europa.eu/commission/presscorner/detail/en/IP_17_4064",
    favicon: "https://www.google.com/s2/favicons?domain=ec.europa.eu&sz=64",
    faviconLabel: "EC",
    note: "Background for Vietnam seafood-risk perception, separated from blanket farmed-shrimp CATCH treatment."
  }
];
