// Keeps src/locales/{es,pt,nl}/common.json in step with src/locales/en/common.json.
//
// English is the source of truth. A lock file records a hash of the English
// string each translation was made from, so a run only sends strings that are
// new or whose English changed since they were last translated, never the
// whole file. Keys removed from English are removed everywhere.
//
//   node scripts/translate-locales.mjs           translate what is stale
//   node scripts/translate-locales.mjs --check   list stale strings, exit 1 if any
//
// Without ANTHROPIC_API_KEY it reports what is stale and exits 0, so the job
// skips cleanly on a fork or before the secret is set.
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localesDir = path.join(root, "src/locales");
const lockPath = path.join(localesDir, "translation-lock.json");

const MODEL = process.env.TRANSLATION_MODEL ?? "claude-opus-5-5";
const BATCH_SIZE = 60;

const LANGUAGES = {
  es: "Latin American Spanish, as written for B2B buyers in Ecuador, Mexico and Spain. Address the reader as usted.",
  pt: "Brazilian Portuguese. Address the reader as você.",
  nl: "Dutch, in the plain, direct register Dutch B2B software uses. Address the reader as je."
};

const SYSTEM = `You translate the website of ubik, an AI-native platform for cross-border trade. Readers are operations, procurement and sales leaders at trading companies, so use the vocabulary their trade actually uses (lots, cartons, health certificates, landed cost, MOQ) rather than literal word-for-word renderings.

Rules:
- "ubik" is the brand. Keep it exactly as written, lowercase when the source is lowercase. Never translate or capitalise it.
- Keep product and plan names in English: Teammate, Enterprise, Workspace, Trade Notes, ubik Meetings.
- Keep company, product and system names unchanged: Gmail, Outlook, WhatsApp, Zoho, Dynamics 365, Business Central, SAP, Maersk, Hapag-Lloyd, LinkedIn and so on.
- Keep identifiers, codes, units, numbers and currency exactly: SO-29481, LOT-87, Lot 87, 12.4 MT, $1,000, $25M+, 100+, 18.4%, +90 bps.
- Keep standard trade abbreviations as abbreviations: ERP, CRM, ETA, MOQ, FX, BI, FDA, BAP, SOC 2, GDPR, DPDP, LLM, AI.
- A source string in ALL CAPS stays in ALL CAPS. Keep symbols such as →, ·, /, + and curly quotes where they appear.
- Keep any {{placeholder}} and any HTML tag exactly as written.
- Match the length and tone of the source: short labels stay short, headlines stay punchy. Do not add or drop claims.
- People's names, job-history company names and quotes from named people: translate the quote, keep names unchanged.

Each item has a key (for context only: it tells you where the string appears on the page) and the English text. Return a translation for every key you were given, and only those keys.`;

const OUTPUT_SCHEMA = {
  type: "json_schema",
  schema: {
    type: "object",
    properties: {
      translations: {
        type: "array",
        items: {
          type: "object",
          properties: { key: { type: "string" }, text: { type: "string" } },
          required: ["key", "text"],
          additionalProperties: false
        }
      }
    },
    required: ["translations"],
    additionalProperties: false
  }
};

const hash = (text) => createHash("sha256").update(text).digest("hex").slice(0, 16);

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

/** { a: { b: ["x"] } } -> { "a.b.0": "x" } */
function flatten(value, prefix = "", out = {}) {
  if (typeof value === "string") {
    out[prefix] = value;
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) flatten(child, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

/** Rebuilds the English shape, filling each leaf from `pick(path, englishText)`. */
function rebuild(value, pick, prefix = "") {
  if (typeof value === "string") return pick(prefix, value);
  if (Array.isArray(value)) return value.map((child, i) => rebuild(child, pick, prefix ? `${prefix}.${i}` : `${i}`));
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, rebuild(child, pick, prefix ? `${prefix}.${key}` : key)])
  );
}

const placeholders = (text) => (text.match(/\{\{[^}]+\}\}|<[^>]+>/g) ?? []).sort().join("|");

