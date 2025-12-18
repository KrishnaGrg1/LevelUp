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
      className={`relative py-32 text-center overflow-hidden min-h-screen flex items-center ${className}`}
    >
      <div className="relative mx-auto max-w-6xl px-4 z-10">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm animate-float">
          <Sparkles className="h-4 w-4 animate-spin-slow" />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
            {t('landing.heroSection.batchText')}
          </span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Enhanced Title */}
        <h1 className="mb-8 text-6xl md:text-8xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight tracking-tight">
          {t('landing.heroSection.titleMain')}
          <br />
          <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {t('landing.heroSection.titleSub')}
          </span>
        </h1>

        <p className="mb-12 text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
          {t('landing.heroSection.desc1')}{' '}
          <span className="text-indigo-400 font-semibold">
            {t('landing.heroSection.descHighlight1')}
          </span>
          .{t('landing.heroSection.desc2')}
          <span className="text-purple-400 font-semibold">
            {' '}
            {t('landing.heroSection.descHighlight1')}
          </span>
        </p>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link
            href={`/${language}/signup`}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl font-bold text-xl text-white transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur animate-pulse"></div>
            <Zap className="h-6 w-6 group-hover:animate-bounce relative z-10" />
            <span className="relative z-10">{t('landing.heroSection.ctaStart')}</span>
            <div className="relative z-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
          </Link>
          <button className="group inline-flex items-center gap-3 px-10 py-5 border-2 border-slate-600 rounded-2xl font-semibold text-xl text-slate-300 hover:border-indigo-400 hover:text-white transition-all duration-500 hover:bg-indigo-500/10 backdrop-blur-sm hover:scale-105 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="h-5 w-5 text-white ml-1" />
            </div>
            {t('landing.heroSection.watchDemo')}
          </button>
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400">
          <div className="flex items-center gap-3 bg-slate-800/30 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{t('landing.heroSection.rating')}</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/30 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50">
            <Shield className="h-4 w-4 text-green-400 animate-pulse" />
            <span className="text-sm font-medium">{t('landing.heroSection.secure')}</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/30 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50">
            <Users className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-sm font-medium">{t('landing.heroSection.activeUsers')}</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-slate-400" />
        </div>
      </div>
    </section>
  );
};
