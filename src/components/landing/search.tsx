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
        <div className="flex justify-center mt-8 px-4">
            <div className="relative w-full max-w-xl">
                <input
                    type="text"
                    placeholder={placeholder}
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-800/50 rounded-2xl text-white border border-slate-700 focus:border-indigo-500 outline-none"
                />
                <Search className="absolute top-1/2 right-4 transform -translate-y-1/2 text-slate-400" />
            </div>
        </div>
    );
};
