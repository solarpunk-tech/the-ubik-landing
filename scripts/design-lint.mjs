#!/usr/bin/env node
// Vendored from ubik-design scripts/design-lint.mjs (solarpunk-tech/ubik-design#13, #14). Update from there, not here.
// design-lint — checks a consumer's source against DESIGN.md §7 (Restraint).
//
//   node scripts/design-lint.mjs <dir> [<dir>…] [--warn] [--json]
//
// Errors exit 1 (warnings never do; --warn reports errors as warnings too).
// Silence one deliberate exception with `design-lint-allow <rule>` in a comment
// on the same line or the line before, and say why.
//
// Rules: title-period, uppercase, arbitrary-tracking, ink-opacity (errors);
// eyebrow (warning). Mono is deliberately not checked yet (§7, "deferred").

import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const args = process.argv.slice(2);
const warnOnly = args.includes("--warn");
const asJson = args.includes("--json");
const roots = args.filter((arg) => !arg.startsWith("--"));
if (!roots.length) {
  console.error("usage: design-lint.mjs <dir> [<dir>…] [--warn] [--json]");
  process.exit(2);
}

const EXTENSIONS = new Set([".tsx", ".jsx", ".ts", ".css", ".html", ".json"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "dist-ssr", "build", ".git", ".next", "coverage"]);

// A title ends in one full stop. "…" and "..." (loading states) and "?" / "!" are fine.
const endsWithPeriod = (text) => /[^.]\.\s*$/.test(text.trim()) && !/\.\.\.\s*$/.test(text.trim());
// Matches title, heroTitle, examplesTitle, titleLead, titleEmphasis, cta, label… but not subtitle.
const TITLE_KEY = /(^|[._-]|[a-z])(title|heading|headline|cta|label|button)(lead|emphasis)?s?$/i;
const NOT_TITLE_KEY = /subtitle|description|lede|copy|body|summary/i;

