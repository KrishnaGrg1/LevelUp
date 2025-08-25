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
    title: 'FeaturesSection.feature1Title',
    description: 'FeaturesSection.feature1Desc',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    hoverColor: 'indigo-500/50',
    bgGradient: 'from-indigo-500/5 to-purple-500/5',
  },
  {
    icon: TrendingUp,
    title: 'FeaturesSection.feature2Title',
    description: 'FeaturesSection.feature2Desc',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    hoverColor: 'purple-500/50',
    bgGradient: 'from-purple-500/5 to-pink-500/5',
  },
  {
    icon: GamepadIcon,
    title: 'FeaturesSection.feature3Title',
    description: 'FeaturesSection.feature3Desc',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    hoverColor: 'green-500/50',
    bgGradient: 'from-green-500/5 to-emerald-500/5',
  },
  {
    icon: Globe,
    title: 'FeaturesSection.feature4Title',
    description: 'FeaturesSection.feature4Desc',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    hoverColor: 'blue-500/50',
    bgGradient: 'from-blue-500/5 to-cyan-500/5',
  },
  {
    icon: Clock,
    title: 'FeaturesSection.feature5Title',
    description: 'FeaturesSection.feature5Desc',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    hoverColor: 'orange-500/50',
    bgGradient: 'from-orange-500/5 to-red-500/5',
  },
  {
    icon: Heart,
    title: 'FeaturesSection.feature6Title',
    description: 'FeaturesSection.feature6Desc',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    hoverColor: 'pink-500/50',
    bgGradient: 'from-pink-500/5 to-rose-500/5',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative mx-auto max-w-7xl px-6 z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            {t('landing.FeaturesSection.badgeText')}
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t('landing.FeaturesSection.badge')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('landing.FeaturesSection.description')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 hover:border-${feature.hoverColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-${feature.color}-500/10`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {t(`landing.${feature.title}`)}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {t(`landing.${feature.description}`)}
                  </p>
                  <div
                    className={`flex items-center text-${feature.color}-400 group-hover:text-${feature.color}-300 transition-colors cursor-pointer`}
                  >
                    <span className="text-sm font-medium">
                      {' '}
                      {t('landing.FeaturesSection.readMore')}
                    </span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
