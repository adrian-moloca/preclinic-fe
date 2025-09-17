import React, { useState, useCallback, useRef, useMemo, useEffect, FC } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { IAssistent } from '../../providers/assistent/types';
import { useAssistentsContext } from '../../providers/assistent/context';
import ProfileImageUploader from '../profile-image';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleForm from '../schedule-form';
import PersonalInfoSection from '../add-assistsent-form/components/personal-info';
import AddressInfoSection from '../add-assistsent-form/components/address-info';
import EducationInfoSection from '../add-assistsent-form/components/education-info';
import ProfessionalInfoSection from '../add-assistsent-form/components/prefessional-info';

const initialFormData: Omit<IAssistent, 'id'> = {
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
  medLicenseNumber: '',
  languages: [],
  about: '',
  educationalInformation: {
  educationalDegree: '',
  from : '',
  to: '',
  university: ''
  },
  workingSchedule: [{
    day: '',
    schedule: {
      from: '',
      to: '',
      session: ''
    }
  }],
};

export const EditAssistentForm: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { assistents, updateAssistent } = useAssistentsContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<IAssistent, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const latestScheduleRef = useRef<Record<string, any[]>>({});

  const assistentToEdit = useMemo(() => {
    return assistents.find(assistant => assistant.id === id);
  }, [assistents, id]);

  useEffect(() => {
    if (assistentToEdit) {
      const { id: _, ...assistentData } = assistentToEdit;
      setFormData(assistentData);
      latestScheduleRef.current = Array.isArray(assistentData.workingSchedule)
        ? assistentData.workingSchedule.reduce((acc, item) => {
            if (item.day && item.schedule) {
              if (Array.isArray(item.schedule)) {
                acc[item.day] = item.schedule;
              } else {
                acc[item.day] = [item.schedule];
              }
            }
            return acc;
          }, {} as Record<string, any[]>)
        : {};
      setIsLoading(false);
    } else if (assistents.length > 0) {
      setIsLoading(false);
    }
  }, [assistentToEdit, assistents]);

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

  const resetForm = () => {
    if (assistentToEdit) {
      const { id: _, ...assistentData } = assistentToEdit;
      setFormData(assistentData);
      latestScheduleRef.current = Array.isArray(assistentData.workingSchedule)
        ? assistentData.workingSchedule.reduce((acc, item) => {
            if (item.day && item.schedule) {
              if (Array.isArray(item.schedule)) {
                acc[item.day] = item.schedule;
              } else {
                acc[item.day] = [item.schedule];
              }
            }
            return acc;
          }, {} as Record<string, any[]>)
        : {};
    }
    setErrors({});
  };

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  
  if (validateForm() && assistentToEdit) {
    const scheduleData = latestScheduleRef.current && Object.keys(latestScheduleRef.current).length > 0 
      ? latestScheduleRef.current 
      : formData.workingSchedule;

    let finalScheduleArray: { day: string; schedule: { from: string; to: string; session: string }[] }[];
    if (scheduleData && typeof scheduleData === 'object' && !Array.isArray(scheduleData)) {
      finalScheduleArray = Object.entries(scheduleData).map(([day, schedules]) => ({
        day,
        schedule: Array.isArray(schedules) 
          ? schedules.map(({ id, ...rest }) => ({
              ...rest,
              session: rest.session ? rest.session.toLowerCase() : ''
            }))
          : []
      }));
    } else if (Array.isArray(scheduleData)) {
      finalScheduleArray = scheduleData.map(item => ({
        ...item,
        schedule: Array.isArray(item.schedule) 
          ? item.schedule.map(({ id, ...rest }) => ({
              ...rest,
              session: rest.session ? rest.session.toLowerCase() : ''
            }))
          : []
      }));
    } else {
      finalScheduleArray = [];
    }

    const updatedAssistent: IAssistent = {
      ...formData,
      workingSchedule: finalScheduleArray as any,
      id: assistentToEdit.id,
      userId: assistentToEdit.userId, // Include userId if it exists
    };
    
    try {
      await updateAssistent(updatedAssistent);
      // Navigate to the all assistants page instead of the details page
      navigate('/assistents/all');
    } catch (error) {
      console.error('Failed to update assistant:', error);
    }
  }
};

  const handleCancel = () => {
    if (assistentToEdit) {
      navigate(`/assistents/${assistentToEdit.id}`);
    } else {
      navigate('/assistents/all');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" mb={2}>
            Loading Assistant Data...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!assistentToEdit) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" mb={2}>
            Assistant Not Found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            The assistant with ID "{id}" could not be found.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/assistents/all')}>
            Back to All Assistants
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
          Edit Assistant: {assistentToEdit.firstName} {assistentToEdit.lastName}
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
            <ScheduleForm
              role="assistant"
              title={`Working Hours for ${formData.firstName} ${formData.lastName}`}
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
              {isFormValid ? 'Update Assistant' : 'Complete Required Fields'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};