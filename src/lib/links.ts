export const externalLinks = {
  app: "https://app.theubik.com",
  docs: "https://docs.theubik.com",
  founderMeeting: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2GuRhVfhJ65L00sBZhWPLVkabehUda7Wdxw_Y_9F-TkIDBU0GMQK9suJVV_YaZtmgPliXiw7WI",
  // The same booking page in Google's embeddable form, for the inline calendar on /demo.
  founderMeetingEmbed: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2GuRhVfhJ65L00sBZhWPLVkabehUda7Wdxw_Y_9F-TkIDBU0GMQK9suJVV_YaZtmgPliXiw7WI?gv=true",
  trustCenter: "https://security.trycomp.ai/?organizationId=org_6942f5b5ad9fe5d196af748b",
  trustCenterOverviewApi: "https://api.trycomp.ai/v1/trust-access/solarpunk-technology/overview",
  trustCenterVendorsApi: "https://api.trycomp.ai/v1/trust-access/solarpunk-technology/vendors"
};

const TAURI_BASE = "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/tauri";

// Updater manifest for the current Tauri build. Only its top-level `version`
// is used (for the label); its `platforms.*.url` are updater archives, not
// installers, so they are never linked.
export const DOWNLOAD_MANIFEST_URL = `${TAURI_BASE}/latest.json`;

// Stable aliases the release workflow overwrites on every release. These are
// the installer links; they never depend on the manifest fetch succeeding.
export const downloads = {
  mac: `${TAURI_BASE}/Ubik-universal.dmg`,
  windows: `${TAURI_BASE}/Ubik-Setup.exe`,
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
  // Label the site only when the visitor brought no source of their own;
  // mixing our medium into their campaign would misattribute it.
  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", "theubik.com");
    url.searchParams.set("utm_medium", "website");
  }
  url.searchParams.set("utm_content", cta);
  url.searchParams.set("lp", window.location.pathname);
  return url.toString();
}
