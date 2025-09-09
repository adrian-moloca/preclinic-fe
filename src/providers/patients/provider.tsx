import React, { FC, ReactNode, useState, useCallback } from 'react';
import { PatientsEntry } from './types';
import { PatientsContext } from './context';
import axios from 'axios';

export const PatientsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientsEntry[]>([]);


  const addPatient = async (newEntry: PatientsEntry) => {
  try {
    const patientData = {
      ...newEntry,
      role: 'patient' as const
    };

    const response = await axios.post<PatientsEntry>('/api/user', patientData);

    if (response.status === 201 || response.status === 200) {
      setPatients(prev => [...(prev ?? []), response.data]);
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

const updatePatient = async (updatedEntry: PatientsEntry) => {
  try {
    const response = await axios.put<PatientsEntry>(`/patient/${updatedEntry.id}`, updatedEntry);

    if (response.status === 200) {
      setPatients(prev => prev?.map(entry => entry.id === updatedEntry.id ? response.data : entry));
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

const deletePatient = async (id: string) => {
  try {
    const response = await axios.delete(`/patient/${id}`);

    if (response.status === 200 || response.status === 204) {
      setPatients(prev => prev?.filter(entry => entry.id !== id));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

  const resetPatients = useCallback(() => {
    setPatients([]);
  }, []);

  return (
    <PatientsContext.Provider
      value={{
        patients,
        setPatients,
        addPatient,
        updatePatient,
        deletePatient,
        resetPatients,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};