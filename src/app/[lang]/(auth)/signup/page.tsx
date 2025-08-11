"use client";

import React, { useEffect } from "react";
import LanguageStore, { Language } from "@/stores/useLanguage";
import { RegisterForm } from "@/components/auth/Register";

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

interface RegisterPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    // Get language from params and validate it
    params.then((resolvedParams) => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen ">
      <RegisterForm lang={language} />
    </div>
  );
}
