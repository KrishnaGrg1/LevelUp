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
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-slate-400">Loading user details...</p>
          </div>
        </div>
      }
    >
      <EditUserForm userId={userId} />
    </Suspense>
  );
}
