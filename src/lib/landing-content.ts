import { FingerprintIcon, LockKeyIcon, ShieldCheckIcon } from "@phosphor-icons/react";

export interface Faq {
  question: string;
  answer: string;
}

export const proofPoints = [
  {
    stat: "$700M+",
    label: "in customer aggregate revenue"
  },
  {
    stat: "20x",
    label: "faster RFQ cycles (5-7 days to 6 hours)"
  },
  {
    stat: "$200K",
    label: "margin recovered, single account, month one"
  }
];

export const heroTickerItems = [
  "Live for Global Seafood",
  "Testing for Meat",
  "Testing for Dairy",
  "Testing for Frozen Veggies"
];

export const queueActions = ["Delegate", "Assign", "Analyse", "Approve"];

export const liveQueueRows = [
  {
    title: "RFQ ready to quote",
    copy: "Importer asks for partial shipment: inventory, COGS, and margin guardrail pulled in 30s.",
    apps: ["Gmail", "Salesforce"],
    status: "Now"
  },
  {
    title: "Container ETA shifted",
    copy: "India to NJ went 34 to 52 days: downstream promise dates auto-recalculated.",
    apps: ["Microsoft", "Oracle"],
    status: "Found"
  },
  {
    title: "Margin watch",
    copy: "Power BI variance flagged. Pricing error caught before quote confirmation.",
    apps: ["Power BI"],
    status: "Analyse"
  },
  {
    title: "PO -> ERP -> Accounting",
    copy: "PDF PO parsed, mapped to SKUs, pushed to ERP, accounting check drafted.",
    apps: ["Zoho", "Accounting"],
    status: "Ready"
  }
];

export const sourceSystems = [
  { label: "CRM", logo: "salesforce", meta: "Salesforce", logoPath: undefined },
  { label: "ERP", logo: "microsoft", meta: "Dynamics", logoPath: undefined },
  { label: "Programs", logo: "fallback", meta: "Oracle", logoPath: "/integrations/oracle.svg" },
  { label: "Logistics", logo: "fallback", meta: "Maersk", logoPath: "/integrations/MAERSK-B.CO.svg" },
  { label: "Follow-ups", logo: "gmail", meta: "Gmail", logoPath: undefined },
  { label: "Trade docs", logo: "pdf", meta: "PDFs", logoPath: undefined },
  { label: "BI", logo: "microsoft", meta: "Power BI", logoPath: "/integrations/power-bi.svg" },
  { label: "Conversations", logo: "fallback", meta: "WhatsApp", logoPath: "/integrations/Print_Glyph_Green_CMYK_2026.svg" }
] as const;

export const operatorSignals = [
  { label: "Signal", value: "Buyer asks if partial shipment can move." },
  { label: "Context", value: "Inventory, margin, and account state matched." },
  { label: "Priority", value: "Finance approval needed before send." }
];

export const reviewedOutputs = [
  { label: "Buyer reply", value: "Confirm partial move." },
  { label: "Partial shipment approval", value: "Finance reviews." },
  { label: "ERP handoff", value: "Order packet waits." }
];

export const bottomCallouts = [
  {
    title: "20x faster RFQ cycles. Margins protected before bid season."
  },
  {
    title: "Your ERP stays the source of truth. Ubik makes it useful."
  },
  {
    title: "Every action reviewed. Every decision audited. SOC 2 Type 2."
  }
];

export const howWorkflows = [
  {
    title: "Operator home",
    eyebrow: "Workspace",
    outcome: "See margin, approvals, and tasks in one operating queue.",
    media: {
      type: "video",
      src: "/prototypes/home-task-nav.mp4",
      poster: "/prototypes/posters/home-task-nav.jpg",
      alt: "Ubik home workspace showing operating metrics and execution queue"
    },
    steps: ["Read the morning brief", "Prioritize urgent tasks", "Open the work artifact"]
  },
  {
    title: "Inbox to reviewed action",
    eyebrow: "Buyer desk",
    outcome: "Turn a blocked thread into a reply, task, or approval.",
    media: {
      type: "video",
      src: "/prototypes/inbox-navigation.mp4",
      poster: "/prototypes/posters/inbox-navigation.jpg",
      alt: "Ubik inbox review surface showing a rate confirmation requiring approval"
    },
    steps: ["Read the thread", "Surface what changed", "Approve the reply"]
  },
  {
    title: "Meeting memory",
    eyebrow: "Operator calls",
    outcome: "Keep supplier and logistics calls searchable after the meeting ends.",
    media: {
      type: "video",
      src: "/prototypes/meeting-nav.mp4",
      poster: "/prototypes/posters/meeting-nav.jpg",
      alt: "Ubik meetings view with supplier review and logistics sync calls"
    },
    steps: ["Capture the call", "Attach account context", "Recover the decision trail"]
  },
  {
    title: "Know Anything",
    eyebrow: "Trade memory",
    outcome: "Ask across projects, meetings, chats, and linked work.",
    media: {
      type: "video",
      src: "/prototypes/know-anything-navigation.mp4",
      poster: "/prototypes/posters/know-anything-navigation.jpg",
      alt: "Ubik Know Anything search across meetings, chats, and project context"
    },
    steps: ["Search linked work", "Pull source context", "Return the action thread"]
  },
  {
    title: "VMI exception",
    eyebrow: "Customer inventory",
    outcome: "Spot ETA shifts, inventory risk, and replenishment moves before the customer asks.",
    media: {
      type: "image",
      src: "/prototypes/screenshots/vmi-dashboard-wide.png",
      alt: "Ubik VMI dashboard showing container ETA auto-adjustment and inventory risk"
    },
    secondaryMedia: [
      {
        src: "/prototypes/screenshots/vmi-container-pipeline.png",
        alt: "Container pipeline view across PO confirmed, production, inspection, on water, at port, and warehouse"
      },
      {
        src: "/prototypes/screenshots/vmi-customer-email.png",
        alt: "Customer email draft generated from inventory position"
      }
    ],
    steps: ["Detect ETA movement", "Recalculate promise dates", "Draft customer update"]
  }
];

