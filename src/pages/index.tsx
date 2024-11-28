import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'
import Layout from '@/components/Layout'
import CategoryGrid from '@/components/CategoryGrid'
import { useState } from 'react'

const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const [openSubQuestion, setOpenSubQuestion] = useState<{main: number | null, sub: number | null}>({main: null, sub: null})

  const toggleQuestion = (index: number) => {
    if (openQuestion === index) {
      setOpenQuestion(null)
      setOpenSubQuestion({main: null, sub: null})
    } else {
      setOpenQuestion(index)
      setOpenSubQuestion({main: index, sub: null})
    }
  }

  const toggleSubQuestion = (mainIndex: number, subIndex: number) => {
    if (openSubQuestion.main === mainIndex && openSubQuestion.sub === subIndex) {
      setOpenSubQuestion({...openSubQuestion, sub: null})
    } else {
      setOpenSubQuestion({main: mainIndex, sub: subIndex})
    }
  }

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

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">{t('faq.title')}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
                {/* Main Question */}
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100"
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
                  <div className="px-6 py-4">
                    {/* Main Answer */}
                    <p className="text-gray-700 mb-4">{t(`faq.q${i}.answer`)}</p>
                    
                    {/* Sub Questions */}
                    <div className="space-y-2 ml-4">
                      {[1, 2, 3, 4, 5].map((subI) => {
                        const subQuestion = t(`faq.q${i}.subQuestions.${subI}.q`, { returnNull: true })
                        if (!subQuestion) return null
                        
                        return (
                          <div key={subI} className="border-l-2 border-gray-200">
                            <button
                              className="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-50"
                              onClick={() => toggleSubQuestion(i, subI)}
                            >
                              <span className="text-gray-800">
                                {subQuestion}
                              </span>
                              <span className={`transform transition-transform ${
                                openSubQuestion.main === i && openSubQuestion.sub === subI ? 'rotate-180' : ''
                              }`}>
                                ▼
                              </span>
                            </button>
                            {openSubQuestion.main === i && openSubQuestion.sub === subI && (
                              <div className="px-4 py-2 text-gray-600">
                                {t(`faq.q${i}.subQuestions.${subI}.a`)}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">{t('history.title')}</h2>
          <div className="space-y-8">
            <div className="prose max-w-none">
              <h3 className="text-2xl font-semibold mb-4">{t('history.bg_series')}</h3>
              <div 
                className="text-gray-700 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('history.bg_content') }}
              />
            </div>
            <div className="prose max-w-none">
              <h3 className="text-2xl font-semibold mb-4">{t('history.bg3_title')}</h3>
              <div 
                className="text-gray-700 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('history.bg3_content') }}
              />
            </div>
            <div className="prose max-w-none">
              <h3 className="text-2xl font-semibold mb-4">{t('history.modding_title')}</h3>
              <div 
                className="text-gray-700 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('history.modding_content') }}
              />
              <div 
                className="text-gray-700 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('history.modding_features') }}
              />
              <div 
                className="text-gray-700 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('history.modding_community') }}
              />
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
