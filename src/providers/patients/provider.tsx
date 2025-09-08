import React, { FC, ReactNode, useState, useCallback } from 'react';
import { PatientsEntry } from './types';
import { PatientsContext } from './context';
import axios from 'axios';

// const LOCAL_STORAGE_KEY = 'patients';

// export const MOCK_PATIENTS: PatientsEntry[] = [
//   {
//     id: '1',
//     firstName: 'John',
//     lastName: 'Doe',
//     email: 'john.doe@email.com',
//     phoneNumber: '0712345678',
//     birthDate: '1985-06-15',
//     gender: 'male',
//     address: '123 Main St, City',
//     profileImg: '',
//     medicalHistory: 'Diabetes, Hypertension',
//     allergies: 'Penicillin',
//     currentMedications: 'Metformin, Lisinopril',
//     bloodGroup: 'A+',
//     country: 'Romania',
//     state: 'Bucharest',
//     city: 'Bucharest',
//     zipCode: '010101'
//   },
//   {
//     id: '2',
//     firstName: 'Jane',
//     lastName: 'Smith',
//     email: 'jane.smith@email.com',
//     phoneNumber: '0723456789',
//     birthDate: '1990-09-22',
//     gender: 'female',
//     address: '456 Oak Ave, Town',
//     profileImg: '',
//     medicalHistory: 'Asthma',
//     allergies: 'None',
//     currentMedications: 'Albuterol',
//     bloodGroup: 'O-',
//     country: 'Romania',
//     state: 'Cluj',
//     city: 'Cluj-Napoca',
//     zipCode: '400001'
//   },
//   {
//     id: '3',
//     firstName: 'Alex',
//     lastName: 'Popescu',
//     email: 'alex.popescu@email.com',
//     phoneNumber: '0734567890',
//     birthDate: '1978-03-10',
//     gender: 'male',
//     address: '789 Pine Rd, Village',
//     profileImg: '',
//     medicalHistory: 'None',
//     allergies: 'Aspirin',
//     currentMedications: 'None',
//     bloodGroup: 'B+',
//     country: 'Romania',
//     state: 'Iasi',
//     city: 'Iasi',
//     zipCode: '700001'
//   }
// ];

export const PatientsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientsEntry[]>([]);

  // useEffect(() => {
  //   const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       // Always include mock patients
  //       const merged = [
  //         ...MOCK_PATIENTS,
  //         ...parsed.filter((p: PatientsEntry) => !MOCK_PATIENTS.some(mp => mp.id === p.id))
  //       ];
  //       setPatients(merged);
  //     } catch {
  //       console.warn('Failed to parse patients from localStorage');
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
  // }, [patients]);
  // useEffect(() => {
  //   const fetchPatients = async () => {
  //     try {
  //       const response = await axios.get<PatientsEntry[]>('/patients');
  //       setPatients(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch patients:", error);
  //     }
  //   };
    
  //   fetchPatients();
  // }, []);

  const addPatient = async (newEntry: PatientsEntry) => {
  try {
    const response = await axios.post<PatientsEntry>('/patient', newEntry);

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