import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const companyDetails = [
  ["Provider", "Solarpunk Technology Sdn Bhd, operating as Ubik"],
  ["Tax Identification No.", "C 60510379080"],
  ["Registered address", "7-2, Plaza Danau 2, Jalan 2/109F, Taman Danau Desa, 58100 Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia"],
  ["Website", "https://theubik.com"],
  ["Contact", "founders@theubik.com"]
];

const sections: TermsSection[] = [
  {
    title: "1. Agreement",
    paragraphs: [
      "These Terms and Conditions govern access to and use of the Ubik website, products, services, documentation, and related communications provided by Solarpunk Technology Sdn Bhd, operating as Ubik.",
      "If you use Ubik on behalf of a company or other organization, you represent that you have authority to bind that organization. That organization is responsible for your use of Ubik."
    ]
  },
  {
    title: "2. Eligibility and accounts",
    paragraphs: [
      "You must be at least 16 years old, or the equivalent age defined by applicable local law, and able to form a binding contract to use Ubik.",
      "You are responsible for keeping account credentials secure, using company-approved identity providers where required, and notifying us promptly of unauthorized account use."
    ]
  },
  {
    title: "3. The service",
    paragraphs: [
      "Ubik provides an AI-assisted operating workspace for perishable trade workflows, including inbox, meetings, approvals, projects, documents, customer communications, and workflow assistance.",
      "Ubik is designed to sit above existing systems such as email, ERP, CRM, documents, chat, and logistics tools. It does not replace your systems of record unless separately agreed in writing."
    ]
  },
  {
    title: "4. Customer responsibilities",
    paragraphs: [
      "Customers are responsible for deciding which users, tools, workflows, folders, systems, data, and permissions are approved for use with Ubik.",
      "Customers are responsible for reviewing AI-assisted outputs before relying on them for sensitive business decisions, customer communications, approvals, or downstream system updates."
    ]
  },
  {
    title: "5. Customer content",
    paragraphs: [
      "You retain rights to the content, data, files, messages, prompts, outputs, and business context you submit to or connect with Ubik.",
      "You grant Ubik a limited license to process customer content only as needed to provide, secure, support, improve, and operate the services, subject to the applicable agreement and Data Processing Agreement where applicable."
    ]
  },
  {
    title: "6. AI outputs",
    paragraphs: [
      "Ubik may use AI systems to support planning, summarization, extraction, drafting, prioritization, workflow assistance, and action preparation.",
      "AI outputs may be incomplete, inaccurate, or unsuitable for a particular use. You are responsible for reviewing outputs before sending communications, approving actions, updating systems, or making business decisions.",
      "Ubik does not use customer-submitted data to train third-party foundation models unless expressly authorized by the relevant customer."
    ]
  },
  {
    title: "7. Acceptable use",
    paragraphs: ["You may not use Ubik to:"],
    bullets: [
      "Violate applicable law or third-party rights.",
      "Attempt unauthorized access to systems, data, accounts, or networks.",
      "Transmit malware, harmful code, or deceptive content.",
      "Reverse engineer, scrape, benchmark, or copy the service except where allowed by law or written agreement.",
      "Use Ubik to make fully automated high-risk decisions without appropriate human review.",
      "Misrepresent AI-generated or AI-assisted outputs as independently verified facts."
    ]
  },
  {
    title: "8. Third-party services",
    paragraphs: [
      "Google Workspace, Gmail, Microsoft 365, Slack, Zoho, OpenAI, Anthropic, ERP, CRM, cloud, and other connected services remain governed by their own terms, privacy notices, permissions, and account controls.",
      "Customers are responsible for maintaining required rights, licenses, consents, and admin approvals for third-party services connected to Ubik."
    ]
  },
  {
    title: "9. Fees and payment",
    paragraphs: [
      "Ubik may be offered on a free, trial, pilot, or paid basis. Fees, billing periods, taxes, renewal terms, and payment terms are presented in an order form, subscription flow, invoice, or separate agreement.",
      "Unless otherwise stated in writing, paid fees are non-refundable except where required by law."
    ]
  },
  {
    title: "10. Suspension and termination",
    paragraphs: [
      "You may stop using Ubik at any time. Ubik may suspend or terminate access if required by law, if use creates security or operational risk, if fees are unpaid, or if these Terms or another applicable agreement are violated.",
      "Upon termination, customer data handling, return, deletion, and retention will follow the applicable agreement, Data Processing Agreement, and legal requirements."
    ]
  },
  {
    title: "11. Confidentiality",
    paragraphs: [
      "Each party may receive confidential business, technical, financial, operational, or security information from the other party. Each party must protect confidential information using reasonable care and use it only for the relationship between the parties.",
      "Confidentiality obligations do not apply to information that is public through no fault of the receiving party, independently developed, rightfully received from a third party, or required to be disclosed by law."
    ]
  },
  {
    title: "12. Privacy and data processing",
    paragraphs: [
      "Our Privacy Notice explains how we handle personal information on the public website and related communications.",
      "For customer-submitted data processed through Ubik products and services, Ubik usually acts as a processor or service provider, and the customer acts as controller or business. Processing will follow the applicable agreement and Data Processing Agreement."
    ]
  },
  {
    title: "13. Security and compliance",
    paragraphs: [
      "Ubik maintains administrative, technical, and physical safeguards designed to protect customer information. Security features may include encryption in transit and at rest, access controls, logging, monitoring, vulnerability management, security reviews, incident response procedures, data residency options where applicable, audit logging for product activity, and SSO support where applicable.",
      "A SOC 2 Type II report is not currently available while the audit is being completed. When available, security reports or compliance materials may be shared under NDA upon request at founders@theubik.com."
    ]
  },
  {
    title: "14. Disclaimers",
    paragraphs: [
      "Except as expressly stated in a written agreement, Ubik is provided on an as-is and as-available basis. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.",
      "Ubik is not legal, tax, accounting, financial, logistics, food-safety, or customs advice. You remain responsible for professional review and business decisions."
    ]
  },
  {
    title: "15. Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, Ubik and Solarpunk Technology Sdn Bhd will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost revenue, lost data, business interruption, or loss of goodwill.",
      "To the maximum extent permitted by law, our total liability for claims relating to the services will not exceed the amounts paid to Ubik for the services giving rise to the claim during the 12 months before the event giving rise to liability, unless a separate signed agreement states otherwise."
    ]
  },
  {
    title: "16. Indemnity",
    paragraphs: [
      "You will defend and indemnify Ubik and Solarpunk Technology Sdn Bhd from claims, damages, liabilities, costs, and expenses arising from your misuse of the services, violation of these Terms, violation of law, or customer content provided to or connected with Ubik, except to the extent caused by Ubik's breach of these Terms."
    ]
  },
  {
    title: "17. Changes",
    paragraphs: [
      "We may update these Terms from time to time. When we make changes, we will post the updated version on this page and update the effective date. If changes are material, we will provide notice by reasonable means, such as website notice, email, or product notice where appropriate."
    ]
  },
  {
    title: "18. Governing law",
    paragraphs: [
      "These Terms are governed by the laws of Malaysia, without regard to conflict-of-law rules. Courts located in Kuala Lumpur, Malaysia will have jurisdiction unless a separate signed agreement states otherwise."
    ]
  }
];

