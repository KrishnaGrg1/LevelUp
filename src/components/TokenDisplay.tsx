import React from 'react';

interface TokenDisplayProps {
  tokens?: number;
  className?: string;
}

// Simple token badge with color-coding: green >=50, yellow 20-49, red <20
const TokenDisplay: React.FC<TokenDisplayProps> = ({ tokens = 0, className }) => {
  const color =
    tokens >= 50 ? 'text-emerald-600' : tokens >= 20 ? 'text-amber-600' : 'text-red-600';
  const bg =
    tokens >= 50
      ? 'bg-emerald-50 dark:bg-emerald-900/20'
      : tokens >= 20
        ? 'bg-amber-50 dark:bg-amber-900/20'
        : 'bg-red-50 dark:bg-red-900/20';
  const border =
    tokens >= 50
      ? 'border-emerald-200 dark:border-emerald-800'
      : tokens >= 20
        ? 'border-amber-200 dark:border-amber-800'
        : 'border-red-200 dark:border-red-800';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${bg} ${border} ${color} ${className ?? ''}`}
    >
      <span role="img" aria-label="token">
        🪙
      </span>
      <span className="text-sm font-medium">{tokens}</span>
    </div>
  );
};

export default TokenDisplay;
