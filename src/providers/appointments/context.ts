import { createContext, useContext } from 'react';
import { IAppointmentsContext } from './types';

export const AppointmentsContext = createContext<IAppointmentsContext>({
  appointments: [],
  setAppointments: () => {},
  addAppointment: () => {},
  updateAppointment: () => {},
  deleteAppointment: () => {},
  resetAppointments: () => {},
});

export const useAppointmentsContext = () => useContext(AppointmentsContext);
