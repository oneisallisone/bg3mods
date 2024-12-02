import { useState, useEffect } from 'react';
import type { Category } from '../../types';

interface CategoryEditorProps {
  categories: Category[];
  onUpdate: (category: Category) => void;
  onAdd: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryEditor = ({ categories, onUpdate, onAdd, onDelete }: CategoryEditorProps) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});

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
      onUpdate(updatedCategory);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('保存失败，请重试');
    }
  };

  const handleAdd = async () => {
    if (!newCategory.name) {
      alert('请填写分类名称');
      return;
    }

    try {
      const categoryToAdd = {
        ...newCategory,
        id: Math.random().toString(36).substr(2, 9),
        count: 0
      } as Category;

      await onAdd(categoryToAdd);
      setNewCategory({});
    } catch (error) {
      console.error('Error adding category:', error);
      alert(error instanceof Error ? error.message : '添加失败，请重试');
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

      onDelete(categoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('删除失败，请重试');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">添加新分类</h3>
            <p className="mt-1 text-sm text-gray-500">
              添加一个新的mod分类。
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  分类名称
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newCategory.name || ''}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newCategory.description || ''}
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                  图标
                </label>
                <input
                  type="text"
                  name="icon"
                  id="icon"
                  value={newCategory.icon || ''}
                  onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                添加分类
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">现有分类</h3>
          <div className="mt-5">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            名称
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            描述
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            图标
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">操作</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                          <tr key={category.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingCategory?.id === category.id ? (
                                <input
                                  type="text"
                                  value={editingCategory.name}
                                  onChange={e => setEditingCategory({
                                    ...editingCategory,
                                    name: e.target.value
                                  })}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-900">{category.name}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingCategory?.id === category.id ? (
                                <input
                                  type="text"
                                  value={editingCategory.description}
                                  onChange={e => setEditingCategory({
                                    ...editingCategory,
                                    description: e.target.value
                                  })}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-500">{category.description}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingCategory?.id === category.id ? (
                                <input
                                  type="text"
                                  value={editingCategory.icon}
                                  onChange={e => setEditingCategory({
                                    ...editingCategory,
                                    icon: e.target.value
                                  })}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-500">{category.icon}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {editingCategory?.id === category.id ? (
                                <div className="space-x-2">
                                  <button
                                    onClick={() => handleSave(editingCategory)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    保存
                                  </button>
                                  <button
                                    onClick={() => setEditingCategory(null)}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    取消
                                  </button>
                                </div>
                              ) : (
                                <div className="space-x-2">
                                  <button
                                    onClick={() => setEditingCategory(category)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    编辑
                                  </button>
                                  <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    删除
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditor;
