import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { AppointmentsEntry } from './types';
import { AppointmentsContext } from './context';
import { IDepartments } from '../departments';

const LOCAL_STORAGE_KEY = 'appointments';

export const MOCK_APPOINTMENTS: AppointmentsEntry[] = [
  {
    id: 'a1',
    patients: ['1'],
    patientId: '1',
    appointmentType: 'In-person',
    type: 'consultation',
    date: '2025-08-15',
    time: '09:00',
    reason: 'Routine checkup',
    status: 'scheduled',
    department: { id: 'd1', name: 'Cardiology' } as IDepartments, 
  },
  {
    id: 'a2',
    patients: ['2'],
    patientId: '2',
    appointmentType: 'Online',
    type: 'follow-up',
    date: '2025-08-16',
    time: '14:30',
    reason: 'Asthma follow-up',
    status: 'confirmed',
    department: { id: 'd2', name: 'Pediatrics' } as IDepartments,
  },
  {
    id: 'a3',
    patients: ['3'],
    patientId: '3',
    appointmentType: 'In-person',
    type: 'consultation',
    date: '2025-08-17',
    time: '11:15',
    reason: 'Medication review',
    status: 'completed',
    department: { id: 'd3', name: 'Dermatology' } as IDepartments,
  }
];

export const AppointmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<AppointmentsEntry[]>(MOCK_APPOINTMENTS);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Always include mock appointments
        const merged = [
          ...MOCK_APPOINTMENTS,
          ...parsed.filter((a: AppointmentsEntry) => !MOCK_APPOINTMENTS.some(ma => ma.id === a.id))
        ];
        setAppointments(merged);
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
    // Prevent deleting mock appointments
    if (MOCK_APPOINTMENTS.some(ma => ma.id === id)) {
      console.warn("❌ Cannot delete mock appointment:", id);
      return;
    }
    setAppointments(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const resetAppointments = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAppointments(MOCK_APPOINTMENTS);
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