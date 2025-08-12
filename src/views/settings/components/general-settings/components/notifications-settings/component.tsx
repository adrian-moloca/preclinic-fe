import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Card,
  Grid,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { FC } from "react";
import { CustomPaper } from "../clinic-information/style";

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
  systemAlerts: boolean;
}

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onChange: (field: keyof NotificationSettings, value: boolean) => void;
}

export const NotificationGeneralSettings: FC<NotificationSettingsProps> = ({
  settings,
  onChange,
}) => {
  const notificationItems = [
    {
      key: 'emailNotifications' as keyof NotificationSettings,
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      color: '#1976d2',
    },
    {
      key: 'smsNotifications' as keyof NotificationSettings,
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
      color: '#1976d2',
    },
    {
      key: 'appointmentReminders' as keyof NotificationSettings,
      label: 'Appointment Reminders',
      description: 'Automatic reminders for appointments',
      color: '#1976d2',
    },
    {
      key: 'marketingEmails' as keyof NotificationSettings,
      label: 'Marketing Emails',
      description: 'Promotional and marketing content',
      color: '#1976d2',
    },
    {
      key: 'systemAlerts' as keyof NotificationSettings,
      label: 'System Alerts',
      description: 'Important system notifications',
      color: '#1976d2',
    },
  ];

  return (
    <CustomPaper elevation={0}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <NotificationsIcon />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            Notification Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage how you receive notifications
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
        {notificationItems.map((item) => (
          <Grid key={item.key}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                width: 300,
                height: 100,
                border: '2px solid',
                borderColor: settings[item.key] ? item.color : 'divider',
                background: settings[item.key]
                  ? `linear-gradient(145deg, ${item.color}10 0%, ${item.color}05 100%)`
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ color: settings[item.key] ? item.color : 'text.primary' }}
                    gutterBottom
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings[item.key]}
                      onChange={(e) => onChange(item.key, e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: item.color,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: item.color,
                        },
                      }}
                    />
                  }
                  label=""
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </CustomPaper>
  );
};