import React, { FC, ReactNode, useState } from 'react';
import axios from 'axios';
import { AppointmentsContext } from './context';
import { AppointmentsEntry } from './types';

// export const MOCK_APPOINTMENTS: AppointmentsEntry[] = [
//   {
//     id: 'a1',
//     patients: ['1'],
//     patientId: '1',
//     appointmentType: 'In-person',
//     type: 'consultation',
//     date: '2025-08-15',
//     time: '09:00',
//     reason: 'Routine checkup',
//     status: 'scheduled',
//     department: { id: 'd1', name: 'Cardiology' } as IDepartments,
//     doctorId: 'd1', // Make sure this matches doctor IDs
//     duration: 30,
//   },
//   {
//     id: 'a2',
//     patients: ['2'],
//     patientId: '2',
//     appointmentType: 'Online',
//     type: 'follow-up',
//     date: '2025-08-16',
//     time: '14:30',
//     reason: 'Asthma follow-up',
//     status: 'confirmed',
//     department: { id: 'd2', name: 'Pediatrics' } as IDepartments,
//     doctorId: 'd2', // Make sure this matches doctor IDs
//     duration: 20,
//   },
//   {
//     id: 'a3',
//     patients: ['3'],
//     patientId: '3',
//     appointmentType: 'In-person',
//     type: 'consultation',
//     date: '2025-08-17',
//     time: '11:15',
//     reason: 'Medication review',
//     status: 'completed',
//     department: { id: 'd3', name: 'Dermatology' } as IDepartments,
//     doctorId: 'd3', // Make sure this matches doctor IDs
//     duration: 45,
//   },
//   // Add more appointments with different doctors
//   {
//     id: 'a4',
//     patients: ['1'],
//     patientId: '1',
//     appointmentType: 'In-person',
//     type: 'emergency',
//     date: '2025-08-20',
//     time: '10:00',
//     reason: 'Chest pain evaluation',
//     status: 'scheduled',
//     department: { id: 'd1', name: 'Cardiology' } as IDepartments,
//     doctorId: 'd1',
//     duration: 60,
//   },
//   {
//     id: 'a5',
//     patients: ['2'],
//     patientId: '2',
//     appointmentType: 'Online',
//     type: 'follow-up',
//     date: '2025-08-21',
//     time: '15:00',
//     reason: 'Blood test results',
//     status: 'scheduled',
//     department: { id: 'd2', name: 'Pediatrics' } as IDepartments,
//     doctorId: 'd2', // Same doctor as first appointment - should have same color
//     duration: 15,
//   }
// ];

export const AppointmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<AppointmentsEntry[]>([]);

  const addAppointment = async (newAppointment: AppointmentsEntry) => {
    try {
      const response = await axios.post<AppointmentsEntry>('/appointment', newAppointment);
      setAppointments(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add appointment:", error);
    }
  };

  const updateAppointment = async (updatedAppointment: AppointmentsEntry) => {
    try {
      const response = await axios.put<AppointmentsEntry>(`/appointment/${updatedAppointment.id}`, updatedAppointment);
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === updatedAppointment.id ? response.data : appointment
        )
      );
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await axios.delete(`/appointment/${id}`);
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  const getAppointmentById = (id: string): AppointmentsEntry | undefined => {
    return appointments.find(appointment => appointment.id === id);
  };

  return (
    <AppointmentsContext.Provider value={{
      appointments,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      getAppointmentById,
    }}>
      {children}
    </AppointmentsContext.Provider>
  );
};