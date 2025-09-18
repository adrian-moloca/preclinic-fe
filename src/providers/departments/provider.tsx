import React, { FC, ReactNode, useState, useCallback, useRef } from 'react';
import { IDepartments } from './types';
import { DepartmentsContext } from './context';
import axios from 'axios';

interface DepartmentState {
  departments: IDepartments[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
}

export const DepartmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DepartmentState>({
    departments: [],
    loading: false,
    error: null,
    hasLoaded: false
  });
  
  const isFetchingRef = useRef(false);

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

  // Stable function using useCallback with force parameter
  const fetchDepartments = useCallback(async (force: boolean = false) => {
    // Prevent duplicate fetches unless forced
    if ((state.hasLoaded && !force) || isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await axios.get('/api/department/getAll');
      const mappedDepartments = response.data.map(mapDepartmentFromBackend);
      setState({
        departments: mappedDepartments,
        loading: false,
        error: null,
        hasLoaded: true
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch departments',
        hasLoaded: true // Mark as loaded even on error to prevent infinite retries
      }));
    } finally {
      isFetchingRef.current = false;
    }
  }, [state.hasLoaded]);

  const addDepartment = useCallback(async (newDepartment: Omit<IDepartments, 'id'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.post('/api/department/create', newDepartment);
      const mappedDepartment = mapDepartmentFromBackend(response.data);
      setState(prev => ({
        ...prev,
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
        ...prev,
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
        ...prev,
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
      error: null,
      hasLoaded: false
    });
  }, []);

  // REMOVED automatic useEffect - data will be fetched when component needs it
  // useEffect(() => {
  //   let mounted = true;
  //   
  //   const loadDepartments = async () => {
  //     if (mounted) {
  //       await fetchDepartments();
  //     }
  //   };
  //   
  //   loadDepartments();
  //   
  //   return () => {
  //     mounted = false;
  //   };
  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Empty dependency array - only runs once

  return (
    <DepartmentsContext.Provider
      value={{
        departments: state.departments,
        loading: state.loading,
        error: state.error,
        hasLoaded: state.hasLoaded,
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