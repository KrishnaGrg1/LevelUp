'use client';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Language } from '@/stores/useLanguage';
import { useState } from 'react';

interface OnboardingPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { lang } = await params;
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  return <OnboardingFlow open={onboardingOpen} onOpenChange={setOnboardingOpen} lang={lang} />;
}
