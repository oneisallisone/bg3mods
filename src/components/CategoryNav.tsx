import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { CategoryIcon } from './CategoryIcon';
import { getAllCategories } from '../utils/modUtils';
import { useState } from 'react';

interface CategoryNavProps {
  className?: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ className = '' }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const categories = getAllCategories();
  const currentCategory = router.query.category as string || 'all';

  const categoryIcons: Record<string, string> = {
    prerequisites: 'tools',
    ui: 'monitor',
    gameplay: 'gamepad',
    appearance: 'user',
    equipment: 'sword',
    dice: 'dice',
    balance: 'scale',
    class: 'wand',
    modifiers: 'settings',
    all: 'all'
  };

  return (
    <nav className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {/* 移动端菜单按钮 */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <span className="font-medium">{t('categories.title')}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 分类列表 */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white hidden lg:block mb-4">
            {t('categories.title')}
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                  currentCategory === 'all'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <CategoryIcon name="all" className="mr-3" />
                {t('categories.all')}
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.id}`}
                  className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                    currentCategory === category.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={t(`categories.${category.id}_desc`)}
                >
                  <CategoryIcon name={categoryIcons[category.id]} className="mr-3" />
                  {t(`categories.${category.id}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
