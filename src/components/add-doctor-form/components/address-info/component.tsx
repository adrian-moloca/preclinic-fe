import React from 'react';
import { Box, Card, CardContent, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { Country, State, City } from 'country-state-city';
import { IDoctor } from '../../../../providers/doctor/types';

interface AddressInfoSectionProps {
  formData: Omit<IDoctor, 'id'>;
  handleInputChange: (field: Extract<keyof Omit<IDoctor, 'id'>, string>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<Omit<IDoctor, 'id'>>>;
  errors?: Record<string, string>; 
}

export const AddressInfoSection: React.FC<AddressInfoSectionProps> = ({
  formData,
  handleInputChange,
  setFormData,
  errors = {} 
}) => {
  const countries = Country.getAllCountries();
  
  const selectedCountry = countries.find((c) => c.name === formData.country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  
  const selectedState = states.find((s) => s.name === formData.state);
  const cities = selectedState && selectedCountry
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];

  const handleCountryChange = (countryName: string) => {
    setFormData(prev => ({
      ...prev,
      country: countryName,
      state: '', 
      city: ''  
    }));
  };

  const handleStateChange = (stateName: string) => {
    setFormData(prev => ({
      ...prev,
      state: stateName,
      city: '' 
    }));
  };

  const handleCityChange = (cityName: string) => {
    setFormData(prev => ({
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
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                value={formData.country}
                label="Country"
                onChange={(e) => handleCountryChange(e.target.value)}
                error={!!errors.country}
              >
                {countries.map((country) => (
                  <MenuItem key={country.isoCode} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.country && (
                <FormHelperText error>
                  {errors.country}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid>
            <FormControl sx={{ width: 300 }} disabled={!formData.country} required error={!!errors.state}>
              <InputLabel id="state-label">State/Province</InputLabel>
              <Select
                labelId="state-label"
                value={formData.state}
                label="State/Province"
                onChange={(e) => handleStateChange(e.target.value)}
                error={!!errors.state}
              >
                {states.map((state) => (
                  <MenuItem key={state.isoCode} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.state && (
                <FormHelperText error>
                  {errors.state}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid>
            <FormControl sx={{ width: 300 }} disabled={!formData.state} required error={!!errors.city}>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                value={formData.city}
                label="City"
                onChange={(e) => handleCityChange(e.target.value)}
                error={!!errors.city}
              >
                {cities.map((city) => (
                  <MenuItem key={city.name} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <FormHelperText error>
                  {errors.city}
                </FormHelperText>
              )}
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
              rows={2}
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