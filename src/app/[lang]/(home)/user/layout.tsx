'use client';

import React from 'react';
import { RoleGuard } from '@/components/providers/RoleGuard';
import UserSidebar from '@/components/user/UserSidebar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="user">
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Sidebar (Desktop + Mobile Trigger) */}
        <UserSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden lg:pl-64">
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-4 bg-muted/20">
            <div className="container mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