export const blogPosts = [
  {
    slug: "operator-layer-for-perishables",
    date: "2026-04-29",
    category: "Operations",
    title: "AI decision intelligence for perishable supply chains",
    excerpt: "Seafood is the most traded, least digitized commodity on earth. Why ERPs fail, why generic AI fails, and what an operator-grade AI layer looks like in 2026."
  },
  {
    slug: "buyer-follow-up-to-order-packet",
    date: "2026-04-29",
    category: "Workflow",
    title: "From RFQ to reviewed quote in 6 hours",
    excerpt: "How a large vertically integrated seafood conglomerate compressed inquiry-to-quote cycles from 5-7 days to 6 hours and recovered $200K in margin on a single account, in month one."
  },
  {
    slug: "human-in-loop-erp-handoffs",
    date: "2026-04-29",
    category: "Trust",
    title: "Software today, trade operations tomorrow: the AI-native trade thesis",
    excerpt: "Vertical AI is misframed as 'AI for industry X.' The real opportunity is using AI to operate industries. A note from the founders on where Ubik is going."
  }
];

export const processSteps = [
  {
    title: "Capture",
    copy: "Read work signals across your stack."
  },
  {
    title: "Context",
    copy: "Match the thread to source-system state."
  },
  {
    title: "Approve",
    copy: "Approve, edit, or reject before it moves."
  }
];

export const securityCards = [
  {
    icon: ShieldCheckIcon,
    title: "SOC 2 Type 2, GDPR, ISO 27001",
    copy: "Annual audit, EU data residency, AES-256 at rest, TLS 1.3 in transit."
  },
  {
    icon: LockKeyIcon,
    title: "Never trained on your data",
    copy: "Your RFQs, supplier pricing, and margins never become input to any third-party model. Contractually guaranteed."
  },
  {
    icon: FingerprintIcon,
    title: "Human sign-off, every time",
    copy: "Least-privilege OAuth scopes, revocable access, audit log on every action. Sensitive moves require review."
  }
];

