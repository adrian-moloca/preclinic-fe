import { createContext, useContext } from 'react';
import { IPatientsContext, PatientsEntry } from './types';
import { Patient } from '../../components/create-patient-form/component';

export const PatientsContext = createContext<IPatientsContext>({
  patients: [],
  setPatients: () => {},
  addPatient: (entry: PatientsEntry) => {},
  updatePatient: (entry: Patient) => {},
  deletePatient: (id: string) => {},
  resetPatients: () => {},
});

export const usePatientsContext = () => useContext(PatientsContext);
