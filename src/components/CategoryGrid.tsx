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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
