import { createContext, useContext } from 'react';
import { AppointmentsEntry, IAppointmentsContext } from './types';

export const AppointmentsContext = createContext<IAppointmentsContext>({
  appointments: [],
  addAppointment: () => { },
  updateAppointment: () => { },
  deleteAppointment: () => { },
  getAppointmentById: function (id: string): AppointmentsEntry | undefined {
    throw new Error('Function not implemented.');
  }
});

export const useAppointmentsContext = () => useContext(AppointmentsContext);
