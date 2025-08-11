"use client";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import engAuth from "@/translations/eng/auth.json";
import engSuccess from "@/translations/eng/success.json";
import engError from "@/translations/eng/error.json";

import frAuth from "@/translations/fr/auth.json";
import frSuccess from "@/translations/fr/success.json";
import frError from "@/translations/fr/error.json";

import nepAuth from "@/translations/nep/auth.json";
import nepSuccess from "@/translations/nep/success.json";
import nepError from "@/translations/nep/error.json";

import arabAuth from "@/translations/arab/auth.json";
import arabSuccess from "@/translations/arab/success.json";
import arabError from "@/translations/arab/error.json";

import chinAuth from "@/translations/chin/auth.json";
import chinSuccess from "@/translations/chin/success.json";
import chinError from "@/translations/chin/error.json";

import spanAuth from "@/translations/span/auth.json";
import spanSuccess from "@/translations/span/success.json";
import spanError from "@/translations/span/error.json";

const resources = {
  eng: { auth: engAuth, success: engSuccess, error: engError },
  fr: { auth: frAuth, success: frSuccess, error: frError },
  nep: { auth: nepAuth, success: nepSuccess, error: nepError },
  arab: { auth: arabAuth, success: arabSuccess, error: arabError },
  chin: { auth: chinAuth, success: chinSuccess, error: chinError },
  span: { auth: spanAuth, success: spanSuccess, error: spanError },
} as const;

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: resources as any,
      ns: ["auth", "success", "error"],
      defaultNS: "auth",
      fallbackLng: "eng",
      supportedLngs: ["eng", "fr", "nep", "arab", "chin", "span"],
      interpolation: { escapeValue: false },
      detection: {
        convertDetectedLanguage(lng: string) {
          const base = (lng || "").split("-")[0].toLowerCase();
          const map: Record<string, string> = {
            en: "eng",
            fr: "fr",
            ar: "arab",
            zh: "chin",
            es: "span",
            ne: "nep",
          };
          return map[base] || (Object.keys(resources).includes(base) ? base : "eng");
        },
      },
      react: { useSuspense: false },
      initImmediate: false,
      saveMissing: false,
      missingKeyHandler: (lngs: readonly string[], ns: string, key: string, fallbackValue: string) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Missing key: ${key} in ${ns} for ${lngs?.join(", ")}`);
        }
      },
    });

  i18n.on("languageChanged", (lng: string) => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("rtl", lng === "arab");
    }
  });
}

export default i18n;
