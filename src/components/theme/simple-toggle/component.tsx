import React, { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7, HighQuality } from '@mui/icons-material';
import { useThemeContext } from '../../../providers/theme';

export const SimpleThemeToggle: FC = () => {
  const { themeSettings, toggleThemeMode } = useThemeContext();

  const getIcon = () => {
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

  const getTooltip = () => {
    switch (themeSettings.mode) {
      case 'light':
        return 'Switch to Dark Mode';
      case 'dark':
        return 'Switch to High Contrast Mode';
      case 'high-contrast':
        return 'Switch to Light Mode';
      default:
        return 'Toggle Theme';
    }
  };

  return (
    <Tooltip title={getTooltip()}>
      <IconButton
        onClick={toggleThemeMode}
        color="inherit"
        sx={{
          color: 'text.primary',
        }}
      >
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
};