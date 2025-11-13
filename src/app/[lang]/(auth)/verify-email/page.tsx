'use client';

import React, { Suspense, useEffect } from 'react';
import LanguageStore, { Language } from '@/stores/useLanguage';
import { VerifyForm } from '@/components/auth/Verify';
import FormLoading from '@/components/auth/FormLoading';

interface LoginPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default function VerifyPage({ params }: LoginPageProps) {
  const { language, setLanguage } = LanguageStore();
  const [otp, setOtp] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  useEffect(() => {
    params.then(p => {
      setLanguage((p.lang ?? 'eng') as Language);
    });
  }, [params, setLanguage]);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const otp = urlParams.get('token');
    const userId = urlParams.get('id');
    setOtp(otp);
    setUserId(userId);
  }, []);
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen pt-20">
      <Suspense fallback={<FormLoading message="Verify Email" />}>
        <VerifyForm lang={language} otp={otp} userId={userId} />
      </Suspense>
    </div>
  );
}
