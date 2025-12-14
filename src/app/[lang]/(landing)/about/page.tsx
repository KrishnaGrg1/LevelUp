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
    <div className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-32 text-center">
        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 mb-8 bg-white dark:bg-black">
            <Heart className="w-4 h-4 text-black dark:text-white" />
            <span className="text-sm font-medium">{t('landing.about.hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            {t('landing.about.hero.title')}
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-24 border-y border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-black">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('landing.about.story.title')}</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                {t('landing.about.story.p1')}
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                {t('landing.about.story.p2')}
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4">{t('landing.about.story.principlesTitle')}</h3>
              <ul className="space-y-4">
                {[
                  t('landing.about.story.items.0'),
                  t('landing.about.story.items.1'),
                  t('landing.about.story.items.2'),
                  t('landing.about.story.items.3'),
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-black dark:text-white" />
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('landing.about.howItWorks.title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {t('landing.about.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                className="text-center p-6 border border-gray-200 dark:border-gray-800 rounded-xl"
              >
                <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24 text-center border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('landing.about.closing.title')}
          </h2>
          <Link href={`/${language}/signup`}>
            <Button
              size="lg"
              className="rounded-full px-8 h-12 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 mt-8"
            >
              <span>{t('landing.about.closing.button')}</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
};

export default AboutPage;
