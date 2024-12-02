import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'

const About: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.description')} />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {t('about.title')}
          </h1>
          
          <div className="space-y-8">
            {/* Mission Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {t('about.mission.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t('about.mission.content')}
              </p>
            </section>

            {/* Story Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {t('about.story.title')}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {t('about.story.content')}
                </p>
              </div>
            </section>

            {/* Features Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {t('about.features.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>{t(`about.features.feature${i}`)}</li>
                ))}
              </ul>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                {t('about.contact.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t('about.contact.content')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default About
