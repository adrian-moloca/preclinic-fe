import { createContext, useContext } from 'react';
import { IDepartmentsContext } from './types';

export const DepartmentsContext = createContext<IDepartmentsContext>({
  departments: [],
  setDepartments: () => {},
  addDepartment: () => {},
  updateDepartment: () => {},
  deleteDepartment: () => {},
  resetDepartments: () => {},
  fetchDepartments: async () => {},
  loading: false,
  error: null,
});

export const useDepartmentsContext = () => useContext(DepartmentsContext);
