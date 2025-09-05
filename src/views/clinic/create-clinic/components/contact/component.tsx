import { FC } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

interface ContactStepProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  errors: any;
}

export const ContactStep: FC<ContactStepProps> = ({ formData, onChange, errors }) => {
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
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="City"
            placeholder="City"
            value={formData.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            error={!!errors.city}
            helperText={errors.city}
            required
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="State/County"
            placeholder="State"
            value={formData.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            error={!!errors.state}
            helperText={errors.state}
            required
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="ZIP Code"
            placeholder="ZIP"
            value={formData.zipCode || ''}
            onChange={(e) => onChange('zipCode', e.target.value)}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
            required
          />
        </Grid>
      </Grid>
    </Paper>
  );
};