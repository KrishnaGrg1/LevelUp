import { Suspense } from 'react';
import UserManagement from '@/components/users/UserManagement';

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-slate-400">Loading users...</p>
          </div>
        </div>
      }
    >
      <UserManagement />
    </Suspense>
  );
}
