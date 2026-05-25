import type { BlogPost } from "@/lib/blog/types";

export type MonitorMetric = {
  value: string;
  label: string;
  note: string;
};

export type MonitorStep = {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  operatorQuestion: string;
  status: "input" | "compare" | "evidence" | "route" | "review";
};

export type LeaderboardSnapshotRow = {
  model: string;
  provider: string;
  arenaRank: number;
  tradeOpsFit: number;
  bestUse: string;
};

export const aiMonitorPost: BlogPost = {
  slug: "ai-monitor-layer-seafood-trade",
  date: "2026-05-26",
  updated: "2026-05-26",
  category: "Operational AI",
  title: "The Invisible Drift: why seafood AI needs a monitor layer",
  excerpt:
    "A case study on 735 seafood exhibitor records, model disagreement, and why practical AI adoption depends on evidence routing before an answer becomes a workflow decision.",
  seoTitle: "Why seafood AI needs a monitor layer",
  seoDescription:
    "A Ubik Trade Note on AI monitoring for seafood operators: evidence capture, model disagreement, confidence routing, green amber red review queues, and workflow-safe AI adoption.",
  canonical: "https://theubik.com/blog/ai-monitor-layer-seafood-trade",
  author: "Ubik field team",
  readingTime: "13 min read",
  template: "visual-analysis",
  featured: true,
  ogImage: "https://theubik.com/blog/ai-monitor-layer/header-light.png",
  heroLightImage: "/blog/ai-monitor-layer/header-light.png",
  heroDarkImage: "/blog/ai-monitor-layer/header-dark.png"
};

export const monitorMetrics: MonitorMetric[] = [
  {
    value: "12",
    label: "major models shipped in one week",
    note: "March 2026 compressed model selection into a weekly operating problem, not an annual procurement cycle."
  },
  {
    value: "600x",
    label: "token-price decline since 2020",
    note: "Cheaper tokens do not automatically mean cheaper workflows when agents expand context, retries, and review loops."
  },
  {
    value: "95%",
    label: "enterprise gen-AI pilots with no P&L impact",
    note: "The failure is usually integration, evidence, and operating design, not raw model intelligence."
  }
];

export const monitorSteps: MonitorStep[] = [
  {
    id: "source",
    kicker: "01 / Source file",
    title: "Start with the messy operating object.",
    copy:
      "The input was a 735-row seafood exhibitor list. The field looked simple: infer the headquarters or primary operating country. In seafood, that can mean farm, processor, exporter, group HQ, sales office, or distributor signal.",
    operatorQuestion: "What does this field change downstream?",
    status: "input"
  },
  {
    id: "parallel",
    kicker: "02 / Parallel extraction",
    title: "Run more than one path when the decision matters.",
    copy:
      "One extraction path produced broad coverage. A web-first path produced an independent view. The value was not a winner-loser scoreboard; it was conflict visibility.",
    operatorQuestion: "Do two systems fail in the same direction?",
    status: "compare"
  },
  {
    id: "disagreement",
    kicker: "03 / Disagreement",
    title: "Treat disagreement as a queue, not a bug.",
    copy:
      "The comparison found 309 agreements and 167 disagreements where both systems resolved a country. Those rows became the highest-value review queue because conflict was concentrated, inspectable, and actionable.",
    operatorQuestion: "Which rows deserve scarce review time?",
    status: "compare"
  },
  {
    id: "evidence",
    kicker: "04 / Evidence capture",
    title: "Confidence without evidence is not operational state.",
    copy:
      "A confident country tag is still weak if it cannot show whether the source proves headquarters, operating base, exporter origin, or only a sales presence. The monitor asks for source type before it lets the answer move.",
    operatorQuestion: "What does the source actually prove?",
    status: "evidence"
  },
  {
    id: "routing",
    kicker: "05 / Green, amber, red",
    title: "Add friction only where the workflow needs it.",
    copy:
      "The monitor converted raw answers into green, amber, and red routing. That keeps low-risk rows moving while forcing review on ambiguity, drift, and missing evidence.",
    operatorQuestion: "Can this answer become a decision now?",
    status: "route"
  },
  {
    id: "learning",
    kicker: "06 / Learning loop",
    title: "Corrections become operating memory.",
    copy:
      "The durable layer is not the model call. It is the monitor that remembers failure clusters: English-law suffix overreach, sales-market confusion, distributor geography, and unsupported country drift.",
    operatorQuestion: "What should the system catch next time?",
    status: "review"
  }
];

export const providerChips = [
  { name: "OpenAI", domain: "openai.com" },
  { name: "Anthropic", domain: "anthropic.com" },
  { name: "Gemini", domain: "gemini.google.com" },
  { name: "Grok", domain: "x.ai" },
  { name: "Perplexity", domain: "perplexity.ai" }
];

export const leaderboardSnapshot: LeaderboardSnapshotRow[] = [
  {
    model: "Gemini 3",
    provider: "Google",
    arenaRank: 1,
    tradeOpsFit: 91,
    bestUse: "Broad reasoning and supplier-file normalization."
  },
  {
    model: "Grok 4.1",
    provider: "xAI",
    arenaRank: 2,
    tradeOpsFit: 87,
    bestUse: "Fast second opinion on ambiguous rows."
  },
  {
    model: "Claude Opus",
    provider: "Anthropic",
    arenaRank: 4,
    tradeOpsFit: 94,
    bestUse: "Careful exception review and policy reasoning."
  },
  {
    model: "GPT-5.1 High",
    provider: "OpenAI",
    arenaRank: 8,
    tradeOpsFit: 92,
    bestUse: "Structured work plans, extraction checks, and agentic handoffs."
  },
  {
    model: "Claude Sonnet",
    provider: "Anthropic",
    arenaRank: 10,
    tradeOpsFit: 89,
    bestUse: "Reliable day-to-day operator workflows at lower latency."
  }
];
