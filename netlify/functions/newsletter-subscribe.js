import { randomUUID } from "node:crypto";

const LOOPS_CONTACTS_UPDATE_URL = "https://app.loops.so/api/v1/contacts/update";

// O-36b: one JSON line per call, with a request id, so a failed signup can be
// found in the Netlify function log from the id the visitor sees. The line
// never carries the email address or anything else the visitor typed.
function requestIdFor(event) {
  const headers = event.headers || {};
  const fromNetlify = headers["x-nf-request-id"] || headers["X-Nf-Request-Id"];
  if (typeof fromNetlify === "string" && /^[A-Za-z0-9_-]{6,128}$/.test(fromNetlify)) return fromNetlify;
  return randomUUID();
}

function logLine(fields) {
  try {
    console.log(JSON.stringify({ event: "newsletter.subscribe", ts: new Date().toISOString(), ...fields }));
  } catch {
    // Logging must never break the signup.
  }
}

export async function handler(event) {
  const requestId = requestIdFor(event);
  const started = Date.now();

  function json(statusCode, body, extra = {}) {
    const failed = statusCode >= 400;
    logLine({
      request_id: requestId,
      status: statusCode,
      outcome: extra.outcome || (failed ? "error" : "subscribed"),
      mode: extra.mode,
      loops_status: extra.loopsStatus,
      duration_ms: Date.now() - started,
      ...(statusCode >= 500 ? { severity: "ERROR" } : failed ? { severity: "WARNING" } : {}),
    });
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": requestId,
      },
      // The id goes back on failure only: it is what a visitor quotes when they write in.
      body: JSON.stringify(failed ? { ...body, request_id: requestId } : body),
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { message: "Method not allowed" }, { outcome: "method_not_allowed" });
  }

  const apiKey = process.env.LOOPS_API_KEY;
  const formEndpoint = process.env.LOOPS_FORM_ENDPOINT;
  const newsletterListId = process.env.LOOPS_NEWSLETTER_LIST_ID;

  if (!apiKey && !formEndpoint) {
    return json(503, { message: "Newsletter signup is not configured yet." }, { outcome: "unconfigured" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { message: "Invalid request body." }, { outcome: "bad_body" });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return json(400, { message: "Enter a valid email address." }, { outcome: "invalid_email" });
  }

  const source = typeof payload.source === "string" && payload.source.length < 120
    ? payload.source
    : "theubik.com/blog";

  const mode = formEndpoint ? "form" : "api";
  let response;
  try {
    if (formEndpoint) {
      const formPayload = new URLSearchParams({
        email,
        source,
        userGroup: "Trade Notes",
      });

      if (newsletterListId) {
        formPayload.set("mailingLists", newsletterListId);
      }

      response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formPayload,
      });
    } else {
      const loopsPayload = {
        email,
        source,
        userGroup: "Trade Notes",
      };

      if (newsletterListId) {
        loopsPayload.mailingLists = {
          [newsletterListId]: true,
        };
      }

      response = await fetch(LOOPS_CONTACTS_UPDATE_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loopsPayload),
      });
    }
  } catch {
    // Loops unreachable (DNS, timeout). Before O-36b this was an unhandled
    // rejection and Netlify answered with its own 502 and no id.
    return json(502, { message: "Could not subscribe this email right now." }, { outcome: "loops_unreachable", mode });
  }

  if (!response.ok) {
    let message = "Could not subscribe this email right now.";
    try {
      const error = await response.json();
      if (typeof error.message === "string") message = error.message;
    } catch {
      // Keep the generic message when Loops returns a non-JSON error.
    }

    return json(response.status >= 500 ? 502 : 400, { message }, {
      outcome: "loops_rejected",
      mode,
      loopsStatus: response.status,
    });
  }

  return json(200, { message: "You are subscribed." }, { mode, loopsStatus: response.status });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
