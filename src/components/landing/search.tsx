'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search communities...',
  onSearch,
}) => {
  return (
    <div className="mt-8 flex justify-center px-4">
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder={placeholder}
          onChange={e => onSearch && onSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 px-5 py-4 text-white outline-none focus:border-indigo-500"
        />
        <Search className="absolute top-1/2 right-4 -translate-y-1/2 transform text-slate-400" />
      </div>
    </div>
  );
};
