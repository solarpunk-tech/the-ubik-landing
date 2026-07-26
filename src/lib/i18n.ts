import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/common.json";

/**
 * Locales are loaded on demand.
 *
 * This glob is deliberately NOT eager: there are 24 locale files totalling
 * ~192KB, and an eager glob put every one of them in the main bundle so each
 * visitor downloaded 24 languages in order to read one. English ships inline
 * (it is the fallback and the overwhelmingly common case) and any other
 * language is fetched as its own chunk when it is actually selected.
 */
const localeLoaders = import.meta.glob("../locales/*/common.json") as Record<
  string,
  () => Promise<{ default: Record<string, string> }>
>;

const localeByLang = Object.entries(localeLoaders).reduce<
  Record<string, () => Promise<{ default: Record<string, string> }>>
>((acc, [path, loader]) => {
  const lang = path.split("/").at(-2);
  if (lang) acc[lang] = loader;
  return acc;
}, {});

export const LANGUAGE_STORAGE_KEY = "ubik-lang";
export const LANGUAGE_EXPLICIT_STORAGE_KEY = "ubik-lang-explicit";
export const supportedLanguages = Object.keys(localeByLang).sort();

const loaded = new Set<string>(["en"]);

/** Fetches a locale bundle and registers it, then re-renders with it applied. */
export async function ensureLanguage(language: string) {
  const lang = language.split("-")[0];
  if (loaded.has(lang) || !localeByLang[lang]) return;
  try {
    const mod = await localeByLang[lang]();
    i18n.addResourceBundle(lang, "common", mod.default, true, true);
    loaded.add(lang);
    // Nudge i18next so components re-read the newly available strings.
    if (i18n.resolvedLanguage === lang || i18n.language === lang) {
      await i18n.changeLanguage(lang);
    }
  } catch {
    // Network hiccup on a locale chunk — English stays in place as fallback.
  }
}

function clearStoredLanguage() {
  localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  localStorage.removeItem(LANGUAGE_EXPLICIT_STORAGE_KEY);
  document.cookie = `${LANGUAGE_STORAGE_KEY}=; Max-Age=0; path=/; SameSite=Lax`;
}

function migrateStoredLanguage() {
  if (typeof window === "undefined") return;

  const explicitLanguage = localStorage.getItem(LANGUAGE_EXPLICIT_STORAGE_KEY);
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)?.split("-")[0];

  if (!explicitLanguage || !storedLanguage || !supportedLanguages.includes(storedLanguage)) {
    clearStoredLanguage();
  }
}

export function persistExplicitLanguage(language: string) {
  if (typeof window === "undefined") return;

  const normalizedLanguage = language.split("-")[0];
  if (!supportedLanguages.includes(normalizedLanguage)) {
    clearStoredLanguage();
    return;
  }

  localStorage.setItem(LANGUAGE_EXPLICIT_STORAGE_KEY, "true");
  localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(normalizedLanguage)}; Max-Age=31536000; path=/; SameSite=Lax`;
}

migrateStoredLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { common: en } },
    partialBundledLanguages: true,
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: [],
      lookupCookie: "ubik-lang",
      lookupLocalStorage: "ubik-lang"
    }
  });

// The detector may land on a non-English locale on first paint; fetch its
// bundle straight away so the page doesn't sit in English fallback.
void ensureLanguage(i18n.resolvedLanguage ?? i18n.language ?? "en");

export default i18n;
