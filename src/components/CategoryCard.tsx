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
    <Link href={`/category/${category}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{icon}</div>
          {count !== undefined && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {count} mods
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {t(`categories.${category}`)}
        </h3>
      </div>
    </Link>
  )
}

export default CategoryCard
