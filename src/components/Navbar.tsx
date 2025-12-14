import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcherWrapper from './LanguageSwitcherWrapper';
import { Menu, Sparkles } from 'lucide-react';
import LanguageStore, { Language } from '@/stores/useLanguage';
import { t } from '@/translations/index';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { ModeToggle } from './toggle';

interface NavbarProps {
  language?: Language;
}

const Navbar: React.FC<NavbarProps> = ({ language: initialLanguage = 'eng' }) => {
  const pathname = usePathname();
  const { language } = LanguageStore();
  const currentLanguage = language || initialLanguage;

  const isActive = (path: string) => pathname?.includes(path);

  const navLinks = [
    { href: `/${currentLanguage}/home`, label: t('nav.home') },
    { href: `/${currentLanguage}/features`, label: t('nav.features') },
    { href: `/${currentLanguage}/pricing`, label: t('nav.pricing') },
    { href: `/${currentLanguage}/about`, label: t('nav.about') },
    { href: `/${currentLanguage}/contact`, label: t('nav.contact') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href={`/${currentLanguage}/home`} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold text-black dark:text-white">LevelUp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href.split('/').pop() || '')
                    ? 'text-black dark:text-white'
                    : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.href.split('/').pop() || '') && (
                  <div className="absolute -bottom-1 left-0 w-full h-px bg-black dark:bg-white" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href={`/${currentLanguage}/login`}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              href={`/${currentLanguage}/signup`}
              className="px-5 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105"
            >
              {t('nav.getStarted')}
            </Link>
            <ModeToggle />
            <div className="ml-1">
              <LanguageSwitcherWrapper currentLang={currentLanguage} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <ModeToggle />
            <LanguageSwitcherWrapper currentLang={currentLanguage} />
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-white dark:bg-black border-l border-gray-100 dark:border-gray-900"
              >
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-xl font-bold text-black dark:text-white">
                      {t('nav.brand')}
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-4 mt-8">
                  {/* Navigation Links */}
                  <div className="space-y-1">
                    {navLinks.map(link => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            isActive(link.href.split('/').pop() || '')
                              ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 dark:border-gray-900 my-4"></div>

                  {/* Auth Buttons */}
                  <div className="space-y-3 px-1">
                    <SheetClose asChild>
                      <Link
                        href={`/${currentLanguage}/login`}
                        className="block w-full px-4 py-3 text-sm font-medium text-center text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        {t('nav.login')}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href={`/${currentLanguage}/signup`}
                        className="block w-full px-4 py-3 text-sm font-medium text-center bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {t('nav.getStarted')}
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
