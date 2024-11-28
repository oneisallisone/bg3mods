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
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl hover:bg-blue-200 transition-colors">
            {icon}
          </div>
          {count !== undefined && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {count} mods
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            {t(`categories.${category}`)}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
