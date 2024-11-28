import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'
import Layout from '@/components/Layout'
import CategoryGrid from '@/components/CategoryGrid'

const Home: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('welcome')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="mb-16">
          <CategoryGrid />
        </div>

        {/* History Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">{t('history.title')}</h2>
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-semibold mb-4">{t('history.bg_series')}</h3>
              <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: t('history.bg_content') }} />
            </div>
            <div className="prose max-w-none">
              <h3 className="text-2xl font-semibold mb-4">{t('history.bg3_title')}</h3>
              <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: t('history.bg3_content') }} />
            </div>
            <div className="prose max-w-none">
              <h3 className="text-2xl font-semibold mb-4">{t('history.modding_title')}</h3>
              <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: t('history.modding_content') }} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default Home
