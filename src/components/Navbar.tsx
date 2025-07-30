import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/en/home"
            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
          >
            Level Up
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/en/home"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/en/features"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/en/pricing"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/en/about"
              className="text-slate-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/en/contact"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/en/login"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/en/register"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
