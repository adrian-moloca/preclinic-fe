import React, { FC, ReactNode, useState, useCallback, useEffect } from 'react';
import { IDoctor } from './types';
import { DoctorsContext } from './context';
import axios from 'axios';

export const DoctorsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(false);

  // Transform API response to match IDoctor interface
  const transformDoctorData = (apiDoctor: any): IDoctor => {
    return {
      id: apiDoctor._id,
      userId: apiDoctor.user?._id || apiDoctor.userId,
      profileImg: apiDoctor.user?.profileImg || '',
      firstName: apiDoctor.user?.firstName || '',
      lastName: apiDoctor.user?.lastName || '',
      phoneNumber: apiDoctor.user?.phoneNumber || '',
      email: apiDoctor.user?.email || '',
      birthDate: apiDoctor.user?.birthDate || '',
      gender: apiDoctor.user?.gender || '',
      bloodGroup: apiDoctor.user?.bloodGroup || '',
      country: apiDoctor.user?.country || '',
      state: apiDoctor.user?.state || '',
      city: apiDoctor.user?.city || '',
      address: apiDoctor.user?.address || '',
      zipCode: apiDoctor.user?.zipCode || '',
      yearsOfExperience: apiDoctor.yearsOfExperience || 0,
      department: apiDoctor.department || '',
      designation: apiDoctor.designation || '',
      medLicenseNumber: apiDoctor.medLicenseNumber || '',
      languages: apiDoctor.languages || [],
      about: apiDoctor.about || '',
      appointmentType: apiDoctor.appointmentType || '',
      appointmentDuration: apiDoctor.appointmentDuration || 30,
      consultationCharge: apiDoctor.consultationCharge || 0,
      educationalInformation: apiDoctor.educationalInformation || [],
      workingSchedule: apiDoctor.workingSchedule || {},
    };
  };

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/doctor/getAll');
      const data = response.data;
      
      let transformedData: IDoctor[] = [];
      
      if (Array.isArray(data)) {
        transformedData = data.map(transformDoctorData);
      } else if (data && Array.isArray(data.doctors)) {
        transformedData = data.doctors.map(transformDoctorData);
      } else if (data && Array.isArray(data.data)) {
        transformedData = data.data.map(transformDoctorData);
      } else {
        console.error("Unexpected API response format:", data);
      }
      
      setDoctors(transformedData);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDoctor = async (newDoctor: IDoctor) => {
    try {
      // Filter out educational entries that have no meaningful data
      const validEducationalInfo = Array.isArray(newDoctor.educationalInformation) 
        ? newDoctor.educationalInformation.filter(edu => 
            edu && 
            typeof edu === 'object' && 
            (edu.educationalDegree?.trim() || edu.university?.trim())
          )
        : [];

      const doctorData: any = {
        ...newDoctor
      };

      // Only include educationalInformation if there's valid data
      if (validEducationalInfo.length > 0) {
        doctorData.educationalInformation = validEducationalInfo;
      } else {
        delete doctorData.educationalInformation;
      }
      
      const response = await axios.post('/api/doctor/create', doctorData);
      const transformedDoctor = transformDoctorData(response.data);
      setDoctors(prev => [...prev, transformedDoctor]);
    } catch (error) {
      console.error("Failed to add doctor:", error);
    }
  };

  const updateDoctor = async (updatedDoctor: IDoctor) => {
    try {
      const { id, userId, ...dataToSend } = updatedDoctor;
      
      // Filter out educational entries that have no meaningful data
      const validEducationalInfo = Array.isArray(dataToSend.educationalInformation) 
        ? dataToSend.educationalInformation.filter(edu => 
            edu && 
            typeof edu === 'object' && 
            (edu.educationalDegree?.trim() || edu.university?.trim())
          )
        : [];

      if (validEducationalInfo.length > 0) {
        dataToSend.educationalInformation = validEducationalInfo;
      } else {
        delete (dataToSend as { educationalInformation?: any }).educationalInformation;
      }
      
      const response = await axios.put(`/api/doctor/patch/${userId || id}`, dataToSend);
      
      // After successful update, refresh the entire list to ensure consistency
      await fetchDoctors();
      
      // Return the ID so the component can use it
      const updatedId = response.data._id || id;
      return updatedId;
    } catch (error) {
      console.error("Failed to update doctor:", error);
      throw error;
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      const doctorToDelete = doctors.find(d => d.id === id);
      
      if (!doctorToDelete || !doctorToDelete.userId) {
        console.error("Doctor or userId not found");
        return;
      }
      
      await axios.delete(`/api/doctor/delete/${doctorToDelete.userId}`);
      
      setDoctors(prev => prev.filter(doctor => doctor.id !== id));
    } catch (error) {
      console.error("Failed to delete doctor:", error);
    }
  };

  const resetDoctors = useCallback(() => {
    setDoctors([]);
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        loading,
        setDoctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        resetDoctors,
        fetchDoctors
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};