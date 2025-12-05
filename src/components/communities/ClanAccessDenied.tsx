import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertCircle, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
          title: 'Access Denied',
          message: `You are not a member of ${clanName}`,
          description: 'Only clan members can access this chat.',
        };
      case 'NOT_AUTHENTICATED':
        return {
          icon: <Lock className="h-16 w-16 text-amber-500" />,
          title: 'Authentication Required',
          message: 'Please log in to access this clan',
          description: 'You need to be logged in to view clan chats.',
        };
      case 'MEMBERSHIP_CHECK_FAILED':
        return {
          icon: <AlertCircle className="h-16 w-16 text-orange-500" />,
          title: 'Unable to Verify Membership',
          message: 'Could not verify your clan membership',
          description: 'Please try again later or contact support.',
        };
      default:
        return {
          icon: <Shield className="h-16 w-16 text-gray-500" />,
          title: 'Access Restricted',
          message: 'You cannot access this clan chat',
          description: 'Please check your membership status.',
        };
    }
  };

  const details = getAccessDeniedDetails();

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">{details.icon}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {details.title}
        </h2>

        {/* Message */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">{details.message}</p>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{details.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="px-6 py-2 border-gray-300 dark:border-gray-600"
          >
            Go Back
          </Button>

          {accessDeniedCode === 'NOT_MEMBER' && (
            <Button
              onClick={() => {
                // TODO: Implement request to join functionality
                alert('Request to join functionality - to be implemented');
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Request to Join
            </Button>
          )}

          {accessDeniedCode === 'NOT_AUTHENTICATED' && (
            <Button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Log In
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Need help?</strong> Contact the clan admin or visit the clan page to learn more
            about joining.
          </p>
        </div>
      </div>
    </div>
  );
};
