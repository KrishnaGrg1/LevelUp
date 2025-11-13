'use client';

import React, { Suspense, useEffect } from 'react';
import LanguageStore, { Language } from '@/stores/useLanguage';
import { RegisterForm } from '@/components/auth/Register';
import { validateLanguage } from '@/lib/language';
import FormLoading from '@/components/auth/FormLoading';

interface RegisterPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    // Get language from params and validate it
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen ">
      <Suspense fallback={<FormLoading message="Register" />}>
        <RegisterForm lang={language} />
      </Suspense>
    </div>
  );
}
