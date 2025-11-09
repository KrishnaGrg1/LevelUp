'use client';

import React, { Suspense, useEffect } from 'react';
import LanguageStore, { Language } from '@/stores/useLanguage';
import { LoginForm } from '@/components/auth/Login';
import { validateLanguage } from '@/lib/language';
import FormLoading from '@/components/auth/FormLoading';

interface LoginPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    // Get language from params and validate it, then set in store
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  return (
    <div className="relative flex items-center justify-center min-h-screen  overflow-hidden bg-white dark:bg-black ">
      <Suspense fallback={<FormLoading message="Log In" />}>
        <LoginForm lang={language} />
      </Suspense>
    </div>
  );
}
