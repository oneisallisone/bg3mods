import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'
import Layout from '@/components/Layout'
import { useState } from 'react'

const FAQ: NextPage = () => {
  const { t } = useTranslation('common')
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index)
  }

  return (
    <Layout title={t('faq.title')} description={t('faq.description')}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {t('faq.title')}
          </h1>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                  onClick={() => toggleQuestion(i)}
                >
                  <span className="font-semibold text-lg">
                    {t(`faq.q${i}.question`)}
                  </span>
                  <span className={`transform transition-transform ${
                    openQuestion === i ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                {openQuestion === i && (
                  <div className="px-6 py-4 bg-gray-50">
                    <p className="text-gray-700">{t(`faq.q${i}.answer`)}</p>
                  </div>
                )}
              </div>
            ))}
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

export default FAQ
