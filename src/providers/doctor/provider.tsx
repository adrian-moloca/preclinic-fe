import React, { FC, ReactNode, useState, useCallback } from 'react';
import { IDoctor } from './types';
import { DoctorsContext } from './context';
import axios from 'axios';

// export const MOCK_DOCTORS: IDoctor[] = [
//   {
//     id: 'd1',
//     firstName: 'Andrei',
//     lastName: 'Pop',
//     email: 'andrei.pop@clinic.com',
//     phoneNumber: '0741234567',
//     department: 'Cardiology',
//     profileImg: '',
//     gender: 'male',
//     birthDate: '1975-04-12',
//     address: 'Str. Clinicii 1, Cluj-Napoca',
//     medLicenteNumber: 'RO123456',
//     yearsOfExperience: 18,
//     bloodGroup: 'A+',
//     country: 'Romania',
//     state: 'Cluj',
//     city: 'Cluj-Napoca',
//     zipCode: '400006',
//     languages: ['Romanian', 'English'],
//     designation: 'Cardiologist',
//     about: 'dedicated cardiologist with 18 years of experience.',
//     consultationCharge: 0,
//     educationalDegrees: 'Cardiology',
//     university: 'Harvard Medical School',
//     from: '2021',
//     to: '2025'
//   },
//   {
//     id: 'd2',
//     firstName: 'Maria',
//     lastName: 'Ionescu',
//     email: 'maria.ionescu@clinic.com',
//     phoneNumber: '0752345678',
//     department: 'Pediatrics',
//     profileImg: '',
//     gender: 'female',
//     birthDate: '1982-11-30',
//     address: 'Str. Copiilor 22, Bucuresti',
//     medLicenteNumber: 'RO654321',
//     yearsOfExperience: 14,
//     bloodGroup: 'B-',
//     country: 'Romania',
//     state: 'Bucuresti',
//     city: 'Bucuresti',
//     zipCode: '010101',
//     languages: ['Romanian', 'French'],
//     designation: 'Pediatrician',
//     about: 'Pediatrician passionate about child health.',
//     consultationCharge: 0,
//     educationalDegrees: 'Pediatrics',
//     university: 'University of Bucharest',
//     from: '2005',
//     to: '2011'
//   },
//   {
//     id: 'd3',
//     firstName: 'Alexandru',
//     lastName: 'Georgescu',
//     email: 'alex.georgescu@clinic.com',
//     phoneNumber: '0763456789',
//     department: 'Dermatology',
//     profileImg: '',
//     gender: 'male',
//     birthDate: '1988-07-05',
//     address: 'Str. Pielii 7, Timisoara',
//     medLicenteNumber: 'RO789012',
//     yearsOfExperience: 9,
//     bloodGroup: 'O+',
//     country: 'Romania',
//     state: 'Timis',
//     city: 'Timisoara',
//     zipCode: '300001',
//     languages: ['Romanian', 'German'],
//     designation: 'Dermatologist',
//     about: 'Dermatologist with a focus on skin disorders.',
//     consultationCharge: 0,
//     educationalDegrees: 'Dermatology',
//     university: 'University of Bucharest',
//     from: '2010',
//     to: '2015'
//   }
// ];

export const DoctorsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);

  // useEffect(() => {
  //   const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       // Always include mock doctors
  //       const merged = [
  //         ...MOCK_DOCTORS,
  //         ...parsed.filter((d: IDoctor) => !MOCK_DOCTORS.some(md => md.id === d.id))
  //       ];
  //       setDoctors(merged);
  //     } catch {
  //       console.warn('Failed to parse doctors from localStorage');
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(doctors));
  // }, [doctors]);

const addDoctor = async (newDoctor: IDoctor) => {
    try {
      const response = await axios.post<IDoctor>('/doctor', newDoctor);
      setDoctors(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to add doctor:", error);
    }
  };

const updateDoctor = async (updatedDoctor: IDoctor) => {
  try {
    const response = await axios.put<IDoctor>(`/doctor/${updatedDoctor.id}`, updatedDoctor);
    setDoctors(prev =>
      prev.map(entry => (entry.id === updatedDoctor.id ? response.data : entry))
    );
  } catch (error) {
    console.error("Failed to update doctor:", error);
  }
};

  const deleteDoctor = async (id: string) => {
    try {
      await axios.delete(`/doctor/${id}`);
      setDoctors(prev => prev.filter(doctor => doctor.id !== id));
    } catch (error) {
      console.error("Failed to delete doctor:", error);
    }
  };

  const resetDoctors = useCallback(() => {
   setDoctors([]);
  }, []);

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        setDoctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        resetDoctors,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};