import { Lock, Users, MessageCircle, ArrowRight, Ban, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NotMemberScreenProps {
  type: 'community' | 'clan';
  name?: string;
  accessDeniedCode?: string | null;
  onJoinClick?: () => void;
  onRequestJoinClick?: () => void;
  isJoinDisabled?: boolean;
}

export const NotMemberScreen = ({
  type,
  name,
  accessDeniedCode,
  onJoinClick,
  onRequestJoinClick,
  isJoinDisabled = false,
}: NotMemberScreenProps) => {
  const entityName = type === 'community' ? 'Community' : 'Clan';

  // ✅ Handle different access denied scenarios
  const isBanned = accessDeniedCode === 'CLAN_BANNED' || accessDeniedCode === 'COMMUNITY_BANNED';
  const isPrivate = accessDeniedCode === 'PRIVATE_CLAN' || accessDeniedCode === 'PRIVATE_COMMUNITY';

  // ✅ Customize content based on denial reason
  const getContent = () => {
    if (isBanned) {
      return {
        icon: <Ban className="text-destructive h-10 w-10" />,
        title: `Banned from ${entityName}`,
        description: `You have been banned from ${name || `this ${type}`}`,
        bgColor: 'bg-destructive/10',
        showJoinButton: false,
        showAlert: true,
        alertMessage: 'Contact an administrator if you believe this is an error.',
      };
    }

    if (isPrivate) {
      return {
        icon: <ShieldAlert className="text-warning h-10 w-10" />,
        title: `Private ${entityName}`,
        description: `${name || `This ${type}`} is private. Request access to join.`,
        bgColor: 'bg-warning/10',
        showJoinButton: false,
        showRequestButton: true,
        showAlert: false,
      };
    }

    // Default: NOT_A_MEMBER
    return {
      icon: <Lock className="text-primary h-10 w-10" />,
      title: `${entityName} Locked`,
      description: name ? `You're not a member of ${name}` : `You need to join this ${type} first`,
      bgColor: 'bg-primary/10',
      showJoinButton: true,
      showRequestButton: false,
      showAlert: false,
    };
  };

  const content = getContent();

  return (
    <div className="from-background to-muted/20 flex h-full items-center justify-center bg-gradient-to-b p-6">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardContent className="space-y-6 p-8 text-center">
          {/* Icon */}
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${content.bgColor}`}
          >
            {content.icon}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{content.title}</h2>
            <p className="text-muted-foreground">{content.description}</p>
          </div>

          {/* Alert for banned users */}
          {content.showAlert && (
            <Alert variant="destructive">
              <AlertDescription>{content.alertMessage}</AlertDescription>
            </Alert>
          )}

          {/* Benefits (only for non-banned users) */}
          {!isBanned && (
            <div className="bg-muted/50 space-y-3 rounded-lg p-4 text-left">
              <p className="text-sm font-medium">
                {isPrivate ? 'Members get access to:' : 'Join to access:'}
              </p>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MessageCircle className="text-primary h-4 w-4" />
                  Real-time chat and discussions
                </li>
                <li className="flex items-center gap-2">
                  <Users className="text-primary h-4 w-4" />
                  Connect with members
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="text-primary h-4 w-4" />
                  Access exclusive content
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {content.showJoinButton && onJoinClick && (
              <Button onClick={onJoinClick} className="w-full" size="lg" disabled={isJoinDisabled}>
                Join {entityName}
              </Button>
            )}

            {content.showRequestButton && onRequestJoinClick && (
              <Button onClick={onRequestJoinClick} className="w-full" size="lg" variant="outline">
                Request to Join
              </Button>
            )}
          </div>

          {/* Help Text */}
          {!isBanned && (
            <p className="text-muted-foreground text-xs">Contact an admin if you have questions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
