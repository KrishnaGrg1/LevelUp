import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';

interface CTASectionProps {
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({ className = '' }) => {
  const { language } = LanguageStore();

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-b from-slate-900 to-black py-32 ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Main heading */}
        <div className="mb-12">
          <div className="mb-8 inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-4 py-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">
              {t('landing.CTASection.badgeText')}
            </span>
          </div>

          <h2 className="mb-8 text-6xl leading-tight font-black md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('landing.CTASection.secondaryCTA')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('landing.CTASection.titleSub')}
            </span>
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-400 md:text-2xl">
            {t('landing.CTASection.description')}
          </p>
        </div>

        {/* CTA buttons */}
        <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            href={`/${language}/signup`}
            className="group relative inline-flex min-w-[200px] items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-50 blur transition-opacity duration-300 group-hover:opacity-75"></div>
            <span className="relative flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>{t('landing.CTASection.primaryCTA')}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href={`/${language}/login`}
            className="group inline-flex min-w-[200px] items-center justify-center rounded-2xl border border-slate-600/50 bg-slate-800/50 px-8 py-4 text-lg font-bold text-slate-300 transition-all duration-300 hover:scale-105 hover:border-slate-500/50 hover:bg-slate-700/50"
          >
            <span className="flex items-center space-x-2">
              <span> {t('landing.CTASection.secondaryCTA')}</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col items-center justify-center space-y-4 text-slate-500 sm:flex-row sm:space-y-0 sm:space-x-8">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <span className="text-sm">{t('landing.CTASection.trustIndicators.freeStart')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
            <span className="text-sm"> {t('landing.CTASection.trustIndicators.noCreditCard')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
            <span className="text-sm">{t('landing.CTASection.trustIndicators.quickJoin')}</span>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};
