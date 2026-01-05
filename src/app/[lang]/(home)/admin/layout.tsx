'use client';

import React from 'react';
import { RoleGuard } from '@/components/providers/RoleGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="admin">
      <div className="bg-background text-foreground flex min-h-screen">
        {/* Sidebar (Desktop + Mobile Trigger) */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden lg:pl-64">
          <main className="bg-muted/20 flex-1 overflow-y-auto p-4 pt-4 md:p-8">
            <div className="container mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
