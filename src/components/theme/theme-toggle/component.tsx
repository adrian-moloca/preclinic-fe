import React, { FC } from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  HighQuality,
  Palette,
  Settings,
  Check,
} from '@mui/icons-material';
import { useThemeContext } from '../../../providers/theme';
import { ThemeMode, ThemeColor } from '../../../providers/theme/types';

export const ThemeToggle: FC = () => {
  const { themeSettings, setThemeMode, setThemeColor, resetTheme } = useThemeContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    handleClose();
  };

  const handleColorChange = (color: ThemeColor) => {
    setThemeColor(color);
  };

  const getModeIcon = () => {
    switch (themeSettings.mode) {
      case 'light':
        return <Brightness7 />;
      case 'dark':
        return <Brightness4 />;
      case 'high-contrast':
        return <HighQuality />;
      default:
        return <Brightness7 />;
    }
  };

  const getModeLabel = () => {
    switch (themeSettings.mode) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'high-contrast':
        return 'High Contrast';
      default:
        return 'Light Mode';
    }
  };

  const colorOptions: { value: ThemeColor; label: string; color: string }[] = [
    { value: 'blue', label: 'Medical Blue', color: '#2C2C9E' },
    { value: 'green', label: 'Healthcare Green', color: '#2E7D32' },
    { value: 'purple', label: 'Clinical Purple', color: '#7B1FA2' },
  ];

  return (
    <>
      <Tooltip title="Theme Settings">
        <IconButton
          onClick={handleClick}
          sx={{
            color: 'text.primary',
            border: 1,
            borderColor: 'divider',
          }}
        >
          {getModeIcon()}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 280,
            maxWidth: '100%',
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings fontSize="small" />
            Theme Settings
          </Typography>
        </Box>

        <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Mode
          </Typography>
          <Chip
            icon={getModeIcon()}
            label={getModeLabel()}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider />

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Display Mode
          </Typography>
          
          <MenuItem 
            onClick={() => handleModeChange('light')}
            selected={themeSettings.mode === 'light'}
          >
            <ListItemIcon>
              <Brightness7 fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Light Mode" />
            {themeSettings.mode === 'light' && <Check fontSize="small" color="primary" />}
          </MenuItem>

          <MenuItem 
            onClick={() => handleModeChange('dark')}
            selected={themeSettings.mode === 'dark'}
          >
            <ListItemIcon>
              <Brightness4 fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
            {themeSettings.mode === 'dark' && <Check fontSize="small" color="primary" />}
          </MenuItem>

          <MenuItem 
            onClick={() => handleModeChange('high-contrast')}
            selected={themeSettings.mode === 'high-contrast'}
          >
            <ListItemIcon>
              <HighQuality fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="High Contrast" 
              secondary="For better accessibility"
            />
            {themeSettings.mode === 'high-contrast' && <Check fontSize="small" color="primary" />}
          </MenuItem>
        </Box>

        <Divider />

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Palette fontSize="small" />
            Color Scheme
          </Typography>
          
          {colorOptions.map((option) => (
            <MenuItem 
              key={option.value}
              onClick={() => handleColorChange(option.value)}
              selected={themeSettings.colorScheme === option.value}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: option.color,
                    border: 2,
                    borderColor: 'background.paper',
                    boxShadow: 1,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={option.label} />
              {themeSettings.colorScheme === option.value && <Check fontSize="small" color="primary" />}
            </MenuItem>
          ))}
        </Box>

        <Divider />

        {/* Quick Actions */}
        <Box sx={{ px: 2, py: 1 }}>
          <MenuItem onClick={resetTheme}>
            <ListItemText primary="Reset to Default" secondary="Light mode with blue theme" />
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};