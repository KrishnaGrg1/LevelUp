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
    <section className="relative w-full overflow-hidden bg-white py-20 text-black transition-colors duration-300 md:py-32 dark:bg-black dark:text-white">
      <div className="container mx-auto flex flex-col items-center px-6 text-center">
        {/* Headline */}
        <h1 className="mb-6 max-w-4xl text-4xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
          {t('landing.heroSection.titleMain')}
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-2xl text-lg leading-relaxed font-normal text-gray-500 md:text-xl dark:text-gray-400">
          {t('landing.heroSection.desc')}
        </p>

        {/* CTAs */}
        <div className="mb-20 flex flex-col gap-4 sm:flex-row">
          <Link href={`/${language}/signup`}>
            <Button
              size="lg"
              className="h-12 rounded-full bg-black px-8 text-base font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {t('landing.heroSection.ctaStart')}
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              variant="outline"
              size="lg"
              className="group h-12 rounded-full border-gray-200 px-8 text-base font-medium text-black transition-all hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
            >
              {t('landing.heroSection.ctaLearn')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* App Interface Preview */}
        <div className="relative w-full max-w-5xl rounded-2xl border border-gray-200 bg-gray-50/50 p-2 shadow-2xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
          {/* Window Chrome */}
          <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <div className="h-3 w-3 rounded-full bg-red-400/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <div className="h-3 w-3 rounded-full bg-green-400/80" />
              <div className="ml-4 flex flex-1 justify-center">
                <div className="flex h-6 w-64 items-center justify-center gap-2 rounded-lg bg-gray-100 text-[10px] font-medium text-gray-400 dark:bg-gray-800">
                  <Search className="h-3 w-3" />
                  <span>{t('landing.heroSection.dashboard.url')}</span>
                </div>
              </div>
            </div>

            {/* App Layout */}
            <div className="flex h-[400px] md:h-[500px]">
              {/* Sidebar */}
              <div className="hidden w-64 flex-col border-r border-gray-100 bg-gray-50/30 p-4 text-left md:flex dark:border-gray-800 dark:bg-gray-900/30">
                <div className="mb-8 flex items-center gap-2 px-2">
                  {/* <div className="w-6 h-6 bg-black dark:bg-white rounded-md" /> */}
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <Sparkle className="h-6 w-6" />
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
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        item.active
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  ))}
                </nav>

                <div className="mt-auto">
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings className="h-4 w-4" />
                    {t('landing.heroSection.dashboard.sidebar.settings')}
                  </div>
                </div>
              </div>

              {/* Main Area */}
              <div className="relative flex-1 overflow-hidden bg-white dark:bg-black">
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6 md:px-8 dark:border-gray-800">
                  <h2 className="text-lg font-bold">{t('landing.heroSection.dashboard.header')}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-orange-600 dark:border-orange-800/50 dark:bg-orange-900/20 dark:text-orange-400">
                      <Flame className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-bold">
                        {t('landing.heroSection.dashboard.streak')}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" />
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 text-left md:p-8">
                  <div className="mb-8">
                    <p className="mb-1 text-sm text-gray-500">
                      {t('landing.heroSection.dashboard.greeting')}
                    </p>
                    <h3 className="text-2xl font-bold">
                      {t('landing.heroSection.dashboard.subGreeting')}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                        className="group/card cursor-default rounded-xl border border-gray-200 p-4 transition-colors hover:border-black dark:border-gray-800 dark:hover:border-white"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <span className="rounded-md bg-gray-50 px-2 py-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:bg-gray-900">
                            {quest.type}
                          </span>
                          <span className="text-xs font-bold text-black dark:text-white">
                            {quest.xp}
                          </span>
                        </div>
                        <h4 className="mb-1 font-bold">{quest.title}</h4>
                        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                          <span>{t('landing.heroSection.dashboard.dailyQuest')}</span>
                          <span>•</span>
                          <span>{quest.time}</span>
                        </div>
                        <div className="flex h-8 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs font-medium text-gray-400 transition-colors group-hover/card:border-black group-hover/card:text-black dark:border-gray-700 dark:group-hover/card:border-white dark:group-hover/card:text-white">
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
