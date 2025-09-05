import { FC } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
  Divider,
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
            Let's start with the basic details of your clinic
          </Typography>
        </Box>
      </Box>

      {/* Logo Upload Section */}
      <Box mb={4} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="subtitle1" fontWeight={500} mb={2}>
          Clinic Logo
        </Typography>
        <ProfileImageUploader
          image={formData.logo || ''}
          setImage={(logo) => onChange('logo', logo)}
        />
        <Typography variant="caption" color="text.secondary" mt={1}>
          Upload your clinic's logo (recommended: 200x200px)
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

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
            label="Description"
            placeholder="Brief description of your clinic"
            rows={3}
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>

        <Grid>
          <TextField
            fullWidth
            label="Email"
            placeholder="clinic@example.com"
            type="email"
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
            placeholder="+40 123 456 789"
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
            placeholder="https://your-clinic.com"
            value={formData.website || ''}
            onChange={(e) => onChange('website', e.target.value)}
            error={!!errors.website}
            helperText={errors.website}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};