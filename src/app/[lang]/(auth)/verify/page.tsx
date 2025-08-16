"use client";

import React, { useEffect } from "react";
import LanguageStore, { Language } from "@/stores/useLanguage";
import { VerifyForm } from "@/components/auth/Verify";
import { validateLanguage } from "@/lib/language";

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
  }, [params, setLanguage]);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
      <VerifyForm lang={language} />
    </div>
  );
}
