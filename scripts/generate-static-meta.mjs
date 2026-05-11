import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const baseUrl = "https://theubik.com";

const routes = [
  {
    path: "/",
    title: "Ubik - Personalised Workspace for Perishable Trade",
    description: "AI workflows for perishable trade teams moving RFQs, POs, inventory, approvals, and customer updates across existing systems.",
    image: `${baseUrl}/social/home.png`,
    type: "website"
  },
  {
    path: "/how-it-works",
    title: "How Ubik works - Real product journeys",
    description: "See how Ubik turns inbox, meetings, trade memory, and VMI exceptions into reviewed operator actions.",
    image: `${baseUrl}/social/how-it-works.png`,
    type: "website"
  },
  {
    path: "/pricing",
    title: "Pricing - Ubik",
    description: "Choose a personal AI workspace or an enterprise workflow layer for perishable trade teams.",
    image: `${baseUrl}/social/pricing.png`,
    type: "website"
  },
  {
    path: "/download",
    title: "Download Ubik Local",
    description: "Install Ubik Local for meeting capture today and a private desktop bridge for trade workflows next.",
    image: `${baseUrl}/social/ubik-local.png`,
    type: "website"
  },
  {
    path: "/try",
    title: "Try Ubik Now - Ubik",
    description: "Start one reviewed Ubik workflow across inbox, ERP, CRM, documents, and sales operations.",
    image: `${baseUrl}/social/try-ubik.png`,
    type: "website"
  },
  {
    path: "/security",
    title: "Ubik Security Note for Seafood Operators",
    description: "Security posture for trade teams: approved tools, reviewed actions, admin control, and no model training on customer data.",
    image: `${baseUrl}/social/security.png`,
    type: "website"
  },
  {
    path: "/blog",
    title: "Ubik Trade Notes",
    description: "Buyer strategy notes on perishable operations, shrimp sourcing, reviewed automation, and trade workflows.",
    image: `${baseUrl}/social/trade-notes.png`,
    type: "website"
  },
  {
    path: "/blog/origin-roulette-2026-shrimp-sourcing",
    title: "Origin Roulette 2026: Shrimp sourcing strategy by origin - Ubik Trade Notes",
    description: "Shrimp sourcing strategy for 2026 buyers across Ecuador, India, Vietnam, Indonesia, tariffs, compliance, and forward-book risk.",
    image: `${baseUrl}/social/origin-roulette.png`,
    type: "article"
  },
  {
    path: "/privacy-policy",
    title: "Privacy Notice - Ubik",
    description: "How Ubik collects, uses, discloses, and safeguards personal information.",
    image: `${baseUrl}/social/privacy.png`,
    type: "website"
  },
  {
    path: "/terms-of-service",
    title: "Terms and Conditions - Ubik",
    description: "The terms governing access to and use of Ubik.",
    image: `${baseUrl}/social/terms.png`,
    type: "website"
  }
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function upsertMeta(html, selector, replacement) {
  const [kind, key] = selector;
  const attr = kind === "name" ? "name" : "property";
  const pattern = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`);
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function applyRouteMeta(template, route) {
  const canonical = `${baseUrl}${route.path === "/" ? "/" : route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const image = escapeHtml(route.image);
  const url = escapeHtml(canonical);

  let html = template.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = upsertMeta(html, ["name", "description"], `<meta name="description" content="${description}" />`);
  html = upsertMeta(html, ["property", "og:title"], `<meta property="og:title" content="${title}" />`);
  html = upsertMeta(html, ["property", "og:description"], `<meta property="og:description" content="${description}" />`);
  html = upsertMeta(html, ["property", "og:image"], `<meta property="og:image" content="${image}" />`);
  html = upsertMeta(html, ["property", "og:url"], `<meta property="og:url" content="${url}" />`);
  html = upsertMeta(html, ["property", "og:type"], `<meta property="og:type" content="${route.type}" />`);
  html = upsertMeta(html, ["name", "twitter:title"], `<meta name="twitter:title" content="${title}" />`);
  html = upsertMeta(html, ["name", "twitter:description"], `<meta name="twitter:description" content="${description}" />`);
  html = upsertMeta(html, ["name", "twitter:image"], `<meta name="twitter:image" content="${image}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);

  return html;
}

const template = await readFile(path.join(distDir, "index.html"), "utf8");

for (const route of routes) {
  const html = applyRouteMeta(template, route);
  const routeDir = route.path === "/" ? distDir : path.join(distDir, route.path);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html);
}
