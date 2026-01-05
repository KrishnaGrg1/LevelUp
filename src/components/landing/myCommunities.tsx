'use client';

import React from 'react';
import { t } from '@/translations';

interface Community {
  name: string;
  members: string;
  level: number;
  xp: string;
  newCount: number;
  tag: string;
}

const MyCommunities = () => {
  const communities: Community[] = [
    {
      name: 'React Developers',
      members: t('dashboard.myCommunities.reactMembers', '15,420 members'),
      level: 7,
      xp: '2840/4000 XP',
      newCount: 3,
      tag: 'Programming',
    },
    {
      name: 'UI/UX Design Masters',
      members: t('dashboard.myCommunities.uiuxMembers', '8,932 members'),
      level: 4,
      xp: '1240/2000 XP',
      newCount: 7,
      tag: 'Design',
    },
  ];

  return (
    <section className="relative rounded-3xl bg-gradient-to-b px-6 py-16">
      <h2 className="mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-center text-4xl font-black text-transparent">
        {t('dashboard.myCommunities.title', 'My Communities')}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {communities.map(community => {
          const [current, total] = community.xp.split('/');
          const xpPercent = (parseInt(current) / parseInt(total)) * 100;

          return (
            <div
              key={community.name}
              className="group relative rounded-2xl border border-purple-700 bg-purple-800 p-6 transition-all duration-500 hover:shadow-2xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{community.name}</h3>
                <span className="animate-pulse rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {community.newCount} {t('dashboard.myCommunities.new', 'new')}
                </span>
              </div>
              <p className="mb-1 text-sm text-gray-300">{community.members}</p>
              <p className="mb-2 text-sm text-gray-300">
                {t('dashboard.myCommunities.level', 'Level')} {community.level}
              </p>

              <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-purple-700">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-1000"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{community.xp}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MyCommunities;
