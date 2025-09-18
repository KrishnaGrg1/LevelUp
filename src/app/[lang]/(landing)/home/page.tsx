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
import { SearchBar } from '@/components/landing/search';
import { CategoryFilter } from '@/components/landing/categoryFilter';
import { CommunityCard } from '@/components/landing/communityCard';
import { CommunityList } from '@/components/landing/communityLists';

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
      <CategoryFilter
        categories={[
          { name: 'Technology', count: 120, active: true },
          { name: 'Programming', count: 95 },
          { name: 'Design', count: 78 },
          { name: 'Web Development', count: 150 },
          { name: 'Mobile Apps', count: 65 },
        ]}
      />
      <SearchBar />
      <CommunityList
        communities={[
          {
            name: 'Web Developers',
            description: 'A place for web dev enthusiasts to share knowledge.',
            members: 1245,
            posts: 345,
            tags: ['HTML', 'CSS', 'JavaScript'],
            rating: 4.5,
            trending: true,
            level: 'Intermediate',
          },
          {
            name: 'React Lovers',
            description: 'All things React.js and beyond.',
            members: 987,
            posts: 210,
            tags: ['React', 'Hooks', 'TypeScript'],
            rating: 4.8,
            level: 'Advanced',
          },
          {
            name: 'Node.js Ninjas',
            description: 'Server-side JavaScript community.',
            members: 563,
            posts: 122,
            tags: ['Node.js', 'Express', 'APIs'],
            rating: 4.2,
            trending: true,
            level: 'Beginner',
          },
          {
            name: 'UI/UX Designers',
            description: 'Discuss design trends and usability tips.',
            members: 782,
            posts: 198,
            tags: ['UI', 'UX', 'Figma'],
            rating: 4.6,
            level: 'Intermediate',
          },
          {
            name: 'Fullstack Devs',
            description: 'Everything from frontend to backend development.',
            members: 1342,
            posts: 412,
            tags: ['Fullstack', 'JavaScript', 'APIs'],
            rating: 4.7,
            trending: true,
            level: 'Advanced',
          },
        ]}
      />

      {/* <CommunityCard
        name="Sample Community"
        description="This is a sample community description."
        members={100}
        posts={50}
        imageUrl="https://via.placeholder.com/150"
        category="General"
        isJoined={false}
      /> */}

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
