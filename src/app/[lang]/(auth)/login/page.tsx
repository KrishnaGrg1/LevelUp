"use client";

import React, { useEffect } from "react";
import LanguageStore, { Language } from "@/stores/useLanguage";
import { LoginForm } from "@/components/auth/Login";

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

export default function LoginPage({ params }: LoginPageProps) {
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    // Get language from params and validate it, then set in store
    params.then((resolvedParams) => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params]);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
      <LoginForm lang={language} />
    </div>
  );
}
