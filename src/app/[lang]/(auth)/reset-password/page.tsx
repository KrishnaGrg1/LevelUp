'use client';

import React, { useEffect, Suspense } from 'react';
import LanguageStore, { Language } from '@/stores/useLanguage';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import FormLoading from '@/components/auth/FormLoading';

interface ResetPasswordPageProps {
  params: Promise<{ lang: Language }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
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
    <div className="relative z-10 flex min-h-screen items-center justify-center pt-20">
      <Suspense fallback={<FormLoading message="Reset Password" />}>
        <ResetPasswordForm lang={language} otp={otp} userId={userId} />
      </Suspense>
    </div>
  );
}
