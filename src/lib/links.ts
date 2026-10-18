export const externalLinks = {
  app: "https://app.theubik.com",
  docs: "https://docs.theubik.com",
  founderMeeting: "https://calendar.app.google/frJjo2U6qdBdgZ1w9",
  trustCenter: "https://security.trycomp.ai/?organizationId=org_6942f5b5ad9fe5d196af748b",
  trustCenterOverviewApi: "https://api.trycomp.ai/v1/trust-access/solarpunk-technology/overview",
  trustCenterVendorsApi: "https://api.trycomp.ai/v1/trust-access/solarpunk-technology/vendors"
};

// Fetched at runtime by useDownloadLinks() — no-cache so every page load
// picks up the latest production release automatically.
export const DOWNLOAD_MANIFEST_URL =
  "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/latest.json";

// Shown while the manifest is loading or if the fetch fails.
export const downloadsFallback = {
  version: "",
  mac_arm64: "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-arm64.dmg",
  mac_x64:   "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-x64.dmg",
  windows:   "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-Setup.exe",
};

/**
 * A link into the app that carries where the visitor came from, so a signup
 * can be attributed without a cookie: the app forwards these params to the
 * auth service, which records them on the server-side `signup_completed`.
 * The visitor's own UTMs (from an ad, a LinkedIn post) win; otherwise the
 * site labels itself. `lp` is the page the CTA was clicked on.
 */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term"] as const;

export function appLink(cta: string): string {
  const url = new URL(externalLinks.app);
  if (typeof window === "undefined") return url.toString();
  const incoming = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const v = incoming.get(key);
    if (v) url.searchParams.set(key, v.slice(0, 200));
  }
  if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", "theubik.com");
  if (!url.searchParams.has("utm_medium")) url.searchParams.set("utm_medium", "website");
  url.searchParams.set("utm_content", cta);
  url.searchParams.set("lp", window.location.pathname);
  return url.toString();
}
