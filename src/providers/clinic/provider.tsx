import React, { FC, ReactNode, useState, useCallback, useEffect, useMemo } from 'react';
import { ClinicContext } from './context';
import { Clinic, CreateClinicData, defaultClinicSettings, defaultBusinessHours } from './types';
import { useAuthContext } from '../auth/context';
import axios from 'axios';

const LOCAL_STORAGE_KEY = 'clinics';
const SELECTED_CLINIC_KEY = 'selectedClinic';

interface ClinicProviderProps {
  children: ReactNode;
}

export const ClinicProvider: FC<ClinicProviderProps> = ({ children }) => {
  const { user } = useAuthContext();
  const [allClinics, setAllClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clinicsLoaded, setClinicsLoaded] = useState(false);

  // MEMOIZE the filtered clinics to prevent recreation on every render
  const clinics = useMemo(() => {
    if (!user) return [];
    const possibleUserIds = [user.id, (user as any)._id, (user as any).backendId, (user as any).tempId].filter(Boolean);
    return allClinics.filter(clinic => possibleUserIds.includes(clinic.ownerId));
  }, [allClinics, user]);

  const getCurrentUser = () => {
    if (user) {
      return {
        ...user,
        tempId: user.id,
        backendId: (user as any)._id || (user as any).backendId || user.id
      };
    }
    
    const currentUser = localStorage.getItem('currentUser') 
      || localStorage.getItem('preclinic_user')
      || localStorage.getItem('user');
    
    if (!currentUser) return null;
    
    try {
      const parsed = JSON.parse(currentUser);
      return {
        ...parsed,
        tempId: parsed.id,
        backendId: parsed._id || parsed.backendId
      };
    } catch (e) {
      console.error('Failed to parse user data:', e);
      return null;
    }
  };

  // Load all clinics from localStorage on mount - ONCE
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsedClinics = JSON.parse(stored);
        console.log('Loaded clinics from localStorage:', parsedClinics);
        setAllClinics(parsedClinics);
      } catch {
        console.warn('Failed to parse clinics from localStorage');
      }
    }
    setClinicsLoaded(true);
  }, []);

  // Save all clinics to localStorage when they change
  useEffect(() => {
    if (clinicsLoaded && allClinics.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allClinics));
    }
  }, [allClinics, clinicsLoaded]);

  // Load selected clinic for the current user - IMPROVED LOGIC
  useEffect(() => {
    // Don't proceed if clinics haven't been loaded yet or no user
    if (!clinicsLoaded || !user) {
      if (!user) setSelectedClinic(null);
      return;
    }

    // If we already have a selected clinic for this user, don't reload
    if (selectedClinic && selectedClinic.ownerId) {
      const possibleUserIds = [user.id, (user as any)._id, (user as any).backendId, (user as any).tempId].filter(Boolean);
      if (possibleUserIds.includes(selectedClinic.ownerId)) {
        return; // Already have the right clinic selected
      }
    }

    // Try to load from user-specific localStorage key
    const userSelectedKey = `${SELECTED_CLINIC_KEY}_${user.id}`;
    const selectedStored = localStorage.getItem(userSelectedKey);
    
    if (selectedStored) {
      try {
        const parsedClinic = JSON.parse(selectedStored);
        console.log('Loading selected clinic from localStorage:', parsedClinic);
        
        const possibleUserIds = [user.id, (user as any)._id, (user as any).backendId, (user as any).tempId].filter(Boolean);
        
        // Verify ownership
        if (possibleUserIds.includes(parsedClinic.ownerId)) {
          // Find the clinic in allClinics to get the most up-to-date version
          const currentClinic = allClinics.find(c => (c as any)._id === (parsedClinic as any)._id);
          if (currentClinic) {
            console.log('Setting selected clinic:', currentClinic);
            setSelectedClinic(currentClinic);
          } else {
            // Use the stored version if not found in allClinics
            console.log('Using stored version of selected clinic');
            setSelectedClinic(parsedClinic);
          }
          return;
        } else {
          console.log('Stored clinic does not belong to current user');
          localStorage.removeItem(userSelectedKey);
        }
      } catch (e) {
        console.warn('Failed to parse selected clinic from localStorage:', e);
        localStorage.removeItem(userSelectedKey);
      }
    }

    // Try legacy selected clinic key (backward compatibility)
    const legacySelected = localStorage.getItem(SELECTED_CLINIC_KEY);
    if (legacySelected && !selectedStored) {
      try {
        const parsedClinic = JSON.parse(legacySelected);
        const possibleUserIds = [user.id, (user as any)._id, (user as any).backendId, (user as any).tempId].filter(Boolean);
        
        if (possibleUserIds.includes(parsedClinic.ownerId)) {
          console.log('Migrating legacy selected clinic to user-specific key');
          setSelectedClinic(parsedClinic);
          localStorage.setItem(userSelectedKey, JSON.stringify(parsedClinic));
          localStorage.removeItem(SELECTED_CLINIC_KEY); // Clean up legacy key
          return;
        }
      } catch {
        console.warn('Failed to parse legacy selected clinic');
      }
    }

    // Auto-select first available clinic if user has clinics
    if (clinics.length > 0 && !selectedClinic) {
      const firstClinic = clinics[0];
      console.log('Auto-selecting first available clinic:', firstClinic);
      setSelectedClinic(firstClinic);
      localStorage.setItem(userSelectedKey, JSON.stringify(firstClinic));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, clinicsLoaded, allClinics]); // Removed selectedClinic from deps to prevent loops

  // Save selected clinic when it changes
  useEffect(() => {
    if (selectedClinic && user && clinicsLoaded) {
      const userSelectedKey = `${SELECTED_CLINIC_KEY}_${user.id}`;
      console.log('Saving selected clinic to localStorage:', selectedClinic);
      localStorage.setItem(userSelectedKey, JSON.stringify(selectedClinic));
    }
  }, [selectedClinic, user, clinicsLoaded]);

  const logoutCleanup = useCallback(() => {
    if (user) {
      const userSelectedKey = `${SELECTED_CLINIC_KEY}_${user.id}`;
      localStorage.removeItem(userSelectedKey);
    }
    setSelectedClinic(null);
    setClinicsLoaded(false);
  }, [user]);

  const getMyClinic = async (): Promise<Clinic | null> => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) return null;
      const response = await axios.get(`/api/clinic/${currentUser.backendId || currentUser._id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch my clinic:', error);
      return null;
    }
  }

  const createClinic = useCallback(async (clinicData: CreateClinicData): Promise<Clinic> => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated - please log in again');
      }
      
      console.log('Found authenticated user:', currentUser.tempId);
      
      const { settings, ...apiData } = clinicData as any;
      
      const requestData = {
        ...apiData,
        businessHours: apiData.businessHours || defaultBusinessHours,
      };
      
      console.log('Sending to API:', requestData);
      
      const response = await axios.post('/api/clinic/create', requestData);
      
      console.log('API Response:', response);
      
      let newClinic = response.data;
      
      if (typeof response.data === 'string') {
        try {
          newClinic = JSON.parse(response.data);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          throw new Error('Invalid response format from server');
        }
      }
      
      if (response.data?.clinic) {
        newClinic = response.data.clinic;
      } else if (response.data?.data) {
        newClinic = response.data.data;
      }
      
      if (!newClinic || typeof newClinic !== 'object') {
        console.error('Invalid clinic data:', newClinic);
        throw new Error('Invalid clinic data received from server');
      }
      
      newClinic = {
        ...newClinic,
        departments: newClinic.departments || [],
        status: newClinic.status || 'active',
        createdAt: newClinic.createdAt || new Date().toISOString(),
        updatedAt: newClinic.updatedAt || new Date().toISOString(),
        settings: defaultClinicSettings,
        businessHours: newClinic.businessHours || defaultBusinessHours,
      };
      
      setAllClinics(prev => [...prev, newClinic]);
      setSelectedClinic(newClinic);
      
      if (user) {
        const userSelectedKey = `${SELECTED_CLINIC_KEY}_${user.id}`;
        localStorage.setItem(userSelectedKey, JSON.stringify(newClinic));
      }
      
      const updatedUser = {
        ...currentUser,
        backendId: newClinic.ownerId
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      setLoading(false);
      setError(null);
      
      console.log('Clinic created successfully:', newClinic);
      return newClinic;
      
    } catch (error) {
      setLoading(false);
      console.error('Error in createClinic:', error);
      
      let errorMessage = 'Failed to create clinic';
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 201 && error.response?.data) {
          const responseData = error.response.data;
          let newClinic = responseData;
          
          if (responseData.clinic) newClinic = responseData.clinic;
          if (responseData.data) newClinic = responseData.data;
          
          if (newClinic && typeof newClinic === 'object') {
            newClinic.settings = defaultClinicSettings;
            newClinic.departments = newClinic.departments || [];
            newClinic.status = newClinic.status || 'active';
            
            setAllClinics(prev => [...prev, newClinic]);
            setSelectedClinic(newClinic);
            
            if (user) {
              const userSelectedKey = `${SELECTED_CLINIC_KEY}_${user.id}`;
              localStorage.setItem(userSelectedKey, JSON.stringify(newClinic));
            }
            
            setLoading(false);
            setError(null);
            return newClinic;
          }
        }
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getClinicByOwnerId = useCallback((ownerId: string): Clinic | null => {
    const found = allClinics.find(c => c.ownerId === ownerId);
    return found ?? null;
  }, [allClinics]);

  const updateClinic = useCallback(async (id: string, updatedData: Partial<Clinic>): Promise<Clinic> => {
    try {
      setLoading(true);
      setError(null);
      
      const currentClinic = allClinics.find(c => (c as any)._id === id);
      
      if (currentClinic && user) {
        const possibleUserIds = [user.id, (user as any)._id, (user as any).backendId, (user as any).tempId].filter(Boolean);
        if (!possibleUserIds.includes(currentClinic.ownerId)) {
          throw new Error('You do not have permission to update this clinic');
        }
      }
      
      const { settings, businessHours, id: removedId, ...dataForApi } = updatedData;
      
      let updatePayload: any = { ...dataForApi };
      
      if (businessHours && currentClinic) {
        const currentBusinessHoursStr = JSON.stringify(currentClinic.businessHours);
        const newBusinessHoursStr = JSON.stringify(businessHours);
        
        if (currentBusinessHoursStr !== newBusinessHoursStr) {
          if (currentClinic.businessHours) {
            const mergedBusinessHours: any = {};
            
            Object.keys(businessHours).forEach(day => {
              const currentDay = (currentClinic.businessHours as any)[day];
              const newDay = (businessHours as any)[day];
              
              mergedBusinessHours[day] = {
                ...newDay,
                ...(currentDay?._id && { _id: currentDay._id })
              };
            });
            
            updatePayload.businessHours = mergedBusinessHours;
          } else {
            updatePayload.businessHours = businessHours;
          }
        }
      }
      
      console.log('Sending update to API:', updatePayload);

      const response = await axios.patch<Clinic>(`/api/clinic/patch/${id}`, updatePayload);
      let updatedClinic = response.data;
      
      if (settings) {
        updatedClinic = { ...updatedClinic, settings };
      } else if (!updatedClinic.settings) {
        updatedClinic.settings = defaultClinicSettings;
      }
      
      setAllClinics(prev => prev.map(c => (c as any)._id === id ? updatedClinic : c));
      
      if ((selectedClinic as any)?._id === id) {
        setSelectedClinic(updatedClinic);
        if (user) {
          const userSelectedKey = `${SELECTED_CLINIC_KEY}_${user.id}`;
          localStorage.setItem(userSelectedKey, JSON.stringify(updatedClinic));
        }
      }
      
      setLoading(false);
      return updatedClinic;
    } catch (error) {
      setLoading(false);
      console.error('Failed to update clinic:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update clinic';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      throw new Error('Failed to update clinic');
    }
  }, [allClinics, selectedClinic, user]);

  const deleteClinic = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const clinicToDelete = allClinics.find(c => (c as any)._id === id);
      if (clinicToDelete && user) {
        const possibleUserIds = [user.id, (user as any)._id, (user as any).backendId, (user as any).tempId].filter(Boolean);
        if (!possibleUserIds.includes(clinicToDelete.ownerId)) {
          throw new Error('You do not have permission to delete this clinic');
        }
      }
      
      const response = await axios.delete('/api/clinic/delete', { data: { id } });
      
      if (response.status === 200 || response.status === 204) {
        setAllClinics(prev => prev.filter(c => (c as any)._id !== id));

        if ((selectedClinic as any)?._id === id) {
          setSelectedClinic(null);
          if (user) {
            const userSelectedKey = `${SELECTED_CLINIC_KEY}_${user.id}`;
            localStorage.removeItem(userSelectedKey);
          }
        }
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to delete clinic:', error);
      
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to delete clinic');
      }
      
      throw new Error('Failed to delete clinic');
    }
  }, [allClinics, selectedClinic, user]);

  const selectClinic = useCallback((clinicId: string) => {
    const clinic = allClinics.find(c => {
      if ((c as any)._id !== clinicId) return false;
      if (user) {
        const possibleUserIds = [user.id, (user as any)._id, (user as any).backendId, (user as any).tempId].filter(Boolean);
        return possibleUserIds.includes(c.ownerId);
      }
      return false;
    });
    
    if (clinic) {
      console.log('Manually selecting clinic:', clinic);
      setSelectedClinic(clinic);
      if (user) {
        const userSelectedKey = `${SELECTED_CLINIC_KEY}_${user.id}`;
        localStorage.setItem(userSelectedKey, JSON.stringify(clinic));
      }
    } else {
      console.warn('Clinic not found or not owned by current user');
    }
  }, [allClinics, user]);

  const getUserClinics = useCallback((userId: string): Clinic[] => {
    return allClinics.filter(c => {
      const currentUser = getCurrentUser();
      const possibleIds = [userId, currentUser?.tempId, currentUser?.backendId, currentUser?.id, currentUser?._id].filter(Boolean);
      return possibleIds.includes(c.ownerId);
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allClinics]);

  const resetClinics = useCallback(() => {
    logoutCleanup();
  }, [logoutCleanup]);
  
  return (
    <ClinicContext.Provider value={{
      clinics,
      selectedClinic,
      loading,
      error,
      createClinic,
      updateClinic,
      getClinicByOwnerId,
      deleteClinic,
      getMyClinic,
      selectClinic,
      getUserClinics,
      resetClinics,
    }}>
      {children}
    </ClinicContext.Provider>
  );
};