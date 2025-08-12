import React from 'react';
import { Box, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { IDoctor } from '../../../../providers/doctor/types';

interface AppointmentSettingsSectionProps {
  formData: Omit<IDoctor, 'id'>;
  handleInputChange: (field: Extract<keyof Omit<IDoctor, 'id'>, string>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => void;
}

export const AppointmentSettingsSection: React.FC<AppointmentSettingsSectionProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <AccessTime sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Appointment Settings
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <FormControl fullWidth sx={{ width: 300 }}>
              <InputLabel>Appointment Type</InputLabel>
              <Select
                value={formData.appointmentType}
                onChange={handleInputChange('appointmentType')}
                label="Appointment Type"
              >
                <MenuItem value="online">Online Only</MenuItem>
                <MenuItem value="in-person">In-Person Only</MenuItem>
                <MenuItem value="both">Both Online & In-Person</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Appointment Duration (minutes)"
              type="number"
              value={formData.appointmentDuration}
              onChange={handleInputChange('appointmentDuration')}
              inputProps={{ min: 15, step: 15 }}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Consultation Charge"
              type="number"
              value={formData.consultationCharge}
              onChange={handleInputChange('consultationCharge')}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 10 }}
              sx={{ width: 300 }}

            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};