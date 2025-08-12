import React from 'react';
import { Box, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';
import { IDoctor } from '../../../../providers/doctor/types';

interface PersonalInfoSectionProps {
  formData: Omit<IDoctor, 'id'>;
  errors: Record<string, string>;
  handleInputChange: (field: Extract<keyof Omit<IDoctor, 'id'>, string>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  errors,
  handleInputChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Person sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Personal Information
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              required
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange('birthDate')}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid>
            <FormControl fullWidth sx={{ width: 300 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={handleInputChange('gender')}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <FormControl fullWidth sx={{ width: 300 }}>
              <InputLabel>Blood Group</InputLabel>
              <Select
                value={formData.bloodGroup}
                onChange={handleInputChange('bloodGroup')}
                label="Blood Group"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};