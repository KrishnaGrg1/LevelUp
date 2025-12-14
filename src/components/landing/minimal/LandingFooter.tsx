import React from 'react';
import Link from 'next/link';

export const LandingFooter = () => {
  return (
    <footer className="w-full py-12 bg-white dark:bg-black text-black dark:text-white border-t border-gray-100 dark:border-gray-900">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-sm font-medium text-gray-500 dark:text-gray-400">
        {/* Logo / Copyright */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-black dark:text-white">Levelup</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
            Product
          </Link>
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};
