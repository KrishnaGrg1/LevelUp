'use client';

import React from 'react';
import { CommunityCard } from './communityCard';

interface Community {
    name: string;
    description: string;
    members: number;
    posts: number;
    tags: string[];
    rating: number;
    trending?: boolean;
    level: string;
}

interface CommunityListProps {
    communities: Community[];
}

export const CommunityList: React.FC<CommunityListProps> = ({ communities }) => {
    return (
        <div className="grid gap-8 mt-12 px-6 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((community, index) => (
                <CommunityCard key={index} {...community} />
            ))}
        </div>
    );
};
