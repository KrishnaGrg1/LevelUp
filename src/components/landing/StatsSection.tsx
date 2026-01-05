import { t } from '@/translations';
import React from 'react';

interface StatsItem {
  count: number;
  label: string;
  description: string;
  gradient: string;
  hoverColor: string;
  bgGradient: string;
}

interface StatsSectionProps {
  userCount: number;
  questCount: number;
  successRate: number;
  statsRef: React.RefObject<HTMLDivElement | null>;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  userCount,
  questCount,
  successRate,
  statsRef,
}) => {
  const stats: StatsItem[] = [
    {
      count: userCount,
      label: 'StatsSection.stats.0.label',
      description: 'StatsSection.stats.0.description',
      gradient: 'from-indigo-400 to-purple-400',
      hoverColor: 'indigo-500/50',
      bgGradient: 'from-indigo-500/5 to-purple-500/5',
    },
    {
      count: Math.round(questCount / 100000) / 10,
      label: 'StatsSection.stats.1.label',
      description: 'StatsSection.stats.1.description',
      gradient: 'from-purple-400 to-pink-400',
      hoverColor: 'purple-500/50',
      bgGradient: 'from-purple-500/5 to-pink-500/5',
    },
    {
      count: successRate,
      label: 'StatsSection.stats.2.label',
      description: 'StatsSection.stats.2.description',
      gradient: 'from-green-400 to-emerald-400',
      hoverColor: 'green-500/50',
      bgGradient: 'from-green-500/5 to-emerald-500/5',
    },
  ];

  return (
    <section ref={statsRef} className="relative bg-gradient-to-b py-32">
      <div className="bg-gradient-radial absolute inset-0 from-indigo-500/5 via-transparent to-transparent"></div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="mb-16">
          <h2 className="mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            {t('landing.StatsSection.titleMain')}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-400">
            {t('landing.StatsSection.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative rounded-3xl border border-slate-700/30 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-8 hover:border-${stat.hoverColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              ></div>
              <div className="relative">
                <div
                  className={`bg-gradient-to-r text-5xl font-bold md:text-6xl ${stat.gradient} mb-4 bg-clip-text text-transparent`}
                >
                  {index === 1
                    ? `${stat.count}M+`
                    : index === 2
                      ? `${stat.count}%`
                      : `${stat.count.toLocaleString()}+`}
                </div>
                <p className="mb-2 text-lg font-medium text-slate-300">
                  {t(`landing.${stat.label}`)}
                </p>
                <p className="text-sm text-slate-500"> {t(`landing.${stat.description}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
