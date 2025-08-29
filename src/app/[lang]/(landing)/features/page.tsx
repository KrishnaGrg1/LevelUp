'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Language } from '@/stores/useLanguage';
import { validateLanguage } from '@/lib/language';
import { Brain, TrendingUp, Shield, Star, Clock, Globe, Sparkles } from 'lucide-react';
import { t } from '@/translations/index';
interface FeaturesPageProps {
  params: Promise<{ lang: string }>;
}

const coreFeatures = [
  {
    icon: Brain,
    title: 'FeaturesSection.coreFeatures.features.feature1.title',
    description: 'FeaturesSection.coreFeatures.features.feature1.description',
    color: 'from-indigo-500 to-purple-500',
    highlight: 'FeaturesSection.coreFeatures.features.feature1.highlight',
  },
  {
    icon: TrendingUp,
    title: 'FeaturesSection.coreFeatures.features.feature2.title',
    description: 'FeaturesSection.coreFeatures.features.feature2.description',
    color: 'from-purple-500 to-pink-500',
    highlight: '',
  },
  {
    icon: Shield,
    title: 'FeaturesSection.coreFeatures.features.feature3.title',
    description: 'FeaturesSection.coreFeatures.features.feature3.description',
    color: 'from-green-500 to-emerald-500',
    highlight: '',
  },
  {
    icon: Globe,
    title: 'FeaturesSection.coreFeatures.features.feature4.title',
    description: 'FeaturesSection.coreFeatures.features.feature4.description',
    color: 'from-blue-500 to-indigo-500',
    highlight: '',
  },
  {
    icon: Clock,
    title: 'FeaturesSection.coreFeatures.features.feature5.title',
    description: 'FeaturesSection.coreFeatures.features.feature5.description',
    color: 'from-orange-500 to-red-500',
    highlight: 'FeaturesSection.coreFeatures.features.feature5.highlight',
  },
  {
    icon: Star,
    title: 'FeaturesSection.coreFeatures.features.feature6.title',
    description: 'FeaturesSection.coreFeatures.features.feature6.description',
    color: 'from-yellow-500 to-orange-500',
    highlight: '',
  },
];

const integrations = [
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration1',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration2',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration3',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration4',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration5',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration6',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration7',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration8',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration9',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration10',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration11',
  },
  {
    name: 'FeaturesSection.integrationFeatures.integrations.integration12',
  },
];

const comparisonFeatures = [
  {
    name: 'FeaturesSection.comparisonSection.features.feature1.name',
    levelUp: '✓',
    traditionalMethods: '✗',
    otherApps: 'FeaturesSection.comparisonSection.features.feature1.otherApps',
  },
  {
    name: 'FeaturesSection.comparisonSection.features.feature2.name',
    levelUp: '✓',
    traditionalMethods: '✗',
    otherApps: 'FeaturesSection.comparisonSection.features.feature2.otherApps',
  },
  {
    name: 'FeaturesSection.comparisonSection.features.feature3.name',
    levelUp: '✓',
    traditionalMethods: '✗',
    otherApps: 'FeaturesSection.comparisonSection.features.feature3.otherApps',
  },
  {
    name: 'FeaturesSection.comparisonSection.features.feature4.name',
    levelUp: '✓',
    traditionalMethods: '✗',
    otherApps: 'FeaturesSection.comparisonSection.features.feature4.otherApps',
  },
  {
    name: 'FeaturesSection.comparisonSection.features.feature5.name',
    levelUp: '✓',
    traditionalMethods: '✗',
    otherApps: 'FeaturesSection.comparisonSection.features.feature5.otherApps',
  },
  {
    name: 'FeaturesSection.comparisonSection.features.feature6.name',
    levelUp: '✓',
    traditionalMethods: '✓',
    otherApps: 'FeaturesSection.comparisonSection.features.feature6.otherApps',
  },
];

const FeaturesPage: React.FC<FeaturesPageProps> = ({ params }) => {
  const [language, setLanguage] = useState<Language>('eng');

  useEffect(() => {
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar language={language} />

      {/* Hero Section */}
      <section className="relative py-32 text-center min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/15 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              {t('landing.FeaturesSection.hero.badge')}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {t('landing.FeaturesSection.hero.title1')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('landing.FeaturesSection.hero.title2')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('landing.FeaturesSection.hero.description')}
          </p>
        </div>
      </section>

      {/*  Features */}
      <FeaturesSection />

      {/* core Features */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t('landing.FeaturesSection.coreFeatures.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.FeaturesSection.coreFeatures.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  {feature.highlight && (
                    <div className="absolute -top-4 -right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black">
                      {t(`landing.${feature.highlight}`)}
                    </div>
                  )}
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {t(`landing.${feature.title}`)}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {' '}
                    {t(`landing.${feature.description}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="relative py-32 bg-gradient-to-b from-slate-900 to-black">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {t('landing.FeaturesSection.integrationFeatures.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.FeaturesSection.integrationFeatures.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-slate-800/20 to-slate-900/40 rounded-2xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <p className="text-slate-300 text-sm font-medium">
                  {t(`landing.${integration.name}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative py-32 bg-gradient-to-b from-black to-slate-950">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              {t('landing.FeaturesSection.comparisonSection.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('landing.FeaturesSection.comparisonSection.description')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-6 text-slate-300">
                    {' '}
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.feature')}
                  </th>
                  <th className="text-center py-4 px-6 text-purple-400 font-bold">
                    {' '}
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.levelUp')}
                  </th>
                  <th className="text-center py-4 px-6 text-slate-400">
                    {' '}
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.traditionalMethods')}
                  </th>
                  <th className="text-center py-4 px-6 text-slate-400">
                    {' '}
                    {t('landing.FeaturesSection.comparisonSection.tableHeaders.otherApps')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-900/20">
                    <td className="py-4 px-6 text-slate-300">{t(`landing.${feature.name}`)}</td>
                    <td className="py-4 px-6 text-center">
                      {feature.levelUp === '✓' ? (
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      ) : (
                        <span className="text-purple-400 font-medium">{feature.levelUp}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-500">
                      {feature.traditionalMethods}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-500">
                      {t(`landing.${feature.otherApps}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
