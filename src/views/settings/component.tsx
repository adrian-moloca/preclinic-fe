import { FC } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Paper } from "@mui/material";
import { Settings as SettingsIcon, Security, People } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../providers/auth/context";

export const Settings: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const settingsOptions = [
    {
      title: "General Settings",
      description: "Basic application settings and preferences",
      icon: <SettingsIcon />,
      path: "/settings/general",
    },
    ...(user?.role === 'owner-doctor' ? [{
      title: "Permission Management",
      description: "Manage role permissions and individual user access",
      icon: <Security />,
      path: "/settings/permissions",
    }] : []),
    {
      title: "User Management",
      description: "Manage users and their profiles",
      icon: <People />,
      path: "/settings/users",
    },
    // Keep all your existing settings options here
    // Just add them to this array and they'll appear for all users
    // Example of how to add more existing options:
    /*
    {
      title: "Clinic Information",
      description: "Update clinic details and contact information",
      icon: <BusinessIcon />,
      path: "/settings/clinic",
    },
    {
      title: "Notifications",
      description: "Configure email and push notification preferences",
      icon: <NotificationsIcon />,
      path: "/settings/notifications",
    },
    {
      title: "Backup & Security",
      description: "Data backup settings and security configurations",
      icon: <BackupIcon />,
      path: "/settings/backup",
    },
    */
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Settings
      </Typography>

      <List>
        {settingsOptions.map((option) => (
          <ListItem
            key={option.title}
            component={Paper}
            elevation={1}
            sx={{
              mb: 2,
              cursor: "pointer",
              "&:hover": { elevation: 3 },
            }}
            onClick={() => navigate(option.path)}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText
              primary={option.title}
              secondary={option.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
