import { useEffect, useState } from 'react';

/**
 * A hook that returns true only after the component has hydrated on the client.
 * This prevents hydration mismatches for components that use client-only features.
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * A hook for safely accessing window object and other browser APIs.
 * Returns undefined during SSR and the actual value after hydration.
 */
export function useSafeWindow() {
  const [windowObj, setWindowObj] = useState<Window | undefined>(undefined);

  useEffect(() => {
    setWindowObj(window);
  }, []);

  return windowObj;
}