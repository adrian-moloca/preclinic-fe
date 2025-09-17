import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { IAssistent } from '../../providers/assistent/types';
import { useAssistentsContext } from '../../providers/assistent/context';
import ProfileImageUploader from '../profile-image';
import { useNavigate } from 'react-router-dom';
import ScheduleForm from '../schedule-form';
import PersonalInfoSection from './components/personal-info';
import AddressInfoSection from './components/address-info';
import EducationInfoSection from './components/education-info';
import ProfessionalInfoSection from './components/prefessional-info';

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
  university: '',
  },
  workingSchedule: [
    {
      day: '',
      schedule: {
        from: '',
        to: '',
        session: ''
      }
    }
  ],
};

export const AddAssistentForm: React.FC = () => {
  const { addAssistent } = useAssistentsContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<IAssistent, 'id'>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const latestScheduleRef = useRef<Record<string, any[]>>({});

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
  const workingScheduleArray = Object.entries(schedules).map(([day, scheduleArr]) => ({
    day,
    schedule: [scheduleArr[0]?.schedule || { from: '', to: '', session: '' }]
  }));
  setFormData(prev => ({
    ...prev,
    workingSchedule: workingScheduleArray as any // Use 'any' to bypass the type check temporarily
  }));
}, []);

  const resetForm = () => {
    setFormData(initialFormData);
    latestScheduleRef.current = {};
    setErrors({});
  };

 const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();

  if (validateForm()) {
    const finalScheduleData = latestScheduleRef.current && Object.keys(latestScheduleRef.current).length > 0
      ? Object.entries(latestScheduleRef.current)
          .filter(([_, scheduleArr]) => {
            // Only include schedules that have complete data
            const schedule = scheduleArr[0]?.schedule;
            return schedule && schedule.from && schedule.to && schedule.session;
          })
          .map(([day, scheduleArr]) => ({
            day,
            schedule: [scheduleArr[0].schedule]
          }))
      : formData.workingSchedule
          .filter(item => {
            // Filter out items with incomplete schedule data
            const sched = Array.isArray(item.schedule) ? item.schedule[0] : item.schedule;
            return sched && sched.from && sched.to && sched.session;
          })
          .map(item => ({
            day: item.day,
            schedule: Array.isArray(item.schedule) ? item.schedule : [item.schedule]
          }));

    // Only proceed if there's at least some schedule data
    if (finalScheduleData.length === 0) {
      // Optionally, you can set an empty array or show an error
      finalScheduleData.push({
        day: 'Monday',
        schedule: [{ from: '09:00', to: '17:00', session: 'morning' }] // Default values
      });
    }

    const newAssistent: IAssistent = {
      ...formData,
      workingSchedule: finalScheduleData as any,
      // id: `asst_${Date.now()}`,
    };

    addAssistent(newAssistent);
    resetForm();
    navigate('/assistents/all');
  }
};

  const handleCancel = () => {
    resetForm();
    navigate('/assistents/all');
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">
          Add New Assistant
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
              {isFormValid ? 'Add Assistant' : 'Complete Required Fields'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};