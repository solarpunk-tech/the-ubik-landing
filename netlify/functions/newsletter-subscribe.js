const LOOPS_CONTACTS_UPDATE_URL = "https://app.loops.so/api/v1/contacts/update";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { message: "Method not allowed" });
  }

  const apiKey = process.env.LOOPS_API_KEY;
  const formEndpoint = process.env.LOOPS_FORM_ENDPOINT;
  const newsletterListId = process.env.LOOPS_NEWSLETTER_LIST_ID;

  if (!apiKey && !formEndpoint) {
    return json(503, { message: "Newsletter signup is not configured yet." });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { message: "Invalid request body." });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return json(400, { message: "Enter a valid email address." });
  }

  const source = typeof payload.source === "string" && payload.source.length < 120
    ? payload.source
    : "theubik.com/blog";

  if (formEndpoint) {
    const formPayload = new URLSearchParams({
      email,
      source,
      userGroup: "Trade Notes",
    });

    if (newsletterListId) {
      formPayload.set("mailingLists", newsletterListId);
    }

    const response = await fetch(formEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formPayload,
    });

    if (!response.ok) {
      let message = "Could not subscribe this email right now.";
      try {
        const error = await response.json();
        if (typeof error.message === "string") message = error.message;
      } catch {
        // Keep the generic message when Loops returns a non-JSON error.
      }

      return json(response.status >= 500 ? 502 : 400, { message });
    }

    return json(200, { message: "You are subscribed." });
  }

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

  const response = await fetch(LOOPS_CONTACTS_UPDATE_URL, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loopsPayload),
  });

  if (!response.ok) {
    let message = "Could not subscribe this email right now.";
    try {
      const error = await response.json();
      if (typeof error.message === "string") message = error.message;
    } catch {
      // Keep the generic message when Loops returns a non-JSON error.
    }

    return json(response.status >= 500 ? 502 : 400, { message });
  }

  return json(200, { message: "You are subscribed." });
}
