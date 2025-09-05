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
} from "@mui/material";
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
} from "@mui/icons-material";
import { FC, useState, useEffect } from "react";
import { useClinicContext } from "../../../../providers/clinic/context";
import ProfileImageUploader from "../../../../components/profile-image";

export const ClinicInformationSettings: FC = () => {
  const theme = useTheme();
  const { selectedClinic, updateClinic, loading } = useClinicContext();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
  });
  
  const [errors, setErrors] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Initialize form data from selected clinic
  useEffect(() => {
    if (selectedClinic) {
      setFormData({
        name: selectedClinic.name || '',
        description: selectedClinic.description || '',
        logo: selectedClinic.logo || '',
        address: selectedClinic.address || '',
        city: selectedClinic.city || '',
        state: selectedClinic.state || '',
        zipCode: selectedClinic.zipCode || '',
        phone: selectedClinic.phone || '',
        email: selectedClinic.email || '',
        website: selectedClinic.website || '',
      });
      setHasChanges(false);
    }
  }, [selectedClinic]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
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

  const handleSave = async () => {
    if (!selectedClinic || !validateForm()) {
      return;
    }

    try {
      setSaveMessage('');
      await updateClinic(selectedClinic.id, formData);
      
      setHasChanges(false);
      setSaveMessage("Clinic information updated successfully!");
      
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to update clinic information. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleReset = () => {
    if (selectedClinic) {
      setFormData({
        name: selectedClinic.name || '',
        description: selectedClinic.description || '',
        logo: selectedClinic.logo || '',
        address: selectedClinic.address || '',
        city: selectedClinic.city || '',
        state: selectedClinic.state || '',
        zipCode: selectedClinic.zipCode || '',
        phone: selectedClinic.phone || '',
        email: selectedClinic.email || '',
        website: selectedClinic.website || '',
      });
      setHasChanges(false);
      setErrors({});
    }
  };

  if (!selectedClinic) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          No clinic selected. Please create or select a clinic first.
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
              Clinic Information
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              Manage your clinic's details and contact information
            </Typography>
          </Box>
        </Box>
        
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
      </Box>

      {/* Success/Error Message */}
      <Fade in={!!saveMessage}>
        <Box mb={3}>
          <Alert severity={saveMessage.includes('success') ? 'success' : 'error'}>
            {saveMessage}
          </Alert>
        </Box>
      </Fade>

      {/* Form Content */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        {/* Logo Section */}
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
                rows={3}
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
        <Box>
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
      </Paper>
    </Box>
  );
};