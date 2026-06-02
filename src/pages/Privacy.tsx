import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

// Public legal copy mapped from compliance/privacy/privacy-notice.md.
type Detail = {
  label: string;
  value: string;
};

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
};

const details: Detail[] = [
  { label: "Company", value: "Solarpunk Technology" },
  { label: "Registered address", value: "6/A/1 Sunder Baug Towers, Makarpura Road, Opposite Hazira, Pratapnagar, Vadodara, Gujarat, India" },
  { label: "Privacy / data protection contact", value: "founders@theubik.com" },
  { label: "Grievance Officer (India DPDP Act)", value: "Shubhranshu Jha, COO/CPO - founders@theubik.com" }
];

const sections: Section[] = [
  {
    title: "1. Who we are",
    paragraphs: [
      'Ubik is operated by Solarpunk Technology ("Solarpunk", "Ubik", "we", "us"), a company headquartered in Vadodara, Gujarat, India. We operate a fully remote team.',
      'Ubik is an AI-native operations platform - a "24x7 Chief of Staff" for the perishable supply chain. Our product is delivered as a desktop application and web application at app.theubik.com, with our marketing site at theubik.com.',
      "This notice explains how we handle personal data. It is framed primarily around the India Digital Personal Data Protection Act, 2023 (DPDP Act), with a GDPR-ready structure for international users. Where we act as a processor on behalf of our business customers, the relevant customer's own privacy notice and our Data Processing Agreement govern that data; this notice then describes our practices for transparency."
    ]
  },
  {
    title: "2. Scope",
    paragraphs: ["This notice applies to:"],
    bullets: [
      "Visitors to theubik.com and app.theubik.com.",
      "Users of the Ubik desktop and web applications.",
      "Individuals whose data we process as a controller, such as our own employees, prospects, website visitors, and app visitors.",
      "For context, individuals whose data we process as a processor on behalf of our customers, such as meeting participants and individuals named in ingested customer content."
    ]
  },
  {
    title: "3. Data we collect",
    paragraphs: [
      "Account and contact data: name, work email, organisation, role, account identifiers.",
      "Authentication data: identity from Google Workspace or Microsoft OAuth sign-in. We do not store your identity provider password.",
      "Billing/payment metadata: plan, transaction references and payer details handled by our payment processor. We do not store card numbers.",
      "Support communications: messages you send us.",
      "Meeting recordings and transcripts: when you use Ubik's meeting capture, our desktop application records meeting audio and/or video via our recording subprocessor, which transcribes the meeting. Recordings and transcripts are streamed to our backend, stored, and processed by AI models to produce summaries, action items and operational insight.",
      "Ingested customer content: where a customer connects integrations, we ingest content from Google Workspace (Gmail/Drive), Slack, and Zoho ERP - for example purchase orders, invoices, contracts, inventory and CRM data, and the personal data contained within them. Ubik acts as a processor for this content.",
      "Data collected automatically: product/usage analytics via PostHog, application/session data necessary to operate the service, and device/security data for managed workforce devices.",
      "LLM prompts and outputs: to deliver AI features, customer content is sent as prompts to large language models and the outputs are returned and stored."
    ]
  },
  {
    title: "4. Controller vs processor roles",
    table: {
      headers: ["Data", "Our role"],
      rows: [
        ["Meeting recordings/transcripts (customer meetings)", "Processor (customer is controller)"],
        ["Ingested customer content (email/Slack/Drive/ERP)", "Processor"],
        ["Customer PII within customer content/account", "Processor"],
        ["Our employee/workforce data", "Controller"],
        ["Website & app visitor analytics", "Controller"],
        ["Prospect/marketing contact data", "Controller"]
      ]
    },
    paragraphs: ["When we are a processor, we process personal data only on the documented instructions of the customer under a Data Processing Agreement (DPA)."]
  },
  {
    title: "5. Purposes and lawful bases",
    paragraphs: [
      "Where the India DPDP Act applies, our processing relies on consent or on legitimate uses permitted under the Act. Where the GDPR or UK GDPR applies, our lawful bases under Article 6 are shown below.",
      "Special category data: meeting recordings/transcripts are not used for biometric identification. They may incidentally contain special-category data, such as health or financial information discussed in a meeting. Any such data is processed only on the controller's documented instructions and, where applicable, under explicit consent managed by the controller. We do not intentionally process special-category data and rely on the customer to manage lawful basis under Art. 9 of the GDPR."
    ],
    table: {
      headers: ["Purpose", "Role", "GDPR Art. 6 basis"],
      rows: [
        ["Providing the Ubik service, including recording, transcription, ingestion, and AI processing to customers", "Processor", "Controller's basis; our processing per DPA"],
        ["Account creation, authentication, billing", "Controller", "Contract (Art. 6(1)(b))"],
        ["Product analytics and service improvement", "Controller", "Legitimate interests (Art. 6(1)(f)) / consent where required"],
        ["Security, fraud prevention, service integrity", "Controller", "Legitimate interests (Art. 6(1)(f))"],
        ["Marketing communications to prospects", "Controller", "Consent (Art. 6(1)(a)) / legitimate interests"],
        ["Employee/workforce administration", "Controller", "Contract / legal obligation / legitimate interests"],
        ["Complying with legal obligations", "Controller", "Legal obligation (Art. 6(1)(c))"]
      ]
    }
  },
  {
    title: "6. Recordings: notification and consent",
    paragraphs: [
      "Recording laws vary by jurisdiction and some require all-party consent. Customers are responsible, as controllers, for notifying and, where required, obtaining consent from meeting participants. Ubik surfaces in-product recording indicators so that participants are made aware when capture is active, and our customer documentation sets out host responsibilities for participant notification. See our DPIA for meeting recording and transcription for detail."
    ]
  },
  {
    title: "7. Recipients and subprocessors",
    paragraphs: [
      "We share personal data with vendors that help us deliver the service, with our cloud infrastructure provider, and with professional advisers or authorities where legally required. We do not sell personal data.",
      "Our current list of subprocessors is published on our subprocessor page and on our Trust Center. We notify customers of changes per our DPA: 30-day advance notice.",
      "Primary infrastructure is Google Cloud Platform. AI processing is performed by Anthropic and OpenAI, accessed via OpenRouter, with embeddings by Voyage AI. Recording/transcription is performed by Recall.ai. See the subprocessor list for the full set."
    ]
  },
  {
    title: "8. International transfers",
    paragraphs: [
      "We are based in India and our primary data residency is Asia-Pacific (GCP asia-south1). Some subprocessors are located in the United States and other regions, so personal data may be transferred internationally.",
      "Where the GDPR/UK GDPR applies, such transfers are made under appropriate safeguards, principally the EU Standard Contractual Clauses (SCCs) - Module 2 (controller-to-processor) and Module 3 (processor-to-processor) - for transfers to US-based subprocessors, together with a Data Processing Agreement per subprocessor and supplementary measures as needed."
    ]
  },
  {
    title: "9. Retention",
    paragraphs: [
      "We retain personal data only as long as necessary for the purposes above or as required by law.",
      "When we act as a processor, deletion and return follow the customer's instructions and our DPA."
    ],
    table: {
      headers: ["Data", "Retention"],
      rows: [
        ["Meeting recordings & transcripts", "Per customer configuration; default until a deletion request or contract end + 30 days"],
        ["Ingested customer content", "For the term of the customer agreement, then deleted/returned per DPA"],
        ["Account & billing data", "Term of agreement; billing records retained 7 years (tax/accounting)"],
        ["Product analytics (PostHog)", "14 months"],
        ["Backups", "35 days"],
        ["Employee data", "Employment tenure + statutory minimum"]
      ]
    }
  },
  {
    title: "10. Cookies and analytics",
    paragraphs: [
      "We use a small number of cookies and similar technologies. Strictly-necessary cookies for authentication/session and UI state are always set. Analytics are provided by PostHog, which we operate controller-side and configure to strip IP addresses and not send user IDs, emails or stable organisation IDs.",
      "See our Cookie & Tracker Inventory for the full list and our handling of consent and the Global Privacy Control (GPC) signal."
    ]
  },
  {
    title: "11. Security",
    paragraphs: [
      "We implement technical and organisational measures appropriate to the risk, including encryption in transit and at rest, access controls and least privilege, managed infrastructure on GCP, device management for workforce endpoints, logging and monitoring. See the TOMs annex in our DPA. No method of transmission or storage is fully secure; we cannot guarantee absolute security."
    ]
  },
  {
    title: "12. Your rights",
    paragraphs: [
      "Depending on your location, you may have rights to access, correct, delete, restrict or object to processing, port your data, and withdraw consent. Under the GDPR you may also lodge a complaint with a supervisory authority. Under the India DPDP Act you have rights of access, correction, completion, erasure, grievance redressal and nomination.",
      "To exercise your rights, contact us at founders@theubik.com. Where we process your data as a processor on behalf of a customer, we will refer your request to that customer and assist them in responding.",
      "We will respond within the timeframe required by applicable law, for example within one month under the GDPR."
    ]
  },
  {
    title: "13. Children",
    paragraphs: [
      "Ubik is a business product not directed to children. We do not knowingly collect personal data from children. Under the India DPDP Act, processing of children's data requires verifiable parental consent; we do not knowingly process such data."
    ]
  },
  {
    title: "14. Changes to this notice",
    paragraphs: [
      "We may update this notice from time to time. Material changes will be communicated by email and/or in-product notice, and the version and effective date will change."
    ]
  }
];

