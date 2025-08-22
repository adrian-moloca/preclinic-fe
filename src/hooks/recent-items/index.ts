import { useState, useCallback } from 'react';

export interface RecentItem {
  id: string;
  type: 'patient' | 'appointment' | 'prescription' | 'assistant' | 'product' | 'doctor' | 'service' | 'department' | 'leave' | 'payroll';
  title: string;
  subtitle?: string;
  url: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

const RECENT_ITEMS_KEY = 'preclinic-recent-items';
const MAX_RECENT_ITEMS = 10;

export const useRecentItems = () => {
  const [recentItems, setRecentItems] = useState<RecentItem[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addRecentItem = useCallback((item: Omit<RecentItem, 'timestamp'>) => {
    const newItem: RecentItem = {
      ...item,
      timestamp: Date.now(),
    };

    setRecentItems(prev => {
      const filtered = prev.filter(existing => 
        !(existing.id === item.id && existing.type === item.type)
      );
      
      const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
      
      localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(updated));
      
      return updated;
    });
  }, []);

  const removeRecentItem = useCallback((id: string, type: string) => {
    setRecentItems(prev => {
      const updated = prev.filter(item => !(item.id === id && item.type === type));
      localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
    localStorage.removeItem(RECENT_ITEMS_KEY);
  }, []);

  const getRecentItemsByType = useCallback((type: RecentItem['type']) => {
    return recentItems.filter(item => item.type === type);
  }, [recentItems]);

  return {
    recentItems,
    addRecentItem,
    removeRecentItem,
    clearRecentItems,
    getRecentItemsByType,
  };
};