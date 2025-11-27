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
  isAdmin?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  language = 'eng',
  showBackButton = false,
  backUrl,
  isAuthenticated = false,
  isAdmin = false,
}) => {
  const defaultBackUrl = `/${language}/home`;
  const { user } = authStore();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black/90 backdrop-blur-lg border-b dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button or Brand */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link
                href={backUrl || defaultBackUrl}
                className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">{t('back', 'Back')}</span>
              </Link>
            )}

            {/* Brand */}
            {!isAuthenticated ? (
              <Link href={`/${language}/home`} className="flex items-center space-x-2 group">
                <div className="w-8 h-8  rounded-lg border-2 flex items-center justify-center  ">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-2xl font-extrabold ">Level Up</span>
              </Link>
            ) : isAdmin ? (
              <Link
                href={`/${language}/admin/dashboard`}
                className="flex items-center space-x-2 group"
              >
                <div className="w-8 h-8  rounded-lg border-2 flex items-center justify-center  ">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-2xl font-extrabold ">Level Up</span>
              </Link>
            ) : (
              <Link
                href={`/${language}/user/dashboard`}
                className="flex items-center space-x-2 group"
              >
                <div className="w-8 h-8  rounded-lg border-2 flex items-center justify-center  ">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-2xl font-extrabold ">Level Up</span>
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
