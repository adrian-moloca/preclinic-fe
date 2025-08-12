import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  Fade,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { FC, useState } from "react";
import { ClinicInformation } from "./components/clinic-information/component";
import { BusinessHours } from "./components/business-hours/component";
import { Preferences } from "./components/preferences/component";
import NotificationGeneralSettings from "./components/notifications-settings";

interface ClinicSettings {
  // Clinic Information
  clinicName: string;
  clinicDescription: string;
  clinicLogo: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  
  // Business Hours
  mondayOpen: string;
  mondayClose: string;
  tuesdayOpen: string;
  tuesdayClose: string;
  wednesdayOpen: string;
  wednesdayClose: string;
  thursdayOpen: string;
  thursdayClose: string;
  fridayOpen: string;
  fridayClose: string;
  saturdayOpen: string;
  saturdayClose: string;
  sundayOpen: string;
  sundayClose: string;
  
  // Preferences
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  theme: string;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
}

export const GeneralSettings: FC = () => {
  const [settings, setSettings] = useState<ClinicSettings>({
    clinicName: "Downtown Medical Clinic",
    clinicDescription: "Providing quality healthcare services to our community",
    clinicLogo: "",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "+1 (555) 123-4567",
    email: "info@downtownmedical.com",
    website: "www.downtownmedical.com",
    
    mondayOpen: "09:00",
    mondayClose: "17:00",
    tuesdayOpen: "09:00",
    tuesdayClose: "17:00",
    wednesdayOpen: "09:00",
    wednesdayClose: "17:00",
    thursdayOpen: "09:00",
    thursdayClose: "17:00",
    fridayOpen: "09:00",
    fridayClose: "17:00",
    saturdayOpen: "10:00",
    saturdayClose: "14:00",
    sundayOpen: "",
    sundayClose: "",
    
    timeZone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12-hour",
    currency: "USD",
    language: "en",
    theme: "light",
    
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    systemAlerts: true,
  });

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleInputChange = (field: keyof ClinicSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setAlert({ type: 'success', message: 'Settings saved successfully! 🎉' });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          p: 3,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: '#000',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            General Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={0.5}>
            Configure your clinic's basic settings and preferences
          </Typography>
        </Box>
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
            background: 'primary',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Save Changes
        </Button>
      </Box>

      {/* Alert */}
      <Fade in={!!alert} timeout={500}>
        <Box mb={3}>
          {alert && (
            <Alert
              severity={alert.type}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
            >
              {alert.message}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Content */}
      <Grid container spacing={4}>
        <Grid>
          <ClinicInformation
            settings={settings}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid>
          <BusinessHours
            settings={settings}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid>
          <Preferences
            settings={settings}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid>
          <NotificationGeneralSettings
            settings={settings}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};