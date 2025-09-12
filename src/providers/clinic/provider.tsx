import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { ClinicContext } from './context';
import { Clinic, CreateClinicData, defaultClinicSettings, defaultBusinessHours } from './types';
import axios from 'axios';

const LOCAL_STORAGE_KEY = 'clinics';
const SELECTED_CLINIC_KEY = 'selectedClinic';

interface ClinicProviderProps {
  children: ReactNode;
}

export const ClinicProvider: FC<ClinicProviderProps> = ({ children }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const getCurrentUser = () => {
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

  const logoutCleanup = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(SELECTED_CLINIC_KEY);
    setClinics([]);
    setSelectedClinic(null);
    setInitialized(false);
  }, []);

  const getMyClinic = useCallback(async (): Promise<Clinic | null> => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error('No authenticated user found');
        return null;
      }
      
      const ownerIds = [user.tempId, user.backendId, user.id, user._id].filter(Boolean);
      
      for (const ownerId of ownerIds) {
        const endpoints = [
          `/api/clinic/owner/${ownerId}`,
          `/api/clinic/user/${ownerId}`,
          '/api/clinic/my-clinic',
          '/api/clinic'
        ];
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(endpoint, { 
              params: endpoint === '/api/clinic' ? { ownerId } : undefined 
            });
            
            if (response.data) {
              const clinic = response.data?.data || response.data?.clinic || response.data;
              if (clinic && (Array.isArray(clinic) ? clinic[0] : clinic)) {
                const foundClinic = Array.isArray(clinic) ? clinic[0] : clinic;
                if (!foundClinic.settings) {
                  foundClinic.settings = defaultClinicSettings;
                }
                return foundClinic;
              }
            }
          } catch (err) {
            console.log(`Endpoint ${endpoint} failed, trying next...`);
          }
        }
      }
      
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const clinics = JSON.parse(stored);
        return clinics.find((c: Clinic) => 
          ownerIds.includes(c.ownerId)
        ) || null;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch my clinic:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (initialized) return;
    
    const fetchUserClinics = async () => {
      const user = getCurrentUser();
      
      if (user) {
        try {
          setLoading(true);
          
          const storedClinics = localStorage.getItem(LOCAL_STORAGE_KEY);
          const storedSelectedClinic = localStorage.getItem(SELECTED_CLINIC_KEY);
          
          if (storedClinics) {
            try {
              const parsedClinics = JSON.parse(storedClinics);
              setClinics(parsedClinics);
              
              if (storedSelectedClinic) {
                const parsedSelected = JSON.parse(storedSelectedClinic);
                setSelectedClinic(parsedSelected);
              }
            } catch (e) {
              console.warn('Failed to parse stored clinics:', e);
            }
          }
          
          try {
            const response = await axios.get('/api/clinic/user-clinics');
            const userClinics = response.data;
            
            if (userClinics && userClinics.length > 0) {
              const clinicsWithSettings = userClinics.map((clinic: Clinic) => ({
                ...clinic,
                settings: clinic.settings || defaultClinicSettings
              }));
              
              setClinics(clinicsWithSettings);
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clinicsWithSettings));
              
              if (clinicsWithSettings.length > 0 && !selectedClinic) {
                setSelectedClinic(clinicsWithSettings[0]);
                localStorage.setItem(SELECTED_CLINIC_KEY, JSON.stringify(clinicsWithSettings[0]));
              }
            } else {
              const myClinic = await getMyClinic();
              if (myClinic) {
                setClinics([myClinic]);
                setSelectedClinic(myClinic);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([myClinic]));
                localStorage.setItem(SELECTED_CLINIC_KEY, JSON.stringify(myClinic));
              }
            }
          } catch (apiError) {
            console.log('API fetch failed, using localStorage data');
          }
          
          setLoading(false);
          setInitialized(true);
        } catch (error) {
          console.warn('Failed to load clinics:', error);
          logoutCleanup();
          setLoading(false);
        }
      } else {
        logoutCleanup();
      }
    };
    
    fetchUserClinics();
  }, [initialized, logoutCleanup, getMyClinic, selectedClinic]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser' || e.key === 'preclinic_user' || e.key === 'user') {
        if (!e.newValue) {
          logoutCleanup();
        } else if (e.newValue && e.oldValue && e.newValue !== e.oldValue) {
          window.location.reload();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logoutCleanup]);

  useEffect(() => {
    if (clinics.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clinics));
    }
  }, [clinics]);

  useEffect(() => {
    if (selectedClinic) {
      localStorage.setItem(SELECTED_CLINIC_KEY, JSON.stringify(selectedClinic));
    } else {
      localStorage.removeItem(SELECTED_CLINIC_KEY);
    }
  }, [selectedClinic]);

  const createClinic = useCallback(async (clinicData: CreateClinicData): Promise<Clinic> => {
    try {
      setLoading(true);
      setError(null);
      
      const user = getCurrentUser();
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('User not authenticated - please log in again');
      }
      
      console.log('Found authenticated user:', user.tempId);
      
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
      
      const updatedClinics = [...clinics, newClinic];
      setClinics(updatedClinics);
      setSelectedClinic(newClinic);
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClinics));
      localStorage.setItem(SELECTED_CLINIC_KEY, JSON.stringify(newClinic));
      
      const updatedUser = {
        ...user,
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
            
            const updatedClinics = [...clinics, newClinic];
            setClinics(updatedClinics);
            setSelectedClinic(newClinic);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClinics));
            localStorage.setItem(SELECTED_CLINIC_KEY, JSON.stringify(newClinic));
            
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
  }, [clinics]);

  const getClinicByOwnerId = useCallback((ownerId: string): Clinic | null => {
    const found = clinics.find(c => c.ownerId === ownerId);
    return found ?? null;
  }, [clinics]);

  const updateClinic = useCallback(async (id: string, updatedData: Partial<Clinic>): Promise<Clinic> => {
    try {
      setLoading(true);
      setError(null);
      
      const { settings, ...dataForApi } = updatedData;
      
      const response = await axios.put<Clinic>('/api/clinic/patch', { id, ...dataForApi });
      let updatedClinic = response.data;
      
      if (settings) {
        updatedClinic = { ...updatedClinic, settings };
      } else if (!updatedClinic.settings) {
        updatedClinic.settings = defaultClinicSettings;
      }
      
      const updatedClinics = clinics.map(c => c.id === id ? updatedClinic : c);
      setClinics(updatedClinics);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClinics));
      
      if (selectedClinic?.id === id) {
        setSelectedClinic(updatedClinic);
        localStorage.setItem(SELECTED_CLINIC_KEY, JSON.stringify(updatedClinic));
      }
      
      setLoading(false);
      return updatedClinic;
    } catch (error) {
      setLoading(false);
      console.error('Failed to update clinic:', error);
      
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to update clinic');
      }
      
      throw new Error('Failed to update clinic');
    }
  }, [clinics, selectedClinic]);

  const deleteClinic = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.delete('/api/clinic/delete', { data: { id } });
      
      if (response.status === 200 || response.status === 204) {
        const updatedClinics = clinics.filter(c => c.id !== id);
        setClinics(updatedClinics);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClinics));

        if (selectedClinic?.id === id) {
          setSelectedClinic(null);
          localStorage.removeItem(SELECTED_CLINIC_KEY);
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
  }, [clinics, selectedClinic]);

  const selectClinic = useCallback((clinicId: string) => {
    const clinic = clinics.find(c => c.id === clinicId);
    if (clinic) {
      setSelectedClinic(clinic);
      localStorage.setItem(SELECTED_CLINIC_KEY, JSON.stringify(clinic));
    } else {
      console.warn('Clinic not found');
    }
  }, [clinics]);

  const getUserClinics = useCallback((userId: string): Clinic[] => {
    return clinics.filter(c => {
      const user = getCurrentUser();
      const possibleIds = [userId, user?.tempId, user?.backendId, user?.id, user?._id].filter(Boolean);
      return possibleIds.includes(c.ownerId);
    });
  }, [clinics]);

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