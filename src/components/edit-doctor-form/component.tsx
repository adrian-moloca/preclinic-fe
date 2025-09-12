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

export const EditDoctorForm: React.FC = () => {
  const { doctors, updateDoctor } = useDoctorsContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const doctor = doctors.find(doc => doc.id === id);
  
  const [formData, setFormData] = useState<Omit<IDoctor, 'id'>>({
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
    yearsOfExperience: 0,
    department: '',
    designation: '',
    medLicenteNumber: '',
    languages: [],
    about: '',
    appointmentType: '',
    appointmentDuration: 30,
    consultationCharge: 0,
    educationInformation: {
      educationalDegrees: '',
      university: '',
      from: '',
      to: '',
    },
    workingSchedule: {}, 
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const latestScheduleRef = useRef<Record<string, any[]>>({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        profileImg: doctor.profileImg || '',
        firstName: doctor.firstName || '',
        lastName: doctor.lastName || '',
        phoneNumber: doctor.phoneNumber || '',
        email: doctor.email || '',
        birthDate: doctor.birthDate || '',
        gender: doctor.gender || '',
        bloodGroup: doctor.bloodGroup || '',
        country: doctor.country || '',
        state: doctor.state || '',
        city: doctor.city || '',
        address: doctor.address || '',
        zipCode: doctor.zipCode || '',
        yearsOfExperience: doctor.yearsOfExperience || 0,
        department: doctor.department || '',
        designation: doctor.designation || '',
        medLicenteNumber: doctor.medLicenteNumber || '',
        languages: doctor.languages || [],
        about: doctor.about || '',
        appointmentType: doctor.appointmentType || '',
        appointmentDuration: doctor.appointmentDuration || 30,
        consultationCharge: doctor.consultationCharge || 0,
        educationInformation: {
          educationalDegrees: doctor.educationInformation?.educationalDegrees || '',
          university: doctor.educationInformation?.university || '',
          from: doctor.educationInformation?.from || '',
          to: doctor.educationInformation?.to || '',
        },
        workingSchedule: doctor.workingSchedule || {},
      });
      
      latestScheduleRef.current = doctor.workingSchedule || {};
    }
  }, [doctor]);

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
    setFormData(prev => ({
      ...prev,
      workingSchedule: schedules
    }));
  }, []);

  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.firstName.trim(),
      formData.lastName.trim(),
      formData.email.trim(),
      formData.phoneNumber.trim(),
      formData.department.trim(),
      formData.medLicenteNumber.trim(),
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.medLicenteNumber.trim()) newErrors.medLicenteNumber = 'Medical license number is required';
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      const finalScheduleData = latestScheduleRef.current && Object.keys(latestScheduleRef.current).length > 0 
        ? latestScheduleRef.current 
        : formData.workingSchedule;

      const updatedDoctor: IDoctor = {
        ...formData,
        workingSchedule: finalScheduleData,
        id: doctor.id, 
      };
      
      updateDoctor(updatedDoctor);
      navigate('/doctors/all');
    }
  };

  const handleCancel = () => {
    navigate('/doctors/all');
  };

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