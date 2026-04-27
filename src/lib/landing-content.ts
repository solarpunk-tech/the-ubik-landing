import {
  ArrowBendUpRightIcon,
  ClipboardTextIcon,
  EnvelopeIcon,
  EyeIcon,
  FingerprintIcon,
  FlowArrowIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  TruckIcon
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export interface Capability {
  icon: Icon;
  title: string;
  copy: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export const proofPoints = [
  {
    stat: "30 sec",
    label: "target review cadence",
    copy: "Inbound orders, invoices, and exception threads can be checked continuously before an operator approves the next step."
  },
  {
    stat: "5 ops lanes",
    label: "one review queue",
    copy: "Sales, purchase, logistics, quality, and compliance work are brought into a single operating layer."
  },
  {
    stat: "1 pilot",
    label: "before rollout",
    copy: "Ubik starts with one high-friction workflow, then expands after the team validates controls and ROI."
  }
];

export const capabilities: Capability[] = [
  {
    icon: EnvelopeIcon,
    title: "Inquiry autopilot",
    copy: "Turn customer inquiries, RFQs, and follow-ups into a reviewed response queue with account context attached."
  },
  {
    icon: ClipboardTextIcon,
    title: "PO-to-order review",
    copy: "Extract purchase orders, invoices, delivery dates, and line items, then route exceptions before ERP handoff."
  },
  {
    icon: TruckIcon,
    title: "Shipment visibility",
    copy: "Track open POs, shipment movement, ETA changes, and logistics exceptions without chasing email threads."
  },
  {
    icon: FlowArrowIcon,
    title: "Workflow playbooks",
    copy: "Run repeatable sales, purchase, logistics, quality, and compliance motions with human approval gates."
  },
  {
    icon: EyeIcon,
    title: "Traceability answers",
    copy: "Ask about lots, containers, customers, files, and meeting context with source-backed answers for operators."
  },
  {
    icon: ArrowBendUpRightIcon,
    title: "ERP-ready actions",
    copy: "Prepare clean handoffs for existing ERPs and CRMs while keeping source systems as the system of record."
  }
];

export const processSteps = [
  {
    title: "Capture the operating signal",
    copy: "Ubik watches authorized inboxes, files, calendars, and workflow sources for POs, inquiries, invoices, shipment changes, and approvals."
  },
  {
    title: "Assemble context",
    copy: "The workbench maps customer language to internal context, compares documents, flags missing details, and keeps the chain of evidence visible."
  },
  {
    title: "Approve the next move",
    copy: "Operators review drafts, exceptions, and ERP-ready actions before anything is sent, confirmed, or pushed downstream."
  }
];

export const securityCards = [
  {
    icon: ShieldCheckIcon,
    title: "Least privilege",
    copy: "OAuth scopes are tied to the enabled workflow, with admin review before broader rollout."
  },
  {
    icon: LockKeyIcon,
    title: "Revocable access",
    copy: "Google and Microsoft access can be removed by the user or workspace administrator."
  },
  {
    icon: FingerprintIcon,
    title: "Human sign-off",
    copy: "Sensitive drafts, approvals, confirmations, and ERP handoffs stay under operator review."
  }
];

export const faqs: Faq[] = [
  {
    question: "What is Ubik?",
    answer:
      "Ubik is the AI operator workbench from Solarpunk Technology for seafood, perishables, and trade teams that coordinate through inboxes, spreadsheets, ERPs, and WhatsApp."
  },
  {
    question: "Who is Ubik for?",
    answer:
      "Ubik is for CTOs, founders, sales ops, purchase ops, logistics, quality, and compliance leaders who need faster decisions without replacing their existing systems."
  },
  {
    question: "How is Ubik different from CRM or PM software?",
    answer:
      "Ubik sits above source systems as an operating layer. It reads context, prepares the next action, and keeps humans in control before external replies or ERP changes."
  },
  {
    question: "What workflows can Ubik run first?",
    answer:
      "Ubik can start with inquiry autopilot, PO-to-order review, invoice checks, shipment visibility, customer inventory updates, compliance packs, and exception follow-ups."
  },
  {
    question: "Is customer data used for training?",
    answer:
      "Ubik does not sell customer workspace data and does not use customer workspace data to train third-party AI models."
  },
  {
    question: "How does pricing work?",
    answer:
      "Try-now access is a stub today. Razorpay is the planned international gateway when paid checkout turns on."
  }
];

export const tryTiers = [
  {
    value: "free",
    name: "Workflow scan",
    title: "Find the first pilot",
    copy: "Map the inbox, PO, shipment, or inquiry loop that is most ready for automation."
  },
  {
    value: "plus",
    name: "Operator pilot",
    title: "Run one workflow",
    copy: "Connect the minimum sources, review extracted actions, and validate the human approval loop."
  },
  {
    value: "enterprise",
    name: "Enterprise rollout",
    title: "Scale with security review",
    copy: "Founder-led onboarding for CTO review, admin approval, data boundaries, and ERP handoff."
  }
] as const;
