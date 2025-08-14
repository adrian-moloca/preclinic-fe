import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IServices } from './types';
import { ServicesContext } from './context';

const LOCAL_STORAGE_KEY = 'services';

export const MOCK_SERVICES: IServices[] = [
  {
    id: 's1',
    name: 'Cardiology Consultation',
    description: 'Specialist consultation for heart and vascular conditions.',
    price: 200,
    duration: 30,
    status: 'active',
    department: 'Cardiology',
    products: ['p1', 'p3']
  },
  {
    id: 's2',
    name: 'Pediatric Checkup',
    description: 'Routine health check for children.',
    price: 150,
    duration: 25,
    status: 'active',
    department: 'Pediatrics',
    products: ['p2']
  },
  {
    id: 's3',
    name: 'Dermatology Skin Exam',
    description: 'Comprehensive skin examination and advice.',
    price: 180,
    duration: 20,
    status: 'active',
    department: 'Dermatology',
    products: []
  }
];

export const ServicesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<IServices[]>(MOCK_SERVICES);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const merged = [
          ...MOCK_SERVICES,
          ...parsed.filter((s: IServices) => !MOCK_SERVICES.some(ms => ms.id === s.id))
        ];
        setServices(merged);
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

  const updateService = useCallback((entry: IServices) => {
    setServices(prev =>
      prev.map(s => (s.id === entry.id ? entry : s))
    );
  }, []);

  const deleteService = useCallback((id: string) => {
    if (MOCK_SERVICES.some(ms => ms.id === id)) {
      console.warn("❌ Cannot delete mock service:", id);
      return;
    }
    setServices(prev => prev.filter(s => s.id !== id));
  }, []);

  const resetServices = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setServices(MOCK_SERVICES);
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