import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IAssistent } from './types';
import { AssistentsContext } from './context';
import axios from 'axios';

// export const MOCK_ASSISTENTS: IAssistent[] = [
//   {
//     id: 'as1',
//     profileImg: '',
//     firstName: 'Elena',
//     lastName: 'Marinescu',
//     phoneNumber: '0771234567',
//     email: 'elena.marinescu@clinic.com',
//     birthDate: '1992-05-18',
//     gender: 'female',
//     bloodGroup: 'A+',
//     country: 'Romania',
//     state: 'Cluj',
//     city: 'Cluj-Napoca',
//     address: 'Str. Clinicii 10, Cluj-Napoca',
//     zipCode: '400006',
//     yearsOfExperience: 6,
//     department: 'Cardiology',
//     medLicenteNumber: 'AS123456',
//     languages: ['Romanian', 'English'],
//     about: 'Experienced cardiology assistant with a passion for patient care.',
//     educationalDegrees: 'Bachelor of Nursing',
//     university: 'UMF Cluj',
//     from: '2010',
//     to: '2014',
//     workingSchedule: {}
//   },
//   {
//     id: 'as2',
//     profileImg: '',
//     firstName: 'Mihai',
//     lastName: 'Stan',
//     phoneNumber: '0782345678',
//     email: 'mihai.stan@clinic.com',
//     birthDate: '1987-12-03',
//     gender: 'male',
//     bloodGroup: 'O-',
//     country: 'Romania',
//     state: 'Bucuresti',
//     city: 'Bucuresti',
//     address: 'Str. Sanatatii 5, Bucuresti',
//     zipCode: '010101',
//     yearsOfExperience: 9,
//     department: 'Pediatrics',
//     medLicenteNumber: 'AS654321',
//     languages: ['Romanian', 'French'],
//     about: 'Pediatrics assistant with extensive experience in child care.',
//     educationalDegrees: 'Bachelor of Nursing',
//     university: 'UMF Bucuresti',
//     from: '2006',
//     to: '2010',
//     workingSchedule: {}
//   },
//   {
//     id: 'as3',
//     profileImg: '',
//     firstName: 'Ioana',
//     lastName: 'Popa',
//     phoneNumber: '0793456789',
//     email: 'ioana.popa@clinic.com',
//     birthDate: '1995-08-27',
//     gender: 'female',
//     bloodGroup: 'AB+',
//     country: 'Romania',
//     state: 'Timis',
//     city: 'Timisoara',
//     address: 'Str. Sperantei 22, Timisoara',
//     zipCode: '300001',
//     yearsOfExperience: 4,
//     department: 'Dermatology',
//     medLicenteNumber: 'AS789012',
//     languages: ['Romanian', 'German'],
//     about: 'Dermatology assistant focused on skin health and patient education.',
//     educationalDegrees: 'Bachelor of Nursing',
//     university: 'UMF Timisoara',
//     from: '2013',
//     to: '2017',
//     workingSchedule: {}
//   }
// ];

export const AssistentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [assistents, setAssistents] = useState<IAssistent[]>([]);

  // useEffect(() => {
  //   const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       // Always include mock assistents
  //       const merged = [
  //         ...MOCK_ASSISTENTS,
  //         ...parsed.filter((a: IAssistent) => !MOCK_ASSISTENTS.some(ma => ma.id === a.id))
  //       ];
  //       setAssistents(merged);
  //     } catch {
  //       console.warn('Failed to parse assistents from localStorage');
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assistents));
  // }, [assistents]);

const addAssistent = async (newAssistent: IAssistent) => {
    try {
      const response = await axios.post<IAssistent>('/assistent', newAssistent);
      setAssistents(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add assistent:", error);
    }
  };


  const updateAssistent = async (updatedAssistent: IAssistent) => {
    try {
      const response = await axios.put<IAssistent>(`/assistent/${updatedAssistent.id}`, updatedAssistent);
      setAssistents(prev =>
        prev.map(assistent =>
          assistent.id === updatedAssistent.id ? response.data : assistent
        )
      );
    } catch (error) {
      console.error("Failed to update assistent:", error);
    }
  };

  const deleteAssistent = async (id: string) => {
    try {
      await axios.delete(`/assistent/${id}`);
      setAssistents(prev => prev.filter(assistent => assistent.id !== id));
    } catch (error) {
      console.error("Failed to delete assistent:", error);
    }
  };;

  const resetAssistents = useCallback(() => {
    setAssistents([]);
  }, []);

  useEffect(() => {
    const fetchAssistents = async () => {
      try {
        const response = await axios.get<IAssistent[]>('/assistents');
        setAssistents(response.data);
      } catch (error) {
        console.error("Failed to fetch assistents:", error);
      }
    };
    
    fetchAssistents();
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