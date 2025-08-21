import { createTheme, Theme } from '@mui/material/styles';
import { ThemeMode, ThemeColor } from './types';

// Color palettes for different medical themes
const colorPalettes = {
  blue: {
    primary: '#2C2C9E',
    secondary: '#3F51B5',
    accent: '#1976D2',
  },
  green: {
    primary: '#2E7D32',
    secondary: '#388E3C',
    accent: '#4CAF50',
  },
  purple: {
    primary: '#7B1FA2',
    secondary: '#8E24AA',
    accent: '#9C27B0',
  },
};

// Base theme configuration
const getBaseTheme = (mode: ThemeMode, colorScheme: ThemeColor): Theme => {
  const colors = colorPalettes[colorScheme];
  const isHighContrast = mode === 'high-contrast';
  const isDark = mode === 'dark' || mode === 'high-contrast';

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: colors.primary,
        light: isDark ? '#64B5F6' : colors.accent,
        dark: isDark ? '#1565C0' : '#1A237E',
        contrastText: '#ffffff',
      },
      secondary: {
        main: colors.secondary,
        light: isDark ? '#81C784' : colors.accent,
        dark: isDark ? '#2E7D32' : colors.primary,
      },
      background: {
        default: isHighContrast 
          ? '#000000' 
          : isDark 
            ? '#121212' 
            : '#f5f5f5',
        paper: isHighContrast 
          ? '#1a1a1a' 
          : isDark 
            ? '#1e1e1e' 
            : '#ffffff',
      },
      text: {
        primary: isHighContrast 
          ? '#ffffff' 
          : isDark 
            ? '#ffffff' 
            : '#2c2c2c',
        secondary: isHighContrast 
          ? '#e0e0e0' 
          : isDark 
            ? '#b0b0b0' 
            : '#666666',
      },
      divider: isHighContrast 
        ? '#ffffff' 
        : isDark 
          ? '#424242' 
          : '#e0e0e0',
      error: {
        main: isHighContrast ? '#ff6b6b' : '#f44336',
      },
      warning: {
        main: isHighContrast ? '#ffd93d' : '#ff9800',
      },
      success: {
        main: isHighContrast ? '#51cf66' : '#4caf50',
      },
      info: {
        main: isHighContrast ? '#74c0fc' : '#2196f3',
      },
      // Custom palette extensions for better dark mode support
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        disabled: isDark ? 'rgba(255, 255, 255, 0.26)' : 'rgba(0, 0, 0, 0.26)',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: isHighContrast ? 700 : 600,
        color: isDark ? '#ffffff' : '#2c2c2c',
      },
      h2: {
        fontWeight: isHighContrast ? 700 : 600,
        color: isDark ? '#ffffff' : '#2c2c2c',
      },
      h3: {
        fontWeight: isHighContrast ? 700 : 600,
        color: isDark ? '#ffffff' : '#2c2c2c',
      },
      h4: {
        fontWeight: isHighContrast ? 700 : 600,
        color: isDark ? '#ffffff' : '#2c2c2c',
      },
      h5: {
        fontWeight: isHighContrast ? 700 : 600,
        color: isDark ? '#ffffff' : '#2c2c2c',
      },
      h6: {
        fontWeight: isHighContrast ? 700 : 600,
        color: isDark ? '#ffffff' : '#2c2c2c',
      },
      body1: {
        fontSize: isHighContrast ? '1.125rem' : '1rem',
        fontWeight: isHighContrast ? 500 : 400,
        color: isDark ? '#ffffff' : '#2c2c2c',
      },
      body2: {
        fontSize: isHighContrast ? '1rem' : '0.875rem',
        fontWeight: isHighContrast ? 500 : 400,
        color: isDark ? '#b0b0b0' : '#666666',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isHighContrast 
              ? '#000000' 
              : isDark 
                ? '#121212' 
                : '#f5f5f5',
            color: isDark ? '#ffffff' : '#2c2c2c',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: isHighContrast ? 600 : 500,
            border: isHighContrast ? '2px solid' : 'none',
          },
          contained: {
            boxShadow: isHighContrast ? 'none' : isDark ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: isHighContrast ? 'none' : isDark ? '0 4px 8px rgba(0,0,0,0.7)' : '0 4px 8px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: isHighContrast ? '2px solid #ffffff' : 'none',
            backgroundColor: isHighContrast 
              ? '#1a1a1a' 
              : isDark 
                ? '#1e1e1e' 
                : '#ffffff',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: isHighContrast ? '2px solid #ffffff' : 'none',
            backgroundColor: isHighContrast 
              ? '#1a1a1a' 
              : isDark 
                ? '#1e1e1e' 
                : '#ffffff',
            boxShadow: isHighContrast 
              ? 'none' 
              : isDark 
                ? '0 4px 8px rgba(0,0,0,0.3)' 
                : '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
              '& fieldset': {
                borderWidth: isHighContrast ? '2px' : '1px',
                borderColor: isHighContrast ? '#ffffff' : isDark ? '#555' : '#e0e0e0',
              },
              '& input': {
                color: isDark ? '#ffffff' : '#2c2c2c',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDark ? '#b0b0b0' : '#666666',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#2c2c2c',
            boxShadow: isHighContrast 
              ? 'none' 
              : isDark 
                ? '0 2px 4px rgba(0,0,0,0.5)' 
                : '0 2px 4px rgba(0,0,0,0.1)',
            borderBottom: isHighContrast ? '2px solid #ffffff' : 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#2c2c2c',
            borderRight: isDark ? '1px solid #424242' : '1px solid #e0e0e0',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: isDark ? '#ffffff' : '#2c2c2c',
          },
          secondary: {
            color: isDark ? '#b0b0b0' : '#666666',
          },
        },
      },
    },
  });
};

export const createAppTheme = (mode: ThemeMode, colorScheme: ThemeColor): Theme => {
  return getBaseTheme(mode, colorScheme);
};