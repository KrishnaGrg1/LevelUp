import React from 'react';
import Link from 'next/link';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

const Footer: React.FC = () => {
  const { language } = LanguageStore();

  return (
    <footer className="w-full bg-white dark:bg-black text-black dark:text-white border-t border-gray-100 dark:border-gray-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand + Tagline */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-black dark:text-white">LevelUp</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Product section */}
          <div>
            <h4 className="font-semibold mb-6 text-black dark:text-white">
              {t('footer.product.title')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${language}/features`}
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.product.features')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/pricing`}
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.product.pricing')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.product.mobileApp')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.product.integrations')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company section */}
          <div>
            <h4 className="font-semibold mb-6 text-black dark:text-white">
              {t('footer.company.title')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${language}/about`}
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.company.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/contact`}
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.company.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.company.careers')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.company.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h4 className="font-semibold mb-6 text-black dark:text-white">
              {t('footer.support.title')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.support.helpCenter')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/contact`}
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.support.contactSupport')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.support.community')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  {t('footer.support.status')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 dark:border-gray-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>{t('footer.copyright')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