export const faqs: Faq[] = [
  {
    question: "What is Ubik?",
    answer: "Ubik is the personalised workspace for perishable trade, built for seafood importers, exporters, and processors. It connects your CRM, ERP, email, WhatsApp, and shared drives, then runs reviewed agent workflows that handle the work most teams hire 4 to 7 people to do: turning RFQs into quotes, processing POs, tracking transit, monitoring margin, and tracing lots from container to customer. Ubik is built by ex-operators from seafood and aquaculture companies, not generalist AI engineers. It is in production with companies running $700M+ in combined annual revenue."
  },
  {
    question: "Who is Ubik for?",
    answer: "Ubik is for seafood importers, exporters, and processors with $40M to $400M in annual revenue, typically family-owned or founder-led, moving frozen, chilled, or live seafood across borders. Active deployments include US, French, Canadian, and Indian operators across importing, processing, pilots, and PO automation. If your team handles 30 to 200 containers a year and your inbox is the de facto ERP, you are our customer."
  },
  {
    question: "How is Ubik different from ChatGPT, Claude, or Gemini for business?",
    answer: "Ubik is built for one industry, with industry-specific memory and integrations, while ChatGPT, Claude, and Gemini are general-purpose. Three differences matter. First, Ubik understands seafood-native concepts out of the box: HSFCA, BOL, lot codes, cold chain, transit days, FDA holds. Second, Ubik connects to your stack (Outlook, Gmail, Zoho, SAP, WhatsApp) and acts inside it, rather than producing text you copy-paste. Third, your data does not become training data. Ubik is SOC 2 Type 2 with EU data residency. ChatGPT and Claude treat your RFQs and supplier pricing as input to their next model."
  },
  {
    question: "Does Ubik replace my ERP or CRM?",
    answer: "No. Ubik sits on top of your ERP and CRM and makes them useful. Most seafood operators run a stack of one ERP (Zoho, SAP, NetSuite, or a custom build), one CRM, plus 10 to 15 other tools. Ninety percent of trade still happens in email and WhatsApp, which never reach the ERP. Ubik unifies that into a single workspace where agents read across systems, trigger actions, and write back. Customers keep their ERP as the system of record. Ubik becomes the system of action."
  },
  {
    question: "How fast can I get value from Ubik?",
    answer: "Most customers see measurable outcomes within 4 weeks. Onboarding runs week 1 mapping your value chain, week 2 building your first agent playbooks, week 3 driving operator adoption, week 4 delivering measurable results: time saved, margin recovered, decisions taken faster. One customer found $200K in recovered margin on a single account in month one. Another went from manual PO processing to 30-second extraction with ERP push. A third surfaced lot traceability from container to retailer in under 3 minutes. If you do not see ROI in 90 days, we work for free until you do."
  },
  {
    question: "What does Ubik cost?",
    answer: "Ubik has two public plan types. Base is $100 per month, or $85 per month on annual billing, for one operator who wants a personal AI workspace with Ubik Webapp and Ubik Local included. Enterprise is custom for teams running mission-critical workflows across email, WhatsApp, ERP, CRM, market intelligence, and customers. Enterprise pricing is built around value recovered, private deployment needs, onboarding scope, and workflow automation depth."
  },
  {
    question: "Is my data safe with Ubik?",
    answer: "Yes. Ubik is SOC 2 Type 2 with annual audit, GDPR-compliant for EU customers, and ISO 27001 certified. Data is encrypted AES-256 at rest and TLS 1.3 in transit. Data residency is available in the US, EU, and APAC. LLM models are called only for planning and action steps, never for training. Role-based permissions, SSO with Okta, Azure AD, and Google Workspace, and audit logging on every action are standard. Your prompts, RFQs, supplier pricing, and margin data never become training input for any third-party model. Contractually guaranteed."
  },
  {
    question: "What data is shared with LLMs?",
    answer: "Ubik minimizes what is sent to external LLMs. Models are used for planning, reasoning and drafting actions, not for bulk raw-data ingestion. Sensitive context like RFQs, supplier pricing, margins, customer names and credentials is kept in Ubik's context layer, local workspace or private deployment depending on the setup. Enterprise customers can configure private, local or air-gapped deployments. Customer data is never used to train third-party models."
  },
  {
    question: "Which integrations does Ubik support?",
    answer: "Ubik connects to over 800 apps. Email: Gmail, Outlook, Microsoft 365 with Domain-Wide Delegation. ERP and accounting: Zoho Books, Zoho Inventory, SAP, NetSuite, QuickBooks. CRM: Salesforce, HubSpot, Zoho CRM. Chat: WhatsApp Business, Slack, Microsoft Teams. Logistics and pricing intelligence: SeaRates, Expana, Maersk, custom carrier portals. Productivity: Google Drive, OneDrive, Dropbox, Notion. If a system has an API or a structured export, we connect it during onboarding. If it does not, our forward-deployed engineer builds the integration in week 2."
  },
  {
    question: "What workflows does Ubik run today?",
    answer: "Ubik runs five workflow primitives in production. RFQ to quote: assembles inventory, COGS, past quotes, and margin targets, then drafts a quote with human approval, compressing 5-7 day cycles to 6 hours. PO ingestion: extracts line items from PDF emails, maps to internal SKUs, pushes to ERP, and sends confirmation in a 30-second cycle. Transit-aware scheduling: when India to NJ shifts from 34 to 52 days, all downstream timelines auto-recalculate. VMI pull-rate dashboard: 90-day vs 120-day actuals and pricing-formula validation. Lot traceability: container number to retailer in under 3 minutes."
  },
  {
    question: "Why seafood, why now?",
    answer: "Seafood is the most traded, least digitized commodity on earth. Raw material is 55 to 62% of product value, so a 2% pricing error costs more than an annual Ubik subscription. Margins are 5 to 15% and operational inefficiency leaks all of it. Existing tools fail: ERPs are built for structured data while 90% of seafood trade runs on email and WhatsApp; generic AI does not understand HSFCA, BOL, or seafood compliance; data scientists cost €40K per year for one person while Ubik automates the same patterns in seconds. Vertical context plus agentic workflows are reorganizing entire categories."
  },
  {
    question: "Where is Ubik live today?",
    answer: "Ubik is in production with five paying customers across four countries. Current customers include a large US shrimp importer, a top-5 French importer, a Canadian pilot, an Indian contract customer, and a US processor implementing PO automation. The active pipeline spans enterprise food, seafood, and perishables operators. Active operator count is 30+ across 4 companies."
  }
];

export const tryTiers = [
  {
    value: "free",
    name: "Workflow scan",
    title: "Find the first pilot",
    copy: "Map one messy workflow."
  },
  {
    value: "plus",
    name: "Operator pilot",
    title: "Run one loop",
    copy: "Connect sources and review outputs."
  },
  {
    value: "enterprise",
    name: "Enterprise rollout",
    title: "Scale with trust",
    copy: "Founder-led onboarding for security and ERP handoff."
  }
] as const;
