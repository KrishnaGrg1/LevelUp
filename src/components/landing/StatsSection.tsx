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
    <section ref={statsRef} className="relative py-32 bg-gradient-to-b ">
      <div className="absolute inset-0 bg-gradient-radial from-indigo-500/5 via-transparent to-transparent"></div>
      <div className="relative mx-auto max-w-6xl px-6 text-center z-10">
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t('landing.StatsSection.titleMain')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('landing.StatsSection.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/30 hover:border-${stat.hoverColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>
              <div className="relative">
                <div
                  className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-4`}
                >
                  {index === 1
                    ? `${stat.count}M+`
                    : index === 2
                      ? `${stat.count}%`
                      : `${stat.count.toLocaleString()}+`}
                </div>
                <p className="text-slate-300 text-lg font-medium mb-2">
                  {t(`landing.${stat.label}`)}
                </p>
                <p className="text-slate-500 text-sm"> {t(`landing.${stat.description}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
