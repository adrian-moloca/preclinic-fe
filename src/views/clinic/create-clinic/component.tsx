import { FC, useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Container,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useClinicContext } from '../../../providers/clinic/context';
import { CreateClinicData, Clinic } from '../../../providers/clinic/types';
import BasicInfoStep from './components/basic-info';
import ContactStep from './components/contact';
import BusinessHoursStep from './components/business-hours';

interface CreateClinicWizardProps {
  editMode?: boolean;
  existingClinic?: Clinic | null;
}

const steps = [
  'Basic Information',
  'Location & Contact',
  'Business Hours',
];

const defaultBusinessHours = {
  monday: { open: '09:00', close: '17:00', isClosed: false },
  tuesday: { open: '09:00', close: '17:00', isClosed: false },
  wednesday: { open: '09:00', close: '17:00', isClosed: false },
  thursday: { open: '09:00', close: '17:00', isClosed: false },
  friday: { open: '09:00', close: '17:00', isClosed: false },
  saturday: { open: '09:00', close: '13:00', isClosed: false },
  sunday: { open: '09:00', close: '13:00', isClosed: true },
};

export const CreateClinicWizard: FC<CreateClinicWizardProps> = ({ 
  editMode = false, 
  existingClinic 
}) => {
  const navigate = useNavigate();
  const { createClinic, updateClinic, loading } = useClinicContext();
  
  const [activeStep, setActiveStep] = useState(0);
  
  // Initialize formData with existing clinic data if in edit mode
  const [formData, setFormData] = useState<Partial<CreateClinicData>>(() => {
    if (editMode && existingClinic) {
      return {
        name: existingClinic.name || '',
        description: existingClinic.description || '',
        logo: existingClinic.logo || '',
        email: existingClinic.email || '',
        phone: existingClinic.phone || '',
        website: existingClinic.website || '',
        address: existingClinic.address || '',
        city: existingClinic.city || '',
        state: existingClinic.state || '',
        zipCode: existingClinic.zipCode || '',
        businessHours: existingClinic.businessHours || defaultBusinessHours,
        settings: existingClinic.settings || {
          timeZone: 'Europe/Bucharest',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          currency: 'RON',
          language: 'Romanian',
          theme: 'light',
          emailNotifications: true,
          smsNotifications: true,
          appointmentReminders: true,
          marketingEmails: false,
          systemAlerts: true,
        }
      };
    }
    
    // Default empty state for create mode
    return {
      name: '',
      description: '',
      logo: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      businessHours: defaultBusinessHours,
      settings: {
        timeZone: 'Europe/Bucharest',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'RON',
        language: 'Romanian',
        theme: 'light',
        emailNotifications: true,
        smsNotifications: true,
        appointmentReminders: true,
        marketingEmails: false,
        systemAlerts: true,
      }
    };
  });
  
  const [errors, setErrors] = useState<any>({});
  const [submitError, setSubmitError] = useState('');

  // Update form data when existingClinic changes (for edit mode)
  useEffect(() => {
    if (editMode && existingClinic) {
      setFormData({
        name: existingClinic.name || '',
        description: existingClinic.description || '',
        logo: existingClinic.logo || '',
        email: existingClinic.email || '',
        phone: existingClinic.phone || '',
        website: existingClinic.website || '',
        address: existingClinic.address || '',
        city: existingClinic.city || '',
        state: existingClinic.state || '',
        zipCode: existingClinic.zipCode || '',
        businessHours: existingClinic.businessHours || defaultBusinessHours,
        settings: existingClinic.settings || {
          timeZone: 'Europe/Bucharest',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          currency: 'RON',
          language: 'Romanian',
          theme: 'light',
          emailNotifications: true,
          smsNotifications: true,
          appointmentReminders: true,
          marketingEmails: false,
          systemAlerts: true,
        }
      });
    }
  }, [editMode, existingClinic]);

  const handleChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    switch (step) {
      case 0: 
        if (!formData.name?.trim()) newErrors.name = 'Clinic name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
        break;
        
      case 1:
        if (!formData.address?.trim()) newErrors.address = 'Address is required';
        if (!formData.city?.trim()) newErrors.city = 'City is required';
        if (!formData.state?.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
        break;
        
      case 2:
        // Business hours validation if needed
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    try {
      setSubmitError('');
      
      if (editMode && existingClinic) {
        // Update existing clinic
        await updateClinic(existingClinic.id, formData);
        navigate('/settings');
      } else {
        // Create new clinic
        const completeData: CreateClinicData = {
          name: formData.name || '',
          description: formData.description || '',
          logo: formData.logo || '',
          email: formData.email || '',
          phone: formData.phone || '',
          website: formData.website || '',
          address: formData.address || '',
          city: formData.city || '',
          state: formData.state || '',
          country: formData.country || '',
          zipCode: formData.zipCode || '',
          businessHours: formData.businessHours || defaultBusinessHours,
          settings: formData.settings || {
            timeZone: 'Europe/Bucharest',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            currency: 'RON',
            language: 'Romanian',
            theme: 'light',
            emailNotifications: true,
            smsNotifications: true,
            appointmentReminders: true,
            marketingEmails: false,
            systemAlerts: true,
          },
        };
        
        await createClinic(completeData);
        navigate('/');
      }
    } catch (error) {
      setSubmitError(editMode ? 'Failed to update clinic. Please try again.' : 'Failed to create clinic. Please try again.');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <ContactStep
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <BusinessHoursStep
            formData={formData}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: editMode ? 'transparent' : 'grey.50', minHeight: editMode ? 'auto' : '100vh', py: editMode ? 0 : 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" fontWeight={600} textAlign="center" mb={2}>
            {editMode ? 'Update Clinic Information' : 'Create Your Clinic'}
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" mb={4}>
            {editMode ? 'Update your clinic profile information' : "Let's set up your clinic profile to get started"}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError('')}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>

            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ ml: 1 }}
                >
                  {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Clinic' : 'Create Clinic')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ ml: 1 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
