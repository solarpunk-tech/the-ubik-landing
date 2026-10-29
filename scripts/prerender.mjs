// Renders every route in public/sitemap.xml to static HTML after `vite build`.
//
// Without this every URL served the same empty index.html: the homepage title,
// the homepage description and canonical=https://theubik.com/. Crawlers that do
// not run JavaScript (most AI crawlers, link unfurlers) saw no content at all,
// and /pricing or /security declared themselves duplicates of the homepage.
//
// Each route gets dist/<route>/index.html with its own head and the rendered
// page inside #prerender. dist/spa.html keeps the untouched shell for every
// other path (see the catch-all in netlify.toml).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const ORIGIN = "https://theubik.com";

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setMeta(html, pattern, value) {
  if (value == null) return html;
  if (!pattern.test(html)) throw new Error(`prerender: head tag not found for ${pattern}`);
  return html.replace(pattern, (_m, before, _old, after) => `${before}${escapeAttr(value)}${after}`);
}

function applyHead(template, head) {
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(head.title)}</title>`);
  const tag = (attr, name) => new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")([^"]*)(")`);
  html = setMeta(html, tag("name", "description"), head.description);
  html = setMeta(html, tag("property", "og:title"), head.title);
  html = setMeta(html, tag("property", "og:description"), head.description);
  html = setMeta(html, tag("property", "og:url"), head.canonical);
  html = setMeta(html, tag("property", "og:type"), head.type);
  html = setMeta(html, tag("name", "twitter:title"), head.title);
  html = setMeta(html, tag("name", "twitter:description"), head.description);
  if (head.image) {
    // og:video is the moving homepage card. A page with its own image (a blog
    // header, the security note) would otherwise unfurl as that video on the
    // platforms that prefer video, so the video goes with the default image.
    if (!head.image.includes("/og-image.jpg")) html = html.replace(/\s*<meta property="og:video[^>]*>/g, "");
    html = setMeta(html, tag("property", "og:image"), head.image);
    html = setMeta(html, tag("property", "og:image:secure_url"), head.image);
    html = setMeta(html, tag("name", "twitter:image"), head.image);
  }
  if (head.imageAlt) {
    html = setMeta(html, tag("property", "og:image:alt"), head.imageAlt);
    html = setMeta(html, tag("name", "twitter:image:alt"), head.imageAlt);
  }
  return setMeta(html, /(<link\s+rel="canonical"\s+href=")([^"]*)(")/, head.canonical);
}

// The browser globals some modules read at import time. Rendering never runs
// effects, so these only need to exist, not to work.
if (!("localStorage" in globalThis)) globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };

const sitemap = await readFile(path.join(root, "public/sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname);

const template = await readFile(path.join(dist, "index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error("prerender: #root not found in dist/index.html");
await writeFile(path.join(dist, "spa.html"), template);

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

let failed = 0;
for (const route of routes) {
  try {
    const { html, head } = await render(route);
    if (!head) throw new Error("page rendered no <Seo>");
    if (head.canonical !== `${ORIGIN}${route}` && !(route === "/" && head.canonical === `${ORIGIN}/`)) {
      throw new Error(`canonical ${head.canonical} does not match the sitemap URL`);
    }
    const page = applyHead(template, head).replace(
      '<div id="root"></div>',
      `<div id="prerender">${html}</div><div id="root"></div>`
    );
    const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route, "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, page);
    console.log(`prerendered ${route} (${(html.length / 1024).toFixed(0)} KB)`);
  } catch (error) {
    failed += 1;
    console.error(`prerender failed for ${route}:`, error);
  }
}

await rm(ssrDir, { recursive: true, force: true });
if (failed) {
  console.error(`${failed} route(s) failed to prerender`);
  process.exit(1);
}
