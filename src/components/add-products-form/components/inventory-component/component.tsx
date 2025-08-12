import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField
} from "@mui/material";
import { MeasurementUnit, ProductStatus } from '../../../../providers/products/types';

const measurementUnits: MeasurementUnit[] = [
  'pieces', 'bottles', 'boxes', 'vials', 'tubes', 'packs', 'units', 'ml', 'mg', 'g', 'kg'
];

const productStatuses: ProductStatus[] = ['active', 'discontinued', 'out_of_stock', 'expired'];

interface InventoryPricingProps {
  formData: {
    batchNumber?: string;
    expiryDate?: string;
    quantity?: number;
    unit?: MeasurementUnit;
    unitPrice?: number;
    status?: ProductStatus;
    barcode?: string;
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
          Inventory & Pricing
        </Typography>

        <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid>
            <Typography>Batch Number</Typography>
            <TextField
              fullWidth
              value={formData.batchNumber}
              onChange={(e) => onInputChange('batchNumber', e.target.value)}
              error={!!errors.batchNumber}
              helperText={errors.batchNumber}
              required
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <Typography>Expiry Date</Typography>
            <TextField
              fullWidth
              type="date"
              value={formData.expiryDate}
              onChange={(e) => onInputChange('expiryDate', e.target.value)}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              required
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <Typography>Quantity</Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.quantity === 0 ? '' : formData.quantity}
              onChange={(e) => onInputChange('quantity', parseInt(e.target.value) || 0)}
              error={!!errors.quantity}
              helperText={errors.quantity}
              placeholder="0"
              required
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <FormControl fullWidth sx={{ width: 250 }}>
              <Typography>Unit</Typography>
              <Select
                value={formData.unit}
                onChange={(e) => onInputChange('unit', e.target.value)}
              >
                {measurementUnits.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <Typography>Unit Price</Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.unitPrice === 0 ? '' : formData.unitPrice}
              onChange={(e) => onInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              error={!!errors.unitPrice}
              helperText={errors.unitPrice}
              placeholder="0.00"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
              required
              sx={{ width: 250 }}
            />
          </Grid>

          <Grid>
            <FormControl fullWidth sx={{ width: 250 }}>
              <Typography>Status</Typography>
              <Select
                value={formData.status}
                onChange={(e) => onInputChange('status', e.target.value)}
              >
                {productStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Typography>{status.replace('_', ' ').toUpperCase()}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid>
            <Typography>Barcode (Optional)</Typography>
            <TextField
              fullWidth
              value={formData.barcode}
              onChange={(e) => onInputChange('barcode', e.target.value)}
              sx={{ width: 250 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};