'use client';

import React, { Suspense, useEffect } from 'react';
import ForgetPassword from '@/components/auth/ForgetPassword';
import LanguageStore, { Language } from '@/stores/useLanguage';
import FormLoading from '@/components/auth/FormLoading';

interface ForgetPasswordPageProps {
  params: Promise<{ lang: Language }>;
}

export default function ForgetPasswordPage({ params }: ForgetPasswordPageProps) {
  const { language, setLanguage } = LanguageStore();
  useEffect(() => {
    params.then(p => setLanguage((p.lang ?? 'eng') as Language));
  }, [params, setLanguage]);

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center pt-20">
      <Suspense fallback={<FormLoading message="Forget Password" />}>
        <ForgetPassword lang={language} />
      </Suspense>
    </div>
  );
}
