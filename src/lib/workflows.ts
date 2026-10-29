/** Workflow pages, in the order they are listed. Copy lives under workflows.items.<slug>. */
export const workflowSlugs = [
  "supplier-followups",
  "shipment-documents",
  "production-planning",
  "packaging-quality",
  "export-shipments",
  "production-reconciliation",
  "production-sheets",
  "replenishment",
  "customer-planning",
  "ceo-control-panel",
  "csr-monitor",
  "packaging-specs"
] as const;

/** The four on the home and Platform pages. */
export const featuredWorkflowSlugs = workflowSlugs.slice(0, 4);

export type WorkflowSlug = (typeof workflowSlugs)[number];

export type WorkflowStep = { title: string; copy: string };

export type SupplierUpdatesVisual = {
  subject: string;
  to: string;
  attachment: string;
  repliesLabel: string;
  status: string;
  changes: { po: string; field: string; from: string; to: string }[];
};

export type DocumentCheckVisual = {
  po: string;
  stage: string;
  labels: Record<"received" | "missing" | "partial", string>;
  docs: { name: string; state: "received" | "missing" | "partial" }[];
  finding: { severity: string; owner: string; text: string };
  action: string;
  send: string;
  invoice: string;
};

export type PlanningVisual = {
  title: string;
  reportLabel: string;
  report: string;
  loads: { id: string; progress: number; risk: string; note?: string }[];
};

export type PackagingVisual = {
  task: string;
  owner: string;
  thread: { from: string; text: string; file: string }[];
  status: string;
  chase: string;
  sla: string[];
  slaActive: number;
};

export type WorkflowCopy = {
  name: string;
  audience: string;
  seoTitle: string;
  seoDescription: string;
  summary: string;
  lede: string;
  steps: WorkflowStep[];
  outputs: string[];
  /** Product behaviour in numbers, from the workflow's code. */
  stats: { value: string; label: string }[];
  /** Where the figures come from, when they are measured rather than how the product works. */
  statsNote?: string;
  cta: string;
  /** Hero picture for the first four; the rest show their first How it runs screen. */
  visual?: SupplierUpdatesVisual | DocumentCheckVisual | PlanningVisual | PackagingVisual;
};

export const workflowPath = (slug: WorkflowSlug) => `/workflows/${slug}`;

export const isWorkflowSlug = (value: string | undefined): value is WorkflowSlug =>
  (workflowSlugs as readonly string[]).includes(value ?? "");
