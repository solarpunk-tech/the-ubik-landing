import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const companyDetails = [
  ["Controller", "Solarpunk Technology Sdn Bhd, operating as Ubik"],
  ["Tax Identification No.", "C 60510379080"],
  ["Registered address", "7-2, Plaza Danau 2, Jalan 2/109F, Taman Danau Desa, 58100 Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia"],
  ["Website", "https://theubik.com"],
  ["Contact", "founders@theubik.com"],
  ["Founders", "Hemanth Rao Thimmasarthi, Shubhranshu Jha, and Sai Kiran Mudulkar"]
];

const sections: LegalSection[] = [
  {
    title: "1. Scope",
    paragraphs: [
      "This Privacy Notice explains how Ubik collects, uses, discloses, and safeguards personal information when you visit theubik.com, contact us, receive our marketing or support communications, or otherwise interact with our public website.",
      "For data we process on behalf of our B2B customers through Ubik products and services, we usually act as a processor or service provider. Our customers are the controllers or businesses responsible for that data. This Privacy Notice does not govern customer-submitted data inside the Ubik workspace or services. For requests related to that customer data, please contact the relevant customer directly."
    ]
  },
  {
    title: "2. Information we collect",
    paragraphs: [
      "Information you provide to us may include name, work email, company name, role, business contact details, demo, sales, support, partnership, or investor inquiries, event or newsletter preferences, and messages, attachments, or other content you submit through forms or email.",
      "We do not use tracking cookies, web beacons, pixels, or similar advertising tracking technologies on theubik.com. We may use strictly necessary browser storage for user preferences such as language and theme.",
      "We may collect limited technical information through server logs and security systems to operate, secure, troubleshoot, and improve the website.",
      "We may receive limited business contact or company information from lawful third-party sources, such as business contact enrichment providers, anti-fraud providers, public company sources, or event partners, where permitted by applicable law."
    ],
    bullets: [
      "IP address",
      "Browser type and device information",
      "Pages viewed",
      "Timestamps",
      "Referrer URLs",
      "Basic diagnostic and security event data"
    ]
  },
  {
    title: "3. How we use information and lawful bases",
    paragraphs: [
      "We use personal information to provide, operate, and improve the website and services; communicate with you and respond to inquiries; manage sales, demos, partnerships, investor conversations, support, and events; protect security; prevent fraud; troubleshoot issues; maintain reliability; send marketing or event communications where permitted; comply with laws; enforce terms; and defend legal claims.",
      "Lawful bases may include contract, legitimate interests, consent where required, and legal obligations. You can opt out of marketing communications at any time by contacting founders@theubik.com."
    ]
  },
  {
    title: "4. When we act as processor",
    paragraphs: [
      "For customer-submitted data processed through Ubik products and services, we process personal information only on documented customer instructions, under the applicable agreement and Data Processing Agreement.",
      "When acting as processor, we assist customers with security, data-subject requests, deletion, return of data, subprocessors, audits, and compliance obligations as described in the applicable DPA.",
      "If you send us a request relating to customer data where Ubik is the processor, we will direct or route the request to the relevant customer where possible."
    ]
  },
  {
    title: "5. Sharing and disclosure",
    paragraphs: [
      "We may share personal information with service providers and subprocessors for cloud hosting, infrastructure, communications, customer support, security, privacy-preserving analytics without advertising cookies, logging, professional services, and operational tooling.",
      "Current subprocessors include Aurinko; Google Workspace/Gmail; Microsoft; PostHog; Sentry; Slack; Zoho; OpenAI; Anthropic; and our hosting, infrastructure, API, and database providers as applicable. A formal subprocessor page is currently TBD.",
      "We may also share information with affiliates or in connection with a merger, acquisition, financing, restructuring, sale of assets, or similar corporate transaction; when required to comply with law, enforce agreements, respond to lawful requests, protect rights, prevent fraud, or protect safety and security; or where you direct us to do so or provide consent.",
      "We require service providers and subprocessors to protect personal information using appropriate confidentiality, security, and data protection measures."
    ]
  },
  {
    title: "6. International transfers",
    paragraphs: [
      "We may transfer personal information to countries outside your country of residence, including India, Malaysia, the United States, the European Union, and other regions where Ubik, our team, customers, or providers operate.",
      "Where required by law, we use appropriate safeguards for international transfers, such as the EU Standard Contractual Clauses, the UK International Data Transfer Addendum or IDTA, and transfer risk assessments."
    ]
  },
  {
    title: "7. Security",
    paragraphs: [
      "Ubik maintains administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, loss, misuse, alteration, and disclosure.",
      "Ubik's product and infrastructure are designed for business customers that handle operationally sensitive information, including trade workflows, customer communications, documents, meetings, inboxes, and business context.",
      "A SOC 2 Type II report is not currently available while the audit is being completed. When available, security reports or compliance materials may be shared under NDA upon request at founders@theubik.com."
    ],
    bullets: [
      "Encryption in transit and at rest",
      "Access controls and role-based permissions",
      "Logging and monitoring",
      "Vulnerability management",
      "Security reviews",
      "Incident response procedures",
      "Data residency options, where applicable",
      "Audit logging for product activity",
      "SSO support, where applicable"
    ]
  },
  {
    title: "8. Use of large language models and AI systems",
    paragraphs: [
      "Where Ubik uses large language models or AI systems, including OpenAI and Anthropic APIs, we apply data minimization, access controls, and customer-specific safeguards.",
      "For customer environments, Ubik is designed to use AI systems where needed to support planning, summarization, workflow assistance, and action steps, subject to applicable customer agreements and configuration.",
      "We do not use customer-submitted data to train third-party foundation models unless expressly authorized by the relevant customer."
    ]
  },
  {
    title: "9. Retention",
    paragraphs: [
      "We retain personal information only for as long as necessary for the purposes described in this Privacy Notice or as required by law.",
      "Typical retention periods are draft and subject to final approval: website inquiries and support records are TBD, with proposed retention of 24 months after last interaction unless longer retention is required for legal, security, or business purposes; marketing contact records are retained until opt-out, deletion request, or inactivity-based deletion under our retention policy; server logs are TBD, with proposed retention of 30-90 days; security and audit logs are TBD, with proposed retention of 12 months; contract and business records are TBD, with proposed retention of 7 years after contract termination or as required by law; and legal, tax, compliance, and audit records are retained as required by applicable law.",
      "After the relevant retention period, we delete, anonymize, or de-identify personal information unless we are legally required to retain it."
    ]
  },
  {
    title: "10. Your privacy rights",
    paragraphs: [
      "Depending on your location, you may have rights to access personal information, correct inaccurate personal information, delete personal information, restrict or object to processing, receive a portable copy of your information, withdraw consent, opt out of marketing communications, and lodge a complaint with a data protection authority.",
      "To exercise your rights, email founders@theubik.com. We may verify your identity before responding. We will respond within applicable legal timelines.",
      "For data where Ubik acts as processor, please contact the relevant customer directly. If you contact us, we will route the request where possible."
    ]
  },
  {
    title: "11. Cookies and similar technologies",
    paragraphs: [
      "We do not use tracking cookies, web beacons, pixels, or similar advertising tracking technologies on theubik.com.",
      "The website may use strictly necessary browser storage for user preferences such as language and theme. If our tracking or analytics practices change, we will update this Privacy Notice and, where required, provide appropriate notice or consent mechanisms.",
      "If you navigate from theubik.com to third-party websites, their own privacy, cookie, and tracking practices apply."
    ]
  },
  {
    title: "12. Children's privacy",
    paragraphs: [
      "Our website and services are not directed to children under 16, or the equivalent age defined by applicable local law.",
      "We do not knowingly collect personal information from children. If you believe a child has provided personal information to us, contact founders@theubik.com and we will take appropriate steps to delete it."
    ]
  },
  {
    title: "13. Changes to this Privacy Notice",
    paragraphs: [
      "We may update this Privacy Notice from time to time.",
      "When we make changes, we will post the updated version on this page and update the effective date. If changes are material, we will provide notice by reasonable means, such as website notice, email, or product notice where appropriate."
    ]
  }
];

