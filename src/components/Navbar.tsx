import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Language } from "@/stores/useLanguage";

interface NavbarProps {
  language?: Language;
}

const Navbar: React.FC<NavbarProps> = ({ language = "eng" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname?.includes(path);

  const navLinks = [
    { href: `/${language}/home`, label: "Home" },
    { href: `/${language}/features`, label: "Features" },
    { href: `/${language}/pricing`, label: "Pricing" },
    { href: `/${language}/about`, label: "About" },
    { href: `/${language}/contact`, label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link
            href={`/${language}/home`}
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
              href={`/${language}/login`}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
            >
              Login
            </Link>
            <Link
              href={`/${language}/signup`}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <div className="ml-3">
              <LanguageSwitcher currentLang={language} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <LanguageSwitcher currentLang={language} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-800/50">
            <div className="flex flex-col space-y-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(link.href.split("/").pop() || "")
                      ? "text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-800/50 mt-4">
                <Link
                  href={`/${language}/login`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
                >
                  Login
                </Link>
                <Link
                  href={`/${language}/signup`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
