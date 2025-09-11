import {
  Box,
  Typography,
  Button,
  Alert,
  Fade,
  useTheme,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { FC, useState, useEffect } from "react";
import { BusinessHours } from "./components/business-hours/component";
import { Preferences } from "./components/preferences/component";
import NotificationGeneralSettings from "./components/notifications-settings";
import ThemeSettings from "./components/theme-settings";
import { useClinicContext } from "../../../../providers/clinic/context";

export const GeneralSettings: FC = () => {
  const theme = useTheme();
  const { selectedClinic, updateClinic, loading } = useClinicContext();
  
  const [settings, setSettings] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Initialize settings from selected clinic (only business hours and preferences, not clinic info)
  useEffect(() => {
    if (selectedClinic) {
      setSettings({
        // Business Hours
        ...Object.entries(selectedClinic.businessHours || {}).reduce((acc, [day, hours]) => {
          acc[`${day}Open`] = hours.open;
          acc[`${day}Close`] = hours.close;
          return acc;
        }, {} as any),
        
        // Settings
        // timeZone: selectedClinic.settings?.timeZone || "Europe/Bucharest",
        // dateFormat: selectedClinic.settings?.dateFormat || "DD/MM/YYYY",
        // timeFormat: selectedClinic.settings?.timeFormat || "24h",
        // currency: selectedClinic.settings?.currency || "RON",
        // language: selectedClinic.settings?.language || "Romanian",
        // theme: selectedClinic.settings?.theme || "light",
        // emailNotifications: selectedClinic.settings?.emailNotifications ?? true,
        // smsNotifications: selectedClinic.settings?.smsNotifications ?? true,
        // appointmentReminders: selectedClinic.settings?.appointmentReminders ?? true,
        // marketingEmails: selectedClinic.settings?.marketingEmails ?? false,
        // systemAlerts: selectedClinic.settings?.systemAlerts ?? true,
      });
    }
  }, [selectedClinic]);

  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedClinic) return;

    try {
      // Convert settings back to clinic format
      const businessHours = {
        monday: { open: settings.mondayOpen, close: settings.mondayClose, isClosed: false },
        tuesday: { open: settings.tuesdayOpen, close: settings.tuesdayClose, isClosed: false },
        wednesday: { open: settings.wednesdayOpen, close: settings.wednesdayClose, isClosed: false },
        thursday: { open: settings.thursdayOpen, close: settings.thursdayClose, isClosed: false },
        friday: { open: settings.fridayOpen, close: settings.fridayClose, isClosed: false },
        saturday: { open: settings.saturdayOpen, close: settings.saturdayClose, isClosed: false },
        sunday: { open: settings.sundayOpen, close: settings.sundayClose, isClosed: true },
      };

      const clinicSettings = {
        timeZone: settings.timeZone,
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
        currency: settings.currency,
        language: settings.language,
        theme: settings.theme,
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        appointmentReminders: settings.appointmentReminders,
        marketingEmails: settings.marketingEmails,
        systemAlerts: settings.systemAlerts,
      };

      // Only update business hours and settings, not clinic info
      const updatedClinicData = {
        businessHours,
        settings: clinicSettings,
      };

      await updateClinic(selectedClinic.id, updatedClinicData);
      
      setHasChanges(false);
      setSaveMessage("Settings saved successfully!");
      
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to save settings. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
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
        mb={4}
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
            Configure {selectedClinic.name}'s operational settings and preferences
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
          disabled={!hasChanges || loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {/* Success/Error Message */}
      <Fade in={!!saveMessage}>
        <Box mb={3}>
          <Alert severity={saveMessage.includes('success') ? 'success' : 'error'}>
            {saveMessage}
          </Alert>
        </Box>
      </Fade>

      {/* Settings Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <BusinessHours
          settings={settings}
          onChange={handleChange}
        />

        <Preferences
          settings={settings}
          onChange={handleChange}
        />

        <NotificationGeneralSettings
          settings={settings}
          onChange={handleChange}
        />

        <ThemeSettings
          settings={settings}
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
};