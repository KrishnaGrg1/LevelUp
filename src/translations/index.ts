import en from './eng/index';
import fr from './fr/index';
import arab from './arab/index';
import chin from './chin/index';
import nep from './nep/index';
import span from './span/index';
import jap from './jap/index';
import lang from './lang';
import LanguageStore, { Language } from '@/stores/useLanguage';
import { DEFAULT_LANGUAGE } from '@/lib/language';

// Define translation structure types
type TranslationValue = string | Record<string, unknown>;
type TranslationContent = Record<string, TranslationValue>;

const translations: Record<Language, TranslationContent> = {
  eng: {
    ...en,
    lang,
  },
  fr: {
    ...fr,
    lang,
  },
  arab: {
    ...arab,
    lang,
  },
  chin: {
    ...chin,
    lang,
  },
  nep: {
    ...nep,
    lang,
  },
  span: {
    ...span,
    lang,
  },
  jap: {
    ...jap,
    lang,
  },
};

export const defaultLocale: Language = DEFAULT_LANGUAGE;

// Get current language from store
function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    try {
      return LanguageStore.getState().language;
    } catch {
      return defaultLocale;
    }
  }
  return defaultLocale;
}

// Translation function
export function t(key: string, fallback?: string): string {
  const currentLang = getCurrentLanguage();
  const keys = key.split('.');

  let value: unknown = translations[currentLang];

  // Handle namespace:key format (e.g., "success:login")
  if (key.includes(':')) {
    const [namespace, ...restKeys] = key.split(':');
    const actualKey = restKeys.join(':');
    const langTranslations = translations[currentLang] as TranslationContent;
    value = namespace ? langTranslations?.[namespace] : undefined;

    if (value && actualKey) {
      const nestedKeys = actualKey.split('.');
      for (const nestedKey of nestedKeys) {
        value = (value as Record<string, unknown>)?.[nestedKey];
        if (value === undefined) break;
      }
    }
  } else {
    // Handle dot notation (e.g., "auth.login.title")
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined) break;
    }
  }

  return typeof value === 'string' ? value : fallback || key;
}

// Additional exports for compatibility
export const locale = getCurrentLanguage();
export const locales = Object.keys(translations) as Language[];
export const loading = false;

export function setLocale(newLocale: Language) {
  LanguageStore.getState().setLanguage(newLocale);
}

export { translations };

// Re-export language utilities for convenience
export {
  VALID_LANGUAGES,
  DEFAULT_LANGUAGE,
  validateLanguage,
  isValidLanguage,
  getLanguageName,
  isRTLLanguage,
  getLanguageDirection,
} from '@/lib/language';
