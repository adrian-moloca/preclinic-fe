import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment
} from "@mui/material";
import { AttachMoney } from '@mui/icons-material';

interface ServicePricingDurationProps {
  formData: {
    price: number;
    duration: number;
    status: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: "name" | "price" | "duration" | "status" | "description" | "products" | "department") => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => void;
}

export const ServicePricingDuration: React.FC<ServicePricingDurationProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <AttachMoney sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Pricing & Duration
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <TextField
              fullWidth
              label="Service Price"
              type="number"
              value={formData.price === 0 ? '' : formData.price}
              onChange={onInputChange('price')}
              error={!!errors.price}
              helperText={errors.price}
              required
              placeholder="0.00"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
              sx={{ width: 300 }}
            />
          </Grid>

          <Grid>
            <TextField
              fullWidth
              label="Duration"
              type="number"
              value={formData.duration === 0 ? '' : formData.duration}
              onChange={onInputChange('duration')}
              error={!!errors.duration}
              helperText={errors.duration}
              required
              placeholder="30"
              InputProps={{
                endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                inputProps: { min: 1, step: 1 }
              }}
              sx={{ width: 300 }}
            />
          </Grid>

          <Grid>
            <FormControl fullWidth required error={!!errors.status} sx={{ width: 300 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={onInputChange('status')}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="maintenance">Under Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};