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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
      lookupCookie: "ubik-lang",
      lookupLocalStorage: "ubik-lang"
    }
  });

export default i18n;
