import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IAssistent } from './types';
import { AssistentsContext } from './context';

const LOCAL_STORAGE_KEY = 'assistents';

export const AssistentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [assistents, setAssistents] = useState<IAssistent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setAssistents(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse assistents from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assistents));
  }, [assistents]);

  const addAssistent = useCallback((entry: IAssistent) => {
    setAssistents(prev => [...prev, entry]);
  }, []);

  const updateAssistent = useCallback((updatedEntry: IAssistent) => {
    setAssistents(prev =>
      prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  }, []);

  const deleteAssistent = useCallback((id: string) => {
    setAssistents(prev => {
      const filtered = prev.filter(entry => entry.id !== id);
      if (filtered.length !== prev.length) {
        console.log("✅ Deleted assistent with ID:", id);
      } else {
        console.warn("❌ Assistent not found:", id);
      }
      return filtered;
    });
  }, []);

  const resetAssistents = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAssistents([]);
  }, []);

  return (
    <AssistentsContext.Provider
      value={{
        assistents,
        setAssistents,
        addAssistent,
        updateAssistent,
        deleteAssistent,
        resetAssistents,
      }}
    >
      {children}
    </AssistentsContext.Provider>
  );
};
