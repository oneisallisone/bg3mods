import { useState, useEffect } from 'react';
import type { Mod, Category } from '../types';

export const useAdmin = () => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取所有数据
  const fetchData = async () => {
    try {
      const [modsRes, categoriesRes] = await Promise.all([
        fetch('/api/mods'),
        fetch('/api/categories')
      ]);

      if (!modsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [modsData, categoriesData] = await Promise.all([
        modsRes.json(),
        categoriesRes.json()
      ]);

      setMods(modsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 更新mod
  const handleModUpdate = async (updatedMod: Mod) => {
    try {
      const response = await fetch(`/api/mods/${updatedMod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMod),
      });

      if (!response.ok) throw new Error('Failed to update mod');

      const updated = await response.json();
      setMods(mods.map(mod => mod.id === updated.id ? updated : mod));
    } catch (error) {
      console.error('Error updating mod:', error);
      throw error;
    }
  };

  // 添加mod
  const handleModAdd = async (newMod: Mod) => {
    try {
      const response = await fetch('/api/mods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMod),
      });

      if (!response.ok) throw new Error('Failed to add mod');

      const added = await response.json();
      setMods([...mods, added]);
    } catch (error) {
      console.error('Error adding mod:', error);
      throw error;
    }
  };

  // 删除mod
  const handleModDelete = async (modId: string) => {
    try {
      const response = await fetch(`/api/mods/${modId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete mod');

      setMods(mods.filter(mod => mod.id !== modId));
    } catch (error) {
      console.error('Error deleting mod:', error);
      throw error;
    }
  };

  // 更新分类
  const handleCategoryUpdate = async (updatedCategory: Category) => {
    try {
      const response = await fetch(`/api/categories/${updatedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) throw new Error('Failed to update category');

      const updated = await response.json();
      setCategories(categories.map(cat => cat.id === updated.id ? updated : cat));
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  // 添加分类
  const handleCategoryAdd = async (newCategory: Category) => {
    try {
      // 确保新分类包含必要的字段
      const categoryToAdd = {
        ...newCategory,
        count: 0, // 初始化count为0
        id: newCategory.id || Math.random().toString(36).substr(2, 9)
      };

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryToAdd),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }

      const added = await response.json();
      setCategories([...categories, added]);
      return added;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  // 删除分类
  const handleCategoryDelete = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    mods,
    categories,
    loading,
    handleModUpdate,
    handleModAdd,
    handleModDelete,
    handleCategoryUpdate,
    handleCategoryAdd,
    handleCategoryDelete,
  };
};
