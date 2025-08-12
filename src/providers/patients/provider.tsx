import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { PatientsEntry } from './types';
import { PatientsContext } from './context';

const LOCAL_STORAGE_KEY = 'patients';

export const PatientsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientsEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setPatients(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse patients from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  const addPatient = useCallback((entry: PatientsEntry) => {
    setPatients(prev => [...prev, entry]);
  }, []);

  const updatePatient = useCallback((updatedEntry: PatientsEntry) => {
    setPatients(prev =>
      prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  }, []);

  const deletePatient = useCallback((id: string) => {
    setPatients(prev => {
      const filtered = prev.filter(entry => entry.id !== id);
      if (filtered.length !== prev.length) {
        console.log("✅ Deleted patient with ID:", id);
      } else {
        console.warn("❌ Patient not found:", id);
      }
      return filtered;
    });
  }, []);

  const resetPatients = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPatients([]);
  }, []);

  return (
    <PatientsContext.Provider
      value={{
        patients,
        setPatients,
        addPatient,
        updatePatient,
        deletePatient,
        resetPatients,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};
