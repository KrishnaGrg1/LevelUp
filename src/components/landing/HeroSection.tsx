import React from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Play, Star, Shield, Users, ChevronDown } from 'lucide-react';
import { t } from '@/translations/index';
import LanguageStore from '@/stores/useLanguage';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const { language } = LanguageStore();
  return (
    <section
      className={`relative flex min-h-screen items-center overflow-hidden py-32 text-center ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* Floating Badge */}
        <div className="animate-float mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-6 py-3 text-sm font-medium text-indigo-300 backdrop-blur-sm">
          <Sparkles className="animate-spin-slow h-4 w-4" />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text font-semibold text-transparent">
            {t('landing.heroSection.batchText')}
          </span>
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
        </div>

        {/* Enhanced Title */}
        <h1 className="mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-6xl leading-tight font-black tracking-tight text-transparent md:text-8xl">
          {t('landing.heroSection.titleMain')}
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            {t('landing.heroSection.titleSub')}
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed font-light text-slate-300 md:text-2xl">
          {t('landing.heroSection.desc1')}{' '}
          <span className="font-semibold text-indigo-400">
            {t('landing.heroSection.descHighlight1')}
          </span>
          .{t('landing.heroSection.desc2')}
          <span className="font-semibold text-purple-400">
            {' '}
            {t('landing.heroSection.descHighlight1')}
          </span>
        </p>

        {/* Enhanced CTA Buttons */}
        <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            href={`/${language}/signup`}
            className="group relative inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-10 py-5 text-xl font-bold text-white transition-all duration-500 hover:-translate-y-1 hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/30"
          >
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100"></div>
            <Zap className="relative z-10 h-6 w-6 group-hover:animate-bounce" />
            <span className="relative z-10">{t('landing.heroSection.ctaStart')}</span>
            <div className="relative z-10 h-2 w-2 animate-ping rounded-full bg-white"></div>
          </Link>
          <button className="group inline-flex items-center gap-3 rounded-2xl border-2 border-slate-600 px-10 py-5 text-xl font-semibold text-slate-300 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-indigo-400 hover:bg-indigo-500/10 hover:text-white hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-5 w-5 text-white" />
            </div>
            {t('landing.heroSection.watchDemo')}
          </button>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-3 rounded-full border border-slate-700/50 bg-slate-800/30 px-4 py-2 backdrop-blur-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 animate-pulse fill-yellow-400 text-yellow-400"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{t('landing.heroSection.rating')}</span>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-700/50 bg-slate-800/30 px-4 py-2 backdrop-blur-sm">
            <Shield className="h-4 w-4 animate-pulse text-green-400" />
            <span className="text-sm font-medium">{t('landing.heroSection.secure')}</span>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-700/50 bg-slate-800/30 px-4 py-2 backdrop-blur-sm">
            <Users className="h-4 w-4 animate-pulse text-blue-400" />
            <span className="text-sm font-medium">{t('landing.heroSection.activeUsers')}</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
          <ChevronDown className="h-6 w-6 text-slate-400" />
        </div>
      </div>
    </section>
  );
};
