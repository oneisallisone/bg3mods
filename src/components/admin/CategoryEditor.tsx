import { useState, useEffect } from 'react';
import { Category } from '../../types/mod';

const CategoryEditor = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});

  useEffect(() => {
    // 从API获取分类数据
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSave = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) throw new Error('Failed to update category');

      const updatedCategory = await response.json();
      const updatedCategories = categories.map(c => 
        c.id === updatedCategory.id ? updatedCategory : c
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('保存失败，请重试');
    }
  };

  const handleAdd = async () => {
    if (!newCategory.id || !newCategory.name) {
      alert('请填写完整的分类信息');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCategory,
          count: 0
        }),
      });

      if (!response.ok) throw new Error('Failed to add category');

      const addedCategory = await response.json();
      setCategories([...categories, addedCategory]);
      setNewCategory({});
    } catch (error) {
      console.error('Error adding category:', error);
      alert('添加失败，请重试');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('确定要删除这个分类吗？')) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      setCategories(categories.filter(c => c.id !== categoryId));
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('删除失败，请重试');
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">分类管理</h2>
      
      {/* 添加新分类 */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">添加新分类</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="分类ID (英文)"
            className="border rounded p-2"
            value={newCategory.id || ''}
            onChange={e => setNewCategory({...newCategory, id: e.target.value})}
          />
          <input
            type="text"
            placeholder="分类名称"
            className="border rounded p-2"
            value={newCategory.name || ''}
            onChange={e => setNewCategory({...newCategory, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="描述"
            className="border rounded p-2 md:col-span-2"
            value={newCategory.description || ''}
            onChange={e => setNewCategory({...newCategory, description: e.target.value})}
          />
          <input
            type="text"
            placeholder="图标 (emoji)"
            className="border rounded p-2"
            value={newCategory.icon || ''}
            onChange={e => setNewCategory({...newCategory, icon: e.target.value})}
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            添加分类
          </button>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category.id} className="border rounded p-4">
            {editingCategory?.id === category.id ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="分类名称"
                  className="border rounded p-2"
                  value={editingCategory.name}
                  onChange={e => setEditingCategory({
                    ...editingCategory,
                    name: e.target.value
                  })}
                />
                <input
                  type="text"
                  placeholder="描述"
                  className="border rounded p-2"
                  value={editingCategory.description}
                  onChange={e => setEditingCategory({
                    ...editingCategory,
                    description: e.target.value
                  })}
                />
                <input
                  type="text"
                  placeholder="图标"
                  className="border rounded p-2"
                  value={editingCategory.icon}
                  onChange={e => setEditingCategory({
                    ...editingCategory,
                    icon: e.target.value
                  })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(editingCategory)}
                    className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {category.icon} {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                  <p className="text-sm text-gray-500">ID: {category.id}</p>
                  <p className="text-sm text-gray-500">Mods数量: {category.count}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryEditor;
