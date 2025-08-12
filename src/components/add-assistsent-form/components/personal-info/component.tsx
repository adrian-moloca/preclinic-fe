import React from 'react';
import { Box, Card, CardContent, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';
import { IAssistent } from '../../../../providers/assistent/types';

interface PersonalInfoSectionProps {
  formData: Omit<IAssistent, 'id'>;
  errors: Record<string, string>;
  handleInputChange: any;
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
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};