function LegalTable({ table }: { table: NonNullable<Section["table"]> }) {
  return (
    <div className="mt-5 overflow-hidden border">
      <div className="grid gap-px bg-border">
        <div className={`hidden gap-px bg-border text-sm font-semibold md:grid ${table.headers.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {table.headers.map((header) => (
            <div key={header} className="bg-shell p-4">{header}</div>
          ))}
        </div>
        {table.rows.map((row) => (
          <div key={row.join("|")} className={`grid gap-px bg-border ${row.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {row.map((cell, index) => (
              <div key={`${cell}-${index}`} className="bg-background p-4">
                <p className="text-xs font-medium uppercase text-foreground/72 dark:text-foreground/82 md:hidden">{table.headers[index]}</p>
                <p className="mt-1 text-sm leading-6 text-foreground/72 dark:text-foreground/82 md:mt-0">{cell}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Privacy() {
  return (
    <PageShell>
      <Seo
        title="Privacy Notice | Ubik"
        description="How Ubik handles personal data across the website, app, desktop product, and customer workflows."
        canonical="https://theubik.com/legal/privacy"
      />
      <main className="container-page section-y">
        <article className="mx-auto max-w-4xl">
          <p className="text-sm font-medium text-foreground/72 dark:text-foreground/82">Version 1.0 — effective on publication</p>
          <h1 className="mt-3 text-5xl font-semibold">Privacy Notice</h1>
          <p className="mt-6 text-lg leading-8 text-foreground/72 dark:text-foreground/82">
            This notice explains how Ubik handles personal data across our website, app, desktop product, and customer workflows.
          </p>

          <div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
            {details.map(({ label, value }) => (
              <div key={label} className="bg-background p-4">
                <p className="text-xs font-medium uppercase text-foreground/72 dark:text-foreground/82">{label}</p>
                <p className="mt-2 text-sm leading-6">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-10">
            {sections.map(({ title, paragraphs, bullets, table }) => (
              <section key={title}>
                <h2 className="text-2xl font-semibold">{title}</h2>
                <div className="mt-4 grid gap-3 leading-7 text-foreground/72 dark:text-foreground/82">
                  {paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {bullets ? (
                    <ul className="grid gap-2 pl-5">
                      {bullets.map((item) => (
                        <li key={item} className="list-disc">{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {table ? <LegalTable table={table} /> : null}
              </section>
            ))}
          </div>

          <section className="mt-12 border bg-card p-5">
            <h2 className="text-2xl font-semibold">15. Contact</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-foreground/72 dark:text-foreground/82">
              <p>Solarpunk Technology - 6/A/1 Sunder Baug Towers, Makarpura Road, Opposite Hazira, Pratapnagar, Vadodara, Gujarat, India</p>
              <p>Privacy contact: founders@theubik.com</p>
              <p>India Grievance Officer (DPDP): Shubhranshu Jha, COO/CPO - founders@theubik.com</p>
              <p>EU / GDPR: Ubik is not currently targeting the EU and has not yet appointed an Article 27 representative. Full GDPR readiness, including the appointment of an Article 27 EU representative, is planned as part of a future EU expansion.</p>
              <p>Transfer safeguards (SCCs and per-subprocessor DPAs) are already in place because data flows to US-based subprocessors today.</p>
            </div>
          </section>
        </article>
      </main>
    </PageShell>
  );
}
