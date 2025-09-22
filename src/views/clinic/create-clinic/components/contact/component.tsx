import { FC } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import { City, Country, State } from 'country-state-city';

interface ContactStepProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  errors: any;
}

export const ContactStep: FC<ContactStepProps> = ({ formData, onChange, errors }) => {
  const countries = Country.getAllCountries();
  
  const getLocationValue = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.name) return value.name;
    if (typeof value === 'object' && value.label) return value.label;
    if (typeof value === 'object' && value.value) return value.value;
    return '';
  };
  
  const countryValue = getLocationValue(formData.country);
  const stateValue = getLocationValue(formData.state);
  const cityValue = getLocationValue(formData.city);
  
  const selectedCountry = countries.find((c) => c.name === countryValue);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  
  const selectedState = states.find((s) => s.name === stateValue);
  const cities = selectedState && selectedCountry
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];
    
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required error={!!errors.country}>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              value={countryValue}
              label="Country"
              onChange={(e) => {
                onChange('country', e.target.value);
                onChange('state', '');
                onChange('city', '');
              }}
            >
              {countries.map((c) => (
                <MenuItem key={c.isoCode} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            {errors.country && (
              <FormHelperText error>{errors.country}</FormHelperText>
            )}
          </FormControl>
          
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required error={!!errors.state}>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              value={stateValue}
              label="State"
              onChange={(e) => {
                onChange('state', e.target.value);
                onChange('city', '');
              }}
              disabled={!countryValue}
            >
              {states.map((s) => (
                <MenuItem key={s.isoCode} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
            {errors.state && (
              <FormHelperText error>{errors.state}</FormHelperText>
            )}
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required error={!!errors.city}>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              value={cityValue}
              label="City"
              onChange={(e) => {
                onChange('city', e.target.value);
              }}
              disabled={!stateValue}
            >
              {cities.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            {errors.city && (
              <FormHelperText error>{errors.city}</FormHelperText>
            )}
          </FormControl>
          
          <TextField
            label="ZIP Code"
            placeholder="ZIP"
            value={formData.zipCode || ''}
            onChange={(e) => onChange('zipCode', e.target.value)}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
            required
            sx={{ width: 500, marginY: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <TextField
            fullWidth
            label="Address"
            placeholder="Street address"
            value={formData.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
        </Box>
      </Box>
    </Paper>
  );
};