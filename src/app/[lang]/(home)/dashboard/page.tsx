'use client';

import MyCommunities from '@/components/landing/myCommunities';
import StatsSummary from '@/components/landing/statsSummary';
import TodaysQuests from '@/components/landing/todaysQuests';
import LanguageStore, { Language } from '@/stores/useLanguage';
import { validateLanguage } from '@/translations';
import { useEffect } from 'react';

interface DashboardPageProps {
  params: Promise<{
    lang: Language;
  }>;
}
export default function DashboardPage({ params }: DashboardPageProps) {
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    // Get language from params and validate it
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);
  return (
    <div>
      <MyCommunities />
      <TodaysQuests />
      <StatsSummary />
    </div>
  );
}
