'use client';
import LanguageStore from '@/stores/useLanguage';
import React, { useEffect, useRef, useState } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';

import { validateLanguage } from '@/lib/language';
import { PageProps } from '@/hooks/useLanguageParam';

const HomePage: React.FC<PageProps> = ({ params }) => {
  const statsRef = useRef<HTMLDivElement>(null);
  const { setLanguage } = LanguageStore();
  const [userCount, setUserCount] = useState(0);
  const [questCount, setQuestCount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let currentUser = 0;
            let currentQuest = 0;
            let currentSuccess = 0;

            const targetUser = 12547;
            const targetQuest = 2850000;
            const targetSuccess = 94;

            const duration = 2000;
            const increment = 50;

            const timer = setInterval(() => {
              currentUser += Math.ceil(targetUser / (duration / increment));
              currentQuest += Math.ceil(targetQuest / (duration / increment));
              currentSuccess += Math.ceil(targetSuccess / (duration / increment));

              if (currentUser >= targetUser) {
                currentUser = targetUser;
                currentQuest = targetQuest;
                currentSuccess = targetSuccess;
                clearInterval(timer);
              }

              setUserCount(currentUser);
              setQuestCount(currentQuest);
              setSuccessRate(currentSuccess);
            }, increment);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [params]);
  useEffect(() => {
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params]);
  return (
    <>
      {/* Hero and Feature Sections */}
      <HeroSection />
      {/* New Components */}

      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection
        userCount={userCount}
        questCount={questCount}
        successRate={successRate}
        statsRef={statsRef}
      />

      {/* Testimonials and CTA */}
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default HomePage;
