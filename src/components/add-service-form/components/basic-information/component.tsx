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
import { MedicalServices } from '@mui/icons-material';

interface Department {
  id: string;
  name: string;
  status: string;
}

interface ServiceBasicInfoProps {
  formData: {
    name: string;
    description: string;
    department: string;
  };
  errors: Record<string, string>;
  activeDepartments: Department[];
  onInputChange: (field: "name" | "price" | "duration" | "status" | "description" | "products" | "department") => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: unknown } }) => void;
}

export const ServiceBasicInfo: React.FC<ServiceBasicInfoProps> = ({
  formData,
  errors,
  activeDepartments,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <MedicalServices sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Service Information
          </Typography>
        </Box>
        
        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid>
            <TextField
              fullWidth
              label="Service Name"
              value={formData.name}
              onChange={onInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
              placeholder="e.g., General Consultation, X-Ray, Blood Test"
              sx={{ width: 300 }}
            />
          </Grid>

          <Grid>
            <FormControl fullWidth required error={!!errors.department} sx={{ width: 300 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={onInputChange('department')}
                label="Department"
              >
                {activeDepartments.length > 0 ? (
                  activeDepartments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No active departments available
                  </MenuItem>
                )}
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
              placeholder="Describe the service, what it includes, and any special instructions..."
              sx={{ width: 620 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};