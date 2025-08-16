import { use } from 'react';
import { Language } from '@/stores/useLanguage';
import { validateLanguage } from '@/lib/language';

/**
 * Custom hook to extract and validate language from Next.js params
 * @param params - Promise containing route parameters
 * @returns Validated language code
 */
export function useLanguageParam(params: Promise<{ lang: string }>): Language {
  const resolvedParams = use(params);
  return validateLanguage(resolvedParams.lang);
}

/**
 * Type for common page props that include language parameter
 */
export interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Custom hook for pages that need both language and search params
 * @param params - Promise containing route parameters  
 * @param searchParams - Promise containing search parameters
 * @returns Object with validated language and resolved search params
 */
export function usePageParams(
  params: Promise<{ lang: string }>,
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
) {
  const resolvedParams = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  
  return {
    language: validateLanguage(resolvedParams.lang),
    searchParams: resolvedSearchParams,
    rawParams: resolvedParams
  };
}
