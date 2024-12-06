import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';

export default function Terms() {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO 
        title={t('terms.title')}
        description={t('terms.description')}
      />
      <h1 className="text-3xl font-bold mb-8">{t('terms.title')}</h1>
      
      <article className="prose dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p>Last updated: December 05, 2024</p>

        <section className="mb-8">
          <h2>{t('terms.acceptance.title')}</h2>
          <p>{t('terms.acceptance.content')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('terms.services.title')}</h2>
          <p>{t('terms.services.content')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('terms.content.title')}</h2>
          <p>{t('terms.content.content')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('terms.intellectual.title')}</h2>
          <p>{t('terms.intellectual.content')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('terms.liability.title')}</h2>
          <p>{t('terms.liability.content')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('terms.modifications.title')}</h2>
          <p>{t('terms.modifications.content')}</p>
        </section>

        <section className="mb-8">
          <h2>{t('terms.governing.title')}</h2>
          <p>{t('terms.governing.content')}</p>
        </section>
      </article>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
