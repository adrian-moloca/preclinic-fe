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
  const selectedCountry = countries.find((c) => c.name === formData.country);
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const selectedState = states.find((s) => s.name === formData.state);
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
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              value={formData.country || ''}
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
          </FormControl>
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              value={formData.state || ''}
              label="State"
              onChange={(e) => {
                onChange('state', e.target.value);
                onChange('city', '');
              }}
              disabled={!formData.country}
            >
              {states.map((s) => (
                <MenuItem key={s.isoCode} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <FormControl fullWidth sx={{ width: 500, marginY: 1 }} required>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              value={formData.city || ''}
              label="City"
              onChange={(e) => {
                onChange('city', e.target.value);
              }}
              disabled={!formData.state}
            >
              {cities.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
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