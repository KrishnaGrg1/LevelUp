import React from 'react';
import Link from 'next/link';

export const LandingFooter = () => {
  return (
    <footer className="w-full border-t border-gray-100 bg-white py-12 text-black dark:border-gray-900 dark:bg-black dark:text-white">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-6 px-6 text-sm font-medium text-gray-500 md:flex-row md:space-y-0 dark:text-gray-400">
        {/* Logo / Copyright */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-black dark:text-white">Levelup</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="#" className="transition-colors hover:text-black dark:hover:text-white">
            Product
          </Link>
          <Link href="#" className="transition-colors hover:text-black dark:hover:text-white">
            Privacy
          </Link>
          <Link href="#" className="transition-colors hover:text-black dark:hover:text-white">
            Terms
          </Link>
          <Link href="#" className="transition-colors hover:text-black dark:hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};
