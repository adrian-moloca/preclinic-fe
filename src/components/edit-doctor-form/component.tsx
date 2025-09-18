import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { IDoctor } from '../../providers/doctor/types';
import { useDoctorsContext } from '../../providers/doctor/context';
import PersonalInfoSection from '../add-doctor-form/components/personal-informations';
import AddressInfoSection from '../add-doctor-form/components/address-info';
import ProfessionalInfoSection from '../add-doctor-form/components/professional-info';
import EducationInfoSection from '../add-doctor-form/components/education-info';
import AppointmentSettingsSection from '../add-doctor-form/components/appointments-settings';
import ProfileImageUploader from '../profile-image';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleForm from '../schedule-form';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const initialFormData: Omit<IDoctor, 'id'> = {
  profileImg: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  birthDate: '',
  gender: '',
  bloodGroup: '',
  country: '',
  state: '',
  city: '',
  address: '',
  zipCode: '',
  yearsOfExperience: '',
  department: '',
  designation: '',
  medLicenseNumber: '',
  languages: [],
  about: '',
  appointmentType: '',
  appointmentDuration: 30,
  consultationCharge: 0,
  educationalInformation: [
    {
      educationalDegree: '',
      university: '',
      from: '',
      to: '',
    }
  ],
  workingSchedule: [{
    day: '',
    schedule: {
      from: '',
      to: '',
      session: ''
    }
  }],
};

