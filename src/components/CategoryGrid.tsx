import CategoryCard from './CategoryCard'

const categories = [
  { id: 'prerequisites', icon: '🔧' },
  { id: 'ui', icon: '🖥️' },
  { id: 'gameplay', icon: '🎮' },
  { id: 'appearance', icon: '👤' },
  { id: 'equipment', icon: '⚔️' },
  { id: 'dice', icon: '🎲' },
  { id: 'balance', icon: '⚖️' },
  { id: 'class', icon: '✨' },
  { id: 'modifiers', icon: '🛠️' },
]

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category.id}
          icon={category.icon}
        />
      ))}
    </div>
  )
}

export default CategoryGrid
