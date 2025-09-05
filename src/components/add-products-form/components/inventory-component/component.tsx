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
  Box,
  Alert
} from "@mui/material";
import { MeasurementUnit } from '../../../../providers/products/types';

const measurementUnits: MeasurementUnit[] = [
  'pieces', 'bottles', 'boxes', 'vials', 'tubes', 'packs', 'units', 'ml', 'mg', 'g', 'kg'
];

interface InventoryPricingProps {
  formData: {
    batchNumber?: string;
    expiryDate?: string;
    quantity?: number;
    unit?: MeasurementUnit;
    unitPrice?: number;
    barcode?: string;
    // Removed status from here since it's not needed for this component
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: any) => void;
}

export const InventoryPricing: React.FC<InventoryPricingProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Stock Batch Information
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            This section defines the specific batch/lot details for this stock entry. 
            Each batch will be tracked separately for inventory management.
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Batch Number *
            </Typography>
            <TextField
              fullWidth
              value={formData.batchNumber || ''}
              onChange={(e) => onInputChange('batchNumber', e.target.value)}
              error={!!errors.batchNumber}
              helperText={errors.batchNumber || 'Unique identifier for this batch'}
              required
              placeholder="e.g., LOT2024001"
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Expiry Date *
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={formData.expiryDate || ''}
              onChange={(e) => onInputChange('expiryDate', e.target.value)}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate || 'When this batch expires'}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Quantity *
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.quantity === 0 ? '' : formData.quantity || ''}
              onChange={(e) => onInputChange('quantity', parseInt(e.target.value) || 0)}
              error={!!errors.quantity}
              helperText={errors.quantity || 'Number of units in this batch'}
              placeholder="0"
              required
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Unit of Measurement *
            </Typography>
            <FormControl fullWidth error={!!errors.unit}>
              <Select
                value={formData.unit || 'pieces'}
                onChange={(e) => onInputChange('unit', e.target.value)}
                displayEmpty
              >
                {measurementUnits.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              {errors.unit && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.unit}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Unit Price *
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.unitPrice === 0 ? '' : formData.unitPrice || ''}
              onChange={(e) => onInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              error={!!errors.unitPrice}
              helperText={errors.unitPrice || 'Price per unit for this batch'}
              placeholder="0.00"
              required
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />
          </Grid>

          {formData.barcode !== undefined && (
            <Grid>
              <Typography variant="subtitle2" gutterBottom>
                Barcode (Optional)
              </Typography>
              <TextField
                fullWidth
                value={formData.barcode || ''}
                onChange={(e) => onInputChange('barcode', e.target.value)}
                placeholder="Scan or enter barcode"
                helperText="Product barcode for quick identification"
              />
            </Grid>
          )}
        </Grid>

        {formData.quantity && formData.unitPrice && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Batch Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Total Units
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formData.quantity} {formData.unit || 'units'}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Unit Price
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  ${(formData.unitPrice || 0).toFixed(2)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Batch Value
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary.main">
                  ${((formData.quantity || 0) * (formData.unitPrice || 0)).toFixed(2)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="caption" color="text.secondary">
                  Expiry
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : 'Not set'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};