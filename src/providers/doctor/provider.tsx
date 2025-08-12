import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IDoctor } from './types';
import { DoctorsContext } from './context';

const LOCAL_STORAGE_KEY = 'doctors';

export const DoctorsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setDoctors(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse doctors from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(doctors));
  }, [doctors]);

  const addDoctor = useCallback((entry: IDoctor) => {
    setDoctors(prev => [...prev, entry]);
  }, []);

  const updateDoctor = useCallback((updatedEntry: IDoctor) => {
    setDoctors(prev =>
      prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  }, []);

  const deleteDoctor = useCallback((id: string) => {
    setDoctors(prev => {
      const filtered = prev.filter(entry => entry.id !== id);
      if (filtered.length !== prev.length) {
        console.log("✅ Deleted doctor with ID:", id);
      } else {
        console.warn("❌ Doctor not found:", id);
      }
      return filtered;
    });
  }, []);

  const resetDoctors = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDoctors([]);
  }, []);

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        setDoctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        resetDoctors,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};
