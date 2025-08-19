import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';

interface CTASectionProps {
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({ className = '' }) => {
  const [isClient, setIsClient] = useState(false);
  const { language } = LanguageStore();
  const [particles, setParticles] = useState<
    Array<{
      left: number;
      top: number;
      delay: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    setIsClient(true);

    // Generate particles only on client side
    const particleArray = [];
    for (let i = 0; i < 20; i++) {
      particleArray.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 4,
      });
    }
    setParticles(particleArray);
  }, []);

  return (
    <section
      className={`relative py-32 bg-gradient-to-b from-slate-900 to-black overflow-hidden ${className}`}
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-indigo-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-conic from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating particles - only render on client side */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30"></div>
            </div>
          ))}
        </div>
      )}

      <div className="relative mx-auto max-w-4xl px-6 text-center z-10">
        {/* Main heading */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">
              {t('landing.CTASection.badgeText')}
            </span>
          </div>

          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('landing.CTASection.secondaryCTA')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('landing.CTASection.titleSub')}
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            {t('landing.CTASection.description')}
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link
            href={`/${language}/signup`}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 min-w-[200px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <span className="relative flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>{t('landing.CTASection.primaryCTA')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>

          <Link
            href={`/${language}/login`}
            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-300 bg-slate-800/50 border border-slate-600/50 rounded-2xl hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 hover:scale-105 min-w-[200px]"
          >
            <span className="flex items-center space-x-2">
              <span> {t('landing.CTASection.secondaryCTA')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">{t('landing.CTASection.trustIndicators.freeStart')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm"> {t('landing.CTASection.trustIndicators.noCreditCard')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-sm">{t('landing.CTASection.trustIndicators.quickJoin')}</span>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};
