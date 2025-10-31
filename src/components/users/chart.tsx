'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import LanguageStore from '@/stores/useLanguage';
import { adminUserGrowth } from '@/lib/services/user';
import { GrowthData, UserGrowthResponse } from '@/lib/generated';

export function UserGrowthChart() {
  const { language } = LanguageStore();
  const [range, setRange] = useState<'day' | 'week' | 'month'>('day');

  const { data, isLoading, isError } = useQuery<UserGrowthResponse>({
    queryKey: ['user-growth', range, language],
    queryFn: () => adminUserGrowth(language, range),
    staleTime: 0,
  });

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRange(e.target.value as 'day' | 'week' | 'month');
  };

  if (isLoading) return <p>Loading chart...</p>;
  if (isError || !data) return <p>Failed to load user growth</p>;

  const growthData: GrowthData[] = data.body.data.growth;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      {/* Dropdown on the right */}
      <div className="flex justify-end mb-4">
        <label htmlFor="range" className="text-sm font-medium text-gray-300 mr-2">
          Select Range:
        </label>
        <select
          id="range"
          value={range}
          onChange={handleRangeChange}
          className="border border-gray-600 rounded px-2 py-1 bg-gray-700 text-white"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={growthData}>
          <XAxis
            dataKey="period"
            tick={{ fill: '#fff', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#555' }}
            tickLine={{ stroke: '#555' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#fff', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#555' }}
            tickLine={{ stroke: '#555' }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              borderRadius: 8,
              border: 'none',
              color: '#fff',
            }}
            labelStyle={{ color: '#fff', fontWeight: 500 }}
          />

          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area type="monotone" dataKey="count" stroke="#16a34a" fill="url(#greenGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
