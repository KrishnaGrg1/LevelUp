'use client';

import React from 'react';
import { RoleGuard } from '@/components/providers/RoleGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="admin">
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Sidebar (Desktop + Mobile Trigger) */}
        <AdminSidebar />

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
