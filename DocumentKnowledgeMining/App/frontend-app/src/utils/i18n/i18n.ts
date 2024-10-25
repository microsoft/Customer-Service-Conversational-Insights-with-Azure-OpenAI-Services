import { use } from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export function initializeLanguage() {
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    use(Backend)
        // detect user language
        // learn more: https://github.com/i18next/i18next-browser-languageDetector
        .use(LanguageDetector)
        // pass the i18n instance to react-i18next.
        .use(initReactI18next)
        // init i18next
        // for all options read: https://www.i18next.com/overview/configuration-options
        .init({
            detection: {
                // order and from where user language should be detected
                // "querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag", "path", "subdomain"
                order: ["querystring", "navigator", "localStorage"],
            },
            supportedLngs: ["en"],
            fallbackLng: "en",
            ns: ["translation"],
            defaultNS: "translation",
            debug: false,
            interpolation: {
                escapeValue: false, // not needed for react as it escapes by default
            },
            react: {
                // wait: true,
                useSuspense: true,
            },
        });
}
