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
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg transition-colors duration-300 dark:border-gray-900 dark:bg-black/80">
      {/* <div className="max-w-7xl mx-auto px-6 py-4"> */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href={`/${currentLanguage}/home`} className="group flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black transition-transform duration-300 group-hover:scale-105 dark:bg-white">
            <Sparkles className="h-4 w-4 text-white dark:text-black" />
          </div>
          <span className="text-xl font-bold text-black dark:text-white">LevelUp</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 lg:flex">
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
                <div className="absolute -bottom-1 left-0 h-px w-full bg-black dark:bg-white" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center space-x-4 lg:flex">
          <Link
            href={`/${currentLanguage}/login`}
            className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            {t('nav.login')}
          </Link>
          <Link
            href={`/${currentLanguage}/signup`}
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {t('nav.getStarted')}
          </Link>
          <ModeToggle />
          <div className="ml-1">
            <LanguageSwitcherWrapper currentLang={currentLanguage} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 lg:hidden">
          <ModeToggle />
          <LanguageSwitcherWrapper currentLang={currentLanguage} />
          <Sheet>
            <SheetTrigger asChild>
              <button className="rounded-lg p-2 text-black transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-900">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l border-gray-100 bg-white dark:border-gray-900 dark:bg-black"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
                    <Sparkles className="h-4 w-4 text-white dark:text-black" />
                  </div>
                  <span className="text-xl font-bold text-black dark:text-white">
                    {t('nav.brand')}
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col space-y-4">
                {/* Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map(link => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                          isActive(link.href.split('/').pop() || '')
                            ? 'bg-gray-100 text-black dark:bg-gray-900 dark:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-white'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-100 dark:border-gray-900"></div>

                {/* Auth Buttons */}
                <div className="space-y-3 px-1">
                  <SheetClose asChild>
                    <Link
                      href={`/${currentLanguage}/login`}
                      className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-black dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
                    >
                      {t('nav.login')}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href={`/${currentLanguage}/signup`}
                      className="block w-full rounded-lg bg-black px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
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
      {/* </div> */}
    </nav>
  );
};

export default Navbar;
