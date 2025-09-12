import { FC } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import ProfileImageUploader from '../../../../../components/profile-image';

interface BasicInfoStepProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  errors: any;
}

export const BasicInfoStep: FC<BasicInfoStepProps> = ({ formData, onChange, errors }) => {
  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h5" fontWeight={600} color="primary.main">
            Basic Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tell us about your clinic
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" mb={4}>
        <ProfileImageUploader
          image={formData.logo}
          setImage={(logo) => onChange('logo', logo)}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid>
          <TextField
            fullWidth
            label="Clinic Name"
            placeholder="Enter your clinic name"
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            placeholder="Brief description of your clinic"
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Email"
            type="email"
            placeholder="clinic@example.com"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Phone"
            placeholder="+1 234 567 8900"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Website"
            placeholder="https://www.yourclinic.com"
            value={formData.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};