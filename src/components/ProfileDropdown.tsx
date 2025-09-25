import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { logout } from '@/lib/services/auth';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function ProfileDropdownMenu() {
  const { language } = LanguageStore();
  const { user, logout: clearAuth } = authStore();

  const router = useRouter();

  const { mutateAsync: handleLogout, isPending } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      return await logout(language); // <- correct signature
    },
    onSuccess: data => {
      clearAuth(); // resets user + isAuthenticated
      toast.success(t('success.logout', data?.body?.message));
      router.push(`/${language}/login`);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Logout failed:', error);
      toast.error(err.message || t('error:unknown', 'Logout failed'));
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Profile</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem
          className="flex flex-row gap-1"
          onClick={() => handleLogout()}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            'Log out'
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
