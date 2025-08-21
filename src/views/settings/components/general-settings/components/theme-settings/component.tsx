import React, { FC } from 'react';
import {
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Divider,
  Alert,
  Button,
  useTheme,
} from '@mui/material';
import {
  Palette,
  Brightness4,
  Brightness7,
  HighQuality,
  RestoreRounded,
} from '@mui/icons-material';
import { ThemeColor, ThemeMode, useThemeContext } from '../../../../../../providers/theme';
import { CustomPaper } from '../clinic-information/style';

interface ThemeSettingsProps {
  onChange?: () => void;
}

export const ThemeSettings: FC<ThemeSettingsProps> = ({ onChange }) => {
  const theme = useTheme();
  const { themeSettings, setThemeMode, setThemeColor, resetTheme } = useThemeContext();

  const handleModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    onChange?.();
  };

  const handleColorChange = (color: ThemeColor) => {
    setThemeColor(color);
    onChange?.();
  };

  const handleReset = () => {
    resetTheme();
    onChange?.();
  };

  const modeOptions = [
    { value: 'light' as ThemeMode, label: 'Light Mode', icon: <Brightness7 fontSize="small" /> },
    { value: 'dark' as ThemeMode, label: 'Dark Mode', icon: <Brightness4 fontSize="small" /> },
    { value: 'high-contrast' as ThemeMode, label: 'High Contrast', icon: <HighQuality fontSize="small" /> },
  ];

  const colorOptions = [
    { value: 'blue' as ThemeColor, label: 'Medical Blue', color: '#2C2C9E' },
    { value: 'green' as ThemeColor, label: 'Healthcare Green', color: '#2E7D32' },
    { value: 'purple' as ThemeColor, label: 'Clinical Purple', color: '#7B1FA2' },
  ];

  const getCardStyles = (active: boolean) => ({
    p: { xs: 1.5, md: 2 },
    bgcolor: active
      ? theme.palette.mode === 'dark'
        ? theme.palette.primary.dark
        : theme.palette.primary.light
      : theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : 'grey.50',
    borderRadius: 2,
    border: active
      ? `2px solid ${theme.palette.primary.main}`
      : `1px solid ${theme.palette.divider}`,
    boxShadow: active
      ? theme.palette.mode === 'dark'
        ? '0 4px 16px rgba(102,126,234,0.25)'
        : '0 4px 16px rgba(102,126,234,0.10)'
      : 'none',
    transition: 'background 0.3s, box-shadow 0.3s, border 0.3s',
    color: theme.palette.text.primary,
    minWidth: { xs: '100%', md: 220 },
    mb: { xs: 2, md: 0 },
  });

  return (
    <CustomPaper elevation={0} sx={{
      bgcolor: theme.palette.mode === 'dark'
        ? theme.palette.background.default
        : 'background.paper',
      color: theme.palette.text.primary,
      transition: 'background 0.3s, color 0.3s',
      width: "1170px",
      mx: 'auto',
    }}>
      <Box width="100%">
        <Box display="flex" alignItems="center" mb={3}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              p: 1.5,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Palette sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Theme & Appearance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize the visual appearance of your clinic interface
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(102, 126, 234, 0.18)'
              : 'rgba(102, 126, 234, 0.1)',
            borderRadius: 2,
            p: 2,
            mb: 3,
            border: theme.palette.mode === 'dark'
              ? '1px solid rgba(102, 126, 234, 0.35)'
              : '1px solid rgba(102, 126, 234, 0.2)',
            color: theme.palette.text.primary,
            transition: 'background 0.3s, border 0.3s',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Current Theme
          </Typography>
          <Box display="flex" gap={1.5} alignItems="center">
            <Chip
              icon={modeOptions.find(m => m.value === themeSettings.mode)?.icon}
              label={modeOptions.find(m => m.value === themeSettings.mode)?.label}
              size="small"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-icon': { color: 'white' },
              }}
            />
            <Chip
              icon={
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: colorOptions.find(c => c.value === themeSettings.colorScheme)?.color,
                  }}
                />
              }
              label={colorOptions.find(c => c.value === themeSettings.colorScheme)?.label}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid>
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                width: { xs: '100%', md: 300 },
              }}
            >
              <InputLabel>Display Mode</InputLabel>
              <Select
                value={themeSettings.mode}
                label="Display Mode"
                onChange={(e) => handleModeChange(e.target.value as ThemeMode)}
              >
                {modeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {option.icon}
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <FormControl
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                width: { xs: '100%', md: 300 },
              }}
            >
              <InputLabel>Color Scheme</InputLabel>
              <Select
                value={themeSettings.colorScheme}
                label="Color Scheme"
                onChange={(e) => handleColorChange(e.target.value as ThemeColor)}
              >
                {colorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: option.color,
                          border: '2px solid white',
                          boxShadow: 1,
                        }}
                      />
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Mode Descriptions
          </Typography>
          <Grid container spacing={2}>
            <Grid>
              <Box sx={getCardStyles(themeSettings.mode === 'light')}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Brightness7 fontSize="small" color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Light Mode
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Standard bright theme with excellent readability
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={getCardStyles(themeSettings.mode === 'dark')}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Brightness4 fontSize="small" color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Dark Mode
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Reduces eye strain in low-light environments
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={getCardStyles(themeSettings.mode === 'high-contrast')}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <HighQuality fontSize="small" color="primary" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    High Contrast
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Enhanced accessibility with improved contrast
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
            mb: 2,
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(102,126,234,0.18)'
              : undefined,
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': {
              fontSize: '1.2rem',
            },
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            <strong>Accessibility Features:</strong> High Contrast mode improves visibility for users with visual impairments.
            Dark mode helps reduce eye strain during extended use.
          </Typography>
        </Alert>

        <Box display="flex" justifyContent="flex-end">
          <Button
            startIcon={<RestoreRounded />}
            onClick={handleReset}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Reset to Default
          </Button>
        </Box>
      </Box>
    </CustomPaper>
  )
}