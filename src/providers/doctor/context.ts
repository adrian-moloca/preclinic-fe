import { createContext, useContext } from 'react';
import { IDoctorsContext } from './types';

export const DoctorsContext = createContext<IDoctorsContext>({
  doctors: [],
  setDoctors: () => {},
  addDoctor: () => {},
  updateDoctor: () => {},
  deleteDoctor: () => {},
  resetDoctors: () => {},
});

export const useDoctorsContext = () => useContext(DoctorsContext);
