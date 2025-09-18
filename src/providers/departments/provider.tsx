import React, { FC, ReactNode, useState, useCallback, useEffect } from 'react';
import { IDepartments } from './types';
import { DepartmentsContext } from './context';
import axios from 'axios';

interface DepartmentState {
  departments: IDepartments[];
  loading: boolean;
  error: string | null;
}

export const DepartmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DepartmentState>({
    departments: [],
    loading: false,
    error: null
  });

  // Helper function to map backend response to frontend format
  const mapDepartmentFromBackend = (dept: any): IDepartments => ({
    id: dept._id || dept.id,  // Map _id to id
    name: dept.name,
    description: dept.description,
    status: dept.status,
    doctors: dept.doctors,
    assistants: dept.assistants,
    createdAt: dept.createdAt,
    updatedAt: dept.updatedAt,
  });

  // Stable function using useCallback
  const fetchDepartments = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get('/api/department/getAll');
      const mappedDepartments = response.data.map(mapDepartmentFromBackend);
      setState({
        departments: mappedDepartments,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch departments'
      }));
    }
  }, []);

  const addDepartment = useCallback(async (newDepartment: Omit<IDepartments, 'id'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.post('/api/department/create', newDepartment);
      const mappedDepartment = mapDepartmentFromBackend(response.data);
      setState(prev => ({
        departments: [...prev.departments, mappedDepartment],
        loading: false,
        error: null
      }));
      return mappedDepartment;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to add department'
      }));
      throw error; // Re-throw to allow component-level handling
    }
  }, []);

  const updateDepartment = useCallback(async (id: string, updatedDepartment: Partial<IDepartments>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.put(`/api/department/patch/${id}`, updatedDepartment);
      const mappedDepartment = mapDepartmentFromBackend(response.data);
      setState(prev => ({
        departments: prev.departments.map(dept => dept.id === id ? mappedDepartment : dept),
        loading: false,
        error: null
      }));
      return mappedDepartment;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update department'
      }));
      throw error;
    }
  }, []);

  const deleteDepartment = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await axios.delete(`/api/department/delete/${id}`);
      setState(prev => ({
        departments: prev.departments.filter(dept => dept.id !== id),
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete department'
      }));
      throw error;
    }
  }, []);

  const resetDepartments = useCallback(() => {
    setState({
      departments: [],
      loading: false,
      error: null
    });
  }, []);

  // Initial fetch with cleanup
  useEffect(() => {
    let mounted = true;
    
    const loadDepartments = async () => {
      if (mounted) {
        await fetchDepartments();
      }
    };
    
    loadDepartments();
    
    return () => {
      mounted = false;
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only runs once

  return (
    <DepartmentsContext.Provider
      value={{
        departments: state.departments,
        loading: state.loading,
        error: state.error,
        setDepartments: (deps) => setState(prev => ({ ...prev, departments: deps })),
        fetchDepartments,
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