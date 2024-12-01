import CategoryCard from './CategoryCard'
import { useCategories } from '../hooks/useCategory'

const CategoryGrid = () => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-[200px]"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category.id}
          icon={category.icon}
          count={category.count}
        />
      ))}
    </div>
  )
}

export default CategoryGrid
