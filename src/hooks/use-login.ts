// hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { login } from '../lib/services/auth';
import { Err, UserLoginInput, Language } from '../lib/generated';
import { useAuthStore } from '../lib/stores/auth';
import { toast } from 'sonner';

export const useLogin = (lang: Language = 'eng') => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password, lang),
    onSuccess: ([result, error]) => {
      if (result) {
        setToken(result.body.data); // Assuming body.data contains the token
        toast.success(result.body.message);
      }
      if (error) {
        // console.error('Login error:', error.message);
        toast.error(error.message);
      }
    },
    onError: (error: Err) => {
      toast.error(error.message || 'Login failed');
      // console.error('Login failed:', error);
    }
  });
};