export default function Privacy() {
  return (
    <PageShell>
      <Seo
        title="Privacy Notice — Ubik"
        description="How Ubik collects, uses, discloses, and safeguards personal information."
        canonical="https://theubik.com/privacy-policy"
      />
      <main className="container-page section-y">
        <article className="mx-auto max-w-4xl">
          <p className="text-sm font-medium text-muted-foreground">Effective date: 2026-05-05</p>
          <h1 className="mt-3 text-5xl font-semibold">Privacy Notice</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            This Privacy Notice explains how Solarpunk Technology Sdn Bhd, operating as Ubik, handles personal information on our public website and in related communications.
          </p>

          <div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
            {companyDetails.map(([label, value]) => (
              <div key={label} className="bg-background p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
                <p className="mt-2 text-sm leading-6">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-10">
            {sections.map(({ title, paragraphs, bullets }) => (
              <section key={title}>
                <h2 className="text-2xl font-semibold">{title}</h2>
                <div className="mt-4 grid gap-3 leading-7 text-muted-foreground">
                  {paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {bullets ? (
                    <ul className="grid gap-2 pl-5">
                      {bullets.map((item) => (
                        <li key={item} className="list-disc">{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12 border bg-card p-5">
            <h2 className="text-2xl font-semibold">14. Contact us</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground">
              <p>Controller: Solarpunk Technology Sdn Bhd, operating as Ubik</p>
              <p>Tax Identification No.: C 60510379080</p>
              <p>Registered address: 7-2, Plaza Danau 2, Jalan 2/109F, Taman Danau Desa, 58100 Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia</p>
              <p>Website: https://theubik.com</p>
              <p>Privacy contact: founders@theubik.com</p>
              <p>Security and compliance requests: founders@theubik.com</p>
              <p>EU/UK representative: not appointed unless legally required</p>
              <p>Data Protection Officer: not appointed unless legally required</p>
            </div>
          </section>
        </article>
      </main>
    </PageShell>
  );
}
