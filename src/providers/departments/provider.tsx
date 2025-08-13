import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IDepartments } from './types';
import { DepartmentsContext } from './context';

// These IDs must match the mock doctors and assistents from their providers!
export const MOCK_DEPARTMENTS: IDepartments[] = [
  {
    id: 'dep1',
    name: 'Cardiology',
    description: 'Department specializing in heart and vascular care.',
    createdAt: '2025-08-01T09:00:00.000Z',
    status: 'active',
    doctors: ['d1'],
    assistants: ['as1']
  },
  {
    id: 'dep2',
    name: 'Pediatrics',
    description: 'Department for children\'s health and development.',
    createdAt: '2025-08-01T09:00:00.000Z',
    status: 'active',
    doctors: ['d2'],
    assistants: ['as2']
  },
  {
    id: 'dep3',
    name: 'Dermatology',
    description: 'Department focused on skin conditions and treatments.',
    createdAt: '2025-08-01T09:00:00.000Z',
    status: 'active',
    doctors: ['d3'],
    assistants: ['as3']
  }
];

const LOCAL_STORAGE_KEY = 'departments';

export const DepartmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<IDepartments[]>(MOCK_DEPARTMENTS);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Always include mock departments
        const merged = [
          ...MOCK_DEPARTMENTS,
          ...parsed.filter((d: IDepartments) => !MOCK_DEPARTMENTS.some(md => md.id === d.id))
        ];
        setDepartments(merged);
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
    // Prevent deleting mock departments
    if (MOCK_DEPARTMENTS.some(md => md.id === id)) {
      console.warn("❌ Cannot delete mock department:", id);
      return;
    }
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
    setDepartments(MOCK_DEPARTMENTS);
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