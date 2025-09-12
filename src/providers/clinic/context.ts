import { createContext, useContext } from 'react';
import { ClinicContextType } from './types';

export const ClinicContext = createContext<ClinicContextType>({
  clinics: [],
  selectedClinic: null,
  loading: false,
  error: null,
  createClinic: async () => { throw new Error('ClinicProvider not found'); },
  updateClinic: async () => { throw new Error('ClinicProvider not found'); },
  getClinicByOwnerId: () => null,
  deleteClinic: async () => { throw new Error('ClinicProvider not found'); },
  getMyClinic: async () => null,
  selectClinic: () => {},
  getUserClinics: () => [],
  resetClinics: () => {},
});

export const useClinicContext = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinicContext must be used within a ClinicProvider');
  }
  return context;
};