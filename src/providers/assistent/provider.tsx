import React, { FC, ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { IAssistent } from './types';
import { AssistentsContext } from './context';
import axios from 'axios';
import { useClinicContext } from '../clinic/context';

export const AssistentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [assistents, setAssistents] = useState<IAssistent[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isFetchingRef = useRef(false);
  const { selectedClinic } = useClinicContext();

  const transformAssistentData = (apiAssistent: any): IAssistent => {
    return {
      id: apiAssistent._id,
      userId: apiAssistent.user?._id || apiAssistent.userId, 
      profileImg: apiAssistent.user?.profileImg || '',
      firstName: apiAssistent.user?.firstName || '',
      lastName: apiAssistent.user?.lastName || '',
      phoneNumber: apiAssistent.user?.phoneNumber || '',
      email: apiAssistent.user?.email || '',
      birthDate: apiAssistent.user?.birthDate || '',
      gender: apiAssistent.user?.gender || '',
      bloodGroup: apiAssistent.user?.bloodGroup || '',
      country: apiAssistent.user?.country || '',
      state: apiAssistent.user?.state || '',
      city: apiAssistent.user?.city || '',
      address: apiAssistent.user?.address || '',
      zipCode: apiAssistent.user?.zipCode || '',
      yearsOfExperience: apiAssistent.yearsOfExperience || 0,
      department: apiAssistent.department || '',
      medLicenseNumber: apiAssistent.medLicenseNumber || '',
      languages: apiAssistent.languages || [],
      about: apiAssistent.about || '',
      educationalInformation: apiAssistent.educationalInformation || {
        educationalDegree: '',
        from: '',
        to: '',
        university: '',
      },
      workingSchedule: apiAssistent.workingSchedule || [],
    };
  };

  const fetchAssistents = useCallback(async (force: boolean = false) => {
    if ((hasLoaded && !force) || isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    
    try {
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.warn('No clinic selected or clinic has no _id');
        setAssistents([]);
        setHasLoaded(true);
        return;
      }
      
      const response = await axios.get(`/api/assistant/getAllByClinic/${clinicId}`);
      const data = response.data;
      
      let transformedData: IAssistent[] = [];
      
      if (Array.isArray(data)) {
        transformedData = data.map(transformAssistentData);
      } else if (data && Array.isArray(data.assistents)) {
        transformedData = data.assistents.map(transformAssistentData);
      } else if (data && Array.isArray(data.data)) {
        transformedData = data.data.map(transformAssistentData);
      } else {
        console.error("Unexpected API response format:", data);
      }
      
      setAssistents(transformedData);
      setHasLoaded(true);
    } catch (error) {
      console.error("Failed to fetch assistents:", error);
      setAssistents([]);
      setHasLoaded(true);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded, selectedClinic]);

  const addAssistent = async (newAssistent: IAssistent) => {
    try {
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.error('No clinic selected, cannot create assistant');
        throw new Error('No clinic selected');
      }

      const assistentData = {
        ...newAssistent,
        clinic: clinicId, 
      };

      console.log('Creating assistant with data:', assistentData);
      
      const response = await axios.post('/api/assistant/create', assistentData);
      const transformedAssistent = transformAssistentData(response.data);
      setAssistents(prev => [...prev, transformedAssistent]);
    } catch (error) {
      console.error("Failed to add assistent:", error);
      throw error; 
    }
  };

  const updateAssistent = async (updatedAssistent: IAssistent) => {
    try {
      const { id, userId, ...dataToSend } = updatedAssistent;
      
      const clinicId = selectedClinic?._id;
      
      if (!clinicId) {
        console.error('No clinic selected, cannot update assistant');
        throw new Error('No clinic selected');
      }

      const updateData = {
        ...dataToSend,
        clinic: clinicId,
      };

      console.log('Updating assistant with data:', updateData);
      
      const response = await axios.put(`/api/assistant/patch/${userId || id}`, updateData);
      
      await fetchAssistents(true);
      
      const updatedId = response.data._id || id;
      return updatedId;
    } catch (error) {
      console.error("Failed to update assistent:", error);
      throw error;
    }
  };

  const deleteAssistent = async (id: string) => {
    try {
      const assistentToDelete = assistents.find(a => a.id === id);
      
      if (!assistentToDelete || !assistentToDelete.userId) {
        console.error("Assistant or userId not found");
        return;
      }
      
      await axios.delete(`/api/assistant/delete/${assistentToDelete.userId}`);
      
      setAssistents(prev => prev.filter(assistent => assistent.id !== id));
    } catch (error) {
      console.error("Failed to delete assistent:", error);
    }
  };

  const resetAssistents = useCallback(() => {
    setAssistents([]);
    setHasLoaded(false);
  }, []);

  useEffect(() => {
    setAssistents([]);
    setHasLoaded(false);
    
    if (selectedClinic?._id) {
      const timer = setTimeout(() => {
        fetchAssistents(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClinic?._id]);

  return (
    <AssistentsContext.Provider
      value={{
        assistents,
        setAssistents,
        addAssistent,
        updateAssistent,
        deleteAssistent,
        resetAssistents,
        fetchAssistents,
        loading,
        hasLoaded,
      }}
    >
      {children}
    </AssistentsContext.Provider>
  );
};