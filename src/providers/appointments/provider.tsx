import React, { FC, ReactNode, useCallback, useState, useRef } from 'react';
import axios from 'axios';
import { AppointmentsContext } from './context';
import { AppointmentsEntry } from './types';

export const AppointmentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<AppointmentsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isFetchingRef = useRef(false);

  // Transform API response to match AppointmentsEntry interface if needed
  const transformAppointmentData = (apiAppointment: any): AppointmentsEntry => {
    return {
      id: apiAppointment._id || apiAppointment.id,
      patientId: apiAppointment.patientId,
      doctorId: apiAppointment.doctorId,
      date: apiAppointment.date,
      time: apiAppointment.time,
      reason: apiAppointment.reason,
      status: apiAppointment.status,
      type: apiAppointment.type,
      department: apiAppointment.department,
      duration: apiAppointment.duration,
      // Add any other fields from your AppointmentsEntry type
      ...apiAppointment
    };
  };

  const fetchAppointments = useCallback(async (force: boolean = false) => {
    // Prevent duplicate fetches unless forced
    if ((hasLoaded && !force) || isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    
    try {
      const response = await axios.get('/api/appointment/getAll');
      const data = response.data;
      
      let transformedData: AppointmentsEntry[] = [];
      
      if (Array.isArray(data)) {
        transformedData = data.map(transformAppointmentData);
      } else if (data && Array.isArray(data.appointments)) {
        transformedData = data.appointments.map(transformAppointmentData);
      } else if (data && Array.isArray(data.data)) {
        transformedData = data.data.map(transformAppointmentData);
      } else {
        console.error("Unexpected API response format:", data);
      }
      
      setAppointments(transformedData);
      setHasLoaded(true);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      setAppointments([]);
      setHasLoaded(true); // Mark as loaded even on error to prevent infinite retries
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasLoaded]);

  const addAppointment = async (newAppointment: AppointmentsEntry) => {
    try {
      const response = await axios.post<AppointmentsEntry>('/api/appointment/create', newAppointment);
      const transformedAppointment = transformAppointmentData(response.data);
      setAppointments(prev => [...prev, transformedAppointment]);
      return transformedAppointment;
    } catch (error) {
      console.error("Failed to add appointment:", error);
      throw error;
    }
  };

  const updateAppointment = async (updatedAppointment: AppointmentsEntry) => {
    try {
      const response = await axios.put<AppointmentsEntry>(
        `/api/appointment/patch/${updatedAppointment.id}`, 
        updatedAppointment
      );
      const transformedAppointment = transformAppointmentData(response.data);
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === updatedAppointment.id ? transformedAppointment : appointment
        )
      );
      return transformedAppointment;
    } catch (error) {
      console.error("Failed to update appointment:", error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await axios.delete(`/api/appointment/delete/${id}`);
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      throw error;
    }
  };

  const getAppointmentById = (id: string): AppointmentsEntry | undefined => {
    return appointments.find(appointment => appointment.id === id);
  };

  const resetAppointments = useCallback(() => {
    setAppointments([]);
    setHasLoaded(false);
  }, []);

  return (
    <AppointmentsContext.Provider value={{
      appointments,
      loading,
      hasLoaded,
      fetchAppointments,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      getAppointmentById,
      resetAppointments,
    }}>
      {children}
    </AppointmentsContext.Provider>
  );
};