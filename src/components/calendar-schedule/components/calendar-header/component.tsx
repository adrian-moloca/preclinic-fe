import React from 'react';
import {
  Paper, Typography, Box, FormControl, 
  InputLabel, Select, MenuItem, Chip, Button
} from '@mui/material';
import {
  Person as PersonIcon,
  Warning as ConflictIcon,
} from '@mui/icons-material';
import { APPOINTMENT_TYPE_COLORS, DEPARTMENT_COLORS, DOCTOR_COLORS } from '../types/types';

interface CalendarHeaderProps {
  colorBy: 'type' | 'doctor' | 'department';
  setColorBy: (colorBy: 'type' | 'doctor' | 'department') => void;
  showConflicts: boolean;
  setShowConflicts: (show: boolean) => void;
  showMiniCalendar: boolean;
  setShowMiniCalendar: (show: boolean) => void;
  resources: Array<{ id: string; title: string; department?: string }>;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  colorBy,
  setColorBy,
  showConflicts,
  setShowConflicts,
  showMiniCalendar,
  setShowMiniCalendar,
  resources
}) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={600}>
          Medical Schedule Calendar
        </Typography>
        
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Color appointments by</InputLabel>
            <Select
              value={colorBy}
              label="Color appointments by"
              onChange={(e) => setColorBy(e.target.value as 'type' | 'doctor' | 'department')}
            >
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="department">Department</MenuItem>
              <MenuItem value="type">Appointment Type</MenuItem>
            </Select>
          </FormControl>

          <Button
            size="small"
            variant={showConflicts ? 'contained' : 'outlined'}
            color={showConflicts ? 'error' : 'inherit'}
            onClick={() => setShowConflicts(!showConflicts)}
            startIcon={<ConflictIcon />}
          >
            Show Conflicts
          </Button>

          <Button
            size="small"
            variant={showMiniCalendar ? 'contained' : 'outlined'}
            onClick={() => setShowMiniCalendar(!showMiniCalendar)}
            startIcon={<PersonIcon />}
          >
            Quick Navigation
          </Button>
        </Box>
      </Box>

      <Box mt={2} display="flex" flexWrap="wrap" gap={1} alignItems="center">
        <Typography variant="subtitle2" sx={{ mr: 2, fontWeight: 600 }}>
          Color Legend ({colorBy === 'doctor' ? 'by Doctor' : colorBy === 'department' ? 'by Department' : 'by Type'}):
        </Typography>
        
        {colorBy === 'doctor' && resources.filter(r => r.id !== 'unassigned').map((doctor, index) => (
          <Chip
            key={doctor.id}
            label={doctor.title}
            size="small"
            sx={{ 
              bgcolor: DOCTOR_COLORS[index % DOCTOR_COLORS.length], 
              color: 'white', 
              fontSize: '0.75rem',
              fontWeight: 500
            }}
          />
        ))}
        
        {colorBy === 'department' && Object.entries(DEPARTMENT_COLORS).map(([dept, color]) => (
          <Chip
            key={dept}
            label={dept.charAt(0).toUpperCase() + dept.slice(1)}
            size="small"
            sx={{ bgcolor: color, color: 'white', fontSize: '0.75rem', fontWeight: 500 }}
          />
        ))}
        
        {colorBy === 'type' && Object.entries(APPOINTMENT_TYPE_COLORS).map(([type, color]) => (
          <Chip
            key={type}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            size="small"
            sx={{ bgcolor: color, color: 'white', fontSize: '0.75rem', fontWeight: 500 }}
          />
        ))}
      </Box>
    </Paper>
  );
};