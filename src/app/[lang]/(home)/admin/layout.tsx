'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { RoleGuard } from '@/components/providers/RoleGuard';
import LanguageStore from '@/stores/useLanguage';
import { LayoutDashboard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
const navItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { language } = LanguageStore();
  const pathname = usePathname();
  return (
    <RoleGuard allowedRole="admin">
      <div className="min-h-screen ">
        <div className="">
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

          <div className="min-h-screen p-4">{children}</div>
        </div>
      </div>
    </RoleGuard>
  );
}
