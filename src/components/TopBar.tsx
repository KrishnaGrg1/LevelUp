import Link from 'next/link';
import LanguageSwitcherWrapper from './LanguageSwitcherWrapper';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Language } from '@/stores/useLanguage';
import { t } from '@/translations/index';
import { ModeToggle } from './toggle';
import { ProfileDropdownMenu } from './ProfileDropdown';
import authStore from '@/stores/useAuth';

interface TopBarProps {
  language?: Language;
  showBackButton?: boolean;
  backUrl?: string;
  isAuthenticated?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  language = 'eng',
  showBackButton = false,
  backUrl,
  isAuthenticated = false,
}) => {
  const defaultBackUrl = `/${language}/home`;
  const { user } = authStore();
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b bg-white backdrop-blur-lg dark:border-slate-800/50 dark:bg-black/90">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button or Brand */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link
                href={backUrl || defaultBackUrl}
                className="inline-flex items-center space-x-2 rounded-xl border border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-3 py-2 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-indigo-500/50 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">{t('common.back')}</span>
              </Link>
            )}

            {/* Brand */}
            {!isAuthenticated && (
              <Link href={`/${language}/home`} className="group flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-2xl font-extrabold">Level Up</span>
              </Link>
            )}
          </div>

          {/* Right Side - Language Switcher */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <LanguageSwitcherWrapper currentLang={language} />
            {isAuthenticated && <ProfileDropdownMenu isadmin={user?.isAdmin} />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
