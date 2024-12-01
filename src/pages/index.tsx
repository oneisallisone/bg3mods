import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import type { GetStaticProps, NextPage } from 'next'
import CategoryGrid from '@/components/CategoryGrid'
import { CategoryNav } from '@/components/CategoryNav'
import { ModCard } from '@/components/ModCard'
import { useState } from 'react'
import { getLatestMods, getPopularMods } from '../utils/modUtils';

const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const [openSubQuestion, setOpenSubQuestion] = useState<{main: number | null, sub: number | null}>({main: null, sub: null})
  const latestMods = getLatestMods(6);
  const popularMods = getPopularMods(6);

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

      {/* 分类导航 */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-8 mb-16">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <CategoryNav className="sticky top-4" />
        </div>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          {/* 最新模组 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('latest_mods')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {latestMods.map((mod) => (
                <ModCard key={mod.id} mod={mod} />
              ))}
            </div>
          </section>

          {/* 热门模组 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('popular_mods')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularMods.map((mod) => (
                <ModCard key={mod.id} mod={mod} />
              ))}
            </div>
          </section>
        </div>
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
                <svg
                  className={`w-6 h-6 transform transition-transform ${
                    openQuestion === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Main Answer */}
              {openQuestion === i && (
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-700">{t(`faq.q${i}.answer`)}</p>

                  {/* Sub Questions */}
                  {[1, 2, 3].map((j) => {
                    const subQuestion = t(`faq.q${i}.sub.q${j}.question`, '')
                    const subAnswer = t(`faq.q${i}.sub.q${j}.answer`, '')

                    if (subQuestion && subAnswer) {
                      return (
                        <div key={j} className="mt-4">
                          <button
                            className="w-full text-left flex justify-between items-center text-gray-800 hover:text-gray-900"
                            onClick={() => toggleSubQuestion(i, j)}
                          >
                            <span className="font-medium">{subQuestion}</span>
                            <svg
                              className={`w-4 h-4 transform transition-transform ${
                                openSubQuestion.main === i && openSubQuestion.sub === j
                                  ? 'rotate-180'
                                  : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {openSubQuestion.main === i && openSubQuestion.sub === j && (
                            <p className="mt-2 pl-4 text-gray-600">{subAnswer}</p>
                          )}
                        </div>
                      )
                    }
                    return null
                  })}
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
