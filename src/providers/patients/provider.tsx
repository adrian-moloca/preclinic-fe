import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { PatientsEntry } from './types';
import { PatientsContext } from './context';

const LOCAL_STORAGE_KEY = 'patients';

export const MOCK_PATIENTS: PatientsEntry[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phoneNumber: '0712345678',
    birthDate: '1985-06-15',
    gender: 'male',
    address: '123 Main St, City',
    profileImg: '',
    medicalHistory: 'Diabetes, Hypertension',
    allergies: 'Penicillin',
    currentMedications: 'Metformin, Lisinopril',
    bloodGroup: 'A+',
    country: 'Romania',
    state: 'Bucharest',
    city: 'Bucharest',
    zipCode: '010101'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phoneNumber: '0723456789',
    birthDate: '1990-09-22',
    gender: 'female',
    address: '456 Oak Ave, Town',
    profileImg: '',
    medicalHistory: 'Asthma',
    allergies: 'None',
    currentMedications: 'Albuterol',
    bloodGroup: 'O-',
    country: 'Romania',
    state: 'Cluj',
    city: 'Cluj-Napoca',
    zipCode: '400001'
  },
  {
    id: '3',
    firstName: 'Alex',
    lastName: 'Popescu',
    email: 'alex.popescu@email.com',
    phoneNumber: '0734567890',
    birthDate: '1978-03-10',
    gender: 'male',
    address: '789 Pine Rd, Village',
    profileImg: '',
    medicalHistory: 'None',
    allergies: 'Aspirin',
    currentMedications: 'None',
    bloodGroup: 'B+',
    country: 'Romania',
    state: 'Iasi',
    city: 'Iasi',
    zipCode: '700001'
  }
];

export const PatientsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientsEntry[]>(MOCK_PATIENTS);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Always include mock patients
        const merged = [
          ...MOCK_PATIENTS,
          ...parsed.filter((p: PatientsEntry) => !MOCK_PATIENTS.some(mp => mp.id === p.id))
        ];
        setPatients(merged);
      } catch {
        console.warn('Failed to parse patients from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  const addPatient = useCallback((entry: PatientsEntry) => {
    setPatients(prev => [...prev, entry]);
  }, []);

  const updatePatient = useCallback((updatedEntry: PatientsEntry) => {
    setPatients(prev =>
      prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  }, []);

  const deletePatient = useCallback((id: string) => {
    setPatients(prev => {
      // Prevent deleting mock patients
      if (MOCK_PATIENTS.some(mp => mp.id === id)) {
        console.warn("❌ Cannot delete mock patient:", id);
        return prev;
      }
      const filtered = prev.filter(entry => entry.id !== id);
      if (filtered.length !== prev.length) {
        console.log("✅ Deleted patient with ID:", id);
      } else {
        console.warn("❌ Patient not found:", id);
      }
      return filtered;
    });
  }, []);

  const resetPatients = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPatients(MOCK_PATIENTS);
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