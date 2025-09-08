import { createContext, useContext } from 'react';
import { IPatientsContext, PatientsEntry } from './types';

export const PatientsContext = createContext<IPatientsContext>({
  patients: [],
  setPatients: () => {},
  addPatient: (entry: PatientsEntry) => {},
  updatePatient: (entry: PatientsEntry) => {},
  deletePatient: (id: string) => {},
  resetPatients: () => {},
});

export const usePatientsContext = () => useContext(PatientsContext);
