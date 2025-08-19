import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Menu, Sparkles } from "lucide-react";
import LanguageStore, { Language } from "@/stores/useLanguage";
import { t } from "@/translations/index";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface NavbarProps {
  language?: Language;
}

const Navbar: React.FC<NavbarProps> = ({
  language: initialLanguage = "eng",
}) => {
  const pathname = usePathname();
  const { language } = LanguageStore(); // Use language from store instead of prop
  const currentLanguage = language || initialLanguage; // Fallback to prop if store is not ready

  const isActive = (path: string) => pathname?.includes(path);

  const navLinks = [
    { href: `/${currentLanguage}/home`, label: t("nav.home") },
    { href: `/${currentLanguage}/features`, label: t("nav.features") },
    { href: `/${currentLanguage}/pricing`, label: t("nav.pricing") },
    { href: `/${currentLanguage}/about`, label: t("nav.about") },
    { href: `/${currentLanguage}/contact`, label: t("nav.contact") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link
            href={`/${currentLanguage}/home`}
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Level Up
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive(link.href.split("/").pop() || "")
                    ? "text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {link.label}
                {isActive(link.href.split("/").pop() || "") && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href={`/${currentLanguage}/login`}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
            >
              {t("nav.login")}
            </Link>
            <Link
              href={`/${currentLanguage}/signup`}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("nav.getStarted")}
            </Link>
            <div className="ml-3">
              <LanguageSwitcher currentLang={currentLanguage} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <LanguageSwitcher currentLang={currentLanguage} />
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-black/95 backdrop-blur-xl border-l border-slate-800/50 text-white"
              >
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {t("nav.brand")}
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col space-y-4 mt-8">
                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                            isActive(link.href.split("/").pop() || "")
                              ? "text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-800/50 my-4"></div>

                  {/* Auth Buttons */}
                  <div className="space-y-3">
                    <SheetClose asChild>
                      <Link
                        href={`/${currentLanguage}/login`}
                        className="block px-4 py-3 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50 text-center"
                      >
                        {t("nav.login")}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href={`/${currentLanguage}/signup`}
                        className="block px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 text-center"
                      >
                        {t("nav.getStarted")}
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
