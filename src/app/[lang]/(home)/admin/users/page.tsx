import { Suspense } from 'react';
import UserManagement from '@/components/users/UserManagement';

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading users...</p>
          </div>
        </div>
      }
    >
      <UserManagement />
    </Suspense>
  );
}
