import React from 'react';
import { Box, Card, CardContent, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { Country, State, City } from 'country-state-city';
import { IAssistent } from '../../../../providers/assistent/types';

interface AddressInfoSectionProps {
  formData: Omit<IAssistent, 'id'>;
  handleInputChange: any;
  setFormData: any;
  errors: Record<string, string>;
}

export const AddressInfoSection: React.FC<AddressInfoSectionProps> = ({
  formData,
  handleInputChange,
  setFormData,
  errors
}) => {
  const countries = Country.getAllCountries();
  
  const selectedCountry = countries.find((c) => c.name === formData.country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  
  const selectedState = states.find((s) => s.name === formData.state);
  const cities = selectedState && selectedCountry
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];

  const handleCountryChange = (countryName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      country: countryName,
      state: '',
      city: ''
    }));
  };

  const handleStateChange = (stateName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      state: stateName,
      city: ''
    }));
  };

  const handleCityChange = (cityName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      city: cityName
    }));
  };

  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Address Information
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <FormControl sx={{ width: 300 }} required error={!!errors.country}>
              <InputLabel>Country</InputLabel>
              <Select
                value={formData.country}
                label="Country"
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                {countries.map((country) => (
                  <MenuItem key={country.isoCode} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <FormControl sx={{ width: 300 }} disabled={!formData.country} required>
              <InputLabel>State/Province</InputLabel>
              <Select
                value={formData.state}
                label="State/Province"
                onChange={(e) => handleStateChange(e.target.value)}
              >
                {states.map((state) => (
                  <MenuItem key={state.isoCode} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <FormControl sx={{ width: 300 }} disabled={!formData.state} required>
              <InputLabel>City</InputLabel>
              <Select
                value={formData.city}
                label="City"
                onChange={(e) => handleCityChange(e.target.value)}
              >
                {cities.map((city) => (
                  <MenuItem key={city.name} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="ZIP Code"
              value={formData.zipCode}
              onChange={handleInputChange('zipCode')}
              sx={{ width: 300 }}
              required
              error={!!errors.zipCode}
              helperText={errors.zipCode}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleInputChange('address')}
              sx={{ width: 300 }}
              required
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};