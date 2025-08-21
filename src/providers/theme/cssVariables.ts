import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

export const useThemeCSSVariables = () => {
  const theme = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--background-default', theme.palette.background.default);
    root.style.setProperty('--background-paper', theme.palette.background.paper);
    root.style.setProperty('--text-primary', theme.palette.text.primary);
    root.style.setProperty('--text-secondary', theme.palette.text.secondary);
    root.style.setProperty('--primary-main', theme.palette.primary.main);
    root.style.setProperty('--primary-light', theme.palette.primary.light);
    root.style.setProperty('--primary-dark', theme.palette.primary.dark);
    root.style.setProperty('--divider', theme.palette.divider);
    root.style.setProperty('--action-hover', theme.palette.action.hover);
    root.style.setProperty('--action-selected', theme.palette.action.selected);
    
  }, [theme]);
};