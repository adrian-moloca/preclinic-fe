import { FC } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';

interface BusinessHoursStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const days = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const timeOptions = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00'
];

export const BusinessHoursStep: FC<BusinessHoursStepProps> = ({ formData, onChange }) => {
  const businessHours = formData.businessHours || {};

  const updateDaySchedule = (day: string, field: string, value: any) => {
    const updated = {
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [field]: value
      }
    };
    onChange('businessHours', updated);
  };

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Business Hours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set your clinic's operating hours
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {days.map((day) => (
          <Grid key={day.key}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3,
                height: '100%',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Day Name */}
              <Typography 
                variant="h6" 
                fontWeight={600} 
                textAlign="center" 
                mb={2}
                color="primary.main"
              >
                {day.label}
              </Typography>
              
              {/* Open/Closed Switch */}
              <Box display="flex" justifyContent="center" mb={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!businessHours[day.key]?.isClosed}
                      onChange={(e) => updateDaySchedule(day.key, 'isClosed', !e.target.checked)}
                    />
                  }
                  label="Open"
                />
              </Box>

              {/* Time Selectors */}
              {!businessHours[day.key]?.isClosed && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Opening Time</InputLabel>
                    <Select
                      value={businessHours[day.key]?.open || '09:00'}
                      label="Opening Time"
                      onChange={(e) => updateDaySchedule(day.key, 'open', e.target.value)}
                    >
                      {timeOptions.map((time) => (
                        <MenuItem key={time} value={time}>{time}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Closing Time</InputLabel>
                    <Select
                      value={businessHours[day.key]?.close || '17:00'}
                      label="Closing Time"
                      onChange={(e) => updateDaySchedule(day.key, 'close', e.target.value)}
                    >
                      {timeOptions.map((time) => (
                        <MenuItem key={time} value={time}>{time}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Closed State */}
              {businessHours[day.key]?.isClosed && (
                <Box 
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                    fontStyle: 'italic',
                  }}
                >
                  <Typography variant="body1">Closed</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};