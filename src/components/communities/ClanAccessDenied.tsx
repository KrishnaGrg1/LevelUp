import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertCircle, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

interface ClanAccessDeniedProps {
  clanName: string;
  accessDeniedCode?: string;
  onGoBack?: () => void;
}

/**
 * Access Denied Screen for Clan Chat
 * Shows when user tries to access a clan they're not a member of
 */
export const ClanAccessDenied: React.FC<ClanAccessDeniedProps> = ({
  clanName,
  accessDeniedCode,
  onGoBack,
}) => {
  const router = useRouter();
  const { language } = LanguageStore();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      router.back();
    }
  };

  // Determine icon and message based on access denied code
  const getAccessDeniedDetails = () => {
    switch (accessDeniedCode) {
      case 'NOT_MEMBER':
        return {
          icon: <UserX className="h-16 w-16 text-red-500" />,
          title: t('community:accessDenied.notMember.title', language),
          message: t('community:accessDenied.notMember.message', { clanName }),
          description: t('community:accessDenied.notMember.description', language),
        };
      case 'NOT_AUTHENTICATED':
        return {
          icon: <Lock className="h-16 w-16 text-amber-500" />,
          title: t('community:accessDenied.notAuthenticated.title', language),
          message: t('community:accessDenied.notAuthenticated.message', language),
          description: t('community:accessDenied.notAuthenticated.description', language),
        };
      case 'MEMBERSHIP_CHECK_FAILED':
        return {
          icon: <AlertCircle className="h-16 w-16 text-orange-500" />,
          title: t('community:accessDenied.membershipCheckFailed.title', language),
          message: t('community:accessDenied.membershipCheckFailed.message', language),
          description: t('community:accessDenied.membershipCheckFailed.description', language),
        };
      default:
        return {
          icon: <Shield className="h-16 w-16 text-gray-500" />,
          title: t('community:accessDenied.default.title', language),
          message: t('community:accessDenied.default.message', language),
          description: t('community:accessDenied.default.description', language),
        };
    }
  };

  const details = getAccessDeniedDetails();

  return (
    <div className="flex flex-1 items-center justify-center bg-white p-6 dark:bg-black">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">{details.icon}</div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {details.title}
        </h2>

        {/* Message */}
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">{details.message}</p>

        {/* Description */}
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">{details.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="border-gray-300 bg-white px-6 py-2 dark:border-gray-800 dark:bg-black"
          >
            {t('community:accessDenied.goBack', language)}
          </Button>

          {accessDeniedCode === 'NOT_MEMBER' && (
            <Button
              onClick={() => {
                // TODO: Implement request to join functionality
                alert('Request to join functionality - to be implemented');
              }}
              className="bg-black px-6 py-2 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {t('community:accessDenied.requestJoin', language)}
            </Button>
          )}

          {accessDeniedCode === 'NOT_AUTHENTICATED' && (
            <Button
              onClick={() => router.push('/login')}
              className="bg-black px-6 py-2 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Log In
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Need help?</strong> Contact the clan admin or visit the clan page to learn more
            about joining.
          </p>
        </div>
      </div>
    </div>
  );
};
