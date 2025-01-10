import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import backLinks from '../../back-link.json';

export default function Footer() {
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.language as 'en' | 'zh';

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">{t('footer.about.title')}</h3>
            <p className="text-sm leading-relaxed">{t('footer.about.description')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">{t('footer.links.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors duration-200">
                  {t('footer.links.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors duration-200">
                  {t('footer.links.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Back Links */}
          <div>
            <Link href="/back-links">
              <button className="text-white text-lg font-bold mb-4 hover:underline">
                {backLinks.title[currentLanguage]}
              </button>
            </Link>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">{t('footer.legal.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors duration-200">
                  {t('footer.legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors duration-200">
                  {t('footer.legal.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} BG3 Mods. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
