import posthog from "posthog-js";

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const host = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://us.i.posthog.com";
// O-36b: site errors to PostHog error tracking. Off unless the Netlify build sets
// VITE_POSTHOG_ERRORS=on (lands dark; turn it on for a preview deploy first).
const errorsOn = (import.meta.env.VITE_POSTHOG_ERRORS as string | undefined)?.trim().toLowerCase() === "on";

// Visiting any page with ?ph-test-error throws one error after load, so a
// deploy can be checked end to end ("a forced error appears in PostHog with
// its page"). Only while error capture is on; otherwise it does nothing.
const TEST_ERROR_PARAM = "ph-test-error";

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
    // Exceptions ride the same cookieless identity: nothing is stored on the
    // device for them either.
    cookieless_mode: "always",
    disable_session_recording: true,
    // Uncaught errors and unhandled promise rejections only. Console errors
    // stay out: third-party embeds log noise there that is not ours to fix.
    capture_exceptions: errorsOn
      ? { capture_unhandled_errors: true, capture_unhandled_rejections: true, capture_console_errors: false }
      : false,
  });
  posthog.register({ surface: "website" });
  if (errorsOn) scheduleTestError();
}

function scheduleTestError() {
  if (typeof window === "undefined") return;
  try {
    if (!new URLSearchParams(window.location.search).has(TEST_ERROR_PARAM)) return;
  } catch {
    return;
  }
  window.setTimeout(() => {
    throw new Error(`Test error from ?${TEST_ERROR_PARAM} on ${window.location.pathname}`);
  }, 1500);
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!key) return;
  posthog.capture(event, properties);
}

// A handled failure worth seeing in error tracking (a caught fetch, say).
// Properties carry ids and statuses only, never what a visitor typed.
export function captureError(error: unknown, properties?: Record<string, unknown>) {
  if (!key || !errorsOn) return;
  posthog.captureException(error, properties);
}
