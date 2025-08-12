import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IDepartments } from './types';
import { DepartmentsContext } from './context';

const LOCAL_STORAGE_KEY = 'departments';

export const DepartmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<IDepartments[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setDepartments(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse departments from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(departments));
  }, [departments]);

  const addDepartment = useCallback((entry: IDepartments) => {
    setDepartments(prev => [...prev, entry]);
  }, []);

  const updateDepartment = useCallback((id: string, updatedDepartment: IDepartments) => {
    setDepartments(prev =>
      prev.map(entry => (entry.id === id ? updatedDepartment : entry))
    );
  }, []);

  const deleteDepartment = useCallback((id: string) => {
    setDepartments(prev => {
      const filtered = prev.filter(entry => entry.id !== id);
      if (filtered.length !== prev.length) {
        console.log("✅ Deleted department with ID:", id);
      } else {
        console.warn("❌ Department not found:", id);
      }
      return filtered;
    });
  }, []);

  const resetDepartments = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDepartments([]);
  }, []);

  return (
    <DepartmentsContext.Provider
      value={{
        departments,
        setDepartments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        resetDepartments,
      }}
    >
      {children}
    </DepartmentsContext.Provider>
  );
};
