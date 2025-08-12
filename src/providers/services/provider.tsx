import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IServices } from './types';
import { ServicesContext } from './context';

const LOCAL_STORAGE_KEY = 'services';

export const ServicesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<IServices[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setServices(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse services from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const addService = useCallback((entry: IServices) => {
    setServices(prev => [...prev, entry]);
  }, []);

  const updateService = useCallback((updatedEntry: IServices) => {
    setServices(prev =>
      prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices(prev => {
      const filtered = prev.filter(entry => entry.id !== id);
      if (filtered.length !== prev.length) {
        console.log("✅ Deleted service with ID:", id);
      } else {
        console.warn("❌ Service not found:", id);
      }
      return filtered;
    });
  }, []);

  const resetServices = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setServices([]);
  }, []);

  return (
    <ServicesContext.Provider
      value={{
        services,
        setServices,
        addService,
        updateService,
        deleteService,
        resetServices,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
