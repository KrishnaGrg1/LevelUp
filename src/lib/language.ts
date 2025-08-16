import { Language } from "@/stores/useLanguage";

/**
 * All supported languages in the application
 * This is the single source of truth for language validation
 */
export const VALID_LANGUAGES: readonly Language[] = [
  "eng", 
  "fr", 
  "nep", 
  "arab", 
  "chin", 
  "span", 
  "jap"
] as const;

/**
 * Default language fallback
 */
export const DEFAULT_LANGUAGE: Language = "eng";

/**
 * Validates if a string is a supported language
 * @param lang - Language string to validate
 * @returns true if language is supported, false otherwise
 */
export function isValidLanguage(lang: string): lang is Language {
  return VALID_LANGUAGES.includes(lang as Language);
}

/**
 * Validates and normalizes a language string
 * @param lang - Language string to validate
 * @returns Validated Language or default fallback
 */
export function validateLanguage(lang: string): Language {
  return isValidLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}

/**
 * Gets the next language in the list (useful for cycling)
 * @param currentLang - Current language
 * @returns Next language in the sequence
 */
export function getNextLanguage(currentLang: Language): Language {
  const currentIndex = VALID_LANGUAGES.indexOf(currentLang);
  const nextIndex = (currentIndex + 1) % VALID_LANGUAGES.length;
  return VALID_LANGUAGES[nextIndex];
}

/**
 * Gets the previous language in the list (useful for cycling)
 * @param currentLang - Current language
 * @returns Previous language in the sequence
 */
export function getPreviousLanguage(currentLang: Language): Language {
  const currentIndex = VALID_LANGUAGES.indexOf(currentLang);
  const prevIndex = currentIndex === 0 ? VALID_LANGUAGES.length - 1 : currentIndex - 1;
  return VALID_LANGUAGES[prevIndex];
}

/**
 * Language display names mapping
 * Could be moved to translations later if needed
 */
export const LANGUAGE_NAMES: Record<Language, string> = {
  eng: "English",
  fr: "French", 
  nep: "नेपाली",
  arab: "العربية",
  chin: "中文",
  span: "Español",
  jap: "日本語"
} as const;

/**
 * Gets display name for a language
 * @param lang - Language code
 * @returns Human readable language name
 */
export function getLanguageName(lang: Language): string {
  return LANGUAGE_NAMES[lang] || LANGUAGE_NAMES[DEFAULT_LANGUAGE];
}

/**
 * Checks if a language is RTL (Right-to-Left)
 * @param lang - Language code
 * @returns true if RTL, false if LTR
 */
export function isRTLLanguage(lang: Language): boolean {
  return lang === "arab";
}

/**
 * Gets language direction for CSS
 * @param lang - Language code
 * @returns "rtl" or "ltr"
 */
export function getLanguageDirection(lang: Language): "rtl" | "ltr" {
  return isRTLLanguage(lang) ? "rtl" : "ltr";
}
