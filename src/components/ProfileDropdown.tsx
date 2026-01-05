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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TokenDisplay from '@/components/TokenDisplay';

export function ProfileDropdownMenu({ isadmin }: { isadmin?: boolean }) {
  const { language } = LanguageStore();
  const { user, logout: clearAuth } = authStore();
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutateAsync: handleLogout, isPending } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      return await logout(language); // <- correct signature
    },
    onSuccess: data => {
      clearAuth(); // resets user + isAuthenticated
      // Clear all React Query cache to prevent stale data on next login
      queryClient.clear();
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
            : t('profile:dropdown.profile', language)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        align="start"
      >
        <DropdownMenuLabel className="flex items-center justify-between text-zinc-900 dark:text-zinc-50">
          <span>{t('profile:dropdown.myAccount', language)}</span>
          {typeof user?.tokens === 'number' && <TokenDisplay tokens={user?.tokens} />}
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
            {t('profile:dropdown.profile', language)}
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
            {t('profile:dropdown.changePassword', language)}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            {t('profile:dropdown.settings', language)}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem
          className="flex cursor-pointer flex-row gap-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          onClick={() => handleLogout()}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('profile:dropdown.loggingOut', language)}
            </>
          ) : (
            t('profile:dropdown.logout', language)
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
