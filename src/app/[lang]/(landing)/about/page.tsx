'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FinalCTA } from '@/components/landing/minimal/FinalCTA';
import LanguageStore from '@/stores/useLanguage';
import { validateLanguage } from '@/lib/language';
import { Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/translations';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

const AboutPage: React.FC<AboutPageProps> = ({ params }) => {
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  return (
    <div className="bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Hero Section */}
      <section className="relative py-32 text-center">
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-white px-3 py-1 dark:border-gray-800 dark:bg-black">
            <Heart className="h-4 w-4 text-black dark:text-white" />
            <span className="text-sm font-medium">{t('landing.about.hero.badge')}</span>
          </div>

          <h1 className="mb-8 text-5xl leading-tight font-bold tracking-tight md:text-7xl">
            {t('landing.about.hero.title')}
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative border-y border-gray-100 bg-gray-50 py-24 dark:border-gray-900 dark:bg-black">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">{t('landing.about.story.title')}</h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                {t('landing.about.story.p1')}
              </p>
              <p className="text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                {t('landing.about.story.p2')}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-xl font-bold">{t('landing.about.story.principlesTitle')}</h3>
              <ul className="space-y-4">
                {[
                  t('landing.about.story.items.0'),
                  t('landing.about.story.items.1'),
                  t('landing.about.story.items.2'),
                  t('landing.about.story.items.3'),
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-black dark:text-white" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      {/* How It Works */}
      <section className="relative py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              {t('landing.about.howItWorks.title')}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {t('landing.about.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                title: t('landing.about.howItWorks.steps.0.title'),
                desc: t('landing.about.howItWorks.steps.0.desc'),
              },
              {
                title: t('landing.about.howItWorks.steps.1.title'),
                desc: t('landing.about.howItWorks.steps.1.desc'),
              },
              {
                title: t('landing.about.howItWorks.steps.2.title'),
                desc: t('landing.about.howItWorks.steps.2.desc'),
              },
              {
                title: t('landing.about.howItWorks.steps.3.title'),
                desc: t('landing.about.howItWorks.steps.3.desc'),
              },
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 p-6 text-center dark:border-gray-800"
              >
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-black font-bold text-white dark:bg-white dark:text-black">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="border-t border-gray-100 py-24 text-center dark:border-gray-900">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            {t('landing.about.closing.title')}
          </h2>
          <Link href={`/${language}/signup`}>
            <Button
              size="lg"
              className="mt-8 h-12 rounded-full bg-black px-8 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <span>{t('landing.about.closing.button')}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
};

export default AboutPage;
