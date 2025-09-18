import { createContext, useContext } from 'react';
import { IDoctorsContext } from './types';

export const DoctorsContext = createContext<IDoctorsContext>({
  doctors: [],
  setDoctors: () => {},
  addDoctor: () => {},
  updateDoctor: () => {},
  deleteDoctor: () => {},
  resetDoctors: () => {},
  fetchDoctors: () => {},
  loading: false
});

export const useDoctorsContext = () => useContext(DoctorsContext);
