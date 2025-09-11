import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  Fade,
  useTheme,
  Divider,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { FC, useState, useEffect } from "react";
import { useClinicContext } from "../../../../providers/clinic/context";
import { useAuthContext } from "../../../../providers/auth/context";
import ProfileImageUploader from "../../../../components/profile-image";
import { useNavigate } from "react-router-dom";
import { City, Country, State } from "country-state-city";

const steps = ['Basic Information', 'Contact & Location', 'Business Hours'];

export const ClinicInformationSettings: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { selectedClinic, updateClinic, createClinic, loading, getUserClinics } = useClinicContext();
  const { user, getMe } = useAuthContext();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [isCreatingClinic, setIsCreatingClinic] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const countries = Country.getAllCountries();
  const selectedCountry = countries.find((c) => c.name === country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const selectedState = states.find((s) => s.name === state);
  const cities = selectedState && selectedCountry
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { open: '09:00', close: '17:00', isClosed: false },
    tuesday: { open: '09:00', close: '17:00', isClosed: false },
    wednesday: { open: '09:00', close: '17:00', isClosed: false },
    thursday: { open: '09:00', close: '17:00', isClosed: false },
    friday: { open: '09:00', close: '17:00', isClosed: false },
    saturday: { open: '09:00', close: '13:00', isClosed: false },
    sunday: { open: '09:00', close: '13:00', isClosed: true },
  });

  const [errors, setErrors] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        await getMe();
      }
    };
    fetchUserData();
  }, [user, getMe]);

  useEffect(() => {
    if (user && user.role === 'doctor_owner') {
      const userClinics = getUserClinics(user.id);
      if (!userClinics || userClinics.length === 0) {
        setIsCreatingClinic(true);
      }
    }
  }, [user, getUserClinics]);

  useEffect(() => {
    if (selectedClinic && !isCreatingClinic) {
      setFormData({
        name: selectedClinic.name || '',
        description: selectedClinic.description || '',
        logo: selectedClinic.logo || '',
        address: selectedClinic.address || '',
        country: selectedClinic.country || '',
        city: selectedClinic.city || '',
        state: selectedClinic.state || '',
        zipCode: selectedClinic.zipCode || '',
        phone: selectedClinic.phone || '',
        email: selectedClinic.email || '',
        website: selectedClinic.website || '',
      });
      // Also set the separate city, state and country variables
      setCountry(selectedClinic.country || '');
      setCity(selectedClinic.city || '');
      setState(selectedClinic.state || '');
      
      if (selectedClinic.businessHours) {
        setBusinessHours(prev => ({
          ...prev,
          ...selectedClinic.businessHours,
        }));
      }
      setHasChanges(false);
    }
  }, [selectedClinic, isCreatingClinic]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);

    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const validateStep = () => {
    const newErrors: any = {};

    if (activeStep === 0) {
      if (!formData.name.trim()) {
        newErrors.name = 'Clinic name is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      }
    }

    if (activeStep === 1) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }

      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }

      // Check the separate country, city and state variables, not formData
      if (!country.trim()) {
        newErrors.country = 'Country is required';
      }

      if (!city.trim()) {
        newErrors.city = 'City is required';
      }

      if (!state.trim()) {
        newErrors.state = 'State/County is required';
      }

      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      }
    }

    setErrors(newErrors);
    
    // Update formData with country, city and state when validation passes
    if (Object.keys(newErrors).length === 0 && activeStep === 1) {
      setFormData(prev => ({
        ...prev,
        country: country,
        city: city,
        state: state
      }));
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Clinic name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State/County is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = async () => {
    if (isCreatingClinic) {
      if (!validateStep()) {
        return;
      }
    } else {
      if (!selectedClinic || !validateAllFields()) {
        return;
      }
    }

    try {
      setSaveMessage('');

      if (isCreatingClinic) {
        let currentUser = user;
        if (!currentUser) {
          currentUser = await getMe();
        }

        if (!currentUser || !currentUser.id) {
          setSaveMessage("Failed to get user information. Please try again.");
          return;
        }

        const clinicData = {
          ...formData,
          country: country || formData.country,  // Use the separate country state variable
          city: city || formData.city,  // Use the separate city state variable
          state: state || formData.state,  // Use the separate state state variable
          businessHours,
        };

        console.log('Creating clinic with data:', clinicData);
        const newClinic = await createClinic(clinicData);
        
        // Ensure the clinic is fully created and persisted
        if (newClinic && newClinic.id) {
          setSaveMessage("Clinic created successfully!");
          setIsCreatingClinic(false);

          // Add a small delay to ensure all async operations complete
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          throw new Error('Failed to create clinic - invalid response');
        }
      } else if (selectedClinic) {
        await updateClinic(selectedClinic.id, { ...formData, businessHours });
        setHasChanges(false);
        setSaveMessage("Clinic information updated successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      }

    } catch (error) {
      console.error('Error saving clinic:', error);
      setSaveMessage(isCreatingClinic ? "Failed to create clinic. Please try again." : "Failed to update clinic information. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleReset = () => {
    if (selectedClinic && !isCreatingClinic) {
      setFormData({
        name: selectedClinic.name || '',
        description: selectedClinic.description || '',
        logo: selectedClinic.logo || '',
        address: selectedClinic.address || '',
        city: selectedClinic.city || '',
        country: selectedClinic.country || '',
        state: selectedClinic.state || '',
        zipCode: selectedClinic.zipCode || '',
        phone: selectedClinic.phone || '',
        email: selectedClinic.email || '',
        website: selectedClinic.website || '',
      });
      setCountry(selectedClinic.country || '');
      setCity(selectedClinic.city || '');
      setState(selectedClinic.state || '');
      
      if (selectedClinic.businessHours) {
        setBusinessHours(prev => ({
          ...prev,
          ...selectedClinic.businessHours,
        }));
      }
      setHasChanges(false);
      setErrors({});
    } else if (isCreatingClinic) {
      setFormData({
        name: '',
        description: '',
        logo: '',
        address: '',
        country: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
      });
      setCountry('');
      setState('');
      setCity('');
      setErrors({});
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Box mb={4}>
              <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                <BusinessIcon color="primary" />
                Clinic Logo
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                <ProfileImageUploader
                  image={formData.logo}
                  setImage={(logo) => handleChange('logo', logo)}
                />
                <Typography variant="caption" color="text.secondary" mt={2} textAlign="center">
                  Upload your clinic's logo. Recommended size: 200x200px or larger.
                  <br />
                  Supported formats: JPG, PNG, GIF
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box>
              <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                <BusinessIcon color="primary" />
                Basic Information
              </Typography>

              <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Clinic Name"
                    placeholder="Enter your clinic name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                      width: "550px"
                    }}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    label="Description"
                    placeholder="Brief description of your clinic"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                      width: "550px"
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        );

      case 1:
        return (
          <>
            <Box mb={4}>
              <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                <PhoneIcon color="primary" />
                Contact Information
              </Typography>

              <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="+40 XXX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                      width: "370px"
                    }}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    label="Email Address"
                    placeholder="clinic@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                      width: "370px"
                    }}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    label="Website"
                    placeholder="https://www.yourclinic.com"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    InputProps={{
                      startAdornment: <WebsiteIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                      width: "370px"
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box>
              <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
                <LocationIcon color="primary" />
                Location
              </Typography>

              <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
                <Grid>
                  <FormControl fullWidth sx={{ width: "270px" }} required error={!!errors.country}>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                      labelId="country-label"
                      value={country}
                      label="Country"
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setState("");
                        setCity("");
                      }}
                    >
                      {countries.map((c) => (
                        <MenuItem key={c.isoCode} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid>
                  <FormControl fullWidth sx={{ width: "270px" }} required error={!!errors.state}>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      value={state}
                      label="State"
                      onChange={(e) => {
                        setState(e.target.value)
                        setCity("");
                      }}
                      disabled={!country}
                    >
                      {states.map((c) => (
                        <MenuItem key={c.isoCode} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid>
                  <FormControl fullWidth sx={{ width: "270px" }} required error={!!errors.city}>
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                      labelId="city-label"
                      value={city}
                      label="City"
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                      disabled={!state}
                    >
                      {cities.map((c) => (
                        <MenuItem key={c.name} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                      width: "270px"
                    }}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                      width: "270px"
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Business Hours
            </Typography>
            <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-around", alignItems: "Center" }}>
              {Object.entries(businessHours).map(([day, hours]) => (
                <Grid key={day}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography sx={{ width: 100, textTransform: 'capitalize' }}>
                      {day}:
                    </Typography>
                    <TextField
                      type="time"
                      size="small"
                      value={hours.open}
                      onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                      disabled={hours.isClosed}
                    />
                    <Typography>to</Typography>
                    <TextField
                      type="time"
                      size="small"
                      value={hours.close}
                      onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                      disabled={hours.isClosed}
                    />
                    <Button
                      variant={hours.isClosed ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleBusinessHoursChange(day, 'isClosed', !hours.isClosed)}
                    >
                      {hours.isClosed ? 'Closed' : 'Open'}
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderAllSections = () => (
    <>
      <Box mb={2}>
        <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
          <BusinessIcon color="primary" />
          Clinic Logo
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <ProfileImageUploader
            image={formData.logo}
            setImage={(logo) => handleChange('logo', logo)}
          />
          <Typography variant="caption" color="text.secondary" mt={2} textAlign="center">
            Upload your clinic's logo. Recommended size: 200x200px or larger.
            <br />
            Supported formats: JPG, PNG, GIF
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Basic Information */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
          <BusinessIcon color="primary" />
          Basic Information
        </Typography>

        <Grid container spacing={3}>
          <Grid>
            <TextField
              fullWidth
              label="Clinic Name"
              placeholder="Enter your clinic name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Description"
              placeholder="Brief description of your clinic"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Contact Information */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
          <PhoneIcon color="primary" />
          Contact Information
        </Typography>

        <Grid container spacing={3}>
          <Grid>
            <TextField
              fullWidth
              label="Email"
              placeholder="clinic@example.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Phone"
              placeholder="+40 123 456 789"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              required
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Website"
              placeholder="https://your-clinic.com"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              error={!!errors.website}
              helperText={errors.website}
              InputProps={{
                startAdornment: <WebsiteIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Location Information */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1}>
          <LocationIcon color="primary" />
          Location Information
        </Typography>

        <Grid container spacing={3}>
          <Grid>
            <TextField
              fullWidth
              label="Address"
              placeholder="Street address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="City"
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="State/County"
              placeholder="State"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              error={!!errors.state}
              helperText={errors.state}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="ZIP Code"
              placeholder="ZIP"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              error={!!errors.zipCode}
              helperText={errors.zipCode}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Business Hours */}
      {renderStepContent(2)}
    </>
  );

  if (!selectedClinic && !isCreatingClinic) {
    return (
      <Box p={3}>
        <Alert severity="info">
          Loading clinic information...
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        sx={{
          background: theme.palette.mode === "dark"
            ? "rgba(30, 32, 36, 0.98)"
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.5)"
            : "0 8px 32px rgba(0,0,0,0.1)",
          color: theme.palette.text.primary,
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                background: theme.palette.mode === "dark" ? "#fff" : "#000",
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {isCreatingClinic ? 'Create Your Clinic' : 'Clinic Information'}
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              {isCreatingClinic
                ? 'Set up your clinic profile to get started'
                : "Manage your clinic's details and contact information"}
            </Typography>
          </Box>
        </Box>

        {!isCreatingClinic && (
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={!hasChanges || loading}
              sx={{ borderRadius: 2 }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              size="large"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                background: theme.palette.primary.main,
                boxShadow: theme.palette.mode === "dark"
                  ? "0 8px 25px rgba(102, 126, 234, 0.5)"
                  : "0 8px 25px rgba(102, 126, 234, 0.3)",
                '&:hover': {
                  background: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === "dark"
                    ? "0 12px 35px rgba(102, 126, 234, 0.7)"
                    : "0 12px 35px rgba(102, 126, 234, 0.4)",
                },
                transition: 'all 0.3s ease',
              }}
              disabled={!hasChanges || loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Success/Error Message */}
      <Fade in={!!saveMessage}>
        <Box mb={3} mt={3}>
          <Alert severity={saveMessage.includes('success') ? 'success' : 'error'}>
            {saveMessage}
          </Alert>
        </Box>
      </Fade>

      {/* Form Content */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mt: 3 }}>
        {isCreatingClinic ? (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      background: theme.palette.primary.main,
                      ml: 1,
                    }}
                    startIcon={<AddIcon />}
                  >
                    {loading ? 'Creating Clinic...' : 'Create Clinic'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      background: theme.palette.primary.main,
                      ml: 1,
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </>
        ) : (
          renderAllSections()
        )}
      </Paper>
    </Box>
  );
};