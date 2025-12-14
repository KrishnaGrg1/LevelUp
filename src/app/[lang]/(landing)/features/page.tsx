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
    <div className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-32 text-center">
        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 mb-8 bg-white dark:bg-black">
            <Sparkles className="w-4 h-4 text-black dark:text-white" />
            <span className="text-sm font-medium">{t('landing.FeaturesSection.hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            {t('landing.FeaturesSection.hero.title1')} <br className="hidden md:block" />
            {t('landing.FeaturesSection.hero.title2')}
          </h1>

          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('landing.FeaturesSection.hero.description')}
          </p>
        </div>
      </section>

      {/*  Features */}
      <CoreFeatures />

      {/* core Features (Grid) */}
      <section className="relative py-24 bg-gray-50 dark:bg-black border-y border-gray-100 dark:border-gray-900">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('landing.FeaturesSection.coreFeatures.title')}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('landing.FeaturesSection.coreFeatures.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group relative p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors duration-300"
              >
                <CardContent className="relative">
                  {feature.highlight && (
                    <div className="absolute -top-12 -right-4 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold uppercase tracking-wide">
                      {feature.highlight}
                    </div>
                  )}
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon
                      className="w-6 h-6 text-black dark:text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative py-32 bg-gray-50 dark:bg-black border-t border-gray-100 dark:border-gray-900">
        <div className="relative mx-auto max-w-5xl px-6 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('landing.FeaturesSection.comparisonSection.title')}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t('landing.FeaturesSection.comparisonSection.description')}
            </p>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-6 px-8 text-black dark:text-white font-bold text-lg">
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.feature')}
                  </th>
                  <th className="text-center py-6 px-8 text-black dark:text-white font-bold text-lg bg-gray-50 dark:bg-gray-800/50">
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.levelUp')}
                  </th>
                  <th className="text-center py-6 px-8 text-gray-500 font-medium">
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.traditionalMethods')}
                  </th>
                  <th className="text-center py-6 px-8 text-gray-500 font-medium">
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.otherApps')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-4 px-8 text-black dark:text-white font-medium">
                      {feature.name}
                    </td>
                    <td className="py-4 px-8 text-center bg-gray-50 dark:bg-gray-800/50">
                      {feature.levelUp ? (
                        <div className="w-6 h-6 bg-black dark:bg-white rounded-full mx-auto flex items-center justify-center">
                          <Check className="w-3 h-3 text-white dark:text-black" />
                        </div>
                      ) : null}
                    </td>
                    <td className="py-4 px-8 text-center text-gray-400">
                      {feature.traditionalMethods ? (
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                          <Check className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </div>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                    <td className="py-4 px-8 text-center text-gray-500 text-sm">
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
