"use client";

import { create } from "zustand";
import { Language, TranslationDictionary } from "@/types/i18n";
import { translations } from "@/lib/i18n";

interface I18nStore {
  language: Language;
  t: TranslationDictionary;
  setLanguage: (lang: Language) => void;
  initializeLanguage: () => void;
}

export const useI18nStore = create<I18nStore>((set) => ({
  language: "tr",
  t: translations.tr,
  setLanguage: (lang: Language) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fanus_woodtech_lang", lang);
        document.documentElement.lang = lang;
      } catch (e) {
        console.error("Failed to save language preference:", e);
      }
    }
    set({
      language: lang,
      t: translations[lang],
    });
  },
  initializeLanguage: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("fanus_woodtech_lang") as Language;
        if (stored && (stored === "tr" || stored === "en")) {
          document.documentElement.lang = stored;
          set({
            language: stored,
            t: translations[stored],
          });
          return;
        }
      } catch (e) {
        console.error("Failed to read language preference:", e);
      }
      // Default to Turkish
      document.documentElement.lang = "tr";
      set({
        language: "tr",
        t: translations.tr,
      });
    }
  },
}));
