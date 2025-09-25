import React, { FC, ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { PatientsEntry } from './types';
import { PatientsContext } from './context';
import { useClinicContext } from '../clinic/context';
import axios from 'axios';

export const PatientsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isFetchingRef = useRef(false);
  
  const { selectedClinic } = useClinicContext();

  const transformPatientData = (apiPatient: any): PatientsEntry => {
    
    const patientId = apiPatient._id;
    
    if (!patientId) {
      console.error('WARNING: No _id found in patient data:', apiPatient);
    }
    
    const extractedUserId = apiPatient.user?._id || apiPatient.userId;
    
    if (!extractedUserId) {
      console.error('WARNING: Could not extract userId from patient:', apiPatient);
    }
    
    const userData = apiPatient.user || {};
    
    return {
      _id: patientId,
      userId: extractedUserId,
      profileImg: userData.profileImg || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phoneNumber: userData.phoneNumber || '',
      email: userData.email || '',
      birthDate: userData.birthDate || '',
      gender: userData.gender || '',
      bloodGroup: userData.bloodGroup || '',
      country: userData.country || '',
      state: userData.state || '',
      city: userData.city || '',
      address: userData.address || '',
      zipCode: userData.zipCode || '',
      allergies: apiPatient.allergies || '',
      medicalHistory: apiPatient.medicalHistory || '',
      currentMedications: apiPatient.currentMedications || '',
    };
  };

  const getAllPatients = useCallback(async (force: boolean = false) => {
    if ((hasLoaded && !force) || isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    
    try {
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.warn('No clinic selected or clinic has no _id');
        setPatients([]);
        return;
      }
      
      const response = await axios.get(`/api/patient/getAllByClinic/${clinicId}`);
      
      const data = response.data;
      
      let patientsArray: any[] = [];
      
      if (Array.isArray(data)) {
        patientsArray = data;
      } else if (data && Array.isArray(data.patients)) {
        patientsArray = data.patients;
      } else if (data && Array.isArray(data.data)) {
        patientsArray = data.data;
      } else if (data && data.result && Array.isArray(data.result)) {
        patientsArray = data.result;
      } else if (data && data.response && Array.isArray(data.response)) {
        patientsArray = data.response;
      } else {
        console.error("Unexpected API response format:", data);
        console.error("Response type:", typeof data);
        console.error("Response keys:", data ? Object.keys(data) : 'null');
      }
      
      const transformedData = patientsArray.map((patient, index) => {
        const transformed = transformPatientData(patient);
        return transformed;
      });
      
      setPatients(transformedData);
      setHasLoaded(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        console.error("Full error response:", error.response);
      } else {
        console.error("Unexpected error:", error);
      }
      setPatients([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasLoaded, selectedClinic]);

  const addPatient = async (newEntry: Omit<PatientsEntry, '_id'>) => {
    try {
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.error('No clinic selected, cannot create patient');
        return;
      }
      
      const patientData = {
        ...newEntry,
        clinic: clinicId,
        role: 'patient' as const
      };
      
      const response = await axios.post('/api/patient/create', patientData);

      if (response.status === 201 || response.status === 200) {
        const transformedPatient = transformPatientData(response.data);
        setPatients(prev => [...(prev || []), transformedPatient]);
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
      const { 
        _id,
        userId,
        allergies, 
        medicalHistory, 
        currentMedications,
        ...dataToSend 
      } = updatedEntry;
      
      if (!userId) {
        throw new Error('userId is required for updating patient');
      }
      
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.error('No clinic selected, cannot update patient');
        return;
      }
      
      const patientData = {
        ...dataToSend,
        clinic: clinicId,
        role: 'patient' as const
      };

      const response = await axios.put(`/api/patient/patch/${userId}`, patientData);

      if (response.status === 200) {
        await getAllPatients(true);
        return response.data._id || _id;
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const patientToDelete = patients.find(p => p._id === id);
      
      if (!patientToDelete) {
        console.error("Patient not found with _id:", id);
        return;
      }
      
      if (!patientToDelete.userId) {
        console.error("userId not found for patient:", patientToDelete);
        return;
      }
      
      const response = await axios.delete(`/api/patient/delete/${patientToDelete.userId}`);

      if (response.status === 200 || response.status === 204) {
        setPatients(prev => prev.filter(entry => entry._id !== id));
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
    setHasLoaded(false);
  }, []);

  useEffect(() => {
    resetPatients();
  }, [selectedClinic?._id, resetPatients]);

  return (
    <PatientsContext.Provider
      value={{
        patients,
        setPatients,
        addPatient,
        getAllPatients,
        updatePatient,
        deletePatient,
        resetPatients,
        loading,
        hasLoaded,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};