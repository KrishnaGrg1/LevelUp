import LanguageStore, { Language } from "@/stores/useLanguage";
import { useEffect, useMemo, useState } from "react";

// Load a namespace JSON for a given language. Uses dynamic import so Turbopack can code-split.
export async function loadNamespace(lang: Language, ns: "auth" | "success" | "error") {
  switch (ns) {
    case "auth":
      return (await import(`@/translations/${lang}/auth.json`)).default as Record<string, string>;
    case "success":
      return (await import(`@/translations/${lang}/success.json`)).default as Record<string, string>;
    case "error":
      return (await import(`@/translations/${lang}/error.json`)).default as Record<string, string>;
  }
}

// Client hook: loads requested namespaces into state; re-renders when ready
export function useI18n(namespaces: Array<"auth" | "success" | "error"> = ["auth"]) {
  const { language } = LanguageStore();
  const [dicts, setDicts] = useState<Record<string, Record<string, string>>>({});
  const [ready, setReady] = useState(false);

  // Convert array to string for stable comparison
  const namespacesKey = namespaces.sort().join(',');

  useEffect(() => {
    let mounted = true;
    setReady(false);
    Promise.all(namespaces.map((ns) => loadNamespace(language, ns))).then((results) => {
      if (!mounted) return;
      const map: Record<string, Record<string, string>> = {};
      namespaces.forEach((ns, i) => (map[ns] = results[i]));
      setDicts(map);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [language, namespacesKey]);

  const t = useMemo(() => {
    return (key: string, defaultValue?: string) => {
      const [maybeNs, ...rest] = key.split(":");
      const hasNs = (namespaces as string[]).includes(maybeNs);
      const searchNamespaces = hasNs ? [maybeNs] : namespaces;
      const path = (hasNs ? rest.join(":") : key).split(".");

      for (const ns of searchNamespaces) {
        const obj = dicts[ns];
        if (!obj) continue;
        let cur: Record<string, string> | string = obj;
        for (const p of path) {
          if (cur && typeof cur === "object" && p in cur) cur = cur[p];
          else {
            cur = "";
            break;
          }
        }
        if (typeof cur === "string") return cur;
      }
      
      // Log missing translation in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation for key: "${key}" in language: "${language}"`);
      }
      
      return defaultValue ?? key;
    };
  }, [dicts, namespacesKey, language]);

  return { t, ready };
}

// Utility function to validate translation completeness
export async function validateTranslations(referenceLanguage: Language = "eng") {
  const languages: Language[] = ["eng", "fr", "nep", "arab", "chin", "span"];
  const namespaces: Array<"auth" | "success" | "error"> = ["auth", "success", "error"];
  
  const report: Record<string, Record<string, string[]>> = {};
  
  for (const lang of languages) {
    if (lang === referenceLanguage) continue;
    report[lang] = {};
    
    for (const ns of namespaces) {
      try {
        const reference = await loadNamespace(referenceLanguage, ns);
        const target = await loadNamespace(lang, ns);
        
        const missingKeys = findMissingKeys(reference, target);
        if (missingKeys.length > 0) {
          report[lang][ns] = missingKeys;
        }
      } catch (error) {
        console.error(`Failed to load namespace ${ns} for language ${lang}:`, error);
        report[lang][ns] = [`Failed to load namespace: ${ns}`];
      }
    }
  }
  
  return report;
}

// Helper function to find missing keys in nested objects
function findMissingKeys(reference: Record<string, unknown>, target: Record<string, unknown>, prefix = ""): string[] {
  const missing: string[] = [];
  
  for (const key in reference) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (!(key in target)) {
      missing.push(fullKey);
    } else if (
      typeof reference[key] === 'object' && 
      reference[key] !== null &&
      typeof target[key] === 'object' && 
      target[key] !== null
    ) {
      missing.push(...findMissingKeys(
        reference[key] as Record<string, unknown>, 
        target[key] as Record<string, unknown>, 
        fullKey
      ));
    }
  }
  
  return missing;
}
