import React from 'react';
import Link from 'next/link';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

const Footer: React.FC = () => {
  const { language } = LanguageStore();

  return (
    <footer className="w-full border-t border-gray-100 bg-white py-16 text-black transition-colors duration-300 dark:border-gray-900 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand + Tagline */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">LevelUp</h3>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Product section */}
          <div>
            <h4 className="mb-6 font-semibold text-black dark:text-white">
              {t('footer.product.title')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${language}/features`}
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.product.features')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/pricing`}
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.product.pricing')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.product.mobileApp')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.product.integrations')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company section */}
          <div>
            <h4 className="mb-6 font-semibold text-black dark:text-white">
              {t('footer.company.title')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${language}/about`}
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.company.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/contact`}
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.company.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.company.careers')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.company.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h4 className="mb-6 font-semibold text-black dark:text-white">
              {t('footer.support.title')}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.support.helpCenter')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/contact`}
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.support.contactSupport')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.support.community')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  {t('footer.support.status')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-gray-100 pt-8 text-sm text-gray-400 md:flex-row dark:border-gray-900">
          <p>{t('footer.copyright')}</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="#" className="transition-colors hover:text-black dark:hover:text-white">
              {t('footer.privacy')}
            </Link>
            <Link href="#" className="transition-colors hover:text-black dark:hover:text-white">
              {t('footer.terms')}
            </Link>
            <Link href="#" className="transition-colors hover:text-black dark:hover:text-white">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
