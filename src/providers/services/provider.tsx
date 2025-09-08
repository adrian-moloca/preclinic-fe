import React, { FC, ReactNode, useState, useCallback } from 'react';
import { IServices } from './types';
import { ServicesContext } from './context';
import axios from 'axios';

// export const MOCK_SERVICES: IServices[] = [
//   {
//     id: 's1',
//     name: 'Cardiology Consultation',
//     description: 'Specialist consultation for heart and vascular conditions.',
//     price: 200,
//     duration: 30,
//     status: 'active',
//     department: 'Cardiology',
//     products: ['p1', 'p3']
//   },
//   {
//     id: 's2',
//     name: 'Pediatric Checkup',
//     description: 'Routine health check for children.',
//     price: 150,
//     duration: 25,
//     status: 'active',
//     department: 'Pediatrics',
//     products: ['p2']
//   },
//   {
//     id: 's3',
//     name: 'Dermatology Skin Exam',
//     description: 'Comprehensive skin examination and advice.',
//     price: 180,
//     duration: 20,
//     status: 'active',
//     department: 'Dermatology',
//     products: []
//   }
// ];

export const ServicesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<IServices[]>([]);

  // useEffect(() => {
  //   const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       const merged = [
  //         ...MOCK_SERVICES,
  //         ...parsed.filter((s: IServices) => !MOCK_SERVICES.some(ms => ms.id === s.id))
  //       ];
  //       setServices(merged);
  //     } catch {
  //       console.warn('Failed to parse services from localStorage');
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
  // }, [services]);

 const addService = async (newService: IServices) => {
  try {
    const response = await axios.post<IServices>('/service', newService);
    setServices(prev => [...prev, response.data]);
  } catch (error) {
    console.error("Failed to add service:", error);
  }
};

const updateService = async (updatedService: IServices) => {
  try {
    const response = await axios.put<IServices>(`/service/${updatedService.id}`, updatedService);
    setServices(prev =>
      prev.map(s => (s.id === updatedService.id ? response.data : s))
    );
  } catch (error) {
    console.error("Failed to update service:", error);
  }
};

  const deleteService = async (id: string) => {
    try {
      await axios.delete(`/service/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const resetServices = useCallback(() => {
    setServices([]);
  }, []);

  return (
    <ServicesContext.Provider
      value={{
        services,
        setServices,
        addService,
        updateService,
        deleteService,
        resetServices,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};