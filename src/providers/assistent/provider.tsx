import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IAssistent } from './types';
import { AssistentsContext } from './context';

const LOCAL_STORAGE_KEY = 'assistents';

export const MOCK_ASSISTENTS: IAssistent[] = [
  {
    id: 'as1',
    profileImg: '',
    firstName: 'Elena',
    lastName: 'Marinescu',
    phoneNumber: '0771234567',
    email: 'elena.marinescu@clinic.com',
    birthDate: '1992-05-18',
    gender: 'female',
    bloodGroup: 'A+',
    country: 'Romania',
    state: 'Cluj',
    city: 'Cluj-Napoca',
    address: 'Str. Clinicii 10, Cluj-Napoca',
    zipCode: '400006',
    yearsOfExperience: 6,
    department: 'Cardiology',
    medLicenteNumber: 'AS123456',
    languages: ['Romanian', 'English'],
    about: 'Experienced cardiology assistant with a passion for patient care.',
    educationalDegrees: 'Bachelor of Nursing',
    university: 'UMF Cluj',
    from: '2010',
    to: '2014',
    workingSchedule: {}
  },
  {
    id: 'as2',
    profileImg: '',
    firstName: 'Mihai',
    lastName: 'Stan',
    phoneNumber: '0782345678',
    email: 'mihai.stan@clinic.com',
    birthDate: '1987-12-03',
    gender: 'male',
    bloodGroup: 'O-',
    country: 'Romania',
    state: 'Bucuresti',
    city: 'Bucuresti',
    address: 'Str. Sanatatii 5, Bucuresti',
    zipCode: '010101',
    yearsOfExperience: 9,
    department: 'Pediatrics',
    medLicenteNumber: 'AS654321',
    languages: ['Romanian', 'French'],
    about: 'Pediatrics assistant with extensive experience in child care.',
    educationalDegrees: 'Bachelor of Nursing',
    university: 'UMF Bucuresti',
    from: '2006',
    to: '2010',
    workingSchedule: {}
  },
  {
    id: 'as3',
    profileImg: '',
    firstName: 'Ioana',
    lastName: 'Popa',
    phoneNumber: '0793456789',
    email: 'ioana.popa@clinic.com',
    birthDate: '1995-08-27',
    gender: 'female',
    bloodGroup: 'AB+',
    country: 'Romania',
    state: 'Timis',
    city: 'Timisoara',
    address: 'Str. Sperantei 22, Timisoara',
    zipCode: '300001',
    yearsOfExperience: 4,
    department: 'Dermatology',
    medLicenteNumber: 'AS789012',
    languages: ['Romanian', 'German'],
    about: 'Dermatology assistant focused on skin health and patient education.',
    educationalDegrees: 'Bachelor of Nursing',
    university: 'UMF Timisoara',
    from: '2013',
    to: '2017',
    workingSchedule: {}
  }
];

export const AssistentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [assistents, setAssistents] = useState<IAssistent[]>(MOCK_ASSISTENTS);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Always include mock assistents
        const merged = [
          ...MOCK_ASSISTENTS,
          ...parsed.filter((a: IAssistent) => !MOCK_ASSISTENTS.some(ma => ma.id === a.id))
        ];
        setAssistents(merged);
      } catch {
        console.warn('Failed to parse assistents from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assistents));
  }, [assistents]);

  const addAssistent = useCallback((entry: IAssistent) => {
    setAssistents(prev => [...prev, entry]);
  }, []);

  const updateAssistent = useCallback((updatedEntry: IAssistent) => {
    setAssistents(prev =>
      prev.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  }, []);

  const deleteAssistent = useCallback((id: string) => {
    // Prevent deleting mock assistents
    if (MOCK_ASSISTENTS.some(ma => ma.id === id)) {
      console.warn("❌ Cannot delete mock assistent:", id);
      return;
    }
    setAssistents(prev => {
      const filtered = prev.filter(entry => entry.id !== id);
      if (filtered.length !== prev.length) {
        console.log("✅ Deleted assistent with ID:", id);
      } else {
        console.warn("❌ Assistent not found:", id);
      }
      return filtered;
    });
  }, []);

  const resetAssistents = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAssistents(MOCK_ASSISTENTS);
  }, []);

  return (
    <AssistentsContext.Provider
      value={{
        assistents,
        setAssistents,
        addAssistent,
        updateAssistent,
        deleteAssistent,
        resetAssistents,
      }}
    >
      {children}
    </AssistentsContext.Provider>
  );
};