"use client";

import React, { useEffect } from "react";
import LanguageStore, { Language } from "@/stores/useLanguage";
import { LoginForm } from "@/components/auth/Login";
import { validateLanguage } from "@/lib/language";

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
  }, [params, setLanguage]);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
      <LoginForm lang={language} />
    </div>
  );
}
