'use client';
import LanguageStore from '@/stores/useLanguage';
import React, { useEffect } from 'react';
import { Hero } from '@/components/landing/minimal/Hero';
import { ProblemSolution } from '@/components/landing/minimal/ProblemSolution';
import { CoreFeatures } from '@/components/landing/minimal/CoreFeatures';
import { HowItWorks } from '@/components/landing/minimal/HowItWorks';
import { SocialProof } from '@/components/landing/minimal/SocialProof';
import { FinalCTA } from '@/components/landing/minimal/FinalCTA';

import { validateLanguage } from '@/lib/language';
import { PageProps } from '@/hooks/useLanguageParam';

const HomePage: React.FC<PageProps> = ({ params }) => {
  const { setLanguage } = LanguageStore();

  useEffect(() => {
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  return (
    <div className="font-sans antialiased text-gray-900 bg-white dark:bg-black dark:text-white">
      <Hero />
      <ProblemSolution />
      <CoreFeatures />
      <HowItWorks />
      <SocialProof />
      <FinalCTA />
    </div>
  );
};

export default HomePage;
