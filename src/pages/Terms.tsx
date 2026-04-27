import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

const sections = [
  ["Eligibility and accounts", "You must be at least 16 years old and able to form a binding contract to use Ubik."],
  ["The Service", "Ubik provides an AI-powered operator workbench for inbox, meetings, approvals, projects, and workflows."],
  ["Your content", "You retain rights to your content and grant Ubik a limited license to process it solely to provide the service."],
  ["Acceptable use", "You may not violate laws, infringe rights, attempt unauthorized access, transmit malware, or reverse engineer the service except where allowed by law."],
  ["Third-party services", "Google Workspace, Microsoft 365, and other connected services remain governed by their own terms and privacy policies."],
  ["Fees", "The service may be offered on a free or paid basis. Paid terms are presented at purchase."],
  ["Termination", "You may stop using the service at any time. Ubik may suspend access for violations or legal requirements."],
  ["Governing law", "These terms are governed by the laws of India, with disputes resolved in Bengaluru, Karnataka, India."]
];

export default function Terms() {
  return (
    <PageShell>
      <Seo
        title="Terms of Service — Ubik"
        description="The terms governing use of Ubik."
        canonical="https://theubik.com/terms-of-service"
      />
      <main className="container-page section-y">
        <article className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm text-muted-foreground">Last updated: April 21, 2026</p>
          <h1 className="text-5xl font-semibold">Terms of Service</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            These Terms govern access to and use of the Ubik website and operator workbench, provided by Solarpunk Technology.
          </p>
          <div className="mt-10 flex flex-col gap-8">
            {sections.map(([title, copy]) => (
              <section key={title}>
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{copy}</p>
              </section>
            ))}
          </div>
        </article>
      </main>
    </PageShell>
  );
}
