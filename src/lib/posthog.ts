import posthog from "posthog-js";

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const host = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://us.i.posthog.com";

export function initPostHog() {
  if (!key) return;
  posthog.init(key, {
    api_host: host,
    autocapture: false,
    capture_pageview: false,
    person_profiles: "identified_only",
    // Cookieless, with no banner: PostHog sets no cookie and writes no
    // local/session storage. A visitor is a daily-rotating hash computed on
    // PostHog's servers, so pages within a visit join up (the old
    // persistence:"memory" minted a new ID on every page load, so no visit
    // could be followed past its first page). Needs "Cookieless server hash
    // mode" on in project settings — it is; without it events are dropped.
    cookieless_mode: "always",
    disable_session_recording: true,
  });
  posthog.register({ surface: "website" });
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!key) return;
  posthog.capture(event, properties);
}
