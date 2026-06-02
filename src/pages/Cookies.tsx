import { PageShell } from "@/components/landing/PageShell";
import { Seo } from "@/components/seo/Seo";

// Public legal copy mapped from compliance/privacy/cookie-inventory.md.
type CookieRow = {
  name: string;
  provider: string;
  purpose: string;
  type: string;
  duration: string;
  personalData: string;
  consent: string;
};

const cookies: CookieRow[] = [
  {
    name: "Session / auth token (e.g., __session)",
    provider: "Ubik (first-party)",
    purpose: "Maintain authenticated session",
    type: "Strictly necessary",
    duration: "Session",
    personalData: "Yes (session ID)",
    consent: "No"
  },
  {
    name: "Auth refresh / OAuth state",
    provider: "Google Workspace / Microsoft (via app)",
    purpose: "Sign-in via OAuth, CSRF protection",
    type: "Strictly necessary",
    duration: "Session",
    personalData: "Yes (auth state)",
    consent: "No"
  },
  {
    name: "Sidebar / UI state (e.g., sidebar_state)",
    provider: "Ubik (first-party)",
    purpose: "Remember sidebar expanded/collapsed and UI prefs",
    type: "Strictly necessary (preference)",
    duration: "Persistent",
    personalData: "No",
    consent: "No"
  },
  {
    name: "CSRF / security token",
    provider: "Ubik (first-party)",
    purpose: "Request forgery protection",
    type: "Strictly necessary",
    duration: "Session",
    personalData: "No (token)",
    consent: "No"
  },
  {
    name: "ph_* / PostHog cookies (e.g., ph_<key>_posthog)",
    provider: "PostHog",
    purpose: "Product/usage analytics (controller-side)",
    type: "Analytics",
    duration: "Up to 14 months",
    personalData: "De-identified: IP stripped, no user/email/stable org ID",
    consent: "Yes, where required by ePrivacy/local law"
  },
  {
    name: "Cookie-consent preference",
    provider: "Ubik (first-party)",
    purpose: "Store the visitor's consent choice",
    type: "Strictly necessary",
    duration: "Persistent",
    personalData: "No",
    consent: "No"
  }
];

export default function Cookies() {
  return (
    <PageShell>
      <Seo
        title="Cookie & Tracker Inventory | Ubik"
        description="Cookies and similar technologies used across Ubik web properties."
        canonical="https://theubik.com/legal/cookies"
      />
      <main className="container-page section-y">
        <article className="mx-auto max-w-6xl">
          <p className="text-sm font-medium text-foreground/72 dark:text-foreground/82">Version 1.0 — effective on publication</p>
          <h1 className="mt-3 text-5xl font-semibold">Cookie & Tracker Inventory</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/72 dark:text-foreground/82">
            This inventory covers the Ubik web app at app.theubik.com and the marketing site at theubik.com.
          </p>

          <section className="mt-10 overflow-hidden border">
            <div className="grid gap-px bg-border">
              <div className="hidden grid-cols-[1.1fr_0.9fr_1.2fr_0.8fr_0.8fr_1.1fr_1fr] gap-px bg-border text-sm font-semibold lg:grid">
                {["Name", "Provider", "Purpose", "Type", "Duration", "Personal data?", "Consent required?"].map((header) => (
                  <div key={header} className="bg-shell p-4">{header}</div>
                ))}
              </div>
              {cookies.map((item) => (
                <div key={item.name} className="grid gap-px bg-border lg:grid-cols-[1.1fr_0.9fr_1.2fr_0.8fr_0.8fr_1.1fr_1fr]">
                  {[
                    ["Name", item.name],
                    ["Provider", item.provider],
                    ["Purpose", item.purpose],
                    ["Type", item.type],
                    ["Duration", item.duration],
                    ["Personal data?", item.personalData],
                    ["Consent required?", item.consent]
                  ].map(([label, value]) => (
                    <div key={`${item.name}-${label}`} className="bg-background p-4">
                      <p className="text-xs font-medium uppercase text-foreground/72 dark:text-foreground/82 lg:hidden">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-foreground/72 dark:text-foreground/82 lg:mt-0">{value}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 border bg-card p-5">
            <h2 className="text-2xl font-semibold">Consent, GPC & analytics handling</h2>
            <div className="mt-4 grid gap-3 leading-7 text-foreground/72 dark:text-foreground/82">
              <p>Strictly-necessary cookies are set without consent because they are required to deliver the service.</p>
              <p>Analytics (PostHog) is operated controller-side and configured to strip IP addresses and to not capture user IDs, emails or stable organisation IDs, with rotated anonymous IDs. Analytics data is retained for up to 14 months. This control configuration is being verified during web-hardening.</p>
              <p>Even where analytics data is de-identified, setting analytics cookies or localStorage may require prior consent under the ePrivacy Directive in the EU/UK. Where required, analytics cookies are set only after consent.</p>
              <p>Global Privacy Control (GPC) signals are treated as an opt-out of analytics/non-essential trackers.</p>
              <p>No advertising / cross-site tracking cookies are used. The product is not directed to children and no child-targeted tracking is used.</p>
              <p>PostHog uses cookies and/or localStorage. Where localStorage is used instead of cookies, it remains in-scope for consent and transparency and is treated the same as the analytics cookies above.</p>
            </div>
          </section>
        </article>
      </main>
    </PageShell>
  );
}
