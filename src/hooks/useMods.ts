import { useState, useEffect } from 'react';
import { Mod } from '../types';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useMods(category?: string) {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMods = async () => {
    try {
      const url = category ? `/api/mods?category=${category}` : '/api/mods';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch mods');
      }
      const data = await response.json();
      setMods(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMods();
    
    // Set up periodic sync
    const syncInterval = setInterval(fetchMods, SYNC_INTERVAL);
    
    return () => {
      clearInterval(syncInterval);
    };
  }, [category]);

  return { mods, loading, error, refetch: fetchMods };
}

export function useLatestMods(limit: number = 6) {
  const { mods, loading, error } = useMods();
  
  const latestMods = mods
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, limit);

  return { mods: latestMods, loading, error };
}

export function usePopularMods(limit: number = 6) {
  const { mods, loading, error } = useMods();
  
  const popularMods = mods
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, limit);

  return { mods: popularMods, loading, error };
}
