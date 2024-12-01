import { useTranslation } from 'next-i18next'
import Link from 'next/link'

interface CategoryCardProps {
  category: string
  icon: string
  count?: number
}

const CategoryCard = ({ category, icon, count }: CategoryCardProps) => {
  const { t } = useTranslation('common')

  return (
    <Link href={`/category/${category}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 min-h-[200px] flex items-center">
        <div className="flex flex-col items-center justify-center space-y-2 w-full">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
            {icon}
          </div>
          {count !== undefined && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
              {count} mods
            </span>
          )}
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {t(`categories.${category}`)}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {t(`categories.${category}_desc`)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
