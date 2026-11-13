import { CookieProof } from "@/components/landing/CookieProof";
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
    name: "Language preference cookie (theubik.com)",
    provider: "Ubik (first-party)",
    purpose: "Remember the language you chose. Set only when you switch language",
    type: "Strictly necessary (preference)",
    duration: "1 year",
    personalData: "No",
    consent: "No"
  },
  {
    name: "ubik-theme (theubik.com, localStorage)",
    provider: "Ubik (first-party)",
    purpose: "Remember light or dark mode. Stays on your device",
    type: "Strictly necessary (preference)",
    duration: "Persistent",
    personalData: "No",
    consent: "No"
  },
  {
    name: "None on theubik.com (cookieless analytics)",
    provider: "PostHog",
    purpose: "Anonymous visit counts on the marketing site: no cookie or local storage; visitors are a daily-rotating hash computed by PostHog",
    type: "Analytics (cookieless)",
    duration: "Nothing stored on your device",
    personalData: "No: IP not stored, no identifier on your device",
    consent: "No (nothing is stored on or read from your device)"
  },
  {
    name: "ph_<key>_posthog (app.theubik.com, localStorage)",
    provider: "PostHog",
    purpose: "Product analytics linked to your Ubik account, and masked session replays",
    type: "Analytics",
    duration: "Until you sign out or withdraw consent",
    personalData: "Yes: pseudonymous account ID, email, name, organisation",
    consent: "Yes. Set only after you accept. Without consent the app counts usage cookielessly instead"
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
          <p className="text-sm font-medium text-muted-foreground">Version 1.0 — effective on publication</p>
          <h1 className="mt-3 text-5xl font-semibold">We don&apos;t track you on theubik.com</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            No tracking cookies, no advertising trackers and no session recordings. Below is what that looks like, then the full inventory for the marketing site and the Ubik app at app.theubik.com.
          </p>

          <CookieProof />

          <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="What we do keep or load">
            <div className="border bg-card p-5">
              <p className="text-sm font-semibold">Language choice</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">A small cookie, only if you switch language. Kept for a year so the site remembers it.</p>
            </div>
            <div className="border bg-card p-5">
              <p className="text-sm font-semibold">Light or dark</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Your theme choice, kept in your browser&apos;s local storage. It never leaves your device.</p>
            </div>
            <div className="border bg-card p-5">
              <p className="text-sm font-semibold">Company logos</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Many logos load from Google&apos;s favicon service, which receives your IP address and the page you are on.</p>
            </div>
          </section>

          <h2 className="mt-14 text-3xl font-semibold">Full inventory</h2>

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
                      <p className="text-xs font-medium text-muted-foreground lg:hidden">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground lg:mt-0">{value}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 border bg-card p-5">
            <h2 className="text-2xl font-semibold">Consent, GPC & analytics handling</h2>
            <div className="mt-4 grid gap-3 leading-7 text-muted-foreground">
              <p>Strictly-necessary cookies are set without consent because they are required to deliver the service.</p>
              <p>Analytics are provided by PostHog, which we operate as controller. It runs in three tiers:</p>
              <p><strong>Service telemetry (signed-in users, no banner):</strong> our servers record what happens in your Ubik account, such as signing in, connecting a mailbox or closing a task, linked to your account and organisation. Nothing is stored on or read from your device for this. Lawful basis: performance of our contract with your organisation and our legitimate interest in running and improving the service. To object, email founders@theubik.com.</p>
              <p><strong>Cookieless counts (theubik.com, and the app if you have not accepted):</strong> no cookie or local storage. PostHog derives a daily-rotating hash from the request so a visit can be counted, without identifying you or storing anything on your device.</p>
              <p><strong>Identified analytics and session replay (only if you accept):</strong> the app stores an analytics identifier in local storage, links your activity to your account, and records session replays with all form inputs masked.</p>
              <p>Client IP addresses are not stored. Analytics data is retained for up to 14 months; session replays for 30 days.</p>
              <p>Global Privacy Control (GPC) signals are treated as an opt-out of analytics/non-essential trackers.</p>
              <p>No advertising / cross-site tracking cookies are used. The product is not directed to children and no child-targeted tracking is used.</p>
              <p>Where PostHog uses localStorage instead of cookies, it is treated the same as a cookie: set only after consent.</p>
            </div>
          </section>
        </article>
      </main>
    </PageShell>
  );
}
