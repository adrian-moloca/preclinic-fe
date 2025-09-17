import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { IAssistent } from './types';
import { AssistentsContext } from './context';
import axios from 'axios';

export const AssistentsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [assistents, setAssistents] = useState<IAssistent[]>([]);
  const [loading, setLoading] = useState(false);

  // Transform API response to match IAssistent interface
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

  const fetchAssistents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/assistant/getAll');
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
    } catch (error) {
      console.error("Failed to fetch assistents:", error);
      setAssistents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAssistent = async (newAssistent: IAssistent) => {
    try {
      const response = await axios.post('/api/assistant/create', newAssistent);
      const transformedAssistent = transformAssistentData(response.data);
      setAssistents(prev => [...prev, transformedAssistent]);
    } catch (error) {
      console.error("Failed to add assistent:", error);
    }
  };

const updateAssistent = async (updatedAssistent: IAssistent) => {
  try {
    const { id, userId, ...dataToSend } = updatedAssistent;
    
    const response = await axios.put(`/api/assistant/patch/${userId || id}`, dataToSend);
    
    // After successful update, refresh the entire list to ensure consistency
    await fetchAssistents();
    
    // Navigate using the assistant ID from the response
    const updatedId = response.data._id || id;
    return updatedId; // Return the ID so the component can use it
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
  }, []);

  useEffect(() => {
    fetchAssistents();
  }, [fetchAssistents]);

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
      }}
    >
      {children}
    </AssistentsContext.Provider>
  );
};