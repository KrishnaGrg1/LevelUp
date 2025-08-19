import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "eng" | "nep" | "fr" | "arab" | "chin" | "span" | "jap";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "eng",
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: "language-storage", // unique name for localStorage
      partialize: (state) => ({
        language: state.language,
      }),
    },
  ),
);

export default LanguageStore;
