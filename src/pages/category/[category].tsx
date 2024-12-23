import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { ModCard } from '../../components/ModCard';
import { getAllCategories } from '../../utils/modUtils';
import { Category, Mod } from '../../types';
import { useMods } from '../../hooks/useMods';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import SEO from '../../components/SEO';
import { CategoryNav } from '../../components/CategoryNav';

interface CategoryPageProps {
  categoryId: string;
}

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const { t } = useTranslation('common');
  const { mods, loading, error } = useMods(categoryId);
  const categories = getAllCategories();
  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={`${category.name} - BG3 Mods`}
        description={category.description}
        category={category.name}
      />
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <CategoryNav className="sticky top-4" />
        </div>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t(`categories.${category.id}`)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t(`categories.${category.id}_desc`)}
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">
                {t('error.failed_to_load')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                {error}
              </p>
            </div>
          )}

          {/* 加载状态 */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          )}

          {/* 模组网格 */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mods.map((mod) => (
                <ModCard key={mod.id} mod={mod} />
              ))}
            </div>
          )}

          {/* 无模组提示 */}
          {!loading && !error && mods.length === 0 && (
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
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const categoryId = params?.category as string;

  return {
    props: {
      categoryId,
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};
