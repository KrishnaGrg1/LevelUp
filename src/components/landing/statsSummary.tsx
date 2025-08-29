'use client';

import React from 'react';

const StatsSummary = () => {
  const stats = [
    { label: 'Total Level', value: 42 },
    { label: 'Communities', value: 3 },
    { label: 'Quests Done', value: 127 },
    { label: 'Streak', value: 12 },
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b  rounded-3xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="group relative p-6 rounded-2xl bg-purple-800 border border-purple-700 hover:shadow-2xl transition-all duration-500 text-center"
          >
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2">
              {stat.value}
            </p>
            <p className="text-gray-300 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSummary;
