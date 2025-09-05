import { FC } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Paper } from "@mui/material";
import { 
  Settings as SettingsIcon, 
  Security, 
  People,
  Business as BusinessIcon,
} from "@mui/icons-material";
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
    {
      title: "Clinic Information",
      description: "Update clinic details and contact information",
      icon: <BusinessIcon />,
      path: "/settings/clinic-information",
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
              borderRadius: 2,
              transition: 'all 0.2s ease',
            }}
            onClick={() => navigate(option.path)}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              {option.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="h6" fontWeight={600}>
                  {option.title}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};