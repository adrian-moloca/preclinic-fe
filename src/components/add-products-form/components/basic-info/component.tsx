import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Box
} from "@mui/material";
import { ProductType } from '../../../../providers/products/types';

const productTypes: { value: ProductType; label: string; }[] = [
  { value: 'medication', label: 'Medication' },
  { value: 'medical_equipment', label: 'Medical Equipment' },
  { value: 'consumables', label: 'Consumables' },
  { value: 'diagnostic_tools', label: 'Diagnostic Tools' },
  { value: 'surgical_instruments', label: 'Surgical Instruments' },
  { value: 'first_aid', label: 'First Aid' },
  { value: 'laboratory_supplies', label: 'Laboratory Supplies' }
];

interface ProductBasicInfoProps {
  formData: {
    type?: ProductType;
    name?: string;
    category?: string;
    manufacturer?: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Product Information
        </Typography>

        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid>
            <FormControl fullWidth sx={{ width: 250 }}>
              <Typography>Product Type</Typography>
              <Select
                value={formData.type}
                onChange={(e) => onInputChange('type', e.target.value)}
              >
                {productTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center">
                      <Typography>{type.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <Typography>Product Name</Typography>
            <TextField
              fullWidth
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <Typography>Category</Typography>
            <TextField
              fullWidth
              value={formData.category}
              onChange={(e) => onInputChange('category', e.target.value)}
              error={!!errors.category}
              helperText={errors.category}
              placeholder="e.g., Antibiotics, Pain Relief, etc."
              required
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <Typography>Manufacturer</Typography>
            <TextField
              fullWidth
              value={formData.manufacturer}
              onChange={(e) => onInputChange('manufacturer', e.target.value)}
              error={!!errors.manufacturer}
              helperText={errors.manufacturer}
              required
              sx={{ width: 250 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};