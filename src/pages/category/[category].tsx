import { GetStaticProps, GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CategoryNav } from '../../components/CategoryNav';
import { ModCard } from '../../components/ModCard';
import { getAllCategories, getModsByCategory } from '../../utils/modUtils';
import { ModCategory } from '../../types/mod';

interface CategoryPageProps {
  category: ModCategory;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const { t } = useTranslation('common');
  const mods = getModsByCategory(category);
  const categoryInfo = getAllCategories().find(cat => cat.id === category);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <CategoryNav className="sticky top-4" />
        </div>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t(`categories.${category}`)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t(`categories.${category}_desc`)}
            </p>
          </div>

          {/* 模组网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mods.map((mod) => (
              <ModCard key={mod.id} mod={mod} />
            ))}
          </div>

          {/* 无模组提示 */}
          {mods.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {t('no_mods_in_category')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const categories = getAllCategories();
  const paths = locales.flatMap(locale => 
    categories.map(category => ({
      params: { category: category.id },
      locale
    }))
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const category = params?.category as ModCategory;

  return {
    props: {
      category,
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};