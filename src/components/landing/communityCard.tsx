'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface CommunityCardProps {
  name: string;
  description: string;
  members: number;
  posts: number;
  tags: string[];
  rating: number;
  trending?: boolean;
  level: string;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  name,
  description,
  members,
  posts,
  tags,
  rating,
  trending,
  level,
}) => {
  return (
    <div className="group relative rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 transition-all duration-500 hover:scale-105 hover:border-indigo-500/50 hover:shadow-xl">
      {/* Badge for Trending */}
      {trending && (
        <span className="absolute top-4 right-4 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400">
          Trending
        </span>
      )}

      {/* Title */}
      <h3 className="mb-3 text-xl font-bold text-white">{name}</h3>

      {/* Description */}
      <p className="mb-4 text-sm text-slate-400">{description}</p>

      {/* Stats */}
      <div className="mb-4 flex justify-between text-xs text-slate-500">
        <span>{members.toLocaleString()} members</span>
        <span>{posts} posts</span>
        <span>{level}</span>
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
            {tag}
          </span>
        ))}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-400">
        <Star className="h-4 w-4 fill-yellow-400" />
        <span className="text-sm font-semibold">{rating}</span>
      </div>
    </div>
  );
};
