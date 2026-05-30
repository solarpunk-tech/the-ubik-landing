import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "social", "origin-roulette-linkedin-carousel");

const slides = [
  {
    kicker: "Trade Notes / Origin Roulette",
    title: "Shrimp sourcing stopped being a price spreadsheet.",
    body: "For 2026 books, the winning origin is the one that clears tariff gates, certification depth, disease windows, and landed-cost risk.",
    stamp: "Q3 2026 / Q1 2027",
    mode: "cover"
  },
  {
    kicker: "What broke",
    title: "Three desk assumptions failed in fifteen months.",
    bullets: [
      "The U.S. would take every kilo.",
      "Ecuador's cost edge would narrow.",
      "Value-added processing was a side quest."
    ],
    footer: "All three are now live commercial variables."
  },
  {
    kicker: "New buyer question",
    title: "It is no longer: is there enough shrimp?",
    body: "It is: which shrimp clears the regulatory gate, keeps the landed-cost curve sane, and does not trap the book inside one origin's policy risk?",
    metric: "risk > volume"
  },
  {
    kicker: "Origin map",
    title: "Each origin now has a job.",
    chips: [
      ["Ecuador", "raw HLSO cost anchor"],
      ["India", "cooked + EU value-add swing"],
      ["Vietnam", "processing depth, documentation clock"],
      ["Indonesia", "small U.S. diversifier if certs hold"],
      ["Thailand", "premium cooked, labour scrutiny"],
      ["China", "demand-side price floor"]
    ]
  },
  {
    kicker: "Decision rule",
    title: "Q3 spot and Q1 forward are different games.",
    split: [
      ["Q3 2026 spot", "Tariffs and landed cost dominate. Ecuador and India carry the book; Indonesia is a certified tranche."],
      ["Q1 2027 forward", "Regulatory trajectory dominates. Residue control, approvals, SIMP, forced-labour issues, and CATCH decide durability."]
    ]
  },
  {
    kicker: "Asymmetric bets",
    title: "The better move is not always the cheapest kilo.",
    bullets: [
      "India cooked 21/25 for EU retail can beat Ecuadorian HLSO on margin.",
      "Indonesia can be convex U.S. cover if certification keeps holding.",
      "30-count vs 60-count can flip India vs Ecuador economics."
    ]
  },
  {
    kicker: "Operator problem",
    title: "This cannot live in one spreadsheet anymore.",
    body: "Origin strategy now touches supplier emails, ERP items, tariff memos, QA files, certification dates, WhatsApp exceptions, and customer commitments.",
    metric: "the book is a workflow"
  },
  {
    kicker: "Ubik",
    title: "We are building the operator layer for this kind of trade work.",
    body: "Above CRM, ERP, email, WhatsApp, documents, and approvals. Human-reviewed agent workflows for perishable trade teams.",
    footer: "Full field note: theubik.com/blog",
    mode: "end"
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slideMarkup(slide, index) {
  const number = String(index + 1).padStart(2, "0");
  const chips = slide.chips
    ? `<div class="chips">${slide.chips
        .map(([name, role]) => `<div class="chip"><b>${escapeHtml(name)}</b><span>${escapeHtml(role)}</span></div>`)
        .join("")}</div>`
    : "";
  const bullets = slide.bullets
    ? `<div class="bullets">${slide.bullets.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>`
    : "";
  const split = slide.split
    ? `<div class="split">${slide.split
        .map(([label, copy]) => `<div><b>${escapeHtml(label)}</b><p>${escapeHtml(copy)}</p></div>`)
        .join("")}</div>`
    : "";

  return `
    <section class="slide ${slide.mode ?? ""}" id="slide-${number}">
      <div class="matrix" aria-hidden="true"></div>
      <header>
        <img src="../../public/logo-wordmark-dark.png" alt="Ubik" />
        <span>${number} / ${String(slides.length).padStart(2, "0")}</span>
      </header>
      <main>
        <p class="kicker">${escapeHtml(slide.kicker)}</p>
        <h1>${escapeHtml(slide.title)}</h1>
        ${slide.body ? `<p class="body">${escapeHtml(slide.body)}</p>` : ""}
        ${bullets}
        ${chips}
        ${split}
        ${slide.metric ? `<p class="metric">${escapeHtml(slide.metric)}</p>` : ""}
      </main>
      <footer>
        <span>${escapeHtml(slide.stamp ?? slide.footer ?? "Origin Roulette 2026")}</span>
        <a href="https://theubik.com">theubik.com</a>
      </footer>
    </section>
  `;
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Origin Roulette 2026 LinkedIn Carousel</title>
  <style>
    @font-face {
      font-family: "Montserrat";
      src: url("../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2") format("woff2");
      font-weight: 100 900;
    }
    @font-face {
      font-family: "Noto Sans";
      src: url("../../node_modules/@fontsource-variable/noto-sans/files/noto-sans-latin-wght-normal.woff2") format("woff2");
      font-weight: 100 900;
    }
    @font-face {
      font-family: "IBM Plex Mono";
      src: url("../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff") format("woff");
      font-weight: 400;
    }
    @page { size: 1080px 1080px; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #0f131d;
      color: #f8fafc;
      font-family: "Noto Sans", sans-serif;
    }
    .deck { width: 1080px; }
    .slide {
      position: relative;
      display: grid;
      grid-template-rows: 104px 1fr 96px;
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      page-break-after: always;
      background:
        linear-gradient(180deg, rgba(33, 79, 244, 0.24), rgba(33, 79, 244, 0) 33%),
        linear-gradient(135deg, #111827 0%, #0f131d 52%, #15191f 100%);
      border: 1px solid rgba(148, 163, 184, 0.24);
    }
    .slide::before {
      content: "";
      position: absolute;
      inset: 64px;
      border: 1px solid rgba(148, 163, 184, 0.22);
      pointer-events: none;
    }
    .slide::after {
      content: "";
      position: absolute;
      right: 64px;
      top: 150px;
      width: 160px;
      height: 520px;
      background: #214ff4;
      opacity: 0.92;
      clip-path: polygon(0 0, 100% 0, 100% 82%, 0 100%);
    }
    .matrix {
      position: absolute;
      inset: 0;
      opacity: 0.22;
      background-image:
        linear-gradient(rgba(148, 163, 184, 0.32) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.32) 1px, transparent 1px);
      background-size: 38px 38px;
      mask-image: linear-gradient(90deg, black, transparent 76%);
    }
    header,
    footer {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 64px;
      font-family: "IBM Plex Mono", monospace;
      font-size: 18px;
      letter-spacing: 0.06em;
      color: rgba(226, 232, 240, 0.78);
      text-transform: uppercase;
    }
    footer a {
      color: inherit;
      text-decoration: none;
    }
    header img { width: 142px; height: auto; }
    main {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 28px 174px 28px 64px;
    }
    .cover main,
    .end main { padding-right: 230px; }
    .kicker {
      margin: 0 0 34px;
      font-family: "IBM Plex Mono", monospace;
      font-size: 22px;
      letter-spacing: 0.14em;
      color: #8fb0ff;
      text-transform: uppercase;
    }
    h1 {
      max-width: 820px;
      margin: 0;
      font-family: "Montserrat", "Noto Sans", sans-serif;
      font-size: 72px;
      line-height: 0.98;
      letter-spacing: 0;
      font-weight: 680;
    }
    .cover h1 { font-size: 82px; max-width: 790px; }
    .body {
      max-width: 760px;
      margin: 40px 0 0;
      font-size: 34px;
      line-height: 1.28;
      color: rgba(226, 232, 240, 0.86);
    }
    .bullets {
      display: grid;
      gap: 16px;
      margin-top: 48px;
      max-width: 770px;
    }
    .bullets p {
      margin: 0;
      border-left: 8px solid #214ff4;
      background: rgba(248, 250, 252, 0.06);
      padding: 22px 28px;
      font-size: 31px;
      line-height: 1.22;
    }
    .chips {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-top: 38px;
      max-width: 790px;
    }
    .chip {
      min-height: 116px;
      border: 1px solid rgba(148, 163, 184, 0.32);
      background: rgba(248, 250, 252, 0.06);
      padding: 20px 22px;
    }
    .chip b {
      display: block;
      font-family: "IBM Plex Mono", monospace;
      font-size: 20px;
      color: #8fb0ff;
      text-transform: uppercase;
    }
    .chip span {
      display: block;
      margin-top: 12px;
      font-size: 24px;
      line-height: 1.16;
      color: rgba(248, 250, 252, 0.88);
    }
    .metric {
      width: fit-content;
      margin: 48px 0 0;
      border: 1px solid rgba(143, 176, 255, 0.5);
      background: #214ff4;
      padding: 20px 28px;
      font-family: "IBM Plex Mono", monospace;
      font-size: 26px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .split {
      display: grid;
      gap: 20px;
      margin-top: 46px;
      max-width: 800px;
    }
    .split div {
      border: 1px solid rgba(148, 163, 184, 0.32);
      background: rgba(248, 250, 252, 0.06);
      padding: 24px 28px;
    }
    .split b {
      display: block;
      font-family: "IBM Plex Mono", monospace;
      font-size: 20px;
      color: #8fb0ff;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .split p {
      margin: 14px 0 0;
      font-size: 27px;
      line-height: 1.2;
      color: rgba(226, 232, 240, 0.9);
    }
    .cover::after,
    .end::after {
      top: 128px;
      right: 90px;
      width: 210px;
      height: 690px;
      opacity: 1;
    }
    .cover .matrix,
    .end .matrix { opacity: 0.3; }
    @media print {
      body { background: #0f131d; }
    }
  </style>
</head>
<body>
  <div class="deck">
    ${slides.map(slideMarkup).join("\n")}
  </div>
</body>
</html>`;

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "origin-roulette-linkedin-carousel.html"), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`file://${path.join(outDir, "origin-roulette-linkedin-carousel.html")}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

for (let index = 0; index < slides.length; index += 1) {
  const number = String(index + 1).padStart(2, "0");
  const slide = page.locator(`#slide-${number}`);
  await slide.screenshot({ path: path.join(outDir, `slide-${number}.png`) });
}

await page.pdf({
  path: path.join(outDir, "origin-roulette-linkedin-carousel.pdf"),
  width: "1080px",
  height: "1080px",
  printBackground: true,
  preferCSSPageSize: true
});

await browser.close();
console.log(`Rendered ${slides.length} slides to ${outDir}`);
