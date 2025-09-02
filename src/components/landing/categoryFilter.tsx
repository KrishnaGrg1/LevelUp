'use client';

import React from 'react';

interface Category {
    name: string;
    count: number;
    active?: boolean;
}

interface CategoryFilterProps {
    categories: Category[];
    onSelectCategory?: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    onSelectCategory,
}) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mt-10">
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                    className={`px-5 py-2 rounded-xl text-sm font-medium ${cat.active
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        } transition-all duration-300`}
                >
                    {cat.name} <span className="ml-1 text-slate-400">{cat.count}</span>
                </button>
            ))}
        </div>
    );
};
