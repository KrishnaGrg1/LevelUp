import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LanguageStore, { Language } from "@/stores/useLanguage";

const languages = [
  { code: "eng" as Language, name: "English", flag: "🇺🇸" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "nep" as Language, name: "नेपाली", flag: "🇳🇵" },
  { code: "arab" as Language, name: "العربية", flag: "🇸🇦" },
  { code: "chin" as Language, name: "中文", flag: "🇨🇳" },
  { code: "span" as Language, name: "Español", flag: "🇪🇸" },
  { code: "jap" as Language, name: "日本語", flag: "🇯🇵" }
];

// Helper function to validate and normalize language code
const validateLanguage = (lang: string): Language => {
  const validLanguages: Language[] = [
    "eng",
    "nep",
    "fr",
    "arab",
    "chin",
    "span",
    "jap"
  ];
  return validLanguages.includes(lang as Language) ? (lang as Language) : "eng";
};

interface LanguageSwitcherProps {
  currentLang?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
}) => {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    setIsClient(true);

    // If currentLang is provided from URL, sync it with the store
    if (currentLang) {
      const validLang = validateLanguage(currentLang);
      if (validLang !== language) {
        setLanguage(validLang);
      }
    }
  }, [currentLang, language, setLanguage]);

  const currentLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  const changeLanguage = (languageCode: Language) => {
    // Only update the global store, don't navigate
    // This prevents form state from being lost
    setLanguage(languageCode);

    // Optional: Update URL in browser history without navigation
    // This updates the URL bar but doesn't trigger a page load
    const segments = pathname.split("/");
    if (segments.length > 1) {
      segments[1] = languageCode;
      const newPath = segments.join("/");
      window.history.replaceState(null, '', newPath);
    }
  };

  // Prevent hydration mismatch by not rendering interactive elements until client-side
  if (!isClient) {
    return (
      <div className="h-9 w-32 bg-slate-700/30 rounded-md animate-pulse"></div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50 hover:border-indigo-500/50"
        >
          <Languages className="mr-2 h-4 w-4" />
          {currentLanguage?.flag} {currentLanguage?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-slate-800/90 backdrop-blur-lg text-white shadow-2xl border border-slate-700/50 rounded-xl"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer hover:bg-slate-700/50 rounded-lg transition-colors ${language === lang.code ? "font-semibold bg-indigo-500/20" : ""
              }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
