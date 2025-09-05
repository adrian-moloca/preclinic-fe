import { FC, useState, useCallback } from 'react';
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
import { CreateClinicData } from '../../../providers/clinic/types';
import BasicInfoStep from './components/basic-info';
import ContactStep from './components/contact';
import BusinessHoursStep from './components/business-hours';

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

export const CreateClinicWizard: FC = () => {
  const navigate = useNavigate();
  const { createClinic, loading } = useClinicContext();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateClinicData>>({
    businessHours: defaultBusinessHours,
  });
  const [errors, setErrors] = useState<any>({});
  const [submitError, setSubmitError] = useState('');

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
      await createClinic(formData as CreateClinicData);
      navigate('/');
    } catch (error) {
      setSubmitError('Failed to create clinic. Please try again.');
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
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" fontWeight={600} textAlign="center" mb={2}>
            Create Your Clinic
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" mb={4}>
            Let's set up your clinic profile to get started
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
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
                  {loading ? 'Creating Clinic...' : 'Create Clinic'}
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