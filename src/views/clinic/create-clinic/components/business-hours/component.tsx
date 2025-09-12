import { FC } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';

interface BusinessHoursStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const BusinessHoursStep: FC<BusinessHoursStepProps> = ({ formData, onChange }) => {
  const handleTimeChange = (day: string, field: 'open' | 'close', value: string) => {
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...formData.businessHours[day],
        [field]: value,
      },
    };
    onChange('businessHours', updatedHours);
  };

  const handleClosedToggle = (day: string) => {
    const updatedHours = {
      ...formData.businessHours,
      [day]: {
        ...formData.businessHours[day],
        isClosed: !formData.businessHours[day].isClosed,
      },
    };
    onChange('businessHours', updatedHours);
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
            When is your clinic open?
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {days.map((day) => (
          <Grid key={day}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: formData.businessHours[day].isClosed ? 'grey.100' : 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{
                  width: 120,
                  textTransform: 'capitalize',
                  fontWeight: formData.businessHours[day].isClosed ? 400 : 500,
                  color: formData.businessHours[day].isClosed ? 'text.disabled' : 'text.primary',
                }}
              >
                {day}
              </Typography>

              {!formData.businessHours[day].isClosed && (
                <Box display="flex" alignItems="center" gap={2}>
                  <TextField
                    type="time"
                    size="small"
                    value={formData.businessHours[day].open}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                    sx={{ width: 120 }}
                  />
                  <Typography>to</Typography>
                  <TextField
                    type="time"
                    size="small"
                    value={formData.businessHours[day].close}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                    sx={{ width: 120 }}
                  />
                </Box>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={!formData.businessHours[day].isClosed}
                    onChange={() => handleClosedToggle(day)}
                  />
                }
                label={formData.businessHours[day].isClosed ? 'Closed' : 'Open'}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};