import React from 'react';
import Link from 'next/link';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

const Footer: React.FC = () => {
  const { language } = LanguageStore();

  return (
    <footer className="bg-black border-t border-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand + Tagline */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              {t('footer.brand')}
            </h3>
            <p className="text-slate-400 text-sm">{t('footer.tagline')}</p>
          </div>

          {/* Product section */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.product.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${language}/features`}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.product.features')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/pricing`}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.product.pricing')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.product.mobileApp')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.product.integrations')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company section */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.company.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${language}/about`}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.company.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/contact`}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.company.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.company.careers')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.company.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.support.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.support.helpCenter')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${language}/contact`}
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.support.contactSupport')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.support.community')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.support.status')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">{t('footer.copyright')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-slate-500 hover:text-white transition-colors text-sm">
              {t('footer.privacy')}
            </Link>
            <Link href="#" className="text-slate-500 hover:text-white transition-colors text-sm">
              {t('footer.terms')}
            </Link>
            <Link href="#" className="text-slate-500 hover:text-white transition-colors text-sm">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
