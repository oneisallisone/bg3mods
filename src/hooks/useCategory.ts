import { useState, useEffect } from 'react';
import { CategoryInfo } from '../types/mod';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useCategories() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    
    // Set up periodic sync
    const syncInterval = setInterval(fetchCategories, SYNC_INTERVAL);
    
    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
}

export function useCategoryInfo(categoryId: string) {
  const { categories, loading, error } = useCategories();
  const category = categories.find(cat => cat.id === categoryId);
  
  return { 
    category, 
    loading, 
    error,
    exists: !!category 
  };
}
