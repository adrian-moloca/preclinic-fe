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
  Grid
} from "@mui/material";
import { Business } from '@mui/icons-material';

interface DepartmentBasicInfoProps {
  formData: {
    name: string;
    description: string;
    status: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string) => (event: any) => void;
}

export const DepartmentBasicInfo: React.FC<DepartmentBasicInfoProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Business sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Department Information
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <TextField
              fullWidth
              label="Department Name"
              value={formData.name}
              onChange={onInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
              placeholder="e.g., Cardiology, Emergency, ICU"
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

          <Grid>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={onInputChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              required
              placeholder="Describe the department's role, services, and specialties..."
              sx={{ width: 620 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};