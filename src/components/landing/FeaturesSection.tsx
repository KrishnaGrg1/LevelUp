'use client';

import React from 'react';
import {
  Brain,
  TrendingUp,
  GamepadIcon,
  Globe,
  Clock,
  Heart,
  ArrowRight,
  Rocket,
} from 'lucide-react';
import { t } from '@/translations';

const features = [
  {
    icon: Brain,
    title: 'FeaturesSection.features.feature1.title',
    description: 'FeaturesSection.features.feature1.description',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    hoverColor: 'indigo-500/50',
    bgGradient: 'from-indigo-500/5 to-purple-500/5',
  },
  {
    icon: TrendingUp,
    title: 'FeaturesSection.features.feature2.title',
    description: 'FeaturesSection.features.feature2.description',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    hoverColor: 'purple-500/50',
    bgGradient: 'from-purple-500/5 to-pink-500/5',
  },
  {
    icon: GamepadIcon,
    title: 'FeaturesSection.features.feature3.title',
    description: 'FeaturesSection.features.feature3.description',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    hoverColor: 'green-500/50',
    bgGradient: 'from-green-500/5 to-emerald-500/5',
  },
  {
    icon: Globe,
    title: 'FeaturesSection.features.feature4.title',
    description: 'FeaturesSection.features.feature4.description',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    hoverColor: 'blue-500/50',
    bgGradient: 'from-blue-500/5 to-cyan-500/5',
  },
  {
    icon: Clock,
    title: 'FeaturesSection.features.feature5.title',
    description: 'FeaturesSection.features.feature5.description',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    hoverColor: 'orange-500/50',
    bgGradient: 'from-orange-500/5 to-red-500/5',
  },
  {
    icon: Heart,
    title: 'FeaturesSection.features.feature6.title',
    description: 'FeaturesSection.feature6Desc',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    hoverColor: 'pink-500/50',
    bgGradient: 'from-pink-500/5 to-rose-500/5',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-slate-950 to-slate-900 py-32">
      <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <Rocket className="h-4 w-4" />
            {t('landing.FeaturesSection.features.badgeText')}
          </div>
          <h2 className="mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            {t('landing.FeaturesSection.features.badge')}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-400">
            {t('landing.FeaturesSection.features.description')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 hover:border-${feature.hoverColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-${feature.color}-500/10`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                ></div>
                <div className="relative">
                  <div
                    className={`h-16 w-16 bg-gradient-to-br ${feature.gradient} mb-6 flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-white">
                    {t(`landing.${feature.title}`)}
                  </h3>
                  <p className="mb-6 leading-relaxed text-slate-400">
                    {t(`landing.${feature.description}`)}
                  </p>
                  <div
                    className={`flex items-center text-${feature.color}-400 group-hover:text-${feature.color}-300 cursor-pointer transition-colors`}
                  >
                    <span className="text-sm font-medium">
                      {' '}
                      {t('landing.FeaturesSection.readMore')}
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
