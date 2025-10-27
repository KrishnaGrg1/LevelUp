/**
 * Language Store
 *
 * Manages application language/locale state with persistence
 *
 * @module shared/stores/languageStore
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Supported language codes
 */
export type Language = 'eng' | 'nep' | 'fr' | 'arab' | 'chin' | 'span' | 'jap';

/**
 * Language store state
 */
interface LanguageState {
  /** Current language */
  language: Language;
}

/**
 * Language store actions
 */
interface LanguageActions {
  /** Set the current language */
  setLanguage: (lang: Language) => void;

  /** Reset to default language */
  reset: () => void;
}

/**
 * Complete language store type
 */
type LanguageStore = LanguageState & LanguageActions;

/**
 * Default language
 */
const DEFAULT_LANGUAGE: Language = 'eng';

/**
 * Language store hook
 *
 * @example
 * ```typescript
 * const { language, setLanguage } = useLanguageStore();
 *
 * // Change language
 * setLanguage('fr');
 * ```
 */
export const useLanguageStore = create<LanguageStore>()(
  devtools(
    persist(
      set => ({
        // State
        language: DEFAULT_LANGUAGE,

        // Actions
        setLanguage: (lang: Language) => {
          set({ language: lang }, false, 'language/setLanguage');
        },

        reset: () => {
          set({ language: DEFAULT_LANGUAGE }, false, 'language/reset');
        },
      }),
      {
        name: 'language-storage',
        partialize: state => ({
          language: state.language,
        }),
      },
    ),
    {
      name: 'LanguageStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);

/**
 * Selectors
 */
export const selectLanguage = (state: LanguageStore) => state.language;
export const selectLanguageActions = (state: LanguageStore) => ({
  setLanguage: state.setLanguage,
  reset: state.reset,
});