const RULES = [
  {
    id: "uppercase",
    level: "error",
    test: (line, ext) =>
      ext === ".css" || ext === ".html"
        ? /text-transform\s*:\s*uppercase/i.test(line)
        : /(className|class)\s*=|cn\(|cva\(|clsx\(/.test(line) && /(^|[\s"'`{])uppercase([\s"'`}]|$)/.test(line),
    message: "ALL CAPS: use sentence case (§7 · Type and copy)"
  },
  {
    id: "arbitrary-tracking",
    level: "error",
    test: (line, ext) =>
      ext === ".css" || ext === ".html"
        ? /letter-spacing\s*:\s*-\s*0?\.\d+(em|rem|px)/i.test(line)
        : /tracking-\[-?[^\]]+\]/.test(line),
    message: "ad-hoc tracking: use the type tokens (§7 · Type and copy)"
  },
  {
    id: "ink-opacity",
    level: "error",
    test: (line, ext) => ext !== ".css" && /\btext-(foreground|primary-foreground|muted-foreground|primary-text)\/\d+/.test(line),
    message: "faded ink: use a text token, not an opacity step (§7 · Colour and surface)"
  },
  {
    id: "eyebrow",
    level: "warning",
    test: (line, ext) => ext !== ".json" && /\b(ubik-eyebrow|sh-eyebrow|section-label|eyebrow)\b/.test(line) && !/^\s*(\/\/|\*|\/\*)/.test(line),
    message: "eyebrow above a heading: keep it only if it carries a fact (§7 · Type and copy)"
  },
  {
    id: "title-period",
    level: "error",
    // JSX: a heading whose literal text ends in a full stop.
    test: (line, ext) => (ext === ".tsx" || ext === ".jsx" || ext === ".html") && /<h[1-4][^>]*>([^<{}]+)<\/h[1-4]>/.test(line) && endsWithPeriod(line.match(/<h[1-4][^>]*>([^<{}]+)<\/h[1-4]>/)[1]),
    message: "full stop at the end of a title (§7 · Type and copy)"
  }
];

const findings = [];
const allowed = (lines, index, rule) => [lines[index], lines[index - 1] ?? ""].some((line) => line.includes(`design-lint-allow ${rule}`));

function lintJson(file, text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return;
  }
  const lines = text.split("\n");
  const walk = (value, path) => {
    if (typeof value === "string") {
      const key = path[path.length - 1] ?? "";
      if (TITLE_KEY.test(String(key)) && !NOT_TITLE_KEY.test(String(key)) && endsWithPeriod(value)) {
        const lineIndex = lines.findIndex((line) => line.includes(JSON.stringify(value).slice(1, -1)));
        findings.push({ file, line: lineIndex + 1, rule: "title-period", level: "error", message: `full stop at the end of a title: ${path.join(".")}`, text: value });
      }
      return;
    }
    if (Array.isArray(value)) value.forEach((item, index) => walk(item, [...path, index]));
    else if (value && typeof value === "object") Object.entries(value).forEach(([key, item]) => walk(item, [...path, key]));
  };
  walk(data, []);
}

function lintFile(file) {
  const ext = extname(file);
  const text = readFileSync(file, "utf8");
  if (ext === ".json") {
    if (/locales?|i18n|messages|copy/i.test(file)) lintJson(file, text);
    return;
  }
  const lines = text.split("\n");
  const lineOf = (offset) => text.slice(0, offset).split("\n").length;
  if (ext === ".tsx" || ext === ".jsx" || ext === ".html") {
    // Headings written across several lines, which the line rules below miss.
    for (const match of text.matchAll(/<h[1-4][^>]*>\s*\n\s*([^<{}]+?)\s*\n\s*<\/h[1-4]>/g)) {
      const at = lineOf(match.index);
      if (endsWithPeriod(match[1]) && !allowed(lines, at - 1, "title-period")) findings.push({ file, line: at, rule: "title-period", level: "error", message: "full stop at the end of a title (§7 · Type and copy)", text: match[1].trim().slice(0, 140) });
    }
  }
  if (ext === ".tsx" || ext === ".jsx" || ext === ".ts") {
    // Copy kept as data in components: { title: "…" }.
    for (const match of text.matchAll(/\b(title|heading|headline|label|cta)\s*:\s*"([^"\n]+)"/g)) {
      const at = lineOf(match.index);
      if (endsWithPeriod(match[2]) && !allowed(lines, at - 1, "title-period")) findings.push({ file, line: at, rule: "title-period", level: "error", message: `full stop at the end of a title: ${match[1]}`, text: match[2].slice(0, 140) });
    }
  }
  lines.forEach((line, index) => {
    for (const rule of RULES) {
      if (rule.test(line, ext) && !allowed(lines, index, rule.id)) {
        findings.push({ file, line: index + 1, rule: rule.id, level: rule.level, message: rule.message, text: line.trim().slice(0, 140) });
      }
    }
  });
}

function walkDir(path) {
  const stat = statSync(path);
  if (stat.isFile()) {
    if (EXTENSIONS.has(extname(path))) lintFile(path);
    return;
  }
  for (const entry of readdirSync(path)) {
    if (SKIP_DIRS.has(entry)) continue;
    walkDir(join(path, entry));
  }
}

roots.forEach(walkDir);

const errors = findings.filter((finding) => finding.level === "error");
if (asJson) {
  console.log(JSON.stringify(findings, null, 2));
} else {
  for (const finding of findings) {
    const level = warnOnly || finding.level === "warning" ? "warn " : "error";
    console.log(`${level} ${relative(process.cwd(), finding.file)}:${finding.line}  ${finding.rule}  ${finding.message}\n        ${finding.text}`);
  }
  const counts = Object.entries(findings.reduce((acc, finding) => ({ ...acc, [finding.rule]: (acc[finding.rule] ?? 0) + 1 }), {}))
    .map(([rule, count]) => `${rule} ${count}`)
    .join(" · ");
  console.log(`\n${findings.length} finding(s)${counts ? `: ${counts}` : ""}`);
}
process.exitCode = errors.length && !warnOnly ? 1 : 0;
