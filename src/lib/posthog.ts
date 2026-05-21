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
    // Cookieless — /try collects email so we avoid persisting anything
    persistence: "memory",
    disable_session_recording: true,
  });
  posthog.register({ surface: "website" });
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!key) return;
  posthog.capture(event, properties);
}