export const EditDoctorForm: React.FC = () => {
  const { doctors, updateDoctor } = useDoctorsContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const doctor = doctors.find(doc => doc.id === id);
  
  const [formData, setFormData] = useState<Omit<IDoctor, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const latestScheduleRef = useRef<Record<string, any[]>>({});

  useEffect(() => {
    if (doctor) {
      // Process working schedule - extract it first
      let workingScheduleObject: Record<string, any[]> = {};
      
      if (Array.isArray(doctor.workingSchedule)) {
        doctor.workingSchedule.forEach((item: any) => {
          if (item.day && item.schedule) {
            if (Array.isArray(item.schedule)) {
              workingScheduleObject[item.day] = item.schedule.map((sch: any) => ({
                id: sch._id || sch.id || Date.now() + Math.random(),
                from: sch.from || '',
                to: sch.to || '',
                session: sch.session || ''
              }));
            } else {
              workingScheduleObject[item.day] = [{
                id: item.schedule._id || item.schedule.id || Date.now(),
                from: item.schedule.from || '',
                to: item.schedule.to || '',
                session: item.schedule.session || ''
              }];
            }
          }
        });
      }

      // Process educational information
      const processedEducationalInfo = doctor.educationalInformation && doctor.educationalInformation.length > 0
        ? doctor.educationalInformation.map(edu => ({
            educationalDegree: edu.educationalDegree || '',
            university: edu.university || '',
            from: edu.from || '',
            to: edu.to || ''
          }))
        : [{
            educationalDegree: '',
            university: '',
            from: '',
            to: ''
          }];

      // Set form data with all doctor information
      const doctorData: Omit<IDoctor, 'id'> = {
        ...doctor,
        yearsOfExperience: doctor.yearsOfExperience ? doctor.yearsOfExperience.toString() : '',
        educationalInformation: processedEducationalInfo,
        // Keep the original working schedule format for now
        workingSchedule: doctor.workingSchedule || [{
          day: '',
          schedule: {
            from: '',
            to: '',
            session: ''
          }
        }]
      };
      
      // Remove the id field if it exists
      const { id: _, ...formDataWithoutId } = doctorData as any;
      
      setFormData(formDataWithoutId);
      latestScheduleRef.current = workingScheduleObject;
      setIsLoading(false);
    } else if (doctors.length > 0) {
      setIsLoading(false);
    }
  }, [doctor, doctors]);

  const handleInputChange = (field: Extract<keyof typeof formData, string>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProfileImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, profileImg: imageUrl }));
  };

  const handleScheduleSubmit = useCallback((schedules: Record<string, any[]>) => {
    latestScheduleRef.current = schedules;
    const workingScheduleArray =
      Object.entries(schedules).map(([day, scheduleArr]) => ({
        day,
        schedule: scheduleArr
      }));
    setFormData(prev => ({
      ...prev,
      workingSchedule: workingScheduleArray.length > 0
        ? workingScheduleArray as any
        : [{
            day: '',
            schedule: [{ from: '', to: '', session: '' }]
          }]
    }));
  }, []);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.firstName.trim(),
      formData.lastName.trim(),
      formData.email.trim(),
      formData.phoneNumber.trim(),
      formData.department.trim(),
      formData.medLicenseNumber.trim(),
      formData.country.trim(),
      formData.state.trim(),
      formData.city.trim(),
      formData.address.trim(),
      formData.zipCode.trim()
    ];

    const allRequiredFieldsFilled = requiredFields.every(field => field.length > 0);
    const isEmailValid = formData.email.trim() === '' || /\S+@\S+\.\S+/.test(formData.email);
    const isPhoneValid = formData.phoneNumber.trim() === '' || /^\d{10,}$/.test(formData.phoneNumber.replace(/[-()\s]/g, ''));

    return allRequiredFieldsFilled && isEmailValid && isPhoneValid;
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.medLicenseNumber.trim()) newErrors.medLicenseNumber = 'Medical license number is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phoneNumber && !/^\d{10,}$/.test(formData.phoneNumber.replace(/[-()\s]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    if (doctor) {
      // Re-process the doctor data same as in useEffect
      let workingScheduleObject: Record<string, any[]> = {};
      
      if (Array.isArray(doctor.workingSchedule)) {
        doctor.workingSchedule.forEach((item: any) => {
          if (item.day && item.schedule) {
            if (Array.isArray(item.schedule)) {
              workingScheduleObject[item.day] = item.schedule.map((sch: any) => ({
                id: sch._id || sch.id || Date.now() + Math.random(),
                from: sch.from || '',
                to: sch.to || '',
                session: sch.session || ''
              }));
            } else {
              workingScheduleObject[item.day] = [{
                id: item.schedule._id || item.schedule.id || Date.now(),
                from: item.schedule.from || '',
                to: item.schedule.to || '',
                session: item.schedule.session || ''
              }];
            }
          }
        });
      }

      const processedEducationalInfo = doctor.educationalInformation && doctor.educationalInformation.length > 0
        ? doctor.educationalInformation
        : [{
            educationalDegree: '',
            university: '',
            from: '',
            to: ''
          }];

      const { id: _, ...doctorDataWithoutId } = doctor;
      
      setFormData({
        ...doctorDataWithoutId,
        yearsOfExperience: doctor.yearsOfExperience ? doctor.yearsOfExperience.toString() : '',
        educationalInformation: processedEducationalInfo
      });
      latestScheduleRef.current = workingScheduleObject;
    }
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm() && doctor) {
      const scheduleData = latestScheduleRef.current && Object.keys(latestScheduleRef.current).length > 0 
        ? latestScheduleRef.current 
        : formData.workingSchedule;

      let finalScheduleArray: { day: string; schedule: { from: string; to: string; session: string }[] }[];
      if (scheduleData && typeof scheduleData === 'object' && !Array.isArray(scheduleData)) {
        finalScheduleArray = Object.entries(scheduleData).map(([day, schedules]) => ({
          day,
          schedule: Array.isArray(schedules) 
            ? schedules.map(({ id, _id, ...rest }: any) => ({
                ...rest,
                session: rest.session ? rest.session.toLowerCase() : ''
              }))
            : []
        }));
      } else if (Array.isArray(scheduleData)) {
        finalScheduleArray = scheduleData.map(item => ({
          ...item,
          schedule: Array.isArray(item.schedule) 
            ? item.schedule.map(({ id, _id, ...rest }: any) => ({
                ...rest,
                session: rest.session ? rest.session.toLowerCase() : ''
              }))
            : []
        }));
      } else {
        finalScheduleArray = [];
      }

      const updatedDoctor: IDoctor = {
        ...formData,
        workingSchedule: finalScheduleArray as any,
        id: doctor.id,
        userId: doctor.userId,
      };
      
      try {
        await updateDoctor(updatedDoctor);
        navigate('/doctors/all');
      } catch (error) {
        console.error('Failed to update doctor:', error);
      }
    }
  };

  const handleCancel = () => {
    if (doctor) {
      navigate(`/doctors/${doctor.id}`);
    } else {
      navigate('/doctors/all');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" mb={2}>
            Loading Doctor Data...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" mb={2}>
            Doctor Not Found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            The doctor with ID "{id}" could not be found.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/doctors/all')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Doctors List
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>

        <Typography variant="h4" fontWeight={600} mb={1} textAlign="center">
          Edit Dr. {formData.firstName} {formData.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4} textAlign="center">
          Update doctor information and settings
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box mb={4} display="flex" justifyContent="center">
            <ProfileImageUploader
              image={formData.profileImg}
              setImage={handleProfileImageChange}
            />
          </Box>

          <Box mb={4}>
            <PersonalInfoSection
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
            />
          </Box>

          <Box mb={4}>
            <AddressInfoSection 
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              errors={errors}
            />
          </Box>

          <Box mb={4}>
            <ProfessionalInfoSection 
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          </Box>

          <Box mb={4}>
            <EducationInfoSection 
              formData={formData}
              setFormData={setFormData}
            />
          </Box>

          <Box mb={4}>
            <AppointmentSettingsSection 
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </Box>

          <Box mb={4}>        
            <ScheduleForm
              role="doctor"
              title={`Working Hours for Dr. ${formData.firstName} ${formData.lastName}`}
              onSubmit={handleScheduleSubmit}
              hideSubmitButton={true}
              initialSchedule={latestScheduleRef.current}
            />
          </Box>

          <Box display="flex" justifyContent="center" gap={3} mt={6}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleCancel}
              sx={{ 
                minWidth: 150,
                py: 1.5
              }}
            >
              Cancel
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={resetForm}
              sx={{ 
                minWidth: 150,
                py: 1.5
              }}
            >
              Reset Changes
            </Button>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isFormValid}
              sx={{ 
                minWidth: 150,
                py: 1.5,
                '&.Mui-disabled': {
                  backgroundColor: 'grey.300',
                  color: 'grey.500',
                  opacity: 0.6
                },
                '&:not(.Mui-disabled)': {
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }
              }}
            >
              {isFormValid ? 'Update Doctor' : 'Complete Required Fields'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};