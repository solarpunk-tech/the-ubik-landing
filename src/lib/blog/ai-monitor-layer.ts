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
  supplierIntel: number;
  evidenceReview: number;
  workflowRouting: number;
  costControl: number;
  bestUse: string;
};

export type LeaderboardUseCase = {
  id: keyof Pick<LeaderboardSnapshotRow, "supplierIntel" | "evidenceReview" | "workflowRouting" | "costControl">;
  label: string;
  kicker: string;
  description: string;
};

export type MonitorSourceLink = {
  publisher: string;
  title: string;
  url: string;
  domain: string;
  image: string;
  note: string;
};

export const aiMonitorPost: BlogPost = {
  slug: "ai-monitor-layer-seafood-trade",
  date: "2026-05-26",
  updated: "2026-05-29",
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
    model: "Opus 4.7 Thinking",
    provider: "Anthropic",
    arenaRank: 2,
    supplierIntel: 91,
    evidenceReview: 97,
    workflowRouting: 90,
    costControl: 78,
    bestUse: "Careful exception review and policy reasoning."
  },
  {
    model: "Gemini 3.1 Pro",
    provider: "Google",
    arenaRank: 6,
    supplierIntel: 94,
    evidenceReview: 87,
    workflowRouting: 85,
    costControl: 82,
    bestUse: "Broad reasoning and supplier-file normalization."
  },
  {
    model: "Grok 4.20",
    provider: "xAI",
    arenaRank: 10,
    supplierIntel: 88,
    evidenceReview: 80,
    workflowRouting: 83,
    costControl: 86,
    bestUse: "Fast second opinion on ambiguous rows."
  },
  {
    model: "GPT-5.5 High",
    provider: "OpenAI",
    arenaRank: 8,
    supplierIntel: 92,
    evidenceReview: 90,
    workflowRouting: 95,
    costControl: 84,
    bestUse: "Structured work plans, extraction checks, and agentic handoffs."
  },
  {
    model: "Sonnet 4.6",
    provider: "Anthropic",
    arenaRank: 20,
    supplierIntel: 86,
    evidenceReview: 88,
    workflowRouting: 91,
    costControl: 92,
    bestUse: "Reliable day-to-day operator workflows at lower latency."
  }
];

export const leaderboardUseCases: LeaderboardUseCase[] = [
  {
    id: "supplierIntel",
    label: "Supplier intel",
    kicker: "messy company files",
    description: "Which model best normalizes exporter, processor, distributor, and HQ signals into a usable supplier record."
  },
  {
    id: "evidenceReview",
    label: "Evidence review",
    kicker: "source-backed decisions",
    description: "Which model is strongest when the output must explain what the source proves before a row moves."
  },
  {
    id: "workflowRouting",
    label: "Workflow routing",
    kicker: "operator handoffs",
    description: "Which model is best suited for turning extracted facts into next steps, queues, and exception paths."
  },
  {
    id: "costControl",
    label: "Cost control",
    kicker: "repeatable operations",
    description: "Which model is easier to use repeatedly when latency, token use, and review load matter."
  }
];

export const monitorSourceLinks: MonitorSourceLink[] = [
  {
    publisher: "Arena",
    title: "Public leaderboard",
    url: "https://arena.ai/leaderboard/",
    domain: "arena.ai",
    image: "/blog/ai-monitor-layer/header-light.png",
    note: "Free public model leaderboard used as the shortlist before workflow-specific remapping."
  },
  {
    publisher: "arXiv",
    title: "Tiered Super-Moore token pricing",
    url: "https://arxiv.org/abs/2603.28576",
    domain: "arxiv.org",
    image: "/blog/ai-monitor-layer/reasoning-leakage-light.png",
    note: "Research basis for the long-run token price compression reference."
  },
  {
    publisher: "McKinsey",
    title: "The State of AI in 2025",
    url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
    domain: "mckinsey.com",
    image: "/blog/ai-monitor-layer/routing-friction-light.png",
    note: "Enterprise adoption context showing value capture remains concentrated in a small set of high performers."
  },
  {
    publisher: "MIT coverage",
    title: "Gen-AI pilots and P&L impact",
    url: "https://www.tomshardware.com/tech-industry/artificial-intelligence/95-percent-of-generative-ai-implementations-in-enterprise-have-no-measurable-impact-on-p-and-l-says-mit-flawed-integration-key-reason-why-ai-projects-underperform",
    domain: "tomshardware.com",
    image: "/blog/ai-monitor-layer/fragmented-truth-light.png",
    note: "Reported MIT finding on why many enterprise pilots stall before measurable value."
  }
];