export default function Terms() {
  return (
    <PageShell>
      <Seo
        title="Terms and Conditions — Ubik"
        description="The terms governing access to and use of Ubik."
        canonical="https://theubik.com/terms-of-service"
      />
      <main className="container-page section-y">
        <article className="mx-auto max-w-4xl">
          <p className="text-sm font-medium text-muted-foreground">Effective date: 2026-05-05</p>
          <h1 className="mt-3 text-5xl font-semibold">Terms and Conditions</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            These Terms govern access to and use of Ubik, provided by Solarpunk Technology Sdn Bhd, operating as Ubik.
          </p>

          <div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
            {companyDetails.map(([label, value], index) => {
              const spanLast = companyDetails.length % 2 === 1 && index === companyDetails.length - 1;
              return (
                <div key={label} className={`bg-background p-4 ${spanLast ? "sm:col-span-2" : ""}`}>
                  <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
                  <p className="mt-2 text-sm leading-6">{value}</p>
                </div>
              );
            })}
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
            <h2 className="text-2xl font-semibold">19. Contact</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground">
              <p>Solarpunk Technology Sdn Bhd, operating as Ubik</p>
              <p>Tax Identification No.: C 60510379080</p>
              <p>Registered address: 7-2, Plaza Danau 2, Jalan 2/109F, Taman Danau Desa, 58100 Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia</p>
              <p>Website: https://theubik.com</p>
              <p>Contact: founders@theubik.com</p>
            </div>
          </section>
        </article>
      </main>
    </PageShell>
  );
}
