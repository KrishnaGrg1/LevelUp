import { Suspense } from 'react';
import EditUserForm from '@/components/users/EditUserForm';

interface EditUserPageProps {
  params: Promise<{ userId: string; lang: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { userId } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading user details...</p>
          </div>
        </div>
      }
    >
      <EditUserForm userId={userId} />
    </Suspense>
  );
}
