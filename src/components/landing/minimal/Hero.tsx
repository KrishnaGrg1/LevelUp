import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  LayoutDashboard,
  Map,
  Users,
  Settings,
  Flame,
  Trophy,
  Search,
  Sparkle,
} from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

export const Hero = () => {
  const { language } = LanguageStore();

  return (
    <section className="relative w-full py-20 md:py-32 bg-white dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
          {t('landing.heroSection.titleMain')}
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl font-normal leading-relaxed">
          {t('landing.heroSection.desc')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href={`/${language}/signup`}>
            <Button
              size="lg"
              className="px-8 h-12 text-base font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full transition-all"
            >
              {t('landing.heroSection.ctaStart')}
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              variant="outline"
              size="lg"
              className="px-8 h-12 text-base font-medium border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-full transition-all group"
            >
              {t('landing.heroSection.ctaLearn')}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* App Interface Preview */}
        <div className="relative w-full max-w-5xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-2 shadow-2xl backdrop-blur-sm">
          {/* Window Chrome */}
          <div className="w-full bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
              <div className="ml-4 flex-1 flex justify-center">
                <div className="h-6 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
                  <Search className="w-3 h-3" />
                  <span>{t('landing.heroSection.dashboard.url')}</span>
                </div>
              </div>
            </div>

            {/* App Layout */}
            <div className="flex h-[400px] md:h-[500px]">
              {/* Sidebar */}
              <div className="hidden md:flex w-64 border-r border-gray-100 dark:border-gray-800 flex-col p-4 bg-gray-50/30 dark:bg-gray-900/30 text-left">
                <div className="flex items-center gap-2 mb-8 px-2">
                  {/* <div className="w-6 h-6 bg-black dark:bg-white rounded-md" /> */}
                  <span className="font-bold text-sm flex items-center gap-2">
                    <Sparkle className="w-6 h-6 " />
                    LevelUp
                  </span>
                </div>

                <nav className="space-y-1">
                  {[
                    {
                      icon: LayoutDashboard,
                      label: t('landing.heroSection.dashboard.sidebar.dashboard'),
                      active: true,
                    },
                    {
                      icon: Map,
                      label: t('landing.heroSection.dashboard.sidebar.quests'),
                      active: false,
                    },
                    {
                      icon: Users,
                      label: t('landing.heroSection.dashboard.sidebar.community'),
                      active: false,
                    },
                    {
                      icon: Trophy,
                      label: t('landing.heroSection.dashboard.sidebar.leaderboard'),
                      active: false,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.active
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                  ))}
                </nav>

                <div className="mt-auto">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings className="w-4 h-4" />
                    {t('landing.heroSection.dashboard.sidebar.settings')}
                  </div>
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 overflow-hidden bg-white dark:bg-black relative">
                {/* Header */}
                <div className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 md:px-8">
                  <h2 className="font-bold text-lg">{t('landing.heroSection.dashboard.header')}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800/50">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold">
                        {t('landing.heroSection.dashboard.streak')}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 md:p-8 text-left">
                  <div className="mb-8">
                    <p className="text-gray-500 text-sm mb-1">
                      {t('landing.heroSection.dashboard.greeting')}
                    </p>
                    <h3 className="text-2xl font-bold">
                      {t('landing.heroSection.dashboard.subGreeting')}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: t('landing.heroSection.dashboard.cards.card1.title'),
                        xp: t('landing.heroSection.dashboard.cards.card1.xp'),
                        time: t('landing.heroSection.dashboard.cards.card1.time'),
                        type: t('landing.heroSection.dashboard.cards.card1.type'),
                      },
                      {
                        title: t('landing.heroSection.dashboard.cards.card2.title'),
                        xp: t('landing.heroSection.dashboard.cards.card2.xp'),
                        time: t('landing.heroSection.dashboard.cards.card2.time'),
                        type: t('landing.heroSection.dashboard.cards.card2.type'),
                      },
                      {
                        title: t('landing.heroSection.dashboard.cards.card3.title'),
                        xp: t('landing.heroSection.dashboard.cards.card3.xp'),
                        time: t('landing.heroSection.dashboard.cards.card3.time'),
                        type: t('landing.heroSection.dashboard.cards.card3.type'),
                      },
                    ].map((quest, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors cursor-default group/card"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md">
                            {quest.type}
                          </span>
                          <span className="text-xs font-bold text-black dark:text-white">
                            {quest.xp}
                          </span>
                        </div>
                        <h4 className="font-bold mb-1">{quest.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <span>{t('landing.heroSection.dashboard.dailyQuest')}</span>
                          <span>•</span>
                          <span>{quest.time}</span>
                        </div>
                        <div className="w-full h-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs font-medium text-gray-400 group-hover/card:border-black dark:group-hover/card:border-white group-hover/card:text-black dark:group-hover/card:text-white transition-colors">
                          {t('landing.heroSection.dashboard.startQuest')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gradient Fade Overlay to merge efficiently with background if needed, but border containment is better. Keeping neat. */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
