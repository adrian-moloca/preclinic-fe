import React, { FC, ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { IDepartments } from './types';
import { DepartmentsContext } from './context';
import axios from 'axios';
import { useClinicContext } from '../clinic/context';

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
  const { selectedClinic } = useClinicContext();
  
  const isFetchingRef = useRef(false);

  const mapDepartmentFromBackend = (dept: any): IDepartments => ({
    id: dept._id || dept.id,
    name: dept.name,
    description: dept.description,
    status: dept.status,
    doctors: dept.doctors,
    assistants: dept.assistants,
    createdAt: dept.createdAt,
    updatedAt: dept.updatedAt,
  });

 const fetchDepartments = useCallback(async (force: boolean = false) => {
  if (!selectedClinic?._id) {
    console.warn('No clinic selected, cannot fetch departments');
    return;
  }
  
  if ((state.hasLoaded && !force) || isFetchingRef.current) {
    return;
  }
  
  isFetchingRef.current = true;
  setState(prev => ({ ...prev, loading: true, error: null }));
  
  try {
    const clinicId = selectedClinic._id;
    const response = await axios.get(`/api/department/getAllByClinic/${clinicId}`);
    
    const mappedDepartments = response.data.map((dept: any) => {
      const mapped = mapDepartmentFromBackend(dept);
      return mapped;
    });
    
    setState({
      departments: mappedDepartments,
      loading: false,
      error: null,
      hasLoaded: true
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    setState(prev => ({
      ...prev,
      loading: false,
      error: error instanceof Error ? error.message : 'Failed to fetch departments',
      hasLoaded: true
    }));
  } finally {
    isFetchingRef.current = false;
  }
}, [state.hasLoaded, selectedClinic]);
useEffect(() => {
  setState({
    departments: [],
    loading: false,
    error: null,
    hasLoaded: false
  });
  
  if (selectedClinic?._id) {
    const timer = setTimeout(() => {
      fetchDepartments(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }
  //eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedClinic?._id]);

const addDepartment = useCallback(async (newDepartment: Omit<IDepartments, 'id'>) => {
  setState(prev => ({ ...prev, loading: true, error: null }));
  try {
    const requestData = {
      ...newDepartment,
      clinic: selectedClinic?._id
    };
    
    const response = await axios.post('/api/department/create', requestData);
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
    throw error;
  }
}, [selectedClinic]);

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