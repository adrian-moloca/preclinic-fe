import React, { FC, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { StockBatch, BatchStatus } from '../../providers/products/types';
import { useProductsContext } from '../../providers/products';

interface StockBatchFormProps {
  productId: string;
  onBatchAdded?: (batch: StockBatch) => void;
  onCancel?: () => void;
}

const batchStatuses: BatchStatus[] = ['active', 'expired', 'recalled', 'depleted'];

export const StockBatchForm: FC<StockBatchFormProps> = ({
  productId,
  onBatchAdded,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    batchNumber: '',
    expiryDate: '',
    quantity: 0,
    unitPrice: 0,
    status: 'active' as BatchStatus
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addStockBatch } = useProductsContext();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.batchNumber?.trim()) newErrors.batchNumber = 'Batch number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.unitPrice || formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newBatch: StockBatch = {
        id: uuidv4(),
        productId,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        receivedDate: new Date().toISOString(),
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addStockBatch(newBatch);
      
      if (onBatchAdded) {
        onBatchAdded(newBatch);
      }

      // Reset form
      setFormData({
        batchNumber: '',
        expiryDate: '',
        quantity: 0,
        unitPrice: 0,
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating stock batch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Add New Stock Batch
        </Typography>

        <Grid container spacing={3}>
          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Batch Number
            </Typography>
            <TextField
              fullWidth
              value={formData.batchNumber}
              onChange={(e) => handleInputChange('batchNumber', e.target.value)}
              error={!!errors.batchNumber}
              helperText={errors.batchNumber}
              required
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Expiry Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Quantity
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.quantity === 0 ? '' : formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              error={!!errors.quantity}
              helperText={errors.quantity}
              required
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Unit Price
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={formData.unitPrice === 0 ? '' : formData.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              error={!!errors.unitPrice}
              helperText={errors.unitPrice}
              required
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                inputProps: { step: "0.01" }
              }}
            />
          </Grid>

          <Grid>
            <Typography variant="subtitle2" gutterBottom>
              Status
            </Typography>
            <FormControl fullWidth>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {batchStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Stock Batch'}
          </Button>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};