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

export function ProfileDropdownMenu({ isadmin }: { isadmin?: boolean }) {
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
        <Button
          variant="outline"
          className="bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          {user?.UserName
            ? user.UserName.charAt(0).toUpperCase() + user.UserName.slice(1)
            : 'Profile'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        align="start"
      >
        <DropdownMenuLabel className="text-zinc-900 dark:text-zinc-50">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            onClick={() => {
              if (isadmin) {
                router.push(`/${language}/admin/profile`);
                return;
              }
              router.push(`/${language}/user/profile`);
            }}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            onClick={() => {
              if (isadmin) {
                router.push(`/${language}/admin/change-password`);
                return;
              }
              router.push(`/${language}/user/change-password`);
            }}
          >
            Change Password
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem
          className="flex flex-row gap-1 cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
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
