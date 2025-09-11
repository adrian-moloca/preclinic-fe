import React, { FC, ReactNode, useState, useCallback } from 'react';
import { ClinicContext } from './context';
import { Clinic, CreateClinicData } from './types';
import axios from 'axios';

const LOCAL_STORAGE_KEY = 'clinics';
const SELECTED_CLINIC_KEY = 'selectedClinic';

interface ClinicProviderProps {
  children: ReactNode;
}

export const ClinicProvider: FC<ClinicProviderProps> = ({ children }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const createClinic = async (data: CreateClinicData): Promise<Clinic> => {
    try {
      const response = await axios.post('/api/clinic/create', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create clinic', error);
      throw error;
    }
  }

const updateClinic = async (id: string, clinicData: Partial<Clinic>): Promise<Clinic> => {
  try {
    const response = await axios.put(`/api/clinic/update/${id}`, clinicData);
    return response.data;
  } catch (error) {
    console.error('Failed to update clinic', error);
    throw error;
  }
}

  const deleteClinic = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClinics(prev => prev.filter(c => c.id !== id));
      
      if (selectedClinic?.id === id) {
        setSelectedClinic(null);
        localStorage.removeItem(SELECTED_CLINIC_KEY);
      }
    } catch (err) {
      setError('Failed to delete clinic');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedClinic]);

  const selectClinic = useCallback((clinicId: string) => {
    const clinic = clinics.find(c => c.id === clinicId);
    if (clinic) {
      setSelectedClinic(clinic);
    }
  }, [clinics]);

  const getUserClinics = useCallback((userId: string): Clinic[] => {
    return clinics.filter(c => c.ownerId === userId);
  }, [clinics]);

  const resetClinics = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(SELECTED_CLINIC_KEY);
    setClinics([]);
    setSelectedClinic(null);
  }, []);

  return (
    <ClinicContext.Provider value={{
      clinics,
      selectedClinic,
      loading,
      error,
      createClinic,
      updateClinic,
      deleteClinic,
      selectClinic,
      getUserClinics,
      resetClinics,
    }}>
      {children}
    </ClinicContext.Provider>
  );
};