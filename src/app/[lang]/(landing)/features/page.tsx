'use client';

import React, { useEffect } from 'react';

import { CoreFeatures } from '@/components/landing/minimal/CoreFeatures';
import LanguageStore from '@/stores/useLanguage';
import { validateLanguage } from '@/lib/language';
import { Brain, TrendingUp, Shield, Star, Clock, Sparkles, Check } from 'lucide-react';
import { FinalCTA } from '@/components/landing/minimal/FinalCTA';
import { Card, CardContent } from '@/components/ui/card';

interface FeaturesPageProps {
  params: Promise<{ lang: string }>;
}

// ... imports
import { t } from '@/translations';

export default function FeaturesPage({ params }: FeaturesPageProps) {
  const { setLanguage } = LanguageStore();

  useEffect(() => {
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  const coreFeatures = [
    {
      icon: Brain,
      title: t('landing.FeaturesSection.coreFeatures.features.feature1.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature1.description'),
      highlight: t('landing.FeaturesSection.coreFeatures.features.feature1.highlight'),
    },
    {
      icon: TrendingUp,
      title: t('landing.FeaturesSection.coreFeatures.features.feature2.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature2.description'),
      highlight: t('landing.FeaturesSection.coreFeatures.features.feature2.highlight'),
    },
    {
      icon: Shield,
      title: t('landing.FeaturesSection.coreFeatures.features.feature3.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature3.description'),
      highlight: t('landing.FeaturesSection.coreFeatures.features.feature3.highlight'),
    },
    {
      icon: Clock,
      title: t('landing.FeaturesSection.coreFeatures.features.feature4.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature4.description'),
      highlight: t('landing.FeaturesSection.coreFeatures.features.feature4.highlight'),
    },
    {
      icon: Star,
      title: t('landing.FeaturesSection.coreFeatures.features.feature5.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature5.description'),
      highlight: t('landing.FeaturesSection.coreFeatures.features.feature5.highlight'),
    },
  ];

  const comparisonFeatures = [
    {
      name: t('landing.FeaturesSection.comparisonSection.features.feature1.name'),
      levelUp: true,
      traditionalMethods: false,
      otherApps: t('landing.FeaturesSection.comparisonSection.features.feature1.otherApps'),
    },
    {
      name: t('landing.FeaturesSection.comparisonSection.features.feature2.name'),
      levelUp: true,
      traditionalMethods: true,
      otherApps: t('landing.FeaturesSection.comparisonSection.features.feature2.otherApps'),
    },
    {
      name: t('landing.FeaturesSection.comparisonSection.features.feature3.name'),
      levelUp: true,
      traditionalMethods: false,
      otherApps: t('landing.FeaturesSection.comparisonSection.features.feature3.otherApps'),
    },
    {
      name: t('landing.FeaturesSection.comparisonSection.features.feature4.name'),
      levelUp: true,
      traditionalMethods: false,
      otherApps: t('landing.FeaturesSection.comparisonSection.features.feature4.otherApps'),
    },
    {
      name: t('landing.FeaturesSection.comparisonSection.features.feature5.name'),
      levelUp: true,
      traditionalMethods: false,
      otherApps: t('landing.FeaturesSection.comparisonSection.features.feature5.otherApps'),
    },
    {
      name: t('landing.FeaturesSection.comparisonSection.features.feature6.name'),
      levelUp: true,
      traditionalMethods: true,
      otherApps: t('landing.FeaturesSection.comparisonSection.features.feature6.otherApps'),
    },
  ];

  return (
    <div className="bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Hero Section */}
      <section className="relative py-32 text-center">
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-white px-3 py-1 dark:border-gray-800 dark:bg-black">
            <Sparkles className="h-4 w-4 text-black dark:text-white" />
            <span className="text-sm font-medium">{t('landing.FeaturesSection.hero.badge')}</span>
          </div>

          <h1 className="mb-8 text-5xl leading-tight font-bold tracking-tight md:text-7xl">
            {t('landing.FeaturesSection.hero.title1')} <br className="hidden md:block" />
            {t('landing.FeaturesSection.hero.title2')}
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-500 dark:text-gray-400">
            {t('landing.FeaturesSection.hero.description')}
          </p>
        </div>
      </section>

      {/*  Features */}
      <CoreFeatures />

      {/* core Features (Grid) */}
      <section className="relative border-y border-gray-100 bg-gray-50 py-24 dark:border-gray-900 dark:bg-black">
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              {t('landing.FeaturesSection.coreFeatures.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400">
              {t('landing.FeaturesSection.coreFeatures.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group relative rounded-2xl border border-gray-100 bg-white p-8 transition-colors duration-300 hover:border-black dark:border-gray-800 dark:bg-gray-900 dark:hover:border-white"
              >
                <CardContent className="relative">
                  {feature.highlight && (
                    <div className="absolute -top-12 -right-4 rounded-full bg-black px-3 py-1 text-xs font-bold tracking-wide text-white uppercase dark:bg-white dark:text-black">
                      {feature.highlight}
                    </div>
                  )}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                    <feature.icon
                      className="h-6 w-6 text-black dark:text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative border-t border-gray-100 bg-gray-50 py-32 dark:border-gray-900 dark:bg-black">
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              {t('landing.FeaturesSection.comparisonSection.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400">
              {t('landing.FeaturesSection.comparisonSection.description')}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-8 py-6 text-left text-lg font-bold text-black dark:text-white">
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.feature')}
                  </th>
                  <th className="bg-gray-50 px-8 py-6 text-center text-lg font-bold text-black dark:bg-gray-800/50 dark:text-white">
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.levelUp')}
                  </th>
                  <th className="px-8 py-6 text-center font-medium text-gray-500">
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.traditionalMethods')}
                  </th>
                  <th className="px-8 py-6 text-center font-medium text-gray-500">
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.otherApps')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-8 py-4 font-medium text-black dark:text-white">
                      {feature.name}
                    </td>
                    <td className="bg-gray-50 px-8 py-4 text-center dark:bg-gray-800/50">
                      {feature.levelUp ? (
                        <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-black dark:bg-white">
                          <Check className="h-3 w-3 text-white dark:text-black" />
                        </div>
                      ) : null}
                    </td>
                    <td className="px-8 py-4 text-center text-gray-400">
                      {feature.traditionalMethods ? (
                        <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                          <Check className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        </div>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-center text-sm text-gray-500">
                      {feature.otherApps}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
