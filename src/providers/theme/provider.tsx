import React, { FC, ReactNode, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeContext } from './context';
import { ThemeSettings, ThemeMode, ThemeColor, ThemeContextType } from './types';
import { useThemeCSSVariables } from './cssVariables';
import { createAppTheme } from './config';

const THEME_STORAGE_KEY = 'preclinic_theme_settings';

const defaultThemeSettings: ThemeSettings = {
  mode: 'light',
  colorScheme: 'blue',
};

interface ThemeProviderProps {
  children: ReactNode;
}

const CSSVariablesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useThemeCSSVariables();
  return <>{children}</>;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setThemeSettings(parsed);
      } catch (error) {
        console.warn('Failed to parse theme settings from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeSettings));
  }, [themeSettings]);

  const toggleThemeMode = () => {
    setThemeSettings(prev => ({
      ...prev,
      mode: prev.mode === 'light' 
        ? 'dark' 
        : prev.mode === 'dark' 
          ? 'high-contrast' 
          : 'light'
    }));
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeSettings(prev => ({
      ...prev,
      mode,
    }));
  };

  const setThemeColor = (colorScheme: ThemeColor) => {
    setThemeSettings(prev => ({
      ...prev,
      colorScheme,
    }));
  };

  const resetTheme = () => {
    setThemeSettings(defaultThemeSettings);
    localStorage.removeItem(THEME_STORAGE_KEY);
  };

  const theme = useMemo(() => 
    createAppTheme(themeSettings.mode, themeSettings.colorScheme),
    [themeSettings.mode, themeSettings.colorScheme]
  );

  const contextValue: ThemeContextType = {
    themeSettings,
    toggleThemeMode,
    setThemeMode,
    setThemeColor,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <CSSVariablesProvider> 
          {children}
        </CSSVariablesProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};