async function translateBatch(client, language, items) {
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 32000,
    // Server-side fallback: a safety-classifier decline is retried on another
    // model inside the same call instead of failing the batch.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    output_config: { format: OUTPUT_SCHEMA },
    messages: [
      {
        role: "user",
        content: `Target language: ${LANGUAGES[language]}\n\n${JSON.stringify(
          items.map(([key, text]) => ({ key, text })),
          null,
          1
        )}`
      }
    ]
  });

  if (response.stop_reason === "refusal") throw new Error(`model declined the ${language} batch`);
  if (response.stop_reason === "max_tokens") throw new Error(`${language} batch hit max_tokens`);
  const text = response.content.find((block) => block.type === "text")?.text;
  if (!text) throw new Error(`no text in the ${language} response`);

  const wanted = new Map(items);
  const result = {};
  for (const { key, text: translated } of JSON.parse(text).translations) {
    const source = wanted.get(key);
    if (source === undefined) continue;
    // A dropped {{var}} or tag would break rendering; leave that string stale
    // and try again next run rather than ship it.
    if (placeholders(source) !== placeholders(translated)) {
      console.warn(`  ${language}: placeholder mismatch on ${key}, kept for next run`);
      continue;
    }
    result[key] = translated;
  }
  return result;
}

const checkOnly = process.argv.includes("--check");
const english = await readJson(path.join(localesDir, "en/common.json"));
const englishFlat = flatten(english);
const lock = await readJson(lockPath, {});

const stale = {};
for (const language of Object.keys(LANGUAGES)) {
  const existing = flatten(await readJson(path.join(localesDir, language, "common.json"), {}));
  const hashes = lock[language] ?? {};
  stale[language] = Object.entries(englishFlat).filter(
    ([key, text]) => existing[key] === undefined || hashes[key] !== hash(text)
  );
  console.log(`${language}: ${stale[language].length} of ${Object.keys(englishFlat).length} strings need translating`);
}

const totalStale = Object.values(stale).reduce((sum, items) => sum + items.length, 0);
if (checkOnly) process.exit(totalStale ? 1 : 0);
if (!totalStale) process.exit(0);
if (!process.env.ANTHROPIC_API_KEY) {
  console.log("ANTHROPIC_API_KEY is not set; skipping translation.");
  process.exit(0);
}

const client = new Anthropic();
let failures = 0;

for (const [language, items] of Object.entries(stale)) {
  if (!items.length) continue;
  const file = path.join(localesDir, language, "common.json");
  const existing = flatten(await readJson(file, {}));
  const hashes = { ...(lock[language] ?? {}) };
  const translated = {};

  for (let start = 0; start < items.length; start += BATCH_SIZE) {
    const batch = items.slice(start, start + BATCH_SIZE);
    try {
      Object.assign(translated, await translateBatch(client, language, batch));
    } catch (error) {
      failures += 1;
      console.error(`  ${language}: batch ${start / BATCH_SIZE + 1} failed:`, error.message ?? error);
    }
  }

  for (const key of Object.keys(translated)) hashes[key] = hash(englishFlat[key]);
  // Keys gone from English leave the lock too.
  lock[language] = Object.fromEntries(Object.entries(hashes).filter(([key]) => key in englishFlat));

  // A string that failed to translate keeps its previous translation if it
  // has one, else English, and stays out of the lock so the next run retries.
  const output = rebuild(english, (key, source) => translated[key] ?? existing[key] ?? source);
  await writeFile(file, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`  ${language}: translated ${Object.keys(translated).length} of ${items.length}`);
}

const sortedLock = Object.fromEntries(
  Object.entries(lock).map(([language, hashes]) => [language, Object.fromEntries(Object.entries(hashes).sort())])
);
await writeFile(lockPath, `${JSON.stringify(sortedLock, null, 2)}\n`);

if (failures) {
  console.error(`${failures} batch(es) failed; untranslated strings will be retried next run.`);
  process.exit(1);
}
