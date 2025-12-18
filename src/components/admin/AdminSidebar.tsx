'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LanguageStore from '@/stores/useLanguage';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Trophy,
  Shield,
  Settings,
  LogOut,
  Menu,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

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
  {
    href: '/admin/communities',
    label: 'Communities',
    icon: FolderKanban,
  },
  {
    href: '/admin/leaderboard',
    label: 'Leaderboard',
    icon: Trophy,
  },
  {
    href: '/admin/top-clans',
    label: 'Top Clans',
    icon: Shield,
  },
];

export default function AdminSidebar() {
  const { language } = LanguageStore();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) => pathname?.includes(href);

  const NavLinks = () => (
    <div className="flex flex-col gap-1 py-4">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={`/${language}${item.href}`}
          onClick={() => setOpen(false)}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  const SidebarFooter = () => (
    <div className="flex flex-col gap-1">
      <Button variant="ghost" className="justify-start gap-3 w-full px-3 text-muted-foreground hover:text-foreground">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Button>
      <Button variant="ghost" className="justify-start gap-3 w-full px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-6 pb-0">
            <SheetTitle className="text-xl font-bold font-heading">LevelUp Admin</SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <NavLinks />
          </div>
          <div className="absolute bottom-4 left-4 right-4 px-4">
            <SidebarFooter />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card min-h-screen fixed top-0 left-0 z-[60]">
        <div className="p-6 pb-2 flex items-center gap-2">
             <div className="w-8 h-8  rounded-lg border-2 flex items-center justify-center  ">
                  <Sparkles className="w-4 h-4" />
                </div>
            <h1 className="text-xl font-bold font-heading">LevelUp Admin</h1>
        </div>
        
        <div className="flex-1 px-4 overflow-y-auto">
          <NavLinks />
        </div>

        <div className="p-4 border-t">
            <SidebarFooter />
        </div>
      </aside>
    </>
  );
}
