import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { ClinicContext } from './context';
import { Clinic, CreateClinicData, ClinicSettings } from './types';

const LOCAL_STORAGE_KEY = 'clinics';
const SELECTED_CLINIC_KEY = 'selectedClinic';

const defaultSettings: ClinicSettings = {
  timeZone: 'Europe/Bucharest',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'RON',
  language: 'Romanian',
  theme: 'light',
  emailNotifications: true,
  smsNotifications: true,
  appointmentReminders: true,
  marketingEmails: false,
  systemAlerts: true,
};

const defaultBusinessHours = {
  monday: { open: '09:00', close: '17:00', isClosed: false },
  tuesday: { open: '09:00', close: '17:00', isClosed: false },
  wednesday: { open: '09:00', close: '17:00', isClosed: false },
  thursday: { open: '09:00', close: '17:00', isClosed: false },
  friday: { open: '09:00', close: '17:00', isClosed: false },
  saturday: { open: '09:00', close: '13:00', isClosed: false },
  sunday: { open: '09:00', close: '13:00', isClosed: true },
};

interface ClinicProviderProps {
  children: ReactNode;
}

export const ClinicProvider: FC<ClinicProviderProps> = ({ children }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setClinics(JSON.parse(stored));
      } catch {
        console.warn('Failed to parse clinics from localStorage');
      }
    }

    const selectedStored = localStorage.getItem(SELECTED_CLINIC_KEY);
    if (selectedStored) {
      try {
        setSelectedClinic(JSON.parse(selectedStored));
      } catch {
        console.warn('Failed to parse selected clinic from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clinics));
  }, [clinics]);

  useEffect(() => {
    if (selectedClinic) {
      localStorage.setItem(SELECTED_CLINIC_KEY, JSON.stringify(selectedClinic));
    }
  }, [selectedClinic]);

  const createClinic = useCallback(async (clinicData: CreateClinicData): Promise<Clinic> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newClinic: Clinic = {
        id: crypto.randomUUID(),
        ...clinicData,
        ownerId: JSON.parse(localStorage.getItem('currentUser') || '{}').id || '',
        departments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        businessHours: clinicData.businessHours || defaultBusinessHours,
        settings: { ...defaultSettings, ...clinicData.settings },
      };

      setClinics(prev => [...prev, newClinic]);
      setSelectedClinic(newClinic);
      
      return newClinic;
    } catch (err) {
      setError('Failed to create clinic');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClinic = useCallback(async (id: string, clinicData: Partial<Clinic>): Promise<Clinic> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedClinic = {
        ...clinics.find(c => c.id === id)!,
        ...clinicData,
        updatedAt: new Date().toISOString(),
      };

      setClinics(prev => prev.map(c => c.id === id ? updatedClinic : c));
      
      if (selectedClinic?.id === id) {
        setSelectedClinic(updatedClinic);
      }

      return updatedClinic;
    } catch (err) {
      setError('Failed to update clinic');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clinics, selectedClinic]);

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