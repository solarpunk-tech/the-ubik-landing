import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const modules = import.meta.glob("../locales/*/common.json", { eager: true });

const resources = Object.entries(modules).reduce<Record<string, { common: Record<string, string> }>>(
  (acc, [path, module]) => {
    const lang = path.split("/").at(-2);
    if (lang) {
      acc[lang] = { common: (module as { default: Record<string, string> }).default };
    }
    return acc;
  },
  {}
);

export const LANGUAGE_STORAGE_KEY = "ubik-lang";
export const LANGUAGE_EXPLICIT_STORAGE_KEY = "ubik-lang-explicit";
export const supportedLanguages = Object.keys(resources).sort();

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
    resources,
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

export default i18n;
