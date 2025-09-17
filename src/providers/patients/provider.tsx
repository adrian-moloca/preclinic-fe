import React, { FC, ReactNode, useState, useCallback, useEffect } from 'react';
import { PatientsEntry } from './types';
import { PatientsContext } from './context';
import axios from 'axios';

export const PatientsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientsEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Transform API response to match PatientsEntry interface
  const transformPatientData = (apiPatient: any): PatientsEntry => {
    // Try different possible locations for userId
    let extractedUserId;
    
    if (apiPatient.user && typeof apiPatient.user === 'object' && apiPatient.user._id) {
      // user is an object with _id
      extractedUserId = apiPatient.user._id;
    } else if (apiPatient.user && typeof apiPatient.user === 'string') {
      // user is directly the ID string
      extractedUserId = apiPatient.user;
    } else if (apiPatient.userId) {
      // userId is a direct property
      extractedUserId = apiPatient.userId;
    } else if (apiPatient._userId) {
      // Maybe it's _userId
      extractedUserId = apiPatient._userId;
    }
    
    if (!extractedUserId) {
      console.error('WARNING: Could not extract userId from patient:', apiPatient);
    }
    
    // Extract user data whether it's nested or flat
    const userData = apiPatient.user || apiPatient;
    
    return {
      _id: apiPatient._id,
      userId: extractedUserId, // This must have a value for updates to work
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

  const getAllPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/patient/getAll');
      const data = response.data;
      
      console.log('Raw API response:', data); // Debug log
      
      let transformedData: PatientsEntry[] = [];
      
      if (Array.isArray(data)) {
        transformedData = data.map(transformPatientData);
      } else if (data && Array.isArray(data.patients)) {
        transformedData = data.patients.map(transformPatientData);
      } else if (data && Array.isArray(data.data)) {
        transformedData = data.data.map(transformPatientData);
      } else {
        console.error("Unexpected API response format:", data);
      }
      
      console.log('Transformed patients:', transformedData); // Debug log
      setPatients(transformedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPatient = async (newEntry: Omit<PatientsEntry, '_id'>) => {
    try {
      const patientData = {
        ...newEntry,
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
      
      // Check if userId exists
      if (!userId) {
        console.error('ERROR: userId is missing!');
        console.error('Full updatedEntry:', updatedEntry);
        throw new Error('userId is required for updating patient');
      }
      
      const patientData = {
        ...dataToSend,
        role: 'patient' as const
      };

      console.log('Updating patient with userId:', userId); // Debug log
      console.log('Body being sent:', patientData); // Debug log

      // userId is sent in the URL, not in the body
      const response = await axios.put(`/api/patient/patch/${userId}`, patientData);

      if (response.status === 200) {
        // Refresh the entire list to ensure consistency
        await getAllPatients();
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
      
      if (!patientToDelete || !patientToDelete.userId) {
        console.error("Patient or userId not found");
        return;
      }
      
      // Use userId for deletion endpoint
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
  }, []);

  // Automatically fetch patients when the provider mounts
  useEffect(() => {
    getAllPatients();
  }, [getAllPatients]);

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
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};