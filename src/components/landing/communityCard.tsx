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
    <div className="group relative p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-3xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-500 hover:scale-105 hover:shadow-xl">
      {/* Badge for Trending */}
      {trending && (
        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold bg-orange-500/20 text-orange-400 rounded-full">
          Trending
        </span>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3">{name}</h3>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4">{description}</p>

      {/* Stats */}
      <div className="flex justify-between text-xs text-slate-500 mb-4">
        <span>{members.toLocaleString()} members</span>
        <span>{posts} posts</span>
        <span>{level}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 text-xs bg-slate-700 rounded-full text-slate-300">
            {tag}
          </span>
        ))}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-400">
        <Star className="w-4 h-4 fill-yellow-400" />
        <span className="text-sm font-semibold">{rating}</span>
      </div>
    </div>
  );
};
