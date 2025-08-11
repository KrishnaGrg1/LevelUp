"use client";

import React, { useEffect } from "react";
import LanguageStore, { Language } from "@/stores/useLanguage";
import { VerifyForm } from "@/components/auth/Verfiy";

// Helper function to validate and normalize language code
const validateLanguage = (lang: string): Language => {
  const validLanguages: Language[] = [
    "eng",
    "nep",
    "fr",
    "arab",
    "chin",
    "span",
  ];
  return validLanguages.includes(lang as Language) ? (lang as Language) : "eng";
};

interface LoginPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default function VerifyPage({ params }: LoginPageProps) {
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    // Get language from params and validate it
    params.then((resolvedParams) => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params]);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <VerifyForm lang={language} />
    </div>
  );
}
