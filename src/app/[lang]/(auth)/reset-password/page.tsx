'use client';

import React, { useEffect } from 'react';
import LanguageStore, { Language } from '@/stores/useLanguage';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

interface ResetPasswordPageProps {
  params: Promise<{ lang: Language }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { language, setLanguage } = LanguageStore();
  useEffect(() => {
    params.then(p => setLanguage((p.lang ?? 'eng') as Language));
  }, [params, setLanguage]);

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
      <ResetPasswordForm lang={language} />
    </div>
  );
}
