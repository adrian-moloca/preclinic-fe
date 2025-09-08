import React, { FC, ReactNode, useState, useCallback } from 'react';
import { IDepartments } from './types';
import { DepartmentsContext } from './context';
import axios from 'axios';

// export const MOCK_DEPARTMENTS: IDepartments[] = [
//   {
//     id: 'dep1',
//     name: 'Cardiology',
//     description: 'Department specializing in heart and vascular care.',
//     createdAt: '2025-08-01T09:00:00.000Z',
//     status: 'active',
//     doctors: ['d1'],
//     assistants: ['as1']
//   },
//   {
//     id: 'dep2',
//     name: 'Pediatrics',
//     description: 'Department for children\'s health and development.',
//     createdAt: '2025-08-01T09:00:00.000Z',
//     status: 'active',
//     doctors: ['d2'],
//     assistants: ['as2']
//   },
//   {
//     id: 'dep3',
//     name: 'Dermatology',
//     description: 'Department focused on skin conditions and treatments.',
//     createdAt: '2025-08-01T09:00:00.000Z',
//     status: 'active',
//     doctors: ['d3'],
//     assistants: ['as3']
//   }
// ];


export const DepartmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<IDepartments[]>([]);

  // useEffect(() => {
  //   const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       // Always include mock departments
  //       const merged = [
  //         ...MOCK_DEPARTMENTS,
  //         ...parsed.filter((d: IDepartments) => !MOCK_DEPARTMENTS.some(md => md.id === d.id))
  //       ];
  //       setDepartments(merged);
  //     } catch {
  //       console.warn('Failed to parse departments from localStorage');
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(departments));
  // }, [departments]);

  const addDepartment = async (newDepartment: IDepartments) => {
    try {
      const response = await axios.post<IDepartments>('/department', newDepartment);
      setDepartments(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add department:", error);
    }
  };

  const updateDepartment = async (id: string, updatedDepartment: IDepartments) => {
    try {
      const response = await axios.put<IDepartments>(`/department/${id}`, updatedDepartment);
      setDepartments(prev =>
        prev.map(entry => (entry.id === id ? response.data : entry))
      );
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      await axios.delete(`/department/${id}`);
      setDepartments(prev => prev.filter(department => department.id !== id));
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  const resetDepartments = useCallback(() => {
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