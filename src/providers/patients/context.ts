import { createContext, useContext } from 'react';
import { IPatientsContext, PatientsEntry } from './types';
import { Patient } from '../../components/create-patient-form/component';

export const PatientsContext = createContext<IPatientsContext>({
  patients: [],
  setPatients: () => {},
  addPatient: (entry: PatientsEntry) => {},
  updatePatient: (entry: Patient) => {},
  getAllPatients: () => {},
  deletePatient: (id: string) => {},
  resetPatients: () => {},
  loading: false,
  hasLoaded: false,
});

export const usePatientsContext = () => useContext(PatientsContext);
