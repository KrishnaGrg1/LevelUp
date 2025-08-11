import LanguageStore, { Language } from "@/stores/useLanguage";
import { useEffect, useMemo, useState } from "react";

// Load a namespace JSON for a given language. Uses dynamic import so Turbopack can code-split.
export async function loadNamespace(lang: Language, ns: "auth" | "success" | "error") {
  switch (ns) {
    case "auth":
      return (await import(`@/translations/${lang}/auth.json`)).default as Record<string, any>;
    case "success":
      return (await import(`@/translations/${lang}/success.json`)).default as Record<string, any>;
    case "error":
      return (await import(`@/translations/${lang}/error.json`)).default as Record<string, any>;
  }
}

// Client hook: loads requested namespaces into state; re-renders when ready
export function useI18n(namespaces: Array<"auth" | "success" | "error"> = ["auth"]) {
  const { language } = LanguageStore();
  const [dicts, setDicts] = useState<Record<string, any>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    setReady(false);
    Promise.all(namespaces.map((ns) => loadNamespace(language, ns))).then((results) => {
      if (!mounted) return;
      const map: Record<string, any> = {};
      namespaces.forEach((ns, i) => (map[ns] = results[i]));
      setDicts(map);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [language, JSON.stringify(namespaces)]);

  const t = useMemo(() => {
    return (key: string, defaultValue?: string) => {
      const [maybeNs, ...rest] = key.split(":");
      const hasNs = (namespaces as string[]).includes(maybeNs);
      const searchNamespaces = hasNs ? [maybeNs] : namespaces;
      const path = (hasNs ? rest.join(":") : key).split(".");

      for (const ns of searchNamespaces) {
        const obj = dicts[ns];
        if (!obj) continue;
        let cur: any = obj;
        for (const p of path) {
          if (cur && typeof cur === "object" && p in cur) cur = cur[p];
          else {
            cur = undefined;
            break;
          }
        }
        if (typeof cur === "string") return cur;
      }
      return defaultValue ?? key;
    };
  }, [dicts, namespaces]);

  return { t, ready };
}
