import { FC } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import { Country, State, City } from 'country-state-city';

interface ContactStepProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  errors: any;
}

export const ContactStep: FC<ContactStepProps> = ({ formData, onChange, errors }) => {
  // Get country, state, city options
  const countries = Country.getAllCountries();
  const selectedCountry = countries.find((c) => c.name === formData.country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const selectedState = states.find((s) => s.name === formData.state);
  const cities = selectedState && selectedCountry
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];

  const handleCountryChange = (value: string) => {
    onChange('country', value);
    // Reset state and city when country changes
    onChange('state', '');
    onChange('city', '');
  };

  const handleStateChange = (value: string) => {
    onChange('state', value);
    // Reset city when state changes
    onChange('city', '');
  };

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <LocationIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Location & Contact
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Where is your clinic located?
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid>
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select
              value={formData.country || ''}
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
          <FormControl fullWidth disabled={!formData.country}>
            <InputLabel>State/Province</InputLabel>
            <Select
              value={formData.state || ''}
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
          </FormControl>
        </Grid>

        <Grid>
          <FormControl fullWidth disabled={!formData.state}>
            <InputLabel>City</InputLabel>
            <Select
              value={formData.city || ''}
              label="City"
              onChange={(e) => onChange('city', e.target.value)}
              error={!!errors.city}
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
            label="ZIP/Postal Code"
            placeholder="ZIP Code"
            value={formData.zipCode || ''}
            onChange={(e) => onChange('zipCode', e.target.value)}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
            required
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Street Address"
            placeholder="Enter your street address"
            value={formData.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
        </Grid>
      </Grid>
    </Paper>
  );
};