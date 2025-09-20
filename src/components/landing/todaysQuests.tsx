'use client';

import React from 'react';
import { t } from '@/translations';

interface Quest {
  title: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  community: string;
  timeLeft: string;
  completed?: boolean;
}

const TodaysQuests = () => {
  const quests: Quest[] = [
    {
      title: t('dashboard.quests.hookTitle', 'Share a React Hook'),
      xp: 150,
      difficulty: 'Easy',
      community: 'React Developers',
      timeLeft: t('dashboard.quests.hookTime', '18h left'),
    },
    {
      title: t('dashboard.quests.reviewTitle', 'Review 3 Designs'),
      xp: 200,
      difficulty: 'Medium',
      community: 'UI/UX Design Masters',
      timeLeft: t('dashboard.quests.completed', 'Completed'),
      completed: true,
    },
    {
      title: t('dashboard.quests.nnTitle', 'Explain Neural Networks'),
      xp: 300,
      difficulty: 'Hard',
      community: 'Python AI Community',
      timeLeft: t('dashboard.quests.nnTime', '15h left'),
    },
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b rounded-3xl">
      <h2 className="text-4xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        {t('dashboard.quests.title', "Today's Quests")}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {quests.map(quest => (
          <div
            key={quest.title}
            className={`group p-6 rounded-2xl border border-purple-700 transition-all duration-500 ${
              quest.completed ? 'bg-green-800 hover:shadow-2xl' : 'bg-purple-800 hover:shadow-2xl'
            }`}
          >
            <div className="flex justify-between mb-2">
              <p className="font-semibold text-white">{quest.title}</p>
              <p className="text-yellow-400 font-bold">{quest.xp} XP</p>
            </div>
            <p className="text-gray-300 text-sm mb-1">{quest.community}</p>
            <p className="text-gray-400 text-xs">{quest.timeLeft}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodaysQuests;
