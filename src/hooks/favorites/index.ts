import { useState, useCallback } from 'react';

export interface FavoriteItem {
  id: string;
  type: 'patient' | 'appointment' | 'prescription' | 'product' | 'doctor' | 'service' | 'assistant' | 'department' | 'leave' | 'payroll';
  title: string;
  subtitle?: string;
  url: string;
  addedAt: number;
  metadata?: Record<string, any>;
}

const FAVORITES_KEY = 'preclinic-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addToFavorites = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    const favoriteItem: FavoriteItem = {
      ...item,
      addedAt: Date.now(),
    };

    setFavorites(prev => {
      if (prev.some(fav => fav.id === item.id && fav.type === item.type)) {
        return prev;
      }
      
      const updated = [...prev, favoriteItem];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromFavorites = useCallback((id: string, type: string) => {
    setFavorites(prev => {
      const updated = prev.filter(item => !(item.id === id && item.type === type));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: string, type: string) => {
    return favorites.some(item => item.id === id && item.type === type);
  }, [favorites]);

  const getFavoritesByType = useCallback((type: FavoriteItem['type']) => {
    return favorites.filter(item => item.type === type);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem(FAVORITES_KEY);
  }, []);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesByType,
    clearFavorites,
  };
};