import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { AppointmentsEntry } from './types';
import { AppointmentsContext } from './context';

const LOCAL_STORAGE_KEY = 'appointments';

export const AppointmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
   const [appointments, setAppointments] = useState<AppointmentsEntry[]>([]);


  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setAppointments(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse appointments from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);


const addAppointment = useCallback((entry: AppointmentsEntry) => {
  setAppointments(prev => [...prev, entry]);
}, []);

const updateAppointment = useCallback((updatedEntry: AppointmentsEntry) => {
  setAppointments(prev =>
    prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
  );
}, []);

const deleteAppointment = useCallback((id: string) => {
  setAppointments(prev => prev.filter(entry => entry.id !== id));
}, []);


  const resetAppointments = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAppointments([]);
  }, []);

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        setAppointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        resetAppointments,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};
