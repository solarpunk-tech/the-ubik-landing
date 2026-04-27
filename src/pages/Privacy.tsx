import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

const sections = [
  ["Information we collect", "Ubik collects account information, connected-service data you authorize, and limited usage data needed to operate, secure, and improve the service."],
  ["How we use information", "Ubik uses information to authenticate users, provide workbench features, respond to support requests, detect abuse, and comply with legal obligations."],
  ["Google API Services Limited Use", "Ubik uses Google user data only to provide or improve user-facing features, and follows the Google API Services User Data Policy including Limited Use requirements."],
  ["Sharing of information", "Ubik shares information only with vetted service providers, when required by law, or in a business transfer subject to this policy."],
  ["Data retention", "Ubik retains personal information while an account is active or as needed to provide the service, comply with law, or maintain backups."],
  ["Security", "Ubik uses encryption in transit, access controls, and least-privilege service credentials to protect customer information."],
  ["Your choices", "You can revoke Google or Microsoft access from account settings and request access, correction, or deletion by emailing shubhranshu@solarpunk.technology."]
];

export default function Privacy() {
  return (
    <PageShell>
      <Seo
        title="Privacy Policy — Ubik"
        description="How Ubik collects, uses, and protects customer information."
        canonical="https://theubik.com/privacy-policy"
      />
      <main className="container-page section-y">
        <article className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm text-muted-foreground">Last updated: April 21, 2026</p>
          <h1 className="text-5xl font-semibold">Privacy Policy</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            This Privacy Policy explains how Ubik, a product of Solarpunk Technology, collects, uses, shares, and protects information when you use the website and operator workbench.
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
