import { useState, useEffect } from 'react';
import type { Mod, Category } from '../types';

interface ApiError {
  error: string;
  details?: string;
}

interface AdminState {
  mods: Mod[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export const useAdmin = () => {
  const [state, setState] = useState<AdminState>({
    mods: [],
    categories: [],
    loading: true,
    error: null
  });

  // 获取所有数据
  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
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

      setState(prev => ({
        ...prev,
        mods: modsData,
        categories: categoriesData,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      }));
    }
  };

  // Mod 相关操作
  const handleModUpdate = async (mod: Mod): Promise<Mod | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/mods/${mod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mod),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update mod');
      }

      const updatedMod = await response.json();
      setState(prev => ({
        ...prev,
        mods: prev.mods.map(m => m.id === mod.id ? updatedMod : m),
        loading: false,
        error: null
      }));

      return updatedMod;
    } catch (error) {
      console.error('Error updating mod:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update mod'
      }));
      return null;
    }
  };

  const handleModAdd = async (mod: Partial<Mod>): Promise<Mod | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/mods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mod),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add mod');
      }

      const newMod = await response.json();
      setState(prev => ({
        ...prev,
        mods: [...prev.mods, newMod],
        loading: false,
        error: null
      }));

      return newMod;
    } catch (error) {
      console.error('Error adding mod:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to add mod'
      }));
      return null;
    }
  };

  const handleModDelete = async (modId: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/mods/${modId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete mod');
      }

      setState(prev => ({
        ...prev,
        mods: prev.mods.filter(m => m.id !== modId),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error deleting mod:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete mod'
      }));
      throw error;
    }
  };

  // 更新分类
  const handleCategoryUpdate = async (updatedCategory: Category) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/categories/${updatedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to update category');
      }

      setState(prev => ({
        ...prev,
        categories: prev.categories.map(cat => cat.id === data.id ? data : cat),
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update category'
      }));
      throw error;
    }
  };

  // 添加分类
  const handleCategoryAdd = async (newCategory: Category) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to add category');
      }

      setState(prev => ({
        ...prev,
        categories: [...prev.categories, data],
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      console.error('Error adding category:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to add category'
      }));
      throw error;
    }
  };

  // 删除分类
  const handleCategoryDelete = async (categoryId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.details || data.error || 'Failed to delete category');
      }

      setState(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat.id !== categoryId),
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete category'
      }));
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ...state,
    handleModUpdate,
    handleModAdd,
    handleModDelete,
    handleCategoryUpdate,
    handleCategoryAdd,
    handleCategoryDelete,
    refreshData: fetchData
  };
};
