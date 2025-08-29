'use client';

import React from 'react';

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
      members: '15,420 members',
      level: 7,
      xp: '2840/4000 XP',
      newCount: 3,
      tag: 'Programming',
    },
    {
      name: 'UI/UX Design Masters',
      members: '8,932 members',
      level: 4,
      xp: '1240/2000 XP',
      newCount: 7,
      tag: 'Design',
    },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-b  px-6 rounded-3xl">
      <h2 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-center">
        My Communities
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {communities.map(community => {
          const xpPercent =
            (parseInt(community.xp.split('/')[0]) / parseInt(community.xp.split('/')[1])) * 100;
          return (
            <div
              key={community.name}
              className="group relative p-6 rounded-2xl bg-purple-800 hover:shadow-2xl transition-all duration-500 border border-purple-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-white">{community.name}</h3>
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                  {community.newCount} new
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-1">{community.members}</p>
              <p className="text-sm text-gray-300 mb-2">Level {community.level}</p>

              <div className="w-full bg-purple-700 rounded-full h-2 mb-1 overflow-hidden">
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
