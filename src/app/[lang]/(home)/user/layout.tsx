'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleGuard } from '@/components/providers/RoleGuard';
import LanguageStore from '@/stores/useLanguage';
import { LayoutDashboard, User, KeyRound, MessageSquare, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/user/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/user/profile',
    label: 'Profile',
    icon: User,
  },
  {
    href: '/user/change-password',
    label: 'Change Password',
    icon: KeyRound,
  },
  {
    href: '/user/ai-chat',
    label: 'AI Chat',
    icon: MessageSquare,
  },
  {
    href: '/user/leaderboard',
    label: 'Leaderboards',
    icon: Trophy,
  },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { language } = LanguageStore();
  const pathname = usePathname();

  return (
    <RoleGuard allowedRole="user">
      <div className="min-h-screen">
        {/* Desktop Navigation */}
        <div className="hidden lg:block border-b border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-1 overflow-x-auto py-3">
              {navItems.map(item => {
                const isActive = pathname?.includes(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={`/${language}${item.href}`}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800',
                      isActive
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200'
                        : 'text-zinc-700 dark:text-zinc-300',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div>{children}</div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-lg">
          <nav className="grid grid-cols-5 h-16 safe-area-inset-bottom">
            {navItems.map(item => {
              const isActive = pathname?.includes(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={`/${language}${item.href}`}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 transition-colors',
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-500 dark:text-zinc-400',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </RoleGuard>
  );
}
