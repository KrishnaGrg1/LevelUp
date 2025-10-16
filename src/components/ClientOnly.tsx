import { Suspense, ReactNode } from 'react';
import dynamic from 'next/dynamic';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// This component ensures children only render on the client
function ClientOnlyComponent({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Dynamic import with no SSR to prevent hydration issues
const DynamicClientOnly = dynamic(() => Promise.resolve(ClientOnlyComponent), {
  ssr: false,
});

export default function ClientOnly({ children, fallback }: ClientOnlyProps) {
  return (
    <Suspense fallback={fallback || null}>
      <DynamicClientOnly>{children}</DynamicClientOnly>
    </Suspense>
  );
}
