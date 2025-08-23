import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import authStore from '@/stores/useAuth';
import { getCurrentUser } from '@/lib/services/auth';
import { Language } from '@/stores/useLanguage';

export const useAuth = (lang: Language = 'eng') => {
  const { user, isAuthenticated, setUser, logout } = authStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser(lang),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.body?.data) {
      if (setUser) {
        setUser(data.body.data);
      }
    } else if (error || data === null) {
      logout();
    }
  }, [data, error, setUser, logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
};
