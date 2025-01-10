import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import backLinks from '../../back-link.json';
import type { BackLinksData, BackLink } from '../types/back-link';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['back-links', 'common'])),
    },
  };
}

export default function BackLinksPage() {
  const { t, i18n } = useTranslation('back-links');
  type LanguageKey = 'en' | 'zh';
  const currentLanguage = i18n.language as LanguageKey;

  const backLinksData = {
    title: backLinks.title,
    description: backLinks.description,
    links: backLinks.links
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">{backLinksData.title[currentLanguage]}</h1>
      <p className="text-lg mb-8">{backLinksData.description[currentLanguage]}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {backLinksData.links.map((link, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">
                <a
                  href={link.url}
                  className="text-white hover:text-blue-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name[currentLanguage]}
                </a>
              </h2>
              <p className="text-gray-400 mb-4 flex-grow">
                {link.description?.[currentLanguage] || t('noDescription')}
              </p>
              <div className="text-right">
                <a
                  href={link.url}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('visitLink')}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}