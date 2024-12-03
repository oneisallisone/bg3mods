import { useState, useEffect } from 'react';
import { Mod } from '../types';

const SYNC_INTERVAL = 10 * 60 * 1000; // 10 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Simple in-memory cache
const cache: { [key: string]: { data: Mod[], timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useMods(category?: string) {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCacheKey = () => category ? `mods-${category}` : 'mods-all';

  const fetchWithRetry = async (url: string, retries = MAX_RETRIES): Promise<Mod[]> => {
    try {
      const response = await fetch(url);
      if (response.status === 429) { // Rate limit exceeded
        if (retries > 0) {
          await sleep(RETRY_DELAY);
          return fetchWithRetry(url, retries - 1);
        }
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch mods');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      if (retries > 0) {
        await sleep(RETRY_DELAY);
        return fetchWithRetry(url, retries - 1);
      }
      throw err;
    }
  };

  const fetchMods = async () => {
    try {
      const cacheKey = getCacheKey();
      const now = Date.now();
      const cached = cache[cacheKey];

      // Return cached data if valid
      if (cached && (now - cached.timestamp) < CACHE_TTL) {
        setMods(cached.data);
        setError(null);
        setLoading(false);
        return;
      }

      const url = category ? `/api/mods?category=${category}` : '/api/mods';
      const data = await fetchWithRetry(url);
      
      // Update cache
      cache[cacheKey] = {
        data,
        timestamp: now
      };

      setMods(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mods');
      // Use cached data if available when request fails
      const cacheKey = getCacheKey();
      const cached = cache[cacheKey];
      if (cached) {
        setMods(cached.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMods();
    
    // Set up periodic sync with longer interval
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
    .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
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
