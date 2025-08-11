"use client";

import React, { useEffect } from "react";
import ForgetPassword from "@/components/auth/ForgetPassword";
import LanguageStore, { Language } from "@/stores/useLanguage";

interface ForgetPasswordPageProps {
  params: Promise<{ lang: Language }>;
}

export default function ForgetPasswordPage({ params }: ForgetPasswordPageProps) {
  const { language, setLanguage } = LanguageStore();
  useEffect(() => {
    params.then((p) => setLanguage((p.lang ?? "eng") as Language));
  }, [params, setLanguage]);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
      <ForgetPassword lang={language} />
    </div>
  );
}
