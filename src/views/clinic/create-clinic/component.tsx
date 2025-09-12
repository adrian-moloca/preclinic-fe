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
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClinicContext } from '../../../providers/clinic/context';
import { defaultBusinessHours } from '../../../providers/clinic/types';
import BasicInfoStep from './components/basic-info';
import ContactStep from './components/contact';
import BusinessHoursStep from './components/business-hours';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

const steps = [
  'Basic Information',
  'Location & Contact',
  'Business Hours',
];

export const CreateClinicWizard: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createClinic, updateClinic, selectedClinic, setSelectedClinic, loading, error: contextError } = useClinicContext();
  
  const isEditMode = !!selectedClinic && (location.pathname.includes('edit') || location.pathname.includes('settings'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    logo: '',
    email: '',
    phone: '',
    website: '',
    country: '', 
    state: '',
    city: '',
    address: '',
    zipCode: '',
    businessHours: defaultBusinessHours,
  });
  const [errors, setErrors] = useState<any>({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [justCreated, setJustCreated] = useState(false);

  useEffect(() => {
    if (selectedClinic && (isEditMode || justCreated)) {
      const prefillData = {
        name: selectedClinic.name || '',
        description: selectedClinic.description || '',
        logo: selectedClinic.logo || '',
        email: selectedClinic.email || '',
        phone: selectedClinic.phone || '',
        website: selectedClinic.website || '',
        
        country: '',
        state: selectedClinic.state || '',
        city: selectedClinic.city || '',
        address: selectedClinic.address || '',
        zipCode: selectedClinic.zipCode || '',
        
        businessHours: selectedClinic.businessHours || defaultBusinessHours,
      };
      
      setFormData(prefillData);
      setInitialData(prefillData);
      
      if (!justCreated) {
        setActiveStep(0);
      }
      
      setHasChanges(false);
      
      console.log('Prefilled clinic data:', prefillData);
      
      if (justCreated) {
        setJustCreated(false);
      }
    } else if (!isEditMode && !justCreated) {
      const emptyData = {
        name: '',
        description: '',
        logo: '',
        email: '',
        phone: '',
        website: '',
        country: '',
        state: '',
        city: '',
        address: '',
        zipCode: '',
        businessHours: defaultBusinessHours,
      };
      
      setFormData(emptyData);
      setInitialData(emptyData);
      setActiveStep(0);
      setHasChanges(false);
    }
  }, [selectedClinic, isEditMode, justCreated]);

  const handleChange = useCallback((field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value };
      
      if (initialData) {
        const hasAnyChange = JSON.stringify(updated) !== JSON.stringify(initialData);
        setHasChanges(hasAnyChange);
      } else {
        setHasChanges(true);
      }
      
      return updated;
    });
    
    setSuccessMessage('');
    
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  }, [errors, initialData]);

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
        if (!formData.state?.trim() && !formData.country?.trim()) {
          newErrors.state = 'State is required';
        }
        if (!formData.zipCode?.trim()) newErrors.zipCode = 'ZIP code is required';
        break;
        
      case 2:
        // Business hours are optional
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
      setSuccessMessage('');
      
      console.log(`${isEditMode ? 'Updating' : 'Creating'} clinic with form data:`, formData);
      
      const { country, businessHours, ...dataWithoutExtras } = formData;
      
      const clinicData: any = {
        name: dataWithoutExtras.name || '',
        description: dataWithoutExtras.description || '',
        logo: dataWithoutExtras.logo || '',
        address: dataWithoutExtras.address || '',
        city: dataWithoutExtras.city || '',
        state: dataWithoutExtras.state || '',
        country: dataWithoutExtras.country || '',
        zipCode: dataWithoutExtras.zipCode || '',
        phone: dataWithoutExtras.phone || '',
        email: dataWithoutExtras.email || '',
        website: dataWithoutExtras.website || '',
      };
      
      if (!isEditMode) {
        clinicData.businessHours = businessHours || defaultBusinessHours;
      }
      
      console.log(`Sending to API for ${isEditMode ? 'update' : 'create'}:`, clinicData);
      
      let result;
      if (isEditMode && selectedClinic) {
        result = await updateClinic(selectedClinic.id, clinicData);
        setSuccessMessage('Clinic updated successfully!');
        setHasChanges(false);
        
        setInitialData(formData);
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        result = await createClinic(clinicData);
        
        if (result && result.id) {
          console.log('Clinic created successfully:', result);
          
          if (setSelectedClinic) {
             setSelectedClinic(result);
          }
          
          setJustCreated(true);
          
          setSuccessMessage('Clinic created successfully! You can continue editing your clinic settings.');
          
          navigate(`/clinic/${result.id}/edit`, { replace: true });
          
          setInitialData({
            name: result.name || '',
            description: result.description || '',
            logo: result.logo || '',
            email: result.email || '',
            phone: result.phone || '',
            website: result.website || '',
            country: '',
            state: result.state || '',
            city: result.city || '',
            address: result.address || '',
            zipCode: result.zipCode || '',
            businessHours: result.businessHours || defaultBusinessHours,
          });
          
          setHasChanges(false);
          
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        } else {
          throw new Error('Failed to create clinic - invalid response');
        }
      }
      
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} clinic:`, error);
      setSubmitError(error.message || contextError || `Failed to ${isEditMode ? 'update' : 'create'} clinic. Please try again.`);
      
      setTimeout(() => {
        setSubmitError('');
      }, 5000);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setHasChanges(false);
      setErrors({});
      setSuccessMessage('Form reset to original values');
      setTimeout(() => setSuccessMessage(''), 2000);
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight={600}>
              {isEditMode ? 'Edit Clinic Settings' : 'Create Your Clinic'}
            </Typography>
            {isEditMode && (
              <Box display="flex" gap={1}>
                <Chip
                  icon={<EditIcon />}
                  label="Edit Mode"
                  color="primary"
                  variant="outlined"
                />
                {hasChanges && (
                  <Chip
                    label="Unsaved Changes"
                    color="warning"
                    size="small"
                  />
                )}
              </Box>
            )}
          </Box>
          
          <Typography variant="body1" color="text.secondary" mb={4}>
            {isEditMode 
              ? 'Update your clinic information and settings'
              : "Let's set up your clinic profile to get started"
            }
          </Typography>

          {selectedClinic && isEditMode && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Editing: <strong>{selectedClinic.name}</strong>
              {selectedClinic.id && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  ID: {selectedClinic.id}
                </Typography>
              )}
            </Alert>
          )}

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

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              {isEditMode && (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outlined"
                    color="secondary"
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  {hasChanges && (
                    <Button
                      onClick={handleReset}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      Reset
                    </Button>
                  )}
                </>
              )}
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
            </Box>

            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || (!hasChanges && isEditMode)}
                  startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
                  sx={{ ml: 1 }}
                >
                  {loading 
                    ? (isEditMode ? 'Updating...' : 'Creating...') 
                    : (isEditMode ? (hasChanges ? 'Update Clinic' : 'No Changes') : 'Create Clinic')
                  }
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

          {isEditMode && selectedClinic && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date(selectedClinic.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};