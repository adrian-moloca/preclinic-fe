import { createContext, useContext } from 'react';
import { IPatientsContext } from './types';

export const PatientsContext = createContext<IPatientsContext>({
  patients: [],
  setPatients: () => {},
  addPatient: () => {},
  updatePatient: () => {},
  deletePatient: () => {},
  resetPatients: () => {},
});

export const usePatientsContext = () => useContext(PatientsContext);
