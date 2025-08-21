import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  Fade,
  useTheme,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { FC, useState } from "react";
import { ClinicInformation } from "./components/clinic-information/component";
import { BusinessHours } from "./components/business-hours/component";
import { Preferences } from "./components/preferences/component";
import NotificationGeneralSettings from "./components/notifications-settings";
import ThemeSettings from "./components/theme-settings";

interface ClinicSettings {
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
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  theme: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
}

export const GeneralSettings: FC = () => {
  const theme = useTheme();
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
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: keyof ClinicSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleThemeChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    setAlert({ type: 'success', message: 'Settings saved successfully! 🎉' });
    setHasChanges(false);
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: '100vh',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: theme.palette.background.default,
        transition: "background-color 0.3s",
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        width={{ xs: "100%", md: "1170px" }}
        mb={2}
        sx={{
          background: theme.palette.mode === "dark"
            ? "rgba(30, 32, 36, 0.98)"
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: 'blur(10px)',
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          boxShadow: theme.palette.mode === "dark"
            ? "0 8px 32px rgba(0,0,0,0.5)"
            : "0 8px 32px rgba(0,0,0,0.1)",
          color: theme.palette.text.primary,
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
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
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </Box>

      <Fade in={!!alert} timeout={500}>
        <Box mb={3} width={{ xs: "100%", md: "1170px" }}>
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

      <Grid
        container
        spacing={4}
        sx={{
          display: "flex",
          justifyContent: "center",
          width: { xs: "100%", md: "1170px" },
        }}
      >
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
        <Grid>
          <ThemeSettings onChange={handleThemeChange} />
        </Grid>
      </Grid>
    </Box>
  );
};