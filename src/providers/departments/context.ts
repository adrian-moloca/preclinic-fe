import { createContext, useContext } from 'react';
import { IDepartmentsContext } from './types';

export const DepartmentsContext = createContext<IDepartmentsContext>({
  departments: [],
  setDepartments: () => {},
  addDepartment: () => {},
  updateDepartment: () => {},
  deleteDepartment: () => {},
  resetDepartments: () => {},
});

export const useDepartmentsContext = () => useContext(DepartmentsContext);
