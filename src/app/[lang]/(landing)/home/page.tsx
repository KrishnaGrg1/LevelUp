'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import LanguageStore from '@/stores/useLanguage';
import { PageProps } from '@/hooks/useLanguageParam';

const HomePage: React.FC<PageProps> = ({ params }) => {
  const { language } = LanguageStore();
  const statsRef = useRef<HTMLDivElement>(null);

  // Animated counter for stats
  const [userCount, setUserCount] = useState(0);
  const [questCount, setQuestCount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  // Particle animation
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; speed: number; opacity: number }[]
  >([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side to avoid hydration issues
    setIsClient(true);

    // Particle setup - only on client side
    if (typeof window !== 'undefined') {
      const arr: {
        x: number;
        y: number;
        size: number;
        speed: number;
        opacity: number;
      }[] = [];
      for (let i = 0; i < 50; i++) {
        arr.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      setParticles(arr);
    }

    // Animate particles
    const animateParticles = () => {
      setParticles(prev =>
        prev.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          opacity: particle.y > 0 ? particle.opacity : 0,
        })),
      );
    };

    const interval = setInterval(animateParticles, 50);

    // Animate stats when in view
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animate counters
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
      clearInterval(interval);
      observer.disconnect();
    };
  }, [params]);

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection
        userCount={userCount}
        questCount={questCount}
        successRate={successRate}
        statsRef={statsRef}
      />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />
    </>
  );
};

export default HomePage;
